import { getCountryByCode } from '../../src/lib/events/country-dictionary.js';
import {
  buildAboutEvent,
  buildBaseKeywords,
  buildEngagementContent,
  buildFaq,
  buildIntentCards,
  buildQuickFacts,
  buildRecurringYears,
  buildSchemaData,
  buildSeoMeta,
  suggestRelatedSlugs,
  type EventCategory,
  type EventType,
} from './event-scaffold';

type EventCoreLike = {
  slug: string;
  name: string;
  type: EventType;
  category: EventCategory;
  _countryCode?: string | null;
};

type PackageLike = {
  core: EventCoreLike;
  countryScope?: string;
  queueOrder?: number;
  richContent?: Record<string, any>;
};

type RelatedEntry = {
  slug: string;
  category: string;
  queueOrder?: number;
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  islamic: 'المناسبات الإسلامية',
  national: 'الأعياد الوطنية',
  school: 'المناسبات المدرسية',
  holidays: 'الإجازات الرسمية',
  astronomy: 'فلكية وطبيعية',
  business: 'مناسبات الأعمال',
  support: 'الدعم الاجتماعي',
};

const EVENT_CONTEXT: Record<string, { descriptor: string; importance: string; practice: string; history: string }> = {
  ramadan: {
    descriptor: 'شهر الصيام والقرآن والعبادات اليومية',
    importance: 'يرتبط بالصيام والتراويح والصدقة وارتفاع الطلب على معرفة بداية الشهر ونهايته بدقة.',
    practice: 'يُستقبل عادة بتنظيم أوقات الصيام والعبادة والسحور والإفطار ومتابعة الإعلان الرسمي لبداية الشهر.',
    history: 'يبدأ بدخول شهر رمضان في التقويم الهجري، ويُعتمد الموعد النهائي وفق الجهة الرسمية أو الرؤية المعتمدة.',
  },
  'eid-al-fitr': {
    descriptor: 'عيد ختام رمضان وزكاة الفطر وصلاة العيد',
    importance: 'يرتبط بصلاة العيد وإخراج زكاة الفطر والزيارات العائلية، لذلك يتكرر البحث عن الموعد والإجازة والاستعدادات المرتبطة به.',
    practice: 'يُحييه الناس بصلاة العيد والتكبير والتهاني والزيارات وتنظيم زكاة الفطر قبل الصلاة وفق الضوابط المعروفة.',
    history: 'يأتي مع دخول شهر شوال بعد انتهاء رمضان، وقد يختلف الإعلان النهائي وفق الرؤية أو الجهة الرسمية في كل دولة.',
  },
  'eid-al-adha': {
    descriptor: 'عيد النحر وموسم الأضاحي',
    importance: 'يرتبط بالحج والأضاحي وصلاة العيد والإجازات الطويلة، لذلك يحتاج الزائر إلى معرفة الموعد بدقة وما يرتبط به من أحكام واستعدادات.',
    practice: 'تظهر أهميته العملية في متابعة يوم عرفة وصلاة العيد ووقت ذبح الأضحية والإعلانات الرسمية المتعلقة بالإجازة.',
    history: 'يرتبط بالعاشر من ذي الحجة في التقويم الهجري، ويُعلن تاريخه النهائي وفق الجهة الرسمية المعتمدة للحج والرؤية.',
  },
  'day-of-arafa': {
    descriptor: 'يوم الوقوف بعرفة وصيام غير الحاج',
    importance: 'تزداد أهميته لارتباطه بالحج وصيام يوم عرفة والأسئلة المتكررة حول التاريخ والفضل والفرق بينه وبين عيد الأضحى.',
    practice: 'يتابعه الزوار لمعرفة موعد الوقوف بعرفة وصيام اليوم لغير الحاج وترتيب الأعمال المرتبطة به قبل عيد الأضحى مباشرة.',
    history: 'يقع في التاسع من ذي الحجة ويُحدد وفق التقويم الهجري والإعلان الرسمي، لذلك قد تختلف نتيجته النهائية من بلد لآخر.',
  },
  'hajj-season': {
    descriptor: 'موسم مناسك الحج والتنظيمات المرتبطة به',
    importance: 'ترتفع أهميته بسبب ارتباطه بالحج والسفر والتصاريح والتنظيمات والمواعيد الشرعية والتنفيذية التي يتابعها المسلمون مبكراً.',
    practice: 'يُتابَع لمعرفة بداية الموسم، المراحل الزمنية المهمة، والتنبيهات الرسمية المتعلقة بالمناسك والتنظيم.',
    history: 'يرتبط بشهر ذي الحجة ومناسك الحج، ويخضع في توقيته العملي للإعلان الرسمي والبرامج التنظيمية المعتمدة.',
  },
  mawlid: {
    descriptor: 'ذكرى المولد النبوي الشريف',
    importance: 'يهتم الزوار بمعرفة تاريخ المناسبة، وضع الإجازة، وطبيعة إحيائها في الدول والمجتمعات المختلفة.',
    practice: 'يُتداول موعده مع أسئلة حول الإجازة والمظاهر الاجتماعية أو الدينية المرتبطة به بحسب الدولة والمرجع المحلي.',
    history: 'يرتبط بذكرى مولد النبي محمد صلى الله عليه وسلم في التقويم الهجري، وقد تختلف طريقة إعلانه وإحيائه من بلد إلى آخر.',
  },
  'laylat-al-qadr': {
    descriptor: 'ليلة مباركة من العشر الأواخر في رمضان',
    importance: 'يرتفع الطلب عليها بسبب فضلها الكبير وارتباطها بالتحري والعبادة والدعاء والاعتكاف في الليالي الوترية.',
    practice: 'يبحث الزوار عن تاريخها المتوقع، لكن التعامل الصحيح يكون بتحريها في العشر الأواخر وعدم حصرها في تاريخ نهائي واحد.',
    history: 'ترتبط بليلة مباركة من رمضان ولا يُجزم بليلة واحدة ثابتة كل عام، لذلك يجب التنبيه دائماً إلى أن التحري هو الأصل.',
  },
  'saudi-national-day': {
    descriptor: 'المناسبة الوطنية المرتبطة بذكرى توحيد المملكة',
    importance: 'يزداد البحث عنها لمعرفة الإجازة والفعاليات والعروض والهوية البصرية الوطنية المرتبطة باليوم.',
    practice: 'يتابع الناس تاريخ المناسبة والإعلانات الرسمية الخاصة بالإجازة والاحتفال والفعاليات في المدن المختلفة.',
    history: 'ترتبط بذكرى توحيد المملكة العربية السعودية، ويكون الإعلان عن تفاصيل اليوم والبرامج المصاحبة عبر الجهات الرسمية.',
  },
  'thanaweya-results': {
    descriptor: 'إعلان نتائج الثانوية العامة',
    importance: 'ترتبط بخطوات مصيرية مثل التنسيق والتظلمات واختيار المرحلة التالية، لذلك يكون الطلب عليها مرتفعاً جداً.',
    practice: 'يتابع الطلاب والأسر منصات الإعلان الرسمية ورقم الجلوس وموعد النشر المعتمد لتجنب الروابط غير الرسمية.',
    history: 'يأتي موعدها بعد انتهاء التصحيح ورصد الدرجات واعتماد النتيجة من الجهة التعليمية المختصة.',
  },
  'bac-results-algeria': {
    descriptor: 'إعلان نتائج البكالوريا في الجزائر',
    importance: 'ترتبط بالاستعلام الرسمي والتوجيه الجامعي والتظلمات، لذلك يزداد البحث عنها بقوة مع اقتراب الإعلان.',
    practice: 'أفضل طريقة للاستفادة من الصفحة هي متابعة التاريخ المتوقع ثم الرجوع إلى الجهة الرسمية فور فتح نتائج الطلاب.',
    history: 'يعتمد موعدها على انتهاء أعمال التصحيح والمراجعة والاعتماد الرسمي من الجهة التعليمية المختصة في الجزائر.',
  },
};

