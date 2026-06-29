import { Suspense } from 'react';

import PregnancyWeeksCalculator from '@/components/calculators/PregnancyWeeksCalculator.client';
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
import SectionSkeleton from '@/components/shared/SectionSkeleton';
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pregnancy-weeks');
const CONTENT = getFinancePageContent('pregnancy-weeks');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const WEEKS_TO_MONTHS = [
  { weeks: '1–4',   month: 'الشهر الأول',  trimester: 'الثلث الأول',   notes: 'بداية تشكّل الجنين — أهم مرحلة' },
  { weeks: '5–8',   month: 'الشهر الثاني', trimester: 'الثلث الأول',   notes: 'الغثيان يبدأ — أبدأ حمض الفوليك' },
  { weeks: '9–12',  month: 'الشهر الثالث', trimester: 'الثلث الأول',   notes: 'فحص النوكال — نهاية الثلث الأول' },
  { weeks: '13–16', month: 'الشهر الرابع', trimester: 'الثلث الثاني',  notes: 'الغثيان يخف — أول حركات' },
  { weeks: '17–20', month: 'الشهر الخامس', trimester: 'الثلث الثاني',  notes: 'الفحص التشريحي المفصّل والجنس' },
  { weeks: '21–24', month: 'الشهر السادس', trimester: 'الثلث الثاني',  notes: 'الجنين يسمع ويستجيب' },
  { weeks: '25–28', month: 'الشهر السابع', trimester: 'الثلث الثاني',  notes: 'بداية الثلث الثالث — فحص السكر' },
  { weeks: '29–32', month: 'الشهر الثامن', trimester: 'الثلث الثالث',  notes: 'الرئتان تنضجان — فحوصات مكثّفة' },
  { weeks: '33–36', month: 'الشهر التاسع', trimester: 'الثلث الثالث',  notes: 'الجنين يتهيأ للوضع — زيارات أسبوعية' },
  { weeks: '37–40', month: 'الشهر العاشر', trimester: 'الثلث الثالث',  notes: 'حمل كامل — الولادة منتظرة' },
];

export default function PregnancyWeeksPage() {
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
    <main className="calc-product-page calc-pregnancy-page bg-base text-primary" dir="rtl" lang="ar">
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
          <PregnancyWeeksCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Weeks-to-months table */}
      <CalculatorSection
        id="weeks-months-table"
        eyebrow="الأسابيع والأشهر"
        title="تحويل أسابيع الحمل إلى أشهر — الجدول الكامل"
        description="الحمل 40 أسبوعاً يتوزع على ثلاثة أثلاث وعشرة أشهر — هذا الجدول يساعدك على إجابة سؤال «أنا في أي شهر؟» بدقة."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>الأسابيع</TableHead>
                <TableHead>الشهر</TableHead>
                <TableHead>الثلث</TableHead>
                <TableHead>أبرز ما يحدث</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WEEKS_TO_MONTHS.map((row) => (
                <TableRow key={row.weeks}>
                  <TableCell className="font-medium">{row.weeks}</TableCell>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell>{row.trimester}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Link to pregnancy calculator */}
      <CalculatorSection
        showAdBefore
        id="full-pregnancy-calc"
        eyebrow="أداة مكملة"
        title="تريدين معرفة موعد الولادة بالهجري والميلادي؟"
        description="حاسبة الحمل الكاملة تضيف موعد الولادة المتوقع بالتاريخ الهجري ومحطات الحمل التفصيلية."
        subtle
      >
        <div className="calc-official-card" style={{ maxWidth: '420px' }}>
          <p className="calc-official-title">حاسبة الحمل وموعد الولادة بالهجري</p>
          <p className="calc-official-desc">نفس المدخلات — تضيف موعد الولادة بالميلادي والهجري وعرض محطات أكثر تفصيلاً.</p>
          <Link href="/calculators/pregnancy" className="btn btn-outline btn-sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            افتح الحاسبة الكاملة
          </Link>
        </div>
      </CalculatorSection>

      {/* Medical disclaimer */}
      <CalculatorSection
        id="pregnancy-disclaimer"
        eyebrow="ملاحظة طبية"
        title="هذه الحاسبة استرشادية — الطبيب هو المرجع"
        description="النتائج مبنية على قاعدة ناجيل الطبية المعتمدة، لكن الظروف الفردية تختلف."
      >
        <div style={{ background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', maxWidth: '600px', lineHeight: 1.7, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          <p>الحاسبة تستخدم قاعدة ناجيل (Naegele&apos;s Rule) وهي المعيار الطبي العالمي لتقدير موعد الولادة وأسبوع الحمل. النتائج تقديرية — السونار في الأسبوع 8–14 هو الأدق لتأكيد أسبوع الحمل. راجعي طبيبك أو قابلتك لأي قرار صحي.</p>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="pregnancy-weeks-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن أسابيع الحمل"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="pregnancy-weeks" />
    </main>
  );
}
