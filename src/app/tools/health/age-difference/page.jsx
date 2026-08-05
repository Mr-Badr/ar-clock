import Link from 'next/link';

import AgeDifferenceTool from '@/components/calculators/age/AgeDifferenceTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'difference');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'كم فرق العمر بين شخصين؟', answer: 'أدخل تاريخي الميلاد وستعرض الحاسبة الفارق الكامل بالسنوات والأشهر والأيام، وتحدد الشخص الأكبر سناً وإجمالي أيام الفارق.' },
  { question: 'لماذا لا يكفي طرح سنة الميلاد من سنة الميلاد؟', answer: 'لأن الشهر واليوم يغيران النتيجة. شخصان بينهما خمس سنوات في أرقام السنوات قد يكون الفارق الحقيقي أقل أو أكثر بعدة أشهر وأيام حسب تاريخ الميلاد الكامل.' },
  { question: 'هل تصلح لفرق العمر بين الزوجين أو الإخوة؟', answer: 'نعم. الأداة تقارن أي تاريخي ميلاد: زوجين، إخوة، أصدقاء، زملاء، أو شخصيات تاريخية. لكنها تحسب الزمن فقط ولا تحكم على التوافق أو العلاقة.' },
  { question: 'هل تعرض عمر كل شخص أيضاً؟', answer: 'نعم. بعد حساب الفارق تعرض الصفحة العمر الحالي لكل شخص، حتى ترى المقارنة والفردين في نفس الشاشة.' },
];
const decisionRows = [
  ['أريد الفارق الدقيق', 'فرق العمر الكامل', 'اقرأ السنوات والأشهر والأيام معاً، ولا تكتفِ برقم السنوات.'],
  ['أريد معرفة من الأكبر', 'بطاقة الأكبر سناً', 'اقرأ الاسم أولاً ثم راجع الفارق حتى لا تعكس المقارنة.'],
  ['أريد فرق العمر بالأيام', 'إجمالي أيام الفارق', 'مفيد للمقارنات الدقيقة والمشاركة، لكنه أقل طبيعية من صيغة السنوات والأشهر.'],
  ['أريد معرفة هل نحن من الجيل نفسه', 'بطاقة الجيل', 'استخدمها كلمحة زمنية عامة لا كحكم على التفكير أو التوافق.'],
];
const methodItems = [
  { title: 'نرتب التاريخين أولاً', content: 'قبل حساب الفارق، تحدد الصفحة أي التاريخين أقدم. بعد ذلك تحسب المدة بين تاريخ الأكبر وتاريخ الأصغر، لأن الفارق يجب أن يكون موجباً ومقروءاً لا رقماً سالباً مربكاً.' },
  { title: 'نحسب السنوات الكاملة ثم الأشهر ثم الأيام', content: 'بدلاً من تحويل كل شيء إلى أيام فقط، تفك الحاسبة الفارق إلى سنوات كاملة، ثم أشهر، ثم أيام. هذا يجعل الجواب مناسباً لسؤال يومي مثل: بيننا 4 سنوات و3 أشهر و12 يوماً.' },
  { title: 'إجمالي الأيام يضيف دقة', content: 'إجمالي الأيام مفيد إذا كنت تريد رقماً دقيقاً جداً، لكنه قد يكون أقل وضوحاً في الحديث اليومي. لذلك تعرض الصفحة الصيغتين معاً: الفارق البشري وإجمالي الأيام.' },
  { title: 'العمر الحالي لكل شخص يمنع الالتباس', content: 'قد يكون الفارق بين شخصين خمس سنوات، لكن معنى ذلك يختلف إذا كانا طفلين أو بالغين. عرض عمر كل شخص يساعدك على قراءة المقارنة في سياقها الزمني الصحيح.' },
];
const sourceLinks = [
  { href: 'https://www.timeanddate.com/date/duration.html', title: 'timeanddate: المدة بين تاريخين' },
  { href: 'https://aa.usno.navy.mil/faq/leap_years', title: 'US Naval Observatory: السنوات الكبيسة' },
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
  ['difference-decision', 'أي رقم من نتيجة فرق العمر تحتاجه؟'],
  ['difference-method', 'لماذا فرق العمر ليس مجرد طرح سنة من سنة؟'],
  ['difference-faq', 'الأسئلة الشائعة'],
  ['difference-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'hijri', 'birth-day', 'countdown']);

export default function AgeDifferencePage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيفية حساب فرق العمر بين شخصين',
    description: 'خطوات حساب فرق العمر بين شخصين بالسنوات والأشهر والأيام مع تحديد الأكبر سناً.',
    step: [
      { '@type': 'HowToStep', name: 'أدخل بيانات الشخص الأول', text: 'اكتب الاسم اختيارياً، ثم أدخل تاريخ ميلاد الشخص الأول بالميلادي أو الهجري.' },
      { '@type': 'HowToStep', name: 'أدخل بيانات الشخص الثاني', text: 'أدخل تاريخ ميلاد الشخص الثاني بنفس الدقة حتى تكون المقارنة عادلة.' },
      { '@type': 'HowToStep', name: 'اقرأ الفارق ومن الأكبر', text: 'ابدأ ببطاقة فرق العمر، ثم راجع من الأكبر وإجمالي أيام الفارق وعمر كل شخص.' },
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

      <ToolTopAdSlot slotId="top-age-difference" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-difference" /></div>

        <article className="tool-v2-lane-article">
          <section id="difference-decision">
            <h2>أي رقم من نتيجة فرق العمر تحتاجه؟</h2>
            <p>فرق العمر يحتوي أكثر من قراءة. اختر الصيغة التي تخدم سؤالك حتى لا تستخدم إجمالي الأيام في سياق يحتاج صيغة بشرية أو اجتماعية.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>الجزء المناسب</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-difference" />

          <section id="difference-method">
            <h2>لماذا فرق العمر ليس مجرد طرح سنة من سنة؟</h2>
            <p>الشهور وأطوالها والسنوات الكبيسة تجعل الحساب اليدوي عرضة للخطأ. لذلك تعتمد الصفحة على التاريخ الكامل لا سنة الميلاد وحدها.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="difference-faq">
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

          <section id="difference-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="difference-related">
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
          <div className="tool-v2-tool-panel"><AgeDifferenceTool /></div>
        </div>
      </div>
    </main>
  );
}
