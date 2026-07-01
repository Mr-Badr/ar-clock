import BahrainEndOfServiceCalculator from '@/components/calculators/BahrainEndOfServiceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'eos-bahrain');
const CONTENT = getFinancePageContent('eos-bahrain');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EosBahrainPage() {
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
    name: 'كيف تستخدم حاسبة نهاية الخدمة البحرين',
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
        <BahrainEndOfServiceCalculator />
      </CalculatorHero>

      {/* Formula explanation */}
      <CalculatorSection
        id="bh-eos-formula"
        eyebrow="المعادلة"
        title="كيف تُحسب مكافأة نهاية الخدمة في البحرين؟"
      >
        <div className="calc-editorial">
          <p>
            تعتمد <strong>المادة 116 من قانون العمل البحريني رقم 36 لسنة 2012</strong> معادلة ذات شريحتين: المعدل اليومي = الراتب الأساسي ÷ 30. عن السنوات الثلاث الأولى يُضرب في 15 يوماً (نصف شهر)، وعن كل سنة بعد الثلاث يُضرب في 30 يوماً (شهر كامل). لا يوجد سقف أقصى في القانون البحريني.
          </p>
          <p>
            عند الاستقالة تُطبَّق شرائح تخفيض: أقل من سنة = 0%، من سنة إلى 3 سنوات = 33.3%، من 3 إلى 5 سنوات = 66.7%، 5 سنوات فأكثر = 100%. الفصل من صاحب العمل أو انتهاء العقد = مكافأة كاملة دائماً.
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
                ['أقل من سنة', '15 يوم / سنة', '0%', '100%'],
                ['سنة – 3 سنوات', '15 يوم / سنة', '33.3%', '100%'],
                ['3 – 5 سنوات', 'أول 3 سنوات: 15 ي / بعدها: 30 ي', '66.7%', '100%'],
                ['5 سنوات فأكثر', 'أول 3 سنوات: 15 ي / بعدها: 30 ي', '100%', '100%'],
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

        {/* GCC comparison */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>مقارنة بدول الخليج</h3>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البلد</th>
                <th>المعدل اليومي</th>
                <th>أيام السنوات 1-3</th>
                <th>نقطة التحول</th>
                <th>أيام بعد التحول</th>
                <th>تخفيض استقالة؟</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['البحرين', '÷ 30', '15 يوم', '3 سنوات', '30 يوم', '✅ (0/33/67/100%)'],
                ['الإمارات', '÷ 30', '21 يوم', '5 سنوات', '30 يوم', '✅ (1/3 أو 2/3)'],
                ['السعودية', '÷ 30', '15 يوم', '5 سنوات', '30 يوم', '✅ (1/3 أو 2/3)'],
                ['الكويت', '÷ 26', '15 يوم', '5 سنوات', '30 يوم', '✅ (0/50/67/100%)'],
                ['قطر', '÷ 30', '21 يوم', '—', '21 يوم', '❌ لا يوجد'],
              ].map(([c, d, f, pivot, r, res]) => (
                <tr key={c} style={c === 'البحرين' ? { fontWeight: '600', background: 'color-mix(in srgb, var(--accent) 6%, transparent)' } : {}}>
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

      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="bh-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="eos-bahrain" />
    </main>
  );
}
