import '@/app/tools/tools-v2.css';
import EgyptWaterBillCalculator from '@/components/calculators/EgyptWaterBillCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-water-bill');
const CONTENT = getFinancePageContent('egypt-water-bill');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TARIFF_ROWS = [
  ['0 – 10', '2.00', 'أسرة صغيرة'],
  ['11 – 20', '3.00', 'أسرة متوسطة'],
  ['21 – 30', '5.00', 'أسرة كبيرة'],
  ['31+', '8.00', 'استهلاك مرتفع'],
];
const BILL_COMPONENT_ROWS = [
  ['رسوم المياه', 'حسب الشريحة أعلاه'],
  ['رسوم الصرف الصحي', '65% من رسوم المياه'],
  ['الرسم التنظيمي', '0.50 ج.م/شهر (ثابت)'],
  ['ضريبة القيمة المضافة', '14% على مجموع ما سبق'],
];

const TOC_ITEMS = [
  ['eg-water-tariff', 'شرائح الأسعار'],
  ['eg-water-faq', 'الأسئلة الشائعة'],
];

export default function EgyptWaterBillPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الرواتب والمزايا الخليجية', item: `${SITE_URL}/tools/gulf-finance` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, keywords: PAGE.keywords, faqItems,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيف تحسب فاتورة المياه في مصر',
    description: PAGE.description,
    step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-egypt-water-bill" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-egypt-water-bill" /></div>

        <article className="tool-v2-lane-article">
          <section id="eg-water-tariff">
            <h2>شرائح أسعار المياه والصرف الصحي في مصر</h2>
            <p>
              تُسعّر المياه في مصر وفق نظام شرائح تصاعدية هامشية. على كل فاتورة تُضاف رسوم الصرف الصحي (65% من قيمة
              المياه)، ورسم تنظيمي ثابت، ثم ضريبة القيمة المضافة 14% على الإجمالي.
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الشريحة (م³/شهر)</th><th>سعر المياه (ج.م/م³)</th><th>ملاحظة</th></tr></thead>
                <tbody>{TARIFF_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="tool-v2-mini-block-head"><span>مكونات الفاتورة الكاملة</span></div>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>البند</th><th>الأساس</th></tr></thead>
                <tbody>{BILL_COMPONENT_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-egypt-water-bill" />

          <section id="eg-water-faq">
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

          {CONTENT.sources?.length > 0 && (
            <section id="eg-water-sources">
              <h2>المراجع الرسمية</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><EgyptWaterBillCalculator /></div>
        </div>
      </div>
    </main>
  );
}
