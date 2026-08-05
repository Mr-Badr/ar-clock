import Link from 'next/link';

import EmergencyFundTool from '@/components/calculators/personal-finance/EmergencyFundTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getPersonalFinanceToolBySlug } from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'emergency-fund');
const TOOL = getPersonalFinanceToolBySlug('emergency-fund');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'اختيار عدد الأشهر من واقعك لا من رقم محفوظ',
  description: 'استخدم الجدول قبل اعتماد الهدف، لأن 3 أو 6 أشهر ليست حكماً واحداً لكل شخص.',
  rows: [
    ['لا تملك أي احتياطي', 'احتياطي أولي ثم شهر واحد', 'ابدأ برقم صغير يمنع أول عودة للدين، ثم ارفعه تدريجياً.'],
    ['دخل ثابت ومسؤوليات محدودة', '3 أشهر كبداية عملية', 'اختبر هل تستطيع الوصول لها دون إيقاف سداد الديون الأساسية.'],
    ['أسرة أو دخل متغير أو التزامات ثقيلة', '6 أشهر أو أكثر', 'ارفع الحماية لأن توقف الدخل سيؤثر على أكثر من شخص أو أكثر من التزام.'],
    ['عمل حر أو دخل موسمي', '9 إلى 12 شهراً بالتدرج', 'لا تبنِ الرقم دفعة واحدة؛ اجعله مرحلة بعد الوصول إلى 3 ثم 6 أشهر.'],
  ],
};
const methodItems = [
  { title: 'اكتب مصاريفك الأساسية فقط', content: 'ابدأ بالسكن والطعام والفواتير والنقل والدواء والحد الأدنى من الالتزامات، ولا تضف الكماليات التي يمكن إيقافها وقت الأزمة.' },
  { title: 'اختر عدد أشهر مناسباً لخطر دخلك', content: 'ثلاثة أشهر قد تكفي كبداية للدخل الثابت، وستة أشهر أو أكثر أفضل للدخل المتغير أو المسؤوليات العائلية الكبيرة.' },
  { title: 'اطرح المدخر الحالي', content: 'لا تبدأ من الصفر إذا كان لديك رصيد قائم؛ الفجوة المتبقية هي ما تحتاج تخطيطه شهرياً.' },
  { title: 'اختبر الادخار الشهري', content: 'إذا كان الرقم الشهري يضغط ضرورياتك أو يدفعك للدين، فابدأ بمرحلة أصغر ثم ارفع الهدف تدريجياً.' },
];
const sourceLinks = [
  { href: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/', title: 'CFPB: دليل صندوق الطوارئ' },
  { href: 'https://consumer.gov/your-money/making-budget', title: 'Consumer.gov: بناء الميزانية' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['ef-decision', DECISION_TABLE.title],
  ['ef-method', 'كيف تُبنى خطة صندوق الطوارئ؟'],
  ['ef-faq', 'الأسئلة الشائعة'],
  ['ef-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function EmergencyFundPage() {
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

      <ToolTopAdSlot slotId="top-pf-emergency-fund" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pf-emergency-fund" /></div>

        <article className="tool-v2-lane-article">
          <section id="ef-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الحالة</th><th>الهدف الأقرب</th><th>ماذا تفعل؟</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-pf-emergency-fund" />

          <section id="ef-method">
            <h2>كيف تُبنى خطة صندوق الطوارئ؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="ef-faq">
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

          <section id="ef-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="ef-related">
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
          <div className="tool-v2-tool-panel"><EmergencyFundTool /></div>
        </div>
      </div>
    </main>
  );
}
