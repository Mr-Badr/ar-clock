/**
 * Holidays Engine
 * Handles Hijri date calculations, seasonal events, and country-specific data.
 */

// --- Base Religious Holidays (Hijri) ---
export const RELIGIOUS_HOLIDAYS = [
  {
    id: 'ramadan',
    slug: 'ramadan',
    name: 'رمضان',
    title: 'كم باقي على رمضان',
    seoTitle: 'موعد بداية شهر رمضان المبارك 2026/1447 - عد تنازلي لرمضان',
    hijriMonth: 9,
    hijriDay: 1,
    description: 'شهر الصيام والقيام والتقرب إلى الله.',
    details: 'أقدس شهور السنة في التقويم الهجري، وهو شهر الصيام والتوبة والمغفرة.'
  },
  {
    id: 'eid-al-fitr',
    slug: 'eid-al-fitr',
    name: 'عيد الفطر',
    title: 'كم باقي على عيد الفطر',
    seoTitle: 'موعد عيد الفطر المبارك 2026/1447 - متى يبدأ عيد الفطر؟',
    hijriMonth: 10,
    hijriDay: 1,
    description: 'عيد مكافأة الصائمين بعد شهر رمضان المبارك.',
    details: 'يأتي في اليوم الأول من شهر شوال إعلاناً بانتهاء صيام رمضان.'
  },
  {
    id: 'hajj-start',
    slug: 'hajj-start',
    name: 'بداية الحج',
    title: 'كم باقي على الحج',
    seoTitle: 'موعد بداية موسم الحج 2026/1447 - فريضة الحج',
    hijriMonth: 12,
    hijriDay: 8,
    description: 'بداية مناسك الحج في مكة المكرمة.',
    details: 'اليوم الثامن من ذي الحجة (يوم التروية) هو بداية مناسك الحج.'
  },
  {
    id: 'day-of-arafa',
    slug: 'day-of-arafa',
    name: 'يوم عرفة',
    title: 'كم باقي على يوم عرفة',
    seoTitle: 'موعد يوم عرفة 2026/1447 - وقفة عرفات وفضل صيامها',
    hijriMonth: 12,
    hijriDay: 9,
    description: 'أفضل أيام السنة وينتظره المسلمون للصيام والدعاء.',
    details: 'أهم ركن في الحج ويوافق التاسع من شهر ذي الحجة.'
  },
  {
    id: 'eid-al-adha',
    slug: 'eid-al-adha',
    name: 'عيد الأضحى',
    title: 'كم باقي على عيد الأضحى',
    seoTitle: 'موعد عيد الأضحى المبارك 2026/1447 - متى وقفة العيد الكبير؟',
    hijriMonth: 12,
    hijriDay: 10,
    description: 'عيد الأضحية وذكرى قصة إبراهيم عليه السلام.',
    details: 'يعرف بالعيد الكبير ويصادف العاشر من ذي الحجة.'
  },
  {
    id: 'islamic-new-year',
    slug: 'islamic-new-year',
    name: 'رأس السنة الهجرية',
    title: 'كم باقي على رأس السنة الهجرية',
    seoTitle: 'موعد رأس السنة الهجرية 1448 - بداية العام الهجري الجديد',
    hijriMonth: 1,
    hijriDay: 1,
    description: 'بداية العام الهجري الجديد ذكرى هجرة النبي صلى الله عليه وسلم.',
    details: 'تحتفل الأمة الإسلامية بالأول من محرم بداية للسنة الهجرية الجديدة.'
  },
  {
    id: 'ashura',
    slug: 'ashura',
    name: 'عاشوراء',
    title: 'كم باقي على عاشوراء',
    seoTitle: 'موعد يوم عاشوراء 2026/1447 - فضل صيام عاشوراء',
    hijriMonth: 1,
    hijriDay: 10,
    description: 'ذكرى نجاة موسى عليه السلام من فرعون.',
    details: 'يوافق العاشر من محرم ويستحب صيامه اقتداءً بالنبي الكريم.'
  },
  {
    id: 'mawlid',
    slug: 'mawlid',
    name: 'المولد النبوي',
    title: 'كم باقي على المولد النبوي',
    seoTitle: 'موعد ذكرى المولد النبوي الشريف 2026/1447',
    hijriMonth: 3,
    hijriDay: 12,
    description: 'ذكرى ميلاد النبي محمد صلى الله عليه وسلم.',
    details: 'يحتفل المسلمون بالثاني عشر من ربيع الأول بذكرى مولد رسول الإنسانية.'
  }
];

