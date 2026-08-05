import Link from 'next/link';

import NetWorthTool from '@/components/calculators/personal-finance/NetWorthTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getPersonalFinanceToolBySlug } from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'net-worth');
const TOOL = getPersonalFinanceToolBySlug('net-worth');
const description = PAGE.description;

const DECISION_TABLE = {
  title: 'ما الذي يدخل في الأصول والالتزامات؟',
  description: 'التصنيف الصحيح أهم من الرقم الجميل، لأنه يمنعك من تضخيم الصورة أو نسيان الديون.',
  rows: [
    ['نقد ومدخرات واستثمارات', 'أصول', 'استخدم القيمة الحالية لا توقعات مستقبلية.'],
    ['بيت أو سيارة ممولة', 'الأصل والالتزام معاً', 'اكتب قيمة الأصل، واكتب الدين المتبقي عليه في الالتزامات.'],
    ['بطاقات وقروض وأقساط', 'التزامات', 'اكتب الرصيد المتبقي، لا القسط الشهري فقط.'],
    ['الراتب', 'لا يدخل كأصل مباشرة', 'الدخل يصبح أصلاً فقط عندما يبقى منه نقد أو ادخار أو استثمار.'],
  ],
};
const methodItems = [
  { title: 'اكتب الأصول بالقيمة الحالية', content: 'استخدم قيمة اليوم للنقد والمدخرات والاستثمارات والعقار والسيارة، لا سعر الشراء القديم ولا رقم التمني.' },
  { title: 'اكتب الالتزامات بالمبلغ المتبقي', content: 'سجل القروض والبطاقات والتمويلات والديون الشخصية بالمبلغ الذي لا يزال عليك سداده.' },
  { title: 'اربط الأصل الممول بدينه', content: 'السيارة أو البيت الممولان يظهران في الجانبين: قيمة الأصل في الأصول، والمتبقي من التمويل في الالتزامات.' },
  { title: 'اقرأ السبب بعد الرقم', content: 'اسأل هل المشكلة في كثرة الديون، قلة الأصول، ضعف السيولة، أو تقييم غير واقعي لبعض الممتلكات.' },
];
const sourceLinks = [
  { href: 'https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/figure-out-your-finances', title: 'Investor.gov: فهم وضعك المالي' },
  { href: 'https://consumer.gov/your-money/making-budget', title: 'Consumer.gov: الميزانية والدخل' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: TOOL.quickAnswers });
export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

const TOC_ITEMS = [
  ['nw-decision', DECISION_TABLE.title],
  ['nw-method', 'كيف يُحسب صافي الثروة؟'],
  ['nw-faq', 'الأسئلة الشائعة'],
  ['nw-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(TOOL.relatedToolSlugs || []);

export default function NetWorthPage() {
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

      <ToolTopAdSlot slotId="top-pf-net-worth" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pf-net-worth" /></div>

        <article className="tool-v2-lane-article">
          <section id="nw-decision">
            <h2>{DECISION_TABLE.title}</h2>
            <p>{DECISION_TABLE.description}</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>البند</th><th>أين تكتبه؟</th><th>تنبيه عملي</th></tr></thead>
                <tbody>{DECISION_TABLE.rows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-pf-net-worth" />

          <section id="nw-method">
            <h2>كيف يُحسب صافي الثروة؟</h2>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="nw-faq">
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

          <section id="nw-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="nw-related">
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
          <div className="tool-v2-tool-panel"><NetWorthTool /></div>
        </div>
      </div>
    </main>
  );
}
