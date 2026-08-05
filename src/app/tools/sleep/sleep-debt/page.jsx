import Link from 'next/link';

import SleepDebtTool from '@/components/calculators/sleep/SleepDebtTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSleepToolBySlug } from '@/lib/sleep/content';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'sleep-debt');
const TOOL = getSleepToolBySlug('sleep-debt');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'كيف تقرأ حجم دين النوم؟',
  description: 'العجز الأسبوعي يشرح التعب المتكرر أفضل من ليلة واحدة تبدو جيدة أو سيئة.',
  rows: [
    ['عجز خفيف', 'قد يظهر من عدة ليالٍ قصيرة قليلاً.', 'أضف 20 دقيقة لعدة ليالٍ.'],
    ['عجز واضح', 'قد يؤثر على التركيز والمزاج واليقظة.', 'ابدأ خطة تعويض تدريجية وثبّت الاستيقاظ.'],
    ['عجز يتكرر أسبوعياً', 'المشكلة في الروتين لا في عطلة واحدة.', 'راجع وقت النوم والكافيين والقيلولة والمناوبات.'],
  ],
};
const methodItems = [
  { title: 'اكتب ساعات الأسبوع كما هي', content: 'لا تعتمد على شعورك فقط. اكتب كل يوم حتى ترى العجز المتراكم بوضوح.' },
  { title: 'قارنها باحتياج العمر', content: 'دين النوم هو الفرق بين احتياجك التقريبي وما نمت فعلاً خلال الأسبوع.' },
  { title: 'ابدأ التعويض بالتدريج', content: 'أضف 20 إلى 30 دقيقة في عدة ليالٍ بدلاً من محاولة تعويض كل شيء في يوم واحد.' },
  { title: 'ثبّت وقت الاستيقاظ قدر الإمكان', content: 'تذبذب الاستيقاظ الكبير يجعل التعويض أصعب، خاصة مع دوام أو دراسة أو رمضان.' },
];
const sourceLinks = [
  { href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/how-much-sleep', title: 'NHLBI: كم النوم الكافي؟' },
  { href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits', title: 'NHLBI: عادات النوم' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['debt-decision', DECISION_TABLE.title],
  ['debt-method', 'كيف تُحسب دين النوم؟'],
  ['debt-faq', 'الأسئلة الشائعة'],
  ['debt-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function SleepDebtPage() {
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

      <ToolTopAdSlot slotId="top-sleep-debt" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-sleep-debt" /></div>

        <article className="tool-v2-lane-article">
          <section id="debt-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الحالة</th><th>المعنى العملي</th><th>التصرف الأفضل</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-sleep-debt" />

          <section id="debt-method">
            <h2>كيف تُحسب دين النوم؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="debt-faq">
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

          <section id="debt-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="debt-related">
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
          <div className="tool-v2-tool-panel"><SleepDebtTool /></div>
        </div>
      </div>
    </main>
  );
}
