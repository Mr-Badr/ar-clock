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
    throw new Error(`domestic-worker hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-25), split out of /tools/gulf-finance alongside fuel-prices and
// international-benefits — see data.js's 'domestic-worker' CALCULATOR_HUBS entry for the full
// history. A real, previously-researched vertical (keyword-research/domestic-worker-cost/
// DECISION.md): "cost of hiring household staff" is a genuinely distinct question from personal
// salary/labor-law finance, and deserved its own home instead of one more country group buried
// inside a labor-law hub.
const FEATURED_SLUGS = ['domestic-worker-cost', 'domestic-worker-cost-uae', 'domestic-worker-eligibility'];

const TYPE_GROUPS = [
  {
    code: 'cost',
    name: 'حاسبات تكلفة الاستقدام',
    note: 'كل دولة برسومها الحكومية الفعلية — لا رقم عام تقريبي.',
    slugs: [
      'domestic-worker-cost', 'domestic-worker-cost-uae', 'domestic-worker-cost-kuwait',
      'domestic-worker-cost-qatar', 'domestic-worker-cost-bahrain', 'domestic-worker-cost-oman',
    ],
  },
  {
    code: 'tools',
    name: 'أدوات إضافية',
    note: 'قبل التوقيع على أي عقد استقدام.',
    slugs: ['domestic-worker-eligibility', 'domestic-worker-contract-generator'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين حاسبة التكلفة ومحقق الأهلية؟',
    answer: 'حاسبة التكلفة تعطيك تقديراً مالياً كاملاً (رسوم حكومية + تأشيرة + مكتب استقدام إن وُجد) لدولتك. محقق الأهلية سؤال مختلف تماماً — هل يحق لك أصلاً استقدام عاملة منزلية حسب شروط دولتك (الدخل، نوع الإقامة، عدد العمالة الحالي)، قبل أن تبدأ بالتفكير في التكلفة.',
  },
  {
    question: 'هل رسوم الاستقدام نفسها في كل الدول الخليجية؟',
    answer: 'لا — كل دولة لها هيكل رسوم مختلف تماماً (تأشيرة العمل، التأمين، رسوم منصة الاستقدام الحكومية إن وُجدت)، وتختلف حتى بين مكاتب الاستقدام الخاصة داخل الدولة نفسها. افتح صفحة دولتك للحصول على الرقم الفعلي بدل تقدير عام.',
  },
  {
    question: 'كيف أحصل على عقد عمل جاهز لعاملتي المنزلية؟',
    answer: 'استخدم مولّد العقد أعلاه — يبني لك عقداً يغطي البنود الأساسية (الراتب، أيام الراحة، مدة العقد) جاهزاً للمراجعة والتعديل، بدل البدء من ورقة فارغة أو نسخ عقد جاهز من الإنترنت قد لا يطابق نظام دولتك.',
  },
  {
    question: 'هل هذه الأرقام رسمية ومحدثة؟',
    answer: 'كل رقم هنا مبني على الرسوم الحكومية المعلنة رسمياً في دولتك وقت آخر مراجعة للصفحة، لا تقديرات عامة. راجع دائماً مصدر كل صفحة الموضح أسفلها للتأكد من آخر تحديث قبل اتخاذ قرار مالي.',
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
  title: 'تكلفة استقدام عاملة منزلية في دول الخليج — رسوم كل دولة',
  description:
    'احسب تكلفة استقدام عاملة أو سائق منزلي في السعودية والإمارات والكويت وقطر والبحرين وعُمان بالرسوم الحكومية الفعلية، تحقق من أهليتك أولاً، وجهّز عقد العمل جاهزاً للتوقيع.',
  keywords: [
    'تكلفة استقدام عاملة منزلية',
    'حساب تكلفة استقدام عاملة منزلية',
    'رسوم استقدام عاملة منزلية',
    'كم تكلفة استقدام خادمة',
    'شروط استقدام عاملة منزلية في السعودية',
    'عقد عاملة منزلية جاهز',
  ],
  url: `${SITE_URL}/tools/domestic-worker`,
});

export default function DomesticWorkerCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الاستقدام والعمالة المنزلية', item: `${SITE_URL}/tools/domestic-worker` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'تكلفة استقدام عاملة منزلية في دول الخليج',
    url: `${SITE_URL}/tools/domestic-worker`,
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

      <ToolTopAdSlot slotId="top-domestic-worker-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <h1>تكلفة استقدام عاملة منزلية في دول الخليج</h1>
          </div>
          <p>
            كل حاسبة هنا مبنية على الرسوم الحكومية الفعلية لدولتك — لا رقم عام تقريبي. تحقق أولاً
            من أهليتك، احسب التكلفة الكاملة لدولتك، ثم جهّز عقد العمل جاهزاً.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدوات</span>
            <span><b>6</b> دول خليجية</span>
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
