import AgeCountdownCalculator from '@/components/calculators/age/AgeCountdownCalculator.client';
import {
  CalculatorDecisionTable,
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorResourceLinks,
  CalculatorSection,
} from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { AgeToolSections } from '../tool-sections';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const title = 'كم باقي على عيد ميلادي؟';
const description = 'أدخل تاريخ ميلادك لتعرف كم باقي على عيد ميلادك القادم بالأيام والساعات والدقائق والثواني، مع تاريخ العيد القادم ونسبة التقدم من آخر عيد ميلاد.';
const quickAnswers = [
  {
    question: 'كم باقي على عيد ميلادي؟',
    description: 'السؤال الأساسي لهذه الصفحة.',
    answer: 'أدخل تاريخ ميلادك وستعرض الصفحة عداداً حياً حتى عيد ميلادك القادم بالأيام والساعات والدقائق والثواني، مع تاريخ العيد واليوم الذي سيوافقه.',
  },
  {
    question: 'ماذا يحدث إذا كان عيد ميلادي مرّ هذا العام؟',
    description: 'نقطة يخطئ فيها الحساب اليدوي كثيراً.',
    answer: 'تنتقل الحاسبة تلقائياً إلى عيد ميلادك في السنة التالية. لا تحتاج إلى تغيير السنة يدوياً، لأن المطلوب هو العيد القادم لا تاريخ الميلاد الأصلي فقط.',
  },
  {
    question: 'هل العداد يعمل بتوقيت بلدي؟',
    description: 'مهم للمستخدمين في الدول العربية المختلفة.',
    answer: 'العداد يعتمد على تاريخ ووقت جهازك، لذلك يقرأ اليوم الحالي ومنتصف الليل محلياً. إذا كان وقت جهازك خاطئاً فقد تظهر نتيجة غير دقيقة قرب نهاية اليوم.',
  },
  {
    question: 'ما فائدة نسبة التقدم بين عيدين؟',
    description: 'تحول الأيام المتبقية إلى سياق أوضح.',
    answer: 'النسبة تخبرك أين أنت بين آخر عيد ميلاد والعيد القادم. أحياناً يكون رقم الأيام كبيراً، لكن نسبة التقدم تجعل الصورة أسهل: كم مضى من السنة الشخصية وكم بقي.',
  },
];
const decisionRows = [
  {
    key: 'days',
    cells: ['أريد جواباً سريعاً', 'الأيام المتبقية', 'اقرأ عدد الأيام أولاً، فهو أنسب رقم للرسائل والسؤال اليومي.'],
  },
  {
    key: 'live',
    cells: ['أريد عداداً يتحرك', 'الساعات والدقائق والثواني', 'استخدمها عندما تتابع العداد الآن أو تريد لقطة قبل المناسبة.'],
  },
  {
    key: 'date',
    cells: ['أريد موعد العيد القادم', 'تاريخ عيد الميلاد القادم', 'اقرأ اليوم والتاريخ لتعرف هل يأتي هذا العام أم السنة التالية.'],
  },
  {
    key: 'progress',
    cells: ['أريد فهم السنة الشخصية', 'نسبة التقدم بين عيدين', 'تفيد عندما تريد معرفة كم مضى من السنة بين آخر عيد والقادم.'],
  },
];
const methodItems = [
  {
    title: 'لا نستخدم سنة الميلاد القادمة عشوائياً',
    description: 'الحاسبة تحدد العيد القادم من تاريخ اليوم.',
    content:
      'تأخذ الصفحة يوم وشهر ميلادك، ثم تبحث عن أقرب عيد ميلاد قادم. إذا كان العيد لم يأت بعد في السنة الحالية، تستخدم هذه السنة. وإذا مرّ بالفعل، تنتقل تلقائياً إلى السنة التالية.',
  },
  {
    title: 'العداد يحسب حتى بداية يوم عيدك',
    description: 'الهدف هو الوصول إلى منتصف الليل المحلي.',
    content:
      'عندما يصل التاريخ إلى يوم عيد ميلادك، يصبح العداد صفراً عند بداية اليوم بحسب وقت جهازك. هذا يجعل النتيجة مفهومة للمشاركة، خصوصاً إذا كنت تتابعها قبل المناسبة بساعات.',
  },
  {
    title: 'التوقيت المحلي مهم',
    description: 'الدول العربية لا تدخل اليوم في اللحظة نفسها.',
    content:
      'قد يكون عيد الميلاد بدأ في الإمارات مثلاً بينما لم يبدأ بعد في المغرب. لذلك يعتمد العداد على وقت جهازك المحلي بدلاً من توقيت عالمي ثابت لا يناسب كل المستخدمين.',
  },
  {
    title: 'نسبة التقدم تضيف معنى',
    description: 'ليست كل القيمة في الأيام المتبقية.',
    content:
      'إذا بقي 120 يوماً مثلاً فقد يبدو الرقم كبيراً، لكن نسبة التقدم توضّح هل أنت في بداية السنة الشخصية أم قرب نهايتها، وهذا يجعل القراءة أسهل وأمتع.',
  },
];
const exampleItems = [
  {
    title: 'رسالة لصديق',
    description: 'عندما تريد جواباً خفيفاً وسريعاً.',
    content:
      'استخدم عدد الأيام المتبقية فقط إذا كنت ترسل رسالة مثل: “باقي 18 يوم على عيدك”. لا تحتاج إلى كل الثواني إلا إذا كنت تشارك لقطة من العداد نفسه.',
  },
  {
    title: 'تخطيط هدية أو حجز',
    description: 'عندما يتحول العداد إلى قرار عملي.',
    content:
      'إذا بقي أقل من أسبوعين، تعامل مع النتيجة كتنبيه للتجهيز. وإذا بقيت أشهر، استخدم تاريخ العيد القادم لاختيار يوم مناسب للشراء أو الحجز.',
  },
  {
    title: 'عيد ميلاد في 29 فبراير',
    description: 'حالة نادرة تحتاج قراءة هادئة.',
    content:
      'من وُلد في 29 فبراير قد يرى معالجة مختلفة حسب التقويم والسنة الكبيسة. احتفظ بالتاريخ الأصلي وراجع حاسبة العمر الكاملة أو الجهة المعنية إذا كان الاستخدام رسمياً.',
  },
  {
    title: 'مشاركة على الهاتف',
    description: 'اجعل النتيجة قصيرة وسهلة القراءة.',
    content:
      'أفضل صيغة للمشاركة هي: عدد الأيام، يوم العيد القادم، والتاريخ. الثواني ممتعة داخل الصفحة لكنها ليست ضرورية في كل رسالة.',
  },
];
const sourceLinks = [
  {
    href: 'https://www.timeanddate.com/date/duration.html',
    title: 'timeanddate: حساب المدة بين تاريخين',
    description: 'مرجع مقارن لفكرة حساب الأيام والمدة بين تواريخ مختلفة.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://aa.usno.navy.mil/faq/leap_years',
    title: 'US Naval Observatory: السنوات الكبيسة',
    description: 'مهم لفهم حالات 29 فبراير وتأثير السنوات الكبيسة في تواريخ الميلاد.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: '/calculators/age/calculator',
    title: 'حاسبة العمر الكاملة',
    description: 'استخدمها عندما تريد العمر الحالي وعدد الأيام التي عشتها، لا العداد فقط.',
    ctaLabel: 'افتح الحاسبة',
  },
];

