import EgyptWaterBillCalculator from '@/components/calculators/EgyptWaterBillCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-water-bill');
const CONTENT = getFinancePageContent('egypt-water-bill');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EgyptWaterBillPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, keywords: PAGE.keywords, faqItems,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيف تحسب فاتورة المياه في مصر',
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
        <EgyptWaterBillCalculator />
      </CalculatorHero>

      <CalculatorSection id="eg-water-tariff" eyebrow="التعريفة" title="شرائح أسعار المياه والصرف الصحي في مصر">
        <div className="calc-editorial">
          <p>
            تُسعّر المياه في مصر وفق نظام شرائح تصاعدية هامشية. على كل فاتورة تُضاف رسوم الصرف الصحي (65% من قيمة المياه)،
            ورسم تنظيمي ثابت، ثم ضريبة القيمة المضافة 14% على الإجمالي.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>الشريحة (م³/شهر)</th><th>سعر المياه (ج.م/م³)</th><th>ملاحظة</th></tr>
            </thead>
            <tbody>
              {[
                ['0 – 10',   '2.00', 'أسرة صغيرة'],
                ['11 – 20',  '3.00', 'أسرة متوسطة'],
                ['21 – 30',  '5.00', 'أسرة كبيرة'],
                ['31+',      '8.00', 'استهلاك مرتفع'],
              ].map(([tier, rate, note]) => (
                <tr key={tier}>
                  <td><strong>{tier}</strong></td>
                  <td>{rate}</td>
                  <td className="calc-hint">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-4)' }}>
          <h3>مكونات الفاتورة الكاملة</h3>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>البند</th><th>الأساس</th></tr>
            </thead>
            <tbody>
              {[
                ['رسوم المياه', 'حسب الشريحة أعلاه'],
                ['رسوم الصرف الصحي', '65% من رسوم المياه'],
                ['الرسم التنظيمي', '0.50 ج.م/شهر (ثابت)'],
                ['ضريبة القيمة المضافة', '14% على مجموع ما سبق'],
              ].map(([item, base]) => (
                <tr key={item}>
                  <td><strong>{item}</strong></td>
                  <td>{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="eg-water-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="egypt-water-bill" />
    </main>
  );
}
