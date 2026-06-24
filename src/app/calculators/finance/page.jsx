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
  CALCULATOR_HUBS,
  getCalculatorHubBySlug,
  getCalculatorRoutesByCluster,
} from '@/lib/calculators/data';
import { FINANCE_INFORMATIONAL_NOTICE } from '@/lib/calculators/policy-notices';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const FINANCE_HUB = getCalculatorHubBySlug('finance');
const FINANCE_ROUTES = getCalculatorRoutesByCluster('finance');

const PRIMARY_FINANCE_ROUTE = FINANCE_ROUTES.find((item) => item.slug === 'monthly-installment') ?? FINANCE_ROUTES[0];
const SUPPORTING_FINANCE_ROUTES = PRIMARY_FINANCE_ROUTE
  ? FINANCE_ROUTES.filter((item) => item.slug !== PRIMARY_FINANCE_ROUTE.slug)
  : FINANCE_ROUTES;
const FINANCE_TOOL_LABELS = {
  'monthly-installment': 'قرار تمويلي',
  vat: 'فاتورة وسعر شامل',
  percentage: 'خصم أو زيادة',
  'end-of-service-benefits': 'مستحقات عمل',
};
const FINANCE_TOOL_CTAS = {
  'monthly-installment': 'افتح حاسبة القسط',
  vat: 'افتح حاسبة الضريبة',
  percentage: 'افتح حاسبة النسبة',
  'end-of-service-benefits': 'احسب نهاية الخدمة',
};
const FINANCE_TOOL_ICONS = {
  'monthly-installment': 'قسط',
  vat: 'ضريبة',
  percentage: 'نسبة',
  'end-of-service-benefits': 'عمل',
};
const FINANCE_PRIMARY_DESCRIPTION = 'القسط الشهري لا يشرح وحده هل العرض مناسب لك. افتح الحاسبة لترى القسط، إجمالي الفوائد، أثر مدة السداد، والفرق بين سيناريو وآخر قبل أن تقارن العرض أو توقع على تمويل.';
const FINANCE_RETURN_PATHS = [
  {
    href: '/calculators/monthly-installment',
    title: 'كم قسط قرض 100 ألف؟',
    description: 'مسار قرار تمويلي يومي يعرض القسط وإجمالي الفوائد والسداد المبكر بدلاً من رقم شهري معزول.',
  },
  {
    href: '/calculators/vat',
    title: 'كم ضريبة 1000 ريال عند 15%؟',
    description: 'مناسب للتاجر وصاحب الفاتورة ومن يريد إضافة الضريبة أو استخراجها بسرعة من نفس الصفحة.',
  },
  {
    href: '/calculators/percentage',
    title: 'كم يساوي 20% من 500؟',
    description: 'يخدم الخصومات والزيادات ونسبة التغيير والأسئلة العامة المرتبطة بالبروسنت.',
  },
  {
    href: '/calculators/end-of-service-benefits',
    title: 'كم مكافأة نهاية الخدمة بعد 5 سنوات؟',
    description: 'احسب مكافأة نهاية الخدمة في السعودية، ثم قارن بين الاستقالة ونهاية العقد قبل الاعتماد على الرقم.',
  },
];
const FINANCE_DECISION_TABLE = [
  {
    key: 'installment',
    cells: [
      'أقارن تمويلاً أو قرضاً',
      'حاسبة القسط الشهري',
      'لا تكتف بالقسط. راجع إجمالي الفائدة والمدة والدفعة المقدمة حتى لا يبدو العرض أرخص مما هو فعلاً.',
    ],
  },
  {
    key: 'vat',
    cells: [
      'أراجع فاتورة أو سعراً شاملاً',
      'حاسبة الضريبة',
      'افصل بين السعر قبل الضريبة والسعر الشامل، وتأكد من نسبة بلدك أو نوع السلعة عند قرار رسمي.',
    ],
  },
  {
    key: 'percentage',
    cells: [
      'أحسب خصماً أو زيادة أو تغيراً',
      'حاسبة النسبة المئوية',
      'استخدمها للمقارنة بين رقمين أو فهم نسبة الخصم، لا لحساب ضريبة لها قواعد خاصة.',
    ],
  },
  {
    key: 'service',
    cells: [
      'أراجع مستحقات عمل',
      'حاسبة نهاية الخدمة',
      'فرّق بين الاستقالة ونهاية العقد والراتب المعتمد، ثم راجع النظام أو جهة العمل قبل القرار النهائي.',
    ],
  },
];
const FINANCE_NEXT_HUB_SLUGS = ['personal-finance', 'building', 'sleep'];

