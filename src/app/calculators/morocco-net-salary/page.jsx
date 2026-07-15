import MoroccoNetSalaryCalculator from '@/components/calculators/MoroccoNetSalaryCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'morocco-net-salary');
const CONTENT = getFinancePageContent('morocco-net-salary');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function MoroccoNetSalaryPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)    ? CONTENT.faqItems    : [];
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
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, keywords: PAGE.keywords, faqItems,
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
    name: 'كيف تستخدم حاسبة الراتب الصافي المغرب',
    description: PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
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
        <MoroccoNetSalaryCalculator />
      </CalculatorHero>

      {/* CNSS explanation */}
      <CalculatorSection
        id="ma-cnss-rates"
        eyebrow="معدلات الاقتطاع"
        title="CNSS وIR — كيف تُحتسب اقتطاعات الراتب في المغرب"
      >
        <div className="calc-editorial">
          <p>
            يخضع الموظف في القطاع الخاص بالمغرب لنوعين من الاقتطاعات: <strong>CNSS</strong>
            (الصندوق الوطني للضمان الاجتماعي) بنسبة ثابتة، و<strong>IR</strong>
            (ضريبة الدخل) بنظام شرائح تصاعدية.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>مكوِّن CNSS</th>
                <th>نسبة الموظف</th>
                <th>نسبة صاحب العمل</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['التأمين قصير المدى', '0.52%', '1.05%'],
                ['CNSS أساسي (طويل المدى)', '4.48%', '8.98%'],
                ['AMO (التأمين الصحي)', '2.26%', '4.11%'],
                ['التكوين المهني', '—', '1.60%'],
                ['مجموع حصة الموظف', '7.26%', '—'],
              ].map(([comp, emp, empr]) => (
                <tr key={comp}>
                  <td>{comp}</td>
                  <td><strong>{emp}</strong></td>
                  <td>{empr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>شرائح ضريبة IR السنوية (2025)</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الدخل السنوي (درهم)</th>
                <th>المعدل</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0 – 30,000', '0% (إعفاء)'],
                ['30,001 – 50,000', '10%'],
                ['50,001 – 60,000', '20%'],
                ['60,001 – 80,000', '30%'],
                ['80,001 – 180,000', '34%'],
                ['أكثر من 180,000', '38%'],
              ].map(([range, rate]) => (
                <tr key={range}>
                  <td>{range}</td>
                  <td><strong>{rate}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="ma-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="morocco-net-salary" />
    </main>
  );
}
