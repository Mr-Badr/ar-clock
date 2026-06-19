import BlogHubClient from '@/components/blog/BlogHubClient';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { JsonLd } from '@/components/seo/JsonLd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { countBlogArticleWords, estimateBlogArticleReadingMinutes } from '@/lib/blog/read-time';
import { ALL_GUIDES } from '@/lib/guides/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function uniqStrings(values) {
  const safeValues = Array.isArray(values) ? values : [];
  return Array.from(new Set(safeValues.map((value) => String(value || '').trim()).filter(Boolean)));
}

const BLOG_COLLECTION_META = [
  {
    href: '/calculators/sleep',
    title: 'النوم الذكي',
    description: 'مقالات تشرح النوم كروتين يومي: متى تنام، متى تستيقظ، متى تفيد القيلولة، ومتى يتحول التعب أو دين النوم إلى إشارة تحتاج انتباهاً.',
    accent: 'var(--info)',
  },
  {
    href: '/calculators/building',
    title: 'البناء والتشييد',
    description: 'مقالات توضيحية لمن يريد فهم تقديرات الأسمنت وحديد التسليح والبلاط قبل الحساب النهائي.',
    accent: 'var(--warning)',
  },
];

const COLLECTION_META_BY_HREF = new Map(BLOG_COLLECTION_META.map((group) => [group.href, group]));
const CALCULATOR_ROUTE_META = new Map(
  (Array.isArray(CALCULATOR_ROUTES) ? CALCULATOR_ROUTES : []).map((route) => [
    route.href,
    {
      href: route.href,
      title: route.shortLabel || route.title,
      description: route.description,
      badge: route.badge || 'أداة عملية',
    },
  ]),
);
const GENERIC_SUPPORT_META = new Map([
  [
    '/fahras',
    {
      href: '/fahras',
      title: 'استكشف الصفحات',
      description: 'ابدأ منه عندما لا تعرف اسم الصفحة. الفهرس يرتب الأدوات والمقالات والصفحات اليومية حتى تصل إلى المسار الأقرب لسؤالك.',
      badge: 'صفحة جامعة',
    },
  ],
  [
    '/calculators',
    {
      href: '/calculators',
      title: 'قسم الحاسبات',
      description: 'حوّل السؤال إلى رقم: عمر، بناء، نوم، وقت، أو تاريخ. افتح الحاسبة بعد أن تفهم الفكرة من المقال.',
      badge: 'المسار الأعلى',
    },
  ],
  [
    '/time-now',
    {
      href: '/time-now',
      title: 'الوقت الان',
      description: 'اعرف الساعة الحالية في مدينة أو دولة، ثم انتقل إلى فرق التوقيت أو الصلاة أو التاريخ إذا كان السؤال مرتبطاً بموعد.',
      badge: 'صفحة يومية',
    },
  ],
  [
    '/date/converter',
    {
      href: '/date/converter',
      title: 'محول التاريخ',
      description: 'استخدمه عندما يذكر المقال موعداً هجرياً أو ميلادياً وتريد تحويله أو التأكد من طريقة الحساب المناسبة.',
      badge: 'تحويل سريع',
    },
  ],
  [
    '/mwaqit-al-salat',
    {
      href: '/mwaqit-al-salat',
      title: 'مواقيت الصلاة',
      description: 'افتحها عندما يتحول السؤال من موعد أو سفر إلى تنظيم يومك حول الصلوات في المدينة نفسها.',
      badge: 'صفحة يومية',
    },
  ],
]);
function getSupportCard(href, overrides = {}) {
  const base =
    CALCULATOR_ROUTE_META.get(href)
    || GENERIC_SUPPORT_META.get(href);

  if (!base) return null;

  return {
    ...base,
    ...overrides,
    href,
  };
}

const BLOG_SHORTCUTS = [
  '/fahras',
  '/calculators',
  '/time-now',
].map((href) => getSupportCard(href)).filter(Boolean);

const BLOG_SUPPORT_LINKS_BY_HREF = new Map([
  [
    '/calculators/sleep',
    [
      '/calculators/sleep',
      '/calculators/sleep/bedtime',
      '/calculators/sleep/wake-time',
      '/calculators/sleep/nap-calculator',
      '/calculators/sleep/sleep-debt',
      '/calculators/sleep/sleep-needs-by-age',
    ].map((href) => getSupportCard(href)).filter(Boolean),
  ],
  [
    '/calculators/building',
    [
      '/calculators/building',
      '/calculators/building/cement',
      '/calculators/building/rebar',
      '/calculators/building/tiles',
    ].map((href) => getSupportCard(href)).filter(Boolean),
  ],
]);

function buildBlogGroups() {
  const buckets = new Map();
  const safeGuides = Array.isArray(ALL_GUIDES) ? ALL_GUIDES : [];

  for (const guide of safeGuides) {
    const meta = COLLECTION_META_BY_HREF.get(guide.hubHref) || {
      href: guide.hubHref || '/blog',
      title: guide.hubTitle || 'مقالات متنوعة',
      description: 'مقالات مساندة للأدوات والمسارات الرئيسية داخل الموقع.',
      accent: 'var(--text-muted)',
    };

    if (!buckets.has(meta.href)) {
      buckets.set(meta.href, {
        ...meta,
        guides: [],
      });
    }

    buckets.get(meta.href).guides.push(guide);
  }

  const orderedGroups = [
    ...BLOG_COLLECTION_META.map((group) => buckets.get(group.href)).filter(Boolean),
    ...Array.from(buckets.values()).filter(
      (group) => !BLOG_COLLECTION_META.some((item) => item.href === group.href),
    ),
  ];

  return orderedGroups.map((group) => ({
    ...group,
    guides: (Array.isArray(group.guides) ? [...group.guides] : []).sort((leftGuide, rightGuide) => (
      countBlogArticleWords(rightGuide) - countBlogArticleWords(leftGuide)
      || String(leftGuide.title || '').localeCompare(String(rightGuide.title || ''), 'ar')
    )),
  }));
}

