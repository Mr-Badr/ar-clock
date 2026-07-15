import EgyptCarCustomsCalculator from '@/components/calculators/EgyptCarCustomsCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInArticleDivider,
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-car-customs');
const CONTENT = getFinancePageContent('egypt-car-customs');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EgyptCarCustomsPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)   ? CONTENT.faqItems   : [];
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
    name: 'كيف تستخدم حاسبة جمارك السيارات في مصر',
    description: PAGE.description,
    step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
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
        <EgyptCarCustomsCalculator />
      </CalculatorHero>

      {/* Tariff table section */}
      <CalculatorSection
        id="ec-tariff"
        eyebrow="الجدول الجمركي"
        title="معدلات جمارك السيارات في مصر 2025"
      >
        <div className="calc-editorial">
          <p>
            يعتمد الجمرك المصري على ثلاثة أُسس: <strong>حجم المحرك (CC)</strong>، <strong>بلد الصنع</strong>، و<strong>نوع الوقود</strong>.
            يُضاف على كل ذلك رسم التنمية وضريبة الجدول وضريبة القيمة المضافة (14%).
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>حجم المحرك</th>
                <th>جمارك (غير أوروبي)</th>
                <th>جمارك (أوروبي EU)</th>
                <th>رسم التنمية</th>
                <th>ضريبة الجدول</th>
                <th>ض.ق.م</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['≤ 1600 سم³', '40%', '0%', '3%', '1%', '14%'],
                ['1601 – 1999 سم³', '135%', '0%', '5%', '15%', '14%'],
                ['≥ 2000 سم³', '135%', '0%', '8.5%', '30%', '14%'],
              ].map(([cc, nonEu, eu, dev, table, vat]) => (
                <tr key={cc}>
                  <td><strong>{cc}</strong></td>
                  <td>{nonEu}</td>
                  <td className="calc-success-text">{eu}</td>
                  <td>{dev}</td>
                  <td>{table}</td>
                  <td>{vat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>نظام الهجين والكهربائي</h3>
          <p>
            تخضع السيارات الهجينة (HEV/PHEV) والكهربائية الكاملة (BEV) لنظام جمركي خاص يختلف عن نظام حجم المحرك.
            تصدر فيه قرارات وزارية دورية — تحقق من أحدث قرارات مصلحة الجمارك قبل الشراء.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>نوع السيارة</th>
                <th>جمارك</th>
                <th>رسم التنمية</th>
                <th>ضريبة الجدول</th>
                <th>ض.ق.م</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['هجينة (HEV / PHEV)', '30%', '3%', '5%', '14%'],
                ['كهربائية بالكامل (BEV)', '15%', '2%', '2%', '14%'],
              ].map(([type, customs, dev, table, vat]) => (
                <tr key={type}>
                  <td><strong>{type}</strong></td>
                  <td>{customs}</td>
                  <td>{dev}</td>
                  <td>{table}</td>
                  <td>{vat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>ما هي قيمة CIF؟</h3>
          <p>
            CIF = <strong>Cost + Insurance + Freight</strong> (التكلفة + التأمين + الشحن). هي القيمة التي تُبنى عليها كل الرسوم الجمركية.
            إذا اشتريت السيارة من الخارج: اجمع ثمن الشراء + تكلفة الشحن البحري/الجوي + قسط التأمين على الشحنة.
            لا تضيف قيمة الضرائب داخل بلد الصنع لأنها لا تُدرج في CIF المصرية.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="ec-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="egypt-car-customs" />
    </main>
  );
}
