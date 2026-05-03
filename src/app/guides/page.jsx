import Link from 'next/link';
import {
  ArrowLeft,
  BedDouble,
  BookOpenText,
  Building2,
  ChartColumnIncreasing,
  Landmark,
  PiggyBank,
} from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { ECONOMY_MARKET_HOURS_TOOLS } from '@/lib/economy/seo-content';
import { ALL_GUIDES } from '@/lib/guides/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function uniqStrings(values) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

const GUIDE_GROUP_META = [
  {
    href: '/calculators/finance',
    title: 'المال والعمل',
    description: 'أدلة تدعم القروض والضريبة ونهاية الخدمة والنسب المئوية بقرارات أوضح قبل استخدام الحاسبة.',
    accent: '#2563EB',
    Icon: Landmark,
  },
  {
    href: '/calculators/personal-finance',
    title: 'التخطيط المالي الشخصي',
    description: 'شرح عملي للادخار والديون وصندوق الطوارئ وصافي الثروة حتى تبقى الأدوات مرتبطة بخطة واضحة.',
    accent: '#0F766E',
    Icon: PiggyBank,
  },
  {
    href: '/calculators/sleep',
    title: 'النوم الذكي',
    description: 'أدلة قصيرة ومباشرة تشرح دورات النوم والقيلولة ودين النوم واحتياج النوم حسب العمر.',
    accent: '#7C3AED',
    Icon: BedDouble,
  },
  {
    href: '/calculators/building',
    title: 'البناء والتشييد',
    description: 'صفحات توضيحية لمن يريد فهم تقديرات الأسمنت وحديد التسليح والبلاط قبل الحساب النهائي.',
    accent: '#B45309',
    Icon: Building2,
  },
  {
    href: '/economie/market-hours',
    title: 'الاقتصاد الحي',
    description: 'أدلة تفصيلية حول افتتاح الأسواق والذهب والفوركس وأفضل وقت للتداول للمستخدم العربي.',
    accent: '#1D4ED8',
    Icon: ChartColumnIncreasing,
  },
];

const GROUP_META_BY_HREF = new Map(GUIDE_GROUP_META.map((group) => [group.href, group]));
const CALCULATOR_ROUTE_META = new Map(
  CALCULATOR_ROUTES.map((route) => [
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
      title: 'الفهرس الشامل',
      description: 'خريطة سريعة تربط بين الأدلة والأدوات والصفحات العليا في واجهة واحدة سهلة التصفح.',
      badge: 'خريطة الموقع',
    },
  ],
  [
    '/calculators',
    {
      href: '/calculators',
      title: 'قسم الحاسبات',
      description: 'بوابة تجمع أشهر الحاسبات اليومية حتى تنتقل من الدليل إلى الأداة المناسبة فوراً.',
      badge: 'المسار الأعلى',
    },
  ],
  [
    '/economie',
    {
      href: '/economie',
      title: 'الاقتصاد الحي',
      description: 'مدخل موحد لأسئلة الذهب والسوق الأمريكي والفوركس والبورصات العالمية.',
      badge: 'المسار الأعلى',
    },
  ],
  [
    '/time-now',
    {
      href: '/time-now',
      title: 'الوقت الآن',
      description: 'صفحات الوقت المحلي والمدن القابلة للفهرسة عندما يحتاج المستخدم خطوة يومية سريعة.',
      badge: 'صفحة يومية',
    },
  ],
  [
    '/date/converter',
    {
      href: '/date/converter',
      title: 'محول التاريخ',
      description: 'صفحة مساندة مفيدة عندما تتقاطع الأدلة مع التواريخ الهجرية والميلادية والتحويل بينهما.',
      badge: 'تحويل سريع',
    },
  ],
  [
    '/mwaqit-al-salat',
    {
      href: '/mwaqit-al-salat',
      title: 'مواقيت الصلاة',
      description: 'واحدة من أكثر المسارات اليومية تكراراً، وتستحق الظهور ضمن الصفحات التي تعرّف بقيمة الموقع.',
      badge: 'صفحة يومية',
    },
  ],
]);
const ECONOMY_ROUTE_META = new Map([
  [
    '/economie/market-hours',
    {
      href: '/economie/market-hours',
      title: 'ساعات الأسواق والتداول',
      description: 'الصفحة الجامعة التي ترتب أسئلة السوق الأمريكي والذهب والفوركس والبورصات من مكان واحد.',
      badge: 'بوابة الأسواق',
    },
  ],
  ...ECONOMY_MARKET_HOURS_TOOLS.map((tool) => [
    tool.href,
    {
      ...tool,
      badge: 'أداة اقتصاد حي',
    },
  ]),
]);

