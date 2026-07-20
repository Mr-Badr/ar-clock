import { Suspense } from 'react';

import DateAddSubtractCalculator from '@/components/calculators/DateAddSubtractCalculator.client';
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
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'date-add-subtract');
const CONTENT = getFinancePageContent('date-add-subtract');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function DateAddSubtractPage() {
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
        <Suspense fallback={<SectionSkeleton />}>
          <DateAddSubtractCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="how-it-works"
        eyebrow="طريقة الحساب"
        title="لماذا حساب الأشهر الهجرية يختلف عن الأشهر الميلادية؟"
        description="الشهر الهجري 29 أو 30 يوماً فقط (لا 30 أو 31 كالميلادي)، والسنة الهجرية أقصر من الميلادية بنحو 10-11 يوماً. لهذا فإن إضافة 'شهر واحد' على تاريخ هجري يعطي نتيجة مختلفة عن إضافة شهر ميلادي — هذه الأداة تحسب كل تقويم بقواعده الفعلية (تقويم أم القرى للهجري) ثم تعرض النتيجة بالتقويمين معاً، فلا تحتاج لتحويل يدوي بعد الحساب."
      >
        <div className="calc-grid-2">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">إضافة أو طرح أيام وأسابيع</div>
            <div className="calc-metric-card__note">حساب دقيق بفارق أيام فعلي، بصرف النظر عن التقويم المُدخل.</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">إضافة أو طرح أشهر وسنوات</div>
            <div className="calc-metric-card__note">يُحسب داخل نظام الشهر الخاص بالتقويم الذي أدخلته (هجري أو ميلادي) لا بالتقريب.</div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="date-add-subtract-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن حساب إضافة وطرح الأيام من تاريخ هجري وميلادي"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />

      <RelatedCalculators currentSlug="date-add-subtract" />
    </main>
  );
}
