import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';
import { PERSONAL_FINANCE_HUB, PERSONAL_FINANCE_TOOLS } from '@/lib/calculators/personal-finance-data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { ALL_RAW_EVENTS } from '@/lib/events';
import { FEATURED_COUNTDOWN_LINKS } from '@/lib/seo/popular-links';

const calculatorHubHrefs = new Set(CALCULATOR_HUBS.map((hub) => hub.href));
const calculatorHubEnrichmentByHref = new Map([[PERSONAL_FINANCE_HUB.href, PERSONAL_FINANCE_HUB]]);
const calculatorToolEnrichmentByHref = new Map(
  PERSONAL_FINANCE_TOOLS.map((tool) => [tool.href, tool]),
);
const financeToolEnrichmentByHref = new Map(
  [
    'monthly-installment',
    'end-of-service-benefits',
    'article-77-compensation',
    'traffic-fine-discount',
    'annual-leave',
    'inheritance',
    'domestic-worker-cost',
    'pregnancy-weeks',
    'saudi-pay-dates',
    'saudi-school-calendar',
    'gpa-to-percent',
    'gpa',
    'fasting',
    'pregnancy',
  ]
    .map((slug) => {
      const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
      const content = getFinancePageContent(slug);
      return route?.href && content ? [route.href, content] : null;
    })
    .filter(Boolean),
);
// Looked up by slug, not href — the 'building' route's href moved to /tools/construction/build-cost
// during the construction-hub migration, and this find-by-href lookup silently returned null from
// that point on (found 2026-08-04 while consolidating the per-country building pages).
const buildingCalculatorRoute = CALCULATOR_ROUTES.find((route) => route.slug === 'building') || null;
const SEARCH_PRIORITY_BY_HREF = new Map([
  ['/time-now', 100],
  ['/mwaqit-al-salat', 98],
  ['/time-difference', 92],
  ['/date', 90],
  ['/date/today', 90],
  ['/date/converter', 96],
  ['/date/gregorian-to-hijri', 92],
  ['/date/hijri-to-gregorian', 92],
  ['/date/calendar', 82],
  ['/date/calendar/hijri', 82],
  ['/date/country', 80],
  ['/date/today/hijri', 88],
  ['/date/today/gregorian', 84],
  ['/tools', 84],
  ['/tools/gulf-finance', 96],
  ['/tools/gulf-finance/end-of-service-benefits', 95],
  ['/tools/gulf-finance/article-77-compensation', 94],
  ['/tools/gulf-finance/traffic-fine-discount', 92],
  ['/tools/health', 94],
  ['/tools/health/age-calculator', 97],
  ['/tools/health/age-difference', 91],
  ['/tools/health/age-hijri', 92],
  ['/tools/health/age-countdown', 90],
  ['/tools/health/age-birth-day', 78],
  ['/tools/health/age-milestones', 82],
  ['/tools/health/age-planets', 76],
  ['/tools/health/age-retirement', 80],
  ['/tools/personal-finance', 88],
  ['/tools/sleep', 86],
  ['/tools/construction/build-cost', 87],
  ['/tools/gulf-finance/domestic-worker-cost', 91],
  ['/tools/health/bmi', 92],
  ['/tools/health/pregnancy', 93],
  ['/tools/health/ovulation', 90],
  ['/tools/gulf-finance/wasiyya', 89],
  ['/tools/education/gpa', 92],
  ['/tools/health/fasting', 89],
  ['/tools/gulf-finance/annual-leave', 88],
  ['/tools/gulf-finance/aqiqah', 88],
  ['/tools/gulf-finance/iddah', 90],
  ['/tools/gulf-finance/iqama', 93],
  ['/tools/gulf-finance/nafaqah', 90],
  ['/tools/gulf-finance/sick-leave', 85],
  ['/tools/gulf-finance/working-days', 85],
  ['/tools/gulf-finance/saudi-pay-dates', 92],
  ['/tools/gulf-finance/gulf-pay-dates', 92],
  ['/holidays', 84],
]);

const POPULAR_SEARCH_SECTION_LIMITS = {
  time: 4,
  'calculators-hubs': 3,
  'calculators-tools': 5,
  holidays: 2,
};

