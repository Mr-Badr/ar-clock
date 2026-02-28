import moment from 'moment-hijri';

// make sure Arabic month names are available (optional)
moment.locale('ar');

/**
 * Helper: normalize and enrich event objects
 * - fill defaults for title/description/details
 * - infer type if missing (hijri vs fixed)
 * - for hijri events that use `month/day` keys (common in some country lists),
 *   map them to hijriMonth/hijriDay so logic is consistent.
 */
const enrichEvent = (e) => {
  const copy = { ...e };

  // infer type if not provided
  if (!copy.type) {
    if (copy.hijriMonth || copy.hijriDay) copy.type = 'hijri';
    else if (copy.month || copy.day || copy.date) copy.type = copy.date ? 'estimated' : 'fixed';
    else copy.type = 'fixed';
  }

  // unify field names: some country items used month/day with type 'hijri'
  if (copy.type === 'hijri') {
    // if hijriMonth/hijriDay missing but month/day present, map them
    if (!('hijriMonth' in copy) && ('month' in copy)) copy.hijriMonth = copy.month;
    if (!('hijriDay' in copy) && ('day' in copy)) copy.hijriDay = copy.day;
  }

  // ensure numeric fields are numbers (defensive)
  if (copy.hijriMonth) copy.hijriMonth = Number(copy.hijriMonth);
  if (copy.hijriDay) copy.hijriDay = Number(copy.hijriDay);
  if (copy.month) copy.month = Number(copy.month);
  if (copy.day) copy.day = Number(copy.day);

  copy.title = copy.title || `كم باقي على ${copy.name}`;
  copy.seoTitle = copy.seoTitle || `${copy.name} - عداد المواعيد`;
  copy.description = copy.description || `عد تنازلي لموعد ${copy.name} ومتابعة الوقت المتبقي بالدقة.`;
  copy.details = copy.details || `تعرف على موعد ${copy.name} وتابع العد التنازلي المباشر بالثانية والدقيقة والساعة.`;

  return copy;
};

/* ---------------------
  Your events (unchanged data, but we'll enrich below)
  --------------------- */

// (Paste your RELIGIOUS_HOLIDAYS, SEASONAL_EVENTS, COUNTRIES_EVENTS arrays here)
export const RELIGIOUS_HOLIDAYS = [
  { id: 'ramadan', slug: 'ramadan', name: 'رمضان', hijriMonth: 9, hijriDay: 1, seoTitle: 'موعد بداية شهر رمضان المبارك 2026/1447 - عد تنازلي لرمضان', description: 'شهر الصيام...' },
  { id: 'eid-al-fitr', slug: 'eid-al-fitr', name: 'عيد الفطر', hijriMonth: 10, hijriDay: 1, seoTitle: 'موعد عيد الفطر المبارك 2026/1447 - متى يبدأ عيد الفطر؟' },
  { id: 'hajj-start', slug: 'hajj-start', name: 'بداية الحج', hijriMonth: 12, hijriDay: 8 },
  { id: 'day-of-arafa', slug: 'day-of-arafa', name: 'يوم عرفة', hijriMonth: 12, hijriDay: 9 },
  { id: 'eid-al-adha', slug: 'eid-al-adha', name: 'عيد الأضحى', hijriMonth: 12, hijriDay: 10 },
  { id: 'islamic-new-year', slug: 'islamic-new-year', name: 'رأس السنة الهجرية', hijriMonth: 1, hijriDay: 1 },
  { id: 'ashura', slug: 'ashura', name: 'عاشوراء', hijriMonth: 1, hijriDay: 10 },
  { id: 'mawlid', slug: 'mawlid', name: 'المولد النبوي', hijriMonth: 3, hijriDay: 12 }
];

export const SEASONAL_EVENTS = [
  { id: 'start-of-year', slug: 'start-of-year', name: 'بداية السنة', type: 'fixed', month: 1, day: 1 },
  { id: 'end-of-year', slug: 'end-of-year', name: 'نهاية السنة', type: 'fixed', month: 12, day: 31 },
  { id: 'summer-season', slug: 'summer-season', name: 'بداية الصيف', type: 'fixed', month: 6, day: 21 },
  { id: 'winter-season', slug: 'winter-season', name: 'بداية الشتاء', type: 'fixed', month: 12, day: 21 },
  { id: 'spring-vacation', slug: 'spring-vacation', name: 'عطلة الربيع', type: 'estimated', date: '2026-03-29' },
  { id: 'summer-vacation', slug: 'summer-vacation', name: 'الإجازة الصيفية', type: 'estimated', date: '2026-06-11' },
  { id: 'back-to-school', slug: 'back-to-school', name: 'الدخول المدرسي', type: 'estimated', date: '2026-09-20' },
  { id: 'exams', slug: 'exams', name: 'الامتحانات', type: 'estimated', date: '2026-05-18' },
  { id: 'results', slug: 'results', name: 'النتائج', type: 'estimated', date: '2026-06-25' }
];

