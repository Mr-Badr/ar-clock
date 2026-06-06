export const TOP_DISCOVERY_LINKS = [
  {
    href: '/blog',
    label: 'مدونة ميقاتنا',
    description: 'ابدأ من المقالات الشارحة ثم انتقل مباشرة إلى الحاسبات والمسارات اليومية.',
  },
  {
    href: '/calculators/sleep',
    label: 'حاسبات النوم الذكي',
    description: 'اعرف متى تنام ومتى تستيقظ، واحسب القيلولة ودين النوم من صفحة منظمة وواضحة.',
  },
  {
    href: '/calculators/sleep/bedtime',
    label: 'متى أنام لأستيقظ في الوقت المناسب؟',
    description: 'احصل على أوقات النوم المقترحة حسب دورات النوم ووقت الغفو التقريبي.',
  },
  {
    href: '/calculators/sleep/wake-time',
    label: 'إذا نمت الآن، متى أستيقظ؟',
    description: 'أداة فورية وعالية الاستخدام تبني وقت الاستيقاظ من لحظة النوم الحالية.',
  },
  {
    href: '/calculators/personal-finance',
    label: 'حاسبات التخطيط المالي الشخصي',
    description: 'ابدأ من صندوق الطوارئ أو الديون أو الادخار أو صافي الثروة بحسب قرارك الحالي.',
  },
  {
    href: '/calculators/personal-finance/emergency-fund',
    label: 'كم تحتاج صندوق طوارئ؟',
    description: 'احسب صندوق الطوارئ المناسب لك واعرف المبلغ المتبقي والمدة المتوقعة للوصول.',
  },
  {
    href: '/calculators/personal-finance/debt-payoff',
    label: 'متى أخلص من ديوني؟',
    description: 'احسب مدة سداد الديون وقارن بين كرة الثلج والانهيار.',
  },
  {
    href: '/calculators/finance',
    label: 'حاسبات المال والعمل',
    description: 'احسب القسط والضريبة والنسبة المئوية ومكافأة نهاية الخدمة من مدخل واحد واضح.',
  },
  {
    href: '/calculators/age/calculator',
    label: 'كم عمري الآن؟ حاسبة العمر',
    description: 'احسب عمرك بالسنوات والأشهر والأيام والثواني مع عيد الميلاد القادم وكم يوم عشت.',
  },
  {
    href: '/calculators/monthly-installment',
    label: 'كم قسط القرض الشهري؟',
    description: 'اعرف القسط الشهري وإجمالي الفوائد وأثر السداد المبكر قبل اتخاذ قرار التمويل.',
  },
  {
    href: '/calculators/vat',
    label: 'كم الضريبة 15%؟',
    description: 'أضف ضريبة القيمة المضافة أو استخرجها من السعر الشامل فوراً وبشكل واضح.',
  },
];

export const ROOT_PRIORITY_TOOL_PATHS = [
  '/fahras',
  '/blog',
  '/calculators/sleep',
  '/calculators/sleep/bedtime',
  '/calculators/sleep/wake-time',
  '/calculators/sleep/sleep-duration',
  '/calculators/sleep/nap-calculator',
  '/calculators/sleep/sleep-debt',
  '/calculators/sleep/sleep-needs-by-age',
  '/calculators/personal-finance',
  '/calculators/personal-finance/emergency-fund',
  '/calculators/personal-finance/debt-payoff',
  '/calculators/personal-finance/savings-goal',
  '/calculators/personal-finance/net-worth',
  '/calculators/finance',
  '/calculators/age',
  '/calculators/age/calculator',
  '/calculators/age/hijri',
  '/calculators/age/difference',
  '/calculators/age/milestones',
  '/calculators/building',
  '/calculators/building/cement',
  '/calculators/building/rebar',
  '/calculators/building/tiles',
  '/calculators/end-of-service-benefits',
  '/calculators/monthly-installment',
  '/calculators/vat',
  '/calculators/percentage',
  '/date/converter',
  '/date/today/hijri',
  '/date/today/gregorian',
  '/blog/how-many-cement-bags-do-i-need',
  '/blog/how-to-estimate-rebar-weight',
  '/blog/what-is-a-sleep-cycle',
  '/blog/how-many-hours-of-sleep-do-i-need',
  '/blog/best-nap-length',
  '/blog/sleep-debt-explained',
  '/blog/why-am-i-tired-after-sleeping',
  '/blog/how-long-does-it-take-to-fall-asleep',
  '/blog/rem-vs-deep-sleep',
  '/blog/sleep-hygiene-basics',
];

export function appendToolDiscoveryLinks(baseLinks = []) {
  const merged = [...baseLinks, ...TOP_DISCOVERY_LINKS];
  const seen = new Set();

  return merged.filter((link) => {
    if (!link?.href || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}
