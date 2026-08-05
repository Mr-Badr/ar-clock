import Link from 'next/link';

import SavingsGoalTool from '@/components/calculators/personal-finance/SavingsGoalTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getPersonalFinanceToolBySlug } from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'savings-goal');
const TOOL = getPersonalFinanceToolBySlug('savings-goal');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'ماذا تعدّل إذا كان المبلغ الشهري كبيراً؟',
  description: 'لا تلغِ الهدف مباشرة. غيّر أحد مفاتيح الخطة حتى تصبح قابلة للاستمرار.',
  rows: [
    ['تمديد المدة', 'يخفض المبلغ الشهري غالباً.', 'للأهداف المرنة مثل السفر أو جهاز جديد.'],
    ['رفع المبلغ الابتدائي', 'يقلل الفجوة المتبقية.', 'عند وجود مكافأة أو رصيد يمكن تخصيصه.'],
    ['تقسيم الهدف', 'يعطيك مرحلة أولى أقرب.', 'للأهداف الكبيرة مثل سيارة أو زواج أو تجهيز منزل.'],
    ['تأجيل الهدف', 'يحمي الأولويات الأعلى.', 'إذا لم يكن لديك طوارئ أو لديك دين عالي التكلفة.'],
  ],
};
const methodItems = [
  { title: 'حوّل الهدف إلى رقم نهائي', content: 'لا تكتب هدفاً عاماً مثل السفر أو السيارة فقط؛ اكتب التكلفة الواقعية مع هامش بسيط.' },
  { title: 'اطرح ما ادخرته فعلاً', content: 'المدخر الحالي يقلل الفجوة ويجعل الخطة أهدأ. لا تبدأ الحساب كأنك تبدأ من الصفر إذا كان لديك رصيد.' },
  { title: 'اختر مدة يمكن العيش معها', content: 'إذا كان الرقم الشهري الناتج يكسر ضرورياتك، فمدد المدة أو قسّم الهدف إلى مرحلة أولى وثانية.' },
  { title: 'افصل مال الهدف عن المصروف اليومي', content: 'الفصل لا يزيد المال بذاته، لكنه يقلل السحب العشوائي ويجعل التقدم واضحاً.' },
];
const sourceLinks = [
  { href: 'https://www.consumerfinance.gov/documents/7276/cfpb_my-new-money-goal_worksheet.pdf', title: 'CFPB: ورقة هدف مالي' },
  { href: 'https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator', title: 'Investor.gov: حاسبة هدف الادخار' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['sg-decision', DECISION_TABLE.title],
  ['sg-method', 'كيف تبني خطة الادخار؟'],
  ['sg-faq', 'الأسئلة الشائعة'],
  ['sg-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function SavingsGoalPage() {
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

      <ToolTopAdSlot slotId="top-pf-savings-goal" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pf-savings-goal" /></div>

        <article className="tool-v2-lane-article">
          <section id="sg-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>ما الذي تغيّره؟</th><th>الأثر على الخطة</th><th>متى يكون مناسباً؟</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-pf-savings-goal" />

          <section id="sg-method">
            <h2>كيف تبني خطة الادخار؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="sg-faq">
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

          <section id="sg-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="sg-related">
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
          <div className="tool-v2-tool-panel"><SavingsGoalTool /></div>
        </div>
      </div>
    </main>
  );
}
