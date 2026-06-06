import AgeMilestonesCalculator from '@/components/calculators/age/AgeMilestonesCalculator.client';
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

const title = 'متى تكمل 10000 يوم أو مليار ثانية؟';
const description = 'أدخل تاريخ ميلادك لتعرف متى تكمل 10,000 يوم أو مليار ثانية أو محطات عمرية كبيرة أخرى، وما الذي تجاوزته وما المحطة القادمة.';
const quickAnswers = [
  {
    question: 'متى أكمل 10,000 يوم؟',
    description: 'أشهر محطة عمرية بالأيام.',
    answer: 'أدخل تاريخ ميلادك وستعرض الصفحة تاريخ وصولك إلى 10,000 يوم، وهل تجاوزته بالفعل أم لا، وكم يوم بقي إذا كان أمامك.',
  },
  {
    question: 'متى يصبح عمري مليار ثانية؟',
    description: 'محطة مشهورة وقابلة للمشاركة.',
    answer: 'مليار ثانية يساوي تقريباً 31.7 سنة. الحاسبة تضيف 1,000,000,000 ثانية إلى تاريخ ميلادك وتعرض التاريخ المقابل ضمن قائمة المحطات.',
  },
  {
    question: 'هل 10,000 يوم يساوي 27 سنة بالضبط؟',
    description: 'سؤال مهم لتجنب التقريب الزائد.',
    answer: 'ليس بالضبط. 10,000 يوم تقارب 27 سنة و4 إلى 5 أشهر، لكن التاريخ الحقيقي يتأثر بتاريخ الميلاد والسنوات الكبيسة، لذلك تحتاج حاسبة لا تقديراً ذهنياً.',
  },
  {
    question: 'هل هذه المحطات رسمية؟',
    description: 'حدود واضحة للصفحة.',
    answer: 'لا. هي محطات زمنية ممتعة وتعليمية للمشاركة والفضول، وليست بديلاً عن العمر الرسمي بالسنوات أو الوثائق التي تطلب تاريخ الميلاد.',
  },
];
const decisionRows = [
  {
    key: 'passed',
    cells: ['أريد ما تجاوزته', 'قائمة المحطات الماضية', 'اقرأها كإنجازات زمنية مرّت بالفعل، وليست أعماراً رسمية جديدة.'],
  },
  {
    key: 'next',
    cells: ['أريد أقرب محطة قادمة', 'الأقرب القادمة في الملخص', 'هذه هي أفضل نتيجة للانتظار أو وضع تذكير شخصي.'],
  },
  {
    key: 'days',
    cells: ['أريد 10,000 يوم', 'محطات الأيام', 'مناسبة لأنها تقع غالباً في أواخر العشرينات وتصلح للمشاركة.'],
  },
  {
    key: 'seconds',
    cells: ['أريد مليار ثانية', 'محطات الثواني', 'تحتاج قراءة دقيقة لأن الثواني تجعل التاريخ حساساً للوقت إذا أردت لحظة دقيقة جداً.'],
  },
];
const methodItems = [
  {
    title: 'نبدأ من تاريخ الميلاد',
    description: 'كل محطة هي إضافة زمنية إلى يوم ميلادك.',
    content:
      'عندما تريد معرفة 10,000 يوم، تضيف الحاسبة 10,000 يوم إلى تاريخ الميلاد. وعندما تريد مليار ثانية، تضيف عدداً محدداً من الثواني. الفكرة حسابية بسيطة لكن تنفيذها يدوياً مرهق.',
  },
  {
    title: 'الأيام تختلف عن السنوات',
    description: 'لهذا لا نحول 10,000 يوم إلى رقم سنة ثابت.',
    content:
      'قد تقول إن 10,000 يوم تساوي نحو 27.4 سنة، وهذا صحيح كتقريب. لكن التاريخ الفعلي يعتمد على موضع السنوات الكبيسة بين تاريخ ميلادك والمحطة.',
  },
  {
    title: 'الماضي والقادم في نتيجة واحدة',
    description: 'الصفحة لا تكتفي بسؤال واحد.',
    content:
      'بعد إدخال تاريخ الميلاد، ترى المحطات التي تجاوزتها وما الذي ينتظرك. هذا يجعل الصفحة مناسبة للعودة لاحقاً، لأن المحطة القادمة تتغير مع الوقت.',
  },
  {
    title: 'المحطة ليست عيد ميلاد رسمي',
    description: 'هي طريقة أخرى لقراءة الزمن.',
    content:
      '10,000 يوم أو مليار ثانية لا يغيران عمرك الرسمي، لكنهما يجعلان الزمن محسوساً بطريقة مختلفة. لذلك تصلح المحطات للمشاركة والفضول، لا للوثائق.',
  },
];
const exampleItems = [
  {
    title: '10,000 يوم',
    description: 'محطة مشهورة لأنها قريبة من عمر الشباب البالغ.',
    content:
      'غالباً تصل إلى 10,000 يوم في عمر يقارب 27 سنة و4 أو 5 أشهر. إذا كنت قريباً منها، يمكن أن تكون مناسبة خفيفة للتذكير أو المشاركة.',
  },
  {
    title: 'مليار ثانية',
    description: 'محطة واحدة تحدث في أوائل الثلاثينات تقريباً.',
    content:
      'مليار ثانية يساوي أكثر من 11,500 يوم، ويقع تقريباً عند 31 سنة و8 أشهر. لذلك يفاجئ كثيرين لأنه لا يتزامن مع عيد ميلاد تقليدي.',
  },
  {
    title: '500 مليون ثانية',
    description: 'محطة مبكرة قبل المليار.',
    content:
      'إذا كان مليار ثانية بعيداً، فقد تكون 500 مليون ثانية أقرب وممتعة للمتابعة. الصفحة تعرض محطات متعددة حتى لا تنتظر رقماً واحداً فقط.',
  },
  {
    title: '2 مليار ثانية',
    description: 'محطة أكبر في مرحلة لاحقة.',
    content:
      'من تجاوز مليار ثانية يمكنه متابعة 1.5 أو 2 مليار ثانية. هذه المحطات تجعل الصفحة مفيدة في أعمار مختلفة، لا لفئة واحدة فقط.',
  },
];
const sourceLinks = [
  {
    href: 'https://www.timeanddate.com/date/duration.html',
    title: 'timeanddate: حساب المدة بين التواريخ',
    description: 'مرجع لفكرة إضافة مدد زمنية وفهم الأيام بين تاريخين.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://aa.usno.navy.mil/faq/leap_years',
    title: 'US Naval Observatory: السنوات الكبيسة',
    description: 'يفسر لماذا تؤثر السنوات الكبيسة في تواريخ محطات الأيام.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: '/calculators/age/calculator',
    title: 'حاسبة العمر الكاملة',
    description: 'استخدمها إذا أردت العمر الرسمي الحالي قبل قراءة المحطات الممتعة.',
    ctaLabel: 'افتح الحاسبة',
  },
];

