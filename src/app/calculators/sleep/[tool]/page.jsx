import { notFound } from 'next/navigation';

import BedtimeCalculator from '@/components/calculators/sleep/BedtimeCalculator.client';
import NapCalculator from '@/components/calculators/sleep/NapCalculator.client';
import SleepDebtCalculator from '@/components/calculators/sleep/SleepDebtCalculator.client';
import SleepDurationCalculator from '@/components/calculators/sleep/SleepDurationCalculator.client';
import SleepNeedsByAgeCalculator from '@/components/calculators/sleep/SleepNeedsByAgeCalculator.client';
import WakeTimeCalculator from '@/components/calculators/sleep/WakeTimeCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorResourceLinks,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import {
  SLEEP_MODES,
  SLEEP_TOOLS,
  getRelatedSleepTools,
  getSleepGuideBySlug,
  getSleepToolBySlug,
} from '@/lib/sleep/content';

const SITE_URL = getSiteUrl();

const CALCULATOR_COMPONENTS = {
  bedtime: BedtimeCalculator,
  'wake-time': WakeTimeCalculator,
  'sleep-duration': SleepDurationCalculator,
  'nap-calculator': NapCalculator,
  'sleep-debt': SleepDebtCalculator,
  'sleep-needs-by-age': SleepNeedsByAgeCalculator,
};

const TOOL_METHOD_STEPS = {
  bedtime: [
    { name: 'حدد وقت الاستيقاظ أولاً', text: 'ابدأ من الموعد غير القابل للتفاوض مثل الدوام أو المدرسة أو الصلاة أو السفر، ثم دع الحاسبة ترجع للخلف.' },
    { name: 'أدخل وقت الغفو بصدق', text: 'إذا كنت تحتاج 20 دقيقة للنوم، فأضفها. تجاهل وقت الغفو يجعل النتيجة متفائلة أكثر من واقعك.' },
    { name: 'اختر خياراً قابلاً للتكرار', text: 'لا تختر أبكر وقت إذا كان سيصعب عليك الالتزام به. الخيار الناجح هو الذي يمكنك تكراره عدة ليالٍ.' },
    { name: 'راجع التعب بعد عدة أيام', text: 'إذا بقي التعب رغم وقت مناسب، انتقل إلى مدة النوم الفعلية أو دين النوم بدل تعديل الساعة فقط.' },
  ],
  'wake-time': [
    { name: 'استخدم الان للقرار الفوري', text: 'إذا كنت ستنام الان فعلاً، فعّل خيار الان حتى يعتمد الحساب على وقت جهازك المحلي.' },
    { name: 'اختر وقتاً يطابق يومك التالي', text: 'لا تختَر أطول نوم ممكن إذا كان سيكسر التزاماً مهماً، ولا تختَر الأقصر كعادة يومية.' },
    { name: 'عدّل وقت الغفو والدورة عند الحاجة', text: '90 دقيقة و15 دقيقة غفو تقديرات مفيدة، لكنها ليست ثابتة لكل شخص وكل ليلة.' },
    { name: 'انتقل للتخطيط إذا صار الاستيقاظ ثابتاً', text: 'إذا كان موعد الاستيقاظ يتكرر يومياً، فحاسبة وقت النوم أفضل لبناء روتين مستمر.' },
  ],
  'sleep-duration': [
    { name: 'اكتب الوقت في السرير', text: 'أدخل وقت النوم والاستيقاظ كما حدثا، لا كما كنت تخطط لهما.' },
    { name: 'اطرح الاستيقاظات الليلية', text: 'مجموع دقائق الاستيقاظ يغيّر الصافي كثيراً، خصوصاً إذا كنت تشعر أن 8 ساعات لا تكفيك.' },
    { name: 'قارن الصافي بالعمر', text: 'الطفل والمراهق والبالغ لا يحتاجون النطاق نفسه، لذلك لا تستخدم قاعدة 8 ساعات وحدها.' },
    { name: 'انتقل لدين النوم إذا تكررت المشكلة', text: 'ليلة واحدة قد تفسر تعباً مؤقتاً، أما التعب المتكرر فيحتاج قراءة أسبوعية.' },
  ],
  'nap-calculator': [
    { name: 'اختر هدف القيلولة', text: 'هل تريد تنشيطاً سريعاً أم دورة كاملة؟ الهدف يحدد هل تبدأ بـ20 دقيقة أو 90 دقيقة تقريباً.' },
    { name: 'أدخل وقت نوم الليل المعتاد', text: 'القيلولة لا تُقرأ وحدها. قربها من نوم الليل قد يجعلها مفيدة أو مربكة.' },
    { name: 'أضف وقت الغفو', text: 'القيلولة لا تبدأ دائماً لحظة إغلاق العين، لذلك أضف وقت الغفو حتى يكون وقت الاستيقاظ أقرب.' },
    { name: 'راقب الخمول بعد الاستيقاظ', text: 'إذا استيقظت أثقل بعد قيلولة متوسطة، جرّب قيلولة أقصر أو دورة كاملة في يوم مناسب.' },
  ],
  'sleep-debt': [
    { name: 'اكتب ساعات الأسبوع كما هي', text: 'لا تعتمد على شعورك فقط. اكتب كل يوم حتى ترى العجز المتراكم بوضوح.' },
    { name: 'قارنها باحتياج العمر', text: 'دين النوم هو الفرق بين احتياجك التقريبي وما نمت فعلاً خلال الأسبوع.' },
    { name: 'ابدأ التعويض بالتدريج', text: 'أضف 20 إلى 30 دقيقة في عدة ليالٍ بدلاً من محاولة تعويض كل شيء في يوم واحد.' },
    { name: 'ثبّت وقت الاستيقاظ قدر الإمكان', text: 'تذبذب الاستيقاظ الكبير يجعل التعويض أصعب، خاصة مع دوام أو دراسة أو رمضان.' },
  ],
  'sleep-needs-by-age': [
    { name: 'أدخل العمر كنقطة بداية', text: 'العمر يعطيك النطاق العام، لكنه لا يشرح وحده جودة النوم أو الاستيقاظات.' },
    { name: 'اقرأ النطاق لا رقماً واحداً', text: 'النتيجة تظهر مدى، لأن الناس لا يحتاجون نفس الرقم الدقيق حتى داخل الفئة العمرية نفسها.' },
    { name: 'قارن النطاق بنومك الفعلي', text: 'إذا كنت أقل من النطاق عدة أيام، استخدم مدة النوم أو دين النوم لفهم حجم الفجوة.' },
    { name: 'راجع الجودة إذا كنت داخل النطاق ومتعباً', text: 'التعب مع مدة كافية قد يشير إلى تقطع النوم أو عادات غير مستقرة أو سبب صحي يحتاج مراجعة.' },
  ],
};