const FAQ_ITEMS = [
  {
    question: 'ما الذي ستجده داخل قسم حاسبات المال والعمل؟',
    answer: 'ستجد حاسبات القسط الشهري، وضريبة القيمة المضافة، والنسبة المئوية، ومكافأة نهاية الخدمة مع مسار مباشر لكل أداة. الفكرة ليست عرض قائمة أسماء فقط؛ كل مسار يبدأ من سؤال عملي مثل كم القسط أو هل السعر شامل الضريبة أو كم أستحق عند نهاية العمل. بعد النتيجة ستجد شرحاً يساعدك على فهم حدود الرقم قبل الاعتماد عليه.',
  },
  {
    question: 'هل هذا القسم موجه فقط للسعودية؟',
    answer: 'ليس كله. حاسبة نهاية الخدمة موجهة للسعودية تحديداً لأنها تعتمد على قواعد نظام العمل السعودي، بينما القسط والضريبة والنسبة المئوية تصلح لأسئلة يومية في دول عربية متعددة. في القسط والنسبة يمكنك تغيير العملة أو المدخلات، وفي الضريبة يمكنك اختيار دولة أو إدخال نسبة مخصصة عندما لا تجد بلدك في القائمة.',
  },
  {
    question: 'لماذا يحتاج هذا القسم إلى صفحة مستقلة؟',
    answer: 'لأنك قد تبدأ بسؤال مالي لا باسم أداة محددة: كم القسط؟ هل السعر شامل الضريبة؟ كم الخصم؟ أو هل نهاية الخدمة تختلف عند الاستقالة؟ هذه الصفحة تعمل كخريطة قرار قصيرة، فتقودك إلى الأداة الأنسب بسرعة ثم تعيدك إلى الشرح عندما تحتاج فهماً أعمق. هذا أفضل من أرشيف طويل يجعلك تجرب أكثر من صفحة بلا سبب.',
  },
  {
    question: 'أي صفحة أبدأ بها إذا كنت أقارن قرضاً أو تمويلاً؟',
    answer: 'ابدأ من حاسبة القسط الشهري إذا كان سؤالك عن مبلغ التمويل والدفعة والفائدة، لأنها تعرض القسط والتكلفة الكلية والسداد المبكر. بعد ذلك انتقل إلى النسبة المئوية إذا أردت فهم نسب التغير أو الخصم أو الزيادة داخل العرض نفسه. لا تقارن عرضين بالقسط وحده؛ ثبّت المدة والمبلغ والعملة ثم غيّر الفائدة والرسوم فقط.',
  },
];
function buildFinanceToolPathways() {
  const primaryItems = PRIMARY_FINANCE_ROUTE
    ? [{
        href: PRIMARY_FINANCE_ROUTE.href,
        label: FINANCE_TOOL_LABELS[PRIMARY_FINANCE_ROUTE.slug],
        title: PRIMARY_FINANCE_ROUTE.title,
        description: FINANCE_PRIMARY_DESCRIPTION,
        ctaLabel: FINANCE_TOOL_CTAS[PRIMARY_FINANCE_ROUTE.slug],
        iconLabel: FINANCE_TOOL_ICONS[PRIMARY_FINANCE_ROUTE.slug],
      }]
    : [];
  const supportingItems = SUPPORTING_FINANCE_ROUTES.map((item) => ({
    href: item.href,
    label: FINANCE_TOOL_LABELS[item.slug] || item.badge,
    title: item.title,
    description: item.description,
    ctaLabel: FINANCE_TOOL_CTAS[item.slug] || 'افتح الحاسبة',
    iconLabel: FINANCE_TOOL_ICONS[item.slug] || 'مال',
  }));

  return [...primaryItems, ...supportingItems];
}

