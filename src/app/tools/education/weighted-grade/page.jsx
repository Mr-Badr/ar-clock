import Link from 'next/link';

import '@/app/tools/tools-v2.css';
import WeightedGradeCalculator from '@/components/calculators/WeightedGradeCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'weighted-grade');
const CONTENT = getFinancePageContent('weighted-grade');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TOC_ITEMS = [
  ['weighted-grade-example', 'كيف تعمل الحاسبة؟'],
  ['weighted-grade-related', 'أدوات ذات صلة'],
  ['weighted-grade-faq', 'الأسئلة الشائعة'],
];

export default function WeightedGradePage() {
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
    description: PAGE.description, keywords: SEARCH_COVERAGE.metadataKeywords,
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

      <ToolTopAdSlot slotId="top-weighted-grade" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-weighted-grade" /></div>

        <article className="tool-v2-lane-article">
          <section id="weighted-grade-example">
            <h2>كيف تعمل الحاسبة؟</h2>
            <p>أدخل كل مكون من مكونات درجتك مع وزنه النسبي. اترك الدرجة فارغة للمكونات التي لم تُعلن بعد — عادة الاختبار النهائي — لتعرف الدرجة التي تحتاجها فيه.</p>
            <div className="tool-v2-plain-block">
              <h3>مثال: طالب حصل على 35 من 40 في أعمال الفصل</h3>
              <p>
                إذا كانت أعمال الفصل بوزن 40% وحصلت على 35/40 (أي 87.5%)، ووزن الاختبار النهائي 60%،
                فهذه معادلة درجتك المضمونة حتى الآن، ثم ما تحتاجه في الاختبار النهائي:
              </p>
            </div>
            <FormulaCard label="الدرجة المضمونة حتى الآن (من 100):">
              <span>40% × 87.5% = 35 نقطة</span>
            </FormulaCard>
            <FormulaCard
              label="إذا أردت الوصول إلى 60% إجمالاً، هذه الدرجة المطلوبة في الاختبار النهائي:"
              note="بديل: 41.7% فقط في الاختبار النهائي كافية للوصول إلى هدفك."
            >
              <span>الدرجة المطلوبة =</span>
              <Frac num="(60 − 35)" den="60" />
              <span>× 100</span>
            </FormulaCard>
            <div className="tool-v2-plain-block">
              <h3>لماذا هذا مفيد أكثر من حساب المعدل العادي؟</h3>
              <p>
                حاسبة المعدل التراكمي (GPA) تجمع مقررات فصل دراسي كامل بعد انتهائها. هذه الحاسبة مختلفة:
                تساعدك أثناء الفصل، قبل أن تُعلن كل الدرجات، لتعرف بالضبط ما تحتاجه في الجزء المتبقي.
              </p>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-weighted-grade" />

          <section id="weighted-grade-related">
            <h2>أدوات أخرى مفيدة للطلاب</h2>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {['gpa', 'gpa-to-percent', 'standard-deviation'].map((slug) => {
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

          <section id="weighted-grade-faq">
            <h2>إجابات على أكثر أسئلة الدرجة النهائية بحثاً</h2>
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
            <section id="weighted-grade-sources">
              <h2>مصادر</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><WeightedGradeCalculator /></div>
        </div>
      </div>
    </main>
  );
}
