import Link from 'next/link';

import EndOfServiceCalculator from '@/components/calculators/EndOfServiceCalculator.client';
import {
  CalculatorChecklist,
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorSection,
  CalculatorSectionNav,
  CalculatorStoryBand,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getCachedNowIso } from '@/lib/date-utils';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'end-of-service-benefits');

const faqItems = [
  {
    question: 'هل البدلات محسوبة في مكافأة نهاية الخدمة؟',
    answer: 'هذه الصفحة تبني الحساب على الراتب الأساسي لأنه الأسهل والأكثر شيوعاً في التقدير الأولي. في الواقع العملي قد تختلف بعض العناصر بحسب نص العقد أو سياسة المنشأة أو الحكم القضائي.',
  },
  {
    question: 'هل أستحق شيئاً إذا استقلت قبل سنتين؟',
    answer: 'في القاعدة العامة للاستقالة تكون النتيجة صفراً قبل بلوغ سنتين كاملتين، بينما يبقى الاستحقاق كاملاً في حالات الإنهاء غير المرتبطة باستقالة العامل ضمن النموذج المبسط هنا.',
  },
  {
    question: 'كيف تحسب الأشهر والأيام الإضافية؟',
    answer: 'الحاسبة تحول مدة الخدمة إلى كسور سنة حتى لا تضيع الأشهر الأخيرة، ثم توزعها على شريحة السنوات الخمس الأولى وما بعدها بشكل نسبي.',
  },
  {
    question: 'هل هذه النتيجة نهائية؟',
    answer: 'هي نتيجة إرشادية مبنية على القاعدة العامة. راجع دائماً عقدك، وتسوية الموارد البشرية، وأي حالات خاصة مثل الإجازات غير المدفوعة أو القرارات التأديبية أو التسويات السابقة.',
  },
  {
    question: 'متى يجب صرف مكافأة نهاية الخدمة؟',
    answer: 'القاعدة الإجرائية العامة أن تتم التصفية خلال مدة قصيرة بعد انتهاء العلاقة التعاقدية. إذا وجدت تأخيراً أو نزاعاً فالمصدر الرسمي والجهة القانونية المختصة هما المرجع النهائي.',
  },
  {
    question: 'ما الفرق بين المادة 84 و85؟',
    answer: 'المادة 84 تضع أصل معادلة المكافأة، بينما المادة 85 تتناول أثر الاستقالة على نسبة الاستحقاق. لهذا تُظهر الحاسبة الاستحقاق الكامل أولاً ثم تطبق نسبة الاستقالة إن لزم.',
  },
];

const sectionNavItems = [
  { href: '#calculator-hero', label: 'الحاسبة', description: 'أدخل الراتب والمدة وسبب الإنهاء' },
  { href: '#esb-overview', label: 'خريطة الصفحة', description: 'أهم ما ستجده داخل الصفحة' },
  { href: '#esb-intents', label: 'نية البحث', description: 'عبارات وأسئلة مرتبطة بالحاسبة' },
  { href: '#esb-guide', label: 'دليل سريع', description: 'شروط الاستحقاق والحالات الخاصة' },
  { href: '#esb-answers', label: 'إجابات مباشرة', description: 'أسئلة طويلة الذيل بلغة واضحة' },
  { href: '#esb-article', label: 'شرح عميق', description: 'كيف تقرأ النتيجة ومتى تنتبه' },
  { href: '#esb-comparison', label: 'جدول المقارنة', description: 'الفرق بين الاستقالة والإنهاء' },
  { href: '#esb-rights', label: 'حقوقك عملياً', description: 'خطوات قبل قبول التسوية' },
  { href: '#esb-faq', label: 'FAQ', description: 'أكثر الأسئلة تكراراً' },
];

