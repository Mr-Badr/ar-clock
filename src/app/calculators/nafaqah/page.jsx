import { Suspense } from 'react';

import NafaqahCalculator from '@/components/calculators/NafaqahCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'nafaqah');
const CONTENT = getFinancePageContent('nafaqah');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function NafaqahPage() {
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
          <NafaqahCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="how-it-works"
        eyebrow="طريقة الحساب"
        title="على أي أساس تُحدَّد النفقة في السعودية؟"
        description="لا يوجد مبلغ ثابت واحد للنفقة — يحدده القاضي فعلياً بناءً على حالة المنفق المادية (مُيسر أو مُعسر)، عدد من يعولهم، ديونه القائمة، وضعه السكني، ومصادر دخله الأخرى. هذه الأداة تستخدم المعايير التقديرية المعلنة (نسبة تتراوح بين 10% و20% من الدخل المتاح لكل طفل، حد أدنى 300 ريال شهرياً لكل مستحق، وسقف إجمالي لا يتجاوز 50% من دخل المنفق) لتعطيك نطاقاً تقريبياً للتخطيط — وليست بديلاً عن حاسبة وزارة العدل الرسمية المستخدمة فعلياً أثناء رفع الدعوى عبر منصة ناجز."
      >
        <div className="calc-grid-2">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">نفقة الأولاد</div>
            <div className="calc-metric-card__note">تُقدَّر عادة بين 10% و20% من الدخل المتاح لكل طفل، بحد أدنى 300 ريال شهرياً.</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">نفقة الزوجة</div>
            <div className="calc-metric-card__note">تُقدَّر عادة بين 10% و15% من الدخل المتاح، بحد أدنى 300 ريال شهرياً، وتسقط في حالات محددة (المادة 55).</div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="nafaqah-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن حساب النفقة في السعودية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />

      <RelatedCalculators currentSlug="nafaqah" />
    </main>
  );
}
