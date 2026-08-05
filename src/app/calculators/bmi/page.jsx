import Link from 'next/link';

import '@/app/tools/tools-v2.css';
import BMICalculator from '@/components/calculators/BMICalculator.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'bmi');
const CONTENT = getFinancePageContent('bmi');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const BMI_CLASSIFICATION_ROWS = [
  ['نقص حاد في الوزن', 'أقل من 16.0', 'مرتفع جداً', 'يستوجب تقييماً طبياً عاجلاً'],
  ['نقص في الوزن', '16.0 – 18.4', 'مرتفع', 'استشارة تغذية وتقييم صحي'],
  ['وزن طبيعي', '18.5 – 24.9', 'منخفض', 'حافظ على نمط حياتك الصحي'],
  ['زيادة وزن', '25.0 – 29.9', 'منخفض – متوسط', 'تحسين النشاط البدني والنظام الغذائي'],
  ['سمنة درجة أولى', '30.0 – 34.9', 'متوسط – مرتفع', 'متابعة طبية ونظام غذائي منظم'],
  ['سمنة درجة ثانية', '35.0 – 39.9', 'مرتفع', 'تدخل طبي مبكر ضروري'],
  ['سمنة مفرطة درجة ثالثة', '40.0 فأكثر', 'مرتفع جداً', 'متابعة طبية متخصصة'],
];
const BMI_WAIST_ROWS = [
  ['الرجال', 'أقل من 94 سم', '94 – 102 سم', 'أكثر من 102 سم'],
  ['النساء', 'أقل من 80 سم', '80 – 88 سم', 'أكثر من 88 سم'],
];
const BMI_TDEE_ROWS = [
  ['خامل', 'لا رياضة أو نادراً', '× 1.2', 'مكتب + جلوس معظم اليوم'],
  ['خفيف', 'رياضة خفيفة 1-3 أيام/أسبوع', '× 1.375', 'مشي يومي + بعض التمارين'],
  ['متوسط', 'رياضة معتدلة 3-5 أيام/أسبوع', '× 1.55', 'رياضة منتظمة + نشاط يومي'],
  ['مرتفع', 'تمارين شاقة 6-7 أيام/أسبوع', '× 1.725', 'رياضي + عمل بدني'],
  ['مكثف جداً', 'تدريب مكثف يومي + عمل بدني شاق', '× 1.9', 'لاعب محترف أو عامل بناء'],
];
const BMI_GUIDE_ITEMS = [
  { title: 'BMI أقل من 18.5 — نقص وزن', desc: 'ماذا يعني ذلك؟', text: 'قد يدل على نقص تغذية أو مشكلة صحية خفية. استشر طبيبك أو أخصائي تغذية لفهم الأسباب ووضع خطة تغذية مناسبة. الهدف دائماً المدى الصحي وليس الرقم بحد ذاته.' },
  { title: 'BMI 18.5–24.9 — الوزن الطبيعي', desc: 'النطاق الصحي للبالغين.', text: 'هذا هو النطاق الذي تشير الدراسات إلى أقل خطر إصابة بالأمراض المزمنة. الحفاظ عليه يحتاج توازناً بين السعرات الواردة والمصروفة مع نشاط بدني منتظم.' },
  { title: 'BMI 25–29.9 — زيادة بسيطة', desc: 'ليس خطراً فورياً.', text: 'كثير من الأشخاص في هذا النطاق أصحاء تماماً. العامل الأهم هو محيط الخصر ونمط الحياة. أنسب من الهدف الرقمي: إضافة 30 دقيقة مشي يومياً وتقليل السكريات.' },
  { title: 'BMI ≥ 30 — السمنة', desc: 'يستدعي الانتباه الطبي.', text: 'السمنة مرتبطة بمخاطر صحية مركبة. لكن المؤشر وحده لا يكفي — بعض الرياضيين لديهم BMI عالٍ من العضلات. الأفضل: تقييم شامل مع قياس نسبة الدهون ومحيط الخصر.' },
];

const TOC_ITEMS = [
  ['bmi-classification', 'جدول تصنيف BMI'],
  ['bmi-guide', 'ماذا يخبرك BMI؟'],
  ['bmi-waist', 'محيط الخصر'],
  ['bmi-tdee', 'السعرات اليومية'],
  ['bmi-faq', 'الأسئلة الشائعة'],
];

