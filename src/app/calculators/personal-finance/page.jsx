import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorPolicyNotice,
  CalculatorResourceLinks,
  CalculatorSection,
  CalculatorToolLauncher,
} from '@/components/calculators/common';
import {
  PERSONAL_FINANCE_HUB,
  PERSONAL_FINANCE_TOOLS,
} from '@/lib/calculators/personal-finance-data';
import { PERSONAL_FINANCE_INFORMATIONAL_NOTICE } from '@/lib/calculators/policy-notices';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

const hubFaqItems = [
  {
    question: 'ما هي حاسبات التخطيط المالي الشخصي؟',
    answer: 'هي أدوات تساعدك على تحويل قرارات المال اليومية إلى أرقام مفهومة: كم تحتاج للطوارئ، متى تنتهي ديونك، كم تدخر لهدف، وما صافي ثروتك الان. فائدتها ليست في الرقم وحده، بل في ترتيب الأولويات حتى لا تبدأ بهدف ادخار طويل بينما لا تملك هامش طوارئ أو بينما دين مرتفع التكلفة يستهلك دخلك.',
  },
  {
    question: 'ما الذي أبدأ به إذا كان عندي ديون ولا أملك ادخاراً؟',
    answer: 'ابدأ باحتياطي صغير للطوارئ ثم انتقل إلى حاسبة سداد الديون حتى لا تضطر للعودة إلى الاقتراض عند أول ظرف مفاجئ. لا تحتاج بناء صندوق كامل قبل السداد إذا كانت الفوائد مرتفعة، لكنك تحتاج هامش أمان يمنع انهيار الخطة. بعد ذلك قارن بين كرة الثلج والانهيار لترى ما يناسبك مالياً وسلوكياً.',
  },
  {
    question: 'هل هذه الصفحات مجرد حاسبات أم معها شروحات أيضاً؟',
    answer: 'كل أداة تعطيك رقماً سريعاً ثم تشرح معنى النتيجة وحدودها، حتى لا تتعامل مع الرقم كقرار جاهز من دون سياق. ستجد بعد الحاسبة إجابات مباشرة، ملاحظات قراءة، ومسارات مكملة. الهدف أن تخرج بخطوة مالية مفهومة، لا بمجرد رقم تنساه بعد دقيقة.',
  },
  {
    question: 'كيف أعرف أنني اخترت الحاسبة الصحيحة؟',
    answer: 'اسأل نفسك عن القرار الأقرب: حماية من الطوارئ، تقليل ديون، الوصول إلى هدف ادخار، أو قياس وضعك الحالي. إذا كان السؤال عن أزمة مفاجئة فابدأ بالطوارئ، وإذا كان عن ضغط شهري فابدأ بالديون، وإذا كان عن شراء أو سفر أو زواج فابدأ بالادخار. إذا تغيّر القرار لاحقاً يمكنك الانتقال لأداة أخرى من نفس القسم.',
  },
  {
    question: 'هل أحتاج إدخال بيانات شخصية أو ربط حسابي البنكي؟',
    answer: 'لا. هذه الصفحة تقودك إلى حاسبات تعمل من الأرقام التي تكتبها أنت فقط مثل المصاريف والديون والمدخرات. لا تحتاج ربط حساب بنكي ولا تسجيل دخول حتى تفهم الاتجاه العام. مع ذلك، لا تكتب أرقاماً حساسة لا تحتاجها الحاسبة، واحتفظ بالمستندات الرسمية مثل كشوف الديون أو الحسابات عند مراجعة قرار كبير.',
  },
  {
    question: 'هل النتائج تعتبر نصيحة مالية شخصية؟',
    answer: 'لا. النتائج تعليمية وتقديرية وتساعدك على الفهم والمقارنة، لكنها لا تعرف كل تفاصيل دخلك، التزاماتك، بلدك، الضرائب، أو المنتجات المالية المتاحة لك. استخدمها لتكوين صورة أولى، ثم راجع مختصاً موثوقاً عند قرار عالي الأثر مثل قرض كبير، تسوية دين، استثمار طويل، أو التزام عائلي كبير.',
  },
];

