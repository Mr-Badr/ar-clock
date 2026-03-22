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

// ── Range guards ──────────────────────────────────────────────────────────────
const HIJRI_MIN_YEAR = 1343;
const HIJRI_MAX_YEAR = 1500;
const GREGORIAN_MIN_YEAR = 1924;
const GREGORIAN_MAX_YEAR = 2077;

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

export const GREGORIAN_MONTH_NAMES_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export const GREGORIAN_MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
export const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ── Utilities ─────────────────────────────────────────────────────────────────
export function toArabicNumerals(num: string | number): string {
  const ar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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

// ── Main conversion function ──────────────────────────────────────────────────
export function convertDate(input: ConvertDateInput): ConvertDateResult {
  const method = input.method ?? 'umalqura';

  // 1. Choose calendars
  const hijriCal =
    method === 'umalqura'
      ? new IslamicUmalquraCalendar()
      : method === 'astronomical'
        ? new IslamicTabularCalendar() // best public-domain Tabular approximation
        : new IslamicCivilCalendar();

  const gregorianCal = new GregorianCalendar();

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
      throw new RangeError(`Gregorian year ${inYear} is out of supported range (${GREGORIAN_MIN_YEAR}–${GREGORIAN_MAX_YEAR})`);
    }
  } else {
    if (inYear < HIJRI_MIN_YEAR || inYear > HIJRI_MAX_YEAR) {
      throw new RangeError(`Hijri year ${inYear} is out of supported range (${HIJRI_MIN_YEAR}–${HIJRI_MAX_YEAR})`);
    }
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
  const diy = (targetDate.calendar as any).getDaysInYear(targetDate);

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
  const gregYear = isHijriResult ? inYear : targetDate.year;
  const isLeapYear = (gregYear % 4 === 0 && gregYear % 100 !== 0) || gregYear % 400 === 0;

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
