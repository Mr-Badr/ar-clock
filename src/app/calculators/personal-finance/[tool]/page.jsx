import { notFound } from 'next/navigation';

import DebtPayoffCalculator from '@/components/calculators/personal-finance/DebtPayoffCalculator.client';
import EmergencyFundCalculator from '@/components/calculators/personal-finance/EmergencyFundCalculator.client';
import NetWorthCalculator from '@/components/calculators/personal-finance/NetWorthCalculator.client';
import SavingsGoalCalculator from '@/components/calculators/personal-finance/SavingsGoalCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorResourceLinks,
  CalculatorSection,
} from '@/components/calculators/common';
import {
  PERSONAL_FINANCE_TOOLS,
  getPersonalFinanceToolBySlug,
  getRelatedPersonalFinanceTools,
} from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

const CALCULATOR_COMPONENTS = {
  'emergency-fund': EmergencyFundCalculator,
  'debt-payoff': DebtPayoffCalculator,
  'savings-goal': SavingsGoalCalculator,
  'net-worth': NetWorthCalculator,
};

const TOOL_METHOD_STEPS = {
  'emergency-fund': [
    { name: 'اكتب مصاريفك الأساسية فقط', text: 'ابدأ بالسكن والطعام والفواتير والنقل والدواء والحد الأدنى من الالتزامات، ولا تضف الكماليات التي يمكن إيقافها وقت الأزمة.' },
    { name: 'اختر عدد أشهر مناسباً لخطر دخلك', text: 'ثلاثة أشهر قد تكفي كبداية للدخل الثابت، وستة أشهر أو أكثر أفضل للدخل المتغير أو المسؤوليات العائلية الكبيرة.' },
    { name: 'اطرح المدخر الحالي', text: 'لا تبدأ من الصفر إذا كان لديك رصيد قائم؛ الفجوة المتبقية هي ما تحتاج تخطيطه شهرياً.' },
    { name: 'اختبر الادخار الشهري', text: 'إذا كان الرقم الشهري يضغط ضرورياتك أو يدفعك للدين، فابدأ بمرحلة أصغر ثم ارفع الهدف تدريجياً.' },
  ],
  'debt-payoff': [
    { name: 'اكتب كل دين في سطر مستقل', text: 'سجل الرصيد، الفائدة أو الرسوم، والحد الأدنى لكل دين. لا تجمع الديون في رقم واحد لأن ترتيب السداد هو جوهر القرار.' },
    { name: 'ادفع الحد الأدنى للجميع أولاً', text: 'الحد الأدنى يحميك من التأخر والغرامات. المبلغ الإضافي فقط هو الذي توجهه إلى دين واحد لتسريع الخطة.' },
    { name: 'قارن كرة الثلج والانهيار', text: 'كرة الثلج تبدأ بالأصغر لتقوية الالتزام، والانهيار يبدأ بالأعلى فائدة لتقليل التكلفة غالباً.' },
    { name: 'جرّب دفعة إضافية واقعية', text: 'ابدأ بمبلغ يمكنك تكراره عدة أشهر. دفعة صغيرة ثابتة أقوى من دفعة كبيرة لا تستمر.' },
  ],
  'savings-goal': [
    { name: 'حوّل الهدف إلى رقم نهائي', text: 'لا تكتب هدفاً عاماً مثل السفر أو السيارة فقط؛ اكتب التكلفة الواقعية مع هامش بسيط.' },
    { name: 'اطرح ما ادخرته فعلاً', text: 'المدخر الحالي يقلل الفجوة ويجعل الخطة أهدأ. لا تبدأ الحساب كأنك تبدأ من الصفر إذا كان لديك رصيد.' },
    { name: 'اختر مدة يمكن العيش معها', text: 'إذا كان الرقم الشهري الناتج يكسر ضرورياتك، فمدد المدة أو قسّم الهدف إلى مرحلة أولى وثانية.' },
    { name: 'افصل مال الهدف عن المصروف اليومي', text: 'الفصل لا يزيد المال بذاته، لكنه يقلل السحب العشوائي ويجعل التقدم واضحاً.' },
  ],
  'net-worth': [
    { name: 'اكتب الأصول بالقيمة الحالية', text: 'استخدم قيمة اليوم للنقد والمدخرات والاستثمارات والعقار والسيارة، لا سعر الشراء القديم ولا رقم التمني.' },
    { name: 'اكتب الالتزامات بالمبلغ المتبقي', text: 'سجل القروض والبطاقات والتمويلات والديون الشخصية بالمبلغ الذي لا يزال عليك سداده.' },
    { name: 'اربط الأصل الممول بدينه', text: 'السيارة أو البيت الممولان يظهران في الجانبين: قيمة الأصل في الأصول، والمتبقي من التمويل في الالتزامات.' },
    { name: 'اقرأ السبب بعد الرقم', text: 'اسأل هل المشكلة في كثرة الديون، قلة الأصول، ضعف السيولة، أو تقييم غير واقعي لبعض الممتلكات.' },
  ],
};