export const metadata = buildCanonicalMetadata({
  title: 'حاسبات مالية عربية | القسط والضريبة ونهاية الخدمة والنسبة',
  description:
    'حاسبات مالية عربية للقسط الشهري، ضريبة القيمة المضافة، النسبة المئوية، ومكافأة نهاية الخدمة مع شرح يساعدك على فهم الرقم قبل القرار.',
  keywords: [
    'حاسبات مالية عربية',
    'حاسبة مالية',
    'حاسبة قرض وضريبة',
    'حاسبات المال والعمل',
    ...FINANCE_HUB.keywords,
    ...FINANCE_ROUTES.flatMap((item) => item.keywords),
  ],
  url: `${SITE_URL}${FINANCE_HUB.href}`,
});

export default function FinanceCalculatorsHubPage() {
  const financeToolPathways = buildFinanceToolPathways();
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات المال والعمل',
    url: `${SITE_URL}${FINANCE_HUB.href}`,
    inLanguage: 'ar',
    description: FINANCE_HUB.description,
    isPartOf: `${SITE_URL}/calculators`,
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: FINANCE_ROUTES.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبات المال والعمل', item: `${SITE_URL}${FINANCE_HUB.href}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CalculatorHero
        badge="مال / عمل"
        title="حاسبات مالية عربية: القسط، الضريبة، النسبة ونهاية الخدمة"
        description="إذا كان قرارك مرتبطاً بتمويل، فاتورة، خصم، أو مستحقات عمل، فابدأ من السؤال الأقرب لك: كم القسط؟ كم الضريبة؟ كم الخصم؟ كم مكافأة نهاية الخدمة؟ اختر الحاسبة المناسبة، ثم راجع الشرح المختصر حتى تفهم الرقم قبل أن تعتمد عليه."
        highlights={[
          'ابدأ من سؤال واضح مثل كم قسط قرض 100 ألف أو كم ضريبة 1000 ريال.',
          'كل صفحة فرعية تعطي نتيجة سريعة ثم توسع الفهم بشرح وأمثلة ومسار تطبيقي واضح.',
          'مفيد للموظف، وصاحب المتجر، والباحث عن قرض، وكل من يحتاج قراراً أسرع وأوضح.',
          'النتائج تقديرية عند القرارات الحساسة ولا تغني عن عرض البنك أو الجهة الرسمية أو النظام المحلي.',
        ]}
      />

      <CalculatorSection
        id="finance-policy-notice"
        eyebrow="شفافية قبل الحساب"
        title="ميقاتنا ليس بنكاً ولا وسيط تمويل"
        description="بعض أدوات هذا القسم تتحدث عن قروض أو تمويل، لذلك نعرض حدود الاستخدام بوضوح قبل اختيار أي حاسبة."
      >
        <CalculatorPolicyNotice {...FINANCE_INFORMATIONAL_NOTICE} />
      </CalculatorSection>

      <CalculatorSection
        showAdBefore
        id="finance-tools"
        eyebrow="الأدوات الأساسية"
        title="ابدأ من الأداة التي تطابق القرار لا من قائمة أسماء"
        description="القرض عادة هو القرار الأعلى أثراً، لذلك نضعه أولاً، ثم تأتي الضريبة والنسبة ونهاية الخدمة كمسارات مساعدة حسب السؤال الذي بين يديك."
        subtle
      >
        <CalculatorToolLauncher
          items={financeToolPathways}
          ariaLabel="اختيار الحاسبة المالية المناسبة"
          badge="4 قرارات مال وعمل"
          featuredLabel="ابدأ هنا إذا كان القرار تمويلياً"
          theme="green"
          note="إذا كان سؤالك عن فاتورة فابدأ بالضريبة، وإذا كان عن خصم أو زيادة فابدأ بالنسبة، وإذا كان عن مستحقات عمل فانتقل مباشرة إلى نهاية الخدمة. هذا الترتيب يقلل التنقل ويجعل كل خطوة مرتبطة بسؤال واضح."
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-decision-table"
        eyebrow="مقارنة القرار"
        title="لا تجعل كل الأسئلة المالية في حاسبة واحدة"
        description="القرض والضريبة والنسبة ونهاية الخدمة قد تبدو كلها أرقاماً مالية، لكنها تخدم قرارات مختلفة تماماً."
        subtle
      >
        <CalculatorDecisionTable
          columns={['سؤالك الان', 'الأداة المناسبة', 'ما الذي تنتبه له؟']}
          rows={FINANCE_DECISION_TABLE}
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-cases"
        eyebrow="سيناريوهات استخدام"
        title="استخدم الحاسبة في موقف مالي حقيقي"
        description="كل أداة مرتبطة بسؤال عملي قد تواجهه في العمل، الشراء، التمويل، أو مراجعة المستحقات."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'موظف يراجع استقالته أو نهاية عقده',
              description: 'قرار مالي حساس يحتاج وضوحاً',
              content: 'احسب مكافأة نهاية الخدمة برقم تقريبي واضح قبل أن تراجع القرار أو تتحدث مع جهة العمل، ثم اقرأ الفرق بين الاستقالة ونهاية العقد.',
            },
            {
              title: 'تقارن قرضاً شخصياً أو عقارياً',
              description: 'قبل القرار وليس بعده',
              content: 'لا تنظر إلى رقم القسط وحده. راجع أثر المدة والفائدة والدفعة المقدمة على ميزانيتك الشهرية قبل قبول أي عرض.',
            },
            {
              title: 'تاجر أو مسوّق أو صاحب فاتورة',
              description: 'سؤال يومي ومتكرر',
              content: 'يحتاج إلى إضافة الضريبة أو استخراجها بسرعة، وغالباً يريد فرق السعر الشامل وغير الشامل دون الذهاب إلى ملف Excel أو آلة حاسبة يدوية.',
            },
            {
              title: 'تحسب خصماً أو زيادة أو نسبة نجاح',
              description: 'أداة يومية ذات استعمال واسع',
              content: 'استخدم حاسبة النسبة في التسعير، التعليم، التغيير بين رقمين، تقسيم المبالغ، أو فهم الخصومات المتتالية.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-return-paths"
        eyebrow="رحلات متكررة"
        title="أسئلة مالية ستحتاجها أكثر من مرة"
        description="احفظ الصفحات التي تناسب قراراتك المتكررة: قسط قرض، ضريبة فاتورة، خصم، أو مكافأة نهاية خدمة."
        subtle
      >
        <CalculatorResourceLinks items={FINANCE_RETURN_PATHS} buttonLabel="افتح السؤال مباشرة" />
      </CalculatorSection>

      <CalculatorSection
        id="finance-faq"
        eyebrow="قبل الاعتماد"
        title="أسئلة قبل اختيار حاسبة مالية أو الاعتماد على نتيجتها"
        description="إجابات قصيرة تساعدك على اختيار الأداة المناسبة، وفهم متى يكون الرقم كافياً ومتى تحتاج قراءة الشروط أو مقارنة بديلة."
      >
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="finance-more"
        eyebrow="خطوة تالية"
        title="ثلاثة مسارات تكمل القرار المالي غالباً"
        description="لا تحتاج شبكة خيارات واسعة هنا. اختر مساراً واحداً فقط إذا كان سؤالك التالي عن خطة شهرية، مشروع بناء، أو موعد نوم يؤثر في روتينك اليومي."
      >
        <CalculatorResourceLinks
          items={CALCULATOR_HUBS.filter((hub) => FINANCE_NEXT_HUB_SLUGS.includes(hub.slug)).map((hub) => ({
            href: hub.href,
            title: hub.title,
            description: hub.description,
            ctaLabel: 'افتح القسم',
          }))}
          buttonLabel="افتح القسم"
        />
      </CalculatorSection>

    </main>
  );
}
