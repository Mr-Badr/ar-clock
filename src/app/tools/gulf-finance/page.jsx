import Link from 'next/link';

import CountryFlag from '@/components/shared/CountryFlag';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection, HubFaq, buildHubFaqSchema } from '@/components/tools-v2/HubGuideSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`gulf-finance hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Country grouping is hand-authored, not derived from `badge` — `badge` is a general-purpose
// tag field (mixes country names, topical labels, and marketing tags like "4 في 1") and can't
// be trusted to carry country scope on its own (confirmed via a full audit of the finance
// cluster, 2026-07-30). Saudi first (the site's primary market), then the rest of the GCC,
// then non-Gulf Arab countries.
//
// **2026-08-25 second-wave split**: this hub had grown to 43 tools across countries far beyond
// the Gulf (owner: "this is no more gulf finance"). Fuel prices (13 countries + comparison) moved
// to /tools/fuel-prices; domestic-worker recruitment (8 tools) moved to its own
// /tools/domestic-worker (a real, distinct topic — "hiring household staff," not "your own pay");
// the general Sharia rulings (wasiyya/iddah/aqiqah/nafaqah) moved into /tools/islamic, finishing
// what that hub's own cross-link section had already half-done since 2026-08-11; the 3 non-Arab
// diaspora tools (Canada/Denmark/France) moved to the new /tools/international-benefits — they
// were never Gulf/Arab finance, only living here since 2026-08-05 because /calculators needed
// eliminating and they needed *some* home at the time. See data.js's CALCULATOR_HUBS entries and
// next.config.js's `GULF_FINANCE_SECOND_WAVE_MIGRATION_REDIRECTS` for the full mechanics.
//
// **2026-08-03 removal pass**: 39 tools removed hub-wide after real competitor research
// confirmed each was either (a) explicitly blacklisted (PLAN.md §2 — net-salary, gosi-retirement,
// zakat, vat), (b) a thin duplicate of a genuinely deep known competitor (ehsabi.com's car/health
// insurance calculators, khaleejcalculators.com's all-6-GCC 24-bank mortgage tool, real banks'
// own loan calculators, ZenHR/LegalHub/Jisr's all-8-country EOS tools), or (c) pure generic
// utility math with zero Gulf-specific angle (percentage, bill-splitter, etc). Full research +
// removal list: `keyword-research/gulf-finance-additions/` session notes and
// `docs/PLAN.md` §13.
const COUNTRY_GROUPS = [
  {
    code: 'sa',
    name: 'السعودية',
    slugs: [
      'end-of-service-benefits', 'sick-leave', 'saudi-pay-dates', 'saned-eligibility',
      'article-77-compensation', 'traffic-fine-discount',
    ],
  },
  {
    code: 'ae',
    name: 'الإمارات',
    slugs: ['uae-end-of-service', 'dubai-company-setup-cost'],
  },
  {
    code: 'eg',
    name: 'مصر',
    slugs: ['egypt-water-bill'],
  },
  {
    code: 'jo',
    name: 'الأردن',
    slugs: ['jordan-income-tax'],
  },
];
// (historical) الكويت/قطر/البحرين/عُمان/المغرب/الجزائر/تونس/العراق/لبنان كان لكل منها مجموعة هنا
// في مراحل مختلفة (إما عمالة منزلية أو أسعار وقود فقط) — أُزيلت كل هذه المجموعات نهائياً 2026-08-25
// عندما انتقلت أدواتها لفئاتها الصحيحة (domestic-worker أو fuel-prices)، لأنها كانت أداتها الوحيدة
// في هذا المسار. لا يوجد لأي من هذه الدول أداة أخرى في gulf-finance حالياً.

// Tools whose calculation logic genuinely covers more than one country (a real dropdown/switch
// in the tool itself). Full country list goes in the link's tooltip (with the description) —
// the short `tag` is what shows inline in the list, per the mockup's plain dot-link-list (no
// visible description line under every link).
const MULTI_COUNTRY_TOOLS = [
  { slug: 'gulf-pay-dates', tag: '6 دول', coverage: 'السعودية، الإمارات، الكويت، قطر، البحرين، عُمان' },
  { slug: 'annual-leave', tag: '6 دول', coverage: 'السعودية، الإمارات، الكويت، قطر، مصر، الأردن' },
  { slug: 'working-days', tag: '8 دول', coverage: 'السعودية، الكويت، البحرين، عُمان، مصر، الأردن، الإمارات، قطر' },
  { slug: 'iqama', tag: 'SA + AE', coverage: 'السعودية والإمارات فقط' },
];