const TOOL_DECISION_TABLES = {
  bedtime: {
    title: 'أي وقت نوم تختار من الخيارات؟',
    description: 'لا تختَر أول وقت يظهر فقط. اربط الخيار بواقعك: وقت الغفو، الالتزام الصباحي، وعدد الأيام التي ستكرر فيها الروتين.',
    columns: ['الخيار', 'متى يناسبك؟', 'متى لا يكفي؟'],
    rows: [
      { key: 'full', cells: ['خيار أطول', 'إذا كان اليوم التالي يحتاج تركيزاً أو قيادة أو دواماً مبكراً.', 'إذا كان وقت النوم مبكراً جداً ولا تستطيع تكراره.'] },
      { key: 'balanced', cells: ['خيار متوسط', 'عندما تريد توازناً بين مدة كافية وروتين قابل للتطبيق.', 'إذا بقي الصافي أقل من احتياج العمر عدة أيام.'] },
      { key: 'short', cells: ['خيار قصير', 'لليلة اضطرارية لا تملك فيها وقتاً كافياً.', 'لا تجعله نمطاً يومياً إذا تكرر التعب.'] },
    ],
  },
  'wake-time': {
    title: 'كيف تختار من أوقات الاستيقاظ؟',
    description: 'وقت الاستيقاظ الأفضل هو الذي يناسب التزاماتك ويقلل الخمول، لا الوقت الذي يبدو مثالياً على الورق فقط.',
    columns: ['حالتك', 'الخيار الأقرب', 'تنبيه'],
    rows: [
      { key: 'urgent', cells: ['تحتاج الاستيقاظ قريباً', 'أقرب نهاية دورة معقولة', 'حل اضطراري لليلة واحدة، وليس روتيناً يومياً.'] },
      { key: 'focus', cells: ['يومك يحتاج تركيزاً', 'خيار أقرب للمدى الموصى به', 'قد تحتاج وقت نوم أبكر في الليلة التالية.'] },
      { key: 'routine', cells: ['تكرر السؤال يومياً', 'انتقل لحاسبة وقت النوم', 'التخطيط من وقت الاستيقاظ أفضل من الحساب اللحظي.'] },
    ],
  },
  'sleep-duration': {
    title: 'هل المشكلة في المدة أم التقطع؟',
    description: 'الوقت في السرير قد يبدو جيداً، لكن صافي النوم والاستيقاظات يغيّران القراءة.',
    columns: ['النتيجة', 'ماذا تعني؟', 'الخطوة التالية'],
    rows: [
      { key: 'low-net', cells: ['صافي النوم أقل من النطاق', 'ربما تحتاج وقت نوم أطول أو تقليل الاستيقاظات.', 'استخدم وقت النوم ودين النوم.'] },
      { key: 'fragmented', cells: ['استيقاظات كثيرة', 'الجودة قد تكون المشكلة حتى لو المدة الظاهرية جيدة.', 'راقب التكرار وراجع مختصاً إذا استمر.'] },
      { key: 'enough-tired', cells: ['داخل النطاق مع تعب', 'ابحث في النمط والعادات والأسباب الصحية المحتملة.', 'راجع دين النوم أو عادات النوم.'] },
    ],
  },
  'nap-calculator': {
    title: '20 أم 30 أم 90 دقيقة؟',
    description: 'مدة القيلولة الجيدة تعتمد على هدفك وموعد نوم الليل، لا على رقم واحد يناسب كل يوم.',
    columns: ['المدة', 'متى تفيد؟', 'متى تنتبه؟'],
    rows: [
      { key: 'short', cells: ['20 دقيقة تقريباً', 'تنشيط سريع قبل عمل أو دراسة.', 'قد لا تكفي إذا كان لديك عجز نوم كبير.'] },
      { key: 'medium', cells: ['30 دقيقة', 'حل وسط لبعض الناس.', 'قد تزيد الخمول عند الاستيقاظ عند آخرين.'] },
      { key: 'cycle', cells: ['90 دقيقة', 'عندما تملك وقتاً لدورة كاملة تقريبية.', 'قد تؤخر نوم الليل إذا كانت متأخرة.'] },
    ],
  },
  'sleep-debt': {
    title: 'كيف تقرأ حجم دين النوم؟',
    description: 'العجز الأسبوعي يشرح التعب المتكرر أفضل من ليلة واحدة تبدو جيدة أو سيئة.',
    columns: ['الحالة', 'المعنى العملي', 'التصرف الأفضل'],
    rows: [
      { key: 'light', cells: ['عجز خفيف', 'قد يظهر من عدة ليالٍ قصيرة قليلاً.', 'أضف 20 دقيقة لعدة ليالٍ.'] },
      { key: 'clear', cells: ['عجز واضح', 'قد يؤثر على التركيز والمزاج واليقظة.', 'ابدأ خطة تعويض تدريجية وثبّت الاستيقاظ.'] },
      { key: 'repeating', cells: ['عجز يتكرر أسبوعياً', 'المشكلة في الروتين لا في عطلة واحدة.', 'راجع وقت النوم والكافيين والقيلولة والمناوبات.'] },
    ],
  },
  'sleep-needs-by-age': {
    title: 'كيف تستخدم نطاق العمر؟',
    description: 'النطاق ليس حكماً نهائياً، لكنه يمنع مقارنة الطفل أو المراهق أو البالغ بقاعدة واحدة.',
    columns: ['إذا كانت مدتك', 'ماذا يعني ذلك؟', 'ماذا تفعل؟'],
    rows: [
      { key: 'below', cells: ['أقل من النطاق عدة أيام', 'قد يظهر نقص في التركيز والطاقة.', 'استخدم دين النوم أو وقت النوم لتقليل الفجوة.'] },
      { key: 'inside', cells: ['داخل النطاق', 'المدة غالباً مناسبة كنقطة بداية.', 'راجع الجودة والتقطع إذا بقي التعب.'] },
      { key: 'above', cells: ['أعلى كثيراً من النطاق مع تعب', 'قد يكون النوم غير مريح أو توجد أسباب أخرى.', 'راقب النمط وراجع مختصاً إذا استمر.'] },
    ],
  },
};

