import KuwaitEndOfServiceCalculator from '@/components/calculators/KuwaitEndOfServiceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'eos-kuwait');
const CONTENT = getFinancePageContent('eos-kuwait');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EosKuwaitPage() {
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
    keywords: PAGE.keywords,
    faqItems,
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
    name: 'كيف تستخدم حاسبة نهاية الخدمة الكويت',
    description: PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
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
        <KuwaitEndOfServiceCalculator />
      </CalculatorHero>

      {/* Formula explanation */}
      <CalculatorSection
        id="kw-eos-formula"
        eyebrow="المعادلة"
        title="كيف تُحسب مكافأة نهاية الخدمة في الكويت؟"
      >
        <div className="calc-editorial">
          <p>
            وفق <strong>المادة 51 من قانون العمل الكويتي رقم 6 لسنة 2010</strong>، تعتمد المعادلة على الراتب الأساسي مقسوماً على 26 يوم عمل (لا 30 كما في الإمارات). ثم تُضرب اليومية في 15 يوماً عن كل سنة من أول خمس سنوات، و30 يوماً عن كل سنة بعدها. مع سقف لا يتجاوز 18 راتباً شهرياً.
          </p>
          <p>
            <strong>الاستقالة</strong> لها شرط خاص: أقل من 3 سنوات = لا مكافأة. 3 إلى 5 سنوات = 50%. 5 إلى 10 سنوات = ثلثا المكافأة. 10 سنوات فأكثر = مكافأة كاملة. بينما يُعطي الفصل أو انتهاء العقد المكافأة كاملة دائماً.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>مدة الخدمة</th>
                <th>المعدل</th>
                <th>عند الاستقالة</th>
                <th>عند الفصل / انتهاء العقد</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['أقل من 3 سنوات', '15 يوم / سنة', '0%', '100%'],
                ['3 – 5 سنوات', '15 يوم / سنة', '50%', '100%'],
                ['5 – 10 سنوات', 'أول 5 سنوات: 15 ي — الباقي: 30 ي', '66.7%', '100%'],
                ['10 سنوات فأكثر', 'أول 5 سنوات: 15 ي — الباقي: 30 ي', '100%', '100%'],
              ].map(([dur, rate, res, dis]) => (
                <tr key={dur}>
                  <td>{dur}</td>
                  <td>{rate}</td>
                  <td>{res}</td>
                  <td>{dis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--space-4)' }}>
          <p>
            <strong>الفرق الجوهري مع الإمارات:</strong> الإمارات تستخدم 21 يوماً للخمس سنوات الأولى و÷30 للمعدل اليومي؛ الكويت تستخدم 15 يوماً و÷26. هذا يجعل المعدل اليومي الكويتي أعلى، لكن مدة الأيام أقل في الخمس سنوات الأولى.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="kw-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="eos-kuwait" />
    </main>
  );
}
