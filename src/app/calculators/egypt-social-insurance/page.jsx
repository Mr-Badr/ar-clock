import EgyptSocialInsuranceCalculator from '@/components/calculators/EgyptSocialInsuranceCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-social-insurance');
const CONTENT = getFinancePageContent('egypt-social-insurance');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function EgyptSocialInsurancePage() {
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
    name: 'كيف تستخدم حاسبة التأمينات الاجتماعية مصر',
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
        <EgyptSocialInsuranceCalculator />
      </CalculatorHero>

      {/* Rates explanation */}
      <CalculatorSection
        id="eg-si-rates"
        showAdBefore
        eyebrow="النسب والأحكام"
        title="نسب التأمينات الاجتماعية في مصر 2025"
      >
        <div className="calc-editorial">
          <p>
            يُطبق قانون التأمينات الاجتماعية المصري رقم 148 لسنة 2019 نسباً ثابتة على الأجر المؤمَّن،
            بحد أقصى يتغير سنوياً. الحد الأقصى الحالي لعام 2025 هو <strong>10,400 جنيه/شهر</strong> —
            من تجاوز راتبه هذا المبلغ، تُحتسب التأمينات على 10,400 فقط.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البند</th>
                <th>حصة الموظف</th>
                <th>حصة صاحب العمل</th>
                <th>الحد الأقصى (شهري)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['تأمينات اجتماعية (مجمل)', '11%', '18.75%', '10,400 ج.م'],
                ['حصة قصوى الموظف', '1,144 ج.م', '—', '—'],
                ['إجمالي الاشتراك', '1,144 ج.م', '1,950 ج.م', '3,094 ج.م'],
              ].map(([item, emp, empr, cap]) => (
                <tr key={item}>
                  <td>{item}</td>
                  <td><strong>{emp}</strong></td>
                  <td>{empr}</td>
                  <td>{cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>العلاقة بين التأمينات وضريبة الدخل</h3>
          <p>
            حصة الموظف في التأمينات الاجتماعية <strong>تُخصم من الدخل السنوي</strong> قبل احتساب
            شرائح ضريبة الدخل. هذا يعني أن موظفاً براتب 10,000 جنيه يدفع ضريبته على دخل سنوي
            يُقدَّر بـ 106,800 جنيه (بعد خصم التأمينات) لا على 120,000 جنيه.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="eg-si-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="egypt-social-insurance" />
    </main>
  );
}
