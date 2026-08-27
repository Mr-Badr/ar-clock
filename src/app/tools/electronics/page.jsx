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
    throw new Error(`electronics hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-25) — found via the same tool-gap research session as work-hours-calculator:
// "ما حجم التلفزيون المناسب لغرفتي" has real search intent but only static brand buying-guide
// articles (Samsung, LG, TCL) in Arabic, zero interactive tools. Deliberately a single-tool hub for
// now, matching this site's own precedent (pools, cctv, garage-doors, elevators, welding,
// scaffolding, aluminum-glass) — grows only when real research finds another genuine gap in this
// space, not preemptively.
const FEATURED_SLUGS = ['tv-size-calculator'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والحاسبات',
    note: '',
    slugs: ['tv-size-calculator'],
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
  title: 'الإلكترونيات والأجهزة المنزلية — حاسبة حجم الشاشة المناسب',
  description:
    'احسب حجم التلفزيون المناسب لغرفتك حسب مسافة المشاهدة، بمعيارين حقيقيين (مريح وسينمائي) بدل التقدير بالعين قبل الشراء.',
  keywords: [
    'حجم التلفزيون المناسب للغرفة',
    'حاسبة حجم الشاشة',
    'حساب حجم الشاشة المناسب',
    'حساب حجم التلفزيون المناسب للغرفة',
    'مقاس التلفزيون المناسب لمسافة المشاهدة',
    'كم حجم تلفزيون احتاج',
  ],
  url: `${SITE_URL}/tools/electronics`,
});

export default function ElectronicsCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الإلكترونيات والأجهزة المنزلية', item: `${SITE_URL}/tools/electronics` },
    ],
  };
  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-electronics-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
                <path d="M8 20.5h8M12 17v3.5" />
              </svg>
            </span>
            <h1>الإلكترونيات والأجهزة المنزلية</h1>
          </div>
          <p>
            قبل شراء أي جهاز إلكتروني كبير للمنزل، احسب المقاس المناسب لمساحتك الفعلية بدل التقدير
            بالعين أو الاعتماد على رأي البائع وحده.
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

        <HubGuideSection id="how-this-works" title="ما الفرق بين المعيار المريح والسينمائي؟">
          <p>
            المعيار المريح (SMPTE) مصمم للاستخدام اليومي المختلط — مشاهدة عادية وأخبار وألعاب،
            بزاوية رؤية 30°. المعيار السينمائي (THX) بزاوية أوسع 40° يعطيك إحساساً أقرب لصالة
            السينما، لكنه يحتاج مقاساً أكبر لنفس المسافة أو مسافة أقرب لنفس المقاس. كلاهما معياران
            معتمدان في صناعة السينما المنزلية عالمياً، وليسا تقديراً عاماً من موقع تسويقي — جرّب
            الأداة أعلاه بكلا المعيارين لترى الفرق الفعلي على مقاس غرفتك.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
