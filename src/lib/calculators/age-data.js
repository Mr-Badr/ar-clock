export const AGE_ROUTE = {
  slug: 'age',
  href: '/calculators/age',
  shortLabel: 'حاسبات العمر',
  title: 'حاسبات العمر',
  heroTitle: 'حاسبات العمر الشاملة',
  description:
    'مجموعة حاسبات عربية للعمر تشمل الحساب الشامل، العمر الهجري، فرق العمر، تفاصيل يوم الميلاد، الإنجازات الزمنية، العد التنازلي، وعمرك على الكواكب.',
  accent: '#EA580C',
  accentSoft: 'rgba(234, 88, 12, 0.14)',
  badge: 'عمر / وقت',
  keywords: [
    'حاسبة العمر',
    'احسب عمرك',
    'حساب العمر',
    'كم عمري',
    'حاسبة العمر بالهجري والميلادي',
    'كم يوم عشت',
    'كم باقي على عيد ميلادي',
    'حاسبة فرق العمر',
  ],
};

export const AGE_CALCULATOR_ROUTES = [
  {
    slug: 'calculator',
    href: '/calculators/age/calculator',
    title: 'الحاسبة الرئيسية',
    description: 'احسب عمرك بالسنوات والأشهر والأيام والساعات والثواني مع مؤشرات عيد الميلاد القادم.',
    accent: '#EA580C',
  },
  {
    slug: 'hijri',
    href: '/calculators/age/hijri',
    title: 'العمر الهجري',
    description: 'تحويل وعرض العمر بين الميلادي والهجري مع شرح الفرق بين التقويمين.',
    accent: '#0F766E',
  },
  {
    slug: 'difference',
    href: '/calculators/age/difference',
    title: 'فرق العمر',
    description: 'قارن بين عمر شخصين بالسنوات والأيام وتعرّف من الأكبر وبكم.',
    accent: '#2563EB',
  },
  {
    slug: 'birth-day',
    href: '/calculators/age/birth-day',
    title: 'يوم ميلادك',
    description: 'اكتشف اليوم الذي وُلدت فيه، فصلك، جيلك، ونصف عيد ميلادك القادم.',
    accent: '#D97706',
  },
  {
    slug: 'milestones',
    href: '/calculators/age/milestones',
    title: 'الإنجازات الزمنية',
    description: 'متى تكمل 10,000 يوم أو مليار ثانية؟ مع خط زمني واضح لما تجاوزته وما ينتظرك.',
    accent: '#7C3AED',
  },
  {
    slug: 'planets',
    href: '/calculators/age/planets',
    title: 'عمرك على الكواكب',
    description: 'شاهد عمرك لو قسته بسنوات عطارد والمريخ والمشتري وبقية الكواكب.',
    accent: '#0284C7',
  },
  {
    slug: 'countdown',
    href: '/calculators/age/countdown',
    title: 'العد التنازلي لعيد الميلاد',
    description: 'عداد حي للأيام والساعات والدقائق والثواني حتى عيد ميلادك القادم.',
    accent: '#DC2626',
  },
  {
    slug: 'retirement',
    href: '/calculators/age/retirement',
    title: 'سن التقاعد',
    description: 'تقدير مبسط لموعد التقاعد حسب الدولة والقطاع مع تنبيه واضح أن المرجع النهائي هو الجهة الرسمية.',
    accent: '#4F46E5',
  },
];

