/**
 * Islamic Holidays & Events
 * Computed from Hijri calendar. Used across calendar, programmatic date pages, and JSON-LD.
 */
import { convertDate } from '@/lib/date-adapter';

export interface IslamicEvent {
  hijriYear: number;
  hijriMonth: number;
  hijriDay: number;
  nameAr: string;
  nameEn: string;
  gregorianDate?: string; // ISO YYYY-MM-DD
  type: 'holiday' | 'sacred_month_start' | 'observance';
}

// Base Islamic event definitions (Hijri month/day only — applied to any year)
export const BASE_ISLAMIC_EVENTS = [
  { hijriMonth: 1, hijriDay: 1, nameAr: 'رأس السنة الهجرية', nameEn: 'Islamic New Year', type: 'holiday' },
  { hijriMonth: 1, hijriDay: 10, nameAr: 'يوم عاشوراء', nameEn: 'Ashura', type: 'observance' },
  { hijriMonth: 3, hijriDay: 12, nameAr: 'المولد النبوي الشريف', nameEn: 'Mawlid al-Nabi', type: 'holiday' },
  { hijriMonth: 7, hijriDay: 27, nameAr: 'ليلة المعراج', nameEn: "Laylat al-Mi'raj", type: 'observance' },
  { hijriMonth: 8, hijriDay: 15, nameAr: 'ليلة النصف من شعبان', nameEn: "Laylat al-Nisf min Sha'ban", type: 'observance' },
  { hijriMonth: 9, hijriDay: 1, nameAr: 'بداية شهر رمضان', nameEn: 'Start of Ramadan', type: 'observance' },
  { hijriMonth: 9, hijriDay: 27, nameAr: 'ليلة القدر', nameEn: 'Laylat al-Qadr', type: 'observance' },
  { hijriMonth: 10, hijriDay: 1, nameAr: 'عيد الفطر المبارك', nameEn: 'Eid al-Fitr', type: 'holiday' },
  { hijriMonth: 12, hijriDay: 9, nameAr: 'يوم عرفة', nameEn: 'Day of Arafah', type: 'observance' },
  { hijriMonth: 12, hijriDay: 10, nameAr: 'عيد الأضحى المبارك', nameEn: 'Eid al-Adha', type: 'holiday' },
  { hijriMonth: 12, hijriDay: 11, nameAr: 'أيام التشريق', nameEn: 'Tashriq Day 1', type: 'observance' },
  { hijriMonth: 12, hijriDay: 12, nameAr: 'أيام التشريق', nameEn: 'Tashriq Day 2', type: 'observance' },
  { hijriMonth: 12, hijriDay: 13, nameAr: 'أيام التشريق', nameEn: 'Tashriq Day 3', type: 'observance' },
] as const;

export const SACRED_MONTHS = [1, 7, 11, 12]; // Muharram, Rajab, Dhu al-Qi'dah, Dhu al-Hijjah

/**
 * Get Islamic events for a specific Hijri date.
 */
export function getIslamicEventsForHijriDate(
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number
): Pick<typeof BASE_ISLAMIC_EVENTS[number], 'nameAr' | 'nameEn' | 'type'>[] {
  return BASE_ISLAMIC_EVENTS.filter(
    e => e.hijriMonth === hijriMonth && e.hijriDay === hijriDay
  );
}

/**
 * Check if a Hijri month is sacred.
 */
export function isSacredMonth(hijriMonth: number): boolean {
  return SACRED_MONTHS.includes(hijriMonth);
}

/**
 * Check if a given Hijri date is in Ramadan.
 */
export function isRamadan(hijriMonth: number): boolean {
  return hijriMonth === 9;
}

/**
 * Check if a given Hijri month is Dhu al-Hijjah (Hajj month).
 */
export function isDhulHijjah(hijriMonth: number): boolean {
  return hijriMonth === 12;
}

/**
 * Generate a unique contextual description for a Gregorian date page (prevents thin content).
 * Returns 60-100 words of Arabic text unique to this date.
 */
export function generateUniqueContext(
  gregorianYear: number,
  gregorianMonth: number,
  gregorianDay: number,
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number,
  hijriMonthNameAr: string,
  dayOfYear: number,
  daysInYear: number
): string {
  const facts: string[] = [];

  facts.push(
    `يوم ${gregorianDay} من شهر ${getGregorianMonthNameAr(gregorianMonth)} عام ${gregorianYear} الميلادي يقع في اليوم ${dayOfYear} من أيام السنة من أصل ${daysInYear} يوماً.`
  );

  const events = getIslamicEventsForHijriDate(hijriYear, hijriMonth, hijriDay);
  if (events.length > 0) {
    facts.push(`يصادف هذا اليوم ${events.map(e => e.nameAr).join(' و ')}.`);
  }

  if (hijriMonth === 9) {
    facts.push(`يقع هذا اليوم في شهر رمضان المبارك شهر الصيام والقرآن.`);
  } else if (hijriMonth === 12) {
    facts.push(`يقع في ذي الحجة شهر الحج المبارك.`);
  } else if (isSacredMonth(hijriMonth)) {
    facts.push(`يقع في شهر ${hijriMonthNameAr} وهو من الأشهر الحرم التي عظّم الله شأنها.`);
  }

  if (hijriDay === 1) {
    facts.push(`يُعدّ هذا اليوم مطلع هلال شهر ${hijriMonthNameAr} الهجري الجديد.`);
  } else if (hijriDay >= 28) {
    facts.push(`يقترب هذا اليوم من نهاية شهر ${hijriMonthNameAr} الهجري.`);
  }

  const isLeap = (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) || gregorianYear % 400 === 0;
  if (isLeap) {
    facts.push(`السنة الميلادية ${gregorianYear} سنة كبيسة تحتوي على 366 يوماً.`);
  }

  return facts.join(' ');
}

export function getGregorianMonthNameAr(month: number): string {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  return months[month - 1] || '';
}
