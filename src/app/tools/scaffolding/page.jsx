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
    throw new Error(`scaffolding hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-10 from real Keyword Planner data on سقالات/سقالة (5,000/mo each, Medium comp).
// The real auto-expansion showed most of that volume decomposing into brand-name searches for
// specific rental companies and rental/purchase commercial intent — a directory wouldn't win
// that. Instead of rejecting the whole category (the earlier, too-narrow read), this hub
// aggregates real, WebFetch-verified data no single competitor currently presents in one place:
// a complete pricing table across all scaffolding types (rental AND purchase), a real types
// guide, and an honest due-diligence checklist for evaluating any rental company — see
// docs/PLAN.md §13 and keyword-research/scaffolding-hub/DECISION.md.
const FEATURED_SLUGS = ['scaffolding-guide'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الدليل والحاسبة',
    note: 'جدول أسعار حقيقي شامل، دليل الأنواع، وما تتحقق منه قبل التعاقد مع أي شركة.',
    slugs: ['scaffolding-guide'],
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
  title: 'السقالات — دليل الأسعار والأنواع الكامل',
  description:
    'جدول أسعار حقيقي شامل لكل أنواع السقالات إيجاراً وشراءً، ودليل اختيار النوع المناسب لمشروعك.',
  keywords: [
    'اسعار السقالات',
    'انواع السقالات',
    'ايجار سقالات',
    'سقالة حديد ام المنيوم',
    'اسعار السقالات في السعودية',
  ],
  url: `${SITE_URL}/tools/scaffolding`,
});

export default function ScaffoldingCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'السقالات', item: `${SITE_URL}/tools/scaffolding` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-scaffolding-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 20V6M4 6l4-2v4M12 20V4M12 4l4 2v4M20 20V8M4 12h16M4 16h16" />
              </svg>
            </span>
            <h1>السقالات</h1>
          </div>
          <p>
            كم تكلفة السقالة إيجاراً أو شراءً حسب نوعها، وأي نوع يناسب مشروعك — جدول أسعار حقيقي
            شامل بدل التخمين أو انتظار عرض سعر شركة واحدة.
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

        <HubGuideSection id="rent-vs-buy" title="إيجار أم شراء — كيف تقرر؟">
          <p>
            القاعدة العملية الشائعة في المقاولات: إن كان المشروع لمرة واحدة أو موسمياً (صيانة
            واجهة، دهان، ترميم قصير المدة)، الإيجار أوفر تكلفة إجمالية ولا يحمّلك تخزيناً أو صيانة
            لاحقة. أما إن كنت تستخدم السقالة بشكل متكرر عبر عدة مشاريع (مقاول تنفيذ مستمر)، الشراء
            يصبح أوفر على المدى الطويل رغم التكلفة الأولى الأعلى. راجع جدول الأسعار الكامل أدناه
            لمقارنة كلا الخيارين حسب نوع السقالة الذي يناسب ارتفاع وطبيعة مشروعك تحديداً.
          </p>
          <p>
            قدّر طول واجهة العمل بالمتر الطولي قبل طلب عرض سعر، لا مساحة المبنى الكلية — السقالة
            تُسعَّر عادة بالمتر الطولي لكل مستوى ارتفاع، فواجهة طويلة ومنخفضة قد تكلف أكثر من واجهة
            قصيرة ومرتفعة رغم تشابه المساحة الظاهرية بينهما. هذا الفرق يفيدك عند مقارنة عروض أسعار
            من شركات مختلفة تستخدم طرق تسعير غير موحدة فيما بينها.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
