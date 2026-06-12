/**
 * Date Adapter — wraps @internationalized/date
 * This is the ONLY file that imports from the date library.
 * All pages and components receive already-converted data — they never call the library directly.
 */
import {
  CalendarDate,
  IslamicUmalquraCalendar,
  IslamicCivilCalendar,
  IslamicTabularCalendar,
  GregorianCalendar,
  toCalendar as libToCalendar,
} from '@internationalized/date';
import { 
  DAY_NAMES_AR as _DAY_NAMES_AR, 
  GREGORIAN_MONTHS_AR as _GREGORIAN_MONTHS_AR,
  GREGORIAN_MONTHS_EN as _GREGORIAN_MONTHS_EN
} from '@/lib/constants';

export type ConversionMethod = 'umalqura' | 'civil' | 'astronomical';

export interface ConvertDateInput {
  date: Date | string;
  toCalendar: 'hijri' | 'gregorian';
  method?: ConversionMethod; // default: 'umalqura'
}

export interface ConvertDateResult {
  year: number;
  month: number;
  day: number;
  monthNameAr: string;
  monthNameEn: string;
  dayNameAr: string;
  dayNameEn: string;
  formatted: {
    ar: string;
    en: string;
    iso: string;
    arIndic: string;
  };
  isLeapYear: boolean;
  dayOfYear: number;
  daysInYear: number;
  julianDay: number;
}

export interface GregorianCalendarDayResult {
  year: number;
  month: number;
  day: number;
  weekday: number;
}

export interface HijriCalendarDayResult {
  year: number;
  month: number;
  day: number;
}

// ── Range guards ──────────────────────────────────────────────────────────────
const HIJRI_MIN_YEAR = 1343;
const HIJRI_MAX_YEAR = 1500;
const GREGORIAN_MIN_YEAR = 1924;
const GREGORIAN_MAX_YEAR = 2077;
const GREGORIAN_CALENDAR = new GregorianCalendar();
const UMALQURA_CALENDAR = new IslamicUmalquraCalendar();
const CIVIL_CALENDAR = new IslamicCivilCalendar();
const ASTRONOMICAL_CALENDAR = new IslamicTabularCalendar();

// ── Month / day name tables ──────────────────────────────────────────────────
export const ISLAMIC_MONTH_NAMES_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

export const ISLAMIC_MONTH_NAMES_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

export const GREGORIAN_MONTH_NAMES_AR = _GREGORIAN_MONTHS_AR;
export const GREGORIAN_MONTH_NAMES_EN = _GREGORIAN_MONTHS_EN;

export const DAY_NAMES_AR = _DAY_NAMES_AR;
export const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ── Utilities ─────────────────────────────────────────────────────────────────
export function toArabicNumerals(num: string | number): string {
  const ar = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (d) => ar[parseInt(d)]);
}

/** Convert a CalendarDate to its Gregorian JS Date for day-of-week / Julian Day calculations */
function toGregorianDate(cd: CalendarDate): Date {
  const greg = libToCalendar(cd, new GregorianCalendar()) as CalendarDate;
  return new Date(Date.UTC(greg.year, greg.month - 1, greg.day, 12, 0, 0));
}

function julianDay(cd: CalendarDate): number {
  const jsDate = toGregorianDate(cd);
  return jsDate.getTime() / 86400000 + 2440587.5;
}

function dayOfWeek(cd: CalendarDate): number {
  return toGregorianDate(cd).getUTCDay();
}

function dayOfYearCalc(cd: CalendarDate): number {
  let days = cd.day;
  for (let m = 1; m < cd.month; m++) {
    const d = new CalendarDate(cd.calendar, cd.year, m, 1);
    days += cd.calendar.getDaysInMonth(d);
  }
  return days;
}

function daysInYearCalc(cd: CalendarDate): number {
  const monthsInYear = cd.calendar.getMonthsInYear(cd);
  let days = 0;

  for (let month = 1; month <= monthsInYear; month += 1) {
    days += cd.calendar.getDaysInMonth(new CalendarDate(cd.calendar, cd.year, month, 1));
  }

  return days;
}

