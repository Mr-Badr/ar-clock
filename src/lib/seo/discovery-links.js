export const TOP_DISCOVERY_LINKS = [
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
  {
    href: '/economie/us-market-open',
    label: 'متى يفتح السوق الأمريكي اليوم؟',
    description: 'اعرف وقت الافتتاح بتوقيتك المحلي مع عد تنازلي مباشر وجدول للدول العربية.',
  },
  {
    href: '/economie/gold-market-hours',
    label: 'هل الذهب مفتوح الآن؟',
    description: 'تحقق فوراً من حالة سوق الذهب وساعات التداول الحالية وروابط الأدوات الاقتصادية المرتبطة.',
  },
];

export const ROOT_PRIORITY_TOOL_PATHS = [
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
  '/economie',
  '/economie/us-market-open',
  '/economie/gold-market-hours',
  '/economie/forex-sessions',
  '/economie/stock-markets',
  '/economie/market-clock',
  '/economie/best-trading-time',
  '/date/converter',
  '/date/today/hijri',
  '/date/today/gregorian',
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
