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
    throw new Error(`construction hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// This hub launched (2026-07-31) after a real Keyword Planner run validated the topic — see
// keyword-research/construction-hub/DECISION.md. All 5 material/cost tools here are migrations
// of pre-existing, verified-correct calculators from /calculators/building/* (301 redirected,
// not duplicated — same engine logic, redesigned UI) — only the unit converter is genuinely new.
const FEATURED_SLUGS = ['building', 'rebar', 'sqft-sqm-converter'];

const TYPE_GROUPS = [
  {
    code: 'cost',
    name: 'التكلفة والتقدير',
    note: 'قبل أي قرار بناء — كم يكلفك، وبأي نطاق سعري.',
    slugs: ['building'],
  },
  {
    code: 'materials',
    name: 'حساب المواد',
    note: 'كميات دقيقة قبل الشراء أو مقارنة الموردين.',
    slugs: ['rebar', 'cement', 'tiles', 'building-paint', 'gypsum-board', 'masonry-units', 'construction-waterproofing'],
  },
  {
    code: 'convert',
    name: 'تحويل الوحدات',
    note: '',
    slugs: ['sqft-sqm-converter'],
  },
  {
    // Migrated from /blog (2026-08-09) — the only 2 articles out of the whole /blog section
    // with real traffic (owner's own analytics); /blog itself was retired entirely. Per
    // tools-hub-pattern.md: tool groups first, "المقالات" always last.
    code: 'articles',
    name: 'المقالات',
    note: '',
    slugs: ['construction-cement-bags-guide', 'construction-rebar-weight-guide'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'من أين أبدأ إذا كنت أخطط لبناء منزل من الصفر؟',
    answer: 'ابدأ بحاسبة تكلفة البناء لمعرفة نطاق التكلفة التقريبي في دولتك، ثم انتقل تدريجياً لحاسبات المواد التفصيلية (حديد، أسمنت، بلاط، دهان) كلما اقتربت من مرحلة الشراء الفعلية. لا تحاول حساب كل المواد دفعة واحدة في بداية التخطيط — الأرقام الدقيقة تحتاج مخططاً جاهزاً.',
  },
  {
    question: 'هل هذه الحاسبات تغني عن مهندس أو مقاول؟',
    answer: 'لا، وهذا ليس هدفها. كل حاسبة هنا تعطيك تقديراً سريعاً للمراجعة والتسعير الأولي — تساعدك على فهم الأرقام والتحقق من عروض الأسعار التي تستلمها، لكن القرار النهائي في أي مشروع إنشائي حقيقي يجب أن يرجع دائماً للمخطط الهندسي المعتمد والمهندس المشرف.',
  },
  {
    question: 'كيف أتحقق أن عرض سعر المقاول أو المورد منطقي؟',
    answer: 'احسب الكمية والتكلفة بنفسك أولاً باستخدام الحاسبة المناسبة (حديد، أسمنت، بلاط، حسب ما يخص عرض السعر)، ثم قارن الرقم بما استلمته. فرق كبير غير مبرر — سواء أعلى أو أقل بشكل مريب — يستحق سؤالاً مباشراً قبل الموافقة على أي عرض.',
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
  title: 'حاسبات البناء والتشييد — تكلفة البناء والمواد بالعربي',
  description:
    'احسب تكلفة بناء منزلك وسعر المتر في 6 دول خليجية، وزن حديد التسليح، كمية الطوب والبلوك، وحوّل وحدات المساحة — حاسبات بناء بمعادلات هندسية دقيقة وموثّقة.',
  keywords: [
    'حاسبات البناء',
    'حاسبة تكلفة البناء',
    'حاسبات بناء بالعربي',
    'اسعار البناء في السعودية',
    'حاسبة تكلفة البناء في الامارات',
    'حاسبة وزن حديد التسليح',
    'حاسبة الطوب والبلوك',
    'محول وحدات المساحة',
    'حاسبة الاسمنت والخرسانة',
  ],
  url: `${SITE_URL}/tools/construction`,
});

export default function ConstructionCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'البناء والتشييد', item: `${SITE_URL}/tools/construction` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات البناء والتشييد',
    url: `${SITE_URL}/tools/construction`,
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

      <ToolTopAdSlot slotId="top-construction-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
              </svg>
            </span>
            <h1>حاسبات البناء والتشييد</h1>
          </div>
          <p>
            من تكلفة البناء إلى وزن الحديد وكميات المواد — كل حاسبة هنا مبنية على معادلة هندسية
            دقيقة ومصادر سعرية حقيقية، لا تقدير عام. حاسبة تكلفة البناء تغطي 6 دول خليجية بأسعار
            منفصلة لكل دولة.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> صفحات مرتبطة مباشرة</span>
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
