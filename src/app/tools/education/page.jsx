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
    throw new Error(`education hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-04: this tool was already live with zero hub discoverability. Originally a
// single-tool hub — gpa/gpa-to-percent/weighted-grade/standard-deviation were EXCLUDED from
// PROMOTION after a real competitive audit found the GPA tools dominated by 9+ competitors
// including official university pages (gpa) and a global calculator giant (rapidtables.org,
// weighted-grade) — see keyword-research/health-education-hubs/DECISION.md. saudi-school-calendar
// survives as featured because our own page already ranks (confirmed directly in the SERP check).
// 2026-08-05: those excluded tools were still migrated off the retired /calculators/* path (owner
// directive — no /calculators path should exist at all) and are listed here as a real group so
// they get a genuine internal link for crawl/indexing purposes — listing ≠ new SEO investment,
// no new content was written for them, they were only relocated and re-skinned.
const TYPE_GROUPS = [
  {
    code: 'calendar',
    name: 'التقويم الدراسي',
    note: '',
    slugs: ['saudi-school-calendar'],
  },
  {
    code: 'student-tools',
    name: 'أدوات الطلاب',
    note: '',
    slugs: ['gpa', 'gpa-to-percent', 'weighted-grade', 'standard-deviation'],
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
  title: 'التقويم الدراسي السعودي وأدوات الطلاب',
  description: 'التقويم الدراسي السعودي الكامل: بداية الدراسة، الإجازات، والعودة — مع عد تنازلي لكل إجازة.',
  url: `${SITE_URL}/tools/education`,
});

export default function EducationCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التعليم', item: `${SITE_URL}/tools/education` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-education-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3 2 8l10 5 10-5-10-5ZM4 10.5V16c0 1.5 3.5 4 8 4s8-2.5 8-4v-5.5" />
              </svg>
            </span>
            <h1>التعليم والتقويم الدراسي</h1>
          </div>
          <p>
            التقويم الدراسي السعودي الكامل — بداية العام، كل الإجازات، وعد تنازلي حي لكل موعد.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أداة مرتبطة مباشرة</span>
          </div>
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
