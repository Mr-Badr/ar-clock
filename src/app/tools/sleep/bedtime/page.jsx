import Link from 'next/link';

import BedtimeTool from '@/components/calculators/sleep/BedtimeTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSleepToolBySlug } from '@/lib/sleep/content';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'bedtime');
const TOOL = getSleepToolBySlug('bedtime');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'أي وقت نوم تختار من الخيارات؟',
  description: 'لا تختَر أول وقت يظهر فقط. اربط الخيار بواقعك: وقت الغفو، الالتزام الصباحي، وعدد الأيام التي ستكرر فيها الروتين.',
  rows: [
    ['خيار أطول', 'إذا كان اليوم التالي يحتاج تركيزاً أو قيادة أو دواماً مبكراً.', 'إذا كان وقت النوم مبكراً جداً ولا تستطيع تكراره.'],
    ['خيار متوسط', 'عندما تريد توازناً بين مدة كافية وروتين قابل للتطبيق.', 'إذا بقي الصافي أقل من احتياج العمر عدة أيام.'],
    ['خيار قصير', 'لليلة اضطرارية لا تملك فيها وقتاً كافياً.', 'لا تجعله نمطاً يومياً إذا تكرر التعب.'],
  ],
};
const methodItems = [
  { title: 'ابدأ من وقت الاستيقاظ لا وقت النوم', content: 'لأن التزامك بوقت الاستيقاظ غالباً أقوى من التزامك بوقت النوم، تبدأ الأداة من ساعة الاستيقاظ ثم ترجع للخلف لتقترح لك أوقات نوم عملية.' },
  { title: 'أدخل وقت الغفو بصدق', content: 'إذا كنت تحتاج 20 دقيقة للنوم، فأضفها. تجاهل وقت الغفو يجعل النتيجة متفائلة أكثر من واقعك.' },
  { title: 'اختر خياراً قابلاً للتكرار', content: 'لا تختر أبكر وقت إذا كان سيصعب عليك الالتزام به. الخيار الناجح هو الذي يمكنك تكراره عدة ليالٍ.' },
  { title: 'راجع التعب بعد عدة أيام', content: 'إذا بقي التعب رغم وقت مناسب، انتقل إلى مدة النوم الفعلية أو دين النوم بدل تعديل الساعة فقط.' },
];
const sourceLinks = [
  { href: 'https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep', title: 'NHLBI: مراحل النوم' },
  { href: 'https://www.sleepfoundation.org/sleep-faqs/how-long-should-it-take-to-fall-asleep', title: 'Sleep Foundation: وقت الغفو' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: TOOL.quickAnswers,
});

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TOC_ITEMS = [
  ['bedtime-decision', DECISION_TABLE.title],
  ['bedtime-method', 'كيف تبني الأداة الخيارات الستة؟'],
  ['bedtime-faq', 'الأسئلة الشائعة'],
  ['bedtime-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function BedtimePage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: TOOL.quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
          { '@type': 'ListItem', position: 3, name: 'حاسبات النوم الذكي', item: `${SITE_URL}/tools/sleep` },
          { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-sleep-bedtime" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-sleep-bedtime" /></div>

        <article className="tool-v2-lane-article">
          <section id="bedtime-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الخيار</th><th>متى يناسبك؟</th><th>متى لا يكفي؟</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-sleep-bedtime" />

          <section id="bedtime-method">
            <h2>كيف تبني الأداة الخيارات الستة؟</h2>
            <p>لماذا لا أختار 8 ساعات فقط؟ لأن وقت الغفو والانتظام يغيران النتيجة — الناس لا ينامون فور وضع الرأس على الوسادة.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="bedtime-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {TOOL.quickAnswers.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
              {(TOOL.faqItems || []).map((item) => (
                <details key={item.question}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="bedtime-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="bedtime-related">
            <h2>أدوات نوم أخرى</h2>
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
          <div className="tool-v2-tool-panel"><BedtimeTool /></div>
        </div>
      </div>
    </main>
  );
}
