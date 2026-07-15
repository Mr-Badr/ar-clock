import { Suspense } from 'react';

import GpaCalculator from '@/components/calculators/GpaCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gpa');
const CONTENT = getFinancePageContent('gpa');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SCALE_COMPARISON_ROWS = [
  { from5: '4.75–5.0',   from4: '3.67–4.0',  from100: '90–100',  label: 'ممتاز',    labelEn: 'Excellent' },
  { from5: '3.75–4.74',  from4: '3.33–3.66', from100: '80–89',   label: 'جيد جداً', labelEn: 'Very Good' },
  { from5: '2.75–3.74',  from4: '3.0–3.32',  from100: '70–79',   label: 'جيد',       labelEn: 'Good' },
  { from5: '2.0–2.74',   from4: '2.0–2.99',  from100: '60–69',   label: 'مقبول',     labelEn: 'Pass' },
  { from5: 'أقل من 2',   from4: 'أقل من 2',  from100: 'أقل من 60', label: 'راسب',   labelEn: 'Fail' },
];

const CONVERSION_ROWS = [
  { from5: '5.0', from4: '4.0', from100: '100', label: 'أعلى درجة' },
  { from5: '4.75', from4: '3.8', from100: '95', label: 'ممتاز' },
  { from5: '4.5', from4: '3.6', from100: '90', label: 'جيد جداً+' },
  { from5: '4.0', from4: '3.2', from100: '80', label: 'جيد جداً' },
  { from5: '3.5', from4: '2.8', from100: '70', label: 'جيد' },
  { from5: '2.5', from4: '2.0', from100: '60', label: 'مقبول' },
];

const GPA_EXPLAINER = [
  {
    title: 'المعدل المرجّح — لماذا الساعات مهمة',
    description: 'مادة بـ3 ساعات تؤثر أكثر من مادة بساعتين',
    content:
      'المعدل التراكمي ليس متوسطاً بسيطاً للدرجات. كل مادة تُضرب درجتها في عدد ساعاتها المعتمدة، ثم يُقسَّم المجموع على إجمالي الساعات. هذا يعني أن مادة صعبة بـ4 ساعات تؤثر في معدلك أكثر من مادة اختيارية بساعة واحدة.',
  },
  {
    title: 'خطة رفع المعدل — اعرف الرقم قبل الفصل',
    description: 'ما الدرجة المطلوبة لأصل إلى هدفي؟',
    content:
      'ميزة "خطة رفع المعدل" تحسب الدرجة الوسطى المطلوبة في الفصل القادم للوصول إلى معدل بعينه. أدخل معدلك الحالي وساعاتك المجتازة، ثم حدد الهدف وساعات الفصل القادم — وستعرف فوراً إذا كان هدفك قابلاً للتحقيق.',
  },
  {
    title: 'أنظمة التقييم المختلفة في الجامعات العربية',
    description: 'من 5 (خليجي) ومن 4 (دولي) ومن 100 (مئوي)',
    content:
      'معظم الجامعات السعودية والخليجية تعتمد نظام من 5. الجامعات ذات المنهج الأمريكي أو الكندي تستخدم من 4. الجامعات المصرية والمغربية وبعض الأردنية والسورية تعتمد النسبة المئوية من 100. التحويل بين الأنظمة تقريبي — لا يُعتمد للتوثيق الرسمي دون شهادة رسمية.',
  },
  {
    title: 'الحد الأدنى للمنح والدراسات العليا',
    description: 'ما المعدل الكافي للتقديم؟',
    content:
      'معظم منح الدراسات العليا في الخليج والغرب تشترط 3.5 من 5 أو 2.8 من 4 كحد أدنى. برامج الطب والقانون عادةً 4.0 من 5. برامج الدراسات العليا الأكاديمية (ماجستير/دكتوراه) تطلب 4.0–4.5 من 5 أو ما يعادله. راجع المتطلبات الدقيقة في موقع الجامعة أو الجهة الممنوحة.',
  },
];

export default function GpaPage() {
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
    <main className="calc-product-page calc-gpa-page bg-base text-primary" dir="rtl" lang="ar">
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
          <GpaCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Explainer */}
      <CalculatorSection
        id="gpa-how"
        eyebrow="كيف يُحسب المعدل"
        title="المعدل المرجّح والخطة — كيف تعمل الحاسبة"
        description="الحاسبة لا تجمع الدرجات وتقسمها — تأخذ وزن كل مادة بساعاتها للوصول إلى المعدل الدقيق."
      >
        <CalculatorInfoGrid items={GPA_EXPLAINER} />
      </CalculatorSection>

      {/* Classifications table */}
      <CalculatorSection
        id="gpa-classifications"
        eyebrow="جدول التصنيفات"
        title="تصنيفات المعدل في الأنظمة الثلاثة"
        description="جدول مقارن يظهر ما يقابل تصنيف 'ممتاز' و'جيد جداً' وغيرها في كل نظام."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>التصنيف</TableHead>
                <TableHead>من 5 (خليجي)</TableHead>
                <TableHead>من 4 (دولي)</TableHead>
                <TableHead>من 100 (مئوي)</TableHead>
                <TableHead>بالإنجليزية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SCALE_COMPARISON_ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell dir="ltr" style={{ textAlign: 'center' }}>{row.from5}</TableCell>
                  <TableCell dir="ltr" style={{ textAlign: 'center' }}>{row.from4}</TableCell>
                  <TableCell dir="ltr" style={{ textAlign: 'center' }}>{row.from100}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.labelEn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Conversion table */}
      <CalculatorSection
        id="gpa-convert"
        eyebrow="تحويل المعدل"
        title="جدول تحويل المعدل بين الأنظمة (تقريبي)"
        description="استخدم هذا الجدول كمرجع أولي — التحويل الرسمي يستلزم وثيقة من مكتب اعتماد رسمي."
        subtle
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>من 5</TableHead>
                <TableHead>التقريب من 4</TableHead>
                <TableHead>التقريب من 100</TableHead>
                <TableHead>ملاحظة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CONVERSION_ROWS.map((row) => (
                <TableRow key={row.from5}>
                  <TableCell className="font-medium" dir="ltr">{row.from5}</TableCell>
                  <TableCell dir="ltr">{row.from4}</TableCell>
                  <TableCell dir="ltr">{row.from100}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)', marginTop: '0.75rem' }}>
          * هذا التحويل تقريبي بمعادلة النسبة البسيطة. لأغراض القبول والمنح استخدمي أداة WES أو وثيقة اعتماد رسمية.
        </p>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="gpa-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن حساب المعدل التراكمي"
        description="إجابات على أكثر الأسئلة شيوعاً حول GPA وأنظمة التقييم الجامعي العربية."
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="gpa" />
    </main>
  );
}
