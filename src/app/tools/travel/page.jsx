import Link from 'next/link';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection } from '@/components/tools-v2/HubGuideSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`travel hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-25) — found via tool-gap research: "تكلفة تأشيرة شنغن" has real search
// intent but zero interactive Arabic calculators, and every Arabic source found still cites the
// old €80 fee (raised to €90 on 11 June 2024) — verified via direct WebFetch of
// home-affairs.ec.europa.eu. Deliberately single-tool for now, same precedent as electronics/
// real-estate/pools/cctv/garage-doors/elevators/welding/scaffolding/aluminum-glass/attendance.
const FEATURED_SLUGS = ['schengen-visa-cost-calculator'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والحاسبات',
    note: '',
    slugs: ['schengen-visa-cost-calculator'],
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
  title: 'السفر — حاسبة تكلفة تأشيرة شنغن',
  description:
    'احسب تكلفة تأشيرة شنغن الحقيقية لعائلتك — الرسم الرسمي الحالي بالإضافة إلى رسوم مركز التأشيرات، لا تقديراً بالعين أو معلومة قديمة.',
  keywords: [
    'حاسبة تكلفة تأشيرة شنغن',
    'حساب تكلفة فيزا شنغن',
    'رسوم تأشيرة شنغن الحقيقية',
  ],
  url: `${SITE_URL}/tools/travel`,
});

export default function TravelCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'السفر', item: `${SITE_URL}/tools/travel` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-travel-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 16l20-7-7 20-3-8-8-3Z" />
              </svg>
            </span>
            <h1>السفر</h1>
          </div>
          <p>
            قبل حجز موعد التأشيرة، اعرف التكلفة الحقيقية الكاملة لعائلتك — الرسم الرسمي المحدث،
            بالإضافة إلى رسوم مركز التأشيرات التي كثيراً ما تُنسى.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أداة</span>
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

        <HubGuideSection id="how-this-works" title="لماذا التكلفة الحقيقية أعلى من الرسم المعلن؟">
          <p>
            أغلب سفارات دول شنغن في الخليج لا تستقبل الطلبات مباشرة، بل تُحوّلها إلى مراكز تأشيرات
            خارجية مثل VFS Global أو TLScontact، وهذه المراكز تضيف رسم خدمة خاصاً بها فوق الرسم
            الرسمي — وهذا الرسم الإضافي هو ما يجعل التكلفة الفعلية أعلى مما يُذكر عادة في المقالات
            التي تكتفي بذكر الرسم الرسمي وحده.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
