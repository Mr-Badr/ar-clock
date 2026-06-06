import AgePlanetsCalculator from '@/components/calculators/age/AgePlanetsCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorResourceLinks,
  CalculatorSection,
} from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { AgeToolSections } from '../tool-sections';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const title = 'كم عمرك على المريخ والكواكب؟';
const description = 'شاهد عمرك إذا قسته بسنوات عطارد والزهرة والمريخ والمشتري وبقية كواكب المجموعة الشمسية، وافهم لماذا يختلف العمر عندما تتغير مدة السنة المدارية.';
const quickAnswers = [
  {
    question: 'كم عمري على المريخ؟',
    description: 'أشهر سؤال في هذا المسار.',
    answer: 'تحسب الصفحة عدد الأيام التي عشتها على الأرض، ثم تقسمها على طول السنة المريخية. لأن سنة المريخ أطول من السنة الأرضية، يظهر عمرك على المريخ أقل غالباً.',
  },
  {
    question: 'لماذا عمري على عطارد أكبر؟',
    description: 'أفضل مثال لفهم الفكرة بسرعة.',
    answer: 'سنة عطارد قصيرة جداً، حوالي 88 يوماً أرضياً. لذلك يمر “عام عطارد” مرات أكثر خلال حياتك، فيظهر عمرك المحسوب بسنوات عطارد أعلى من عمرك الأرضي.',
  },
  {
    question: 'هل العمر الحقيقي يتغير؟',
    description: 'حد مهم بين التعليم والخيال.',
    answer: 'لا. الفترة التي عشتها لا تتغير. الذي يتغير هو وحدة القياس: سنة الأرض، سنة المريخ، سنة عطارد، أو سنة نبتون.',
  },
  {
    question: 'هل تستخدم الصفحة كواكب المجموعة الشمسية فقط؟',
    description: 'حتى تبقى النتيجة واضحة وموثوقة.',
    answer: 'نعم. نستخدم الكواكب الثمانية المعروفة ومدة دوران كل كوكب حول الشمس. لا نخلط الصفحة بالأبراج أو التنجيم أو الكواكب القزمة في النسخة الحالية.',
  },
];
const decisionRows = [
  {
    key: 'mars',
    cells: ['أريد المثال الأشهر', 'المريخ', 'سنة المريخ أطول من الأرض، لذلك يكون عمرك على المريخ أقل غالباً.'],
  },
  {
    key: 'mercury',
    cells: ['أريد رؤية رقم كبير', 'عطارد', 'سنة عطارد قصيرة جداً، لذلك يعطي أعلى رقم تقريباً بين الكواكب.'],
  },
  {
    key: 'jupiter',
    cells: ['أريد كوكباً ضخماً وسنة طويلة', 'المشتري', 'سنة المشتري تقارب 12 سنة أرضية، لذلك يصبح العمر عليه صغيراً جداً.'],
  },
  {
    key: 'neptune',
    cells: ['أريد أقصى مقارنة', 'نبتون', 'سنة نبتون طويلة جداً، وقد لا تكمل سنة نبتونية واحدة في عمر بشري عادي.'],
  },
];
const methodItems = [
  {
    title: 'العمر على الكواكب هو قياس مختلف',
    description: 'لا يعني أنك عشت زمناً أطول أو أقصر.',
    content:
      'أنت عشت الفترة نفسها منذ تاريخ ميلادك. الصفحة تعيد قراءة هذه الفترة بوحدة سنة مختلفة: سنة عطارد أو المريخ أو المشتري بدلاً من سنة الأرض.',
  },
  {
    title: 'الأساس هو الفترة المدارية',
    description: 'أي مدة دوران الكوكب حول الشمس.',
    content:
      'كل كوكب يحتاج مدة مختلفة ليكمل دورة حول الشمس. نقسم إجمالي الأيام التي عشتها على مدة سنة الكوكب بالأيام، فنحصل على عمرك بذلك الكوكب.',
  },
  {
    title: 'الكواكب القريبة تعطي أعماراً أكبر',
    description: 'مثل عطارد والزهرة.',
    content:
      'كلما كانت السنة أقصر، زاد عدد السنوات التي تمر خلال حياتك. لذلك يظهر عمرك على عطارد أكبر من الأرض، بينما يظهر على المريخ والمشتري ونبتون أصغر.',
  },
  {
    title: 'عيد الميلاد الكوكبي تقدير تعليمي',
    description: 'متى تكمل سنة كوكبية جديدة؟',
    content:
      'تعرض الصفحة أيضاً متى يأتي عيدك القادم على كل كوكب بحسب السنة المدارية. هذه قراءة ممتعة للتعلم والمشاركة، وليست مناسبة رسمية.',
  },
];
const exampleItems = [
  {
    title: 'شخص عمره 30 سنة أرضية',
    description: 'كيف تختلف القراءة؟',
    content:
      'على عطارد قد يظهر عمره أكثر من 120 سنة عطاردية، بينما على المريخ يقارب 16 سنة مريخية، وعلى المشتري أقل من 3 سنوات. نفس الشخص، لكن وحدة السنة تغيرت.',
  },
  {
    title: 'لماذا نبتون غريب؟',
    description: 'سنة نبتون أطول من عمر الإنسان غالباً.',
    content:
      'نبتون يحتاج نحو 165 سنة أرضية ليكمل دورة حول الشمس. لذلك معظم الناس لا يكملون “عيد ميلاد نبتوني” واحداً خلال حياتهم.',
  },
  {
    title: 'استخدام تعليمي للطلاب',
    description: 'ربط العمر بالمدارات.',
    content:
      'بدلاً من حفظ أن المريخ يستغرق 687 يوماً تقريباً، يرى الطالب أثر ذلك على عمره الشخصي. هذا يجعل مفهوم المدار أسهل للفهم.',
  },
  {
    title: 'مشاركة خفيفة',
    description: 'نتيجة ممتعة لا تنبؤ.',
    content:
      'يمكنك مشاركة عمرك على المريخ أو عطارد كحقيقة حسابية طريفة. الأفضل أن تذكر أنها مبنية على طول السنة الكوكبية لا على الأبراج أو الصفات الشخصية.',
  },
];
const sourceLinks = [
  {
    href: 'https://science.nasa.gov/solar-system/planets/',
    title: 'NASA: كواكب المجموعة الشمسية',
    description: 'مرجع رسمي لفهم الكواكب ومداراتها حول الشمس.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://science.nasa.gov/mars/',
    title: 'NASA: كوكب المريخ',
    description: 'مرجع لفهم سنة المريخ ومداره مقارنة بالأرض.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: '/calculators/age/calculator',
    title: 'حاسبة العمر الأرضية',
    description: 'ابدأ منها إذا أردت عمرك الحقيقي بالسنوات والأشهر والأيام قبل المقارنة الكوكبية.',
    ctaLabel: 'افتح الحاسبة',
  },
];

