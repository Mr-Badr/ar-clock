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
    throw new Error(`international-benefits hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-25), split out of /tools/gulf-finance alongside fuel-prices and
// domestic-worker — see data.js's 'international-benefits' CALCULATOR_HUBS entry. These 3 tools
// were never Gulf/Arab finance; they landed under gulf-finance 2026-08-05 only because
// /calculators was being eliminated sitewide and needed some home. Deliberately small (3 tools) —
// matches this site's own precedent for legitimate few-tool categories (attendance, garage-doors,
// elevators, welding, scaffolding, aluminum-glass, cctv).
const FEATURED_SLUGS = ['cgeb-canada', 'boernepenge-denmark', 'soldes-france'];

const TYPE_GROUPS = [
  {
    code: 'child-benefit',
    name: 'إعانة الطفل',
    note: '',
    slugs: ['cgeb-canada', 'boernepenge-denmark'],
  },
  {
    code: 'shopping-dates',
    name: 'مواعيد التسوق الموسمي',
    note: '',
    slugs: ['soldes-france'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'لمن هذه الصفحات مفيدة؟',
    answer: 'لمن يعيش أو له ارتباط مباشر بكندا أو الدنمارك أو فرنسا — إعانة الطفل الكندية والدنماركية تُصرف لمن يقيم فعلياً هناك أو له أطفال مسجلون في نظام الإعانة، ومواعيد التخفيضات الفرنسية مفيدة لمن يخطط للتسوق أو السفر إلى فرنسا في موسم معين.',
  },
  {
    question: 'هل هذه المواعيد رسمية؟',
    answer: 'نعم — كل صفحة تعتمد على الموعد الرسمي المعلن من الجهة المسؤولة في تلك الدولة (الحكومة الكندية والدنماركية لإعانة الطفل، ووزارة الاقتصاد الفرنسية لمواعيد التخفيضات)، لا تقديراً تقريبياً.',
  },
  {
    question: 'لماذا هذه الأدوات موجودة في موقع عربي؟',
    answer: 'لأن كثيراً من العرب المقيمين في هذه الدول يبحثون عن هذه المواعيد بالعربية تحديداً، ولا يجدون مصدراً مباشراً وواضحاً لها — هذه الصفحات تسد تلك الفجوة بمعلومة مباشرة بلغتهم.',
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
  title: 'مواعيد دفعات ومزايا دولية — إعانة الطفل والتخفيضات الموسمية',
  description:
    'مواعيد صرف إعانة الطفل في كندا والدنمارك، ومواعيد التخفيضات الموسمية الرسمية في فرنسا — معلومة مباشرة بالعربية لمن يعيش أو له ارتباط بهذه الدول.',
  keywords: [
    'موعد اعانة الطفل كندا',
    'موعد اعانة الطفل الدنمارك',
    'مواعيد التخفيضات في فرنسا',
    'soldes france بالعربي',
  ],
  url: `${SITE_URL}/tools/international-benefits`,
});

export default function InternationalBenefitsCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'مواعيد ودفعات دولية', item: `${SITE_URL}/tools/international-benefits` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'مواعيد دفعات ومزايا دولية',
    url: `${SITE_URL}/tools/international-benefits`,
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

      <ToolTopAdSlot slotId="top-international-benefits-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10ZM2.5 9h19M2.5 15h19" />
              </svg>
            </span>
            <h1>مواعيد دفعات ومزايا دولية للمقيمين بالخارج</h1>
          </div>
          <p>
            معلومة مباشرة بالعربية لمن يعيش أو له ارتباط بكندا أو الدنمارك أو فرنسا — موعد إعانة
            الطفل القادم، أو موعد التخفيضات الموسمية الرسمية.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> صفحات</span>
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
