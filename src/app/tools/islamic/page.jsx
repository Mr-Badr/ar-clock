import Link from 'next/link';
import { Mosque } from '@phosphor-icons/react/ssr';

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
    throw new Error(`islamic hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-10 — by far the largest real, mostly-Low-competition Keyword Planner dataset
// found across this entire research campaign (1.9M+/mo combined across 3 files, 88% Low comp).
// v2 (2026-08-11, owner directive): full hub — 4-madhab-aware calculators, live pricing across 22
// Arab currencies (not Gulf-only), dedicated per-asset-type calculators, and a real madhab-
// comparison guide, all cross-linked. See docs/PLAN.md §13, keyword-research/
// zakat-calculator-tracker/DECISION.md, and the Zakat v2 plan. Real competitors exist (hasbati.com,
// arabtoolbox.com, Al-Azhar's own calculator) but none combine a computational 4-madhab selector +
// persistent Hawl tracking + 20+-currency live pricing + visual results — see the plan's honest
// differentiation statement, not an overclaimed "nobody else does this."
const FEATURED_SLUGS = ['zakat-mal-calculator', 'zakat-gold-calculator', 'zakat-fitr-calculator'];

const TYPE_GROUPS = [
  {
    code: 'zakat-core',
    name: 'حاسبات الزكاة الأساسية',
    note: 'زكاة المال الشاملة بمتتبع حول محفوظ محلياً، زكاة الفطر حسب المذهب وعدد الأسرة، ونصاب حي بعملة أكثر من 20 دولة عربية.',
    slugs: ['zakat-mal-calculator', 'zakat-fitr-calculator', 'zakat-nisab-today'],
  },
  {
    code: 'zakat-specialized',
    name: 'حاسبات متخصصة لكل نوع مال',
    note: 'صفحة مستقلة لكل نوع مال بعمق أكبر من الحاسبة الشاملة — قطعة بقطعة للذهب، حسب نيتك للأسهم، ولأصحاب الأنشطة التجارية والموظفين.',
    slugs: ['zakat-gold-calculator', 'zakat-stocks-calculator', 'zakat-trade-goods-calculator', 'zakat-salary-calculator'],
  },
  {
    // These 4 calculators already existed under /tools/gulf-finance/ (a mismatched home for
    // religious-obligation tools) — cross-listed here without moving their URLs (no redirects,
    // no sitemap churn, no lost link equity). Verified real via direct grep of
    // src/lib/calculators/data.js before adding, 2026-08-11.
    code: 'other-fiqh',
    name: 'أدوات فقهية أخرى',
    note: 'حاسبات شرعية أخرى في الموقع — العقيقة والوصية والنفقة والعدة.',
    slugs: ['aqiqah', 'wasiyya', 'nafaqah', 'iddah'],
  },
  {
    // Editorial/guide content always last, always labelled "المقالات" — never "الأدلة", per
    // .claude/rules/tools-hub-pattern.md.
    code: 'articles',
    name: 'المقالات',
    note: 'دليل شامل للفروق الفقهية الحقيقية بين المذاهب الأربعة في الزكاة.',
    slugs: ['zakat-madhahib'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'أملك أنواعاً مختلفة من المال (نقد وذهب وأسهم) — هل أحسب زكاة كل نوع منفصلاً؟',
    answer: 'حاسبة زكاة المال الشاملة تجمع كل أنواع أموالك في مكان واحد لتعطيك الصورة الكاملة، لكن إن أردت تفصيلاً أدق لنوع معيّن (كتحويل عيار الذهب لوزنه الخالص، أو نية الأسهم استثماراً مقابل تجارة)، الحاسبات المتخصصة لكل نوع تعطيك ذلك بعمق أكبر.',
  },
  {
    question: 'ما الفرق العملي بين المذاهب الأربعة في حساب الزكاة؟',
    answer: 'الفروق الحقيقية تظهر في تفاصيل مثل نصاب بعض الأصناف وكيفية التعامل مع الديون والحلي المستخدم — راجع دليل الفروق بين المذاهب لفهم كل فرق وتأثيره الفعلي على حسابك قبل اختيار مذهبك في الحاسبة.',
  },
  {
    question: 'كيف أعرف أن حولي الهجري (سنة كاملة) قد اكتمل على أموالي؟',
    answer: 'المتتبع يحفظ تاريخ بداية حولك على جهازك تلقائياً بمجرد إدخاله أول مرة، ويحسب لك التاريخ الهجري الذي يكتمل فيه الحول القادم — فلا تحتاج تذكّر التاريخ يدوياً أو حسابه من جديد كل مرة تراجع فيها زكاتك.',
  },
];

function ToolLink({ slug }) {
  const route = findRoute(slug);
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={route.href}>
            <span className="tool-v2-dot" aria-hidden="true">•</span>
            <span className="tool-v2-link-text">{route.shortLabel || route.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{route.description}</TooltipContent>
      </Tooltip>
    </li>
  );
}

export const metadata = buildCanonicalMetadata({
  title: 'الأدوات الإسلامية — حاسبات الزكاة الكاملة حسب المذهب',
  description:
    'حاسبة زكاة المال الشاملة وحاسبات متخصصة للذهب والأسهم والتجارة والراتب، حسب مذهبك، بأسعار حيّة لأكثر من 20 دولة عربية، ودليل الفروق الفقهية بين المذاهب الأربعة.',
  url: `${SITE_URL}/tools/islamic`,
});

export default function IslamicCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الأدوات الإسلامية', item: `${SITE_URL}/tools/islamic` },
    ],
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-islamic-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true"><Mosque size={22} weight="duotone" /></span>
            <h1>الأدوات الإسلامية</h1>
          </div>
          <p>
            احسب زكاة كل نوع مال تملكه — نقد، ذهب وفضة قطعة بقطعة، أسهم، عروض تجارة، أو راتب —
            حسب مذهبك، بأسعار حيّة لأكثر من 20 دولة عربية، ومتتبع حول هجري يحفظ تاريخك على جهازك،
            ودليل شامل للفروق الفقهية الحقيقية بين المذاهب الأربعة.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أداة مرتبطة مباشرة</span>
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
            {TYPE_GROUPS.map((group) => (
              <div key={group.code} className="tool-v2-type-group">
                <h2>{group.name}</h2>
                {group.note ? <p className="tool-v2-type-group-note">{group.note}</p> : null}
                <ul className="tool-v2-tool-link-list">
                  {group.slugs.map((slug) => (
                    <ToolLink key={slug} slug={slug} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TooltipProvider>

        <HubGuideSection id="hub-faq" title="الأسئلة الشائعة">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