const SCHOOL_CONTEXT: Record<string, { authority: string; preparation: string; nuance: string; focus: string }> = {
  'school-start-egypt': {
    authority: 'وزارة التربية والتعليم والتعليم الفني',
    preparation: 'الزي المدرسي والكتب والجداول وحركة النقل',
    nuance: 'يرتبط الموعد غالباً بترتيبات المدارس الحكومية والخاصة معاً.',
    focus: 'كما يتكرر البحث في مصر عن مواعيد المدارس الحكومية والخاصة والدروس والتنظيم اليومي للأسرة مع بداية العام.',
  },
  'school-start-algeria': {
    authority: 'وزارة التربية الوطنية',
    preparation: 'الكتب المدرسية والنقل المدرسي وتوزيع الأقسام',
    nuance: 'الاهتمام هنا كبير لأن العودة تترافق مع ترتيبات إدارية واسعة داخل المؤسسات التعليمية.',
    focus: 'وفي الجزائر يرتبط الدخول المدرسي أيضاً بتوزيع الأقسام واستلام الكتب والانطلاق المنظم داخل المؤسسات التربوية.',
  },
  'school-start-morocco': {
    authority: 'وزارة التربية الوطنية والتعليم الأولي والرياضة',
    preparation: 'الدخول المدرسي واللوازم وبرامج الدعم والانطلاق التدريجي',
    nuance: 'الزوار يبحثون كثيراً عن تاريخ الدخول المدرسي وربطه بتنظيم الأسرة والأنشطة الموازية.',
    focus: 'ويظهر في المغرب مصطلح الدخول المدرسي بكثرة، لذلك يحتاج الزائر إلى نص يربط الموعد بالتقويم الرسمي والاستعداد الأسري والمستلزمات.',
  },
  'school-start-uae': {
    authority: 'وزارة التربية والتعليم والجهات التعليمية المحلية',
    preparation: 'الحقائب والزي والمنصات المدرسية وتنظيم النقل',
    nuance: 'تزداد الأسئلة حول المدارس الحكومية والخاصة والتقويم المعتمد في الإمارات.',
    focus: 'وفي الإمارات يهتم المستخدمون غالباً بالتقويم الأكاديمي وتاريخ العودة الفعلية للمدارس الحكومية والخاصة في وقت واحد.',
  },
  'school-start-tunisia': {
    authority: 'وزارة التربية',
    preparation: 'المحافظ والكتب والجداول والعودة المنتظمة بعد العطلة',
    nuance: 'الطلب على الموعد يرتبط أيضاً بترتيب الدروس الخصوصية والنقل اليومي.',
    focus: 'وفي تونس يرتبط هذا الموعد بالعودة المدرسية وتنظيم النقل والدروس الخاصة وتجهيز المستلزمات قبل الأسبوع الأول.',
  },
  'school-start-kuwait': {
    authority: 'وزارة التربية',
    preparation: 'الجداول والمستلزمات والكتب ووسائل النقل',
    nuance: 'يتابع الأهالي الموعد بدقة لأن بداية الدراسة تؤثر مباشرة في روتين الأسرة اليومي.',
    focus: 'وفي الكويت يكثر البحث عن العودة المدرسية والجداول والدوام اليومي، لذلك يفيد ربط الموعد بالاستعداد العملي المبكر.',
  },
  'school-start-qatar': {
    authority: 'وزارة التربية والتعليم والتعليم العالي',
    preparation: 'المنصات والخطط الدراسية والجداول المدرسية',
    nuance: 'يبحث المستخدمون عادة عن التقويم الرسمي والتاريخ الذي تبدأ فيه الدراسة فعلياً بعد العودة.',
    focus: 'وفي قطر تبرز الحاجة إلى معرفة التقويم الرسمي وربط بداية الدراسة بخطط العودة والجداول ومتابعة المدرسة أو المنصة التعليمية.',
  },
  'school-start-saudi': {
    authority: 'وزارة التعليم',
    preparation: 'الجداول والحقائب والنقل المدرسي والمنصات التعليمية',
    nuance: 'يرتبط الموعد غالباً بعودة الطلاب والمعلمين والإداريين وفق التقويم الدراسي المعتمد.',
    focus: 'وفي السعودية يرتبط البحث بعودة الطلاب وعودة المعلمين وبدء الدراسة الفعلي بحسب التقويم الدراسي ومنصات التعليم.',
  },
};

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

