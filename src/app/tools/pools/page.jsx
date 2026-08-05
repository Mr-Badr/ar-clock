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
    throw new Error(`pools hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Deliberately single-tool hub (2026-08-03) — "المسابح" failed the Hub Gate as a strategic
// category (only 8% low-competition volume, top terms are image/generic search, not commercial
// intent — see keyword-research/narrow-tools-2026-08-03/DECISION.md §3 and the owner's own
// verdict: "SKIP category, keep 1 tool"). This container exists only because every route on
// this site lives under a /tools/<hub> segment — it is NOT a commitment to build out a full
// pools category later without fresh research justifying it.
const FEATURED_SLUGS = ['pools-volume-chlorine-calculator'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات',
    note: '',
    slugs: ['pools-volume-chlorine-calculator'],
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
  title: 'حاسبة حجم المسبح وجرعة الكلور',
  description: 'احسب حجم مسبحك بالمتر المكعب واللتر لأي شكل، ثم جرعة الكلور المطلوبة مباشرة حسب نوع المنتج والهدف.',
  url: `${SITE_URL}/tools/pools`,
});

export default function PoolsCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'المسابح', item: `${SITE_URL}/tools/pools` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-pools-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 18c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
              </svg>
            </span>
            <h1>المسابح</h1>
          </div>
          <p>
            حجم مسبحك بالمتر المكعب واللتر مباشرة، ثم جرعة الكلور المطلوبة فوراً — أداة واحدة
            حقيقية بدل التخمين.
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
      </div>
    </main>
  );
}
