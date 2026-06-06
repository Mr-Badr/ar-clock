import BirthdayDetailsCalculator from '@/components/calculators/age/BirthdayDetailsCalculator.client';
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

const title = 'في أي يوم وُلدت؟';
const description = 'أدخل تاريخ ميلادك لتعرف يوم الأسبوع الذي وُلدت فيه، التاريخ الهجري الموافق، جيلك، فصل ميلادك، نصف عيد ميلادك القادم، وهل كانت سنة ميلادك كبيسة.';
const quickAnswers = [
  {
    question: 'في أي يوم وُلدت؟',
    description: 'الجواب الأساسي لهذه الصفحة.',
    answer: 'أدخل تاريخ ميلادك وستعرض الحاسبة يوم الأسبوع مباشرة، مثل السبت أو الأربعاء، مع تاريخ الميلاد الهجري وبعض التفاصيل الزمنية الخفيفة.',
  },
  {
    question: 'هل الصفحة تعرض تاريخ ميلادي بالهجري؟',
    description: 'مهم لمن يعرف التاريخ الميلادي فقط.',
    answer: 'نعم. عند توفر التحويل، تعرض الصفحة التاريخ الهجري الموافق لتاريخ ميلادك حتى ترى اليوم نفسه بالتقويمين دون فتح أداة أخرى.',
  },
  {
    question: 'ما معنى نصف عيد الميلاد؟',
    description: 'سؤال يتكرر في نتائج يوم الميلاد.',
    answer: 'نصف عيد الميلاد هو تاريخ يقع بعد ستة أشهر تقريباً من عيد ميلادك أو قبله بحسب الموضع داخل السنة. نعرضه كمرجع ممتع للتقويم لا كموعد رسمي.',
  },
  {
    question: 'هل هذه الصفحة مرتبطة بالأبراج؟',
    description: 'فصل مهم بين الحساب والتنبؤ.',
    answer: 'لا. الصفحة تحسب معلومات زمنية يمكن التحقق منها: يوم الأسبوع، التاريخ الموازي، الفصل، الجيل، ونصف عيد الميلاد. لا تقدم صفات شخصية أو تنبؤات.',
  },
];
const decisionRows = [
  {
    key: 'weekday',
    cells: ['أريد معرفة يوم الأسبوع', 'بطاقة يوم الميلاد', 'اقرأ اسم اليوم أولاً، ثم طابقه مع التاريخ الأصلي إذا ستشاركه.'],
  },
  {
    key: 'hijri',
    cells: ['أريد تاريخ ميلادي بالهجري', 'التاريخ الهجري في الحقائق السريعة', 'استخدمه للفضول أو المقارنة، وافتح محوّل التاريخ إذا كان الاستخدام رسمياً.'],
  },
  {
    key: 'half',
    cells: ['أريد نصف عيد الميلاد', 'بطاقة نصف عيد الميلاد', 'تعامل معه كتاريخ ممتع للتقويم أو التخطيط الشخصي، وليس تاريخاً رسمياً ثابتاً.'],
  },
  {
    key: 'generation',
    cells: ['أريد معرفة جيلي أو فصل ميلادي', 'بطاقات الجيل والفصل', 'هذه تصنيفات تعليمية خفيفة تساعد على فهم السياق الزمني، وليست حكماً على شخصيتك.'],
  },
];
const methodItems = [
  {
    title: 'نبدأ بالتاريخ نفسه لا بالعمر',
    description: 'هذه الصفحة لا تحتاج معرفة عمرك الحالي أولاً.',
    content:
      'السؤال هنا هو: ما اليوم الذي وافق تاريخ ميلادي؟ لذلك تأخذ الحاسبة تاريخ الميلاد كما أدخلته، ثم تحدد يوم الأسبوع الموافق له وفق التقويم المستخدم في الحساب.',
  },
  {
    title: 'السنوات الكبيسة جزء من المسار',
    description: 'فبراير والسنة الكبيسة يغيران ترتيب الأيام.',
    content:
      'عندما تمر سنة كبيسة، يضاف يوم إلى التقويم الميلادي، وهذا يغيّر انتقال أيام الأسبوع عبر السنوات. لذلك لا يكفي أن تحفظ قاعدة بسيطة مثل “كل سنة يتقدم اليوم يوماً واحداً”.',
  },
  {
    title: 'التاريخ الهجري قراءة موازية',
    description: 'لا نجعله بديلاً عن التاريخ الأصلي.',
    content:
      'إذا أدخلت تاريخاً ميلادياً، تعرض الصفحة التاريخ الهجري الموافق عندما يكون التحويل مدعوماً. استخدمه كقراءة موازية، ثم راجع محول التاريخ إذا كان الأمر وثيقة أو موعداً رسمياً.',
  },
  {
    title: 'نصف عيد الميلاد ليس عيداً رسمياً',
    description: 'هو نقطة تقويمية لطيفة بين عيدين.',
    content:
      'نصف عيد الميلاد يساعدك على رؤية منتصف المسافة تقريباً بين عيد ميلادك الحالي والقادم. بعض الناس يستخدمونه للمشاركة أو التخطيط الخفيف، لكنه لا يحمل معنى قانونياً أو دينياً بحد ذاته.',
  },
];
const exampleItems = [
  {
    title: 'مثال عائلي',
    description: 'سؤال سريع في جلسة أو محادثة.',
    content:
      'إذا سألك أحدهم “أنت مولود يوم إيش؟” أدخل التاريخ واقرأ اسم اليوم مباشرة. شارك اليوم والتاريخ الأصلي معاً حتى لا يتحول الجواب إلى تخمين.',
  },
  {
    title: 'مثال وثيقة قديمة',
    description: 'عندما يظهر التاريخ بصيغة غير معتادة.',
    content:
      'إذا كان تاريخ الميلاد مكتوباً هجرياً أو بصيغة يوم/شهر/سنة مختلفة، تأكد من ترتيب الحقول أولاً. خطأ تبديل اليوم والشهر يعطي يوم أسبوع مختلفاً تماماً.',
  },
  {
    title: 'مثال مشاركة خفيفة',
    description: 'بطاقة ميلاد بلا مبالغة.',
    content:
      'يمكنك مشاركة يوم الأسبوع، الفصل، الجيل، ونصف عيد الميلاد كحقائق زمنية لطيفة. الأفضل ألا تضيف إليها صفات شخصية أو أحكاماً غير محسوبة.',
  },
  {
    title: 'مثال تقويم شخصي',
    description: 'للعودة إلى مواعيد صغيرة.',
    content:
      'استخدم نصف عيد الميلاد كتذكير بسيط أو مناسبة شخصية خفيفة. وإذا كان الهدف مناسبة فعلية، فانتقل إلى عداد عيد الميلاد لأنه يعطيك الوقت المتبقي بشكل أدق.',
  },
];
const sourceLinks = [
  {
    href: 'https://www.timeanddate.com/date/weekday.html',
    title: 'timeanddate: حاسبة يوم الأسبوع',
    description: 'مرجع مقارن لفكرة تحديد يوم الأسبوع لأي تاريخ ضمن التقويم الميلادي.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://aa.usno.navy.mil/faq/leap_years',
    title: 'US Naval Observatory: السنوات الكبيسة',
    description: 'يفسر لماذا تؤثر السنوات الكبيسة في ترتيب الأيام داخل السنة والتقويم.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://www.pewresearch.org/short-reads/2019/01/17/where-millennials-end-and-generation-z-begins/',
    title: 'Pew Research Center: حدود الأجيال الحديثة',
    description: 'مرجع لتصنيفات الأجيال الشائعة التي تظهر في بطاقة الميلاد كتفسير زمني خفيف.',
    ctaLabel: 'راجع المصدر',
  },
];