const decisionItems = [
  {
    title: 'إذا كان القلق من المفاجآت هو المشكلة',
    description: 'ابدأ من صندوق الطوارئ',
    content: 'الهدف هنا ليس الوصول إلى رقم مثالي، بل معرفة الحد الأدنى الذي يمنعك من الاستدانة عند عطل سيارة، تأخر راتب، أو مصروف صحي مفاجئ.',
  },
  {
    title: 'إذا كانت الديون تضغط على دخلك الشهري',
    description: 'ابدأ من خطة السداد',
    content: 'الأهم أن ترى الزمن والتكلفة معاً: كم شهر تحتاج، كم فائدة ستدفع، وهل زيادة بسيطة في الدفعة الشهرية تغيّر النتيجة فعلاً.',
  },
  {
    title: 'إذا كنت تريد هدفاً واضحاً بدل ادخار عشوائي',
    description: 'ابدأ من هدف الادخار',
    content: 'حدد المبلغ والموعد، ثم دع الحاسبة تكشف هل الرقم الشهري واقعي أم يحتاج تمديد المدة أو تقسيم الهدف إلى مراحل.',
  },
  {
    title: 'إذا كنت لا تعرف هل وضعك يتحسن أم لا',
    description: 'اختم بصافي الثروة لا تبدأ به دائماً',
    content: 'صافي الثروة ممتاز للمراجعة الشهرية أو الربع سنوية، لكنه لا يحل وحده طارئاً بلا احتياطي أو ديناً عالياً يأكل الدخل. استخدمه بعد أن تعرف أين يضغط المال عليك.',
  },
];

const toolPathways = [
  {
    href: '/calculators/personal-finance/emergency-fund',
    label: 'ابدأ بالحماية',
    title: 'احسب صندوق الطوارئ قبل أي خطة طويلة',
    description: 'إذا كان أي ظرف مفاجئ يربك ميزانيتك، فابدأ هنا. ستعرف المبلغ الذي يحمي مصاريفك الأساسية والمدة الأقرب لوضعك.',
    ctaLabel: 'احسب صندوق الطوارئ',
    iconLabel: 'أمان',
  },
  {
    href: '/calculators/personal-finance/debt-payoff',
    label: 'خفف الضغط الشهري',
    title: 'اعرف متى تنتهي ديونك فعلاً',
    description: 'استخدمها عندما تريد رؤية مدة السداد، أثر الفائدة، والفرق بين زيادة الدفعة أو تغيير ترتيب الديون.',
    ctaLabel: 'احسب خطة السداد',
    iconLabel: 'دين',
  },
  {
    href: '/calculators/personal-finance/savings-goal',
    label: 'حوّل الهدف إلى رقم',
    title: 'حوّل هدفك إلى ادخار شهري واضح',
    description: 'مفيدة عندما تعرف ما تريد شراءه أو تحقيقه، لكنك لا تعرف كم تحتاج شهرياً ولا هل الموعد واقعي.',
    ctaLabel: 'احسب هدف الادخار',
    iconLabel: 'هدف',
  },
  {
    href: '/calculators/personal-finance/net-worth',
    label: 'اقرأ وضعك الحالي',
    title: 'احسب صافي ثروتك من غير تجميل',
    description: 'اجمع ما تملك وما عليك في صورة واحدة حتى تعرف هل مسارك يتحسن أم يحتاج تقليل ديون أو زيادة أصول.',
    ctaLabel: 'احسب صافي الثروة',
    iconLabel: 'صافي',
  },
];

