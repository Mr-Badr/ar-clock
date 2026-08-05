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
    throw new Error(`carpenter hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Wave 1 of a multi-wave build — see keyword-research/carpenter-hub/DECISION.md for the full
// roadmap (maintenance/troubleshooting, buying guides for doors/parquet/cabinets, decor and
// beginner-skills content still to come). Unlike the HVAC hub, carpentry is a craft/profession —
// written in plain Arabic for the whole Arab world per PLAN.md §2, not Gulf-restricted, and money
// amounts are always user-entered rather than a fixed market price (owner correction, 2026-08-01:
// a country/city-specific price isn't "real data" everywhere).
const FEATURED_SLUGS = ['wood-types', 'wood-calculator', 'wood-problems'];

const TYPE_GROUPS = [
  {
    code: 'choose',
    name: 'اختيار الخشب',
    note: 'قبل أي مشروع — قارن الأنواع بصلابة حقيقية موثّقة، لا بالتخمين.',
    slugs: ['wood-types'],
  },
  {
    code: 'products',
    name: 'منتجات خشبية جاهزة',
    note: 'مقارنات محايدة بعيداً عن تسويق شركات الأبواب والأرضيات.',
    slugs: ['wood-doors', 'parquet-flooring'],
  },
  {
    code: 'calculate',
    name: 'الحسابات',
    note: 'كمية الخشب، والتحقق من عروض أسعار حقيقية — بأرقام تصح في أي بلد.',
    slugs: ['wood-calculator', 'kitchen-cabinets-cost'],
  },
  {
    code: 'skills',
    name: 'المهارات والتقنيات',
    note: 'كيف تُبنى القطعة فعلياً وتدوم — لا فقط من أي خشب.',
    slugs: ['wood-joints', 'wood-movement'],
  },
  {
    code: 'maintenance',
    name: 'الصيانة والأعطال',
    note: 'من العناية الدورية إلى تشخيص المشاكل الشائعة وحلها بنفسك.',
    slugs: ['furniture-care', 'wood-problems'],
  },
  {
    code: 'inspire',
    name: 'ديكور وبداية جديدة',
    note: 'أفكار تنسيق جاهزة، وخطوة أولى إن كنت تريد صنع القطعة بنفسك.',
    slugs: ['wood-decor', 'carpentry-basics'],
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
  title: 'دليل النجارة — أنواع الخشب، الحسابات، ووصلات النجارة',
  description:
    'كل ما تحتاج معرفته عن الخشب والنجارة: مقارنة أنواع الخشب بصلابة حقيقية موثّقة، حاسبة كمية وتكلفة الخشب، حاسبة خزائن المطبخ، ودليل مصوّر لوصلات النجارة.',
  url: `${SITE_URL}/tools/carpenter`,
});

export default function CarpenterHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'النجارة', item: `${SITE_URL}/tools/carpenter` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دليل النجارة',
    url: `${SITE_URL}/tools/carpenter`,
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

      <ToolTopAdSlot slotId="top-carpenter-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 21 21 3M14 3h7v7M8 16l-3 3 4 2 2-4M12 8l4 4" />
              </svg>
            </span>
            <h1>دليل النجارة</h1>
          </div>
          <p>
            من اختيار نوع الخشب المناسب إلى حساب الكمية والتكلفة، إلى أقوى وصلات النجارة — كل قرار
            نجارة حقيقي في مكان واحد، ببيانات موثّقة تصح في أي بلد عربي.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدلة وأدوات مرتبطة مباشرة</span>
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
