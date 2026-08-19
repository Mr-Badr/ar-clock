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
    throw new Error(`plumbing hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-07-31 from a real Keyword Planner run (Gulf/Saudi, Arabic) — see
// keyword-research/plumber-hub/DECISION.md. Unlike /tools/construction, none of the hand-written
// tool-specific keywords (حاسبة/محوّل/مولّد phrasing) had real search volume — the real demand was
// buying guides and service explainers, so every page here is editorial content, not a calculator.
// Rebuilt 2026-08-01 to match the /tools/construction dot-list pattern (see
// .claude/rules/tools-hub-pattern.md) — same visual system as /tools/electrical. This hub has no
// tools group yet since no calculator-shaped keyword demand was found; add one only when the
// keyword re-audit (feedback-analyze-full-keyword-set-not-just-candidates) turns up real volume.
const FEATURED_SLUGS = ['leak-detection', 'water-heaters', 'septic-tank-guide'];

const TYPE_GROUPS = [
  {
    code: 'articles',
    name: 'المقالات',
    note: 'من تسرب لا تعرف مصدره إلى فاتورة مياه مرتفعة فجأة — كل قرار قبل أن تدفع فيه ريالاً واحداً.',
    slugs: ['leak-detection', 'water-tanks', 'water-heaters', 'water-meter', 'septic-tank-guide'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'كيف أعرف أن لدي تسرب مياه مخفياً قبل أن يظهر أي أثر على الجدار؟',
    answer: 'أوضح علامة مبكرة هي ارتفاع فاتورة المياه فجأة دون سبب واضح في استهلاكك اليومي — راجع دليل كشف التسربات لمعرفة العلامات الأخرى (صوت جريان مياه بلا استخدام، بقعة رطوبة صغيرة) وكيف تحدد مصدر التسرب قبل أن يتفاقم.',
  },
  {
    question: 'خزان مياهي القديم — متى أستبدله بدل الاكتفاء بالتنظيف الدوري؟',
    answer: 'التنظيف الدوري (مرتين سنوياً على الأقل) يحافظ على جودة المياه، لكنه لا يعالج الصدأ الداخلي أو التشققات في خزان متقدم بالعمر. راجع دليل اختيار خزان المياه لمعرفة علامات الاستبدال ومقارنة الأنواع (بلاستيك، فايبرجلاس، استانلس ستيل) قبل الشراء.',
  },
  {
    question: 'سخان مياهي لا يعطي ماءً ساخناً كافياً — هل المشكلة في السخان نفسه أم في الاستخدام؟',
    answer: 'يعتمد على نوع سخانك وسعته مقارنة بعدد أفراد أسرتك واستخدامهم المتزامن — راجع دليل سخانات المياه لمعرفة السعة المناسبة لحجم أسرتك والفرق بين السخان الفوري والمركزي قبل أن تفترض أن السخان معطل.',
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
  title: 'دليل السباكة — كشف التسربات، الخزانات، السخانات، وعداد المياه',
  description:
    'اكشف تسرب المياه قبل أن يكلفك الكثير، اختر خزان المياه المناسب، قارن السخان الفوري بالمركزي، وحل مشاكل عداد المياه وفاتورته — أدلة سباكة عملية وشاملة.',
  url: `${SITE_URL}/tools/plumbing`,
});

export default function PlumbingHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'السباكة', item: `${SITE_URL}/tools/plumbing` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دليل السباكة',
    url: `${SITE_URL}/tools/plumbing`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: toolCount,
      itemListElement: Array.from(allListedSlugs).map((slug, index) => {
        const route = findRoute(slug);
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: route.shortLabel || route.title,
          url: `${SITE_URL}${route.href}`,
        };
      }),
    },
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-plumbing-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 2c4 5 6 8.5 6 11.5a6 6 0 1 1-12 0C6 10.5 8 7 12 2Z" />
              </svg>
            </span>
            <h1>دليل السباكة</h1>
          </div>
          <p>
            من تسرب مياه لا تعرف مصدره، إلى اختيار خزان أو سخان جديد، إلى فاتورة مياه مرتفعة
            فجأة — أربعة أدلة عملية تشرح كل قرار قبل أن تدفع فيه ريالاً واحداً.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدلة مرتبطة مباشرة</span>
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

        <HubGuideSection id="hub-faq" title="الأسئلة الشائعة">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
