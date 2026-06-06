import RebarCalculator from '@/components/calculators/building/RebarCalculator.client';
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
import {
  REBAR_DIAMETERS,
  REBAR_WEIGHT_PER_METER,
  REBAR_TYPICAL_USE,
} from '@/lib/calculators/building/constants';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.rebar);
const REBAR_SOURCE_LINKS = [
  {
    href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/rebar-properties/',
    title: 'CRSI: Rebar Properties',
    description: 'مرجع متخصص في خصائص حديد التسليح وأقطاره واستخداماته في الخرسانة المسلحة.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://www.structuralguide.com/rebar-weight/',
    title: 'Structural Guide: Rebar Weight per Meter',
    description: 'جدول مقارن لأوزان الحديد بالمتر والقدم، مفيد لمراجعة القيم التقريبية قبل الشراء.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: '/blog/how-to-estimate-rebar-weight',
    title: 'شرح عربي: كيف تقدّر وزن الحديد؟',
    description: 'دليل عربي يشرح المعادلة، وزن سيخ 12 متر، والتحويل إلى طن قبل طلب عرض سعر.',
    ctaLabel: 'اقرأ الشرح',
  },
  {
    href: '/calculators/building/cement',
    title: 'حاسبة الأسمنت والخرسانة',
    description: 'افتحها عندما يتحول السؤال من وزن الحديد إلى مواد الصبة كاملة.',
    ctaLabel: 'احسب مواد الصبة',
  },
];
const REBAR_METHOD_ITEMS = [
  {
    title: 'الوزن يبدأ من القطر لأن القطر مربع في المعادلة',
    description: 'الفرق بين 12 و16 ملم ليس فرقاً بسيطاً في الوزن.',
    content: (
      <p>
        معادلة وزن الحديد بالمتر هي القطر بالمليمتر مربعاً مقسوماً على 162. لذلك زيادة القطر ترفع الوزن بسرعة. سيخ 16 ملم ليس أثقل من 12 ملم بنسبة بسيطة؛ لأن 16² أكبر بكثير من 12². لهذا ابدأ دائماً بالقطر الصحيح من المخطط.
      </p>
    ),
  },
  {
    title: 'فرّق بين وزن المتر ووزن السيخ والوزن الإجمالي',
    description: 'كل رقم يخدم قراراً مختلفاً.',
    content: (
      <p>
        وزن المتر يساعدك على مراجعة الجدول، وزن سيخ 12 متر يساعدك عند الشراء، والوزن الإجمالي بالكيلو أو الطن يساعدك على طلب السعر. إذا خلطت هذه الأرقام قد تطلب عدد أسياخ صحيحاً لكن بسعر أو وزن غير مطابق.
      </p>
    ),
  },
  {
    title: 'الهدر والتراكب لا يظهران من المعادلة وحدها',
    description: 'الحاسبة تحوّل الأطوال إلى وزن، لكنها لا تصمم التفريد.',
    content: (
      <p>
        في الموقع قد تحتاج تراكباً، ثنياً، قصاً، أو أطوالاً إضافية حسب التفاصيل الإنشائية. لذلك استخدم الحاسبة لمراجعة الوزن والشراء الأولي، ثم ارجع إلى جدول تفريد الحديد أو المخطط قبل اعتماد الكمية النهائية.
      </p>
    ),
  },
];
const REBAR_DECISION_ROWS = [
  {
    key: 'bar-weight',
    cells: [
      'أريد وزن سيخ 12 متر',
      'اختر القطر وأدخل طول 12 وعدد 1.',
      'مفيد لمراجعة المورد أو جدول الأوزان بسرعة.',
    ],
  },
  {
    key: 'mixed-lengths',
    cells: [
      'لدي أطوال مختلفة بعد التقطيع',
      'أضف كل طول وعدده في سطر مستقل.',
      'لا تجمع الأطوال ذهنياً إذا كان المشروع كبيراً؛ خطأ صغير يتكرر كثيراً.',
    ],
  },
  {
    key: 'buying',
    cells: [
      'أريد طلب سعر من المورد',
      'اقرأ الوزن بالطن بعد إدخال كل الأطوال.',
      'اسأل عن سعر الطن، النقل، القص، وربط الحديد إن كانت منفصلة.',
    ],
  },
  {
    key: 'design',
    cells: [
      'أريد معرفة كمية حديد سقف أو قاعدة',
      'استخدم الحاسبة بعد وجود مخطط أو جدول تفريد.',
      'لا تستخدم متوسط كجم/م² كبديل عن التصميم الإنشائي.',
    ],
  },
];
const REBAR_EDITORIAL_PARAGRAPHS = [
  'من يبحث عن وزن الحديد غالباً لا يريد درساً نظرياً؛ يريد أن يطلب كمية، يقارن سعر طن، أو يراجع جدول تفريد. لذلك تبدأ الصفحة بالحاسبة، ثم تعطيك جدول الأقطار والشرح الذي يمنع الخلط بين وزن متر واحد ووزن سيخ كامل.',
  'المعادلة سهلة، لكنها لا تكفي وحدها. الخطأ الحقيقي يحدث عندما تستخدم قطر 12 بدل 16، أو تنسى أن المورد يبيع بالطن، أو تعتمد رقماً عاماً للسقف دون مخطط. الصفحة تربط بين الحساب السريع وحدود القرار الهندسي.',
  'استخدم النتيجة كي تسأل سؤالاً أفضل: هل هذا الوزن يشمل كل الأطوال؟ هل يوجد تراكب؟ هل هناك هدر قص؟ وهل السعر المعروض شامل النقل؟ بهذه الطريقة يصبح الرقم أداة تفاوض وفهم، لا مجرد ناتج آلة حاسبة.',
];
const REBAR_EDITORIAL_POINTS = [
  'القطر الصحيح أهم من سرعة الحساب.',
  'وزن سيخ 12م يسهّل الشراء، لكن الوزن الإجمالي هو ما يهم في التسعير.',
  'التفريد والتراكب والهدر يحتاجان مخططاً أو مهندساً عند التنفيذ.',
  'لا تقارن سعر موردين قبل توحيد القطر والطول والوزن وطريقة التسليم.',
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبة وزن الحديد | وزن حديد التسليح وسيخ 12 متر',
  description:
    'احسب وزن حديد التسليح حسب القطر والطول والعدد، واعرف وزن المتر وسيخ 12 متر والتحويل إلى كجم وطن قبل شراء الحديد أو مقارنة السعر.',
  keywords: getBuildingKeywords('rebar'),
  url: `${SITE_URL}/calculators/building/rebar`,
});

