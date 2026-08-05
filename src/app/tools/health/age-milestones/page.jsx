import Link from 'next/link';

import AgeMilestonesTool from '@/components/calculators/age/AgeMilestonesTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'milestones');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'متى أكمل 10,000 يوم؟', answer: 'أدخل تاريخ ميلادك وستعرض الصفحة تاريخ وصولك إلى 10,000 يوم، وهل تجاوزته بالفعل أم لا، وكم يوم بقي إذا كان أمامك.' },
  { question: 'متى يصبح عمري مليار ثانية؟', answer: 'مليار ثانية يساوي تقريباً 31.7 سنة. الحاسبة تضيف 1,000,000,000 ثانية إلى تاريخ ميلادك وتعرض التاريخ المقابل ضمن قائمة المحطات.' },
  { question: 'هل 10,000 يوم يساوي 27 سنة بالضبط؟', answer: 'ليس بالضبط. 10,000 يوم تقارب 27 سنة و4 إلى 5 أشهر، لكن التاريخ الحقيقي يتأثر بتاريخ الميلاد والسنوات الكبيسة، لذلك تحتاج حاسبة لا تقديراً ذهنياً.' },
  { question: 'هل هذه المحطات رسمية؟', answer: 'لا. هي محطات زمنية ممتعة وتعليمية للمشاركة والفضول، وليست بديلاً عن العمر الرسمي بالسنوات أو الوثائق التي تطلب تاريخ الميلاد.' },
];
const decisionRows = [
  ['أريد ما تجاوزته', 'قائمة المحطات الماضية', 'اقرأها كإنجازات زمنية مرّت بالفعل، وليست أعماراً رسمية جديدة.'],
  ['أريد أقرب محطة قادمة', 'الأقرب القادمة في الملخص', 'هذه هي أفضل نتيجة للانتظار أو وضع تذكير شخصي.'],
  ['أريد 10,000 يوم', 'محطات الأيام', 'مناسبة لأنها تقع غالباً في أواخر العشرينات وتصلح للمشاركة.'],
  ['أريد مليار ثانية', 'محطات الثواني', 'تحتاج قراءة دقيقة لأن الثواني تجعل التاريخ حساساً للوقت إذا أردت لحظة دقيقة جداً.'],
];
const methodItems = [
  { title: 'نبدأ من تاريخ الميلاد', content: 'عندما تريد معرفة 10,000 يوم، تضيف الحاسبة 10,000 يوم إلى تاريخ الميلاد. وعندما تريد مليار ثانية، تضيف عدداً محدداً من الثواني. الفكرة حسابية بسيطة لكن تنفيذها يدوياً مرهق.' },
  { title: 'الأيام تختلف عن السنوات', content: 'قد تقول إن 10,000 يوم تساوي نحو 27.4 سنة، وهذا صحيح كتقريب. لكن التاريخ الفعلي يعتمد على موضع السنوات الكبيسة بين تاريخ ميلادك والمحطة.' },
  { title: 'الماضي والقادم في نتيجة واحدة', content: 'بعد إدخال تاريخ الميلاد، ترى المحطات التي تجاوزتها وما الذي ينتظرك. هذا يجعل الصفحة مناسبة للعودة لاحقاً، لأن المحطة القادمة تتغير مع الوقت.' },
  { title: 'المحطة ليست عيد ميلاد رسمي', content: '10,000 يوم أو مليار ثانية لا يغيران عمرك الرسمي، لكنهما يجعلان الزمن محسوساً بطريقة مختلفة. لذلك تصلح المحطات للمشاركة والفضول، لا للوثائق.' },
];
const sourceLinks = [
  { href: 'https://www.timeanddate.com/date/duration.html', title: 'timeanddate: حساب المدة بين التواريخ' },
  { href: 'https://aa.usno.navy.mil/faq/leap_years', title: 'US Naval Observatory: السنوات الكبيسة' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PATH}` });

const TOC_ITEMS = [
  ['milestones-decision', 'أي محطة عمرية تحتاجها الآن؟'],
  ['milestones-method', 'كيف تحسب الصفحة 10,000 يوم ومليار ثانية؟'],
  ['milestones-reading', 'كيف تستفيد من قائمة الماضي والقادم؟'],
  ['milestones-faq', 'الأسئلة الشائعة'],
  ['milestones-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'countdown', 'planets']);

export default function AgeMilestonesPage() {
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

      <ToolTopAdSlot slotId="top-age-milestones" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-milestones" /></div>

        <article className="tool-v2-lane-article">
          <section id="milestones-decision">
            <h2>أي محطة عمرية تحتاجها الآن؟</h2>
            <p>بعض المحطات مناسبة للانتظار، وبعضها للمشاركة، وبعضها لفهم حجم الزمن. اختر القراءة التي تخدم سؤالك.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>الجزء المناسب</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-milestones" />

          <section id="milestones-method">
            <h2>كيف تحسب الصفحة 10,000 يوم ومليار ثانية؟</h2>
            <p>كل محطة هي إضافة زمنية واضحة إلى تاريخ ميلادك. الصعوبة ليست في الفكرة، بل في التعامل مع التواريخ والسنوات الكبيسة دون خطأ.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="milestones-reading">
            <h2>كيف تستفيد من قائمة الماضي والقادم؟</h2>
            <p>
              ابدأ بالمحطات التي تم تجاوزها حتى تفهم حجم الزمن الذي مرّ منذ تاريخ ميلادك. هذه القراءة
              مفيدة لأنها تحول العمر من رقم سنوي مألوف إلى أرقام مختلفة: أيام، ثوانٍ، ومحطات مستديرة
              يسهل تذكرها.
            </p>
            <p>
              بعد ذلك ركز على أقرب محطة قادمة فقط. ليس من المفيد أن تحفظ كل التواريخ دفعة واحدة؛
              الأفضل أن تعرف المحطة التالية وتاريخها، ثم تعود إلى الصفحة لاحقاً عندما تقترب منها أو
              تتجاوزها.
            </p>
            <p>
              إذا أردت مشاركة النتيجة، اكتبها بصيغة بسيطة: "سأكمل 10,000 يوم في هذا التاريخ" أو
              "تجاوزت مليار ثانية". لا تحتاج إلى شرح كل الحسابات، لكن من الجيد أن تذكر أن الرقم مبني
              على تاريخ ميلادك الفعلي لا على تقدير تقريبي للعمر.
            </p>
          </section>

          <section id="milestones-faq">
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

          <section id="milestones-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="milestones-related">
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
          <div className="tool-v2-tool-panel"><AgeMilestonesTool /></div>
        </div>
      </div>
    </main>
  );
}
