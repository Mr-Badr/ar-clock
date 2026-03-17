/**
 * lib/prayerEngine.js
 *
 * Server-side prayer time calculation using Adhan.js.
 * Returns ISO strings (not Date objects) — safely serializable and cacheable.
 *
 * MADHAB (مذهب) impact on Asr only:
 *  Shafi  → Asr when shadow = 1× object height  (Shafi, Maliki, Hanbali — default)
 *  Hanafi → Asr when shadow = 2× object height  (Hanafi — typically 45-90 min later)
 *
 * VALID Adhan.js CalculationMethod names:
 *   MuslimWorldLeague, Egyptian, Karachi, UmmAlQura, Dubai, Qatar, Kuwait,
 *   MoonsightingCommittee, NorthAmerica, Singapore, Turkey, Tehran
 *
 * NOTE: 'Gulf' is NOT a valid method name in Adhan.js — use 'Dubai' for Gulf-region countries.
 */

import { PrayerTimes, Coordinates, CalculationMethod, Madhab, PolarCircleResolution, HighLatitudeRule } from 'adhan';
import { getMethodByCountry, MADHAB_INFO } from './prayer-methods';

// Module-level cache (survives warm lambdas; flushed on cold start).
// Capped at MAX_CACHE_SIZE entries to prevent unbounded memory growth on long-running instances.
const moduleCache   = new Map();
const MAX_CACHE_SIZE = 500;

