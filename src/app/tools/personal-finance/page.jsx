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
    throw new Error(`personal-finance hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-04 — same root-cause pattern as the sleep hub: 4 well-researched personal-finance
// calculators (each with its own decision table and sourced FAQ) orphaned from any /tools hub.
// A real competitor check found no dominant incumbent for these specific tools (unlike Gulf-law
// finance topics already covered in /tools/gulf-finance) — only small/generic calculator sites —
// so kept and redesigned rather than dropped. This hub is deliberately currency-agnostic
// (usePreferredCurrency, not Gulf-only) since personal budgeting applies pan-Arab, not just Gulf.
const FEATURED_SLUGS = ['bill-splitter', 'emergency-fund', 'debt-payoff'];

const TOOL_SLUGS = ['bill-splitter', 'emergency-fund', 'debt-payoff', 'savings-goal', 'net-worth'];

const FAQ_ITEMS = [
  {
    question: 'لا أعرف من أين أبدأ في ترتيب وضعي المالي — أي حاسبة أولاً؟',
    answer: 'ابدأ بصندوق الطوارئ إن لم يكن لديك واحد بعد — هو الأساس الذي يحميك قبل التفكير بأي هدف آخر. إن كان لديك دين قائم، سداد الديون يستحق أولوية عالية أيضاً بسبب تراكم الفائدة. الادخار لهدف معيّن وصافي الثروة يفيدانك أكثر بعد استقرار هذين الأساسين.',
  },
  {
    question: 'كيف أقسّم فاتورة مطعم أو رحلة بعدل بين مجموعة أصدقاء؟',
    answer: 'إذا كان الجميع طلب بنفس القيمة تقريباً، القسمة بالتساوي كافية. أما إذا اختلفت الطلبات (شخص طلب أكثر، آخر لم يشارك في عنصر معيّن)، استخدم التقسيم التفصيلي بندأ ببند ليحسب لك بدقة من يدين لمن بالضبط، بما في ذلك حصة كل شخص من الضريبة والبقشيش.',
  },
  {
    question: 'هل صافي الثروة السلبي (أقل من صفر) يعني أن وضعي المالي سيء؟',
    answer: 'ليس بالضرورة — كثيرون في بداية حياتهم المهنية أو بعد قرض دراسي أو سكن لديهم صافي ثروة سلبي مؤقتاً. المهم هو الاتجاه: هل يتحسن الرقم مع الوقت أم يزداد سوءاً؟ راجع صافي ثروتك دورياً (كل عدة أشهر) لمتابعة الاتجاه الحقيقي بدل التركيز على رقم لحظة واحدة.',
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
  title: 'حاسبات التخطيط المالي الشخصي بالعربي',
  description: 'رتّب صندوق الطوارئ وسداد الديون وهدف الادخار وصافي الثروة من سؤال مالي واضح — حاسبات عربية بأي عملة تختارها، بدون تسجيل.',
  keywords: [
    'التخطيط المالي الشخصي',
    'حاسبة صندوق الطوارئ',
    'حاسبة سداد الديون',
    'حاسبة هدف الادخار',
    'حاسبة صافي الثروة',
    'حاسبات مالية شخصية بالعربي',
  ],
  url: `${SITE_URL}/tools/personal-finance`,
});

export default function PersonalFinanceCategoryHubPage() {
  const toolCount = TOOL_SLUGS.length;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التخطيط المالي الشخصي', item: `${SITE_URL}/tools/personal-finance` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات التخطيط المالي الشخصي',
    url: `${SITE_URL}/tools/personal-finance`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: toolCount,
      itemListElement: TOOL_SLUGS.map((slug, index) => {
        const route = findRoute(slug);
        return { '@type': 'ListItem', position: index + 1, name: route.shortLabel || route.title, url: `${SITE_URL}${route.href}` };
      }),
    },
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-personal-finance-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 12h18M3 12a9 9 0 0 1 9-9m-9 9a9 9 0 0 0 9 9m0-18a9 9 0 0 1 9 9m-9-9v18m0 0a9 9 0 0 0 9-9" />
              </svg>
            </span>
            <h1>حاسبات التخطيط المالي الشخصي</h1>
          </div>
          <p>
            ابدأ من سؤالك المالي مباشرة: كيف تقسّم فاتورة مطعم أو رحلة بعدل، كم تحتاج صندوق طوارئ،
            متى تخلص من ديونك، كم تدخر شهرياً لهدفك القادم، وما صافي ثروتك الحالي فعلاً — خمس
            حاسبات بأي عملة تختارها.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> حاسبات مالية مرتبطة مباشرة</span>
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
            <div className="tool-v2-type-group">
              <h2>الادخار والديون وصافي الثروة</h2>
              <p className="tool-v2-type-group-note">كل حاسبة تبدأ من سؤال قرار مباشر، ثم تشرح كيف تستخدم النتيجة عملياً.</p>
              <ul className="tool-v2-tool-link-list">
                {TOOL_SLUGS.map((slug) => (<ToolLink key={slug} slug={slug} />))}
              </ul>
            </div>
          </div>
        </TooltipProvider>

        <HubGuideSection id="hub-faq" title="الأسئلة الشائعة">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
