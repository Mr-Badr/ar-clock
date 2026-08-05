/**
 * Domestic-worker/private-driver employment CONTRACT structure — all 6 Gulf countries.
 * Sourced from `keyword-research/domestic-worker-cost/DECISION.md` §6.7 and §7.4. Confidence
 * genuinely varies by country — every country config carries its own `confidence` label and
 * `disclaimer`, shown verbatim on the generated document, never hidden or smoothed over:
 *
 * - Saudi Arabia: أساسي — Article 7 of the executive domestic-worker regulation (HRSD booklet).
 * - UAE: أساسي — u.ae's official domestic-helpers service page states the required elements.
 * - Kuwait: أساسي — Law 68/2015 Article 18 (full text fetched and read directly).
 * - Qatar: ثانوي قوي — Law 15/2017 + Ministerial Decision 39/2018 confirmed to require a
 *   unified contract by name/number, but the literal official text couldn't be fetched
 *   (mol.gov.qa network-unreachable) — fields below are reconstructed from 2 independent
 *   secondary descriptions of that contract's content, not copied from the primary text.
 * - Bahrain: ثانوي قوي جداً — LMRA's actual "Tripartite Domestic Employee Contract" is confirmed
 *   to exist by exact name and URL, but returned 403 on fetch — fields below are reconstructed
 *   from secondary descriptions of that named document.
 * - Oman: مؤكد أساسياً للحقول (Article 19 of Ministerial Decision 574/2025, fetched directly via
 *   qanoon.om) — but ALSO confirmed that NO official unified template exists to mirror; the
 *   decision text only mandates these fields be present, however formatted.
 */

