import AgeHijriCalculator from '@/components/calculators/age/AgeHijriCalculator.client';
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

const title = 'كم عمري بالهجري؟';
const description = 'احسب عمرك بالهجري والميلادي في نفس الصفحة، وأدخل تاريخ ميلادك بالميلادي أو الهجري لتفهم الفرق بين السنة القمرية والسنة الشمسية بوضوح.';
const quickAnswers = [
  {
    question: 'كم عمري بالهجري؟',
    description: 'النية الأساسية للصفحة.',
    answer: 'أدخل تاريخ ميلادك بالميلادي أو الهجري، وستعرض الصفحة عمرك الميلادي وعمرك الهجري التقريبي مع تاريخ الميلاد بالتقويمين والفرق التراكمي بينهما.',
  },
  {
    question: 'لماذا يكون العمر الهجري أكبر من الميلادي غالباً؟',
    description: 'السؤال التعليمي الأهم.',
    answer: 'لأن السنة الهجرية قمرية وأقصر من السنة الميلادية بنحو 10 إلى 11 يوماً. مع مرور السنوات يتراكم هذا الفرق، فيظهر العمر المحسوب بالسنوات الهجرية أكبر قليلاً.',
  },
  {
    question: 'هل أبدأ بتاريخ ميلادي أم هجري؟',
    description: 'يعتمد على التاريخ الذي تملكه.',
    answer: 'ابدأ بالتاريخ المكتوب في الوثيقة أو المصدر الذي تثق به. إذا كان تاريخك هجرياً فأدخله هجرياً، وإذا كان ميلادياً فأدخله ميلادياً، ثم اقرأ النتيجتين معاً.',
  },
  {
    question: 'هل العمر الهجري يصلح لكل المعاملات الرسمية؟',
    description: 'حدود مهمة للثقة.',
    answer: 'ليس دائماً. بعض الجهات تعتمد الميلادي وبعضها يعتمد الهجري أو تقويماً محدداً مثل أم القرى. استخدم الحاسبة للفهم، ثم راجع الجهة التي تطلب العمر قبل قرار رسمي.',
  },
];
const decisionRows = [
  {
    key: 'known-gregorian',
    cells: ['تاريخي مكتوب بالميلادي', 'أدخل الميلادي أولاً', 'اقرأ العمر الميلادي كأصل، ثم استخدم الهجري للمقارنة أو المناسبات.'],
  },
  {
    key: 'known-hijri',
    cells: ['تاريخي مكتوب بالهجري', 'أدخل الهجري أولاً', 'مفيد للوثائق العائلية أو السياقات الخليجية والدينية التي تبدأ بالهجري.'],
  },
  {
    key: 'why-different',
    cells: ['أريد فهم الفرق', 'اقرأ الفرق التراكمي', 'العمر الهجري أكبر غالباً لأن السنة الهجرية أقصر، وليس لأن تاريخك تغيّر.'],
  },
  {
    key: 'official',
    cells: ['أحتاج النتيجة لجهة رسمية', 'راجع تقويم الجهة', 'لا تفترض التقويم المطلوب. بعض الجهات تعتمد الميلادي وبعضها الهجري أو أم القرى.'],
  },
];
const methodItems = [
  {
    title: 'نحوّل التاريخ أولاً',
    description: 'العمر يحتاج تاريخاً مفهوماً في التقويمين.',
    content:
      'إذا أدخلت تاريخاً هجرياً، تحوّله الصفحة داخلياً إلى تاريخ ميلادي قابل للمقارنة. وإذا أدخلت تاريخاً ميلادياً، تعرض مقابله الهجري عندما يكون التحويل مدعوماً.',
  },
  {
    title: 'نحسب الفترة نفسها بطريقتين',
    description: 'الفترة الزمنية واحدة لكن وحدة السنة مختلفة.',
    content:
      'أنت لم تعش فترتين مختلفتين؛ الفرق أن السنة الهجرية أقصر من الميلادية. لذلك عند تقسيم الفترة نفسها على سنوات أقصر يظهر عدد السنوات الهجرية أعلى.',
  },
  {
    title: 'الفارق يتراكم مع العمر',
    description: 'ليس فرقاً ثابتاً للجميع.',
    content:
      'في السنوات الأولى يكون الفرق صغيراً، ثم يكبر تدريجياً. كلما زاد العمر، تراكمت أيام الفرق بين التقويمين حتى يظهر فرق أكبر في عدد السنوات الهجرية.',
  },
  {
    title: 'التقويم الرسمي قد يختلف',
    description: 'ليست كل الجهات تستخدم القاعدة نفسها.',
    content:
      'بعض الاستخدامات تعتمد تقويم أم القرى أو لوائح محلية محددة. لذلك يجب التحقق من الجهة الرسمية عند استخدام العمر في رخصة، أهلية، عقد، أو إجراء حكومي.',
  },
];
const exampleItems = [
  {
    title: 'مثال أسري',
    description: 'عندما تعرف الأسرة التاريخ الهجري.',
    content:
      'إذا كان تاريخ الميلاد محفوظاً هجرياً في العائلة، أدخله هجرياً أولاً. سترى المقابل الميلادي والعمرين معاً، وهذا يقلل الالتباس عند المشاركة.',
  },
  {
    title: 'مثال معاملة',
    description: 'عندما تسأل: هل أعتمد الهجري أم الميلادي؟',
    content:
      'لا تبدأ من رغبتك في رقم عمر أكبر أو أصغر. ابدأ من التقويم الذي تطلبه الجهة. الحاسبة تساعدك على الفهم، لكنها لا تحدد النظام الرسمي بدلاً من الجهة.',
  },
  {
    title: 'مثال مناسبة دينية',
    description: 'عندما تريد ربط الميلاد بالشهور الهجرية.',
    content:
      'إذا أردت معرفة شهر ميلادك الهجري أو قربه من رمضان أو شوال أو ذي الحجة، اقرأ بطاقة الشهر الهجري. هذه قراءة تقويمية وليست حكماً شرعياً.',
  },
  {
    title: 'مثال مقارنة مع العمر الميلادي',
    description: 'عندما ترى فارق سنة تقريباً بعد عمر طويل.',
    content:
      'بعد عقود، قد يصبح العمر الهجري أعلى بنحو سنة أو أكثر. هذا طبيعي لأن السنوات القمرية تمر أسرع من السنوات الشمسية.',
  },
];
const sourceLinks = [
  {
    href: 'https://praycalc.org/hijri',
    title: 'PrayCalc: التقويم الهجري القمري',
    description: 'شرح عملي لطول السنة الهجرية القمرية واختلافها عن السنة الميلادية.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: 'https://www.ummulqura.org.sa/',
    title: 'تقويم أم القرى',
    description: 'مرجع سعودي مهم عند التعامل مع التواريخ الهجرية الرسمية أو المحلية.',
    ctaLabel: 'راجع المصدر',
  },
  {
    href: '/date/converter',
    title: 'محول التاريخ',
    description: 'حوّل تاريخاً محدداً بين الهجري والميلادي عندما تحتاج مطابقة تاريخ لا عمر فقط.',
    ctaLabel: 'حوّل التاريخ',
  },
];

