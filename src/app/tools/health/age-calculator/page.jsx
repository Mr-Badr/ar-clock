import Link from 'next/link';

import AgeCalculatorTool from '@/components/calculators/age/AgeCalculatorTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { AGE_COMMON_FAQ } from '@/lib/calculators/age-data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'age-calculator');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'كيف أعرف كم عمري الان بدقة؟', answer: 'أدخل تاريخ ميلادك كما هو في الوثيقة، وستحسب الصفحة عمرك الحالي بالسنوات والأشهر والأيام، ثم تعرض إجمالي الأيام والساعات والثواني وموعد عيد الميلاد القادم.' },
  { question: 'هل الحاسبة تعرض كم يوم عشت؟', answer: 'نعم. لا تكتفي الصفحة بعدد السنوات، بل تعرض أيضاً الأيام والساعات والدقائق والثواني حتى تصل إلى جواب أوضح وأكثر فائدة.' },
  { question: 'هل يمكن حساب العمر في تاريخ محدد؟', answer: 'حالياً تحسب الصفحة عمرك حتى اليوم مباشرة. إذا أردت عمرك في تاريخ سابق أو قادم محدد استخدم حاسبة فرق العمر أو عداد عيد الميلاد حسب سؤالك.' },
  { question: 'هل أستطيع معرفة العمر الهجري؟', answer: 'تعرض الصفحة تقديراً للعمر الهجري وتاريخ الميلاد الهجري عندما يكون التحويل مدعوماً. وللمقارنة الأعمق بين التقويمين افتح حاسبة العمر الهجري المتخصصة.' },
];
const decisionRows = [
  ['أريد جواب "كم عمري؟" فقط', 'اقرأ العمر الكامل', 'ابدأ بالسنوات والأشهر والأيام لأنها الصيغة التي يفهمها الناس أكثر من إجمالي الأيام.'],
  ['أريد كم يوم عشت أو عمري بالساعات', 'اقرأ الوحدات التراكمية', 'استخدم إجمالي الأيام والساعات للفضول والمشاركة، لا للوثائق الرسمية.'],
  ['أريد العمر بالهجري أيضاً', 'افتح حاسبة العمر الهجري', 'هذه الصفحة تعطيك تقديراً سريعاً، والحاسبة المتخصصة تشرح الفرق التراكمي بالتفصيل.'],
  ['أحتاج النتيجة لنموذج أو جهة رسمية', 'احتفظ بتاريخ الميلاد الأصلي', 'استخدم الحاسبة للقراءة، ثم راجع التقويم والصيغة المطلوبة لدى الجهة المعنية.'],
];
const methodItems = [
  { title: 'العمر التفصيلي أولاً', content: 'تبدأ النتيجة بالعمر الكامل بالسنوات والأشهر والأيام بدل الاكتفاء بعدد السنوات فقط، وهو ما يجعل الحساب أدق عند المقارنة بين تواريخ قريبة.' },
  { title: 'الوحدات التراكمية بعد ذلك', content: 'بعد الحساب الأساسي تعرض الصفحة مجموع الأيام والساعات حتى ترى عمرك من أكثر من زاوية واضحة وممتعة.' },
  { title: 'عيد الميلاد القادم', content: 'تُظهر الصفحة عدد الأيام المتبقية حتى عيد ميلادك القادم ونسبة تقدمك بين آخر عيد والعيد القادم.' },
  { title: 'العمر الهجري تقريبي دائماً', content: 'الرقم المعروض هنا تقدير سريع. للفرق التراكمي الدقيق وشرح السبب افتح حاسبة العمر الهجري المتخصصة.' },
];
const sourceLinks = [
  { href: 'https://aa.usno.navy.mil/faq/leap_years', title: 'US Naval Observatory: السنوات الكبيسة' },
  { href: '/date/converter', title: 'محول التاريخ داخل الموقع' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: [...quickAnswers, ...AGE_COMMON_FAQ],
});

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PATH}`,
});

const TOC_ITEMS = [
  ['calculator-decision', 'أي جزء من النتيجة تحتاجه فعلاً؟'],
  ['calculator-method', 'كيف تحسب الصفحة عمرك؟'],
  ['calculator-faq', 'الأسئلة الشائعة'],
  ['calculator-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['hijri', 'difference', 'countdown', 'milestones']);

export default function AgeCalculatorPage() {
  const schemaFaqItems = [...quickAnswers, ...AGE_COMMON_FAQ];
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: schemaFaqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيفية استخدام حاسبة العمر',
    description: 'خطوات سريعة لمعرفة عمرك الحالي بالسنوات والأشهر والأيام مع إجمالي الأيام وعيد الميلاد القادم.',
    step: [
      { '@type': 'HowToStep', name: 'أدخل تاريخ الميلاد', text: 'اختر اليوم والشهر والسنة كما تظهر في الوثيقة أو التاريخ الذي تعتمد عليه، بالميلادي أو الهجري.' },
      { '@type': 'HowToStep', name: 'اقرأ العمر الكامل أولاً', text: 'ابدأ بالسنوات والأشهر والأيام، ثم انتقل إلى إجمالي الأيام والساعات إذا أردت قراءة تفصيلية.' },
      { '@type': 'HowToStep', name: 'راجع عيد الميلاد والتحويل', text: 'انظر إلى عيد الميلاد القادم والعمر الهجري التقريبي، ثم استخدم حاسبة الهجري المتخصصة عند الحاجة.' },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema([
        { name: 'الرئيسية', href: '/' }, { name: 'الأدوات', href: '/tools' }, { name: 'الصحة والعمر', href: '/tools/health' }, { name: PAGE.title, href: PATH },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: PAGE.title, description, path: PATH })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-age-calculator" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="calculator-decision">
            <h2>أي جزء من النتيجة تحتاجه فعلاً؟</h2>
            <p>النتيجة الواحدة تحتوي عدة قراءات. اختر القراءة المناسبة للسؤال حتى لا تستخدم رقم الأيام مثلاً في سياق يحتاج العمر الكامل.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>الجزء الذي تقرؤه</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-calculator" />

          <section id="calculator-method">
            <h2>كيف تحسب الصفحة عمرك؟</h2>
            <p>أفضل طريقة لاستخدام حاسبة العمر هي إدخال تاريخ الميلاد كما هو في الوثيقة الأصلية، ثم قراءة النتيجة التفصيلية لا رقم السنوات فقط.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="calculator-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {schemaFaqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="calculator-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="calculator-related">
            <h2>أدوات أخرى للعمر والوقت</h2>
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
          <div className="tool-v2-tool-panel"><AgeCalculatorTool /></div>
        </div>
      </div>
    </main>
  );
}