export const AGE_COMMON_FAQ = [
  {
    question: 'كيف تُحسب الحاسبة العمر بدقة؟',
    answer:
      'تعتمد الحاسبة على الفرق الحقيقي بين تاريخ الميلاد وتاريخ المقارنة، ثم تفككه إلى سنوات وأشهر وأيام قبل تحويله إلى وحدات أكبر مثل الأسابيع والساعات والثواني.',
  },
  {
    question: 'لماذا يختلف العمر الهجري عن الميلادي؟',
    answer:
      'لأن السنة الهجرية أقصر من السنة الميلادية بحوالي 10 إلى 11 يوماً، لذلك يظهر العمر الهجري أكبر قليلاً عند مقارنة الفترتين نفسيهما.',
  },
  {
    question: 'هل يمكن حساب العمر على تاريخ سابق أو مستقبلي؟',
    answer:
      'نعم. بعض صفحات القسم تسمح بتحديد تاريخ مقارنة مختلف عن اليوم الحالي لرؤية عمرك أو الفارق الزمني عند تلك النقطة بالتحديد.',
  },
  {
    question: 'هل النتائج مناسبة للمشاركة؟',
    answer:
      'نعم. الحاسبات تعرض ملخصاً واضحاً يسهل نسخه أو مشاركته، خاصة في صفحات العد التنازلي والإنجازات وفرق العمر.',
  },
];

export const AGE_GENERATIONS = [
  { key: 'gen-alpha', label: 'جيل ألفا', from: 2013, to: 2029, note: 'جيل وُلد في عالم شديد الاتصال والهواتف الذكية دائماً في متناول اليد.' },
  { key: 'gen-z', label: 'جيل زد', from: 1997, to: 2012, note: 'جيل رقمي نشأ مع المنصات الاجتماعية والفيديو القصير والتعليم المختلط.' },
  { key: 'millennial', label: 'جيل الألفية', from: 1981, to: 1996, note: 'جيل عاش الانتقال من الإنترنت المبكر إلى الهواتف الذكية والعمل الرقمي.' },
  { key: 'gen-x', label: 'جيل إكس', from: 1965, to: 1980, note: 'جيل جمع بين الحياة التناظرية والتحول التقني الواسع لاحقاً.' },
  { key: 'boomers', label: 'جيل الطفرة', from: 1946, to: 1964, note: 'جيل سبق التحول الرقمي وشهد مراحل اقتصادية واجتماعية متباينة.' },
  { key: 'silent', label: 'الجيل الصامت', from: 1928, to: 1945, note: 'جيل أقدم عاش تحولات عالمية كبرى ويظهر هنا عند إدخال تواريخ أقدم.' },
];

export const PLANET_YEAR_DAYS = [
  { key: 'mercury', label: 'عطارد', orbitDays: 87.969, note: 'أسرع كوكب حول الشمس.' },
  { key: 'venus', label: 'الزهرة', orbitDays: 224.701, note: 'سنة أقصر من الأرض لكنها أطول من عطارد.' },
  { key: 'earth', label: 'الأرض', orbitDays: 365.256, note: 'المرجع الأساسي للمقارنة.' },
  { key: 'mars', label: 'المريخ', orbitDays: 686.98, note: 'السنة عليه تقارب 1.88 سنة أرضية.' },
  { key: 'jupiter', label: 'المشتري', orbitDays: 4332.59, note: 'عام واحد عليه يساوي قرابة 11.86 سنة أرضية.' },
  { key: 'saturn', label: 'زحل', orbitDays: 10759.22, note: 'يحتاج قرابة 29.5 سنة أرضية ليكمل دورة.' },
  { key: 'uranus', label: 'أورانوس', orbitDays: 30688.5, note: 'عام واحد عليه أطول من معظم أعمار البشر.' },
  { key: 'neptune', label: 'نبتون', orbitDays: 60182, note: 'أطول سنة بين الكواكب الثمانية.' },
];

export const AGE_MILESTONE_DEFS = [
  { key: '1000-days', label: '1,000 يوم', unit: 'days', value: 1000 },
  { key: '5000-days', label: '5,000 يوم', unit: 'days', value: 5000 },
  { key: '10000-days', label: '10,000 يوم', unit: 'days', value: 10000 },
  { key: '15000-days', label: '15,000 يوم', unit: 'days', value: 15000 },
  { key: '500m-seconds', label: '500 مليون ثانية', unit: 'seconds', value: 500_000_000 },
  { key: '1b-seconds', label: 'مليار ثانية', unit: 'seconds', value: 1_000_000_000 },
  { key: '1_5b-seconds', label: '1.5 مليار ثانية', unit: 'seconds', value: 1_500_000_000 },
  { key: '2b-seconds', label: '2 مليار ثانية', unit: 'seconds', value: 2_000_000_000 },
];

