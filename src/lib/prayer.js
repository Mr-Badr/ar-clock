/**
 * lib/prayer.js
 *
 * Lightweight prayer time helpers.
 *
 * getPrayerTimes()       — Adhan.js local calculation (primary, fast, offline)
 * fetchPrayerFromAlAdhan() — REST API fallback (requires network, used when Adhan.js fails)
 *
 * Both functions return ISO strings to stay consistent with prayerEngine.js.
 * Never return raw Date objects — they are not serializable across server/client boundaries.
 */

import { PrayerTimes, Coordinates, CalculationMethod, Madhab } from 'adhan';

/**
 * AlAdhan API method numbers keyed by Adhan.js CalculationMethod name.
 * Reference: https://aladhan.com/prayer-times-api#GetTimings
 */
const ALADHAN_METHOD_MAP = {
  Karachi:               1,
  NorthAmerica:          2,
  MuslimWorldLeague:     3,
  UmmAlQura:             4,
  Egyptian:              5,
  Tehran:                7,
  Kuwait:                9,
  Qatar:                10,
  Singapore:            11,
  Turkey:               13,
  MoonsightingCommittee: 15,
  Dubai:                16,
};

/**
 * Calculates prayer times using Adhan.js (server-side, no network required).
 * Returns ISO strings for safe serialization.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {Date}   date
 * @param {string} timezone  - IANA timezone string (e.g. 'Asia/Riyadh')
 * @param {string} [method]  - Adhan.js CalculationMethod key (default: 'MuslimWorldLeague')
 * @param {string} [madhab]  - 'Shafi' (default) | 'Hanafi' — affects Asr time only
 * @returns {{ fajr, sunrise, dhuhr, asr, maghrib, isha } | null}  ISO strings or null on error
 */
export function getPrayerTimes(lat, lon, date, timezone, method = 'MuslimWorldLeague', madhab = 'Shafi') {
  try {
    const coordinates = new Coordinates(lat, lon);

    // Derive the local date in the city's timezone — avoids off-by-one at midnight UTC
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year:     'numeric',
      month:    'numeric',
      day:      'numeric',
    });

    const parts   = formatter.formatToParts(date);
    const tzDate  = new Date(
      parseInt(parts.find(p => p.type === 'year')?.value  ?? date.getFullYear()),
      parseInt(parts.find(p => p.type === 'month')?.value ?? (date.getMonth() + 1)) - 1,
      parseInt(parts.find(p => p.type === 'day')?.value   ?? date.getDate()),
    );

    // Guard against unknown method names — fall back to MWL
    const params = CalculationMethod[method]
      ? CalculationMethod[method]()
      : CalculationMethod.MuslimWorldLeague();

    // Apply madhab — Maliki/Hanbali use the same formula as Shafi in Adhan.js
    params.madhab = madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

    const pt = new PrayerTimes(coordinates, tzDate, params);

    // Return ISO strings — consistent with prayerEngine.js, safe across server/client boundary
    return {
      fajr:    pt.fajr.toISOString(),
      sunrise: pt.sunrise.toISOString(),
      dhuhr:   pt.dhuhr.toISOString(),
      asr:     pt.asr.toISOString(),
      maghrib: pt.maghrib.toISOString(),
      isha:    pt.isha.toISOString(),
    };
  } catch (error) {
    console.error('[prayer] Adhan.js calculation failed, falling back to AlAdhan API:', error.message);
    return null;
  }
}

/**
 * Fallback to AlAdhan REST API if the local Adhan.js calculation fails.
 * Uses Next.js Data Cache (revalidate: 86400) to avoid redundant API calls.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {string} timezone - IANA timezone string (e.g. 'Asia/Riyadh')
 * @param {string} [method] - Adhan.js method name, automatically mapped to AlAdhan method number
 * @returns {Promise<object>} Raw timings object from AlAdhan (string times like "05:12")
 */
export async function fetchPrayerFromAlAdhan(lat, lon, timezone, method = 'MuslimWorldLeague') {
  // Map the Adhan.js method name to the correct AlAdhan API method number.
  // FIX: was hardcoded to method=2 (ISNA) regardless of country — now uses the correct method.
  const methodNumber = ALADHAN_METHOD_MAP[method] ?? ALADHAN_METHOD_MAP.MuslimWorldLeague;

  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=${methodNumber}&timezonestring=${encodeURIComponent(timezone)}`;

  const res = await fetch(url, {
    next: { revalidate: 86_400 }, // Next.js Data Cache — revalidate every 24 hours
  });

  if (!res.ok) throw new Error(`AlAdhan API error: ${res.status} ${res.statusText}`);

  const data = await res.json();
  return data.data.timings;
}