export function getCountryNameFromCore(core: EventCoreLike) {
  if (core._countryCode) {
    return getCountryByCode(core._countryCode)?.nameAr || core.name.replace(/^.+?في\s+/, '');
  }
  return core.name.replace(/^.+?في\s+/, '').trim();
}

function buildIslamicAnswerSummary(name: string) {
  return `${name} {{year}} يوافق {{formattedDate}} تقريباً وفق التقويم الهجري والجهة المعتمدة لإعلان الموعد. يتبقى على هذه المناسبة {{daysRemaining}} يوماً، ويتابعها المسلمون لمعرفة تاريخها وما يرتبط بها من عبادات واستعدادات وأحكام عملية قد تختلف تفاصيلها النهائية بحسب الإعلان الرسمي.`;
}

function buildNationalAnswerSummary(name: string) {
  return `${name} {{year}} يوافق {{formattedDate}}. يتبقى على هذه المناسبة {{daysRemaining}} يوماً، وهي من المناسبات الوطنية التي يتابعها الزوار لمعرفة الموعد الرسمي، وضع الإجازة، وأبرز طرق الاحتفاء والاستعداد للفعاليات والبرامج المرتبطة بها داخل الدولة المعنية.`;
}

function buildSchoolAnswerSummary(name: string, countryName: string) {
  return `${name} {{year}} يكون عادة في {{formattedDate}} وفق التقويم الدراسي الذي تعلنه الجهة التعليمية المختصة في ${countryName}. يتبقى على هذا الموعد {{daysRemaining}} يوماً، ويعتمد عليه الطلاب والأسر والمعلمون في تجهيز المستلزمات وتنظيم العودة إلى الدراسة وترتيب الجداول قبل انطلاق الفصل الجديد.`;
}

function buildResultsAnswerSummary(name: string) {
  return `${name} {{year}} تُعلن عادة في {{formattedDate}} تقريباً بحسب الجهة التعليمية المسؤولة. يتبقى على هذا الموعد {{daysRemaining}} يوماً، ويترقب الطلاب والأسر هذه النتيجة لمعرفة حالة النجاح والتنسيق والخطوات التالية المرتبطة بالتسجيل أو التظلمات أو استكمال الإجراءات الرسمية.`;
}

