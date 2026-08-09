import Link from 'next/link';

import '@/app/tools/tools-v2.css';
import GpaToPercentCalculator from '@/components/calculators/GpaToPercentCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { GPA_SYSTEMS } from '@/lib/calculators/gpa';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gpa-to-percent');
const CONTENT = getFinancePageContent('gpa-to-percent');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SCALE5_TABLE = [
  ['5.0', 'A+ ممتاز+', '97.5%', 'ممتاز'],
  ['4.75', 'A ممتاز', '92.5%', 'ممتاز'],
  ['4.5', 'B+ جيد جداً+', '87%', 'جيد جداً'],
  ['4.0', 'B جيد جداً', '82%', 'جيد جداً'],
  ['3.5', 'C+ جيد+', '77%', 'جيد'],
  ['3.0', 'C جيد', '72%', 'جيد'],
  ['2.5', 'D+ مقبول+', '67%', 'مقبول'],
  ['2.0', 'D مقبول', '62%', 'مقبول'],
  ['أقل من 2', 'F راسب', 'أقل من 60%', 'راسب'],
];
const SCALE4_TABLE = [
  ['4.0', 'A ممتاز', '93–100%', 'Summa Cum Laude'],
  ['3.7', 'A−', '90–92%', 'Magna Cum Laude'],
  ['3.3', 'B+ جيد جداً', '87–89%', 'Cum Laude'],
  ['3.0', 'B جيد', '83–86%', 'Pass'],
  ['2.7', 'B−', '80–82%', 'Pass'],
  ['2.3', 'C+', '77–79%', 'Pass'],
  ['2.0', 'C مقبول', '73–76%', 'Pass'],
  ['1.0', 'D', '60–72%', 'Minimum Pass'],
  ['أقل من 1', 'F راسب', 'أقل من 60%', 'Fail'],
];

const TOC_ITEMS = [
  ['scale5-table', 'نظام من 5'],
  ['scale4-table', 'نظام من 4'],
  ['scale20-table', 'نظام من 20'],
  ['scale10-table', 'نظام من 10'],
  ['gpa-pct-faq', 'الأسئلة الشائعة'],
];

export default function GpaToPercentPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التعليم', item: `${SITE_URL}/tools/education` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-gpa-to-percent" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-gpa-to-percent" /></div>

        <article className="tool-v2-lane-article">
          <section id="scale5-table">
            <h2>جدول تحويل المعدل من 5 إلى نسبة مئوية</h2>
            <p>النظام المعتمد في معظم جامعات السعودية والكويت وقطر والإمارات والبحرين وعمان.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المعدل (من 5)</th><th>الدرجة</th><th>النسبة المئوية</th><th>التصنيف</th></tr></thead>
                <tbody>{SCALE5_TABLE.map((row) => (<tr key={row[0]}><td dir="ltr">{row[0]}</td><td>{row[1]}</td><td dir="ltr">{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-gpa-to-percent" />

          <section id="scale4-table">
            <h2>جدول تحويل المعدل من 4 إلى نسبة مئوية</h2>
            <p>النظام الأمريكي والدولي المعتمد في الجامعات الغربية والجامعات الدولية في الخليج.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المعدل (من 4)</th><th>الدرجة</th><th>النسبة المئوية</th><th>التصنيف</th></tr></thead>
                <tbody>{SCALE4_TABLE.map((row) => (<tr key={row[0]}><td dir="ltr">{row[0]}</td><td>{row[1]}</td><td dir="ltr">{row[2]}</td><td>{row[3]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <section id="scale20-table">
            <h2>جدول تحويل المعدل من 20 إلى نسبة مئوية</h2>
            <p>النظام الفرنسي المعتمد في المغرب والجزائر وتونس ولبنان — تحويل خطي مباشر (المعدل ÷ 20 × 100).</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المعدل (من 20)</th><th>النسبة المئوية</th><th>التصنيف</th></tr></thead>
                <tbody>
                  {GPA_SYSTEMS.scale20.classifications.map((c) => (
                    <tr key={c.label + c.min}>
                      <td dir="ltr">{c.min}–{c.max}</td>
                      <td dir="ltr">{Math.round((c.min / 20) * 100)}–{Math.round((c.max / 20) * 100)}%</td>
                      <td>{c.label} — {c.labelEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="scale10-table">
            <h2>جدول تحويل المعدل من 10 إلى نسبة مئوية</h2>
            <p>مستخدم في بعض شهادات الثانوية العامة — تحويل خطي مباشر (المعدل ÷ 10 × 100).</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المعدل (من 10)</th><th>النسبة المئوية</th><th>التصنيف</th></tr></thead>
                <tbody>
                  {GPA_SYSTEMS.scale10.classifications.map((c) => (
                    <tr key={c.label + c.min}>
                      <td dir="ltr">{c.min}–{c.max}</td>
                      <td dir="ltr">{Math.round(c.min * 10)}–{Math.round(c.max * 10)}%</td>
                      <td>{c.label} — {c.labelEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="gpa-pct-related">
            <h2>لم تحسب معدلك بعد؟ استخدم حاسبة GPA أولاً</h2>
            <p>إذا كنت تريد حساب معدلك من مواد الفصل أولاً ثم تحويله، ابدأ بحاسبة المعدل التراكمي.</p>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {['gpa', 'weighted-grade', 'standard-deviation'].map((slug) => {
                const tool = CALCULATOR_ROUTES.find((item) => item.slug === slug);
                if (!tool) return null;
                return (
                  <Link key={slug} href={tool.href}>
                    <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                    {tool.shortLabel || tool.title}
                  </Link>
                );
              })}
            </nav>
          </section>

          <section id="gpa-pct-faq">
            <h2>أسئلة عن تحويل المعدل إلى نسبة مئوية</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {CONTENT.sources?.length > 0 && (
            <section id="gpa-pct-sources">
              <h2>مصادر</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><GpaToPercentCalculator /></div>
        </div>
      </div>
    </main>
  );
}