function getLocalDateForCity(date, timezone) {
  // Extract year/month/day AS SEEN in the city's timezone
  const fmt = new Intl.DateTimeFormat('en-CA', {  // en-CA = YYYY-MM-DD format
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const [year, month, day] = fmt.format(date).split('-').map(Number);
  // Return a plain Date with correct y/m/d — time portion is irrelevant to adhan.js
  return new Date(year, month - 1, day);
}

/**
 * Calculate prayer times for a given location and date.
 *
 * @param {object} opts
 * @param {number} opts.lat
 * @param {number} opts.lon
 * @param {string} opts.timezone       - IANA timezone string e.g. "Asia/Riyadh"
 * @param {Date}   opts.date           - JS Date (usually new Date())
 * @param {string} [opts.method]       - Adhan.js CalculationMethod name (overrides country auto-detect)
 * @param {string} [opts.countryCode]  - ISO 3166-1 alpha-2 used to auto-detect method + madhab
 * @param {string} [opts.madhab]       - 'Shafi'|'Maliki'|'Hanbali' (default) | 'Hanafi' — affects only Asr time
 * @param {string} [opts.cacheKey]     - Optional stable key for the cache (e.g. city slug)
 * @returns {object|null} { fajr, sunrise, dhuhr, asr, maghrib, isha } as ISO strings, or null on error
 */
export function calculatePrayerTimes({ lat, lon, timezone, date, method, countryCode, madhab, cacheKey }) {
  // Resolve calculation method
  const countryInfo    = countryCode ? getMethodByCountry(countryCode) : null;
  const selectedMethod = method || countryInfo?.name || 'MuslimWorldLeague';

  // Resolve madhab: explicit > country school > country defaultMadhab > Shafi.
  // All 4 Sunni madhabs accepted: 'Shafi' | 'Maliki' | 'Hanbali' | 'Hanafi'.
  // Maliki and Hanbali map to computesAs:'Shafi' — this is fiqh-accurate, not a workaround.
  // Shadow × 1 for Asr is the ruling for all three; only Hanafi uses shadow × 2.
  const rawMadhab      = madhab || countryInfo?.school || countryInfo?.defaultMadhab || 'Shafi';
  const schoolInfo     = MADHAB_INFO[rawMadhab];
  const selectedMadhab = schoolInfo?.computesAs ?? 'Shafi';  // always 'Shafi'|'Hanafi' for Adhan.js

  // Build cache key — includes madhab so Shafi/Hanafi results are stored separately
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD
  const key     = `${cacheKey || `${lat},${lon}`}::${dateStr}::${selectedMethod}::${selectedMadhab}`;

  if (moduleCache.has(key)) {
    return moduleCache.get(key);
  }

  try {
    const coordinates = new Coordinates(lat, lon);
    const localDate = getLocalDateForCity(date, timezone);

    // Guard against an invalid method name — fall back to MWL instead of crashing
    const params = CalculationMethod[selectedMethod]
      ? CalculationMethod[selectedMethod]()
      : CalculationMethod.MuslimWorldLeague();

    // Apply madhab — only changes Asr calculation
    params.madhab = selectedMadhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

    if (Math.abs(lat) >= 48) {
      params.polarCircleResolution = PolarCircleResolution.AqrabYaum;
      params.highLatitudeRule = HighLatitudeRule.recommended(new Coordinates(lat, 0));
    }

    const pt = new PrayerTimes(coordinates, localDate, params);

    const result = {
      fajr:    pt.fajr.toISOString(),
      sunrise: pt.sunrise.toISOString(),
      dhuhr:   pt.dhuhr.toISOString(),
      asr:     pt.asr.toISOString(),
      maghrib: pt.maghrib.toISOString(),
      isha:    pt.isha.toISOString(),
      // Expose what was actually used — useful for UI transparency / debug
      _method: selectedMethod,
      _madhab: selectedMadhab,
    };

    // Evict oldest entry when the cache is full
    if (moduleCache.size >= MAX_CACHE_SIZE) {
      moduleCache.delete(moduleCache.keys().next().value);
    }
    moduleCache.set(key, result);
    return result;

  } catch (err) {
    console.error('[prayerEngine] Calculation failed:', err.message);
    return null;
  }
}

/**
 * Calculate BOTH Shafi and Hanafi Asr times for the same location.
 * Used by the MadhabSelector comparison UI to show the difference side-by-side.
 *
 * @returns {{ shafiAsr: string|null, hanafiAsr: string|null }} ISO strings
 */
export function calculateAsrComparison({ lat, lon, timezone, date, method, countryCode, cacheKey }) {
  const baseKey      = cacheKey || `${lat},${lon}`;
  const shafiResult  = calculatePrayerTimes({ lat, lon, timezone, date, method, countryCode, madhab: 'Shafi',  cacheKey: `${baseKey}::cmp` });
  const hanafiResult = calculatePrayerTimes({ lat, lon, timezone, date, method, countryCode, madhab: 'Hanafi', cacheKey: `${baseKey}::cmp` });
  return {
    shafiAsr:  shafiResult?.asr  ?? null,
    hanafiAsr: hanafiResult?.asr ?? null,
  };
}

/**
 * Format an ISO time string into a localised HH:MM display.
 *
 * @param {string}  isoString - ISO 8601 datetime string
 * @param {string}  timezone  - IANA timezone (e.g. 'Asia/Riyadh')
 * @param {boolean} [hour12]  - 12-hour clock (default: false → 24-hour)
 * @param {string}  [locale]  - BCP 47 locale tag (default: 'en-US').
 *                              Pass 'ar-SA' for Arabic-Indic numerals (٠١٢٣...).
 *                              Pass 'ar-MA' for Eastern Arabic with French conventions (Maghreb).
 * @returns {string}
 */
export function formatTime(isoString, timezone, hour12 = false, locale = 'en-US') {
  return new Date(isoString).toLocaleTimeString(locale, {
    timeZone: timezone,
    hour:     '2-digit',
    minute:   '2-digit',
    hour12,
  });
}

/**
 * Given the current time and today's prayer times, find:
 *   - The next prayer name + its ISO datetime
 *   - The previous prayer ISO datetime (for countdown baseline)
 *
 * Sunrise is intentionally excluded from the prayer rotation.
 *
 * @param {{ fajr:string, dhuhr:string, asr:string, maghrib:string, isha:string }} times
 * @param {string} nowIso - Current time as ISO string
 * @returns {{ nextKey: string, nextIso: string, prevIso: string }}
 */
export function getNextPrayer(times, nowIso) {
  const now         = new Date(nowIso).getTime();
  const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']; // sunrise excluded intentionally

  const list = PRAYER_KEYS
    .map(key => ({ key, time: new Date(times[key]).getTime() }))
    .sort((a, b) => a.time - b.time);

  const nextIndex = list.findIndex(item => item.time > now);

  let nextKey, nextIso, prevIso;

  if (nextIndex === -1) {
    // Past all prayers for today — next prayer is tomorrow's Fajr
    nextKey = 'fajr';
    nextIso = new Date(list[0].time + 86_400_000).toISOString();
    prevIso = new Date(list[list.length - 1].time).toISOString();
  } else if (nextIndex === 0) {
    // Before today's Fajr — previous prayer is yesterday's Isha
    nextKey = 'fajr';
    nextIso = new Date(list[0].time).toISOString();
    prevIso = new Date(list[list.length - 1].time - 86_400_000).toISOString();
  } else {
    nextKey = list[nextIndex].key;
    nextIso = new Date(list[nextIndex].time).toISOString();
    prevIso = new Date(list[nextIndex - 1].time).toISOString();
  }

  return { nextKey, nextIso, prevIso };
}