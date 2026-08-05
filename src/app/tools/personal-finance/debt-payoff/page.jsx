import Link from 'next/link';

import DebtPayoffTool from '@/components/calculators/personal-finance/DebtPayoffTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getPersonalFinanceToolBySlug } from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'debt-payoff');
const TOOL = getPersonalFinanceToolBySlug('debt-payoff');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'كرة الثلج أم الانهيار؟ اختر طريقة تستطيع تنفيذها',
  description: 'الطريقة الأفضل ليست اسمها الأشهر، بل التي تخفض التكلفة وتبقيك ملتزماً.',
  rows: [
    ['كرة الثلج', 'عندما تحتاج إغلاق دين صغير سريعاً حتى تستمر.', 'قد تترك ديناً عالي الفائدة وقتاً أطول.'],
    ['الانهيار', 'عندما يكون لديك دين أعلى فائدة بوضوح وتستطيع الصبر.', 'قد يتأخر أول إنجاز إذا كان الدين الكبير هو الأعلى فائدة.'],
    ['طريقة هجينة', 'عندما يوجد دين صغير جداً ثم دين عالي الفائدة.', 'اكتب القاعدة مسبقاً حتى لا تتحول الخطة إلى عشوائية.'],
    ['دين متأخر أو في التحصيل', 'راجع الجهة الدائنة أو مختصاً قبل الترتيب العادي.', 'الأولوية قد تكون إيقاف الضرر لا تقليل الفائدة فقط.'],
  ],
};
const methodItems = [
  { title: 'اكتب كل دين في سطر مستقل', content: 'سجل الرصيد، الفائدة أو الرسوم، والحد الأدنى لكل دين. لا تجمع الديون في رقم واحد لأن ترتيب السداد هو جوهر القرار.' },
  { title: 'ادفع الحد الأدنى للجميع أولاً', content: 'الحد الأدنى يحميك من التأخر والغرامات. المبلغ الإضافي فقط هو الذي توجهه إلى دين واحد لتسريع الخطة.' },
  { title: 'قارن كرة الثلج والانهيار', content: 'كرة الثلج تبدأ بالأصغر لتقوية الالتزام، والانهيار يبدأ بالأعلى فائدة لتقليل التكلفة غالباً.' },
  { title: 'جرّب دفعة إضافية واقعية', content: 'ابدأ بمبلغ يمكنك تكراره عدة أشهر. دفعة صغيرة ثابتة أقوى من دفعة كبيرة لا تستمر.' },
];
const sourceLinks = [
  { href: 'https://consumer.gov/debt/debt-explained', title: 'Consumer.gov: فهم الديون' },
  { href: 'https://www.consumerfinance.gov/about-us/blog/how-reduce-your-debt/', title: 'CFPB: تقليل الديون' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['dp-decision', DECISION_TABLE.title],
  ['dp-method', 'كيف تبني خطة السداد؟'],
  ['dp-faq', 'الأسئلة الشائعة'],
  ['dp-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function DebtPayoffPage() {
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
          { '@type': 'ListItem', position: 3, name: 'التخطيط المالي الشخصي', item: `${SITE_URL}/tools/personal-finance` },
          { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-pf-debt-payoff" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pf-debt-payoff" /></div>

        <article className="tool-v2-lane-article">
          <section id="dp-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الطريقة</th><th>متى تناسبك؟</th><th>الخطر الذي تنتبه له</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-pf-debt-payoff" />

          <section id="dp-method">
            <h2>كيف تبني خطة السداد؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="dp-faq">
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

          <section id="dp-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="dp-related">
            <h2>حاسبات مالية أخرى</h2>
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
          <div className="tool-v2-tool-panel"><DebtPayoffTool /></div>
        </div>
      </div>
    </main>
  );
}
