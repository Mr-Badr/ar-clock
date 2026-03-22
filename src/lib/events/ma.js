/**
 * src/lib/events/ma.js
 * Morocco events — national, school, and Islamic variants.
 */

export const MA_EVENTS = [
  // School events
  {
    id: 'results-bac-ma',
    slug: 'bac-results-morocco',
    _countryCode: 'ma',
    type: 'fixed',
    month: 6,
    day: 17,
    category: 'school',
    name: 'نتائج الباكالوريا (المغرب)',
    seoTitle: 'موعد نتائج الباكالوريا {{year}} المغرب',
    description: 'إعلان نتائج الباكالوريا المغربية {{year}}.',
    keywords: ['نتائج الباكالوريا المغرب {{year}}', 'باك المغرب {{year}}', 'نتائج الباك المغرب'],
    faqItems: [{ q: 'متى نتائج الباك المغرب {{year}}؟', a: '~17 يونيو {{year}}.' }]
  },
  {
    id: 'national-exam-ma',
    slug: 'national-exams-morocco',
    _countryCode: 'ma',
    type: 'fixed',
    month: 6,
    day: 10,
    category: 'school',
    name: 'الامتحان الوطني (المغرب)',
    seoTitle: 'موعد الامتحان الوطني {{year}} المغرب',
    description: 'الامتحان الوطني الموحد للباكالوريا المغربية {{year}}.',
    keywords: ['الامتحان الوطني المغرب {{year}}', 'امتحانات الباك المغرب {{year}}'],
    faqItems: [{ q: 'متى الامتحان الوطني المغرب {{year}}؟', a: '~10 يونيو {{year}}.' }]
  },
  {
    id: 'school-start-ma',
    slug: 'school-start-morocco',
    _countryCode: 'ma',
    type: 'fixed',
    month: 9,
    day: 8,
    category: 'school',
    name: 'الدخول المدرسي في المغرب',
    seoTitle: 'موعد الدخول المدرسي {{year}} المغرب — 8 سبتمبر',
    description: 'الدخول المدرسي في المغرب 8 سبتمبر {{year}}.',
    keywords: ['الدخول المدرسي المغرب {{year}}', 'بداية الدراسة المغرب {{year}}'],
    faqItems: [{ q: 'متى الدخول المدرسي المغرب {{year}}؟', a: '8 سبتمبر {{year}}.' }]
  },
  // National events
  {
    id: 'throne-day',
    slug: 'throne-day-morocco',
    _countryCode: 'ma',
    type: 'fixed',
    month: 7,
    day: 30,
    category: 'national',
    name: 'عيد العرش المغربي',
    seoTitle: 'موعد عيد العرش المغربي {{year}} — 30 يوليوز',
    description: 'عيد العرش المجيد 30 يوليو — يحتفل المغرب بتولي الملك عرش البلاد.',
    details: 'يُلقى فيه الخطاب الملكي السنوي ويخرج المغاربة في مسيرات وطنية.',
    keywords: ['عيد العرش {{year}} المغرب', '30 يوليوز {{year}}', 'عيد العرش المجيد'],
    faqItems: [{ q: 'متى عيد العرش {{year}}؟', a: '30 يوليو {{year}}.' }]
  },
  {
    id: 'independence-ma',
    slug: 'independence-day-morocco',
    _countryCode: 'ma',
    type: 'fixed',
    month: 11,
    day: 18,
    category: 'national',
    name: 'عيد الاستقلال المغربي',
    seoTitle: 'ذكرى استقلال المغرب {{year}} — 18 نوفمبر',
    description: 'عيد الاستقلال المغربي 18 نوفمبر — ذكرى عودة الملك محمد الخامس من المنفى 1955م.',
    keywords: ['عيد الاستقلال المغربي {{year}}', '18 نوفمبر المغرب', 'استقلال المغرب 1956'],
    faqItems: [{ q: 'متى عيد الاستقلال المغربي {{year}}؟', a: '18 نوفمبر {{year}}.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-ma',
    slug: 'ramadan-in-morocco',
    _countryCode: 'ma',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في المغرب',
    seoTitle: 'متى رمضان {{year}} في المغرب — رؤية الهلال',
    description: 'رمضان {{hijriYear}} في المغرب — 18 أو 19 فبراير {{year}} بحسب رؤية الهلال.',
    keywords: ['رمضان المغرب {{year}}', 'متى رمضان في المغرب {{year}}']
  },
];
