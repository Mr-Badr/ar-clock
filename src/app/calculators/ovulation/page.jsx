import { Suspense } from 'react';

import OvulationCalculator from '@/components/calculators/OvulationCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  RelatedCalculators,
  CalculatorSources,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'ovulation');
const CONTENT = getFinancePageContent('ovulation');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const CYCLE_OVULATION_ROWS = [
  { cycle: 21, ovulation: 7,  fertile: '2–7',   nextPeriod: 'اليوم 21' },
  { cycle: 25, ovulation: 11, fertile: '6–11',  nextPeriod: 'اليوم 25' },
  { cycle: 28, ovulation: 14, fertile: '9–14',  nextPeriod: 'اليوم 28' },
  { cycle: 30, ovulation: 16, fertile: '11–16', nextPeriod: 'اليوم 30' },
  { cycle: 32, ovulation: 18, fertile: '13–18', nextPeriod: 'اليوم 32' },
  { cycle: 35, ovulation: 21, fertile: '16–21', nextPeriod: 'اليوم 35' },
];

const OVULATION_EXPLAINER = [
  {
    title: 'المرحلة الأصفرية — ثابتة 14 يوماً',
    description: 'التبويض = طول الدورة − 14',
    content:
      'المرحلة الأصفرية (Luteal Phase) هي الفترة بين التبويض ونزول الدورة التالية. تثبت تقريباً عند 14 يوماً لمعظم النساء. لذا إذا كانت دورتك 30 يوماً فالتبويض في اليوم 16، وإذا 28 يوماً ففي اليوم 14. هذا هو أساس حساب الحاسبة.',
  },
  {
    title: 'الفترة الخصبة — 6 أيام في الشهر',
    description: '5 أيام قبل التبويض + يوم التبويض',
    content:
      'الحيوانات المنوية تعيش 3–5 أيام في الرحم، لذا الإخصاب ممكن حتى إذا حدث الجماع قبل التبويض. البويضة تبقى صالحة فقط 12–24 ساعة بعد التبويض. بمعنى أن أفضل فرص الحمل هي في آخر يومين قبل التبويض ويوم التبويض نفسه.',
  },
  {
    title: 'الهجري — موعد التبويض بالتقويمين',
    description: 'التاريخ الهجري المقابل تلقائياً',
    content:
      'هذه الحاسبة تعطي موعد التبويض والفترة الخصبة بالميلادي والهجري — مفيد للنساء اللواتي يتابعن مواعيدهن بالتقويم الهجري في الخليج وسائر الدول العربية. معظم الأدوات المنافسة تعطي الميلادي فقط.',
  },
  {
    title: 'تأكيد التبويض — ما وراء الحاسبة',
    description: 'اختبار LH أدق من أي حاسبة',
    content:
      'الحاسبة تعطي تقديراً بناءً على طول الدورة. للتأكيد الفعلي: استخدمي اختبار LH (Luteinizing Hormone) من الصيدلية — يرصد الموجة الهرمونية قبل 24–36 ساعة من التبويض. أو قيسي درجة حرارة الجسم الأساسية كل صباح — ترتفع 0.2–0.5 درجة بعد التبويض مباشرة.',
  },
];

export default function OvulationPage() {
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
    <main className="calc-product-page calc-ovulation-page bg-base text-primary" dir="rtl" lang="ar">
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
          <OvulationCalculator />
        </Suspense>
      </CalculatorHero>

      {/* How it works */}
      <CalculatorSection
        id="ovulation-method"
        eyebrow="كيف تعمل الحاسبة"
        title="المرحلة الأصفرية وقاعدة الـ14 يوماً"
        description="قاعدة واحدة تحكم التبويض في أغلب الدورات — والحاسبة تطبقها مع ضبط طول الدورة للدقة الأعلى."
      >
        <CalculatorInfoGrid items={OVULATION_EXPLAINER} />
      </CalculatorSection>

      {/* Ovulation by cycle length table */}
      <CalculatorSection
        showAdBefore
        id="ovulation-table"
        eyebrow="جدول التبويض"
        title="يوم التبويض والفترة الخصبة حسب طول الدورة"
        description="جدول مرجعي سريع — ابحثي عن طول دورتك لمعرفة يوم التبويض المتوقع بدون الحاجة للإدخال."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>طول الدورة</TableHead>
                <TableHead>يوم التبويض المتوقع</TableHead>
                <TableHead>الأيام الخصبة</TableHead>
                <TableHead>الدورة التالية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CYCLE_OVULATION_ROWS.map((row) => (
                <TableRow key={row.cycle}>
                  <TableCell className="font-medium">{row.cycle} يوم</TableCell>
                  <TableCell className="font-medium">اليوم {row.ovulation}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem' }}>الأيام {row.fertile}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.nextPeriod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)', marginTop: '0.75rem' }}>
          * الأيام تُحسب من أول يوم في الدورة الشهرية.
        </p>
      </CalculatorSection>

      {/* Internal links */}
      <CalculatorSection
        id="ovulation-links"
        eyebrow="أدوات مرتبطة"
        title="بعد معرفة موعد التبويض — ما التالي؟"
        description="انتقلي بين أدواتنا الصحية لتكتمل الصورة."
        subtle
      >
        <div className="calc-official-links">
          <div className="calc-official-card">
            <p className="calc-official-title">حاسبة الحمل وموعد الولادة</p>
            <p className="calc-official-desc">بعد الحمل، احسبي موعد الولادة بالهجري والميلادي وتابعي أسابيع حملك.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/calculators/pregnancy">افتح الحاسبة</Link>
            </Button>
          </div>
          <div className="calc-official-card">
            <p className="calc-official-title">تحويل التاريخ هجري ↔ ميلادي</p>
            <p className="calc-official-desc">حوّلي تاريخ الدورة من هجري لميلادي قبل الإدخال في الحاسبة.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/date/converter">افتح المحوّل</Link>
            </Button>
          </div>
          <div className="calc-official-card">
            <p className="calc-official-title">منظمة الصحة العالمية</p>
            <p className="calc-official-desc">دليل الصحة الإنجابية ومعايير الرعاية من المرجع الطبي الأول عالمياً.</p>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.who.int/ar" target="_blank" rel="noopener noreferrer">راجع المصدر</a>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="ovulation-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن التبويض والخصوبة"
        description="إجابات طبية موثوقة على أكثر الأسئلة شيوعاً حول التبويض وفرص الحمل."
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="ovulation" />
    </main>
  );
}
