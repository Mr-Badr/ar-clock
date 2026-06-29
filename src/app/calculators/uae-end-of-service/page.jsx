import Link from 'next/link';

import UaeEndOfServiceCalculator from '@/components/calculators/UaeEndOfServiceCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getCachedNowIso } from '@/lib/date-utils';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'uae-end-of-service');
const CONTENT = getFinancePageContent('uae-end-of-service');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function shiftYears(isoDate, years) {
  const date = new Date(isoDate);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return date.toISOString().slice(0, 10);
}

export default async function UaeEndOfServicePage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];
  const nowIso = await getCachedNowIso();
  const initialEndDate = nowIso.slice(0, 10);
  const initialStartDate = shiftYears(initialEndDate, -5);

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
    name: CONTENT.howTo?.name || 'كيفية حساب مكافأة نهاية الخدمة في الإمارات',
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page calc-esb-page bg-base text-primary" dir="rtl" lang="ar">
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
        <UaeEndOfServiceCalculator
          initialStartDate={initialStartDate}
          initialEndDate={initialEndDate}
        />
      </CalculatorHero>

      {/* Guide — understanding your result */}
      <CalculatorSection
        id="uae-esb-guide"
        eyebrow="دليل سريع"
        title="افهم النتيجة قبل اتخاذ القرار"
        description="المعادلة بسيطة لكن التفاصيل تُغيّر الرقم: الراتب الأساسي فقط، والشريحتان، وسبب الإنهاء — هذه الثلاثة تحدد ما تأخذه فعلاً."
      >
        <Tabs defaultValue="formula" className="calc-app calc-esb-tabs" dir="rtl">
          <TabsList className="tabs calc-tabs-list" aria-label="شرح حساب مكافأة نهاية الخدمة الإمارات">
            <TabsTrigger value="formula"    className="tab calc-tabs-trigger">المعادلة</TabsTrigger>
            <TabsTrigger value="resignation" className="tab calc-tabs-trigger">الاستقالة</TabsTrigger>
            <TabsTrigger value="cases"      className="tab calc-tabs-trigger">حالات خاصة</TabsTrigger>
            <TabsTrigger value="examples"   className="tab calc-tabs-trigger">أمثلة</TabsTrigger>
          </TabsList>

          <TabsContent value="formula" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'الخطوة الأولى: احسب معدل اليوم',
                  description: 'الأساس الذي تقوم عليه كل المعادلة.',
                  content: 'اقسم راتبك الأساسي الشهري على 30 للحصول على قيمة اليوم الواحد. إذا كان أساسيك 12,000 درهم فمعدل يومك 400 درهم. هذا الرقم هو أساس الشريحتين معاً.',
                },
                {
                  title: 'الشريحة الأولى: أول خمس سنوات (21 يوم/سنة)',
                  description: 'تسري على كل سنة من أول خمس سنوات خدمة.',
                  content: 'كل سنة في الخمس الأولى تساوي: معدل اليوم × 21 يوماً. مثال: 400 درهم × 21 = 8,400 درهم عن كل سنة. بعد خمس سنوات تجمع 5 × 8,400 = 42,000 درهم من هذه الشريحة.',
                },
                {
                  title: 'الشريحة الثانية: ما بعد الخمس سنوات (30 يوم/سنة)',
                  description: 'ترتفع إلى شهر كامل عن كل سنة إضافية.',
                  content: 'كل سنة تتجاوز الخمس سنوات تساوي: معدل اليوم × 30 يوماً. مثال: 400 درهم × 30 = 12,000 درهم عن كل سنة. الفرق واضح — كل سنة إضافية بعد الخمس تساوي أكثر من 40% مما قبلها.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="resignation" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'أقل من سنة: لا مكافأة',
                  description: 'الحد الأدنى للاستحقاق عند الاستقالة.',
                  content: 'إذا استقلت قبل إتمام سنة كاملة في الإمارات فلا يوجد استحقاق لمكافأة نهاية الخدمة وفق القانون. وهذا يُذكّرك بأهمية إتمام السنة الأولى على الأقل.',
                },
                {
                  title: 'من سنة إلى أقل من 3 سنوات: ثلث المكافأة',
                  description: 'أسرع من السعودية — الاستحقاق يبدأ بعد سنة وليس سنتين.',
                  content: 'بعد إتمام سنة واحدة تستحق ثلث المكافأة الكاملة. قارن: في السعودية يبدأ الاستحقاق بعد سنتين. هذا يجعل الإمارات أكثر مرونةً للموظف الذي يخطط لتغيير وظيفي مبكر.',
                },
                {
                  title: 'من 3 إلى أقل من 5 سنوات: ثلثا المكافأة',
                  description: 'نقطة تحوّل مهمة — ارتفع الاستحقاق من ثلث إلى ثلثين.',
                  content: 'بعد ثلاث سنوات يضاعف الاستحقاق ليصل إلى ثلثي المكافأة. هذه المحطة تستحق التوقف قبل الاستقالة — أشهر قليلة إضافية ترفع استحقاقك بشكل كبير.',
                },
                {
                  title: 'خمس سنوات فأكثر: مكافأة كاملة',
                  description: 'الاستحقاق الكامل بصرف النظر عن السبب.',
                  content: 'بعد خمس سنوات تأخذ المكافأة كاملةً سواء كانت استقالةً أو نهاية عقد. في السعودية هذه النقطة بعد عشر سنوات — الإمارات أفضل للموظف في هذا الجانب.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="cases" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'الراتب الأساسي مقابل الراتب الإجمالي',
                  content: 'أشيع سبب للمفاجأة: الحاسبة تعمل على الراتب الأساسي فقط، ليس المجموع. إذا كان أساسيك 8,000 درهم وإجماليك 14,000 فالمكافأة تُحسب على الـ 8,000. تحقق من عقدك قبل إدخال الرقم.',
                },
                {
                  title: 'موظفو مناطق المكافئة الحرة (DIFC وADGM)',
                  content: 'DIFC وADGM لهما قوانين عمل مستقلة. DIFC يوفر بديلاً يُسمى DEWS يقوم على اشتراكات شهرية (5.83% ثم 8.33%) بدلاً من مكافأة نهاية الخدمة التقليدية. إذا كنت في إحدى هاتين المنطقتين فهذه الحاسبة تطبّق القانون الاتحادي فقط.',
                },
                {
                  title: 'الإنهاء التعسفي وتعويض إضافي',
                  content: 'إذا أنهى صاحب العمل العقد دون سبب مشروع قد يحق لك تعويض إضافي يصل إلى ثلاثة أشهر راتب وفق قانون العمل. هذا التعويض منفصل عن المكافأة ولا تحسبه الحاسبة — راجع متخصصاً قانونياً.',
                },
                {
                  title: 'فترة التجربة والانقطاعات',
                  content: 'فترة التجربة تُحتسب ضمن مدة الخدمة بشكل عام، لكن الإنهاء أثناءها يختلف. الانقطاعات الطويلة غير مدفوعة الأجر قد تؤثر على المدة المحتسبة — تأكد من تواريخ عقودك بالضبط.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="examples" className="calc-tabs-panel">
            <div className="calc-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>السيناريو</TableHead>
                    <TableHead>الراتب الأساسي</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>المكافأة التقريبية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>نهاية عقد بعد 3 سنوات</TableCell>
                    <TableCell>10,000 د.إ</TableCell>
                    <TableCell>3 سنوات</TableCell>
                    <TableCell>20,999 د.إ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>استقالة بعد 2 سنة</TableCell>
                    <TableCell>10,000 د.إ</TableCell>
                    <TableCell>2 سنوات</TableCell>
                    <TableCell>4,666 د.إ (ثلث)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>نهاية عقد بعد 7 سنوات</TableCell>
                    <TableCell>15,000 د.إ</TableCell>
                    <TableCell>7 سنوات</TableCell>
                    <TableCell>52,500 د.إ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>استقالة بعد 5 سنوات</TableCell>
                    <TableCell>12,000 د.إ</TableCell>
                    <TableCell>5 سنوات</TableCell>
                    <TableCell>42,000 د.إ (كامل)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>استقالة بعد 4 سنوات</TableCell>
                    <TableCell>12,000 د.إ</TableCell>
                    <TableCell>4 سنوات</TableCell>
                    <TableCell>22,400 د.إ (ثلثان)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorSection>

      {/* Comparison table */}
      <CalculatorSection
        showAdBefore
        id="uae-esb-table"
        eyebrow="جدول مرجعي"
        title="الاستحقاق حسب سبب الإنهاء ومدة الخدمة"
        description="هذا الجدول يلخّص ما تعتمد عليه الحاسبة. سبب الإنهاء + المدة = النسبة."
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>سبب الإنهاء</TableHead>
                <TableHead>مدة الخدمة</TableHead>
                <TableHead>نسبة الاستحقاق</TableHead>
                <TableHead>ملاحظة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>انتهاء العقد</TableCell>
                <TableCell>أي مدة</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>تحقق من صياغة السبب في خطاب الإنهاء.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>إنهاء من صاحب العمل</TableCell>
                <TableCell>أي مدة</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>قد يُضاف تعويض تعسفي منفصل.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>أقل من سنة</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>لا استحقاق قبل إتمام سنة كاملة.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>من سنة إلى أقل من 3 سنوات</TableCell>
                <TableCell>33.3%</TableCell>
                <TableCell>ثلث المكافأة — أسرع من السعودية.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>من 3 إلى أقل من 5 سنوات</TableCell>
                <TableCell>66.7%</TableCell>
                <TableCell>ثلثا المكافأة — تحقق من قرب محطة الخمس سنوات.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>5 سنوات فأكثر</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>استحقاق كامل كأنه إنهاء عقد.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      {/* Official source CTA */}
      <CalculatorSection
        id="uae-esb-official"
        eyebrow="المصدر الرسمي"
        title="تحقق من المصدر الرسمي قبل القرار النهائي"
        description="الحاسبة مصممة للتقدير السريع والفهم. إذا كانت نتيجتك مرتبطة بتسوية فعلية أو نزاع، فابدأ بالمصادر الرسمية."
        subtle
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              وزارة الموارد البشرية والتوطين الإماراتية تتيح حاسبة رسمية وخدمات شكاوى إلكترونية.
              إذا اختلف الرقم عن تسويتك، اطلب من صاحب العمل تفصيل الحساب كتابياً قبل التوقيع.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://mohre.gov.ae/ar/services/workers-services/end-of-service-calculation.aspx" target="_blank" rel="noreferrer">
                حاسبة MOHRE الرسمية
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://mohre.gov.ae/ar/laws-regulations/federal-laws.aspx" target="_blank" rel="noreferrer">
                قانون العمل الإماراتي
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/end-of-service-benefits">حاسبة نهاية الخدمة السعودية</Link>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="uae-esb-faq"
        eyebrow="أسئلة شائعة"
        title="قبل الاستقالة أو مراجعة التسوية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related + sources */}
      <CalculatorSection
        id="uae-esb-related"
        eyebrow="خطوتك التالية"
        title="حاسبات مرتبطة بعد نهاية الخدمة"
        description="بعد معرفة المستحقات، قد تحتاج حاسبة قسط أو راتب أو تخطيط استثماري. اختر ما يتعلق بوضعك فعلاً."
      >
        <CalculatorSources sources={CONTENT.sources} />
        <RelatedCalculators currentSlug="uae-end-of-service" />
      </CalculatorSection>
    </main>
  );
}
