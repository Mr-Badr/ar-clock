export const SLEEP_NEED_RANGES = [
  {
    id: 'preschool',
    label: 'الأطفال 3–5 سنوات',
    minAge: 3,
    maxAge: 5,
    recommendedMin: 10,
    recommendedMax: 13,
    note: 'في هذا العمر يكون النوم أطول لأن الدماغ والجسم في مرحلة نمو سريع.',
  },
  {
    id: 'school-age',
    label: 'الأطفال 6–12 سنة',
    minAge: 6,
    maxAge: 12,
    recommendedMin: 9,
    recommendedMax: 12,
    note: 'الانتظام هنا مهم مثل عدد الساعات تقريباً.',
  },
  {
    id: 'teens',
    label: 'المراهقون 13–18 سنة',
    minAge: 13,
    maxAge: 18,
    recommendedMin: 8,
    recommendedMax: 10,
    note: 'قلة النوم عند المراهقين تظهر سريعاً في التركيز والمزاج.',
  },
  {
    id: 'adults',
    label: 'البالغون 19–60 سنة',
    minAge: 19,
    maxAge: 60,
    recommendedMin: 7,
    recommendedMax: 9,
    note: 'معظم البالغين يحتاجون 7 ساعات أو أكثر، لكن الجودة والانتظام يغيران التجربة كثيراً.',
  },
  {
    id: 'older-adults',
    label: '61 سنة فأكثر',
    minAge: 61,
    maxAge: 120,
    recommendedMin: 7,
    recommendedMax: 8,
    note: 'قد يقل الحد الأعلى قليلاً مع التقدم في العمر، لكن بقاء النوم متقطعاً ليس أمراً مثالياً بالضرورة.',
  },
];

export const QUICK_WAKE_TIMES = ['05:00', '06:00', '07:00', '08:00'];
export const QUICK_BED_TIMES = ['21:30', '22:30', '23:30', '00:00'];
export const SLEEP_LATENCY_OPTIONS = [10, 15, 20];
export const SLEEP_CYCLE_OPTIONS = [85, 90, 95, 100];
export const NAP_DURATION_OPTIONS = [
  { value: 20, label: '20 دقيقة', description: 'تنشيط سريع مع أقل احتمال للخمول' },
  { value: 30, label: '30 دقيقة', description: 'قد تفيدك لكنها أقرب إلى منطقة الخمول لبعض الناس' },
  { value: 90, label: '90 دقيقة', description: 'دورة كاملة إذا كان عندك وقت كافٍ' },
];

export const SLEEP_MODES = [
  {
    slug: 'morning-routine',
    title: 'وضع الدوام الصباحي',
    description: 'ابدأ من وقت الاستيقاظ ثم ابنِ وقت النوم المناسب دون ضغط آخر الليل.',
    href: '/calculators/sleep/bedtime',
  },
  {
    slug: 'student-mode',
    title: 'وضع الطالب',
    description: 'وازن بين وقت المذاكرة وعدد الساعات الفعلية حتى لا تستيقظ مرهقاً يوم الامتحان.',
    href: '/calculators/sleep/sleep-duration',
  },
  {
    slug: 'shift-mode',
    title: 'وضع الشفتات',
    description: 'راقب دين النوم والتقلب في ساعاتك الفعلية بدل الاعتماد على رقم ثابت يومياً.',
    href: '/calculators/sleep/sleep-debt',
  },
  {
    slug: 'nap-mode',
    title: 'وضع القيلولة',
    description: 'اختر قيلولة قصيرة أو دورة كاملة ثم اعرف متى تستيقظ دون ثقل زائد.',
    href: '/calculators/sleep/nap-calculator',
  },
  {
    slug: 'travel-mode',
    title: 'وضع السفر',
    description: 'إذا كنت متعباً الآن وتريد فقط أن تعرف متى تستيقظ، فابدأ من أداة النوم الآن.',
    href: '/calculators/sleep/wake-time',
  },
  {
    slug: 'early-wake-mode',
    title: 'وضع الاستيقاظ المبكر',
    description: 'مثالي لمن يريد النوم مبكراً والاستيقاظ 5 أو 6 صباحاً مع خيارات متعددة لا خياراً واحداً فقط.',
    href: '/calculators/sleep/bedtime',
  },
];
