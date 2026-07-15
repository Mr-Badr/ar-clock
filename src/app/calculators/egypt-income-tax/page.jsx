import EgyptIncomeTaxCalculator from '@/components/calculators/EgyptIncomeTaxCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-income-tax');
const CONTENT = getFinancePageContent('egypt-income-tax');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function EgyptIncomeTaxPage() {
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
    name: 'كيف تستخدم حاسبة ضريبة الدخل مصر',
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
        <EgyptIncomeTaxCalculator />
      </CalculatorHero>

      {/* Bracket explanation */}
      <CalculatorSection
        id="eg-tax-brackets"
        eyebrow="الشرائح"
        title="شرائح ضريبة الدخل في مصر 2025"
      >
        <div className="calc-editorial">
          <p>
            تُطبِّق مصر نظام الشرائح التصاعدية: كل شريحة تُحتسب فقط على الجزء الواقع فيها، لا على الدخل كله.
            الشرائح أدناه للدخل السنوي وفق قانون الضريبة على الدخل المعدَّل 2023.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الدخل السنوي (ج.م)</th>
                <th>المعدل</th>
                <th>الضريبة القصوى عن الشريحة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0 – 15,000',         '0% (إعفاء)',    'صفر'],
                ['15,001 – 30,000',    '2.5%',          '375 ج.م'],
                ['30,001 – 45,000',    '10%',           '1,500 ج.م'],
                ['45,001 – 60,000',    '15%',           '2,250 ج.م'],
                ['60,001 – 200,000',   '20%',           '28,000 ج.م'],
                ['200,001 – 400,000',  '22.5%',         '45,000 ج.م'],
                ['أكثر من 400,000',    '25%',           'غير محدود'],
              ].map(([range, rate, maxTax]) => (
                <tr key={range}>
                  <td>{range}</td>
                  <td><strong>{rate}</strong></td>
                  <td>{maxTax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>التأمينات الاجتماعية وأثرها على الضريبة</h3>
          <p>
            يُخصم اشتراك التأمين الاجتماعي للموظف (11% من الراتب بحد أقصى 10,400 ج.م/شهر)
            من الدخل <strong>قبل</strong> تطبيق الشرائح. هذا يعني أن موظفاً براتب 10,000 ج.م
            لا يدفع ضريبة على 120,000 ج.م بل على ما يتبقى بعد خصم التأمينات (نحو 106,800 ج.م)
            — فرق يوفر مئات الجنيهات سنوياً.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البند</th>
                <th>النسبة</th>
                <th>الحد الأقصى (شهري)</th>
                <th>يُخصم من الوعاء الضريبي؟</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['تأمين اجتماعي (موظف)', '11%',    '1,144 ج.م', 'نعم'],
                ['تأمين اجتماعي (صاحب عمل)', '18.75%', '—',       'لا (لا يُخصم من راتب الموظف)'],
              ].map(([item, rate, cap, deduct]) => (
                <tr key={item}>
                  <td>{item}</td>
                  <td>{rate}</td>
                  <td>{cap}</td>
                  <td>{deduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Salary examples */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>أمثلة عملية لرواتب شائعة</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الراتب الشهري</th>
                <th>تأمينات شهرية</th>
                <th>ضريبة شهرية (تقريبية)</th>
                <th>صافي الراتب</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['5,000 ج.م',  '550 ج.م',    'صفر تقريباً',  '4,450 ج.م'],
                ['10,000 ج.م', '1,100 ج.م',  '~250 ج.م',    '8,650 ج.م'],
                ['20,000 ج.م', '1,144 ج.م',  '~1,600 ج.م',  '17,256 ج.م'],
                ['40,000 ج.م', '1,144 ج.م',  '~4,900 ج.م',  '33,956 ج.م'],
              ].map(([sal, si, tax, net]) => (
                <tr key={sal}>
                  <td><strong>{sal}</strong></td>
                  <td>{si}</td>
                  <td>{tax}</td>
                  <td>{net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="eg-tax-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="egypt-income-tax" />
    </main>
  );
}
