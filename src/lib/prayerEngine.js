/**
 * lib/prayerEngine.js
 *
 * Server-side prayer time calculation using Adhan.js.
 * Returns ISO strings (not Date objects) so results are safely serializable/cacheable.
 *
 * CACHING:
 * - Module-level Map caches results per "citySlug+date" key for the lifetime of the server process.
 * - For true edge/CDN caching, wrap with Redis or use Next.js `unstable_cache`.
 * - Extend to Redis by replacing `moduleCache` with `redis.get/set` calls.
 *
 * METHODS: Adhan.js supports:
 *   MuslimWorldLeague, Egyptian, Karachi, UmmAlQura, Dubai, Qatar, Kuwait,
 *   MoonsightingCommittee, NorthAmerica, Singapore, Turkey, Tehran, Gulf
 */

import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';

// Module-level cache (survives warm lambdas; flushed on cold start)
const moduleCache = new Map();

/**
 * Calculate prayer times for a given location and date.
 *
 * @param {object} opts
 * @param {number} opts.lat
 * @param {number} opts.lon
 * @param {string} opts.timezone    - IANA timezone string e.g. "Asia/Riyadh"
 * @param {Date}   opts.date        - JS Date (usually new Date())
 * @param {string} [opts.method]    - Adhan calculation method name
 * @param {string} [opts.cacheKey]  - Optional key for module cache (e.g. city slug)
 * @returns {object|null} - { fajr, sunrise, dhuhr, asr, maghrib, isha } as ISO strings, or null on error
 */
export function calculatePrayerTimes({ lat, lon, timezone, date, method = 'MuslimWorldLeague', cacheKey }) {
  // Build cache key: citySlug + YYYY-MM-DD
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD
  const key = `${cacheKey || `${lat},${lon}`}::${dateStr}`;

  if (moduleCache.has(key)) {
    return moduleCache.get(key);
  }

  try {
    const coordinates = new Coordinates(lat, lon);

    // Derive the *local* date in the city's timezone
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric'
    }).formatToParts(date);

    const localDate = new Date(
      parseInt(parts.find(p => p.type === 'year').value),
      parseInt(parts.find(p => p.type === 'month').value) - 1, // 0-indexed
      parseInt(parts.find(p => p.type === 'day').value)
    );

    const params = CalculationMethod[method]
      ? CalculationMethod[method]()
      : CalculationMethod.MuslimWorldLeague();

    const pt = new PrayerTimes(coordinates, localDate, params);

    const result = {
      fajr: pt.fajr.toISOString(),
      sunrise: pt.sunrise.toISOString(),
      dhuhr: pt.dhuhr.toISOString(),
      asr: pt.asr.toISOString(),
      maghrib: pt.maghrib.toISOString(),
      isha: pt.isha.toISOString(),
    };

    // Cache for the rest of the process lifetime
    moduleCache.set(key, result);
    return result;
  } catch (err) {
    console.error('[prayerEngine] Calculation failed:', err.message);
    return null;
  }
}

/**
 * Format an ISO time string into a localised HH:MM display.
 */
export function formatTime(isoString, timezone, hour12 = false) {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  });
}

/**
 * Given current time and prayer times, determine the next prayer key + ISO AND the previous prayer ISO.
 * This allows for accurate progress percentage calculation: (now - prev) / (next - prev).
 */
export function getNextPrayer(times, nowIso) {
  const now = new Date(nowIso).getTime();
  const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  // Convert all to timestamps for easy comparison
  const list = PRAYER_KEYS.map(key => ({
    key,
    time: new Date(times[key]).getTime()
  })).sort((a, b) => a.time - b.time);

  let nextIndex = list.findIndex(item => item.time > now);

  let nextKey, nextIso, prevIso;

  if (nextIndex === -1) {
    // All prayers today have passed. Next is tomorrow's Fajr. Previous was today's Isha.
    nextKey = 'fajr';
    // Heuristic: tomorrow's Fajr is today's + 24h. 
    // For extreme precision, we'd recalcluate for tomorrow's date, but +24h is standard for UI rings.
    nextIso = new Date(list[0].time + 86400000).toISOString();
    prevIso = new Date(list[list.length - 1].time).toISOString();
  } else if (nextIndex === 0) {
    // We are before Fajr today. Next is today's Fajr. Previous was yesterday's Isha.
    nextKey = 'fajr';
    nextIso = new Date(list[0].time).toISOString();
    prevIso = new Date(list[list.length - 1].time - 86400000).toISOString();
  } else {
    // Normal case: between two prayers today.
    nextKey = list[nextIndex].key;
    nextIso = new Date(list[nextIndex].time).toISOString();
    prevIso = new Date(list[nextIndex - 1].time).toISOString();
  }

  return { nextKey, nextIso, prevIso };
}
