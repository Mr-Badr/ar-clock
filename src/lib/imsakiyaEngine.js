/**
 * lib/imsakiyaEngine.js
 *
 * Generates a full Ramadan imsakiya (suhoor/iftar table) for a given city.
 * Uses convertDate (hijri↔gregorian) and calculatePrayerTimes (Adhan.js).
 *
 * All times returned as ISO strings. City data must include { lat, lon, timezone, country_code }.
 */

import { convertDate } from '@/lib/date-adapter';
import { calculatePrayerTimes } from '@/lib/prayerEngine';

const HIJRI_MONTHS_AR = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/**
 * Find the Hijri year whose Ramadan is upcoming (or current).
 * Today is 2026-06-24 → Hijri ~1447-12-29, so next Ramadan = 1448.
 */
export function getUpcomingRamadanHijriYear(referenceDate = new Date()) {
  const hijri = convertDate({ date: referenceDate, toCalendar: 'hijri' });
  // Past Ramadan (month > 9) → show next year's Ramadan
  // In Ramadan (month 9) or before → show current year
  return hijri.month > 9 ? hijri.year + 1 : hijri.year;
}

/**
 * Get the Gregorian start date for Ramadan of a given Hijri year.
 * Returns { year, month, day } (Gregorian).
 */
export function getRamadanGregorianStart(hijriYear) {
  return convertDate({
    date: `${hijriYear}-09-01`,
    toCalendar: 'gregorian',
  });
}

/**
 * Get the number of days in Ramadan for a given Hijri year (29 or 30).
 * Uses Umalqura calendar — same source as the rest of the app.
 */
export function getRamadanDayCount(hijriYear) {
  // Ramadan is month 9. Check day 30: if it converts cleanly, it's 30 days, else 29.
  try {
    const lastDay = convertDate({ date: `${hijriYear}-09-30`, toCalendar: 'gregorian' });
    return lastDay ? 30 : 29;
  } catch {
    return 29;
  }
}

/**
 * Format an ISO time string into HH:MM Arabic time in the city's timezone.
 */
export function formatTimeAr(isoString, timezone) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('ar-SA-u-nu-latn', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format an ISO time string into HH:MM (12h) in the city's timezone.
 */
export function formatTime12h(isoString, timezone) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('ar-SA-u-nu-latn', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Compute fasting duration in hours and minutes between fajr and maghrib.
 */
export function fastingDuration(fajrIso, maghribIso) {
  if (!fajrIso || !maghribIso) return '—';
  const diff = (new Date(maghribIso) - new Date(fajrIso)) / 1000 / 60;
  const h = Math.floor(diff / 60);
  const m = Math.round(diff % 60);
  return `${h}س ${m > 0 ? m + 'د' : ''}`.trim();
}

/**
 * Generate the full imsakiya for a city.
 *
 * @param {object} city - { lat, lon, timezone, country_code }
 * @param {number} [hijriYear] - Hijri year to use; defaults to upcoming Ramadan year
 * @returns {{ hijriYear, ramadanStart, dayCount, days: Array }}
 */
export function generateImsakiya(city, hijriYear) {
  const resolvedHijriYear = hijriYear ?? getUpcomingRamadanHijriYear();
  const ramadanStart = getRamadanGregorianStart(resolvedHijriYear);
  const dayCount = getRamadanDayCount(resolvedHijriYear);

  // Build a JS Date for day 1 of Ramadan (noon UTC — timezone-safe)
  const startDate = new Date(Date.UTC(ramadanStart.year, ramadanStart.month - 1, ramadanStart.day, 12, 0, 0));

  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);
    const times = calculatePrayerTimes({
      lat: city.lat,
      lon: city.lon,
      timezone: city.timezone,
      date,
      countryCode: city.country_code,
      cacheKey: `imsakiya::${city.lat}::${city.lon}::${date.toISOString().slice(0, 10)}`,
    });

    const gregDay = new Date(Date.UTC(ramadanStart.year, ramadanStart.month - 1, ramadanStart.day + i, 12, 0, 0));

    days.push({
      ramadanDay: i + 1,        // 1–30
      hijriDay: i + 1,          // same as ramadanDay within Ramadan
      hijriMonth: 9,
      hijriYear: resolvedHijriYear,
      gregYear: gregDay.getUTCFullYear(),
      gregMonth: gregDay.getUTCMonth() + 1,
      gregDay: gregDay.getUTCDate(),
      weekdayAr: DAYS_AR[gregDay.getUTCDay()],
      fajrIso: times?.fajr ?? null,
      maghribIso: times?.maghrib ?? null,
      suhoorAr: times?.fajr ? formatTimeAr(times.fajr, city.timezone) : '—',
      iftarAr: times?.maghrib ? formatTimeAr(times.maghrib, city.timezone) : '—',
      fastingHours: fastingDuration(times?.fajr, times?.maghrib),
    });
  }

  return {
    hijriYear: resolvedHijriYear,
    gregYear: ramadanStart.year,
    ramadanStart,
    dayCount,
    days,
  };
}

export const GREGORIAN_MONTHS_AR = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
