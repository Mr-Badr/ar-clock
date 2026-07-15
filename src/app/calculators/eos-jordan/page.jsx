import JordanEndOfServiceCalculator from '@/components/calculators/JordanEndOfServiceCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'eos-jordan');
const CONTENT = getFinancePageContent('eos-jordan');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function EosJordanPage() {
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
    name: 'كيف تستخدم حاسبة نهاية الخدمة الأردن',
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
        <JordanEndOfServiceCalculator />
      </CalculatorHero>

      {/* Formula explanation */}
      <CalculatorSection
        id="jo-eos-formula"
        eyebrow="المعادلة"
        title="كيف تُحسب مكافأة نهاية الخدمة في الأردن؟"
      >
        <div className="calc-editorial">
          <p>
            تعتمد <strong>المادة 32 من قانون العمل الأردني رقم 8 لسنة 1996</strong> معادلة موحدة لا شريحتين:
            المعدل اليومي = الراتب الأساسي ÷ 30. تُضرب في 30 يوماً (شهر كامل) عن كل سنة خدمة دون أي تمييز.
            هذا يجعله أبسط من كثير من قوانين المنطقة.
          </p>
          <p>
            عند الاستقالة: أقل من سنة = 0%. من سنة إلى أقل من 3 سنوات = ثلث المكافأة (33.3%).
            من 3 سنوات فأكثر = مكافأة كاملة 100%. الفصل أو انتهاء العقد = 100% دائماً.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>مدة الخدمة</th>
                <th>المعدل</th>
                <th>عند الاستقالة</th>
                <th>عند الفصل / انتهاء العقد</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['أقل من سنة',    '30 يوم / سنة', '0%',     '100%'],
                ['1 – 3 سنوات',  '30 يوم / سنة', '33.3%',  '100%'],
                ['3 سنوات فأكثر', '30 يوم / سنة', '100%',   '100%'],
              ].map(([period, rate, resign, dismiss]) => (
                <tr key={period}>
                  <td>{period}</td>
                  <td>{rate}</td>
                  <td>{resign}</td>
                  <td>{dismiss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Regional comparison */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>مقارنة الأردن بدول المنطقة</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البلد</th>
                <th>المعدل اليومي</th>
                <th>شرائح الأعوام</th>
                <th>نقطة التحول</th>
                <th>تخفيض الاستقالة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['الأردن',   '÷ 30', '30 يوم/سنة (ثابت)', '—',        '0% / 33.3% / 100%'],
                ['مصر',      '÷ 30', '30 ثم 45 يوم/سنة',  '10 سنوات', '0% / 50% / 100%'],
                ['الإمارات', '÷ 30', '21 ثم 30 يوم/سنة',  '5 سنوات',  '1/3 أو 2/3'],
                ['السعودية', '÷ 30', '15 ثم 30 يوم/سنة',  '5 سنوات',  '1/3 أو 2/3'],
                ['الكويت',   '÷ 26', '15 ثم 30 يوم/سنة',  '5 سنوات',  '0/50/67/100%'],
              ].map(([c, d, r, p, res]) => (
                <tr key={c} style={c === 'الأردن' ? { fontWeight: '600', background: 'color-mix(in srgb, var(--green) 6%, transparent)' } : {}}>
                  <td>{c}</td><td>{d}</td><td>{r}</td><td>{p}</td><td>{res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="jo-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="eos-jordan" />
    </main>
  );
}
