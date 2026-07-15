import { Suspense } from 'react';

import GpaToPercentCalculator from '@/components/calculators/GpaToPercentCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GPA_SYSTEMS } from '@/lib/calculators/gpa';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import SectionSkeleton from '@/components/shared/SectionSkeleton';
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gpa-to-percent');
const CONTENT = getFinancePageContent('gpa-to-percent');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SCALE5_TABLE = [
  { gpa: '5.0',       label: 'A+ ممتاز+', pct: '97.5%', classification: 'ممتاز' },
  { gpa: '4.75',      label: 'A ممتاز',   pct: '92.5%', classification: 'ممتاز' },
  { gpa: '4.5',       label: 'B+ جيد جداً+', pct: '87%',  classification: 'جيد جداً' },
  { gpa: '4.0',       label: 'B جيد جداً',  pct: '82%',  classification: 'جيد جداً' },
  { gpa: '3.5',       label: 'C+ جيد+',    pct: '77%',  classification: 'جيد' },
  { gpa: '3.0',       label: 'C جيد',      pct: '72%',  classification: 'جيد' },
  { gpa: '2.5',       label: 'D+ مقبول+',  pct: '67%',  classification: 'مقبول' },
  { gpa: '2.0',       label: 'D مقبول',    pct: '62%',  classification: 'مقبول' },
  { gpa: 'أقل من 2', label: 'F راسب',     pct: 'أقل من 60%', classification: 'راسب' },
];

const SCALE4_TABLE = [
  { gpa: '4.0',   label: 'A ممتاز',     pct: '93–100%', classification: 'Summa Cum Laude' },
  { gpa: '3.7',   label: 'A−',          pct: '90–92%',  classification: 'Magna Cum Laude' },
  { gpa: '3.3',   label: 'B+ جيد جداً', pct: '87–89%',  classification: 'Cum Laude' },
  { gpa: '3.0',   label: 'B جيد',       pct: '83–86%',  classification: 'Pass' },
  { gpa: '2.7',   label: 'B−',          pct: '80–82%',  classification: 'Pass' },
  { gpa: '2.3',   label: 'C+',          pct: '77–79%',  classification: 'Pass' },
  { gpa: '2.0',   label: 'C مقبول',     pct: '73–76%',  classification: 'Pass' },
  { gpa: '1.0',   label: 'D',           pct: '60–72%',  classification: 'Minimum Pass' },
  { gpa: 'أقل من 1', label: 'F راسب',  pct: 'أقل من 60%', classification: 'Fail' },
];

export default function GpaToPercentPage() {
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
          <GpaToPercentCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Scale 5 table */}
      <CalculatorSection
        id="scale5-table"
        eyebrow="نظام من 5 — الخليجي"
        title="جدول تحويل المعدل من 5 إلى نسبة مئوية"
        description="النظام المعتمد في معظم جامعات السعودية والكويت وقطر والإمارات والبحرين وعمان."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>المعدل (من 5)</TableHead>
                <TableHead>الدرجة</TableHead>
                <TableHead>النسبة المئوية</TableHead>
                <TableHead>التصنيف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SCALE5_TABLE.map((row) => (
                <TableRow key={row.gpa}>
                  <TableCell className="font-medium">{row.gpa}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="font-medium">{row.pct}</TableCell>
                  <TableCell>{row.classification}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Scale 4 table */}
      <CalculatorSection
        id="scale4-table"
        eyebrow="نظام من 4 — الدولي"
        title="جدول تحويل المعدل من 4 إلى نسبة مئوية"
        description="النظام الأمريكي والدولي المعتمد في الجامعات الغربية والجامعات الدولية في الخليج."
        subtle
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>المعدل (من 4)</TableHead>
                <TableHead>الدرجة</TableHead>
                <TableHead>النسبة المئوية</TableHead>
                <TableHead>التصنيف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SCALE4_TABLE.map((row) => (
                <TableRow key={row.gpa}>
                  <TableCell className="font-medium">{row.gpa}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="font-medium">{row.pct}</TableCell>
                  <TableCell>{row.classification}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Scale 20 (Maghrebi) table */}
      <CalculatorSection
        id="scale20-table"
        eyebrow="نظام من 20 — المغاربي"
        title="جدول تحويل المعدل من 20 إلى نسبة مئوية"
        description="النظام الفرنسي المعتمد في المغرب والجزائر وتونس ولبنان — تحويل خطي مباشر (المعدل ÷ 20 × 100)."
        subtle
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>المعدل (من 20)</TableHead>
                <TableHead>النسبة المئوية</TableHead>
                <TableHead>التصنيف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GPA_SYSTEMS.scale20.classifications.map((c) => (
                <TableRow key={c.label + c.min}>
                  <TableCell className="font-medium">{c.min}–{c.max}</TableCell>
                  <TableCell className="font-medium">{Math.round((c.min / 20) * 100)}–{Math.round((c.max / 20) * 100)}%</TableCell>
                  <TableCell>{c.label} — {c.labelEn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Scale 10 (secondary) table */}
      <CalculatorSection
        id="scale10-table"
        eyebrow="نظام من 10 — الثانوي"
        title="جدول تحويل المعدل من 10 إلى نسبة مئوية"
        description="مستخدم في بعض شهادات الثانوية العامة — تحويل خطي مباشر (المعدل ÷ 10 × 100)."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>المعدل (من 10)</TableHead>
                <TableHead>النسبة المئوية</TableHead>
                <TableHead>التصنيف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GPA_SYSTEMS.scale10.classifications.map((c) => (
                <TableRow key={c.label + c.min}>
                  <TableCell className="font-medium">{c.min}–{c.max}</TableCell>
                  <TableCell className="font-medium">{Math.round(c.min * 10)}–{Math.round(c.max * 10)}%</TableCell>
                  <TableCell>{c.label} — {c.labelEn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Link to GPA calculator */}
      <CalculatorSection
        id="related-gpa"
        eyebrow="أداة مكملة"
        title="لم تحسب معدلك بعد؟ استخدم حاسبة GPA أولاً"
        description="إذا كنت تريد حساب معدلك من مواد الفصل أولاً ثم تحويله، ابدأ بحاسبة المعدل التراكمي."
      >
        <div className="calc-official-card" style={{ maxWidth: '400px' }}>
          <p className="calc-official-title">حاسبة المعدل التراكمي GPA</p>
          <p className="calc-official-desc">احسب معدلك من 5 أو 4 أو 100 من مواد الفصل، ثم عُد هنا للتحويل.</p>
          <Link href="/calculators/gpa" className="btn btn-outline btn-sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            افتح الحاسبة
          </Link>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="gpa-pct-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن تحويل المعدل إلى نسبة مئوية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="gpa-to-percent" />
    </main>
  );
}
