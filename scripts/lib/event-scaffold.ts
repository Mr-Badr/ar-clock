import { buildAuthoringFaqContent } from '../../src/lib/holidays/faq-normalizer.js';
import { normalizeIslamicRichContentYears } from '../../src/lib/islamic-year-format.js';

export type EventType = 'hijri' | 'fixed' | 'estimated' | 'monthly' | 'easter' | 'floating';
export type EventCategory =
  | 'islamic'
  | 'national'
  | 'school'
  | 'holidays'
  | 'astronomy'
  | 'social'
  | 'business'
  | 'support';

type EventCoreLike = {
  slug: string;
  name: string;
  type: EventType;
  category: EventCategory;
  _countryCode?: string | null;
};

type RelatedEntry = {
  slug: string;
  category: string;
  queueOrder?: number;
};

type FaqEntry = {
  question: string;
  answer: string;
};

type RichContentScaffold = {
  seoTitle: string;
  description: string;
  keywords: string[];
  answerSummary: string;
  quickFacts: Record<string, string>;
  aboutEvent: Record<string, string>;
  faq: FaqEntry[];
  intentCards: Array<Record<string, any>>;
  engagementContent: Array<Record<string, any>>;
  seoMeta: Record<string, any>;
  recurringYears: Record<string, any>;
  schemaData: Record<string, any>;
  relatedSlugs: string[];
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  islamic: 'المناسبات الإسلامية',
  national: 'الأعياد الوطنية',
  school: 'المناسبات المدرسية',
  holidays: 'الإجازات الرسمية',
  astronomy: 'فلكية وطبيعية',
  social: 'المناسبات الاجتماعية والعالمية',
  business: 'مناسبات الأعمال',
  support: 'برامج ومواعيد الدعم',
};

const CATEGORY_TITLE_MODIFIERS: Record<EventCategory, string> = {
  islamic: 'العد التنازلي',
  national: 'كم باقي؟',
  school: 'متى يبدأ؟',
  holidays: 'خطط لإجازتك',
  astronomy: 'متى وكيف؟',
  social: 'الموعد والمعنى',
  business: 'العد التنازلي',
  support: 'موعد الاستحقاق',
};

const CATEGORY_INTENT_CARDS: Record<EventCategory, [string, string, string][]> = {
  islamic: [
    ['🌙', 'استعداد روحي', 'تابع الاستعداد الروحي والخطة اليومية للمناسبة.'],
    ['🛒', 'تجهيزات مهمة', 'اجمع الاحتياجات الأساسية قبل اقتراب الموعد.'],
    ['💌', 'رسائل وتهاني', 'جهّز نصوص المشاركة والتهاني المناسبة.'],
    ['🗓️', 'خطة الأيام', 'رتّب الأيام المهمة والمهام المرتبطة بالمناسبة.'],
  ],
  national: [
    ['🏳️', 'فعاليات قريبة', 'استكشف الفعاليات والأنشطة المرتبطة بالمناسبة.'],
    ['📸', 'مشاركة الصور', 'حضّر أفكار المشاركة الاجتماعية والتوثيق.'],
    ['🎉', 'أفكار احتفال', 'اختر طريقة مناسبة للاحتفال مع العائلة أو الأصدقاء.'],
    ['🛍️', 'تجهيزات اليوم', 'أضف اللوازم والزينة والاحتياجات العملية.'],
  ],
  school: [
    ['🎒', 'قائمة مستلزمات', 'أنشئ قائمة واضحة للمستلزمات قبل بداية الموعد.'],
    ['⏰', 'روتين يومي', 'رتّب وقت النوم والاستيقاظ والاستعداد المسبق.'],
    ['👨‍👩‍👧‍👦', 'نصائح للأهل', 'أضف خطوات عملية لتخفيف ضغط البداية.'],
    ['📚', 'خطة دراسية', 'جهّز أهداف البداية والمهام الأساسية.'],
  ],
  holidays: [
    ['✈️', 'خطة سفر', 'أضف أفكار الرحلات أو التنقلات أو الحجوزات.'],
    ['🏡', 'أنشطة عائلية', 'اختر أنشطة مناسبة للاستفادة من الإجازة.'],
    ['💸', 'عروض موسمية', 'تابع العروض والخيارات المناسبة للفترة.'],
    ['🧳', 'قائمة تجهيز', 'جهّز احتياجات الفترة قبل بداية الموعد.'],
  ],
  astronomy: [
    ['🔭', 'أفضل وقت', 'تعرّف على أفضل توقيت للمشاهدة أو المتابعة.'],
    ['📍', 'أفضل مكان', 'اختر المواقع الأنسب للرصد أو المتابعة.'],
    ['🧪', 'حقيقة علمية', 'تابع الحقائق العلمية الأساسية حول الحدث.'],
    ['📸', 'تصوير الحدث', 'استفد من نصائح الرصد أو التصوير.'],
  ],
  social: [
    ['🌍', 'خلفية ومعنى', 'افهم أصل المناسبة ومعناها قبل مشاركتها.'],
    ['💡', 'أفكار مشاركة', 'حوّل المناسبة إلى مشاركة مفيدة أو نشاط بسيط.'],
    ['📚', 'معلومة موثوقة', 'ابن المحتوى على مصدر واضح وسياق مفهوم.'],
    ['🗓️', 'استعداد مبكر', 'جهّز الرسالة أو النشاط قبل الموعد بوقت مناسب.'],
  ],
  business: [
    ['📊', 'خطة تنفيذ', 'حوّل الموعد إلى خطة عملية قابلة للتنفيذ.'],
    ['🧰', 'أدوات العمل', 'أضف الأدوات أو القوالب أو المستندات المناسبة.'],
    ['👥', 'اجتماع سريع', 'جهّز متابعة مختصرة مع الفريق أو المعنيين.'],
    ['✅', 'قائمة إنجاز', 'تابع الخطوات الأساسية على شكل checklist.'],
  ],
  support: [
    ['✅', 'تحقق من الاستحقاق', 'راجع الشرط أو الأهلية أو الموعد الرسمي بوضوح.'],
    ['🏦', 'متابعة الإيداع', 'اعرف أين تتحقق من وصول المبلغ أو التحديث الرسمي.'],
    ['📣', 'مصدر موثوق', 'فرّق بين الموعد الصحيح والإشاعات المتداولة.'],
    ['🧾', 'خطوات سريعة', 'احتفظ بخطوات الاستعلام أو الشكوى أو التحديث في مكان واحد.'],
  ],
};

