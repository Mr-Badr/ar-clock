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
    throw new Error(`elevators hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Narrow hub launched 2026-08-10 from real Keyword Planner data (صيانة مصاعد: 10,000/mo combined
// across spellings, Medium comp, bid up to 56.19 SAR). WebSearch-first + SERP check found the
// generic "guide to maintenance contracts" angle saturated by 9+ real elevator companies
// publishing near-identical lead-gen content — so this hub deliberately narrows to the one
// angle none of them cover neutrally: a compliance checklist grounded in real Civil Defense
// requirements, not a sales pitch. See docs/PLAN.md §13 and
// keyword-research/elevators-hub/DECISION.md. The "مصاعد عام"/"قطع غيار المصعد" angles were
// separately rejected on volume (3,050 and 300/mo).
const FEATURED_SLUGS = ['elevator-maintenance-guide'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والأدلة',
    note: 'تحقق من عقدك قبل التوقيع، وتعرف على اشتراطات الدفاع المدني الحقيقية.',
    slugs: ['elevator-maintenance-guide'],
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
  title: 'صيانة المصاعد — أنواع العقود ومدقق البنود قبل التوقيع',
  description:
    'تحقق من بنود عقد صيانة المصعد المعروض عليك، وتعرف على أنواع العقود الحقيقية واشتراطات الدفاع المدني.',
  keywords: [
    'صيانة المصاعد',
    'عقد صيانة مصعد',
    'انواع عقود صيانة المصاعد',
    'اشتراطات الدفاع المدني للمصاعد',
    'مدقق بنود عقد المصعد',
  ],
  url: `${SITE_URL}/tools/elevators`,
});

export default function ElevatorsCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'المصاعد', item: `${SITE_URL}/tools/elevators` },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolTopAdSlot slotId="top-elevators-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="6" y="3" width="12" height="18" rx="1.2" />
                <path d="M10 8h4M9 13l2-2 2 2M9 16l2 2 2-2" />
              </svg>
            </span>
            <h1>المصاعد</h1>
          </div>
          <p>
            هل عقد صيانة المصعد المعروض عليك يستوفي الأساسيات فعلاً؟ تحقق من البنود قبل التوقيع،
            بدل الاعتماد على كلام مندوب المبيعات وحده.
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

        <HubGuideSection id="who-needs-this" title="لماذا يهمك هذا التحقق قبل التوقيع">
          <p>
            سواء كنت مالك مبنى، رئيس اتحاد ملاك، أو مسؤول صيانة تستلم عروض أسعار من أكثر من شركة،
            الفرق بين عقد شامل وآخر غير شامل غالباً غير واضح من عنوان العقد وحده — يظهر فقط عند
            قراءة البنود بالتفصيل. توقيع عقد ناقص قد يعني تحمّلك تكلفة قطع غيار غير متوقعة لاحقاً،
            أو عدم استيفاء اشتراطات الدفاع المدني التي قد تُكتشف فقط عند التفتيش. راجع دليل عقود
            الصيانة أدناه قبل أي توقيع نهائي، لا بعده.
          </p>
          <p>
            إذا كنت تقارن أكثر من عرض سعر، لا تكتفِ بمقارنة الرقم الإجمالي وحده — اطلب من كل شركة
            تفصيلاً كتابياً لما يشمله العقد (عدد الزيارات الدورية سنوياً، هل قطع الغيار مشمولة أم
            منفصلة، زمن الاستجابة المضمون عند عطل طارئ). عرض أرخص بكثير من البقية غالباً يعني بنداً
            مهماً غير مشمول، لا صفقة أفضل فعلياً.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
