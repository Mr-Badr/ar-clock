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
    throw new Error(`hvac hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-01 from direct web/competitor research (not Keyword Planner — see
// keyword-research/hvac-hub/DECISION.md addendum) after confirming tbreed.com and ehsabi.com
// already own the sizing/converter/consumption-calculator niches for this exact Gulf audience.
// Every page here targets a genuine remaining gap: no interactive competitor found anywhere,
// Arabic or English, for any of these six angles.
const FEATURED_SLUGS = ['ac-types', 'inverter-savings', 'troubleshooting'];

const TYPE_GROUPS = [
  {
    code: 'choose',
    name: 'اختيار المكيف',
    note: 'قبل الشراء — أي نوع يناسب مساحتك ومنطقتك.',
    slugs: ['ac-types'],
  },
  {
    code: 'savings',
    name: 'التوفير والكفاءة',
    note: 'احسب الفرق الحقيقي بالريال قبل أن تقرر.',
    slugs: ['inverter-savings', 'energy-label'],
  },
  {
    code: 'maintenance',
    name: 'الصيانة والأعطال',
    note: 'من التنظيف الدوري إلى تشخيص الأعطال وقرار الاستبدال.',
    slugs: ['maintenance-schedule', 'troubleshooting', 'replace-or-repair'],
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
  title: 'دليل التكييف — أنواع المكيفات، التوفير، الصيانة والأعطال',
  description:
    'كل ما تحتاج معرفته عن مكيفات الهواء: أي نوع يناسبك، كم يوفر لك الانفرتر بالريال، بطاقة كفاءة الطاقة، جدول الصيانة، تشخيص الأعطال، وقرار الاستبدال أو الإصلاح.',
  url: `${SITE_URL}/tools/hvac`,
});

export default function HvacHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التكييف', item: `${SITE_URL}/tools/hvac` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دليل التكييف',
    url: `${SITE_URL}/tools/hvac`,
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

      <ToolTopAdSlot slotId="top-hvac-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 12h4l2-4 4 8 2-4h6M6 5v2M12 3v2M18 5v2" />
              </svg>
            </span>
            <h1>دليل التكييف</h1>
          </div>
          <p>
            من اختيار النوع المناسب، إلى حساب توفير الانفرتر بالريال، إلى الصيانة الدورية وتشخيص
            الأعطال وقرار الاستبدال — كل قرار تكييف حقيقي في مكان واحد، ومبني على بحث فعلي لا تخمين.
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