export default function BMIPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
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

      <ToolTopAdSlot slotId="top-bmi" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-bmi" /></div>

        <article className="tool-v2-lane-article">
          <section id="bmi-classification">
            <h2>جدول تصنيف BMI وفق منظمة الصحة العالمية</h2>
            <p>هذه التصنيفات معتمدة دولياً للبالغين فوق 18 سنة. الأطفال والمراهقون لهم جدول مختلف يعتمد على العمر والجنس.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>تصنيف الوزن</th><th>نطاق BMI</th><th>مستوى الخطر الصحي</th><th>التوصية</th></tr></thead>
                <tbody>{BMI_CLASSIFICATION_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
            <p className="tool-v2-option-hint">المصدر: منظمة الصحة العالمية (WHO). BMI وحده لا يكفي للتشخيص الطبي — استشر طبيبك لتقييم شامل.</p>
          </section>

          <ToolInArticleAd slotId="mid-bmi" />

          <section id="bmi-guide">
            <h2>ماذا يخبرك BMI وما لا يخبرك به؟</h2>
            <p>مؤشر كتلة الجسم أداة للفرز الأولي وليس تشخيصاً — إليك ما وراء الرقم.</p>
            <div className="tool-v2-info-grid">
              {BMI_GUIDE_ITEMS.map((item) => (
                <div className="tool-v2-info-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <div className="tool-v2-info-desc">{item.desc}</div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="bmi-waist">
            <h2>محيط الخصر — المؤشر الذي يكمل BMI</h2>
            <p>دهون البطن (الدهون الحشوية) أكثر خطورة من الدهون الكلية. محيط الخصر يكشف هذا الخطر بدقة أكبر من BMI.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الجنس</th><th>ضمن الطبيعي</th><th>خطر مرتفع</th><th>خطر مرتفع جداً</th></tr></thead>
                <tbody>{BMI_WAIST_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="tool-v2-plain-block">
              <h3>كيف تقيس محيط الخصر بدقة؟</h3>
              <p>استخدم شريط قياس مرن. قس في المستوى الأفقي على ارتفاع منتصف المسافة بين آخر ضلع وعظمة الحوض. قِس بعد زفير طبيعي وبدون شد البطن. القياس الصباحي قبل الأكل أكثر دقة.</p>
            </div>
            <div className="tool-v2-plain-block">
              <h3>لماذا دهون البطن خطيرة بشكل خاص؟</h3>
              <p>الدهون الحشوية (المحيطة بالأعضاء الداخلية) تُفرز مواد التهابية ترفع خطر السكري النوع الثاني وأمراض القلب والشرايين. شخص بـ BMI طبيعي لكن خصر واسع قد يكون أكثر خطورة من شخص بـ BMI مرتفع قليلاً مع توزيع صحي للدهون.</p>
            </div>
          </section>

          <section id="bmi-tdee">
            <h2>جدول السعرات الحرارية اليومية حسب مستوى النشاط</h2>
            <p>معادلة Mifflin-St Jeor المعتمدة من الجمعية الأمريكية للتغذية — اضرب الحصيلة الأساسية في معامل النشاط المناسب.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>مستوى النشاط</th><th>وصف النشاط</th><th>معامل النشاط (TDEE)</th><th>مثال</th></tr></thead>
                <tbody>{BMI_TDEE_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
            <p className="tool-v2-option-hint">رجل: (10 × الوزن كجم) + (6.25 × الطول سم) − (5 × العمر) + 5 | امرأة: نفس المعادلة − 161 | ثم اضرب في معامل النشاط.</p>
          </section>

          <section id="bmi-official">
            <h2>معلومات طبية موثوقة حول الوزن الصحي</h2>
            <p>للمزيد من المعلومات الطبية الموثوقة حول تصنيفات BMI وخطط الوزن الصحي، ارجع إلى منظمة الصحة العالمية أو وزارة الصحة في دولتك.</p>
            <ul>
              <li><a href="https://www.who.int/ar/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noreferrer">WHO — السمنة والوزن الزائد</a></li>
              <li><a href="https://www.moh.gov.sa/HealthAwareness/Campaigns/Healthy_Weight/Pages/default.aspx" target="_blank" rel="noreferrer">وزارة الصحة السعودية — الوزن الصحي</a></li>
            </ul>
          </section>

          <section id="bmi-faq">
            <h2>ما الذي يريد معرفته الجميع عن BMI والوزن المثالي</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="bmi-embed">
            <h2>أضف الحاسبة إلى موقعك</h2>
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/bmi`}
              title="حاسبة مؤشر كتلة الجسم"
              hint="هل تدير موقعاً أو منتدى؟ أضف حاسبة مؤشر كتلة الجسم إليه مجاناً بنسخ الكود التالي:"
              width={360}
              height={420}
            />
          </section>

          <section id="bmi-sources">
            <h2>مصادر</h2>
            <ul>{(CONTENT.sources || []).map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="bmi-related">
            <h2>حاسبات صحية أخرى</h2>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {['calories', 'fasting', 'ovulation'].map((slug) => {
                const tool = CALCULATOR_ROUTES.find((item) => item.slug === slug);
                if (!tool) return null;
                return (
                  <Link key={slug} href={tool.href}>
                    <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                    {tool.shortLabel || tool.title}
                  </Link>
                );
              })}
            </nav>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><BMICalculator /></div>
        </div>
      </div>
    </main>
  );
}
