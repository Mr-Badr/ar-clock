import '@/app/tools/tools-v2.css';
import CaloriesCalculator from '@/components/calculators/CaloriesCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'calories');
const CONTENT = getFinancePageContent('calories');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const ACTIVITY_TABLE_ROWS = [
  ['مستقر (لا رياضة)', '× 1.2', 'موظف مكتبي، لا يمشي كثيراً'],
  ['نشاط خفيف (1–3 أيام/أسبوع)', '× 1.375', 'رياضة خفيفة أو مشي 3 مرات أسبوعياً'],
  ['نشاط متوسط (3–5 أيام)', '× 1.55', 'رياضة معتدلة منتظمة'],
  ['نشاط عالٍ (6–7 أيام)', '× 1.725', 'رياضة شاقة يومياً'],
  ['نشاط شديد جداً', '× 1.9', 'عمل بدني + تدريب مكثف'],
];

const TOC_ITEMS = [
  ['cal-explained', 'معدل الأيض والطاقة اليومية'],
  ['cal-faq', 'الأسئلة الشائعة'],
  ['cal-sources', 'المراجع العلمية'],
];

export default function CaloriesPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الصحة والعمر', item: `${SITE_URL}/tools/health` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, keywords: PAGE.keywords, faqItems,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيف تستخدم حاسبة السعرات الحرارية',
    description: PAGE.description,
    step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-calories" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-calories" /></div>

        <article className="tool-v2-lane-article">
          <section id="cal-explained">
            <h2>معدل الأيض والطاقة اليومية</h2>
            <p>
              الحاسبة تستخدم <strong>معادلة ميفلين-سانت جيور (Mifflin-St Jeor)</strong> — الأدق للبالغين وفق الأبحاث الحديثة.
              الخطوة الأولى: حساب <strong>معدل الأيض الأساسي (BMR)</strong> — الطاقة التي يحتاجها جسمك في حالة الراحة التامة.
              ثم يُضرب في <strong>معامل النشاط</strong> للحصول على <strong>TDEE</strong> (الإنفاق الكلي للطاقة يومياً).
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>مستوى النشاط</th><th>المعامل</th><th>مثال</th></tr></thead>
                <tbody>{ACTIVITY_TABLE_ROWS.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="tool-v2-plain-block">
              <h3>قاعدة الـ 500 سعر — مفتاح التحكم في الوزن</h3>
              <p>
                كل نقص 500 سعرة حرارية يومياً يؤدي نظرياً إلى خسارة ≈ 0.5 كغ في الأسبوع (لأن 1 كغ دهون = 7,700 kcal تقريباً).
                فائض 500 kcal يومياً يعني زيادة 0.5 كغ/أسبوع. لا تنقص عن 1,200 kcal للنساء أو 1,500 للرجال بدون إشراف طبي.
              </p>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-calories" />

          <section id="cal-faq">
            <h2>الأسئلة الشائعة</h2>
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
            <section id="cal-sources">
              <h2>المراجع العلمية</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}

          <section id="cal-related">
            <h2>حاسبات صحية أخرى</h2>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {['bmi', 'fasting', 'ovulation'].map((slug) => {
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
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><CaloriesCalculator /></div>
        </div>
      </div>
    </main>
  );
}
