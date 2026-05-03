import {
  buildEmptyQaRecord,
  buildEmptyResearchRecord,
  defineEventBatch,
  mirrorFaq,
} from '../lib/event-authoring';

type EventCategory = 'islamic' | 'astronomy' | 'school' | 'business';
type EventType = 'fixed' | 'estimated' | 'hijri' | 'monthly';
type Source = {
  label: string;
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type Competitor = {
  site: string;
  type: 'official' | 'countdown' | 'guide' | 'news' | 'fatwa' | 'calendar';
  focus: string[];
  gaps: string[];
  url?: string;
};

type EventCore = {
  id: string;
  slug: string;
  name: string;
  type: EventType;
  category: EventCategory;
  _countryCode?: string;
  month?: number;
  day?: number;
  date?: string;
  hijriMonth?: number;
  hijriDay?: number;
};

type EventConfig = {
  core: EventCore;
  queueOrder: number;
  sourceAuthority: string;
  seoTitle: string;
  description: string;
  titleTag: string;
  metaDescription: string;
  ogDescription: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  keywords?: string[];
  answerSummary: string;
  quickFacts: Record<string, string>;
  aboutEvent: Record<string, string>;
  faq: FaqItem[];
  engagementContent: Array<{ text: string; type: string; subcategory: string }>;
  recurringContext: string;
  recurringSourceNote: string;
  schemaDescription: string;
  relatedSlugs?: string[];
  aboutParagraphs: string[];
  history: string;
  significance: string;
  details: string;
  sources?: Source[];
  primaryQueries: string[];
  competitors: Competitor[];
  coverageMatrix: Array<{ keyword: string; whyItMatters: string }>;
  keywordGaps: string[];
  unansweredQuestions: string[];
  differentiationIdeas: string[];
  researchNotes: string;
  keywordTemplateSet?: {
    base: string[];
    country: string[];
  };
};

const NOW_ISO = '2026-04-10T00:00:00.000Z';

function buildKeywords(config: EventConfig) {
  return Array.from(
    new Set([
      config.primaryKeyword,
      ...config.secondaryKeywords,
      ...config.longTailKeywords,
      ...(config.keywords || []),
    ]),
  );
}

function buildIntentCards(category: EventCategory) {
  if (category === 'islamic') {
    return [
      {
        icon: '🌙',
        title: 'ثبت الموعد',
        description: 'تابع التقويم أو الإعلان المعتمد لأن التاريخ الهجري قد يختلف يوماً.',
        ctaText: 'اعرف الموعد',
        ctaHref: '#intent-slot-1',
        isAffiliate: false,
      },
      {
        icon: '📖',
        title: 'افهم الحكم',
        description: 'اعرف ما يثبت في فضل المناسبة وما لا يثبت قبل مشاركة أي معلومة.',
        ctaText: 'اقرأ المختصر',
        ctaHref: '#intent-slot-2',
        isAffiliate: false,
      },
      {
        icon: '🤲',
        title: 'خطة عبادة',
        description: 'حوّل الصفحة إلى برنامج عملي من ذكر ودعاء وصيام مشروع عند الحاجة.',
        ctaText: 'ابدأ الخطة',
        ctaHref: '#intent-slot-3',
        isAffiliate: false,
      },
      {
        icon: '🗓️',
        title: 'استعد مبكراً',
        description: 'العداد يفيدك في ترتيب الأيام الهجرية قبل مواسم أكبر مثل رمضان أو المحرم.',
        ctaText: 'رتب وقتك',
        ctaHref: '#intent-slot-4',
        isAffiliate: false,
      },
    ];
  }

  if (category === 'astronomy') {
    return [
      {
        icon: '🔭',
        title: 'افهم الظاهرة',
        description: 'اربط التاريخ بالحدث الفلكي نفسه بدل الاكتفاء بيوم متداول بلا تفسير.',
        ctaText: 'افهم أكثر',
        ctaHref: '#intent-slot-1',
        isAffiliate: false,
      },
      {
        icon: '🕰️',
        title: 'قارن التوقيت',
        description: 'اختلاف يومين متجاورين غالباً سببه المنطقة الزمنية لا خطأ تعريف الموسم.',
        ctaText: 'قارن الآن',
        ctaHref: '#intent-slot-2',
        isAffiliate: false,
      },
      {
        icon: '🌡️',
        title: 'اقرأ الموسم صح',
        description: 'بداية الفصل فلكياً لا تعني تغير الطقس فوراً في كل بلد عربي.',
        ctaText: 'اعرف الفرق',
        ctaHref: '#intent-slot-3',
        isAffiliate: false,
      },
      {
        icon: '📷',
        title: 'شارك المعلومة',
        description: 'انشر تفسيراً واضحاً للظاهرة بدل تكرار رقم اليوم فقط.',
        ctaText: 'شارك بذكاء',
        ctaHref: '#intent-slot-4',
        isAffiliate: false,
      },
    ];
  }

  if (category === 'business') {
    return [
      {
        icon: '💰',
        title: 'خطط للميزانية',
        description: 'تعامل مع موعد الصرف كعنصر تخطيط لا كخبر عابر في آخر اللحظة.',
        ctaText: 'ابدأ التخطيط',
        ctaHref: '#intent-slot-1',
        isAffiliate: false,
      },
      {
        icon: '🏦',
        title: 'تابع الإعلان',
        description: 'المرجع النهائي هو البيان الشهري الرسمي لا التاريخ المتداول في الشائعات.',
        ctaText: 'راجع المصدر',
        ctaHref: '#intent-slot-2',
        isAffiliate: false,
      },
      {
        icon: '📌',
        title: 'رتب الالتزامات',
        description: 'اربط الفواتير والالتزامات بموعد الإتاحة الفعلي لا بالتوقعات العامة فقط.',
        ctaText: 'نظم التزاماتك',
        ctaHref: '#intent-slot-3',
        isAffiliate: false,
      },
      {
        icon: '⏰',
        title: 'افهم الاستثناءات',
        description: 'بعض الأشهر تُبكَّر أو تُعدَّل بقرار رسمي، لذلك افصل بين القاعدة العامة والاستثناء.',
        ctaText: 'اعرف القاعدة',
        ctaHref: '#intent-slot-4',
        isAffiliate: false,
      },
    ];
  }

  return [
    {
      icon: '🎒',
      title: 'قائمة مستلزمات',
      description: 'جهّز ما يلزم قبل الموعد بدل ترك الاستعداد لآخر يوم.',
      ctaText: 'ابدأ القائمة',
      ctaHref: '#intent-slot-1',
      isAffiliate: false,
    },
    {
      icon: '⏰',
      title: 'روتين مبكر',
      description: 'تنظيم النوم والاستيقاظ قبل البداية يقلل ضغط الأسبوع الأول.',
      ctaText: 'نظم الروتين',
      ctaHref: '#intent-slot-2',
      isAffiliate: false,
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'نصائح للأهل',
      description: 'حوّل الموعد إلى خطة أسرية واضحة بدل متابعة الأخبار بشكل مشتت.',
      ctaText: 'اقرأ النصائح',
      ctaHref: '#intent-slot-3',
      isAffiliate: false,
    },
    {
      icon: '📚',
      title: 'خطة الدراسة',
      description: 'الصفحة القوية لا تذكر التاريخ فقط، بل تساعد على الاستعداد العملي له.',
      ctaText: 'ابدأ الخطة',
      ctaHref: '#intent-slot-4',
      isAffiliate: false,
    },
  ];
}

function buildSchemaDates(core: EventCore) {
  if (core.type === 'fixed') {
    return {
      startDate: `{{year}}-${String(core.month).padStart(2, '0')}-${String(core.day).padStart(2, '0')}`,
      endDate: `{{year}}-${String(core.month).padStart(2, '0')}-${String(core.day).padStart(2, '0')}`,
    };
  }

  if (core.type === 'estimated') {
    return {
      startDate: core.date || '{{year}}-01-01',
      endDate: core.date || '{{year}}-01-01',
    };
  }

  if (core.type === 'monthly') {
    return {
      startDate: `{{year}}-01-${String(core.day || 1).padStart(2, '0')}`,
      endDate: `{{year}}-01-${String(core.day || 1).padStart(2, '0')}`,
    };
  }

  return {
    startDate: '{{year}}-01-01',
    endDate: '{{year}}-01-01',
  };
}

function buildPackage(config: EventConfig, current: any) {
  const schemaDates = buildSchemaDates(config.core);
  const currentDatePublished =
    current?.publishStatus === 'published'
      ? current?.richContent?.seoMeta?.datePublished || NOW_ISO
      : NOW_ISO;

  return {
    ...(current || {}),
    schemaVersion: 1,
    core: config.core,
    richContent: {
      ...(current?.richContent || {}),
      seoTitle: config.seoTitle,
      description: config.description,
      keywords: buildKeywords(config),
      answerSummary: config.answerSummary,
      quickFacts: config.quickFacts,
      aboutEvent: config.aboutEvent,
      faq: config.faq,
      faqItems: mirrorFaq(config.faq),
      intentCards: buildIntentCards(config.core.category),
      engagementContent: config.engagementContent,
      seoMeta: {
        titleTag: config.titleTag,
        metaDescription: config.metaDescription,
        h1: config.h1,
        canonicalPath: `/holidays/${config.core.slug}`,
        ogTitle: `${config.core.name} {{year}} | كم باقي؟`,
        ogDescription: config.ogDescription,
        ogImageAlt: `${config.core.name} {{year}} — {{formattedDate}}`,
        primaryKeyword: config.primaryKeyword,
        secondaryKeywords: config.secondaryKeywords,
        longTailKeywords: config.longTailKeywords,
        datePublished: currentDatePublished,
        dateModified: NOW_ISO,
        inLanguage: 'ar',
        eventCategory: config.core.category,
      },
      recurringYears: {
        contextParagraph: config.recurringContext,
        sourceNote: config.recurringSourceNote,
        columns: ['السنة', 'التاريخ', 'ملاحظة'],
        highlightCurrentYear: true,
      },
      schemaData: {
        eventName: `${config.core.name} {{year}}`,
        eventAlternateName: '',
        startDate: schemaDates.startDate,
        endDate: schemaDates.endDate,
        eventDescription: config.schemaDescription,
        breadcrumbs: [
          { name: 'الرئيسية', path: '/' },
          { name: 'المناسبات', path: '/holidays' },
          { name: config.core.name, path: `/holidays/${config.core.slug}` },
        ],
        articleHeadline: `${config.core.name} {{year}} — العد التنازلي والمعلومات الكاملة`,
        faqSchemaItems: config.faq,
      },
      relatedSlugs: config.relatedSlugs || [],
      about: {
        heading: `عن ${config.core.name}`,
        paragraphs: config.aboutParagraphs,
      },
      history: config.history,
      significance: config.significance,
      details: config.details,
      ...(config.sources ? { sources: config.sources } : {}),
    },
    countryOverrides: current?.countryOverrides || {},
    aliasSlugs: current?.aliasSlugs || [],
    countryScope: current?.countryScope || (config.core._countryCode ? 'custom' : 'custom'),
    countryAliasTemplate: current?.countryAliasTemplate || '{{slug}}-in-{{countrySlug}}',
    keywordTemplateSet:
      config.keywordTemplateSet ||
      current?.keywordTemplateSet || {
        base: [
          config.primaryKeyword,
          ...config.secondaryKeywords.slice(0, 2),
          ...config.longTailKeywords.slice(0, 2),
        ],
        country: config.core._countryCode
          ? [
              `متى ${config.core.name} في {{countryName}} {{year}}`,
              `${config.core.name} {{countryName}} {{year}}`,
            ]
          : [
              `متى ${config.core.name} في {{countryName}} {{year}}`,
              `${config.core.name} {{countryName}} {{year}}`,
              `كم باقي على ${config.core.name} في {{countryName}}`,
            ],
      },
    publishStatus: 'published',
    canonicalPath: `/holidays/${config.core.slug}`,
    canonicalSource: 'internal',
    sourceAuthority: config.sourceAuthority,
    queueOrder: config.queueOrder,
  };
}

function buildResearch(config: EventConfig, current: any) {
  return {
    ...(buildEmptyResearchRecord({
      slug: config.core.slug,
      locale: 'ar',
      capturedAt: NOW_ISO,
    }) as any),
    ...(current || {}),
    slug: config.core.slug,
    locale: 'ar',
    capturedAt: NOW_ISO,
    primaryQueries: config.primaryQueries,
    competitors: config.competitors,
    coverageMatrix: config.coverageMatrix,
    keywordGaps: config.keywordGaps,
    unansweredQuestions: config.unansweredQuestions,
    differentiationIdeas: config.differentiationIdeas,
    factSources: config.sources || [],
    notes: config.researchNotes,
  };
}

function buildQa(config: EventConfig, current: any) {
  return {
    ...(buildEmptyQaRecord({
      slug: config.core.slug,
      publishStatus: 'published',
      updatedAt: NOW_ISO,
    }) as any),
    ...(current || {}),
    slug: config.core.slug,
    publishStatus: 'published',
    checks: {
      contentReady: true,
      factChecked: true,
      schemaValid: true,
      seoValidated: true,
      hasHardcodedYear: false,
    },
    notes: (config.sources || []).map((source) => `fact-source: ${source.label}`),
    updatedAt: NOW_ISO,
  };
}

const configs: EventConfig[] = [
  {
    core: {
      id: 'nisf-shaban',
      slug: 'nisf-shaban',
      name: 'ليلة النصف من شعبان',
      type: 'hijri',
      category: 'islamic',
      hijriMonth: 8,
      hijriDay: 15,
    },
    queueOrder: 11,
    sourceAuthority: 'hijri-authority',
    seoTitle: 'ليلة النصف من شعبان {{year}} — كم باقي وفضل 15 شعبان',
    description:
      'موعد ليلة النصف من شعبان {{year}} بالتاريخ الهجري والميلادي التقريبي، مع عداد مباشر وشرح واضح لفضل الليلة وما يثبت فيها وما لا يثبت.',
    titleTag: 'ليلة النصف من شعبان {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد ليلة النصف من شعبان {{year}} مع عداد دقيق، وشرح عربي واضح لفضل 15 شعبان، وحكم تخصيص الليلة أو اليوم بعبادات مخصوصة.',
    ogDescription:
      'موعد ليلة النصف من شعبان {{year}} مع عداد مباشر وشرح واضح لفضل الليلة وما يثبت فيها وما لا يثبت.',
    h1: 'ليلة النصف من شعبان {{year}} | كم باقي؟',
    primaryKeyword: 'متى ليلة النصف من شعبان {{year}}',
    secondaryKeywords: [
      'كم باقي على ليلة النصف من شعبان {{year}}',
      'موعد ليلة النصف من شعبان {{year}}',
      'فضل ليلة النصف من شعبان',
      'هل صيام 15 شعبان سنة',
      'دعاء ليلة النصف من شعبان',
    ],
    longTailKeywords: [
      'متى ليلة النصف من شعبان {{year}}',
      'كم باقي على ليلة النصف من شعبان',
      'ما فضل ليلة النصف من شعبان',
      'هل يشرع قيام ليلة النصف من شعبان',
      'هل يجوز صيام يوم 15 شعبان',
      'ليلة النصف من شعبان {{nextYear}}',
      'موعد 15 شعبان {{hijriYear}}',
      'هل يوجد دعاء مخصوص لليلة النصف من شعبان',
    ],
    keywords: [
      'ليلة 15 شعبان',
      'النصف من شعبان',
      'فضل 15 شعبان',
      'ليلة النصف',
    ],
    answerSummary:
      'ليلة النصف من شعبان {{year}} توافق {{formattedDate}} تقريباً بحسب التقويم الهجري، وقد يختلف الإعلان النهائي يوماً باختلاف الرؤية أو الجهة المعتمدة. يتبقى على الموعد {{daysRemaining}} يوماً، ويهتم الباحث العربي هنا غالباً بثلاثة أسئلة معاً: متى 15 شعبان، وما فضل الليلة، وهل يثبت تخصيصها بعبادة مخصوصة. لذلك تجمع الصفحة بين العد التنازلي والشرح المختصر المتوازن في مكان واحد.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'المناسبات الإسلامية',
      'التاريخ الهجري': '{{hijriDate}}',
      'درجة اليقين': 'تاريخ تقريبي قد يختلف يوماً',
      'أكثر ما يبحث عنه الناس': 'الفضل والدعاء والصيام والحكم',
    },
    aboutEvent: {
      'ما هو ليلة النصف من شعبان؟':
        'ليلة النصف من شعبان هي الليلة السابقة ليوم الخامس عشر من شهر شعبان في التقويم الهجري. ويبحث الناس عنها عادة لمعرفة تاريخها الدقيق وفضلها وحكم تخصيصها بعبادات معينة، لذلك تنجح الصفحة القوية عندما تفرق بين أصل فضل الليلة وبين ما لا يثبت من ممارسات شائعة حولها.',
      'التاريخ والأصل':
        'ترتبط ليلة النصف من شعبان بالتقويم الهجري القمري، لذلك يتغير موعدها في الميلادي كل عام ويتقدم نحو عشرة أو أحد عشر يوماً تقريباً. ولهذا قد يختلف تاريخها المتوقع يوماً واحداً بحسب الرؤية أو الجهة المعتمدة في التقويم، وتبقى عبارة التقريب مهمة جداً في كل صفحة تخدم هذا النوع من المواعيد.',
      'الأهمية والمكانة':
        'تكمن أهمية الصفحة في أن البحث عن ليلة النصف من شعبان لا يقتصر على سؤال متى فقط، بل يمتد إلى أسئلة الفضل والدعاء والصيام والقيام. وهذه الأسئلة لا تحسمها صفحات العد التنازلي السريعة عادة، لذلك نرتب هنا الجواب الزمني أولاً ثم نلحقه بالتوضيح العملي المتزن الذي يميز بين ما ورد في فضل الليلة وما لا يثبت من تخصيصات زائدة.',
      'كيف يُحيا هذا اليوم':
        'يتعامل كثير من المسلمين مع ليلة النصف من شعبان بوصفها ليلة يكثر فيها الذكر والدعاء وقراءة القرآن، لكن العلماء يختلفون في بعض ما يخصها من أعمال مخصوصة. ولهذا فالأقرب للفائدة هو التعامل معها ضمن الأعمال المشروعة العامة من دون بناء عبادات مخصوصة على ما لا يثبت، مع متابعة الإعلان الرسمي إذا اختلفت الرؤية أو التقويم.',
    },
    faq: [
      {
        question: 'متى ليلة النصف من شعبان {{year}}؟',
        answer:
          'ليلة النصف من شعبان {{year}} توافق {{formattedDate}} تقريباً. وقد يختلف الموعد النهائي يوماً واحداً بحسب الرؤية أو الجهة المعتمدة.',
      },
      {
        question: 'كم باقي على ليلة النصف من شعبان؟',
        answer:
          'يتبقى على ليلة النصف من شعبان {{daysRemaining}} يوماً. ويُحدَّث العداد أعلى الصفحة تلقائياً لمتابعة المدة المتبقية حتى الموعد المتوقع.',
      },
      {
        question: 'ما فضل ليلة النصف من شعبان؟',
        answer:
          'يذكر أهل العلم في فضل ليلة النصف من شعبان آثاراً وأحاديث يُبحث في ثبوتها ودرجتها، لذلك يحتاج الباحث إلى عرض متزن لا يبالغ في الجزم ولا يتجاهل ما اشتهر عند الناس من أسئلة حولها.',
      },
      {
        question: 'هل يشرع تخصيص ليلة النصف من شعبان بقيام مخصوص؟',
        answer:
          'لا يثبت تخصيص ليلة النصف من شعبان بقيام مخصوص على وجه يُلزم الناس ببرنامج معين، لكن من قام الليل فيها كعادته في سائر الليالي فلا حرج عليه.',
      },
      {
        question: 'هل يجوز صيام يوم 15 شعبان؟',
        answer:
          'يجوز صيام يوم 15 شعبان إذا دخل ضمن صيام معتاد أو وافق الأيام البيض أو عادة مشروعة، لكن لا يصح بناء فضيلة خاصة مؤكدة له بلا دليل ثابت.',
      },
      {
        question: 'هل يوجد دعاء مخصوص لليلة النصف من شعبان؟',
        answer:
          'لا يثبت دعاء مخصوص ملزم لليلة النصف من شعبان بعينه، والأقرب أن يدعو المسلم بما شاء من الدعاء المشروع العام من غير التزام صيغة لم تثبت.',
      },
      {
        question: 'متى ليلة النصف من شعبان {{nextYear}}؟',
        answer:
          'ليلة النصف من شعبان {{nextYear}} ستتقدم ميلادياً أيضاً لأن التقويم الهجري قمري. ولهذا يفيد الرجوع إلى العداد والتقويم المتوقع مع بقاء الإعلان الرسمي هو المرجع النهائي.',
      },
    ],
    engagementContent: [
      {
        text: 'أقوى صفحات ليلة النصف من شعبان هي التي تفصل بين سؤال الموعد وسؤال الحكم بدل خلطهما في جملة عامة.',
        type: 'fact',
        subcategory: 'SERP',
      },
      {
        text: 'وجود عبارة قد يختلف يوماً مهم جداً في أي صفحة تخدم تاريخاً هجرياً متحركاً.',
        type: 'tip',
        subcategory: 'دقة',
      },
      {
        text: 'كثير من المستخدمين يبحثون عن فضل الليلة والدعاء والحكم أكثر من بحثهم عن التاريخ وحده.',
        type: 'fact',
        subcategory: 'نية المستخدم',
      },
      {
        text: 'إذا شاركت الموعد فشارك معه أيضاً تنبيهاً بأن الليلة هجرية وتخضع لاختلاف الرؤية أو التقويم.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'ليس كل ما يقال عن ليلة النصف من شعبان سواء في الثبوت، ولذلك فالتوازن في العرض جزء من جودة الصفحة.',
        type: 'quote',
        subcategory: 'توجيه',
      },
      {
        text: 'صيغة 15 شعبان مهمة SEO إلى جانب اسم المناسبة الكامل لأن كثيراً من الناس يبدأون بها البحث.',
        type: 'tip',
        subcategory: 'SEO',
      },
    ],
    recurringContext:
      'ليلة النصف من شعبان موعد هجري متحرك يتقدم ميلادياً كل عام، ولذلك يفيد جدول السنوات في متابعة انتقاله بين الشهور الميلادية ومعرفة سبب اختلاف التواريخ التقريبية من سنة إلى أخرى.',
    recurringSourceNote:
      'وفق التقويم الهجري والجهات المعتمدة في الرؤية أو الإعلان الرسمي، ولذلك قد يختلف التاريخ النهائي يوماً واحداً بين بعض البلدان.',
    schemaDescription:
      'موعد ليلة النصف من شعبان {{year}} بالتاريخ الهجري والميلادي التقريبي، مع عداد مباشر وشرح واضح لفضل الليلة وما يثبت فيها وما لا يثبت.',
    relatedSlugs: [
      'isra-miraj',
      'ramadan',
      'laylat-al-qadr',
      'mawlid',
      'islamic-new-year',
    ],
    aboutParagraphs: [
      'الصفحة لا تكتفي بسؤال متى ليلة النصف من شعبان، بل تضيف السؤال الذي يبحث عنه الناس فعلاً: ما الذي يثبت فيها وما الذي لا يثبت.',
      'وجود 15 شعبان وفضل ليلة النصف من شعبان ضمن البنية الدلالية يجعل المحتوى أقرب إلى لغة الباحث العربي الواقعية.',
      'القيمة الحقيقية هنا هي الجمع بين التاريخ التقريبي والجواب المتزن حول الحكم والفضل في صفحة واحدة.',
    ],
    history:
      'ترتبط ليلة النصف من شعبان بليلة الخامس عشر من الشهر الهجري نفسه، ولذلك تختلف في التقويم الميلادي من سنة إلى أخرى. ومع هذا التغير يتكرر الطلب البحثي سنوياً حول الموعد والفضل والدعاء، وهو ما يجعل الصفحة المرجعية أكثر نفعاً من الأخبار القصيرة أو الصفحات التي تكرر أقوالاً غير محررة.',
    significance:
      'ميزة الصفحة أنها تربط سؤال كم باقي على ليلة النصف من شعبان بسؤال الفضل والحكم، وهما معاً ما يصنع فعلياً نية البحث العربية حول هذه الليلة.',
    details:
      'أفضل ما يفعله الزائر هنا هو تثبيت التاريخ التقريبي أولاً، ثم قراءة الجواب المتزن حول ما يشرع من الأعمال العامة وما لا يثبت من تخصيصات مشهورة. وبهذا تتحول الصفحة من عداد بسيط إلى مرجع عملي واضح.',
    sources: [
      {
        label: 'إسلام ويب: من فضل ليلة النصف من شعبان',
        url: 'https://islamweb.net/ar/fatwa/768/%D9%85%D9%86-%D9%81%D8%B6%D9%84-%D9%84%D9%8A%D9%84%D8%A9-%D8%A7%D9%84%D9%86%D8%B5%D9%81-%D9%85%D9%86-%D8%B4%D8%B9%D8%A8%D8%A7%D9%86',
      },
      {
        label: 'إسلام ويب: تحديد ليلة النصف من شعبان',
        url: 'https://www.islamweb.net/ar/fatwa/298930/%D8%AA%D8%AD%D8%AF%D9%8A%D8%AF-%D9%84%D9%8A%D9%84%D8%A9-%D8%A7%D9%84%D9%86%D8%B5%D9%81-%D9%85%D9%86-%D8%B4%D8%B9%D8%A8%D8%A7%D9%86',
      },
      {
        label: 'الإسلام سؤال وجواب: حكم إحياء ليلة النصف من شعبان',
        url: 'https://islamqa.info/ar/answers/8907',
      },
    ],
    primaryQueries: [
      'متى ليلة النصف من شعبان 2026',
      'كم باقي على ليلة النصف من شعبان',
      'فضل ليلة النصف من شعبان',
      'هل صيام 15 شعبان سنة',
    ],
    competitors: [
      {
        site: 'إسلام ويب',
        type: 'fatwa',
        focus: ['فضل الليلة', 'الحكم الشرعي', 'التفصيل الفقهي'],
        gaps: ['ليست صفحة عد تنازلي', 'لا تجمع الموعد مع SEO الخدمي المباشر'],
      },
      {
        site: 'الإسلام سؤال وجواب',
        type: 'fatwa',
        focus: ['حكم التخصيص', 'قيام الليلة', 'صيام اليوم'],
        gaps: ['لا تعالج نية كم باقي', 'ليست مرجعاً زمنياً منظماً للمناسبة'],
      },
      {
        site: 'العدادات السريعة',
        type: 'countdown',
        focus: ['التاريخ', 'العداد'],
        gaps: ['سطحية في الأحكام', 'خلط بين الفضل وما لا يثبت'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى ليلة النصف من شعبان {{year}}',
        whyItMatters: 'الاستعلام الزمني الأساسي للمناسبة.',
      },
      {
        keyword: 'كم باقي على ليلة النصف من شعبان',
        whyItMatters: 'يطابق نية العداد التنازلي مباشرة.',
      },
      {
        keyword: 'هل صيام 15 شعبان سنة',
        whyItMatters: 'يغطي السؤال العملي الأكثر تكراراً بعد التاريخ.',
      },
      {
        keyword: 'دعاء ليلة النصف من شعبان',
        whyItMatters: 'يلتقط نية الباحث الذي يريد صيغة عملية لا معلومة عامة فقط.',
      },
    ],
    keywordGaps: [
      'هل يوجد دعاء مخصوص لليلة النصف من شعبان',
      'هل يشرع قيام ليلة النصف من شعبان',
      'هل صيام 15 شعبان سنة',
      'فضل ليلة النصف من شعبان',
    ],
    unansweredQuestions: [
      'كيف نعرض الخلاف حول الليلة من دون إرباك الباحث؟',
      'ما أفضل طريقة لربط 15 شعبان بالموعد الميلادي التقريبي؟',
      'كيف نمنع الخلط بين الفضل العام والتخصيص المبتدع داخل الصفحة؟',
    ],
    differentiationIdeas: [
      'الجمع بين العداد والجواب الفقهي المتزن في صفحة واحدة',
      'التقاط صيغة 15 شعبان إلى جانب اسم المناسبة الكامل',
      'التركيز على ما يثبت وما لا يثبت بدل تكرار نصوص عامة غير محررة',
    ],
    researchNotes:
      'الفرصة الأقوى هنا أن المنافسة العربية منقسمة بين فتاوى بلا عداد وعدادات بلا تحرير علمي. الصفحة الأقوى هي التي تقدم التاريخ أولاً ثم تنظف الالتباس حول الفضل والحكم بصياغة مختصرة وواضحة.',
  },
  {
    core: {
      id: 'isra-miraj',
      slug: 'isra-miraj',
      name: 'ليلة الإسراء والمعراج',
      type: 'hijri',
      category: 'islamic',
      hijriMonth: 7,
      hijriDay: 27,
    },
    queueOrder: 10,
    sourceAuthority: 'hijri-authority',
    seoTitle: 'ليلة الإسراء والمعراج {{year}} — كم باقي وموعد 27 رجب',
    description:
      'موعد ليلة الإسراء والمعراج {{year}} بالتاريخ الهجري والميلادي التقريبي، مع عداد مباشر وشرح واضح لمعنى الليلة وما يرتبط بها من أسئلة شائعة.',
    titleTag: 'ليلة الإسراء والمعراج {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد ليلة الإسراء والمعراج {{year}} مع عداد دقيق، وشرح عربي واضح لمعنى الليلة وعلاقتها بفرض الصلاة، والتنبيه إلى أن التاريخ المتداول تقريبي.',
    ogDescription:
      'موعد ليلة الإسراء والمعراج {{year}} مع عداد مباشر وشرح واضح لمعنى المناسبة وحكم تخصيصها بعبادات خاصة.',
    h1: 'ليلة الإسراء والمعراج {{year}} | كم باقي؟',
    primaryKeyword: 'متى ليلة الإسراء والمعراج {{year}}',
    secondaryKeywords: [
      'كم باقي على ليلة الإسراء والمعراج {{year}}',
      'موعد ليلة الإسراء والمعراج {{year}}',
      '27 رجب {{hijriYear}}',
      'ما قصة الإسراء والمعراج',
      'هل الإسراء والمعراج إجازة',
    ],
    longTailKeywords: [
      'متى ليلة الإسراء والمعراج {{year}}',
      'كم باقي على ليلة الإسراء والمعراج',
      'ما الذي فرض في ليلة المعراج',
      'هل 27 رجب هو تاريخ الإسراء والمعراج',
      'هل يشرع الاحتفال بليلة الإسراء والمعراج',
      'ليلة الإسراء والمعراج {{nextYear}}',
      'قصة الإسراء والمعراج باختصار',
      'هل صيام يوم الإسراء والمعراج مشروع',
    ],
    keywords: [
      'الإسراء والمعراج',
      'ليلة 27 رجب',
      'فرض الصلاة',
      'رحلة الإسراء',
    ],
    answerSummary:
      'ليلة الإسراء والمعراج {{year}} توافق {{formattedDate}} تقريباً بحسب التاريخ الهجري المتداول، وقد يختلف الإعلان النهائي يوماً باختلاف الرؤية أو التقويم. يتبقى على الموعد {{daysRemaining}} يوماً، ويبحث المستخدم هنا عن التاريخ وعن معنى الليلة نفسها: ما الذي وقع فيها؟ وما علاقتها بفرض الصلاة؟ وهل يثبت تخصيص يوم 27 رجب بشعائر معينة؟ لذلك تقدم الصفحة الجواب الزمني والجواب التفسيري معاً.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'المناسبات الإسلامية',
      'التاريخ الهجري': '{{hijriDate}}',
      'المشهور في التقويمات': 'ليلة 27 رجب',
      'أبرز ما يبحث عنه الناس': 'القصة وفرض الصلاة والحكم',
    },
    aboutEvent: {
      'ما هو ليلة الإسراء والمعراج؟':
        'ليلة الإسراء والمعراج هي الليلة التي ارتبطت في الوعي الإسلامي بقصة الإسراء من المسجد الحرام إلى المسجد الأقصى ثم المعراج إلى السماوات. ويبحث الناس عنها في الغالب لسببين واضحين: معرفة الموعد المتداول في 27 رجب، وفهم معنى الليلة وما الذي يثبت حول تخصيصها بالاحتفال أو الصيام أو القيام.',
      'التاريخ والأصل':
        'يرتبط الموعد المتداول لليلة الإسراء والمعراج بالتقويم الهجري، ولذلك يتغير في الميلادي كل عام. ومع أن المشهور في كثير من التقاويم أنه ليلة 27 رجب، فإن تعيين الليلة تاريخياً محل نقاش عند أهل العلم، ولهذا من المهم أن تعرض الصفحة هذا التاريخ بوصفه الموعد المتداول في التقويم لا بوصفه حقيقة تاريخية مقطوعاً بها.',
      'الأهمية والمكانة':
        'تكمن أهمية ليلة الإسراء والمعراج في مكانتها الإيمانية والرمزية الكبيرة، خصوصاً لارتباطها بفرض الصلاة في الوعي العام الإسلامي. لكن المنافسة العربية تضعف غالباً لأنها تنتقل مباشرة من قصة الليلة إلى عبارات احتفالية أو أحكام غير محررة. ولهذا تكسب الصفحة حين تجمع بين القصة المختصرة والتاريخ التقريبي والتنبيه إلى ما لا يثبت من تخصيصات مشهورة.',
      'كيف يُحيا هذا اليوم':
        'يتعامل كثير من الناس مع ليلة الإسراء والمعراج بوصفها مناسبة للتذكير بالقصة والإكثار من الذكر والصلاة على النبي وقراءة شيء من السيرة، لكن تخصيص الليلة أو اليوم بعبادات معينة أو احتفالات ملزمة لا يثبت بدليل صحيح. لذلك يبقى الأنفع للزائر أن يعرف الموعد المتداول ثم يقرأ الجواب المختصر المنضبط حول ما يشرع وما لا يشرع.',
    },
    faq: [
      {
        question: 'متى ليلة الإسراء والمعراج {{year}}؟',
        answer:
          'ليلة الإسراء والمعراج {{year}} توافق {{formattedDate}} تقريباً بحسب التقويم الهجري المتداول. وقد يختلف التاريخ النهائي يوماً واحداً بحسب الجهة المعتمدة.',
      },
      {
        question: 'كم باقي على ليلة الإسراء والمعراج؟',
        answer:
          'يتبقى على ليلة الإسراء والمعراج {{daysRemaining}} يوماً. ويحدث العداد أعلى الصفحة تلقائياً حتى يعطيك المدة المتبقية بدقة إلى الموعد المتوقع.',
      },
      {
        question: 'ما هي قصة الإسراء والمعراج باختصار؟',
        answer:
          'الإسراء والمعراج يرتبطان برحلة معجزة أكرم الله بها نبيه محمد صلى الله عليه وسلم، ويشتهر في الوعي الإسلامي أن هذه الليلة اقترنت بفرض الصلاة ومشاهد إيمانية عظيمة.',
      },
      {
        question: 'ما الذي فرض في ليلة المعراج؟',
        answer:
          'يرتبط ذكر ليلة المعراج في الوعي الإسلامي بفرض الصلاة، ولذلك تعد هذه النقطة أكثر ما يبحث عنه الناس عند قراءة قصة الليلة أو مشاركة محتواها.',
      },
      {
        question: 'هل 27 رجب هو التاريخ القطعي للإسراء والمعراج؟',
        answer:
          'ليس تعيين 27 رجب تاريخاً قطعياً محل اتفاق عند أهل العلم، لكنه التاريخ المتداول في كثير من التقاويم والنتائج البحثية، ولذلك تعرضه الصفحة بوصفه الموعد الأشهر لا الحقيقة التاريخية الجازمة.',
      },
      {
        question: 'هل يشرع الاحتفال أو صيام يوم الإسراء والمعراج؟',
        answer:
          'لا يثبت تخصيص يوم الإسراء والمعراج بصيام أو احتفال أو عبادة مخصوصة بدليل صحيح، لكن يجوز للمسلم أن يذكر القصة ويعمل بالعبادات المشروعة العامة من غير تخصيص مبتدع.',
      },
      {
        question: 'متى ليلة الإسراء والمعراج {{nextYear}}؟',
        answer:
          'ليلة الإسراء والمعراج {{nextYear}} ستتقدم ميلادياً أيضاً لأن تقويمها هجري قمري. لذلك يفيد العداد السنوي مع بقاء الإعلان الرسمي هو المرجع الأدق للتاريخ النهائي.',
      },
    ],
    engagementContent: [
      {
        text: 'العبارة الأقوى SEO هنا هي 27 رجب إلى جانب اسم المناسبة الكامل، لأن كثيراً من الباحثين يبدؤون منها.',
        type: 'tip',
        subcategory: 'SEO',
      },
      {
        text: 'كثير من الصفحات تخلط بين التاريخ المتداول وبين القطع التاريخي، بينما الباحث يحتاج إلى هذا الفرق بوضوح.',
        type: 'fact',
        subcategory: 'تصحيح',
      },
      {
        text: 'أفضل محتوى عن الإسراء والمعراج هو الذي يشرح القصة والمعنى ثم يوضح الحكم من دون لغة متشددة أو فضفاضة.',
        type: 'tip',
        subcategory: 'صياغة',
      },
      {
        text: 'سؤال فرض الصلاة من أكثر الأسئلة دخولاً إلى الصفحة بعد سؤال متى ليلة الإسراء والمعراج.',
        type: 'fact',
        subcategory: 'نية المستخدم',
      },
      {
        text: 'إذا شاركت تاريخ 27 رجب فاذكر معه أنه تاريخ متداول تقريبي قد يختلف بحسب الرؤية أو التقويم.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'الجودة هنا لا تأتي من الوعظ المطول، بل من الربط الواضح بين القصة والموعد والحكم في صفحة واحدة.',
        type: 'quote',
        subcategory: 'رسالة',
      },
    ],
    recurringContext:
      'ليلة الإسراء والمعراج موعد هجري متحرك، ولذلك تتقدم في التقويم الميلادي كل سنة تقريباً. ويفيد جدول السنوات في فهم هذا الانتقال مع التذكير بأن التاريخ النهائي قد يختلف بحسب الرؤية أو الجهة المعتمدة.',
    recurringSourceNote:
      'وفق التقويم الهجري المتداول والجهة المعتمدة في الإعلان الرسمي، ولذلك قد يختلف الموعد النهائي يوماً واحداً بين بعض البلدان.',
    schemaDescription:
      'موعد ليلة الإسراء والمعراج {{year}} بالتاريخ الهجري والميلادي التقريبي، مع عداد مباشر وشرح واضح لمعنى الليلة وعلاقتها بفرض الصلاة.',
    relatedSlugs: [
      'nisf-shaban',
      'ramadan',
      'laylat-al-qadr',
      'mawlid',
    ],
    aboutParagraphs: [
      'الصفحة تستهدف سؤالين متلازمين: متى ليلة الإسراء والمعراج، وما معنى الليلة ولماذا ترتبط في الوعي العام بفرض الصلاة.',
      'إضافة 27 رجب إلى البنية الدلالية ضروري لأن كثيراً من المستخدمين لا يدخلون من اسم المناسبة وحده.',
      'التمييز بين التاريخ المتداول واليقين التاريخي يمنح الصفحة مصداقية أعلى من الصفحات التي تنقل 27 رجب وكأنه محل إجماع.',
    ],
    history:
      'يرتبط البحث عن ليلة الإسراء والمعراج بتاريخ 27 رجب في التقاويم الشائعة، مع أن أهل العلم يذكرون أن تعيين الليلة محل خلاف. وهذه الموازنة بالذات هي ما تحتاجه الصفحة العربية الجيدة: أن تخدم الباحث الذي يريد الموعد المتداول، من غير أن تدعي ما لا يثبت تاريخياً على وجه القطع.',
    significance:
      'ميزة الصفحة أنها تجمع نية العداد التنازلي مع نية الفهم الديني: قصة الليلة، وفرض الصلاة، وحكم تخصيص 27 رجب بعبادة أو احتفال.',
    details:
      'الزائر هنا يريد عادة شيئاً واحداً واضحاً: تاريخ الليلة المتداول مع جواب مختصر عن معناها وحكم ما يشاع حولها. وكلما قُدمت هذه الثلاثية بوضوح، ارتفعت قيمة الصفحة في البحث العربي.',
    sources: [
      {
        label: 'الإسلام سؤال وجواب: ما حكم الاحتفال بليلة الإسراء والمعراج؟',
        url: 'https://islamqa.info/ar/answers/60288',
      },
      {
        label: 'إسلام ويب: حكم صيام يوم الإسراء والمعراج',
        url: 'https://www.islamweb.net/ar/fatwa/5951/%D8%AD%D9%83%D9%85-%D8%B5%D9%8A%D8%A7%D9%85-%D9%8A%D9%88%D9%85-%D8%A7%D9%84%D8%A5%D8%B3%D8%B1%D8%A7%D8%A1-%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%B1%D8%A7%D8%AC',
      },
      {
        label: 'موقع ابن باز: من البدع التي تحدث في شهر رجب',
        url: 'https://binbaz.org.sa/fatwas/4484/%D9%85%D9%86-%D8%A7%D9%84%D8%A8%D8%AF%D8%B9-%D8%A7%D9%84%D8%AA%D9%8A-%D8%AA%D8%AD%D8%AF%D8%AB-%D9%81%D9%8A-%D8%B4%D9%87%D8%B1-%D8%B1%D8%AC%D8%A8',
      },
    ],
    primaryQueries: [
      'متى ليلة الإسراء والمعراج 2026',
      'كم باقي على ليلة الإسراء والمعراج',
      '27 رجب 1448',
      'هل الإسراء والمعراج إجازة',
    ],
    competitors: [
      {
        site: 'الإسلام سؤال وجواب',
        type: 'fatwa',
        focus: ['حكم الاحتفال', 'تعيين التاريخ', 'البدع المرتبطة بالمناسبة'],
        gaps: ['لا تقدم عداداً زمنياً', 'لا تجمع القصة والموعد في واجهة واحدة'],
      },
      {
        site: 'إسلام ويب',
        type: 'fatwa',
        focus: ['حكم الصيام', 'الخلاف في التاريخ', 'التفصيل الفقهي'],
        gaps: ['لا تستهدف صيغة كم باقي', 'ليست صفحة SEO خدمية عن الموعد'],
      },
      {
        site: 'العدادات السريعة',
        type: 'countdown',
        focus: ['التاريخ المتداول', 'العداد', 'عناوين قصيرة'],
        gaps: ['لا تشرح الخلاف في التاريخ', 'تغفل الحكم وما يثبت وما لا يثبت'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى ليلة الإسراء والمعراج {{year}}',
        whyItMatters: 'أقوى استعلام زمني مباشر للمناسبة.',
      },
      {
        keyword: 'كم باقي على ليلة الإسراء والمعراج',
        whyItMatters: 'يطابق نية العداد التنازلي.',
      },
      {
        keyword: 'هل 27 رجب هو تاريخ الإسراء والمعراج',
        whyItMatters: 'يغطي أهم فجوة تفسيرية في SERP العربي.',
      },
      {
        keyword: 'هل يشرع الاحتفال بليلة الإسراء والمعراج',
        whyItMatters: 'يلتقط النية الفقهية المكملة لنية الموعد.',
      },
    ],
    keywordGaps: [
      '27 رجب تاريخ الإسراء والمعراج',
      'ما الذي فرض في ليلة المعراج',
      'هل يشرع الاحتفال بليلة الإسراء والمعراج',
      'هل صيام يوم الإسراء والمعراج مشروع',
    ],
    unansweredQuestions: [
      'كيف نشرح الفرق بين التاريخ المشهور والتاريخ المقطوع به؟',
      'ما أقصر صياغة تربط الليلة بفرض الصلاة من غير مبالغة؟',
      'كيف نجمع نية القصة ونية العداد في نفس الصفحة؟',
    ],
    differentiationIdeas: [
      'إبراز 27 رجب بوصفه الموعد المتداول لا الحقيقة المقطوع بها',
      'جمع القصة والموعد والحكم في بنية واحدة سهلة الفهم',
      'سد الفجوة بين صفحات الفتاوى وصفحات العد التنازلي الضعيفة',
    ],
    researchNotes:
      'الفرصة SEO هنا واضحة: أغلب النتائج العربية إما فتاوى بلا عداد أو عدادات بلا تحرير. الصفحة الأفضل هي التي توضح أن 27 رجب هو التاريخ المتداول، ثم تضيف القصة والحكم في صياغة عربية مباشرة.',
  },
  {
    core: {
      id: 'winter',
      slug: 'winter-season',
      name: 'بداية فصل الشتاء',
      type: 'fixed',
      category: 'astronomy',
      month: 12,
      day: 21,
    },
    queueOrder: 15,
    sourceAuthority: 'seasonal-astronomy',
    seoTitle: 'بداية فصل الشتاء {{year}} — كم باقي والانقلاب الشتوي',
    description:
      'موعد بداية فصل الشتاء {{year}} مع عداد مباشر، وشرح واضح للانقلاب الشتوي ولماذا قد ترى 21 أو 22 ديسمبر في بعض الصفحات.',
    titleTag: 'بداية فصل الشتاء {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد بداية فصل الشتاء {{year}} مع عداد دقيق، وشرح عربي واضح لمعنى الانقلاب الشتوي وسبب اختلاف 21 و22 ديسمبر بين بعض الصفحات.',
    ogDescription:
      'موعد بداية فصل الشتاء {{year}} مع عداد مباشر وشرح واضح لمعنى الانقلاب الشتوي واختلاف 21 و22 ديسمبر.',
    h1: 'بداية فصل الشتاء {{year}} | كم باقي؟',
    primaryKeyword: 'متى يبدأ فصل الشتاء {{year}}',
    secondaryKeywords: [
      'كم باقي على الشتاء {{year}}',
      'بداية فصل الشتاء {{year}}',
      'الانقلاب الشتوي {{year}}',
      'هل الشتاء يبدأ 21 أم 22 ديسمبر',
      'أطول ليل في السنة {{year}}',
    ],
    longTailKeywords: [
      'متى يبدأ فصل الشتاء {{year}}',
      'كم باقي على الشتاء',
      'ما هو الانقلاب الشتوي',
      'هل الشتاء يبدأ 21 أم 22 ديسمبر',
      'لماذا يختلف موعد الشتاء بين الصفحات',
      'بداية فصل الشتاء {{nextYear}}',
      'أطول ليل في السنة',
      'هل بداية الشتاء تعني البرد فوراً',
    ],
    keywords: [
      'بداية الشتاء',
      'الشتاء 21 ديسمبر',
      'الانقلاب الشتوي',
      'أقصر نهار',
    ],
    answerSummary:
      'بداية فصل الشتاء {{year}} توافق {{formattedDate}} في هذا الإدراج بوصفها الموعد الأشهر للانقلاب الشتوي، ويتبقى على الشتاء {{daysRemaining}} يوماً. ولا تكمن قيمة الصفحة في التاريخ وحده، بل في شرح سبب ظهور 21 أو 22 ديسمبر في بعض النتائج، وربط ذلك بلحظة الانقلاب والمنطقة الزمنية التي يعتمدها المصدر.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'فلكية وطبيعية',
      'الحدث الفلكي': 'الانقلاب الشتوي',
      'المعنى': 'أقصر نهار وأطول ليل شمال خط الاستواء',
      'أكثر ما يربك الباحث': 'اختلاف 21 و22 ديسمبر بين بعض المواقع',
    },
    aboutEvent: {
      'ما هو بداية فصل الشتاء؟':
        'بداية فصل الشتاء فلكياً تعني لحظة الانقلاب الشتوي، وهي النقطة التي يبلغ فيها النهار أقصر مدة له خلال السنة في النصف الشمالي من الأرض. ولذلك لا يكفي أن تقول الصفحة إن الشتاء يبدأ في 21 ديسمبر فقط، بل يجب أن تشرح أيضاً أن اختلاف المناطق الزمنية قد يجعل بعض المصادر تعرض 22 ديسمبر في بعض السنوات.',
      'التاريخ والأصل':
        'لا يرتبط الشتاء بتاريخ إداري ثابت بقدر ارتباطه بحدث فلكي محسوب، ولذلك قد يظهر يوم 21 أو 22 ديسمبر بحسب التوقيت العالمي والمحلي. ومع أن هذا الإدراج يستخدم {{formattedDate}} مرجعاً واضحاً للبحث، فإن التفسير العلمي لا يقل أهمية عن اليوم نفسه، لأنه يفسر اختلاف النتائج ولا يترك المستخدم أمام أرقام متضاربة بلا سياق.',
      'الأهمية والمكانة':
        'تكمن أهمية صفحة الشتاء في أنها واحدة من الصفحات الموسمية التي يتكرر البحث عنها كل عام بصيغ مثل: كم باقي على الشتاء، متى يبدأ الشتاء، وأطول ليل في السنة. لكن المنافسة الحالية غالباً تنقل اليوم بلا تفسير. ولهذا فإن الشرح العربي المبسط للانقلاب الشتوي يمنح الصفحة ميزة فعلية في الترتيب والثقة.',
      'كيف يُحيا هذا اليوم':
        'لا يُحتفل ببداية الشتاء بطقس موحد، لكن تأثيره واضح في التخطيط اليومي والملابس والسفر والمحتوى الموسمي ومتابعة الطقس. ولذلك يحتاج المستخدم إلى صفحة تشرح الحدث الفلكي نفسه، وتوضح أن دخول الشتاء فلكياً لا يعني بالضرورة أن البرد سيظهر فوراً في كل منطقة عربية.',
    },
    faq: [
      {
        question: 'متى يبدأ فصل الشتاء {{year}}؟',
        answer:
          'يبدأ فصل الشتاء {{year}} في هذا الإدراج يوم {{formattedDate}} بوصفه الموعد الأشهر للانقلاب الشتوي. وقد تظهر بعض المصادر يوم 22 ديسمبر بحسب التوقيت المعتمد.',
      },
      {
        question: 'كم باقي على الشتاء؟',
        answer:
          'يتبقى على بداية فصل الشتاء {{daysRemaining}} يوماً. ويعرض العداد أعلى الصفحة الوقت المتبقي حتى الموعد المدرج للانقلاب الشتوي.',
      },
      {
        question: 'ما هو الانقلاب الشتوي؟',
        answer:
          'الانقلاب الشتوي هو الحدث الفلكي الذي يبلغ فيه النهار أقصر مدة له خلال السنة في النصف الشمالي من الأرض. ولذلك يعد المرجع الأساسي لبداية الشتاء فلكياً.',
      },
      {
        question: 'لماذا تقول بعض الصفحات إن الشتاء يبدأ 21 ديسمبر وأخرى تقول 22 ديسمبر؟',
        answer:
          'يحدث ذلك لأن لحظة الانقلاب الشتوي تحسب عالمياً ثم تتحول إلى التوقيت المحلي لكل منطقة، لذلك قد يظهر يوم 21 أو 22 ديسمبر بحسب المصدر والمنطقة الزمنية.',
      },
      {
        question: 'هل بداية الشتاء تعني البرد فوراً؟',
        answer:
          'لا، بداية الشتاء فلكياً لا تعني تغيراً فورياً في الإحساس الحراري أو نزولاً حاداً في الحرارة. فالطقس يتأثر بعوامل محلية وزمنية قد تجعل البرودة تتأخر أو تتقدم.',
      },
      {
        question: 'ما علاقة بداية الشتاء بأطول ليل في السنة؟',
        answer:
          'يرتبط الانقلاب الشتوي بأطول ليل وأقصر نهار في السنة في النصف الشمالي من الأرض، ولهذا يستخدمه كثير من الباحثين لفهم معنى بداية الشتاء لا لمعرفة اليوم فقط.',
      },
      {
        question: 'متى يبدأ فصل الشتاء {{nextYear}}؟',
        answer:
          'يبدأ فصل الشتاء {{nextYear}} أيضاً حول 21 أو 22 ديسمبر بحسب توقيت الانقلاب الشتوي لتلك السنة. لذلك تبقى لحظة الحدث الفلكي هي المرجع الأدق من اليوم المتداول وحده.',
      },
    ],
    engagementContent: [
      {
        text: 'صفحة الشتاء الجيدة لا تكتفي بـ 21 ديسمبر، بل تشرح لماذا قد ترى 22 ديسمبر في بعض النتائج.',
        type: 'fact',
        subcategory: 'SERP',
      },
      {
        text: 'الانقلاب الشتوي هو المفتاح العلمي الحقيقي لفهم بداية الشتاء، لا مجرد يوم محفوظ في التقويم.',
        type: 'tip',
        subcategory: 'علم',
      },
      {
        text: 'يريد المستخدم العربي جواباً عملياً عن الشتاء، لكنه يستفيد أكثر عندما يجد تفسير الاختلاف بين المصادر في نفس الصفحة.',
        type: 'fact',
        subcategory: 'نية المستخدم',
      },
      {
        text: 'قبل مشاركة موعد الشتاء، راجع ما إذا كان المصدر يعرض التوقيت العالمي أم المحلي.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'أقصر نهار في السنة لا يعني أشد يوم برداً في السنة، وهذه واحدة من أكثر النقاط التي يخلط بينها الناس.',
        type: 'quote',
        subcategory: 'توضيح',
      },
      {
        text: 'كلمة الانقلاب الشتوي تلتقط شريحة بحثية مختلفة عن عبارة كم باقي على الشتاء، ووجودهما معاً يقوي الصفحة.',
        type: 'tip',
        subcategory: 'SEO',
      },
    ],
    recurringContext:
      'بداية فصل الشتاء ترتبط بلحظة فلكية تتغير دقائقها من سنة إلى أخرى، لذلك قد يظهر اليوم 21 أو 22 ديسمبر بحسب التوقيت المحلي. ويفيد جدول السنوات في فهم النمط العام مع بقاء الحدث الفلكي نفسه هو المرجع الأدق.',
    recurringSourceNote:
      'وفق بيانات التوقيت الفلكي العامة للانقلاب الشتوي، وقد يختلف اليوم الظاهر بين بعض المناطق الزمنية أو المصادر المختصرة.',
    schemaDescription:
      'موعد بداية فصل الشتاء {{year}} مع عداد مباشر وشرح واضح لمعنى الانقلاب الشتوي وسبب اختلاف 21 و22 ديسمبر بين بعض الصفحات.',
    relatedSlugs: [
      'spring-season',
      'summer-season',
      'autumn-season',
      'new-year',
    ],
    aboutParagraphs: [
      'الصفحة تبني قوتها حول سؤالين يتكرران كل شتاء: متى يبدأ الشتاء، ولماذا يختلف اليوم بين 21 و22 ديسمبر.',
      'وجود الانقلاب الشتوي وأطول ليل في السنة ضمن المحتوى يجعل الإجابة أكثر فائدة من صفحات العد التنازلي المختصرة.',
      'الهدف ليس عرض رقم فقط، بل تفسير الرقم بطريقة تمنع الالتباس وتزيد الثقة في النتيجة.',
    ],
    history:
      'يرتبط الشتاء في التقاويم الفلكية الحديثة بلحظة الانقلاب الشتوي، ولذلك لا يكفي النقل التقويمي المجرد لفهم بدايته. وكل سنة يتكرر السؤال نفسه لأن بعض الصفحات تعرض يوماً مختلفاً عن غيرها. هذه الفجوة تفسر لماذا يحتاج المستخدم إلى صفحة عربية تبني الجواب على الحدث الفلكي نفسه.',
    significance:
      'الميزة التنافسية هنا هي تحويل صفحة الشتاء من عداد عام إلى مرجع عربي بسيط يفسر الانقلاب الشتوي واختلاف 21 و22 ديسمبر.',
    details:
      'من الناحية العملية يستخدم الناس هذه الصفحة لمعرفة كم بقي على الشتاء، لكنهم يستفيدون أكثر عندما يجدون داخلها تفسيراً لسبب اختلاف اليوم بين مصدر وآخر وربطاً واضحاً بين الانقلاب وطول الليل والنهار.',
    sources: [
      {
        label: 'Time and Date: Solstices and Equinoxes',
        url: 'https://www.timeanddate.com/astronomy/seasons.html',
      },
      {
        label: 'Britannica: winter solstice',
        url: 'https://www.britannica.com/science/winter-solstice',
      },
      {
        label: 'Britannica: solstice',
        url: 'https://www.britannica.com/science/solstice',
      },
    ],
    primaryQueries: [
      'متى يبدأ الشتاء 2026',
      'كم باقي على الشتاء 2026',
      'الانقلاب الشتوي 2026',
      'هل الشتاء يبدأ 21 أم 22 ديسمبر',
    ],
    competitors: [
      {
        site: 'صفحات العد التنازلي العامة',
        type: 'countdown',
        focus: ['كم باقي على الشتاء', 'اليوم المختصر'],
        gaps: ['لا تشرح الاختلاف بين 21 و22', 'تغفل معنى الانقلاب الشتوي'],
      },
      {
        site: 'المواقع الخبرية الموسمية',
        type: 'news',
        focus: ['التاريخ الفلكي', 'أقصر نهار', 'نقل الحسابات'],
        gaps: ['محتوى موسمي يتقادم', 'لا يبني صفحة خدمة دائمة عن السؤال اليومي'],
      },
      {
        site: 'مواقع الفلك الأجنبية',
        type: 'official',
        focus: ['التوقيت العلمي الدقيق', 'الحدث الفلكي'],
        gaps: ['ليست مهيأة للبحث العربي المباشر', 'لا تترجم نية كم باقي إلى شرح عربي مبسط'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى يبدأ فصل الشتاء {{year}}',
        whyItMatters: 'أعلى استعلام مباشر عن الموعد.',
      },
      {
        keyword: 'كم باقي على الشتاء',
        whyItMatters: 'يمسك نية العد التنازلي اليومية.',
      },
      {
        keyword: 'هل الشتاء يبدأ 21 أم 22 ديسمبر',
        whyItMatters: 'يغطي أكبر فجوة تفسيرية في النتائج الحالية.',
      },
      {
        keyword: 'ما هو الانقلاب الشتوي',
        whyItMatters: 'يضيف طبقة تفسيرية تدعم البقاء والثقة.',
      },
    ],
    keywordGaps: [
      'هل الشتاء يبدأ 21 أم 22 ديسمبر',
      'لماذا يختلف موعد الشتاء بين الصفحات',
      'أطول ليل في السنة',
      'هل بداية الشتاء تعني البرد فوراً',
    ],
    unansweredQuestions: [
      'كيف نشرح أثر المنطقة الزمنية في يوم بداية الشتاء بلغة بسيطة؟',
      'ما أكثر نقطة يخلط بينها الباحث: أقصر نهار أم أشد برد؟',
      'كيف نربط صفحة الشتاء بالسياق الفلكي من دون تعقيد؟',
    ],
    differentiationIdeas: [
      'إبراز سؤال 21 أم 22 ديسمبر داخل العنوان والFAQ',
      'شرح الانقلاب الشتوي بلغة عربية غير أكاديمية أكثر من اللازم',
      'ربط العداد بالمعلومة العلمية لا بالتاريخ المجرد فقط',
    ],
    researchNotes:
      'أفضل فرصة SEO هنا أن نتائج الشتاء العربية تكرر التاريخ ولا تشرح الاختلاف. الصفحة الأقوى هي التي تحول الالتباس نفسه إلى عنصر قيمة بحثية حقيقية.',
  },
  {
    core: {
      id: 'spring',
      slug: 'spring-season',
      name: 'بداية فصل الربيع',
      type: 'fixed',
      category: 'astronomy',
      month: 3,
      day: 20,
    },
    queueOrder: 16,
    sourceAuthority: 'seasonal-astronomy',
    seoTitle: 'بداية فصل الربيع {{year}} — كم باقي والاعتدال الربيعي',
    description:
      'موعد بداية فصل الربيع {{year}} مع عداد مباشر، وشرح واضح للاعتدال الربيعي ولماذا قد يظهر 20 أو 21 مارس في بعض النتائج.',
    titleTag: 'بداية فصل الربيع {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد بداية فصل الربيع {{year}} مع عداد دقيق، وشرح عربي واضح لمعنى الاعتدال الربيعي وسبب اختلاف 20 و21 مارس بين بعض الصفحات.',
    ogDescription:
      'موعد بداية فصل الربيع {{year}} مع عداد مباشر وشرح واضح لمعنى الاعتدال الربيعي واختلاف 20 و21 مارس.',
    h1: 'بداية فصل الربيع {{year}} | كم باقي؟',
    primaryKeyword: 'متى يبدأ فصل الربيع {{year}}',
    secondaryKeywords: [
      'كم باقي على الربيع {{year}}',
      'بداية فصل الربيع {{year}}',
      'الاعتدال الربيعي {{year}}',
      'هل الربيع يبدأ 20 أم 21 مارس',
      'تساوي الليل والنهار {{year}}',
    ],
    longTailKeywords: [
      'متى يبدأ فصل الربيع {{year}}',
      'كم باقي على الربيع',
      'ما هو الاعتدال الربيعي',
      'هل الربيع يبدأ 20 أم 21 مارس',
      'لماذا يختلف موعد الربيع بين الصفحات',
      'بداية فصل الربيع {{nextYear}}',
      'تساوي الليل والنهار',
      'هل بداية الربيع تعني دفء الطقس فوراً',
    ],
    keywords: [
      'بداية الربيع',
      '20 مارس الربيع',
      'الاعتدال الربيعي',
      'تساوي الليل والنهار',
    ],
    answerSummary:
      'بداية فصل الربيع {{year}} توافق {{formattedDate}} في هذا الإدراج بوصفها الموعد الأشهر للاعتدال الربيعي، ويتبقى على الربيع {{daysRemaining}} يوماً. وتبرز قيمة الصفحة في أنها تشرح لماذا تظهر بعض النتائج على 20 مارس وأخرى على 21 مارس، مع ربط ذلك بالحدث الفلكي نفسه لا بالتاريخ الشائع فقط.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'فلكية وطبيعية',
      'الحدث الفلكي': 'الاعتدال الربيعي',
      'المعنى': 'تقارب ساعات الليل والنهار',
      'أكثر ما يربك الباحث': 'اختلاف 20 و21 مارس بين بعض المواقع',
    },
    aboutEvent: {
      'ما هو بداية فصل الربيع؟':
        'بداية فصل الربيع فلكياً تعني لحظة الاعتدال الربيعي، وهي اللحظة التي تتقارب فيها ساعات الليل والنهار عند انتقال الشمس ظاهرياً فوق خط الاستواء. ولهذا لا ينبغي أن تُختزل الصفحة في تاريخ 20 مارس فقط، بل يجب أن تشرح أيضاً لماذا قد تعرض بعض المصادر يوم 21 مارس في بعض التوقيتات أو السنوات.',
      'التاريخ والأصل':
        'يرتبط الربيع بحدث فلكي محسوب لا بقرار إداري ثابت، ولذلك قد يظهر يوم 20 أو 21 مارس بحسب السنة والمنطقة الزمنية. ويستخدم هذا الإدراج {{formattedDate}} مرجعاً واضحاً للباحث العربي، لكنه يضيف الطبقة الأهم: تفسير سبب اختلاف اليوم بين المصادر وارتباطه بلحظة الاعتدال الفعلية.',
      'الأهمية والمكانة':
        'تكمن أهمية صفحة الربيع في أنها تخدم نية بحث واسعة تتكرر كل عام بصيغ مثل: متى يبدأ الربيع، كم باقي على الربيع، وما معنى الاعتدال الربيعي. والمشكلة في كثير من النتائج أنها تقدم اليوم ولا تشرح الظاهرة. لذلك ترتفع قيمة الصفحة حين تفسر معنى تساوي الليل والنهار وتوضح أن التغير المناخي لا يحدث بالضرورة فور لحظة الاعتدال.',
      'كيف يُحيا هذا اليوم':
        'بداية الربيع ليست مناسبة احتفالية موحدة، لكنها لحظة موسمية تؤثر في المحتوى والسفر والنشاطات والطقس والخطط العائلية. ولذلك يريد الباحث العربي تاريخاً واضحاً، لكنه يستفيد أكثر حين يجد معه تفسيراً مبسطاً لسبب اختلاف 20 و21 مارس بين بعض الصفحات ولمعنى الاعتدال نفسه.',
    },
    faq: [
      {
        question: 'متى يبدأ فصل الربيع {{year}}؟',
        answer:
          'يبدأ فصل الربيع {{year}} في هذا الإدراج يوم {{formattedDate}} بوصفه الموعد الأشهر للاعتدال الربيعي. وقد تعرض بعض المصادر يوم 21 مارس بحسب التوقيت المعتمد.',
      },
      {
        question: 'كم باقي على الربيع؟',
        answer:
          'يتبقى على بداية فصل الربيع {{daysRemaining}} يوماً. ويعرض العداد أعلى الصفحة الوقت المتبقي حتى الموعد المدرج للاعتدال الربيعي.',
      },
      {
        question: 'ما هو الاعتدال الربيعي؟',
        answer:
          'الاعتدال الربيعي هو الحدث الفلكي الذي تتقارب فيه ساعات الليل والنهار عند بداية الربيع في النصف الشمالي من الأرض. ولذلك يعد المرجع العلمي لبداية الربيع فلكياً.',
      },
      {
        question: 'لماذا تقول بعض الصفحات إن الربيع يبدأ 20 مارس وأخرى تقول 21 مارس؟',
        answer:
          'يحدث ذلك لأن لحظة الاعتدال الربيعي تحسب عالمياً ثم تتحول إلى التوقيت المحلي لكل منطقة، لذلك قد يظهر اليوم 20 أو 21 مارس بحسب المصدر والمنطقة الزمنية.',
      },
      {
        question: 'هل بداية الربيع تعني دفء الطقس فوراً؟',
        answer:
          'لا، بداية الربيع فلكياً لا تعني تحولاً فورياً في درجات الحرارة. فالطقس يتأثر بعوامل محلية وقد يبقى بارداً في بعض المناطق حتى بعد دخول الربيع.',
      },
      {
        question: 'ما معنى تساوي الليل والنهار في الربيع؟',
        answer:
          'المقصود هو تقارب طول الليل والنهار عند لحظة الاعتدال الربيعي، ولهذا يكثر استخدام هذه العبارة في شرح بداية الربيع وموقعه الفلكي خلال السنة.',
      },
      {
        question: 'متى يبدأ فصل الربيع {{nextYear}}؟',
        answer:
          'يبدأ فصل الربيع {{nextYear}} أيضاً حول 20 أو 21 مارس بحسب توقيت الاعتدال الربيعي لتلك السنة. ولذلك يبقى الحدث الفلكي هو المرجع الأدق لا اليوم المتداول فقط.',
      },
    ],
    engagementContent: [
      {
        text: 'أفضل صفحة عن الربيع هي التي تجيب عن 20 أم 21 مارس قبل أن تطلب من المستخدم الوثوق بتاريخ واحد مجرد.',
        type: 'fact',
        subcategory: 'SERP',
      },
      {
        text: 'الاعتدال الربيعي كلمة مفتاحية مهمة لأنها تلتقط الباحث الذي يريد التفسير لا العد التنازلي فقط.',
        type: 'tip',
        subcategory: 'SEO',
      },
      {
        text: 'تساوي الليل والنهار تقريباً هو أسهل مدخل عربي لفهم معنى بداية الربيع فلكياً.',
        type: 'fact',
        subcategory: 'علم',
      },
      {
        text: 'لا تنقل موعد الربيع من مصدر واحد إذا لم يوضح المنطقة الزمنية أو لحظة الاعتدال نفسها.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'بداية الربيع فلكياً لا تعني أن الدفء سيصل فوراً إلى كل المناطق، وهذه من أكثر النقاط التي يغفل عنها المحتوى السريع.',
        type: 'quote',
        subcategory: 'توضيح',
      },
      {
        text: 'التمييز بين الربيع الفلكي والإحساس المناخي بالموسم يضيف عمقاً واضحاً للصفحة ويقلل الارتداد.',
        type: 'tip',
        subcategory: 'جودة',
      },
    ],
    recurringContext:
      'بداية فصل الربيع ترتبط بلحظة فلكية تتغير دقائقها من سنة إلى أخرى، ولذلك قد يظهر اليوم 20 أو 21 مارس بحسب التوقيت المحلي. ويفيد جدول السنوات في متابعة النمط العام مع بقاء الاعتدال الربيعي هو المرجع الأدق.',
    recurringSourceNote:
      'وفق بيانات التوقيت الفلكي العامة للاعتدال الربيعي، وقد يختلف اليوم الظاهر بين بعض المناطق الزمنية أو المصادر المختصرة.',
    schemaDescription:
      'موعد بداية فصل الربيع {{year}} مع عداد مباشر وشرح واضح لمعنى الاعتدال الربيعي وسبب اختلاف 20 و21 مارس بين بعض الصفحات.',
    relatedSlugs: [
      'winter-season',
      'summer-season',
      'autumn-season',
      'spring-vacation',
      'earth-day',
      'valentines-day',
    ],
    aboutParagraphs: [
      'الصفحة مبنية حول سؤالين موسميين ثابتين: متى يبدأ الربيع، ولماذا يختلف اليوم بين 20 و21 مارس.',
      'وجود الاعتدال الربيعي وتساوي الليل والنهار ضمن البنية الدلالية يجعل الإجابة أقوى من صفحات العد التنازلي المجردة.',
      'الهدف هو تحويل صفحة الربيع من تاريخ محفوظ إلى تفسير عربي بسيط يساعد الباحث على فهم السبب وراء اختلاف النتائج.',
    ],
    history:
      'يرتبط الربيع في الروزنامة الفلكية بلحظة الاعتدال الربيعي، وهي لحظة قابلة للحساب الدقيق لكنها تتأثر في عرض اليوم بالمنطقة الزمنية. وهذا ما يفسر سبب الالتباس الدائم بين 20 و21 مارس في نتائج البحث، ويجعل التفسير الفلكي المختصر جزءاً أساسياً من جودة الصفحة.',
    significance:
      'الميزة التنافسية هنا هي الجمع بين العد التنازلي وشرح الاعتدال الربيعي بطريقة عربية مبسطة وواضحة.',
    details:
      'الزائر هنا يريد معرفة كم بقي على الربيع، لكنه يحتاج أيضاً إلى فهم ما إذا كان التاريخ الثابت يكفي أم أن هناك تفسيراً فلكياً أدق. وكلما وُضِّحت هذه النقطة انخفض الالتباس وارتفعت قيمة الصفحة.',
    sources: [
      {
        label: 'Time and Date: Solstices and Equinoxes',
        url: 'https://www.timeanddate.com/astronomy/seasons.html',
      },
      {
        label: 'Britannica: vernal equinox',
        url: 'https://www.britannica.com/science/vernal-equinox',
      },
      {
        label: 'Britannica: equinox',
        url: 'https://www.britannica.com/science/equinox',
      },
    ],
    primaryQueries: [
      'متى يبدأ الربيع 2026',
      'كم باقي على الربيع 2026',
      'الاعتدال الربيعي 2026',
      'هل الربيع يبدأ 20 أم 21 مارس',
    ],
    competitors: [
      {
        site: 'صفحات العد التنازلي العامة',
        type: 'countdown',
        focus: ['كم باقي على الربيع', 'اليوم المختصر'],
        gaps: ['لا تشرح الاختلاف بين 20 و21', 'تغفل معنى الاعتدال الربيعي'],
      },
      {
        site: 'المواقع الخبرية الموسمية',
        type: 'news',
        focus: ['التاريخ الفلكي', 'تساوي الليل والنهار', 'نقل الحسابات'],
        gaps: ['محتوى خبري سريع', 'لا يبني صفحة خدمة دائمة عن السؤال اليومي'],
      },
      {
        site: 'مواقع الفلك الأجنبية',
        type: 'official',
        focus: ['التوقيت العلمي', 'الحدث الفلكي'],
        gaps: ['ليست موجهة لصيغ البحث العربي الخدمي', 'تحتاج ترجمة وتبسيطاً'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى يبدأ فصل الربيع {{year}}',
        whyItMatters: 'أوضح استعلام مباشر عن الموعد.',
      },
      {
        keyword: 'كم باقي على الربيع',
        whyItMatters: 'يمسك نية العد التنازلي اليومية.',
      },
      {
        keyword: 'هل الربيع يبدأ 20 أم 21 مارس',
        whyItMatters: 'يغطي أهم فجوة تفسيرية في SERP العربي.',
      },
      {
        keyword: 'ما هو الاعتدال الربيعي',
        whyItMatters: 'يمنح الصفحة عمقاً تفسيرياً يزيد الثقة والزمن داخلها.',
      },
    ],
    keywordGaps: [
      'هل الربيع يبدأ 20 أم 21 مارس',
      'تساوي الليل والنهار',
      'لماذا يختلف موعد الربيع بين الصفحات',
      'هل بداية الربيع تعني دفء الطقس فوراً',
    ],
    unansweredQuestions: [
      'كيف نفسر الاعتدال الربيعي للباحث العربي بأبسط لغة ممكنة؟',
      'ما أفضل طريقة لربط 20 و21 مارس بالمنطقة الزمنية؟',
      'كيف نحول صفحة الربيع من عداد إلى مرجع حقيقي؟',
    ],
    differentiationIdeas: [
      'إبراز سؤال 20 أم 21 مارس في العنوان والFAQ',
      'ربط العد التنازلي بتساوي الليل والنهار لا بالتاريخ المجرد فقط',
      'تقديم شرح فلكي عربي مبسط يفوق صفحات العدادات القصيرة',
    ],
    researchNotes:
      'SERP العربية حول الربيع تحتاج صفحة تشرح أكثر مما تعد. الفرق الحقيقي في الترتيب هنا ليس في رقم اليوم، بل في تفسير لماذا يختلف وما معنى الاعتدال الربيعي أصلاً.',
  },
  {
    core: {
      id: 'salary-eg',
      slug: 'salary-day-egypt',
      name: 'موعد صرف مرتبات مصر الحكومية',
      type: 'monthly',
      category: 'business',
      _countryCode: 'eg',
      day: 24,
    },
    queueOrder: 33,
    sourceAuthority: 'egypt-mof-announcements',
    seoTitle: 'موعد صرف مرتبات مصر الحكومية {{year}} — كم باقي والموعد المرجعي',
    description:
      'موعد صرف مرتبات مصر الحكومية {{year}} مع عداد مباشر وشرح واضح لأن وزارة المالية تعلن مواعيد الصرف شهرياً، لذلك يبقى البيان الرسمي هو المرجع النهائي.',
    titleTag: 'موعد صرف مرتبات مصر {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد صرف مرتبات مصر الحكومية {{year}} مع عداد دقيق وشرح واضح لقاعدة الصرف المرجعية، ولماذا قد تتغير المواعيد شهرياً ببيان رسمي من وزارة المالية.',
    ogDescription:
      'موعد صرف مرتبات مصر الحكومية {{year}} مع عداد مباشر وشرح واضح لكون المواعيد تعلن شهرياً ببيانات رسمية.',
    h1: 'موعد صرف مرتبات مصر {{year}} | كم باقي؟',
    primaryKeyword: 'متى صرف مرتبات مصر {{year}}',
    secondaryKeywords: [
      'كم باقي على صرف مرتبات مصر {{year}}',
      'موعد صرف مرتبات مصر الحكومية {{year}}',
      'مرتبات مصر هذا الشهر',
      'هل مرتبات مصر ثابتة يوم 24',
      'وزارة المالية مواعيد صرف المرتبات',
    ],
    longTailKeywords: [
      'متى صرف مرتبات مصر هذا الشهر',
      'كم باقي على صرف المرتبات الحكومية في مصر',
      'هل مرتبات مصر ثابتة يوم 24',
      'وزارة المالية تعلن مواعيد صرف المرتبات',
      'متى تنزل مرتبات الموظفين الحكوميين في مصر',
      'مرتبات مصر {{nextYear}}',
      'نافذة صرف المرتبات في مصر',
      'هل تتغير مواعيد المرتبات قبل الأعياد',
    ],
    keywords: [
      'صرف المرتبات مصر',
      'مرتبات الحكومة مصر',
      'وزارة المالية المرتبات',
      'مرتب هذا الشهر',
    ],
    answerSummary:
      'موعد صرف مرتبات مصر الحكومية {{year}} لا يعتمد يوماً واحداً ثابتاً في كل الشهور، لأن وزارة المالية المصرية تعلن جداول الصرف شهرياً بحسب ظروف كل شهر. ويستخدم هذا الإدراج يوم {{formattedDate}} مرجعاً تقريبيًا داخل نافذة الصرف المعتادة، مع بقاء البيان الرسمي هو المرجع النهائي. ويتبقى على الموعد المرجعي {{daysRemaining}} يوماً، ولذلك تفيد الصفحة في التقاط نية البحث العالية حول مرتبات مصر هذا الشهر مع شرح الاستثناءات بوضوح.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'مناسبات الأعمال',
      'طبيعة الموعد': 'مرجع تقريبي لا بيان شهري نهائي',
      'المرجع النهائي': 'إعلان وزارة المالية المصرية لكل شهر',
      'ما يهم الباحث': 'موعد الشهر الحالي وهل توجد تبكيرات أو تعديلات',
    },
    aboutEvent: {
      'ما هو موعد صرف مرتبات مصر الحكومية؟':
        'موعد صرف مرتبات مصر الحكومية هو التاريخ الذي يترقبه موظفو الدولة لمعرفة متى تبدأ إتاحة الرواتب خلال الشهر. والبحث هنا عملي جداً بطبيعته، لأن المستخدم لا يريد تعريفاً نظرياً للمرتبات، بل يريد معرفة هل الموعد ثابت أم متغير، وما إذا كان يوم 24 دقيقاً دائماً أم مجرد مرجع شائع.',
      'التاريخ والأصل':
        'تُظهر الإعلانات الرسمية أن وزارة المالية المصرية تعلن مواعيد صرف المرتبات شهرياً، وأن بدايات الصرف قد تتقدم أو تتأخر بحسب الظروف التنظيمية والمناسبات. ولهذا لا يصح التعامل مع يوم واحد على أنه قاعدة جامدة في كل شهر، بل ينبغي فهمه كمرجع تقريبي داخل نافذة صرف معتادة، مع بقاء البيان الشهري هو الكلمة النهائية.',
      'الأهمية والمكانة':
        'قيمة الصفحة كبيرة SEO لأن البحث عن مرتبات مصر هذا الشهر يتكرر باستمرار، لكن كثيراً من النتائج العربية تخلط بين تاريخ مرجعي قديم وبين المواعيد الرسمية الحديثة. ولهذا تكسب الصفحة عندما تقول الحقيقة بوضوح: هناك نافذة صرف معتادة، لكن الوزارة قد تعدلها شهرياً، ولا بد من متابعة الإعلان الرسمي إذا أردت جواباً نهائياً.',
      'كيف يُحيا هذا اليوم':
        'عملياً يتابع الموظفون أخبار وزارة المالية أو الأخبار الرسمية المعتمدة لمعرفة يوم بدء الصرف وما إذا كانت هناك متأخرات أو استثناءات أو تقديم قبل مناسبة معينة. لذلك يفيد العداد هنا كمرجع تخطيطي عام، لكنه لا يغني عن البيان الشهري عند الحاجة إلى دقة كاملة.',
    },
    faq: [
      {
        question: 'متى صرف مرتبات مصر {{year}}؟',
        answer:
          'مواعيد صرف مرتبات مصر {{year}} تعلنها وزارة المالية المصرية شهرياً، ولذلك لا يوجد يوم واحد نهائي صالح لكل الشهور. ويعرض هذا الإدراج {{formattedDate}} بوصفه مرجعاً تقريبيًا لا بديلاً عن البيان الرسمي.',
      },
      {
        question: 'كم باقي على صرف مرتبات مصر؟',
        answer:
          'يتبقى على الموعد المرجعي لصرف مرتبات مصر {{daysRemaining}} يوماً وفق العداد أعلى الصفحة. لكن إذا كنت تبحث عن شهر بعينه فالأدق هو مراجعة الإعلان الرسمي لذلك الشهر.',
      },
      {
        question: 'هل مرتبات مصر ثابتة يوم 24 من كل شهر؟',
        answer:
          'لا، لا تعد مواعيد مرتبات مصر ثابتة على يوم واحد نهائياً في كل الشهور، لأن وزارة المالية قد تعلن جداول مختلفة أو تبكيراً أو تعديلاً بحسب الشهر.',
      },
      {
        question: 'ما هو المرجع النهائي لموعد صرف المرتبات في مصر؟',
        answer:
          'المرجع النهائي لموعد صرف المرتبات في مصر هو بيان وزارة المالية المصرية أو ما ينقل عنها رسمياً، لا التاريخ المتداول في الشائعات أو الصفحات المختصرة.',
      },
      {
        question: 'لماذا تختلف مواعيد مرتبات مصر من شهر إلى آخر؟',
        answer:
          'تختلف المواعيد لأن وزارة المالية تنظم الصرف شهرياً بحسب أيام العمل والمناسبات والاعتبارات الإدارية، لذلك قد تتغير البداية الفعلية من شهر إلى آخر.',
      },
      {
        question: 'كيف أستخدم صفحة المرتبات إذا كانت المواعيد شهرية؟',
        answer:
          'أفضل استخدام للصفحة هو اعتبارها دليلاً مرجعياً يشرح نافذة الصرف المعتادة ويذكرك بالمتابعة المبكرة، ثم الرجوع إلى البيان الشهري إذا أردت تاريخاً نهائياً لهذا الشهر تحديداً.',
      },
    ],
    engagementContent: [
      {
        text: 'أكبر خطأ في صفحات مرتبات مصر هو تقديم يوم واحد على أنه قاعدة نهائية لكل الشهور رغم وجود إعلانات شهرية رسمية.',
        type: 'fact',
        subcategory: 'SERP',
      },
      {
        text: 'إذا كان بحثك عن مرتب هذا الشهر فتعامل مع العداد كمؤشر تخطيطي، لا كبديل عن بيان وزارة المالية.',
        type: 'tip',
        subcategory: 'دقة',
      },
      {
        text: 'قوة الصفحة هنا تأتي من الصراحة: الموعد مرجعي، أما التاريخ النهائي فيعلَن شهرياً.',
        type: 'quote',
        subcategory: 'رسالة',
      },
      {
        text: 'الربط بين مرتبات مصر هذا الشهر ووزارة المالية يلتقط نية بحث أقوى من عبارة يوم 24 وحدها.',
        type: 'tip',
        subcategory: 'SEO',
      },
      {
        text: 'من الأفضل ربط التزاماتك الشهرية بنافذة الصرف المعتادة ثم تحديث خطتك إذا صدر تعديل رسمي.',
        type: 'checklist-item',
        subcategory: 'تنظيم',
      },
      {
        text: 'الزائر لا يحتاج فقط إلى متى، بل إلى لماذا قد يختلف الموعد من شهر إلى آخر، وهذا ما يجب أن تقدمه الصفحة بوضوح.',
        type: 'fact',
        subcategory: 'نية المستخدم',
      },
    ],
    recurringContext:
      'مواعيد صرف مرتبات مصر ليست قاعدة جامدة على يوم واحد، بل نافذة شهرية تعلنها وزارة المالية رسمياً. لذلك يفيد جدول السنوات في التذكير بالنمط العام فقط، مع بقاء البيان الشهري هو المرجع النهائي لكل شهر.',
    recurringSourceNote:
      'وفق إعلانات وزارة المالية المصرية ومركز المعلومات الرسمي، إذ تُعلن المواعيد شهرياً وقد تتغير أو تُبكَّر بحسب كل شهر.',
    schemaDescription:
      'مرجع عربي واضح عن موعد صرف مرتبات مصر الحكومية يشرح أن المواعيد تعلن شهرياً، ويجمع العداد المرجعي مع تفسير لماذا قد تختلف التواريخ بين شهر وآخر.',
    relatedSlugs: [
      'pension-day-egypt',
      'takaful-karama-egypt',
      'thanaweya-exams',
      'revolution-day-egypt',
    ],
    aboutParagraphs: [
      'الصفحة مبنية على نية بحث متكررة جداً: متى صرف مرتبات مصر هذا الشهر، وهل يوم 24 صحيح دائماً أم لا.',
      'بدلاً من تكرار معلومة قديمة عن تاريخ ثابت، تقدم الصفحة الحقيقة الأكثر فائدة: المواعيد تعلن شهرياً وهناك نافذة صرف معتادة فقط.',
      'هذا النوع من الصراحة يرفع الثقة ويحسن قدرة الصفحة على تجاوز النتائج السريعة والمضللة.',
    ],
    history:
      'تتعامل نتائج البحث العربية حول مرتبات مصر مع يوم واحد وكأنه قانون ثابت، بينما تظهر البيانات الرسمية أن وزارة المالية تعلن جداول الصرف شهرياً وأن بدايات الصرف قد تختلف من شهر إلى آخر. ومن هنا تأتي قيمة الصفحة: شرح القاعدة المرجعية من دون إنكار الاستثناءات أو إخفائها.',
    significance:
      'الميزة الأساسية SEO هي جمع صيغة مرتبات مصر هذا الشهر مع توضيح الفرق بين التاريخ المرجعي والبيان الرسمي الشهري.',
    details:
      'إذا كنت تستخدم الصفحة للتخطيط الشخصي فهي مفيدة كمرجع عام، أما إذا كنت تريد تأكيداً نهائياً للشهر الحالي فالأدق هو انتظار إعلان وزارة المالية أو مراجعة المصدر الرسمي المنقول عنها.',
    sources: [
      {
        label: 'الهيئة العامة للاستعلامات: المالية تعلن مواعيد صرف مرتبات يناير وفبراير ومارس ٢٠٢٥',
        url: 'https://sis.gov.eg/ar/%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%B2-%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%85%D9%8A/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1/%D8%A7%D9%84%D9%85%D8%A7%D9%84%D9%8A%D8%A9-%D8%AA%D8%B9%D9%84%D9%86-%D9%85%D9%88%D8%A7%D8%B9%D9%8A%D8%AF-%D8%B5%D8%B1%D9%81-%D9%85%D8%B1%D8%AA%D8%A8%D8%A7%D8%AA-%D9%8A%D9%86%D8%A7%D9%8A%D8%B1-%D9%88%D9%81%D8%A8%D8%B1%D8%A7%D9%8A%D8%B1-%D9%88%D9%85%D8%A7%D8%B1%D8%B3-%D9%A2%D9%A0%D9%A2%D9%A5/',
      },
      {
        label: 'الهيئة العامة للاستعلامات: وزير المالية يحدد مواعيد صرف مرتبات أبريل ومايو ويونيه ٢٠٢٢',
        url: 'https://sis.gov.eg/ar/%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%B2-%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%85%D9%8A/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1/%D9%88%D8%B2%D9%8A%D8%B1-%D8%A7%D9%84%D9%85%D8%A7%D9%84%D9%8A%D8%A9-%D8%AA%D8%AD%D8%AF%D9%8A%D8%AF-%D9%85%D9%88%D8%A7%D8%B9%D9%8A%D8%AF-%D8%B5%D8%B1%D9%81-%D9%85%D8%B1%D8%AA%D8%A8%D8%A7%D8%AA-%D8%A3%D8%A8%D8%B1%D9%8A%D9%84-%D9%88%D9%85%D8%A7%D9%8A%D9%88-%D9%88%D9%8A%D9%88%D9%86%D9%8A%D9%87-%D9%A2%D9%A0%D9%A2%D9%A2/',
      },
    ],
    primaryQueries: [
      'متى صرف مرتبات مصر 2026',
      'مرتبات مصر هذا الشهر',
      'كم باقي على صرف مرتبات مصر',
      'هل مرتبات مصر ثابتة يوم 24',
    ],
    competitors: [
      {
        site: 'مواقع الأخبار الاقتصادية',
        type: 'news',
        focus: ['تاريخ الشهر الحالي', 'عناوين التبكير', 'الخبر السريع'],
        gaps: ['تتقادم سريعاً', 'لا تشرح الفرق بين القاعدة العامة والبيان الشهري'],
      },
      {
        site: 'العدادات المختصرة',
        type: 'countdown',
        focus: ['كم باقي على المرتب', 'تاريخ واحد بسيط'],
        gaps: ['تختزل الواقع في يوم جامد', 'لا تعكس إعلانات وزارة المالية الشهرية'],
      },
      {
        site: 'الجهات الرسمية',
        type: 'official',
        focus: ['الإعلان الشهري', 'الجداول المعلنة', 'التاريخ الفعلي'],
        gaps: ['لا تقدم دائماً صفحة SEO دائمة لسؤال كم باقي', 'البيانات متفرقة حسب الشهر'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى صرف مرتبات مصر {{year}}',
        whyItMatters: 'الاستعلام المباشر الأساسي عن الصفحة.',
      },
      {
        keyword: 'مرتبات مصر هذا الشهر',
        whyItMatters: 'أقوى صيغة عملية عند اقتراب الموعد.',
      },
      {
        keyword: 'هل مرتبات مصر ثابتة يوم 24',
        whyItMatters: 'تغطي أكبر فجوة تفسيرية في النتائج الحالية.',
      },
      {
        keyword: 'وزارة المالية مواعيد صرف المرتبات',
        whyItMatters: 'تربط الصفحة بالمرجع الرسمي الذي يريده المستخدم في النهاية.',
      },
    ],
    keywordGaps: [
      'مرتبات مصر هذا الشهر',
      'هل مرتبات مصر ثابتة يوم 24',
      'وزارة المالية مواعيد صرف المرتبات',
      'هل تتغير مواعيد المرتبات قبل الأعياد',
    ],
    unansweredQuestions: [
      'كيف نوازن بين العداد المرجعي والحقيقة الرسمية الشهرية؟',
      'ما أفضل طريقة لشرح نافذة الصرف من غير تضليل؟',
      'أي عبارة أقوى للمستخدم المصري: مرتبات مصر أم المرتبات الحكومية؟',
    ],
    differentiationIdeas: [
      'التصريح بوضوح أن البيان الشهري هو المرجع النهائي',
      'بناء الصفحة حول سؤال هل الموعد ثابت أم لا',
      'دمج العداد مع التفسير بدل اختيار أحدهما على حساب الآخر',
    ],
    researchNotes:
      'SEO الحقيقي هنا لا يأتي من التظاهر بوجود يوم ثابت، بل من قول الحقيقة بشكل مفيد: هناك مرجع عام، لكن وزارة المالية تعلن المواعيد شهرياً. هذه الصراحة تميز الصفحة عن الأخبار المؤقتة والعدادات المضللة.',
  },
  {
    core: {
      id: 'back-to-school',
      slug: 'back-to-school',
      name: 'الدخول المدرسي في الدول العربية',
      type: 'estimated',
      category: 'school',
      date: '{{year}}-09-20',
    },
    queueOrder: 20,
    sourceAuthority: 'official-announcement',
    seoTitle: 'الدخول المدرسي {{year}} — كم باقي ومواعيد الدراسة عربياً',
    description:
      'موعد الدخول المدرسي {{year}} في الدول العربية مع عداد مباشر، وشرح واضح لسبب اختلاف تواريخ بداية الدراسة بين بلد وآخر وبين المراحل التعليمية.',
    titleTag: 'الدخول المدرسي {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد الدخول المدرسي {{year}} مع عداد دقيق ومقارنة عربية واضحة لمواعيد بداية الدراسة، ولماذا لا يوجد تاريخ واحد نهائي صالح لكل الدول.',
    ogDescription:
      'موعد الدخول المدرسي {{year}} مع عداد مباشر وشرح واضح لاختلاف مواعيد بداية الدراسة بين الدول العربية.',
    h1: 'الدخول المدرسي {{year}} | كم باقي؟',
    primaryKeyword: 'متى الدخول المدرسي {{year}}',
    secondaryKeywords: [
      'كم باقي على الدخول المدرسي {{year}}',
      'مواعيد الدراسة {{year}} في الدول العربية',
      'العودة إلى المدرسة {{year}}',
      'موعد بداية الدراسة {{year}}',
      'هل الدراسة تبدأ في نفس اليوم بكل الدول',
    ],
    longTailKeywords: [
      'متى الدخول المدرسي {{year}}',
      'كم باقي على الدخول المدرسي',
      'مواعيد الدراسة في الدول العربية {{year}}',
      'العودة إلى المدرسة {{year}}',
      'لماذا تختلف مواعيد الدراسة بين الدول العربية',
      'هل الدراسة تبدأ في نفس اليوم بكل الدول',
      'الدخول المدرسي {{nextYear}}',
      'متى يبدأ العام الدراسي في السعودية ومصر والمغرب',
    ],
    keywords: [
      'الدخول المدرسي',
      'العودة إلى المدرسة',
      'بداية العام الدراسي',
      'مواعيد الدراسة',
    ],
    answerSummary:
      'الدخول المدرسي {{year}} لا يملك تاريخاً عربياً واحداً ثابتاً، لأن بداية الدراسة تختلف بين بلد وآخر وبين مرحلة وأخرى. ويستخدم هذا الإدراج يوم {{formattedDate}} مرجعاً تقديرياً لموسم العودة إلى المدارس، مع التنبيه إلى أن التاريخ النهائي قد يتغير بحسب الإعلان الرسمي لكل دولة. ويتبقى على هذا المرجع {{daysRemaining}} يوماً، لكن قيمة الصفحة الحقيقية أنها تشرح سبب الاختلاف بين التقاويم بدلاً من تقديم يوم واحد مضلل للجميع.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'المناسبات المدرسية',
      'طبيعة التاريخ': 'مرجع تقديري لموسم العودة لا موعداً نهائياً للجميع',
      'سبب الاختلاف': 'كل دولة تعتمد تقويماً تعليمياً مختلفاً',
      'أفضل استخدام للصفحة': 'مقارنة عامة ثم الرجوع إلى الصفحة الخاصة بكل بلد',
    },
    aboutEvent: {
      'ما هو الدخول المدرسي؟':
        'الدخول المدرسي هو الموسم الذي تعود فيه الدراسة إلى الانطلاق بعد الإجازة الصيفية، لكنه ليس يوماً موحداً في العالم العربي. ولهذا فإن أفضل صفحة عن الدخول المدرسي ليست تلك التي تقدم يوماً واحداً للجميع، بل الصفحة التي تشرح الاختلاف بين الدول والمراحل وتمنح المستخدم مرجعاً عاماً ثم توجهه إلى التفاصيل الأقرب لبلده.',
      'التاريخ والأصل':
        'يرتبط الدخول المدرسي بالتقويمات التعليمية الرسمية لوزارات التربية والتعليم، ولذلك تختلف بدايته بين أواخر أغسطس ومنتصف سبتمبر بحسب البلد والنظام والمراحل. ويستخدم هذا الإدراج {{formattedDate}} مرجعاً تقديرياً لموسم العودة، لكنه لا يدعي أنه التاريخ النهائي للجميع، لأن هذا النوع من الادعاء هو أكثر ما يضعف نتائج البحث العربية حول الموضوع.',
      'الأهمية والمكانة':
        'تكمن أهمية الصفحة في أنها تمسك نية بحث واسعة جداً: كم باقي على الدراسة؟ متى يبدأ العام الدراسي؟ وما الفرق بين السعودية ومصر والمغرب والكويت والإمارات؟ وهذه أسئلة لا تجيب عنها الصفحات السريعة جيداً لأنها تخلط بين الدول أو تنقل تاريخاً واحداً لكل الأنظمة التعليمية. لذلك تُبنى القيمة هنا على المقارنة الصادقة لا على التبسيط المضلل.',
      'كيف يُحيا هذا اليوم':
        'عملياً يتحول الدخول المدرسي إلى فترة تجهيز واسعة تشمل المستلزمات والزي المدرسي والنقل وروتين النوم والجداول والكتب والمنصات الإلكترونية. ولهذا يبحث الناس عنه قبل موعده بوقت كاف. والصفحة الجيدة لا تعرض العد التنازلي فقط، بل تساعد الأهل والطلاب على فهم موسم العودة وترتيب الأولويات قبل انطلاق العام الدراسي.',
    },
    faq: [
      {
        question: 'متى الدخول المدرسي {{year}}؟',
        answer:
          'الدخول المدرسي {{year}} يختلف بين الدول العربية، لذلك يستخدم هذا الإدراج {{formattedDate}} مرجعاً تقديرياً لموسم العودة إلى المدارس لا موعداً نهائياً صالحاً للجميع.',
      },
      {
        question: 'كم باقي على الدخول المدرسي؟',
        answer:
          'يتبقى على الدخول المدرسي {{daysRemaining}} يوماً وفق المرجع التقديري في العداد أعلى الصفحة. وإذا كنت تريد تاريخاً نهائياً لبلدك فالأدق مراجعة الصفحة الخاصة بذلك البلد أو الإعلان الرسمي.',
      },
      {
        question: 'هل تبدأ الدراسة في نفس اليوم بكل الدول العربية؟',
        answer:
          'لا، لا تبدأ الدراسة في نفس اليوم بكل الدول العربية، لأن كل دولة تعتمد تقويماً تعليمياً مختلفاً وقد تختلف المواعيد أيضاً بين بعض المراحل أو الأنظمة التعليمية.',
      },
      {
        question: 'لماذا تختلف مواعيد الدخول المدرسي بين الدول العربية؟',
        answer:
          'تختلف المواعيد لأن وزارات التعليم تحدد بدايات الدراسة وفق تقاويمها الخاصة والإجازات الوطنية والفصول والامتحانات والعوامل التنظيمية المحلية.',
      },
      {
        question: 'ما أفضل طريقة لاستخدام صفحة الدخول المدرسي؟',
        answer:
          'أفضل استخدام للصفحة هو اعتبارها دليلاً مقارناً يشرح نافذة الموسم العام، ثم الانتقال إلى الصفحة الوطنية الأقرب لبلدك إذا كنت تريد تاريخاً أدق واستعداداً عملياً مباشراً.',
      },
      {
        question: 'كيف أستعد للدخول المدرسي؟',
        answer:
          'الاستعداد للدخول المدرسي يبدأ بمراجعة الموعد الرسمي ثم تجهيز الحقيبة والزي والنقل والجداول وروتين النوم مبكراً، لأن ضغط الأسبوع الأول ينخفض كثيراً حين يبدأ التحضير قبل الموعد بأيام.',
      },
      {
        question: 'متى الدخول المدرسي {{nextYear}}؟',
        answer:
          'الدخول المدرسي {{nextYear}} سيظل أيضاً موسماً تختلف مواعيده بين الدول، لذلك تفيد المقارنة العامة، لكن الجواب النهائي يبقى بيد الجهة التعليمية الرسمية لكل بلد.',
      },
    ],
    engagementContent: [
      {
        text: 'أكثر ضعف في صفحات الدخول المدرسي العربية هو إيهام المستخدم بأن كل الدول تبدأ في التاريخ نفسه.',
        type: 'fact',
        subcategory: 'SERP',
      },
      {
        text: 'إذا كنت تريد تاريخاً نهائياً، ابدأ من هذه الصفحة لفهم الموسم ثم انتقل إلى صفحة بلدك مباشرة.',
        type: 'tip',
        subcategory: 'استخدام',
      },
      {
        text: 'قوة الصفحة هنا في المقارنة الصادقة بين الأنظمة التعليمية لا في اختراع تاريخ واحد لكل الدول.',
        type: 'quote',
        subcategory: 'رسالة',
      },
      {
        text: 'صيغة العودة إلى المدرسة مهمة إلى جانب الدخول المدرسي لأنها تعكس لغة بحث مختلفة عند المستخدم العربي.',
        type: 'tip',
        subcategory: 'SEO',
      },
      {
        text: 'قبل شراء المستلزمات بكثافة، تحقق من الموعد الرسمي لمدرستك أو وزارة التعليم في بلدك.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'الدخول المدرسي ليس يوماً فقط، بل موسم عودة يحتاج إلى روتين وتجهيزات وخطة أسرية.',
        type: 'fact',
        subcategory: 'تخطيط',
      },
    ],
    recurringContext:
      'مواعيد الدخول المدرسي تختلف من بلد إلى آخر ومن مرحلة إلى أخرى، ولذلك لا يقدم جدول السنوات حقيقة واحدة جامدة بقدر ما يقدم نافذة موسمية عامة تساعد على المقارنة والاستعداد المبكر.',
    recurringSourceNote:
      'وفق التقاويم الدراسية الرسمية المعلنة من وزارات التربية والتعليم، ولذلك قد يختلف التاريخ النهائي أو يتغير بإعلان رسمي بحسب البلد أو النظام التعليمي.',
    schemaDescription:
      'مرجع عربي واضح عن الدخول المدرسي {{year}} يشرح اختلاف مواعيد بداية الدراسة بين الدول العربية ويجمع العداد التقديري مع المقارنة العملية.',
    relatedSlugs: [
      'school-start-saudi',
      'school-start-egypt',
      'school-start-morocco',
      'school-start-kuwait',
      'spring-vacation',
      'summer-vacation',
    ],
    aboutParagraphs: [
      'الصفحة مصممة لتجاوب عن سؤال يتكرر كل عام: متى تبدأ الدراسة عربياً، ولماذا لا توجد إجابة واحدة صحيحة لكل الدول.',
      'بدلاً من تقديم تاريخ مضلل، تبني الصفحة قيمة البحث على المقارنة والتوجيه إلى الصفحات الوطنية الأكثر دقة.',
      'هذا النوع من الصراحة يرفع الثقة ويجعل المحتوى أكثر قدرة على منافسة الصفحات السريعة والسطحية.',
    ],
    history:
      'تختلف مواعيد بداية الدراسة في العالم العربي باختلاف التقاويم الرسمية للوزارات والهيئات التعليمية، ولهذا لا يصح اختزال الموسم كله في يوم واحد موحد. وتظهر هذه المشكلة بوضوح في نتائج البحث الحالية، حيث تنقل بعض الصفحات تاريخاً واحداً ثم تترك المستخدم يكتشف الخطأ بنفسه. هنا تأتي فائدة الصفحة المقارنة.',
    significance:
      'الميزة التنافسية للصفحة أنها تحول سؤال كم باقي على الدراسة من سؤال مضلل إلى جواب صادق يشرح الاختلاف ويوجه الباحث إلى الاستخدام الصحيح للمعلومة.',
    details:
      'يستفيد الأهل والطلاب من الصفحة عندما يستخدمونها كبوصلة عامة لموسم العودة، ثم يبنون قراراتهم العملية على الصفحة الوطنية أو الإعلان الرسمي لبلدهم ومدرستهم. بذلك تتحول الصفحة إلى أداة قرار لا إلى عنوان قابل للخطأ.',
    sources: [
      {
        label: 'وزارة التعليم السعودية: التقويم الدراسي للتعليم العام',
        url: 'https://www.moe.gov.sa/ar/mediacenter/MOEnews/Pages/news1-22062024.aspx',
      },
      {
        label: 'وزارة التربية الكويتية: رزنامة الوزارة',
        url: 'https://www.moe.edu.kw/pages/calendar',
      },
      {
        label: 'وزارة التربية والتعليم والتعليم العالي في قطر: اعتماد التقويم الأكاديمي الجديد',
        url: 'https://www.edu.gov.qa/ar/News/Details/14514600',
      },
      {
        label: 'وزارة التربية والتعليم الإماراتية: التقويم الأكاديمي المعتمد',
        url: 'https://www.moe.gov.ae/Ar/MediaCenter/News/Pages/MOE-announces-the-academic-calendar-for-the-next-3-years.aspx',
      },
    ],
    primaryQueries: [
      'متى الدخول المدرسي 2026',
      'كم باقي على الدخول المدرسي',
      'مواعيد الدراسة 2026 في الدول العربية',
      'العودة إلى المدرسة 2026',
    ],
    competitors: [
      {
        site: 'صفحات العد التنازلي العامة',
        type: 'countdown',
        focus: ['كم باقي على الدراسة', 'تاريخ واحد مختصر'],
        gaps: ['تخلط بين الدول', 'لا تشرح الفروق بين الأنظمة التعليمية'],
      },
      {
        site: 'المدونات التعليمية المحلية',
        type: 'guide',
        focus: ['تقويم بلد واحد', 'موعد مدرسة أو دولة بعينها'],
        gaps: ['لا تبني مقارنة عربية', 'لا تحل سؤال المستخدم العام عن الدخول المدرسي'],
      },
      {
        site: 'الجهات الرسمية',
        type: 'official',
        focus: ['التقويم الدراسي الوطني', 'الإعلان النهائي', 'تفاصيل المراحل'],
        gaps: ['متفرقة بين الدول', 'لا تقدم صفحة عربية مقارنة واحدة'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى الدخول المدرسي {{year}}',
        whyItMatters: 'الاستعلام الزمني العام الأوضح.',
      },
      {
        keyword: 'كم باقي على الدخول المدرسي',
        whyItMatters: 'يمسك نية العداد التنازلي اليومية.',
      },
      {
        keyword: 'مواعيد الدراسة في الدول العربية {{year}}',
        whyItMatters: 'يغطي نية المقارنة الواسعة بين الدول.',
      },
      {
        keyword: 'هل الدراسة تبدأ في نفس اليوم بكل الدول',
        whyItMatters: 'يعالج أكبر فجوة تفسيرية في النتائج الحالية.',
      },
    ],
    keywordGaps: [
      'مواعيد الدراسة في الدول العربية',
      'العودة إلى المدرسة',
      'هل الدراسة تبدأ في نفس اليوم بكل الدول',
      'لماذا تختلف مواعيد الدخول المدرسي بين الدول العربية',
    ],
    unansweredQuestions: [
      'كيف نبني صفحة عامة من دون تضليل الباحث بتاريخ واحد؟',
      'ما أقوى صياغة تجمع الدخول المدرسي والعودة إلى المدرسة في نفس الصفحة؟',
      'كيف نحول الصفحة إلى دليل مقارنة حقيقي لا إلى عداد عام فقط؟',
    ],
    differentiationIdeas: [
      'التصريح بأن الصفحة مرجع موسمي مقارن لا تاريخاً نهائياً للجميع',
      'التقاط صيغتي الدخول المدرسي والعودة إلى المدرسة معاً',
      'ربط الصفحة بالصفحات الوطنية المتخصصة لزيادة الثقة والفائدة',
    ],
    researchNotes:
      'أفضلية الصفحة SEO تأتي من الوضوح: لا يوجد يوم عربي واحد للدخول المدرسي. هذه الحقيقة نفسها هي ما يميز الصفحة عن العدادات السريعة ويمنحها قيمة مقارنة عالية.',
  },
  {
    core: {
      id: 'spring-vac',
      slug: 'spring-vacation',
      name: 'عطلة الربيع المدرسية',
      type: 'estimated',
      category: 'school',
      date: '{{year}}-03-29',
    },
    queueOrder: 18,
    sourceAuthority: 'official-announcement',
    seoTitle: 'عطلة الربيع المدرسية {{year}} — كم باقي ومتى تبدأ',
    description:
      'موعد عطلة الربيع المدرسية {{year}} مع عداد مباشر وشرح واضح لكون تواريخ العطلة تختلف بين الدول والأنظمة التعليمية والفصول الدراسية.',
    titleTag: 'عطلة الربيع المدرسية {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد عطلة الربيع المدرسية {{year}} مع عداد دقيق ومقارنة عربية واضحة لمواعيد الإجازة، ولماذا تختلف التواريخ بين بلد وآخر.',
    ogDescription:
      'موعد عطلة الربيع المدرسية {{year}} مع عداد مباشر وشرح واضح لاختلاف تواريخ الإجازة بين الدول العربية.',
    h1: 'عطلة الربيع المدرسية {{year}} | كم باقي؟',
    primaryKeyword: 'متى عطلة الربيع المدرسية {{year}}',
    secondaryKeywords: [
      'كم باقي على عطلة الربيع المدرسية {{year}}',
      'موعد عطلة الربيع المدرسية {{year}}',
      'عطلة الربيع {{year}}',
      'هل عطلة الربيع ثابتة بكل الدول',
      'إجازة الربيع المدارس {{year}}',
    ],
    longTailKeywords: [
      'متى عطلة الربيع المدرسية {{year}}',
      'كم باقي على عطلة الربيع المدرسية',
      'عطلة الربيع {{year}}',
      'لماذا تختلف مواعيد عطلة الربيع بين الدول',
      'هل عطلة الربيع ثابتة بكل الدول',
      'عطلة الربيع المدرسية {{nextYear}}',
      'إجازة الربيع المدارس',
      'موعد إجازة الربيع في المدارس العربية',
    ],
    keywords: [
      'عطلة الربيع',
      'إجازة الربيع',
      'عطلة الربيع المدرسية',
      'إجازات المدارس',
    ],
    answerSummary:
      'عطلة الربيع المدرسية {{year}} لا تبدأ في تاريخ عربي واحد ثابت، لأن كل بلد ونظام تعليمي يضع رزنامته الخاصة. ويستخدم هذا الإدراج يوم {{formattedDate}} مرجعاً تقديرياً لنافذة الإجازة في كثير من الأنظمة، مع التنبيه إلى أن التاريخ النهائي قد يختلف أو يتغير بإعلان رسمي. ويتبقى على المرجع التقديري {{daysRemaining}} يوماً، لكن الفائدة الأكبر هنا هي شرح الاختلاف لا الاكتفاء بعداد عام فقط.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'المناسبات المدرسية',
      'طبيعة التاريخ': 'مرجع تقديري لموسم عطلة الربيع',
      'سبب الاختلاف': 'كل دولة تعتمد تقويماً دراسياً مختلفاً',
      'أفضل استخدام للصفحة': 'مقارنة عامة ثم الرجوع إلى الصفحة الأقرب لبلدك',
    },
    aboutEvent: {
      'ما هو عطلة الربيع المدرسية؟':
        'عطلة الربيع المدرسية هي فترة التوقف القصير التي تأتي بين فصول الدراسة في عدد من الأنظمة التعليمية العربية، لكنها ليست يوماً أو أسبوعاً موحداً في كل الدول. ولهذا تحتاج الصفحة القوية إلى شرح فكرة الموسم العام وإبراز الفروق بين البلدان، لا إلى تقديم تاريخ واحد على أنه الجواب النهائي للجميع.',
      'التاريخ والأصل':
        'ترتبط عطلة الربيع المدرسية بالتقويمات الدراسية الرسمية لكل وزارة أو جهة تعليمية، ولذلك قد تقع في مارس أو أبريل، وقد تختلف مدتها من نظام إلى آخر. ويستخدم هذا الإدراج {{formattedDate}} بوصفه مرجعاً تقديرياً لموسم الإجازة، مع التأكيد على أن التاريخ الفعلي قد يتغير بإعلان رسمي أو يختلف من بلد إلى آخر.',
      'الأهمية والمكانة':
        'تكمن أهمية صفحة عطلة الربيع في أن الأسر والطلاب والمعلمين يبحثون عنها بنية تخطيطية واضحة: السفر القصير، الزيارات، الراحة، الأنشطة، وتنظيم العودة إلى الدراسة. لكن كثيراً من الصفحات العربية لا تشرح لماذا تختلف المواعيد، وهو ما يجعل المقارنة الصادقة نفسها ميزة SEO حقيقية وليست مجرد إضافة تحريرية.',
      'كيف يُحيا هذا اليوم':
        'عملياً تمثل عطلة الربيع مساحة لإعادة ترتيب الجدول الدراسي والنوم والزيارات والأنشطة القصيرة قبل استكمال العام. ولذلك يبحث الناس عنها قبل بدايتها بوقت كاف. والصفحة الأفضل هي التي تساعدهم على فهم الموسم ومقارنته لا التي تمنحهم تاريخاً واحداً قد لا يناسب بلدهم.',
    },
    faq: [
      {
        question: 'متى عطلة الربيع المدرسية {{year}}؟',
        answer:
          'عطلة الربيع المدرسية {{year}} تختلف بين الدول العربية، لذلك يستخدم هذا الإدراج {{formattedDate}} مرجعاً تقديرياً لموسم الإجازة لا موعداً نهائياً صالحاً للجميع.',
      },
      {
        question: 'كم باقي على عطلة الربيع المدرسية؟',
        answer:
          'يتبقى على عطلة الربيع المدرسية {{daysRemaining}} يوماً وفق المرجع التقديري في العداد أعلى الصفحة. وإذا كنت تريد تاريخاً أدق لبلدك فالأفضل مراجعة الإعلان الرسمي أو الصفحة الوطنية المتخصصة.',
      },
      {
        question: 'هل عطلة الربيع ثابتة في كل الدول؟',
        answer:
          'لا، عطلة الربيع المدرسية ليست ثابتة في كل الدول، لأن كل وزارة تعليم أو نظام تعليمي يضع توقيته ومدته بحسب التقويم الدراسي المحلي.',
      },
      {
        question: 'لماذا تختلف مواعيد عطلة الربيع بين الدول؟',
        answer:
          'تختلف المواعيد لأن الإجازة مرتبطة ببنية الفصول والاختبارات والتقويم الدراسي في كل بلد، ولهذا لا يصح اختزالها في يوم واحد موحد لكل الأنظمة.',
      },
      {
        question: 'كيف أستفيد من صفحة عطلة الربيع إذا كانت المواعيد تختلف؟',
        answer:
          'أفضل استخدام للصفحة هو اعتبارها دليلاً عاماً يشرح نافذة الموسم ويقارن بين فكرة الإجازة عبر الأنظمة، ثم الانتقال إلى الصفحة الأقرب لبلدك إذا احتجت إلى تاريخ أدق.',
      },
      {
        question: 'كيف أستعد لعطلة الربيع المدرسية؟',
        answer:
          'الاستعداد لعطلة الربيع يبدأ بتحديد خطة الإجازة مبكراً ثم ترتيب الزيارات أو الأنشطة أو السفر القصير مع الحفاظ على جزء من الروتين الدراسي حتى لا تصبح العودة صعبة بعد الإجازة.',
      },
      {
        question: 'متى عطلة الربيع المدرسية {{nextYear}}؟',
        answer:
          'عطلة الربيع المدرسية {{nextYear}} ستبقى أيضاً موسماً يختلف بين الدول والأنظمة، ولذلك تفيد المقارنة العامة، لكن التاريخ النهائي يبقى بيد الجهة التعليمية الرسمية لكل بلد.',
      },
    ],
    engagementContent: [
      {
        text: 'أكثر ما يضعف صفحات عطلة الربيع هو التعامل مع الإجازة كأنها يوم واحد موحد لكل المدارس العربية.',
        type: 'fact',
        subcategory: 'SERP',
      },
      {
        text: 'إذا كنت تخطط لسفر قصير في عطلة الربيع فابدأ من المقارنة العامة ثم راجع تقويم بلدك قبل الحجز.',
        type: 'tip',
        subcategory: 'تخطيط',
      },
      {
        text: 'قوة الصفحة ليست في التاريخ وحده، بل في شرح لماذا لا يصلح هذا التاريخ لكل بلد أو نظام.',
        type: 'quote',
        subcategory: 'رسالة',
      },
      {
        text: 'صيغة إجازة الربيع مهمة SEO إلى جانب عطلة الربيع المدرسية لأنها تعكس لغة بحث مختلفة عند المستخدم.',
        type: 'tip',
        subcategory: 'SEO',
      },
      {
        text: 'لا تبن خطتك بالكامل على تاريخ عام إذا كانت مدرستك تتبع تقويماً محلياً مختلفاً.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'العطلة القصيرة تصبح أكثر فائدة حين تُستخدم للراحة المنظمة لا للفوضى ثم الصدمة عند العودة.',
        type: 'fact',
        subcategory: 'نصيحة',
      },
    ],
    recurringContext:
      'عطلة الربيع المدرسية ليست تاريخاً موحداً في كل الأنظمة التعليمية، لذلك يقدم جدول السنوات مرجعاً موسمياً عاماً أكثر من كونه تاريخاً نهائياً ثابتاً لكل بلد.',
    recurringSourceNote:
      'وفق التقاويم الدراسية الرسمية المعلنة من وزارات التربية والتعليم، ولذلك قد يختلف التاريخ النهائي أو يتغير بإعلان رسمي بحسب البلد أو النظام التعليمي.',
    schemaDescription:
      'مرجع عربي واضح عن عطلة الربيع المدرسية {{year}} يشرح اختلاف مواعيد الإجازة بين الدول العربية ويجمع العداد التقديري مع المقارنة العملية.',
    relatedSlugs: [
      'back-to-school',
      'spring-season',
      'labor-day',
      'mothers-day',
    ],
    aboutParagraphs: [
      'الصفحة مبنية حول سؤالين أساسيين: متى عطلة الربيع المدرسية، ولماذا تختلف المواعيد بين الدول والأنظمة التعليمية.',
      'وجود صيغتي عطلة الربيع وإجازة الربيع داخل البنية الدلالية يجعل المحتوى أقرب إلى بحث المستخدم الفعلي.',
      'هذه الصفحة لا تدعي يوماً واحداً للجميع، بل تستخدم المقارنة نفسها كعنصر ثقة وتفوق SEO.',
    ],
    history:
      'تختلف عطلة الربيع المدرسية من نظام إلى آخر بحسب بنية الفصول والامتحانات والتقويم المعتمد، ولهذا لا توجد إجابة عربية واحدة تصلح لكل المدارس. وتظهر مشكلة هذا الخلط بوضوح في نتائج البحث، حيث تكرر بعض الصفحات تاريخاً واحداً ثم تترك المستخدم يكتشف التعارض لاحقاً. هنا تأتي فائدة الصفحة الصادقة والمقارنة.',
    significance:
      'الميزة الأساسية SEO هي تحويل سؤال كم باقي على عطلة الربيع من سؤال مضلل إلى جواب مقارن وصادق وأكثر نفعاً للباحث العربي.',
    details:
      'تخدم الصفحة الأهالي والطلاب عندما يستخدمونها لفهم نافذة الموسم العام والتخطيط المسبق، ثم يراجعون التاريخ الرسمي لبلدهم أو مدرستهم قبل اتخاذ قرار نهائي بالحجز أو السفر أو الأنشطة.',
    sources: [
      {
        label: 'وزارة التربية والتعليم الإماراتية: التقويم الأكاديمي المعتمد',
        url: 'https://www.moe.gov.ae/Ar/AboutUs/pages/academiccalendar.aspx',
      },
      {
        label: 'وزارة التربية الكويتية: رزنامة الوزارة',
        url: 'https://www.moe.edu.kw/pages/calendar',
      },
      {
        label: 'وزارة التربية والتعليم والتعليم العالي في قطر: اعتماد التقويم الأكاديمي الجديد',
        url: 'https://www.edu.gov.qa/ar/News/Details/14514600',
      },
    ],
    primaryQueries: [
      'متى عطلة الربيع المدرسية 2026',
      'كم باقي على عطلة الربيع المدرسية',
      'إجازة الربيع المدارس 2026',
      'هل عطلة الربيع ثابتة بكل الدول',
    ],
    competitors: [
      {
        site: 'صفحات العد التنازلي العامة',
        type: 'countdown',
        focus: ['كم باقي على عطلة الربيع', 'يوم مختصر'],
        gaps: ['تخلط بين الدول', 'لا تشرح اختلاف التقاويم'],
      },
      {
        site: 'المدونات التعليمية المحلية',
        type: 'guide',
        focus: ['تقويم بلد واحد', 'إجازة نظام واحد'],
        gaps: ['لا تبني مقارنة عربية عامة', 'لا تجيب عن السؤال الواسع للمستخدم'],
      },
      {
        site: 'الجهات الرسمية',
        type: 'official',
        focus: ['التقويم الوطني', 'تفاصيل الإجازة', 'العودة من العطلة'],
        gaps: ['متفرقة حسب البلد', 'لا توجد صفحة عربية مقارنة واحدة'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى عطلة الربيع المدرسية {{year}}',
        whyItMatters: 'أقوى استعلام مباشر عن الصفحة.',
      },
      {
        keyword: 'كم باقي على عطلة الربيع المدرسية',
        whyItMatters: 'يمسك نية العد التنازلي.',
      },
      {
        keyword: 'هل عطلة الربيع ثابتة بكل الدول',
        whyItMatters: 'يغطي أهم فجوة تفسيرية في النتائج الحالية.',
      },
      {
        keyword: 'إجازة الربيع المدارس {{year}}',
        whyItMatters: 'يلتقط شريحة بحثية موازية لصيغة عطلة الربيع.',
      },
    ],
    keywordGaps: [
      'إجازة الربيع المدارس',
      'هل عطلة الربيع ثابتة بكل الدول',
      'لماذا تختلف مواعيد عطلة الربيع بين الدول',
      'موعد إجازة الربيع في المدارس العربية',
    ],
    unansweredQuestions: [
      'كيف نحافظ على دقة الصفحة من دون الزعم بتاريخ عربي واحد؟',
      'أي صيغة أقوى للمستخدم: عطلة الربيع أم إجازة الربيع؟',
      'ما أفضل طريقة لربط الصفحة بالصفحات الوطنية الأكثر دقة؟',
    ],
    differentiationIdeas: [
      'إبراز المقارنة العربية بدل التاريخ المضلل',
      'التقاط صيغتي عطلة الربيع وإجازة الربيع معاً',
      'بناء الصفحة كدليل موسمي مقارن لا كعداد عام فقط',
    ],
    researchNotes:
      'أفضلية الصفحة تأتي من الصراحة والمقارنة. معظم النتائج العربية حول عطلة الربيع تعطي تاريخاً واحداً بلا تفسير، بينما الباحث يحتاج فعلياً إلى فهم لماذا تختلف الإجازات بين الدول.',
  },
  {
    core: {
      id: 'school-start-kw',
      slug: 'school-start-kuwait',
      name: 'بدء الدراسة في الكويت',
      type: 'fixed',
      category: 'school',
      _countryCode: 'kw',
      month: 9,
      day: 15,
    },
    queueOrder: 56,
    sourceAuthority: 'kuwait-moe-calendar',
    seoTitle: 'بدء الدراسة في الكويت {{year}} — كم باقي والرزنامة المدرسية',
    description:
      'موعد بدء الدراسة في الكويت {{year}} مع عداد مباشر وشرح واضح للرزنامة المدرسية الكويتية، والتنبيه إلى أن بعض المراحل قد تبدأ على مراحل متقاربة.',
    titleTag: 'بدء الدراسة في الكويت {{year}} | كم باقي؟ - ميقات',
    metaDescription:
      'تعرف على موعد بدء الدراسة في الكويت {{year}} مع عداد دقيق، وشرح عربي واضح للرزنامة المدرسية الكويتية وكيف قد تختلف بداية بعض الصفوف أو المراحل بيوم متقارب.',
    ogDescription:
      'موعد بدء الدراسة في الكويت {{year}} مع عداد مباشر وشرح واضح للرزنامة المدرسية الكويتية والعودة إلى المدارس.',
    h1: 'بدء الدراسة في الكويت {{year}} | كم باقي؟',
    primaryKeyword: 'متى بدء الدراسة في الكويت {{year}}',
    secondaryKeywords: [
      'كم باقي على بدء الدراسة في الكويت {{year}}',
      'موعد بدء الدراسة في الكويت {{year}}',
      'الرزنامة المدرسية الكويت {{year}}',
      'متى تبدأ المدارس في الكويت',
      'تقويم وزارة التربية الكويت',
    ],
    longTailKeywords: [
      'متى بدء الدراسة في الكويت {{year}}',
      'كم باقي على بدء الدراسة في الكويت',
      'الرزنامة المدرسية في الكويت',
      'متى تبدأ المدارس في الكويت',
      'هل كل الصفوف تبدأ في نفس اليوم في الكويت',
      'بدء الدراسة في الكويت {{nextYear}}',
      'تقويم وزارة التربية الكويت',
      'العودة إلى المدارس في الكويت',
    ],
    keywords: [
      'بداية الدراسة الكويت',
      'مدارس الكويت',
      'الرزنامة المدرسية الكويت',
      'العودة إلى المدارس الكويت',
    ],
    answerSummary:
      'بدء الدراسة في الكويت {{year}} يظهر في هذا الإدراج يوم {{formattedDate}} بوصفه المرجع الأوضح لبداية الموسم الدراسي، ويتبقى عليه {{daysRemaining}} يوماً. لكن الرزنامة المدرسية الكويتية قد تميز أحياناً بين بدايات بعض الصفوف أو المراحل المتقاربة زمنياً، لذلك تضيف الصفحة السياق العملي الذي يحتاجه ولي الأمر والطالب بدلاً من الاكتفاء بعداد بسيط.',
    quickFacts: {
      الموعد: '{{formattedDate}}',
      'كم يوم باقي': '{{daysRemaining}} يوم',
      الفئة: 'المناسبات المدرسية',
      'المرجع الأساسي': 'رزنامة وزارة التربية الكويتية',
      'ما يهم الأسرة': 'هل تبدأ كل الصفوف في اليوم نفسه أم على مراحل متقاربة',
      'أفضل خطوة عملية': 'مراجعة الرزنامة الرسمية للصف أو المرحلة',
    },
    aboutEvent: {
      'ما هو بدء الدراسة في الكويت؟':
        'بدء الدراسة في الكويت هو الموعد الذي ينطلق فيه العام الدراسي وفق الرزنامة التي تعلنها وزارة التربية. ويبحث الناس عنه لمعرفة اليوم الفعلي للعودة إلى المدارس، لكن الصفحة الأقوى لا تقف عند التاريخ وحده، بل تشرح أيضاً أن بعض الصفوف أو المراحل قد تبدأ في أيام متقاربة لا في يوم واحد مطلق دائماً.',
      'التاريخ والأصل':
        'ترتبط بداية الدراسة في الكويت بالرزنامة الرسمية الصادرة عن وزارة التربية، وهي المرجع الأهم للطلاب وأولياء الأمور والمعلمين. ولذلك فإن معرفة التاريخ المرجعي مهمة، لكن الأهم منها أن يفهم الزائر أن تفاصيل الصفوف والمراحل قد تحتاج مراجعة الرزنامة نفسها، لأن العودة لا تكون دائماً متماثلة لكل الفئات التعليمية في نفس اللحظة.',
      'الأهمية والمكانة':
        'تكمن أهمية الصفحة في أنها تمسك سؤالاً عملياً متكرراً جداً قبل بداية العام الدراسي: متى تبدأ الدراسة في الكويت؟ وهل يبدأ جميع الطلاب في اليوم نفسه؟ وهذه الأسئلة لا تجيب عنها بعض الصفحات القصيرة جيداً لأنها تكرر يوماً واحداً من دون شرح الرزنامة المدرسية. لذلك تضيف الصفحة طبقة الفهم لا طبقة العداد فقط.',
      'كيف يُحيا هذا اليوم':
        'عملياً يبدأ الاستعداد لبدء الدراسة في الكويت بتجهيز المستلزمات وتنظيم النوم ومراجعة المدرسة والنقل والجداول والمنصات، مع متابعة الرزنامة الرسمية إذا اختلفت بداية بعض الصفوف أو المراحل. وهنا تتحول الصفحة إلى أداة استعداد مبكر لا إلى مجرد تاريخ محفوظ.',
    },
    faq: [
      {
        question: 'متى بدء الدراسة في الكويت {{year}}؟',
        answer:
          'بدء الدراسة في الكويت {{year}} يظهر في هذا الإدراج يوم {{formattedDate}} بوصفه المرجع الأوضح لبداية الموسم الدراسي. لكن مراجعة الرزنامة الرسمية تظل ضرورية إذا كانت بعض الصفوف تبدأ على مراحل متقاربة.',
      },
      {
        question: 'كم باقي على بدء الدراسة في الكويت؟',
        answer:
          'يتبقى على بدء الدراسة في الكويت {{daysRemaining}} يوماً. ويحدث العداد أعلى الصفحة تلقائياً حتى يمنحك الوقت المتبقي للاستعداد للعودة.',
      },
      {
        question: 'هل تبدأ كل الصفوف في الكويت في اليوم نفسه؟',
        answer:
          'ليس بالضرورة أن تبدأ كل الصفوف أو المراحل في الكويت في اليوم نفسه تماماً، لأن الرزنامة المدرسية قد تميز أحياناً بين بدايات متقاربة لبعض الفئات التعليمية.',
      },
      {
        question: 'ما هو المرجع الرسمي لموعد بدء الدراسة في الكويت؟',
        answer:
          'المرجع الرسمي لموعد بدء الدراسة في الكويت هو رزنامة وزارة التربية الكويتية، ولذلك يبقى الرجوع إليها هو الخطوة الأدق عند الحاجة إلى تفاصيل الصف أو المرحلة.',
      },
      {
        question: 'كيف أستعد لبدء الدراسة في الكويت؟',
        answer:
          'الاستعداد لبدء الدراسة في الكويت يبدأ بتجهيز المستلزمات والزي والنقل والجداول وروتين النوم، ثم مراجعة الرزنامة الرسمية إذا كانت المرحلة التعليمية تحتاج تاريخاً أدق أو توضيحاً إضافياً.',
      },
      {
        question: 'متى بدء الدراسة في الكويت {{nextYear}}؟',
        answer:
          'بدء الدراسة في الكويت {{nextYear}} سيبقى مرتبطاً بالرزنامة الرسمية الجديدة التي تعلنها وزارة التربية. ولهذا يفيد العداد في التخطيط المبكر، لكن الرزنامة تبقى المرجع النهائي للتأكيد.',
      },
    ],
    engagementContent: [
      {
        text: 'الصفحة الأقوى عن الدراسة في الكويت هي التي تشرح الرزنامة المدرسية، لا التي تكرر يوماً واحداً بلا سياق.',
        type: 'quote',
        subcategory: 'رسالة',
      },
      {
        text: 'وجود سؤال هل تبدأ كل الصفوف في اليوم نفسه يرفع جودة الصفحة لأنه يعالج التباساً عملياً حقيقياً عند الأسر.',
        type: 'fact',
        subcategory: 'نية المستخدم',
      },
      {
        text: 'ابدأ تنظيم النوم والنقل والمستلزمات قبل الموعد بأيام لأن الأسبوع الأول يضغط الأسر أكثر من اليوم نفسه.',
        type: 'tip',
        subcategory: 'استعداد',
      },
      {
        text: 'صيغة الرزنامة المدرسية الكويت مهمة إلى جانب بدء الدراسة في الكويت لأنها تعكس لغة بحث عملية شائعة.',
        type: 'tip',
        subcategory: 'SEO',
      },
      {
        text: 'راجع رزنامة وزارة التربية إذا كان ابنك في صف قد يبدأ قبل بقية المراحل أو بعدها بيوم متقارب.',
        type: 'checklist-item',
        subcategory: 'تحقق',
      },
      {
        text: 'كل دقيقة تقضيها في فهم الرزنامة قبل البداية توفر ارتباكاً أكبر في أول أسبوع دراسي.',
        type: 'fact',
        subcategory: 'فائدة',
      },
    ],
    recurringContext:
      'بداية الدراسة في الكويت تتبع الرزنامة الرسمية المعلنة، وقد تتكرر حول منتصف سبتمبر تقريباً، لكن تفاصيل الصفوف والمراحل قد تحتاج قراءة مباشرة للرزنامة نفسها في كل عام.',
    recurringSourceNote:
      'وفق رزنامة وزارة التربية الكويتية، مع أهمية مراجعة التفاصيل الرسمية لكل صف أو مرحلة إذا كانت البداية موزعة على أيام متقاربة.',
    schemaDescription:
      'مرجع عربي واضح عن بدء الدراسة في الكويت {{year}} يشرح موعد العودة المدرسية والرزنامة الرسمية وإمكانية اختلاف بدايات بعض الصفوف أو المراحل.',
    relatedSlugs: [
      'back-to-school',
      'school-start-qatar',
      'school-start-tunisia',
      'school-start-uae',
    ],
    aboutParagraphs: [
      'الصفحة لا تكتفي بسؤال متى بدء الدراسة في الكويت، بل تضيف السؤال الذي تحتاجه الأسر فعلاً: هل تبدأ كل الصفوف في اليوم نفسه أم على مراحل متقاربة.',
      'إضافة صيغة الرزنامة المدرسية الكويت إلى البنية الدلالية تجعل المحتوى أكثر قرباً من البحث العملي عند أولياء الأمور.',
      'قيمة الصفحة تأتي من شرح طريقة استخدام الموعد، لا من الاكتفاء بعرضه في عداد فقط.',
    ],
    history:
      'ترتبط بداية الدراسة في الكويت بالرزنامة المدرسية التي تعلنها وزارة التربية، وهي وثيقة أكثر فائدة من صفحات العد التنازلي المجردة لأنها تكشف تفاصيل الصفوف والمراحل وبداياتها المتقاربة. ومن هنا تأتي قوة الصفحة: تحويل سؤال الموعد إلى فهم عملي للرزنامة نفسها.',
    significance:
      'الميزة الأساسية SEO هي ربط السؤال المباشر عن بدء الدراسة في الكويت بسؤال الرزنامة المدرسية وتوزيع بدايات الصفوف، وهو ما يحتاجه المستخدم فعلاً.',
    details:
      'إذا كنت ولي أمر أو طالباً في الكويت فالمهم ليس فقط معرفة التاريخ الظاهر في العداد، بل فهم ما إذا كانت مرحلتك تبدأ في اليوم نفسه أو في اليوم التالي أو ضمن توزيع قريب. لذلك تبقى الرزنامة الرسمية أهم جزء في رحلة القرار.',
    sources: [
      {
        label: 'وزارة التربية الكويتية: رزنامة الوزارة',
        url: 'https://www.moe.edu.kw/pages/calendar',
      },
    ],
    primaryQueries: [
      'متى بدء الدراسة في الكويت 2026',
      'كم باقي على بدء الدراسة في الكويت',
      'الرزنامة المدرسية الكويت',
      'متى تبدأ المدارس في الكويت',
    ],
    competitors: [
      {
        site: 'صفحات العد التنازلي العامة',
        type: 'countdown',
        focus: ['كم باقي على الدراسة', 'تاريخ مختصر'],
        gaps: ['لا تشرح الرزنامة الرسمية', 'تغفل اختلاف بعض الصفوف أو المراحل'],
      },
      {
        site: 'الجهة الرسمية',
        type: 'official',
        focus: ['الرزنامة المدرسية', 'تفاصيل الصفوف', 'التاريخ الدقيق'],
        gaps: ['ليست صفحة SEO مباشرة لسؤال كم باقي', 'تحتاج من المستخدم إلى قراءة رزنامة كاملة'],
      },
      {
        site: 'المدونات التعليمية',
        type: 'guide',
        focus: ['العودة إلى المدارس', 'المستلزمات', 'التاريخ الشائع'],
        gaps: ['تكرر الموعد من دون ربطه بالرزنامة المدرسية الكويتية الرسمية'],
      },
    ],
    coverageMatrix: [
      {
        keyword: 'متى بدء الدراسة في الكويت {{year}}',
        whyItMatters: 'نواة الطلب المباشر على الصفحة.',
      },
      {
        keyword: 'كم باقي على بدء الدراسة في الكويت',
        whyItMatters: 'يلتقط نية العد التنازلي.',
      },
      {
        keyword: 'الرزنامة المدرسية الكويت',
        whyItMatters: 'يغطي نية البحث العملية المرتبطة بالمصدر الرسمي.',
      },
      {
        keyword: 'هل تبدأ كل الصفوف في اليوم نفسه في الكويت',
        whyItMatters: 'يعالج أهم التباس عملي عند المستخدم.',
      },
    ],
    keywordGaps: [
      'الرزنامة المدرسية الكويت',
      'هل تبدأ كل الصفوف في اليوم نفسه في الكويت',
      'متى تبدأ المدارس في الكويت',
      'العودة إلى المدارس في الكويت',
    ],
    unansweredQuestions: [
      'كيف نوضح مفهوم التدرج بين الصفوف من دون الجزم بما لم تعلنه الرزنامة الجديدة بعد؟',
      'ما أقوى صياغة تربط الموعد بالرزنامة المدرسية الكويتية؟',
      'كيف نجعل الصفحة مفيدة للأسرة أكثر من الصفحات التي تعرض العد التنازلي فقط؟',
    ],
    differentiationIdeas: [
      'تحويل الرزنامة المدرسية إلى عنصر SEO أساسي لا مجرد مصدر',
      'شرح احتمال التدرج بين بعض الصفوف أو المراحل بلغة واضحة',
      'ربط الموعد بالاستعداد العملي المبكر للأسر والطلاب',
    ],
    researchNotes:
      'القيمة التنافسية هنا واضحة: نتائج البحث السريعة لا تشرح الرزنامة المدرسية الكويتية، بينما المستخدم يحتاجها فعلاً. الصفحة الأقوى هي التي تربط الموعد بالتوزيع العملي للمراحل والصفوف.',
  },
];

export default defineEventBatch(
  configs.map((config) => ({
    slug: config.core.slug,
    apply(current) {
      return {
        package: buildPackage(config, current.pkg),
        research: buildResearch(config, current.research),
        qa: buildQa(config, current.qa),
      };
    },
  })),
);
