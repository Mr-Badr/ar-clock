import '@/app/tools/tools-v2.css';
import JordanIncomeTaxCalculator from '@/components/calculators/JordanIncomeTaxCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'jordan-income-tax');
const CONTENT = getFinancePageContent('jordan-income-tax');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const BRACKET_ROWS = [
  ['0 – 5,000', '5%', '250 د.أ'],
  ['5,001 – 10,000', '10%', '500 د.أ'],
  ['10,001 – 15,000', '15%', '750 د.أ'],
  ['15,001 – 20,000', '20%', '1,000 د.أ'],
  ['20,001 – 1,000,000', '25%', '245,000 د.أ'],
  ['أكثر من 1,000,000', '30%', 'غير محدود'],
];
const EXAMPLE_ROWS = [
  ['700 د.أ', '52.5 د.أ', 'صفر', '647.5 د.أ'],
  ['1,500 د.أ', '112.5 د.أ', 'صفر', '1,387.5 د.أ'],
  ['2,500 د.أ', '187.5 د.أ', '87.5 د.أ', '2,225 د.أ'],
  ['4,000 د.أ', '300 د.أ', '416.67 د.أ', '3,283.33 د.أ'],
];

const TOC_ITEMS = [
  ['jo-tax-brackets', 'الشرائح'],
  ['jo-tax-faq', 'الأسئلة الشائعة'],
];

export default function JordanIncomeTaxPage() {
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
    name: 'كيف تستخدم حاسبة ضريبة الدخل الأردن',
    description: PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-jordan-income-tax" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-jordan-income-tax" /></div>

        <article className="tool-v2-lane-article">
          <section id="jo-tax-brackets">
            <h2>شرائح ضريبة الدخل في الأردن</h2>
            <p>
              يطبّق الأردن نظام الشرائح التصاعدية على الدخل السنوي بعد خصم الإعفاءات: كل شريحة تُحتسب فقط على الجزء
              الواقع فيها، لا على الدخل كله. الشرائح أدناه وفق قانون ضريبة الدخل رقم 34 لسنة 2014 وتعديلاته.
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الدخل السنوي الخاضع (د.أ)</th><th>المعدل</th><th>الضريبة القصوى عن الشريحة</th></tr></thead>
                <tbody>{BRACKET_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>

            <div className="tool-v2-plain-block">
              <h3>مساهمة وطنية إضافية على الدخل المرتفع</h3>
              <p>فوق الشرائح أعلاه، يُفرض 1% إضافي (مساهمة وطنية) على الجزء من الدخل السنوي الخاضع الذي يتجاوز 200,000 دينار. هذا لا يؤثر عملياً إلا على شريحة صغيرة من أصحاب الدخل المرتفع جداً.</p>
            </div>
            <div className="tool-v2-plain-block">
              <h3>الإعفاءات: لماذا لا يدفع كثيرون ضريبة دخل فعلياً</h3>
              <p>كل مكلف مقيم يحصل على إعفاء شخصي أساسي 9,000 دينار سنوياً. إذا كان لديك معالون (زوج أو أبناء) يُضاف إعفاء آخر 9,000 دينار — أي 18,000 دينار إعفاء قبل أي ضريبة. يمكن أيضاً المطالبة بإعفاءات إضافية (طبي/تعليم/سكن) حتى 5,000 دينار، لكن السقف الكلي لأي عائلة 23,000 دينار. هذا يعني أن راتباً شهرياً حتى نحو 1,500 دينار (لمن لديه معالون) قد لا يدفع أي ضريبة دخل فعلياً.</p>
            </div>

            <div className="tool-v2-mini-block-head"><span>أمثلة عملية لرواتب شائعة (مع إعفاء معالين وضمان اجتماعي 7.5%)</span></div>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الراتب الشهري</th><th>ضمان اجتماعي شهري</th><th>ضريبة شهرية</th><th>صافي الراتب</th></tr></thead>
                <tbody>{EXAMPLE_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-jordan-income-tax" />

          <section id="jo-tax-faq">
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
            <section id="jo-tax-sources">
              <h2>المراجع الرسمية</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><JordanIncomeTaxCalculator /></div>
        </div>
      </div>
    </main>
  );
}
