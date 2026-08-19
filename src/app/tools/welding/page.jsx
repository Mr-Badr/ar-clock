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
    throw new Error(`welding hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Differentiation play, not a CPC play (owner verdict, 2026-08-10): 127,700/mo broad volume on
// تلحيم/للحام/ورش اللحام (Low comp on several head terms), but CPC is weak (max 18.8 SAR) — this
// isn't a top earner, it's a first-mover tool bet. Every calculator/converter/checker/tracker-
// shaped query returned zero Keyword Planner volume (same pattern as Smart Home), so the
// calculators are shipped as embedded utility inside the pillar guide, not standalone SEO pages —
// no Arabic competitor has these at all despite real English precedent (MachineMFG, Kobelco,
// Elga-Welding). See docs/PLAN.md §13 and keyword-research/welding-hub/DECISION.md.
const FEATURED_SLUGS = ['welding-guide'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الدليل والحاسبات',
    note: 'أنواع اللحام، متى تستخدم كل نوع، واحسب كمية الأقطاب والتيار المناسب مباشرة.',
    slugs: ['welding-guide'],
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
  title: 'اللحام — أنواعه وحاسبة استهلاك الأقطاب والتيار المناسب',
  description:
    'دليل أنواع اللحام (القوس الكهربائي، الأرجون، MIG/CO2) مع حاسبة استهلاك الأقطاب والتيار المناسب لسمك المعدن.',
  url: `${SITE_URL}/tools/welding`,
});

export default function WeldingCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'اللحام', item: `${SITE_URL}/tools/welding` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-welding-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 15 L9 10 L14 15 L20 9" />
                <path d="M16 5 L20 9 L16 13" />
                <circle cx="6" cy="18" r="1.4" />
                <circle cx="11" cy="18" r="1.4" />
              </svg>
            </span>
            <h1>اللحام</h1>
          </div>
          <p>
            أي نوع لحام يناسب مشروعك، وكم قطب أو سلك تحتاج فعلاً — دليل عملي مع حاسبة حقيقية بدل
            التقدير بالعين.
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

        <HubGuideSection id="before-you-start" title="قبل أن تبدأ أي مشروع لحام">
          <p>
            نوع اللحام المناسب يعتمد على ثلاثة عوامل عملية: نوع المعدن (الحديد العادي يختلف عن
            الألمنيوم أو الستانلس ستيل)، سماكته (المعادن الرقيقة تحتاج تحكماً أدق من الأنبوبية أو
            القوس الكهربائي التقليدي)، وخبرتك الفعلية (القوس الكهربائي أسهل للمبتدئين رغم أنه أقل
            دقة). لا تختر النوع بناءً على ما تملكه من معدات فقط — ابدأ من طبيعة المعدن الذي
            ستلحمه، ثم راجع الدليل الكامل أدناه لمعرفة أي نوع يناسبه فعلياً، واحسب كمية القطب أو
            السلك المطلوبة قبل الشراء بدل التقدير بالعين.
          </p>
          <p>
            معدات الحماية الأساسية ليست اختيارية بغض النظر عن نوع اللحام: قناع وجه يحجب الأشعة
            فوق البنفسجية والأشعة تحت الحمراء الناتجة عن القوس الكهربائي (وليس نظارات عادية داكنة)،
            قفازات جلدية تتحمل الحرارة، وتهوية جيدة للمكان لأن أبخرة اللحام قد تكون ضارة عند
            التنفس المتكرر في مساحة مغلقة. هذه المعدات تحمي من إصابات حقيقية وليست احتياطاً زائداً.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
