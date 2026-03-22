/**
 * src/lib/events/eg.js
 * Egypt events — national, school, business, and Islamic variants.
 */

export const EG_EVENTS = [
  // School events
  {
    id: 'results-th-eg',
    slug: 'thanaweya-results',
    _countryCode: 'eg',
    type: 'fixed',
    month: 7,
    day: 31,
    category: 'school',
    name: 'نتيجة الثانوية العامة (مصر)',
    seoTitle: 'موعد نتيجة الثانوية العامة {{year}} مصر',
    description: 'إعلان نتيجة الثانوية العامة المصرية أواخر يوليو {{year}}.',
    details: 'تُعلن وزارة التربية والتعليم النتائج على البوابة الرسمية moe.gov.eg.',
    keywords: ['نتيجة الثانوية العامة {{year}}', 'نتيجة الثانوية مصر {{year}}', 'نتيجة البكالوريا مصر {{year}}'],
    faqItems: [{ q: 'متى نتيجة الثانوية العامة {{year}}؟', a: 'أواخر يوليو {{year}}.' }]
  },
  {
    id: 'exams-th-eg',
    slug: 'thanaweya-exams',
    _countryCode: 'eg',
    type: 'fixed',
    month: 6,
    day: 20,
    category: 'school',
    name: 'امتحانات الثانوية العامة (مصر)',
    seoTitle: 'موعد امتحانات الثانوية العامة {{year}} مصر',
    description: 'بداية امتحانات الثانوية العامة المصرية يونيو {{year}}.',
    keywords: ['امتحانات الثانوية مصر {{year}}', 'موعد الثانوية العامة {{year}}', 'امتحانات آخر العام {{year}}'],
    faqItems: [{ q: 'متى امتحانات الثانوية مصر {{year}}؟', a: '~20 يونيو {{year}}.' }]
  },
  {
    id: 'school-start-eg',
    slug: 'school-start-egypt',
    _countryCode: 'eg',
    type: 'fixed',
    month: 9,
    day: 20,
    category: 'school',
    name: 'بدء الدراسة في مصر',
    seoTitle: 'موعد بداية الدراسة في مصر {{year}}',
    description: 'بداية العام الدراسي {{year}}–{{nextYear}} في مصر 20 سبتمبر.',
    keywords: ['بداية الدراسة مصر {{year}}', 'الدخول المدرسي مصر {{year}}', 'موعد الدراسة مصر'],
    faqItems: [{ q: 'متى يبدأ الدراسة في مصر {{year}}؟', a: '~20 سبتمبر {{year}}.' }]
  },
  // Business events
  {
    id: 'salary-eg',
    slug: 'salary-day-egypt',
    _countryCode: 'eg',
    type: 'monthly',
    day: 24,
    category: 'business',
    name: 'صرف المرتبات الحكومية (مصر)',
    seoTitle: 'كم باقي على صرف الراتب في مصر؟',
    description: 'تُصرف مرتبات موظفي الحكومة المصرية يوم 24 من كل شهر.',
    keywords: ['صرف الراتب مصر', 'موعد الراتب مصر 24', 'متى يصرف الراتب في مصر'],
    faqItems: [{ q: 'متى يصرف الراتب في مصر؟', a: 'يوم 24 من كل شهر.' }]
  },
  // Holidays
  {
    id: 'sham-nessim',
    slug: 'sham-nessim',
    _countryCode: 'eg',
    type: 'easter',
    easterOffset: 1,
    category: 'holidays',
    name: 'شم النسيم',
    seoTitle: 'موعد شم النسيم {{year}} في مصر',
    description: 'عيد شم النسيم المصري القديم — الإثنين عقب عيد القيامة.',
    details: 'عيد مصري موروث من الحضارة الفرعونية. يخرج المصريون للمتنزهات احتفاءً بقدوم الربيع ويأكلون الفسيخ والبيض الملوّن.',
    keywords: ['شم النسيم {{year}}', 'متى شم النسيم {{year}}', 'شم النسيم مصر'],
    faqItems: [{ q: 'متى شم النسيم {{year}}؟', a: 'الإثنين التالي لعيد القيامة الغربي.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-eg',
    slug: 'ramadan-in-egypt',
    _countryCode: 'eg',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في مصر',
    seoTitle: 'متى رمضان {{year}} في مصر — دار الإفتاء',
    description: 'رمضان {{hijriYear}} في مصر — 18 أو 19 فبراير {{year}} بحسب رؤية دار الإفتاء.',
    keywords: ['رمضان مصر {{year}}', 'متى رمضان في مصر {{year}}']
  },
];
