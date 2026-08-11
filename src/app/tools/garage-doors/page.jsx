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
    throw new Error(`garage-doors hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Narrow hub launched 2026-08-10 from real Keyword Planner data (أبواب الجراج: 59,700/mo, mostly
// High competition on the broad retail term but with real Low-competition gems on informational/
// decision queries, 28.4 SAR avg top bid). WebSearch-first check found no dedicated Arabic
// calculator/selector for sizing or troubleshooting — only product listings and one-off articles.
// See docs/PLAN.md §13 and keyword-research/garage-doors-hub/DECISION.md.
const FEATURED_SLUGS = ['garage-doors-size-guide'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والأدلة',
    note: 'اختر المقاس المناسب لسياراتك، وحل مشاكل الريموت الشائعة قبل الاتصال بفني.',
    slugs: ['garage-doors-size-guide'],
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
  title: 'أبواب الجراج — دليل اختيار المقاس وحل مشاكل الريموت',
  description:
    'اختر مقاس باب الجراج المناسب لعدد سياراتك من جدول المقاسات القياسية الحقيقية، وتعرف على حلول مشاكل الريموت الشائعة.',
  url: `${SITE_URL}/tools/garage-doors`,
});

export default function GarageDoorsCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'أبواب الجراج', item: `${SITE_URL}/tools/garage-doors` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-garage-doors-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="4" width="18" height="16" rx="1.2" />
                <path d="M3 9h18M8 9v11M13 9v11" />
              </svg>
            </span>
            <h1>أبواب الجراج</h1>
          </div>
          <p>
            أي مقاس باب جراج يناسب سيارتك أو سياراتك، ولماذا توقف الريموت عن العمل فجأة — إجابات
            مباشرة مبنية على مقاسات وحلول حقيقية، لا تخمين.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> صفحة مرتبطة مباشرة</span>
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
