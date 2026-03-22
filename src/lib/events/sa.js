/**
 * src/lib/events/sa.js
 * Saudi Arabia events — national, school, business, support, and Islamic variants.
 * All events must have _countryCode: 'sa' for the country filter to work.
 */

export const SA_EVENTS = [
  // National events
  {
    id: 'national-day-sa',
    slug: 'saudi-national-day',
    _countryCode: 'sa',
    type: 'fixed',
    month: 9,
    day: 23,
    category: 'national',
    name: 'اليوم الوطني السعودي',
    seoTitle: 'اليوم الوطني السعودي {{year}} — 23 سبتمبر — عد تنازلي',
    description: 'اليوم الوطني للمملكة 23 سبتمبر — ذكرى توحيد المملكة 1932م.',
    details: 'يُحتفل فيه بتوحيد المملكة على يد الملك عبدالعزيز بن سعود. إجازة رسمية مع احتفالات وطنية في جميع أنحاء المملكة.',
    keywords: ['اليوم الوطني السعودي {{year}}', '23 سبتمبر {{year}}', 'اليوم الوطني 1444'],
    faqItems: [{ q: 'متى اليوم الوطني السعودي {{year}}؟', a: '23 سبتمبر {{year}}.' }]
  },
  {
    id: 'founding-day-sa',
    slug: 'saudi-founding-day',
    _countryCode: 'sa',
    type: 'fixed',
    month: 2,
    day: 22,
    category: 'national',
    name: 'يوم التأسيس السعودي',
    seoTitle: 'يوم التأسيس السعودي {{year}} — 22 فبراير — عد تنازلي',
    description: 'يوم التأسيس 22 فبراير — يُحتفل بتأسيس الدولة السعودية الأولى 1727م.',
    keywords: ['يوم التأسيس السعودي {{year}}', '22 فبراير السعودية', 'يوم التأسيس 1444'],
    faqItems: [{ q: 'متى يوم التأسيس السعودي {{year}}؟', a: '22 فبراير {{year}}.' }]
  },
  // School events
  {
    id: 'school-start-sa',
    slug: 'school-start-saudi',
    _countryCode: 'sa',
    type: 'fixed',
    month: 8,
    day: 30,
    category: 'school',
    name: 'بداية الدراسة في السعودية',
    seoTitle: 'موعد بداية الدراسة في السعودية {{year}} — 30 أغسطس',
    description: 'انطلاق العام الدراسي {{year}}–{{nextYear}} في المملكة العربية السعودية.',
    keywords: ['بداية الدراسة السعودية {{year}}', 'الدخول المدرسي السعودية {{year}}', 'موعد الدراسة السعودية'],
    faqItems: [{ q: 'متى بداية الدراسة السعودية {{year}}؟', a: '30 أغسطس {{year}}.' }]
  },
  // Business events
  {
    id: 'salary-sa',
    slug: 'salary-day-saudi',
    _countryCode: 'sa',
    type: 'monthly',
    day: 27,
    category: 'business',
    name: 'صرف الرواتب الحكومية (السعودية)',
    seoTitle: 'كم باقي على صرف الراتب في السعودية؟',
    description: 'تُصرف رواتب موظفي الحكومة السعودية يوم 27 من كل شهر.',
    keywords: ['صرف الراتب السعودية', 'موعد الراتب 27', 'متى يصرف الراتب السعودية'],
    faqItems: [{ q: 'متى يصرف الراتب في السعودية؟', a: 'اليوم السابع والعشرون من كل شهر — يُقدَّم في رمضان.' }]
  },
  // Support events
  {
    id: 'citizen-account-sa',
    slug: 'citizen-account-saudi',
    _countryCode: 'sa',
    type: 'monthly',
    day: 10,
    category: 'support',
    name: 'حساب المواطن (السعودية)',
    seoTitle: 'موعد صرف حساب المواطن — كم باقي على الإيداع؟',
    description: 'يتم إيداع الدعم في حساب المواطن السعودي يوم 10 من كل شهر ميلادي.',
    keywords: ['حساب المواطن', 'موعد حساب المواطن', 'كم باقي على حساب المواطن'],
    faqItems: [{ q: 'متى يصرف حساب المواطن؟', a: 'يوم 10 من كل شهر ميلادي، وإذا وافق إجازة رسمية يتم التقديم أو التأخير يوماً.' }]
  },
  {
    id: 'social-security-sa',
    slug: 'social-security-saudi',
    _countryCode: 'sa',
    type: 'monthly',
    day: 1,
    category: 'support',
    name: 'الضمان الاجتماعي المطور (السعودية)',
    seoTitle: 'موعد صرف الضمان الاجتماعي المطور — كم باقي؟',
    description: 'يُصرف معاش الضمان الاجتماعي المطور في اليوم الأول من كل شهر ميلادي.',
    keywords: ['الضمان الاجتماعي', 'موعد الضمان المطور', 'متى يزل الضمان المطور'],
    faqItems: [{ q: 'متى ينزل الضمان الاجتماعي المطور؟', a: 'في اليوم الأول من كل شهر ميلادي.' }]
  },
  // Islamic variants (country-specific)
  {
    id: 'ramadan-sa',
    slug: 'ramadan-in-saudi',
    _countryCode: 'sa',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في السعودية',
    seoTitle: 'متى رمضان {{year}} في السعودية — أم القرى',
    description: 'رمضان {{hijriYear}} في السعودية — 18 فبراير {{year}} وفق تقويم أم القرى.',
    keywords: ['رمضان السعودية {{year}}', 'متى رمضان السعودية {{year}}']
  },
  {
    id: 'eid-fitr-sa',
    slug: 'eid-al-fitr-in-saudi',
    _countryCode: 'sa',
    type: 'hijri',
    hijriMonth: 10,
    hijriDay: 1,
    category: 'islamic',
    name: 'عيد الفطر في السعودية',
    seoTitle: 'موعد عيد الفطر {{year}} في السعودية',
    description: 'عيد الفطر 1 شوال {{hijriYear}} — 20 مارس {{year}}.',
    keywords: ['عيد الفطر السعودية {{year}}']
  },
  {
    id: 'eid-adha-sa',
    slug: 'eid-al-adha-in-saudi',
    _countryCode: 'sa',
    type: 'hijri',
    hijriMonth: 12,
    hijriDay: 10,
    category: 'islamic',
    name: 'عيد الأضحى في السعودية',
    seoTitle: 'موعد عيد الأضحى {{year}} في السعودية',
    description: 'عيد الأضحى 10 ذو الحجة {{hijriYear}} — 27 مايو {{year}}.',
    keywords: ['عيد الأضحى السعودية {{year}}']
  },
];
