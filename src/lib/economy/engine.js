// lib/economy/engine.js
import { DateTime } from 'luxon';
import { SITE_BRAND } from '@/lib/site-config';

const VIEWER_LOCALE = 'ar-SA-u-nu-latn';
const DATE_LABEL_LOCALE = 'ar-SA-u-nu-latn';

const FOREX_SESSION_DEFS = [
  {
    id: 'sydney',
    nameAr: 'سيدني',
    flag: '🇦🇺',
    timezone: 'Australia/Sydney',
    open: '08:00',
    close: '17:00',
    days: [1, 2, 3, 4, 5],
    tone: 'info',
    pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY'],
  },
  {
    id: 'tokyo',
    nameAr: 'طوكيو',
    flag: '🇯🇵',
    timezone: 'Asia/Tokyo',
    open: '09:00',
    close: '18:00',
    days: [1, 2, 3, 4, 5],
    tone: 'brand',
    pairs: ['USD/JPY', 'EUR/JPY', 'AUD/JPY'],
  },
  {
    id: 'london',
    nameAr: 'لندن',
    flag: '🇬🇧',
    timezone: 'Europe/London',
    open: '08:00',
    close: '17:00',
    days: [1, 2, 3, 4, 5],
    tone: 'success',
    pairs: ['EUR/USD', 'GBP/USD', 'XAU/USD'],
  },
  {
    id: 'newyork',
    nameAr: 'نيويورك',
    flag: '🇺🇸',
    timezone: 'America/New_York',
    open: '08:00',
    close: '17:00',
    days: [1, 2, 3, 4, 5],
    tone: 'warning',
    pairs: ['EUR/USD', 'USD/CAD', 'XAU/USD'],
  },
];

const FOREX_SESSION_INTELLIGENCE = {
  sydney: {
    cityNameAr: 'سيدني',
    liquidityLabel: 'سيولة خفيفة إلى متوسطة',
    volatilityLabel: 'أهدأ من لندن ونيويورك',
    bestFor: 'AUD وNZD وبداية إعادة التسعير الأسبوعي',
    watchLabel: 'تصلح للمراجعة الهادئة أو متابعة الأصول الأسترالية.',
  },
  tokyo: {
    cityNameAr: 'طوكيو',
    liquidityLabel: 'سيولة متوسطة',
    volatilityLabel: 'أوضح على أزواج الين',
    bestFor: 'JPY وAUD/JPY والأخبار الآسيوية',
    watchLabel: 'تزداد أهميتها عندما تظهر بيانات يابانية أو صينية مفاجئة.',
  },
  london: {
    cityNameAr: 'لندن',
    liquidityLabel: 'سيولة عالية',
    volatilityLabel: 'نشاط أوروبي واضح',
    bestFor: 'EUR وGBP وبداية حركة الذهب اليومية',
    watchLabel: 'هي البوابة العملية لمعظم المتداولين العرب أثناء النهار.',
  },
  newyork: {
    cityNameAr: 'نيويورك',
    liquidityLabel: 'سيولة عالية جداً',
    volatilityLabel: 'أعلى حساسية للأخبار الأمريكية',
    bestFor: 'USD وXAU/USD وبيانات الاقتصاد الأمريكي',
    watchLabel: 'أول ساعة فيها قد تعيد تشكيل مزاج السوق لبقية اليوم.',
  },
};

const STOCK_MARKETS = [
  {
    id: 'us',
    nameAr: 'السوق الأمريكي',
    shortNameAr: 'NYSE / NASDAQ',
    flag: '🇺🇸',
    region: 'global',
    timezone: 'America/New_York',
    tone: 'warning',
    sessions: [{ open: '09:30', close: '16:00', days: [1, 2, 3, 4, 5] }],
    premarket: { open: '04:00', close: '09:30', days: [1, 2, 3, 4, 5] },
    afterhours: { open: '16:00', close: '20:00', days: [1, 2, 3, 4, 5] },
    note: 'تشمل الجلسات الموسعة ما قبل السوق وما بعده.',
  },
  {
    id: 'sa',
    nameAr: 'تداول السعودي',
    shortNameAr: 'Tadawul',
    flag: '🇸🇦',
    region: 'arab',
    timezone: 'Asia/Riyadh',
    tone: 'success',
    sessions: [{ open: '10:00', close: '15:00', days: [7, 1, 2, 3, 4], label: 'الجلسة الرئيسية' }],
    premarket: { open: '09:30', close: '10:00', days: [7, 1, 2, 3, 4] },
    afterhours: { open: '15:00', close: '15:30', days: [7, 1, 2, 3, 4] },
    note: 'أيام العمل من الأحد إلى الخميس.',
  },
  {
    id: 'uk',
    nameAr: 'بورصة لندن',
    shortNameAr: 'LSE',
    flag: '🇬🇧',
    region: 'global',
    timezone: 'Europe/London',
    tone: 'brand',
    sessions: [{ open: '08:00', close: '16:30', days: [1, 2, 3, 4, 5] }],
  },
  {
    id: 'jp',
    nameAr: 'بورصة طوكيو',
    shortNameAr: 'TSE',
    flag: '🇯🇵',
    region: 'global',
    timezone: 'Asia/Tokyo',
    tone: 'info',
    sessions: [
      { open: '09:00', close: '11:30', days: [1, 2, 3, 4, 5], label: 'الجلسة الصباحية' },
      { open: '12:30', close: '15:30', days: [1, 2, 3, 4, 5], label: 'الجلسة المسائية' },
    ],
    note: 'توجد استراحة تداول وسط اليوم.',
  },
  {
    id: 'fr',
    nameAr: 'بورصة باريس',
    shortNameAr: 'Euronext',
    flag: '🇫🇷',
    region: 'global',
    timezone: 'Europe/Paris',
    tone: 'default',
    sessions: [{ open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }],
  },
  {
    id: 'de',
    nameAr: 'بورصة فرانكفورت',
    shortNameAr: 'Xetra',
    flag: '🇩🇪',
    region: 'global',
    timezone: 'Europe/Berlin',
    tone: 'default',
    sessions: [{ open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }],
  },
  {
    id: 'ae-dfm',
    nameAr: 'بورصة دبي',
    shortNameAr: 'DFM',
    flag: '🇦🇪',
    region: 'arab',
    timezone: 'Asia/Dubai',
    tone: 'info',
    sessions: [{ open: '10:00', close: '14:00', days: [7, 1, 2, 3, 4] }],
    premarket: { open: '09:30', close: '10:00', days: [7, 1, 2, 3, 4] },
    note: 'من الأحد إلى الخميس، مع تمهيد قصير قبل الجلسة الرئيسية.',
  },
  {
    id: 'ae-adx',
    nameAr: 'بورصة أبوظبي',
    shortNameAr: 'ADX',
    flag: '🇦🇪',
    region: 'arab',
    timezone: 'Asia/Dubai',
    tone: 'brand',
    sessions: [{ open: '10:00', close: '14:00', days: [7, 1, 2, 3, 4] }],
    premarket: { open: '09:30', close: '10:00', days: [7, 1, 2, 3, 4] },
  },
  {
    id: 'kw',
    nameAr: 'بورصة الكويت',
    shortNameAr: 'Boursa Kuwait',
    flag: '🇰🇼',
    region: 'arab',
    timezone: 'Asia/Kuwait',
    tone: 'success',
    sessions: [{ open: '09:30', close: '12:30', days: [7, 1, 2, 3, 4] }],
  },
  {
    id: 'qa',
    nameAr: 'بورصة قطر',
    shortNameAr: 'QSE',
    flag: '🇶🇦',
    region: 'arab',
    timezone: 'Asia/Qatar',
    tone: 'warning',
    sessions: [{ open: '09:00', close: '13:30', days: [7, 1, 2, 3, 4] }],
  },
  {
    id: 'eg',
    nameAr: 'البورصة المصرية',
    shortNameAr: 'EGX',
    flag: '🇪🇬',
    region: 'arab',
    timezone: 'Africa/Cairo',
    tone: 'default',
    sessions: [{ open: '10:00', close: '15:30', days: [7, 1, 2, 3, 4] }],
  },
];

const STOCK_MARKET_INTELLIGENCE = {
  us: {
    cityNameAr: 'نيويورك',
    regionLabelAr: 'عالمي',
    localCurrency: 'USD',
    referenceIndex: 'S&P 500 / Nasdaq 100',
    liquidityTierLabel: 'سيولة مؤسسية عميقة',
    catalystLabel: 'الأخبار الأمريكية والعوائد ونتائج الشركات',
  },
  sa: {
    cityNameAr: 'الرياض',
    regionLabelAr: 'عربي',
    localCurrency: 'SAR',
    referenceIndex: 'TASI',
    liquidityTierLabel: 'سيولة خليجية محلية قوية',
    catalystLabel: 'الطاقة والمصارف والأخبار المحلية',
  },
  uk: {
    cityNameAr: 'لندن',
    regionLabelAr: 'عالمي',
    localCurrency: 'GBP',
    referenceIndex: 'FTSE 100',
    liquidityTierLabel: 'سيولة أوروبية عالية',
    catalystLabel: 'المصارف والطاقة والجنيه الإسترليني',
  },
  jp: {
    cityNameAr: 'طوكيو',
    regionLabelAr: 'عالمي',
    localCurrency: 'JPY',
    referenceIndex: 'Nikkei 225',
    liquidityTierLabel: 'سيولة آسيوية مستقرة',
    catalystLabel: 'الين والمصدرون والسياسة اليابانية',
  },
  fr: {
    cityNameAr: 'باريس',
    regionLabelAr: 'عالمي',
    localCurrency: 'EUR',
    referenceIndex: 'CAC 40',
    liquidityTierLabel: 'سيولة أوروبية متوازنة',
    catalystLabel: 'الأسهم الصناعية والسلع الفاخرة واليورو',
  },
  de: {
    cityNameAr: 'فرانكفورت',
    regionLabelAr: 'عالمي',
    localCurrency: 'EUR',
    referenceIndex: 'DAX',
    liquidityTierLabel: 'سيولة صناعية أوروبية قوية',
    catalystLabel: 'التصنيع الألماني والطاقة والسياسة الأوروبية',
  },
  'ae-dfm': {
    cityNameAr: 'دبي',
    regionLabelAr: 'عربي',
    localCurrency: 'AED',
    referenceIndex: 'DFM General',
    liquidityTierLabel: 'سيولة خليجية متوسطة',
    catalystLabel: 'العقار والبنوك وشهية المخاطرة الخليجية',
  },
  'ae-adx': {
    cityNameAr: 'أبوظبي',
    regionLabelAr: 'عربي',
    localCurrency: 'AED',
    referenceIndex: 'ADX General',
    liquidityTierLabel: 'سيولة خليجية متنامية',
    catalystLabel: 'الطاقة والشركات الحكومية والسيولة الإقليمية',
  },
  kw: {
    cityNameAr: 'الكويت',
    regionLabelAr: 'عربي',
    localCurrency: 'KWD',
    referenceIndex: 'Premier Market',
    liquidityTierLabel: 'سيولة خليجية انتقائية',
    catalystLabel: 'البنوك والإنفاق الحكومي والسيولة المحلية',
  },
  qa: {
    cityNameAr: 'الدوحة',
    regionLabelAr: 'عربي',
    localCurrency: 'QAR',
    referenceIndex: 'QE Index',
    liquidityTierLabel: 'سيولة خليجية متوسطة',
    catalystLabel: 'الغاز والبنوك والإنفاق المحلي',
  },
  eg: {
    cityNameAr: 'القاهرة',
    regionLabelAr: 'عربي',
    localCurrency: 'EGP',
    referenceIndex: 'EGX 30',
    liquidityTierLabel: 'سيولة عربية محلية متقلبة',
    catalystLabel: 'العملة والتمويل المحلي وقرارات السياسة الاقتصادية',
  },
};

const ECONOMIC_EVENT_INTELLIGENCE = {
  factories: {
    descriptionAr: 'يقيس طلبات المصانع الأمريكية ويعطي إشارة مبكرة على المزاج الصناعي والإنفاق الرأسمالي.',
    affectedPairs: ['EUR/USD', 'USD/JPY'],
    surpriseRiskLabel: 'متوسط',
    frequencyLabel: 'شهري',
  },
  confidence: {
    descriptionAr: 'يكشف درجة تفاؤل المستهلك الأمريكي ويؤثر على الدولار والأسهم عندما تأتي القراءة بعيدة عن المتوقع.',
    affectedPairs: ['EUR/USD', 'XAU/USD'],
    surpriseRiskLabel: 'متوسط',
    frequencyLabel: 'شهري',
  },
  jobless: {
    descriptionAr: 'يراقب قوة سوق العمل الأمريكي أسبوعياً ويؤثر بسرعة على توقعات الفائدة والدولار.',
    affectedPairs: ['USD/JPY', 'XAU/USD'],
    surpriseRiskLabel: 'متوسط إلى مرتفع',
    frequencyLabel: 'أسبوعي',
  },
  boe: {
    descriptionAr: 'مراجعات بنك إنجلترا تهم الجنيه والأسواق الأوروبية وقد تغير توقيت التوقعات النقدية.',
    affectedPairs: ['GBP/USD', 'EUR/GBP'],
    surpriseRiskLabel: 'مرتفع',
    frequencyLabel: 'دوري',
  },
  nfp: {
    descriptionAr: 'أهم تقرير وظائف أمريكي شهري، وغالباً ما يحرك الدولار والذهب والأسهم بسرعة واضحة.',
    affectedPairs: ['EUR/USD', 'XAU/USD', 'USD/CAD'],
    surpriseRiskLabel: 'مرتفع جداً',
    frequencyLabel: 'شهري',
  },
};

const ARAB_REFERENCE_VIEWERS = [
  {
    id: 'sa',
    cityNameAr: 'الرياض',
    countryNameAr: 'السعودية',
    timezone: 'Asia/Riyadh',
  },
  {
    id: 'ae',
    cityNameAr: 'أبوظبي',
    countryNameAr: 'الإمارات',
    timezone: 'Asia/Dubai',
  },
  {
    id: 'eg',
    cityNameAr: 'القاهرة',
    countryNameAr: 'مصر',
    timezone: 'Africa/Cairo',
  },
  {
    id: 'ma',
    cityNameAr: 'الدار البيضاء',
    countryNameAr: 'المغرب',
    timezone: 'Africa/Casablanca',
  },
];

const GOLD_SESSION_CONTEXT = {
  sydney: 'بداية الأسبوع العالمي واستئناف السيولة بعد عطلة نهاية الأسبوع.',
  tokyo: 'نافذة مفيدة لحركة آسيا والين مع هدوء نسبي مقارنة بلندن ونيويورك.',
  london: 'بداية السيولة الأقوى للذهب الفوري مع دخول المراكز الأوروبية.',
  newyork: 'أكثر الفترات حساسية لبيانات الدولار والسوق الأمريكي والذهب.',
};

const GOLD_MARKET_GUIDE = [
  {
    id: 'lbma',
    title: 'LBMA',
    subtitle: 'مرجع الذهب الفوري في لندن',
    body: 'يهتم به المتداول لأنه يعكس قلب التسعير المؤسسي للذهب الفوري مع بداية النشاط الأوروبي، ولذلك ترتبط نافذة لندن غالباً بأوضح حركة مبكرة على الذهب.',
  },
  {
    id: 'comex',
    title: 'COMEX',
    subtitle: 'عقود الذهب الآجلة في نيويورك',
    body: 'هنا تظهر عقود الذهب الأكثر متابعة في السوق الأمريكي. الفرق العملي أن العقود الآجلة لها مواصفات وتواريخ استحقاق، بينما كثير من المتداولين العرب يركزون على العقود الفورية أو عقود الفروقات.',
  },
  {
    id: 'otc',
    title: 'OTC',
    subtitle: 'سوق بين البنوك والمؤسسات',
    body: 'هذا هو السوق اللامركزي الذي يجعل الذهب يبدو وكأنه يعمل معظم اليوم. أهميته أنه يفسر لماذا لا يشبه الذهب ساعات متجر الذهب المحلي أو جلسة بورصة واحدة فقط.',
  },
];

