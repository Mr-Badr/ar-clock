import Link from 'next/link';

import RetirementAgeTool from '@/components/calculators/age/RetirementAgeTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'retirement');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'متى أتقاعد تقريباً؟', answer: 'أدخل تاريخ ميلادك واختر الدولة والقطاع، وستعرض الحاسبة تاريخاً تقريبياً لبلوغ سن التقاعد المستخدم في النموذج والمدة المتبقية حتى ذلك التاريخ.' },
  { question: 'هل هذه الحاسبة تحسب راتب التقاعد؟', answer: 'لا. هذه الصفحة تحسب موعداً زمنياً تقريبياً فقط. لا تحسب المعاش، الاشتراكات، سنوات الخدمة، التقاعد المبكر، الخصومات، أو الاستثناءات.' },
  { question: 'هل النتيجة رسمية؟', answer: 'لا. النتيجة مرجع أولي للتخطيط. سن التقاعد الفعلي قد يتغير حسب النظام، تاريخ الاشتراك، سنوات الخدمة، القطاع، والجنس، لذلك يجب مراجعة الجهة الرسمية في بلدك.' },
  { question: 'متى تكون الحاسبة مفيدة؟', answer: 'تفيد عندما تريد تصوراً سريعاً للأفق الزمني: كم سنة تقريباً أمامك؟ متى تبدأ التخطيط؟ وما المسار الرسمي الذي يجب أن تراجعه بعد ذلك؟' },
];
const decisionRows = [
  ['أريد موعداً زمنياً سريعاً', 'موعد بلوغ سن التقاعد', 'استخدم النتيجة لتقدير الإطار الزمني فقط، لا لحساب الاستحقاق.'],
  ['أريد راتب التقاعد', 'ليست هذه الصفحة', 'تحتاج جهة التأمينات/المعاشات لأنها تعرف الاشتراكات والراتب وسنوات الخدمة.'],
  ['أفكر في التقاعد المبكر', 'راجع النظام الرسمي', 'التقاعد المبكر يتأثر بسنوات الخدمة والاشتراك والخصومات والاستثناءات.'],
  ['أحتاج قراراً نهائياً', 'رابط الجهة الرسمية', 'استخدم الحاسبة كبداية ثم تحقق من الجهة المختصة قبل أي قرار مالي أو وظيفي.'],
];
const methodItems = [
  { title: 'نبدأ بتاريخ الميلاد', content: 'تقرأ الحاسبة تاريخ ميلادك وتحسب عمرك الحالي، ثم تضيف سن التقاعد المستخدم في النموذج لتقدير تاريخ بلوغ ذلك السن.' },
  { title: 'نختار قاعدة الدولة والقطاع', content: 'القطاع الحكومي أو الخاص أو العسكري قد يستخدم سن تقاعد مختلفاً. لذلك لا يكفي إدخال تاريخ الميلاد وحده، بل يجب اختيار السياق الأقرب لحالتك.' },
  { title: 'النتيجة لا تعرف سجل خدمتك', content: 'الحاسبة لا تعرف تاريخ بداية العمل، عدد سنوات الاشتراك، الانقطاعات، الراتب، أو الاستثناءات. هذه العناصر لا تظهر إلا لدى جهة التقاعد أو التأمينات.' },
  { title: 'التحقق الرسمي هو الخطوة التالية', content: 'إذا قرب موعد التقاعد أو كنت تفكر في ترك العمل مبكراً، انتقل من هذه القراءة الأولية إلى بوابة الجهة الرسمية أو مستشار مختص.' },
];
const sourceLinks = [
  { href: 'https://www.gosi.gov.sa/', title: 'المؤسسة العامة للتأمينات الاجتماعية - السعودية' },
  { href: 'https://gpssa.gov.ae/', title: 'الهيئة العامة للمعاشات والتأمينات الاجتماعية - الإمارات' },
  { href: 'https://www.ssc.gov.jo/', title: 'المؤسسة العامة للضمان الاجتماعي - الأردن' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: quickAnswers,
});

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PATH}`,
});

const TOC_ITEMS = [
  ['retirement-decision', 'هل تبحث عن موعد أم معاش أم أهلية؟'],
  ['retirement-method', 'كيف تقدّر الصفحة موعد التقاعد؟'],
  ['retirement-faq', 'الأسئلة الشائعة'],
  ['retirement-sources', 'مصادر رسمية'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'hijri', 'difference', 'countdown']);

export default function RetirementPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيفية تقدير موعد التقاعد',
    description: 'خطوات تقدير تاريخ بلوغ سن التقاعد حسب تاريخ الميلاد والدولة والقطاع.',
    step: [
      { '@type': 'HowToStep', name: 'أدخل تاريخ الميلاد', text: 'اختر تاريخ ميلادك حتى تحسب الصفحة عمرك الحالي.' },
      { '@type': 'HowToStep', name: 'اختر الدولة والقطاع', text: 'حدد الدولة والقطاع والجنس لأن سن التقاعد قد يختلف بين الأنظمة.' },
      { '@type': 'HowToStep', name: 'اقرأ النتيجة كتقدير أولي', text: 'راجع تاريخ التقاعد والمدة المتبقية، ثم تحقق من الجهة الرسمية قبل أي قرار.' },
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

      <ToolTopAdSlot slotId="top-age-retirement" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-retirement" /></div>

        <article className="tool-v2-lane-article">
          <section id="retirement-decision">
            <h2>هل تبحث عن موعد أم معاش أم أهلية؟</h2>
            <p>هذه الصفحة تجيب عن الموعد التقريبي فقط. إذا كان سؤالك عن المال أو الاستحقاق، فالخطوة التالية يجب أن تكون الجهة الرسمية.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>ما الذي تستخدمه؟</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-retirement" />

          <section id="retirement-method">
            <h2>كيف تقدّر الصفحة موعد التقاعد؟</h2>
            <p>الحساب هنا زمني: تاريخ ميلاد + سن تقاعد مستخدم في النموذج. لا يدخل في حساب الراتب أو الاشتراكات أو الاستثناءات.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="retirement-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {quickAnswers.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="retirement-sources">
            <h2>مصادر رسمية</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="retirement-related">
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
          <div className="tool-v2-tool-panel"><RetirementAgeTool /></div>
        </div>
      </div>
    </main>
  );
}
