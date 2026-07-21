import JordanIncomeTaxCalculator from '@/components/calculators/JordanIncomeTaxCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'jordan-income-tax');
const CONTENT = getFinancePageContent('jordan-income-tax');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function JordanIncomeTaxPage() {
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
    name: 'كيف تستخدم حاسبة ضريبة الدخل الأردن',
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
        <JordanIncomeTaxCalculator />
      </CalculatorHero>

      {/* Bracket explanation */}
      <CalculatorSection
        id="jo-tax-brackets"
        eyebrow="الشرائح"
        title="شرائح ضريبة الدخل في الأردن"
      >
        <div className="calc-editorial">
          <p>
            يطبّق الأردن نظام الشرائح التصاعدية على الدخل السنوي بعد خصم الإعفاءات: كل شريحة تُحتسب
            فقط على الجزء الواقع فيها، لا على الدخل كله. الشرائح أدناه وفق قانون ضريبة الدخل رقم 34
            لسنة 2014 وتعديلاته.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الدخل السنوي الخاضع (د.أ)</th>
                <th>المعدل</th>
                <th>الضريبة القصوى عن الشريحة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0 – 5,000',          '5%',  '250 د.أ'],
                ['5,001 – 10,000',     '10%', '500 د.أ'],
                ['10,001 – 15,000',    '15%', '750 د.أ'],
                ['15,001 – 20,000',    '20%', '1,000 د.أ'],
                ['20,001 – 1,000,000', '25%', '245,000 د.أ'],
                ['أكثر من 1,000,000',  '30%', 'غير محدود'],
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
          <h3>مساهمة وطنية إضافية على الدخل المرتفع</h3>
          <p>
            فوق الشرائح أعلاه، يُفرض 1% إضافي (مساهمة وطنية) على الجزء من الدخل السنوي الخاضع الذي
            يتجاوز 200,000 دينار. هذا لا يؤثر عملياً إلا على شريحة صغيرة من أصحاب الدخل المرتفع جداً.
          </p>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>الإعفاءات: لماذا لا يدفع كثيرون ضريبة دخل فعلياً</h3>
          <p>
            كل مكلف مقيم يحصل على إعفاء شخصي أساسي 9,000 دينار سنوياً. إذا كان لديك معالون (زوج أو
            أبناء) يُضاف إعفاء آخر 9,000 دينار — أي 18,000 دينار إعفاء قبل أي ضريبة. يمكن أيضاً
            المطالبة بإعفاءات إضافية (طبي/تعليم/سكن) حتى 5,000 دينار، لكن السقف الكلي لأي عائلة
            23,000 دينار. هذا يعني أن راتباً شهرياً حتى نحو 1,500 دينار (لمن لديه معالون) قد لا يدفع
            أي ضريبة دخل فعلياً.
          </p>
        </div>

        {/* Salary examples */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>أمثلة عملية لرواتب شائعة (مع إعفاء معالين وضمان اجتماعي 7.5%)</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الراتب الشهري</th>
                <th>ضمان اجتماعي شهري</th>
                <th>ضريبة شهرية</th>
                <th>صافي الراتب</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['700 د.أ',   '52.5 د.أ',  'صفر',      '647.5 د.أ'],
                ['1,500 د.أ', '112.5 د.أ', 'صفر',      '1,387.5 د.أ'],
                ['2,500 د.أ', '187.5 د.أ', '87.5 د.أ',  '2,225 د.أ'],
                ['4,000 د.أ', '300 د.أ',   '416.67 د.أ', '3,283.33 د.أ'],
              ].map(([sal, ssc, tax, net]) => (
                <tr key={sal}>
                  <td><strong>{sal}</strong></td>
                  <td>{ssc}</td>
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
        <CalculatorSection id="jo-tax-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="jordan-income-tax" />
    </main>
  );
}