function getSupportCard(href, overrides = {}) {
  const base =
    CALCULATOR_ROUTE_META.get(href)
    || ECONOMY_ROUTE_META.get(href)
    || GENERIC_SUPPORT_META.get(href);

  if (!base) return null;

  return {
    ...base,
    ...overrides,
    href,
  };
}

const GUIDE_SHORTCUTS = [
  '/fahras',
  '/calculators',
  '/economie',
  '/time-now',
  '/date/converter',
  '/mwaqit-al-salat',
].map((href) => getSupportCard(href)).filter(Boolean);

const GUIDE_SUPPORT_LINKS_BY_HREF = new Map([
  [
    '/calculators/finance',
    [
      '/calculators/finance',
      '/calculators/monthly-installment',
      '/calculators/vat',
      '/calculators/percentage',
      '/calculators/end-of-service-benefits',
    ].map((href) => getSupportCard(href)).filter(Boolean),
  ],
  [
    '/calculators/personal-finance',
    [
      '/calculators/personal-finance',
      '/calculators/personal-finance/emergency-fund',
      '/calculators/personal-finance/debt-payoff',
      '/calculators/personal-finance/savings-goal',
      '/calculators/personal-finance/net-worth',
    ].map((href) => getSupportCard(href)).filter(Boolean),
  ],
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
  [
    '/economie/market-hours',
    [
      '/economie',
      '/economie/market-hours',
      '/economie/us-market-open',
      '/economie/gold-market-hours',
      '/economie/forex-sessions',
      '/economie/stock-markets',
      '/economie/market-clock',
      '/economie/best-trading-time',
    ].map((href) => getSupportCard(href)).filter(Boolean),
  ],
]);

