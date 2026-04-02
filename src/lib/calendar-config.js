import { HOLIDAY_COUNTRIES } from '@/lib/holidays/taxonomy';

/**
 * lib/calendar-config.js
 * Per-country Islamic calendar method + display metadata.
 * Drives both API method param (AlAdhan) and user-facing UI badges.
 */

export const COUNTRY_CALENDAR_CONFIG = {
  sa: {
    method: 1, label: 'المجلس الأعلى للقضاء (أم القرى)', labelShort: 'أم القرى',
    variance: 0, localSighting: false, accuracy: 'high',
    note: 'التواريخ رسمية وفق تقويم أم القرى المعتمد في المملكة العربية السعودية.',
  },
  ae: {
    method: 1, label: 'أم القرى (الإمارات)', labelShort: 'أم القرى',
    variance: 1, localSighting: true, accuracy: 'high',
    note: 'الإمارات تتبع أم القرى مع احتمال اختلاف يوم برؤية الهلال المحلية.',
  },
  kw: {
    method: 1, label: 'أم القرى (الكويت)', labelShort: 'أم القرى',
    variance: 1, localSighting: true, accuracy: 'high',
    note: 'الكويت تعتمد أم القرى مع رصد الهلال المحلي.',
  },
  qa: {
    method: 1, label: 'أم القرى (قطر)', labelShort: 'أم القرى',
    variance: 1, localSighting: true, accuracy: 'high',
    note: 'قطر تتبع أم القرى مع احتمال اختلاف يوم.',
  },
  eg: {
    method: 1, label: 'دار الإفتاء المصرية', labelShort: 'دار الإفتاء',
    variance: 1, localSighting: true, accuracy: 'high',
    note: 'مصر تعتمد رؤية الهلال الرسمية من دار الإفتاء. قد تختلف بيوم عن السعودية.',
  },
  ma: {
    method: 1, label: 'وزارة الأوقاف المغربية', labelShort: 'رؤية محلية',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'المغرب يعتمد رؤية الهلال المحلية. قد يختلف عن السعودية بيوم. التاريخ تقديري.',
  },
  dz: {
    method: 1, label: 'وزارة الشؤون الدينية (الجزائر)', labelShort: 'رؤية محلية',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'الجزائر تعتمد رؤية الهلال المحلية. قد يختلف الموعد بيوم.',
  },
  tn: {
    method: 1, label: 'دار الإفتاء التونسية', labelShort: 'دار الإفتاء',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'تونس تعتمد رؤية الهلال المحلية.',
  },
  default: {
    method: 1, label: 'أم القرى (افتراضي)', labelShort: 'أم القرى',
    variance: 0, localSighting: false, accuracy: 'high',
    note: 'التاريخ محسوب بناءً على تقويم أم القرى الرسمي.',
  },
};

export function getCountryCalendarConfig(code) {
  return COUNTRY_CALENDAR_CONFIG[code?.toLowerCase()] ?? COUNTRY_CALENDAR_CONFIG.default;
}

export const COUNTRY_META = Object.freeze(
  Object.fromEntries(
    HOLIDAY_COUNTRIES.map((country) => [
      country.code,
      {
        name: country.nameAr,
        flag: country.flag,
        timezone: country.timezone,
        order: country.order,
      },
    ]),
  ),
);