const sourceLinks = [
  {
    href: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
    title: 'CFPB: دليل بناء صندوق الطوارئ',
    description: 'مرجع تعليمي رسمي يشرح لماذا تحتاج صندوق طوارئ، وكيف تبدأه، وأين تحتفظ به.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://consumer.gov/your-money/making-budget',
    title: 'Consumer.gov: بناء الميزانية',
    description: 'شرح مبسط لفهم الدخل والمصاريف قبل تحديد مبلغ الادخار أو السداد الشهري.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://consumer.gov/debt/debt-explained',
    title: 'Consumer.gov: فهم الديون',
    description: 'مرجع يساعدك على قراءة الديون وخطط الدفع قبل اختيار طريقة السداد.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/figure-out-your-finances',
    title: 'Investor.gov: قراءة وضعك المالي',
    description: 'شرح لصافي الثروة والفرق بين ما تملك وما عليك، وهو أساس حاسبة صافي الثروة.',
    ctaLabel: 'راجع المصدر',
  },
];
const personalFinanceDecisionRows = [
  {
    key: 'emergency',
    cells: [
      'مصروف مفاجئ يربك الشهر',
      'صندوق الطوارئ',
      'ابدأ برقم يحمي المصاريف الأساسية، حتى لو كان الهدف الكامل يحتاج وقتاً أطول.',
    ],
  },
  {
    key: 'debt',
    cells: [
      'ديون تستهلك الدخل',
      'خطة سداد الديون',
      'راقب مدة السداد والفائدة معاً، ثم جرّب زيادة صغيرة في الدفعة لترى أثرها الحقيقي.',
    ],
  },
  {
    key: 'saving',
    cells: [
      'هدف شراء أو سفر أو زواج',
      'هدف الادخار',
      'اختبر هل المبلغ الشهري واقعي قبل أن تلتزم بتاريخ نهائي متعب.',
    ],
  },
  {
    key: 'net-worth',
    cells: [
      'أريد صورة عامة عن وضعي',
      'صافي الثروة',
      'استخدمها للمراجعة الدورية، لا للحكم على شهر واحد جيد أو سيئ.',
    ],
  },
  {
    key: 'budget-reality',
    cells: [
      'لا أعرف كم أستطيع تخصيصه شهرياً',
      'ابدأ بتقدير الفائض الواقعي',
      'اكتب الضروريات والديون أولاً، ثم استخدم الرقم المتبقي داخل أي حاسبة حتى لا تبني خطة على شهر مثالي.',
    ],
  },
];
const budgetRealityRows = [
  {
    key: 'income',
    cells: ['الدخل', 'اكتب الدخل الذي يصل فعلاً بعد الخصومات الأساسية.', 'إذا كان الدخل متغيراً، استخدم متوسطاً حذراً لا أفضل شهر في السنة.'],
  },
  {
    key: 'needs',
    cells: ['الضروريات', 'السكن، الطعام، الفواتير، النقل، الدواء، والمدارس أو الالتزامات الضرورية.', 'هذه لا تدخل في رقم الادخار أو السداد إلا بعد تغطيتها.'],
  },
  {
    key: 'debt-minimums',
    cells: ['الحد الأدنى للديون', 'ادفع الحد الأدنى أولاً حتى لا تدخل في تأخير أو رسوم.', 'المبلغ الإضافي فقط هو الذي تستخدمه لتسريع السداد.'],
  },
  {
    key: 'free-cash',
    cells: ['الفائض الواقعي', 'ما يبقى بعد الضروريات والحد الأدنى والالتزامات العائلية.', 'استخدمه لتحديد ادخار أو دفعة إضافية يمكنك تكرارها.'],
  },
];
export const metadata = buildCanonicalMetadata({
  title: PERSONAL_FINANCE_HUB.heroTitle,
  description: 'حاسبات التخطيط المالي الشخصي بالعربية: رتّب صندوق الطوارئ، سداد الديون، هدف الادخار، وصافي الثروة بخطوات واضحة وروابط شرح موثوقة.',
  keywords: [
    ...(Array.isArray(PERSONAL_FINANCE_HUB.keywords) ? PERSONAL_FINANCE_HUB.keywords : []),
    ...(Array.isArray(PERSONAL_FINANCE_TOOLS) ? PERSONAL_FINANCE_TOOLS : []).flatMap((tool) => (
      Array.isArray(tool.keywords) ? tool.keywords.slice(0, 4) : []
    )),
    'ترتيب الأولويات المالية',
    'حاسبة الميزانية الشخصية',
    'حاسبة الفائض الشهري',
    'خطة مالية شخصية بالعربي',
  ],
  url: `${SITE_URL}${PERSONAL_FINANCE_HUB.href}`,
});

