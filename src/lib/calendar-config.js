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
  iq: {
    method: 1, label: 'الجهات الشرعية العراقية', labelShort: 'رؤية محلية',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'العراق يعتمد الإعلان المحلي والجهات الشرعية المختصة، وقد يختلف الموعد بيوم.',
  },
  sy: {
    method: 1, label: 'وزارة الأوقاف السورية', labelShort: 'رؤية محلية',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'سوريا تعتمد الإعلان المحلي للجهة الشرعية المختصة، وقد يختلف الموعد بيوم.',
  },
  ye: {
    method: 1, label: 'وزارة الأوقاف والإرشاد', labelShort: 'رؤية محلية',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'اليمن يعتمد الإعلان المحلي للجهة الشرعية المختصة، وقد يختلف الموعد بيوم.',
  },
  jo: {
    method: 1, label: 'دائرة الإفتاء العام (الأردن)', labelShort: 'دائرة الإفتاء',
    variance: 1, localSighting: true, accuracy: 'high',
    note: 'الأردن يعتمد الإعلان الرسمي لدائرة الإفتاء العام مع احتمال اختلاف يوم.',
  },
  ly: {
    method: 1, label: 'دار الإفتاء الليبية', labelShort: 'دار الإفتاء',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'ليبيا تعتمد الإعلان المحلي لدار الإفتاء، وقد يختلف الموعد بيوم.',
  },
  om: {
    method: 1, label: 'وزارة الأوقاف والشؤون الدينية (عمان)', labelShort: 'رؤية محلية',
    variance: 1, localSighting: true, accuracy: 'high',
    note: 'عمان تعتمد الإعلان المحلي لوزارة الأوقاف والشؤون الدينية مع احتمال اختلاف يوم.',
  },
  ps: {
    method: 1, label: 'دار الإفتاء الفلسطينية', labelShort: 'دار الإفتاء',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'فلسطين تعتمد الإعلان المحلي للجهة الشرعية المختصة، وقد يختلف الموعد بيوم.',
  },
  ca: {
    method: 1, label: 'المجالس الإسلامية المحلية (كندا)', labelShort: 'إعلان محلي',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'كندا قد تعتمد الإعلان المحلي أو الحسابات الفلكية بحسب المجلس أو المدينة.',
  },
  fr: {
    method: 1, label: 'المجلس الفرنسي للديانة الإسلامية', labelShort: 'إعلان محلي',
    variance: 1, localSighting: true, accuracy: 'medium',
    note: 'فرنسا قد تعتمد الإعلان المحلي أو الحسابات الفلكية بحسب الجهة المرجعية المعتمدة.',
  },
  tr: {
    method: 1, label: 'رئاسة الشؤون الدينية (تركيا)', labelShort: 'حسابات فلكية',
    variance: 0, localSighting: false, accuracy: 'high',
    note: 'تركيا تعتمد الحسابات الفلكية الرسمية في إعلان المواقيت والمناسبات الهجرية.',
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