const TOOL_SOURCE_LINKS = {
  bedtime: [
    { href: 'https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep', title: 'NHLBI: مراحل النوم', description: 'شرح لمراحل ودورات النوم التي تعتمد عليها فكرة أوقات النوم المقترحة.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.sleepfoundation.org/sleep-faqs/how-long-should-it-take-to-fall-asleep', title: 'Sleep Foundation: وقت الغفو', description: 'مرجع يشرح وقت الغفو ولماذا لا يبدأ النوم لحظة دخول السرير.', ctaLabel: 'راجع المصدر' },
  ],
  'wake-time': [
    { href: 'https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep', title: 'NHLBI: دورات النوم', description: 'مرجع يوضح لماذا الاستيقاظ قد يختلف حسب مرحلة النوم.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.cdc.gov/sleep/about/index.html', title: 'CDC: أساسيات النوم', description: 'مرجع رسمي عن النوم وعدد الساعات وجودته.', ctaLabel: 'راجع المصدر' },
  ],
  'sleep-duration': [
    { href: 'https://www.cdc.gov/sleep/about/index.html', title: 'CDC: جودة ومدة النوم', description: 'مرجع عن أهمية المدة والجودة في قراءة النوم.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.nhlbi.nih.gov/health/sleep/why-sleep-important', title: 'NHLBI: لماذا النوم مهم؟', description: 'يوضح أثر النوم في التركيز والمزاج والصحة العامة.', ctaLabel: 'راجع المصدر' },
  ],
  'nap-calculator': [
    { href: 'https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod7/05.html', title: 'CDC/NIOSH: مدة القيلولة', description: 'مرجع يشرح القيلولة القصيرة ومدى فائدتها في تقليل النعاس.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.mayoclinic.org/ar/healthy-lifestyle/adult-health/in-depth/napping/art-20048319', title: 'Mayo Clinic: القيلولة', description: 'مرجع عربي طبي عن فوائد القيلولة وحدودها.', ctaLabel: 'راجع المصدر' },
  ],
  'sleep-debt': [
    { href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/how-much-sleep', title: 'NHLBI: كم النوم الكافي؟', description: 'مرجع يشرح احتياج النوم ودين النوم عند النقص المتكرر.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits', title: 'NHLBI: عادات النوم', description: 'إرشادات لتقليل العجز عبر عادات قابلة للتكرار.', ctaLabel: 'راجع المصدر' },
  ],
  'sleep-needs-by-age': [
    { href: 'https://www.cdc.gov/sleep/about/index.html', title: 'CDC: احتياج النوم حسب العمر', description: 'مرجع رسمي عن ساعات النوم وجودته حسب العمر.', ctaLabel: 'راجع المصدر' },
    { href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/how-much-sleep', title: 'NHLBI: عدد ساعات النوم', description: 'مرجع يوضح نطاقات النوم حسب العمر ودين النوم.', ctaLabel: 'راجع المصدر' },
  ],
};

export function generateStaticParams() {
  const safeTools = Array.isArray(SLEEP_TOOLS) ? SLEEP_TOOLS : [];
  return safeTools.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getSleepToolBySlug(toolSlug);
  if (!tool) return {};

  return buildCanonicalMetadata({
    title: tool.heroTitle,
    description: tool.description,
    keywords: Array.isArray(tool.keywords) ? tool.keywords : [],
    url: `${SITE_URL}${tool.href}`,
  });
}

export default async function SleepToolPage({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getSleepToolBySlug(toolSlug);
  const CalculatorComponent = CALCULATOR_COMPONENTS[toolSlug];
  if (!tool || !CalculatorComponent) notFound();
  const toolKeywords = Array.isArray(tool.keywords) ? tool.keywords : [];
  const faqItems = Array.isArray(tool.faqItems) ? tool.faqItems : [];
  const guideSlugs = Array.isArray(tool.guideSlugs) ? tool.guideSlugs : [];
  const infoItems = Array.isArray(tool.infoItems) ? tool.infoItems : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبات النوم الذكي', item: `${SITE_URL}/calculators/sleep` },
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

  const relatedTools = getRelatedSleepTools(tool.slug);
  const relatedGuides = guideSlugs.map((slug) => getSleepGuideBySlug(slug)).filter(Boolean);
  const methodSteps = Array.isArray(TOOL_METHOD_STEPS[tool.slug]) ? TOOL_METHOD_STEPS[tool.slug] : [];
  const decisionTable = TOOL_DECISION_TABLES[tool.slug];
  const sourceLinks = Array.isArray(TOOL_SOURCE_LINKS[tool.slug]) ? TOOL_SOURCE_LINKS[tool.slug] : [];
  const relatedSleepToolSlugs = Array.isArray(tool.relatedToolSlugs) ? tool.relatedToolSlugs : [];
  const modeCards = SLEEP_MODES.filter((mode) => (
    mode.href !== tool.href
    && relatedSleepToolSlugs.some((slug) => mode.href.endsWith(slug))
  )).slice(0, 3);
  const modeLinks = modeCards.map((mode) => ({
    href: mode.href,
    title: mode.title,
    description: mode.description,
    ctaLabel: 'افتح النمط',
  }));
  const nextPathLinkCandidates = [
    ...modeLinks.slice(0, 2),
    ...relatedTools.slice(0, 2).map((item) => ({
      href: item.href,
      title: item.title,
      description: item.description,
      ctaLabel: 'افتح الحاسبة',
    })),
    ...relatedGuides.slice(0, 1).map((guide) => ({
      href: guide.href,
      title: guide.title,
      description: guide.description,
      ctaLabel: 'اقرأ التفسير',
    })),
  ];
  const nextPathLinks = nextPathLinkCandidates.filter((item, index, items) => (
    item?.href && items.findIndex((candidate) => candidate?.href === item.href) === index
  ));
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
          'احصل على النتيجة أولاً، ثم اقرأ لماذا تبدو مناسبة أو غير مناسبة ليومك.',
          'استخدم أكثر من خيار بدل تعليق قرارك على ساعة واحدة تبدو دقيقة أكثر مما ينبغي.',
          'تعامل مع الناتج كتقدير عملي للنوم، لا كتشخيص طبي فردي.',
        ]}
      >
        <CalculatorComponent />
      </CalculatorHero>

      {methodSteps.length ? (
        <CalculatorSection
          id="sleep-method"
          eyebrow="طريقة الاستخدام"
          title="استخدم الأداة بهذه الخطوات قبل تفسير النتيجة"
          description="هذه الخطوات تقلل أخطاء النوم الشائعة: وقت غفو غير محسوب، قيلولة متأخرة، أو قراءة ليلة واحدة كأنها نمط دائم."
        >
          <CalculatorInfoGrid
            items={methodSteps.map((item) => ({
              title: item.name,
              content: item.text,
            }))}
          />
        </CalculatorSection>
      ) : null}

      {decisionTable ? (
        <CalculatorSection
          id="sleep-decision"
          eyebrow="قاعدة القرار"
          title={decisionTable.title}
          description={decisionTable.description}
        >
          <CalculatorDecisionTable columns={decisionTable.columns} rows={decisionTable.rows} />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="sleep-content"
        eyebrow="شرح عملي"
        title="كيف تحوّل الوقت أو الرقم إلى خطوة مفيدة؟"
        description="اقرأ هذه الملاحظات بعد الحساب حتى لا تختار أول وقت ظاهر فقط، بل تختار ما يناسب يومك ونمط نومك."
        subtle
      >
        <CalculatorInfoGrid items={infoItems} />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-next"
        eyebrow="المسار المكمل"
        title="اختر خطوة واحدة تناسب مشكلة نومك"
        description="انتقل إلى أداة أو مقال يكمل نفس المشكلة: وقت نوم، استيقاظ، صافي ساعات، قيلولة، أو دين نوم."
      >
        <CalculatorResourceLinks items={nextPathLinks} buttonLabel="افتح المسار" />
      </CalculatorSection>

      {sourceLinks.length ? (
        <CalculatorSection
          id="sleep-sources"
          eyebrow="مصادر صحية"
          title="مصادر تساعدك على فهم النتيجة"
          description="هذه المراجع مفيدة عندما تريد التحقق من دورات النوم أو مدة النوم أو القيلولة قبل تثبيت روتين جديد."
        >
          <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="sleep-faq"
        eyebrow="قبل تثبيت الروتين"
        title="أسئلة قبل تثبيت روتين النوم"
        description="أسئلة قصيرة تساعدك على فهم الأداة قبل استخدامها أو العودة إليها لاحقاً."
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="sleep-related" subtle>
        <RelatedCalculators currentSlug={toolSlug} />
      </CalculatorSection>
    </main>
  );
}
