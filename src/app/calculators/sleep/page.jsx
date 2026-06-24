import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorResourceLinks,
  CalculatorSection,
  CalculatorToolLauncher,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import {
  SLEEP_GUIDES,
  SLEEP_HUB,
  SLEEP_TOOLS,
} from '@/lib/sleep/content';

const SITE_URL = getSiteUrl();

const hubFaqItems = [
  {
    question: 'ما هي حاسبات النوم الذكي؟',
    answer: 'هي مجموعة أدوات عربية تساعدك على تحويل سؤال النوم اليومي إلى قرار عملي: متى تنام إذا كان وقت الاستيقاظ ثابتاً، متى تستيقظ إذا نمت الان، كم نمت فعلياً، هل القيلولة مناسبة، وهل تراكم عليك دين نوم خلال الأسبوع. الهدف ليس تشخيص اضطرابات النوم، بل مساعدتك على التخطيط وفهم النمط قبل تغيير روتينك.',
  },
  {
    question: 'هل هذا القسم مجرد حاسبة وقت نوم عادية؟',
    answer: 'لا. الصفحة تساعدك على اختيار أداة النوم حسب السؤال: متى أنام، متى أستيقظ، هل أنام كفاية، أو هل لدي عجز نوم متراكم. هذا مهم لأن مشكلة الدوام المبكر ليست مثل مشكلة القيلولة أو التعب المتكرر. ابدأ من السؤال الأقرب ليومك، ثم انتقل للأداة التالية فقط إذا كشفت النتيجة سؤالاً جديداً.',
  },
  {
    question: 'هل تعتمد هذه الأدوات على حقيقة طبية صارمة لكل شخص؟',
    answer: 'لا. الأدوات صادقة وتستخدم تقديرات عملية مثل دورات النوم ووقت الغفو لمساعدتك على التخطيط، لا لتقديم قياس طبي فردي دقيق. فائدتها أنها تمنع التخمين الكامل وتجعلك ترى الخيارات بوضوح. إذا كان التعب شديداً أو مستمراً، استخدم النتيجة كإشارة للمراجعة لا كتشخيص نهائي.',
  },
  {
    question: 'من أين أبدأ إذا كنت فقط أريد أن أعرف متى أنام؟',
    answer: 'ابدأ من أداة "متى أنام لأستيقظ في الوقت المناسب؟" إذا كان وقت الاستيقاظ معروفاً، مثل دوام أو مدرسة أو صلاة فجر أو سفر. وإذا كانت حاجتك فورية الان فابدأ من "إذا نمت الان، متى أستيقظ؟". الفرق بسيط: الأولى تخطط لليلة، والثانية تساعدك عندما تريد ضبط المنبه الان.',
  },
  {
    question: 'هل أستخدم النتائج إذا كان لدي أرق أو شخير شديد أو نعاس نهاري؟',
    answer: 'استخدمها كإشارة تنظيمية فقط، لا كبديل عن تقييم صحي. إذا كان لديك أرق متكرر، شخير قوي، توقف نفس، نعاس نهاري يؤثر في القيادة أو العمل، أو تعب لا يتحسن رغم النوم، فالأفضل مراجعة مختص. الحاسبات تساعدك على رؤية الوقت والمدة والعجز، لكنها لا تعرف تاريخك الصحي أو جودة نومك بدقة مختبرية.',
  },
  {
    question: 'هل تصلح هذه الأدوات في رمضان أو المناوبات أو الدراسة؟',
    answer: 'نعم كأدوات تخطيط، لكن اقرأ النتيجة بمرونة. في رمضان أو المناوبات أو الامتحانات قد يتغير توقيت النوم والوجبات والضوء والقيلولة، لذلك لا تعتمد على ليلة واحدة فقط. استخدم وقت النوم أو الاستيقاظ للقرار الفوري، ثم راجع مدة النوم ودين النوم بعد عدة أيام حتى ترى هل التغيير يتراكم عليك.',
  },
];