export const CONTRACT_COUNTRIES = {
  sa: {
    label: 'السعودية',
    confidence: 'أساسي',
    disclaimer: 'الحقول أدناه مطابقة للعناصر الإلزامية في المادة 7 من اللائحة التنفيذية للعمالة المنزلية، الصادرة عن وزارة الموارد البشرية والتنمية الاجتماعية.',
    probationDaysDefault: 90,
    probationMax: 90,
    extraFields: ['nationalAddress', 'nextOfKin'],
    standardClauses: [
      'مدة التجربة حتى 90 يوماً كحد أقصى.',
      'حد أقصى 10 ساعات عمل فعلي يومياً، وحد أدنى 8 ساعات راحة متواصلة يومياً.',
      'راحة أسبوعية 24 ساعة مدفوعة، وإجازة سنوية 30 يوماً بعد إتمام سنتين من الخدمة.',
      'إجازة مرضية حتى 30 يوماً (15 يوماً بأجر كامل ثم 15 يوماً بنصف أجر).',
      'مكافأة نهاية الخدمة = أجر شهر واحد عن كل 4 سنوات خدمة.',
      'تعويض الإنهاء غير المشروع = أجر شهرين.',
      'التأمين على عقد العمل المنزلي إلزامي وفقاً للتعليمات المنظمة له.',
    ],
    sourceLabel: 'كتيّب حقوق وواجبات أصحاب العمل والعمالة المنزلية — HRSD',
    sourceHref: 'https://hrsd.gov.sa',
  },
  ae: {
    label: 'الإمارات',
    confidence: 'أساسي',
    disclaimer: 'الحقول أدناه مطابقة للعناصر الإلزامية المذكورة في صفحة الخدمة الرسمية لتوظيف العمالة المساعدة على البوابة الحكومية u.ae.',
    probationDaysDefault: 30,
    probationMax: 90,
    extraFields: [],
    standardClauses: [
      'صرف الأجر خلال 10 أيام من تاريخ استحقاقه.',
      'يوم راحة أسبوعي مدفوع، و12 ساعة راحة يومية (8 ساعات منها متواصلة على الأقل).',
      'إجازة سنوية 30 يوماً، وتذكرة سفر كل سنتين.',
      'حتى 30 يوم إجازة مرضية سنوياً.',
      'يحتفظ العامل بوثائقه الشخصية (جواز السفر) لدى نفسه.',
    ],
    sourceLabel: 'u.ae — خدمة توظيف العمالة المساعدة',
    sourceHref: 'https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/domestic-helpers',
  },
  kw: {
    label: 'الكويت',
    confidence: 'أساسي',
    disclaimer: 'الحقول أدناه مطابقة للعناصر الإلزامية في المادة 18 من القانون رقم 68 لسنة 2015، ويجب أن يكون العقد ثنائي اللغة (عربي/إنجليزي) وصادراً عن إدارة العمالة المنزلية بوزارة الداخلية رسمياً.',
    probationDaysDefault: 0,
    probationMax: 0,
    extraFields: [],
    standardClauses: [
      'يجب أن يكون العقد ثنائي اللغة (عربي وإنجليزي أو لغة العامل).',
      'مكافأة نهاية الخدمة = أجر شهر واحد عن كل سنة كاملة من مدة العقد.',
      'غرامة تأخر دفع الأجر: 10 دنانير عن كل شهر تأخير.',
      'يُحظر استقدام أو تشغيل عامل منزلي عمره أقل من 21 أو أكثر من 60 سنة.',
    ],
    sourceLabel: 'القانون رقم 68 لسنة 2015 — إدارة العمالة المنزلية، وزارة الداخلية',
    sourceHref: 'https://oneroofkw.org/wp-content/uploads/2018/05/%D9%82%D8%A7%D9%86%D9%88%D9%86-%D8%B1%D9%82%D9%85-68-%D9%84%D8%B3%D9%86%D8%A9-2015.pdf',
  },
  qa: {
    label: 'قطر',
    confidence: 'ثانوي قوي',
    disclaimer: 'قطر تُلزم بعقد عمل موحّد للعمالة المنزلية بموجب القانون رقم 15 لسنة 2017 والقرار الوزاري رقم 39 لسنة 2018 — لكن النص الحرفي للنموذج الرسمي تعذّر الوصول إليه مباشرة (mol.gov.qa). الحقول أدناه إعادة بناء من وصفين مستقلين لمحتوى ذلك العقد، وليست نسخة طبق الأصل من النموذج الحكومي الفعلي. راجع النموذج الرسمي من MADLSA قبل الاعتماد النهائي.',
    probationDaysDefault: 90,
    probationMax: 90,
    extraFields: ['overtimeRate'],
    standardClauses: [
      'حد أقصى ساعتان عمل إضافي يومياً، وبدل يُحتسب وفق النظام.',
      'حد أقصى 10 ساعات عمل يومياً.',
      'راحة أسبوعية وإجازة سنوية مستحقتان.',
      'مكافأة نهاية خدمة مستحقة وفق النظام.',
      'السكن والرعاية الطبية والترحيل على صاحب العمل.',
      'يُفضَّل أن يكون العقد ثنائي اللغة (عربي ولغة العامل).',
    ],
    sourceLabel: 'القانون 15/2017 والقرار الوزاري 39/2018 — MADLSA',
    sourceHref: 'https://www.mol.gov.qa',
  },
  bh: {
    label: 'البحرين',
    confidence: 'ثانوي قوي جداً',
    disclaimer: 'العقد الرسمي المعتمد في البحرين اسمه "العقد الثلاثي للعامل المنزلي" (Tripartite Domestic Employee Contract) الصادر مباشرة عن هيئة تنظيم سوق العمل LMRA، ويُوقَّع بين ثلاثة أطراف (مكتب الاستقدام، صاحب العمل، والعامل المنزلي) ويُسجَّل على بوابة LMRA. النص الحرفي الرسمي تعذّر الوصول إليه مباشرة عند آخر محاولة (403). الحقول أدناه إعادة بناء من وصف رسمي للمستند، وليست نسخة طبق الأصل — احصل على النموذج الثلاثي الفعلي من مكتب استقدامك المرخّص أو من LMRA مباشرة قبل التوقيع النهائي.',
    probationDaysDefault: 0,
    probationMax: 0,
    extraFields: ['recruitmentOfficeName'],
    standardClauses: [
      'عقد ثلاثي الأطراف: مكتب الاستقدام + صاحب العمل (الأسرة) + العامل المنزلي.',
      'يُسجَّل على بوابة LMRA عند التوظيف عبر مكتب استقدام مرخّص.',
      'يحدد الأجر والمهام وساعات العمل والسكن بوضوح.',
      'يحتفظ كل طرف بنسخة موقّعة من العقد.',
    ],
    sourceLabel: 'LMRA — العقد الثلاثي للعامل المنزلي',
    sourceHref: 'https://www.lmra.gov.bh/en/page/show/328',
  },
  om: {
    label: 'عُمان',
    confidence: 'مؤكد أساسياً (حقول) + لا يوجد نموذج رسمي واحد',
    disclaimer: 'المادة 19 من القرار الوزاري رقم 574/2025 تُلزم بالحقول أدناه تحديداً (نُقلت مباشرة من نص القرار)، لكنها لا تُلحِق أو تشير إلى نموذج/شكل موحّد رسمي واحد للعقد — هذا عقد يستوفي الحقول الإلزامية القانونية، وليس نسخة من نموذج وزارة العمل الرسمي لأن هذا النموذج غير موجود أصلاً. يجب أن يكون العقد مكتوباً من نسختين باللغة العربية (مع ترجمة معتمدة إن لزم)، ومسجَّلاً إلكترونياً في نظام الوزارة.',
    probationDaysDefault: 0,
    probationMax: 0,
    extraFields: [],
    standardClauses: [
      'يجب أن يكون العقد ثابتاً بالكتابة، من نسختين باللغة العربية.',
      'يُسجَّل العقد إلكترونياً في نظام وزارة العمل.',
      'يتضمن حصراً: بيانات الطرفين، تاريخ بدء العمل وفترة التجربة، نوع وطبيعة العمل، مكان العمل، ساعات العمل وفترات الراحة، الأجر الشهري وتاريخ صرفه.',
    ],
    sourceLabel: 'القرار الوزاري رقم 574/2025 — المادة 19 (عبر qanoon.om)',
    sourceHref: 'https://qanoon.om/p/2025/mol20250574/',
  },
};

export const WORK_TYPES = ['عاملة منزلية', 'سائق خاص', 'مربية أطفال', 'طباخ/ة منزلي', 'حارس منزل', 'أخرى'];
