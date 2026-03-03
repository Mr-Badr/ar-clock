import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';

/**
 * Calculates prayer times purely server-side.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date} date - Date object for the calculation
 * @param {string} timezone - Target timezone (e.g., 'Asia/Riyadh')
 * @param {string} method - Adhan.js CalculationMethod key
 */
export function getPrayerTimes(lat, lon, date, timezone, method = 'MuslimWorldLeague') {
  // @TODO: Integrate Redis or Vercel Data Cache here for high-traffic apps
  // to avoid re-calculating identical parameter sets repeatedly on edge nodes.

  try {
    const coordinates = new Coordinates(lat, lon);

    // Extract year, month, day strictly in the target timezone to ensure we calculate
    // for the *local* day of the city, not the server's UTC day.
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    const tzDate = new Date(
      parseInt(parts.find(p => p.type === 'year')?.value || date.getFullYear().toString()),
      parseInt(parts.find(p => p.type === 'month')?.value || (date.getMonth() + 1).toString()) - 1,
      parseInt(parts.find(p => p.type === 'day')?.value || date.getDate().toString())
    );

    // Select accurate calculation method parameters
    const params = CalculationMethod[method] ? CalculationMethod[method]() : CalculationMethod.MuslimWorldLeague();

    const prayerTimes = new PrayerTimes(coordinates, tzDate, params);

    // Return the calculated times. We keep sunrise mapped solely for the UI list.
    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    };
  } catch (error) {
    console.error('Adhan.js failed, falling back to AlAdhan API', error);
    return null;
  }
}

/**
 * Fallback to AlAdhan REST API if library calculations are insufficient or missing.
 */
export async function fetchPrayerFromAlAdhan(lat, lon, timezone) {
  // Uses Next.js 16 fetch caching natively (Next.js Data Cache)
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `http://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=2`;

  // Revalidate fetch block every 24 hours 
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error('Failed to fetch from AlAdhan API');

  const data = await res.json();
  return data.data.timings;
}