function buildGenericAnswerSummary(core: EventCoreLike) {
  if (core.slug.includes('results')) return buildResultsAnswerSummary(core.name);
  if (core.category === 'school') return buildSchoolAnswerSummary(core.name, getCountryNameFromCore(core));
  if (core.category === 'national') return buildNationalAnswerSummary(core.name);
  if (core.category === 'islamic') return buildIslamicAnswerSummary(core.name);
  return `${core.name} {{year}} يوافق {{formattedDate}}. يتبقى على هذه المناسبة {{daysRemaining}} يوماً، وتساعد هذه الصفحة على متابعة الموعد بدقة وفهم أهم المعلومات والخطوات العملية المرتبطة بها.`;
}

function buildGenericAboutEvent(core: EventCoreLike) {
  const countryName = getCountryNameFromCore(core);
  const eventContext = EVENT_CONTEXT[core.slug];
  const schoolContext = SCHOOL_CONTEXT[core.slug];

  if (core.slug.includes('results')) {
    const eventContext = EVENT_CONTEXT[core.slug];
    return {
      [`ما هو ${core.name}؟`]: `${core.name} هو الموعد الذي تعلن فيه الجهة التعليمية النتائج الرسمية للطلاب بعد انتهاء أعمال التصحيح والمراجعة. ${eventContext?.descriptor ? `ويبحث المستخدم هنا تحديداً عن ${eventContext.descriptor}.` : ''}`.trim(),
      'التاريخ والأصل': `${eventContext?.history || `تحدد الجهة التعليمية المختصة موعد ${core.name} بعد انتهاء التصحيح ورصد الدرجات ومراجعة البيانات.`} المصدر الرسمي للموعد يكون عادة الوزارة أو الديوان أو المنصة التعليمية المعتمدة، لذلك قد يتغير تاريخ الإعلان قبل اعتماده النهائي.`,
      'الأهمية والمكانة': `${eventContext?.importance || `${core.name} مهم لأنه يرتبط بمستقبل الطالب الأكاديمي والقرارات التالية مثل التظلمات والتسجيل والانتقال إلى المرحلة اللاحقة.`} كما يمثل نقطة بحث مرتفعة جداً لأن الزوار يريدون إجابة مباشرة وموثوقة في وقت قصير.`,
      'كيف يُحيا هذا اليوم': `${eventContext?.practice || `في يوم ${core.name} يراجع الطلاب الرابط الرسمي، ويحضرون بياناتهم، ويتحققون من النتيجة فور نشرها.`} ومن الجيد متابعة الإعلان الرسمي فقط، لأن الروابط غير المعتمدة قد تسبب التباساً أو تأخيراً في الوصول إلى المعلومات الصحيحة.`,
    };
  }

  if (core.category === 'school') {
    return {
      [`ما هو ${core.name}؟`]: `${core.name} هو الموعد الذي تبدأ فيه الدراسة رسمياً وفق التقويم الدراسي المعلن في ${countryName}. يتابع الأهالي والطلاب والمعلمون هذا التاريخ لأنه يمثل نقطة الانطلاق الفعلية للعام الدراسي أو الفصل الجديد.`,
      'التاريخ والأصل': `تضع ${schoolContext?.authority || 'الجهة التعليمية المختصة'} في ${countryName} التقويم الدراسي وتعلن تاريخ البداية قبل انطلاق الدراسة بوقت كاف. المصدر الرسمي للموعد يكون الوزارة أو الجهة التعليمية المعتمدة، وقد يتغير قبل الإعلان النهائي إذا ظهرت مستجدات تنظيمية. ${schoolContext?.nuance || ''}`.trim(),
      'الأهمية والمكانة': `${core.name} مهم لأنه ينظم العودة إلى المدارس والجامعات، ويحدد فترة تجهيز ${schoolContext?.preparation || 'الكتب والزي والنقل والجداول'}. ${schoolContext?.focus || 'كما يساعد الأسر على التخطيط المسبق وتوزيع المهام وتخفيف ضغط الأيام الأولى.'}`,
      'كيف يُحيا هذا اليوم': `يستعد الطلاب عادة بشراء المستلزمات وترتيب النوم والاستيقاظ ومراجعة الجداول ومتابعة المدرسة أو المنصة الرسمية. وفي ${countryName} يكثر الاهتمام بمراجعة ${schoolContext?.authority || 'الإعلان الرسمي'} للتأكد من أي تحديث في التاريخ أو آلية الحضور، خصوصاً عندما ترتبط العودة بـ ${schoolContext?.preparation || 'التجهيزات الأساسية'}.`,
    };
  }

  if (core.category === 'national') {
    return {
      [`ما هو ${core.name}؟`]: `${core.name} مناسبة وطنية رسمية تُحيي ذكرى مهمة في تاريخ الدولة أو مسيرتها السياسية والاجتماعية. يتابع الناس هذا اليوم لمعرفة تاريخه الرسمي وما إذا كان يتضمن فعاليات عامة أو إجازة أو برامج احتفاء خاصة.`,
      'التاريخ والأصل': `يرتبط ${core.name} بحدث وطني أو قرار تأسيسي أو ذكرى رسمية تعترف بها الدولة. المصدر المعتمد لتأكيد الموعد والبرامج يكون عادة الجهة الحكومية أو المنصات الرسمية، لذلك يُفضَّل الرجوع إليها عند اقتراب المناسبة.`,
      'الأهمية والمكانة': `تنبع أهمية ${core.name} من كونه يوماً جامعاً للهوية الوطنية والذاكرة العامة، كما أنه يرفع الطلب على معلومات الإجازة والفعاليات والعروض والاحتفاء المجتمعي المرتبط بالمناسبة.`,
      'كيف يُحيا هذا اليوم': `تُحيى المناسبة عادة بالفعاليات الرسمية والاحتفاء المجتمعي ورفع الأعلام أو البرامج الثقافية والعائلية. ومن المفيد متابعة الإعلانات الرسمية لمعرفة تفاصيل الإجازة، ومواقع الفعاليات، وأي تعليمات تنظيمية مرتبطة باليوم.`,
    };
  }

  if (core.category === 'islamic') {
    return {
      [`ما هو ${core.name}؟`]: `${core.name} مناسبة إسلامية ترتبط بالتقويم الهجري، لذلك يتابعها المسلمون لمعرفة تاريخها الدقيق وما يرتبط بها من عبادة أو فضل أو استعدادات عملية. ${eventContext?.descriptor ? `وتبرز هنا خصوصية المناسبة لأنها ${eventContext.descriptor}.` : ''}`.trim(),
      'التاريخ والأصل': `${eventContext?.history || `يرتبط ${core.name} بسياق ديني معروف في السيرة أو الشعائر الإسلامية، ويُحدد موعده بالاعتماد على التقويم الهجري والإعلان الرسمي عند الحاجة.`} ولهذا قد يختلف الموعد النهائي من بلد إلى آخر بحسب الرؤية أو الجهة المعتمدة.`,
      'الأهمية والمكانة': `${eventContext?.importance || `${core.name} مهم لأنه يحمل معنى دينياً واضحاً ويقود إلى أسئلة متكررة حول الحكم والفضل والأعمال المرتبطة به.`} كما أن الطلب البحثي يرتفع كل عام مع اقتراب الموعد بسبب تغير التاريخ الميلادي للمناسبة.`,
      'كيف يُحيا هذا اليوم': `${eventContext?.practice || `تختلف طريقة إحياء ${core.name} بحسب طبيعته، لكنها ترتبط عادة بالعبادة أو الذكر أو الاستعداد أو المتابعة الفقهية والتنظيمية.`} والأدق دائماً هو متابعة الجهة الرسمية أو المرجع المعتمد، لأن التاريخ قد يختلف يوماً واحداً في بعض الدول.`,
    };
  }

  return buildAboutEvent(core);
}

