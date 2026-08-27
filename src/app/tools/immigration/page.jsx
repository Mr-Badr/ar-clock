import Link from 'next/link';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection, HubFaq, buildHubFaqSchema } from '@/components/tools-v2/HubGuideSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`immigration hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-27) — this site's first tools aimed at Arab-diaspora countries beyond the
// Gulf (UK, France, Germany, USA, Canada), found via global tool-gap research. Immigration is a
// genuinely high-RPM vertical (confirmed via real search: $30-80/click legal-services CPC) with
// real, proven demand and — for 3 of these 4 tools — zero Arabic interactive competition found.
const FEATURED_SLUGS = [
  'uk-ilr-absence-calculator',
  'canada-crs-calculator',
  'eu-citizenship-duration-calculator',
];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والحاسبات',
    note: '',
    slugs: [
      'uk-ilr-absence-calculator',
      'eu-citizenship-duration-calculator',
      'dv-lottery-eligibility-checker',
      'canada-crs-calculator',
    ],
  },
];

// Hub-level FAQ (multi-tool hub, per .claude/rules/calculator-ui-standards.md §0f) — category-wide
// decisions, deliberately distinct from each tool's own FAQ.
const FAQ_ITEMS = [
  {
    question: 'أي حاسبة هجرة أحتاجها؟',
    answer:
      'إذا كنت مقيماً في بريطانيا وتتجه نحو الاستقرار (ILR)، استخدم حاسبة أيام الغياب. إذا كنت تخطط للحصول على الجنسية الفرنسية أو الألمانية، استخدم حاسبة مدة الأهلية. إذا كنت تفكر في التسجيل بقرعة الجرين كارد الأمريكية، استخدم أداة التحقق من الأهلية. وإذا كنت تخطط للهجرة إلى كندا عبر Express Entry، استخدم حاسبة نقاط CRS.',
  },
  {
    question: 'هل هذه الأرقام رسمية ومحدثة؟',
    answer:
      'كل قاعدة مذكورة هنا مأخوذة من مصدر رسمي (gov.uk، service-public.gouv.fr، BAMF الألمانية، IRCC الكندية) أو تقرير إخباري موثوق يوثق تعديلاً رسمياً — تجده في قسم المصادر بكل صفحة. حرصنا خصوصاً على استبعاد قواعد أُلغيت فعلياً (مثل مسار التجنيس الألماني السريع بعد 3 سنوات، الذي أُلغي في أكتوبر 2025 ولا تزال مواقع عربية كثيرة تذكره خطأً).',
  },
  {
    question: 'هل هذه الحاسبات تغني عن استشارة محامي هجرة؟',
    answer:
      'لا — هذه الحاسبات تعطيك تقديراً دقيقاً مبنياً على القواعد المنشورة لتفهم وضعك وتخطط بثقة، لكن قرارات الهجرة الفعلية (تقديم طلب، استئناف رفض، حالات استثنائية) تستحق استشارة مختص مرخّص قبل اتخاذ أي خطوة رسمية.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: 'الهجرة — بريطانيا وأوروبا وأمريكا وكندا',
  description:
    'احسب أيام غيابك عن بريطانيا، ومتى تحق لك الجنسية الفرنسية أو الألمانية، وهل تستوفي شروط قرعة الجرين كارد، ونقاطك الفعلية للهجرة إلى كندا — بأرقام رسمية محدثة.',
  keywords: [
    'حاسبة الاقامة الدائمة بريطانيا',
    'حساب سنوات الاقامة للجنسية الالمانية',
    'حاسبة مدة الجنسية الفرنسية',
    'التحقق من اهلية قرعة الجرين كارد',
    'حاسبة نقاط الهجرة الى كندا',
  ],
  url: `${SITE_URL}/tools/immigration`,
});

export default function ImmigrationCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الهجرة', item: `${SITE_URL}/tools/immigration` },
    ],
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-immigration-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="12" r="2.2" />
                <path d="M14 10h4M14 14h4" />
              </svg>
            </span>
            <h1>الهجرة</h1>
          </div>
          <p>
            قبل أي قرار هجرة كبير، اعرف بالضبط أين تقف — أيام غيابك عن بريطانيا، متى تحق لك جنسية
            فرنسا أو ألمانيا، هل تستوفي شروط قرعة أمريكا، وكم نقطة تملك فعلياً للهجرة إلى كندا.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدوات</span>
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
                  {group.slugs.map((slug) => {
                    const route = findRoute(slug);
                    return (
                      <li key={slug}>
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
                  })}
                </ul>
              </div>
            ))}
          </div>
        </TooltipProvider>

        <HubGuideSection id="how-this-works" title="لماذا نبدأ ببريطانيا وفرنسا وألمانيا وأمريكا وكندا؟">
          <p>
            هذه الدول الخمس تجمع أكبر تجمعات الجالية العربية خارج المنطقة العربية والخليج — من
            الطلاب والعمال في بريطانيا، إلى الجالية المغاربية الكبيرة في فرنسا، والجالية السورية
            والعربية في ألمانيا، إلى من يتقدم سنوياً لقرعة الجرين كارد الأمريكية أو مسار الهجرة
            الكندي. كل حاسبة هنا مبنية على القاعدة الرسمية الحالية لتلك الدولة تحديداً، لا على
            تعميم لا يراعي فروقات كل نظام.
          </p>
        </HubGuideSection>

        <HubGuideSection id="hub-faq" title="أسئلة قبل اختيار حاسبة هجرة">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
