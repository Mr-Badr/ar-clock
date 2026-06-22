import PaintCalculator from '@/components/calculators/building/PaintCalculator.client';
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

const SITE_URL = getSiteUrl();

const PAINT_METHOD_ITEMS = [
  {
    title: 'ابدأ من مساحة الجدران لا مساحة الأرضية',
    description: 'الغرفة 12 م² لا تعني 12 م² دهاناً.',
    content: (
      <p>
        مساحة الجدران = 2 × (طول + عرض) × ارتفاع. غرفة 3×4 بارتفاع 2.8 متر تعطي 39.2 م² للجدران.
        إذا خصمت بابين ونافذتين (≈ 7 م²) تصبح المساحة الصافية 32.2 م². هذا هو رقم البداية الصحيح.
      </p>
    ),
  },
  {
    title: 'طبقتان هو المعيار وليس الاستثناء',
    description: 'طبقة واحدة نادراً ما تكفي.',
    content: (
      <p>
        معظم الدهانات تحتاج طبقتين على الأقل لتغطية جيدة ومنع اللون القديم من الظهور. الأستر (البريمر)
        يُحتسب بشكل منفصل إذا كنت تبدأ من جدار جديد أو تغير اللون بشكل كبير.
      </p>
    ),
  },
  {
    title: 'التغطية تختلف بين الأنواع والعلامات التجارية',
    description: 'القيمة الافتراضية قابلة للتعديل.',
    content: (
      <p>
        الدهان الاقتصادي يغطي 8–10 م²/لتر، الفاخر 12–14 م²/لتر. تجد الرقم الدقيق على الغطاء أو
        وريقة المنتج. أدخله في الحاسبة عوضاً عن القيمة الافتراضية إذا كنت تريد نتيجة أدق.
      </p>
    ),
  },
];

const PAINT_DECISION_ROWS = [
  {
    key: 'new-wall',
    cells: [
      'جدار جديد أو تحويل لون داكن إلى فاتح',
      'أستر + طبقتان دهان.',
      'بدون أستر ستظهر اللقطة القديمة خلال طبقة أو اثنتين.',
    ],
  },
  {
    key: 'refresh',
    cells: [
      'تجديد نفس اللون أو لون قريب',
      'طبقة واحدة أو اثنتان حسب الحالة.',
      'جرب على جزء صغير أولاً قبل الشراء الكامل.',
    ],
  },
  {
    key: 'exterior',
    cells: [
      'جدران خارجية أو مناطق رطبة',
      'دهان خارجي أو مقاوم للرطوبة.',
      'التغطية أقل (8–10 م²/لتر)، أضف 15% احتياطاً للطقس والامتصاص.',
    ],
  },
  {
    key: 'ceiling',
    cells: [
      'السقف ضمن المشروع',
      'احسبه بشكل منفصل (مساحة = طول × عرض).',
      'اللون الأبيض المطفي هو الأكثر شيوعاً، طبقة واحدة تكفي في التجديد.',
    ],
  },
];

const PAINT_EDITORIAL_PARAGRAPHS = [
  'حساب الدهان يبدأ من الجدران لا الأرضية. غرفة 12 م² أرضية قد تحتاج 30–40 م² دهاناً على الجدران حسب الارتفاع. هذا الخطأ في الحساب شائع جداً ويؤدي إلى نقص في اللون أو أكثر من رحلة إلى المحل.',
  'الاحتياط 10–15% ليس مبالغة، بل ضرورة. بقعة تحتاج إصلاح أو عامل يطلب طبقة إضافية في زاوية معينة، أو ببساطة قطرات ضائعة — كلها تستهلك من الكمية المحسوبة. اشترِ العلبة الإضافية في نفس الرحلة لضمان نفس دفعة اللون.',
  'الأستر ليس اختيارياً في الجدران الجديدة أو الجدران المتشققة. يعزز التلاصق ويرفع التغطية الفعلية للدهان، وقد يوفر عليك طبقة كاملة لاحقاً.',
];

const PAINT_EDITORIAL_POINTS = [
  'دوّن رقم اللون ودفعة الإنتاج قبل أن تشتري، واحتفظ بعلبة صغيرة للإصلاحات.',
  'اختبر اللون على رقعة 50×50 سم واتركها تجف 24 ساعة قبل الموافقة على اللون كاملاً.',
  'قيس كل سطح وحده إذا كانت الغرف مختلفة الأبعاد، ولا تجمع ذهنياً.',
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبة الدهان | كم لتر دهان أحتاج للغرفة؟',
  description: 'احسب كمية الدهان للغرفة أو المنزل حسب أبعاد الجدران وعدد الطبقات ونوع الدهان. نتيجة بالليتر وعدد علب 1 و5 لتر مع تعليمات الشراء.',
  url: `${SITE_URL}/calculators/building/paint`,
});