function buildSchoolFaq(core: EventCoreLike, countryName: string) {
  return [
    {
      question: `متى ${core.name} {{year}}؟`,
      answer: `${core.name} {{year}} يكون عادة في {{formattedDate}}. ويظل التاريخ النهائي مرتبطاً بالتقويم الدراسي أو الإعلان الرسمي في ${countryName}.`,
    },
    {
      question: `كم باقي على ${core.name}؟`,
      answer: `يتبقى على ${core.name} {{daysRemaining}} يوماً. ويساعدك العداد التنازلي على متابعة الفترة المتبقية للاستعداد وتجهيز المستلزمات.`,
    },
    {
      question: `ما هو ${core.name}؟`,
      answer: `${core.name} هو الموعد الرسمي لانطلاق الدراسة وفق التقويم المعلن. ويتابع هذا التاريخ الطلاب والأسر والمعلمون لتنظيم العودة إلى الدراسة.`,
    },
    {
      question: `كيف أستعد لـ${core.name}؟`,
      answer: `الاستعداد لـ${core.name} يبدأ بمراجعة الإعلان الرسمي وتجهيز المستلزمات. كما يُفضَّل تنظيم النوم والجداول والانتقال قبل أيام من البداية.`,
    },
    {
      question: `متى ${core.name} {{nextYear}}؟`,
      answer: `موعد ${core.name} {{nextYear}} يُعلن عادة ضمن التقويم الدراسي الجديد. وتبقى الجهة التعليمية الرسمية هي المصدر الأدق لتأكيد التاريخ النهائي.`,
    },
    {
      question: `ما أهمية ${core.name}؟`,
      answer: `تكمن أهمية ${core.name} في أنه ينظم بداية العام الدراسي ويؤثر على الأسر والطلاب والمعلمين معاً. كما يساعد على التخطيط للعودة إلى الدراسة مبكراً.`,
    },
  ];
}