export const metadata = buildAgeMetadata({
  title: 'كم عمري بالهجري؟ | حاسبة العمر الهجري والميلادي',
  description,
  keywords: [
    'حاسبة العمر الهجري',
    'كم عمري بالهجري',
    'احسب عمرك بالهجري',
    'تحويل عمر ميلادي لهجري',
    'العمر الهجري والميلادي',
    'كم عمري هجرياً الآن',
    'حساب العمر بالتقويم الهجري',
    'حاسبة العمر أم القرى',
  ],
  path: '/calculators/age/hijri',
});

export default function AgeHijriPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', href: '/' },
    { name: 'الحاسبات', href: '/calculators' },
    { name: 'حاسبات العمر', href: '/calculators/age' },
    { name: title, href: '/calculators/age/hijri' },
  ]);
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
    name: 'كيفية حساب العمر بالهجري والميلادي',
    description: 'خطوات حساب العمر بالتقويم الهجري والميلادي وفهم الفرق بينهما.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'اختر التقويم الذي تعرفه',
        text: 'ابدأ بالميلادي إذا كان تاريخك ميلادياً، أو بالهجري إذا كان التاريخ مكتوباً هجرياً.',
      },
      {
        '@type': 'HowToStep',
        name: 'أدخل اليوم والشهر والسنة',
        text: 'اكتب التاريخ كاملاً حتى تستطيع الصفحة تحويله واحتساب العمرين بوضوح.',
      },
      {
        '@type': 'HowToStep',
        name: 'اقرأ العمرين والفرق',
        text: 'قارن العمر الميلادي بالعمر الهجري، ثم راجع الفرق التراكمي وسبب ظهوره.',
      },
    ],
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/hijri' })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="هجري / ميلادي"
        title="كم عمري بالهجري؟ حاسبة العمر الهجري والميلادي"
        description={description}
        highlights={[
          'تقبل تاريخ الميلاد بالميلادي أو الهجري من نفس الصفحة.',
          'تعرض العمرين والفرق التراكمي بسبب قصر السنة الهجرية.',
          'توضح الشهر الهجري وتربط النتيجة بمحوّل التاريخ عند الحاجة.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeHijriCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="hijri-decision"
        eyebrow="اختيار التقويم"
        title="متى تستخدم الميلادي ومتى تستخدم الهجري؟"
        description="الخطأ الشائع هو اختيار التقويم الذي يعطي الرقم المرغوب. الاختيار الصحيح يبدأ من السياق والجهة التي ستقرأ النتيجة."
      >
        <CalculatorDecisionTable
          columns={['السؤال', 'الاختيار المناسب', 'قاعدة عملية']}
          rows={decisionRows}
        />
      </CalculatorSection>

      <CalculatorSection
        id="hijri-method"
        eyebrow="شرح مبسط"
        title="لماذا يظهر العمر الهجري أكبر؟"
        description="الفترة التي عشتها واحدة، لكن السنة الهجرية أقصر من الميلادية، لذلك تمر السنوات الهجرية بسرعة أكبر عند تقسيم الفترة نفسها."
      >
        <CalculatorInfoGrid items={methodItems} />
      </CalculatorSection>

      <CalculatorSection
        id="hijri-examples"
        eyebrow="أمثلة واقعية"
        title="كيف تستخدم نتيجة العمر الهجري في الحياة اليومية؟"
        description="هذه أمثلة تساعدك على قراءة النتيجة دون خلط بين الفضول الشخصي والاستخدام الرسمي."
        subtle
      >
        <CalculatorInfoGrid items={exampleItems} />
      </CalculatorSection>

      <CalculatorSection
        id="hijri-boundary"
        eyebrow="تمييز مهم"
        title="العمر الهجري ليس مجرد تحويل تاريخ"
        description="تحويل تاريخ الميلاد يعطيك اليوم المقابل في التقويم الآخر، أما حساب العمر فيقيس المدة من ذلك اليوم حتى الآن ثم يقرأها بوحدة سنة مختلفة."
      >
        <div className="calc-editorial-article__body">
          <p>
            قد تعرف تاريخ ميلادك الهجري من محوّل التاريخ، لكن هذا لا يكفي وحده لمعرفة عمرك الهجري. العمر يحتاج تاريخ بداية وتاريخ مقارنة، ثم يحتاج حساب السنوات والأشهر والأيام بينهما وفق التقويم المستخدم. لذلك تجمع هذه الصفحة بين التحويل والحساب في تجربة واحدة.
          </p>
          <p>
            إذا كان سؤالك هو “ما التاريخ الهجري الموافق ليوم ميلادي؟” فمحول التاريخ يكفي غالباً. أما إذا كان سؤالك “كم عمري بالهجري الآن؟” فأنت تحتاج حاسبة العمر الهجري لأنها تقرأ الفترة الزمنية كاملة، لا يوم الميلاد فقط.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="hijri-sources"
        eyebrow="مصادر ومنهج"
        title="مصادر لفهم السنة الهجرية والتحويل"
        description="هذه المصادر تساعدك على فهم التقويم الهجري القمري ومتى تحتاج محوّل تاريخ أو تقويماً رسمياً مثل أم القرى."
        subtle
      >
        <CalculatorResourceLinks items={sourceLinks} buttonLabel="راجع المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="hijri-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة قبل تفسير العمر الهجري"
        description="إجابات مختصرة عن الفرق بين العمرين، إدخال التاريخ، والاستخدام الرسمي للنتيجة."
      >
        <CalculatorFaqSection items={quickAnswers} />
      </CalculatorSection>

      <AgeToolSections toolId="hijri" />
    </main>
  );
}
