import '@/app/tools/tools-v2.css';
import DubaiCompanySetupCalculator from '@/components/calculators/DubaiCompanySetupCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'dubai-company-setup-cost');
const CONTENT = getFinancePageContent('dubai-company-setup-cost');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const COMPARE_ROWS = [
  ['التكلفة الأولية', '15,000 – 50,000+ د.إ', '7,500 – 25,000 د.إ'],
  ['ملكية أجنبية', '100% (منذ 2021)', '100%'],
  ['التداول داخل الإمارات', '✅ مباشر', '❌ عبر وكيل محلي أو وكيل توزيع'],
  ['متطلبات المكتب', 'عقد إيجار رسمي عادةً', 'فليكسي ديسك يكفي في أغلب المناطق'],
  ['سرعة التأسيس', '3 – 7 أيام عمل', '1 – 3 أيام عمل'],
  ['التأشيرات المتاحة', 'غير محدود (حسب المساحة)', 'محددة بكوتة المنطقة الحرة'],
  ['الضريبة على الأرباح', '9% على الربح > 375K د.إ', 'معفى في أغلب المناطق الحرة'],
];
const FREE_ZONE_ROWS = [
  ['DMCC (مركز تجارة السلع)', 'تجارة، ذهب، مواد خام', '18,000 – 50,000'],
  ['DIFC (مركز دبي المالي)', 'مالية، تأمين، قانون', '25,000 – 100,000+'],
  ['Dubai Internet City', 'تقنية، برمجيات، ابتكار', '15,000 – 40,000'],
  ['Jebel Ali (JAFZA)', 'لوجستيات، صناعة، تصدير', '20,000 – 60,000'],
  ['SPC Free Zone (شارجة)', 'عموماً — الأرخص في المنطقة', '5,750 – 15,000'],
];

const TOC_ITEMS = [
  ['dubai-setup-compare', 'براً أم منطقة حرة'],
  ['dubai-setup-faq', 'الأسئلة الشائعة'],
];

export default function DubaiCompanySetupCostPage() {
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
    name: 'كيف تستخدم حاسبة تكلفة تأسيس شركة في دبي',
    description: PAGE.description,
    step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-dubai-company-setup-cost" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-dubai-company-setup-cost" /></div>

        <article className="tool-v2-lane-article">
          <section id="dubai-setup-compare">
            <h2>براً مقابل المنطقة الحرة — أيهما يناسبك؟</h2>
            <p>
              أكبر قرار عند تأسيس شركة في دبي هو اختيار الجهة: <strong>الترخيص البري (DED)</strong> الذي يمنحك حرية
              التعامل مع أي عميل في الإمارات، أو <strong>المنطقة الحرة</strong> التي تتيح ملكية أجنبية 100% وإجراءات
              أسرع وتكلفة أقل في الغالب.
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المعيار</th><th>براً (Mainland)</th><th>منطقة حرة (Free Zone)</th></tr></thead>
                <tbody>{COMPARE_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="tool-v2-mini-block-head"><span>أشهر المناطق الحرة في دبي</span></div>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المنطقة الحرة</th><th>الأنسب لـ</th><th>نطاق الرخصة (د.إ/سنة)</th></tr></thead>
                <tbody>{FREE_ZONE_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-dubai-company-setup-cost" />

          <section id="dubai-setup-faq">
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
            <section id="dubai-setup-sources">
              <h2>المراجع الرسمية</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><DubaiCompanySetupCalculator /></div>
        </div>
      </div>
    </main>
  );
}