function buildResultsFaq(core: EventCoreLike) {
  return [
    {
      question: `متى ${core.name} {{year}}؟`,
      answer: `${core.name} {{year}} تُعلن عادة في {{formattedDate}} تقريباً. ويظل الموعد النهائي مرتبطاً بإعلان الجهة التعليمية أو المنصة الرسمية المعتمدة.`,
    },
    {
      question: `كم باقي على ${core.name}؟`,
      answer: `يتبقى على ${core.name} {{daysRemaining}} يوماً. ويعرض العداد المدة المتبقية حتى موعد الإعلان المتوقع أو الرسمي.`,
    },
    {
      question: `ما هو ${core.name}؟`,
      answer: `${core.name} هو موعد إعلان النتيجة الرسمية للطلاب بعد إنهاء التصحيح والمراجعة. ويتابع هذا الموعد الطلاب والأسر لمعرفة النتيجة والخطوات التالية.`,
    },
    {
      question: `كيف أتحقق من ${core.name}؟`,
      answer: `التحقق من ${core.name} يتم عبر الرابط أو المنصة الرسمية التي تعلنها الجهة المختصة. ويُفضَّل تجهيز رقم الجلوس أو بيانات الاستعلام قبل وقت الإعلان.`,
    },
    {
      question: `متى ${core.name} {{nextYear}}؟`,
      answer: `موعد ${core.name} {{nextYear}} يُحدد بعد انتهاء الامتحانات وأعمال التصحيح في الدورة الجديدة. وتظل الجهة التعليمية الرسمية هي المرجع الأدق للموعد.`,
    },
    {
      question: `ما أهمية ${core.name}؟`,
      answer: `${core.name} مهم لأنه يحدد الانتقال الأكاديمي أو إجراءات التقديم والتظلمات. كما أنه من أكثر المواعيد التعليمية بحثاً عند اقتراب إعلان النتائج.`,
    },
  ];
}

function buildIslamicFaq(core: EventCoreLike) {
  return [
    {
      question: `متى ${core.name} {{year}}؟`,
      answer: `${core.name} {{year}} يوافق {{formattedDate}} تقريباً. وقد يختلف الموعد النهائي يوماً واحداً بحسب الرؤية أو الإعلان الرسمي.`,
    },
    {
      question: `كم باقي على ${core.name}؟`,
      answer: `يتبقى على ${core.name} {{daysRemaining}} يوماً. ويُحدَّث العداد تلقائياً لمتابعة المدة المتبقية حتى الموعد المتوقع للمناسبة.`,
    },
    {
      question: `ما هو ${core.name}؟`,
      answer: `${core.name} مناسبة إسلامية مرتبطة بالتقويم الهجري. ويتابع المسلمون موعدها لمعرفة تاريخها وما يرتبط بها من أعمال أو فضل أو استعداد.`,
    },
    {
      question: `كيف أستعد لـ${core.name}؟`,
      answer: `الاستعداد لـ${core.name} يبدأ بمعرفة الموعد المتوقع والرجوع إلى الإعلان الرسمي عند الحاجة. ثم يمكن ترتيب الأعمال أو العبادات أو البرامج المرتبطة بالمناسبة.`,
    },
    {
      question: `متى ${core.name} {{nextYear}}؟`,
      answer: `موعد ${core.name} {{nextYear}} يتحدد وفق التقويم الهجري أيضاً. ولذلك يتغير تاريخه الميلادي من عام إلى آخر بنحو 10 إلى 11 يوماً تقريباً.`,
    },
    {
      question: `ما أهمية ${core.name}؟`,
      answer: `تنبع أهمية ${core.name} من قيمته الدينية وارتباطه بأسئلة عملية متكررة حول التاريخ والفضل والأعمال المرتبطة به. ولهذا يزداد البحث عنه كلما اقترب موعده.`,
    },
  ];
}