export default function RebarPage() {
  const faqItems = [
    {
      question: 'ما هو معيار حساب وزن حديد التسليح؟',
      answer: 'المعادلة الهندسية القياسية هي: الوزن (كجم/م) = قطر الحديد (مم)² ÷ 162. هذه المعادلة مشتقة من كثافة الفولاذ (7850 كجم/م³) وهي معتمدة في الكودات الهندسية العالمية (ACI, BS, ECP).',
    },
    {
      question: 'كم وزن سيخ حديد 12 متر قطر 16 ملم؟',
      answer: 'وزن المتر لقطر 16 هو 1.578 كجم/م. إذاً سيخ 12 متر = 1.578 × 12 = 18.94 كجم تقريباً.',
    },
    {
      question: 'ما الفرق بين الحديد الملساء والمشرشرة؟',
      answer: 'الحديد المشرشر يتمسك بالخرسانة أفضل ويستخدم غالباً في التسليح الرئيسي للكمرات والأعمدة والأسقف. الحديد الأملس يظهر في بعض التفاصيل أو الاستخدامات الثانوية بحسب البلد والمخطط. من ناحية الوزن، القطر والطول هما العاملان الأساسيان، لذلك يكون الوزن لنفس القطر والطول متقارباً حتى لو اختلف شكل السطح.',
    },
    {
      question: 'كم كيلو حديد في المتر المربع من السقف؟',
      answer: 'يعتمد على نوع السقف والتصميم الإنشائي والبحور والأحمال. بشكل تقريبي، السقف الهوردي قد يدور حول 10 إلى 15 كجم/م²، والسقف المصمت قد يحتاج 15 إلى 25 كجم/م²، لكن هذه أرقام للتصور الأولي فقط. لا تعتمد كمية الحديد النهائية دون مخطط إنشائي أو مراجعة مهندس، لأن الخطأ هنا مكلف وخطر.',
    },
    {
      question: 'هل أستخدم الحاسبة بالكيلو أم بالطن عند الشراء؟',
      answer: 'استخدم الكيلو لفهم التفاصيل الصغيرة مثل وزن قطر أو طول محدد، واستخدم الطن عند طلب عرض سعر كبير من المورد. الحاسبة تعرض الرقمين معاً حتى لا تضطر للتحويل يدوياً. في مصر أو السعودية أو المغرب أو الخليج قد تختلف طريقة عرض السعر، لكن الوزن الهندسي نفسه يبقى مبنياً على القطر والطول والعدد.',
    },
    {
      question: 'هل تحسب الحاسبة الهدر والتراكب تلقائياً؟',
      answer: 'لا. الحاسبة تحول الأطوال التي تدخلها إلى وزن. إذا كان المخطط يحتاج تراكباً أو ثنياً أو هدر قص، أدخل الأطوال بعد مراجعة جدول التفريد أو أضف هامشاً مناسباً بمعرفة المهندس أو المقاول.',
    },
    {
      question: 'لماذا وزن قطر 16 أكبر بكثير من قطر 12؟',
      answer: 'لأن الوزن يعتمد على مربع القطر. قطر 16 يعني 16 × 16، وقطر 12 يعني 12 × 12، لذلك الزيادة ليست خطية. هذا هو سبب ضرورة اختيار القطر الصحيح قبل مقارنة السعر أو الكمية.',
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
    name: 'كيف تحسب وزن حديد التسليح؟',
    inLanguage: 'ar',
    description: 'خطوات حساب وزن الحديد من القطر والطول والعدد ثم تحويله إلى كجم وطن.',
    step: [
      { '@type': 'HowToStep', name: 'اختر قطر الحديد', text: 'ابدأ بالقطر الصحيح بالمليمتر كما يظهر في المخطط أو جدول التفريد.' },
      { '@type': 'HowToStep', name: 'أدخل الأطوال والعدد', text: 'أضف كل طول وعدد الأسياخ له، خصوصاً عند وجود أكثر من مقاس تقطيع.' },
      { '@type': 'HowToStep', name: 'اقرأ الوزن بالكيلو والطن', text: 'استخدم الكيلو للمراجعة التفصيلية، والطن عند طلب السعر من المورد.' },
      { '@type': 'HowToStep', name: 'راجع الهدر والتراكب', text: 'أضف أي أطوال إضافية مطلوبة في التفريد ولا تعتمد المعادلة وحدها للتنفيذ.' },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalculatorHero
        badge="هندسة / حديد"
        title="حاسبة وزن الحديد: اعرف وزن السيخ والمتر والطن قبل الشراء"
        description="إذا كنت تسأل كم وزن الحديد، أدخل القطر والطول والعدد لتحصل على وزن حديد التسليح بالكيلو والطن، مع وزن المتر وعدد أسياخ 12 متر. النتيجة تساعدك على مراجعة المورد أو جدول التفريد دون أن تستبدل المخطط الإنشائي."
        highlights={[
          'وزن المتر والسيخ والكمية الإجمالية في نتيجة واحدة.',
          'يدعم الأقطار الشائعة من ⌀8 إلى ⌀32.',
          'شرح عملي للهدر والتراكب وحدود التقدير قبل التسعير.',
        ]}
      >
        <RebarCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="rebar-table"
        eyebrow="مرجع هندسي"
        title="جدول أوزان الحديد حسب القطر"
        description="استخدم الجدول للتحقق السريع من وزن المتر وسيخ 12 متر قبل إدخال كمية كبيرة في الحاسبة."
        subtle
      >
        <div className="calc-table-wrap">
          <table className="calc-guide-table">
            <thead>
              <tr>
                <th>القطر (مم)</th>
                <th>الوزن (كجم/م)</th>
                <th>وزن سيخ 12م</th>
                <th>الاستخدام الشائع</th>
              </tr>
            </thead>
            <tbody>
              {REBAR_DIAMETERS.map((d, idx) => (
                <tr key={d} className={idx % 2 === 0 ? 'bg-base' : ''}>
                  <td>⌀{d}</td>
                  <td className="font-mono">{REBAR_WEIGHT_PER_METER[d]}</td>
                  <td className="font-mono font-bold">{(REBAR_WEIGHT_PER_METER[d] * 12).toFixed(2)} كجم</td>
                  <td>{REBAR_TYPICAL_USE[d]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="rebar-method"
        eyebrow="فهم الرقم"
        title="كيف تقرأ وزن الحديد دون أن تخلط بين السيخ والمتر والطن؟"
        description="هذه البطاقات توضّح لماذا يتغير الوزن بسرعة مع القطر، وكيف تستخدم كل رقم في مكانه الصحيح."
      >
        <CalculatorInfoGrid items={REBAR_METHOD_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-decision"
        eyebrow="قبل الشراء"
        title="أي رقم تستخدم عند حساب أو طلب الحديد؟"
        description="اختر الرقم المناسب لسؤالك الحالي: مراجعة جدول، شراء أسياخ، أو طلب سعر بالطن."
      >
        <CalculatorDecisionTable
          columns={['سؤالك الان', 'طريقة الاستخدام', 'تنبيه مهم']}
          rows={REBAR_DECISION_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-editorial"
        eyebrow="شرح مبسط"
        title="المعادلة سهلة، لكن قرار الشراء يحتاج سياقاً"
        description="الهدف أن تفهم الوزن وتعرف أين يتوقف الحساب وأين يبدأ التفريد أو التسعير."
        subtle
      >
        <CalculatorEditorialArticle
          eyebrow="قراءة قبل التسعير"
          title="حوّل القطر والطول إلى وزن يمكن مراجعته"
          lead="لا تعتمد على رقم عام للحديد إذا كان لديك قطر وطول وعدد واضح. أدخل التفاصيل واجعل النتيجة قابلة للمقارنة."
          paragraphs={REBAR_EDITORIAL_PARAGRAPHS}
          points={REBAR_EDITORIAL_POINTS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-guides"
        eyebrow="مقال داعم"
        title="قبل شراء الحديد أو طلب العرض"
        description="هذا المقال يشرح طريقة تقدير الوزن والصيغة الأقرب للشراء، ثم يربطك مباشرة بحاسبة الحديد لتطبيق الحساب على القطر والطول والعدد."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} buttonLabel="اقرأ التفسير" />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-sources"
        eyebrow="مصادر"
        title="مصادر لمراجعة خصائص وأوزان حديد التسليح"
        description="استخدمها لفهم الجداول والمعادلة، ثم اعتمد المخطط وجدول التفريد في الكميات النهائية."
      >
        <CalculatorResourceLinks items={REBAR_SOURCE_LINKS} buttonLabel="افتح المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-faq"
        eyebrow="قبل تسعير الحديد"
        title="أسئلة قبل اعتماد وزن الحديد أو طلب العرض"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-related"
        eyebrow="بعد وزن الحديد"
        title="افتح حساب الأسمنت أو التكلفة عندما تنتقل من الوزن إلى ميزانية المشروع"
        description="بعد معرفة الوزن، يصبح السؤال عادة عن السعر أو بقية المواد. انتقل إلى الأسمنت أو تكلفة البناء فقط إذا كان هذا هو القرار التالي في مشروعك."
      >
        <RelatedCalculators currentSlug="rebar" />
      </CalculatorSection>

    </main>
  );
}
