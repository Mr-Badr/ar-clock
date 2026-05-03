import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

type FactSource = {
  label: string;
  url: string;
};

type Competitor = {
  site: string;
  type: string;
  url?: string;
  focus: string[];
  gaps: string[];
};

type ResearchSeed = {
  factSources?: FactSource[];
  competitors?: Competitor[];
};

const RESEARCH_SEEDS: Record<string, ResearchSeed> = {
  'school-start-egypt': {
    factSources: [
      { label: 'وزارة التربية والتعليم والتعليم الفني - مصر', url: 'https://moe.gov.eg' },
      { label: 'بوابة مركز المعلومات - وزارة التربية والتعليم مصر', url: 'https://emis.gov.eg' },
      { label: 'بوابة الحكومة المصرية', url: 'https://www.egypt.gov.eg' },
    ],
    competitors: [
      {
        site: 'moe.gov.eg',
        type: 'official',
        url: 'https://moe.gov.eg',
        focus: ['التقويم الدراسي', 'تاريخ بدء الدراسة', 'الإعلانات الرسمية'],
        gaps: ['لا يقدّم عداداً تنازلياً مباشراً', 'لا يجمع نية البحث العربية الخدمية في صفحة واحدة'],
      },
      {
        site: 'البوابات الإخبارية التعليمية المصرية',
        type: 'news',
        focus: ['موعد بدء الدراسة', 'تفاصيل التقويم الدراسي', 'تصريحات الوزارة'],
        gaps: ['غالباً تكرر الخبر من دون بنية خدمية ثابتة', 'ضعف في العد التنازلي والتحديث المستمر'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي', 'متى يبدأ العام الدراسي', 'تاريخ مختصر'],
        gaps: ['ضعف في التوثيق الرسمي', 'لا تشرح ما الذي يجب أن تتابعه الأسرة عملياً'],
      },
    ],
  },
  'school-start-morocco': {
    factSources: [
      { label: 'وزارة التربية الوطنية والتعليم الأولي والرياضة - المغرب', url: 'https://www.men.gov.ma' },
      { label: 'البوابة الرسمية لوزارة التربية الوطنية - المغرب', url: 'https://www.men.gov.ma/Ar/Pages/Accueil.aspx' },
      { label: 'البوابة الوطنية للخدمات العمومية - المغرب', url: 'https://www.service-public.ma' },
    ],
    competitors: [
      {
        site: 'men.gov.ma',
        type: 'official',
        url: 'https://www.men.gov.ma',
        focus: ['الدخول المدرسي', 'المقرر الوزاري', 'التقويم الدراسي'],
        gaps: ['اللغة المؤسسية لا تجيب مباشرة عن نية كم باقي', 'لا تجمع العد التنازلي مع الشرح العملي للأسر'],
      },
      {
        site: 'المواقع الإخبارية المغربية',
        type: 'news',
        focus: ['الدخول المدرسي', 'بلاغات الوزارة', 'تفاصيل الموسم الدراسي'],
        gaps: ['تتغير بسرعة مع الخبر اليومي', 'غالباً لا تقدّم مرجعاً مستقراً طوال الموسم'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على الدخول المدرسي', 'موعد بداية الدراسة'],
        gaps: ['ضعف في التوثيق المغربي الرسمي', 'لا تشرح خصوصية مصطلح الدخول المدرسي في المغرب'],
      },
    ],
  },
  'school-start-algeria': {
    factSources: [
      { label: 'وزارة التربية الوطنية - الجزائر', url: 'https://www.education.gov.dz' },
      { label: 'الديوان الوطني للمطبوعات المدرسية - الجزائر', url: 'https://www.onps.dz' },
      { label: 'الوكالة الرسمية للأنباء الجزائرية', url: 'https://www.aps.dz' },
    ],
    competitors: [
      {
        site: 'education.gov.dz',
        type: 'official',
        url: 'https://www.education.gov.dz',
        focus: ['الدخول المدرسي', 'التقويم المدرسي', 'البيانات الرسمية'],
        gaps: ['لا يترجم نية البحث العربية المختصرة مباشرة', 'لا يقدّم عداداً تنازلياً أو خطوات استعداد'],
      },
      {
        site: 'الصحافة الجزائرية',
        type: 'news',
        focus: ['الدخول المدرسي', 'الكتب المدرسية', 'النقل والتنظيم'],
        gaps: ['تغطي الخبر ثم تختفي', 'ضعف في البنية المرجعية طويلة الأجل'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي', 'متى تبدأ الدراسة'],
        gaps: ['تعاني من عمومية زائدة', 'لا توضح القنوات الرسمية في الجزائر'],
      },
    ],
  },
  'school-start-qatar': {
    factSources: [
      { label: 'وزارة التربية والتعليم والتعليم العالي - قطر', url: 'https://www.edu.gov.qa' },
      { label: 'بوابة خدمات وزارة التعليم - قطر', url: 'https://www.edu.gov.qa/ar/Pages/default.aspx' },
      { label: 'بوابة حكومة قطر - التعليم', url: 'https://hukoomi.gov.qa/ar/service-categories/education' },
    ],
    competitors: [
      {
        site: 'edu.gov.qa',
        type: 'official',
        url: 'https://www.edu.gov.qa',
        focus: ['التقويم الأكاديمي', 'بدء الدراسة', 'الإعلانات التعليمية'],
        gaps: ['لا يقدّم إجابة عربية خدمية فورية', 'لا يجمع العد التنازلي مع التهيئة الأسرية'],
      },
      {
        site: 'المواقع المحلية القطرية',
        type: 'news',
        focus: ['موعد بدء الدراسة', 'الجداول المدرسية', 'العودة للمدارس'],
        gaps: ['تغلب عليها الصياغة الخبرية', 'لا تبقى مرجعاً ثابتاً بعد نشر الخبر'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على الدراسة', 'موعد الدراسة في قطر'],
        gaps: ['ضعف في التوثيق المحلي', 'لا تشرح أين يتأكد ولي الأمر من الموعد'],
      },
    ],
  },
  'school-start-tunisia': {
    factSources: [
      { label: 'وزارة التربية - تونس', url: 'https://www.education.gov.tn' },
      { label: 'المركز الوطني البيداغوجي - تونس', url: 'https://www.cnp.com.tn' },
      { label: 'البوابة الوطنية للجمهورية التونسية', url: 'https://www.tunisie.gov.tn' },
    ],
    competitors: [
      {
        site: 'education.gov.tn',
        type: 'official',
        url: 'https://www.education.gov.tn',
        focus: ['الدخول المدرسي', 'الرزنامة المدرسية', 'المذكرات الرسمية'],
        gaps: ['لا يقدّم عداداً مباشراً', 'لا يشرح نية البحث الأسرية بلغة خدمية'],
      },
      {
        site: 'المواقع الإخبارية التونسية',
        type: 'news',
        focus: ['الدخول المدرسي', 'التقويم', 'الدروس والنقل'],
        gaps: ['أقرب إلى الخبر من المرجع الدائم', 'تتبدد فائدتها بعد يوم النشر'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على الدخول المدرسي', 'موعد العودة'],
        gaps: ['ضعف في التفاصيل المحلية', 'لا تربط الموعد بما يحتاجه ولي الأمر عملياً'],
      },
    ],
  },
  'school-start-uae': {
    factSources: [
      { label: 'وزارة التربية والتعليم - الإمارات', url: 'https://www.moe.gov.ae' },
      { label: 'المنصة الرسمية لحكومة الإمارات - التعليم', url: 'https://u.ae/ar-ae/information-and-services/education' },
      { label: 'البوابة الرسمية لحكومة الإمارات', url: 'https://u.ae' },
    ],
    competitors: [
      {
        site: 'moe.gov.ae',
        type: 'official',
        url: 'https://www.moe.gov.ae',
        focus: ['التقويم الأكاديمي', 'بداية الدراسة', 'الإعلانات التعليمية'],
        gaps: ['لا يجمع نية كم باقي مع الشرح السريع', 'اللغة رسمية أكثر من كونها خدمية'],
      },
      {
        site: 'المواقع المحلية الإماراتية',
        type: 'news',
        focus: ['تاريخ العودة للمدارس', 'التقويم المدرسي', 'المدارس الحكومية والخاصة'],
        gaps: ['تكرار الخبر من دون صفحة مرجعية ثابتة', 'ضعف في التحضير العملي للأسر'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على الدراسة', 'متى تبدأ الدراسة في الإمارات'],
        gaps: ['لا توثق الفروقات المحلية جيداً', 'تفتقر إلى مرجعية رسمية واضحة'],
      },
    ],
  },
  'school-start-saudi': {
    factSources: [
      { label: 'وزارة التعليم - السعودية', url: 'https://moe.gov.sa' },
      { label: 'التقويم الدراسي - وزارة التعليم السعودية', url: 'https://moe.gov.sa/ar/education/generaleducation/Pages/academiccalendar.aspx' },
      { label: 'المنصة الوطنية الموحدة - التعليم', url: 'https://www.my.gov.sa' },
    ],
    competitors: [
      {
        site: 'moe.gov.sa',
        type: 'official',
        url: 'https://moe.gov.sa',
        focus: ['التقويم الدراسي', 'عودة الطلاب', 'الإعلانات الرسمية'],
        gaps: ['لا يقدّم عداداً تنازلياً سريعاً', 'لا يشرح للمستخدم سبب ظهور أكثر من تاريخ متداول عند وجود استثناءات'],
      },
      {
        site: 'المواقع الإخبارية السعودية',
        type: 'news',
        focus: ['تاريخ العودة', 'التقويم الدراسي', 'الاستثناءات التعليمية'],
        gaps: ['تغلب عليها الصياغة الخبرية المؤقتة', 'لا تبني مرجعاً دائماً للبحث المتكرر'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على الدراسة', 'متى تبدأ الدراسة في السعودية'],
        gaps: ['ضعف في تفسير اختلاف التواريخ', 'نقص في الربط بين الموعد والقرار التعليمي الرسمي'],
      },
    ],
  },
  'hajj-season': {
    factSources: [
      { label: 'تقويم أم القرى', url: 'https://www.ummulqura.org.sa' },
      { label: 'وزارة الحج والعمرة السعودية', url: 'https://haj.gov.sa' },
      { label: 'بوابة نسك', url: 'https://www.nusuk.sa' },
    ],
    competitors: [
      {
        site: 'haj.gov.sa',
        type: 'official',
        url: 'https://haj.gov.sa',
        focus: ['بداية موسم الحج', 'أيام المناسك', 'التنظيم الرسمي'],
        gaps: ['لا يخدم صيغة كم باقي مباشرة', 'يركز على التنظيم أكثر من نية الباحث العربي الخدمية'],
      },
      {
        site: 'المواقع الإسلامية العربية',
        type: 'guide',
        focus: ['يوم التروية', 'أيام الحج', 'الترتيب الزمني للمناسك'],
        gaps: ['غالباً لا تربط المعنى الشرعي بالتوقيت الحالي والعداد المباشر'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على الحج', 'متى تبدأ أيام الحج'],
        gaps: ['تفقد الدقة التنظيمية', 'لا تشرح تسلسل يوم التروية وعرفة والنحر بصورة كافية'],
      },
    ],
  },
  mawlid: {
    factSources: [
      { label: 'تقويم أم القرى', url: 'https://www.ummulqura.org.sa' },
      { label: 'موقع الإسلام سؤال وجواب', url: 'https://islamqa.info/ar' },
      { label: 'موقع ابن باز', url: 'https://binbaz.org.sa' },
    ],
    competitors: [
      {
        site: 'المواقع الإسلامية المرجعية',
        type: 'reference',
        focus: ['تاريخ المولد النبوي', 'حكم الاحتفال', 'اختلاف الممارسات بين الدول'],
        gaps: ['غالباً لا تجمع بين التاريخ والعد التنازلي وخدمة الباحث العامة'],
      },
      {
        site: 'الصحافة العربية الموسمية',
        type: 'news',
        focus: ['هل هو إجازة', 'متى المولد النبوي هذا العام', 'التهاني والاحتفال'],
        gaps: ['تقدم أخباراً متفرقة أكثر من كونها مرجعاً ثابتاً'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على المولد النبوي', 'متى المولد النبوي'],
        gaps: ['ضعف في التوثيق والتفريق بين التاريخ والإحياء المحلي'],
      },
    ],
  },
  'thanaweya-results': {
    factSources: [
      { label: 'الموقع الرسمي لوزارة التربية والتعليم - مصر', url: 'https://moe.gov.eg' },
      { label: 'بوابة مركز معلومات وزارة التربية والتعليم - مصر', url: 'https://emis.gov.eg' },
    ],
    competitors: [
      {
        site: 'moe.gov.eg',
        type: 'official',
        url: 'https://moe.gov.eg',
        focus: ['موعد النتيجة', 'الرابط الرسمي', 'إعلان الوزارة'],
        gaps: ['لا يركز على نية كم باقي', 'لا يشرح الخطوات التالية بعد ظهور النتيجة داخل صفحة واحدة'],
      },
      {
        site: 'البوابات الإخبارية المصرية',
        type: 'news',
        focus: ['موعد إعلان النتيجة', 'اعتماد النتيجة', 'روابط الاستعلام'],
        gaps: ['تتغير بسرعة', 'كثير منها يعيد الصياغة نفسها من دون فائدة خدمية إضافية'],
      },
      {
        site: 'صفحات العد التنازلي العربية',
        type: 'countdown',
        focus: ['كم باقي على نتيجة الثانوية العامة', 'متى تظهر النتيجة'],
        gaps: ['ضعف في التوثيق المصري الرسمي', 'لا تضيف خطوات واضحة للاستعلام والتظلم والتنظيم بعد الظهور'],
      },
    ],
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    write: args.includes('--write'),
    slugs: null as string[] | null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--slug=')) {
      out.slugs = arg.split('=')[1].split(',').map((value) => value.trim()).filter(Boolean);
    }
    if (arg === '--slug' && args[i + 1] && !args[i + 1].startsWith('--')) {
      out.slugs = args[i + 1].split(',').map((value) => value.trim()).filter(Boolean);
      i += 1;
    }
  }

  return out;
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function listSlugs() {
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function main() {
  const { write, slugs } = parseArgs();
  const targets = slugs?.length ? slugs : listSlugs();
  let changed = 0;

  for (const slug of targets) {
    const researchPath = join(EVENTS_SOURCE_DIR, slug, 'research.json');
    const packagePath = join(EVENTS_SOURCE_DIR, slug, 'package.json');
    if (!existsSync(researchPath) || !existsSync(packagePath)) continue;

    const researchRaw = JSON.parse(readFileSync(researchPath, 'utf8'));
    const packageRaw = JSON.parse(readFileSync(packagePath, 'utf8'));
    const seed = RESEARCH_SEEDS[slug] || {};
    const packageSources = Array.isArray(packageRaw?.richContent?.sources)
      ? packageRaw.richContent.sources.filter((entry: any) => entry?.label && entry?.url)
      : [];

    const next = {
      ...researchRaw,
      capturedAt: new Date().toISOString(),
      factSources: uniqueBy(
        [
          ...(Array.isArray(researchRaw.factSources) ? researchRaw.factSources : []),
          ...packageSources,
          ...(seed.factSources || []),
        ],
        (item) => String(item?.url || item?.label || '').trim(),
      ),
      competitors: uniqueBy(
        [
          ...(Array.isArray(researchRaw.competitors) ? researchRaw.competitors : []),
          ...(seed.competitors || []),
        ],
        (item) => `${String(item?.site || '').trim()}::${String(item?.type || '').trim()}`,
      ),
    };

    const before = `${JSON.stringify(researchRaw, null, 2)}\n`;
    const after = `${JSON.stringify(next, null, 2)}\n`;
    if (before === after) continue;
    changed += 1;
    if (write) writeFileSync(researchPath, after, 'utf8');
  }

  console.log(`[events:sync-research] ${write ? 'Updated' : 'Would update'} ${changed} research file(s).`);
}

main();
