import AgeDifferenceCalculator from '@/components/calculators/age/AgeDifferenceCalculator.client';
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

const title = 'كم فرق العمر بين شخصين؟';
const description = 'أدخل تاريخي ميلاد شخصين لتحسب فرق العمر الحقيقي بينهما بالسنوات والأشهر والأيام، مع تحديد من الأكبر سناً، إجمالي أيام الفارق، والعمر الحالي لكل شخص.';
const quickAnswers = [
  {
    question: 'كم فرق العمر بين شخصين؟',
    description: 'الجواب الأساسي الذي يبحث عنه أغلب الزوار.',
    answer: 'أدخل تاريخي الميلاد وستعرض الحاسبة الفارق الكامل بالسنوات والأشهر والأيام، وتحدد الشخص الأكبر سناً وإجمالي أيام الفارق.',
  },
  {
    question: 'لماذا لا يكفي طرح سنة الميلاد من سنة الميلاد؟',
    description: 'خطأ شائع في الحساب اليدوي.',
    answer: 'لأن الشهر واليوم يغيران النتيجة. شخصان بينهما خمس سنوات في أرقام السنوات قد يكون الفارق الحقيقي أقل أو أكثر بعدة أشهر وأيام حسب تاريخ الميلاد الكامل.',
  },
  {
    question: 'هل تصلح لفرق العمر بين الزوجين أو الإخوة؟',
    description: 'نية بحث عربية شائعة.',
    answer: 'نعم. الأداة تقارن أي تاريخي ميلاد: زوجين، إخوة، أصدقاء، زملاء، أو شخصيات تاريخية. لكنها تحسب الزمن فقط ولا تحكم على التوافق أو العلاقة.',
  },
  {
    question: 'هل تعرض عمر كل شخص أيضاً؟',
    description: 'حتى لا تحتاج فتح حاسبة أخرى.',
    answer: 'نعم. بعد حساب الفارق تعرض الصفحة العمر الحالي لكل شخص، حتى ترى المقارنة والفردين في نفس الشاشة.',
  },
];
const decisionRows = [
  {
    key: 'full-gap',
    cells: ['أريد الفارق الدقيق', 'فرق العمر الكامل', 'اقرأ السنوات والأشهر والأيام معاً، ولا تكتفِ برقم السنوات.'],
  },
  {
    key: 'older',
    cells: ['أريد معرفة من الأكبر', 'بطاقة الأكبر سناً', 'اقرأ الاسم أولاً ثم راجع الفارق حتى لا تعكس المقارنة.'],
  },
  {
    key: 'days',
    cells: ['أريد فرق العمر بالأيام', 'إجمالي أيام الفارق', 'مفيد للمقارنات الدقيقة والمشاركة، لكنه أقل طبيعية من صيغة السنوات والأشهر.'],
  },
  {
    key: 'generation',
    cells: ['أريد معرفة هل نحن من الجيل نفسه', 'بطاقة الجيل', 'استخدمها كلمحة زمنية عامة لا كحكم على التفكير أو التوافق.'],
  },
];
const methodItems = [
  {
    title: 'نرتب التاريخين أولاً',
    description: 'الأكبر سناً هو صاحب تاريخ الميلاد الأقدم.',
    content:
      'قبل حساب الفارق، تحدد الصفحة أي التاريخين أقدم. بعد ذلك تحسب المدة بين تاريخ الأكبر وتاريخ الأصغر، لأن الفارق يجب أن يكون موجباً ومقروءاً لا رقماً سالباً مربكاً.',
  },
  {
    title: 'نحسب السنوات الكاملة ثم الأشهر ثم الأيام',
    description: 'هذه هي القراءة التي يفهمها الناس.',
    content:
      'بدلاً من تحويل كل شيء إلى أيام فقط، تفك الحاسبة الفارق إلى سنوات كاملة، ثم أشهر، ثم أيام. هذا يجعل الجواب مناسباً لسؤال يومي مثل: بيننا 4 سنوات و3 أشهر و12 يوماً.',
  },
  {
    title: 'إجمالي الأيام يضيف دقة',
    description: 'لكنه ليس دائماً أفضل صيغة للمشاركة.',
    content:
      'إجمالي الأيام مفيد إذا كنت تريد رقماً دقيقاً جداً، لكنه قد يكون أقل وضوحاً في الحديث اليومي. لذلك تعرض الصفحة الصيغتين معاً: الفارق البشري وإجمالي الأيام.',
  },
  {
    title: 'العمر الحالي لكل شخص يمنع الالتباس',
    description: 'الفارق وحده لا يخبرك بعمر الطرفين اليوم.',
    content:
      'قد يكون الفارق بين شخصين خمس سنوات، لكن معنى ذلك يختلف إذا كانا طفلين أو بالغين. عرض عمر كل شخص يساعدك على قراءة المقارنة في سياقها الزمني الصحيح.',
  },
];
const exampleItems = [
  {
    title: 'فرق العمر بين الزوجين',
    description: 'استخدم الرقم كحقيقة زمنية فقط.',
    content:
      'إذا كان السؤال اجتماعياً، فالحاسبة تخبرك بالفرق الحقيقي ولا تقول إن الفارق مناسب أو غير مناسب. التوافق يحتاج سياقاً أوسع من رقم العمر وحده.',
  },
  {
    title: 'فرق العمر بين الإخوة',
    description: 'الأشهر والأيام مهمة في المقارنات العائلية.',
    content:
      'في العائلة قد تقولون “بينهما سنتان”، لكن الحاسبة تظهر أن الفارق سنتان وسبعة أشهر مثلاً. هذا أدق عند المناسبات أو المقارنات الطريفة.',
  },
  {
    title: 'مقارنة شخصيات تاريخية',
    description: 'مفيد للتعليم والفضول.',
    content:
      'يمكنك إدخال تاريخي ميلاد شخصيتين لمعرفة الفارق الحقيقي بينهما. هنا تصبح النتيجة أداة لفهم السياق الزمني، لا مجرد سؤال عائلي.',
  },
  {
    title: 'نماذج أو شروط عمرية',
    description: 'راجع الجهة المطلوبة دائماً.',
    content:
      'إذا كان الفرق مطلوباً في مدرسة، رياضة، مسابقة، أو إجراء رسمي، فاستخدم النتيجة كقراءة أولى ثم طابقها مع طريقة الحساب التي تطلبها الجهة المعنية.',
  },
];
const sourceLinks = [
  {
    href: 'https://www.timeanddate.com/date/duration.html',
    title: 'timeanddate: المدة بين تاريخين',
    description: 'مرجع مقارن لفكرة حساب المدة والفارق بين تاريخين بالأيام والسنوات.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://aa.usno.navy.mil/faq/leap_years',
    title: 'US Naval Observatory: السنوات الكبيسة',
    description: 'يفسر لماذا تؤثر السنوات الكبيسة وأطوال الشهور في حساب الفرق بين تاريخين.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: '/calculators/age/calculator',
    title: 'حاسبة العمر الكاملة',
    description: 'استخدمها عندما تريد عمر شخص واحد بالتفصيل قبل أو بعد المقارنة.',
    ctaLabel: 'افتح الحاسبة',
  },
];