function buildGuideGroups() {
  const buckets = new Map();

  for (const guide of ALL_GUIDES) {
    const meta = GROUP_META_BY_HREF.get(guide.hubHref) || {
      href: guide.hubHref || '/guides',
      title: guide.hubTitle || 'أدلة متنوعة',
      description: 'أدلة مساندة للأدوات والمسارات الرئيسية داخل الموقع.',
      accent: '#475569',
      Icon: BookOpenText,
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
    ...GUIDE_GROUP_META.map((group) => buckets.get(group.href)).filter(Boolean),
    ...Array.from(buckets.values()).filter(
      (group) => !GUIDE_GROUP_META.some((item) => item.href === group.href),
    ),
  ];

  return orderedGroups.map((group) => ({
    ...group,
    guides: [...group.guides].sort(
      (a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ar'),
    ),
  }));
}

const GUIDE_GROUPS = buildGuideGroups();
const GUIDE_KEYWORDS = uniqStrings([
  'أدلة ميقاتنا',
  'شروحات عربية عملية',
  'أدلة الحاسبات العربية',
  'أدلة الاقتصاد الحي',
  ...ALL_GUIDES.flatMap((guide) => [guide.title, ...(guide.keywords || []), ...(guide.intentKeywords || [])]),
]).slice(0, 60);

export const metadata = buildCanonicalMetadata({
  title: 'أدلة عربية عملية تربط الأدوات بالقرار الصحيح',
  description:
    `مجموعة أدلة عربية عملية داخل ${SITE_BRAND} تشرح الحاسبات والاقتصاد والنوم والتخطيط المالي بلغة مباشرة، مع ربط واضح بين المقالات والأدوات والمسارات اليومية.`,
  keywords: GUIDE_KEYWORDS,
  url: `${SITE_URL}/guides`,
});

export default function GuidesPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الأدلة العملية',
    url: `${SITE_URL}/guides`,
    inLanguage: 'ar',
    description: `فهرس منظم للأدلة العربية العملية داخل ${SITE_BRAND} يربط المقالات بالأدوات والمسارات الرئيسية.`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدلة', item: `${SITE_URL}/guides` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أدلة الموقع',
    itemListElement: ALL_GUIDES.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}${guide.href}`,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <JsonLd data={[collectionSchema, breadcrumbSchema, itemListSchema]} />

      <section className="border-b border-border/60 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_34%),radial-gradient(circle_at_top_left,rgba(15,118,110,0.10),transparent_28%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold text-secondary">
              <BookOpenText size={14} />
              قسم الأدلة العملية
            </div>
            <h1 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
              أدلة تشرح السؤال قبل أن ترسلك إلى الأداة
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
              هذه الصفحة تجمع المقالات الشارحة التي تدعم الحاسبات والوقت والاقتصاد داخل
              الموقع. الفكرة ليست نشر مقالات منفصلة فقط، بل بناء طبقة تفسيرية تربط نية
              البحث بالأداة الصحيحة والمسار التالي داخل {SITE_BRAND}.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">إجمالي الأدلة</div>
              <div className="mt-2 text-3xl font-black text-primary">{ALL_GUIDES.length}</div>
              <div className="mt-2 text-sm text-secondary">صفحة تربط الأسئلة التفصيلية بالأدوات والمسارات اليومية</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">المسارات الرئيسية</div>
              <div className="mt-2 text-3xl font-black text-primary">{GUIDE_GROUPS.length}</div>
              <div className="mt-2 text-sm text-secondary">مجموعات واضحة: مال، نوم، بناء، اقتصاد، وتخطيط مالي</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">الهدف التحريري</div>
              <div className="mt-2 text-xl font-black text-primary">شرح ثم أداة</div>
              <div className="mt-2 text-sm text-secondary">كل دليل ينتهي بخطوة عملية واضحة بدل مقالة معزولة</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">الاكتشاف الداخلي</div>
              <div className="mt-2 text-xl font-black text-primary">روابط مترابطة</div>
              <div className="mt-2 text-sm text-secondary">ربط بين الأدلة، الحاسبات، والصفحات العليا لدعم الزائر والزحف معاً</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
          <span className="font-semibold text-primary">ابدأ من المسار:</span>
          <Link href="/calculators" className="rounded-full border border-border/70 px-3 py-1 transition hover:border-border hover:bg-surface">
            الحاسبات
          </Link>
          <Link href="/economie" className="rounded-full border border-border/70 px-3 py-1 transition hover:border-border hover:bg-surface">
            الاقتصاد
          </Link>
          <Link href="/fahras" className="rounded-full border border-border/70 px-3 py-1 transition hover:border-border hover:bg-surface">
            الفهرس الشامل
          </Link>
        </div>

        <div className="mt-8 space-y-10">
          <section className="rounded-[28px] border border-border/70 bg-background/90 p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 text-xs font-semibold text-secondary">
                  <BookOpenText size={14} />
                  وصول أسرع للمستخدم
                </div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  صفحات تكمل الأدلة ولا تتركها معزولة
                </h2>
                <p className="mt-2 text-sm leading-7 text-secondary">
                  هذه الروابط تعطي الزائر طبقة عملية فوق المقالات نفسها: صفحة الفهرس، أقسام
                  الأدوات، وبعض الصفحات اليومية التي تكمل الرحلة داخل الموقع.
                </p>
              </div>
              <span className="rounded-full border border-border/70 px-3 py-1 text-sm text-secondary">
                {GUIDE_SHORTCUTS.length} صفحات مساندة
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {GUIDE_SHORTCUTS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-3xl border border-border/70 bg-surface/70 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-primary">
                      {item.badge}
                    </div>
                    <ArrowLeft
                      size={16}
                      className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-8 text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {GUIDE_GROUPS.map((group) => {
            const Icon = group.Icon || BookOpenText;
            const supportLinks = GUIDE_SUPPORT_LINKS_BY_HREF.get(group.href) || [];

            return (
              <section
                key={group.href}
                className="rounded-[28px] border border-border/70 bg-surface/70 p-6 shadow-sm"
                id={group.href.replace(/\//g, '-').replace(/^-+/, '')}
              >
                <div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div
                      className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border"
                      style={{
                        color: group.accent,
                        borderColor: `${group.accent}33`,
                        backgroundColor: `${group.accent}14`,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-primary">
                      {group.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-secondary">
                      {group.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary">
                    <span className="rounded-full border border-border/70 px-3 py-1">
                      {group.guides.length} دليل
                    </span>
                    <Link
                      href={group.href}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 font-semibold text-primary transition hover:border-border hover:bg-background"
                    >
                      افتح المسار
                      <ArrowLeft size={14} />
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.guides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group rounded-3xl border border-border/70 bg-background/90 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            color: group.accent,
                            backgroundColor: `${group.accent}12`,
                          }}
                        >
                          {guide.badge || group.title}
                        </div>
                        <ArrowLeft
                          size={16}
                          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-bold leading-8 text-primary">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-secondary">
                        {guide.description}
                      </p>
                    </Link>
                  ))}
                </div>

                {supportLinks.length > 0 && (
                  <div className="mt-8 border-t border-border/60 pt-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="max-w-3xl">
                        <h3 className="text-lg font-black text-primary">
                          أدوات وصفحات مرتبطة بهذا المسار
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-secondary">
                          لمن يريد الانتقال مباشرة من الشرح إلى التطبيق أو إلى الصفحة الأعلى
                          التي تجمع هذا النوع من الأدوات.
                        </p>
                      </div>
                      <span className="rounded-full border border-border/70 px-3 py-1 text-sm text-secondary">
                        {supportLinks.length} روابط عملية
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {supportLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group rounded-3xl border border-dashed border-border/70 bg-background/90 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-secondary">
                              {item.badge}
                            </div>
                            <ArrowLeft
                              size={16}
                              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            />
                          </div>
                          <h4 className="mt-4 text-base font-bold leading-8 text-primary">
                            {item.title}
                          </h4>
                          <p className="mt-2 text-sm leading-7 text-secondary">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
