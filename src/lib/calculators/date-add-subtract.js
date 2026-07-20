import {
  convertGregorianDayForCalendar,
  convertHijriDayForCalendar,
  getHijriMonthDays,
  ISLAMIC_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_AR,
  DAY_NAMES_AR,
} from '@/lib/date-adapter';

const GREGORIAN_MIN_YEAR = 1924;
const GREGORIAN_MAX_YEAR = 2077;
const HIJRI_MIN_YEAR = 1343;
const HIJRI_MAX_YEAR = 1500;

export function isSupportedGregorianDate(year, month, day) {
  return (
    Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
    && year >= GREGORIAN_MIN_YEAR && year <= GREGORIAN_MAX_YEAR
    && month >= 1 && month <= 12 && day >= 1 && day <= 31
  );
}

export function isSupportedHijriDate(year, month, day) {
  return (
    Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
    && year >= HIJRI_MIN_YEAR && year <= HIJRI_MAX_YEAR
    && month >= 1 && month <= 12 && day >= 1 && day <= 30
  );
}

function clampHijriDay(year, month, day) {
  return Math.min(day, getHijriMonthDays(year, month));
}

function addHijriMonths(year, month, day, monthsToAdd) {
  const totalMonthIndex = (month - 1) + monthsToAdd;
  const newYear = year + Math.floor(totalMonthIndex / 12);
  const newMonth = (((totalMonthIndex % 12) + 12) % 12) + 1;
  const newDay = clampHijriDay(newYear, newMonth, day);
  return { year: newYear, month: newMonth, day: newDay };
}

function addGregorianMonths(year, month, day, monthsToAdd) {
  const totalMonthIndex = (month - 1) + monthsToAdd;
  const newYear = year + Math.floor(totalMonthIndex / 12);
  const newMonth = (((totalMonthIndex % 12) + 12) % 12) + 1;
  const daysInMonth = new Date(newYear, newMonth, 0).getDate();
  const newDay = Math.min(day, daysInMonth);
  return { year: newYear, month: newMonth, day: newDay };
}

/**
 * Adds/subtracts a number of days/weeks/months/years from a date entered in
 * either calendar, returning the result in BOTH calendars. Day/week shifts
 * are done via exact Gregorian day arithmetic (a day is a day regardless of
 * calendar); month/year shifts operate within the SOURCE calendar's own
 * month system (Hijri months for a Hijri input, Gregorian months otherwise)
 * since "add one month" means different things in each calendar.
 *
 * @param {{ calendarType: 'hijri'|'gregorian', year: number, month: number, day: number,
 *   operation: 'add'|'subtract', unit: 'day'|'week'|'month'|'year', amount: number }} input
 */
export function computeDateShift({ calendarType, year, month, day, operation, unit, amount }) {
  const isHijriInput = calendarType === 'hijri';
  const sourceValid = isHijriInput
    ? isSupportedHijriDate(year, month, day)
    : isSupportedGregorianDate(year, month, day);
  if (!sourceValid) return null;

  const sign = operation === 'subtract' ? -1 : 1;
  const amt = Math.max(0, Math.floor(Number(amount) || 0));

  let sourceHijri;
  let sourceGregorian;
  try {
    if (isHijriInput) {
      sourceHijri = { year, month, day };
      sourceGregorian = convertHijriDayForCalendar(year, month, day);
    } else {
      sourceGregorian = { year, month, day };
      sourceHijri = convertGregorianDayForCalendar(year, month, day);
    }
  } catch {
    return null;
  }

  let resultHijri;
  let resultGregorian;

  try {
    if (unit === 'day' || unit === 'week') {
      const days = sign * amt * (unit === 'week' ? 7 : 1);
      const baseDate = new Date(sourceGregorian.year, sourceGregorian.month - 1, sourceGregorian.day);
      baseDate.setDate(baseDate.getDate() + days);
      resultGregorian = {
        year: baseDate.getFullYear(),
        month: baseDate.getMonth() + 1,
        day: baseDate.getDate(),
      };
      resultHijri = convertGregorianDayForCalendar(
        resultGregorian.year,
        resultGregorian.month,
        resultGregorian.day,
      );
    } else {
      const monthsToAdd = sign * amt * (unit === 'year' ? 12 : 1);
      if (isHijriInput) {
        resultHijri = addHijriMonths(year, month, day, monthsToAdd);
        resultGregorian = convertHijriDayForCalendar(resultHijri.year, resultHijri.month, resultHijri.day);
      } else {
        resultGregorian = addGregorianMonths(year, month, day, monthsToAdd);
        resultHijri = convertGregorianDayForCalendar(
          resultGregorian.year,
          resultGregorian.month,
          resultGregorian.day,
        );
      }
    }
  } catch {
    return null;
  }

  const resultDate = new Date(resultGregorian.year, resultGregorian.month - 1, resultGregorian.day);
  const weekday = resultDate.getDay();
  const totalDaysShifted = Math.round(
    (resultDate.getTime() - new Date(sourceGregorian.year, sourceGregorian.month - 1, sourceGregorian.day).getTime())
    / 86400000,
  );

  return {
    sourceHijri,
    sourceGregorian,
    resultHijri,
    resultGregorian,
    resultDate,
    weekdayAr: DAY_NAMES_AR[weekday],
    resultHijriMonthNameAr: ISLAMIC_MONTH_NAMES_AR[resultHijri.month - 1],
    resultGregorianMonthNameAr: GREGORIAN_MONTH_NAMES_AR[resultGregorian.month - 1],
    totalDaysShifted,
  };
}
