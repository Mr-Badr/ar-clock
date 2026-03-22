/**
 * src/lib/events/kw.js
 * Kuwait events — national, school, and Islamic variants.
 */

export const KW_EVENTS = [
  // National events
  {
    id: 'national-day-kw',
    slug: 'kuwait-national-day',
    _countryCode: 'kw',
    type: 'fixed',
    month: 2,
    day: 25,
    category: 'national',
    name: 'اليوم الوطني الكويتي',
    seoTitle: 'اليوم الوطني الكويتي {{year}} — 25 فبراير',
    description: 'ذكرى استقلال الكويت عن بريطانيا 25 فبراير 1961م.',
    keywords: ['اليوم الوطني الكويتي {{year}}', '25 فبراير الكويت', 'استقلال الكويت'],
    faqItems: [{ q: 'متى اليوم الوطني الكويتي {{year}}؟', a: '25 فبراير {{year}}.' }]
  },
  // School events
  {
    id: 'school-start-kw',
    slug: 'school-start-kuwait',
    _countryCode: 'kw',
    type: 'fixed',
    month: 9,
    day: 15,
    category: 'school',
    name: 'بدء الدراسة في الكويت',
    seoTitle: 'موعد بداية الدراسة في الكويت {{year}}',
    description: 'بداية العام الدراسي {{year}}–{{nextYear}} في الكويت.',
    keywords: ['بداية الدراسة الكويت {{year}}', 'الدخول المدرسي الكويت {{year}}'],
    faqItems: [{ q: 'متى الدراسة كويت {{year}}؟', a: '15 سبتمبر {{year}}.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-kw',
    slug: 'ramadan-in-kuwait',
    _countryCode: 'kw',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في الكويت',
    seoTitle: 'متى رمضان {{year}} في الكويت',
    description: 'رمضان {{hijriYear}} في الكويت — ~18–19 فبراير {{year}}.',
    keywords: ['رمضان الكويت {{year}}', 'متى رمضان الكويت {{year}}']
  },
];
