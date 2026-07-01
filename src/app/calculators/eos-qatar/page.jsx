import QatarEndOfServiceCalculator from '@/components/calculators/QatarEndOfServiceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'eos-qatar');
const CONTENT = getFinancePageContent('eos-qatar');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function EosQatarPage() {
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
    name: 'كيف تستخدم حاسبة نهاية الخدمة قطر',
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
        <QatarEndOfServiceCalculator />
      </CalculatorHero>

      {/* Formula explanation */}
      <CalculatorSection
        id="qa-eos-formula"
        eyebrow="المعادلة"
        title="كيف تُحسب مكافأة نهاية الخدمة في قطر؟"
      >
        <div className="calc-editorial">
          <p>
            تعتمد <strong>المادة 54 من قانون العمل القطري رقم 14 لسنة 2004</strong> معادلة واحدة لجميع العمال في القطاع الخاص: المعدل اليومي = الراتب الأساسي ÷ 30. ثم يُضرب في 21 يوماً عن كل سنة خدمة مكتملة. الكسور تُحتسب بنسبتها.
          </p>
          <p>
            الفارق الجوهري مع الإمارات والكويت: <strong>القانون القطري لا يُعاقب على الاستقالة</strong>. في السعودية والإمارات والكويت، الاستقالة المبكرة تُخفَّض معها المكافأة. في قطر، المكافأة كاملة أياً كان السبب — فصل أو استقالة أو انتهاء عقد. الاستثناء الوحيد: الفصل بسبب مخالفة جسيمة بموجب المادة 61.
          </p>
          <p>
            <strong>إصلاح 2025:</strong> بموجب قرار مجلس الوزراء رقم 34/2025، تنتقل قطر تدريجياً نحو صناديق استثمار تجمّع فيها المستحقات ربع سنوياً بدلاً من الدفع عند الإنهاء. الحساب (21 يوم/سنة) لا يتغير لكن أموالك محمية حتى في حالة إفلاس الشركة.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البلد</th>
                <th>المعدل اليومي</th>
                <th>أيام السنوات 1-5</th>
                <th>أيام ما بعد الخامسة</th>
                <th>تخفيض الاستقالة؟</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['قطر', '÷ 30', '21 يوم', '21 يوم', '❌ لا يوجد'],
                ['الإمارات', '÷ 30', '21 يوم', '30 يوم', '✅ نعم (1/3 أو 2/3)'],
                ['السعودية', '÷ 30', '15 يوم', '30 يوم', '✅ نعم (1/3 أو 2/3)'],
                ['الكويت', '÷ 26', '15 يوم', '30 يوم', '✅ نعم (0% أو 50% أو 67%)'],
              ].map(([c, d, f, r, res]) => (
                <tr key={c} style={c === 'قطر' ? { fontWeight: '600', background: 'color-mix(in srgb, var(--accent) 6%, transparent)' } : {}}>
                  <td>{c}</td>
                  <td>{d}</td>
                  <td>{f}</td>
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
        <CalculatorSection id="qa-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="eos-qatar" />
    </main>
  );
}
