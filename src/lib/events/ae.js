/**
 * src/lib/events/ae.js
 * UAE events — national, school, and Islamic variants.
 */

export const AE_EVENTS = [
  // National events
  {
    id: 'national-day-ae',
    slug: 'uae-national-day',
    _countryCode: 'ae',
    type: 'fixed',
    month: 12,
    day: 2,
    category: 'national',
    name: 'اليوم الوطني الإماراتي',
    seoTitle: 'اليوم الوطني الإماراتي {{year}} — 2 ديسمبر',
    description: 'ذكرى إعلان اتحاد الإمارات العربية المتحدة 2 ديسمبر 1971م.',
    keywords: ['اليوم الوطني الإماراتي {{year}}', '2 ديسمبر الإمارات', 'اليوم الوطني 54'],
    faqItems: [{ q: 'متى اليوم الوطني الإماراتي {{year}}؟', a: '2 ديسمبر {{year}}.' }]
  },
  // School events
  {
    id: 'school-start-ae',
    slug: 'school-start-uae',
    _countryCode: 'ae',
    type: 'fixed',
    month: 8,
    day: 30,
    category: 'school',
    name: 'بداية الدراسة في الإمارات',
    seoTitle: 'موعد بداية الدراسة في الإمارات {{year}}',
    description: 'بداية العام الدراسي {{year}}–{{nextYear}} في الإمارات.',
    keywords: ['بداية الدراسة الإمارات {{year}}', 'الدخول المدرسي الإمارات {{year}}'],
    faqItems: [{ q: 'متى الدراسة في الإمارات {{year}}؟', a: '30 أغسطس {{year}}.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-ae',
    slug: 'ramadan-in-uae',
    _countryCode: 'ae',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في الإمارات',
    seoTitle: 'متى رمضان {{year}} في الإمارات',
    description: 'رمضان {{hijriYear}} في الإمارات — ~18–19 فبراير {{year}}.',
    keywords: ['رمضان الإمارات {{year}}', 'متى رمضان الإمارات {{year}}']
  },
];
