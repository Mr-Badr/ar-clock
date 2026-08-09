import '@/app/tools/tools-v2.css';
import StandardDeviationCalculator from '@/components/calculators/StandardDeviationCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'standard-deviation');
const CONTENT = getFinancePageContent('standard-deviation');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const METRIC_ROWS = [
  ['الوسط الحسابي (Mean)', 'مركز البيانات — مجموع القيم ÷ عددها', 'نفس وحدة البيانات'],
  ['الوسيط (Median)', 'القيمة الوسطى بعد الترتيب — لا يتأثر بالقيم الشاذة', 'نفس وحدة البيانات'],
  ['المنوال (Mode)', 'القيمة الأكثر تكراراً', 'نفس وحدة البيانات'],
  ['المدى (Range)', 'الفرق بين أكبر وأصغر قيمة', 'نفس وحدة البيانات'],
  ['التباين (Variance)', 'متوسط مربعات الانحرافات عن الوسط', 'وحدة مربّعة'],
  ['الانحراف المعياري', 'الجذر التربيعي للتباين — مدى التشتت الفعلي', 'نفس وحدة البيانات'],
];

const TOC_ITEMS = [
  ['sd-explainer', 'ماذا يقيس الانحراف المعياري؟'],
  ['sd-faq', 'الأسئلة الشائعة'],
];

export default function StandardDeviationPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التعليم', item: `${SITE_URL}/tools/education` },
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
    name: CONTENT.howTo?.name || 'كيفية استخدام حاسبة الانحراف المعياري',
    description: PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-standard-deviation" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-standard-deviation" /></div>

        <article className="tool-v2-lane-article">
          <section id="sd-explainer">
            <h2>ماذا يقيس الانحراف المعياري فعلياً؟</h2>
            <p>
              الانحراف المعياري يخبرك بمقدار تشتت بياناتك حول وسطها الحسابي. قيمة منخفضة تعني أن أغلب القيم قريبة من
              الوسط، وقيمة مرتفعة تعني أن القيم متناثرة وبعيدة عنه. هو أكثر مقاييس التشتت استخداماً لأنه يعود بنفس
              وحدة بياناتك الأصلية — على عكس التباين الذي يبقى بوحدة مربّعة.
            </p>
            <div className="tool-v2-plain-block">
              <h3>عيّنة أم مجتمع كامل؟</h3>
              <p>
                هذا هو الخيار الذي يخلط أغلب الطلاب: إذا كانت بياناتك جزءاً من مجموعة أكبر (نتائج فصل واحد من مدرسة،
                عيّنة بحث، استبيان على مجموعة محدودة) فاستخدم صيغة <strong>العيّنة</strong> التي تقسم على n−1. إذا كانت
                بياناتك تمثّل المجتمع الإحصائي بأكمله دون استثناء، استخدم صيغة <strong>المجتمع</strong> التي تقسم على n
                مباشرة. في الغالبية العظمى من الحالات العملية — الاختبارات المدرسية، استطلاعات الرأي، القياسات
                التجريبية — الإجابة الصحيحة هي "عيّنة".
              </p>
            </div>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المقياس</th><th>ماذا يقيس</th><th>الوحدة</th></tr></thead>
                <tbody>{METRIC_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-standard-deviation" />

          <section id="sd-faq">
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
            <section id="sd-sources">
              <h2>المراجع</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><StandardDeviationCalculator /></div>
        </div>
      </div>
    </main>
  );
}