function buildNationalFaq(core: EventCoreLike) {
  return [
    {
      question: `متى ${core.name} {{year}}؟`,
      answer: `${core.name} {{year}} يوافق {{formattedDate}}. ويُعتمد الموعد النهائي وما يرتبط به من برامج أو إجازة وفق الإعلان الرسمي.`,
    },
    {
      question: `كم باقي على ${core.name}؟`,
      answer: `يتبقى على ${core.name} {{daysRemaining}} يوماً. ويساعد العداد على متابعة الفترة المتبقية للاستعداد للفعاليات والبرامج المرتبطة بالمناسبة.`,
    },
    {
      question: `ما هو ${core.name}؟`,
      answer: `${core.name} مناسبة وطنية رسمية مرتبطة بذكرى أو حدث مهم في تاريخ الدولة. ويتابع الناس هذا الموعد لمعرفة التاريخ والإجازة وأبرز طرق الاحتفاء.`,
    },
    {
      question: `كيف أستعد لـ${core.name}؟`,
      answer: `الاستعداد لـ${core.name} يبدأ بمتابعة البرامج الرسمية والفعاليات والإعلانات المحلية. كما يساعد التخطيط المبكر على الاستفادة من الإجازة أو الأنشطة المرتبطة بالمناسبة.`,
    },
    {
      question: `متى ${core.name} {{nextYear}}؟`,
      answer: `موعد ${core.name} {{nextYear}} يتبع النمط الرسمي نفسه ما لم يصدر تعديل خاص. وتظل الجهة الرسمية هي المرجع الأدق لتأكيد التاريخ النهائي.`,
    },
    {
      question: `ما أهمية ${core.name}؟`,
      answer: `${core.name} مهم لأنه يعكس الذاكرة الوطنية والهوية العامة ويرتبط باهتمام واسع من السكان والزوار. كما يرفع الطلب على معلومات الفعاليات والإجازة والاحتفاء.`,
    },
  ];
}

function buildCategoryFaq(core: EventCoreLike) {
  if (core.slug.includes('results')) return buildResultsFaq(core);
  if (core.category === 'school') return buildSchoolFaq(core, getCountryNameFromCore(core));
  if (core.category === 'national') return buildNationalFaq(core);
  if (core.category === 'islamic') return buildIslamicFaq(core);
  return buildFaq(core.name);
}

function buildMetaDescription(core: EventCoreLike) {
  const eventContext = EVENT_CONTEXT[core.slug];
  if (core.slug.includes('results')) {
    return `تعرف على موعد ${core.name} {{year}} مع عداد تنازلي دقيق، وطريقة الاستعلام الرسمية، وأهم الخطوات التالية بعد ظهور النتيجة.`;
  }
  if (core.category === 'school') {
    return `تعرف على موعد ${core.name} {{year}} مع عداد تنازلي دقيق، وأهم تفاصيل التقويم الدراسي في ${getCountryNameFromCore(core)} والاستعداد للعودة إلى الدراسة وفق الإعلان الرسمي.`;
  }
  if (core.category === 'national') {
    return `تعرف على موعد ${core.name} {{year}} مع عداد تنازلي دقيق، ومعلومات الإجازة والفعاليات والاحتفاء بالمناسبة وفق الإعلان الرسمي.`;
  }
  if (core.category === 'islamic') {
    return `تعرف على موعد ${core.name} {{year}} مع عداد تنازلي دقيق، ومحتوى عربي منظم يشرح ${eventContext?.descriptor || 'المعنى والأهمية'} والتنبيه إلى احتمال اختلاف الإعلان الرسمي.`;
  }
  return `تعرف على موعد ${core.name} {{year}} مع عداد تنازلي دقيق ومحتوى عربي منظم وسريع التحديث.`;
}

function buildQuickFactsObject(core: EventCoreLike) {
  const facts = buildQuickFacts(core.category, core.type);
  if (core.category === 'school') {
    facts['ينطبق على'] = getCountryNameFromCore(core);
    facts['التقويم الدراسي'] = 'بحسب إعلان الوزارة أو الجهة التعليمية المعتمدة';
  }
  if (core.slug.includes('results')) {
    facts['جهة الإعلان'] = 'المنصة أو الجهة التعليمية الرسمية';
    facts['طريقة الاستعلام'] = 'برقم الجلوس أو البيانات الرسمية المطلوبة';
  }
  return facts;
}

function buildRecurringYearsNormalized(core: EventCoreLike) {
  const recurringYears = buildRecurringYears(core.type, core.name);
  if (core.type === 'hijri') {
    return {
      ...recurringYears,
      sourceNote: 'وفق التقويم الهجري والحسابات المعتمدة، مع التنبيه إلى أن الإعلان الرسمي قد يختلف بحسب الدولة.',
    };
  }
  if (core.category === 'school') {
    return {
      ...recurringYears,
      sourceNote: 'وفق النمط الدراسي المعتاد، مع الرجوع دائماً إلى الجهة التعليمية المعتمدة لتأكيد الموعد النهائي.',
    };
  }
  return recurringYears;
}