const SESSION_PAIR_GUIDE = {
  sydney: {
    best: ['AUD/USD', 'NZD/USD'],
    worst: ['EUR/USD', 'GBP/USD'],
    reason: 'تبدأ السيولة الأسترالية والنيوزيلندية مبكراً بينما تبقى أوروبا وأمريكا هادئتين نسبياً.',
  },
  tokyo: {
    best: ['USD/JPY', 'AUD/JPY'],
    worst: ['GBP/USD', 'EUR/GBP'],
    reason: 'بنك اليابان والأخبار الآسيوية تجعل أزواج الين أوضح من الأزواج الأوروبية الثقيلة.',
  },
  london: {
    best: ['EUR/USD', 'GBP/USD'],
    worst: ['AUD/NZD', 'NZD/CAD'],
    reason: 'هذه أعلى ساعات السيولة الأوروبية وتكون الحركة على اليورو والجنيه أوضح وأسرع.',
  },
  newyork: {
    best: ['EUR/USD', 'USD/CAD', 'XAU/USD'],
    worst: ['AUD/NZD', 'EUR/CHF'],
    reason: 'الأخبار الأمريكية والدولار والذهب تتصدر المشهد مع بداية نيويورك وتداخلها مع لندن.',
  },
};

const WEEKLY_ECONOMIC_EVENTS = [
  { id: 'factories', dayOfWeek: 1, timeUtc: '14:30', currency: 'USD', impact: 'medium', nameAr: 'أوامر المصانع الأمريكية', sessionId: 'newyork' },
  { id: 'confidence', dayOfWeek: 2, timeUtc: '15:00', currency: 'USD', impact: 'medium', nameAr: 'مؤشر ثقة المستهلك الأمريكي', sessionId: 'newyork' },
  { id: 'jobless', dayOfWeek: 3, timeUtc: '14:30', currency: 'USD', impact: 'medium', nameAr: 'مطالبات البطالة الأمريكية', sessionId: 'newyork' },
  { id: 'boe', dayOfWeek: 4, timeUtc: '12:00', currency: 'GBP', impact: 'high', nameAr: 'مراجعة بنك إنجلترا الدورية', sessionId: 'london' },
  { id: 'nfp', dayOfWeek: 5, timeUtc: '13:30', currency: 'USD', impact: 'critical', nameAr: 'الوظائف الأمريكية NFP', sessionId: 'newyork' },
];

const PROFILE_RECOMMENDATIONS = {
  scalper: {
    title: 'مضاربة يومية قصيرة',
    summary: 'ركّز على تداخل لندن ونيويورك وتجنّب الساعات الرمادية.',
    detail: 'أفضل نافذة للمضاربة السريعة تكون عادةً عندما تتجمع السيولة والأوامر في وقت واحد، لذلك تبقى ساعة التداخل هي الأنسب غالباً لـ EUR/USD وXAU/USD.',
  },
  swing: {
    title: 'تداول أسبوعي',
    summary: 'استخدم هذه الصفحة لاختيار وقت المراقبة لا وقت الإفراط في الدخول.',
    detail: 'للتداول الأسبوعي، يكفيك ربط بداية لندن وأول ساعة من نيويورك بالأيام الثقيلة مثل الأربعاء والخميس ثم تقليل المتابعة في الفترات الأهدأ.',
  },
  news: {
    title: 'متابعة الأخبار والبيانات',
    summary: 'انتبه للنوافذ التي تسبق البيانات الأمريكية والإنجليزية مباشرة.',
    detail: 'هذا النمط يستفيد من معرفة توقيت الجلسة الأقرب للخبر، مع التحذير من أن ارتفاع النشاط لا يعني وضوح الاتجاه أو سهولة التنفيذ.',
  },
  gold: {
    title: 'تداول الذهب تحديداً',
    summary: 'راقب نافذة لندن ونيويورك مع تجنب الاستراحة اليومية للذهب.',
    detail: 'الذهب غالباً يستجيب بأوضح صورة عند دخول نيويورك على سيولة لندن القائمة، لذلك تتكرر أفضلية هذه النافذة أكثر من غيرها.',
  },
};

const NYSE_HOLIDAYS = [
  { date: '2026-01-01', nameAr: 'رأس السنة الميلادية', compensated: false },
  { date: '2026-01-19', nameAr: 'يوم مارتن لوثر كينج', compensated: false },
  { date: '2026-02-16', nameAr: 'يوم الرؤساء', compensated: false },
  { date: '2026-04-03', nameAr: 'الجمعة العظيمة', compensated: false },
  { date: '2026-05-25', nameAr: 'يوم الذكرى', compensated: false },
  { date: '2026-06-19', nameAr: 'جونتينث', compensated: false },
  { date: '2026-07-03', nameAr: 'تعويض عيد الاستقلال', compensated: true },
  { date: '2026-09-07', nameAr: 'عيد العمال', compensated: false },
  { date: '2026-11-26', nameAr: 'عيد الشكر', compensated: false },
  { date: '2026-12-25', nameAr: 'عيد الميلاد', compensated: false },
  { date: '2027-01-01', nameAr: 'رأس السنة الميلادية', compensated: false },
  { date: '2027-01-18', nameAr: 'يوم مارتن لوثر كينج', compensated: false },
  { date: '2027-02-15', nameAr: 'يوم الرؤساء', compensated: false },
  { date: '2027-03-26', nameAr: 'الجمعة العظيمة', compensated: false },
  { date: '2027-05-31', nameAr: 'يوم الذكرى', compensated: false },
  { date: '2027-06-18', nameAr: 'تعويض جونتينث', compensated: true },
  { date: '2027-07-05', nameAr: 'تعويض عيد الاستقلال', compensated: true },
  { date: '2027-09-06', nameAr: 'عيد العمال', compensated: false },
  { date: '2027-11-25', nameAr: 'عيد الشكر', compensated: false },
  { date: '2027-12-24', nameAr: 'تعويض عيد الميلاد', compensated: true },
];

const ARAB_MARKET_HOLIDAY_REFERENCES = {
  sa: [
    { date: '2026-02-22', nameAr: 'يوم التأسيس', exchange: 'تداول السعودي', statusLabel: 'مرجع ثابت' },
    { date: '2026-09-23', nameAr: 'اليوم الوطني السعودي', exchange: 'تداول السعودي', statusLabel: 'مرجع ثابت' },
  ],
  'ae-dfm': [
    { date: '2026-01-01', nameAr: 'رأس السنة الميلادية', exchange: 'بورصة دبي', statusLabel: 'مرجع ثابت' },
    { date: '2026-12-02', nameAr: 'اليوم الوطني الإماراتي', exchange: 'بورصة دبي', statusLabel: 'مرجع ثابت' },
  ],
  'ae-adx': [
    { date: '2026-01-01', nameAr: 'رأس السنة الميلادية', exchange: 'بورصة أبوظبي', statusLabel: 'مرجع ثابت' },
    { date: '2026-12-02', nameAr: 'اليوم الوطني الإماراتي', exchange: 'بورصة أبوظبي', statusLabel: 'مرجع ثابت' },
  ],
  kw: [
    { date: '2026-02-25', nameAr: 'العيد الوطني الكويتي', exchange: 'بورصة الكويت', statusLabel: 'مرجع ثابت' },
    { date: '2026-02-26', nameAr: 'عيد التحرير', exchange: 'بورصة الكويت', statusLabel: 'مرجع ثابت' },
  ],
  qa: [
    { date: '2026-12-18', nameAr: 'اليوم الوطني القطري', exchange: 'بورصة قطر', statusLabel: 'مرجع ثابت' },
  ],
  eg: [
    { date: '2026-01-07', nameAr: 'عيد الميلاد الشرقي', exchange: 'البورصة المصرية', statusLabel: 'مرجع شائع' },
    { date: '2026-07-23', nameAr: 'عيد الثورة', exchange: 'البورصة المصرية', statusLabel: 'مرجع شائع' },
  ],
};

const US_MARKET_SOURCE_LINKS = [
  {
    label: 'NYSE Hours & Calendars',
    url: 'https://www.nyse.com/markets/hours-calendars',
  },
  {
    label: 'Nasdaq Market Activity',
    url: 'https://www.nasdaq.com/market-activity',
  },
  {
    label: 'SEC Investor.gov',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/after-hours-trading',
  },
];

const GOLD_MARKET_SOURCE_LINKS = [
  {
    label: 'CME Group Trading Hours',
    url: 'https://www.cmegroup.com/trading-hours.html',
  },
  {
    label: 'OANDA Trading Hours',
    url: 'https://www.oanda.com/bvi-en/cfds/hours-of-operation/',
  },
  {
    label: 'Babypips Forex Market Hours',
    url: 'https://www.babypips.com/tools/forex-market-hours',
  },
];

const STOCK_MARKET_REFERENCE_MAP = {
  us: {
    marketLabel: 'السوق الأمريكي',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'NYSE Hours & Calendars',
      url: 'https://www.nyse.com/markets/hours-calendars',
    },
    supportSource: {
      label: 'Nasdaq Market Activity',
      url: 'https://www.nasdaq.com/market-activity',
    },
    note: 'نعرض الجلسة الرسمية والجلسات الموسعة وفق الساعات المعتادة، مع تحويلها إلى توقيت الزائر تلقائياً.',
  },
  sa: {
    marketLabel: 'تداول السعودي',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Saudi Exchange',
      url: 'https://www.saudiexchange.sa',
    },
    supportSource: null,
    note: 'أيام العمل المعتادة من الأحد إلى الخميس، وتُعرض الساعات هنا بحسب توقيت الزائر المحلي.',
  },
  uk: {
    marketLabel: 'بورصة لندن',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'London Stock Exchange',
      url: 'https://www.londonstockexchange.com',
    },
    supportSource: null,
    note: 'الحساب يعكس الساعات النقدية الأساسية لبورصة لندن مع مراعاة التوقيت الصيفي.',
  },
  jp: {
    marketLabel: 'بورصة طوكيو',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'JPX Trading Hours',
      url: 'https://www.jpx.co.jp/english/equities/trading/domestic/01.html',
    },
    supportSource: null,
    note: 'يتضمن الحساب الاستراحة الوسطية المعروفة في طوكيو عند تحويله إلى توقيت المستخدم.',
  },
  fr: {
    marketLabel: 'بورصة باريس',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Euronext Trading Hours',
      url: 'https://www.euronext.com/en/trading/trading-hours-holidays',
    },
    supportSource: null,
    note: 'تعرض الصفحة ساعات باريس النقدية الأساسية ضمن Euronext وفق توقيتك الحالي.',
  },
  de: {
    marketLabel: 'بورصة فرانكفورت',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Deutsche Boerse Xetra',
      url: 'https://www.xetra.com/xetra-en/trading/trading-calendar-and-trading-hours',
    },
    supportSource: null,
    note: 'تعرض الصفحة جلسة Xetra الأساسية الأكثر استخداماً في المتابعة العربية المختصرة.',
  },
  'ae-dfm': {
    marketLabel: 'بورصة دبي',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Dubai Financial Market',
      url: 'https://www.dfm.ae',
    },
    supportSource: null,
    note: 'هذه واحدة من أكثر البورصات الخليجية بحثاً، لذا أضفناها بجلسة عربية واضحة بتوقيت الزائر.',
  },
  'ae-adx': {
    marketLabel: 'بورصة أبوظبي',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Abu Dhabi Securities Exchange',
      url: 'https://www.adx.ae',
    },
    supportSource: null,
    note: 'تُعرض الساعات الاعتيادية الرئيسية لبورصة أبوظبي مع تحويلها مباشرة إلى توقيت المستخدم.',
  },
  kw: {
    marketLabel: 'بورصة الكويت',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Boursa Kuwait',
      url: 'https://www.boursakuwait.com.kw',
    },
    supportSource: null,
    note: 'أضفناها لأن البحث الخليجي عنها أعلى بكثير من حضورها الحالي في الأدوات العربية المبسطة.',
  },
  qa: {
    marketLabel: 'بورصة قطر',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Qatar Stock Exchange',
      url: 'https://www.qe.com.qa',
    },
    supportSource: null,
    note: 'تعرض الصفحة الساعات الاعتيادية لبورصة قطر بصياغة مباشرة تركز على سؤال الفتح الآن.',
  },
  eg: {
    marketLabel: 'البورصة المصرية',
    statusLabel: 'جلسة اعتيادية محسوبة',
    officialSource: {
      label: 'Egyptian Exchange',
      url: 'https://www.egx.com.eg',
    },
    supportSource: null,
    note: 'وجود البورصة المصرية مهم لأن كثيراً من المستخدمين العرب يبحثون عن توقيتها المحلي لا عن بورصات أوروبا فقط.',
  },
};

const TOOL_CARDS = [
  {
    href: '/economie/us-market-open',
    title: 'متى يفتح السوق الأمريكي؟',
    eyebrow: 'طلب يومي قوي',
    body: 'جواب مباشر بالعربية مع العد التنازلي للافتتاح الرسمي، وأول ساعة تداول، وجداول السعودية والإمارات ومصر والمغرب.',
    tone: 'warning',
    isLive: true,
  },
  {
    href: '/economie/gold-market-hours',
    title: 'هل الذهب مفتوح الآن؟',
    eyebrow: 'طلب يومي قوي',
    body: 'أوقات تداول الذهب بتوقيتك، وأفضل نافذة للسيولة، والاستراحة اليومية، وفارق الجلسات بين الخليج ومصر والمغرب.',
    tone: 'success',
    isLive: true,
  },
  {
    href: '/economie/forex-sessions',
    title: 'جلسات الفوركس والذهب',
    eyebrow: 'مباشر الآن',
    body: 'أداة حية تُظهر جلسات سيدني وطوكيو ولندن ونيويورك بتوقيت الزائر، مع حالة السوق الحالية والعد التنازلي.',
    tone: 'success',
    isLive: true,
  },
  {
    href: '/economie/stock-markets',
    title: 'البورصات العالمية الآن',
    eyebrow: 'مباشر الآن',
    body: 'تابع أهم الأسواق العالمية وحالة الفتح والإغلاق بتوقيتك المحلي، مع توقيت السوق الأمريكي والجلسات الموسعة.',
    tone: 'warning',
    isLive: true,
  },
  {
    href: '/economie/market-clock',
    title: 'ساعة التداول العالمية',
    eyebrow: 'أداة جديدة',
    body: 'ساعة بصرية على مدار 24 ساعة تُظهر جلسات الفوركس وتداخلها من منظور مدينتك، مع قراءة أسرع من الجداول التقليدية.',
    tone: 'brand',
    isLive: true,
  },
  {
    href: '/economie/best-trading-time',
    title: 'أفضل وقت للتداول',
    eyebrow: 'أداة جديدة',
    body: 'نوافذ التداول المثلى من مدينتك مع جدول أسبوعي، ونقاط سيولة، وتوقيتات عملية للذهب والأزواج الرئيسية.',
    tone: 'info',
    isLive: true,
  },
];

const formatterCache = new Map();

function getFormatter(timeZone, options) {
  const key = JSON.stringify([timeZone, options]);
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.DateTimeFormat(VIEWER_LOCALE, {
        timeZone,
        ...options,
      }),
    );
  }
  return formatterCache.get(key);
}

function formatTime(dateTime, timeZone, options = {}) {
  return getFormatter(timeZone, {
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  }).format(dateTime.toJSDate());
}

function formatDateLabel(dateTime, timeZone, options = {}) {
  return new Intl.DateTimeFormat(DATE_LABEL_LOCALE, {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(dateTime.toJSDate());
}

function formatHijriDateLabel(dateTime, timeZone) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
    timeZone,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateTime.toJSDate());
}

function getHijriMonth(dateTime, timeZone) {
  const month = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    timeZone,
    month: 'numeric',
  }).format(dateTime.toJSDate());
  return Number(month);
}

function formatWeekday(dateTime, timeZone, width = 'short') {
  return new Intl.DateTimeFormat(DATE_LABEL_LOCALE, {
    timeZone,
    weekday: width,
  }).format(dateTime.toJSDate());
}

