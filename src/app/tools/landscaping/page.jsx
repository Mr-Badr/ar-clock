import Link from 'next/link';

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
    throw new Error(`landscaping hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Launched 2026-08-03 after real SERP-gap + competitor research (keyword-research/landscaping-hub/
// DECISION.md). "تنسيق حدائق" itself and every city-qualified variant confirmed 100% local-business
// lead-gen intent — this hub targets the sub-angles instead (cost, turf, irrigation, plants,
// gravel, maintenance, quote), with a Gulf currency selector rather than per-city pages. The one
// direct competitor found (naseemlandscape.com) hides its "calculator" result behind a lead form —
// every tool here returns a real instant result.
const FEATURED_SLUGS = ['landscaping-garden-cost', 'landscaping-artificial-grass', 'landscaping-quote-generator'];

const TYPE_GROUPS = [
  {
    code: 'cost',
    name: 'التكلفة والتصميم',
    note: 'قبل الاتفاق مع أي مصمم أو مقاول — نطاق سعري واقعي حسب مساحتك.',
    slugs: ['landscaping-garden-cost'],
  },
  {
    code: 'materials',
    name: 'حساب الكميات',
    note: 'عشب صناعي، ري بالتنقيط، وحصى — كميات دقيقة قبل الشراء.',
    slugs: ['landscaping-artificial-grass', 'landscaping-drip-irrigation', 'landscaping-garden-gravel'],
  },
  {
    code: 'plants',
    name: 'النباتات والصيانة الدورية',
    note: 'أدوات تعود إليها كل موسم، لا مرة واحدة فقط.',
    slugs: ['landscaping-plant-picker', 'landscaping-maintenance-tracker'],
  },
  {
    code: 'documents',
    name: 'المستندات',
    note: '',
    slugs: ['landscaping-quote-generator'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'أخطط لحديقة جديدة تماماً — من أين أبدأ؟',
    answer: 'ابدأ بتقدير تكلفة تنسيق الحديقة الكاملة حسب مساحتك ومستوى التصميم الذي تريده، ثم انتقل للحاسبات التفصيلية (عشب صناعي، ري بالتنقيط، حصى) كلما اقتربت من مرحلة التنفيذ والشراء الفعلي.',
  },
  {
    question: 'ما النباتات التي تتحمل حرارة الصيف دون عناية يومية؟',
    answer: 'بعض النباتات تتحمل الحرارة وقلة الري بشكل طبيعي أفضل من غيرها، لكن الاختيار الأنسب يعتمد أيضاً على مقدار الشمس المباشرة ومستوى العناية الذي تستطيع تقديمه فعلياً. استخدم أداة اختيار النباتات لتحصل على قائمة تناسب ظروف حديقتك تحديداً.',
  },
  {
    question: 'هل عرض السعر الذي استلمته من مصمم أو مقاول حدائق منطقي؟',
    answer: 'قارن الرقم المستلم بتقديرك الخاص من حاسبة تكلفة تنسيق الحديقة أولاً — فرق كبير غير مبرر يستحق سؤالاً مباشراً عن البنود المشمولة (تصميم، عشب، ري، إضاءة، نباتات) قبل الموافقة، أو استخدم مولّد عرض السعر لإعداد عرضك الخاص إن كنت أنت من يقدّم الخدمة.',
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
  title: 'حاسبات تنسيق الحدائق — تكلفة، عشب صناعي، وري بالتنقيط',
  description:
    'حاسبة تكلفة تنسيق حديقة، كمية العشب الصناعي، الري بالتنقيط، اختيار نباتات مناسبة للمناخ الخليجي، حصى الحديقة، جدول صيانة شهري، ومولّد عرض سعر — أدوات فورية بلا تسجيل بيانات.',
  url: `${SITE_URL}/tools/landscaping`,
});

export default function LandscapingCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'تنسيق الحدائق', item: `${SITE_URL}/tools/landscaping` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات تنسيق الحدائق',
    url: `${SITE_URL}/tools/landscaping`,
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

      <ToolTopAdSlot slotId="top-landscaping-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 22V12M12 12c-3-2-4-5-4-8 4 0 6 2 6 5M12 12c3-2 4-5 4-8-4 0-6 2-6 5M5 22h14" />
              </svg>
            </span>
            <h1>حاسبات تنسيق الحدائق</h1>
          </div>
          <p>
            من تقدير تكلفة تنسيق الحديقة إلى حساب كمية العشب الصناعي والري بالتنقيط واختيار
            النباتات المناسبة — أدوات فورية حقيقية، لا نماذج تجميع بيانات.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدوات مرتبطة مباشرة</span>
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
