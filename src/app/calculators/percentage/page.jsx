import PercentageCalculator from '@/components/calculators/PercentageCalculator.client';
import {
  CalculatorDecisionTable,
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'percentage');
const CONTENT = getFinancePageContent('percentage');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function PercentagePage() {
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
    name: CONTENT.howTo?.name || 'كيفية استخدام حاسبة النسبة المئوية',
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
        <PercentageCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="percent-formulas"
        eyebrow="المعادلة الصحيحة"
        title="جدول قرار: أي معادلة تستخدم؟"
        description="عندما تعرف اسم المسألة يصبح الحساب سهلاً. هذا الجدول يلخص أكثر الحالات التي تظهر في الخصومات والدرجات والرواتب والأسعار."
        subtle
      >
        <CalculatorDecisionTable
          columns={['سؤالك الحقيقي', 'المعادلة المختصرة', 'مثال سريع', 'المسار داخل الصفحة']}
          rows={[
            {
              key: 'percent-of-amount',
              cells: [
                'كم يساوي X% من مبلغ؟',
                '(النسبة ÷ 100) × المبلغ',
                '20% من 500 = 100',
                'تبويب كم يساوي X%؟',
              ],
            },
            {
              key: 'part-of-whole',
              cells: [
                'كم نسبة جزء من كل؟',
                '(الجزء ÷ الكل) × 100',
                '42 من 50 = 84%',
                'تبويب كم نسبة X من Y؟',
              ],
            },
            {
              key: 'discount-or-increase',
              cells: [
                'ما السعر بعد خصم أو زيادة؟',
                'الأصل × (1 ± النسبة ÷ 100)',
                '1000 بعد خصم 25% = 750',
                'تبويب زيادة أو خفض',
              ],
            },
            {
              key: 'percent-change',
              cells: [
                'كم تغير رقم قديم إلى رقم جديد؟',
                '((الجديد - القديم) ÷ القديم) × 100',
                '100 إلى 150 = زيادة 50%',
                'تبويب نسبة التغيير',
              ],
            },
            {
              key: 'reverse-discount',
              cells: [
                'ما السعر الأصلي قبل الخصم؟',
                'السعر النهائي ÷ النسبة المتبقية',
                '400 بعد خصم 20% أصلها 500',
                'اقرأ الشرح ثم استخدم الحاسبة عكسياً',
              ],
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        showAdBefore
        id="percent-table"
        eyebrow="مرجع سريع"
        title="جدول تحويلات مفيد للحساب الذهني"
        description="هذه التحويلات لا تغني عن الحاسبة عند وجود أكثر من خطوة، لكنها تختصر الأسئلة المتكررة مثل 10% و20% و25% و50%."
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>النسبة</TableHead>
                <TableHead>الكسر</TableHead>
                <TableHead>العشري</TableHead>
                <TableHead>الاستخدام الشائع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>50%</TableCell>
                <TableCell>1/2</TableCell>
                <TableCell>0.50</TableCell>
                <TableCell>النصف</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>25%</TableCell>
                <TableCell>1/4</TableCell>
                <TableCell>0.25</TableCell>
                <TableCell>الربع</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>20%</TableCell>
                <TableCell>1/5</TableCell>
                <TableCell>0.20</TableCell>
                <TableCell>الخُمس</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10%</TableCell>
                <TableCell>1/10</TableCell>
                <TableCell>0.10</TableCell>
                <TableCell>أسهل نسبة للحساب الذهني</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5%</TableCell>
                <TableCell>1/20</TableCell>
                <TableCell>0.05</TableCell>
                <TableCell>نصف الـ10%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1%</TableCell>
                <TableCell>1/100</TableCell>
                <TableCell>0.01</TableCell>
                <TableCell>أساس حساب النسبة بدقة</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="percent-sources"
        eyebrow="المصادر والمنهج"
        title="على ماذا يعتمد شرح النسبة في هذه الصفحة؟"
        description="النسبة المئوية مفهوم رياضي ثابت، لكن طريقة عرضه للمستخدم العربي تحتاج أمثلة عملية. لذلك جمعنا بين تعريفات رياضية موثوقة وفجوات صفحات الحاسبات المنافسة."
        subtle
      >
        <div className="calc-resource-stack">
          <a className="calc-resource-link calc-resource-link--soft" href="https://www.britannica.com/topic/percentage">
            <span className="calc-resource-link__index">01</span>
            <span className="calc-resource-link__copy">
              <strong className="calc-card-title">Britannica: تعريف النسبة المئوية</strong>
              <span className="calc-card-description">مرجع تعريفي يشرح أن النسبة قيمة نسبية من أجزاء المئة، وهو الأساس الذي تبنى عليه كل المعادلات في الصفحة.</span>
            </span>
          </a>
          <a className="calc-resource-link calc-resource-link--soft" href="https://www.rapidtables.org/ar/calc/math/Percentage_Calculator.html">
            <span className="calc-resource-link__index">02</span>
            <span className="calc-resource-link__copy">
              <strong className="calc-card-title">RapidTables Arabic: أمثلة معادلات النسبة</strong>
              <span className="calc-card-description">مرجع عربي مختصر يعرض حالات النسبة من مبلغ، والنسبة من كل، والقيمة الكاملة، ونسبة التغيير.</span>
            </span>
          </a>
          <a className="calc-resource-link calc-resource-link--soft" href="https://www.mathwords.com/p/percentage.htm">
            <span className="calc-resource-link__index">03</span>
            <span className="calc-resource-link__copy">
              <strong className="calc-card-title">Mathwords: التحويل بين النسبة والعشري والكسر</strong>
              <span className="calc-card-description">مرجع تعليمي مفيد لفهم لماذا 20% تساوي 0.20، ولماذا نضرب أو نقسم على 100 في الحسابات اليومية.</span>
            </span>
          </a>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="percent-faq"
        eyebrow="قبل اعتماد النسبة"
        title="أسئلة تتكرر في الخصومات والدرجات والتغيرات"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="percent-related"
        eyebrow="بعد النسبة"
        title="حاسبات مرتبطة بالنسب والتسعير"
        description="إذا كان حساب النسبة جزءاً من فاتورة أو قرض أو مستحقات عمل، فانتقل إلى الأداة التي تكمل نفس القرار بدلاً من بدء بحث جديد."
      >
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="percentage" />
      </CalculatorSection>

    </main>
  );
}
