import { convertDate } from '@/lib/date-adapter';

export const GREGORIAN_CALENDAR_INDEXABLE_RANGE = Object.freeze({
  minYear: 1924,
  maxYear: 2077,
});

export const HIJRI_CALENDAR_INDEXABLE_RANGE = Object.freeze({
  minYear: 1343,
  maxYear: 1500,
});

export const DATE_DAILY_SITEMAP_WINDOW_DAYS = 370;

export type DateSitemapDay = {
  year: number;
  month: number;
  day: number;
};

function addUtcDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function toSitemapDay(date: Date): DateSitemapDay {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export function getGregorianCalendarSeoBoundsForYear(currentYear: number) {
  return {
    currentYear,
    minYear: GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear,
    maxYear: GREGORIAN_CALENDAR_INDEXABLE_RANGE.maxYear,
  };
}

export function getHijriCalendarSeoBoundsForYear(currentYear: number) {
  return {
    currentYear,
    minYear: HIJRI_CALENDAR_INDEXABLE_RANGE.minYear,
    maxYear: HIJRI_CALENDAR_INDEXABLE_RANGE.maxYear,
  };
}

export function getCurrentHijriSeoYear(now = new Date()) {
  const isoDate = [
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('-');

  try {
    return convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' }).year;
  } catch {
    return 1447;
  }
}

export function getGregorianCalendarSeoBounds(now = new Date()) {
  return getGregorianCalendarSeoBoundsForYear(now.getUTCFullYear());
}

export function getHijriCalendarSeoBounds(now = new Date()) {
  return getHijriCalendarSeoBoundsForYear(getCurrentHijriSeoYear(now));
}

export function isSeoIndexableGregorianCalendarYear(year: number, currentYear: number) {
  const { minYear, maxYear } = getGregorianCalendarSeoBoundsForYear(currentYear);
  return year >= minYear && year <= maxYear;
}

export function isSeoIndexableHijriCalendarYear(year: number, currentYear: number) {
  const { minYear, maxYear } = getHijriCalendarSeoBoundsForYear(currentYear);
  return year >= minYear && year <= maxYear;
}

export function getGregorianDailySitemapDays(now = new Date()): DateSitemapDay[] {
  const startDate = addUtcDays(now, -DATE_DAILY_SITEMAP_WINDOW_DAYS);
  const endDate = addUtcDays(now, DATE_DAILY_SITEMAP_WINDOW_DAYS);
  const days: DateSitemapDay[] = [];

  for (
    let cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    cursor <= endDate;
    cursor = addUtcDays(cursor, 1)
  ) {
    days.push(toSitemapDay(cursor));
  }

  return days;
}

export function getGregorianYearSitemapDays(year: number): DateSitemapDay[] {
  if (
    year < GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear
    || year > GREGORIAN_CALENDAR_INDEXABLE_RANGE.maxYear
  ) {
    return [];
  }

  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31));
  const days: DateSitemapDay[] = [];

  for (
    let cursor = new Date(startDate);
    cursor <= endDate;
    cursor = addUtcDays(cursor, 1)
  ) {
    days.push(toSitemapDay(cursor));
  }

  return days;
}

export function getHijriDailySitemapDays(now = new Date()): DateSitemapDay[] {
  return getGregorianDailySitemapDays(now)
    .map((day) => {
      const isoDate = [
        String(day.year),
        String(day.month).padStart(2, '0'),
        String(day.day).padStart(2, '0'),
      ].join('-');

      try {
        const hijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
        return {
          year: hijri.year,
          month: hijri.month,
          day: hijri.day,
        };
      } catch {
        return null;
      }
    })
    .filter((day): day is DateSitemapDay => Boolean(day));
}

export function getHijriYearSitemapDays(year: number): DateSitemapDay[] {
  if (
    year < HIJRI_CALENDAR_INDEXABLE_RANGE.minYear
    || year > HIJRI_CALENDAR_INDEXABLE_RANGE.maxYear
  ) {
    return [];
  }

  const days: DateSitemapDay[] = [];

  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= 30; day += 1) {
      const isoDate = [
        String(year),
        String(month).padStart(2, '0'),
        String(day).padStart(2, '0'),
      ].join('-');

      try {
        convertDate({ date: isoDate, toCalendar: 'gregorian', method: 'umalqura' });
        days.push({ year, month, day });
      } catch {
        continue;
      }
    }
  }

  return days;
}