export const metadata = buildAgeMetadata({
  title: 'كم باقي على عيد ميلادك؟ | عداد عيد الميلاد',
  description,
  keywords: [
    'كم باقي على عيد ميلادي',
    'عداد عيد الميلاد',
    'عد تنازلي عيد الميلاد',
    'متى عيد ميلادي القادم',
    'كم يوم باقي على عيد ميلادي',
    'عيد ميلادي بعد كم يوم',
    'عداد عيد الميلاد بالأيام والساعات',
    'كم باقي على عيد ميلادي القادم',
  ],
  path: '/calculators/age/countdown',
});

export default function AgeCountdownPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'كيفية حساب المتبقي على عيد الميلاد',
    description: 'خطوات معرفة كم باقي على عيد ميلادك القادم بالأيام والساعات والدقائق والثواني.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ ميلادك',
        text: 'اختر يوم وشهر وسنة الميلاد كما هي في تاريخك الأصلي.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ العداد الحي',
        text: 'ابدأ بعدد الأيام، ثم اقرأ الساعات والدقائق والثواني إذا كنت تتابع العداد مباشرة.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع تاريخ العيد القادم',
        text: 'تأكد من يوم وتاريخ عيد الميلاد القادم، خصوصاً إذا كان عيدك مرّ هذا العام.',
      },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema([
            { name: 'الرئيسية', href: '/' },
            { name: 'الحاسبات', href: '/calculators' },
            { name: 'حاسبات العمر', href: '/calculators/age' },
            { name: title, href: '/calculators/age/countdown' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/countdown' })) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="عداد حي"
        title="كم باقي على عيد ميلادي؟ عداد عيد الميلاد بالأيام والساعات"
        description={description}
        highlights={[
          'يتحرك كل ثانية داخل الصفحة ويعرض الأيام والساعات والدقائق والثواني.',
          'يحدد عيد الميلاد القادم تلقائياً إذا كان عيدك مرّ هذا العام.',
          'يعتمد على توقيت جهازك المحلي حتى تكون القراءة مناسبة لبلدك.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCountdownCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="countdown-decision"
        eyebrow="اختيار النتيجة"
        title="أي جزء من العدّاد تحتاجه الآن؟"
        description="ليست كل الأرقام مهمة في كل موقف. اختر القراءة التي تخدم سؤالك: رسالة سريعة، متابعة حية، تاريخ العيد، أو فهم السنة الشخصية."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الجزء المناسب', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="countdown-method"
        eyebrow="شرح مبسط"
        title="كيف يحدد العدّاد عيد الميلاد القادم؟"
        description="الخطأ الشائع هو حساب الفرق مع تاريخ الميلاد الأصلي. الأداة لا تفعل ذلك؛ هي تبحث عن النسخة القادمة من يوم ميلادك."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="countdown-examples"
        eyebrow="أمثلة عملية"
        title="متى تستخدم الأيام ومتى تهتم بالساعات والثواني؟"
        description="هذه أمثلة تجعل النتيجة قابلة للاستخدام في رسالة أو تخطيط أو مشاركة، بدل أن تبقى أرقاماً كثيرة على الشاشة."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="countdown-sources"
        eyebrow="مصادر ومنهج"
        title="مصادر لفهم المدة والسنوات الكبيسة"
        description="الصفحة تحسب مدة زمنية بين اليوم وعيد الميلاد القادم. هذه المصادر تساعد في فهم حساب المدة وحالات السنوات الكبيسة."
        subtle
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="countdown-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل الاعتماد على عداد عيد الميلاد"
        description="إجابات مختصرة عن العيد القادم، التوقيت المحلي، وحالات عيد الميلاد التي تحتاج انتباهاً."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="countdown" />
    </main>
  );
}
