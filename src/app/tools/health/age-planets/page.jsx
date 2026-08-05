import Link from 'next/link';

import AgePlanetsTool from '@/components/calculators/age/AgePlanetsTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'planets');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'كم عمري على المريخ؟', answer: 'تحسب الصفحة عدد الأيام التي عشتها على الأرض، ثم تقسمها على طول السنة المريخية. لأن سنة المريخ أطول من السنة الأرضية، يظهر عمرك على المريخ أقل غالباً.' },
  { question: 'لماذا عمري على عطارد أكبر؟', answer: 'سنة عطارد قصيرة جداً، حوالي 88 يوماً أرضياً. لذلك يمر "عام عطارد" مرات أكثر خلال حياتك، فيظهر عمرك المحسوب بسنوات عطارد أعلى من عمرك الأرضي.' },
  { question: 'هل العمر الحقيقي يتغير؟', answer: 'لا. الفترة التي عشتها لا تتغير. الذي يتغير هو وحدة القياس: سنة الأرض، سنة المريخ، سنة عطارد، أو سنة نبتون.' },
  { question: 'هل تستخدم الصفحة كواكب المجموعة الشمسية فقط؟', answer: 'نعم. نستخدم الكواكب الثمانية المعروفة ومدة دوران كل كوكب حول الشمس. لا نخلط الصفحة بالأبراج أو التنجيم أو الكواكب القزمة في النسخة الحالية.' },
];
const decisionRows = [
  ['أريد المثال الأشهر', 'المريخ', 'سنة المريخ أطول من الأرض، لذلك يكون عمرك على المريخ أقل غالباً.'],
  ['أريد رؤية رقم كبير', 'عطارد', 'سنة عطارد قصيرة جداً، لذلك يعطي أعلى رقم تقريباً بين الكواكب.'],
  ['أريد كوكباً ضخماً وسنة طويلة', 'المشتري', 'سنة المشتري تقارب 12 سنة أرضية، لذلك يصبح العمر عليه صغيراً جداً.'],
  ['أريد أقصى مقارنة', 'نبتون', 'سنة نبتون طويلة جداً، وقد لا تكمل سنة نبتونية واحدة في عمر بشري عادي.'],
];
const methodItems = [
  { title: 'العمر على الكواكب هو قياس مختلف', content: 'أنت عشت الفترة نفسها منذ تاريخ ميلادك. الصفحة تعيد قراءة هذه الفترة بوحدة سنة مختلفة: سنة عطارد أو المريخ أو المشتري بدلاً من سنة الأرض.' },
  { title: 'الأساس هو الفترة المدارية', content: 'كل كوكب يحتاج مدة مختلفة ليكمل دورة حول الشمس. نقسم إجمالي الأيام التي عشتها على مدة سنة الكوكب بالأيام، فنحصل على عمرك بذلك الكوكب.' },
  { title: 'الكواكب القريبة تعطي أعماراً أكبر', content: 'كلما كانت السنة أقصر، زاد عدد السنوات التي تمر خلال حياتك. لذلك يظهر عمرك على عطارد أكبر من الأرض، بينما يظهر على المريخ والمشتري ونبتون أصغر.' },
  { title: 'عيد الميلاد الكوكبي تقدير تعليمي', content: 'تعرض الصفحة أيضاً متى يأتي عيدك القادم على كل كوكب بحسب السنة المدارية. هذه قراءة ممتعة للتعلم والمشاركة، وليست مناسبة رسمية.' },
];
const sourceLinks = [
  { href: 'https://science.nasa.gov/solar-system/planets/', title: 'NASA: كواكب المجموعة الشمسية' },
  { href: 'https://science.nasa.gov/mars/', title: 'NASA: كوكب المريخ' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PATH}` });

const TOC_ITEMS = [
  ['planets-decision', 'أي كوكب تبدأ به لفهم النتيجة؟'],
  ['planets-method', 'كيف تحسب الصفحة العمر على الكواكب؟'],
  ['planets-faq', 'الأسئلة الشائعة'],
  ['planets-sources', 'مصادر فلكية'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'countdown', 'milestones']);

export default function AgePlanetsPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema([
        { name: 'الرئيسية', href: '/' }, { name: 'الأدوات', href: '/tools' }, { name: 'الصحة والعمر', href: '/tools/health' }, { name: PAGE.title, href: PATH },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: PAGE.title, description, path: PATH })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-age-planets" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-planets" /></div>

        <article className="tool-v2-lane-article">
          <section id="planets-decision">
            <h2>أي كوكب تبدأ به لفهم النتيجة؟</h2>
            <p>كل كوكب يوضح فكرة مختلفة: عطارد يشرح السنة القصيرة، المريخ مثال شائع، ونبتون يوضح السنة الطويلة جداً.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>الكوكب المناسب</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-planets" />

          <section id="planets-method">
            <h2>كيف تحسب الصفحة العمر على الكواكب؟</h2>
            <p>الفكرة ليست خيالاً: نحسب الفترة التي عشتها بالأيام، ثم نقسمها على طول السنة المدارية لكل كوكب.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="planets-faq">
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

          <section id="planets-sources">
            <h2>مصادر فلكية</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="planets-related">
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
          <div className="tool-v2-tool-panel"><AgePlanetsTool /></div>
        </div>
      </div>
    </main>
  );
}