export const COUNTRIES_EVENTS = [
  {
    name: 'السعودية',
    flag: '🇸🇦',
    code: 'sa',
    events: [
      { id: 'ramadan-sa', name: 'رمضان في السعودية', slug: 'ramadan-in-saudi-arabia', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-sa', name: 'عيد الفطر في السعودية', slug: 'eid-al-fitr-in-saudi-arabia', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-sa', name: 'عيد الأضحى في السعودية', slug: 'eid-al-adha-in-saudi-arabia', type: 'hijri', month: 12, day: 10 },
      { id: 'arafa-sa', name: 'يوم عرفة', slug: 'day-of-arafa-saudi', type: 'hijri', month: 12, day: 9 },
      { id: 'hajj-sa', name: 'موسم الحج', slug: 'hajj-season-saudi', type: 'hijri', month: 12, day: 8 },
      { id: 'national-day-sa', name: 'اليوم الوطني السعودي', slug: 'saudi-national-day', type: 'fixed', month: 9, day: 23 },
      { id: 'school-start-sa', name: 'بداية الدراسة في السعودية', slug: 'school-start-saudi', type: 'fixed', month: 8, day: 30 },
      { id: 'summer-vac-sa', name: 'الإجازة الصيفية', slug: 'summer-vacation-saudi', type: 'fixed', month: 6, day: 25 },
      { id: 'school-end-sa', name: 'نهاية السنة الدراسية', slug: 'school-end-saudi', type: 'fixed', month: 6, day: 25 },
      { id: 'salary-sa', name: 'صرف الرواتب', slug: 'salary-day-saudi', type: 'monthly', day: 27 }
    ]
  },
  {
    name: 'مصر',
    flag: '🇪🇬',
    code: 'eg',
    events: [
      { id: 'ramadan-eg', name: 'رمضان في مصر', slug: 'ramadan-in-egypt', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-eg', name: 'عيد الفطر في مصر', slug: 'eid-al-fitr-in-egypt', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-eg', name: 'عيد الأضحى في مصر', slug: 'eid-al-adha-in-egypt', type: 'hijri', month: 12, day: 10 },
      { id: 'results-thanaweya', name: 'نتيجة الثانوية العامة', slug: 'thanaweya-results', type: 'fixed', month: 7, day: 31 },
      { id: 'school-start-eg', name: 'بدء الدراسة في مصر', slug: 'school-start-egypt', type: 'fixed', month: 9, day: 20 },
      { id: 'exams-thanaweya', name: 'امتحانات الثانوية العامة', slug: 'thanaweya-exams', type: 'fixed', month: 6, day: 20 },
      { id: 'mid-year-vac-eg', name: 'إجازة نصف السنة', slug: 'mid-year-vacation-egypt', type: 'fixed', month: 1, day: 24 },
      { id: 'summer-vac-eg', name: 'إجازة الصيف في مصر', slug: 'summer-vacation-egypt', type: 'fixed', month: 6, day: 10 },
      { id: 'salaries-eg', name: 'صرف المرتبات في مصر', slug: 'salary-day-egypt', type: 'monthly', day: 24 },
      { id: 'sham-nessim', name: 'شم النسيم', slug: 'sham-nessim', type: 'fixed', month: 4, day: 13 }
    ]
  },
  {
    name: 'الجزائر',
    flag: '🇩🇿',
    code: 'dz',
    events: [
      { id: 'ramadan-dz', name: 'رمضان في الجزائر', slug: 'ramadan-in-algeria', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-dz', name: 'عيد الفطر في الجزائر', slug: 'eid-al-fitr-in-algeria', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-dz', name: 'عيد الأضحى في الجزائر', slug: 'eid-al-adha-in-algeria', type: 'hijri', month: 12, day: 10 },
      { id: 'results-bac-dz', name: 'نتائج البكالوريا (الجزائر)', slug: 'bac-results-algeria', type: 'fixed', month: 7, day: 15 },
      { id: 'school-start-dz', name: 'الدخول المدرسي في الجزائر', slug: 'school-start-algeria', type: 'fixed', month: 9, day: 21 },
      { id: 'exams-bac-dz', name: 'امتحانات الباك (الجزائر)', slug: 'bac-exams-algeria', type: 'fixed', month: 6, day: 15 },
      { id: 'summer-vac-dz', name: 'العطلة الصيفية في الجزائر', slug: 'summer-vacation-algeria', type: 'fixed', month: 7, day: 9 },
      { id: 'independence-dz', name: 'عيد الاستقلال الجزائري', slug: 'independence-day-algeria', type: 'fixed', month: 7, day: 5 },
      { id: 'spring-vac-dz', name: 'عطلة الربيع (الجزائر)', slug: 'spring-vacation-algeria', type: 'fixed', month: 3, day: 20 }
    ]
  },
  {
    name: 'المغرب',
    flag: '🇲🇦',
    code: 'ma',
    events: [
      { id: 'ramadan-ma', name: 'رمضان في المغرب', slug: 'ramadan-in-morocco', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-ma', name: 'عيد الفطر في المغرب', slug: 'eid-al-fitr-in-morocco', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-ma', name: 'عيد الأضحى في المغرب', slug: 'eid-al-adha-in-morocco', type: 'hijri', month: 12, day: 10 },
      { id: 'results-bac-ma', name: 'نتائج الباكالوريا (المغرب)', slug: 'bac-results-morocco', type: 'fixed', month: 6, day: 17 },
      { id: 'exams-nat-ma', name: 'الامتحان الوطني (المغرب)', slug: 'national-exams-morocco', type: 'fixed', month: 6, day: 10 },
      { id: 'school-start-ma', name: 'الدخول المدرسي في المغرب', slug: 'school-start-morocco', type: 'fixed', month: 9, day: 8 },
      { id: 'summer-vac-ma', name: 'العطلة الصيفية في المغرب', slug: 'summer-vacation-morocco', type: 'fixed', month: 7, day: 1 },
      { id: 'hijri-new-year-ma', name: 'رأس السنة الهجرية', slug: 'hijri-new-year-morocco', type: 'hijri', month: 1, day: 1 },
      { id: 'throne-day', name: 'عيد العرش', slug: 'throne-day-morocco', type: 'fixed', month: 7, day: 30 }
    ]
  },
  {
    name: 'الإمارات',
    flag: '🇦🇪',
    code: 'ae',
    events: [
      { id: 'ramadan-ae', name: 'رمضان في الإمارات', slug: 'ramadan-in-uae', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-ae', name: 'عيد الفطر في الإمارات', slug: 'eid-al-fitr-in-uae', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-ae', name: 'عيد الأضحى في الإمارات', slug: 'eid-al-adha-in-uae', type: 'hijri', month: 12, day: 10 },
      { id: 'national-day-ae', name: 'اليوم الوطني الإماراتي', slug: 'uae-national-day', type: 'fixed', month: 12, day: 2 },
      { id: 'school-start-ae', name: 'بداية العام الدراسي (الإمارات)', slug: 'school-start-uae', type: 'fixed', month: 8, day: 30 },
      { id: 'summer-vac-ae', name: 'إجازة الصيف في الإمارات', slug: 'summer-vacation-uae', type: 'fixed', month: 7, day: 3 },
      { id: 'eid-vac-ae', name: 'إجازة العيد في الإمارات', slug: 'eid-vacation-uae', type: 'hijri', month: 12, day: 9 },
      { id: 'new-year-ae', name: 'رأس السنة الميلادية (الإمارات)', slug: 'new-year-in-uae', type: 'fixed', month: 1, day: 1 }
    ]
  },
  {
    name: 'العراق',
    flag: '🇮🇶',
    code: 'iq',
    events: [
      { id: 'ramadan-iq', name: 'رمضان في العراق', slug: 'ramadan-in-iraq', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-iq', name: 'عيد الفطر في العراق', slug: 'eid-al-fitr-in-iraq', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-iq', name: 'عيد الأضحى في العراق', slug: 'eid-al-adha-in-iraq', type: 'hijri', month: 12, day: 10 },
      { id: 'results-iq', name: 'نتائج الامتحانات في العراق', slug: 'exam-results-iraq', type: 'fixed', month: 6, day: 30 },
      { id: 'school-start-iq', name: 'بدء العام الدراسي (العراق)', slug: 'school-start-iraq', type: 'fixed', month: 9, day: 21 },
      { id: 'summer-vac-iq', name: 'العطلة الصيفية في العراق', slug: 'summer-vacation-iraq', type: 'fixed', month: 7, day: 1 },
      { id: 'arbaeen', name: 'الزيارة الأربعينية', slug: 'arbaeen-iraq', type: 'fixed', month: 8, day: 3 }
    ]
  },
  {
    name: 'الأردن',
    flag: '🇯🇴',
    code: 'jo',
    events: [
      { id: 'ramadan-jo', name: 'رمضان في الأردن', slug: 'ramadan-in-jordan', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-jo', name: 'عيد الفطر في الأردن', slug: 'eid-al-fitr-in-jordan', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-jo', name: 'عيد الأضحى في الأردن', slug: 'eid-al-adha-in-jordan', type: 'hijri', month: 12, day: 10 },
      { id: 'results-tawjihi', name: 'نتائج التوجيهي', slug: 'tawjihi-results', type: 'fixed', month: 8, day: 15 },
      { id: 'school-start-jo', name: 'بدء الدراسة في الأردن', slug: 'school-start-jordan', type: 'fixed', month: 8, day: 24 },
      { id: 'summer-vac-jo', name: 'العطلة الصيفية في الأردن', slug: 'summer-vacation-jordan', type: 'fixed', month: 6, day: 28 }
    ]
  },
  {
    name: 'تونس',
    flag: '🇹🇳',
    code: 'tn',
    events: [
      { id: 'ramadan-tn', name: 'رمضان في تونس', slug: 'ramadan-in-tunisia', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-tn', name: 'عيد الفطر في تونس', slug: 'eid-al-fitr-in-tunisia', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-tn', name: 'عيد الأضحى في تونس', slug: 'eid-al-adha-in-tunisia', type: 'hijri', month: 12, day: 10 },
      { id: 'results-bac-tn', name: 'نتائج البكالوريا (تونس)', slug: 'bac-results-tunisia', type: 'fixed', month: 6, day: 23 },
      { id: 'school-start-tn', name: 'الدخول المدرسي في تونس', slug: 'school-start-tunisia', type: 'fixed', month: 9, day: 15 },
      { id: 'summer-vac-tn', name: 'العطلة الصيفية في تونس', slug: 'summer-vacation-tunisia', type: 'fixed', month: 7, day: 1 }
    ]
  },
  {
    name: 'الكويت',
    flag: '🇰🇼',
    code: 'kw',
    events: [
      { id: 'ramadan-kw', name: 'رمضان في الكويت', slug: 'ramadan-in-kuwait', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-kw', name: 'عيد الفطر في الكويت', slug: 'eid-al-fitr-in-kuwait', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-kw', name: 'عيد الأضحى في الكويت', slug: 'eid-al-adha-in-kuwait', type: 'hijri', month: 12, day: 10 },
      { id: 'national-day-kw', name: 'العيد الوطني الكويتي', slug: 'kuwait-national-day', type: 'fixed', month: 2, day: 25 },
      { id: 'school-start-kw', name: 'بدء الدراسة في الكويت', slug: 'school-start-kuwait', type: 'fixed', month: 9, day: 15 }
    ]
  },
  {
    name: 'قطر',
    flag: '🇶🇦',
    code: 'qa',
    events: [
      { id: 'ramadan-qa', name: 'رمضان في قطر', slug: 'ramadan-in-qatar', type: 'hijri', month: 9, day: 1 },
      { id: 'eid-fitr-qa', name: 'عيد الفطر في قطر', slug: 'eid-al-fitr-in-qatar', type: 'hijri', month: 10, day: 1 },
      { id: 'eid-adha-qa', name: 'عيد الأضحى في قطر', slug: 'eid-al-adha-in-qatar', type: 'hijri', month: 12, day: 10 },
      { id: 'national-day-qa', name: 'اليوم الوطني القطري', slug: 'qatar-national-day', type: 'fixed', month: 12, day: 18 },
      { id: 'school-start-qa', name: 'بدء الدراسة في قطر', slug: 'school-start-qatar', type: 'fixed', month: 8, day: 30 }
    ]
  }
];

