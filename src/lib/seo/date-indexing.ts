import { convertDate } from '@/lib/date-adapter';

export const GREGORIAN_CALENDAR_SEO_YEAR_WINDOW = Object.freeze({
  past: 5,
  future: 5,
});

export const HIJRI_CALENDAR_SEO_YEAR_WINDOW = Object.freeze({
  past: 5,
  future: 5,
});

export function getGregorianCalendarSeoBoundsForYear(currentYear: number) {
  return {
    currentYear,
    minYear: currentYear - GREGORIAN_CALENDAR_SEO_YEAR_WINDOW.past,
    maxYear: currentYear + GREGORIAN_CALENDAR_SEO_YEAR_WINDOW.future,
  };
}

export function getHijriCalendarSeoBoundsForYear(currentYear: number) {
  return {
    currentYear,
    minYear: currentYear - HIJRI_CALENDAR_SEO_YEAR_WINDOW.past,
    maxYear: currentYear + HIJRI_CALENDAR_SEO_YEAR_WINDOW.future,
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
