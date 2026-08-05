import Link from 'next/link';

import SleepDurationTool from '@/components/calculators/sleep/SleepDurationTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSleepToolBySlug } from '@/lib/sleep/content';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'sleep-duration');
const TOOL = getSleepToolBySlug('sleep-duration');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'هل المشكلة في المدة أم التقطع؟',
  description: 'الوقت في السرير قد يبدو جيداً، لكن صافي النوم والاستيقاظات يغيّران القراءة.',
  rows: [
    ['صافي النوم أقل من النطاق', 'ربما تحتاج وقت نوم أطول أو تقليل الاستيقاظات.', 'استخدم وقت النوم ودين النوم.'],
    ['استيقاظات كثيرة', 'الجودة قد تكون المشكلة حتى لو المدة الظاهرية جيدة.', 'راقب التكرار وراجع مختصاً إذا استمر.'],
    ['داخل النطاق مع تعب', 'ابحث في النمط والعادات والأسباب الصحية المحتملة.', 'راجع دين النوم أو عادات النوم.'],
  ],
};
const methodItems = [
  { title: 'اكتب الوقت في السرير', content: 'أدخل وقت النوم والاستيقاظ كما حدثا، لا كما كنت تخطط لهما.' },
  { title: 'اطرح الاستيقاظات الليلية', content: 'مجموع دقائق الاستيقاظ يغيّر الصافي كثيراً، خصوصاً إذا كنت تشعر أن 8 ساعات لا تكفيك.' },
  { title: 'قارن الصافي بالعمر', content: 'الطفل والمراهق والبالغ لا يحتاجون النطاق نفسه، لذلك لا تستخدم قاعدة 8 ساعات وحدها.' },
  { title: 'انتقل لدين النوم إذا تكررت المشكلة', content: 'ليلة واحدة قد تفسر تعباً مؤقتاً، أما التعب المتكرر فيحتاج قراءة أسبوعية.' },
];
const sourceLinks = [
  { href: 'https://www.cdc.gov/sleep/about/index.html', title: 'CDC: جودة ومدة النوم' },
  { href: 'https://www.nhlbi.nih.gov/health/sleep/why-sleep-important', title: 'NHLBI: لماذا النوم مهم؟' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['sd-decision', DECISION_TABLE.title],
  ['sd-method', 'كيف تُحسب المدة الفعلية؟'],
  ['sd-faq', 'الأسئلة الشائعة'],
  ['sd-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function SleepDurationPage() {
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

      <ToolTopAdSlot slotId="top-sleep-duration" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-sleep-duration" /></div>

        <article className="tool-v2-lane-article">
          <section id="sd-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>النتيجة</th><th>ماذا تعني؟</th><th>الخطوة التالية</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-sleep-duration" />

          <section id="sd-method">
            <h2>كيف تُحسب المدة الفعلية؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="sd-faq">
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

          <section id="sd-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="sd-related">
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
          <div className="tool-v2-tool-panel"><SleepDurationTool /></div>
        </div>
      </div>
    </main>
  );
}
