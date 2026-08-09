export const TOP_DISCOVERY_LINKS = [
  {
    href: '/tools/sleep',
    label: 'حاسبات النوم الذكي',
    description: 'اعرف متى تنام ومتى تستيقظ، واحسب القيلولة ودين النوم من صفحة منظمة وواضحة.',
  },
  {
    href: '/tools/sleep/bedtime',
    label: 'متى أنام لأستيقظ في الوقت المناسب؟',
    description: 'احصل على أوقات النوم المقترحة حسب دورات النوم ووقت الغفو التقريبي.',
  },
  {
    href: '/tools/sleep/wake-time',
    label: 'إذا نمت الآن، متى أستيقظ؟',
    description: 'أداة فورية وعالية الاستخدام تبني وقت الاستيقاظ من لحظة النوم الحالية.',
  },
  {
    href: '/tools/personal-finance',
    label: 'حاسبات التخطيط المالي الشخصي',
    description: 'ابدأ من صندوق الطوارئ أو الديون أو الادخار أو صافي الثروة بحسب قرارك الحالي.',
  },
  {
    href: '/tools/personal-finance/emergency-fund',
    label: 'كم تحتاج صندوق طوارئ؟',
    description: 'احسب صندوق الطوارئ المناسب لك واعرف المبلغ المتبقي والمدة المتوقعة للوصول.',
  },
  {
    href: '/tools/personal-finance/debt-payoff',
    label: 'متى أخلص من ديوني؟',
    description: 'احسب مدة سداد الديون وقارن بين كرة الثلج والانهيار.',
  },
  {
    href: '/tools/gulf-finance',
    label: 'حاسبات المال والعمل',
    description: 'احسب مكافأة نهاية الخدمة، تعويض المادة 77، وخصم المخالفات المرورية من مدخل واحد واضح.',
  },
  {
    href: '/tools/health/age-calculator',
    label: 'كم عمري الآن؟ حاسبة العمر',
    description: 'احسب عمرك بالسنوات والأشهر والأيام والثواني مع عيد الميلاد القادم وكم يوم عشت.',
  },
  {
    href: '/tools/gulf-finance/article-77-compensation',
    label: 'كم تعويض الفصل التعسفي؟',
    description: 'احسب تعويض المادة 77 إذا أنهى صاحب العمل عقدك دون سبب مشروع، بحد أدنى أجر شهرين.',
  },
  {
    href: '/tools/gulf-finance/traffic-fine-discount',
    label: 'هل تستحق خصم 25% على مخالفتك؟',
    description: 'اعرف المبلغ المستحق بعد خصم المادة 75 قبل انتهاء مهلة الـ45 يوماً.',
  },
];

export const ROOT_PRIORITY_TOOL_PATHS = [
  '/fahras',
  '/tools/sleep',
  '/tools/sleep/bedtime',
  '/tools/sleep/wake-time',
  '/tools/sleep/sleep-duration',
  '/tools/sleep/nap-calculator',
  '/tools/sleep/sleep-debt',
  '/tools/sleep/sleep-needs-by-age',
  '/tools/personal-finance',
  '/tools/personal-finance/emergency-fund',
  '/tools/personal-finance/debt-payoff',
  '/tools/personal-finance/savings-goal',
  '/tools/personal-finance/net-worth',
  '/tools/gulf-finance',
  '/tools/health/age-calculator',
  '/tools/health/age-hijri',
  '/tools/health/age-difference',
  '/tools/health/age-milestones',
  '/tools/construction/build-cost',
  '/tools/construction/cement',
  '/tools/construction/rebar-weight',
  '/tools/construction/tiles',
  '/tools/gulf-finance/end-of-service-benefits',
  '/tools/gulf-finance/article-77-compensation',
  '/tools/gulf-finance/traffic-fine-discount',
  '/date/converter',
  '/date/today/hijri',
  '/date/today/gregorian',
  // /blog/how-many-cement-bags-do-i-need + /blog/how-to-estimate-rebar-weight migrated here
  // 2026-08-09 (the only 2 articles in the whole retired /blog section with real traffic).
  // The other 8 entries that used to follow these (what-is-a-sleep-cycle, best-nap-length, etc.)
  // were removed in the same pass — they'd been dead links since the standalone sleep-guides
  // content system was dropped 2026-08-04 (SLEEP_GUIDES has been an empty array ever since);
  // nothing ever actually routed at those URLs.
  '/tools/construction/how-many-cement-bags-do-i-need',
  '/tools/construction/how-to-estimate-rebar-weight',
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