function getHijriCalendar(method: ConversionMethod) {
  if (method === 'umalqura') {
    return UMALQURA_CALENDAR;
  }

  if (method === 'astronomical') {
    return ASTRONOMICAL_CALENDAR;
  }

  return CIVIL_CALENDAR;
}

function assertIntegerDateParts(year: number, month: number, day: number): void {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError(`Date parts must be integers. Received year=${year}, month=${month}, day=${day}.`);
  }

  if (month < 1 || month > 12) {
    throw new RangeError(`Month ${month} is outside the supported range 1-12.`);
  }

  if (day < 1) {
    throw new RangeError(`Day ${day} must be greater than zero.`);
  }
}

function assertValidCalendarDay(
  calendar: GregorianCalendar | IslamicUmalquraCalendar | IslamicCivilCalendar | IslamicTabularCalendar,
  year: number,
  month: number,
  day: number,
  calendarLabel: string,
): void {
  assertIntegerDateParts(year, month, day);
  const monthStart = new CalendarDate(calendar, year, month, 1);
  const daysInMonth = calendar.getDaysInMonth(monthStart);

  if (day > daysInMonth) {
    throw new RangeError(
      `${calendarLabel} date ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} is invalid. `
      + `Month ${month} has ${daysInMonth} days.`,
    );
  }
}

export function getHijriMonthDays(year: number, month: number): number {
  assertIntegerDateParts(year, month, 1);

  if (year < HIJRI_MIN_YEAR || year > HIJRI_MAX_YEAR) {
    throw new RangeError(`Hijri year ${year} is out of supported range (${HIJRI_MIN_YEAR}-${HIJRI_MAX_YEAR}).`);
  }

  return UMALQURA_CALENDAR.getDaysInMonth(new CalendarDate(UMALQURA_CALENDAR, year, month, 1));
}

export function convertHijriDayForCalendar(
  year: number,
  month: number,
  day: number,
): GregorianCalendarDayResult {
  if (year < HIJRI_MIN_YEAR || year > HIJRI_MAX_YEAR) {
    throw new RangeError(`Hijri year ${year} is out of supported range (${HIJRI_MIN_YEAR}-${HIJRI_MAX_YEAR}).`);
  }

  assertValidCalendarDay(UMALQURA_CALENDAR, year, month, day, 'Hijri');
  const gregorianDate = libToCalendar(
    new CalendarDate(UMALQURA_CALENDAR, year, month, day),
    GREGORIAN_CALENDAR,
  ) as CalendarDate;

  return {
    year: gregorianDate.year,
    month: gregorianDate.month,
    day: gregorianDate.day,
    weekday: new Date(Date.UTC(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day)).getUTCDay(),
  };
}

export function convertGregorianDayForCalendar(
  year: number,
  month: number,
  day: number,
): HijriCalendarDayResult {
  if (year < GREGORIAN_MIN_YEAR || year > GREGORIAN_MAX_YEAR) {
    throw new RangeError(`Gregorian year ${year} is out of supported range (${GREGORIAN_MIN_YEAR}-${GREGORIAN_MAX_YEAR}).`);
  }

  assertValidCalendarDay(GREGORIAN_CALENDAR, year, month, day, 'Gregorian');
  const hijriDate = libToCalendar(
    new CalendarDate(GREGORIAN_CALENDAR, year, month, day),
    UMALQURA_CALENDAR,
  ) as CalendarDate;

  return {
    year: hijriDate.year,
    month: hijriDate.month,
    day: hijriDate.day,
  };
}

