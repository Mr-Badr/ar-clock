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
    throw new Error(`real-estate hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-25) — this site's first real-estate presence, found via tool-gap
// research aimed at high-RPM daily decisions (owner: "high rpm like rent or other things").
// Grew to 3 tools same session: agent commission, rent affordability, Egypt transfer fee — see
// each CALCULATOR_ROUTES entry's own comment for the research behind it.
const FEATURED_SLUGS = ['agent-commission-calculator', 'rent-affordability-calculator', 'egypt-transfer-fee-calculator'];

const TYPE_GROUPS = [
  {
    code: 'tools',
    name: 'الأدوات والحاسبات',
    note: '',
    slugs: ['agent-commission-calculator', 'rent-affordability-calculator', 'egypt-transfer-fee-calculator'],
  },
];

// Hub-level FAQ (multi-tool hub now, per .claude/rules/calculator-ui-standards.md §0f) — questions
// are category-wide decisions, deliberately distinct from each tool's own FAQ (which covers that
// tool's specific mechanics).
const FAQ_ITEMS = [
  {
    question: 'أي حاسبة عقارات أحتاجها؟',
    answer:
      'إذا كنت تبيع أو تؤجر عقاراً عبر وسيط، استخدم حاسبة عمولة الوسيط. إذا كنت مستأجراً وتريد معرفة هل إيجارك مناسب لدخلك، استخدم حاسبة نسبة الإيجار من الراتب. وإذا كنت تشتري عقاراً في مصر وتحتاج معرفة رسوم النقل، استخدم حاسبة رسوم الشهر العقاري.',
  },
  {
    question: 'هل هذه الحاسبات تغطي كل دول الخليج؟',
    answer:
      'حاسبة عمولة الوسيط وحاسبة نسبة الإيجار عامتان وتصلحان لأي دولة (أدخل أرقامك الفعلية)، مع تفاصيل نظامية مؤكدة للسعودية والإمارات تحديداً. حاسبة رسوم الشهر العقاري خاصة بمصر فقط لأنها تعتمد على نظام تسجيل عقاري محلي.',
  },
  {
    question: 'هل هذه الأرقام رسمية أم تقديرية؟',
    answer:
      'كل نسبة نظامية مذكورة (سقف عمولة السعودية 2.5%، ضريبة التصرفات العقارية في مصر 2.5%، رسوم التسجيل الثابتة) مأخوذة من مصدر رسمي أو صحفي موثوق تجده في قسم المصادر بكل صفحة. أما النسب العرفية (مثل عمولة الإيجار في الإمارات) فمذكورة صراحة كعرف سوق شائع، لا كسقف نظامي ملزم.',
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
  title: 'العقارات — عمولة الوسيط ونسبة الإيجار من الراتب',
  description:
    'احسب عمولة الوسيط العقاري، وهل إيجارك مناسب لراتبك، ورسوم نقل ملكية عقارك — بالنسبة النظامية الصحيحة لكل حالة، لا التقدير العام.',
  keywords: [
    'حاسبة عمولة الوسيط العقاري',
    'حساب عمولة الوسيط العقاري',
    'حساب عمولة العقار',
    'عمولة العقار في السعودية',
    'عمولة الوسيط العقاري في الامارات',
    'كم عمولة السمسار العقاري',
    'حاسبة نسبة الايجار من الراتب',
    'هل ايجاري مناسب لراتبي',
    'حاسبة رسوم الشهر العقاري',
  ],
  url: `${SITE_URL}/tools/real-estate`,
});

export default function RealEstateCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'العقارات', item: `${SITE_URL}/tools/real-estate` },
    ],
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-real-estate-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" />
              </svg>
            </span>
            <h1>العقارات</h1>
          </div>
          <p>
            قبل توقيع أي عقد بيع أو إيجار، اعرف بالضبط كم تستحق عمولة الوسيط العقاري، وهل إيجارك
            مناسب لدخلك، وكم ستدفع فعلياً عند نقل ملكية عقارك — بالأرقام الصحيحة، لا التقدير العام.
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

        <HubGuideSection id="how-this-works" title="من يدفع عمولة الوسيط العقاري عادة؟">
          <p>
            في السعودية، يتحمل العمولة الطرف الذي تعاقد فعلياً مع الوسيط — غالباً البائع في صفقات
            البيع والمالك في عقود الإيجار، والنسبة سقف نظامي ملزم لا يجوز تجاوزه (2.5%) وفق نظام
            الوساطة العقارية. في الإمارات، العرف السائد أن يدفع المشتري عمولة البيع، بينما تُحسب
            عمولة الإيجار عادة من نسبة الإيجار السنوي — لكنها نسبة عرفية شائعة وليست سقفاً نظامياً
            ملزماً بنفس الطريقة. استخدم الأداة أدناه واختر دولتك لمعرفة النسبة الصحيحة لحالتك.
          </p>
        </HubGuideSection>

        <HubGuideSection id="hub-faq" title="أسئلة قبل اختيار حاسبة عقارات">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