export default function PersonalFinanceHubPage() {
  const safeTools = Array.isArray(PERSONAL_FINANCE_TOOLS) ? PERSONAL_FINANCE_TOOLS : [];
  const safeHighlights = Array.isArray(PERSONAL_FINANCE_HUB.highlights) ? PERSONAL_FINANCE_HUB.highlights : [];
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات التخطيط المالي الشخصي',
    url: `${SITE_URL}${PERSONAL_FINANCE_HUB.href}`,
    inLanguage: 'ar',
    description: PERSONAL_FINANCE_HUB.description,
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: safeTools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.href}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hubFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CalculatorHero
        badge="تخطيط مالي شخصي"
        title="حاسبات التخطيط المالي الشخصي"
        description="حاسبات التخطيط المالي الشخصي تساعدك على ترتيب المال من السؤال الصحيح: كم تحتاج للطوارئ؟ متى تنتهي ديونك؟ كم تدخر لهدف؟ وما صافي ثروتك الان؟ ابدأ بالرقم الذي يحمي قرارك الحالي، ثم اقرأ الشرح حتى لا تحوّل نتيجة تقديرية إلى التزام غير مناسب."
        highlights={safeHighlights}
      >
        <div className="calc-app">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">ابدأ من هنا</div>
            <div className="calc-metric-card__value">حماية، دين، هدف، ثم صورة كاملة</div>
            <div className="calc-metric-card__note">لا تبدأ من الأداة الأسهل؛ ابدأ من المشكلة التي لو تجاهلتها ستكسر خطتك الشهر القادم.</div>
          </div>
        </div>
      </CalculatorHero>

      <CalculatorSection
        id="pf-policy-notice"
        eyebrow="قبل التخطيط"
        title="هذه أدوات تعليمية وليست نصيحة مالية شخصية"
        description="الصفحة تساعدك على ترتيب الأرقام والأولويات، لكنها لا تعرف كل تفاصيل دخلك أو التزاماتك أو بلدك."
      >
        <CalculatorPolicyNotice {...PERSONAL_FINANCE_INFORMATIONAL_NOTICE} />
      </CalculatorSection>

      <CalculatorSection
        showAdBefore
        id="pf-tools"
        eyebrow="ابدأ من القرار"
        title="اختر الحاسبة بحسب ما يضغط عليك الان"
        description="لا تحتاج فتح أربع أدوات معاً. ابدأ بالمسار الأقرب لحالتك، ثم انتقل للأداة التالية عندما تكشف النتيجة سؤالاً جديداً."
        subtle
      >
        <CalculatorToolLauncher
          items={toolPathways}
          ariaLabel="اختيار حاسبة التخطيط المالي المناسبة"
          badge="4 قرارات مالية"
          featuredLabel="ابدأ بالحماية"
          theme="green"
          note="صندوق الطوارئ يظهر أولاً لأنه يمنع انهيار الخطة عند أول ظرف مفاجئ، ثم تأتي الديون والادخار وصافي الثروة بحسب المشكلة التي تضغط على الشهر."
        />
      </CalculatorSection>

      <CalculatorSection
        id="pf-decision-table"
        eyebrow="اختيار أدق"
        title="اختر الحاسبة من المشكلة، لا من الرقم الذي يبدو أكبر"
        description="هذه المقارنة تساعدك على ربط كل أداة بسبب استخدامها، حتى لا تبدأ بادخار طويل بينما تحتاج أولاً إلى أمان أو تخفيف دين."
      >
        <CalculatorDecisionTable
          columns={['المشكلة الأقرب', 'الأداة الأنسب', 'كيف تقرأ النتيجة؟']}
          rows={personalFinanceDecisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="pf-budget-reality"
        eyebrow="اختبار الواقعية"
        title="قبل أي حاسبة: ما الرقم الشهري الذي يمكنك تكراره؟"
        description="أقوى خطة مالية ليست التي تضع أكبر مبلغ، بل التي تبقى ممكنة بعد الضروريات والديون والالتزامات العائلية."
        subtle
      >
        <CalculatorDecisionTable
          columns={['ما الذي تكتبه؟', 'كيف تستخدمه؟', 'متى تنتبه؟']}
          rows={budgetRealityRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="pf-decisions"
        eyebrow="قبل الاعتماد على الرقم"
        title="كيف تختار نقطة البداية الصحيحة؟"
        description="الترتيب المالي الجيد يبدأ من المشكلة الأوضح، لا من أكثر حاسبة تبدو جذابة."
      >
        <CalculatorInfoGrid items={decisionItems} />
      </CalculatorSection>

      <CalculatorSection
        id="pf-sources"
        eyebrow="مصادر تعليمية"
        title="مراجع تساعدك على فهم القواعد خلف الحاسبات"
        description="استخدم هذه المصادر عندما تريد التحقق من مفاهيم الطوارئ والميزانية والديون وصافي الثروة قبل قرار مؤثر."
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="pf-faq"
        eyebrow="قبل القرار المالي"
        title="أسئلة قبل اختيار حاسبة التخطيط المالي"
        description="إجابات سريعة تساعدك على معرفة أين تبدأ، ومتى يكون الرقم مجرد إشارة أولى لا قراراً نهائياً."
      >
        <CalculatorFaqSection items={hubFaqItems} />
      </CalculatorSection>

    </main>
  );
}
