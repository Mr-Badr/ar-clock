import RetirementAgeCalculator from '@/components/calculators/age/RetirementAgeCalculator.client';
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

const title = 'متى أتقاعد؟';
const description = 'احسب تقديراً أولياً لموعد بلوغ سن التقاعد حسب الدولة والقطاع وتاريخ الميلاد، مع تنبيه واضح أن النتيجة لا تحسب المعاش ولا تغني عن الجهة الرسمية.';
const quickAnswers = [
  {
    question: 'متى أتقاعد تقريباً؟',
    description: 'الجواب الأول الذي تقدمه الصفحة.',
    answer: 'أدخل تاريخ ميلادك واختر الدولة والقطاع، وستعرض الحاسبة تاريخاً تقريبياً لبلوغ سن التقاعد المستخدم في النموذج والمدة المتبقية حتى ذلك التاريخ.',
  },
  {
    question: 'هل هذه الحاسبة تحسب راتب التقاعد؟',
    description: 'حد مهم لتجنب سوء الاستخدام.',
    answer: 'لا. هذه الصفحة تحسب موعداً زمنياً تقريبياً فقط. لا تحسب المعاش، الاشتراكات، سنوات الخدمة، التقاعد المبكر، الخصومات، أو الاستثناءات.',
  },
  {
    question: 'هل النتيجة رسمية؟',
    description: 'الأهم في صفحة حساسة.',
    answer: 'لا. النتيجة مرجع أولي للتخطيط. سن التقاعد الفعلي قد يتغير حسب النظام، تاريخ الاشتراك، سنوات الخدمة، القطاع، والجنس، لذلك يجب مراجعة الجهة الرسمية في بلدك.',
  },
  {
    question: 'متى تكون الحاسبة مفيدة؟',
    description: 'حتى تستخدمها في السياق الصحيح.',
    answer: 'تفيد عندما تريد تصوراً سريعاً للأفق الزمني: كم سنة تقريباً أمامك؟ متى تبدأ التخطيط؟ وما المسار الرسمي الذي يجب أن تراجعه بعد ذلك؟',
  },
];
const decisionRows = [
  {
    key: 'age-date',
    cells: ['أريد موعداً زمنياً سريعاً', 'موعد بلوغ سن التقاعد', 'استخدم النتيجة لتقدير الإطار الزمني فقط، لا لحساب الاستحقاق.'],
  },
  {
    key: 'pension',
    cells: ['أريد راتب التقاعد', 'ليست هذه الصفحة', 'تحتاج جهة التأمينات/المعاشات لأنها تعرف الاشتراكات والراتب وسنوات الخدمة.'],
  },
  {
    key: 'early',
    cells: ['أفكر في التقاعد المبكر', 'راجع النظام الرسمي', 'التقاعد المبكر يتأثر بسنوات الخدمة والاشتراك والخصومات والاستثناءات.'],
  },
  {
    key: 'official',
    cells: ['أحتاج قراراً نهائياً', 'رابط الجهة الرسمية', 'استخدم الحاسبة كبداية ثم تحقق من الجهة المختصة قبل أي قرار مالي أو وظيفي.'],
  },
];
const methodItems = [
  {
    title: 'نبدأ بتاريخ الميلاد',
    description: 'العمر الحالي هو نقطة البداية.',
    content:
      'تقرأ الحاسبة تاريخ ميلادك وتحسب عمرك الحالي، ثم تضيف سن التقاعد المستخدم في النموذج لتقدير تاريخ بلوغ ذلك السن.',
  },
  {
    title: 'نختار قاعدة الدولة والقطاع',
    description: 'الدولة والقطاع يغيران النتيجة.',
    content:
      'القطاع الحكومي أو الخاص أو العسكري قد يستخدم سن تقاعد مختلفاً. لذلك لا يكفي إدخال تاريخ الميلاد وحده، بل يجب اختيار السياق الأقرب لحالتك.',
  },
  {
    title: 'النتيجة لا تعرف سجل خدمتك',
    description: 'وهذا سبب أنها تقديرية فقط.',
    content:
      'الحاسبة لا تعرف تاريخ بداية العمل، عدد سنوات الاشتراك، الانقطاعات، الراتب، أو الاستثناءات. هذه العناصر لا تظهر إلا لدى جهة التقاعد أو التأمينات.',
  },
  {
    title: 'التحقق الرسمي هو الخطوة التالية',
    description: 'خصوصاً قبل قرار مالي أو وظيفي.',
    content:
      'إذا قرب موعد التقاعد أو كنت تفكر في ترك العمل مبكراً، انتقل من هذه القراءة الأولية إلى بوابة الجهة الرسمية أو مستشار مختص.',
  },
];
const exampleItems = [
  {
    title: 'تخطيط زمني أولي',
    description: 'عندما تريد معرفة كم بقي تقريباً.',
    content:
      'إذا أظهرت النتيجة أن أمامك 12 سنة مثلاً، فهي تساعدك على تصور المدى الزمني للتخطيط المالي، لكنها لا تخبرك كم سيكون معاشك.',
  },
  {
    title: 'تقاعد مبكر',
    description: 'لا يكفي سن العمر وحده.',
    content:
      'قد يبلغ الشخص سناً يسمح بسؤال التقاعد المبكر، لكن الاستحقاق يعتمد على سنوات الخدمة والاشتراك والنظام. لذلك لا تستخدم هذه الحاسبة لحسم التقاعد المبكر.',
  },
  {
    title: 'اختلاف القطاع',
    description: 'القطاع العسكري ليس مثل المدني.',
    content:
      'إذا اخترت قطاعاً غير مطابق لوظيفتك، ستقرأ تاريخاً غير مناسب. لذلك تعامل مع القطاع كمدخل حساس، لا كخيار شكلي.',
  },
  {
    title: 'مقارنة بين الدول',
    description: 'للمغتربين أو من يغيّر بلد العمل.',
    content:
      'قد تختلف قواعد التقاعد بين بلد وآخر. استخدم المقارنة لفهم الصورة العامة فقط، ثم راجع النظام الذي يغطي اشتراكك الفعلي.',
  },
];
const sourceLinks = [
  {
    href: 'https://www.gosi.gov.sa/',
    title: 'المؤسسة العامة للتأمينات الاجتماعية - السعودية',
    description: 'مرجع رسمي سعودي للتحقق من أنظمة التأمينات والتقاعد حسب حالتك.',
    ctaLabel: 'راجع الجهة',
  },
  {
    href: 'https://gpssa.gov.ae/',
    title: 'الهيئة العامة للمعاشات والتأمينات الاجتماعية - الإمارات',
    description: 'مرجع رسمي إماراتي للمعاشات وشروط الاستحقاق.',
    ctaLabel: 'راجع الجهة',
  },
  {
    href: 'https://www.ssc.gov.jo/',
    title: 'المؤسسة العامة للضمان الاجتماعي - الأردن',
    description: 'مرجع رسمي أردني للتحقق من شروط التقاعد والضمان.',
    ctaLabel: 'راجع الجهة',
  },
  {
    href: '/calculators/personal-finance/savings-goal',
    title: 'حاسبة هدف الادخار',
    description: 'بعد معرفة الإطار الزمني، خطط لهدف مالي مبدئي دون خلطه باستحقاق التقاعد الرسمي.',
    ctaLabel: 'افتح الحاسبة',
  },
];

