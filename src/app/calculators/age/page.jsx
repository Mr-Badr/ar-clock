import { Suspense } from 'react';

import AgeCalculator from '@/components/calculators/age/AgeCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorResourceLinks,
  CalculatorSection,
  CalculatorToolLauncher,
} from '@/components/calculators/common';
import {
  AGE_CALCULATOR_ROUTES,
  AGE_COMMON_FAQ,
  AGE_ROUTE,
} from '@/lib/calculators/age-data';
import { buildBreadcrumbSchema, buildSoftwareSchema, buildAgeMetadata } from './page-helpers';
import { getSiteUrl } from '@/lib/site-config';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();
const AGE_EXPLAINER_ITEMS = [
  {
    title: 'ما المقصود بحاسبة العمر؟',
    description: 'هي أداة تقيس الزمن بين تاريخ ميلادك وتاريخ المقارنة.',
    content:
      'بدلاً من طرح سنة الميلاد من السنة الحالية فقط، تحسب الصفحة السنوات الكاملة أولاً، ثم الأشهر، ثم الأيام. لذلك تحصل على جواب أقرب للسؤال الحقيقي: كم عمري اليوم بالتفصيل؟',
  },
  {
    title: 'لماذا لا تكفي السنوات وحدها؟',
    description: 'لأن يوم وشهر الميلاد يغيران النتيجة.',
    content:
      'شخصان وُلدا في السنة نفسها قد لا يملكان العمر نفسه اليوم. إذا كان عيد ميلاد أحدهما مرّ هذا العام والآخر لم يأتِ بعد، فالفرق قد يكون أشهراً وأياماً لا تظهر في الحساب السريع.',
  },
  {
    title: 'متى تستخدم تاريخ مقارنة؟',
    description: 'عندما تريد العمر في يوم محدد لا العمر اليوم.',
    content:
      'استخدم تاريخ المقارنة لمعرفة عمرك في يوم صورة قديمة، موعد دراسة، تاريخ وثيقة، مناسبة قادمة، أو يوم تقاعد محتمل. هذا يحول الحاسبة من فضول سريع إلى أداة تخطيط.',
  },
  {
    title: 'ما حدود النتيجة؟',
    description: 'الحاسبة دقيقة زمنياً لكنها ليست مرجعاً قانونياً وحدها.',
    content:
      'إذا كان القرار متعلقاً بوثيقة، أهلية دراسة، عقد، تأمين، أو تقاعد، استخدم النتيجة كقراءة واضحة ثم راجع الجهة الرسمية التي تعتمد التقويم والقواعد في بلدك.',
  },
];

const AGE_DECISION_ROWS = [
  {
    key: 'basic',
    cells: [
      'كم عمري الان؟',
      'حاسبة العمر الأساسية',
      'تعطي العمر بالسنوات والأشهر والأيام مع إجمالي الأيام والساعات وعيد الميلاد القادم.',
    ],
  },
  {
    key: 'hijri',
    cells: [
      'أريد العمر الهجري أو مقارنة التقويمين',
      'حاسبة العمر الهجري',
      'مناسبة عندما يكون تاريخ الميلاد هجرياً أو عندما تحتاج مقارنة التقويمين في سياق خليجي أو ديني.',
    ],
  },
  {
    key: 'difference',
    cells: [
      'أقارن عمر شخصين',
      'حاسبة فرق العمر',
      'استخدمها للأزواج أو الإخوة أو الأصدقاء عندما تريد الفرق الحقيقي لا الفرق التقريبي.',
    ],
  },
  {
    key: 'birthday',
    cells: [
      'أريد عيد الميلاد أو يوم الولادة',
      'يوم الميلاد أو عداد عيد الميلاد',
      'مفيدة عندما تريد اليوم، الفصل، نصف عيد الميلاد، أو الوقت المتبقي للمناسبة القادمة.',
    ],
  },
  {
    key: 'planning',
    cells: [
      'أريد محطة عمرية أو تقاعداً',
      'محطات العمر أو حاسبة التقاعد',
      'استخدمها للمتعة أو التخطيط الأولي، ولا تعتمد نتيجة التقاعد رسمياً قبل مراجعة نظام بلدك.',
    ],
  },
];

