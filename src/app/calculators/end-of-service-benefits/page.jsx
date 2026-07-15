import Link from 'next/link';

import EndOfServiceCalculator from '@/components/calculators/EndOfServiceCalculator.client';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getCachedNowIso } from '@/lib/date-utils';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'end-of-service-benefits');
const CONTENT = getFinancePageContent('end-of-service-benefits');
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

export default async function EndOfServiceBenefitsPage() {
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
    name: CONTENT.howTo?.name || 'كيفية استخدام حاسبة مكافأة نهاية الخدمة',
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
        <EndOfServiceCalculator
          initialStartDate={initialStartDate}
          initialEndDate={initialEndDate}
        />
      </CalculatorHero>

      <CalculatorSection
        id="esb-guide"
        eyebrow="دليل سريع"
        title="احسب مكافأة نهاية الخدمة، ثم افهم سبب الرقم"
        description="إذا كنت تستقيل، فالمدة تغيّر نسبة الاستحقاق. وإذا انتهى العقد، فسبب الإنهاء يغيّر القراءة. هذا القسم يضع السبب والمدة في مكان واحد حتى لا تعتمد على رقم بلا سياق."
      >
        <Tabs defaultValue="eligibility" className="calc-app calc-esb-tabs" dir="rtl">
          <TabsList className="tabs calc-tabs-list" aria-label="شرح نتيجة مكافأة نهاية الخدمة">
            <TabsTrigger value="eligibility" className="tab calc-tabs-trigger">سبب الإنهاء</TabsTrigger>
            <TabsTrigger value="cases" className="tab calc-tabs-trigger">حالات تحتاج انتباه</TabsTrigger>
            <TabsTrigger value="law" className="tab calc-tabs-trigger">النظام باختصار</TabsTrigger>
            <TabsTrigger value="examples" className="tab calc-tabs-trigger">أمثلة سريعة</TabsTrigger>
          </TabsList>

          <TabsContent value="eligibility" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'انتهاء العقد أو الإنهاء من صاحب العمل',
                  description: 'القاعدة العامة تبدأ من الاستحقاق الكامل.',
                  content: 'عندما تنتهي العلاقة بانتهاء العقد أو بإنهاء من صاحب العمل، تبدأ القراءة من أصل المكافأة في المادة 84. الاستثناءات مثل الفصل بسبب مخالفة جسيمة لا تختصرها الحاسبة ويجب مراجعتها من المصدر الرسمي.',
                },
                {
                  title: 'الاستقالة',
                  description: 'ترتبط النسبة بمدة الخدمة.',
                  content: 'في الاستقالة العادية لا تنظر إلى الراتب وحده: أقل من سنتين = صفر، من سنتين إلى أقل من 5 سنوات = ثلث، من 5 إلى أقل من 10 سنوات = ثلثان، و10 سنوات فأكثر = كامل المكافأة.',
                },
                {
                  title: 'الاتفاق أو المخالصة',
                  description: 'اقرأ السبب المكتوب قبل إدخال الحالة.',
                  content: 'قد تبدو المخالصة كإنهاء بسيط، لكنها تعتمد على الصياغة والمستندات. قبل اختيار سبب الإنهاء في الحاسبة، طابقه مع خطاب الإنهاء أو الاستقالة أو عدم التجديد.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="cases" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'الأجر المتغير والعمولات',
                  content: 'إذا كان دخلك يتضمن عمولات أو نسباً متغيرة أو بدلات تختلف من شهر إلى شهر، فلا تضفها أو تستبعدها آلياً. المادة 86 تفتح باب الاتفاق المكتوب على بعض العناصر القابلة للزيادة والنقص.',
                },
                {
                  title: 'الإجازات غير المدفوعة',
                  content: 'قد تؤثر الإجازات غير المدفوعة أو الانقطاعات الطويلة على المدة المحتسبة. إذا تغيّرت مدة الخدمة في سجلات الشركة عن حسابك الشخصي، اطلب تفصيلاً يوضح الأيام المستبعدة.',
                },
                {
                  title: 'فترة التجربة أو المادة 80',
                  content: 'الإنهاء أثناء فترة التجربة أو بسبب مخالفة جسيمة يحتاج قراءة مختلفة، ولا يصح أن تحوّله إلى اختيار عام داخل الحاسبة دون التحقق من المستندات والإجراءات.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="law" className="calc-tabs-panel">
            <div className="calc-grid-2">
              <article className="calc-article-block">
                <h3>المادة 84 باختصار</h3>
                <p>
                  هي أصل المعادلة: نصف شهر عن كل سنة من السنوات الخمس الأولى، ثم أجر شهر عن كل سنة بعد ذلك، مع احتساب كسور السنة بنسبة ما أمضاه العامل.
                </p>
              </article>
              <article className="calc-article-block">
                <h3>المادة 85 باختصار</h3>
                <p>
                  عند الاستقالة لا يتغير أصل المعادلة، بل تتغير نسبة الاستحقاق بحسب مدة الخدمة. لذلك ترى في الحاسبة الاستحقاق الكامل ثم النسبة المطبقة على الاستقالة.
                </p>
              </article>
              <article className="calc-article-block">
                <h3>المادة 86 باختصار</h3>
                <p>
                  تفيدك عند وجود عمولات أو نسب مبيعات أو عناصر أجر تزيد وتنقص. لا تجعل حقل الأجر المرجعي قراراً عشوائياً إذا كانت هذه العناصر جزءاً كبيراً من دخلك.
                </p>
              </article>
              <article className="calc-article-block">
                <h3>المادتان 87 و88 باختصار</h3>
                <p>
                  المادة 87 تذكر حالات استحقاق كامل رغم الاستقالة، مثل القوة القاهرة وبعض حالات العاملة بعد الزواج أو الوضع. المادة 88 مهمة لتوقيت تصفية المستحقات بعد انتهاء العلاقة.
                </p>
              </article>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="calc-tabs-panel">
            <div className="calc-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>السيناريو</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>ماذا يحدث؟</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>استقالة بعد 3 سنوات</TableCell>
                    <TableCell>3 سنوات</TableCell>
                    <TableCell>تبدأ من المكافأة الكاملة ثم تأخذ ثلثها فقط.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>انتهاء عقد بعد 7 سنوات</TableCell>
                    <TableCell>7 سنوات</TableCell>
                    <TableCell>تأخذ كامل الاستحقاق: نصف شهر لكل سنة من أول 5 سنوات، وشهر لكل سنة بعدها.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>استقالة بعد 12 سنة</TableCell>
                    <TableCell>12 سنة</TableCell>
                    <TableCell>تعود النسبة إلى 100% لأن العامل تجاوز 10 سنوات.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>عمولات شهرية متغيرة</TableCell>
                    <TableCell>أي مدة</TableCell>
                    <TableCell>لا يكفي إدخال الراتب الأساسي فقط قبل مراجعة الاتفاق المكتوب على الأجر المرجعي.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorSection>

      <CalculatorSection
        id="esb-comparison"
        eyebrow="جدول مرجعي"
        title="الفرق بين أسباب إنهاء العلاقة"
        description="هذا الجدول يلخّص القاعدة المبسطة التي تعتمد عليها الحاسبة عند اختيار سبب الإنهاء."
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>السبب</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>نسبة الاستحقاق</TableHead>
                <TableHead>ما الذي تراجعه؟</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>انتهاء العقد</TableCell>
                <TableCell>أي مدة</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>تأكد أن سبب الانتهاء في الخطاب ليس استقالة أو مخالصة بصياغة مختلفة.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>فصل أو إنهاء من صاحب العمل</TableCell>
                <TableCell>أي مدة</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>راجع إن كان الإنهاء عاماً أم مرتبطاً بمادة خاصة مثل المادة 80.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>أقل من سنتين</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>تأكد من تاريخ البداية الفعلي وهل الخدمة متصلة.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>من سنتين إلى أقل من 5 سنوات</TableCell>
                <TableCell>33.33%</TableCell>
                <TableCell>قارن أثر الانتظار إذا كنت قريباً من خمس سنوات.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>من 5 إلى أقل من 10 سنوات</TableCell>
                <TableCell>66.67%</TableCell>
                <TableCell>قارن أثر الانتظار إذا كنت قريباً من عشر سنوات.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>10 سنوات فأكثر</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>يبقى الأجر المرجعي والتواريخ هما مصدر الفروق الأكبر.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="esb-official"
        eyebrow="مصدر رسمي"
        title="راجع المصدر الرسمي عند الحاجة"
        description="الحاسبة مصممة للسرعة والفهم الأولي، لكن النص الرسمي هو المرجع النهائي في أي نزاع أو حالة استثنائية."
        subtle
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              إذا كانت النتيجة مرتبطة بتسوية فعلية أو خلاف على مدة الخدمة أو الأجر، فابدأ بحاسبة الوزارة ونص نظام العمل، ثم استخدم الحاسبات المالية الأخرى للتخطيط بعد نهاية العمل.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://www.hrsd.gov.sa/en/ministry-services/services/end-service-benefit-calculator" target="_blank" rel="noreferrer">
                حاسبة وزارة الموارد البشرية
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.hrsd.gov.sa/en/knowledge-centre/%D9%86%D8%B8%D8%A7%D9%85-%D8%A7%D9%84%D8%B9%D9%85%D9%84" target="_blank" rel="noreferrer">
                نظام العمل السعودي
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/monthly-installment">انتقل إلى حاسبة القسط الشهري</Link>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="esb-faq"
        eyebrow="قبل مراجعة التسوية"
        title="أسئلة تتكرر قبل الاستقالة أو عند مراجعة التسوية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="esb-related"
        eyebrow="بعد التسوية"
        title="حاسبات مرتبطة بالتخطيط بعد نهاية الخدمة"
        description="بعد معرفة المستحقات، قد تحتاج تقدير قسط أو ضريبة أو نسبة تغير في الدخل. اختر أداة واحدة تكمل خطوتك التالية ولا تنتقل بين الأقسام بلا هدف."
      >
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="end-of-service-benefits" />
      </CalculatorSection>
    </main>
  );
}
