import { Suspense } from 'react';

import NetSalaryCalculator from '@/components/calculators/NetSalaryCalculator.client';
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
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'net-salary');
const CONTENT = getFinancePageContent('net-salary');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const GOSI_EXAMPLES = [
  { basic: '5,000', housing: '1,500', nationality: 'سعودي', gosiBase: '6,500', deduction: '585', net: '6,500' },
  { basic: '8,000', housing: '2,000', nationality: 'سعودي', gosiBase: '10,000', deduction: '900', net: '9,100' },
  { basic: '15,000', housing: '5,000', nationality: 'سعودي', gosiBase: '20,000', deduction: '1,800', net: '19,200' },
  { basic: '40,000', housing: '10,000', nationality: 'سعودي (محدود)', gosiBase: '45,000 (سقف)', deduction: '4,050', net: '46,950' },
  { basic: '8,000', housing: '2,000', nationality: 'غير سعودي', gosiBase: '—', deduction: '0', net: '10,000' },
];

const GOSI_COMPONENTS = [
  { component: 'الراتب الأساسي', intoBase: 'نعم', notes: 'دائماً يدخل في وعاء GOSI' },
  { component: 'بدل السكن', intoBase: 'نعم', notes: 'يدخل في وعاء GOSI وفق اللوائح' },
  { component: 'بدل النقل', intoBase: 'لا', notes: 'لا يدخل في وعاء GOSI' },
  { component: 'بدل الاتصالات', intoBase: 'لا', notes: 'لا يدخل في وعاء GOSI' },
  { component: 'بدل الأداء / الحوافز', intoBase: 'قد يدخل', notes: 'يعتمد على صياغة العقد' },
  { component: 'العمولات الثابتة', intoBase: 'قد يدخل', notes: 'إذا كانت راتباً ثابتاً يدخل' },
];

export default function NetSalaryPage() {
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
          <NetSalaryCalculator />
        </Suspense>
      </CalculatorHero>

      {/* GOSI components table */}
      <CalculatorSection
        id="gosi-components"
        eyebrow="وعاء GOSI"
        title="ما الذي يدخل في وعاء GOSI وما الذي لا يدخل؟"
        description="ليس كل ما تتقاضاه يخضع لخصم GOSI — هذا الجدول يوضح ما يُحسب في الوعاء."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>المكوّن</TableHead>
                <TableHead>يدخل في وعاء GOSI؟</TableHead>
                <TableHead>ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GOSI_COMPONENTS.map((row) => (
                <TableRow key={row.component}>
                  <TableCell className="font-medium">{row.component}</TableCell>
                  <TableCell style={{ color: row.intoBase === 'نعم' ? 'var(--destructive)' : row.intoBase === 'لا' ? 'var(--green)' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {row.intoBase}
                  </TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Examples table */}
      <CalculatorSection
        showAdBefore
        id="gosi-examples"
        eyebrow="أمثلة عملية"
        title="أمثلة محسوبة على صافي الراتب بعد GOSI"
        description="أرقام محسوبة بدقة لرواتب شائعة — الخصم 9% من الراتب الأساسي وبدل السكن للسعوديين."
        subtle
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>أساسي (ريال)</TableHead>
                <TableHead>سكن (ريال)</TableHead>
                <TableHead>الجنسية</TableHead>
                <TableHead>وعاء GOSI</TableHead>
                <TableHead>خصم 9%</TableHead>
                <TableHead>الصافي (ريال)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GOSI_EXAMPLES.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.basic}</TableCell>
                  <TableCell>{row.housing}</TableCell>
                  <TableCell>{row.nationality}</TableCell>
                  <TableCell>{row.gosiBase}</TableCell>
                  <TableCell style={{ color: 'var(--destructive)' }}>−{row.deduction}</TableCell>
                  <TableCell className="font-medium" style={{ color: 'var(--green)' }}>{row.net}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Related tools */}
      <CalculatorSection
        id="related-salary"
        eyebrow="أدوات مكملة"
        title="أدوات رواتب أخرى قد تحتاجها"
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="calc-official-card" style={{ flex: '1', minWidth: '220px' }}>
            <p className="calc-official-title">حاسبة مكافأة نهاية الخدمة</p>
            <p className="calc-official-desc">احسب حقوقك كاملةً عند انتهاء العقد أو الاستقالة.</p>
            <Link href="/calculators/end-of-service-benefits" className="btn btn-outline btn-sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              افتح الحاسبة
            </Link>
          </div>
          <div className="calc-official-card" style={{ flex: '1', minWidth: '220px' }}>
            <p className="calc-official-title">حاسبة الراتب الشهري</p>
            <p className="calc-official-desc">حوّل راتبك بين الشهري واليومي والساعي والسنوي.</p>
            <Link href="/calculators/salary" className="btn btn-outline btn-sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              افتح الحاسبة
            </Link>
          </div>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="net-salary-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن GOSI وصافي الراتب"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <RelatedCalculators currentSlug="net-salary" />
    </main>
  );
}
