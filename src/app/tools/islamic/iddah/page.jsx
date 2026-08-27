import IddahTool from '@/components/calculators/gulf-finance/IddahTool.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'iddah');
const CONTENT = getFinancePageContent('iddah');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['iddah-guide', 'كيف تُحسب مدة العدة بدقة هجرية؟'],
  ['iddah-faq', 'الأسئلة الشائعة'],
  ['iddah-sources', 'مصادر'],
];

// Same 4 cases used by IddahTool.client.jsx's SITUATION_OPTIONS.
const IDDAH_CASES = [
  { title: 'أرملة', rows: [['المدة', '4 أشهر و10 أيام هجرية'], ['المصدر', 'سورة البقرة: 234']] },
  { title: 'مطلقة لا تحيض', rows: [['المدة', '3 أشهر هجرية'], ['المصدر', 'سورة الطلاق: 4']] },
  { title: 'مطلقة تحيض', rows: [['المدة', '3 حيضات كاملة (مدى تقريبي)'], ['المصدر', 'يعتمد على دورتها الفعلية']] },
  { title: 'حامل', rows: [['المدة', 'تنتهي بالولادة الفعلية'], ['المصدر', 'بصرف النظر عن كونها أرملة أو مطلقة']] },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function IddahPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الأدوات الإسلامية', item: `${SITE_URL}/tools/islamic` },
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

      <ToolTopAdSlot slotId="top-iddah" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-iddah" /></div>

        <article className="tool-v2-lane-article">
          <section id="iddah-guide">
            <h2>كيف تُحسب مدة العدة بدقة هجرية؟</h2>
            <p>
              عدة الأرملة أربعة أشهر وعشرة أيام هجرية كاملة (سورة البقرة: 234)، وعدة المطلقة غير
              الحائض ثلاثة أشهر هجرية (سورة الطلاق: 4) — الأداة تحسب الاثنتين بفارق تقويم هجري
              فعلي، لا بالتقريب إلى عدد أيام شمسي ثابت. عدة المطلقة الحائض ثلاث حيضات كاملة تعتمد
              على دورتها الفعلية، فتعرض الأداة مدى تقريبياً لها لا تاريخاً جازماً. عدة الحامل تنتهي
              دائماً بالولادة الفعلية، بصرف النظر عن كونها أرملة أو مطلقة.
            </p>
            <div className="guide-v2-compare-list">
              {IDDAH_CASES.map((card) => (
                <div className="guide-v2-compare-card" key={card.title}>
                  <div className="guide-v2-compare-head">
                    <span className="guide-v2-compare-title">{card.title}</span>
                  </div>
                  <div className="guide-v2-compare-rows">
                    {card.rows.map(([label, value]) => (
                      <div className="guide-v2-compare-row" key={label}>
                        <span className="guide-v2-compare-row-label">{label}</span>
                        <span className="guide-v2-compare-row-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <ToolInArticleAd slotId="mid-iddah" />

          <section id="iddah-faq">
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
            <section id="iddah-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><IddahTool /></div>
        </div>
      </div>
    </main>
  );
}
