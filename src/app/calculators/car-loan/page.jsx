import CarLoanCalculator from '@/components/calculators/CarLoanCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'car-loan');
const CONTENT = getFinancePageContent('car-loan');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

// Gulf bank indicative rates table data
const GULF_RATES = [
  { country: '🇸🇦 السعودية', conventional: '3.99%–9%', murabaha: '3.99%–6.5%', banks: 'الراجحي، رياض، الإنماء' },
  { country: '🇦🇪 الإمارات', conventional: '2.5%–5%', murabaha: '1.99%–3.5%', banks: 'أديب، الإمارات الإسلامي، FAB' },
  { country: '🇰🇼 الكويت', conventional: '3%–7%', murabaha: '2.5%–5%', banks: 'KFH، بيت التمويل' },
  { country: '🇶🇦 قطر', conventional: '3%–6%', murabaha: '2.5%–5%', banks: 'QIB، بروة' },
  { country: '🇧🇭 البحرين', conventional: '3.5%–7%', murabaha: '3%–5.5%', banks: 'ABC الإسلامي، BISB' },
  { country: '🇴🇲 عُمان', conventional: '4%–8%', murabaha: '3.5%–6%', banks: 'مزن، بنك نزوى' },
];

// Practical examples (pre-calculated for SSR/SEO capture)
const EXAMPLES = [
  { price: '50,000', dp: '10,000', term: '3 سنوات', currency: 'ريال', conv: '1,188', murab: '1,250' },
  { price: '100,000', dp: '20,000', term: '5 سنوات', currency: 'ريال', conv: '1,509', murab: '1,600' },
  { price: '150,000', dp: '30,000', term: '5 سنوات', currency: 'ريال', conv: '2,264', murab: '2,400' },
  { price: '80,000', dp: '16,000', term: '4 سنوات', currency: 'درهم', conv: '1,509', murab: '1,600' },
];

