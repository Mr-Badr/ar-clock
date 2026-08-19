import WorkingDaysTool from '@/components/calculators/gulf-finance/WorkingDaysTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { ReferenceGrid } from '@/components/tools-v2/ReferenceGrid';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'working-days');
const CONTENT = getFinancePageContent('working-days');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['wd-guide', 'لماذا تختلف عطلة نهاية الأسبوع بين الدول العربية؟'],
  ['wd-faq', 'الأسئلة الشائعة'],
  ['wd-sources', 'مصادر'],
];

// Same weekend rules used by WorkingDaysTool.client.jsx's WORKING_DAYS_COUNTRIES (engine.js).
const WEEKEND_BY_COUNTRY = [
  { value: 'السعودية', meta: 'الجمعة والسبت' },
  { value: 'الإمارات', meta: 'السبت والأحد' },
  { value: 'الكويت', meta: 'الجمعة والسبت' },
  { value: 'قطر', meta: 'السبت والأحد' },
  { value: 'البحرين', meta: 'الجمعة والسبت' },
  { value: 'سلطنة عُمان', meta: 'الجمعة والسبت' },
  { value: 'مصر', meta: 'الجمعة والسبت' },
  { value: 'الأردن', meta: 'الجمعة والسبت' },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function WorkingDaysPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الرواتب والمزايا الخليجية', item: `${SITE_URL}/tools/gulf-finance` },
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

      <ToolTopAdSlot slotId="top-working-days" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-working-days" /></div>

        <article className="tool-v2-lane-article">
          <section id="wd-guide">
            <h2>لماذا تختلف عطلة نهاية الأسبوع بين الدول العربية؟</h2>
            <p>
              تعتمد أغلب الدول العربية (السعودية، الكويت، البحرين، عُمان، مصر، الأردن) عطلة الجمعة
              والسبت. أما الإمارات وقطر فانتقلتا رسمياً إلى عطلة السبت والأحد منذ يناير 2022 لمواءمة
              أيام العمل مع الأسواق العالمية — كثير من الأدوات والمقالات العربية لا تزال تعرض
              المعلومة القديمة الخاطئة. الحاسبة تستثني عطلة نهاية الأسبوع الرسمية فقط، ولا تستثني
              تلقائياً الإجازات الرسمية أو المناسبات الوطنية.
            </p>
            <ReferenceGrid items={WEEKEND_BY_COUNTRY} />
          </section>

          <ToolInArticleAd slotId="mid-working-days" />

          <section id="wd-faq">
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
            <section id="wd-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><WorkingDaysTool /></div>
        </div>
      </div>
    </main>
  );
}
