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
    throw new Error(`pest-control hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Launched 2026-08-03 after real SERP-gap + competitor research (keyword-research/pest-control-hub/
// DECISION.md). "شركة مكافحة حشرات" and any city-qualified cost query confirmed 100% local-business
// lead-gen intent — this hub deliberately does NOT target those phrases or build city pages.
// Instead it splits into two real gaps: a consumer cost/decision angle (Gulf-wide, currency
// selector, no per-city pages), and a professional/B2B angle for technicians and companies
// themselves (dosage calculator, inspection-report generator) — near-zero Arabic competition
// even though both are mature tool categories in the English-language market.
const FEATURED_SLUGS = ['pest-control-cost-estimator', 'pest-control-dosage-calculator', 'pest-control-inspection-report'];

const TYPE_GROUPS = [
  {
    code: 'cost',
    name: 'تكلفة المعالجة',
    note: 'قبل الاتفاق مع أي فني — نطاق سعري واقعي حسب حالتك.',
    slugs: ['pest-control-cost-estimator', 'pest-control-termite-estimator'],
  },
  {
    code: 'professional',
    name: 'أدوات الفني والمعاينة',
    note: 'للفنيين وشركات المكافحة — جرعة دقيقة وتوثيق احترافي لكل زيارة.',
    slugs: ['pest-control-dosage-calculator', 'pest-control-inspection-report'],
  },
  {
    code: 'decide',
    name: 'قرارات',
    note: '',
    slugs: ['pest-control-contract-checker'],
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
  title: 'أدوات مكافحة الحشرات — تكلفة، جرعة المبيد، وتقارير المعاينة',
  description:
    'حاسبة تكلفة مكافحة الحشرات والنمل الأبيض، حاسبة جرعة وتخفيف المبيد، مولّد تقرير معاينة، ومدقق عقد سنوي أم معالجة لمرة واحدة — أدوات للمستخدم وللفني معاً.',
  url: `${SITE_URL}/tools/pest-control`,
});

export default function PestControlCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'مكافحة الحشرات', item: `${SITE_URL}/tools/pest-control` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أدوات مكافحة الحشرات',
    url: `${SITE_URL}/tools/pest-control`,
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

      <ToolTopAdSlot slotId="top-pest-control-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3v4M12 17v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5M9 9a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" />
              </svg>
            </span>
            <h1>أدوات مكافحة الحشرات</h1>
          </div>
          <p>
            من تقدير تكلفة المعالجة إلى ضبط جرعة المبيد وتوثيق كل زيارة بتقرير احترافي — أدوات
            لصاحب المنزل وللفني معاً، مبنية على بحث سوق حقيقي.
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
