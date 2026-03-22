/**
 * src/lib/events/qa.js
 * Qatar events — national, school, and Islamic variants.
 */

export const QA_EVENTS = [
  // National events
  {
    id: 'national-day-qa',
    slug: 'qatar-national-day',
    _countryCode: 'qa',
    type: 'fixed',
    month: 12,
    day: 18,
    category: 'national',
    name: 'اليوم الوطني القطري',
    seoTitle: 'اليوم الوطني القطري {{year}} — 18 ديسمبر',
    description: 'اليوم الوطني لدولة قطر 18 ديسمبر.',
    keywords: ['اليوم الوطني القطري {{year}}', '18 ديسمبر قطر'],
    faqItems: [{ q: 'متى اليوم الوطني القطري {{year}}؟', a: '18 ديسمبر {{year}}.' }]
  },
  // School events
  {
    id: 'school-start-qa',
    slug: 'school-start-qatar',
    _countryCode: 'qa',
    type: 'fixed',
    month: 8,
    day: 30,
    category: 'school',
    name: 'بدء الدراسة في قطر',
    seoTitle: 'موعد بداية الدراسة في قطر {{year}}',
    description: 'بداية العام الدراسي {{year}}–{{nextYear}} في قطر.',
    keywords: ['بداية الدراسة قطر {{year}}', 'الدخول المدرسي قطر {{year}}'],
    faqItems: [{ q: 'متى الدراسة قطر {{year}}؟', a: '30 أغسطس {{year}}.' }]
  },
  // Islamic variants
  {
    id: 'ramadan-qa',
    slug: 'ramadan-in-qatar',
    _countryCode: 'qa',
    type: 'hijri',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'islamic',
    name: 'رمضان في قطر',
    seoTitle: 'متى رمضان {{year}} في قطر',
    description: 'رمضان {{hijriYear}} في قطر — ~18–19 فبراير {{year}}.',
    keywords: ['رمضان قطر {{year}}', 'متى رمضان قطر {{year}}']
  },
];
