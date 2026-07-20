import {
  convertGregorianDayForCalendar,
  convertHijriDayForCalendar,
  getHijriMonthDays,
  ISLAMIC_MONTH_NAMES_AR,
} from '@/lib/date-adapter';

const GREGORIAN_MIN_YEAR = 1924;
const GREGORIAN_MAX_YEAR = 2077;

export function isSupportedBirthDate(dateObj) {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return false;
  const year = dateObj.getFullYear();
  return year >= GREGORIAN_MIN_YEAR && year <= GREGORIAN_MAX_YEAR;
}

export function getHijriMonthName(month) {
  return ISLAMIC_MONTH_NAMES_AR[month - 1] || '';
}

function clampHijriDay(year, month, day) {
  return Math.min(day, getHijriMonthDays(year, month));
}

function hijriDayOfYear(year, month, day) {
  let total = day;
  for (let m = 1; m < month; m += 1) {
    total += getHijriMonthDays(year, m);
  }
  return total;
}

function hijriYearLength(year) {
  let total = 0;
  for (let m = 1; m <= 12; m += 1) total += getHijriMonthDays(year, m);
  return total;
}

// Calendar-accurate Hijri y/m/d difference (not average-division approximation).
function diffHijriYmd(from, to) {
  let years = to.year - from.year;
  let months = to.month - from.month;
  let days = to.day - from.day;

  if (days < 0) {
    months -= 1;
    let borrowMonth = to.month - 1;
    let borrowYear = to.year;
    if (borrowMonth < 1) {
      borrowMonth = 12;
      borrowYear -= 1;
    }
    days += getHijriMonthDays(borrowYear, borrowMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function diffGregorianYmd(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const borrowMonthDate = new Date(to.getFullYear(), to.getMonth(), 0);
    days += borrowMonthDate.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/**
 * Given a Gregorian birth date, compute the Hijri birth date, calendar-accurate
 * Hijri age, Gregorian age, and the next upcoming Hijri-calendar birthday.
 *
 * @param {string} birthDateIso - "YYYY-MM-DD"
 * @param {Date} [now]
 */
export function computeHijriBirthdaySnapshot(birthDateIso, now = new Date()) {
  const [by, bm, bd] = String(birthDateIso).split('-').map(Number);
  if (!by || !bm || !bd) return null;

  const birthDate = new Date(by, bm - 1, bd);
  if (!isSupportedBirthDate(birthDate)) return null;
  if (birthDate.getTime() > now.getTime()) return null;

  const birthHijri = convertGregorianDayForCalendar(by, bm, bd);
  const todayHijri = convertGregorianDayForCalendar(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  const ageHijri = diffHijriYmd(
    { year: birthHijri.year, month: birthHijri.month, day: birthHijri.day },
    { year: todayHijri.year, month: todayHijri.month, day: todayHijri.day },
  );
  const ageGregorian = diffGregorianYmd(birthDate, now);

  let nextYear = todayHijri.year;
  const computeGregorianFor = (hijriYear) => {
    const day = clampHijriDay(hijriYear, birthHijri.month, birthHijri.day);
    const greg = convertHijriDayForCalendar(hijriYear, birthHijri.month, day);
    return new Date(greg.year, greg.month - 1, greg.day);
  };

  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let nextBirthdayGregorian = computeGregorianFor(nextYear);
  if (nextBirthdayGregorian.getTime() < todayMidnight.getTime()) {
    nextYear += 1;
    nextBirthdayGregorian = computeGregorianFor(nextYear);
  }
  const daysUntilNextHijriBirthday = Math.round(
    (nextBirthdayGregorian.getTime() - todayMidnight.getTime()) / 86400000,
  );

  return {
    birthHijri,
    todayHijri,
    ageHijri,
    ageGregorian,
    nextHijriBirthdayYear: nextYear,
    nextHijriBirthdayGregorian: nextBirthdayGregorian,
    daysUntilNextHijriBirthday,
  };
}

/**
 * Find Islamic-calendar events sharing the exact Hijri month+day, or — if none
 * do — the single nearest one by cyclic day-distance within the Hijri year.
 *
 * @param {number} hijriMonth
 * @param {number} hijriDay
 * @param {Array<{slug:string,name:string,hijriMonth:number,hijriDay:number}>} eventsCatalog
 * @param {number} referenceHijriYear - used only for month-length lookups
 */
export function findHijriDayMatches(hijriMonth, hijriDay, eventsCatalog, referenceHijriYear) {
  const catalog = Array.isArray(eventsCatalog) ? eventsCatalog : [];
  const exact = catalog.filter(
    (e) => e.hijriMonth === hijriMonth && e.hijriDay === hijriDay,
  );
  if (exact.length > 0) {
    return { exact, nearest: null };
  }

  const yearLength = hijriYearLength(referenceHijriYear);
  const targetOrdinal = hijriDayOfYear(referenceHijriYear, hijriMonth, hijriDay);

  let best = null;
  for (const event of catalog) {
    if (!event.hijriMonth || !event.hijriDay) continue;
    const eventOrdinal = hijriDayOfYear(referenceHijriYear, event.hijriMonth, event.hijriDay);
    let diff = eventOrdinal - targetOrdinal;
    if (diff > yearLength / 2) diff -= yearLength;
    if (diff < -yearLength / 2) diff += yearLength;
    const absDiff = Math.abs(diff);
    if (!best || absDiff < best.absDiff) {
      best = { event, diff, absDiff };
    }
  }

  if (!best) return { exact: [], nearest: null };
  return {
    exact: [],
    nearest: {
      event: best.event,
      daysAway: best.absDiff,
      direction: best.diff >= 0 ? 'after' : 'before',
    },
  };
}
