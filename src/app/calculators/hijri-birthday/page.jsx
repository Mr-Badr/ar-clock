import { Suspense } from 'react';

import HijriBirthdayCalculator from '@/components/calculators/HijriBirthdayCalculator.client';
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
import { ACTIVE_CANONICAL_HOLIDAY_EVENTS } from '@/lib/holidays/repository';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'hijri-birthday');
const CONTENT = getFinancePageContent('hijri-birthday');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

// Precomputed server-side so the client bundle doesn't need the full holidays
// repository — only the slug/name/hijriMonth/hijriDay it actually uses.
const HIJRI_EVENTS_CATALOG = ACTIVE_CANONICAL_HOLIDAY_EVENTS
  .filter((event) => event.type === 'hijri' && Number.isInteger(event.hijriMonth) && Number.isInteger(event.hijriDay))
  .map((event) => ({
    slug: event.slug,
    name: event.name,
    hijriMonth: event.hijriMonth,
    hijriDay: event.hijriDay,
  }));

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function HijriBirthdayPage() {
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
          <HijriBirthdayCalculator hijriEventsCatalog={HIJRI_EVENTS_CATALOG} />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="how-it-works"
        eyebrow="طريقة الحساب"
        title="كيف تحوّل الأداة تاريخ ميلادك إلى الهجري؟"
        description="التحويل يعتمد على تقويم أم القرى المعتمد رسمياً في المملكة العربية السعودية — نفس التقويم المستخدم في حساب كل المناسبات الإسلامية على هذا الموقع، وليس تقريباً بالقسمة على متوسط طول السنة."
      >
        <div className="calc-grid-2">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">عمرك الهجري هنا</div>
            <div className="calc-metric-card__note">فرق تقويمي حقيقي: سنة وشهر ويوم هجريان فعليان بين تاريخ ميلادك واليوم.</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">حاسبات العمر بالهجري الأخرى</div>
            <div className="calc-metric-card__note">غالباً تقسم عدد أيام عمرك على 354.367 (متوسط طول السنة الهجرية) — تقريب سريع وليس فرقاً تقويمياً حقيقياً.</div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="hijri-birthday-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن ميلادك بالتقويم الهجري"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />

      <RelatedCalculators currentSlug="hijri-birthday" />
    </main>
  );
}