// in holidays-engine.js

export const ASTRONOMICAL_EVENTS = [
  { id: 'solar-eclipse', slug: 'solar-eclipse', name: 'كسوف الشمس', type: 'fixed', month: 10, day: 14, seoTitle: 'موعد كسوف الشمس', description: 'تاريخ كسوف الشمس المتوقع', details: 'كسوف الشمس ظاهرة فلكية...' },
  { id: 'lunar-eclipse', slug: 'lunar-eclipse', name: 'خسوف القمر', type: 'fixed', month: 9, day: 7, seoTitle: 'موعد خسوف القمر', description: 'تاريخ خسوف القمر المتوقع', details: 'خسوف القمر حدث فلكي...' },
];
// in holidays-engine.js

export const EDUCATIONAL_EVENTS = [
  { id: 'exam-results-first', slug: 'exam-results-first', name: 'نتائج الامتحانات الأولى', type: 'estimated', date: '2026-01-20', seoTitle: 'نتائج امتحانات الفصل الأول', description: 'موعد إعلان نتائج الامتحانات الأولى' },
  { id: 'exam-results-final', slug: 'exam-results-final', name: 'نتائج الامتحانات النهائية', type: 'estimated', date: '2026-06-30', seoTitle: 'نتائج الامتحانات النهائية', description: 'الإعلان عن نتائج نهاية السنة' },
];

