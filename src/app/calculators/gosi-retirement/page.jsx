import GOSIRetirementCalculator from '@/components/calculators/GOSIRetirementCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gosi-retirement');
const CONTENT = getFinancePageContent('gosi-retirement');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function GOSIRetirementPage() {
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
    name: 'كيف تستخدم حاسبة التقاعد المبكر GOSI',
    description: PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.label,
      text: item.label,
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
        <GOSIRetirementCalculator />
      </CalculatorHero>

      {/* Explanation: how the formula works */}
      <CalculatorSection
        id="gosi-formula"
        eyebrow="المعادلة"
        title="كيف تُحسب معاشات GOSI؟"
      >
        <div className="calc-editorial">
          <p>
            تعتمد التأمينات الاجتماعية معادلتين: <strong>النظام القديم</strong> (للمشتركين بـ19 سنة فأكثر بتاريخ يوليو 2024): المعاش = متوسط الراتب × سنوات الاشتراك ÷ 40، أي 2.5% من راتبك عن كل سنة عمل. يبلغ حده الأقصى 100% بعد 40 سنة.
          </p>
          <p>
            <strong>النظام الجديد</strong> (لمن لديهم أقل من 15 سنة اشتراك في يوليو 2024): المعاش = متوسط أعلى 180 شهراً أجراً × سنوات × 2.25%. النظام القديم أفضل — يعطي 2.5% مقابل 2.25% لنفس السنة.
          </p>
          <p>
            <strong>التقاعد المبكر</strong> يحق بعد 25 سنة اشتراك بصرف النظر عن السن، مع التوقف عن العمل. كل سنة إضافية تضيف مبلغاً دائماً للمعاش مدى الحياة — الجدول التالي يوضح الأثر:
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>سنوات الاشتراك</th>
                <th>نظام قديم (÷ 40)</th>
                <th>نظام جديد (2.25%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                [25, '62.5%', '56.25%'],
                [30, '75%', '67.5%'],
                [35, '87.5%', '78.75%'],
                [40, '100%', '90%'],
              ].map(([y, old_, new_]) => (
                <tr key={y}>
                  <td>{y} سنة</td>
                  <td>{old_}</td>
                  <td>{new_}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="gosi-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="gosi-retirement" />
    </main>
  );
}