const TOOL_DECISION_TABLES = {
  'emergency-fund': {
    title: 'اختيار عدد الأشهر من واقعك لا من رقم محفوظ',
    description: 'استخدم الجدول قبل اعتماد الهدف، لأن 3 أو 6 أشهر ليست حكماً واحداً لكل شخص.',
    columns: ['الحالة', 'الهدف الأقرب', 'ماذا تفعل؟'],
    rows: [
      { key: 'starter', cells: ['لا تملك أي احتياطي', 'احتياطي أولي ثم شهر واحد', 'ابدأ برقم صغير يمنع أول عودة للدين، ثم ارفعه تدريجياً.'] },
      { key: 'stable', cells: ['دخل ثابت ومسؤوليات محدودة', '3 أشهر كبداية عملية', 'اختبر هل تستطيع الوصول لها دون إيقاف سداد الديون الأساسية.'] },
      { key: 'family', cells: ['أسرة أو دخل متغير أو التزامات ثقيلة', '6 أشهر أو أكثر', 'ارفع الحماية لأن توقف الدخل سيؤثر على أكثر من شخص أو أكثر من التزام.'] },
      { key: 'high-risk', cells: ['عمل حر أو دخل موسمي', '9 إلى 12 شهراً بالتدرج', 'لا تبنِ الرقم دفعة واحدة؛ اجعله مرحلة بعد الوصول إلى 3 ثم 6 أشهر.'] },
    ],
  },
  'debt-payoff': {
    title: 'كرة الثلج أم الانهيار؟ اختر طريقة تستطيع تنفيذها',
    description: 'الطريقة الأفضل ليست اسمها الأشهر، بل التي تخفض التكلفة وتبقيك ملتزماً.',
    columns: ['الطريقة', 'متى تناسبك؟', 'الخطر الذي تنتبه له'],
    rows: [
      { key: 'snowball', cells: ['كرة الثلج', 'عندما تحتاج إغلاق دين صغير سريعاً حتى تستمر.', 'قد تترك ديناً عالي الفائدة وقتاً أطول.'] },
      { key: 'avalanche', cells: ['الانهيار', 'عندما يكون لديك دين أعلى فائدة بوضوح وتستطيع الصبر.', 'قد يتأخر أول إنجاز إذا كان الدين الكبير هو الأعلى فائدة.'] },
      { key: 'hybrid', cells: ['طريقة هجينة', 'عندما يوجد دين صغير جداً ثم دين عالي الفائدة.', 'اكتب القاعدة مسبقاً حتى لا تتحول الخطة إلى عشوائية.'] },
      { key: 'distressed', cells: ['دين متأخر أو في التحصيل', 'راجع الجهة الدائنة أو مختصاً قبل الترتيب العادي.', 'الأولوية قد تكون إيقاف الضرر لا تقليل الفائدة فقط.'] },
    ],
  },
  'savings-goal': {
    title: 'ماذا تعدّل إذا كان المبلغ الشهري كبيراً؟',
    description: 'لا تلغِ الهدف مباشرة. غيّر أحد مفاتيح الخطة حتى تصبح قابلة للاستمرار.',
    columns: ['ما الذي تغيّره؟', 'الأثر على الخطة', 'متى يكون مناسباً؟'],
    rows: [
      { key: 'extend', cells: ['تمديد المدة', 'يخفض المبلغ الشهري غالباً.', 'للأهداف المرنة مثل السفر أو جهاز جديد.'] },
      { key: 'starter', cells: ['رفع المبلغ الابتدائي', 'يقلل الفجوة المتبقية.', 'عند وجود مكافأة أو رصيد يمكن تخصيصه.'] },
      { key: 'phase', cells: ['تقسيم الهدف', 'يعطيك مرحلة أولى أقرب.', 'للأهداف الكبيرة مثل سيارة أو زواج أو تجهيز منزل.'] },
      { key: 'pause', cells: ['تأجيل الهدف', 'يحمي الأولويات الأعلى.', 'إذا لم يكن لديك طوارئ أو لديك دين عالي التكلفة.'] },
    ],
  },
  'net-worth': {
    title: 'ما الذي يدخل في الأصول والالتزامات؟',
    description: 'التصنيف الصحيح أهم من الرقم الجميل، لأنه يمنعك من تضخيم الصورة أو نسيان الديون.',
    columns: ['البند', 'أين تكتبه؟', 'تنبيه عملي'],
    rows: [
      { key: 'cash', cells: ['نقد ومدخرات واستثمارات', 'أصول', 'استخدم القيمة الحالية لا توقعات مستقبلية.'] },
      { key: 'property', cells: ['بيت أو سيارة ممولة', 'الأصل والالتزام معاً', 'اكتب قيمة الأصل، واكتب الدين المتبقي عليه في الالتزامات.'] },
      { key: 'cards', cells: ['بطاقات وقروض وأقساط', 'التزامات', 'اكتب الرصيد المتبقي، لا القسط الشهري فقط.'] },
      { key: 'income', cells: ['الراتب', 'لا يدخل كأصل مباشرة', 'الدخل يصبح أصلاً فقط عندما يبقى منه نقد أو ادخار أو استثمار.'] },
    ],
  },
};

