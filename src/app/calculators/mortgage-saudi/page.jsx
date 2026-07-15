import SaudiMortgageCalculator from '@/components/calculators/SaudiMortgageCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'mortgage-saudi');
const CONTENT = getFinancePageContent('mortgage-saudi');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function MortgageSaudiPage() {
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
    name: 'كيف تستخدم حاسبة التمويل العقاري السعودية',
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
        <SaudiMortgageCalculator />
      </CalculatorHero>

      {/* DBR + housing support explainer */}
      <CalculatorSection
        id="m-sa-dbr"
        eyebrow="نسبة التحمل"
        title="كيف يحدد البنك مبلغ التمويل الذي تستحقه؟"
      >
        <div className="calc-editorial">
          <p>
            يلتزم كل بنك سعودي بضوابط <strong>ساما</strong> (البنك المركزي السعودي) التي تحدد الحد الأقصى لمجموع
            أقساطك الشهرية بـ <strong>33% من راتبك</strong> (أو 45% للمستفيدين من برامج الدعم السكني).
            هذا ما يُعرف بـ <strong>نسبة عبء الدين (DBR)</strong>.
          </p>
          <p>
            مثال: راتب 12,000 ر.س → أقصى أقساط شهرية = 3,960 ر.س. إذا كان لديك قسط سيارة 1,000 ر.س،
            يتبقى 2,960 ر.س لقسط التمويل العقاري.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الراتب الشهري</th>
                <th>أقصى قسط (33%)</th>
                <th>أقصى تمويل تقريبي</th>
                <th>ملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['8,000 ر.س',  '2,640 ر.س', '~310,000 ر.س', '20 سنة · 5%'],
                ['12,000 ر.س', '3,960 ر.س', '~465,000 ر.س', '20 سنة · 5%'],
                ['18,000 ر.س', '5,940 ر.س', '~700,000 ر.س', '20 سنة · 5%'],
                ['25,000 ر.س', '8,250 ر.س', '~970,000 ر.س', '20 سنة · 5%'],
              ].map(([sal, dbr, loan, note]) => (
                <tr key={sal}>
                  <td><strong>{sal}</strong></td>
                  <td>{dbr}</td>
                  <td>{loan}</td>
                  <td className="calc-hint">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Housing support explainer */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>الدعم السكني (صندوق التنمية العقارية)</h3>
          <p>
            المواطنون المؤهلون يستطيعون الحصول على دعم حكومي يصل إلى <strong>500,000 ر.س</strong> عبر منصة <strong>إيجار / أبشر</strong>.
            يتضمن الدعم: (1) دعم ربحي لتغطية جزء من هامش الربح البنكي، (2) دعم لتمويل الدفعة الأولى،
            أو (3) منتجات سكنية جاهزة. يرفع الدعم نسبة DBR المسموح بها من 33% إلى 45%.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="m-sa-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="mortgage-saudi" />
    </main>
  );
}