const AGE_SOURCE_LINKS = [
  {
    href: 'https://aa.usno.navy.mil/faq/leap_years',
    title: 'US Naval Observatory: قاعدة السنوات الكبيسة',
    description: 'مرجع يوضح لماذا لا تكون السنة الميلادية دائماً 365 يوماً وكيف تعمل قاعدة 400 سنة.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://praycalc.org/hijri',
    title: 'PrayCalc: أنظمة التقويم الهجري',
    description: 'شرح مبسط للتقويم الهجري القمري، أشهر 29/30 يوماً، وسنة 354/355 يوماً تقريباً.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://science.nasa.gov/solar-system/planets/',
    title: 'NASA: كواكب المجموعة الشمسية',
    description: 'مرجع تعليمي عند قراءة العمر على الكواكب وفهم اختلاف السنة من كوكب لآخر.',
    ctaLabel: 'راجع المصدر',
  },
];

const AGE_RELATED_GUIDES = [
  {
    href: '/date/today',
    title: 'تاريخ اليوم',
    description: 'راجع تاريخ اليوم بالميلادي والهجري قبل مشاركة نتيجة مرتبطة بموعد.',
  },
  {
    href: '/date/converter',
    title: 'تحويل التاريخ',
    description: 'حوّل التاريخ بين التقويمين عندما تكون الوثيقة مكتوبة بصيغة مختلفة.',
  },
  {
    href: '/calculators/sleep/sleep-needs-by-age',
    title: 'احتياج النوم حسب العمر',
    description: 'بعد معرفة العمر، قارنه بنطاق النوم المناسب للأطفال أو البالغين.',
  },
];
const AGE_TOOL_LABELS = {
  calculator: 'العمر الآن',
  hijri: 'هجري وميلادي',
  difference: 'فرق عمر',
  'birth-day': 'يوم الميلاد',
  milestones: 'محطات عمرية',
  planets: 'تعليم ممتع',
  countdown: 'عد تنازلي',
  retirement: 'تخطيط تقاعد',
};
const AGE_TOOL_CTAS = {
  calculator: 'ابدأ حساب العمر',
  hijri: 'احسب العمر الهجري',
  difference: 'احسب فرق العمر',
  'birth-day': 'اعرف يوم ميلادك',
  milestones: 'اعرف محطتك القادمة',
  planets: 'قارن عمرك على الكواكب',
  countdown: 'ابدأ العد التنازلي',
  retirement: 'قدّر موعد التقاعد',
};
const AGE_TOOL_ICONS = {
  calculator: 'عمر',
  hijri: 'هجري',
  difference: 'فرق',
  'birth-day': 'يوم',
  milestones: '10K',
  planets: 'كواكب',
  countdown: 'عد',
  retirement: 'تقاعد',
};

export const metadata = buildAgeMetadata({
  title: 'حاسبة العمر | احسب عمرك بالهجري والميلادي وفرق العمر',
  description:
    'احسب عمرك الان بالسنوات والأشهر والأيام، واعرف العمر الهجري والميلادي وفرق العمر وكم باقي على عيد ميلادك من صفحة عربية واضحة.',
  keywords: AGE_ROUTE.keywords,
  path: AGE_ROUTE.href,
});

