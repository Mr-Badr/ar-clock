import EgyptElectricityBillCalculator from '@/components/calculators/EgyptElectricityBillCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-electricity-bill');
const CONTENT = getFinancePageContent('egypt-electricity-bill');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EgyptElectricityBillPage() {
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
    name: 'كيف تحسب فاتورة الكهرباء في مصر',
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
        <EgyptElectricityBillCalculator />
      </CalculatorHero>

      <CalculatorSection id="eg-elec-tariff" showAdBefore eyebrow="التعريفة" title="شرائح أسعار الكهرباء المصرية {{year}}">
        <div className="calc-editorial">
          <p>
            تعتمد مصر نظام الشرائح التصاعدية (المتدرجة) لتسعير الكهرباء السكنية. كل شريحة تُسعّر الكيلوواط الإضافي
            بسعر أعلى من الشريحة السابقة، والشرائح هنا هامشية — أي كل شريحة تُطبَّق فقط على الكيلوواط الساعة
            ضمن نطاقها وليس على كامل الاستهلاك.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>الشريحة (kWh/شهر)</th><th>السعر (ج.م/kWh)</th><th>مثال على الشريحة</th></tr>
            </thead>
            <tbody>
              {[
                ['0 – 50',      '0.68', 'غرفة واحدة، استخدام بسيط'],
                ['51 – 100',    '0.78', 'شقة صغيرة — استهلاك منخفض'],
                ['101 – 200',   '0.95', 'شقة عادية بدون تكييف'],
                ['201 – 350',   '1.55', 'شقة عادية مع تكييف'],
                ['351 – 650',   '1.95', 'شقة كبيرة — تكييف يومي'],
                ['651 – 1,000', '2.10', 'فيلا أو منزل كبير'],
                ['1,001+',      '2.23', 'استهلاك مرتفع جداً'],
              ].map(([tier, rate, ex]) => (
                <tr key={tier}>
                  <td><strong>{tier}</strong></td>
                  <td>{rate}</td>
                  <td className="calc-hint">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>لماذا فاتورتك أعلى في الصيف؟</h3>
          <p>
            التكييف هو المتهم الأول: مكيف 1 طن (\~1.5 كيلوواط) يعمل 8 ساعات يومياً يستهلك تقريباً 360 كيلوواط في الشهر.
            هذا يرفع شريحتك من 0.78 ج.م/kWh إلى 1.55–1.95 ج.م/kWh. نصيحة: اضبط المكيف على 24–26 درجة وأوقف الأجهزة الثانوية في ساعات الذروة (2–5 مساءً).
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="eg-elec-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="egypt-electricity-bill" />
    </main>
  );
}
