import Link from 'next/link';

import MarginMarkupCalculator from '@/components/calculators/MarginMarkupCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'margin-markup');
const CONTENT = getFinancePageContent('margin-markup');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function MarginMarkupPage() {
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
    <main className="calc-product-page calc-margin-markup-page bg-base text-primary" dir="rtl" lang="ar">
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
        <MarginMarkupCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="margin-markup-difference"
        eyebrow="الفرق الجوهري"
        title="هامش الربح (Margin) مقابل نسبة الزيادة على التكلفة (Markup)"
        description="نفس الربح بالضبط، لكن رقمين مختلفين تماماً — لأن كل نسبة تُحسب من قاعدة مختلفة."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المفهوم</TableHead>
                <TableHead>يُحسب من</TableHead>
                <TableHead>الصيغة</TableHead>
                <TableHead>مثال (تكلفة 100، سعر 130)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>هامش الربح (Margin)</TableCell>
                <TableCell>سعر البيع</TableCell>
                <TableCell>(السعر − التكلفة) ÷ السعر</TableCell>
                <TableCell>(130 − 100) ÷ 130 = 23.1%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>نسبة الزيادة (Markup)</TableCell>
                <TableCell>التكلفة</TableCell>
                <TableCell>(السعر − التكلفة) ÷ التكلفة</TableCell>
                <TableCell>(130 − 100) ÷ 100 = 30%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          خطأ شائع عند التسعير: افتراض أن "زيادة 30% على التكلفة" تعطي "هامش ربح 30%" — بينما الحقيقة أن
          هامش الربح الفعلي في هذا المثال هو 23.1% فقط، لأنه يُحسب من سعر البيع الأعلى.
        </p>
      </CalculatorSection>

      <CalculatorSection
        id="margin-markup-related"
        eyebrow="أدوات ذات صلة"
        title="أدوات أخرى مفيدة لأصحاب الأعمال"
        subtle
      >
        <div className="calc-cta-actions">
          <Link href="/calculators/vat" className="btn btn-surface calc-button">احسب ضريبة القيمة المضافة</Link>
          <Link href="/calculators/percentage" className="btn btn-surface calc-button">حاسبة النسبة المئوية العامة</Link>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="margin-markup-faq"
        eyebrow="أسئلة شائعة"
        title="إجابات على أكثر أسئلة هامش الربح بحثاً"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="margin-markup-sources" subtle>
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="margin-markup" />
      </CalculatorSection>
    </main>
  );
}
