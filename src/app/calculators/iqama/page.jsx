import { Suspense } from 'react';

import IqamaCalculator from '@/components/calculators/IqamaCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'iqama');
const CONTENT = getFinancePageContent('iqama');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const IQAMA_TABLE = [
  { type: 'إقامة عمل — سنة', country: 'السعودية', duration: '365 يوم', grace: 'لا يوجد', fine: '100 ريال/يوم' },
  { type: 'إقامة عمل — سنتان', country: 'السعودية', duration: '730 يوم', grace: 'لا يوجد', fine: '100 ريال/يوم' },
  { type: 'تأشيرة زيارة — 90 يوم', country: 'السعودية', duration: '90 يوم', grace: 'لا يوجد', fine: '100 ريال/يوم' },
  { type: 'تأشيرة عمرة — 30 يوم', country: 'السعودية', duration: '30 يوم', grace: 'لا يوجد', fine: '100 ريال/يوم' },
  { type: 'إقامة — سنتان', country: 'الإمارات', duration: '730 يوم', grace: '30 يوم', fine: '50 درهم/يوم' },
  { type: 'إقامة ذهبية — 3 سنوات', country: 'الإمارات', duration: '1095 يوم', grace: '30 يوم', fine: '50 درهم/يوم' },
  { type: 'تأشيرة زيارة — 30 يوم', country: 'الإمارات', duration: '30 يوم', grace: '10 أيام', fine: '50 درهم/يوم' },
  { type: 'تأشيرة زيارة — 90 يوم', country: 'الإمارات', duration: '90 يوم', grace: '10 أيام', fine: '50 درهم/يوم' },
];

export default function IqamaPage() {
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
          <IqamaCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Reference table */}
      <CalculatorSection
        id="iqama-types"
        eyebrow="أنواع الإقامة والتأشيرات"
        title="مدد الإقامة والتأشيرات ومهل السماح والغرامات"
        description="جدول مرجعي لأنواع الإقامات والتأشيرات الأكثر شيوعاً في السعودية والإمارات."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>النوع</TableHead>
                <TableHead>الدولة</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>مهلة السماح</TableHead>
                <TableHead>غرامة التجاوز</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {IQAMA_TABLE.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.type}</TableCell>
                  <TableCell style={{ color: 'var(--fg-subtle)' }}>{row.country}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.grace}</TableCell>
                  <TableCell style={{ color: 'var(--destructive)', fontWeight: 600 }}>{row.fine}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="calc-note" style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)', marginTop: '0.75rem' }}>
          المعلومات مبنية على أنظمة الإقامة المعمول بها. للتأكد: منصة أبشر (السعودية) أو GDRFA (الإمارات).
        </p>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="iqama-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن الإقامة والتأشيرة في السعودية والإمارات"
        showAdBefore
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <RelatedCalculators currentSlug="iqama" />
    </main>
  );
}
