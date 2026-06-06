export interface IntentPathwayLink {
  href: string;
  title: string;
  description: string;
}

export interface IntentPathway {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  links: IntentPathwayLink[];
}

export const INTENT_PATHWAYS: IntentPathway[] = [
  {
    id: 'daily-timing',
    badge: 'عودة يومية',
    title: 'للوقت والصلاة والتاريخ الذي تراجعه كل يوم',
    description:
      'هذا المسار يخدم الزيارات المتكررة: معرفة الساعة الان، مواقيت الصلاة، تاريخ اليوم، ثم الانتقال إلى مقارنة التوقيت عند الحاجة.',
    ctaHref: '/time-now',
    ctaLabel: 'ابدأ من الوقت الان',
    links: [
      {
        href: '/time-now',
        title: 'الوقت الان',
        description: 'افتح الساعة الحالية في الدول والمدن ثم انتقل إلى صفحة الدولة أو المدينة الأقرب لك.',
      },
      {
        href: '/mwaqit-al-salat',
        title: 'مواقيت الصلاة اليوم',
        description: 'اعرف مواقيت الصلاة الدقيقة ثم واصل إلى صفحات الدول والمدن ذات الصلة من نفس المسار.',
      },
      {
        href: '/date',
        title: 'التاريخ الهجري والميلادي',
        description: 'راجع تاريخ اليوم، ثم افتح التحويل أو التقويم أو صفحة الدولة المرتبطة به بسهولة.',
      },
      {
        href: '/time-difference',
        title: 'فرق التوقيت',
        description: 'خطوة منطقية عندما يتحول السؤال من وقت مدينة واحدة إلى اجتماع أو سفر أو مكالمة بين مدينتين.',
      },
    ],
  },
  {
    id: 'money-decisions',
    badge: 'قرار مالي',
    title: 'للقرض والضريبة والادخار قبل أن تتسرع في القرار',
    description:
      'ابدأ من المسار المالي المناسب ثم افتح الحاسبة أو المقال الذي يعطيك رقماً واضحاً وسياقاً يساعدك على الفهم والمقارنة.',
    ctaHref: '/calculators/finance',
    ctaLabel: 'ابدأ من المال والعمل',
    links: [
      {
        href: '/calculators/finance',
        title: 'حاسبات المال والعمل',
        description: 'ابدأ من القرض أو الضريبة أو النسبة أو نهاية الخدمة، ثم انتقل إلى الحاسبة التي تعطيك الرقم والشرح.',
      },
      {
        href: '/calculators/monthly-installment',
        title: 'حاسبة القسط الشهري',
        description: 'قارن الدفعة الشهرية وإجمالي الفوائد وأثر السداد المبكر قبل قبول أي عرض تمويل.',
      },
      {
        href: '/calculators/vat',
        title: 'حاسبة ضريبة القيمة المضافة',
        description: 'أضف الضريبة أو استخرجها من السعر الشامل بسرعة مع أمثلة عربية شائعة.',
      },
      {
        href: '/calculators/personal-finance',
        title: 'التخطيط المالي الشخصي',
        description: 'انتقل إلى صندوق الطوارئ والديون والادخار وصافي الثروة عندما تحتاج خطة لا رقماً منفصلاً فقط.',
      },
    ],
  },
  {
    id: 'life-planning',
    badge: 'تنظيم شخصي',
    title: 'للعمر والنوم والمواعيد التي تريد فهمها بسرعة',
    description:
      'هذا المسار يخدم الأسئلة الشخصية المتكررة: كم عمري، متى أنام، كيف أحول تاريخاً، ومتى تأتي المناسبة التالية.',
    ctaHref: '/calculators/age',
    ctaLabel: 'ابدأ من حاسبات العمر',
    links: [
      {
        href: '/calculators/age',
        title: 'حاسبات العمر',
        description: 'احسب عمرك الآن ثم أكمل إلى فرق العمر أو العد التنازلي أو العمر الهجري من نفس الباب.',
      },
      {
        href: '/calculators/sleep',
        title: 'حاسبات النوم الذكي',
        description: 'انتقل من سؤال متى أنام إلى القيلولة ودين النوم واحتياج النوم حسب العمر.',
      },
      {
        href: '/date/converter',
        title: 'محول التاريخ',
        description: 'حوّل التواريخ بين الهجري والميلادي عندما يكون القرار مرتبطاً بموعد أو مستند أو مناسبة.',
      },
      {
        href: '/holidays',
        title: 'المناسبات والعدادات',
        description: 'راجع الأعياد والمناسبات والإجازات القادمة إذا كان سؤالك مرتبطاً بموعد ينتظره الناس.',
      },
    ],
  },
  {
    id: 'articles-first',
    badge: 'فهم قبل الحساب',
    title: 'لمن يريد أن يفهم الفكرة أولاً ثم يفتح الأداة المناسبة',
    description:
      'ابدأ من المقال عندما تحتاج شرحاً واضحاً قبل اتخاذ قرار أو استخدام أداة.',
    ctaHref: '/blog',
    ctaLabel: 'ابدأ من المدونة',
    links: [
      {
        href: '/blog/how-many-cement-bags-do-i-need',
        title: 'كم كيس أسمنت أحتاج؟',
        description: 'اقرأ منطق تقدير الكمية والهدر قبل الانتقال إلى حاسبة الأسمنت.',
      },
      {
        href: '/blog/how-to-estimate-rebar-weight',
        title: 'كيف تقدّر وزن حديد التسليح؟',
        description: 'افهم علاقة القطر والطول والعدد بالوزن قبل الانتقال إلى حاسبة الحديد.',
      },
      {
        href: '/blog/what-is-a-sleep-cycle',
        title: 'ما دورة النوم؟',
        description: 'إذا كنت تريد فهم دورات النوم قبل استخدام الحاسبة، فهذه الصفحة بداية أوضح وأهدأ.',
      },
      {
        href: '/blog/best-nap-length',
        title: 'ما أفضل مدة للقيلولة؟',
        description: 'اقرأ متى تفيد القيلولة ومتى تصبح أطول من اللازم قبل استخدام حاسبة القيلولة.',
      },
    ],
  },
];
