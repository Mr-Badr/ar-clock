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
    throw new Error(`aluminum-glass hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Narrow, deliberately small hub (2026-08-09) — real Keyword Planner data showed zero volume for
// every calculator/generator/converter-shaped phrase in this space (weight, meterage, quotes,
// unit conversion — all "Unknown"). The real demand that exists is decorative/comparison browsing
// (glass colors, types, aluminum vs UPVC) — a buying-guide, not a tool. See
// keyword-research/aluminum-glass/DECISION.md and docs/PLAN.md §13. This container does NOT mean
// the category passed the full 5-check Hub Gate as a strategic calculator category — it's the
// minimal container for one validated content page.
const FEATURED_SLUGS = ['aluminum-glass-types-colors'];

const TYPE_GROUPS = [
  {
    code: 'articles',
    name: 'المقالات',
    note: 'قبل اختيار زجاج الشبابيك أو الأبواب — الأنواع والألوان الحقيقية ومتى تختار كل واحد.',
    slugs: ['aluminum-glass-types-colors'],
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
  title: 'دليل الألومنيوم والزجاج — أنواع وألوان الشبابيك والأبواب',
  description:
    'الفرق بين السيكوريت والدبل جلاس واللامينيت، ألوان الزجاج العاكس الأنسب لواجهتك، ومقارنة الألومنيوم مع UPVC — دليل عملي قبل أي قرار شراء.',
  keywords: [
    'دليل الالومنيوم والزجاج',
    'انواع زجاج الشبابيك',
    'زجاج سيكوريت',
    'الفرق بين الدبل جلاس واللامينيت',
    'الفرق بين الالومنيوم وupvc',
    'الوان الزجاج العاكس',
  ],
  url: `${SITE_URL}/tools/aluminum-glass`,
});

export default function AluminumGlassCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الألومنيوم والزجاج', item: `${SITE_URL}/tools/aluminum-glass` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-aluminum-glass-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="4" width="18" height="16" rx="1.5" />
                <path d="M12 4v16M3 12h18" />
              </svg>
            </span>
            <h1>الألومنيوم والزجاج</h1>
          </div>
          <p>
            أي نوع زجاج يناسب أبوابك ونوافذك، أي لون عاكس يوازن الإضاءة والخصوصية، وهل الألومنيوم
            أم UPVC هو الخيار الأنسب — دليل عملي مبني على فروقات حقيقية بين الأنواع.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> صفحات مرتبطة مباشرة</span>
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

        <HubGuideSection id="glass-decision" title="ابدأ من الوظيفة، لا من المظهر فقط">
          <p>
            قبل مقارنة الألوان، حدد الوظيفة الأساسية التي تحتاجها: السيكوريت (الزجاج المقسّى)
            للسلامة والمقاومة عند الكسر، الدبل جلاس للعزل الحراري والصوتي في الغرف المطلة على
            الشارع، والزجاج العاكس لتقليل حرارة الشمس مع الحفاظ على قدر من الخصوصية نهاراً. الإطار
            نفسه (ألومنيوم أم UPVC) قرار منفصل يؤثر على العزل والصيانة طويلة المدى أكثر من تأثيره
            على المظهر. راجع الدليل الكامل أدناه للمقارنة التفصيلية بين كل الخيارات قبل الشراء.
          </p>
          <p>
            لا تختر لون الزجاج العاكس من كتالوج فقط دون رؤيته على واجهة حقيقية أولاً — درجة العاكس
            نفسها قد تبدو مختلفة تماماً حسب اتجاه الواجهة (شمالية أم جنوبية) وشدة إضاءة الشمس في
            وقت المعاينة. اطلب من المورد عينة فعلية بحجم مناسب واحملها إلى موقع التركيب في أوقات
            مختلفة من اليوم قبل تأكيد الطلب النهائي لكامل الواجهة.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
