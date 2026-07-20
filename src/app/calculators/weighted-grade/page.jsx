import Link from 'next/link';

import WeightedGradeCalculator from '@/components/calculators/WeightedGradeCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
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

export default function WeightedGradePage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page calc-weighted-grade-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge={CONTENT.hero.badge}
        title={PAGE.heroTitle}
        description={CONTENT.hero.description}
        highlights={CONTENT.hero.highlights}
      >
        <WeightedGradeCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="weighted-grade-example"
        eyebrow="مثال عملي"
        title="كيف تعمل الحاسبة؟"
        description="أدخل كل مكون من مكونات درجتك مع وزنه النسبي. اترك الدرجة فارغة للمكونات التي لم تُعلن بعد — عادة الاختبار النهائي — لتعرف الدرجة التي تحتاجها فيه."
        subtle
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>مثال: طالب حصل على 35 من 40 في أعمال الفصل</h3>
            <p>
              إذا كانت أعمال الفصل بوزن 40% وحصلت على 35/40 (أي 87.5%)، ووزن الاختبار النهائي 60%،
              فدرجتك المضمونة حتى الآن = 40% × 87.5% = 35 نقطة من أصل 100. إذا أردت الوصول إلى 60%
              إجمالاً، تحتاج (60 − 35) ÷ 60 × 100 = 41.7% فقط في الاختبار النهائي.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>لماذا هذا مفيد أكثر من حساب المعدل العادي؟</h3>
            <p>
              حاسبة المعدل التراكمي (GPA) تجمع مقررات فصل دراسي كامل بعد انتهائها. هذه الحاسبة مختلفة:
              تساعدك أثناء الفصل، قبل أن تُعلن كل الدرجات، لتعرف بالضبط ما تحتاجه في الجزء المتبقي.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="weighted-grade-related"
        eyebrow="أدوات ذات صلة"
        title="أدوات أخرى مفيدة للطلاب"
        subtle
      >
        <div className="calc-cta-actions">
          <Link href="/calculators/gpa" className="btn btn-surface calc-button">احسب المعدل التراكمي (GPA)</Link>
          <Link href="/calculators/gpa-to-percent" className="btn btn-surface calc-button">حوّل GPA إلى نسبة مئوية</Link>
          <Link href="/calculators/percentage" className="btn btn-surface calc-button">حاسبة النسبة المئوية العامة</Link>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="weighted-grade-faq"
        eyebrow="أسئلة شائعة"
        title="إجابات على أكثر أسئلة الدرجة النهائية بحثاً"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="weighted-grade-sources" subtle>
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="weighted-grade" />
      </CalculatorSection>
    </main>
  );
}
