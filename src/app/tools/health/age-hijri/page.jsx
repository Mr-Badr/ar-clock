import Link from 'next/link';

import AgeHijriTool from '@/components/calculators/age/AgeHijriTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'hijri');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'كم عمري بالهجري؟', answer: 'أدخل تاريخ ميلادك بالميلادي أو الهجري، وستعرض الصفحة عمرك الميلادي وعمرك الهجري التقريبي مع تاريخ الميلاد بالتقويمين والفرق التراكمي بينهما.' },
  { question: 'لماذا يكون العمر الهجري أكبر من الميلادي غالباً؟', answer: 'لأن السنة الهجرية قمرية وأقصر من السنة الميلادية بنحو 10 إلى 11 يوماً. مع مرور السنوات يتراكم هذا الفرق، فيظهر العمر المحسوب بالسنوات الهجرية أكبر قليلاً.' },
  { question: 'هل أبدأ بتاريخ ميلادي أم هجري؟', answer: 'ابدأ بالتاريخ المكتوب في الوثيقة أو المصدر الذي تثق به. إذا كان تاريخك هجرياً فأدخله هجرياً، وإذا كان ميلادياً فأدخله ميلادياً، ثم اقرأ النتيجتين معاً.' },
  { question: 'هل العمر الهجري يصلح لكل المعاملات الرسمية؟', answer: 'ليس دائماً. بعض الجهات تعتمد الميلادي وبعضها يعتمد الهجري أو تقويماً محدداً مثل أم القرى. استخدم الحاسبة للفهم، ثم راجع الجهة التي تطلب العمر قبل قرار رسمي.' },
];
const decisionRows = [
  ['تاريخي مكتوب بالميلادي', 'أدخل الميلادي أولاً', 'اقرأ العمر الميلادي كأصل، ثم استخدم الهجري للمقارنة أو المناسبات.'],
  ['تاريخي مكتوب بالهجري', 'أدخل الهجري أولاً', 'مفيد للوثائق العائلية أو السياقات الخليجية والدينية التي تبدأ بالهجري.'],
  ['أريد فهم الفرق', 'اقرأ الفرق التراكمي', 'العمر الهجري أكبر غالباً لأن السنة الهجرية أقصر، وليس لأن تاريخك تغيّر.'],
  ['أحتاج النتيجة لجهة رسمية', 'راجع تقويم الجهة', 'لا تفترض التقويم المطلوب. بعض الجهات تعتمد الميلادي وبعضها الهجري أو أم القرى.'],
];
const methodItems = [
  { title: 'نحوّل التاريخ أولاً', content: 'إذا أدخلت تاريخاً هجرياً، تحوّله الصفحة داخلياً إلى تاريخ ميلادي قابل للمقارنة. وإذا أدخلت تاريخاً ميلادياً، تعرض مقابله الهجري عندما يكون التحويل مدعوماً.' },
  { title: 'نحسب الفترة نفسها بطريقتين', content: 'أنت لم تعش فترتين مختلفتين؛ الفرق أن السنة الهجرية أقصر من الميلادية. لذلك عند تقسيم الفترة نفسها على سنوات أقصر يظهر عدد السنوات الهجرية أعلى.' },
  { title: 'الفارق يتراكم مع العمر', content: 'في السنوات الأولى يكون الفرق صغيراً، ثم يكبر تدريجياً. كلما زاد العمر، تراكمت أيام الفرق بين التقويمين حتى يظهر فرق أكبر في عدد السنوات الهجرية.' },
  { title: 'التقويم الرسمي قد يختلف', content: 'بعض الاستخدامات تعتمد تقويم أم القرى أو لوائح محلية محددة. لذلك يجب التحقق من الجهة الرسمية عند استخدام العمر في رخصة، أهلية، عقد، أو إجراء حكومي.' },
];
const sourceLinks = [
  { href: 'https://praycalc.org/hijri', title: 'PrayCalc: التقويم الهجري القمري' },
  { href: 'https://www.ummulqura.org.sa/', title: 'تقويم أم القرى' },
  { href: '/date/converter', title: 'محول التاريخ داخل الموقع' },
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
  ['hijri-decision', 'متى تستخدم الميلادي ومتى تستخدم الهجري؟'],
  ['hijri-method', 'لماذا يظهر العمر الهجري أكبر؟'],
  ['hijri-faq', 'الأسئلة الشائعة'],
  ['hijri-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'birth-day', 'difference', 'countdown']);

export default function AgeHijriPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيفية حساب العمر بالهجري والميلادي',
    description: 'خطوات حساب العمر بالتقويم الهجري والميلادي وفهم الفرق بينهما.',
    step: [
      { '@type': 'HowToStep', name: 'اختر التقويم الذي تعرفه', text: 'ابدأ بالميلادي إذا كان تاريخك ميلادياً، أو بالهجري إذا كان التاريخ مكتوباً هجرياً.' },
      { '@type': 'HowToStep', name: 'أدخل اليوم والشهر والسنة', text: 'اكتب التاريخ كاملاً حتى تستطيع الصفحة تحويله واحتساب العمرين بوضوح.' },
      { '@type': 'HowToStep', name: 'اقرأ العمرين والفرق', text: 'قارن العمر الميلادي بالعمر الهجري، ثم راجع الفرق التراكمي وسبب ظهوره.' },
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

      <ToolTopAdSlot slotId="top-age-hijri" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-hijri" /></div>

        <article className="tool-v2-lane-article">
          <section id="hijri-decision">
            <h2>متى تستخدم الميلادي ومتى تستخدم الهجري؟</h2>
            <p>الخطأ الشائع هو اختيار التقويم الذي يعطي الرقم المرغوب. الاختيار الصحيح يبدأ من السياق والجهة التي ستقرأ النتيجة.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>الاختيار المناسب</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-hijri" />

          <section id="hijri-method">
            <h2>لماذا يظهر العمر الهجري أكبر؟</h2>
            <p>الفترة التي عشتها واحدة، لكن السنة الهجرية أقصر من الميلادية، لذلك تمر السنوات الهجرية بسرعة أكبر عند تقسيم الفترة نفسها.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="hijri-faq">
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

          <section id="hijri-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="hijri-related">
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
          <div className="tool-v2-tool-panel"><AgeHijriTool /></div>
        </div>
      </div>
    </main>
  );
}
