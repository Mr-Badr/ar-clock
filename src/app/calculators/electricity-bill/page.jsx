import { Suspense } from 'react';

import ElectricityBillCalculator from '@/components/calculators/ElectricityBillCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'electricity-bill');
const CONTENT = getFinancePageContent('electricity-bill');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SA_TIERS = [
  { tier: '1', from: '0', to: '2,000 kWh', rate: '0.05 ريال', typical: 'أسرة صغيرة (شقة)' },
  { tier: '2', from: '2,001', to: '4,000 kWh', rate: '0.10 ريال', typical: 'أسرة متوسطة (منزل)' },
  { tier: '3', from: '4,001', to: '6,000 kWh', rate: '0.20 ريال', typical: 'أسرة كبيرة (مكيفات متعددة)' },
  { tier: '4', from: '6,001', to: 'فوق', rate: '0.30 ريال', typical: 'منازل فاخرة أو مشاغل' },
];

const AE_TIERS = [
  { tier: '1', from: '0', to: '2,000 kWh', rate: '0.23 درهم', typical: 'شقة صغيرة' },
  { tier: '2', from: '2,001', to: '4,000 kWh', rate: '0.28 درهم', typical: 'شقة متوسطة' },
  { tier: '3', from: '4,001', to: '6,000 kWh', rate: '0.32 درهم', typical: 'فيلا أو منزل' },
  { tier: '4', from: '6,001', to: 'فوق', rate: '0.38 درهم', typical: 'منازل كبيرة' },
];

export default function ElectricityBillPage() {
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
          <ElectricityBillCalculator />
        </Suspense>
      </CalculatorHero>

      {/* Saudi SEC tiers */}
      <CalculatorSection
        id="sa-tiers"
        eyebrow="شركة الكهرباء السعودية SEC"
        title="شرائح الكهرباء السعودية للسكن 2025"
        description="الشرائح تصاعدية — كل وحدة تُحسب في شريحتها فقط، لا على الاستهلاك كله بالسعر الأعلى. بالإضافة إلى رسوم اشتراك 5.175 ريال/شهر وضريبة 15%."
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>الشريحة</TableHead>
                <TableHead>من</TableHead>
                <TableHead>إلى</TableHead>
                <TableHead>السعر / kWh</TableHead>
                <TableHead>الفئة المعتادة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SA_TIERS.map((row) => (
                <TableRow key={row.tier}>
                  <TableCell className="font-bold text-center">{row.tier}</TableCell>
                  <TableCell>{row.from}</TableCell>
                  <TableCell>{row.to}</TableCell>
                  <TableCell className="font-bold" style={{ color: 'var(--blue)' }}>{row.rate}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.typical}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* UAE DEWA tiers */}
      <CalculatorSection
        id="uae-tiers"
        eyebrow="هيئة كهرباء ومياه دبي DEWA"
        title="شرائح الكهرباء الإماراتية للسكن"
        description="بالإضافة للشرائح: رسوم توزيع 0.038 درهم/kWh، رسوم وقود متغيرة (~0.06 درهم)، اشتراك 6.6 درهم/شهر، وضريبة 5%."
        subtle
      >
        <div className="calc-table-wrap">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>الشريحة</TableHead>
                <TableHead>من</TableHead>
                <TableHead>إلى</TableHead>
                <TableHead>السعر / kWh</TableHead>
                <TableHead>الفئة المعتادة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AE_TIERS.map((row) => (
                <TableRow key={row.tier}>
                  <TableCell className="font-bold text-center">{row.tier}</TableCell>
                  <TableCell>{row.from}</TableCell>
                  <TableCell>{row.to}</TableCell>
                  <TableCell className="font-bold" style={{ color: 'var(--blue)' }}>{row.rate}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>{row.typical}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Savings tips + worked example */}
      <CalculatorSection
        id="electricity-savings"
        eyebrow="تقليل الفاتورة"
        title="كيف تخفض فاتورة الكهرباء دون التأثير على الراحة؟"
        description="المكيفات تستهلك 60–70% من كهرباء المنازل في الخليج صيفاً — هذا هو المكان الأول للبدء."
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>المكيف: كل درجة تُكلفك 6–8%</h3>
            <p>
              رفع درجة حرارة المكيف من 20°م إلى 24°م يُقلل استهلاكه بنحو 25%. خبراء الطاقة ينصحون بـ 24–26°م
              ليلاً و22°م نهاراً كنقطة توازن بين الراحة والاقتصاد. ضع المكيف على "Auto Fan" بدلاً من "Turbo"
              المستمر.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>التوقيت: تجنب ذروة الاستهلاك (12–6 مساءً)</h3>
            <p>
              بعض التعريفات تطبق أسعاراً متغيرة حسب التوقيت (TOU). في السعودية والإمارات لا تُطبَّق هذه التعريفة
              للسكن حتى الآن، لكن تشغيل أجهزة الطبخ والغسالة والمجفف في ساعات الصباح الباكر يُخفف العبء على
              الشبكة ويُطيل عمر الأجهزة بشكل عام.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>الأجهزة: انتبه للـ "Phantom Load"</h3>
            <p>
              الأجهزة في وضع Standby تستهلك 5–10% من كهرباء المنزل. شاشات التلفزيون والمايكروويف والكمبيوتر
              وشواحن الهواتف تسحب طاقة حتى بدون استخدام. استخدم power strip مع قاطع رئيسي لأجهزة
              الترفيه والمكتب.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>مثال محلول: أسرة في الرياض — 3,500 kWh/شهر</h3>
            <p>
              الشريحة 1 (0–2,000 kWh): 2,000 × 0.05 = 100 ريال<br />
              الشريحة 2 (2,001–3,500 kWh): 1,500 × 0.10 = 150 ريال<br />
              رسوم الاشتراك: 5.175 ريال<br />
              المجموع قبل الضريبة: 255.175 ريال<br />
              <strong>الضريبة 15%: 38.28 ريال → الفاتورة الإجمالية: حوالي 293 ريال</strong>
            </p>
          </article>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="electricity-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن فاتورة الكهرباء في السعودية والإمارات"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSources sources={CONTENT.sources} />


      <RelatedCalculators currentSlug="electricity-bill" />
    </main>
  );
}
