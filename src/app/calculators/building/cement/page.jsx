import CementCalculator from '@/components/calculators/building/CementCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorEditorialArticle,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  CalculatorFaqSection,
  CalculatorResourceLinks,
  RelatedCalculators,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getGuidesBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tool-guides';
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.cement);
const CEMENT_SOURCE_LINKS = [
  {
    href: 'https://www.cement.org/cement-concrete/cement-concrete-faq/',
    title: 'Portland Cement Association: Cement & Concrete FAQ',
    description: 'مصدر صناعي يوضح الفرق بين الأسمنت والخرسانة ولماذا لا تكفي أكياس الأسمنت وحدها لفهم الصبة.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://www.nrmca.org/about-nrmca/about-concrete/',
    title: 'NRMCA: About Concrete',
    description: 'شرح لمكوّنات الخرسانة ودور الركام والماء والأسمنت في الخلطة الجاهزة.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://www.nrmca.org/wp-content/uploads/2021/01/04pr.pdf',
    title: 'NRMCA: Concrete Materials FAQ',
    description: 'مرجع مختصر يوضح أثر الماء والمواد على الجودة والمتانة، وهو مهم قبل تعديل الخلطة في الموقع.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://www.quikrete.com/calculator/main.asp',
    title: 'QUIKRETE: Concrete Calculator',
    description: 'حاسبة أجنبية للمقارنة عند تقدير حجم الصبة والمواد الجاهزة، مع اختلاف وحدات وعبوات السوق.',
    ctaLabel: 'افتح المصدر',
  },
];
const CEMENT_METHOD_ITEMS = [
  {
    title: 'ابدأ من حجم الصبة لا من عدد الأكياس',
    description: 'السؤال الصحيح أولاً: كم متر مكعب خرسانة تحتاج؟',
    content: (
      <p>
        احسب الحجم من الطول × العرض × السماكة بالمتر. بعد ذلك اختر العيار ووزن الكيس والهدر. إذا بدأت من “كم كيس؟” فقط فقد تنسى أن سماكة 10 سم ليست مثل 15 سم، وأن ممر مشاة ليس مثل قاعدة أو سقف.
      </p>
    ),
  },
  {
    title: 'الأسمنت جزء من الخرسانة وليس الخرسانة كلها',
    description: 'النتيجة تعرض الرمل والحصى والماء حتى لا تشتري الأسمنت وحده.',
    content: (
      <p>
        الخرسانة تتكوّن من أسمنت وماء وركام ناعم وخشن. إذا اشتريت أكياس الأسمنت فقط فلن تملك صبة جاهزة. اقرأ كمية الرمل والحصى والماء معاً، ثم اسأل المورد عن الرطوبة والنقل وطريقة الخلط إذا كان التنفيذ في الموقع.
      </p>
    ),
  },
  {
    title: 'الماء ليس زر تحسين سريع',
    description: 'زيادة الماء قد تسهّل الفرد لكنها قد تضعف الخلطة.',
    content: (
      <p>
        إذا بدت الخلطة صعبة التشغيل فلا تفتح الماء عشوائياً. نسبة الماء إلى الأسمنت تؤثر في القوة والمتانة والانكماش. في الصبات الإنشائية، اتبع المخطط أو توصية المهندس أو خلطة المورد بدلاً من تعديل النسب بالعين.
      </p>
    ),
  },
];
const CEMENT_DECISION_ROWS = [
  {
    key: 'simple-slab',
    cells: [
      'ممر، أرضية بسيطة، أو صبة صغيرة غير حرجة',
      'استخدم الحاسبة مع عيار مناسب وهدر 5% إلى 10%.',
      'راجع السماكة جيداً لأن خطأ 5 سم يغيّر الكمية كلها.',
    ],
  },
  {
    key: 'structural',
    cells: [
      'سقف، عمود، قاعدة، أو عنصر مسلح',
      'استخدم الحاسبة للمراجعة والشراء الأولي فقط.',
      'المخطط الإنشائي ومواصفة الخلطة هما المرجع النهائي.',
    ],
  },
  {
    key: 'large-pour',
    cells: [
      'صبة كبيرة أو متكررة',
      'قارن بين الخلط اليدوي والخرسانة الجاهزة.',
      'الخرسانة الجاهزة قد تكون أوضح في الجودة والمسؤولية والوقت.',
    ],
  },
  {
    key: 'mortar',
    cells: [
      'مونة، لياسة، أو محارة',
      'لا تعتمد نفس نتيجة الخرسانة مباشرة.',
      'المونة تختلف لأنها لا تستخدم الحصى بالطريقة نفسها.',
    ],
  },
];
const CEMENT_EDITORIAL_PARAGRAPHS = [
  'أقوى طريقة لحساب أكياس الأسمنت هي أن تفكر مثل شخص سيطلب مواد غداً: ما حجم الصبة؟ ما العيار؟ ما وزن الكيس؟ وما الهدر المقبول؟ بهذه الأسئلة تتحول النتيجة من رقم عابر إلى قائمة شراء يمكن مراجعتها.',
  'المنافسون غالباً يختصرون السؤال في “7 أكياس للمتر” ثم يتركونك وحدك مع الرمل والحصى والماء. هنا لا نريد أن تحفظ رقماً فقط؛ نريد أن تفهم لماذا يتغير الرقم، ومتى يكون مناسباً، ومتى يجب أن تسأل المهندس أو المورد قبل التنفيذ.',
  'إذا كان مشروعك صغيراً، ستوفر الحاسبة رحلة شراء ناقصة. وإذا كان مشروعك إنشائياً، ستعطيك لغة واضحة لمراجعة عرض الخرسانة الجاهزة أو كلام المقاول دون أن تتعامل مع النتيجة كتصميم خلطة نهائي.',
];
const CEMENT_EDITORIAL_POINTS = [
  'الحجم أولاً، العيار ثانياً، وزن الكيس ثالثاً.',
  'اقرأ الأسمنت والرمل والحصى والماء كحزمة واحدة.',
  'للصبات الإنشائية، لا تغيّر العيار أو الماء أو الهدر بعيداً عن المخطط.',
  'استخدم حاسبة تكلفة البناء عندما يصبح السؤال عن ميزانية المشروع لا عن صبة واحدة.',
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبة الأسمنت والخرسانة | كم كيس أسمنت أحتاج؟',
  description:
    'احسب عدد أكياس الأسمنت والرمل والحصى والماء لأي صبة خرسانة حسب الحجم والعيار ووزن الكيس والهدر، مع شرح واضح قبل شراء المواد.',
  keywords: getBuildingKeywords('cement'),
  url: `${SITE_URL}/calculators/building/cement`,
});