function buildSchemaDescription(core: EventCoreLike) {
  if (core.slug.includes('results')) {
    return `${core.name} صفحة عربية تساعد الزائر على متابعة موعد إعلان النتائج، فهم طريقة الاستعلام الرسمية، والاستعداد للخطوات التالية بعد ظهور النتيجة عبر مصدر واضح ومحدّث.`;
  }
  if (core.category === 'school') {
    return `${core.name} صفحة عربية تساعد الطلاب والأسر على معرفة موعد العودة إلى الدراسة، وفهم أهمية التاريخ والاستعداد له وفق الجهة التعليمية المعتمدة.`;
  }
  if (core.category === 'islamic') {
    return `${core.name} صفحة عربية تشرح موعد المناسبة، أهميتها، وكيفية متابعتها مع التنبيه إلى أن التاريخ النهائي قد يختلف وفق الإعلان الرسمي أو الرؤية المعتمدة.`;
  }
  return `${core.name} صفحة عربية توضح موعد المناسبة، أهميتها، وطريقة الاستعداد لها عبر محتوى منظم وسريع التحديث.`;
}

export function buildNormalizedRichContent(pkg: PackageLike, nowIso: string) {
  const core = pkg.core;
  const faq = buildCategoryFaq(core);
  const seoMeta = {
    ...buildSeoMeta(core, nowIso),
    metaDescription: buildMetaDescription(core),
    ogDescription: buildMetaDescription(core).slice(0, 140),
  };

  const schemaData = {
    ...buildSchemaData(core, faq),
    eventDescription: buildSchemaDescription(core),
  };

  return {
    seoTitle: `متى ${core.name} {{year}} — عد تنازلي دقيق`,
    description: buildMetaDescription(core),
    keywords: buildBaseKeywords(core),
    answerSummary: buildGenericAnswerSummary(core),
    quickFacts: buildQuickFactsObject(core),
    aboutEvent: buildGenericAboutEvent(core),
    faq,
    faqItems: faq.map((item) => ({ q: item.question, a: item.answer })),
    intentCards: buildIntentCards(core.category),
    engagementContent:
      core.category === 'school'
        ? [
            { text: `راجع إعلان ${core.name} عبر الجهة التعليمية الرسمية قبل شراء أي مستلزمات إضافية.`, type: 'tip', subcategory: 'استعداد' },
            { text: `تنظيم النوم والاستيقاظ قبل ${core.name} بأيام يسهل العودة إلى الروتين الدراسي.`, type: 'tip', subcategory: 'روتين' },
            { text: `ابدأ تجهيز الحقيبة والكتب والزي قبل ${core.name} لتقليل ضغط اليوم الأول.`, type: 'checklist-item', subcategory: 'تجهيز' },
            { text: `متابعة ${core.name} مبكراً تساعد الأسرة على ترتيب النقل والجدول والالتزامات اليومية.`, type: 'fact', subcategory: 'فائدة' },
            { text: `احفظ رابط التقويم الرسمي المرتبط بـ ${core.name} حتى تراجع أي تحديث أخير بسرعة.`, type: 'checklist-item', subcategory: 'متابعة' },
            { text: `ضع خطة بسيطة لأول أسبوع بعد ${core.name} حتى تكون العودة أكثر هدوءاً وتنظيماً.`, type: 'tip', subcategory: 'خطة' },
          ].map((item, index) => {
            const schoolContext = SCHOOL_CONTEXT[core.slug];
            if (!schoolContext) return item;
            if (index === 0) {
              return {
                ...item,
                text: `راجع إعلان ${core.name} عبر ${schoolContext.authority} قبل تجهيز ${schoolContext.preparation}.`,
              };
            }
            if (index === 3) {
              return {
                ...item,
                text: `${schoolContext.focus} متابعة ${core.name} مبكراً تجعل العودة أكثر وضوحاً وتنظيماً.`,
              };
            }
            return item;
          })
        : buildEngagementContent(core.name),
    seoMeta,
    recurringYears: buildRecurringYearsNormalized(core),
    schemaData,
    relatedSlugs: pkg.richContent?.relatedSlugs || [],
  };
}

export function buildSchoolStartRichContent(pkg: PackageLike, nowIso: string) {
  return buildNormalizedRichContent({
    ...pkg,
    core: {
      ...pkg.core,
      category: 'school',
    },
  }, nowIso);
}

export function buildRelatedSlugsForPackage(
  pkg: PackageLike,
  allEntries: RelatedEntry[],
  seed: string[] = [],
) {
  const suggestions = suggestRelatedSlugs(
    {
      slug: pkg.core.slug,
      category: pkg.core.category,
      queueOrder: pkg.queueOrder,
    },
    allEntries,
  );

  return unique([...seed, ...suggestions])
    .filter((slug) => slug && slug !== pkg.core.slug)
    .slice(0, 6);
}

export function ensureReciprocalLink(
  sourceSlug: string,
  targetSlugs: string[],
  max = 6,
) {
  if (targetSlugs.includes(sourceSlug)) return targetSlugs.slice(0, max);
  if (targetSlugs.length < max) return [...targetSlugs, sourceSlug];
  return [...targetSlugs.slice(0, max - 1), sourceSlug];
}
