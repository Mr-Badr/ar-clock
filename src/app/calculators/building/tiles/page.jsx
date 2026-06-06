import TilesCalculator from '@/components/calculators/building/TilesCalculator.client';
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
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';

const SITE_URL = getSiteUrl();
const TILES_SOURCE_LINKS = [
  {
    href: 'https://www.tile.co.uk/pages/tile-calculator',
    title: 'Tile.co.uk: Tile Calculator',
    description: 'مرجع عملي يوضح قياس المساحة وإضافة 10% هدر والتحقق من عدد البلاط في المتر والكرتون.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://homedecorcalc.com/en/calculators/home-improvement/tile',
    title: 'HomeDecorCalc: Tile Waste and Boxes',
    description: 'دليل يشرح متى تستخدم 10% أو 15-20% للهدر حسب النمط والقص والفراغات.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://www.siteworkmath.com/calculators/tile-calculator',
    title: 'SiteworkMath: Box Count with Pattern Waste',
    description: 'حاسبة تقارن بين التركيب المستقيم والمائل والهerringbone وتنبه لمشكلة رقم دفعة البلاط.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: '/calculators/building',
    title: 'حاسبة تكلفة البناء',
    description: 'افتحها عندما تريد ربط البلاط والتشطيب بميزانية المشروع كاملة.',
    ctaLabel: 'احسب تكلفة المشروع',
  },
];
const TILES_METHOD_ITEMS = [
  {
    title: 'المساحة الصافية ليست كمية الشراء',
    description: 'الغرفة 16 م² لا تعني أنك تشتري 16 م² فقط.',
    content: (
      <p>
        ستقص البلاط عند الأطراف والزوايا، وقد تنكسر بعض القطع أو لا تصلح لإعادة الاستخدام. لذلك تضيف الحاسبة الهدر ثم تقرّب النتيجة إلى كراتين كاملة، لأن المورد غالباً لا يبيع نصف كرتون.
      </p>
    ),
  },
  {
    title: 'الكرتون أهم من عدد البلاطات عند الدفع',
    description: 'النتيجة تعرض البلاطات والكراتين معاً.',
    content: (
      <p>
        عدد البلاطات يشرح الحساب، لكن الكرتون هو قرار الشراء. إذا كان كرتون 60×60 يحتوي 4 حبات فهو يغطي 1.44 م² تقريباً، لكن بعض المنتجات تختلف في التعبئة. أدخل عدد الحبات المكتوب على الكرتون عند المورد.
      </p>
    ),
  },
  {
    title: 'دفعة اللون قد تكون أهم من كرتون ناقص',
    description: 'إكمال البلاط لاحقاً قد يعطي لوناً مختلفاً.',
    content: (
      <p>
        إذا نفدت الكمية منتصف العمل، قد تشتري نفس التصميم من دفعة إنتاج مختلفة فتظهر درجة لون أو نقش مختلف. لذلك اشترِ الكمية المناسبة مرة واحدة، واحتفظ ببضع قطع للإصلاحات إذا كان البلاط صعب التوفر.
      </p>
    ),
  },
];
const TILES_DECISION_ROWS = [
  {
    key: 'straight',
    cells: [
      'غرفة مستطيلة وتركيب مستقيم',
      'ابدأ بهدر 10%.',
      'ارفعه قليلاً إذا كانت الغرفة صغيرة أو كثيرة الأبواب والزوايا.',
    ],
  },
  {
    key: 'diagonal',
    cells: [
      'تركيب قطري أو 45 درجة',
      'استخدم 15% على الأقل.',
      'القص المائل ينتج قطعاً لا يمكن إعادة استخدامها بسهولة.',
    ],
  },
  {
    key: 'complex',
    cells: [
      'نقشة تحتاج مطابقة أو هerringbone أو مساحات كثيرة القطع',
      'استخدم 20% أو راجع الفني قبل الشراء.',
      'الأولوية هنا أن لا ينقص نفس اللون أو الدفعة أثناء التركيب.',
    ],
  },
  {
    key: 'wet-area',
    cells: [
      'حمام، دش، نيش، أو جدار مع فتحات',
      'قس كل سطح وحده ولا تجمعه ذهنياً.',
      'الفتحات والحواف والتشطيبات الجانبية تحتاج قطعاً إضافية.',
    ],
  },
];
const TILES_EDITORIAL_PARAGRAPHS = [
  'حساب البلاط لا يبدأ من مساحة الغرفة فقط. تحتاج أن تعرف مقاس البلاطة، عدد الحبات في الكرتون، طريقة التركيب، ونسبة الهدر. إذا أهملت واحداً من هذه العناصر فقد تشتري كمية ناقصة أو تدفع مقابل كراتين إضافية لا تحتاجها.',
  'ابدأ بإدخال أبعاد كل غرفة، ثم راجع النتيجة على مستويين: عدد البلاطات وعدد الكراتين. عدد البلاطات مفيد للفهم، لكن عدد الكراتين هو الأقرب لقرار الشراء لأن المورد يبيع غالباً بالكرتون لا بالحبة.',
  'إذا كانت المساحة ممرات ضيقة أو تركيباً مائلاً أو بلاطاً بنقشة تحتاج مطابقة، ارفع نسبة الهدر ولا تعتمد على 10% فقط. الهدر ليس خطأ في الحساب، بل احتياط واقعي للقص والكسر وتفاوت دفعات اللون.',
];
const TILES_EDITORIAL_POINTS = [
  'استخدم مساحة الكرتون المكتوبة على العبوة إذا كانت تختلف عن القيمة الافتراضية في الحاسبة.',
  'أضف غرفة أو ممر كل مرة بدل جمع المساحات ذهنياً حتى لا تنسى الزوايا أو الفراغات الصغيرة.',
  'احتفظ بكرتون أو جزء من الكمية بعد التركيب إذا كان البلاط خاصاً أو صعب التوفر لاحقاً.',
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبة البلاط والسيراميك | كم كرتون بلاط أحتاج؟',
  description: 'احسب عدد كراتين البلاط والسيراميك حسب مساحة الغرف ومقاس البلاطة وعدد الحبات في الكرتون ونسبة الهدر قبل شراء التشطيب.',
  keywords: getBuildingKeywords('tiles'),
  url: `${SITE_URL}/calculators/building/tiles`,
});

