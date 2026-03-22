/**
 * src/lib/events/tn.js
 * Tunisia events — national, school, and Islamic variants.
 */

export const TN_EVENTS = [
  // School events
  {
    id: 'results-bac-tn',
    slug: 'bac-results-tunisia',
    _countryCode: 'tn',
    type: 'fixed',
    month: 6,
    day: 23,
    category: 'school',
    name: 'نتائج بكالوريا تونس',
    seoTitle: 'موعد نتائج الباك {{year}} تونس',
    description: 'إعلان نتائج بكالوريا تونس {{year}}.',
    keywords: ['نتائج الباك تونس {{year}}', 'بكالوريا تونس {{year}}', 'نتائج الباك التونسي'],
    faqItems: [{ q: 'متى نتائج الباك تونس {{year}}؟', a: '~23 يونيو {{year}}.' }]
  },
  {
    id: 'school-start-tn',
    slug: 'school-start-tunisia',
    _countryCode: 'tn',
    type: 'fixed',
    month: 9,
    day: 15,
    category: 'school',
    name: 'الدخول المدرسي في تونس',
    seoTitle: 'موعد الدخول المدرسي {{year}} تونس — 15 سبتمبر',
    description: 'الدخول المدرسي في تونس 15 سبتمبر {{year}}.',
    keywords: ['الدخول المدرسي تونس {{year}}', 'بداية الدراسة تونس {{year}}'],
    faqItems: [{ q: 'متى الدراسة تونس {{year}}؟', a: '15 سبتمبر {{year}}.' }]
  },
  // National events
  {
    id: 'independence-tn',
    slug: 'independence-day-tunisia',
    _countryCode: 'tn',
    type: 'fixed',
    month: 3,
    day: 20,
    category: 'national',
    name: 'عيد الاستقلال التونسي',
    seoTitle: 'عيد استقلال تونس {{year}} — 20 مارس',
    description: 'ذكرى استقلال تونس عن الحماية الفرنسية 20 مارس 1956م.',
    keywords: ['عيد الاستقلال التونسي {{year}}', '20 مارس تونس', 'استقلال تونس 1956'],
    faqItems: [{ q: 'متى عيد الاستقلال التونسي {{year}}؟', a: '20 مارس {{year}}.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-tn',
    slug: 'ramadan-in-tunisia',
    _countryCode: 'tn',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في تونس',
    seoTitle: 'متى رمضان {{year}} في تونس',
    description: 'رمضان {{hijriYear}} في تونس — ~18–19 فبراير {{year}}.',
    keywords: ['رمضان تونس {{year}}', 'متى رمضان في تونس {{year}}']
  },
];