const BLOG_GROUPS = buildBlogGroups();
const BLOG_COLLECTIONS = BLOG_GROUPS.map((group) => ({
  id: group.href,
  href: group.href,
  title: group.title,
  description: group.description,
  accent: group.accent,
  articleCount: Array.isArray(group.guides) ? group.guides.length : 0,
  supportLinks: (BLOG_SUPPORT_LINKS_BY_HREF.get(group.href) || []).slice(0, 4),
  articles: (Array.isArray(group.guides) ? group.guides : []).map((guide) => ({
    href: guide.href,
    title: guide.title,
    metaTitle: guide.metaTitle || guide.title,
    description: guide.description,
    badge: guide.badge || group.title,
    readingMinutes: estimateBlogArticleReadingMinutes(guide),
    quickAnswerCount: Array.isArray(guide.quickAnswers) ? guide.quickAnswers.length : 0,
    stepCount: Array.isArray(guide.steps) ? guide.steps.length : 0,
    faqCount: Array.isArray(guide.faqItems) ? guide.faqItems.length : 0,
    wordCount: countBlogArticleWords(guide),
    collectionHref: group.href,
    collectionTitle: group.title,
    collectionAccent: group.accent,
    summaryValue: guide.summary?.value || '',
    keywords: Array.isArray(guide.keywords) ? guide.keywords : [],
    intentKeywords: Array.isArray(guide.intentKeywords) ? guide.intentKeywords : [],
  })),
}));

const SAFE_ALL_GUIDES = Array.isArray(ALL_GUIDES) ? ALL_GUIDES : [];
const BLOG_KEYWORDS = uniqStrings([
  'مدونة ميقاتنا',
  'مقالات عربية عملية',
  'مقالات الحاسبات العربية',
  'شروحات الحاسبات',
  'مقالات النوم بالعربية',
  'مقالات البناء والتكاليف',
  ...SAFE_ALL_GUIDES.flatMap((guide) => [
    guide.title,
    ...(Array.isArray(guide.keywords) ? guide.keywords : []),
    ...(Array.isArray(guide.intentKeywords) ? guide.intentKeywords : []),
  ]),
]).slice(0, 60);

export const blogMetadata = buildCanonicalMetadata({
  title: 'مدونة ميقاتنا | شروحات عربية للنوم والبناء',
  description:
    `اقرأ مقالات ${SITE_BRAND} العملية: شروحات عربية للنوم والبناء، مع أمثلة وروابط للحاسبات والأدوات المناسبة.`,
  keywords: BLOG_KEYWORDS,
  url: `${SITE_URL}/blog`,
});

const BLOG_FAQ_ITEMS = [
  {
    question: 'كيف أختار المقال المناسب في مدونة ميقاتنا؟',
    answer:
      'ابدأ من السؤال الذي تريد حله: نوم، قيلولة، دين نوم، أو تقدير مواد بناء. استخدم البحث أو التصفية حسب الموضوع، ثم اقرأ مقالاً واحداً وطبّق الأداة المرتبطة به.',
  },
  {
    question: 'هل المقالات بديل عن الحاسبات؟',
    answer:
      'لا. المقال يشرح الفكرة والأخطاء الشائعة وحدود الاعتماد على النتيجة، ثم يوجهك إلى الحاسبة أو الأداة المناسبة حتى تطبق ما فهمته على أرقامك أو وقتك.',
  },
  {
    question: 'هل تقدم المدونة نصائح مالية أو طبية نهائية؟',
    answer:
      'المحتوى تعليمي ومعلوماتي. عند القرارات الصحية أو الهندسية أو القانونية أو الدينية الحساسة، استخدم المقال للفهم الأولي ثم راجع المختص أو الجهة الرسمية المناسبة.',
  },
  {
    question: 'لماذا تجمع المدونة النوم والبناء؟',
    answer:
      'لأن هذه الموضوعات في ميقاتنا مرتبطة بأدوات عملية: حاسبات نوم وتقديرات بناء. الهدف أن تفهم القرار ثم تنتقل إلى الأداة التي تكمله.',
  },
];

const blogFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'أسئلة مدونة ميقاتنا',
  url: `${SITE_URL}/blog`,
  inLanguage: 'ar',
  mainEntity: BLOG_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function BlogHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'مدونة ميقاتنا',
    url: `${SITE_URL}/blog`,
    inLanguage: 'ar',
    description: `مدونة منظمة لأدلة عربية عملية داخل ${SITE_BRAND} تربط الشرح بالحاسبات وصفحات الوقت والتاريخ والنوم والبناء.`,
    about: [
      'الحاسبات العربية',
      'النوم',
      'البناء',
      'شرح الأدوات',
    ],
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'المدونة', item: `${SITE_URL}/blog` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'مقالات الموقع',
    itemListElement: SAFE_ALL_GUIDES.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}${guide.href}`,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <JsonLd data={[collectionSchema, breadcrumbSchema, itemListSchema, blogFaqSchema]} />
      <BlogHubClient
        collections={BLOG_COLLECTIONS}
        shortcutLinks={BLOG_SHORTCUTS}
        siteBrand={SITE_BRAND}
      />
      <AdMultiplex slotId="end-blog-hub" className="content-col" />
    </main>
  );
}