export const metadata = buildAgeMetadata({
  title: 'في أي يوم وُلدت؟ | حاسبة يوم الميلاد والتاريخ الهجري',
  description,
  keywords: [
    'في أي يوم ولدت',
    'يوم ميلادي كان في أي يوم',
    'اكتشف يوم ميلادك',
    'نصف عيد الميلاد',
    'تاريخ ميلادي بالهجري',
    'حاسبة يوم الميلاد',
    'اعرف يوم ولادتك',
    'ما هو جيلي من تاريخ الميلاد',
  ],
  path: '/calculators/age/birth-day',
});

export default function BirthdayPage() {
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
    name: 'كيفية معرفة يوم الميلاد',
    description: 'خطوات معرفة يوم الأسبوع الذي وُلدت فيه مع التاريخ الهجري ونصف عيد الميلاد.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ الميلاد',
        text: 'اختر اليوم والشهر والسنة كما تظهر في الوثيقة أو السجل الذي تعتمد عليه.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ بطاقة يوم الميلاد',
        text: 'ابدأ باسم يوم الأسبوع، ثم راجع التاريخ الميلادي والهجري والفصل والجيل.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع نصف عيد الميلاد',
        text: 'استخدم نصف عيد الميلاد كتاريخ خفيف للتقويم أو المشاركة، لا كموعد رسمي.',
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
            { name: title, href: '/calculators/age/birth-day' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/birth-day' })) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="تفاصيل الميلاد"
        title="في أي يوم وُلدت؟ حاسبة يوم الميلاد والتاريخ الهجري"
        description={description}
        highlights={[
          'يعرض يوم الأسبوع الذي وُلدت فيه مع التاريخ الهجري الموافق.',
          'يضيف الجيل والفصل ونصف عيد الميلاد وسنة الميلاد الكبيسة في بطاقة واحدة.',
          'يركز على حساب تقويمي قابل للتحقق، بلا أبراج أو تنبؤات شخصية.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <BirthdayDetailsCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="birthday-decision"
        eyebrow="اختيار النتيجة"
        title="اختر الجزء المهم من نتيجة يوم الميلاد"
        description="ليس كل زائر يحتاج كل البطاقات. هذا الجدول يساعدك على قراءة النتيجة التي تخدم سؤالك مباشرة."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'أين تقرأه؟', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="birthday-method"
        eyebrow="شرح مبسط"
        title="كيف تعرف الصفحة يوم ولادتك من تاريخ واحد؟"
        description="الفكرة أبسط مما تبدو: كل تاريخ له موضع داخل التقويم، وهذا الموضع يحدد يوم الأسبوع. السنوات الكبيسة وطول الأشهر هي السبب في أن الحساب اليدوي يخطئ كثيراً."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="birthday-examples"
        eyebrow="أمثلة واقعية"
        title="متى تصبح صفحة يوم الميلاد مفيدة لك؟"
        description="هذه أمثلة تساعدك على استخدام النتيجة كحقيقة زمنية واضحة، لا كجملة عامة أو تنبؤ."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="birthday-boundaries"
        eyebrow="حدود النتيجة"
        title="ما الذي لا تعنيه نتيجة يوم الميلاد؟"
        description="معرفة يوم ولادتك ممتعة ومفيدة، لكنها تبقى معلومة تقويمية. قوة الصفحة أنها تجيب بوضوح دون أن تدّعي أكثر مما يعرفه التاريخ."
      >
        <div className="calc-editorial-article__body">
          <p>
            إذا ظهر أنك وُلدت يوم الجمعة أو الاثنين، فهذا يعني أن تاريخ الميلاد وافق ذلك اليوم في التقويم. لا يعني ذلك أن شخصيتك محكومة بهذا اليوم، ولا أن مستقبلك يمكن قراءته منه. لذلك فصلنا الصفحة عن الأبراج والتنجيم، وركزنا على معلومات يمكن حسابها ومراجعتها.
          </p>
          <p>
            تصنيف الجيل أيضاً يحتاج قراءة هادئة. عندما تقول البطاقة إنك من جيل معيّن، فهي تستخدم حدوداً شائعة في الكتابة الاجتماعية لا قاعدة رسمية عالمية. قد تختلف الحدود بين مصدر وآخر، لذلك استخدمها كلمحة زمنية تساعدك على فهم السياق، لا كهوية مغلقة.
          </p>
          <p>
            أما التاريخ الهجري ونصف عيد الميلاد فهما مساعدان للتقويم والمشاركة. إذا كان السؤال مرتبطاً بوثيقة، موعد رسمي، أو إثبات عمر، فابدأ من التاريخ الأصلي وافتح محوّل التاريخ عند الحاجة. الحاسبة تجعل القراءة أسهل، لكنها لا تستبدل الجهة التي تطلب التاريخ.
          </p>
          <p>
            أفضل استخدام للصفحة هو أن تأخذ منها معلومة واحدة واضحة ثم تكمل حسب حاجتك: يوم الأسبوع للمشاركة، التاريخ الهجري للمقارنة، نصف عيد الميلاد للتقويم الشخصي، أو الجيل والفصل كلمحة خفيفة. بهذه الطريقة تبقى النتيجة ممتعة ومفيدة من دون مبالغة، وتعرف بالضبط متى تحتاج صفحة العمر الكاملة أو عداد عيد الميلاد بدلاً منها دون إعادة الحساب من البداية أو خلط أكثر من سؤال في نتيجة واحدة.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="birthday-sources"
        eyebrow="مصادر ومنهج"
        title="مصادر تساعدك على فهم يوم الأسبوع والسنوات الكبيسة"
        description="نستخدم هذه المراجع لفهم قواعد التقويم والسنوات الكبيسة وتصنيفات الأجيال. النتيجة داخل الصفحة تبقى حساباً زمنياً لا تفسيراً لشخصيتك."
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="birthday-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل تفسير يوم الميلاد"
        description="إجابات قصيرة تساعدك على الفصل بين نتيجة تقويمية مفيدة وبين الاستخدامات غير الدقيقة مثل الأبراج أو التنبؤات."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="birth-day" />
    </main>
  );
}
