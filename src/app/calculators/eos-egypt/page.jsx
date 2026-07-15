import EgyptEndOfServiceCalculator from '@/components/calculators/EgyptEndOfServiceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'eos-egypt');
const CONTENT = getFinancePageContent('eos-egypt');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EosEgyptPage() {
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
    name: 'كيف تستخدم حاسبة نهاية الخدمة مصر',
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
        <EgyptEndOfServiceCalculator />
      </CalculatorHero>

      {/* Formula explanation */}
      <CalculatorSection
        id="eg-eos-formula"
        eyebrow="المعادلة"
        title="كيف تُحسب مكافأة نهاية الخدمة في مصر؟"
      >
        <div className="calc-editorial">
          <p>
            تعتمد <strong>المادة 120 من قانون العمل المصري رقم 12 لسنة 2003</strong> معادلة ذات شريحتين: المعدل اليومي = الراتب الأساسي ÷ 30. عن كل سنة من السنوات العشر الأولى يُضرب في 30 يوماً (شهر كامل)، وعن كل سنة تتجاوز العشر يُضرب في 45 يوماً (شهر ونصف). لا يوجد سقف أقصى.
          </p>
          <p>
            عند الاستقالة (المادة 121): أقل من 5 سنوات = 0%، من 5 إلى أقل من 10 سنوات = 50%، 10 سنوات فأكثر = 100% كاملة حتى عند الاستقالة. الفصل من صاحب العمل أو انتهاء العقد = مكافأة كاملة دائماً.
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
                ['أقل من 5 سنوات',   '30 يوم / سنة',                               '0%',   '100%'],
                ['5 – 10 سنوات',     '30 يوم / سنة',                               '50%',  '100%'],
                ['10+ سنوات',        'أول 10 سنوات: 30 ي / بعدها: 45 ي',           '100%', '100%'],
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

        {/* GCC + Egypt comparison */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>مقارنة مصر بدول المنطقة</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البلد</th>
                <th>المعدل اليومي</th>
                <th>السنوات الأولى</th>
                <th>نقطة التحول</th>
                <th>المعدل بعد التحول</th>
                <th>تخفيض الاستقالة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['مصر',      '÷ 30', '30 يوم / سنة', '10 سنوات', '45 يوم / سنة', '0% / 50% / 100%'],
                ['الإمارات', '÷ 30', '21 يوم / سنة', '5 سنوات',  '30 يوم / سنة', '1/3 أو 2/3'],
                ['السعودية', '÷ 30', '15 يوم / سنة', '5 سنوات',  '30 يوم / سنة', '1/3 أو 2/3'],
                ['الكويت',   '÷ 26', '15 يوم / سنة', '5 سنوات',  '30 يوم / سنة', '0/50/67/100%'],
                ['قطر',      '÷ 30', '21 يوم / سنة', '—',        '21 يوم / سنة', 'لا يوجد'],
                ['البحرين',  '÷ 30', '15 يوم / سنة', '3 سنوات',  '30 يوم / سنة', '0/33/67/100%'],
              ].map(([c, d, f, pivot, r, res]) => (
                <tr key={c} style={c === 'مصر' ? { fontWeight: '600', background: 'color-mix(in srgb, var(--green) 6%, transparent)' } : {}}>
                  <td>{c}</td>
                  <td>{d}</td>
                  <td>{f}</td>
                  <td>{pivot}</td>
                  <td>{r}</td>
                  <td>{res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="eg-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="eos-egypt" />
    </main>
  );
}
