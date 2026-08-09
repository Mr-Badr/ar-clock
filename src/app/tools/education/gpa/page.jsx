import '@/app/tools/tools-v2.css';
import GpaCalculator from '@/components/calculators/GpaCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gpa');
const CONTENT = getFinancePageContent('gpa');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const GPA_EXPLAINER = [
  { title: 'المعدل المرجّح — لماذا الساعات مهمة', desc: 'مادة بـ3 ساعات تؤثر أكثر من مادة بساعتين', text: 'المعدل التراكمي ليس متوسطاً بسيطاً للدرجات. كل مادة تُضرب درجتها في عدد ساعاتها المعتمدة، ثم يُقسَّم المجموع على إجمالي الساعات. هذا يعني أن مادة صعبة بـ4 ساعات تؤثر في معدلك أكثر من مادة اختيارية بساعة واحدة.' },
  { title: 'خطة رفع المعدل — اعرف الرقم قبل الفصل', desc: 'ما الدرجة المطلوبة لأصل إلى هدفي؟', text: 'ميزة "خطة رفع المعدل" تحسب الدرجة الوسطى المطلوبة في الفصل القادم للوصول إلى معدل بعينه. أدخل معدلك الحالي وساعاتك المجتازة، ثم حدد الهدف وساعات الفصل القادم — وستعرف فوراً إذا كان هدفك قابلاً للتحقيق.' },
  { title: 'أنظمة التقييم المختلفة في الجامعات العربية', desc: 'من 5 (خليجي) ومن 4 (دولي) ومن 100 (مئوي)', text: 'معظم الجامعات السعودية والخليجية تعتمد نظام من 5. الجامعات ذات المنهج الأمريكي أو الكندي تستخدم من 4. الجامعات المصرية والمغربية وبعض الأردنية والسورية تعتمد النسبة المئوية من 100. التحويل بين الأنظمة تقريبي — لا يُعتمد للتوثيق الرسمي دون شهادة رسمية.' },
  { title: 'الحد الأدنى للمنح والدراسات العليا', desc: 'ما المعدل الكافي للتقديم؟', text: 'معظم منح الدراسات العليا في الخليج والغرب تشترط 3.5 من 5 أو 2.8 من 4 كحد أدنى. برامج الطب والقانون عادةً 4.0 من 5. برامج الدراسات العليا الأكاديمية (ماجستير/دكتوراه) تطلب 4.0–4.5 من 5 أو ما يعادله. راجع المتطلبات الدقيقة في موقع الجامعة أو الجهة الممنوحة.' },
];
const SCALE_COMPARISON_ROWS = [
  ['ممتاز', '4.75–5.0', '3.67–4.0', '90–100', 'Excellent'],
  ['جيد جداً', '3.75–4.74', '3.33–3.66', '80–89', 'Very Good'],
  ['جيد', '2.75–3.74', '3.0–3.32', '70–79', 'Good'],
  ['مقبول', '2.0–2.74', '2.0–2.99', '60–69', 'Pass'],
  ['راسب', 'أقل من 2', 'أقل من 2', 'أقل من 60', 'Fail'],
];
const CONVERSION_ROWS = [
  ['5.0', '4.0', '100', 'أعلى درجة'],
  ['4.75', '3.8', '95', 'ممتاز'],
  ['4.5', '3.6', '90', 'جيد جداً+'],
  ['4.0', '3.2', '80', 'جيد جداً'],
  ['3.5', '2.8', '70', 'جيد'],
  ['2.5', '2.0', '60', 'مقبول'],
];

const TOC_ITEMS = [
  ['gpa-how', 'كيف يُحسب المعدل'],
  ['gpa-classifications', 'جدول التصنيفات'],
  ['gpa-convert', 'تحويل المعدل'],
  ['gpa-faq', 'الأسئلة الشائعة'],
];

export default function GpaPage() {
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
    description: PAGE.description, about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-gpa" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-gpa" /></div>

        <article className="tool-v2-lane-article">
          <section id="gpa-how">
            <h2>المعدل المرجّح والخطة — كيف تعمل الحاسبة</h2>
            <p>الحاسبة لا تجمع الدرجات وتقسمها — تأخذ وزن كل مادة بساعاتها للوصول إلى المعدل الدقيق.</p>
            <div className="tool-v2-info-grid">
              {GPA_EXPLAINER.map((item) => (
                <div className="tool-v2-info-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <div className="tool-v2-info-desc">{item.desc}</div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolInArticleAd slotId="mid-gpa" />

          <section id="gpa-classifications">
            <h2>تصنيفات المعدل في الأنظمة الثلاثة</h2>
            <p>جدول مقارن يظهر ما يقابل تصنيف "ممتاز" و"جيد جداً" وغيرها في كل نظام.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>التصنيف</th><th>من 5 (خليجي)</th><th>من 4 (دولي)</th><th>من 100 (مئوي)</th><th>بالإنجليزية</th></tr></thead>
                <tbody>{SCALE_COMPARISON_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td dir="ltr">{row[1]}</td><td dir="ltr">{row[2]}</td><td dir="ltr">{row[3]}</td><td>{row[4]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <section id="gpa-convert">
            <h2>جدول تحويل المعدل بين الأنظمة (تقريبي)</h2>
            <p>استخدم هذا الجدول كمرجع أولي — التحويل الرسمي يستلزم وثيقة من مكتب اعتماد رسمي.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>من 5</th><th>التقريب من 4</th><th>التقريب من 100</th><th>ملاحظة</th></tr></thead>
                <tbody>{CONVERSION_ROWS.map((row) => (<tr key={row[0]}><td dir="ltr">{row[0]}</td><td dir="ltr">{row[1]}</td><td dir="ltr">{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
            <p className="tool-v2-option-hint">* هذا التحويل تقريبي بمعادلة النسبة البسيطة. لأغراض القبول والمنح استخدم أداة WES أو وثيقة اعتماد رسمية.</p>
          </section>

          <section id="gpa-faq">
            <h2>أسئلة عن حساب المعدل التراكمي</h2>
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
            <section id="gpa-sources">
              <h2>مصادر</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><GpaCalculator /></div>
        </div>
      </div>
    </main>
  );
}