export const metadata = buildAgeMetadata({
  title: 'متى أتقاعد؟ | حاسبة سن التقاعد',
  description,
  keywords: [
    'حاسبة سن التقاعد',
    'متى أتقاعد',
    'كم باقي على تقاعدي',
    'سن التقاعد',
    'حاسبة موعد التقاعد',
    'سن التقاعد حسب الدولة',
    'التقاعد المبكر',
    'كم سنة باقي على التقاعد',
  ],
  path: '/calculators/age/retirement',
});

export default function RetirementPage() {
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
    name: 'كيفية تقدير موعد التقاعد',
    description: 'خطوات تقدير تاريخ بلوغ سن التقاعد حسب تاريخ الميلاد والدولة والقطاع.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'أدخل تاريخ الميلاد',
        text: 'اختر تاريخ ميلادك حتى تحسب الصفحة عمرك الحالي.',
      },
      {
        '@type': 'HowToStep',
        name: 'اختر الدولة والقطاع',
        text: 'حدد الدولة والقطاع والجنس لأن سن التقاعد قد يختلف بين الأنظمة.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ النتيجة كتقدير أولي',
        text: 'راجع تاريخ التقاعد والمدة المتبقية، ثم تحقق من الجهة الرسمية قبل أي قرار.',
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
            { name: title, href: '/calculators/age/retirement' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/retirement' })) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="مرجع أولي"
        title="متى أتقاعد؟ حاسبة سن التقاعد كتقدير أولي"
        description={description}
        highlights={[
          'يعرض تاريخاً تقريبياً لبلوغ سن التقاعد حسب الدولة والقطاع.',
          'لا يحسب المعاش أو الاستحقاق أو التقاعد المبكر؛ هذه بيانات رسمية منفصلة.',
          'يفتح لك خطوة تخطيط أولى ثم يوجهك إلى مراجعة الجهة المختصة.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <RetirementAgeCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="retirement-decision"
        eyebrow="اختيار النتيجة"
        title="هل تبحث عن موعد أم معاش أم أهلية؟"
        description="هذه الصفحة تجيب عن الموعد التقريبي فقط. إذا كان سؤالك عن المال أو الاستحقاق، فالخطوة التالية يجب أن تكون الجهة الرسمية."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'ما الذي تستخدمه؟', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="retirement-method"
        eyebrow="شرح مبسط"
        title="كيف تقدّر الصفحة موعد التقاعد؟"
        description="الحساب هنا زمني: تاريخ ميلاد + سن تقاعد مستخدم في النموذج. لا يدخل في حساب الراتب أو الاشتراكات أو الاستثناءات."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="retirement-examples"
        eyebrow="أمثلة مسؤولة"
        title="متى تكون النتيجة مفيدة ومتى لا تكفي؟"
        description="هذه الأمثلة تفصل بين التخطيط الشخصي الأولي وبين القرار الرسمي عالي الأثر."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="retirement-sources"
        eyebrow="مصادر رسمية"
        title="راجع الجهة الرسمية قبل أي قرار تقاعد"
        description="استخدم هذه الروابط للتحقق من حالتك. قواعد التقاعد قد تتغير أو تطبق تدريجياً أو تختلف حسب تاريخ الاشتراك وسنوات الخدمة."
        subtle
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع الجهة" />
      </CalculatorSection>

      <CalculatorSection
        id="retirement-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل تفسير نتيجة التقاعد"
        description="إجابات مختصرة حول الفرق بين موعد التقاعد، المعاش، التقاعد المبكر، والقرار الرسمي."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="retirement" />
    </main>
  );
}