// --- Seasonal & Yearly Events (Gregorian) ---
export const SEASONAL_EVENTS = [
  {
    id: 'start-of-year',
    slug: 'start-of-year',
    name: 'بداية السنة',
    title: 'كم باقي على بداية السنة الجديد',
    seoTitle: 'متى تبدأ السنة الجديدة 2027؟ - عد تنازلي لرأس السنة الميلادية',
    type: 'fixed',
    month: 1,
    day: 1,
    description: 'بداية العام الميلادي الجديد (احتفالات رأس السنة).'
  },
  {
    id: 'end-of-year',
    slug: 'end-of-year',
    name: 'نهاية السنة',
    title: 'كم باقي على نهاية السنة',
    seoTitle: 'متى تنتهي السنة الحالية 2026؟ - عد تنازلي لنهاية العام',
    type: 'fixed',
    month: 12,
    day: 31,
    description: 'العد التنازلي للحظة الأخيرة من العام الحالي.'
  },
  {
    id: 'summer-season',
    slug: 'summer-season',
    name: 'بداية الصيف',
    title: 'كم باقي على الصيف',
    seoTitle: 'متى يبدأ فصل الصيف 2026؟ - موعد الانقلاب الصيفي',
    type: 'fixed',
    month: 6,
    day: 21,
    description: 'بداية فصل الصيف (الانقلاب الصيفي).'
  },
  {
    id: 'winter-season',
    slug: 'winter-season',
    name: 'بداية الشتاء',
    title: 'كم باقي على الشتاء',
    seoTitle: 'متى يبدأ فصل الشتاء 2026؟ - موعد الانقلاب الشتوي',
    type: 'fixed',
    month: 12,
    day: 21,
    description: 'بداية فصل الشتاء (الانقلاب الشتوي).'
  },
  {
    id: 'spring-vacation',
    slug: 'spring-vacation',
    name: 'عطلة الربيع',
    title: 'كم باقي على عطلة الربيع',
    seoTitle: 'موعد عطلة الربيع 2026 وموسم الإجازات',
    type: 'estimated',
    date: '2026-03-29',
    description: 'إجازة الربيع المدرسية السنوية.'
  },
  {
    id: 'summer-vacation',
    slug: 'summer-vacation',
    name: 'الإجازة الصيفية',
    title: 'كم باقي على الإجازة الصيفية',
    seoTitle: 'موعد بداية الإجازة الصيفية 2026 للطلاب والمعلمين',
    type: 'estimated',
    date: '2026-06-11',
    description: 'فترة الراحة السنوية الكبرى للطلاب والمعلمين.'
  },
  {
    id: 'back-to-school',
    slug: 'back-to-school',
    name: 'الدخول المدرسي',
    title: 'كم باقي على الدخول المدرسي',
    seoTitle: 'موعد بداية العام الدراسي الجديد 2026-2027',
    type: 'estimated',
    date: '2026-09-20',
    description: 'بداية موسم العودة للمدارس والجامعات.'
  },
  {
    id: 'exams',
    slug: 'exams',
    name: 'الامتحانات',
    title: 'كم باقي على الامتحانات',
    seoTitle: 'موعد بداية الامتحانات النهائية لعام 2026',
    type: 'estimated',
    date: '2026-05-18',
    description: 'فترة الاختبارات النهائية للفصول الدراسية.'
  },
  {
    id: 'results',
    slug: 'results',
    name: 'النتائج',
    title: 'كم باقي على ظهور النتائج',
    seoTitle: 'موعد إعلان نتائج الامتحانات 2026 لجميع المراحل',
    type: 'estimated',
    date: '2026-06-25',
    description: 'لحظة إعلان نتائج الاختبارات والنجاح.'
  }
];

// --- Country Specific Data ---
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

// Helper to flat all events for easier lookup and ensure metadata exists
const enrichEvent = (e) => ({
  ...e,
  title: e.title || `كم باقي على ${e.name}`,
  description: e.description || `عد تنازلي لموعد ${e.name} ومتابعة الوقت المتبقي بالدقة.`,
  details: e.details || `تعرف على موعد ${e.name} وتابع العد التنازلي المباشر بالثانية والدقيقة والساعة.`
});

export const ALL_EVENTS = [
  ...RELIGIOUS_HOLIDAYS.map(enrichEvent),
  ...SEASONAL_EVENTS.map(enrichEvent),
  ...COUNTRIES_EVENTS.flatMap(c => c.events.map(enrichEvent))
];

/**
 * Robust mathematical Hijri calculation
 */
function gregorianToHijri(date) {
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear();
  let m = month;
  let y = year;
  if (m < 3) { y -= 1; m += 12; }
  let jd = Math.floor(365.25 * y) + Math.floor(30.6001 * (m + 1)) + day + 1720995;
  if (jd > 2299160) {
    let alpha = Math.floor(y / 100);
    jd += 2 - alpha + Math.floor(alpha / 4);
  }
  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  let hMonth = Math.floor((24 * l) / 709);
  let hDay = l - Math.floor((709 * hMonth) / 24);
  let hYear = 30 * n + j - 30;
  return { year: hYear, month: hMonth, day: hDay };
}

/**
 * Gets the next occurrence of any event
 */
export function getNextEventDate(event) {
  const now = new Date();
  
  if (event.type === 'hijri' || (event.hijriMonth && !event.type)) {
    // Already have this logic
    const searchNow = new Date(now);
    searchNow.setUTCHours(0, 0, 0, 0);
    for (let i = 0; i < 400; i++) {
       const checkDate = new Date(searchNow.getTime() + i * 86400000);
       const hDate = gregorianToHijri(checkDate);
       if (hDate.month === (event.hijriMonth || event.month) && hDate.day === (event.hijriDay || event.day)) {
         return checkDate;
       }
    }
  }

  if (event.type === 'fixed') {
    let date = new Date(now.getFullYear(), event.month - 1, event.day);
    if (date < now) {
      date = new Date(now.getFullYear() + 1, event.month - 1, event.day);
    }
    return date;
  }

  if (event.type === 'estimated' || event.date) {
    let date = new Date(event.date);
    if (date < now) {
      // For estimated dates, we might want to shift to next year if possible
      // but usually these are one-off or need new data. 
      // For now, let's keep as is or shift year.
      date.setFullYear(now.getFullYear() + 1);
    }
    return date;
  }

  if (event.type === 'monthly') {
    let date = new Date(now.getFullYear(), now.getMonth(), event.day);
    if (date < now) {
      date = new Date(now.getFullYear(), now.getMonth() + 1, event.day);
    }
    return date;
  }

  return null;
}

// Backward compatibility for the old function name
export const getNextHolidayDate = (day, month) => getNextEventDate({ hijriMonth: month, hijriDay: day, type: 'hijri' });

/**
 * Formats time remaining
 */
export function getTimeRemaining(targetDate) {
  const total = targetDate - new Date();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}
