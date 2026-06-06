import AgeCalculator from '@/components/calculators/age/AgeCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorResourceLinks,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Suspense } from 'react';

import SectionSkeleton from '@/components/shared/SectionSkeleton';
import { AGE_COMMON_FAQ } from '@/lib/calculators/age-data';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';

const pageTitle = 'حاسبة العمر بالتفصيل';
const pageDescription = 'أدخل تاريخ ميلادك لتحسب عمرك الان بالسنوات والأشهر والأيام، مع إجمالي الأيام والساعات والثواني، العمر الهجري التقريبي، وكم باقي على عيد ميلادك القادم.';
const quickAnswers = [
  {
    question: 'كيف أعرف كم عمري الان بدقة؟',
    description: 'السؤال الذي يتكرر أكثر قبل أي حساب للعمر.',
    answer: 'أدخل تاريخ ميلادك كما هو في الوثيقة، وستحسب الصفحة عمرك الحالي بالسنوات والأشهر والأيام، ثم تعرض إجمالي الأيام والساعات والثواني وموعد عيد الميلاد القادم.',
  },
  {
    question: 'هل الحاسبة تعرض كم يوم عشت؟',
    description: 'سؤال يتكرر كثيراً مع حاسبات العمر العربية.',
    answer: 'نعم. لا تكتفي الصفحة بعدد السنوات، بل تعرض أيضاً الأيام والأسابيع والساعات والدقائق والثواني حتى تصل إلى جواب أوضح وأكثر فائدة.',
  },
  {
    question: 'هل يمكن حساب العمر في تاريخ محدد؟',
    description: 'تحتاجه عند نموذج، مناسبة، صورة قديمة، أو تخطيط مستقبلي.',
    answer: 'نعم. اختر “تاريخ محدد” بدل “اليوم” وستعرف كم سيكون عمرك في ذلك اليوم أو كم كان عمرك في تاريخ سابق، بشرط أن يكون التاريخ بعد تاريخ الميلاد.',
  },
  {
    question: 'هل أستطيع معرفة العمر الهجري؟',
    description: 'قد تحتاج العمر بالميلادي والهجري معاً في نفس الصفحة.',
    answer: 'تعرض الصفحة تقديراً للعمر الهجري وتاريخ الميلاد الهجري عندما يكون التحويل مدعوماً. وللمقارنة الأعمق بين التقويمين افتح حاسبة العمر الهجري المتخصصة.',
  },
];
const decisionRows = [
  {
    key: 'human-age',
    cells: [
      'أريد جواب “كم عمري؟” فقط',
      'اقرأ العمر الكامل',
      'ابدأ بالسنوات والأشهر والأيام لأنها الصيغة التي يفهمها الناس أكثر من إجمالي الأيام.',
    ],
  },
  {
    key: 'total-days',
    cells: [
      'أريد كم يوم عشت أو عمري بالساعات',
      'اقرأ الوحدات التراكمية',
      'استخدم إجمالي الأيام والساعات والثواني للفضول والمشاركة، لا للوثائق الرسمية.',
    ],
  },
  {
    key: 'custom-date',
    cells: [
      'أريد العمر في يوم محدد',
      'غيّر تاريخ المقارنة',
      'مفيد لموعد دراسة، مناسبة قادمة، صورة قديمة، أو سؤال “كم كان عمري وقتها؟”.',
    ],
  },
  {
    key: 'official-use',
    cells: [
      'أحتاج النتيجة لنموذج أو جهة رسمية',
      'احتفظ بتاريخ الميلاد الأصلي',
      'استخدم الحاسبة للقراءة، ثم راجع التقويم والصيغة المطلوبة لدى الجهة المعنية.',
    ],
  },
];
const sourceLinks = [
  {
    href: 'https://aa.usno.navy.mil/faq/leap_years',
    title: 'US Naval Observatory: السنوات الكبيسة',
    description: 'مرجع يشرح قاعدة السنة الكبيسة في التقويم الميلادي، وهي سبب مهم لاختلاف عدد أيام السنوات.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://praycalc.org/hijri',
    title: 'PrayCalc: التقويم الهجري القمري',
    description: 'شرح لنظام السنة الهجرية القمرية وسبب كونها أقصر من السنة الميلادية.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: '/date/converter',
    title: 'محول التاريخ داخل الموقع',
    description: 'استخدمه إذا كان تاريخ الميلاد أو تاريخ المقارنة مكتوباً بتقويم مختلف.',
    ctaLabel: 'حوّل التاريخ',
  },
];

