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
    throw new Error(`attendance hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Narrow hub launched 2026-08-10 from real Keyword Planner data (نظام الحضور والانصراف:
// 11,500/mo, Low-Medium competition, bid up to 230.35 SAR — the highest CPC found across every
// category researched this session). The sibling ideas from the same research round (انتركم،
// اكسس كنترول للتجزئة) were rejected on competition/CPC grounds — see docs/PLAN.md §13. This
// hub deliberately starts with ONE deep, fully-researched page rather than several thin ones —
// see keyword-research/access-control-intercom-hub/DECISION.md.
const FEATURED_SLUGS = ['attendance-cost-calculator'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والحاسبات',
    note: 'قبل التعاقد مع أي مزود — قارن الأسعار الحقيقية واحسب تكلفة شركتك الفعلية.',
    slugs: ['attendance-cost-calculator'],
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
  title: 'نظام الحضور والانصراف — حاسبة التكلفة ومقارنة الأسعار',
  description:
    'احسب تكلفة نظام الحضور والانصراف المناسب لعدد موظفي شركتك، وقارن أسعار حقيقية لأبرز المزودين قبل التعاقد.',
  keywords: [
    'نظام الحضور والانصراف',
    'حاسبة تكلفة نظام حضور وانصراف',
    'اجهزة بصمة حضور وانصراف',
    'برنامج حضور وانصراف سحابي',
    'انظمة حضور وانصراف في السعودية',
  ],
  url: `${SITE_URL}/tools/attendance`,
});

export default function AttendanceCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الحضور والانصراف', item: `${SITE_URL}/tools/attendance` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-attendance-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7.5v5l3.2 2" />
              </svg>
            </span>
            <h1>الحضور والانصراف</h1>
          </div>
          <p>
            كم تدفع شركتك فعلياً مقابل نظام الحضور والانصراف، ومتى يستحق البصمة أم التطبيق
            السحابي — احسب تكلفتك الحقيقية حسب عدد موظفيك بدل التخمين أو انتظار عرض سعر.
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

        <HubGuideSection id="cost-drivers" title="ما الذي يرفع تكلفة نظام الحضور فعلياً؟">
          <p>
            السعر المعلن لكل موظف نادراً ما يكون الرقم النهائي — التكاليف الحقيقية غالباً تشمل
            رسوم إعداد أولية، سعر الجهاز نفسه (للبصمة الفعلية لا التطبيق)، ورسوم تكامل مع نظام
            الرواتب إن كان لديك نظام محاسبي منفصل. عدد الموظفين يغيّر أيضاً هيكل التسعير عند أغلب
            المزودين — أحياناً بشكل غير خطي (خصم فعلي بعد عتبة معينة). احسب تكلفتك الفعلية في
            الأداة أدناه بدل الاعتماد على السعر المعلن في الصفحة الرئيسية لأي مزود وحده.
          </p>
          <p>
            التحول من نظام حضور يدوي (توقيع ورقي أو دفتر) إلى نظام إلكتروني يحتاج فترة تهيئة
            حقيقية لموظفيك، لا تفعيلاً فورياً في يوم واحد — أوضح الغرض والفائدة لهم مسبقاً بدل
            تقديمه كأداة مراقبة فقط، فذلك يقلل المقاومة الأولية ويسرّع الاعتياد على الروتين الجديد،
            خصوصاً في الفرق التي اعتادت المرونة في تسجيل الحضور لسنوات طويلة.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
