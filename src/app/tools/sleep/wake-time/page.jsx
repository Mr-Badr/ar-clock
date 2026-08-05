import Link from 'next/link';

import WakeTimeTool from '@/components/calculators/sleep/WakeTimeTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSleepToolBySlug } from '@/lib/sleep/content';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wake-time');
const TOOL = getSleepToolBySlug('wake-time');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'كيف تختار من أوقات الاستيقاظ؟',
  description: 'وقت الاستيقاظ الأفضل هو الذي يناسب التزاماتك ويقلل الخمول، لا الوقت الذي يبدو مثالياً على الورق فقط.',
  rows: [
    ['تحتاج الاستيقاظ قريباً', 'أقرب نهاية دورة معقولة', 'حل اضطراري لليلة واحدة، وليس روتيناً يومياً.'],
    ['يومك يحتاج تركيزاً', 'خيار أقرب للمدى الموصى به', 'قد تحتاج وقت نوم أبكر في الليلة التالية.'],
    ['تكرر السؤال يومياً', 'انتقل لحاسبة وقت النوم', 'التخطيط من وقت الاستيقاظ أفضل من الحساب اللحظي.'],
  ],
};
const methodItems = [
  { title: 'استخدم "الآن" للقرار الفوري', content: 'إذا كنت ستنام الآن فعلاً، فعّل خيار الآن حتى يعتمد الحساب على وقت جهازك المحلي.' },
  { title: 'اختر وقتاً يطابق يومك التالي', content: 'لا تختَر أطول نوم ممكن إذا كان سيكسر التزاماً مهماً، ولا تختَر الأقصر كعادة يومية.' },
  { title: 'عدّل وقت الغفو والدورة عند الحاجة', content: '90 دقيقة و15 دقيقة غفو تقديرات مفيدة، لكنها ليست ثابتة لكل شخص وكل ليلة.' },
  { title: 'انتقل للتخطيط إذا صار الاستيقاظ ثابتاً', content: 'إذا كان موعد الاستيقاظ يتكرر يومياً، فحاسبة وقت النوم أفضل لبناء روتين مستمر.' },
];
const sourceLinks = [
  { href: 'https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep', title: 'NHLBI: دورات النوم' },
  { href: 'https://www.cdc.gov/sleep/about/index.html', title: 'CDC: أساسيات النوم' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['wake-decision', DECISION_TABLE.title],
  ['wake-method', 'كيف تُبنى الأداة؟'],
  ['wake-faq', 'الأسئلة الشائعة'],
  ['wake-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function WakeTimePage() {
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

      <ToolTopAdSlot slotId="top-sleep-wake-time" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-sleep-wake-time" /></div>

        <article className="tool-v2-lane-article">
          <section id="wake-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>حالتك</th><th>الخيار الأقرب</th><th>تنبيه</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-sleep-wake-time" />

          <section id="wake-method">
            <h2>كيف تُبنى الأداة؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="wake-faq">
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

          <section id="wake-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="wake-related">
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
          <div className="tool-v2-tool-panel"><WakeTimeTool /></div>
        </div>
      </div>
    </main>
  );
}