export default function PaintPage() {
  const faqItems = [
    {
      question: 'كم لتر دهان أحتاج للغرفة 4×3 متر؟',
      answer: 'غرفة 4×3 بارتفاع 2.8 م تحتوي على 39.2 م² جدران. بعد خصم باب ونافذة (≈ 5 م²) تصبح 34 م². مع طبقتين ودهان يغطي 12 م²/لتر تحتاج حوالي 5.7 لتر، أي علبة 5 لتر وعلبة 1 لتر تقريباً.',
    },
    {
      question: 'هل يجب أن أحسب الأستر بشكل منفصل؟',
      answer: 'نعم. الأستر يُستهلك بتغطية مختلفة (عادة 8–10 م²/لتر). احسبه مرة منفصلة في الحاسبة مع اختيار "أستر / بريمر" من قائمة النوع وطبقة واحدة.',
    },
    {
      question: 'ما الفرق بين دهان داخلي وخارجي في الحساب؟',
      answer: 'الدهان الخارجي يغطي مساحة أقل للتر (8–10 م²) لأن الجدران الخارجية أكثر امتصاصاً وتحتاج طبقات أكثف. استخدم نوع "خارجي" في الحاسبة لأخذ ذلك في الاعتبار.',
    },
    {
      question: 'كيف أحسب الدهان إذا أردت تغيير لون الغرفة؟',
      answer: 'اختر "طبقتان" كحد أدنى. إذا كان اللون الجديد أفتح من القديم فقد تحتاج طبقة ثالثة أو أستر أولاً. جرب على بقعة صغيرة 24 ساعة قبل الشراء الكامل.',
    },
    {
      question: 'هل أشمل السقف في نفس الحساب؟',
      answer: 'السقف يُحسب بشكل منفصل: مساحته = طول × عرض الغرفة. في الحاسبة، أدخله كحساب مستقل مع ارتفاع يساوي صفر أو استخدم الطول والعرض فقط في خانة "الارتفاع = 0" وعرض = مساحة السقف مقسومة على الطول.',
    },
  ];

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
    name: 'كيف تحسب كمية الدهان؟',
    inLanguage: 'ar',
    description: 'خطوات حساب كمية الدهان بالليتر وعدد العلب لأي غرفة أو مشروع.',
    step: [
      { '@type': 'HowToStep', name: 'قس الجدران', text: 'أدخل طول وعرض وارتفاع الغرفة. المساحة = 2×(طول+عرض)×ارتفاع.' },
      { '@type': 'HowToStep', name: 'أضف الفتحات', text: 'أدخل عدد الأبواب والنوافذ لخصمها من مساحة الدهان.' },
      { '@type': 'HowToStep', name: 'اختر النوع وعدد الطبقات', text: 'اختر نوع الدهان (داخلي/خارجي/أستر) وعدد الطبقات.' },
      { '@type': 'HowToStep', name: 'اقرأ النتيجة', text: 'ستظهر الكمية بالليتر وعدد علب 1 لتر وعلب 5 لتر. أضف 10–15% احتياطاً.' },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalculatorHero
        badge="هندسة / تشطيب"
        title="حاسبة الدهان: كم لتر دهان أحتاج للغرفة؟"
        description="أدخل أبعاد الجدران وعدد الأبواب والنوافذ وعدد الطبقات ونوع الدهان، وستحصل على الكمية بالليتر وعدد العلب (1 لتر و5 لتر) مع ملاحظات عملية قبل الشراء."
        highlights={[
          'مساحة الجدران الصافية بعد خصم الفتحات.',
          'نتيجة بالليتر وعلب 1 لتر وعلب 5 لتر.',
          'يشمل الأستر والدهان الداخلي والخارجي.',
        ]}
      >
        <PaintCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="paint-method"
        eyebrow="طريقة الحساب"
        title="كيف تحوّل مساحة الغرفة إلى لترات دهان؟"
        description="المعادلة بسيطة، لكن ثلاثة تفاصيل تفرق بين نتيجة صحيحة وشراء ناقص."
      >
        <CalculatorInfoGrid items={PAINT_METHOD_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="paint-decision"
        eyebrow="نوع الدهان"
        title="متى تستخدم الأستر؟ ومتى تختار داخلياً أو خارجياً؟"
        description="اختيار النوع يحدد التغطية والعدد الفعلي من العلب."
      >
        <CalculatorDecisionTable
          columns={['حالتك', 'القرار المناسب', 'ملاحظة عملية']}
          rows={PAINT_DECISION_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="paint-buying"
        eyebrow="قبل الشراء"
        title="قراءة نتيجة الحاسبة كقرار شراء"
        description="رقم اللترات وحده لا يكفي — احتاج إلى قرار عملي للعلب."
        subtle
      >
        <CalculatorEditorialArticle
          eyebrow="نصائح الشراء"
          title="كيف تتجنب نقص الدهان أثناء العمل؟"
          lead="الخطأ الأكثر شيوعاً: شراء الكمية المحسوبة بالضبط دون احتياط. الدهان يستهلك أكثر في الزوايا والحواف وأي إصلاح لاحق."
          paragraphs={PAINT_EDITORIAL_PARAGRAPHS}
          points={PAINT_EDITORIAL_POINTS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="paint-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل شراء الدهان"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="paint-related"
        eyebrow="حاسبات مرتبطة"
        title="أدوات أخرى تكمل حساب التشطيب"
      >
        <RelatedCalculators currentSlug="building-paint" />
      </CalculatorSection>
    </main>
  );
}
