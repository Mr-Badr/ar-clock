import { Suspense } from 'react';

import InheritanceCalculator from '@/components/calculators/InheritanceCalculator.client';
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

const CASE_STUDIES = [
  {
    id: 'case1',
    title: 'الحالة 1 — زوجة + ابن + بنتان',
    estate: '300,000 ريال',
    heirs: [
      { name: 'الزوجة', basis: '⅛ (لوجود الأولاد)', share: '37,500 ريال' },
      { name: 'الابن', basis: 'عصبة — ضعف حظ الأنثى (2 سهم)', share: '108,333 ريال' },
      { name: 'البنت الأولى', basis: 'عصبة مع الأخ (1 سهم)', share: '54,167 ريال' },
      { name: 'البنت الثانية', basis: 'عصبة مع الأخ (1 سهم)', share: '54,167 ريال' },
    ],
    note: 'بعد نصيب الزوجة ⅛ يبقى 262,500 — تُقسَّم بين الابن والبنتين: الابن سهمان والبنتان سهم لكل منهما.',
  },
  {
    id: 'case2',
    title: 'الحالة 2 — زوج + بنتان فقط (بلا أبناء ذكور)',
    estate: '200,000 ريال',
    heirs: [
      { name: 'الزوج', basis: '¼ (لوجود الأولاد)', share: '50,000 ريال' },
      { name: 'البنتان (مجتمعتان)', basis: '⅔ (بنتان بلا أخ ذكر)', share: '133,333 ريال' },
      { name: 'الباقي', basis: '← يُرد على البنتين بنسبة حصصهما', share: '16,667 ريال' },
    ],
    note: 'الزوج ¼ = 50,000 — البنتان ⅔ = 133,333 — المجموع 183,333 فيبقى 16,667 يُرد على البنتين إذا لم يكن ثمة عاصب.',
  },
  {
    id: 'case3',
    title: 'الحالة 3 — الأم + الأب + ابن وبنت',
    estate: '600,000 ريال',
    heirs: [
      { name: 'الأم', basis: '⅙ (لوجود أولاد)', share: '100,000 ريال' },
      { name: 'الأب', basis: '⅙ (لوجود ابن)', share: '100,000 ريال' },
      { name: 'الابن', basis: 'عصبة (2 سهم من المتبقي)', share: '266,667 ريال' },
      { name: 'البنت', basis: 'عصبة مع الأخ (1 سهم)', share: '133,333 ريال' },
    ],
    note: 'الأم ⅙ + الأب ⅙ = 200,000. يتبقى 400,000 للابن والبنت بنسبة 2:1.',
  },
];

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

      {/* Case walk-throughs */}
      <CalculatorSection
        id="inheritance-cases"
        eyebrow="أمثلة محلولة"
        title="ثلاث حالات محلولة بالأرقام — خطوة بخطوة"
        description="الأمثلة أدناه تُطبّق الجدول العلوي على مسائل واقعية. استخدمها مرجعاً لمقارنة نتيجة الحاسبة أو للتحقق من الحساب قبل التوثيق الرسمي."
      >
        <div className="calc-article-grid">
          {CASE_STUDIES.map((cs) => (
            <article key={cs.id} className="calc-article-block" style={{ gridColumn: '1 / -1' }}>
              <h3>{cs.title} — تركة: {cs.estate}</h3>
              <div className="calc-table-wrap">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead>الوارث</TableHead>
                      <TableHead>أساس الاستحقاق</TableHead>
                      <TableHead>المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cs.heirs.map((h, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{h.name}</TableCell>
                        <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{h.basis}</TableCell>
                        <TableCell className="font-medium" style={{ color: 'var(--green)' }}>{h.share}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="calc-note" style={{ fontSize: '0.82rem', color: 'var(--fg-subtle)', marginTop: '0.5rem' }}>
                {cs.note}
              </p>
            </article>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="inheritance-caveats"
        eyebrow="قبل التوثيق الرسمي"
        title="ملاحظات جوهرية قبل الاعتماد على النتيجة قانونياً"
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>الحاسبة تُطبّق الفرائض الفقهية القياسية</h3>
            <p>تستند الحاسبة إلى المذاهب الأربعة في مسائل الأغلبية. مسائل الرد والعَوْل والوصايا وبعض الحالات الخاصة (المفقود، الحمل، الخنثى) تحتاج مراجعة فقيه أو محكمة أحوال شخصية.</p>
          </article>
          <article className="calc-article-block">
            <h3>التركة الفعلية قد تختلف عن المُعلنة</h3>
            <p>يجب خصم الديون والنفقات الواجبة وتكاليف التجهيز والوصية (بحد أقصى ⅓) قبل توزيع التركة. ما يُوزَّع هو الصافي بعد هذه الخصومات.</p>
          </article>
          <article className="calc-article-block">
            <h3>للتوثيق الرسمي: المحكمة هي الجهة المختصة</h3>
            <p>صك الإرث يُصدره القضاء أو الجهة المختصة في دولتك. في السعودية: المحاكم الشرعية. في الإمارات: محاكم الأحوال الشخصية. الحاسبة للاستيعاب والتخطيط الأولي — لا تُغني عن التوثيق القانوني.</p>
          </article>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="inheritance-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن الميراث الإسلامي وتوزيع التركة"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="inheritance" />
    </main>
  );
}