const sleepToolPathways = [
  {
    href: '/calculators/sleep/bedtime',
    label: 'خطط لليلة القادمة',
    title: 'اعرف متى تنام إذا كان وقت الاستيقاظ ثابتاً',
    description: 'ابدأ هنا عندما تعرف موعد الاستيقاظ وتريد أوقات نوم واقعية تراعي وقت الغفو ودورات النوم.',
    ctaLabel: 'احسب وقت النوم',
    iconLabel: 'نوم',
  },
  {
    href: '/calculators/sleep/wake-time',
    label: 'قرار فوري',
    title: 'إذا ستنام الان، اختر وقت استيقاظ مناسباً',
    description: 'مفيدة عندما يكون القرار الان: متى أستيقظ بعد نومي الحالي من غير تجربة عشوائية؟',
    ctaLabel: 'احسب وقت الاستيقاظ',
    iconLabel: 'منبه',
  },
  {
    href: '/calculators/sleep/sleep-duration',
    label: 'افهم التعب',
    title: 'احسب صافي نومك الفعلي',
    description: 'استخدمها عندما تكون الساعات على الورق جيدة لكن التعب مستمر بسبب الغفو أو الاستيقاظات الليلية.',
    ctaLabel: 'احسب مدة النوم',
    iconLabel: 'مدة',
  },
  {
    href: '/calculators/sleep/nap-calculator',
    label: 'قيلولة بلا ارتباك',
    title: 'اختر قيلولة قصيرة أو دورة كاملة',
    description: 'تساعدك على معرفة وقت الاستيقاظ من القيلولة وهل توقيتها قريب جداً من نوم الليل.',
    ctaLabel: 'احسب القيلولة',
    iconLabel: 'قيلولة',
  },
  {
    href: '/calculators/sleep/sleep-debt',
    label: 'راجع الأسبوع',
    title: 'اعرف هل تراكم عليك دين نوم',
    description: 'افتحها إذا كانت المشكلة تتكرر عدة أيام وتريد رؤية العجز الأسبوعي بدل التركيز على ليلة واحدة.',
    ctaLabel: 'احسب دين النوم',
    iconLabel: 'أسبوع',
  },
  {
    href: '/calculators/sleep/sleep-needs-by-age',
    label: 'قارن بالعمر',
    title: 'اعرف نطاق النوم المناسب لعمرك',
    description: 'مفيدة عندما تريد مرجعاً سريعاً قبل الحكم على مدة النوم بأنها قليلة أو كافية.',
    ctaLabel: 'اعرف احتياجك',
    iconLabel: 'عمر',
  },
];

const sleepGuideLinks = SLEEP_GUIDES.slice(0, 3).map((guide) => ({
  href: guide.href,
  title: guide.title,
  description: guide.description,
  ctaLabel: 'اقرأ التفسير',
}));
const sleepSourceLinks = [
  {
    href: 'https://www.cdc.gov/sleep/about/index.html',
    title: 'CDC: أساسيات النوم',
    description: 'مرجع رسمي يشرح أهمية النوم، الاحتياج حسب العمر، وجودة النوم.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep',
    title: 'NHLBI: مراحل النوم',
    description: 'شرح طبي لمراحل النوم ودورات NREM وREM ولماذا لا تكون الليلة كلها مرحلة واحدة.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits',
    title: 'NHLBI: عادات النوم الصحية',
    description: 'إرشادات عملية عن انتظام الجدول، الضوء، الكافيين، والقيلولة.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://www.mayoclinic.org/ar/healthy-lifestyle/adult-health/in-depth/napping/art-20048319',
    title: 'Mayo Clinic: القيلولة',
    description: 'مرجع عربي طبي يوضح فوائد القيلولة وحدودها وكيف تقلل أثرها على نوم الليل.',
    ctaLabel: 'راجع المصدر',
  },
];
const sleepDecisionRows = [
  {
    key: 'bedtime',
    cells: [
      'لدي وقت استيقاظ ثابت',
      'حاسبة وقت النوم',
      'اختر وقت نوم يسمح بدورات كافية ووقت غفو واقعي، لا الساعة الأقرب فقط.',
    ],
  },
  {
    key: 'wake',
    cells: [
      'سأنام الان',
      'حاسبة وقت الاستيقاظ',
      'استخدمها لقرار فوري، ثم اختر نتيجة تناسب التزاماتك لا أطول نوم ممكن فقط.',
    ],
  },
  {
    key: 'duration',
    cells: [
      'أتعب رغم أنني أنام',
      'مدة النوم أو دين النوم',
      'انتقل من سؤال الساعة إلى سؤال النمط عندما تتكرر المشكلة أكثر من ليلة.',
    ],
  },
  {
    key: 'nap',
    cells: [
      'أريد قيلولة',
      'حاسبة القيلولة',
      'اختر قيلولة قصيرة أو دورة كاملة، وانتبه لقربها من نوم الليل.',
    ],
  },
];

export const metadata = buildCanonicalMetadata({
  title: SLEEP_HUB.heroTitle,
  description: 'حاسبات النوم الذكي بالعربية: اعرف متى تنام وتستيقظ، احسب مدة النوم والقيلولة ودين النوم واحتياجك حسب العمر مع شرح ومصادر موثوقة.',
  keywords: [
    ...(Array.isArray(SLEEP_HUB.keywords) ? SLEEP_HUB.keywords : []),
    ...(Array.isArray(SLEEP_TOOLS) ? SLEEP_TOOLS : []).flatMap((tool) => (
      Array.isArray(tool.keywords) ? tool.keywords.slice(0, 4) : []
    )),
    'حاسبة دورات النوم',
    'حاسبة وقت النوم في رمضان',
    'حاسبة النوم للدوام الصباحي',
    'حاسبة نوم الطلاب',
    'تنظيم النوم بالعربي',
  ],
  url: `${SITE_URL}${SLEEP_HUB.href}`,
});