function formatOffset(timeZone, at = DateTime.utc()) {
  const value = new Intl.DateTimeFormat('en', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(at.toJSDate()).find((part) => part.type === 'timeZoneName')?.value;
  return value || 'UTC';
}

function parseClock(clock) {
  const [hour, minute] = String(clock).split(':').map((value) => Number(value));
  return { hour, minute };
}

function toUtc(dateLike) {
  if (DateTime.isDateTime(dateLike)) return dateLike.toUTC();
  if (typeof dateLike === 'string') return DateTime.fromISO(dateLike, { zone: 'utc' }).toUTC();
  return DateTime.fromJSDate(dateLike instanceof Date ? dateLike : new Date(), { zone: 'utc' }).toUTC();
}

function formatDuration(totalMinutesRaw) {
  const totalMinutes = Math.max(0, Math.ceil(totalMinutesRaw));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (days > 0) parts.push(`${days} يوم`);
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} دقيقة`);

  return parts.join(' و');
}

function diffMinutes(later, earlier) {
  return later.diff(earlier, 'minutes').minutes;
}

function formatCountdownClock(totalSecondsRaw) {
  const totalSeconds = Math.max(0, Math.floor(totalSecondsRaw));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function getIntersection(a, b) {
  const start = a.startUtc > b.startUtc ? a.startUtc : b.startUtc;
  const end = a.endUtc < b.endUtc ? a.endUtc : b.endUtc;
  if (end <= start) return null;
  return { startUtc: start, endUtc: end };
}

function buildIntervals(nowUtc, timezone, sessions) {
  const localNow = nowUtc.setZone(timezone);
  const intervals = [];

  for (let offset = -2; offset <= 6; offset += 1) {
    const day = localNow.startOf('day').plus({ days: offset });
    for (const session of sessions) {
      if (!session.days.includes(day.weekday)) continue;

      const openParts = parseClock(session.open);
      const closeParts = parseClock(session.close);
      let startLocal = day.set({
        hour: openParts.hour,
        minute: openParts.minute,
        second: 0,
        millisecond: 0,
      });
      let endLocal = day.set({
        hour: closeParts.hour,
        minute: closeParts.minute,
        second: 0,
        millisecond: 0,
      });

      if (endLocal <= startLocal) {
        endLocal = endLocal.plus({ days: 1 });
      }

      intervals.push({
        label: session.label || null,
        startLocal,
        endLocal,
        startUtc: startLocal.toUTC(),
        endUtc: endLocal.toUTC(),
      });
    }
  }

  return intervals.sort((left, right) => left.startUtc.toMillis() - right.startUtc.toMillis());
}

function evaluateMarket(nowUtc, market) {
  const intervals = buildIntervals(nowUtc, market.timezone, market.sessions);
  const active = intervals.find((interval) => nowUtc >= interval.startUtc && nowUtc < interval.endUtc) || null;
  const next = intervals.find((interval) => interval.startUtc > nowUtc) || null;
  const previous = [...intervals].reverse().find((interval) => interval.endUtc <= nowUtc) || null;

  return {
    ...market,
    intervals,
    active,
    next,
    previous,
  };
}

function getWeekdayEventDate(nowUtc, viewerTimezone, weekday) {
  const viewerNow = nowUtc.setZone(viewerTimezone);
  const startOfWeek = viewerNow.startOf('week');
  return startOfWeek.plus({ days: weekday - 1 }).startOf('day');
}

function isFirstFridayOfMonth(dateTime) {
  return dateTime.weekday === 5 && dateTime.day <= 7;
}

function buildWeeklyEconomicEvents(nowUtc, viewerTimezone) {
  return WEEKLY_ECONOMIC_EVENTS.flatMap((event) => {
    const day = getWeekdayEventDate(nowUtc, viewerTimezone, event.dayOfWeek);
    if (event.id === 'nfp' && !isFirstFridayOfMonth(day)) return [];

    const { hour, minute } = parseClock(event.timeUtc);
    const eventUtc = DateTime.utc(day.year, day.month, day.day, hour, minute);
    const session = FOREX_SESSION_DEFS.find((item) => item.id === event.sessionId);
    const eventMeta = ECONOMIC_EVENT_INTELLIGENCE[event.id] || {};
    const countdownMinutes = diffMinutes(eventUtc, nowUtc);

    return [{
      key: `${event.id}-${eventUtc.toISODate()}`,
      nameAr: event.nameAr,
      currency: event.currency,
      impact: event.impact,
      impactLabel: event.impact === 'critical' ? 'حرج' : event.impact === 'high' ? 'عالي' : 'متوسط',
      sessionLabel: session?.nameAr || '--',
      timeLocal: formatTime(eventUtc, viewerTimezone),
      dateLabel: formatDateLabel(eventUtc, viewerTimezone, { weekday: 'long', day: 'numeric', month: 'long' }),
      countdownLabel: countdownMinutes > 0 ? `خلال ${formatDuration(countdownMinutes)}` : 'صدر أو مضى هذا الأسبوع',
      descriptionAr: eventMeta.descriptionAr || '',
      affectedPairs: eventMeta.affectedPairs || [],
      affectedPairsLabel: (eventMeta.affectedPairs || []).join('، '),
      surpriseRiskLabel: eventMeta.surpriseRiskLabel || 'متوسط',
      frequencyLabel: eventMeta.frequencyLabel || 'دوري',
      viewerDateTime: eventUtc.setZone(viewerTimezone),
    }];
  }).sort((left, right) => left.viewerDateTime.toMillis() - right.viewerDateTime.toMillis());
}

function getNextHighImpactEvent(nowUtc, viewerTimezone, weeklyEvents = buildWeeklyEconomicEvents(nowUtc, viewerTimezone)) {
  const viewerNow = nowUtc.setZone(viewerTimezone);
  return weeklyEvents.find((event) => (
    ['critical', 'high'].includes(event.impact)
      && event.viewerDateTime >= viewerNow
  )) || weeklyEvents.find((event) => ['critical', 'high'].includes(event.impact)) || null;
}

function buildUsCountdownHero(nowUtc, viewerTimezone) {
  const market = getMarketById('us');
  const state = evaluateMarket(nowUtc, market);
  const premarketState = evaluateMarket(nowUtc, {
    timezone: market.timezone,
    sessions: [market.premarket],
  });
  const afterhoursState = evaluateMarket(nowUtc, {
    timezone: market.timezone,
    sessions: [market.afterhours],
  });

  const inOpen = Boolean(state.active);
  const inPremarket = Boolean(premarketState.active);
  const inAfterhours = Boolean(afterhoursState.active);
  const nextInterval = state.active || state.next || state.intervals[0];
  const targetUtc = inOpen ? state.active.endUtc : nextInterval?.startUtc || nowUtc;
  const secondsRemaining = Math.max(0, Math.floor(targetUtc.diff(nowUtc, 'seconds').seconds));
  const clockLabel = formatCountdownClock(secondsRemaining);

  let phase = 'CLOSED';
  let title = 'السوق الأمريكي مغلق الآن';
  let detail = `يفتح خلال ${clockLabel}`;
  let tone = 'info';
  let browserTitle = `${clockLabel} | السوق الأمريكي مغلق — ${SITE_BRAND}`;

  if (inPremarket) {
    phase = 'PRE_MARKET';
    title = 'ما قبل السوق الأمريكي نشطة';
    detail = `الجرس الرسمي خلال ${clockLabel}`;
    tone = 'warning';
    browserTitle = `${clockLabel} | السوق يفتح — ${SITE_BRAND}`;
  } else if (inOpen) {
    phase = 'OPEN';
    title = 'السوق الأمريكي مفتوح الآن';
    detail = `يغلق خلال ${clockLabel}`;
    tone = 'success';
    browserTitle = `${clockLabel} | السوق مفتوح — ${SITE_BRAND}`;
  } else if (inAfterhours) {
    phase = 'AFTER_HOURS';
    title = 'السوق في ما بعد الإغلاق';
    detail = `الافتتاح التالي خلال ${clockLabel}`;
    tone = 'info';
    browserTitle = `${clockLabel} | ما بعد الإغلاق — ${SITE_BRAND}`;
  } else {
    const marketNow = nowUtc.setZone(market.timezone);
    if (marketNow.weekday === 6 || marketNow.weekday === 7) {
      phase = 'WEEKEND';
      title = 'عطلة نهاية الأسبوع في وول ستريت';
      detail = `العودة المتوقعة خلال ${clockLabel}`;
      tone = 'danger';
      browserTitle = `${clockLabel} | عطلة نهاية الأسبوع — ${SITE_BRAND}`;
    }
  }

  return {
    phase,
    title,
    detail,
    tone,
    clockLabel,
    openLabel: nextInterval ? formatTime(nextInterval.startUtc, viewerTimezone) : '--',
    closeLabel: nextInterval ? formatTime(nextInterval.endUtc, viewerTimezone) : '--',
    browserTitle,
  };
}

function buildNyseHolidayRows(nowUtc, viewerTimezone) {
  const rows = NYSE_HOLIDAYS.map((holiday) => {
    const date = DateTime.fromISO(holiday.date, { zone: 'utc' });
    return {
      date,
      key: holiday.date,
      cells: [
        formatDateLabel(date, viewerTimezone, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        formatHijriDateLabel(date, viewerTimezone),
        holiday.nameAr,
        holiday.compensated ? 'يوم تعويضي' : 'مغلق',
      ],
      isUpcoming: date >= nowUtc.startOf('day'),
    };
  });

  const nextHoliday = rows.find((item) => item.isUpcoming) || rows[0] || null;

  return {
    rows,
    nextHoliday,
    summary: nextHoliday
      ? `أقرب عطلة في الجدول هي ${nextHoliday.cells[2]} بعد ${formatDuration(diffMinutes(nextHoliday.date, nowUtc))}.`
      : 'لا توجد عطلة قادمة ضمن الجدول الحالي.',
  };
}

function buildUsCityClockRows(nowUtc) {
  return ARAB_REFERENCE_VIEWERS.map((viewerPreset) => {
    const focus = buildUsFocus(nowUtc, viewerPreset.timezone);
    return {
      id: viewerPreset.id,
      cityNameAr: viewerPreset.cityNameAr,
      countryNameAr: viewerPreset.countryNameAr,
      openLabel: focus.openLabel,
      closeLabel: focus.closeLabel,
    };
  });
}

function buildUsImpactCards(nowUtc, viewerTimezone) {
  const todayEvent = buildWeeklyEconomicEvents(nowUtc, viewerTimezone).find((event) => event.impact === 'critical' || event.impact === 'high');
  return [
    {
      title: 'أثر الافتتاح الأمريكي على الذهب',
      body: 'في أول 30 دقيقة من الافتتاح الأمريكي يتسارع عادةً تسعير الدولار والعوائد، ولهذا تصبح حركة XAU/USD أوضح وأحياناً أعنف من الساعات الهادئة.',
      href: '/economie/gold-market-hours',
      cta: 'متابعة الذهب الآن',
    },
    {
      title: 'أثر الافتتاح الأمريكي على النفط',
      body: 'مع دخول نيويورك تزداد حساسية خام WTI للأخبار الأمريكية وتوقعات المخزون والنمو، لذلك تتغير جودة الحركة كثيراً بين ما قبل الافتتاح وبداية الجلسة.',
      href: '/economie/market-clock',
      cta: 'قراءة ساعة السوق',
    },
    {
      title: 'ماذا لو كان اليوم فيه بيان كبير؟',
      body: todayEvent
        ? `${todayEvent.nameAr} يصدر ${todayEvent.timeLocal} بتوقيتك، لذلك قد تكون بداية الجلسة الأمريكية أكثر حدة من المعتاد على الذهب والأسهم والدولار.`
        : 'إذا كان اليوم فيه NFP أو CPI أو قرار فائدة، فتعامل مع أول ساعة بعد الافتتاح على أنها نافذة نشاط مرتفع لا ضمان لاتجاه واضح.',
      href: '/economie/best-trading-time',
      cta: 'أفضل وقت للتداول',
    },
  ];
}

function isRamadan(nowUtc, viewerTimezone) {
  return getHijriMonth(nowUtc, viewerTimezone) === 9;
}

function buildGoldActivityScore(nowUtc, viewerTimezone) {
  const gold = buildGoldState(nowUtc, viewerTimezone);
  const bestWindow = buildPreferredWindow(nowUtc, viewerTimezone);
  const weeklyEvents = buildWeeklyEconomicEvents(nowUtc, viewerTimezone);
  const hasCriticalUsdEventToday = weeklyEvents.some((event) => (
    ['critical', 'high'].includes(event.impact)
      && event.currency === 'USD'
      && event.viewerDateTime.hasSame(nowUtc.setZone(viewerTimezone), 'day')
  ));

  if (!gold.isActive) {
    return {
      score: gold.statusLabel.includes('عطلة') ? 8 : 18,
      label: gold.statusLabel.includes('عطلة') ? 'السوق مغلق تقريباً' : 'سيولة منخفضة جداً',
      tone: gold.tone,
    };
  }

  if (hasCriticalUsdEventToday) {
    return {
      score: 95,
      label: 'يوم بيانات قوية على الذهب',
      tone: 'warning',
    };
  }

  const activeSessions = FOREX_SESSION_DEFS.filter((session) => buildForexCard(nowUtc, viewerTimezone, session).isOpen);
  const activeIds = activeSessions.map((session) => session.id);

  if (bestWindow.isActive) {
    return { score: 88, label: 'ذروة نشاط الذهب الآن', tone: 'success' };
  }
  if (activeIds.includes('london')) {
    return { score: 68, label: 'لندن تدعم الذهب بوضوح', tone: 'success' };
  }
  if (activeIds.includes('newyork')) {
    return { score: 74, label: 'نيويورك ترفع حساسية الذهب', tone: 'warning' };
  }
  if (activeIds.includes('tokyo')) {
    return { score: 42, label: 'آسيا هادئة نسبياً', tone: 'info' };
  }

  return { score: 28, label: 'نشاط خفيف', tone: 'default' };
}

function buildArabMarketHolidayRows(viewerTimezone) {
  return Object.values(ARAB_MARKET_HOLIDAY_REFERENCES)
    .flat()
    .map((holiday) => {
      const date = DateTime.fromISO(holiday.date, { zone: 'utc' });
      return {
        key: `${holiday.exchange}-${holiday.date}`,
        cells: [
          holiday.exchange,
          formatDateLabel(date, viewerTimezone, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          formatHijriDateLabel(date, viewerTimezone),
          holiday.nameAr,
          holiday.statusLabel,
        ],
      };
    });
}

function buildTadawulDetail(nowUtc, viewerTimezone) {
  const market = getMarketById('sa');
  const main = buildExchangeCard(nowUtc, viewerTimezone, market);
  const pre = evaluateMarket(nowUtc, { timezone: market.timezone, sessions: [market.premarket] }).intervals[0];
  const after = evaluateMarket(nowUtc, { timezone: market.timezone, sessions: [market.afterhours] }).intervals[0];
  const weeklyHolidays = (ARAB_MARKET_HOLIDAY_REFERENCES.sa || []).map((item) => item.nameAr).join('، ');

  return {
    statusLabel: main.statusLabel,
    premarketLabel: pre ? `${formatTime(pre.startUtc, viewerTimezone)} - ${formatTime(pre.endUtc, viewerTimezone)}` : '--',
    regularLabel: `${main.openLabel} - ${main.closeLabel}`,
    afterhoursLabel: after ? `${formatTime(after.startUtc, viewerTimezone)} - ${formatTime(after.endUtc, viewerTimezone)}` : '--',
    note: `أيام المتابعة هذا الأسبوع: ${buildWeeklySnapshot(nowUtc, viewerTimezone).map((day) => day.label).join('، ')}.`,
    holidaysLabel: weeklyHolidays || 'تحقق من موقع تداول السعودي عند العطل الرسمية.',
    sourceUrl: 'https://www.saudiexchange.sa',
  };
}

function buildArabMarketsSummary(cards) {
  const arabCards = cards.filter((card) => getMarketById(card.id)?.region === 'arab');
  const openCards = arabCards.filter((card) => card.isOpen || card.statusLabel === 'على وشك الفتح');
  return {
    arabCards,
    arabMarketsOpenCount: openCards.length,
    arabMarketsTotal: arabCards.length,
    arabMarketsOpenNames: openCards.map((card) => card.nameAr),
  };
}

function getViewerLabel(viewer) {
  if (viewer.cityNameAr && viewer.countryNameAr) return `${viewer.cityNameAr}، ${viewer.countryNameAr}`;
  if (viewer.cityNameAr) return viewer.cityNameAr;
  if (viewer.countryNameAr) return viewer.countryNameAr;
  return 'توقيتك المحلي';
}

function getViewerSubLabel(viewer, nowUtc) {
  const offset = formatOffset(viewer.timezone, nowUtc);
  if (viewer.cityNameAr || viewer.countryNameAr) return `بتوقيت ${getViewerLabel(viewer)} · ${offset}`;
  return `المنطقة الزمنية الحالية · ${offset}`;
}

function getLocationNotice(viewer) {
  if (viewer.cityNameAr && viewer.countryNameAr) {
    return `نعرض الحسابات الآن اعتماداً على ${viewer.cityNameAr} في ${viewer.countryNameAr}.`;
  }
  if (viewer.cityNameAr) {
    return `نعرض الحسابات الآن اعتماداً على ${viewer.cityNameAr}.`;
  }
  return 'لم نطابق مدينة دقيقة من الخادم، لذا نعتمد المنطقة الزمنية المتاحة حالياً.';
}

function buildForexCard(nowUtc, viewerTimezone, sessionDef) {
  const intelligence = FOREX_SESSION_INTELLIGENCE[sessionDef.id] || {};
  const state = evaluateMarket(nowUtc, {
    timezone: sessionDef.timezone,
    sessions: [{ open: sessionDef.open, close: sessionDef.close, days: sessionDef.days }],
  });
  const isOpen = Boolean(state.active);
  const relevantInterval = state.active || state.next;
  const minutesUntil = relevantInterval
    ? diffMinutes(isOpen ? relevantInterval.endUtc : relevantInterval.startUtc, nowUtc)
    : 0;

  const statusLabel = isOpen
    ? 'مفتوحة الآن'
    : minutesUntil <= 90
      ? 'على وشك الفتح'
      : 'مغلقة الآن';

  return {
    id: sessionDef.id,
    nameAr: sessionDef.nameAr,
    flag: sessionDef.flag,
    tone: sessionDef.tone,
    statusLabel,
    statusTone: isOpen ? 'success' : minutesUntil <= 90 ? 'warning' : 'default',
    openLabel: relevantInterval ? formatTime(relevantInterval.startUtc, viewerTimezone) : '--',
    closeLabel: relevantInterval ? formatTime(relevantInterval.endUtc, viewerTimezone) : '--',
    countdownPrefix: isOpen ? 'تغلق خلال' : 'تفتح خلال',
    countdownLabel: formatDuration(minutesUntil),
    nextStartMinutes: state.next ? diffMinutes(state.next.startUtc, nowUtc) : minutesUntil,
    pairsLabel: sessionDef.pairs.join('، '),
    cityNameAr: intelligence.cityNameAr || sessionDef.nameAr,
    liquidityLabel: intelligence.liquidityLabel || 'سيولة متوسطة',
    volatilityLabel: intelligence.volatilityLabel || 'تقلب متوسط',
    bestFor: intelligence.bestFor || sessionDef.pairs.join('، '),
    watchLabel: intelligence.watchLabel || '',
    isOpen,
    nextStartUtc: state.next?.startUtc?.toISO() || null,
  };
}

function buildForexHero(cards) {
  const openIds = cards.filter((card) => card.isOpen).map((card) => card.id);
  const nextCard = [...cards]
    .filter((card) => card.nextStartUtc)
    .sort((left, right) => DateTime.fromISO(left.nextStartUtc).toMillis() - DateTime.fromISO(right.nextStartUtc).toMillis())[0];

  if (openIds.includes('london') && openIds.includes('newyork')) {
    return {
      label: 'نافذة السيولة العالية',
      tone: 'success',
      detail: 'تداخل لندن ونيويورك هو أعلى فترات النشاط على الأزواج الرئيسية والذهب.',
    };
  }

  if (openIds.includes('london')) {
    return {
      label: 'جلسة لندن نشطة',
      tone: 'success',
      detail: 'السيولة قوية على EUR/USD وGBP/USD وتبدأ التحركات الأوروبية الرئيسية.',
    };
  }

  if (openIds.includes('newyork')) {
    return {
      label: 'جلسة نيويورك نشطة',
      tone: 'warning',
      detail: 'الأدوات المرتبطة بالدولار والذهب تكون أكثر حساسية للأخبار الأمريكية.',
    };
  }

  if (openIds.includes('tokyo') || openIds.includes('sydney')) {
    return {
      label: 'الجلسة الآسيوية',
      tone: 'info',
      detail: 'النشاط يميل إلى أزواج الين والدولار الأسترالي مع سيولة أهدأ من أوروبا وأمريكا.',
    };
  }

  if (nextCard && nextCard.nextStartMinutes > 480) {
    return {
      label: 'عطلة نهاية الأسبوع',
      tone: 'danger',
      detail: 'السوق مغلق حالياً، ويعود عادة مع بداية جلسة سيدني في أول الأسبوع.',
    };
  }

  return {
    label: 'السوق هادئ',
    tone: 'default',
    detail: nextCard
      ? `${nextCard.nameAr} ${nextCard.countdownPrefix} ${nextCard.countdownLabel}.`
      : 'لا توجد جلسة رئيسية نشطة في هذه اللحظة.',
  };
}

function buildTimeline(nowUtc, viewerTimezone) {
  const viewerDayStart = nowUtc.setZone(viewerTimezone).startOf('day');
  const viewerDayEnd = viewerDayStart.plus({ days: 1 });

  const bars = FOREX_SESSION_DEFS.map((session) => {
    const state = evaluateMarket(nowUtc, {
      timezone: session.timezone,
      sessions: [{ open: session.open, close: session.close, days: session.days }],
    });

    const segments = state.intervals
      .map((interval) => ({
        startViewer: interval.startUtc.setZone(viewerTimezone),
        endViewer: interval.endUtc.setZone(viewerTimezone),
      }))
      .map((interval) => ({
        startViewer: interval.startViewer < viewerDayStart ? viewerDayStart : interval.startViewer,
        endViewer: interval.endViewer > viewerDayEnd ? viewerDayEnd : interval.endViewer,
      }))
      .filter((interval) => interval.endViewer > interval.startViewer)
      .map((interval) => ({
        startPercent: ((interval.startViewer.toMillis() - viewerDayStart.toMillis()) / (24 * 60 * 60 * 1000)) * 100,
        widthPercent: ((interval.endViewer.toMillis() - interval.startViewer.toMillis()) / (24 * 60 * 60 * 1000)) * 100,
      }));

    return {
      id: session.id,
      nameAr: session.nameAr,
      tone: session.tone,
      segments,
    };
  });

  const london = evaluateMarket(nowUtc, {
    timezone: 'Europe/London',
    sessions: [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }],
  });
  const newyork = evaluateMarket(nowUtc, {
    timezone: 'America/New_York',
    sessions: [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }],
  });

  const overlapSegments = [];
  for (const londonInterval of london.intervals) {
    for (const newYorkInterval of newyork.intervals) {
      const intersection = getIntersection(londonInterval, newYorkInterval);
      if (!intersection) continue;

      const startViewer = intersection.startUtc.setZone(viewerTimezone);
      const endViewer = intersection.endUtc.setZone(viewerTimezone);
      const clippedStart = startViewer < viewerDayStart ? viewerDayStart : startViewer;
      const clippedEnd = endViewer > viewerDayEnd ? viewerDayEnd : endViewer;

      if (clippedEnd <= clippedStart) continue;

      overlapSegments.push({
        startPercent: ((clippedStart.toMillis() - viewerDayStart.toMillis()) / (24 * 60 * 60 * 1000)) * 100,
        widthPercent: ((clippedEnd.toMillis() - clippedStart.toMillis()) / (24 * 60 * 60 * 1000)) * 100,
      });
    }
  }

  const hourLabels = Array.from({ length: 7 }, (_, index) => {
    const hour = index * 4;
    const mark = viewerDayStart.plus({ hours: hour });
    return {
      label: formatTime(mark, viewerTimezone),
      positionPercent: (hour / 24) * 100,
    };
  });

  return {
    bars,
    overlapSegments,
    nowPercent: ((nowUtc.setZone(viewerTimezone).toMillis() - viewerDayStart.toMillis()) / (24 * 60 * 60 * 1000)) * 100,
    hourLabels,
  };
}

function buildGoldState(nowUtc, viewerTimezone) {
  const londonNow = nowUtc.setZone('Europe/London');
  const dailyBreakStart = londonNow.startOf('day').set({ hour: 22, minute: 0, second: 0, millisecond: 0 });
  const dailyBreakEnd = dailyBreakStart.plus({ hours: 1 });
  const sydneyNext = evaluateMarket(nowUtc, {
    timezone: 'Australia/Sydney',
    sessions: [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }],
  }).next;

  const isWeekend = londonNow.weekday === 6 || (londonNow.weekday === 7 && londonNow.hour < 22);
  const inDailyBreak = londonNow >= dailyBreakStart && londonNow < dailyBreakEnd;
  const isActive = !isWeekend && !inDailyBreak;

  const overlap = buildPreferredWindow(nowUtc, viewerTimezone);
  const nextReopen = inDailyBreak ? dailyBreakEnd : isWeekend ? sydneyNext?.startUtc || null : null;

  return {
    isActive,
    statusLabel: isWeekend ? 'متوقف لعطلة نهاية الأسبوع' : isActive ? 'يتداول الآن' : 'فترة التوقف اليومية',
    tone: isWeekend ? 'danger' : isActive ? 'success' : 'warning',
    bestWindowLabel: `${overlap.startLabel} - ${overlap.endLabel}`,
    nextWindowLabel: nextReopen ? formatTime(nextReopen, viewerTimezone) : null,
    detail: isActive
      ? 'أعلى سيولة للذهب تكون غالباً أثناء تداخل لندن ونيويورك.'
      : 'توجد فترة صيانة يومية قصيرة، كما يتوقف السوق في عطلة نهاية الأسبوع.',
  };
}

function buildPreferredWindow(nowUtc, viewerTimezone) {
  const london = evaluateMarket(nowUtc, {
    timezone: 'Europe/London',
    sessions: [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }],
  });
  const newyork = evaluateMarket(nowUtc, {
    timezone: 'America/New_York',
    sessions: [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }],
  });

  const overlaps = [];
  for (const londonInterval of london.intervals) {
    for (const newYorkInterval of newyork.intervals) {
      const intersection = getIntersection(londonInterval, newYorkInterval);
      if (intersection) overlaps.push(intersection);
    }
  }
  const current = overlaps.find((interval) => nowUtc >= interval.startUtc && nowUtc < interval.endUtc);
  const next = overlaps.find((interval) => interval.startUtc > nowUtc);
  const target = current || next || overlaps[0];

  return {
    isActive: Boolean(current),
    startLabel: target ? formatTime(target.startUtc, viewerTimezone) : '--',
    endLabel: target ? formatTime(target.endUtc, viewerTimezone) : '--',
    durationMinutes: target ? diffMinutes(target.endUtc, target.startUtc) : 0,
    statusLabel: current
      ? 'نشطة الآن'
      : next
        ? `تبدأ خلال ${formatDuration(diffMinutes(next.startUtc, nowUtc))}`
        : 'غير متاحة',
  };
}

function buildForexActivityChart(nowUtc, viewerTimezone) {
  const viewerDayStart = nowUtc.setZone(viewerTimezone).startOf('day');
  const goldState = buildGoldState(nowUtc, viewerTimezone);

  const points = Array.from({ length: 24 }, (_, hour) => {
    const instant = viewerDayStart.plus({ hours: hour, minutes: 30 }).toUTC();
    const activeSessions = FOREX_SESSION_DEFS.filter((session) => {
      const state = evaluateMarket(instant, {
        timezone: session.timezone,
        sessions: [{ open: session.open, close: session.close, days: session.days }],
      });

      return Boolean(state.active);
    });

    const activeIds = activeSessions.map((session) => session.id);
    const overlapBonus = activeIds.includes('london') && activeIds.includes('newyork') ? 2 : 0;
    const score = activeSessions.length + overlapBonus;

    let band = 'quiet';
    let hint = 'فترة هادئة نسبياً';
    let note = 'مناسبة للمراجعة أو تتبع أزواج أهدأ من الذروة الأمريكية.';

    if (overlapBonus > 0) {
      band = 'peak';
      hint = 'ذروة السيولة مع تداخل لندن ونيويورك';
      note = 'هذه الساعة غالباً هي الأفضل لـ EUR/USD وXAU/USD لأن السيولة الأوروبية والأمريكية تعمل معاً.';
    } else if (activeIds.includes('london') || activeIds.includes('newyork')) {
      band = 'active';
      hint = 'سيولة جيدة على الأزواج الرئيسية';
      note = activeIds.includes('newyork')
        ? 'نافذة حساسة لبيانات الدولار والذهب مع تحسن واضح في النشاط.'
        : 'بداية أوروبا تمنح السوق وضوحاً أعلى من ساعات آسيا الهادئة.';
    } else if (activeSessions.length >= 2) {
      band = 'warm';
      hint = 'تداخل متوسط مناسب للمتابعة';
      note = 'يوجد تداخل متوسط بين أكثر من جلسة لكنه لا يصل عادة إلى ذروة لندن ونيويورك.';
    }

    return {
      key: `${hour}`,
      hour,
      hourLabel: formatTime(viewerDayStart.plus({ hours: hour }), viewerTimezone),
      score,
      activeCount: activeSessions.length,
      band,
      hint,
      sessions: activeSessions.map((session) => session.nameAr),
      sessionsLabel: activeSessions.length
        ? activeSessions.map((session) => session.nameAr).join(' + ')
        : 'لا توجد جلسة رئيسية',
      bestPairs: activeSessions.flatMap((session) => SESSION_PAIR_GUIDE[session.id]?.best || []).slice(0, 3),
      goldStatus: overlapBonus > 0 ? 'نافذة سيولة عالية للذهب' : goldState.isActive ? 'الذهب يعمل لكن النشاط متفاوت' : goldState.statusLabel,
      note,
      isCurrent: instant.hour === nowUtc.setZone(viewerTimezone).hour,
    };
  });

  return {
    points,
    maxScore: Math.max(...points.map((point) => point.score), 1),
  };
}

function buildTradingWeekWindows(nowUtc, viewerTimezone) {
  const viewerNow = nowUtc.setZone(viewerTimezone);
  const viewerWeekStart = viewerNow.startOf('week');

  return Array.from({ length: 5 }, (_, index) => {
    const day = viewerWeekStart.plus({ days: index + 1 });
    const referenceUtc = day.set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toUTC();
    const viewerDayStart = day.startOf('day');
    const viewerDayEnd = viewerDayStart.plus({ days: 1 });

    const londonIntervals = buildIntervals(referenceUtc, 'Europe/London', [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }]);
    const newYorkIntervals = buildIntervals(referenceUtc, 'America/New_York', [{ open: '08:00', close: '17:00', days: [1, 2, 3, 4, 5] }]);

    const londonInterval = londonIntervals.find((interval) => {
      const startViewer = interval.startUtc.setZone(viewerTimezone);
      return startViewer >= viewerDayStart && startViewer < viewerDayEnd;
    }) || londonIntervals.find((interval) => interval.endUtc.setZone(viewerTimezone) > viewerDayStart);

    const newYorkInterval = newYorkIntervals.find((interval) => {
      const startViewer = interval.startUtc.setZone(viewerTimezone);
      return startViewer >= viewerDayStart && startViewer < viewerDayEnd;
    }) || newYorkIntervals.find((interval) => interval.endUtc.setZone(viewerTimezone) > viewerDayStart);

    const overlap = londonInterval && newYorkInterval ? getIntersection(londonInterval, newYorkInterval) : null;
    const firstHourEnd = newYorkInterval ? newYorkInterval.startUtc.plus({ hours: 1 }) : null;

    return {
      key: day.toISODate(),
      dayLabel: formatWeekday(day, viewerTimezone, 'long'),
      dateLabel: formatDateLabel(day, viewerTimezone, { weekday: undefined, day: 'numeric', month: 'long' }),
      overlapLabel: overlap
        ? `${formatTime(overlap.startUtc, viewerTimezone)} - ${formatTime(overlap.endUtc, viewerTimezone)}`
        : '--',
      londonLeadLabel: londonInterval
        ? `${formatTime(londonInterval.startUtc, viewerTimezone)} - ${formatTime(londonInterval.startUtc.plus({ hours: 2 }), viewerTimezone)}`
        : '--',
      usOpenLabel: newYorkInterval && firstHourEnd
        ? `${formatTime(newYorkInterval.startUtc, viewerTimezone)} - ${formatTime(firstHourEnd, viewerTimezone)}`
        : '--',
    };
  });
}

function buildSessionPairRows() {
  return FOREX_SESSION_DEFS.map((session) => ({
    key: session.id,
    cells: [
      session.nameAr,
      (SESSION_PAIR_GUIDE[session.id]?.best || []).join('، '),
      SESSION_PAIR_GUIDE[session.id]?.reason || '--',
      (SESSION_PAIR_GUIDE[session.id]?.worst || []).join('، '),
    ],
  }));
}

function buildDstImpactRows(nowUtc) {
  return ARAB_REFERENCE_VIEWERS.map((viewerPreset) => {
    const january = DateTime.utc(nowUtc.year, 1, 15, 12, 0);
    const july = DateTime.utc(nowUtc.year, 7, 15, 12, 0);
    const winterFocus = buildUsFocus(january, viewerPreset.timezone);
    const summerFocus = buildUsFocus(july, viewerPreset.timezone);

    return {
      key: viewerPreset.id,
      cells: [
        viewerPreset.cityNameAr,
        winterFocus.openLabel,
        summerFocus.openLabel,
        `الفارق الصيفي في ${viewerPreset.countryNameAr} يتأثر أساساً بتبدل لندن ونيويورك لا بالمدينة العربية نفسها.`,
      ],
    };
  });
}

function buildDayComparisonRows(nowUtc, viewerTimezone) {
  const viewerNow = nowUtc.setZone(viewerTimezone);
  return [0, 1].map((offset) => {
    const target = viewerNow.plus({ days: offset }).startOf('day').toUTC();
    const weeklyEvents = buildWeeklyEconomicEvents(target, viewerTimezone).filter((event) => (
      event.viewerDateTime.hasSame(target.setZone(viewerTimezone), 'day')
    ));
    const peakHours = buildForexActivityChart(target, viewerTimezone).points.filter((point) => point.band === 'peak').length;

    return {
      key: offset === 0 ? 'today' : 'tomorrow',
      dayLabel: offset === 0 ? 'اليوم' : 'غداً',
      summary: weeklyEvents.length
        ? `${weeklyEvents[0].nameAr} ضمن جلسة ${weeklyEvents[0].sessionLabel}`
        : 'لا يوجد حدث رئيسي ثابت في هذا النموذج',
      peakLabel: peakHours > 0 ? 'تداخل قوي حاضر' : 'يوم أهدأ نسبياً',
      note: weeklyEvents.length > 1 ? `${weeklyEvents.length} أحداث مدرجة هذا اليوم.` : 'التركيز الأساسي يبقى على الجلسات نفسها.',
    };
  });
}

function buildNowRecommendation(nowUtc, viewerTimezone) {
  const chart = buildForexActivityChart(nowUtc, viewerTimezone);
  const currentHour = nowUtc.setZone(viewerTimezone).hour;
  const currentPoint = chart.points.find((point) => point.hour === currentHour) || chart.points[0];

  if (currentPoint.band === 'peak') {
    return {
      title: 'الآن ذروة لندن ونيويورك',
      body: 'هذه الساعة من أفضل الساعات لمتابعة EUR/USD وXAU/USD إذا كنت تبحث عن حركة أوضح وسيولة أعلى.',
      tone: 'success',
    };
  }
  if (currentPoint.band === 'active') {
    return {
      title: 'الآن مناسب للمتابعة المركزة',
      body: currentPoint.sessions.includes('نيويورك')
        ? 'جلسة نيويورك تعطي الدولار والذهب وزناً أعلى الآن، لذلك تابع الأخبار الأمريكية والأصول المرتبطة بها.'
        : 'جلسة لندن تمنح الأزواج الأوروبية وضوحاً جيداً قبل الذروة الأمريكية.',
      tone: 'warning',
    };
  }
  if (currentPoint.band === 'warm') {
    return {
      title: 'الآن تداخل متوسط',
      body: 'توجد حركة معقولة لكن ليست في أقصى نشاطها، لذا يصلح الوقت للمراقبة أو لخطط أقل اندفاعاً.',
      tone: 'info',
    };
  }
  return {
    title: 'السوق هادئ نسبياً الآن',
    body: 'هذه الفترة أنسب للمراجعة والتخطيط أو متابعة الأزواج الأهدأ بدلاً من البحث عن ذروة حركة غير موجودة.',
    tone: 'default',
  };
}

function buildCityComparisonModel(viewer, nowUtc, selectedCityId = 'sa') {
  const comparePreset = ARAB_REFERENCE_VIEWERS.find((item) => item.id === selectedCityId) || ARAB_REFERENCE_VIEWERS[0];
  const viewerBest = buildPreferredWindow(nowUtc, viewer.timezone);
  const compareBest = buildPreferredWindow(nowUtc, comparePreset.timezone);
  const viewerOffset = nowUtc.setZone(viewer.timezone).offset;
  const compareOffset = nowUtc.setZone(comparePreset.timezone).offset;
  const diffHours = (compareOffset - viewerOffset) / 60;

  return {
    compareCityId: comparePreset.id,
    compareCityNameAr: comparePreset.cityNameAr,
    compareCountryNameAr: comparePreset.countryNameAr,
    timeDiffLabel: diffHours === 0 ? 'نفس التوقيت' : `${diffHours > 0 ? '+' : ''}${diffHours} ساعة`,
    viewerPeakLabel: `${viewerBest.startLabel} - ${viewerBest.endLabel}`,
    comparePeakLabel: `${compareBest.startLabel} - ${compareBest.endLabel}`,
    summary: diffHours === 0
      ? 'هذه المدينتان تتحركان تقريباً على نفس يوم التداول.'
      : diffHours > 0
        ? `${comparePreset.cityNameAr} تسبق مدينتك، لذلك تبدأ نافذة الذروة هناك أبكر على الساعة المحلية.`
        : `${comparePreset.cityNameAr} تتأخر عن مدينتك، لذلك تبقى نافذة الذروة هناك في وقت محلي مختلف.`,
  };
}

function buildWorstTradingRows(nowUtc, viewerTimezone) {
  const maintenance = buildGoldMaintenanceWindow(nowUtc, viewerTimezone);
  const firstEvent = buildWeeklyEconomicEvents(nowUtc, viewerTimezone).find((event) => ['critical', 'high'].includes(event.impact));
  return [
    {
      key: 'first-hour',
      cells: ['أول دقائق الجلسة الجديدة', 'التذبذب قد يكون أسرع من قدرة بعض الخطط على التكيف', 'خفف الاندفاع وانتظر وضوح الاتجاه إن لم تكن تعتمد على الافتتاح'],
    },
    {
      key: 'news',
      cells: ['قبل وبعد الأخبار العالية التأثير', firstEvent ? `${firstEvent.nameAr} مثال مباشر هذا الأسبوع.` : 'البيانات الكبرى قد توسع الفروقات وتضعف وضوح التنفيذ.', 'اربط هذه الصفحة دائماً بوقت الخبر لا بالسيولة وحدها'],
    },
    {
      key: 'gold-break',
      cells: ['استراحة الذهب اليومية', `${maintenance.startLabel} - ${maintenance.endLabel}`, 'تجنب اعتبار هذه الفترة نشاطاً طبيعياً للذهب العالمي'],
    },
    {
      key: 'late-friday',
      cells: ['نهاية الجمعة في نيويورك', 'السيولة تضعف ويقترب إغلاق الأسبوع', 'يفضل تقليل المجازفة أو الاكتفاء بالمراجعة والتحضير'],
    },
  ];
}

function buildExchangeCard(nowUtc, viewerTimezone, market) {
  const intelligence = STOCK_MARKET_INTELLIGENCE[market.id] || {};
  const state = evaluateMarket(nowUtc, market);
  const marketNow = nowUtc.setZone(market.timezone);
  const sourceMeta = STOCK_MARKET_REFERENCE_MAP[market.id] || null;
  const isOpen = Boolean(state.active);
  const next = state.next;
  const currentOrNext = state.active || next;
  const nextMinutes = currentOrNext
    ? diffMinutes(isOpen ? currentOrNext.endUtc : currentOrNext.startUtc, nowUtc)
    : 0;
  const inPremarket = market.premarket
    ? Boolean(evaluateMarket(nowUtc, {
      timezone: market.timezone,
      sessions: [market.premarket],
    }).active)
    : false;
  const inAfterhours = market.afterhours
    ? Boolean(evaluateMarket(nowUtc, {
      timezone: market.timezone,
      sessions: [market.afterhours],
    }).active)
    : false;

  let statusLabel = isOpen ? 'مفتوحة الآن' : 'مغلقة الآن';
  let statusTone = isOpen ? 'success' : 'default';

  if (inPremarket) {
    statusLabel = 'ما قبل السوق';
    statusTone = 'warning';
  } else if (inAfterhours) {
    statusLabel = 'ما بعد الإغلاق';
    statusTone = 'info';
  } else if (!isOpen && nextMinutes <= 75) {
    statusLabel = 'على وشك الفتح';
    statusTone = 'warning';
  }

  return {
    id: market.id,
    nameAr: market.nameAr,
    shortNameAr: market.shortNameAr,
    flag: market.flag,
    region: market.region,
    tone: market.tone,
    statusLabel,
    statusTone,
    marketTimeLabel: `${formatTime(nowUtc, market.timezone)} · ${formatWeekday(nowUtc, market.timezone)}`,
    viewerTimeLabel: `${formatTime(nowUtc, viewerTimezone)} · ${formatWeekday(nowUtc, viewerTimezone)}`,
    openLabel: currentOrNext ? formatTime(currentOrNext.startUtc, viewerTimezone) : '--',
    closeLabel: currentOrNext ? formatTime(currentOrNext.endUtc, viewerTimezone) : '--',
    countdownPrefix: isOpen ? 'تغلق خلال' : 'تفتح خلال',
    countdownLabel: formatDuration(nextMinutes),
    phaseLabel: 'الجلسة الاعتيادية',
    regionLabelAr: intelligence.regionLabelAr || (market.region === 'arab' ? 'عربي' : 'عالمي'),
    cityNameAr: intelligence.cityNameAr || market.nameAr,
    localCurrency: intelligence.localCurrency || '--',
    referenceIndex: intelligence.referenceIndex || '--',
    liquidityTierLabel: intelligence.liquidityTierLabel || 'سيولة اعتيادية',
    catalystLabel: intelligence.catalystLabel || '',
    note: market.note || null,
    sourceLabel: 'الساعات الرسمية المعتادة',
    sourceUrl: sourceMeta?.officialSource?.url || null,
    syncLabel: `آخر حساب: ${formatDateLabel(nowUtc, viewerTimezone, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })}`,
    trustNote: 'يعكس هذا الجواب الساعات الاعتيادية المعتادة، لذا يجب مراجعة الجهة الرسمية في العطل والإغلاقات الخاصة.',
    isOpen,
  };
}

function buildUsFocus(nowUtc, viewerTimezone) {
  const us = STOCK_MARKETS.find((market) => market.id === 'us');
  const london = STOCK_MARKETS.find((market) => market.id === 'uk');
  const usState = evaluateMarket(nowUtc, us);
  const londonState = evaluateMarket(nowUtc, london);
  const overlap = [];

  for (const usInterval of usState.intervals) {
    for (const londonInterval of londonState.intervals) {
      const intersection = getIntersection(usInterval, londonInterval);
      if (intersection) overlap.push(intersection);
    }
  }

  const upcomingOverlap = overlap.find((interval) => interval.endUtc > nowUtc) || overlap[0];
  const nextUsInterval = usState.active || usState.next || usState.intervals[0];

  return {
    openLabel: nextUsInterval ? formatTime(nextUsInterval.startUtc, viewerTimezone) : '--',
    firstHourLabel: nextUsInterval
      ? `${formatTime(nextUsInterval.startUtc, viewerTimezone)} - ${formatTime(nextUsInterval.startUtc.plus({ hours: 1 }), viewerTimezone)}`
      : '--',
    overlapLabel: upcomingOverlap
      ? `${formatTime(upcomingOverlap.startUtc, viewerTimezone)} - ${formatTime(upcomingOverlap.endUtc, viewerTimezone)}`
      : '--',
    closeLabel: nextUsInterval ? formatTime(nextUsInterval.endUtc, viewerTimezone) : '--',
  };
}

function buildUsExtendedHours(nowUtc, viewerTimezone) {
  const market = STOCK_MARKETS.find((item) => item.id === 'us');
  const pre = evaluateMarket(nowUtc, {
    timezone: market.timezone,
    sessions: [market.premarket],
  }).intervals[0];
  const after = evaluateMarket(nowUtc, {
    timezone: market.timezone,
    sessions: [market.afterhours],
  }).intervals[0];

  return {
    premarketLabel: pre ? `${formatTime(pre.startUtc, viewerTimezone)} - ${formatTime(pre.endUtc, viewerTimezone)}` : '--',
    afterhoursLabel: after ? `${formatTime(after.startUtc, viewerTimezone)} - ${formatTime(after.endUtc, viewerTimezone)}` : '--',
    note: 'الجلسات الموسعة أقل سيولة من الجلسة الرسمية وغالباً ما تتسع فيها الفروقات السعرية.',
  };
}

function buildWeeklySnapshot(nowUtc, viewerTimezone) {
  const viewerNow = nowUtc.setZone(viewerTimezone);
  return Array.from({ length: 5 }, (_, index) => {
    const day = viewerNow.startOf('week').plus({ days: index + 1 });
    return {
      label: formatWeekday(day, viewerTimezone, 'long'),
      dateLabel: formatDateLabel(day, viewerTimezone, { weekday: undefined, day: 'numeric', month: 'long' }),
    };
  });
}

function buildStockSourceRows(nowUtc, viewerTimezone, cards) {
  return cards.map((card) => {
    const meta = STOCK_MARKET_REFERENCE_MAP[card.id];

    return {
      id: card.id,
      marketLabel: meta?.marketLabel || card.nameAr,
      modeLabel: meta?.statusLabel || 'جلسة اعتيادية محسوبة',
      statusSource: {
        label: `محرك ${SITE_BRAND} للساعات الاعتيادية`,
        url: null,
      },
      officialSource: meta?.officialSource || null,
      supportSource: meta?.supportSource || null,
      syncLabel: `آخر حساب: ${formatDateLabel(nowUtc, viewerTimezone, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })}`,
      note: meta?.note || card.note || '',
    };
  });
}

function buildStockTrustPoints() {
  return [
    {
      title: 'المجاني أولاً',
      body: 'هذه الصفحات لا تعتمد على مزود مدفوع أو خدمة خارجية لازمة للتشغيل، بل على الساعات الرسمية المعتادة وتحويل المناطق الزمنية الحقيقي.',
    },
    {
      title: 'أين تكون دقيقة جداً؟',
      body: 'هي دقيقة جداً في الساعات الاعتيادية اليومية والجلسات الموسعة المعروفة، خصوصاً بعد تحويلها لتوقيت الزائر مع التوقيت الصيفي.',
    },
    {
      title: 'ما الذي يحتاج تحققاً إضافياً؟',
      body: 'العطل الرسمية والإغلاقات الخاصة والطوارئ السوقية تحتاج دائماً مراجعة البورصة أو الوسيط أو الإعلان الرسمي قبل التنفيذ الفعلي.',
    },
  ];
}

function getMarketById(marketId) {
  return STOCK_MARKETS.find((market) => market.id === marketId);
}

function getSessionById(sessionId) {
  return FOREX_SESSION_DEFS.find((session) => session.id === sessionId);
}

function buildUsCountryOpenRows(nowUtc) {
  const usMarket = getMarketById('us');

  return ARAB_REFERENCE_VIEWERS.map((viewerPreset) => {
    const focus = buildUsFocus(nowUtc, viewerPreset.timezone);
    const card = buildExchangeCard(nowUtc, viewerPreset.timezone, usMarket);

    return {
      key: viewerPreset.id,
      cells: [
        viewerPreset.countryNameAr,
        focus.openLabel,
        focus.firstHourLabel,
        focus.closeLabel,
        card.statusLabel,
      ],
    };
  });
}

function buildUsCountryExtendedRows(nowUtc) {
  return ARAB_REFERENCE_VIEWERS.map((viewerPreset) => {
    const extended = buildUsExtendedHours(nowUtc, viewerPreset.timezone);
    return {
      key: `${viewerPreset.id}-extended`,
      cells: [
        viewerPreset.countryNameAr,
        extended.premarketLabel,
        extended.afterhoursLabel,
        'الجلسات الموسعة أقل سيولة من الجلسة الرسمية وقد تتسع فيها الفروقات السعرية.',
      ],
    };
  });
}

function buildGoldMaintenanceWindow(nowUtc, viewerTimezone) {
  const londonNow = nowUtc.setZone('Europe/London');
  const maintenanceStart = londonNow.startOf('day').set({
    hour: 22,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const maintenanceEnd = maintenanceStart.plus({ hours: 1 });

  return {
    startLabel: formatTime(maintenanceStart, viewerTimezone),
    endLabel: formatTime(maintenanceEnd, viewerTimezone),
  };
}

function buildGoldSessionRows(nowUtc, viewerTimezone) {
  return FOREX_SESSION_DEFS.map((sessionDef) => {
    const card = buildForexCard(nowUtc, viewerTimezone, sessionDef);

    return {
      key: sessionDef.id,
      cells: [
        sessionDef.nameAr,
        card.openLabel,
        card.closeLabel,
        GOLD_SESSION_CONTEXT[sessionDef.id],
      ],
    };
  });
}

function buildGoldCountryRows(nowUtc) {
  return ARAB_REFERENCE_VIEWERS.map((viewerPreset) => {
    const regionalBestWindow = buildPreferredWindow(nowUtc, viewerPreset.timezone);
    const regionalGold = buildGoldState(nowUtc, viewerPreset.timezone);
    const maintenance = buildGoldMaintenanceWindow(nowUtc, viewerPreset.timezone);

    return {
      key: viewerPreset.id,
      cells: [
        viewerPreset.countryNameAr,
        `${regionalBestWindow.startLabel} - ${regionalBestWindow.endLabel}`,
        `${maintenance.startLabel} - ${maintenance.endLabel}`,
        regionalGold.statusLabel,
      ],
    };
  });
}

function buildLandingStatCards() {
  const arabMarketCount = STOCK_MARKETS.filter((market) => market.region === 'arab').length;
  const globalMarketCount = STOCK_MARKETS.filter((market) => market.region === 'global').length;

  return [
    {
      label: 'الأدوات الحية',
      value: `${TOOL_CARDS.filter((card) => card.isLive).length}`,
      detail: 'صفحات تبني الجواب المباشر من توقيت الزائر نفسه.',
      tone: 'success',
    },
    {
      label: 'الأسواق المغطاة',
      value: `${globalMarketCount + arabMarketCount}`,
      detail: `${arabMarketCount} سوقاً عربياً و${globalMarketCount} سوقاً عالمياً داخل نفس المحرك.`,
      tone: 'warning',
    },
    {
      label: 'طبقات البيانات',
      value: 'جلسات + عطل + أحداث',
      detail: 'لم نعد نعرض الوقت فقط، بل سياق السيولة والأحداث والعطل أيضاً.',
      tone: 'info',
    },
  ];
}

function buildLandingPremiumSections() {
  return [
    {
      title: 'جواب مباشر لا لوحة مزدحمة',
      body: 'التركيز هنا على السؤال الذي يفتحه المتداول العربي كل يوم: هل السوق مفتوح الآن، ما أفضل نافذة، وما أقرب حدث قد يغيّر الحركة؟',
    },
    {
      title: 'محرك وقت عربي حقيقي',
      body: 'المحرك يتعامل مع التوقيت الصيفي، المدن العربية المرجعية، العطل، والجلسات الموسعة بدل الاكتفاء بنقل توقيت نيويورك أو لندن كما هو.',
    },
    {
      title: 'جاهز للتوسع إلى صفحات مدن',
      body: 'كل طبقة بُنيت لتصلح لاحقاً لصفحات مثل "بتوقيت الرياض" و"بتوقيت الكويت" و"بتوقيت الدار البيضاء" على نفس البنية.',
    },
  ];
}

function buildForexSignalCards(nowUtc, viewerTimezone, cards, bestWindow, weeklyEvents, hero) {
  const nextEvent = getNextHighImpactEvent(nowUtc, viewerTimezone, weeklyEvents);
  return [
    {
      label: 'الجلسات المفتوحة الآن',
      value: `${cards.filter((card) => card.isOpen).length}/4`,
      detail: hero.detail,
      tone: hero.tone,
    },
    {
      label: 'مدة نافذة الذروة',
      value: `${Math.round((bestWindow.durationMinutes || 0) / 60)} ساعات`,
      detail: `${bestWindow.startLabel} - ${bestWindow.endLabel}`,
      tone: bestWindow.isActive ? 'success' : 'warning',
    },
    {
      label: 'أقرب حدث قوي',
      value: nextEvent ? nextEvent.nameAr : 'لا حدث مرتفع قريب',
      detail: nextEvent ? `${nextEvent.timeLocal} · ${nextEvent.sessionLabel}` : 'المحرك الثابت لم يجد حدثاً أقرب',
      tone: nextEvent ? 'warning' : 'info',
    },
  ];
}

function buildStockSignalCards(globalCards, arabCards, usFocus, viewerTimezone, nowUtc) {
  const nextEvent = getNextHighImpactEvent(nowUtc, viewerTimezone);
  return [
    {
      label: 'الأسواق العالمية المفتوحة',
      value: `${globalCards.filter((card) => card.isOpen).length}/${globalCards.length}`,
      detail: 'قراءة سريعة لوضع البورصات الكبرى الآن.',
      tone: 'warning',
    },
    {
      label: 'الأسواق العربية المفتوحة',
      value: `${arabCards.filter((card) => card.isOpen).length}/${arabCards.length}`,
      detail: 'تغطي الخليج ومصر داخل نفس اللوحة.',
      tone: 'success',
    },
    {
      label: 'جرس نيويورك',
      value: usFocus.openLabel,
      detail: nextEvent ? `أقرب حدث قوي: ${nextEvent.nameAr}` : 'مفيد لمزامنة يومك مع وول ستريت',
      tone: 'info',
    },
  ];
}

function buildUsSignalCards(base, countdownHero, weeklyEvents, nextHolidaySummary) {
  const nextEvent = getNextHighImpactEvent(toUtc(base.nowIso), base.viewer.timezone, weeklyEvents);
  return [
    {
      label: 'مرحلة الجلسة',
      value: countdownHero.phase === 'OPEN' ? 'مفتوح' : countdownHero.phase === 'PRE_MARKET' ? 'ما قبل السوق' : 'مغلق',
      detail: countdownHero.detail,
      tone: countdownHero.tone,
    },
    {
      label: 'أول ساعة',
      value: base.usFocus.firstHourLabel,
      detail: 'أهم نافذة للمراقبة السريعة في الأسهم الأمريكية.',
      tone: 'warning',
    },
    {
      label: 'الحدث القادم',
      value: nextEvent ? nextEvent.nameAr : 'لا حدث قوي قريب',
      detail: nextEvent ? `${nextEvent.timeLocal} · ${nextEvent.affectedPairsLabel}` : nextHolidaySummary,
      tone: nextEvent ? 'danger' : 'info',
    },
  ];
}

function buildGoldSignalCards(goldActivity, bestWindow, maintenanceWindow, weeklyEvents, viewerTimezone, nowUtc) {
  const nextEvent = getNextHighImpactEvent(nowUtc, viewerTimezone, weeklyEvents);
  return [
    {
      label: 'مؤشر النشاط',
      value: `${goldActivity.score}/100`,
      detail: goldActivity.label,
      tone: goldActivity.tone,
    },
    {
      label: 'أفضل نافذة اليوم',
      value: `${bestWindow.startLabel} - ${bestWindow.endLabel}`,
      detail: `مدتها التقريبية ${Math.round((bestWindow.durationMinutes || 0) / 60)} ساعات`,
      tone: bestWindow.isActive ? 'success' : 'warning',
    },
    {
      label: 'التوقف اليومي',
      value: `${maintenanceWindow.startLabel} - ${maintenanceWindow.endLabel}`,
      detail: nextEvent ? `انتبه أيضاً إلى ${nextEvent.nameAr}` : 'نافذة صيانة معتادة للذهب العالمي',
      tone: 'info',
    },
  ];
}

function buildClockSignalCards(activityChart, nowRecommendation) {
  const peakCount = activityChart.points.filter((point) => point.band === 'peak').length;
  const current = activityChart.points.find((point) => point.isCurrent) || activityChart.points[0];
  return [
    {
      label: 'ساعات الذروة اليوم',
      value: `${peakCount}`,
      detail: 'عدد الساعات التي يظهر فيها تداخل لندن ونيويورك بوضوح.',
      tone: 'success',
    },
    {
      label: 'الحالة الحالية',
      value: current.hint,
      detail: current.sessionsLabel,
      tone: current.band === 'peak' ? 'success' : current.band === 'active' ? 'warning' : 'info',
    },
    {
      label: 'أفضل قرار الآن',
      value: nowRecommendation.title,
      detail: nowRecommendation.body,
      tone: nowRecommendation.tone,
    },
  ];
}

function buildBestTimeSignalCards(base, selectedProfilesCount, cityComparisonCount, nextEvent) {
  return [
    {
      label: 'مدة نافذة الذروة',
      value: `${Math.round((base.bestWindow.durationMinutes || 0) / 60)} ساعات`,
      detail: `${base.bestWindow.startLabel} - ${base.bestWindow.endLabel}`,
      tone: base.bestWindow.isActive ? 'success' : 'warning',
    },
    {
      label: 'أنماط الاستخدام',
      value: `${selectedProfilesCount}`,
      detail: 'ملفات استخدام سريعة لتخصيص الصفحة بدل قراءة عامة للجميع.',
      tone: 'info',
    },
    {
      label: 'مقارنة المدن',
      value: `${cityComparisonCount}`,
      detail: nextEvent ? `${nextEvent.nameAr} هو الحدث الأهم الأقرب` : 'تعطيك منظوراً زمنياً عملياً بين المدن العربية',
      tone: nextEvent ? 'warning' : 'default',
    },
  ];
}

export function buildEconomyLandingModel() {
  return {
    stats: buildLandingStatCards(),
    premiumSections: buildLandingPremiumSections(),
    cards: getEconomyToolCards(),
  };
}

export function getEconomyToolCards() {
  return TOOL_CARDS;
}

function getRelatedTools(currentHref) {
  return TOOL_CARDS.filter((card) => card.href && card.href !== currentHref);
}

function buildReferenceViewer(viewerPreset) {
  return {
    timezone: viewerPreset.timezone,
    cityNameAr: viewerPreset.cityNameAr,
    countryNameAr: viewerPreset.countryNameAr,
    countryCode: '',
    source: 'preset',
  };
}

export function buildForexPageModel(viewer, nowInput = new Date()) {
  const nowUtc = toUtc(nowInput);
  const cards = FOREX_SESSION_DEFS.map((session) => buildForexCard(nowUtc, viewer.timezone, session));
  const hero = buildForexHero(cards);
  const bestWindow = buildPreferredWindow(nowUtc, viewer.timezone);
  const gold = buildGoldState(nowUtc, viewer.timezone);
  const activityChart = buildForexActivityChart(nowUtc, viewer.timezone);
  const tradingWeek = buildTradingWeekWindows(nowUtc, viewer.timezone);
  const weeklyEvents = buildWeeklyEconomicEvents(nowUtc, viewer.timezone);
  const nextHighImpactEvent = getNextHighImpactEvent(nowUtc, viewer.timezone, weeklyEvents);

  return {
    viewer: {
      ...viewer,
      label: getViewerLabel(viewer),
      sublabel: getViewerSubLabel(viewer, nowUtc),
      notice: getLocationNotice(viewer),
    },
    nowIso: nowUtc.toISO(),
    nowLabel: formatTime(nowUtc, viewer.timezone),
    todayLabel: formatDateLabel(nowUtc, viewer.timezone),
    hero,
    cards,
    timeline: buildTimeline(nowUtc, viewer.timezone),
    activityChart,
    bestWindow,
    gold,
    tradingWeek,
    signalCards: buildForexSignalCards(nowUtc, viewer.timezone, cards, bestWindow, weeklyEvents, hero),
    spotlight: nextHighImpactEvent ? {
      eyebrow: 'إشارة مهمة',
      title: nextHighImpactEvent.nameAr,
      body: `${nextHighImpactEvent.descriptionAr} الأزواج الأكثر حساسية هنا: ${nextHighImpactEvent.affectedPairsLabel}. التوقيت المحلي: ${nextHighImpactEvent.timeLocal}.`,
      tone: nextHighImpactEvent.impact === 'critical' ? 'danger' : 'warning',
    } : {
      eyebrow: 'إشارة مهمة',
      title: hero.label,
      body: hero.detail,
      tone: hero.tone,
    },
    liveSessionsSummary: cards.map((card) => ({
      id: card.id,
      nameAr: card.nameAr,
      isOpen: card.isOpen,
      statusLabel: card.statusLabel,
      statusTone: card.statusTone,
    })),
    sessionPairRows: buildSessionPairRows(),
    dstImpactRows: buildDstImpactRows(nowUtc),
    weeklyEvents,
    sessionReferenceRows: [
      {
        key: 'week',
        cells: ['أسبوع الفوركس المرجعي', 'الأحد 5:00 م - الجمعة 5:00 م بتوقيت نيويورك تقريباً', 'قد تختلف دقائق البدء بين الوسطاء'],
      },
      {
        key: 'gold',
        cells: ['الذهب الفوري', 'يتوقف عادةً لعطلة الأسبوع مع استراحة صيانة يومية قصيرة', 'النافذة الأقوى أثناء تداخل لندن ونيويورك'],
      },
      {
        key: 'dst',
        cells: ['التوقيت الصيفي', 'تتحرك الجلسات تلقائياً مع لندن ونيويورك وسيدني', 'لهذا تتغير بعض الجداول العربية مرتين سنوياً'],
      },
    ],
    trustSections: [
      {
        title: 'ما الذي نعرضه هنا فعلاً؟',
        body: 'نعرض نوافذ الجلسات العالمية المتعارف عليها في أدوات الفوركس الدولية، ثم نحوّلها إلى توقيت الزائر مع مراعاة التوقيت الصيفي.',
      },
      {
        title: 'لماذا لا نقول "بورصة الفوركس"؟',
        body: 'سوق الفوركس الفوري ليس بورصة مركزية واحدة، لذلك الأصدق مهنياً هو تقديمه كجلسات سيولة وساعات عمل متداولة على نطاق واسع.',
      },
      {
        title: 'ما الذي قد يختلف؟',
        body: 'قد يختلف توقيت البدء أو التوقف بضع دقائق حسب الوسيط أو أداة الذهب التي تتبعها، لذا نوضح دائماً أن الصفحة مرجع جلسات لا منصة تنفيذ.',
      },
    ],
    sourceLinks: [
      {
        label: 'Babypips Forex Market Hours',
        url: 'https://www.babypips.com/tools/forex-market-hours',
      },
      {
        label: 'OANDA Trading Times',
        url: 'https://www.oanda.com/bvi-en/cfds/hours-of-operation/',
      },
      {
        label: 'CME FX Spot+ Hours',
        url: 'https://www.cmegroup.com/trading-hours.html',
      },
    ],
    relatedTools: getRelatedTools('/economie/forex-sessions'),
    guideSections: [
      {
        title: `ما هي جلسة لندن بتوقيت ${getViewerLabel(viewer)}؟`,
        body: `جلسة لندن هي القلب الأوروبي للفوركس، وتبدأ اليوم عند ${cards.find((card) => card.id === 'london')?.openLabel || '--'} وتنتهي عند ${cards.find((card) => card.id === 'london')?.closeLabel || '--'} بتوقيتك. أهميتها أنها تضيف سيولة قوية إلى الأزواج الرئيسية وتكون بداية الحركة اليومية الواضحة للمتداول العربي.`,
      },
      {
        title: 'ما أفضل وقت لتداول الفوركس والذهب؟',
        body: `أفضل نافذة متابعة الآن من ${bestWindow.startLabel} إلى ${bestWindow.endLabel} بتوقيتك، لأنها تمثل تداخل لندن ونيويورك. في هذه الساعات ترتفع السيولة، تتحسن سرعة تنفيذ الأوامر، ويصبح تتبع EUR/USD وXAU/USD أوضح من الفترات الهادئة.`,
      },
      {
        title: 'لماذا تختلف المواعيد عبر السنة؟',
        body: 'المواعيد المعروضة مبنية على المناطق الزمنية الحقيقية لكل مركز تداول، لذلك تتحرك تلقائياً مع التوقيت الصيفي في لندن ونيويورك وسيدني. هذا يمنع الخطأ الشائع في الجداول العربية الثابتة التي تتجاهل فروق مارس وأكتوبر.',
      },
    ],
    faqItems: [
      {
        question: 'هل سوق الفوركس مفتوح الآن؟',
        answer: `الحالة الحالية هي: ${hero.label}. يتغير هذا الجواب مباشرة حسب المنطقة الزمنية الحالية والجلسات النشطة في هذه اللحظة.`,
      },
      {
        question: `متى تفتح جلسة لندن بتوقيت ${getViewerLabel(viewer)}؟`,
        answer: `جلسة لندن تفتح عند ${cards.find((card) => card.id === 'london')?.openLabel || '--'} وتغلق عند ${cards.find((card) => card.id === 'london')?.closeLabel || '--'} اليوم، مع مراعاة التوقيت الصيفي تلقائياً.`,
      },
      {
        question: 'ما هو أفضل وقت لتداول الذهب؟',
        answer: `أفضل وقت لمتابعة الذهب غالباً من ${gold.bestWindowLabel} بتوقيتك، لأن هذه النافذة تجمع أعلى سيولة بين لندن ونيويورك وتكون الاستجابة للأخبار أقوى.`,
      },
      {
        question: 'هل تتغير جلسات الفوركس في الصيف؟',
        answer: 'نعم، وتتغير تلقائياً هنا لأن الحساب يعتمد على المنطقة الزمنية لكل مركز مالي نفسه، وليس على تحويل يدوي ثابت قد يصبح غير صحيح في مواسم الانتقال.',
      },
    ],
    disclaimer:
      'هذه الصفحة أداة مساعدة تعليمية لقراءة جلسات السيولة، وليست توصية استثمارية شخصية ولا مصدراً مطلقاً للحقيقة. قد تختلف ساعات التنفيذ الفعلية لدى الوسيط أو في أيام العطل والإغلاقات الخاصة.',
  };
}

export function buildStockMarketsPageModel(viewer, nowInput = new Date()) {
  const nowUtc = toUtc(nowInput);
  const cards = STOCK_MARKETS.map((market) => buildExchangeCard(nowUtc, viewer.timezone, market));
  const majorBoards = cards.filter((card) => ['us', 'sa', 'uk'].includes(card.id));
  const globalCards = cards.filter((card) => card.region === 'global');
  const arabSummary = buildArabMarketsSummary(cards);
  const weeklyEvents = buildWeeklyEconomicEvents(nowUtc, viewer.timezone);
  const nextHighImpactEvent = getNextHighImpactEvent(nowUtc, viewer.timezone, weeklyEvents);

  return {
    viewer: {
      ...viewer,
      label: getViewerLabel(viewer),
      sublabel: getViewerSubLabel(viewer, nowUtc),
      notice: getLocationNotice(viewer),
    },
    nowIso: nowUtc.toISO(),
    nowLabel: formatTime(nowUtc, viewer.timezone),
    todayLabel: formatDateLabel(nowUtc, viewer.timezone),
    cards,
    majorBoards,
    globalCards,
    arabCards: arabSummary.arabCards,
    arabMarketsOpenCount: arabSummary.arabMarketsOpenCount,
    arabMarketsTotal: arabSummary.arabMarketsTotal,
    arabMarketsOpenNames: arabSummary.arabMarketsOpenNames,
    trustSummary:
      'هذه الصفحة تعمل بالكامل بالمجان وتعتمد على الساعات الاعتيادية الرسمية لكل سوق مع تحويلها تلقائياً إلى توقيت الزائر. وهي ممتازة للمتابعة اليومية، لكن يجب التحقق من العطل والإغلاقات الخاصة من الجهة الرسمية قبل التنفيذ.',
    trustPoints: buildStockTrustPoints(),
    sourceRows: buildStockSourceRows(nowUtc, viewer.timezone, cards),
    usFocus: buildUsFocus(nowUtc, viewer.timezone),
    extendedHours: buildUsExtendedHours(nowUtc, viewer.timezone),
    weeklySnapshot: buildWeeklySnapshot(nowUtc, viewer.timezone),
    arabHolidayRows: buildArabMarketHolidayRows(viewer.timezone),
    tadawulDetail: buildTadawulDetail(nowUtc, viewer.timezone),
    signalCards: buildStockSignalCards(globalCards, arabSummary.arabCards, buildUsFocus(nowUtc, viewer.timezone), viewer.timezone, nowUtc),
    spotlight: nextHighImpactEvent ? {
      eyebrow: 'أقرب محفز قوي',
      title: nextHighImpactEvent.nameAr,
      body: `${nextHighImpactEvent.descriptionAr} هذا يهم خصوصاً السوق الأمريكي والذهب عند ${nextHighImpactEvent.timeLocal} بتوقيتك.`,
      tone: nextHighImpactEvent.impact === 'critical' ? 'danger' : 'warning',
    } : {
      eyebrow: 'منهجية الصفحة',
      title: 'جلسات واضحة مع هوية كل سوق',
      body: 'جمعنا الأسواق العربية والعالمية في طبقة واحدة حتى لا يضطر المستخدم إلى التنقل بين أدوات متفرقة لمجرد سؤال الفتح الآن.',
      tone: 'info',
    },
    relatedTools: getRelatedTools('/economie/stock-markets'),
    guideSections: [
      {
        title: `متى تفتح البورصة الأمريكية بتوقيت ${getViewerLabel(viewer)}؟`,
        body: `الجرس الرسمي للسوق الأمريكي يظهر هنا عند ${buildUsFocus(nowUtc, viewer.timezone).openLabel} بتوقيتك. هذه المعلومة تتغير تلقائياً مع التوقيت الصيفي الأمريكي، لذلك لا تحتاج إلى إعادة الحساب يدوياً كل موسم.`,
      },
      {
        title: 'كيف أتابع السوق الأمريكي من مدينتي؟',
        body: `أهم ثلاث لحظات للمراقبة هي: جرس الافتتاح، أول ساعة تداول، ثم نافذة التداخل مع لندن عند ${buildUsFocus(nowUtc, viewer.timezone).overlapLabel}. هذا التقسيم أبسط من حفظ توقيت نيويورك مجرداً دون ربطه بمدينتك.`,
      },
      {
        title: 'لماذا تختلف بعض الأسواق عن بعضها؟',
        body: 'لأن كل بورصة تعمل وفق أيام تداول محلية مختلفة. تداول السعودي يعمل من الأحد إلى الخميس، طوكيو لديها استراحة غداء، بينما السوق الأمريكي يضيف جلسات موسعة قبل الافتتاح وبعد الإغلاق.',
      },
    ],
    faqItems: [
      {
        question: 'هل السوق الأمريكي مفتوح الآن؟',
        answer: `الحالة الحالية: ${cards.find((card) => card.id === 'us')?.statusLabel || '--'}. يظهر في البطاقة الزمن المتبقي حتى الإغلاق أو الافتتاح التالي مباشرة.`,
      },
      {
        question: `متى تفتح بورصة نيويورك بتوقيت ${getViewerLabel(viewer)}؟`,
        answer: `تفتح الجلسة الرسمية عند ${buildUsFocus(nowUtc, viewer.timezone).openLabel} بتوقيتك، مع تحديث تلقائي في فترات التوقيت الصيفي.`,
      },
      {
        question: 'هل تداول السعودية تعمل يوم الجمعة؟',
        answer: 'لا، جدول تداول السعودي الاعتيادي يمتد من الأحد إلى الخميس، ولهذا تظهر البطاقة مغلقة خلال الجمعة والسبت في أغلب الأسابيع.',
      },
      {
        question: 'ما الفرق بين الجلسة الرسمية والجلسات الموسعة؟',
        answer: `الجلسة الرسمية هي الأكثر سيولة، أما الجلسات الموسعة فتظهر هنا من ${buildUsExtendedHours(nowUtc, viewer.timezone).premarketLabel} قبل الفتح و${buildUsExtendedHours(nowUtc, viewer.timezone).afterhoursLabel} بعد الإغلاق، لكنها عادة أقل عمقاً وأكثر حساسية للأخبار.`,
      },
    ],
    disclaimer:
      'تعرض هذه الصفحة ساعات السوق وحالته لأغراض المعلومات والمساعدة العملية، وليست دعوة للبيع أو الشراء ولا بديلاً عن التحقق من البورصة أو الوسيط أو الجهة الرسمية قبل التنفيذ.',
  };
}

export function buildUsMarketOpenPageModel(viewer, nowInput = new Date()) {
  const nowUtc = toUtc(nowInput);
  const base = buildStockMarketsPageModel(viewer, nowInput);
  const usCard = base.cards.find((card) => card.id === 'us');
  const usMarket = getMarketById('us');
  const maintenanceViewer = buildReferenceViewer(ARAB_REFERENCE_VIEWERS[0]);
  const countryOpenRows = buildUsCountryOpenRows(nowUtc);
  const countryExtendedRows = buildUsCountryExtendedRows(nowUtc);
  const saudiRow = countryOpenRows.find((row) => row.key === 'sa');
  const moroccoRow = countryOpenRows.find((row) => row.key === 'ma');
  const viewerCard = buildExchangeCard(nowUtc, viewer.timezone, usMarket);
  const countdownHero = buildUsCountdownHero(nowUtc, viewer.timezone);
  const nyseHolidayTable = buildNyseHolidayRows(nowUtc, viewer.timezone);
  const weeklyEvents = buildWeeklyEconomicEvents(nowUtc, viewer.timezone);

  return {
    ...base,
    usCard,
    countdownHero,
    heroTitle: `متى يفتح السوق الأمريكي من ${base.viewer.label}؟`,
    heroLead:
      'هذه الصفحة مبنية لسؤال عربي يومي مباشر: متى يفتح السوق الأمريكي اليوم، وكم بقي على الافتتاح، وما وقت أول ساعة، وكيف يختلف الموعد بين السعودية والإمارات ومصر والمغرب. نعطي الجواب كأداة وقت واضحة، لا كمقال وسيط طويل مليء بالحشو.',
    countdownSummary: viewerCard?.isOpen
      ? `السوق الأمريكي مفتوح الآن ويغلق خلال ${viewerCard.countdownLabel} تقريباً. أول ساعة من الجلسة الحالية تمتد من ${base.usFocus.firstHourLabel} بتوقيتك.`
      : `السوق الأمريكي ${viewerCard?.statusLabel || 'مغلق الآن'} ويفتح خلال ${viewerCard?.countdownLabel || '--'}. جرس الافتتاح الرسمي التالي عند ${base.usFocus.openLabel} بتوقيتك.`,
    countryOpenRows,
    countryExtendedRows,
    cityClockRows: buildUsCityClockRows(nowUtc),
    impactCards: buildUsImpactCards(nowUtc, viewer.timezone),
    nyseHolidayRows: nyseHolidayTable.rows,
    nextUsHolidaySummary: nyseHolidayTable.summary,
    signalCards: buildUsSignalCards(base, countdownHero, weeklyEvents, nyseHolidayTable.summary),
    spotlight: {
      eyebrow: 'لماذا تهم هذه الصفحة؟',
      title: 'الافتتاح الأمريكي يعيد ضبط السوق العالمي',
      body: 'كثير من الأصول لا تكتسب وزنها الحقيقي إلا بعد دخول نيويورك. لهذا لا يكفي معرفة التوقيت فقط، بل فهم أول ساعة والجلسات الموسعة والعطل أيضاً.',
      tone: 'warning',
    },
    sourceLinks: US_MARKET_SOURCE_LINKS,
    guideSections: [
      {
        title: `الجواب المباشر: متى يفتح السوق الأمريكي بتوقيت ${getViewerLabel(viewer)}؟`,
        body: `الافتتاح الرسمي التالي يظهر هنا عند ${base.usFocus.openLabel} بتوقيتك، بينما أول ساعة تمتد من ${base.usFocus.firstHourLabel}. هذا هو الجواب الذي يبحث عنه أغلب المستخدمين يومياً قبل افتتاح وول ستريت.`,
      },
      {
        title: 'لماذا تحتاج صفحة منفصلة عن "البورصات العالمية"؟',
        body: 'لأن الطلب العربي على السوق الأمريكي أعلى من الطلب على بقية البورصات، والنية البحثية هنا مباشرة جداً: المستخدم يريد وقت الافتتاح، العد التنازلي، وأحياناً توقيت بلده بالتحديد، لا جولة عامة على كل الأسواق.',
      },
      {
        title: 'ما الذي يميّز أول ساعة تداول؟',
        body: `أول ساعة من ${base.usFocus.firstHourLabel} غالباً هي الأكثر نشاطاً في الأسهم الأمريكية، لأن أوامر ما قبل السوق تُستوعب خلالها ويظهر أثر الأخبار الأمريكية بشكل أوضح من الساعات الهادئة.`,
      },
      {
        title: 'لماذا يربك التوقيت الصيفي المستخدم العربي؟',
        body: `الموعد يتغير مرتين تقريباً بين الشتاء والصيف لأن نيويورك تغيّر توقيتها، بينما بعض الدول العربية لا تفعل ذلك بنفس النمط. لهذا ترى في الجدول أن توقيت المغرب مثلاً (${moroccoRow?.cells?.[1] || '--'}) قد يختلف عن السعودية (${saudiRow?.cells?.[1] || '--'}) بطريقة تربك الجداول الثابتة.`,
      },
    ],
    faqItems: [
      {
        question: 'متى يفتح السوق الأمريكي اليوم؟',
        answer: `يفتح السوق الأمريكي في الجلسة الرسمية عند ${base.usFocus.openLabel} بتوقيتك الحالي. إذا كان السوق مفتوحاً الآن فالبطاقة تعرض الوقت المتبقي حتى الإغلاق بدلاً من الافتتاح التالي.`,
      },
      {
        question: 'كم باقي على افتتاح السوق الأمريكي؟',
        answer: viewerCard?.isOpen
          ? `السوق الأمريكي مفتوح الآن، لذلك العدّاد الحالي يحسب الوقت المتبقي حتى الإغلاق وهو ${viewerCard.countdownLabel}. عند الإغلاق سيتحول العداد تلقائياً إلى الافتتاح التالي.`
          : `يتبقى على افتتاح السوق الأمريكي ${viewerCard?.countdownLabel || '--'} تقريباً. هذا العدّاد يتجدد تلقائياً وفق منطقتك الزمنية الحالية.`,
      },
      {
        question: 'متى يفتح السوق الأمريكي بتوقيت السعودية؟',
        answer: `يفتح السوق الأمريكي بتوقيت السعودية عند ${saudiRow?.cells?.[1] || '--'} في الجدول الحالي. ويتغير هذا الوقت تلقائياً مع التوقيت الصيفي الأمريكي من دون أن تحتاج إلى إعادة الحساب يدوياً.`,
      },
      {
        question: 'متى يفتح السوق الأمريكي بتوقيت المغرب؟',
        answer: `يفتح السوق الأمريكي بتوقيت المغرب عند ${moroccoRow?.cells?.[1] || '--'} بحسب الجدول الحالي. هذا السؤال مهم خصوصاً لأن فرق التوقيت مع نيويورك يتأثر بمواسم التوقيت الصيفي بصورة مختلفة.`,
      },
      {
        question: 'هل يمكن التداول قبل افتتاح السوق الأمريكي؟',
        answer: `نعم، توجد جلسة ما قبل السوق قبل الافتتاح الرسمي، وتظهر مواعيدها في الجدول الثاني لكل دولة عربية رئيسية. لكنها أقل سيولة من الجلسة الرسمية وقد تكون فيها فروقات الأسعار أوسع.`,
      },
      {
        question: 'ما الفرق بين وقت الافتتاح الرسمي وما بعد الإغلاق؟',
        answer: 'الافتتاح الرسمي هو الفترة الأساسية الأعلى سيولة، بينما ما بعد الإغلاق وجلسة ما قبل السوق فترتان موسعتان تُستخدمان غالباً لمتابعة الأخبار أو الأوامر المحدودة لا لافتراض نفس جودة الجلسة العادية.',
      },
    ],
    relatedTools: getRelatedTools('/economie/us-market-open'),
    disclaimer:
      'تعرض هذه الصفحة أوقات الجلسة الرسمية والجلسات الموسعة للمساعدة في التنظيم والمتابعة، لكنها لا تغني عن التحقق من البورصة أو الوسيط أو الأخبار قبل التنفيذ الفعلي.',
    maintenanceViewer,
  };
}

export function buildMarketClockPageModel(viewer, nowInput = new Date()) {
  const nowUtc = toUtc(nowInput);
  const base = buildForexPageModel(viewer, nowInput);
  const signalCards = buildClockSignalCards(base.activityChart, buildNowRecommendation(nowUtc, viewer.timezone));

  return {
    ...base,
    heroTitle: `ساعة التداول العالمية من ${base.viewer.label}`,
    heroLead:
      'هذه الصفحة تمثل يومك الحالي بالكامل كساعة سوق بصرية: من افتتاح آسيا حتى ذروة لندن ونيويورك، ثم انتقال السيولة تدريجياً. الهدف أن ترى السوق في لقطة واحدة بدلاً من تفكيك أربعة جداول منفصلة.',
    browserTitle: `${base.hero.label} | ساعة التداول — ${SITE_BRAND}`,
    dayComparisonRows: buildDayComparisonRows(nowUtc, viewer.timezone),
    nowRecommendation: buildNowRecommendation(nowUtc, viewer.timezone),
    signalCards,
    spotlight: {
      eyebrow: 'ميزة بصرية',
      title: 'اليوم كله في شاشة واحدة',
      body: 'بدلاً من قراءة أربع جداول، تعطيك هذه الصفحة إحساساً فورياً بمتى ترتفع السيولة، ومتى يهدأ السوق، وما الذي يستحق الانتباه الآن.',
      tone: 'brand',
    },
    guideSections: [
      {
        title: 'كيف تقرأ الساعة؟',
        body: 'كل عمود يمثل ساعة محلية لديك، وكلما ارتفع النشاط كان ذلك دليلاً على تداخل جلسات أو اقتراب السوق الأمريكي. قمة الأعمدة تعني أن سيولة اليوم في أفضل حالاتها.',
      },
      {
        title: 'متى تراقب الذهب؟',
        body: `النافذة الأكثر وضوحاً اليوم تمتد من ${base.bestWindow.startLabel} إلى ${base.bestWindow.endLabel} بتوقيتك، وهي الأنسب غالباً لمتابعة XAU/USD والأزواج الرئيسية.`,
      },
      {
        title: 'لماذا هذا أفضل من الجداول الثابتة؟',
        body: 'لأن الساعة البصرية تتحرك مع منطقتك الزمنية الحالية، وتُظهر التداخلات الفعلية فوراً حتى عند تغيّر التوقيت الصيفي بين القارات.',
      },
    ],
    relatedTools: getRelatedTools('/economie/market-clock'),
  };
}

export function buildBestTradingTimePageModel(viewer, nowInput = new Date()) {
  const nowUtc = toUtc(nowInput);
  const base = buildForexPageModel(viewer, nowInput);
  const nextHighImpactEvent = getNextHighImpactEvent(nowUtc, viewer.timezone, base.weeklyEvents);

  return {
    ...base,
    heroTitle: `أفضل وقت للتداول من ${base.viewer.label}`,
    heroLead:
      'بدلاً من سؤال "متى أتابع السوق؟" بصيغة عامة، تعطيك هذه الصفحة نافذة عملية من مدينتك نفسها: متى تبدأ لندن، متى يدخل الدولار بقوة، ومتى تكون متابعة الذهب أكثر جدوى. لكنها تظل أداة مساعدة للتنظيم والفهم، لا بديلاً عن قرارك الشخصي أو تحققك من السوق الفعلي.',
    helpSections: [
      {
        title: 'كيف نحاول مساعدتك؟',
        body: `نحوّل الجلسات العالمية إلى توقيت ${base.viewer.label} حتى لا تضطر إلى حفظ نيويورك ولندن يدوياً. الهدف أن نختصر عليك السؤال الأول: متى يصبح السوق غالباً أوضح وأكثر سيولة؟`,
      },
      {
        title: 'متى تكون الأداة مفيدة فعلاً؟',
        body: 'تكون مفيدة عندما تريد ترتيب وقت المتابعة، مقارنة يومك المحلي بجلسات السوق، أو معرفة متى ترتفع السيولة عادةً على الذهب والأزواج الرئيسية.',
      },
      {
        title: 'ومتى لا تكفي وحدها؟',
        body: 'لا تكفي وحدها إذا كنت ستنفذ صفقة فعلية دون مراجعة وسيطك، أو إذا كان السوق في عطلة، أو إذا كانت هناك أخبار قوية قد تغيّر سلوك السيولة في دقائق.',
      },
    ],
    recommendationCards: [
      {
        title: 'للمضاربة اليومية',
        body: `ابدأ قبل نافذة التداخل بحوالي 30 دقيقة، ثم راقب الفترة بين ${base.bestWindow.startLabel} و${base.bestWindow.endLabel} لأنها الأعلى سيولة.`,
      },
      {
        title: 'لمتابعة الأخبار الأمريكية',
        body: `أول ساعة من نيويورك هي من ${base.tradingWeek[0]?.usOpenLabel || '--'} في معظم أيام هذا الأسبوع، وغالباً ما تحمل أسرع رد فعل.`,
      },
      {
        title: 'لجلسات أهدأ',
        body: 'إذا كنت تفضل حركة أهدأ، فبداية آسيا غالباً أنسب من ذروة لندن ونيويورك، خصوصاً على الأزواج المرتبطة بالين والدولار الأسترالي.',
      },
      {
        title: 'قبل الأخبار المهمة',
        body: 'إذا كانت لديك صفقة مفتوحة قرب بيانات أمريكية مؤثرة، فتعامل مع الوقت هنا كتنبيه لارتفاع النشاط لا كضمان لاتجاه السوق أو سهولة التنفيذ.',
      },
    ],
    verificationRows: [
      {
        key: 'broker',
        cells: ['ساعات الوسيط أو الأداة', 'قد تختلف ساعات الذهب أو بعض العقود عن الجلسات العامة', 'راجع منصة الوسيط أو صفحة ساعات التداول لديه قبل التنفيذ'],
      },
      {
        key: 'holiday',
        cells: ['العطل والإغلاقات الخاصة', 'قد يُغلق السوق أو تتغير السيولة رغم توافق الساعة العامة', 'تحقق من صفحة البورصة أو السوق الرسمي في يوم العطلة'],
      },
      {
        key: 'news',
        cells: ['الأخبار الاقتصادية', 'قد تصبح الحركة أعنف أو أقل قابلية للتنبؤ في نفس نافذة السيولة', 'اربط هذه الصفحة دائماً بمفكرة الأخبار أو جدول البيانات المهمة'],
      },
      {
        key: 'risk',
        cells: ['إدارة المخاطر', 'الوقت الجيد لا يلغي مخاطر الدخول الخاطئ أو الحجم المبالغ فيه', 'حدد الخطة والحجم ووقف الخسارة قبل أي قرار'],
      },
    ],
    disclaimerCards: [
      {
        title: 'أداة إرشادية لا أكثر',
        body: 'هذه الصفحة تساعدك على فهم متى ترتفع السيولة غالباً، لكنها لا تمنحك يقيناً مطلقاً ولا تضمن نتيجة تداول أو جودة تنفيذ.',
      },
      {
        title: 'ليست نصيحة استثمارية شخصية',
        body: 'لا نعرف أهدافك المالية أو خبرتك أو قدرتك على تحمل المخاطر، لذلك لا ينبغي تفسير هذه التوصيات الزمنية على أنها مشورة فردية لك.',
      },
      {
        title: 'تحقق قبل التنفيذ',
        body: 'إذا كنت ستتخذ قراراً فعلياً، فراجع الوسيط والسوق الرسمي والعطلات والأخبار قبل الاعتماد على أي وقت معروض هنا.',
      },
    ],
    responsibleUseSections: [
      {
        title: 'لا تدخل بسبب الوقت وحده',
        body: 'أفضل نافذة تداول لا تعني أن كل فرصة داخلها جيدة. الوقت يهيئ البيئة فقط، أما القرار فيحتاج إلى خطة وسياق وسلوك سعري واضح.',
      },
      {
        title: 'اربط الوقت بنوع الأصل',
        body: 'EUR/USD وXAU/USD غالباً يستفيدان أكثر من تداخل لندن ونيويورك، بينما بعض الأزواج الآسيوية قد تكون أوضح في بداية جلسة طوكيو.',
      },
      {
        title: 'استخدمها للتصفية لا للتلقين',
        body: 'الفائدة الأفضل لهذه الصفحة هي تقليص الساعات الضعيفة، ثم تركيز انتباهك على الفترات التي تستحق المتابعة فعلاً.',
      },
    ],
    legalDisclaimer: {
      title: 'إخلاء مسؤولية واضح',
      summary:
        'نحاول مساعدتك على فهم أوقات النشاط والسيولة، لكن هذه الأداة ليست مصدراً مطلقاً للحقيقة وليست توصية استثمارية أو قانونية أو دعوة للتداول.',
      detail:
        'قد تختلف الساعات المعروضة عن ساعات وسيطك أو عن أوضاع السوق الفعلية في العطل والإغلاقات الخاصة أو عند التوقفات الفنية. قبل أي تنفيذ فعلي، تحقق من الوسيط والسوق الرسمي والأخبار وإدارة المخاطر.',
    },
    profileRecommendations: PROFILE_RECOMMENDATIONS,
    worstTradingRows: buildWorstTradingRows(nowUtc, viewer.timezone),
    cityComparisonOptions: ARAB_REFERENCE_VIEWERS.map((item) => ({ id: item.id, label: item.cityNameAr })),
    cityComparisonMap: Object.fromEntries(
      ARAB_REFERENCE_VIEWERS.map((item) => [item.id, buildCityComparisonModel(viewer, nowUtc, item.id)]),
    ),
    signalCards: buildBestTimeSignalCards(
      base,
      Object.keys(PROFILE_RECOMMENDATIONS).length,
      ARAB_REFERENCE_VIEWERS.length,
      nextHighImpactEvent,
    ),
    spotlight: nextHighImpactEvent ? {
      eyebrow: 'تذكير عملي',
      title: nextHighImpactEvent.nameAr,
      body: `${nextHighImpactEvent.descriptionAr} لهذا لا يكفي اختيار ساعة جيدة فقط، بل يجب أيضاً الانتباه إلى الحدث الأقرب وسياقه.`,
      tone: 'warning',
    } : {
      eyebrow: 'فكرة الصفحة',
      title: 'أفضل وقت لا يعني قراراً جاهزاً',
      body: 'هذه الصفحة تصفي لك الساعات الأفضل والأسوأ، لكنها تترك قرار التنفيذ لخطة المتداول وإدارة مخاطر واعية.',
      tone: 'info',
    },
    relatedTools: getRelatedTools('/economie/best-trading-time'),
  };
}

export function buildGoldMarketHoursPageModel(viewer, nowInput = new Date()) {
  const nowUtc = toUtc(nowInput);
  const base = buildForexPageModel(viewer, nowInput);
  const maintenanceWindow = buildGoldMaintenanceWindow(nowUtc, viewer.timezone);
  const countryRows = buildGoldCountryRows(nowUtc);
  const saudiRow = countryRows.find((row) => row.key === 'sa');
  const moroccoRow = countryRows.find((row) => row.key === 'ma');
  const goldActivity = buildGoldActivityScore(nowUtc, viewer.timezone);
  const ramadanActive = isRamadan(nowUtc, viewer.timezone);
  const nextHighImpactEvent = getNextHighImpactEvent(nowUtc, viewer.timezone, base.weeklyEvents);

  return {
    ...base,
    heroTitle: `هل الذهب مفتوح الآن من ${base.viewer.label}؟`,
    heroLead:
      'هذه الصفحة موجهة لعبارة بحث يومية واضحة: هل الذهب مفتوح الآن، ومتى يفتح سوق الذهب اليوم، وما أفضل وقت لتداول الذهب من السعودية والإمارات ومصر والمغرب. نعتمد على جلسات السوق العالمية المجانية ونحوّلها إلى توقيت الزائر بدقة بدلاً من الاكتفاء بجداول ثابتة أو مقالات وسيط طويلة.',
    maintenanceWindow,
    goldActivity,
    signalCards: buildGoldSignalCards(goldActivity, base.bestWindow, maintenanceWindow, base.weeklyEvents, viewer.timezone, nowUtc),
    spotlight: nextHighImpactEvent ? {
      eyebrow: 'محفز الذهب القادم',
      title: nextHighImpactEvent.nameAr,
      body: `${nextHighImpactEvent.descriptionAr} لهذا تصبح متابعة الذهب أقوى قرب ${nextHighImpactEvent.timeLocal} على ${nextHighImpactEvent.affectedPairsLabel}.`,
      tone: nextHighImpactEvent.impact === 'critical' ? 'danger' : 'warning',
    } : {
      eyebrow: 'سلوك الذهب',
      title: 'الذهب لا يعيش على "مفتوح أو مغلق" فقط',
      body: 'القيمة الحقيقية هنا في فهم درجة النشاط، النافذة الأفضل، والاستراحة اليومية، لا الاكتفاء بسؤال الفتح الآن.',
      tone: 'info',
    },
    goldSessionRows: buildGoldSessionRows(nowUtc, viewer.timezone),
    countryRows,
    marketGuideCards: GOLD_MARKET_GUIDE,
    shopComparisonRows: [
      {
        key: 'pricing',
        cells: ['التسعير', 'سعر لحظي دولاري أو مشتق منه', 'سعر محلي + مصنعية + عرض وطلب محلي'],
      },
      {
        key: 'hours',
        cells: ['ساعات العمل', 'يكاد يغطي اليوم العالمي مع توقفات معروفة', 'مرتبط بدوام المحل والمنطقة التجارية'],
      },
      {
        key: 'goal',
        cells: ['الهدف', 'مضاربة أو تحوط أو متابعة سعرية', 'شراء فيزيائي وادخار ومشغولات'],
      },
    ],
    ramadanSection: ramadanActive ? {
      title: 'الذهب في رمضان',
      body: 'في رمضان يتغير نمط متابعة كثير من المتداولين العرب، لذلك تميل نافذة ما بعد الإفطار إلى أن تكون أنسب للمراقبة العملية من أول النهار المحلي. كما يزداد الالتباس بين الذهب العالمي والطلب المحلي على الذهب الفيزيائي في هذه الفترة.',
    } : null,
    sourceLinks: GOLD_MARKET_SOURCE_LINKS,
    guideSections: [
      {
        title: `هل الذهب مفتوح الآن بتوقيت ${getViewerLabel(viewer)}؟`,
        body: `الحالة الحالية هي: ${base.gold.statusLabel}. إذا كان الذهب مفتوحاً الآن فهذه الصفحة تعرض أفضل نافذة للسيولة عند ${base.gold.bestWindowLabel}، وإذا كان متوقفاً فسترى وقت العودة أو الاستراحة اليومية مباشرة.`,
      },
      {
        title: 'ما أفضل وقت لتداول الذهب يومياً؟',
        body: `أفضل وقت لتداول الذهب عادة من ${base.bestWindow.startLabel} إلى ${base.bestWindow.endLabel} بتوقيتك، لأن هذه الفترة تجمع سيولة لندن ونيويورك وتكون فيها استجابة الذهب للأخبار الأمريكية أقوى.`,
      },
      {
        title: 'ما الفرق بين سوق الذهب العالمي ومحلات الذهب المحلية؟',
        body: 'كثير من الصفحات العربية تخلط بين التداول العالمي للذهب عبر المنصات وبين ساعات عمل محلات الذهب أو البنوك المحلية. هذه الصفحة تتحدث عن السوق العالمي المرتبط بجلسات التداول والسيولة، لا عن دوام المتاجر أو تسعير المشغولات في المدينة.',
      },
      {
        title: 'لماذا تختلف مواعيد الذهب بين السعودية والمغرب؟',
        body: `لأن جلسات الذهب العالمية تتحرك مع لندن ونيويورك وسيدني، فتتغير المواعيد محلياً بحسب البلد. لهذا قد ترى أفضل نافذة في السعودية عند ${saudiRow?.cells?.[1] || '--'} بينما تظهر في المغرب عند ${moroccoRow?.cells?.[1] || '--'} وفق نفس السوق العالمي.`,
      },
    ],
    faqItems: [
      {
        question: 'هل الذهب مفتوح الآن؟',
        answer: `الحالة الحالية للذهب هي: ${base.gold.statusLabel}. إذا كان السوق في عطلة الأسبوع أو في الاستراحة اليومية فسترى ذلك صراحة مع أقرب وقت للعودة أو أفضل نافذة تالية.`,
      },
      {
        question: 'متى يفتح سوق الذهب اليوم؟',
        answer: base.gold.isActive
          ? `سوق الذهب مفتوح الآن بالفعل، وأفضل نافذة النشاط الحالية أو التالية هي ${base.gold.bestWindowLabel}. إذا خرجت من فترة السيولة العالية فسيبقى الجدول يوضح لك متى تبدأ النافذة الأقوى التالية.`
          : `يعود سوق الذهب عادة بعد التوقف وفق الجلسة العالمية التالية، وتعرض الصفحة الوقت المحلي المناسب لك بدلاً من وقت الخادم أو توقيت لندن فقط.`,
      },
      {
        question: 'متى يفتح الذهب بتوقيت السعودية؟',
        answer: `أفضل نافذة متابعة للذهب بتوقيت السعودية تظهر حالياً عند ${saudiRow?.cells?.[1] || '--'} في الجدول المقارن. كما يوضح الجدول نفسه وقت الاستراحة اليومية المعتادة للمستخدم السعودي.`,
      },
      {
        question: 'متى يفتح الذهب بتوقيت المغرب؟',
        answer: `أفضل نافذة للذهب بتوقيت المغرب تظهر عند ${moroccoRow?.cells?.[1] || '--'} في الجدول المقارن. وتبرز أهمية هذا السؤال لأن المغرب ولندن ونيويورك لا تتحرك دائماً بنفس نمط التوقيت الصيفي.`,
      },
      {
        question: 'ما أفضل وقت لتداول الذهب؟',
        answer: `أفضل وقت لتداول الذهب غالباً هو تداخل لندن ونيويورك من ${base.bestWindow.startLabel} إلى ${base.bestWindow.endLabel} بتوقيتك. في هذه الفترة تكون السيولة أوضح من الساعات الآسيوية أو فترات التوقف اليومية.`,
      },
      {
        question: 'هل الذهب يتوقف يومياً؟',
        answer: `نعم، توجد استراحة يومية معتادة تظهر هنا من ${maintenanceWindow.startLabel} إلى ${maintenanceWindow.endLabel} بتوقيتك. كما يتوقف السوق عادة خلال عطلة نهاية الأسبوع ثم يعود مع بداية الأسبوع العالمي الجديد.`,
      },
    ],
    relatedTools: getRelatedTools('/economie/gold-market-hours'),
    disclaimer:
      'هذه الصفحة مرجع مجاني لأوقات الذهب العالمي وجلسات السيولة، وليست تسعيراً لحظياً ولا بديلاً عن منصة الوسيط أو السوق الرسمي عند اتخاذ قرار تداول فعلي.',
  };
}