const QUERY_PREFIX_TOKENS = new Set([
  'كم',
  'هل',
  'ما',
  'متي',
  'كيف',
  'ليش',
  'لماذا',
  'حاسبه',
  'حساب',
  'احسب',
  'اعرف',
  'ابحث',
  'موعد',
  'صفحه',
  'اداه',
]);
const QUERY_SUFFIX_TOKENS = new Set([
  'الان',
  'اليوم',
  'حاليا',
  'مباشر',
  'مباشره',
]);
const QUERY_GENERIC_TOKENS = new Set([
  ...QUERY_PREFIX_TOKENS,
  ...QUERY_SUFFIX_TOKENS,
  'الموقع',
  'الميقات',
  'ميقاتنا',
  'ادوات',
  'اداه',
  'ادواتي',
]);
const LOW_SIGNAL_QUERY_TOKENS = new Set([
  ...QUERY_GENERIC_TOKENS,
  'في',
  'من',
  'على',
  'عن',
  'الي',
  'الى',
  'او',
  'مع',
  'ثم',
  'بعد',
  'قبل',
  'هذا',
  'هذه',
  'ذلك',
  'التي',
  'الذي',
]);

function uniqStrings(values) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim().replace(/\s+/g, ' '))
        .filter(Boolean),
    ),
  );
}

