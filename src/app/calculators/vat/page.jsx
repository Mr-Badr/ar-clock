import VatCalculator from '@/components/calculators/VatCalculator.client';
import VatRatesTable from '@/components/calculators/VatRatesTable.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'vat');
const CONTENT = getFinancePageContent('vat');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function VatPage() {
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
    name: CONTENT.howTo?.name || 'كيفية استخدام حاسبة ضريبة القيمة المضافة',
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page calc-vat-page bg-base text-primary" dir="rtl" lang="ar">
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
        <VatCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="vat-rates"
        eyebrow="النسب والدول"
        title="اختر النسبة إذا كانت فاتورتك من دولة أخرى"
        description="ابدأ بالنسبة العامة المعروفة، ثم تحقق من المرجع الرسمي عند الفاتورة الحساسة أو الحالات المعفاة أو المخفضة."
      >
        <VatRatesTable />
      </CalculatorSection>

      <CalculatorSection
        id="vat-learning"
        eyebrow="فهم الأساس"
        title="كيف تختار طريقة الحساب الصحيحة؟"
        description="هذه الصفحة تساعدك على التفريق بين ثلاثة أسئلة مختلفة: إضافة الضريبة على سعر، استخراجها من إجمالي، أو معرفة صافي المستحق في نهاية الفترة."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'إضافة الضريبة',
              description: 'متى تستخدمها؟',
              content: 'إذا كان لديك سعر قبل الضريبة وتريد معرفة قيمة الضريبة والإجمالي النهائي للفاتورة. هذا هو السيناريو الأشهر في التسعير والعروض.',
            },
            {
              title: 'استخراج الضريبة',
              description: 'متى تستخدمه؟',
              content: 'إذا وصلتك فاتورة شاملة الضريبة وتريد معرفة الجزء الأصلي من السعر بدقة دون أن تقع في خطأ ضرب الإجمالي مباشرة في النسبة.',
            },
            {
              title: 'ضريبة الشهر',
              description: 'للمنشآت الصغيرة والمتاجر',
              content: 'الفكرة الأساسية هي طرح ضريبة المدخلات من ضريبة المخرجات. الحاسبة هنا تختصر الخطوة الأولى قبل الانتقال إلى القيد المحاسبي والإقرار الرسمي.',
            },
            {
              title: 'نسبة مخصصة لأي بلد عربي',
              description: 'عندما لا تكفي القائمة السريعة',
              content: 'إذا كنت تحسب لدولة غير ظاهرة في القائمة، أدخل النسبة الرسمية يدوياً واختر العملة. بهذه الطريقة تبقى الحاسبة مفيدة دون أن تعتمد على معدل قديم أو غير مناسب لحالتك.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="vat-details"
        eyebrow="مرجع عملي"
        title="نقاط يجب الانتباه لها قبل الاعتماد على الرقم"
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>1. المعدل العام لا يغطي كل الحالات</h3>
            <p>
              بعض القطاعات قد تكون معفاة أو صفرية أو خاضعة لمعاملة مختلفة. لذلك نحن نستخدم المعدل
              القياسي العام لتسريع الفهم، لا لإلغاء الحاجة إلى مراجعة الفاتورة أو اللائحة الخاصة
              بقطاعك.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>2. التسجيل والإقرار مساران مختلفان عن الحساب الفردي</h3>
            <p>
              حتى لو كنت تعرف كيف تضيف الضريبة أو تستخرجها، يبقى التسجيل والإقرار والمتطلبات
              الشكلية مسؤولية منفصلة. في السعودية مثلاً يظل حد التسجيل الإلزامي المذكور رسمياً
              نقطة مرجعية مهمة عند تقييم وضع المنشأة.
            </p>
          </article>
        </div>

        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الحالة</TableHead>
                <TableHead>المعادلة السريعة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>إضافة الضريبة</TableCell>
                <TableCell>المبلغ × (1 + نسبة الضريبة)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استخراج الضريبة</TableCell>
                <TableCell>المبلغ الشامل ÷ (1 + نسبة الضريبة)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>صافي ضريبة الشهر</TableCell>
                <TableCell>ضريبة المخرجات - ضريبة المدخلات</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-official-links"
        eyebrow="مصادر مرجعية"
        title="مراجع رسمية مفيدة"
        description="إذا كنت تحتاج رقمًا نهائياً للاعتماد الإداري أو المحاسبي، راجع الجهة المختصة في دولتك."
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <h3 className="calc-card-title">مراجع رسمية للتحقق</h3>
            <p className="calc-card-description">
              استخدم هذه المراجع عندما تريد التحقق من التسجيل، الإقرار، أو الحالات التي لا يغطيها الحساب السريع.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://zatca.gov.sa/" target="_blank" rel="noreferrer">هيئة الزكاة والضريبة والجمارك</a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://tax.gov.ae/" target="_blank" rel="noreferrer">الهيئة الاتحادية للضرائب - الإمارات</a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.nbr.gov.bh/" target="_blank" rel="noreferrer">الجهاز الوطني للإيرادات - البحرين</a>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-faq"
        eyebrow="قبل اعتماد الفاتورة"
        title="أسئلة قبل اعتماد الضريبة في التسعير أو المراجعة"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-related"
        eyebrow="بعد الضريبة"
        title="حاسبات مرتبطة بالتسعير والربحية"
        description="استخدم هذه المسارات عندما يكون سؤالك التالي عن الخصم أو القسط أو النسبة نفسها. لا تفتحها كلها؛ اختر المسار الذي يكمل الفاتورة التي تعمل عليها الآن."
      >
        <RelatedCalculators currentSlug="vat" />
      </CalculatorSection>
    </main>
  );
}