export default function AgeHubPage() {
  const safeRoutes = Array.isArray(AGE_CALCULATOR_ROUTES) ? AGE_CALCULATOR_ROUTES : [];
  const safeFaqItems = Array.isArray(AGE_COMMON_FAQ) ? AGE_COMMON_FAQ : [];
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: safeRoutes.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', href: '/' },
    { name: 'الحاسبات', href: '/calculators' },
    { name: 'حاسبات العمر', href: '/calculators/age' },
  ]);
  const softwareSchema = buildSoftwareSchema({
    name: 'حاسبات العمر',
    description: metadata.description,
    path: '/calculators/age',
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: safeFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const toolLauncherItems = safeRoutes.map((item) => ({
    href: item.href,
    label: AGE_TOOL_LABELS[item.slug] || 'مسار عمر',
    title: item.title,
    description: item.description,
    ctaLabel: AGE_TOOL_CTAS[item.slug] || 'افتح الأداة',
    iconLabel: AGE_TOOL_ICONS[item.slug] || 'عمر',
  }));

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CalculatorHero
        badge="حاسبة العمر العربية"
        title="حاسبة العمر: احسب عمرك الان بالسنوات والأشهر والأيام"
        description="أدخل تاريخ ميلادك لتعرف عمرك الان بدقة: سنوات، أشهر، أيام، إجمالي الأيام والساعات، عيد الميلاد القادم، والعمر الهجري التقريبي. ثم اختر أداة العمر المناسبة إذا كنت تريد فرق العمر، يوم الولادة، العد التنازلي، محطات العمر، أو التقاعد."
        highlights={[
          'يجيب مباشرة عن: كم عمري الان؟ كم يوم عشت؟ وكم باقي على عيد ميلادي؟',
          'يدعم الميلادي والهجري ويشرح سبب اختلاف النتيجة بين التقويمين بلغة بسيطة.',
          'يحافظ على النتيجة كحساب زمني واضح، بلا تنبؤات أو وعود شخصية غير قابلة للتحقق.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCalculator compact />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="age-hub-explainer"
        eyebrow="الجواب أولاً"
        title="كيف تقرأ نتيجة حاسبة العمر دون أن تخلط بين التقويمات؟"
        description="حاسبة العمر لا تسأل عن رقم السنوات فقط. هي تقيس الفترة الكاملة بين تاريخين، ثم تعرضها بطريقة تفهمها أنت وتستطيع استخدامها في الحياة اليومية."
      >
        <CalculatorInfoGrid items={AGE_EXPLAINER_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="age-hub-tools"
        eyebrow="ابدأ من السؤال"
        title="اختر حاسبة العمر بحسب ما تريد معرفته الآن"
        description="ابدأ بالحاسبة الأساسية إذا كان سؤالك هو: كم عمري الان؟ ثم انتقل للمسارات الأخرى عندما تحتاج الهجري، فرق العمر، عيد الميلاد، أو التقاعد."
      >
        <CalculatorToolLauncher
          items={toolLauncherItems}
          ariaLabel="اختيار حاسبة العمر المناسبة"
          badge="8 مسارات عمر"
          featuredLabel="البداية الأسرع"
          theme="blue"
          note="لا تحتاج كل هذه الأدوات في الزيارة نفسها. اختر المسار الذي يطابق سؤالك الان، ثم ارجع إلى هذا القسم عندما يتغير السؤال من “كم عمري؟” إلى “كم الفرق؟” أو “كم بقي؟” أو “ما معنى النتيجة؟”."
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-decision-table"
        eyebrow="اختيار أدق"
        title="اختر حاسبة العمر حسب السؤال، لا حسب الفضول"
        description="كل أداة في قسم العمر لها وظيفة مختلفة. ابدأ بالعمر الآن، ثم انتقل إلى الهجري أو الفرق أو العد التنازلي عندما يصبح هذا هو السؤال الحقيقي."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الأداة المناسبة', 'ما الذي تضيفه؟']}
          rows={AGE_DECISION_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-sources"
        eyebrow="مصادر ومنهج"
        title="مصادر تساعدك على فهم التقويم لا حفظ الأرقام"
        description="نستخدم هذه المراجع لتفسير السنوات الكبيسة، الفرق بين الهجري والميلادي، وفكرة العمر على الكواكب. النتيجة داخل الحاسبة تبقى حساباً زمنياً لا حكماً رسمياً."
      >
        <CalculatorResourceLinks items={AGE_SOURCE_LINKS} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="age-related"
        eyebrow="مسارات تكمل الحساب"
        title="بعد حساب العمر: صفحات قد تحتاجها مباشرة"
        description="إذا كان سبب الحساب مرتبطاً بتاريخ أو وثيقة أو نمط حياة، فهذه الصفحات تكمل السؤال دون أن تعيد البداية."
        subtle
      >
        <CalculatorResourceLinks items={AGE_RELATED_GUIDES} buttonLabel="افتح المسار" />
      </CalculatorSection>

      <CalculatorSection
        id="age-hub-faq"
        eyebrow="قبل اختيار أداة العمر"
        title="أسئلة قبل حساب العمر أو مقارنة التواريخ"
        description="هذه الصفحة تمهّد لكل الأدوات داخل القسم وتوضح متى تكفي حاسبة العمر، ومتى تحتاج فرق العمر أو العد التنازلي أو التاريخ الموازي."
      >
        <CalculatorFaqSection items={safeFaqItems} />
      </CalculatorSection>

    </main>
  );
}
