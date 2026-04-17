import AgeCalculator from '@/components/calculators/age/AgeCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { AGE_COMMON_FAQ } from '@/lib/calculators/age-data';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const pageTitle = 'حاسبة العمر';
const pageDescription = 'احسب عمرك بدقة بالسنوات والأشهر والأيام والساعات والثواني، وتعرّف على عيد ميلادك القادم والعمر الهجري التقريبي إذا كنت تبحث عن إجابة سريعة لسؤال: كم عمري؟';

export const metadata = buildAgeMetadata({
  title: 'كم عمري الآن؟ | حاسبة العمر بالسنوات والأيام والثواني',
  description: pageDescription,
  keywords: [
    'حاسبة العمر',
    'احسب عمرك',
    'كم عمري',
    'حساب العمر بالأيام',
    'عمري بالثواني',
    'كم يوم عشت',
  ],
  path: '/calculators/age/calculator',
});

export default function AgeCalculatorPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', href: '/' },
    { name: 'الحاسبات', href: '/calculators' },
    { name: 'حاسبات العمر', href: '/calculators/age' },
    { name: pageTitle, href: '/calculators/age/calculator' },
  ]);
  const softwareSchema = buildSoftwareSchema({
    name: pageTitle,
    description: pageDescription,
    path: '/calculators/age/calculator',
  });

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <CalculatorHero
        badge="العمر الكامل"
        title={pageTitle}
        description={pageDescription}
        accent="#EA580C"
        highlights={[
          'العمر بصيغة بشرية واضحة: سنوات وأشهر وأيام.',
          'تحويل مباشر إلى أيام وساعات ودقائق وثوانٍ.',
          'موعد عيد الميلاد القادم والتقدم داخل السنة الحالية.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="age-main-content"
        eyebrow="ما الذي تحسبه الصفحة؟"
        title="النتيجة لا تقتصر على رقم واحد"
        description="هذه الصفحة تجمع بين العمر الحالي، التراكم الزمني، العمر الهجري التقريبي، عداد عيد الميلاد، وبعض الإحصائيات الممتعة التي تجعل القراءة أسرع وأوضح."
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'العمر التفصيلي',
              content: 'تبدأ النتيجة بالعمر الكامل بالسنوات والأشهر والأيام بدل الاكتفاء بعدد السنوات فقط، وهو ما يجعل الحساب أدق عند المقارنة بين تواريخ قريبة.',
            },
            {
              title: 'الوحدات التراكمية',
              content: 'بعد الحساب الأساسي تعرض الصفحة مجموع الأيام والأسابيع والساعات والدقائق والثواني لتخدم الصيغ البحثية من نوع "كم يوم عشت" و"عمري بالثواني".',
            },
            {
              title: 'عيد الميلاد القادم',
              content: 'تُظهر الصفحة عدد الأيام المتبقية حتى عيد ميلادك القادم، وتاريخ هذا اليوم، والعمر الذي ستبلغه عند الوصول إليه.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-faq"
        eyebrow="FAQ"
        title="أسئلة شائعة"
        description="إجابات مختصرة قبل الانتقال إلى بقية الحاسبات داخل قسم العمر."
        subtle
      >
        <CalculatorFaqSection items={AGE_COMMON_FAQ} />
      </CalculatorSection>

      <CalculatorSection
        id="age-main-related"
        eyebrow="أدوات مرتبطة"
        title="أكمل من حيث تحتاج"
        description="إذا أردت زاوية أخرى على نفس التاريخ، فهذه الصفحات تكمل بعضها بدلاً من تكرار نفس النتيجة."
      >
        <RelatedCalculators currentSlug="age" />
      </CalculatorSection>
    </main>
  );
}