const TOOL_SOURCE_LINKS = {
  'emergency-fund': [
    { href: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/', title: 'CFPB: دليل صندوق الطوارئ', description: 'شرح رسمي لبناء صندوق طوارئ واختيار مكان مناسب لحفظه.', ctaLabel: 'راجع المصدر' },
    { href: 'https://consumer.gov/your-money/making-budget', title: 'Consumer.gov: بناء الميزانية', description: 'مرجع مبسط لفهم الدخل والمصاريف قبل تحديد مبلغ الطوارئ.', ctaLabel: 'راجع المصدر' },
  ],
  'debt-payoff': [
    { href: 'https://consumer.gov/debt/debt-explained', title: 'Consumer.gov: فهم الديون', description: 'شرح عملي للديون وخطط الدفع ومتى تحتاج مساعدة.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.consumerfinance.gov/about-us/blog/how-reduce-your-debt/', title: 'CFPB: تقليل الديون', description: 'مقارنة مبسطة بين البدء بأعلى فائدة أو أصغر رصيد.', ctaLabel: 'راجع المصدر' },
  ],
  'savings-goal': [
    { href: 'https://www.consumerfinance.gov/documents/7276/cfpb_my-new-money-goal_worksheet.pdf', title: 'CFPB: ورقة هدف مالي', description: 'ورقة عمل تساعدك على تحويل الهدف إلى مبلغ وخطة شهرية.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator', title: 'Investor.gov: حاسبة هدف الادخار', description: 'حاسبة رسمية للمقارنة حول الرصيد الحالي والمدة والعائد.', ctaLabel: 'راجع المصدر' },
  ],
  'net-worth': [
    { href: 'https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/figure-out-your-finances', title: 'Investor.gov: فهم وضعك المالي', description: 'مرجع يشرح صافي الثروة وماذا تملك وماذا عليك.', ctaLabel: 'راجع المصدر' },
    { href: 'https://consumer.gov/your-money/making-budget', title: 'Consumer.gov: الميزانية والدخل', description: 'مرجع يساعدك على فصل الدخل والمصاريف عن الأصول والالتزامات.', ctaLabel: 'راجع المصدر' },
  ],
};

export function generateStaticParams() {
  const safeTools = Array.isArray(PERSONAL_FINANCE_TOOLS) ? PERSONAL_FINANCE_TOOLS : [];
  return safeTools.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getPersonalFinanceToolBySlug(toolSlug);
  if (!tool) return {};

  return buildCanonicalMetadata({
    title: tool.heroTitle,
    description: tool.description,
    keywords: Array.isArray(tool.keywords) ? tool.keywords : [],
    url: `${SITE_URL}${tool.href}`,
  });
}

export default async function PersonalFinanceToolPage({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getPersonalFinanceToolBySlug(toolSlug);
  const CalculatorComponent = CALCULATOR_COMPONENTS[toolSlug];
  if (!tool || !CalculatorComponent) notFound();
  const toolKeywords = Array.isArray(tool.keywords) ? tool.keywords : [];
  const faqItems = Array.isArray(tool.faqItems) ? tool.faqItems : [];
  const infoItems = Array.isArray(tool.infoItems) ? tool.infoItems : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'التخطيط المالي الشخصي', item: `${SITE_URL}/calculators/personal-finance` },
      { '@type': 'ListItem', position: 4, name: tool.title, item: `${SITE_URL}${tool.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: tool.href,
    name: tool.title,
    description: tool.description,
    about: toolKeywords.slice(0, 8),
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const relatedTools = getRelatedPersonalFinanceTools(tool.slug);
  const methodSteps = Array.isArray(TOOL_METHOD_STEPS[tool.slug]) ? TOOL_METHOD_STEPS[tool.slug] : [];
  const decisionTable = TOOL_DECISION_TABLES[tool.slug];
  const sourceLinks = Array.isArray(TOOL_SOURCE_LINKS[tool.slug]) ? TOOL_SOURCE_LINKS[tool.slug] : [];
  const nextPathLinks = [
    ...relatedTools.slice(0, 2).map((item) => ({
      href: item.href,
      title: item.title,
      description: item.description,
      ctaLabel: 'افتح الحاسبة',
    })),
  ];
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `كيفية استخدام ${tool.title}`,
    description: tool.description,
    step: methodSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {methodSteps.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      ) : null}

      <CalculatorHero
        badge={tool.badge}
        title={tool.heroTitle}
        description={tool.description}
        highlights={[
          'أدخل أرقامك أولاً ثم اقرأ معنى النتيجة قبل الاعتماد عليها.',
          'جرّب أكثر من سيناريو حتى ترى أثر المدة أو الدفعة أو المصاريف.',
          'انتقل بعد الحساب إلى أداة أو مقال يكمل نفس القرار، لا إلى فهرس طويل.',
        ]}
      >
        <CalculatorComponent />
      </CalculatorHero>

      {methodSteps.length ? (
        <CalculatorSection
          id="pf-method"
          eyebrow="طريقة الاستخدام"
          title="استخدم الحاسبة بهذه الخطوات قبل تفسير النتيجة"
          description="هذه الخطوات تمنع أكثر الأخطاء شيوعاً: رقم ناقص، مدة متفائلة، أو قراءة النتيجة كأنها قرار نهائي."
        >
          <CalculatorInfoGrid
            items={methodSteps.map((item) => ({
              title: item.name,
              content: item.text,
            }))}
          />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="pf-content"
        eyebrow="شرح عملي"
        title="كيف تربط النتيجة بقرارك المالي؟"
        description="استخدم هذه الملاحظات لتعرف ما الذي تغيّره في الخطة إذا ظهرت النتيجة أعلى أو أقل مما توقعت."
        subtle
      >
        <CalculatorInfoGrid items={infoItems} />
      </CalculatorSection>

      {decisionTable ? (
        <CalculatorSection
          id="pf-decision"
          eyebrow="قاعدة القرار"
          title={decisionTable.title}
          description={decisionTable.description}
        >
          <CalculatorDecisionTable columns={decisionTable.columns} rows={decisionTable.rows} />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="pf-next"
        eyebrow="المسار المكمل"
        title="اختر خطوة واحدة تكمل قرارك المالي"
        description="بعد أن تفهم النتيجة، لا تنتقل إلى فهرس جديد. افتح حاسبة مرتبطة تكمل الخلفية العملية لنفس القرار."
      >
        <CalculatorResourceLinks items={nextPathLinks} buttonLabel="افتح المسار" />
      </CalculatorSection>

      {sourceLinks.length ? (
        <CalculatorSection
          id="pf-sources"
          eyebrow="مصادر تعليمية"
          title="مصادر تساعدك على مراجعة الفكرة قبل قرار كبير"
          description="استخدمها عندما تحتاج مرجعاً أعمق للميزانية أو الديون أو الادخار أو صافي الثروة قبل التزام مالي مؤثر."
        >
          <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="pf-faq"
        eyebrow="قبل القرار المالي"
        title="أسئلة قبل تحويل الرقم إلى قرار مالي"
        description="أسئلة قصيرة ومباشرة تساعدك على حسم التردد قبل أن تعتمد النتيجة أو تنتقل إلى خطوة أخرى."
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>
    </main>
  );
}
