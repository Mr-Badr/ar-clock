import BMICalculator from '@/components/calculators/BMICalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'bmi');
const CONTENT = getFinancePageContent('bmi');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function BMIPage() {
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
    <main className="calc-product-page calc-bmi-page bg-base text-primary" dir="rtl" lang="ar">
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
        <BMICalculator />
      </CalculatorHero>

      <CalculatorSection
        showAdBefore
        id="bmi-classification"
        eyebrow="تصنيفات WHO"
        title="جدول تصنيف BMI وفق منظمة الصحة العالمية"
        description="هذه التصنيفات معتمدة دولياً للبالغين فوق 18 سنة. الأطفال والمراهقون لهم جدول مختلف يعتمد على العمر والجنس."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تصنيف الوزن</TableHead>
                <TableHead>نطاق BMI</TableHead>
                <TableHead>مستوى الخطر الصحي</TableHead>
                <TableHead>التوصية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>نقص حاد في الوزن</TableCell>
                <TableCell>أقل من 16.0</TableCell>
                <TableCell>مرتفع جداً</TableCell>
                <TableCell>يستوجب تقييماً طبياً عاجلاً</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>نقص في الوزن</TableCell>
                <TableCell>16.0 – 18.4</TableCell>
                <TableCell>مرتفع</TableCell>
                <TableCell>استشارة تغذية وتقييم صحي</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>وزن طبيعي</TableCell>
                <TableCell>18.5 – 24.9</TableCell>
                <TableCell>منخفض</TableCell>
                <TableCell>حافظ على نمط حياتك الصحي</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>زيادة وزن</TableCell>
                <TableCell>25.0 – 29.9</TableCell>
                <TableCell>منخفض – متوسط</TableCell>
                <TableCell>تحسين النشاط البدني والنظام الغذائي</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>سمنة درجة أولى</TableCell>
                <TableCell>30.0 – 34.9</TableCell>
                <TableCell>متوسط – مرتفع</TableCell>
                <TableCell>متابعة طبية ونظام غذائي منظم</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>سمنة درجة ثانية</TableCell>
                <TableCell>35.0 – 39.9</TableCell>
                <TableCell>مرتفع</TableCell>
                <TableCell>تدخل طبي مبكر ضروري</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>سمنة مفرطة درجة ثالثة</TableCell>
                <TableCell>40.0 فأكثر</TableCell>
                <TableCell>مرتفع جداً</TableCell>
                <TableCell>متابعة طبية متخصصة</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          المصدر: منظمة الصحة العالمية (WHO). BMI وحده لا يكفي للتشخيص الطبي — استشر طبيبك لتقييم شامل.
        </p>
      </CalculatorSection>

      <CalculatorSection
        id="bmi-guide"
        eyebrow="فهم النتيجة"
        title="ماذا يخبرك BMI وما لا يخبرك به؟"
        description="مؤشر كتلة الجسم أداة للفرز الأولي وليس تشخيصاً — إليك ما وراء الرقم."
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'BMI أقل من 18.5 — نقص وزن',
              description: 'ماذا يعني ذلك؟',
              content: 'قد يدل على نقص تغذية أو مشكلة صحية خفية. استشر طبيبك أو أخصائي تغذية لفهم الأسباب ووضع خطة تغذية مناسبة. الهدف دائماً المدى الصحي وليس الرقم بحد ذاته.',
            },
            {
              title: 'BMI 18.5–24.9 — الوزن الطبيعي',
              description: 'النطاق الصحي للبالغين.',
              content: 'هذا هو النطاق الذي تشير الدراسات إلى أقل خطر إصابة بالأمراض المزمنة. الحفاظ عليه يحتاج توازناً بين السعرات الواردة والمصروفة مع نشاط بدني منتظم.',
            },
            {
              title: 'BMI 25–29.9 — زيادة بسيطة',
              description: 'ليس خطراً فورياً.',
              content: 'كثير من الأشخاص في هذا النطاق أصحاء تماماً. العامل الأهم هو محيط الخصر ونمط الحياة. أنسب من الهدف الرقمي: إضافة 30 دقيقة مشي يومياً وتقليل السكريات.',
            },
            {
              title: 'BMI ≥ 30 — السمنة',
              description: 'يستدعي الانتباه الطبي.',
              content: 'السمنة مرتبطة بمخاطر صحية مركبة. لكن المؤشر وحده لا يكفي — بعض الرياضيين لديهم BMI عالٍ من العضلات. الأفضل: تقييم شامل مع قياس نسبة الدهون ومحيط الخصر.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="bmi-waist"
        eyebrow="مقياس تكميلي"
        title="محيط الخصر — المؤشر الذي يكمل BMI"
        description="دهون البطن (الدهون الحشوية) أكثر خطورة من الدهون الكلية. محيط الخصر يكشف هذا الخطر بدقة أكبر من BMI."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الجنس</TableHead>
                <TableHead>ضمن الطبيعي</TableHead>
                <TableHead>خطر مرتفع</TableHead>
                <TableHead>خطر مرتفع جداً</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>الرجال</TableCell>
                <TableCell>أقل من 94 سم</TableCell>
                <TableCell>94 – 102 سم</TableCell>
                <TableCell>أكثر من 102 سم</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>النساء</TableCell>
                <TableCell>أقل من 80 سم</TableCell>
                <TableCell>80 – 88 سم</TableCell>
                <TableCell>أكثر من 88 سم</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="calc-article-grid" style={{ marginTop: '1.5rem' }}>
          <article className="calc-article-block">
            <h3>كيف تقيس محيط الخصر بدقة؟</h3>
            <p>
              استخدم شريط قياس مرن. قس في المستوى الأفقي على ارتفاع منتصف المسافة بين آخر ضلع وعظمة
              الحوض. قِس بعد زفير طبيعي وبدون شد البطن. القياس الصباحي قبل الأكل أكثر دقة.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>لماذا دهون البطن خطيرة بشكل خاص؟</h3>
            <p>
              الدهون الحشوية (المحيطة بالأعضاء الداخلية) تُفرز مواد التهابية ترفع خطر السكري النوع الثاني
              وأمراض القلب والشرايين. شخص بـ BMI طبيعي لكن خصر واسع قد يكون أكثر خطورة من شخص بـ
              BMI مرتفع قليلاً مع توزيع صحي للدهون.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="bmi-tdee"
        eyebrow="الاحتياج اليومي من السعرات"
        title="جدول السعرات الحرارية اليومية حسب مستوى النشاط"
        description="معادلة Mifflin-St Jeor المعتمدة من الجمعية الأمريكية للتغذية — اضرب الحصيلة الأساسية في معامل النشاط المناسب."
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>مستوى النشاط</TableHead>
                <TableHead>وصف النشاط</TableHead>
                <TableHead>معامل النشاط (TDEE)</TableHead>
                <TableHead>مثال</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>خامل</TableCell>
                <TableCell>لا رياضة أو نادراً</TableCell>
                <TableCell>× 1.2</TableCell>
                <TableCell>مكتب + جلوس معظم اليوم</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>خفيف</TableCell>
                <TableCell>رياضة خفيفة 1-3 أيام/أسبوع</TableCell>
                <TableCell>× 1.375</TableCell>
                <TableCell>مشي يومي + بعض التمارين</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>متوسط</TableCell>
                <TableCell>رياضة معتدلة 3-5 أيام/أسبوع</TableCell>
                <TableCell>× 1.55</TableCell>
                <TableCell>رياضة منتظمة + نشاط يومي</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>مرتفع</TableCell>
                <TableCell>تمارين شاقة 6-7 أيام/أسبوع</TableCell>
                <TableCell>× 1.725</TableCell>
                <TableCell>رياضي + عمل بدني</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>مكثف جداً</TableCell>
                <TableCell>تدريب مكثف يومي + عمل بدني شاق</TableCell>
                <TableCell>× 1.9</TableCell>
                <TableCell>لاعب محترف أو عامل بناء</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          رجل: (10 × الوزن كجم) + (6.25 × الطول سم) − (5 × العمر) + 5 | امرأة: نفس المعادلة − 161 | ثم اضرب في معامل النشاط.
        </p>
      </CalculatorSection>

      <CalculatorSection
        id="bmi-official"
        eyebrow="مصادر رسمية"
        title="معلومات طبية موثوقة حول الوزن الصحي"
        subtle
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              للمزيد من المعلومات الطبية الموثوقة حول تصنيفات BMI وخطط الوزن الصحي، ارجع إلى منظمة الصحة العالمية أو وزارة الصحة في دولتك.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://www.who.int/ar/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noreferrer">
                WHO — السمنة والوزن الزائد
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.moh.gov.sa/HealthAwareness/Campaigns/Healthy_Weight/Pages/default.aspx" target="_blank" rel="noreferrer">
                وزارة الصحة السعودية — الوزن الصحي
              </a>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="bmi-faq"
        eyebrow="أسئلة شائعة"
        title="ما الذي يريد معرفته الجميع عن BMI والوزن المثالي"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="bmi-related" subtle>
        <RelatedCalculators currentSlug="bmi" />
      </CalculatorSection>
    </main>
  );
}
