import { Suspense } from 'react';

import PregnancyCalculator from '@/components/calculators/PregnancyCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pregnancy');
const CONTENT = getFinancePageContent('pregnancy');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TRIMESTER_ROWS = [
  {
    num: 1,
    label: 'الثلث الأول',
    weeks: 'الأسبوع 1–12',
    highlight: 'تكوين الأعضاء الحيوية',
    notes: 'أهم فترة — تجنبي الأدوية غير الموصوفة',
    checks: 'فحص النوكال، تحليل دم كامل',
  },
  {
    num: 2,
    label: 'الثلث الثاني',
    weeks: 'الأسبوع 13–27',
    highlight: 'النمو والحركة الأولى',
    notes: 'أهدأ مراحل الحمل عادةً — غثيان الصباح يخف',
    checks: 'الفحص التشريحي (أسبوع 18–20)، سكر الحمل',
  },
  {
    num: 3,
    label: 'الثلث الثالث',
    weeks: 'الأسبوع 28–40',
    highlight: 'نضج الرئتين والوزن',
    notes: 'متابعة منتظمة كل 2–4 أسابيع',
    checks: 'مراقبة الوضع، اختبار النبض، تحضير الولادة',
  },
];

const MILESTONE_ROWS = [
  { week: 4,  label: 'غياب الدورة', detail: 'اختبر الحمل المنزلي وابدئي حمض الفوليك' },
  { week: 8,  label: 'أول زيارة طبيب', detail: 'تأكيد الحمل وإنشاء ملف متابعة' },
  { week: 12, label: 'نهاية الثلث الأول', detail: 'فحص النوكال — الخطر الكبير ينخفض' },
  { week: 20, label: 'الفحص التشريحي', detail: 'فحص الأعضاء وتحديد الجنس' },
  { week: 28, label: 'بداية الثلث الثالث', detail: 'الرئتان تبدآن إنتاج السورفكتانت' },
  { week: 36, label: 'الحمل شبه الكامل', detail: 'الجنين في وضع الولادة' },
  { week: 40, label: 'موعد الولادة', detail: 'EDD — التقدير النهائي' },
];

const PREGNANCY_EXPLAINER = [
  {
    title: 'قاعدة ناجيل — الأساس الطبي للحساب',
    description: 'موعد الولادة = آخر دورة + 280 يوماً',
    content:
      'قاعدة ناجيل (Naegele\'s Rule) هي الأساس الطبي المعتمد منذ 1830 وما زال الأطباء يستخدمونه. الحساب بسيط: أضيفي 280 يوماً إلى أول يوم في آخر دورة. إذا كانت دورتك أطول أو أقصر من 28 يوماً يُعدّل الحساب بالفرق. الحاسبة تفعل هذا تلقائياً.',
  },
  {
    title: 'الهجري — ميزتنا على المنافسين',
    description: 'موعد الولادة بالتقويم الهجري فوراً',
    content:
      'معظم حاسبات الحمل العربية تعطي الموعد بالميلادي فقط. هذه الحاسبة تحوّل موعد الولادة المتوقع إلى التاريخ الهجري المقابل — مفيد للأمهات اللواتي يتتبعن المناسبات والمواعيد بالتقويم الهجري في السعودية والخليج وسائر الدول العربية.',
  },
  {
    title: 'الموعد تقدير — لا ضمان بالتوقيت',
    description: 'فقط 5% من النساء يلدن في EDD',
    content:
      'الموعد المحسوب هو "التاريخ التقديري" (EDD). إحصائياً فقط 5% من الولادات تحدث في هذا اليوم تحديداً. معظم الولادات تقع بين الأسبوع 38 والأسبوع 42. السونار الأول قبل الأسبوع 14 هو الأكثر دقة في التأكيد — وإذا اختلف مع الحاسبة بأكثر من أسبوع يُفضّل اعتماد السونار.',
  },
  {
    title: 'متابعة الحمل أسبوعاً بأسبوع',
    description: 'من أسبوع 4 إلى أسبوع 40',
    content:
      'كل أسبوع من الحمل يُقابله تطور محدد في الجنين وفحوصات مطلوبة. الحاسبة تعرض محطات الحمل الرئيسية مع تواريخها المتوقعة حتى تعرفي موعد كل فحص قبل وقته وتستعدي للزيارات.',
  },
];