const quickAnswers = [
  {
    question: 'كم مكافأة نهاية الخدمة بعد 5 سنوات؟',
    description: 'السؤال الأكثر شيوعاً في البحث.',
    answer: 'بعد خمس سنوات تظهر أهمية الفصل بين الشريحة الأولى وما بعدها. إذا انتهت العلاقة دون استقالة فالحساب في هذه الصفحة يبني الاستحقاق الكامل، أما في الاستقالة فيتغير فقط معامل الاستحقاق لا أصل المعادلة.',
  },
  {
    question: 'هل أستحق مكافأة نهاية الخدمة بعد سنتين؟',
    description: 'يرتبط الجواب بسبب الإنهاء.',
    answer: 'في نموذج الصفحة، العامل المستقيل قبل إكمال سنتين لا يحصل على مكافأة، بينما في غير الاستقالة يظهر أصل الاستحقاق وفق المدة الفعلية. لهذا من المهم اختيار سبب الإنهاء الصحيح داخل الحاسبة.',
  },
  {
    question: 'ما الفرق بين الاستقالة والفصل في مكافأة نهاية الخدمة؟',
    description: 'هذه النقطة تغيّر النسبة أكثر من أي حقل آخر.',
    answer: 'الفصل أو انتهاء العقد في القاعدة العامة يقودان إلى استحقاق كامل، بينما الاستقالة تمر على شرائح 0% ثم 33.33% ثم 66.67% ثم 100%. لهذا تعرض الصفحة الاستحقاق الكامل ثم النسبة المطبقة.',
  },
  {
    question: 'كيف أحسب مكافأة نهاية الخدمة للمقيمين في السعودية؟',
    description: 'السؤال نفسه يتكرر للمقيمين والمواطنين.',
    answer: 'في القاعدة العامة المستخدمة هنا لا تختلف المعادلة بسبب الجنسية، بل تتأثر بعناصر مثل الراتب الأساسي ومدة الخدمة وسبب الإنهاء ونصوص العقد. لذلك تعمل الحاسبة بنفس المنطق للمقيمين والمواطنين على حد سواء.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function shiftYears(isoDate, years) {
  const date = new Date(isoDate);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return date.toISOString().slice(0, 10);
}

export default async function EndOfServiceBenefitsPage() {
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
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: PAGE.title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'ar',
    offers: { '@type': 'Offer', price: '0' },
    url: `${SITE_URL}${PAGE.href}`,
    description: PAGE.description,
  };
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
    name: 'كيفية حساب مكافأة نهاية الخدمة',
    description: 'خطوات سريعة لحساب مكافأة نهاية الخدمة في السعودية باستخدام الراتب الأساسي ومدة الخدمة وسبب إنهاء العلاقة العمالية.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل الراتب الأساسي الشهري',
        text: 'ابدأ بالراتب الأساسي فقط حتى تحسب أصل المكافأة على أساس موحد وواضح.',
      },
      {
        '@type': 'HowToStep',
        name: 'حدد تاريخ البداية والنهاية',
        text: 'مدة الخدمة هي أساس الحساب، لذلك تظهر الأشهر والأيام الإضافية داخل التفصيل.',
      },
      {
        '@type': 'HowToStep',
        name: 'اختر سبب إنهاء العلاقة',
        text: 'هذا هو العنصر الذي يغيّر نسبة الاستحقاق، خصوصاً في حالات الاستقالة.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع الملخص والتفصيل',
        text: 'شاهد الاستحقاق الكامل ونسبة الاستحقاق ثم استخدم أداة المقارنة لمعرفة أثر الانتظار بضعة أشهر.',
      },
    ],
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="نظام العمل السعودي"
        title="حاسبة مكافأة نهاية الخدمة 2026"
        description="احسب مستحقاتك بسرعة وفق القاعدة العامة في نظام العمل السعودي، واعرف فرق الاستحقاق بين نهاية العقد والاستقالة، وشاهد كيف تتغير النتيجة إذا انتظرت حتى تصل إلى شريحة أفضل."
        accent={PAGE.accent}
        highlights={[
          'تحسب الاستقالة تلقائياً حسب مدة الخدمة الحالية.',
          'تفصل السنوات الخمس الأولى وما بعدها.',
          'تضيف أداة مقارنة: هل الانتظار عدة أشهر يستحق؟',
        ]}
      >
        <EndOfServiceCalculator
          initialStartDate={initialStartDate}
          initialEndDate={initialEndDate}
        />
      </CalculatorHero>

      <CalculatorSection
        id="esb-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة مبنية لتغطي القرار والحساب معاً"
        description="إذا كنت تبحث عن رقم سريع أو تحاول فهم هل الاستقالة الآن أفضل أم بعد عدة أشهر، فهذه الخريطة تختصر عليك الوصول إلى الجزء المناسب فوراً."
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="esb-intents"
        eyebrow="تغطية بحثية"
        title="عبارات يبحث بها المستخدمون قبل كتابة خطاب الاستقالة أو مراجعة التسوية"
        description="أدرجنا الكلمات المفتاحية الطويلة داخل بنية الصفحة نفسها، حتى يكون المحتوى مفيداً فعلاً لا مجرد meta keywords."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={PAGE.keywords.slice(0, 10)} />
          <CalculatorStoryBand
            title="لماذا هذه الصفحة مختلفة عن الحاسبات البسيطة؟"
            description="معظم الصفحات المنافسة تعطيك رقماً فقط. هنا نعرض الرقم، والنسبة، والتفصيل، وتأثير التوقيت، وما الذي يجب مراجعته قبل قبول التسوية."
            items={[
              { label: 'استحقاق كامل', value: 'يظهر دائماً قبل تطبيق نسبة الاستقالة حتى تفهم الفرق الحقيقي.' },
              { label: 'أثر الانتظار', value: 'أداة مدمجة تقارن بين الاستقالة الآن أو بعد عدة أشهر.' },
              { label: 'لغة مباشرة', value: 'المواد القانونية والمفاهيم معروضة بلغة عربية سهلة لا بنص جامد فقط.' },
            ]}
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="esb-guide"
        eyebrow="دليل سريع"
        title="متى أستحق المكافأة؟ وماذا يغيّر النسبة؟"
        description="بدل قراءة نصوص متفرقة، استخدم التبويبات التالية لفهم منطق الاستحقاق والحالات الشائعة والأمثلة العملية."
      >
        <Tabs defaultValue="eligibility" className="calc-app">
          <TabsList className="tabs calc-tabs-list">
            <TabsTrigger value="eligibility" className="tab calc-tabs-trigger">الاستحقاق</TabsTrigger>
            <TabsTrigger value="cases" className="tab calc-tabs-trigger">حالات خاصة</TabsTrigger>
            <TabsTrigger value="law" className="tab calc-tabs-trigger">المواد القانونية</TabsTrigger>
            <TabsTrigger value="examples" className="tab calc-tabs-trigger">أمثلة واقعية</TabsTrigger>
          </TabsList>

          <TabsContent value="eligibility" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'انتهاء العقد أو الإنهاء من صاحب العمل',
                  description: 'القاعدة العامة هنا هي الاستحقاق الكامل.',
                  content: 'تبدأ الحاسبة بإظهار كامل المكافأة أولاً، ثم تطبق أي نسبة مخفضة فقط إذا اخترت الاستقالة. هذا يساعدك على رؤية الفرق الحقيقي بين المسارين.',
                },
                {
                  title: 'الاستقالة',
                  description: 'ترتبط النسبة بمدة الخدمة.',
                  content: 'أقل من سنتين = صفر، من سنتين إلى أقل من 5 سنوات = ثلث، من 5 إلى أقل من 10 سنوات = ثلثان، و10 سنوات فأكثر = كامل المكافأة.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="cases" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'العمل الجزئي أو المتغير',
                  content: 'إذا كان الراتب الأساسي أو نمط العمل متغيراً خلال المدة، فالحاسبة الحالية تمنحك تقديراً عاماً، لكن التسوية الفعلية قد تحتاج متوسطاً أو مرجعاً عقدياً أو قانونياً أدق.',
                },
                {
                  title: 'الإجازات غير المدفوعة',
                  content: 'قد تؤثر الإجازات غير المدفوعة أو الانقطاعات الطويلة على المدة المحتسبة أو على الأجر المرجعي في بعض الحالات، لذلك اعتبر النتيجة هنا نقطة بداية للمراجعة لا بديلاً عن المستندات.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="law" className="calc-tabs-panel">
            <div className="calc-grid-2">
              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">المادة 84 باختصار</CardTitle>
                </CardHeader>
                <CardContent className="calc-card-copy">
                  الأصل الحسابي يبدأ بنصف شهر عن كل سنة من السنوات الخمس الأولى، ثم أجر شهر عن كل سنة بعد ذلك، مع احتساب كسور السنة بنسبة ما أمضاه العامل.
                </CardContent>
              </Card>
              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">المادة 85 باختصار</CardTitle>
                </CardHeader>
                <CardContent className="calc-card-copy">
                  عند الاستقالة لا يتغير أصل المعادلة، بل تتغير نسبة الاستحقاق بحسب مدة الخدمة. لذلك ترى في الحاسبة الاستحقاق الكامل ثم النسبة المطبقة على الاستقالة.
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="calc-tabs-panel">
            <div className="calc-table-wrap">
              <Table className="economy-table">
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
                    <TableCell>يحسب ثلث المكافأة الكاملة.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>فصل بعد 7 سنوات</TableCell>
                    <TableCell>7 سنوات</TableCell>
                    <TableCell>يحسب كامل الاستحقاق مع شريحة ما بعد 5 سنوات.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>استقالة بعد 12 سنة</TableCell>
                    <TableCell>12 سنة</TableCell>
                    <TableCell>تعود النسبة إلى 100% لأن العامل تجاوز 10 سنوات.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorSection>

      <CalculatorSection
        id="esb-answers"
        eyebrow="إجابات مباشرة"
        title="أسئلة طويلة الذيل تتكرر في البحث"
        description="هذا القسم مخصص لأسئلة من نوع: كم مكافأة نهاية الخدمة بعد X سنوات؟ وهل أستحق بعد سنتين؟ وما الفرق بين الاستقالة والفصل؟"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="esb-article"
        eyebrow="فهم أعمق"
        title="كيف تقرأ نتيجة الحاسبة بطريقة صحيحة؟"
        description="هذه الصفحة لا تعطيك رقماً فقط؛ بل تشرح ماذا يعني الرقم ومتى يجب أن تتوقف وتراجع مستنداتك."
        subtle
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>1. ما هي مكافأة نهاية الخدمة؟</h3>
            <p>
              هي مقابل مالي يرتبط بمدة خدمة العامل وأجره الأخير وفق القاعدة النظامية العامة.
              أهم ما يربك المستخدم عادة هو الخلط بين أصل المكافأة وبين نسبة الاستحقاق عند
              الاستقالة، ولهذا تعرض الحاسبة الرقمين منفصلين.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>2. لماذا تظهر السنوات الخمس الأولى منفصلة؟</h3>
            <p>
              لأن هذه الشريحة تحسب بنصف أجر شهر عن كل سنة، بينما ما بعدها يحسب بأجر شهر كامل.
              هذا الفصل مهم جداً خصوصاً لمن تجاوز خمس سنوات ويعتقد أن كل السنوات تعامل بنفس
              الطريقة.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>3. متى يفيد الانتظار؟</h3>
            <p>
              غالباً عند الاقتراب من حد السنتين أو الخمس أو العشر سنوات. لهذا أضفنا أداة
              مقارنة مباشرة داخل الحاسبة تساعدك على رؤية أثر التأجيل قبل اتخاذ قرار نهائي.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>4. ماذا تفعل إذا اختلفت الحاسبة مع التسوية؟</h3>
            <ul>
              <li>راجع الراتب الأساسي المعتمد في عقدك أو مسير الرواتب.</li>
              <li>تحقق من تاريخ البداية والنهاية وأي انقطاع غير مدفوع.</li>
              <li>اطلب تفصيلاً مكتوباً من جهة العمل قبل الموافقة على التسوية.</li>
            </ul>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="esb-comparison"
        eyebrow="جدول مرجعي"
        title="الفرق بين أسباب إنهاء العلاقة"
        description="هذا الجدول يلخّص القاعدة المبسطة التي تعتمد عليها الحاسبة عند اختيار سبب الإنهاء."
      >
        <div className="calc-table-wrap">
          <Table className="economy-table">
            <TableHeader>
              <TableRow>
                <TableHead>السبب</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>نسبة الاستحقاق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>انتهاء العقد</TableCell>
                <TableCell>أي مدة</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>فصل أو إنهاء من صاحب العمل</TableCell>
                <TableCell>أي مدة</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>أقل من سنتين</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>من سنتين إلى أقل من 5 سنوات</TableCell>
                <TableCell>33.33%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>من 5 إلى أقل من 10 سنوات</TableCell>
                <TableCell>66.67%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استقالة</TableCell>
                <TableCell>10 سنوات فأكثر</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="esb-rights"
        eyebrow="قبل التوقيع"
        title="خطوات عملية قبل قبول تسوية نهاية الخدمة"
        description="حتى لو بدا الرقم قريباً من توقعك، لا تتعامل مع التسوية كرقم فقط. هذه القائمة السريعة تقلل احتمال الخطأ أو التنازل غير المقصود."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorChecklist
            title="راجع هذه النقاط أولاً"
            description="قائمة مفيدة للموظف أو مسؤول الموارد البشرية عند المراجعة الأولية."
            items={[
              'قارن الراتب الأساسي المستخدم في الحاسبة مع عقد العمل أو آخر مسير راتب.',
              'تحقق من تواريخ البداية والنهاية وأي فترة انقطاع أو إجازة غير مدفوعة.',
              'افصل بين مكافأة نهاية الخدمة وأي مستحقات أخرى مثل الإجازات أو البدلات أو العمولات.',
              'اطلب تفصيلاً مكتوباً للمعادلة إذا ظهر فرق واضح بين الحاسبة وتسوية الشركة.',
              'لا تعتمد على الذاكرة وحدها إذا كانت مدة الخدمة طويلة أو مرت عبر أكثر من تعديل عقدي.',
            ]}
          />
          <CalculatorInfoGrid
            items={[
              {
                title: 'متى تحتاج تصعيداً أو مراجعة أعمق؟',
                description: 'إذا كان الفرق مادياً أو في الحالة سبب خاص.',
                content: 'عند وجود اختلاف كبير في الراتب المرجعي، أو نزاع حول مدة الخدمة، أو إجازات غير مدفوعة، أو إنهاء في ظروف استثنائية، فمن الأفضل العودة إلى المصدر الرسمي أو الاستشارة القانونية المتخصصة.',
              },
            ]}
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="esb-official"
        eyebrow="مصدر رسمي"
        title="راجع المصدر الرسمي عند الحاجة"
        description="الحاسبة مصممة للسرعة والفهم الأولي، لكن النص الرسمي هو المرجع النهائي في أي نزاع أو حالة استثنائية."
        subtle
      >
        <Card className="calc-surface-card">
          <CardContent className="calc-cta-actions pt-6">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://www.hrsd.gov.sa/" target="_blank" rel="noreferrer">
                وزارة الموارد البشرية والتنمية الاجتماعية
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/monthly-installment">انتقل إلى حاسبة القسط الشهري</Link>
            </Button>
          </CardContent>
        </Card>
      </CalculatorSection>

      <CalculatorSection
        id="esb-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة تتكرر قبل الاستقالة أو عند مراجعة التسوية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="esb-related"
        eyebrow="روابط داخلية"
        title="حاسبات مرتبطة بالتخطيط بعد نهاية الخدمة"
      >
        <RelatedCalculators currentSlug="end-of-service-benefits" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