export const metadata = buildAgeMetadata({
  title: 'حاسبة العمر بالتفصيل | كم عمري الان بالسنوات والأيام والثواني',
  description: pageDescription,
  keywords: [
    'كم عمري الان',
    'كم عمري الآن',
    'حاسبة العمر',
    'احسب عمرك',
    'كم عمري',
    'حساب العمر بالأيام',
    'عمري بالثواني',
    'كم يوم عشت',
    'كم باقي على عيد ميلادي',
    'حساب العمر بتاريخ الميلاد',
    'كم عمري في تاريخ معين',
    'حاسبة العمر بالهجري والميلادي',
  ],
  path: '/calculators/age/calculator',
});

export default function AgeCalculatorPage() {
  const faqItems = Array.isArray(AGE_COMMON_FAQ) ? AGE_COMMON_FAQ : [];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', href: '/' },
    { name: 'الحاسبات', href: '/calculators' },
    { name: 'حاسبات العمر', href: '/calculators/age' },
    { name: pageTitle, href: '/calculators/age/calculator' },
  ]);
  const softwareSchema = buildSoftwareSchema({
    name: pageTitle,
    description: pageDescription,
    path: '/calculators/age/calculator',
  });
  const schemaFaqItems = [...quickAnswers, ...faqItems];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: schemaFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'كيفية استخدام حاسبة العمر',
    description: 'خطوات سريعة لمعرفة عمرك الحالي أو عمرك في تاريخ محدد بالسنوات والأشهر والأيام مع إجمالي الأيام وعيد الميلاد القادم.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ الميلاد',
        text: 'اختر اليوم والشهر والسنة كما تظهر في الوثيقة أو التاريخ الذي تعتمد عليه.',
      },
      {
        '@type': 'HowToStep',
        name: 'اختر تاريخ المقارنة',
        text: 'اترك الخيار على اليوم إذا كنت تريد عمرك الآن، أو اختر تاريخاً محدداً لمعرفة عمرك في يوم سابق أو قادم.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ العمر الكامل أولاً',
        text: 'ابدأ بالسنوات والأشهر والأيام، ثم انتقل إلى إجمالي الأيام والساعات والثواني إذا أردت قراءة تفصيلية.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع عيد الميلاد والتحويل',
        text: 'انظر إلى عيد الميلاد القادم والعمر الهجري التقريبي، ثم استخدم حاسبة الهجري المتخصصة عند الحاجة.',
      },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="حاسبة العمر"
        title="حاسبة العمر | كم عمري الان بالسنوات والأيام والثواني"
        description={pageDescription}
        highlights={[
          'يعطيك العمر الكامل بصيغة بشرية واضحة: سنوات وأشهر وأيام.',
          'يعرض كم يوم عشت وكم ساعة ودقيقة وثانية مرت منذ تاريخ الميلاد.',
          'يسمح بتغيير تاريخ المقارنة لمعرفة عمرك في يوم سابق أو قادم.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="age-main-content"
        eyebrow="ما الذي تحسبه الصفحة؟"
        title="حاسبة العمر تقيس الفترة بين تاريخين لا رقم السنة فقط"
        description="الصفحة تبدأ من تاريخ ميلادك وتاريخ المقارنة، ثم تفك الفرق إلى عمر مقروء ووحدات تراكمية ومعلومات عيد الميلاد."
      >
        <div className="calc-editorial-article__body">
          <p>
            أفضل طريقة لاستخدام حاسبة العمر هي إدخال تاريخ الميلاد كما هو في الوثيقة الأصلية، ثم قراءة النتيجة التفصيلية لا رقم السنوات فقط. الفرق بين شخصين مولودين في السنة نفسها قد يكون كبيراً إذا اختلف الشهر أو اليوم، ولهذا تعرض الصفحة السنوات والأشهر والأيام معاً.
          </p>
          <p>
            عندما تختار تاريخ مقارنة محدداً، لا تسأل الصفحة “كم عمري اليوم؟” بل “كم عمري في ذلك اليوم؟”. هذه نقطة مهمة عند مراجعة صورة قديمة، تاريخ مدرسة، مناسبة قادمة، أو موعد تقاعد محتمل، لأن الجواب يتغير بتغير تاريخ المقارنة.
          </p>
          <p>
            إذا كنت تحتاج النتيجة لمناسبة أو نموذج أو مشاركة عائلية، فاحتفظ بالتاريخ الأصلي مع النتيجة. هذا يجعل العمر قابلاً للمراجعة، ويساعدك على الانتقال لاحقاً إلى العمر الهجري أو عدّاد عيد الميلاد دون إعادة البحث من البداية.
          </p>
        </div>
        <CalculatorInfoGrid
          items={[
            {
              title: 'العمر التفصيلي',
              description: 'الجواب الأقرب للسؤال اليومي.',
              content: 'تبدأ النتيجة بالعمر الكامل بالسنوات والأشهر والأيام بدل الاكتفاء بعدد السنوات فقط، وهو ما يجعل الحساب أدق عند المقارنة بين تواريخ قريبة.',
            },
            {
              title: 'الوحدات التراكمية',
              description: 'كم يوم وساعة عشت؟',
              content: 'بعد الحساب الأساسي تعرض الصفحة مجموع الأيام والأسابيع والساعات والدقائق والثواني حتى ترى عمرك من أكثر من زاوية واضحة وممتعة.',
            },
            {
              title: 'عيد الميلاد القادم',
              description: 'المرحلة التالية بعد العمر الحالي.',
              content: 'تُظهر الصفحة عدد الأيام المتبقية حتى عيد ميلادك القادم، وتاريخ هذا اليوم، والعمر الذي ستبلغه عند الوصول إليه.',
            },
            {
              title: 'العمر في تاريخ معين',
              description: 'للمناسبات والنماذج والتخطيط.',
              content: 'إذا اخترت تاريخ مقارنة، تعرض الصفحة عمرك في ذلك التاريخ تحديداً. هذه القراءة أدق من محاولة الحساب ذهنياً أو الاعتماد على سنة الميلاد وحدها.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-decision"
        eyebrow="اختيار النتيجة"
        title="أي جزء من النتيجة تحتاجه فعلاً؟"
        description="النتيجة الواحدة تحتوي عدة قراءات. اختر القراءة المناسبة للسؤال حتى لا تستخدم رقم الأيام مثلاً في سياق يحتاج العمر الكامل."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الجزء الذي تقرؤه', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-sources"
        eyebrow="مصادر ومنهج"
        title="لماذا تختلف النتائج بين الميلادي والهجري والسنوات الكبيسة؟"
        description="هذه المصادر تساعدك على فهم قواعد التقويم التي تؤثر في حساب العمر، خصوصاً السنوات الكبيسة والسنة الهجرية القمرية."
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-faq"
        eyebrow="بعد النتيجة"
        title="أسئلة قبل مشاركة العمر أو استخدامه"
        description="إجابات مختصرة قبل الانتقال إلى بقية الحاسبات داخل قسم العمر."
        subtle
      >
        <CalculatorFaqSection items={schemaFaqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-related"
        eyebrow="بعد حساب العمر"
        title="أكمل من حيث تحتاج"
        description="إذا أردت زاوية أخرى على نفس التاريخ، فهذه الصفحات تكمل بعضها بدلاً من تكرار نفس النتيجة."
      >
        <RelatedCalculators currentSlug="age-calculator" />
      </CalculatorSection>
    </main>
  );
}
