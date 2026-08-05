import Link from 'next/link';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`cleaning hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// This hub launched (2026-08-03) after real SERP-gap + competitor research confirmed a genuine
// gap: no Arabic site returns an instant, no-signup cleaning-cost calculator anywhere in the
// Gulf market — every "calculator"-looking page found is a lead-gen form. See
// keyword-research/cleaning-hub/DECISION.md for the full research. City-page variants were
// explicitly rejected (every "[service] + city" query tested returned 100% local-business
// lead-gen results, not informational intent) — this hub uses a country/currency selector
// inside each tool instead, same pattern as the HVAC hub.
const FEATURED_SLUGS = ['cleaning-cost-calculator', 'cleaning-quote-generator', 'cleaning-deep-clean-checker'];

const TYPE_GROUPS = [
  {
    code: 'cost',
    name: 'تكلفة التنظيف',
    note: 'قبل حجز أي شركة — كم يفترض أن تدفع فعلياً.',
    slugs: ['cleaning-cost-calculator'],
  },
  {
    code: 'documents',
    name: 'المستندات والعقود',
    note: 'عرض سعر وفاتورة وعقد شهري، جاهزة للطباعة مباشرة.',
    slugs: ['cleaning-quote-generator'],
  },
  {
    code: 'decide',
    name: 'قرارات وصيانة دورية',
    note: 'أدوات تعود إليها كل بضعة أشهر، لا مرة واحدة فقط.',
    slugs: ['cleaning-deep-clean-checker', 'cleaning-water-tank-tracker'],
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
  title: 'حاسبات ومستندات التنظيف — تكلفة تنظيف المنزل بالعربي',
  description:
    'حاسبة تكلفة تنظيف المنزل حسب المساحة والتكرار، مولّد عرض سعر وفاتورة وعقد تنظيف شهري، ومتتبع صيانة دورية — أدوات مبنية على بحث كلمات وأسعار حقيقية.',
  url: `${SITE_URL}/tools/cleaning`,
});

export default function CleaningCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التنظيف', item: `${SITE_URL}/tools/cleaning` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أدوات التنظيف',
    url: `${SITE_URL}/tools/cleaning`,
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

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <ToolTopAdSlot slotId="top-cleaning-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 16c2-5 5-8 8-8s6 3 8 8M4 16h16M8 20h8" />
              </svg>
            </span>
            <h1>حاسبات ومستندات التنظيف</h1>
          </div>
          <p>
            من تقدير تكلفة التنظيف إلى إصدار عرض سعر وفاتورة وعقد شهري جاهز — كل أداة هنا مبنية
            على بحث سوق حقيقي، لا تخمين، وتعمل فوراً بلا نموذج تسجيل بيانات.
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
      </div>
    </main>
  );
}
