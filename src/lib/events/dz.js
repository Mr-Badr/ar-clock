/**
 * src/lib/events/dz.js
 * Algeria events — national, school, and Islamic variants.
 */

export const DZ_EVENTS = [
  // School events
  {
    id: 'results-bac-dz',
    slug: 'bac-results-algeria',
    _countryCode: 'dz',
    type: 'fixed',
    month: 7,
    day: 15,
    category: 'school',
    name: 'نتائج بكالوريا الجزائر',
    seoTitle: 'موعد نتائج الباك {{year}} الجزائر',
    description: 'إعلان نتائج بكالوريا الجزائر على الموقع الرسمي bac.onec.dz منتصف يوليو.',
    keywords: ['نتائج الباك الجزائر {{year}}', 'بكالوريا الجزائر {{year}}', 'موعد الباك الجزائر'],
    faqItems: [{ q: 'متى نتائج الباك الجزائر {{year}}؟', a: '~15 يوليو {{year}}.' }]
  },
  {
    id: 'exams-bac-dz',
    slug: 'bac-exams-algeria',
    _countryCode: 'dz',
    type: 'fixed',
    month: 6,
    day: 15,
    category: 'school',
    name: 'امتحانات الباك (الجزائر)',
    seoTitle: 'موعد امتحانات البكالوريا {{year}} الجزائر',
    description: 'انطلاق امتحانات البكالوريا الجزائرية يونيو {{year}}.',
    keywords: ['امتحانات الباك الجزائر {{year}}', 'موعد الباك الجزائر {{year}}'],
    faqItems: [{ q: 'متى امتحانات الباك الجزائر {{year}}؟', a: '~15 يونيو {{year}}.' }]
  },
  {
    id: 'school-start-dz',
    slug: 'school-start-algeria',
    _countryCode: 'dz',
    type: 'fixed',
    month: 9,
    day: 21,
    category: 'school',
    name: 'الدخول المدرسي في الجزائر',
    seoTitle: 'موعد الدخول المدرسي {{year}} الجزائر — 21 سبتمبر',
    description: 'الدخول المدرسي في الجزائر 21 سبتمبر {{year}} للعام الدراسي {{year}}–{{nextYear}}.',
    keywords: ['الدخول المدرسي الجزائر {{year}}', 'بداية الدراسة الجزائر {{year}}', 'موعد الدراسة جزائر'],
    faqItems: [{ q: 'متى يبدأ الدراسة في الجزائر {{year}}؟', a: '21 سبتمبر {{year}}.' }]
  },
  // National events
  {
    id: 'independence-dz',
    slug: 'independence-day-algeria',
    _countryCode: 'dz',
    type: 'fixed',
    month: 7,
    day: 5,
    category: 'national',
    name: 'عيد الاستقلال الجزائري',
    seoTitle: 'عيد استقلال الجزائر {{year}} — 5 جويلية',
    description: 'استقلال الجزائر عن فرنسا 5 يوليو 1962م.',
    details: 'استقلت الجزائر بعد ثورة تحريرية مجيدة بدأت 1 نوفمبر 1954 ودامت 7 سنوات وأصابت فرنسا.',
    keywords: ['عيد استقلال الجزائر {{year}}', '5 جويلية {{year}}', 'استقلال الجزائر 1962'],
    faqItems: [{ q: 'متى عيد الاستقلال الجزائري {{year}}؟', a: '5 يوليو {{year}}.' }]
  },
  {
    id: 'revolution-dz',
    slug: 'revolution-day-algeria',
    _countryCode: 'dz',
    type: 'fixed',
    month: 11,
    day: 1,
    category: 'national',
    name: 'يوم الثورة الجزائرية',
    seoTitle: 'ذكرى ثورة نوفمبر الجزائر {{year}} — أول نوفمبر',
    description: 'ذكرى اندلاع الثورة التحريرية الكبرى 1 نوفمبر 1954م.',
    keywords: ['يوم الثورة الجزائرية {{year}}', 'أول نوفمبر الجزائر', 'ثورة نوفمبر 1954'],
    faqItems: [{ q: 'متى ذكرى الثورة الجزائرية؟', a: '1 نوفمبر — ذكرى 1954م.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-dz',
    slug: 'ramadan-in-algeria',
    _countryCode: 'dz',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في الجزائر',
    seoTitle: 'متى رمضان {{year}} في الجزائر',
    description: 'رمضان {{hijriYear}} في الجزائر — 18 أو 19 فبراير {{year}}.',
    keywords: ['رمضان الجزائر {{year}}', 'متى رمضان في الجزائر {{year}}']
  },
];