export default async function CarLoanPage() {
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
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
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
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
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
        <CarLoanCalculator />
      </CalculatorHero>

      {/* Gulf bank rates reference */}
      <CalculatorSection
        id="car-loan-rates"
        eyebrow="معدلات التمويل الحالية"
        title="أسعار البنوك الاسترشادية في دول الخليج"
        description="أسعار تقريبية للمقارنة — تحقق من بنكك للسعر الفعلي حسب ملفك الائتماني."
      >
        <div className="calc-table-wrap">
          <table className="calc-table">
            <thead>
              <tr>
                <th>الدولة</th>
                <th>تمويل تقليدي</th>
                <th>مرابحة إسلامية</th>
                <th>أمثلة على بنوك</th>
              </tr>
            </thead>
            <tbody>
              {GULF_RATES.map((row) => (
                <tr key={row.country}>
                  <td><strong>{row.country}</strong></td>
                  <td>{row.conventional}</td>
                  <td style={{ color: 'var(--green, #16a34a)', fontWeight: 600 }}>{row.murabaha}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.banks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="calc-editorial-block" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>
          * تُحدَّد المعدلات الفعلية بناءً على الملف الائتماني والدفعة الأولى ومدة التمويل. المعدلات أعلاه إرشادية من مصادر بنكية عامة.
        </p>
      </CalculatorSection>

      {/* Editorial: conventional vs murabaha */}
      <CalculatorSection
        id="car-loan-murabaha-explainer"
        eyebrow="تقليدي أم مرابحة؟"
        title="ما الفرق بين قرض السيارة والمرابحة الإسلامية؟"
      >
        <div className="calc-editorial-block">
          <h3>كيف تعمل المرابحة خطوة بخطوة؟</h3>
          <p>
            في المرابحة لا تحصل على قرض نقدي — البنك هو الذي يشتري السيارة من الوكالة، ثم يبيعها لك بسعر أعلى (سعر التكلفة + هامش الربح) مقسَّم على أقساط متساوية. أنت تعرف إجمالي الثمن من اللحظة الأولى، ولا تتغير الأقساط.
          </p>
          <h3>الفرق الحسابي الجوهري</h3>
          <p>
            في القرض التقليدي تُحسب الفائدة على الرصيد المتناقص — كل قسط تدفعه يقلل الأصل، فتقل الفائدة التدريجية. أما في المرابحة فالربح محسوب مرةً واحدة على كامل المبلغ لكامل المدة، مما يجعل الأقساط متساوية لكن الإجمالي أعلى عند نفس النسبة.
          </p>
          <p>
            <strong>مثال عملي:</strong> قرض 60,000 ريال بنسبة 5% لمدة 5 سنوات:
          </p>
          <ul style={{ paddingInlineStart: '1.5rem', lineHeight: '2' }}>
            <li><strong>تقليدي (متناقص):</strong> قسط 1,132 ريال/شهر — إجمالي الفائدة 7,913 ريال</li>
            <li><strong>مرابحة (ثابت):</strong> قسط 1,250 ريال/شهر — إجمالي الربح 15,000 ريال</li>
          </ul>
          <p>
            عند نفس النسبة، التقليدي أقل تكلفةً إجمالاً. لكن البنوك الإسلامية تعرض هوامح ربح أقل لتعويض ذلك — لذا احرص دائماً على مقارنة الإجمالي لا النسبة وحدها.
          </p>
          <h3>السداد المبكر: أيهما أفضل؟</h3>
          <p>
            في القرض التقليدي بالفائدة المتناقصة، السداد المبكر يوفر لأن الرصيد انخفض أصلاً. في المرابحة، يحق لك المطالبة باسترداد الجزء غير المستحق من الربح — هذا الحق مكفول بموجب تعليمات المصارف المركزية في الإمارات والسعودية والكويت، لكن اتفق عليه كتابةً مع البنك قبل التوقيع.
          </p>
        </div>
      </CalculatorSection>

      {/* How to use */}
      <CalculatorSection
        id="car-loan-howto"
        eyebrow="كيف تستخدم الحاسبة"
        title="أربع خطوات للحصول على نتيجة دقيقة"
        description={CONTENT.howTo?.description}
      >
        <div className="calc-metric-grid">
          {howToSteps.map((step, i) => (
            <div key={step.name} className="calc-metric-card">
              <div className="calc-metric-card__label">
                <span style={{ color: 'var(--calc-cat-finance)', marginInlineEnd: '6px' }}>{i + 1}.</span>
                {step.name}
              </div>
              <div className="calc-metric-card__note">{step.text}</div>
            </div>
          ))}
        </div>
      </CalculatorSection>

      {/* Practical examples table */}
      <CalculatorSection
        id="car-loan-examples"
        eyebrow="أمثلة عملية"
        title="كم قسط سيارة بسعر 100 ألف؟"
        description="أمثلة محسوبة بنسبة 5% سنوياً — غيّر القيم في الحاسبة أعلاه للحصول على قسطك الفعلي."
      >
        <div className="calc-table-wrap">
          <table className="calc-table">
            <thead>
              <tr>
                <th>سعر السيارة</th>
                <th>الدفعة الأولى</th>
                <th>المدة</th>
                <th>تقليدي 5%</th>
                <th>مرابحة 5%</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((ex) => (
                <tr key={ex.price + ex.term}>
                  <td>{ex.price} {ex.currency}</td>
                  <td>{ex.dp} {ex.currency}</td>
                  <td>{ex.term}</td>
                  <td>{ex.conv} {ex.currency}/شهر</td>
                  <td style={{ color: 'var(--green, #16a34a)', fontWeight: 600 }}>{ex.murab} {ex.currency}/شهر</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="car-loan-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن تمويل السيارة والمرابحة الإسلامية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Sources + Related */}
      <CalculatorSection id="car-loan-related">
        <CalculatorSources sources={CONTENT.sources} />
        <RelatedCalculators currentSlug="car-loan" />
      </CalculatorSection>
    </main>
  );
}