export const metadata = buildAgeMetadata({
  title: 'كم فرق العمر بين شخصين؟ | حاسبة الفرق بالأيام والسنوات',
  description,
  keywords: [
    'حاسبة فرق العمر',
    'فرق العمر بين شخصين',
    'فرق العمر بين الزوجين',
    'حساب الفارق العمري',
    'فرق العمر بين الإخوة',
    'من الأكبر سناً',
    'فرق العمر بالأيام',
    'حاسبة فرق السن بين شخصين',
  ],
  path: '/calculators/age/difference',
});

export default function AgeDifferencePage() {
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
    name: 'كيفية حساب فرق العمر بين شخصين',
    description: 'خطوات حساب فرق العمر بين شخصين بالسنوات والأشهر والأيام مع تحديد الأكبر سناً.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل بيانات الشخص الأول',
        text: 'اكتب الاسم اختيارياً، ثم أدخل تاريخ ميلاد الشخص الأول بالميلادي أو الهجري.',
      },
      {
        '@type': 'HowToStep',
        name: 'أدخل بيانات الشخص الثاني',
        text: 'أدخل تاريخ ميلاد الشخص الثاني بنفس الدقة حتى تكون المقارنة عادلة.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ الفارق ومن الأكبر',
        text: 'ابدأ ببطاقة فرق العمر، ثم راجع من الأكبر وإجمالي أيام الفارق وعمر كل شخص.',
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
            { name: title, href: '/calculators/age/difference' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/difference' })) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="مقارنة مباشرة"
        title="كم فرق العمر بين شخصين؟ حاسبة الفرق بالسنوات والأيام"
        description={description}
        highlights={[
          'تحسب الفارق الحقيقي بالسنوات والأشهر والأيام لا بطرح السنوات فقط.',
          'تحدد الشخص الأكبر سناً وتعرض إجمالي أيام الفارق بوضوح.',
          'تعرض عمر كل شخص الحالي حتى تفهم المقارنة في سياقها.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeDifferenceCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="difference-decision"
        eyebrow="اختيار النتيجة"
        title="أي رقم من نتيجة فرق العمر تحتاجه؟"
        description="فرق العمر يحتوي أكثر من قراءة. اختر الصيغة التي تخدم سؤالك حتى لا تستخدم إجمالي الأيام في سياق يحتاج صيغة بشرية أو اجتماعية."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الجزء المناسب', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="difference-method"
        eyebrow="شرح مبسط"
        title="لماذا فرق العمر ليس مجرد طرح سنة من سنة؟"
        description="الشهور وأطوالها والسنوات الكبيسة تجعل الحساب اليدوي عرضة للخطأ. لذلك تعتمد الصفحة على التاريخ الكامل لا سنة الميلاد وحدها."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="difference-examples"
        eyebrow="أمثلة عملية"
        title="متى تستخدم حاسبة فرق العمر؟"
        description="هذه أمثلة تساعدك على قراءة النتيجة كفارق زمني واضح لا كحكم اجتماعي أو شخصي."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="difference-sources"
        eyebrow="مصادر ومنهج"
        title="مصادر لفهم الفرق بين تاريخين"
        description="تعتمد الصفحة على حساب زمني بين تاريخين. هذه المصادر تساعدك على فهم المدة والسنوات الكبيسة وأثر الشهور المختلفة."
        subtle
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="difference-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل تفسير فرق العمر"
        description="إجابات سريعة عن الفارق الكامل، الأكبر سناً، واستخدام النتيجة في العلاقات أو المقارنات العائلية."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="difference" />
    </main>
  );
}