function uniqNormalized(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function dedupeDirectoryItemsByHref(items) {
  const seen = new Set();

  return items.filter((item) => {
    const href = String(item?.href || '').trim();

    if (!href || seen.has(href)) return false;

    seen.add(href);
    return true;
  });
}

function getSearchPriority(href, fallback = 64) {
  if (SEARCH_PRIORITY_BY_HREF.has(href)) {
    return SEARCH_PRIORITY_BY_HREF.get(href);
  }

  if (href.startsWith('/tools/personal-finance/')) return 88;
  if (href.startsWith('/tools/health/age-')) return 88;
  if (href.startsWith('/tools/sleep/')) return 87;
  if (href.startsWith('/tools/')) return 86;
  if (href.startsWith('/holidays/')) return 72;
  if (href.startsWith('/date/')) return 78;
  if (href.startsWith('/time-now') || href.startsWith('/mwaqit-al-salat')) return 80;

  return fallback;
}

function buildDirectoryItem(
  baseItem,
  {
    queries = [],
    primaryQueries = [],
    supportQueries = [],
    defaultPriority = 64,
  } = {},
) {
  const itemPrimaryQueries = uniqStrings([
    baseItem.title,
    baseItem.heroTitle,
    ...queries,
    ...primaryQueries,
  ]);
  const itemSupportQueries = uniqStrings([
    baseItem.badge,
    ...supportQueries,
  ]);

  return {
    ...baseItem,
    kind: baseItem.kind || 'page',
    queries: itemPrimaryQueries,
    primaryQueries: itemPrimaryQueries,
    supportQueries: itemSupportQueries,
    searchQueries: uniqStrings([...itemPrimaryQueries, ...itemSupportQueries]),
    searchPriority: getSearchPriority(baseItem.href, defaultPriority),
  };
}

function normalizeArabicDigits(value) {
  return String(value || '')
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}

function normalizeSearchText(value) {
  return normalizeArabicDigits(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0640]/g, '')
    .replace(/[\u0610-\u061a\u064b-\u065f\u06d6-\u06ed]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[^\p{L}\p{N}\s/-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeDiscoveryQueryValue(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 120);
}

function tokenize(value) {
  return normalizeSearchText(value).split(' ').filter(Boolean);
}

function keepTokens(tokens) {
  return tokens.filter(Boolean);
}

function stripLeadingTokens(tokens, stopwords) {
  const nextTokens = [...tokens];

  while (nextTokens.length > 1 && stopwords.has(nextTokens[0])) {
    nextTokens.shift();
  }

  return keepTokens(nextTokens);
}

function stripTrailingTokens(tokens, stopwords) {
  const nextTokens = [...tokens];

  while (nextTokens.length > 1 && stopwords.has(nextTokens[nextTokens.length - 1])) {
    nextTokens.pop();
  }

  return keepTokens(nextTokens);
}

function removeGenericTokens(tokens) {
  return keepTokens(tokens.filter((token) => !QUERY_GENERIC_TOKENS.has(token)));
}

function stripArabicArticle(tokens) {
  return keepTokens(
    tokens.map((token) => (token.startsWith('ال') && token.length > 4 ? token.slice(2) : token)),
  );
}

function addTokenVariant(variants, tokens) {
  const phrase = keepTokens(tokens).join(' ').trim();
  if (phrase.length >= 2) variants.add(phrase);
}

function buildPhraseVariants(value) {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [];

  const tokens = tokenize(normalized);
  const variants = new Set([normalized]);
  const noPrefixTokens = stripLeadingTokens(tokens, QUERY_PREFIX_TOKENS);
  const noSuffixTokens = stripTrailingTokens(tokens, QUERY_SUFFIX_TOKENS);
  const trimmedTokens = stripTrailingTokens(noPrefixTokens, QUERY_SUFFIX_TOKENS);
  const coreTokens = removeGenericTokens(tokens);
  const coreTrimmedTokens = removeGenericTokens(trimmedTokens);

  addTokenVariant(variants, noPrefixTokens);
  addTokenVariant(variants, noSuffixTokens);
  addTokenVariant(variants, trimmedTokens);
  addTokenVariant(variants, coreTokens);
  addTokenVariant(variants, coreTrimmedTokens);
  addTokenVariant(variants, stripArabicArticle(tokens));
  addTokenVariant(variants, stripArabicArticle(coreTokens));
  addTokenVariant(variants, stripArabicArticle(coreTrimmedTokens));

  return Array.from(variants);
}

function buildNormalizedQuerySignals(values) {
  return uniqNormalized(values.flatMap((value) => buildPhraseVariants(value)));
}

function buildMeaningfulTokens(values) {
  return uniqNormalized(
    values
      .flatMap((value) => tokenize(value))
      .filter((token) => token.length > 1 && !LOW_SIGNAL_QUERY_TOKENS.has(token)),
  );
}

function getExpandedQueries(normalizedQuery) {
  return buildNormalizedQuerySignals([normalizedQuery]);
}

function pluckText(items, key) {
  return (items || []).map((item) => item?.[key]).filter(Boolean);
}

const TIME_AND_DATE_ITEMS = [
  buildDirectoryItem({
    href: '/time-now',
    kind: 'tool',
    title: 'كم الساعة الان في مدينتك؟',
    description: 'الوقت الحالي حسب المدينة والدولة مع صفحات محلية قابلة للفهرسة.',
  }, {
    queries: ['كم الساعة الان', 'الوقت الان', 'الساعة الان', 'الوقت الحالي في مدينتي'],
  }),
  buildDirectoryItem({
    href: '/mwaqit-al-salat',
    kind: 'tool',
    title: 'مواقيت الصلاة اليوم',
    description: 'مواعيد الفجر والظهر والعصر والمغرب والعشاء حسب المدينة.',
  }, {
    queries: ['مواقيت الصلاة', 'مواعيد الصلاة اليوم', 'وقت الصلاة اليوم', 'أوقات الأذان اليوم'],
  }),
  buildDirectoryItem({
    href: '/time-difference',
    kind: 'tool',
    title: 'فرق التوقيت بين مدينتين',
    description: 'اعرف من يسبق الآن وكم ساعة الفرق بين أي مدينتين.',
  }, {
    queries: ['فرق التوقيت بين مدينتين', 'فرق التوقيت الآن', 'كم فرق الوقت بين بلدين', 'حساب فرق التوقيت'],
  }),
  buildDirectoryItem({
    href: '/date',
    kind: 'section',
    title: 'التاريخ اليوم والتحويل',
    description: 'بوابة التاريخ الهجري والميلادي والمحولات والجداول اليومية.',
  }, {
    queries: ['تاريخ اليوم', 'التاريخ اليوم هجري وميلادي', 'تاريخ اليوم الهجري', 'تاريخ اليوم الميلادي'],
  }),
  buildDirectoryItem({
    href: '/date/today',
    kind: 'tool',
    title: 'كم تاريخ اليوم؟',
    description: 'اعرف تاريخ اليوم بالهجري والميلادي مع عرض مباشر لليوم الحالي.',
  }, {
    queries: ['كم تاريخ اليوم', 'تاريخ اليوم', 'تاريخ اليوم هجري وميلادي', 'ما هو تاريخ اليوم'],
  }),
  buildDirectoryItem({
    href: '/date/converter',
    kind: 'tool',
    title: 'محول التاريخ الهجري والميلادي',
    description: 'حوّل التاريخ بسرعة بين الهجري والميلادي مع عرض واضح للنتيجة.',
  }, {
    queries: ['محول التاريخ', 'تحويل التاريخ من هجري إلى ميلادي', 'تحويل التاريخ من ميلادي إلى هجري'],
  }),
  buildDirectoryItem({
    href: '/date/gregorian-to-hijri',
    kind: 'tool',
    title: 'كيف أحول من ميلادي إلى هجري؟',
    description: 'تحويل مباشر من التاريخ الميلادي إلى التاريخ الهجري في صفحة متخصصة وسريعة.',
  }, {
    queries: ['ميلادي إلى هجري', 'تحويل من ميلادي إلى هجري', 'كيف أحول من ميلادي إلى هجري'],
  }),
  buildDirectoryItem({
    href: '/date/hijri-to-gregorian',
    kind: 'tool',
    title: 'كيف أحول من هجري إلى ميلادي؟',
    description: 'تحويل مباشر من التاريخ الهجري إلى التاريخ الميلادي في صفحة عربية واضحة.',
  }, {
    queries: ['هجري إلى ميلادي', 'تحويل من هجري إلى ميلادي', 'كيف أحول من هجري إلى ميلادي'],
  }),
  buildDirectoryItem({
    href: '/date/today/hijri',
    kind: 'tool',
    title: 'التاريخ الهجري اليوم',
    description: 'اعرف التاريخ الهجري الحالي اليوم مع الصياغة العربية المباشرة.',
  }, {
    queries: ['التاريخ الهجري اليوم', 'كم التاريخ الهجري اليوم', 'ما هو التاريخ الهجري اليوم'],
  }),
  buildDirectoryItem({
    href: '/date/today/gregorian',
    kind: 'tool',
    title: 'التاريخ الميلادي اليوم',
    description: 'صفحة مباشرة للتاريخ الميلادي اليوم بصياغة جاهزة للمستخدم العربي.',
  }, {
    queries: ['التاريخ الميلادي اليوم', 'كم التاريخ الميلادي اليوم', 'ما هو التاريخ اليوم ميلادي'],
  }),
  buildDirectoryItem({
    href: '/date/calendar',
    kind: 'section',
    title: 'التقويم الميلادي الكامل',
    description: 'انتقل إلى التقويم الميلادي السنوي مع الربط بالتاريخ الهجري والأيام والمناسبات.',
  }, {
    queries: ['التقويم الميلادي', 'تقويم السنة', 'تقويم عام', 'تقويم شهري وميلادي'],
  }),
  buildDirectoryItem({
    href: '/date/calendar/hijri',
    kind: 'section',
    title: 'التقويم الهجري الكامل',
    description: 'بوابة التقويم الهجري السنوي مع الأيام والمواسم والتحويلات المرتبطة به.',
  }, {
    queries: ['التقويم الهجري', 'تقويم أم القرى', 'تقويم هجري كامل', 'تقويم هجري سنوي'],
  }),
  buildDirectoryItem({
    href: '/date/country',
    kind: 'section',
    title: 'التاريخ حسب الدولة',
    description: 'اعرف التاريخ الهجري والميلادي اليوم في الدول العربية من صفحة مخصصة لكل بلد.',
  }, {
    queries: ['التاريخ حسب الدولة', 'التاريخ اليوم في الدول العربية', 'التاريخ الهجري حسب الدولة'],
  }),
];

const CALCULATORS_ROOT_ITEM = buildDirectoryItem({
  href: '/tools',
  kind: 'section',
  title: 'قسم الحاسبات',
  heroTitle: 'أشهر الحاسبات العربية اليومية',
  description: 'احسب العمر، النوم، المال، البناء، الضريبة، والنسب المئوية من صفحات عربية واضحة.',
  badge: 'الحاسبات',
}, {
  queries: [
    'قسم الحاسبات',
    'كل الحاسبات',
    'حاسبات ميقاتنا',
    'حاسبة العمر',
    'حاسبة القسط الشهري',
    'حاسبة الضريبة',
    'حاسبات النوم الذكي',
  ],
  supportQueries: ['بوابات الحاسبات', 'الحاسبات العربية اليومية'],
  defaultPriority: 86,
});

const CALCULATOR_HUB_ITEMS = [CALCULATORS_ROOT_ITEM, ...CALCULATOR_HUBS.map((hub) => {
  const enrichment = calculatorHubEnrichmentByHref.get(hub.href);

  return buildDirectoryItem(
    {
      href: hub.href,
      kind: 'section',
      title: hub.title,
      heroTitle: hub.heroTitle,
      description: hub.description,
      badge: hub.badge,
    },
    {
      queries: [hub.shortLabel, ...(hub.keywords || []), ...(enrichment?.keywords || [])],
      supportQueries: [
        enrichment?.description,
        ...(enrichment?.highlights || []),
      ],
      defaultPriority: 84,
    },
  );
})];

const BASE_CALCULATOR_TOOL_ITEMS = CALCULATOR_ROUTES
  .filter((route) => !calculatorHubHrefs.has(route.href) && !route.draft)
  .map((route) => {
    const enrichment = calculatorToolEnrichmentByHref.get(route.href);
    const financeEnrichment = financeToolEnrichmentByHref.get(route.href);

    return buildDirectoryItem(
      {
        href: route.href,
        kind: 'tool',
        title: route.title,
        heroTitle: route.heroTitle,
        description: route.description,
        badge: route.badge,
      },
      {
        queries: [
          route.shortLabel,
          ...(route.keywords || []),
          ...(enrichment?.keywords || []),
          ...(enrichment?.intentKeywords || []),
          ...(financeEnrichment?.searchProfile?.priorityQueries || []),
          ...(financeEnrichment?.searchProfile?.questionQueries || []),
          ...(financeEnrichment?.searchProfile?.comparisonQueries || []),
          ...(financeEnrichment?.searchProfile?.regionalQueries || []),
        ],
        supportQueries: [
          enrichment?.description,
          ...pluckText(financeEnrichment?.quickAnswers, 'question'),
          ...pluckText(financeEnrichment?.faqItems, 'question'),
          ...pluckText(enrichment?.quickAnswers, 'question'),
          ...pluckText(enrichment?.infoItems, 'title'),
          ...pluckText(enrichment?.faqItems, 'question'),
        ],
        defaultPriority: 86,
      },
    );
  });

// Consolidated 2026-08-04: the old per-country pages (/calculators/building/<country>) were
// retired into one flagship selector at /tools/construction/build-cost (already covered by
// BASE_CALCULATOR_TOOL_ITEMS via CALCULATOR_ROUTES' 'building' entry). Rather than emit 14
// directory items that would collapse down to 1 through dedupeDirectoryItemsByHref anyway
// (losing 13 countries' worth of query coverage), fold every country's query variants into the
// SAME item's supportQueries so a search for "تكلفة البناء في مصر" still surfaces the one real
// page — this is what actually matters for internal search, not a 1-URL-per-item mapping.
const BUILDING_COUNTRY_SUPPORT_QUERIES = COUNTRY_LIST.flatMap((country) => [
  `حاسبة تكلفة البناء في ${country.name}`,
  `كم تكلفة البناء في ${country.nameShort}`,
  `تكلفة بناء بيت في ${country.nameShort}`,
  `سعر متر البناء في ${country.nameShort}`,
  `سعر بناء بيت في ${country.nameShort}`,
  `حاسبة البناء ${country.nameShort}`,
  `عظم وتشطيب في ${country.nameShort}`,
  `تكلفة مواد البناء في ${country.nameShort}`,
]);

const CALCULATOR_TOOL_ITEMS = dedupeDirectoryItemsByHref(BASE_CALCULATOR_TOOL_ITEMS).map((item) => {
  if (item.href !== buildingCalculatorRoute?.href) return item;
  return {
    ...item,
    supportQueries: uniqStrings([...item.supportQueries, ...BUILDING_COUNTRY_SUPPORT_QUERIES]),
    searchQueries: uniqStrings([...item.searchQueries, ...BUILDING_COUNTRY_SUPPORT_QUERIES]),
  };
});

// BLOG_ITEMS removed 2026-08-09 — /blog retired entirely (real traffic was 0 except 2 articles,
// migrated into /tools/construction, which are already covered by CALCULATOR_TOOL_ITEMS above).
// ALL_GUIDES is now always empty; no directory items need to come from it.

const featuredCountdownLookup = new Map(FEATURED_COUNTDOWN_LINKS.map((item) => [item.href, item]));

const HOLIDAY_ITEMS = [
  buildDirectoryItem({
    href: '/holidays',
    kind: 'section',
    title: 'العدادات والمناسبات القادمة',
    description: 'بوابة العدادات والمناسبات الموسمية والأعياد والإجازات.',
  }, {
    queries: ['العدادات والمناسبات', 'كم باقي على المناسبات', 'المناسبات القادمة', 'الأعياد والإجازات القادمة'],
  }),
  ...ALL_RAW_EVENTS.map((event) => {
    const href = `/holidays/${event.slug}`;
    const featured = featuredCountdownLookup.get(href);
    const eventTitle = featured?.label || event.name;

    return buildDirectoryItem(
      {
        href,
        kind: 'page',
        title: eventTitle,
        heroTitle: event.name,
        description: featured?.description || `صفحة عد تنازلي عن ${event.name} تعرض التاريخ الهجري والميلادي والخطوة التالية المناسبة بعد معرفة الموعد.`,
        badge: 'مناسبة / عداد',
      },
      {
        queries: [
          event.name,
          eventTitle,
          `كم باقي على ${event.name}`,
          `موعد ${event.name}`,
        ],
        supportQueries: [
          `عداد ${event.name}`,
          `المناسبة ${event.name}`,
          event.category,
          event.type,
        ],
        defaultPriority: featured ? 74 : 68,
      },
    );
  }),
  ...FEATURED_COUNTDOWN_LINKS
    .filter((item) => !ALL_RAW_EVENTS.some((event) => `/holidays/${event.slug}` === item.href))
    .map((item) =>
    buildDirectoryItem(
      {
        href: item.href,
        kind: 'page',
        title: item.label,
        description: 'صفحة عد تنازلي ومعلومة سريعة عن الموعد القادم.',
      },
      {
        queries: [
          item.label,
          `كم باقي على ${item.label}`,
          `موعد ${item.label}`,
        ],
        supportQueries: [`عداد ${item.label}`, `المناسبة ${item.label}`],
        defaultPriority: 72,
      },
    )),
];

const COMPANY_ITEMS = [
  buildDirectoryItem({
    href: '/',
    kind: 'section',
    title: 'الصفحة الرئيسية',
    description: 'المدخل الرئيسي لميقاتنا مع أبرز الأدوات والمسارات اليومية الأكثر استخداماً.',
  }, {
    queries: ['الصفحة الرئيسية', 'الرئيسية', 'ميقاتنا'],
    defaultPriority: 20,
  }),
  buildDirectoryItem({
    href: '/about',
    title: 'من نحن',
    description: 'اقرأ لماذا بُنيت ميقاتنا، كيف تخدمك أدواتها، وما المنهج الذي يحكم المحتوى والنتائج.',
  }, {
    queries: ['من نحن', 'عن ميقاتنا'],
    defaultPriority: 18,
  }),
  buildDirectoryItem({
    href: '/editorial-policy',
    title: 'السياسة التحريرية',
    description: 'كيف نكتب ونراجع وننشر المحتوى والأدوات داخل الموقع.',
  }, {
    queries: ['السياسة التحريرية', 'معايير المحتوى'],
    defaultPriority: 18,
  }),
  buildDirectoryItem({
    href: '/contact',
    title: 'اتصل بنا',
    description: 'قنوات التواصل والاستفسارات والملاحظات.',
  }, {
    queries: ['اتصل بنا', 'التواصل مع الموقع'],
    defaultPriority: 18,
  }),
  buildDirectoryItem({
    href: '/privacy',
    title: 'سياسة الخصوصية',
    description: 'كيف نتعامل مع البيانات والملفات التقنية وحقوق المستخدم.',
  }, {
    queries: ['سياسة الخصوصية', 'خصوصية الموقع'],
    defaultPriority: 18,
  }),
  buildDirectoryItem({
    href: '/terms',
    title: 'شروط الاستخدام',
    description: 'الشروط المنظمة لاستخدام الأدوات والمحتوى داخل الموقع.',
  }, {
    queries: ['شروط الاستخدام', 'شروط الموقع'],
    defaultPriority: 18,
  }),
  buildDirectoryItem({
    href: '/disclaimer',
    title: 'إخلاء المسؤولية',
    description: 'ملاحظات مهمة حول حدود الاستخدام والدقة والسياق.',
  }, {
    queries: ['إخلاء المسؤولية', 'تنبيه قانوني'],
    defaultPriority: 18,
  }),
];

export const SITE_DIRECTORY_SECTIONS = [
  {
    id: 'time',
    title: 'الوقت والتاريخ والمواعيد',
    description: 'الأدوات الأساسية التي تجيب عن الوقت الان، الصلاة، فرق التوقيت، والتاريخ اليوم.',
    items: TIME_AND_DATE_ITEMS,
  },
  {
    id: 'calculators-hubs',
    title: 'مسارات الحاسبات',
    description: 'بوابات تجمع الأدوات المتقاربة حسب السؤال الذي يبدأ منه الناس عادة، لا حسب اسم الحاسبة فقط.',
    items: CALCULATOR_HUB_ITEMS,
  },
  {
    id: 'calculators-tools',
    title: 'الحاسبات الفردية',
    description: 'الحاسبات نفسها: العمر، المال، البناء، النسب، القروض، الطوارئ، والديون.',
    items: CALCULATOR_TOOL_ITEMS,
  },
  {
    id: 'holidays',
    title: 'المناسبات والعدادات',
    description: 'صفحات العد التنازلي والمواسم والأعياد والصفحات الأكثر زيارة في هذا المسار.',
    items: HOLIDAY_ITEMS,
  },
  {
    id: 'company',
    title: 'الصفحات الأساسية',
    description: 'الصفحات التعريفية والتحريرية والقانونية والتواصل.',
    items: COMPANY_ITEMS,
  },
];

export const SITE_DIRECTORY_COUNTS = {
  sections: SITE_DIRECTORY_SECTIONS.length,
  items: SITE_DIRECTORY_SECTIONS.reduce((sum, section) => sum + section.items.length, 0),
  calculators: CALCULATOR_HUB_ITEMS.length + CALCULATOR_TOOL_ITEMS.length,
};

export const SITE_SEARCH_INDEX = SITE_DIRECTORY_SECTIONS.flatMap((section) =>
  section.items.map((item) => {
    const primaryQueries = uniqStrings([...(item.primaryQueries || []), item.title, item.heroTitle]);
    const supportQueries = uniqStrings([...(item.supportQueries || []), item.badge]);
    const searchQueries = uniqStrings([...primaryQueries, ...supportQueries]);
    const normalizedPrimaryQueries = buildNormalizedQuerySignals(primaryQueries);
    const normalizedSupportQueries = buildNormalizedQuerySignals(supportQueries);
    const titleNormalized = normalizeSearchText(item.title);
    const heroTitleNormalized = normalizeSearchText(item.heroTitle);
    const descriptionNormalized = normalizeSearchText(item.description);
    const badgeNormalized = normalizeSearchText(item.badge);
    const sectionTitleNormalized = normalizeSearchText(section.title);
    const hrefNormalized = normalizeSearchText(item.href);
    const searchableParts = [
      item.title,
      item.heroTitle,
      item.badge,
      item.description,
      section.title,
      section.description,
      item.href,
      ...searchQueries,
    ];
    const searchableText = normalizeSearchText(searchableParts.join(' '));

    return {
      ...item,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionDescription: section.description,
      primaryQueries,
      supportQueries,
      searchQueries,
      normalizedPrimaryQueries,
      normalizedSupportQueries,
      titleNormalized,
      heroTitleNormalized,
      descriptionNormalized,
      badgeNormalized,
      sectionTitleNormalized,
      hrefNormalized,
      searchableText,
      primaryTokens: buildMeaningfulTokens(primaryQueries),
      supportTokens: buildMeaningfulTokens(supportQueries),
      searchableTokens: buildMeaningfulTokens(searchableParts),
    };
  }),
);

export const SITE_DISCOVERY_PATHS = uniqStrings([
  '/fahras',
  ...SITE_SEARCH_INDEX.map((item) => item.href),
]);

function derivePopularSiteSearches(index, limit = 20) {
  const results = [];
  const seenQueries = new Set();
  const sectionCounts = new Map();
  const sortedItems = [...index].sort(
    (a, b) =>
      (b.searchPriority || 0) - (a.searchPriority || 0)
      || a.title.localeCompare(b.title, 'ar'),
  );

  for (const item of sortedItems) {
    const sectionLimit = POPULAR_SEARCH_SECTION_LIMITS[item.sectionId] ?? 2;
    const usedInSection = sectionCounts.get(item.sectionId) ?? 0;

    if (usedInSection >= sectionLimit) continue;

    const selectedQuery = item.primaryQueries.find((query) => {
      const normalized = normalizeSearchText(query);
      return normalized.length >= 4 && !seenQueries.has(normalized);
    });

    if (!selectedQuery) continue;

    results.push(selectedQuery);
    seenQueries.add(normalizeSearchText(selectedQuery));
    sectionCounts.set(item.sectionId, usedInSection + 1);

    if (results.length >= limit) break;
  }

  return results;
}

export const POPULAR_SITE_SEARCHES = derivePopularSiteSearches(SITE_SEARCH_INDEX);

function scoreTextVariants(value, variants, { exact = 0, includes = 0, reverseIncludes = 0 } = {}) {
  if (!value) return 0;

  let best = 0;

  for (const variant of variants) {
    if (!variant) continue;

    if (value === variant) {
      best = Math.max(best, exact);
      continue;
    }

    if (value.includes(variant)) {
      best = Math.max(best, includes);
      continue;
    }

    if (reverseIncludes && variant.length >= 4 && variant.includes(value)) {
      best = Math.max(best, reverseIncludes);
    }
  }

  return best;
}

function scoreQueryGroup(values, variants, scores) {
  return values.reduce(
    (best, value) => Math.max(best, scoreTextVariants(value, variants, scores)),
    0,
  );
}

function countSharedTokens(indexTokens, queryTokens) {
  if (!indexTokens.length || !queryTokens.length) return 0;

  const tokenSet = new Set(indexTokens);
  return queryTokens.reduce((count, token) => count + Number(tokenSet.has(token)), 0);
}

export function searchSiteIndex(query, { limit = 36 } = {}) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return {
      normalizedQuery: '',
      expandedQueries: [],
      total: 0,
      results: [],
      groupedResults: [],
    };
  }

  const tokens = buildMeaningfulTokens([normalizedQuery]);
  const expandedQueries = getExpandedQueries(normalizedQuery);

  const scoredResults = SITE_SEARCH_INDEX.map((item) => {
    let relevanceScore = 0;

    relevanceScore += scoreTextVariants(item.titleNormalized, expandedQueries, {
      exact: 220,
      includes: 150,
      reverseIncludes: 74,
    });
    relevanceScore += scoreTextVariants(item.heroTitleNormalized, expandedQueries, {
      exact: 170,
      includes: 112,
      reverseIncludes: 56,
    });
    relevanceScore += scoreQueryGroup(item.normalizedPrimaryQueries, expandedQueries, {
      exact: 260,
      includes: 180,
      reverseIncludes: 88,
    });
    relevanceScore += scoreQueryGroup(item.normalizedSupportQueries, expandedQueries, {
      exact: 150,
      includes: 92,
      reverseIncludes: 42,
    });
    relevanceScore += scoreTextVariants(item.badgeNormalized, expandedQueries, {
      exact: 80,
      includes: 48,
      reverseIncludes: 24,
    });
    relevanceScore += scoreTextVariants(item.descriptionNormalized, expandedQueries, {
      exact: 66,
      includes: 38,
      reverseIncludes: 18,
    });
    relevanceScore += scoreTextVariants(item.sectionTitleNormalized, expandedQueries, {
      exact: 42,
      includes: 18,
      reverseIncludes: 8,
    });
    relevanceScore += scoreTextVariants(item.hrefNormalized, expandedQueries, {
      exact: 32,
      includes: 16,
      reverseIncludes: 8,
    });
    relevanceScore += scoreTextVariants(item.searchableText, expandedQueries, {
      exact: 28,
      includes: 22,
      reverseIncludes: 10,
    });

    const primaryTokenMatches = countSharedTokens(item.primaryTokens, tokens);
    const supportTokenMatches = countSharedTokens(item.supportTokens, tokens);
    const searchableTokenMatches = countSharedTokens(item.searchableTokens, tokens);

    relevanceScore += primaryTokenMatches * 34;
    relevanceScore += supportTokenMatches * 16;
    relevanceScore += searchableTokenMatches * 9;

    if (tokens.length > 1) {
      if (primaryTokenMatches === tokens.length) relevanceScore += 96;
      else if (searchableTokenMatches === tokens.length) relevanceScore += 52;
      else if (primaryTokenMatches >= Math.ceil(tokens.length * 0.75)) relevanceScore += 28;
    }

    const score = relevanceScore > 0
      ? relevanceScore + (item.searchPriority || 0)
      : 0;

    return { ...item, score, relevanceScore };
  })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score
        || (b.searchPriority || 0) - (a.searchPriority || 0)
        || a.title.localeCompare(b.title, 'ar'),
    )
    .slice(0, limit);

  const groupedMap = new Map();
  for (const item of scoredResults) {
    if (!groupedMap.has(item.sectionId)) {
      groupedMap.set(item.sectionId, {
        sectionId: item.sectionId,
        sectionTitle: item.sectionTitle,
        items: [],
      });
    }

    groupedMap.get(item.sectionId).items.push(item);
  }

  return {
    normalizedQuery,
    expandedQueries,
    total: scoredResults.length,
    results: scoredResults,
    groupedResults: Array.from(groupedMap.values()),
  };
}

