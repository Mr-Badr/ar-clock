import { Suspense } from 'react';

import InheritanceCalculator from '@/components/calculators/InheritanceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'inheritance');
const CONTENT = getFinancePageContent('inheritance');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SHARES_TABLE = [
  { heir: 'الزوج', cond1: '½ — بلا أولاد للميتة', cond2: '¼ — مع أولاد للميتة' },
  { heir: 'الزوجة / الزوجات (1-4)', cond1: '¼ — بلا أولاد للميت', cond2: '⅛ — مع أولاد (يتشاركن)' },
  { heir: 'الأم', cond1: '⅓ — بلا أولاد وأقل من أخوين', cond2: '⅙ — مع أولاد أو أخوين+' },
  { heir: 'الأب', cond1: '⅙ — مع ابن', cond2: '⅙ + الباقي مع بنات / الباقي بلا أولاد' },
  { heir: 'البنت (وحيدة، بلا أخ)', cond1: '½', cond2: '— (تأخذ نصف الابن مع وجوده)' },
  { heir: 'البنتان+ (بلا أخ)', cond1: '⅔ مجتمعات', cond2: '— (مع أخ: للذكر مثل حظ الأنثيين)' },
  { heir: 'الابن / الأبناء', cond1: 'العصبة — الباقي (الابن = ضعف البنت)', cond2: '—' },
  { heir: 'الأخت الشقيقة (وحدها، بلا أخ)', cond1: '½ بغياب الابن والأب', cond2: '— (مع أخ: تأخذ النصف)' },
  { heir: 'الأخوات الشقيقات (2+، بلا أخ)', cond1: '⅔ بغياب الابن والأب', cond2: '— محجوبات بالأبناء والأب' },
];

export default function InheritancePage() {
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
          <InheritanceCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Shares Reference */}
      <CalculatorSection
        id="inheritance-shares"
        eyebrow="الفروض المقدرة"
        title="جدول نصيب كل وارث وفق الفرائض الإسلامية"
        description="مستند إلى القرآن الكريم (النساء 11-12، 176) وإجماع فقهاء المذاهب الأربعة في المسائل الرئيسية."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>الوارث</TableHead>
                <TableHead>الحالة الأولى</TableHead>
                <TableHead>الحالة الثانية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SHARES_TABLE.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.heir}</TableCell>
                  <TableCell style={{ color: 'var(--fg-subtle)' }}>{row.cond1}</TableCell>
                  <TableCell style={{ color: 'var(--fg-subtle)' }}>{row.cond2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="inheritance-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن الميراث الإسلامي وتوزيع التركة"
        showAdBefore
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <RelatedCalculators currentSlug="inheritance" />
    </main>
  );
}
