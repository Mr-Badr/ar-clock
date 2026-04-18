import AgeCalculator from '@/components/calculators/age/AgeCalculator.client';
import {
  CalculatorIntentCloud,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorQuickAnswerGrid,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { AGE_COMMON_FAQ } from '@/lib/calculators/age-data';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const pageTitle = 'كم عمري الآن؟';
const pageDescription = 'إذا كان سؤالك: كم عمري الآن؟ فهذه الصفحة تحسب عمرك بدقة بالسنوات والأشهر والأيام والساعات والثواني، وتعرض كم يوم عشت ومتى عيد ميلادك القادم فوراً.';
const ageIntentKeywords = [
  'كم عمري الآن',
  'حاسبة العمر',
  'احسب عمرك',
  'حساب العمر',
  'كم يوم عشت',
  'عمري بالسنوات والأشهر والأيام',
  'عمري بالثواني',
  'متى عيد ميلادي القادم',
];
const quickAnswers = [
  {
    question: 'كيف أعرف كم عمري الآن بدقة؟',
    description: 'أشهر سؤال يدخل به المستخدم إلى Google قبل فتح أي حاسبة عمر.',
    answer: 'أدخل تاريخ ميلادك فقط، وستحسب الصفحة عمرك الحالي بالسنوات والأشهر والأيام مع مجموع الأيام والساعات والثواني وموعد عيد الميلاد القادم.',
  },
  {
    question: 'هل الحاسبة تعرض كم يوم عشت؟',
    description: 'هذه نية بحث تتكرر كثيراً مع حاسبات العمر العربية.',
    answer: 'نعم. لا تكتفي الصفحة بعدد السنوات، بل تعرض أيضاً الأيام والأسابيع والساعات والدقائق والثواني حتى تصل إلى جواب أوضح وأكثر فائدة.',
  },
  {
    question: 'هل أستطيع معرفة العمر الهجري أيضاً؟',
    description: 'كثير من المستخدمين يريدون الميلادي والهجري معاً في نفس التجربة.',
    answer: 'تعرض الصفحة تقديراً للعمر الهجري التقريبي، ويمكنك أيضاً الانتقال إلى حاسبة العمر بالهجري إذا كنت تريد مقارنة أعمق بين التقويمين.',
  },
];

export const metadata = buildAgeMetadata({
  title: 'كم عمري الآن؟ | حاسبة العمر بالسنوات والأيام والثواني',
  description: pageDescription,
  keywords: [
    'حاسبة العمر',
    'احسب عمرك',
    'كم عمري',
    'حساب العمر بالأيام',
    'عمري بالثواني',
    'كم يوم عشت',
  ],
  path: '/calculators/age/calculator',
});

export default function AgeCalculatorPage() {
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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: AGE_COMMON_FAQ.map((item) => ({
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
    description: 'خطوات سريعة لمعرفة عمرك الحالي بالسنوات والأشهر والأيام مع الأيام والساعات وعيد الميلاد القادم.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ الميلاد',
        text: 'اختر اليوم والشهر والسنة بدقة حتى تكون نتيجة العمر صحيحة.',
      },
      {
        '@type': 'HowToStep',
        name: 'دع الصفحة تحسب العمر الحالي',
        text: 'ستظهر النتيجة فوراً بالسنوات والأشهر والأيام مع التحويل إلى أيام وساعات وثوانٍ.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع عيد الميلاد القادم',
        text: 'انظر إلى عدد الأيام المتبقية حتى عيد ميلادك والعمر الذي ستبلغه عنده.',
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
        badge="حاسبة العمر"
        title={pageTitle}
        description={pageDescription}
        accent="#EA580C"
        highlights={[
          'العمر بصيغة بشرية واضحة: سنوات وأشهر وأيام.',
          'تحويل مباشر إلى أيام وساعات ودقائق وثوانٍ.',
          'موعد عيد الميلاد القادم والتقدم داخل السنة الحالية.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="age-main-intent"
        eyebrow="نية البحث"
        title="هذه الصفحة تجيب عن سؤال واحد بوضوح: كم عمري الآن؟"
        description="بدلاً من عنوان عام، بُنيت الصفحة لتلتقط صيغ البحث العربية المباشرة مثل كم عمري، احسب عمرك، وكم يوم عشت."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={ageIntentKeywords} />
          <CalculatorQuickAnswerGrid items={quickAnswers} />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="age-main-content"
        eyebrow="ما الذي تحسبه الصفحة؟"
        title="النتيجة لا تقتصر على رقم واحد"
        description="هذه الصفحة تجمع بين العمر الحالي، التراكم الزمني، العمر الهجري التقريبي، عداد عيد الميلاد، وبعض الإحصائيات الممتعة التي تجعل القراءة أسرع وأوضح."
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'العمر التفصيلي',
              content: 'تبدأ النتيجة بالعمر الكامل بالسنوات والأشهر والأيام بدل الاكتفاء بعدد السنوات فقط، وهو ما يجعل الحساب أدق عند المقارنة بين تواريخ قريبة.',
            },
            {
              title: 'الوحدات التراكمية',
              content: 'بعد الحساب الأساسي تعرض الصفحة مجموع الأيام والأسابيع والساعات والدقائق والثواني لتخدم الصيغ البحثية من نوع "كم يوم عشت" و"عمري بالثواني".',
            },
            {
              title: 'عيد الميلاد القادم',
              content: 'تُظهر الصفحة عدد الأيام المتبقية حتى عيد ميلادك القادم، وتاريخ هذا اليوم، والعمر الذي ستبلغه عند الوصول إليه.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-faq"
        eyebrow="FAQ"
        title="أسئلة شائعة"
        description="إجابات مختصرة قبل الانتقال إلى بقية الحاسبات داخل قسم العمر."
        subtle
      >
        <CalculatorFaqSection items={AGE_COMMON_FAQ} />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-related"
        eyebrow="أدوات مرتبطة"
        title="أكمل من حيث تحتاج"
        description="إذا أردت زاوية أخرى على نفس التاريخ، فهذه الصفحات تكمل بعضها بدلاً من تكرار نفس النتيجة."
      >
        <RelatedCalculators currentSlug="age" />
      </CalculatorSection>
    </main>
  );
}