function toPlainText(value: unknown) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstNonEmpty(...values: Array<unknown>) {
  return values
    .map((value) => toPlainText(value))
    .find(Boolean) || '';
}

export function hasData(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function buildQuickFacts(category: EventCategory, type: EventType) {
  const facts: Record<string, string> = {
    الموعد: '{{formattedDate}}',
    'يوم الأسبوع': 'يُحتسب تلقائياً',
    'كم يوم باقي': '{{daysRemaining}} يوم',
    الفئة: CATEGORY_LABELS[category],
  };

  if (type === 'hijri') facts['التاريخ الهجري'] = '{{hijriDate}}';
  if (category === 'islamic') facts['إجازة رسمية في'] = 'تختلف حسب الدولة والجهة الرسمية المعتمدة';
  if (category === 'national') facts['إجازة رسمية في'] = 'يُراجع القرار الرسمي حسب الجهة أو الدولة';
  if (category === 'school') facts['التقويم الدراسي'] = 'بحسب إعلان الجهة التعليمية المعتمدة';
  if (category === 'astronomy') facts['مناطق الرؤية'] = 'تختلف بحسب الموقع والظروف الفلكية';
  if (category === 'social') facts['المرجعية'] = 'تُراجع الجهة الدولية أو الثقافية المرتبطة بالمناسبة';
  if (category === 'business') facts['يتكرر كل'] = 'بحسب الدورة الزمنية أو التنظيمية';
  if (category === 'support') facts['الجهة المسؤولة'] = 'بحسب الجهة الرسمية أو البرنامج المعتمد';

  return facts;
}

export function buildIntentCards(category: EventCategory) {
  return CATEGORY_INTENT_CARDS[category].map(([icon, title, description], index) => ({
    icon,
    title,
    description,
    ctaText: 'المزيد',
    ctaHref: `#intent-slot-${index + 1}`,
    isAffiliate: false,
  }));
}

export function buildAboutEvent(
  core: EventCoreLike,
  seed: Record<string, unknown> = {},
) {
  const genericWhat = `إذا كنت تبحث عن موعد ${core.name} بالضبط، فهذه الصفحة تعطيك الجواب مباشرة أولاً، ثم تشرح لك كل ما تحتاج معرفته للاستعداد له بثقة.`;
  const genericHistory =
    core.type === 'hijri'
      ? `موعد ${core.name} يتحدد بالتقويم الهجري القمري، ولهذا تلاحظ أنه يتحرك في تقويمك الميلادي كل سنة وفق الحساب والتقويم المعتمد أو الإعلان الرسمي.`
      : core.type === 'estimated'
        ? `موعد ${core.name} يعتمد على قرار أو إعلان رسمي أو تنظيمي، لذلك قد يختلف قليلاً من سنة لأخرى بحسب الجهة المسؤولة عن اعتماده — تابع التحديثات هنا لتبقى على اطلاع.`
        : core.type === 'floating'
          ? `موعد ${core.name} يتبع قاعدة تقويمية سنوية متحركة، مثل تكراره في أسبوع محدد من الشهر أو بعد مناسبة أخرى معروفة، فلا تعتمد على نفس رقم اليوم كل سنة.`
        : `موعد ${core.name} ثابت في تقويمك كل سنة، ما يجعل متابعته مفيدة لتخطيط وقتك والاستعداد له مبكراً.`;
  const genericImportance = `${core.name} يهمك لأنه يرتبط بأشياء تخطط لها فعلاً، ولهذا نجمع لك هنا موعده الدقيق وسياقه وما عليك فعله قبله وخلاله وبعده في مكان واحد.`;
  const genericHow = `تابع العداد أعلى الصفحة لمعرفة الوقت المتبقي بدقة، وجهّز مسبقاً أي متطلبات عملية ترتبط بالمناسبة، وراجع الجهة الرسمية أو المصدر المعتمد كلما اقترب الموعد.`;

  return {
    [`ما هو ${core.name}؟`]: firstNonEmpty(
      seed.aboutWhat,
      seed.aboutParagraphs,
      seed.description,
      genericWhat,
    ),
    'التاريخ والأصل': firstNonEmpty(seed.history, genericHistory),
    'الأهمية والمكانة': firstNonEmpty(seed.significance, seed.description, genericImportance),
    'كيف يُحيا هذا اليوم': firstNonEmpty(seed.details, seed.aboutParagraphs, genericHow),
  };
}

export function buildRecurringYears(type: EventType, name: string) {
  const contextParagraph =
    type === 'hijri'
      ? `يتغير موعد ${name} كل عام ميلادي لأنه يعتمد على التقويم الهجري القمري، لذلك يتقدم عادة بنحو 10 إلى 11 يوماً في كل سنة ميلادية.`
      : type === 'estimated'
        ? `قد يتغير موعد ${name} من عام إلى آخر بحسب القرار الرسمي أو الجهة المنظمة، لذلك يفيد جدول السنوات في متابعة الإعلانات وتقدير النمط الزمني للمناسبة.`
        : type === 'floating'
          ? `يتغير تاريخ ${name} داخل التقويم الميلادي من سنة إلى أخرى لأنه يتبع قاعدة سنوية متحركة مرتبطة بيوم الأسبوع داخل الشهر، لا يوماً ثابتاً من الشهر نفسه.`
        : `موعد ${name} ثابت عادة في التاريخ نفسه كل عام، لذلك يساعد جدول السنوات على معرفة توافقه مع أيام الأسبوع وسياق الموسم.`;

  return {
    contextParagraph,
    sourceNote: 'يُراجع المصدر الرسمي أو الجهة المنظمة لتأكيد الموعد النهائي.',
    columns: ['السنة', 'التاريخ', 'ملاحظة'],
    highlightCurrentYear: true,
  };
}

export function buildEngagementContent(name: string) {
  return [
    { text: `تابع ${name} مبكراً حتى يكون استعدادك أفضل وأكثر هدوءاً.`, type: 'fact', subcategory: 'معلومة' },
    { text: `جهّز أهم خطواتك ومواعيدك المرتبطة بـ${name} في قائمة واحدة قبل الموعد.`, type: 'tip', subcategory: 'استعداد' },
    { text: `معرفتك بموعد ${name} بدقة تساعدك على التخطيط المبكر وتجنب ضغط اللحظات الأخيرة.`, type: 'fact', subcategory: 'فائدة' },
    { text: `شارك موعد ${name} مع من يهمه الأمر حتى تستعدوا معاً في الوقت المناسب.`, type: 'quote', subcategory: 'مشاركة' },
    { text: `راجع التفاصيل الرسمية المرتبطة بـ${name} كلما اقترب الموعد.`, type: 'checklist-item', subcategory: 'قائمة' },
    { text: `ابدأ استعدادك لـ${name} بخطوة واحدة واضحة، ثم أضف بقية التفاصيل تدريجياً.`, type: 'tip', subcategory: 'نصيحة' },
  ];
}

export function buildFaq(name: string) {
  return [
    {
      question: `متى ${name} {{year}}؟`,
      answer: `${name} {{year}} يوافق {{formattedDate}} تقريباً. يعتمد الموعد النهائي على نوع المناسبة والجهة التي تُعلنها أو تعتمدها.`,
    },
    {
      question: `كم باقي على ${name} {{year}}؟`,
      answer: `يتبقى أمامك {{daysRemaining}} يوماً على ${name} {{year}}. تابع العداد التنازلي أعلى الصفحة لمعرفة الوقت المتبقي بدقة قبل الموعد.`,
    },
    {
      question: `ما هو ${name}؟`,
      answer: `إذا كنت لا تعرف تفاصيل ${name} بعد، فهذه الصفحة تشرح لك موعده وسياقه وما يرتبط به من معلومات أساسية، بحسب طبيعته الدينية أو الوطنية أو العملية.`,
    },
    {
      question: `تاريخ ${name} {{year}}؟`,
      answer: `تجد تاريخ ${name} {{year}} هنا بصيغة واضحة مع اليوم المقابل والعد التنازلي، فلا تحتاج للعودة إلى نتائج البحث مرة أخرى.`,
    },
    {
      question: `كيف أستعد لـ${name}؟`,
      answer: `ابدأ استعدادك لـ${name} بمعرفة الموعد الرسمي بدقة، ثم جهّز الخطوات العملية أو التنظيمية أو التعبدية المرتبطة بالمناسبة بحسب طبيعتها.`,
    },
    {
      question: `هل ${name} إجازة رسمية؟`,
      answer: `تعتمد صفة الإجازة الرسمية في ${name} على دولتك أو جهة عملك أو قطاعك. راجع الإعلان الرسمي إذا كانت الإجازة جزءاً مهماً من خطتك.`,
    },
    {
      question: `متى ${name} {{nextYear}}؟`,
      answer: `يبقى موعد ${name} {{nextYear}} مرتبطاً بالنمط الزمني نفسه للمناسبة، وسنحدّث لك التأكيد النهائي هنا فور صدور التقويم أو الإعلان الرسمي.`,
    },
    {
      question: `ما أهمية ${name}؟`,
      answer: `يهمك ${name} لأنه موعد متكرر يرتبط بأشياء تخطط لها فعلاً، ومعرفة تفاصيله تساعدك على التخطيط الصحيح والاستفادة من المناسبة بشكل أفضل.`,
    },
  ];
}

export function buildSeoMeta(core: EventCoreLike, nowIso: string) {
  const modifier = CATEGORY_TITLE_MODIFIERS[core.category];
  return {
    titleTag: `${core.name} {{year}} | ${modifier} - ميقاتنا`,
    metaDescription: `تعرف على موعد ${core.name} {{year}} مع عد تنازلي دقيق ومحتوى عربي شامل وسريع التحديث.`,
    h1: `${core.name} {{year}} | ${modifier}`,
    canonicalPath: `/holidays/${core.slug}`,
    ogTitle: `${core.name} {{year}} | كم باقي؟`,
    ogDescription: `موعد ${core.name} {{year}} مع عد تنازلي دقيق ومعلومات سريعة ومحتوى عربي منظم.`,
    ogImageAlt: `${core.name} {{year}} — {{formattedDate}}`,
    primaryKeyword: `متى ${core.name} {{year}}`,
    secondaryKeywords: [
      `${core.name} {{year}}`,
      `كم باقي على ${core.name} {{year}}`,
      `موعد ${core.name} {{year}}`,
      `تاريخ ${core.name} {{year}}`,
      `متى ${core.name} {{nextYear}}`,
      `${core.name} العد التنازلي`,
      `${core.name} متى`,
    ],
    longTailKeywords: [
      `متى ${core.name} {{year}}`,
      `كم باقي على ${core.name} {{year}}`,
      `تاريخ ${core.name} {{year}}`,
      `موعد ${core.name} {{year}}`,
      `${core.name} {{nextYear}}`,
      `هل ${core.name} إجازة رسمية`,
      `كيف أستعد لـ${core.name}`,
      `ما هو ${core.name}`,
      `أهمية ${core.name}`,
      `لماذا يبحث الناس عن ${core.name}`,
      `${core.name} التاريخ والموعد`,
      `${core.name} العد التنازلي`,
    ],
    datePublished: nowIso,
    dateModified: nowIso,
    inLanguage: 'ar',
    eventCategory: core.category,
  };
}

export function buildSchemaData(core: EventCoreLike) {
  return {
    eventName: `${core.name} {{year}}`,
    eventAlternateName: '',
    startDate: '{{year}}-01-01',
    endDate: '{{year}}-01-01',
    eventDescription: `تعرف على موعد ${core.name} بدقة، وافهم سياقه، واستعد له من خلال معلومات واضحة ومحدثة.`,
    breadcrumbs: [
      { name: 'الرئيسية', path: '/' },
      { name: 'المناسبات', path: '/holidays' },
      { name: core.name, path: `/holidays/${core.slug}` },
    ],
    articleHeadline: `${core.name} {{year}} — العد التنازلي والمعلومات الكاملة`,
  };
}

export function buildKeywordTemplateSet(name: string) {
  return {
    base: [
      `متى ${name} {{year}}`,
      `كم باقي على ${name} {{year}}`,
      `موعد ${name} {{year}}`,
      `تاريخ ${name} {{year}}`,
    ],
    country: [
      `متى ${name} في {{countryName}} {{year}}`,
      `${name} في {{countryName}} {{year}}`,
      `كم باقي على ${name} في {{countryName}} {{year}}`,
      `موعد ${name} في {{countryName}} {{year}}`,
    ],
  };
}

export function buildBaseKeywords(core: EventCoreLike) {
  return [
    `متى ${core.name} {{year}}`,
    `كم باقي على ${core.name} {{year}}`,
    `موعد ${core.name} {{year}}`,
    `${core.name} {{year}}`,
    `تاريخ ${core.name} {{year}}`,
    `متى ${core.name} {{nextYear}}`,
  ];
}

export function buildRichContentScaffold(core: EventCoreLike, nowIso: string): RichContentScaffold {
  const faq = buildFaq(core.name);
  const aboutEvent = buildAboutEvent(core);
  const scaffold = buildAuthoringFaqContent({
    seoTitle: `متى ${core.name} {{year}} — عد تنازلي دقيق`,
    description: `تعرف على موعد ${core.name} {{year}} مع عد تنازلي دقيق ومحتوى عربي منظم.`,
    keywords: buildBaseKeywords(core),
    answerSummary: `${core.name} {{year}} يقع في {{formattedDate}}. يتبقى على هذه المناسبة {{daysRemaining}} يوماً. تمثل هذه الصفحة مرجعاً سريعاً لمعرفة الموعد وأهم المعلومات المرتبطة بها.`,
    quickFacts: buildQuickFacts(core.category, core.type),
    aboutEvent,
    faq,
    intentCards: buildIntentCards(core.category),
    engagementContent: buildEngagementContent(core.name),
    seoMeta: buildSeoMeta(core, nowIso),
    recurringYears: buildRecurringYears(core.type, core.name),
    schemaData: buildSchemaData(core),
    relatedSlugs: [],
  }) as RichContentScaffold;

  return core.category === 'islamic'
    ? normalizeIslamicRichContentYears(scaffold, { eventName: core.name }) as RichContentScaffold
    : scaffold;
}

export function suggestRelatedSlugs(current: RelatedEntry, allEntries: RelatedEntry[]) {
  const byDistance = (a: RelatedEntry, b: RelatedEntry) => {
    const currentQueue = current.queueOrder || Number.MAX_SAFE_INTEGER;
    const aQueue = a.queueOrder || Number.MAX_SAFE_INTEGER;
    const bQueue = b.queueOrder || Number.MAX_SAFE_INTEGER;
    const distA = Math.abs(aQueue - currentQueue);
    const distB = Math.abs(bQueue - currentQueue);
    if (distA !== distB) return distA - distB;
    return a.slug.localeCompare(b.slug);
  };

  const sameCategory = allEntries
    .filter((entry) => entry.slug !== current.slug && entry.category === current.category)
    .sort(byDistance);
  const otherCategories = allEntries
    .filter((entry) => entry.slug !== current.slug && entry.category !== current.category)
    .sort(byDistance);

  return Array.from(new Set([...sameCategory, ...otherCategories].map((entry) => entry.slug))).slice(0, 4);
}
