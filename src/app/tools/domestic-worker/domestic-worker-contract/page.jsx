import Link from 'next/link';

import DomesticWorkerContractGenerator from '@/components/calculators/DomesticWorkerContractGenerator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'domestic-worker-contract-generator');
const CONTENT = getFinancePageContent('domestic-worker-contract-generator');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['dwc-guide', 'ما مستوى التوثيق لكل دولة؟'],
  ['dwc-faq', 'الأسئلة الشائعة'],
  ['dwc-sources', 'مصادر رسمية'],
  ['dwc-related', 'أدوات ذات صلة'],
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
const RELATED_TOOLS = pickTools([
  'domestic-worker-eligibility', 'domestic-worker-cost', 'domestic-worker-cost-uae',
  'domestic-worker-cost-kuwait', 'domestic-worker-cost-qatar', 'domestic-worker-cost-bahrain',
  'domestic-worker-cost-oman',
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

export default function DomesticWorkerContractGeneratorPage() {
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

      <ToolTopAdSlot slotId="top-dw-contract" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-dw-contract" /></div>

        <article className="tool-v2-lane-article">
          <section id="dwc-guide">
            <h2>ما مستوى التوثيق لكل دولة؟</h2>
            <p>
              مستوى التوثيق الرسمي لعقد العمالة المنزلية يختلف فعلياً بين دول الخليج، والمولّد أعلاه
              يعرض هذا الفرق بصراحة على كل عقد يُنشأ بدل التظاهر بأن كل نسخة رسمية بنفس الدرجة.
            </p>
            <PlainBlock eyebrow="السعودية والإمارات والكويت" title="حقول مطابقة لنص رسمي منشور">
              السعودية تصدر عقداً إلكترونياً موحداً عبر مساند مطابقاً لمادة 7 من اللائحة التنفيذية.
              الإمارات تنشر عناصر العقد الإلزامية على البوابة الرسمية u.ae مباشرة. الكويت تُلزم بعقد
              ثنائي اللغة وفق نص المادة 18 من القانون رقم 68 لسنة 2015 الذي جرى فحصه كاملاً. الحقول
              في هذه الحالات الثلاث مبنية مباشرة على نص رسمي حكومي منشور.
            </PlainBlock>
            <PlainBlock eyebrow="قطر والبحرين وعُمان" title="شفافية كاملة حول حدود المصدر">
              قطر لديها عقد موحد بالاسم (القانون 15/2017) والبحرين لديها "العقد الثلاثي" باسمه الرسمي
              لدى LMRA، لكن النص الحرفي لكليهما تعذّر الوصول إليه مباشرة — الحقول هنا إعادة بناء من
              وصف رسمي للمستند وليست نسخة طبق الأصل. عُمان مؤكدة رسمياً في حقولها (المادة 19 من القرار
              574/2025) لكن لا يوجد نموذج موحد رسمي أصلاً لتطابقه. كل عقد يُنشأ لهذه الدول يحمل
              تنويهاً واضحاً بهذا الفرق أعلى المستند مباشرة.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-dw-contract" />

          <section id="dwc-faq">
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
            <section id="dwc-sources">
              <h2>مصادر رسمية</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}

          <section id="dwc-related">
            <h2>أدوات ذات صلة</h2>
            <p>تحقق من أهليتك أو احسب التكلفة الكاملة قبل توقيع العقد:</p>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {RELATED_TOOLS.map((tool) => (
                <Link key={tool.slug} href={tool.href}>
                  <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                  {tool.shortLabel || tool.title}
                </Link>
              ))}
            </nav>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><DomesticWorkerContractGenerator /></div>
        </div>
      </div>
    </main>
  );
}