export const metadata = buildAgeMetadata({
  title: 'كم عمرك على المريخ والكواكب؟ | احسب عمرك خارج الأرض',
  description,
  keywords: [
    'عمرك على الكواكب',
    'عمري على المريخ',
    'عمري على عطارد',
    'احسب عمرك على كواكب المجموعة الشمسية',
    'كم عمري على زحل',
    'العمر على المشتري',
    'العمر خارج الأرض',
    'حاسبة العمر على الكواكب',
  ],
  path: '/calculators/age/planets',
});

export default function AgePlanetsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({
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
    name: 'كيفية حساب عمرك على الكواكب',
    description: 'خطوات معرفة عمرك على المريخ وعطارد وبقية كواكب المجموعة الشمسية.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ ميلادك',
        text: 'اختر تاريخ الميلاد حتى تعرف الفترة التي عشتها على الأرض.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ العمر الأرضي كمرجع',
        text: 'اعتبر الأرض نقطة المقارنة الأساسية قبل قراءة بقية الكواكب.',
      },
      {
        '@type': 'HowToStep',
        name: 'قارن النتائج الكوكبية',
        text: 'لاحظ لماذا يزيد العمر على عطارد وينقص على المريخ والمشتري ونبتون بسبب اختلاف طول السنة.',
      },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema([
            { name: 'الرئيسية', href: '/' },
            { name: 'الحاسبات', href: '/calculators' },
            { name: 'حاسبات العمر', href: '/calculators/age' },
            { name: title, href: '/calculators/age/planets' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/planets' })) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="زاوية ممتعة"
        title="كم عمرك على المريخ والكواكب؟ حاسبة العمر خارج الأرض"
        description={description}
        highlights={[
          'تحوّل نفس العمر الأرضي إلى سنوات عطارد والزهرة والمريخ والمشتري وبقية الكواكب.',
          'توضح متى يأتي عيدك الكوكبي القادم على كل كوكب.',
          'تستخدم الفترات المدارية كمبدأ حسابي، لا الأبراج أو التنجيم.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgePlanetsCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="planets-decision"
        eyebrow="اختيار النتيجة"
        title="أي كوكب تبدأ به لفهم النتيجة؟"
        description="كل كوكب يوضح فكرة مختلفة: عطارد يشرح السنة القصيرة، المريخ مثال شائع، ونبتون يوضح السنة الطويلة جداً."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الكوكب المناسب', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="planets-method"
        eyebrow="شرح مبسط"
        title="كيف تحسب الصفحة العمر على الكواكب؟"
        description="الفكرة ليست خيالاً: نحسب الفترة التي عشتها بالأيام، ثم نقسمها على طول السنة المدارية لكل كوكب."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="planets-examples"
        eyebrow="أمثلة تعليمية"
        title="أمثلة تجعل العمر الكوكبي أسهل للفهم"
        description="هذه الأمثلة تربط الأرقام بمعنى واضح: لماذا يزيد عمرك على عطارد، ولماذا ينقص على الكواكب البعيدة."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="planets-sources"
        eyebrow="مصادر فلكية"
        title="مصادر لفهم الكواكب والمدارات"
        description="استخدم هذه المصادر عندما تريد التحقق من فكرة الفترة المدارية أو شرحها للطلاب والقراء."
        subtle
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="planets-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل تفسير العمر على الكواكب"
        description="إجابات سريعة عن المريخ وعطارد والسنة المدارية وحدود هذه النتيجة."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="planets" />
    </main>
  );
}