export default function PregnancyPage() {
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
          <PregnancyCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Explainer — why/how */}
      <CalculatorSection
        id="pregnancy-method"
        eyebrow="كيف تعمل الحاسبة"
        title="قاعدة ناجيل والتاريخ الهجري — كيف نحسب موعد الولادة"
        description="الحاسبة تعتمد على الأساس الطبي المعتمد عالمياً مع ميزة إضافية لا تقدمها معظم المنافسين: موعد الولادة بالتقويم الهجري."
      >
        <CalculatorInfoGrid items={PREGNANCY_EXPLAINER} />
      </CalculatorSection>

      {/* Trimesters table */}
      <CalculatorSection
        showAdBefore
        id="pregnancy-trimesters"
        eyebrow="مراحل الحمل الثلاثة"
        title="الثلث الأول والثاني والثالث — ما يحدث وما تتوقعينه"
        description="الحمل ثلاثة فصول — كل فصل له طبيعته وفحوصاته وما يجب الانتباه إليه. الحاسبة تخبرك أيها أنتِ فيه الآن."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>المرحلة</TableHead>
                <TableHead>الأسابيع</TableHead>
                <TableHead>الأبرز</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>الفحوصات الرئيسية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRIMESTER_ROWS.map((row) => (
                <TableRow key={row.num}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>{row.weeks}</TableCell>
                  <TableCell>{row.highlight}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.notes}</TableCell>
                  <TableCell style={{ fontSize: '0.82rem' }}>{row.checks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Milestones table */}
      <CalculatorSection
        id="pregnancy-milestones"
        eyebrow="محطات الحمل"
        title="أبرز محطات الحمل من الأسبوع 4 إلى الأسبوع 40"
        description="هذه المحطات تُحسب تلقائياً في الحاسبة بناءً على تاريخ دورتك — وتُعرض مع مواعيدها المتوقعة."
        subtle
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>الأسبوع</TableHead>
                <TableHead>المحطة</TableHead>
                <TableHead>ما يحدث</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MILESTONE_ROWS.map((m) => (
                <TableRow key={m.week}>
                  <TableCell className="font-medium">أسبوع {m.week}</TableCell>
                  <TableCell className="font-medium">{m.label}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{m.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Official references */}
      <CalculatorSection
        id="pregnancy-official"
        eyebrow="مراجع رسمية"
        title="مصادر طبية معتمدة لمتابعة حملك"
        description="استخدمي الحاسبة للتخطيط واليقظة، وارجعي للمصادر الطبية الرسمية لأي قرار صحي."
      >
        <div className="calc-official-links">
          <div className="calc-official-card">
            <p className="calc-official-title">منظمة الصحة العالمية (WHO)</p>
            <p className="calc-official-desc">دليل رعاية ما قبل الولادة ومؤشرات الرعاية الأساسية للحامل.</p>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.who.int/ar/news-room/fact-sheets/detail/maternal-mortality" target="_blank" rel="noopener noreferrer">
                راجع المصدر
              </a>
            </Button>
          </div>
          <div className="calc-official-card">
            <p className="calc-official-title">وزارة الصحة السعودية</p>
            <p className="calc-official-desc">إرشادات الرعاية الصحية للأمومة وبرامج متابعة الحمل.</p>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.moh.gov.sa" target="_blank" rel="noopener noreferrer">
                راجع المصدر
              </a>
            </Button>
          </div>
          <div className="calc-official-card">
            <p className="calc-official-title">تحويل التاريخ هجري ↔ ميلادي</p>
            <p className="calc-official-desc">إذا كانت تعرفي تاريخ دورتك بالهجري، حوّليه أولاً ثم أدخليه في الحاسبة.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/date/converter">افتح المحوّل</Link>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="pregnancy-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن الحمل وموعد الولادة"
        description="إجابات على أكثر الأسئلة شيوعاً حول حساب موعد الولادة والتقويم الهجري ومراحل الحمل."
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="pregnancy" />
    </main>
  );
}