// Fiqh/Sharia rulings (wasiyya/iddah/aqiqah/nafaqah) and domestic-worker recruitment tools moved
// out entirely 2026-08-25 — see the COUNTRY_GROUPS comment above and data.js's CALCULATOR_HUBS
// entries for 'islamic'/'domestic-worker'.

// Three highest-relevance picks shown above the full grouped list — the mockup's
// "featured row" pattern (top picks before the exhaustive per-group lists). Updated 2026-08-03:
// vat/net-salary were removed (blacklisted duplicates) — replaced with the two strongest
// confirmed-by-real-keyword-data tools instead.
const FEATURED_SLUGS = ['end-of-service-benefits', 'article-77-compensation', 'traffic-fine-discount'];

// Ported 2026-08-05 from the retired /calculators/finance hub-index page (a real, high-traffic
// entry point per intent-pathways.ts and discovery.js's own search-priority list) rather than
// simply discarded when that page was redirected here — this hub had no FAQ section of its own,
// and these 4 questions are genuinely useful cross-tool guidance that doesn't belong on any
// single tool's own page.
const FAQ_ITEMS = [
  {
    question: 'أي حاسبة أفتح إذا انتهى عملي أو فُصلت من غير سابق إنذار؟',
    answer: 'إذا انتهت مدة عقدك بشكل طبيعي، ابدأ بحاسبة مكافأة نهاية الخدمة لتعرف مستحقاتك. أما إذا أنهى صاحب العمل عقدك بدون سبب واضح، فراجع حاسبة تعويض المادة 77 — فهي مستحق منفصل تماماً يُضاف إلى مكافأتك، لا يحل محلها.',
  },
  {
    question: 'هل هذه الحاسبات تخدم كل الدول العربية؟',
    answer: 'حاسبة نهاية الخدمة السعودية، وتعويض المادة 77، وخصم المخالفات مبنية خصيصاً على النظام السعودي، لأن الدقة هنا تعتمد على معرفة القانون المحلي بالتفصيل. أما ضريبة الدخل والتأمينات في مصر والأردن والإمارات فلها حاسبتها الخاصة بنفس القدر من الدقة لكل دولة.',
  },
  {
    question: 'كيف أعرف هل أستحق تعويض المادة 77 أصلاً؟',
    answer: 'راجع أولاً سبب إنهاء عملك. إذا كان اتفاقاً كتابياً بينك وبين صاحب العمل، أو انتهاء عقد محدد المدة دون تجديد، أو بلوغك سن التقاعد، أو فصلاً تأديبياً مبرراً، فلا يوجد استحقاق. أما إذا أُنهي عقدك بدون سبب مشروع أو بدون اتباع إجراءات الإشعار الصحيحة، فافتح حاسبة تعويض المادة 77 مباشرة.',
  },
  {
    question: 'لدي مخالفة مرورية، متى أفقد فرصة الخصم؟',
    answer: 'لديك 45 يوماً من تاريخ تسجيل المخالفة للحصول على خصم 25% من قيمتها. بعد هذه المهلة يصبح المبلغ الكامل مستحقاً بدون خصم — تحقق من التاريخ في حاسبة خصم المخالفات قبل أن تفوّت الفرصة.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبات الرواتب ونهاية الخدمة في الخليج والدول العربية',
  description:
    'احسب مكافأة نهاية الخدمة، تعويض المادة 77، خصم المخالفات المرورية، ومواعيد الرواتب — حاسبات مالية عربية دقيقة، مقسّمة حسب كل دولة.',
  keywords: [
    'حاسبات مالية خليجية',
    'حاسبة مكافأة نهاية الخدمة',
    'حاسبة تعويض المادة 77',
    'حاسبة خصم المخالفات المرورية',
    'مواعيد الرواتب في السعودية',
    'حاسبات مالية بالعربي',
  ],
  url: `${SITE_URL}/tools/gulf-finance`,
});

