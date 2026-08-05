import AdMultiplex from '@/components/ads/AdMultiplex';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorHubGrid,
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

const PRIMARY_FINANCE_ROUTE = FINANCE_ROUTES.find((item) => item.slug === 'end-of-service-benefits') ?? FINANCE_ROUTES[0];
const SUPPORTING_FINANCE_ROUTES = PRIMARY_FINANCE_ROUTE
  ? FINANCE_ROUTES.filter((item) => item.slug !== PRIMARY_FINANCE_ROUTE.slug)
  : FINANCE_ROUTES;
const FINANCE_TOOL_LABELS = {
  'jordan-income-tax':      'ضريبة الدخل الأردن',
  'egypt-water-bill':       'فاتورة المياه مصر',
  'article-77-compensation': 'تعويض الفصل التعسفي',
  'traffic-fine-discount': 'خصم مخالفة مرورية',
  'domestic-worker-cost': 'تكلفة استقدام عاملة',
  'end-of-service-benefits': 'مستحقات عمل',
};
const FINANCE_TOOL_CTAS = {
  'jordan-income-tax':      'احسب ضريبتك الآن',
  'egypt-water-bill':       'احسب فاتورتك',
  'article-77-compensation': 'احسب تعويضك',
  'traffic-fine-discount': 'افحص خصمك',
  'domestic-worker-cost': 'احسب التكلفة',
  'end-of-service-benefits': 'احسب نهاية الخدمة',
};
const FINANCE_TOOL_ICONS = {
  'jordan-income-tax':      'ضريبة',
  'egypt-water-bill':       'مياه',
  'article-77-compensation': 'م. 77',
  'traffic-fine-discount': 'خصم 25%',
  'domestic-worker-cost': 'مساند',
  'end-of-service-benefits': 'عمل',
};
const FINANCE_PRIMARY_DESCRIPTION = 'مكافأة نهاية الخدمة لا تُختصر برقم واحد. افتح الحاسبة لترى الفرق بين الاستقالة ونهاية العقد، وأثر مدة الخدمة على النسبة، قبل أن تعتمد على الرقم في أي قرار.';
const FINANCE_RETURN_PATHS = [
  {
    href: '/tools/gulf-finance/end-of-service-benefits',
    title: 'كم مكافأة نهاية الخدمة بعد 5 سنوات؟',
    description: 'احسب مكافأة نهاية الخدمة في السعودية، ثم قارن بين الاستقالة ونهاية العقد قبل الاعتماد على الرقم.',
  },
  {
    href: '/tools/gulf-finance/article-77-compensation',
    title: 'كم تعويض الفصل التعسفي؟',
    description: 'احسب تعويض المادة 77 من نظام العمل السعودي إذا أنهى صاحب العمل عقدك دون سبب مشروع.',
  },
  {
    href: '/tools/gulf-finance/traffic-fine-discount',
    title: 'هل تستحق خصم 25% على مخالفتك؟',
    description: 'اعرف المبلغ المستحق بعد خصم المادة 75 قبل انتهاء مهلة الـ45 يوماً، مع خيار التقسيط.',
  },
  {
    href: '/tools/gulf-finance/domestic-worker-cost',
    title: 'كم تكلفة استقدام عاملة منزلية؟',
    description: 'الرسوم الحكومية الفعلية عبر مساند بالإضافة لراتبها ورسوم مكتب الاستقدام.',
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
    key: 'article77',
    cells: [
      'أُنهي عملي بدون سبب واضح',
      'حاسبة تعويض المادة 77',
      'تأكد أولاً أن الإنهاء لا يندرج تحت أسباب المادة 74 المشروعة قبل الاعتماد على رقم التعويض.',
    ],
  },
  {
    key: 'traffic',
    cells: [
      'لدي مخالفة مرورية غير مسددة',
      'حاسبة خصم المخالفات',
      'تحقق من عدد الأيام منذ التسجيل ونوع المخالفة — الخصم 25% فقط خلال 45 يوماً وله استثناءات.',
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
    question: 'أي حاسبة أفتح إذا انتهى عملي أو فُصلت من غير سابق إنذار؟',
    answer: 'إذا انتهت مدة عقدك بشكل طبيعي، ابدأ بحاسبة مكافأة نهاية الخدمة لتعرف مستحقاتك. أما إذا أنهى صاحب العمل عقدك بدون سبب واضح، فراجع حاسبة تعويض المادة 77 — فهي مستحق منفصل تماماً يُضاف إلى مكافأتك، لا يحل محلها.',
  },
  {
    question: 'هل هذه الحاسبات تخدم كل الدول العربية؟',
    answer: 'حاسبة نهاية الخدمة السعودية، وتعويض المادة 77، وخصم المخالفات مبنية خصيصاً على النظام السعودي، لأن الدقة هنا تعتمد على معرفة القانون المحلي بالتفصيل. أما ضريبة الدخل والتأمينات في مصر والأردن والمغرب والإمارات فلها حاسبتها الخاصة بنفس القدر من الدقة لكل دولة.',
  },
  {
    question: 'كيف أعرف هل أستحق تعويض المادة 77 أصلاً؟',
    answer: 'راجع أولاً سبب إنهاء عملك. إذا كان اتفاقاً كتابياً بينك وبين صاحب العمل، أو انتهاء عقد محدد المدة دون تجديد، أو بلوغك سن التقاعد، أو فصلاً تأديبياً مبرراً، فلا يوجد استحقاق. أما إذا أُنهي عقدك بدون سبب مشروع أو بدون اتباع إجراءات الإشعار الصحيحة، فافتح حاسبة تعويض المادة 77 مباشرة.',
  },
  {
    question: 'لدي مخالفة مرورية، متى أفقد فرصة الخصم؟',
    answer: 'لديك 45 يوماً من تاريخ تسجيل المخالفة للحصول على خصم 25% من قيمتها. بعد هذه المهلة يصبح المبلغ الكامل مستحقاً بدون خصم — تحقق من التاريخ في حاسبة خصم المخالفات قبل أن تفوّت الفرصة.',
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
        title="حاسبات مالية عربية: نهاية الخدمة، تعويض الفصل، والمخالفات"
        description="إذا كان قرارك مرتبطاً بمستحقات عمل أو مخالفة مرورية، فابدأ من السؤال الأقرب لك: كم مكافأة نهاية الخدمة؟ هل أستحق تعويضاً عن فصلي؟ هل ما زلت مستحقاً لخصم مخالفتي؟ اختر الحاسبة المناسبة، ثم راجع الشرح المختصر حتى تفهم الرقم قبل أن تعتمد عليه."
        highlights={[
          'ابدأ من سؤال واضح مثل كم مكافأتي بعد 5 سنوات أو كم تعويض المادة 77.',
          'كل صفحة فرعية تعطي نتيجة سريعة ثم توسع الفهم بشرح وأمثلة ومسار تطبيقي واضح.',
          'مفيد للموظف الذي أُنهي عقده، وصاحب المخالفة المرورية، وكل من يحتاج قراراً أسرع وأوضح.',
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
        id="finance-tools"
        eyebrow="الأدوات الأساسية"
        title="ابدأ من الأداة التي تطابق القرار لا من قائمة أسماء"
        description="مستحقات نهاية العمل عادة هي القرار الأعلى أثراً، لذلك نضعها أولاً، ثم يأتي تعويض الفصل التعسفي وخصم المخالفات كمسارات مساعدة حسب السؤال الذي بين يديك."
        subtle
      >
        <CalculatorToolLauncher
          items={financeToolPathways}
          ariaLabel="اختيار الحاسبة المالية المناسبة"
          badge={`${financeToolPathways.length} قرارات مال وعمل`}
          featuredLabel="ابدأ هنا إذا كان قرارك مستحقات عمل"
          theme="green"
          note="إذا كان سؤالك عن فصل من العمل فابدأ بتعويض المادة 77، وإذا كانت لديك مخالفة مرورية فابدأ بحاسبة الخصم، وإذا كان عن مستحقات عمل عادية فانتقل مباشرة إلى نهاية الخدمة. هذا الترتيب يقلل التنقل ويجعل كل خطوة مرتبطة بسؤال واضح."
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-all-tools"
        eyebrow={`الفهرس الكامل — ${FINANCE_ROUTES.length} حاسبة`}
        title="كل حاسبات المال والعمل في مكان واحد"
        description="القائمة أعلاه أبرز 8 مسارات فقط. إذا لم تجد سؤالك بينها، هذا فهرس كامل بكل حاسبة في هذا القسم — خليجية أو عربية أخرى."
        subtle
      >
        <CalculatorHubGrid
          routes={FINANCE_ROUTES}
          ariaLabel="كل حاسبات المال والعمل"
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-decision-table"
        eyebrow="مقارنة القرار"
        title="لا تجعل كل الأسئلة المالية في حاسبة واحدة"
        description="تعويض الفصل التعسفي، خصم المخالفات، ونهاية الخدمة قد تبدو كلها أرقاماً مالية، لكنها تخدم قرارات مختلفة تماماً."
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
              title: 'أُنهي عملك بدون سبب مشروع',
              description: 'قرار قانوني حساس يحتاج وضوحاً',
              content: 'تأكد أولاً أن الإنهاء لا يندرج تحت أسباب المادة 74، ثم احسب تعويض المادة 77 التقديري قبل أي مراجعة مع محامٍ أو مكتب العمل.',
            },
            {
              title: 'لديك مخالفة مرورية غير مسددة',
              description: 'قبل انتهاء مهلة الخصم',
              content: 'تحقق من عدد الأيام منذ تسجيل المخالفة — الخصم 25% متاح فقط خلال 45 يوماً وله 9 استثناءات لا تشملها.',
            },
            {
              title: 'تستقدم عاملة منزلية',
              description: 'قرار تكلفة شفاف',
              content: 'افصل بين الرسوم الحكومية الثابتة عبر مساند ورسوم مكتب الاستقدام المتغيرة حتى تقارن العروض على أساس صحيح.',
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

      <AdMultiplex slotId="end-finance-hub" />

    </main>
  );
}
