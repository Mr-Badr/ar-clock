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
    throw new Error(`sleep hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-04 — the 6 sleep calculators already had deep, well-researched content
// (each with its own decision table, method-steps, and sourced FAQ) but were orphaned from any
// /tools hub, discoverable only via the old /calculators nav — the same root-cause pattern
// found earlier for the age and health/education clusters. A parallel "sleep guides" content
// system (8 explainer-article slugs) existed in src/lib/sleep/content.js but was never actually
// routable (generateStaticParams only ever mapped the 6 calculator slugs) — dropped as dead code
// rather than invested in, since a real competitor check found the broad informational queries
// dominated by webteb.com/altibbi.com, while the narrow interactive-tool queries (nap calculator,
// sleep debt) had no real calculator competitors at all — see project memory for the full research.
const FEATURED_SLUGS = ['bedtime', 'nap-calculator', 'sleep-debt'];

const TOOL_SLUGS = ['bedtime', 'wake-time', 'sleep-duration', 'nap-calculator', 'sleep-debt', 'sleep-needs-by-age'];

const FAQ_ITEMS = [
  {
    question: 'أستيقظ متعباً حتى بعد نوم 8 ساعات كاملة — ما السبب؟',
    answer: 'غالباً لأن استيقاظك وقع في منتصف دورة نوم بدل نهايتها — كل دورة نوم تستغرق نحو 90 دقيقة، والاستيقاظ في منتصفها يشعرك بخمول أكبر من الاستيقاظ عند نهاية دورة كاملة حتى لو كان مجموع الساعات أقل. استخدم حاسبة "متى أنام" لتحديد وقت نوم يوافق نهاية دورة كاملة عند موعد استيقاظك.',
  },
  {
    question: 'هل القيلولة الطويلة أفضل من القصيرة؟',
    answer: 'ليس بالضرورة — قيلولة قصيرة (حول 20 دقيقة) تنعشك دون دخول نوم عميق فيصعب الاستيقاظ منه، بينما قيلولة أطول (دورة كاملة تقريباً) تفيد أكثر إن كنت تعوّض نقص نوم حقيقياً لكنها تحتاج وقتاً أطول للاستيقاظ الكامل بعدها. اختر النوع المناسب لوقتك المتاح في حاسبة القيلولة.',
  },
  {
    question: 'كيف أعرف إن كان لدي "دين نوم" متراكم فعلاً؟',
    answer: 'إذا كنت تنام أقل من احتياجك الفعلي لعدة أيام متتالية (حتى لو بفارق ساعة أو ساعتين يومياً)، الفارق يتراكم فعلياً كعجز حقيقي يؤثر على تركيزك ومزاجك، لا يختفي بمجرد نوم ليلة واحدة كاملة لاحقاً. احسب عجزك التراكمي في حاسبة دين النوم لمعرفة حجمه الحقيقي وخطة تعويضه تدريجياً.',
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
  title: 'حاسبات النوم الذكي بالعربي — متى أنام ومتى أستيقظ',
  description: 'حاسبات نوم عربية تجيب مباشرة: متى أنام، متى أستيقظ، كم نمت فعلياً، هل عندي دين نوم، وكم ساعة نوم تحتاج حسب عمرك — بدون تسجيل.',
  url: `${SITE_URL}/tools/sleep`,
});

export default function SleepCategoryHubPage() {
  const toolCount = TOOL_SLUGS.length;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'حاسبات النوم الذكي', item: `${SITE_URL}/tools/sleep` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات النوم الذكي',
    url: `${SITE_URL}/tools/sleep`,
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

      <ToolTopAdSlot slotId="top-sleep-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.4 5.4 0 0 1 12 3Z" />
              </svg>
            </span>
            <h1>حاسبات النوم الذكي</h1>
          </div>
          <p>
            من متى أنام لأستيقظ في وقتي، إلى دين النوم الأسبوعي واحتياجك حسب عمرك — كل حاسبة هنا
            تجيب عن سؤال نومك اليومي مباشرة، لا مقالة عامة عن أهمية النوم.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> حاسبات نوم مرتبطة مباشرة</span>
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
              <h2>النوم والاستيقاظ</h2>
              <p className="tool-v2-type-group-note">حاسبات مبنية على دورات النوم (90 دقيقة تقريباً) ووقت الغفو، لا تخمين عام.</p>
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
