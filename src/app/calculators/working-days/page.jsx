import Link from 'next/link';

import WorkingDaysCalculator from '@/components/calculators/WorkingDaysCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'working-days');
const CONTENT = getFinancePageContent('working-days');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function WorkingDaysPage() {
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
    <main className="calc-product-page calc-working-days-page bg-base text-primary" dir="rtl" lang="ar">
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
        <WorkingDaysCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="working-days-weekends"
        eyebrow="عطلة نهاية الأسبوع حسب الدولة"
        title="عطلة نهاية الأسبوع تختلف بين دول الخليج — وبعض الأدوات لا تزال تستخدم بيانات قديمة"
        description="الإمارات وقطر انتقلتا إلى عطلة السبت والأحد في يناير 2022. أي حاسبة لا تزال تحسب الجمعة والسبت لهاتين الدولتين تعطيك نتيجة خاطئة."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدولة</TableHead>
                <TableHead>عطلة نهاية الأسبوع</TableHead>
                <TableHead>منذ متى</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>السعودية</TableCell>
                <TableCell>الجمعة والسبت</TableCell>
                <TableCell>ثابتة</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الإمارات</TableCell>
                <TableCell>السبت والأحد</TableCell>
                <TableCell>منذ يناير 2022</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>قطر</TableCell>
                <TableCell>السبت والأحد</TableCell>
                <TableCell>منذ يناير 2022</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الكويت</TableCell>
                <TableCell>الجمعة والسبت</TableCell>
                <TableCell>ثابتة</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>البحرين</TableCell>
                <TableCell>الجمعة والسبت</TableCell>
                <TableCell>ثابتة</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>سلطنة عُمان</TableCell>
                <TableCell>الجمعة والسبت</TableCell>
                <TableCell>ثابتة</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>مصر</TableCell>
                <TableCell>الجمعة والسبت</TableCell>
                <TableCell>ثابتة</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الأردن</TableCell>
                <TableCell>الجمعة والسبت</TableCell>
                <TableCell>ثابتة</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="working-days-uses"
        eyebrow="استخدامات عملية"
        title="متى تحتاج حساب أيام العمل الفعلية؟"
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>مواعيد تسليم المشاريع</h3>
            <p>
              عند تحديد موعد تسليم عمل يستغرق "10 أيام عمل"، تحتاج معرفة التاريخ الفعلي بعد استبعاد عطلة
              نهاية الأسبوع — لا مجرد إضافة 10 أيام تقويمية.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>مهلة قانونية أو تعاقدية</h3>
            <p>
              العديد من المهل القانونية والتعاقدية (الرد على عرض، تقديم اعتراض، سداد فاتورة) تُحسب بأيام
              العمل الفعلية، لا الأيام التقويمية.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>حساب أجر العمل الحر بالساعة أو اليوم</h3>
            <p>
              إذا كنت تعمل بنظام اليومية أو تحسب تكلفة مشروع بعدد أيام العمل، فإن استبعاد عطلة نهاية
              الأسبوع يمنحك تقديراً دقيقاً بدل تقدير تقريبي.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>التخطيط للسفر أو الإجازات</h3>
            <p>
              معرفة عدد أيام العمل الفعلية بين تاريخين يساعدك على تخطيط إجازتك أو رحلتك دون التأثير على
              التزاماتك المهنية.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="working-days-related"
        eyebrow="أدوات ذات صلة"
        title="أدوات أخرى مفيدة"
        subtle
      >
        <div className="calc-cta-actions">
          <Link href="/date" className="btn btn-surface calc-button">حاسبات التاريخ والتحويل الهجري</Link>
          <Link href="/holidays" className="btn btn-surface calc-button">تحقق من المناسبات والإجازات الرسمية</Link>
          <Link href="/calculators/annual-leave" className="btn btn-surface calc-button">احسب رصيد إجازتك السنوية</Link>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="working-days-faq"
        eyebrow="أسئلة شائعة"
        title="إجابات على أكثر أسئلة أيام العمل بحثاً"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="working-days-sources" subtle>
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="working-days" />
      </CalculatorSection>
    </main>
  );
}