export function sortDiscoveryItemsByPriority(items = []) {
  return [...items].sort(
    (a, b) =>
      (b.searchPriority || 0) - (a.searchPriority || 0)
      || a.title.localeCompare(b.title, 'ar'),
  );
}

export function getFeaturedSiteItems(limit = 10) {
  return sortDiscoveryItemsByPriority(SITE_SEARCH_INDEX)
    .filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index)
    .slice(0, limit);
}

function buildRelatedQueries(searchModel, topSearches, limit = 10) {
  return uniqStrings([
    ...(searchModel.results[0]?.primaryQueries || []).slice(0, 6),
    ...searchModel.results.slice(1, 5).flatMap((item) => item.primaryQueries.slice(0, 2)),
    ...topSearches,
  ])
    .filter((query) => normalizeSearchText(query) !== searchModel.normalizedQuery)
    .slice(0, limit);
}

export function buildDiscoveryViewModel(query) {
  const normalizedInput = normalizeDiscoveryQueryValue(query);
  const searchModel = searchSiteIndex(normalizedInput);
  const allItems = sortDiscoveryItemsByPriority(SITE_SEARCH_INDEX);
  const featuredItems = getFeaturedSiteItems(12);
  const topSearches = POPULAR_SITE_SEARCHES.slice(0, 12);
  const bestResult = searchModel.results[0] || null;
  const relatedQueries = searchModel.normalizedQuery
    ? buildRelatedQueries(searchModel, topSearches)
    : topSearches;
  const sectionMap = SITE_DIRECTORY_SECTIONS.map((section) => {
    const sortedItems = sortDiscoveryItemsByPriority(section.items).map((item) => ({
      ...item,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionDescription: section.description,
    }));
    const [leadItem, ...remainingItems] = sortedItems;
    const intentChips = uniqStrings(
      sortedItems.flatMap((item) => item.primaryQueries.slice(0, 2)),
    ).slice(0, 6);

    return {
      ...section,
      items: sortedItems,
      leadItem,
      primaryItems: sortedItems.slice(0, 3),
      restItems: remainingItems,
      intentChips,
    };
  });

  return {
    query: normalizedInput,
    hasQuery: Boolean(searchModel.normalizedQuery),
    searchModel,
    allItems,
    featuredItems,
    topSearches,
    bestResult,
    relatedQueries,
    sectionMap,
    sectionCounts: SITE_DIRECTORY_COUNTS,
  };
}