/* ---------------------
  Date utilities
  --------------------- */

// Converts a JS Date -> Hijri object (year/month/day)
export function gregorianToHijri(date) {
  const m = moment(date);
  return { year: m.iYear(), month: m.iMonth() + 1, day: m.iDate() };
}

// hijri -> JS Date
export function hijriToGregorian(year, month, day) {
  return moment(`${year}-${month}-${day}`, 'iYYYY-iM-iD').toDate();
}

/**
 * getNextEventDate(event)
 * Returns a JS Date (startOf day) for the next occurrence of the given event.
 * Accepts event.type: 'hijri' | 'fixed' | 'estimated' | 'monthly'
 */
export function getNextEventDate(rawEvent) {
  const event = enrichEvent(rawEvent); // defensive normalize
  const now = moment().startOf('day');
  let targetMoment;

  switch (event.type) {
    case 'hijri': {
      const startHijriYear = event.hijriYear || now.iYear();
      targetMoment = moment(`${startHijriYear}-${event.hijriMonth}-${event.hijriDay}`, 'iYYYY-iM-iD').startOf('day');

      // if target already passed (same day excluded), go to next hijri year
      if (targetMoment.isBefore(now, 'day') || targetMoment.isSame(now, 'day')) {
        const nextYear = startHijriYear + 1;
        targetMoment = moment(`${nextYear}-${event.hijriMonth}-${event.hijriDay}`, 'iYYYY-iM-iD').startOf('day');
      }
      break;
    }

    case 'fixed': {
      const year = event.year || now.year();
      targetMoment = moment(`${year}-${event.month}-${event.day}`, 'YYYY-M-D').startOf('day');
      if (targetMoment.isBefore(now, 'day') || targetMoment.isSame(now, 'day')) {
        targetMoment.add(1, 'year');
      }
      break;
    }

    case 'estimated': {
      // event.date should be ISO or parseable
      targetMoment = moment(event.date).startOf('day');
      if (!targetMoment.isValid()) targetMoment = now.clone();
      if (targetMoment.isBefore(now, 'day') || targetMoment.isSame(now, 'day')) {
        targetMoment.add(1, 'year');
      }
      break;
    }

    case 'monthly': {
      // day-of-month recurring
      const day = Number(event.day) || 1;
      targetMoment = now.clone().date(day).startOf('day');
      if (targetMoment.isBefore(now, 'day') || targetMoment.isSame(now, 'day')) {
        targetMoment.add(1, 'month');
      }
      break;
    }

    default: {
      targetMoment = now.clone();
      break;
    }
  }

  return targetMoment.toDate();
}

/**
 * getTimeRemaining
 * accepts a Date or ISO string; returns { total, days, hours, minutes, seconds }
 */
export function getTimeRemaining(targetDate) {
  const now = new Date();
  const td = (typeof targetDate === 'string') ? new Date(targetDate) : targetDate;
  const total = td.getTime() - now.getTime();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

/* ---------------------
  Expose all events flattened (normalized)
  --------------------- */

// flatten country events but keep country structure elsewhere
export const ALL_EVENTS = [
  ...RELIGIOUS_HOLIDAYS.map(enrichEvent),
  ...SEASONAL_EVENTS.map(enrichEvent),
  ...ASTRONOMICAL_EVENTS.map(enrichEvent),   // added above
  ...EDUCATIONAL_EVENTS.map(enrichEvent),     // added here
  ...COUNTRIES_EVENTS.flatMap(c => c.events.map(enrichEvent))
];