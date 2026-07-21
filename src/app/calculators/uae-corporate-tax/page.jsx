import UaeCorporateTaxCalculator from '@/components/calculators/UaeCorporateTaxCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';
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
const PAGE     = CALCULATOR_ROUTES.find((item) => item.slug === 'uae-corporate-tax');
const CONTENT  = getFinancePageContent('uae-corporate-tax');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function UaeCorporateTaxPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)     ? CONTENT.faqItems     : [];
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
    name: 'كيف تستخدم حاسبة ضريبة الشركات الإمارات',
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
        badge={<><CountryFlag code="ae" /> قانون 47/2022</>}
        title={PAGE.heroTitle}
        description={CONTENT.hero.description}
        highlights={CONTENT.hero.highlights}
      >
        <UaeCorporateTaxCalculator />
      </CalculatorHero>

      {/* Tax rates table */}
      <CalculatorSection
        id="uae-ct-rates"
        eyebrow="نظام الضريبة"
        title="شرائح ضريبة الشركات في الإمارات"
      >
        <div className="calc-editorial">
          <p>
            أقرّ القانون الاتحادي رقم 47 لسنة 2022 نظاماً من شريحتين فقط. الأرباح حتى
            <strong> 375,000 درهم معفاة بالكامل</strong>، وما يتجاوز ذلك يخضع لـ
            <strong> 9% فقط</strong> — وهو من أدنى معدلات ضريبة الشركات في العالم.
            الضريبة لا تؤثر على الرواتب والأجور، بل تطبَّق فقط على أرباح الأعمال الصافية.
          </p>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الشريحة</th>
                <th>الأرباح (درهم)</th>
                <th>معدل الضريبة</th>
                <th>الضريبة المستحقة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['الشريحة الأولى',  '0 — 375,000',       '0%',  'معفاة بالكامل'],
                ['الشريحة الثانية', '375,001 فأكثر',     '9%',  '9% على الجزء الزائد فقط'],
              ].map(([band, range, rate, note]) => (
                <tr key={band}>
                  <td>{band}</td>
                  <td style={{ direction: 'ltr', textAlign: 'end' }}>{range}</td>
                  <td><strong>{rate}</strong></td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Regional comparison */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>ضريبة الشركات في دول المنطقة — مقارنة</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البلد</th>
                <th>المعدل القياسي</th>
                <th>حد الإعفاء</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ae', 'الإمارات', '9%',  '375,000 AED',  'سارٍ منذ يونيو 2023'],
                ['sa', 'السعودية', '20%', 'لا يوجد',      'الشركات الأجنبية فقط، الوطنية تخضع لزكاة 2.5%'],
                ['eg', 'مصر',      '22.5%', 'لا يوجد',   'على الأرباح الصافية'],
                ['ma', 'المغرب',   '20-35%', 'لا يوجد',  'تصاعدي حسب الربح'],
                ['jo', 'الأردن',   '20%',  'لا يوجد',    'معدل ثابت للشركات التجارية'],
              ].map(([code, c, r, ex, n]) => (
                <tr key={code} style={code === 'ae' ? { fontWeight: '600', background: 'color-mix(in srgb, var(--green) 6%, transparent)' } : {}}>
                  <td><CountryFlag code={code} /> {c}</td><td>{r}</td><td>{ex}</td><td>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SBR explanation */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>تخفيف الأعمال الصغيرة (Small Business Relief)</h3>
          <p>
            الشركات التي لا تتجاوز إيراداتها <strong>3,000,000 درهم</strong> سنوياً
            مؤهلة لمعاملة دخلها الخاضع للضريبة على أساس صفر، وهذا يعني ضريبة = صفر
            حتى لو تجاوزت الأرباح 375,000 درهم. يجب اختيار هذا التخفيف صراحةً في
            الإقرار الضريبي السنوي المقدَّم لهيئة الضرائب الاتحادية (FTA).
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="uae-ct-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="uae-corporate-tax" />
    </main>
  );
}