export const HIJRI_MONTHS_INFO = [
  { month: 'محرم', kind: 'شهر حرام' },
  { month: 'صفر', kind: 'شهر قمري' },
  { month: 'ربيع الأول', kind: 'شهر قمري' },
  { month: 'ربيع الآخر', kind: 'شهر قمري' },
  { month: 'جمادى الأولى', kind: 'شهر قمري' },
  { month: 'جمادى الآخرة', kind: 'شهر قمري' },
  { month: 'رجب', kind: 'شهر حرام' },
  { month: 'شعبان', kind: 'قبل رمضان' },
  { month: 'رمضان', kind: 'شهر الصيام' },
  { month: 'شوال', kind: 'شهر العيد' },
  { month: 'ذو القعدة', kind: 'شهر حرام' },
  { month: 'ذو الحجة', kind: 'الحج والعيد' },
];

export const RETIREMENT_RULES = [
  {
    country: 'السعودية',
    code: 'sa',
    note: 'تقدير مبسط مبني على سن التقاعد النظامي الشائع. تحقّق دائماً من الجهة الرسمية أو نظام التأمينات قبل اتخاذ قرار مالي.',
    sectors: {
      government: { male: 65, female: 65 },
      private: { male: 60, female: 60 },
      military: { male: 44, female: 44 },
    },
  },
  {
    country: 'الإمارات',
    code: 'ae',
    note: 'النتيجة تقديرية لأن شروط الخدمة والتقاعد المبكر تختلف حسب الجهة ونوع جهة العمل.',
    sectors: {
      government: { male: 60, female: 60 },
      private: { male: 60, female: 60 },
      military: { male: 45, female: 45 },
    },
  },
  {
    country: 'مصر',
    code: 'eg',
    note: 'يعتمد الحساب هنا على السن العام الشائع للتقاعد. قد تتغير الشروط وفق القانون أو طبيعة الوظيفة.',
    sectors: {
      government: { male: 60, female: 60 },
      private: { male: 60, female: 60 },
      military: { male: 45, female: 45 },
    },
  },
  {
    country: 'الكويت',
    code: 'kw',
    note: 'توجد فروقات حسب مدة الخدمة والجهة. استخدم هذا الرقم كمرجع أولي فقط.',
    sectors: {
      government: { male: 65, female: 55 },
      private: { male: 60, female: 55 },
      military: { male: 45, female: 45 },
    },
  },
  {
    country: 'الأردن',
    code: 'jo',
    note: 'التقاعد المبكر وشروط الضمان قد تغير النتيجة الفعلية، لذا هذا تقدير أولي فقط.',
    sectors: {
      government: { male: 60, female: 55 },
      private: { male: 60, female: 55 },
      military: { male: 45, female: 45 },
    },
  },
  {
    country: 'المغرب',
    code: 'ma',
    note: 'تقدير تقريبي لسن التقاعد النظامي العام مع احتمال اختلافه حسب القطاع والصندوق.',
    sectors: {
      government: { male: 60, female: 60 },
      private: { male: 60, female: 60 },
      military: { male: 45, female: 45 },
    },
  },
];

export const AGE_HUB_QUICK_LINKS = [
  { href: '#age-hub-tools', label: 'الأدوات', description: 'استكشف الحاسبات المتاحة داخل القسم' },
  { href: '#age-hub-demo', label: 'تجربة فورية', description: 'احسب عمرك مباشرة من نفس الصفحة' },
  { href: '#age-hub-compare', label: 'الهجري والميلادي', description: 'افهم لماذا يظهر العمر الهجري أكبر قليلاً' },
  { href: '#age-hub-faq', label: 'FAQ', description: 'أكثر الأسئلة تكراراً عن حساب العمر' },
];