export default function TilesPage() {
  const faqItems = [
    {
      question: 'كيف أحسب نسبة الهدر في البلاط؟',
      answer: 'التركيب المعتاد يحتاج 10% هدر تقريباً. التركيب المائل (القطري) أو البلاط ذو التصاميم الخاصة التي تحتاج مطابقة الرسوم قد يحتاج 15% إلى 20%.',
    },
    {
      question: 'كم عدد حبات البلاط في الكرتون؟',
      answer: 'حسب المقاس. مقاس 60×60 غالباً 4 حبات للكرتون. مقاس 80×80 غالباً 2 أو 3 حبات. مقاس 30×30 يأتي 11 حبة. يفضل دائماً التأكد من المورد.',
    },
    {
      question: 'كيف أحسب وزن البلاط للنقل؟',
      answer: 'يختلف حسب السُمك والنوع، لكن بشكل تقريبي يزن كرتون السيراميك العادي من 18 إلى 22 كجم، وقد يصل كرتون البورسلان مقاس 60×60 (4 حبات) إلى 30 كجم تقريباً.',
    },
    {
      question: 'ما هي المسافة المطلوبة للفواصل (الترويبة)؟',
      answer: 'غالباً تكون الفواصل من 1.5 ملم للبورسلان المقصوص بالليزر، وحتى 3 أو 4 ملم للسيراميك العادي أو المساحات التي تحتاج تمدداً حرارياً أعلى. هذه المسافة لا تغيّر كمية البلاط كثيراً، لكنها مهمة عند شراء مادة الترويبة.',
    },
    {
      question: 'هل أشتري نفس العدد الذي تظهره المساحة الصافية؟',
      answer: 'لا. المساحة الصافية لا تشمل القص والكسر والتقريب إلى كراتين كاملة. استخدم النتيجة التي تشمل الهدر، ثم راجع عدد الكراتين مع المورد لأن التعبئة تختلف من منتج لآخر.',
    },
    {
      question: 'لماذا يجب شراء البلاط من نفس دفعة اللون؟',
      answer: 'قد يظهر اختلاف بسيط في درجة اللون أو النقشة بين دفعات الإنتاج حتى لو كان التصميم نفسه. إذا اضطررت للشراء لاحقاً من دفعة أخرى، قد يظهر الفرق بعد التركيب. لذلك من الأفضل شراء الكمية المناسبة مرة واحدة والاحتفاظ بقطع احتياط.',
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
    name: 'كيف تحسب كراتين البلاط؟',
    inLanguage: 'ar',
    description: 'خطوات حساب كمية البلاط والسيراميك وعدد الكراتين مع الهدر قبل الشراء.',
    step: [
      { '@type': 'HowToStep', name: 'قس المساحة', text: 'أدخل طول وعرض كل غرفة أو جدار بالمتر بدلاً من جمع المساحات ذهنياً.' },
      { '@type': 'HowToStep', name: 'اختر مقاس البلاطة', text: 'اختر المقاس الأقرب أو أدخل عدد الحبات في الكرتون حسب العبوة الفعلية.' },
      { '@type': 'HowToStep', name: 'حدد نمط التركيب', text: 'اختر مستقيم أو قطري أو نمط معقد حتى تضيف الحاسبة نسبة هدر مناسبة.' },
      { '@type': 'HowToStep', name: 'راجع الكراتين والدفعة', text: 'اشترِ كراتين كاملة وتأكد من نفس دفعة اللون واحتفظ بقطع احتياطية.' },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalculatorHero
        badge="هندسة / تشطيب"
        title="حاسبة البلاط والسيراميك: احسب الكراتين والهدر قبل الشراء"
        description="إذا كنت تسأل كم كرتون بلاط أحتاج، أدخل مساحة الغرف ومقاس البلاطة وعدد الحبات في الكرتون. الحاسبة تحوّل المساحة إلى بلاطات وكراتين كاملة مع هدر مناسب لنمط التركيب حتى لا ينقصك نفس اللون أثناء العمل."
        highlights={[
          'أكثر من غرفة أو مساحة في نفس الحسبة.',
          'هدر حسب النمط: مستقيم، مائل، أو معقد.',
          'تحويل عملي إلى كراتين كاملة حسب تعبئة المورد.',
        ]}
      >
        <TilesCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="tiles-method"
        eyebrow="طريقة الحساب"
        title="كيف تحوّل مساحة الغرفة إلى كراتين بلاط؟"
        description="المعادلة بسيطة، لكن تفاصيل الشراء هي التي تمنع النقص أو زيادة غير مفيدة."
      >
        <CalculatorInfoGrid items={TILES_METHOD_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-decision"
        eyebrow="نسبة الهدر"
        title="متى تستخدم 10% ومتى ترفع الهدر؟"
        description="نسبة الهدر ليست رقماً ثابتاً. النمط والزوايا والبلاط الكبير والفتحات كلها تؤثر في كمية الشراء."
      >
        <CalculatorDecisionTable
          columns={['حالتك', 'نسبة البداية', 'ملاحظة عملية']}
          rows={TILES_DECISION_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-buying-method"
        eyebrow="طريقة الشراء"
        title="اقرأ النتيجة كقرار كراتين لا كمساحة فقط"
        description="المتر المربع يشرح الحجم، لكن الكرتون هو وحدة الشراء الفعلية. لذلك تحتاج أن تفهم الهدر والتعبئة قبل اعتماد الكمية."
        subtle
      >
        <CalculatorEditorialArticle
          eyebrow="قراءة عملية"
          title="كيف تمنع نقص البلاط أو زيادة الكمية بلا داع؟"
          lead="النتيجة الجيدة توازن بين المساحة الصافية، طريقة التركيب، وعدد الكراتين التي يمكنك شراؤها فعلاً من المورد."
          paragraphs={TILES_EDITORIAL_PARAGRAPHS}
          points={TILES_EDITORIAL_POINTS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-faq"
        eyebrow="قبل طلب البلاط"
        title="أسئلة قبل اعتماد عدد الكراتين ونسبة الهدر"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-sources"
        eyebrow="مصادر"
        title="مصادر لفهم حساب البلاط والهدر"
        description="هذه المراجع تساعدك على مراجعة منطق الهدر والكراتين، لكن العبوة الفعلية لدى المورد هي الرقم الأهم عند الشراء."
      >
        <CalculatorResourceLinks items={TILES_SOURCE_LINKS} buttonLabel="افتح المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-related"
        eyebrow="بعد البلاط"
        title="انتقل إلى تكلفة البناء أو مواد العظم إذا توسّع السؤال"
        description="إذا انتهيت من الكراتين والهدر، افتح تكلفة البناء أو مواد العظم فقط عندما تريد ربط التشطيب بميزانية المشروع الأكبر."
      >
        <RelatedCalculators currentSlug="tiles" />
      </CalculatorSection>

    </main>
  );
}