// Plain dot-prefixed link — matches the mockup's .tool-link-list exactly. No visible
// description or icon chip; the tool's own description goes in a tooltip instead (owner's
// explicit correction, 2026-07-30), alongside the country-coverage note for multi-country
// tools so the reader still gets that detail without it cluttering the row.
//
// Uses the site's real Tooltip component (@/components/ui/tooltip — Radix-based, already
// styled sitewide as a dark pill: --tooltip-surface/-text in components.css), NOT the native
// HTML `title` attribute — a native tooltip can't be styled at all (browser/OS chrome) and
// was a mistake in the first pass here. The owner's ask ("black bg and white text in all
// app") is already this component's existing, sitewide standard — this just switches to
// actually using it instead of introducing a one-off unstyled alternative.
function ToolLink({ slug, coverageTag, coverageText }) {
  const route = findRoute(slug);
  const tooltip = coverageText ? `${route.description} — يدعم: ${coverageText}` : route.description;
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={route.href}>
            <span className="tool-v2-dot" aria-hidden="true">•</span>
            <span className="tool-v2-link-text">{route.shortLabel || route.title}</span>
            {coverageTag ? <span className="tool-v2-coverage-tag">{coverageTag}</span> : null}
          </Link>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </li>
  );
}

export default function GulfFinanceCategoryHubPage() {
  const allListedSlugs = new Set([
    ...COUNTRY_GROUPS.flatMap((g) => g.slugs),
    ...MULTI_COUNTRY_TOOLS.map((t) => t.slug),
  ]);
  const toolCount = allListedSlugs.size;
  const countryCount = COUNTRY_GROUPS.length;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الرواتب والمزايا الخليجية', item: `${SITE_URL}/tools/gulf-finance` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات الرواتب ونهاية الخدمة في الخليج والدول العربية',
    url: `${SITE_URL}/tools/gulf-finance`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: toolCount,
      itemListElement: Array.from(allListedSlugs).map((slug, index) => {
        const route = findRoute(slug);
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: route.shortLabel || route.title,
          url: `${SITE_URL}${route.href}`,
        };
      }),
    },
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-gulf-finance-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <h1>الرواتب ونهاية الخدمة في الخليج والدول العربية</h1>
          </div>
          <p>
            كل حاسبة هنا مبنية على القانون أو النظام الفعلي في دولتها — لا تقدير عام. اختر دولتك
            أدناه، أو الأداة التي تدعم عدة دول إن كانت حالتك تشملها.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> حاسبة</span>
            <span><b>{countryCount}</b> دول</span>
            <span><b>{MULTI_COUNTRY_TOOLS.length}</b> أدوات متعددة الدول</span>
          </div>
        </div>

        <div className="tool-v2-featured-row">
          {FEATURED_SLUGS.map((slug) => {
            const route = findRoute(slug);
            return (
              <Link key={slug} href={route.href} className="tool-v2-featured-tool">
                <span className="tool-v2-ft-ic" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                  </svg>
                </span>
                <span>
                  <b>{route.shortLabel || route.title}</b>
                  <span>{route.badge}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <TooltipProvider>
        <div className="tool-v2-type-groups">
          {COUNTRY_GROUPS.map((group) => (
            <div key={group.code} className="tool-v2-type-group">
              <h2>
                <CountryFlag code={group.code} label={group.name} />
                {group.name}
              </h2>
              <ul className="tool-v2-tool-link-list">
                {group.slugs.map((slug) => (
                  <ToolLink key={slug} slug={slug} />
                ))}
              </ul>
            </div>
          ))}

          <div className="tool-v2-type-group">
            <h2>أدوات متعددة الدول</h2>
            <p className="tool-v2-type-group-note">تدعم أكثر من دولة داخل نفس الأداة.</p>
            <ul className="tool-v2-tool-link-list">
              {MULTI_COUNTRY_TOOLS.map((tool) => (
                <ToolLink key={tool.slug} slug={tool.slug} coverageTag={tool.tag} coverageText={tool.coverage} />
              ))}
            </ul>
          </div>
        </div>
        </TooltipProvider>

        <HubGuideSection id="hub-faq" title="أسئلة قبل اختيار حاسبة مالية">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
