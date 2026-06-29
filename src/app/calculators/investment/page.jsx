import InvestmentReturnCalculator from '@/components/calculators/InvestmentReturnCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'investment');
const CONTENT = getFinancePageContent('investment');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function InvestmentPage() {
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
        <InvestmentReturnCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="investment-method"
        eyebrow="كيف تستخدم الحاسبة"
        title="أربع خطوات لقراءة نتيجة واقعية"
        description="الحاسبة تقدير مبني على الربح المركب — لا تضمن أداء مستقبلياً. استخدمها للتخطيط، لا للقرار النهائي وحدها."
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

      <CalculatorSection
        id="investment-explainer"
        eyebrow="فهم الأرقام"
        title="لماذا يصنع الربح المركب الفارق الكبير؟"
      >
        <div className="calc-editorial-block">
          <p>
            الاستثمار 100,000 ريال بمعدل 5% سنوياً لمدة 20 سنة يُنتج حوالي 165,000 ريال ربحاً — أكثر من رأس المال الأصلي — لأن كل ربح يُضاف إلى الأصل ثم يُربح هو الآخر. هذا هو جوهر الربح المركب: الوقت يعمل لصالحك.
          </p>
          <p>
            في الاستثمار الإسلامي، المبدأ ذاته ينطبق على الصكوك وصناديق الأسهم الشرعية والودائع المرابحة — المصطلح "ربح" بدل "فائدة"، والعقد يقوم على مشاركة أو عائد حقيقي. الحاسبة هنا صالحة لكلا النوعين.
          </p>
          <p>
            نصيحة عملية: أضف ولو 300 ريال شهرياً بجانب مبلغك الأولي. على مدى 15 سنة بمعدل 6%، هذا المبلغ الشهري الصغير يضيف أكثر من 87,000 ريال إلى قيمتك النهائية.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection
        showAdBefore
        id="investment-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن الاستثمار والربح المركب"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="investment-related">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="investment" />
      </CalculatorSection>
    </main>
  );
}