// ── Main conversion function ──────────────────────────────────────────────────
export function convertDate(input: ConvertDateInput): ConvertDateResult {
  const method = input.method ?? 'umalqura';

  // 1. Choose calendars
  const hijriCal = getHijriCalendar(method);
  const gregorianCal = GREGORIAN_CALENDAR;

  // 2. Parse input date
  let inYear: number, inMonth: number, inDay: number;

  if (typeof input.date === 'string') {
    const parts = input.date.split('T')[0].split('-').map(Number);
    inYear = parts[0];
    inMonth = parts[1];
    inDay = parts[2];
  } else {
    inYear = input.date.getFullYear();
    inMonth = input.date.getMonth() + 1;
    inDay = input.date.getDate();
  }

  if (!inYear || !inMonth || !inDay) throw new Error('Invalid date input');

  // 3. Range guard
  if (input.toCalendar === 'hijri') {
    if (inYear < GREGORIAN_MIN_YEAR || inYear > GREGORIAN_MAX_YEAR) {
      throw new RangeError(`Gregorian year ${inYear} is out of supported range (${GREGORIAN_MIN_YEAR}-${GREGORIAN_MAX_YEAR})`);
    }
    assertValidCalendarDay(gregorianCal, inYear, inMonth, inDay, 'Gregorian');
  } else {
    if (inYear < HIJRI_MIN_YEAR || inYear > HIJRI_MAX_YEAR) {
      throw new RangeError(`Hijri year ${inYear} is out of supported range (${HIJRI_MIN_YEAR}-${HIJRI_MAX_YEAR})`);
    }
    assertValidCalendarDay(hijriCal, inYear, inMonth, inDay, 'Hijri');
  }

  // 4. Build source CalendarDate and convert using the module-level toCalendar()
  let sourceDate: CalendarDate;
  let targetDate: CalendarDate;

  if (input.toCalendar === 'hijri') {
    // Gregorian → Hijri
    sourceDate = new CalendarDate(gregorianCal, inYear, inMonth, inDay);
    targetDate = libToCalendar(sourceDate, hijriCal) as CalendarDate;
  } else {
    // Hijri → Gregorian
    sourceDate = new CalendarDate(hijriCal, inYear, inMonth, inDay);
    targetDate = libToCalendar(sourceDate, gregorianCal) as CalendarDate;
  }

  // 5. Extract metadata
  const isHijriResult = input.toCalendar === 'hijri';
  const dow = dayOfWeek(targetDate);
  const jd = julianDay(targetDate);
  const doy = dayOfYearCalc(targetDate);
  const diy = daysInYearCalc(targetDate);

  const monthNameAr = isHijriResult
    ? ISLAMIC_MONTH_NAMES_AR[targetDate.month - 1]
    : GREGORIAN_MONTH_NAMES_AR[targetDate.month - 1];
  const monthNameEn = isHijriResult
    ? ISLAMIC_MONTH_NAMES_EN[targetDate.month - 1]
    : GREGORIAN_MONTH_NAMES_EN[targetDate.month - 1];

  // 6. Format strings
  let formattedAr: string;
  let formattedEn: string;
  const isoStr = `${targetDate.year}-${String(targetDate.month).padStart(2, '0')}-${String(targetDate.day).padStart(2, '0')}`;

  if (isHijriResult) {
    formattedAr = `${targetDate.day} ${monthNameAr} ${targetDate.year} هـ`;
    formattedEn = `${targetDate.day} ${monthNameEn} ${targetDate.year} AH`;
  } else {
    formattedAr = `${targetDate.day} ${monthNameAr} ${targetDate.year}`;
    formattedEn = `${targetDate.day} ${monthNameEn} ${targetDate.year}`;
  }

  const arIndic = isHijriResult
    ? `${toArabicNumerals(targetDate.day)} ${monthNameAr} ${toArabicNumerals(targetDate.year)} هـ`
    : `${toArabicNumerals(targetDate.day)} ${monthNameAr} ${toArabicNumerals(targetDate.year)}`;

  // 7. Leap year (Gregorian only — Hijri leap is complex and not needed for display)
  return {
    year: targetDate.year,
    month: targetDate.month,
    day: targetDate.day,
    monthNameAr,
    monthNameEn,
    dayNameAr: DAY_NAMES_AR[dow],
    dayNameEn: DAY_NAMES_EN[dow],
    formatted: {
      ar: formattedAr,
      en: formattedEn,
      iso: isoStr,
      arIndic,
    },
    isLeapYear: diy > (isHijriResult ? 354 : 365),
    dayOfYear: doy,
    daysInYear: diy,
    julianDay: jd,
  };
}