export default function SleepHubPage() {
  const safeTools = Array.isArray(SLEEP_TOOLS) ? SLEEP_TOOLS : [];
  const safeHighlights = Array.isArray(SLEEP_HUB.highlights) ? SLEEP_HUB.highlights : [];
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات النوم الذكي',
    url: `${SITE_URL}${SLEEP_HUB.href}`,
    inLanguage: 'ar',
    description: SLEEP_HUB.description,
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
        badge="النوم الذكي"
        title="حاسبات النوم الذكي"
        description="حاسبات النوم الذكي تساعدك على اختيار أداة النوم حسب مشكلتك الان: متى تنام الليلة، متى تستيقظ إذا نمت الان، كم نمت فعلياً، هل القيلولة مناسبة، هل تراكم عليك دين نوم، أو كم ساعة تحتاج حسب العمر. ابدأ بالسؤال الأقرب ليومك، ثم اقرأ حدود النتيجة قبل تغيير روتينك."
        highlights={safeHighlights}
      >
        <div className="calc-app">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">ابدأ من هنا</div>
            <div className="calc-metric-card__value">وقت النوم، الاستيقاظ، القيلولة، أو عجز النوم</div>
            <div className="calc-metric-card__note">ابدأ بالسؤال الذي يصف هذه الليلة أو هذا الأسبوع، سواء كان بسبب دوام مبكر أو دراسة أو رمضان أو قيلولة متأخرة، ثم استخدم المقالات فقط إذا احتجت تفسيراً إضافياً.</div>
          </div>
        </div>
      </CalculatorHero>

      <CalculatorSection
        id="sleep-tools"
        eyebrow="اختر الأداة"
        title="ابدأ من موقف النوم الأقرب لك"
        description="لا تفتح كل الحاسبات. اختر المسار الذي يصف هذه الليلة أو هذا الأسبوع، ثم انتقل فقط إذا كشفت النتيجة سؤالاً جديداً."
      >
        <CalculatorToolLauncher
          items={sleepToolPathways}
          ariaLabel="اختيار حاسبة النوم المناسبة"
          badge="6 مسارات نوم"
          featuredLabel="الأكثر فائدة قبل النوم"
          theme="blue"
          note="الترتيب مقصود: وقت النوم أولاً لأنه يحل قرار الليلة، ثم وقت الاستيقاظ والقيلولة والمدة، وأخيراً دين النوم واحتياج العمر عندما يصبح السؤال أوسع."
        />
      </CalculatorSection>

      <CalculatorSection
        showAdBefore
        id="sleep-decision-table"
        eyebrow="اختيار الأداة"
        title="كل مشكلة نوم لها بداية مختلفة"
        description="هذه المقارنة تمنع خلط سؤال الليلة الواحدة بسؤال التعب المتكرر أو القيلولة أو الاحتياج حسب العمر."
        subtle
      >
        <CalculatorDecisionTable
          columns={['حالتك الآن', 'الأداة الأقرب', 'ما الذي تنتبه له؟']}
          rows={sleepDecisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-secondary-tools"
        eyebrow="عندما تتسع الصورة"
        title="أدوات إضافية إذا لم تكن المشكلة في موعد النوم فقط"
        description="افتح هذه الأدوات عندما تريد مراجعة العجز الأسبوعي أو مقارنة مدة النوم مع العمر. ضعها بعد أداة التوقيت حتى لا تختلط المشكلة الفورية بالنمط الطويل."
      >
        <CalculatorResourceLinks items={sleepToolPathways.slice(4)} buttonLabel="ابدأ الحساب" />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-guides"
        eyebrow="قراءة مختصرة"
        title="ثلاث مقالات تكفي كبداية"
        description="هذه القراءات تظهر لمن يريد فهم دورات النوم أو القيلولة أو دين النوم قبل استخدام الحاسبة."
      >
        <CalculatorResourceLinks items={sleepGuideLinks} buttonLabel="اقرأ التفسير" />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-sources"
        eyebrow="مصادر صحية"
        title="مراجع تساعدك على فهم النوم قبل قرار كبير"
        description="استخدم هذه الروابط عندما تريد التحقق من دورات النوم، عدد الساعات، القيلولة، أو العادات قبل اعتماد روتين جديد."
      >
        <CalculatorResourceLinks items={sleepSourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-faq"
        eyebrow="قبل تثبيت الروتين"
        title="أسئلة قصيرة قبل البدء"
        description="إجابات سريعة تساعدك على اختيار أداة النوم المناسبة من أول مرة."
      >
        <CalculatorFaqSection items={hubFaqItems} />
      </CalculatorSection>

    </main>
  );
}