export default function CementPage() {
  const faqItems = [
    {
      question: 'كم كيس أسمنت في المتر المكعب؟',
      answer: 'يعتمد على العيار (قوة الخرسانة). المتر المكعب عيار 200 (M20) يحتاج تقريباً 7 إلى 7.5 أكياس (350 إلى 370 كجم)، بينما عيار 250 (M25) يحتاج حوالي 8.5 إلى 9 أكياس (425 إلى 450 كجم).',
    },
    {
      question: 'ما هو العيار المناسب للأسقف والأعمدة؟',
      answer: 'العرف الهندسي للمباني السكنية المعتادة هو استخدام عيار M20 أو M25 (200 إلى 250 كجم/سم²) للأعمدة والأسقف. الأفضل دائماً الرجوع للمخطط الإنشائي.',
    },
    {
      question: 'ما هي نسبة الرمل للحصى؟',
      answer: 'في الخلطات القياسية التقريبية تكون كمية الحصى أو الزلط نحو ضعف كمية الرمل، لكن النسبة الدقيقة تتغير حسب العيار ونوع الركام وطريقة الخلط. إذا كانت الصبة إنشائية، لا تستخدم قاعدة عامة بدل الخلطة المعتمدة في المخطط أو توصية المهندس. الحاسبة تساعدك على تقدير الشراء الأولي، لا على تغيير مواصفات الصبة.',
    },
    {
      question: 'هل تصلح الحاسبة لكل الدول العربية؟',
      answer: 'نعم من ناحية الكميات، لأن المتر المكعب والعيار ووزن الكيس مفاهيم مشتركة في السعودية ومصر والمغرب والخليج وبقية الدول. الاختلاف يظهر في اسم الوحدة والسعر: كيس، شيكارة، أو خنشة، وفي وزن العبوة أحياناً. لذلك اختر وزن الكيس الصحيح ثم استخدم سعر بلدك عند الشراء أو المقارنة.',
    },
    {
      question: 'هل الأسمنت هو نفسه الخرسانة؟',
      answer: 'لا. الأسمنت مادة رابطة داخل الخرسانة، أما الخرسانة فهي خليط من الأسمنت والماء والرمل والحصى أو الزلط. لذلك نتيجة الأكياس وحدها لا تكفي؛ راجع باقي المكونات في الحاسبة قبل الشراء.',
    },
    {
      question: 'هل أضيف 10% هدر دائماً؟',
      answer: 'الهدر يعتمد على حجم الصبة وطريقة النقل وحالة الموقع. 5% قد تكفي لصبة صغيرة منظمة، و10% قد تكون أكثر واقعية عند وجود سطح غير مستو أو نقل يدوي أو احتمالات انسكاب. لا تجعل الهدر يخفي خطأ في الحجم أو السماكة.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
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
    name: 'كيف تحسب أكياس الأسمنت لصبة خرسانة؟',
    inLanguage: 'ar',
    description: 'خطوات حساب الأسمنت والرمل والحصى والماء قبل شراء مواد الصبة.',
    step: [
      { '@type': 'HowToStep', name: 'احسب حجم الخرسانة', text: 'اضرب الطول في العرض في السماكة بعد تحويل كل الأبعاد إلى متر.' },
      { '@type': 'HowToStep', name: 'اختر عيار الخرسانة', text: 'اختر العيار بحسب الاستخدام، مثل M20 أو M25، ولا تختره حسب السعر فقط.' },
      { '@type': 'HowToStep', name: 'حدد وزن الكيس والهدر', text: 'اختر وزن كيس الأسمنت في سوقك ثم أضف هامش هدر مناسباً لطريقة التنفيذ.' },
      { '@type': 'HowToStep', name: 'راجع كل مكونات الخلطة', text: 'اقرأ عدد الأكياس والرمل والحصى والماء معاً، ثم راجع المخطط إذا كانت الصبة إنشائية.' },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalculatorHero
        badge="هندسة / مواد"
        title="حاسبة الأسمنت والخرسانة: احسب الأكياس والرمل والحصى قبل الشراء"
        description="إذا كنت تسأل كم كيس أسمنت أحتاج، فابدأ بحجم الصبة والعيار ووزن الكيس. هذه الحاسبة تعطيك عدد أكياس الأسمنت وكمية الرمل والحصى والماء، وتوضح متى تكون النتيجة تقديراً للشراء ومتى تحتاج مخططاً أو مهندساً."
        highlights={[
          'إجابة مباشرة لعدد أكياس الأسمنت حسب حجم الصبة.',
          'رمل وحصى وماء في نفس النتيجة، لا رقم أكياس منفصل.',
          'شرح حدود الحاسبة للصبات الإنشائية والخلط اليدوي.',
        ]}
      >
        <CementCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="cement-method"
        eyebrow="طريقة الحساب"
        title="كيف تحسب أكياس الأسمنت دون أن تخلط بين الحجم والخلطة؟"
        description="هذه البطاقات تلخّص ما تحتاج معرفته قبل أن تثق في أي رقم: حجم الصبة، مكونات الخرسانة، وحدود الماء."
      >
        <CalculatorInfoGrid items={CEMENT_METHOD_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="cement-decision"
        eyebrow="قرار الشراء"
        title="متى تكفي نتيجة حاسبة الأسمنت ومتى تحتاج مراجعة؟"
        description="استخدم النتيجة بثقة في التخطيط والشراء الأولي، لكن لا تجعلها بديلاً عن التصميم في العناصر الإنشائية."
      >
        <CalculatorDecisionTable
          columns={['حالتك', 'كيف تستخدم النتيجة؟', 'تنبيه مهم']}
          rows={CEMENT_DECISION_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="cement-editorial"
        eyebrow="شرح مبسط"
        title="لا تحفظ رقم 7 أكياس فقط"
        description="الرقم المختصر مفيد، لكنه قد يضللك إذا نسيت العيار أو وزن الكيس أو نوع الصبة."
        subtle
      >
        <CalculatorEditorialArticle
          eyebrow="قراءة قبل التنفيذ"
          title="حوّل نتيجة الحاسبة إلى قائمة شراء مفهومة"
          lead="تعلّم طريقة التفكير، لا الرقم وحده. هذا ما يمنع نقص المواد أو استخدام خلطة غير مناسبة."
          paragraphs={CEMENT_EDITORIAL_PARAGRAPHS}
          points={CEMENT_EDITORIAL_POINTS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="cement-guides"
        eyebrow="مقال داعم"
        title="افهم السؤال قبل شراء الأسمنت"
        description="هذا الشرح القصير يوضح عدد الأكياس والعيار والهدر، ثم يعيدك إلى الحاسبة لتطبيق الفكرة فوراً."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} buttonLabel="اقرأ التفسير" />
      </CalculatorSection>

      <CalculatorSection
        id="cement-sources"
        eyebrow="مصادر"
        title="مصادر لفهم الأسمنت والخرسانة"
        description="هذه مصادر تعليمية تساعدك على فهم الخلطة، لكن مواصفات الصبات الإنشائية يجب أن ترجع للمخطط والمهندس أو مورد الخرسانة."
      >
        <CalculatorResourceLinks items={CEMENT_SOURCE_LINKS} buttonLabel="افتح المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="cement-faq"
        eyebrow="قبل شراء الأسمنت"
        title="أسئلة قبل اعتماد كمية الأسمنت والخرسانة"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="cement-related"
        eyebrow="بعد الأسمنت"
        title="انتقل إلى الحديد أو تكلفة البناء عندما تتضح الخلطة"
        description="إذا عرفت كمية الأسمنت، فالخطوة التالية غالباً هي وزن الحديد أو تكلفة المشروع كاملة. اختر المسار الذي يطابق قرار الشراء الحالي."
      >
        <RelatedCalculators currentSlug="cement" />
      </CalculatorSection>

    </main>
  );
}