export const metadata = buildAgeMetadata({
  title: 'متى تكمل 10000 يوم أو مليار ثانية؟ | إنجازات العمر',
  description,
  keywords: [
    'متى يكون عمري مليار ثانية',
    '10000 يوم كم سنة',
    'حاسبة الإنجازات العمرية',
    'متى أكمل 10000 يوم',
    'متى أكمل مليار ثانية',
    'محطات العمر',
    '10000 يوم من تاريخ الميلاد',
    'كم يوم عشت',
  ],
  path: '/calculators/age/milestones',
});

export default function AgeMilestonesPage() {
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
    name: 'كيفية معرفة محطات العمر الكبيرة',
    description: 'خطوات معرفة متى تكمل 10,000 يوم أو مليار ثانية وما المحطة العمرية القادمة.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ ميلادك',
        text: 'اختر اليوم والشهر والسنة بدقة، لأن كل محطة تُحسب من هذا التاريخ.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع المحطات الماضية',
        text: 'اقرأ المحطات التي تجاوزتها بالفعل مثل 1,000 يوم أو 500 مليون ثانية.',
      },
      {
        '@type': 'HowToStep',
        name: 'ركز على أقرب محطة قادمة',
        text: 'استخدم التاريخ القادم لوضع تذكير أو مشاركة النتيجة عندما تصل إلى المحطة.',
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
            { name: title, href: '/calculators/age/milestones' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/milestones' })) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="محطات كبيرة"
        title="متى تكمل 10000 يوم أو مليار ثانية؟ حاسبة محطات العمر"
        description={description}
        highlights={[
          'تعرض المحطات التي تجاوزتها والمحطة القادمة في شاشة واحدة.',
          'توضح تاريخ 10,000 يوم ومليار ثانية ومحطات أخرى قابلة للمشاركة.',
          'تشرح الفرق بين المحطة الممتعة والعمر الرسمي حتى لا تخلط بينهما.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeMilestonesCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="milestones-decision"
        eyebrow="اختيار النتيجة"
        title="أي محطة عمرية تحتاجها الآن؟"
        description="بعض المحطات مناسبة للانتظار، وبعضها للمشاركة، وبعضها لفهم حجم الزمن. اختر القراءة التي تخدم سؤالك."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الجزء المناسب', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="milestones-method"
        eyebrow="شرح مبسط"
        title="كيف تحسب الصفحة 10,000 يوم ومليار ثانية؟"
        description="كل محطة هي إضافة زمنية واضحة إلى تاريخ ميلادك. الصعوبة ليست في الفكرة، بل في التعامل مع التواريخ والسنوات الكبيسة دون خطأ."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="milestones-examples"
        eyebrow="أمثلة ممتعة"
        title="ماذا تعني هذه المحطات في العمر الحقيقي؟"
        description="هذه الأمثلة تحول الأرقام الكبيرة إلى تواريخ وأعمار مفهومة، حتى تعرف لماذا يهتم الناس بها."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="milestones-reading"
        eyebrow="قراءة النتيجة"
        title="كيف تستفيد من قائمة الماضي والقادم؟"
        description="القائمة ليست مجرد تواريخ كثيرة. اقرأها كخريطة زمنية صغيرة: ما الذي مرّ، ما الذي يقترب، وما الذي لا يزال بعيداً."
      >
        <div className="calc-editorial-article__body">
          <p>
            ابدأ بالمحطات التي تم تجاوزها حتى تفهم حجم الزمن الذي مرّ منذ تاريخ ميلادك. هذه القراءة مفيدة لأنها تحول العمر من رقم سنوي مألوف إلى أرقام مختلفة: أيام، ثوانٍ، ومحطات مستديرة يسهل تذكرها.
          </p>
          <p>
            بعد ذلك ركز على أقرب محطة قادمة فقط. ليس من المفيد أن تحفظ كل التواريخ دفعة واحدة؛ الأفضل أن تعرف المحطة التالية وتاريخها، ثم تعود إلى الصفحة لاحقاً عندما تقترب منها أو تتجاوزها.
          </p>
          <p>
            إذا أردت مشاركة النتيجة، اكتبها بصيغة بسيطة: “سأكمل 10,000 يوم في هذا التاريخ” أو “تجاوزت مليار ثانية”. لا تحتاج إلى شرح كل الحسابات، لكن من الجيد أن تذكر أن الرقم مبني على تاريخ ميلادك الفعلي لا على تقدير تقريبي للعمر، وأن المحطة قابلة للمراجعة متى تغيّر تاريخ المقارنة لاحقاً.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="milestones-sources"
        eyebrow="مصادر ومنهج"
        title="مصادر لفهم المدة والسنوات الكبيسة"
        description="حساب المحطات يعتمد على إضافة أيام أو ثوانٍ إلى تاريخ الميلاد. هذه المصادر تساعدك على فهم المدة وأثر السنوات الكبيسة."
        subtle
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="milestones-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل تفسير محطات العمر"
        description="إجابات مختصرة عن 10,000 يوم، مليار ثانية، ومعنى المحطات مقارنة بالعمر الرسمي."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="milestones" />
    </main>
  );
}
