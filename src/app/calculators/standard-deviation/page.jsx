import StandardDeviationCalculator from '@/components/calculators/StandardDeviationCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorInArticleDivider,
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'standard-deviation');
const CONTENT = getFinancePageContent('standard-deviation');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function StandardDeviationPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)   ? CONTENT.faqItems   : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات',  item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: PAGE.title,   item: `${SITE_URL}${PAGE.href}` },
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
    name: CONTENT.howTo?.name || 'كيفية استخدام حاسبة الانحراف المعياري',
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
        <StandardDeviationCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="sd-explainer"
        eyebrow="المفهوم"
        title="ماذا يقيس الانحراف المعياري فعلياً؟"
      >
        <div className="calc-editorial">
          <p>
            الانحراف المعياري يخبرك بمقدار تشتت بياناتك حول وسطها الحسابي. قيمة منخفضة تعني أن أغلب
            القيم قريبة من الوسط، وقيمة مرتفعة تعني أن القيم متناثرة وبعيدة عنه. هو أكثر مقاييس التشتت
            استخداماً لأنه يعود بنفس وحدة بياناتك الأصلية — على عكس التباين الذي يبقى بوحدة مربّعة.
          </p>
          <h3>عيّنة أم مجتمع كامل؟</h3>
          <p>
            هذا هو الخيار الذي يخلط أغلب الطلاب: إذا كانت بياناتك جزءاً من مجموعة أكبر (نتائج فصل واحد
            من مدرسة، عيّنة بحث، استبيان على مجموعة محدودة) فاستخدم صيغة <strong>العيّنة</strong> التي
            تقسم على n−1. إذا كانت بياناتك تمثّل المجتمع الإحصائي بأكمله دون استثناء، استخدم صيغة
            <strong> المجتمع</strong> التي تقسم على n مباشرة. في الغالبية العظمى من الحالات العملية —
            الاختبارات المدرسية، استطلاعات الرأي، القياسات التجريبية — الإجابة الصحيحة هي "عيّنة".
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>المقياس</th>
                <th>ماذا يقيس</th>
                <th>الوحدة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['الوسط الحسابي (Mean)', 'مركز البيانات — مجموع القيم ÷ عددها', 'نفس وحدة البيانات'],
                ['الوسيط (Median)', 'القيمة الوسطى بعد الترتيب — لا يتأثر بالقيم الشاذة', 'نفس وحدة البيانات'],
                ['المنوال (Mode)', 'القيمة الأكثر تكراراً', 'نفس وحدة البيانات'],
                ['المدى (Range)', 'الفرق بين أكبر وأصغر قيمة', 'نفس وحدة البيانات'],
                ['التباين (Variance)', 'متوسط مربعات الانحرافات عن الوسط', 'وحدة مربّعة'],
                ['الانحراف المعياري', 'الجذر التربيعي للتباين — مدى التشتت الفعلي', 'نفس وحدة البيانات'],
              ].map(([metric, meaning, unit]) => (
                <tr key={metric}>
                  <td><strong>{metric}</strong></td>
                  <td>{meaning}</td>
                  <td>{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="sd-sources" eyebrow="المصادر" title="المراجع">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="standard-deviation" />
    </main>
  );
}
