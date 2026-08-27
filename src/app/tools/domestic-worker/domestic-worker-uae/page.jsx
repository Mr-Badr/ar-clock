import Link from 'next/link';

import UaeDomesticWorkerCostCalculator from '@/components/calculators/UaeDomesticWorkerCostCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'domestic-worker-cost-uae');
const CONTENT = getFinancePageContent('domestic-worker-cost-uae');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['dwu-guide', 'لماذا الرسوم الحكومية منفصلة عن رسوم مركز تدبير؟'],
  ['dwu-faq', 'الأسئلة الشائعة'],
  ['dwu-related', 'نفس الحاسبة في دول خليجية أخرى'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const SIBLING_TOOLS = pickTools([
  'domestic-worker-cost', 'domestic-worker-cost-kuwait', 'domestic-worker-cost-qatar',
  'domestic-worker-cost-bahrain', 'domestic-worker-cost-oman',
]);

function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function DomesticWorkerCostUaePage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الاستقدام والعمالة المنزلية', item: `${SITE_URL}/tools/domestic-worker` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-dw-uae" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-dw-uae" /></div>

        <article className="tool-v2-lane-article">
          <section id="dwu-guide">
            <h2>لماذا الرسوم الحكومية منفصلة عن رسوم مركز تدبير؟</h2>
            <p>
              رسوم التأشيرة الاتحادية العامة (حوالي 300 درهم) ثابتة وموحّدة عبر ICP بصرف النظر عن
              المركز الذي تتعامل معه. أما رسوم مركز تدبير أو المكتب الخاص فتُبنى على باقة كاملة
              (تأشيرة تدبير، تأمين، خدمات إدارية) تختلف فعلياً حسب المركز والجنسية — لا يوجد جدول
              حكومي موحّد لهذا الجزء، فتتركه الأداة أعلاه حقلاً تُدخله من عرضك الفعلي.
            </p>
            <PlainBlock eyebrow="كفالة خاصة أم عبر مركز تدبير؟" title="الفرق يؤثر على شرط الدخل لا على الجودة">
              الكفالة الخاصة تسجّل العاملة تحت اسمك مباشرة وتحتاج دخلاً شخصياً أعلى عادة. التسجيل
              عبر مركز تدبير مرخّص يجعل المركز نفسه هو الكفيل المسجَّل، ما يخفف شرط الدخل الشخصي —
              اختر المسار المناسب لوضعك قبل طلب عروض الأسعار.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-dw-uae" />

          <section id="dwu-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {sources.length ? (
            <section id="dwu-sources">
              <h2>مصادر رسمية</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}

          <section id="dwu-related">
            <h2>نفس الحاسبة في دول خليجية أخرى</h2>
            <p>الرسوم والشروط تختلف فعلياً من دولة لأخرى — اختر بلدك:</p>
            <nav className="tool-v2-related-grid" aria-label="حاسبات دول أخرى">
              {SIBLING_TOOLS.map((tool) => (
                <Link key={tool.slug} href={tool.href}>
                  <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                  {tool.shortLabel || tool.title}
                </Link>
              ))}
            </nav>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><UaeDomesticWorkerCostCalculator /></div>
        </div>
      </div>
    </main>
  );
}
