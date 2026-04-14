import RetirementAgeCalculator from '@/components/calculators/age/RetirementAgeCalculator.client';
import { CalculatorHero, CalculatorSection } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'حاسبة سن التقاعد';
const description = 'تقدير مبسط لموعد التقاعد حسب الدولة والقطاع مع تذكير واضح بأن المرجع النهائي هو الأنظمة والجهات الرسمية في كل بلد.';

export const metadata = buildAgeMetadata({
  title: 'حاسبة سن التقاعد | متى أبلغ سن التقاعد؟',
  description,
  keywords: [
    'حاسبة سن التقاعد',
    'متى أتقاعد',
    'كم باقي على تقاعدي',
    'سن التقاعد',
  ],
  path: '/calculators/age/retirement',
});

export default function RetirementPage() {
  return (
    <main className="bg-base text-primary">
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

      <CalculatorHero
        badge="مرجع أولي"
        title={title}
        description={description}
        accent="#4F46E5"
        highlights={[
          'تقدير مبسط سريع حسب الدولة والقطاع.',
          'تنبيه واضح بأن النتيجة ليست بديلاً عن المرجع الرسمي.',
          'مفيد كخطوة أولى للتخطيط الزمني الشخصي.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <RetirementAgeCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="retirement-content"
        eyebrow="تنبيه"
        title="هذه الصفحة للتقدير الأولي فقط"
        description="تختلف الأنظمة الفعلية حسب البلد والصندوق والقطاع وسنوات الخدمة والاستثناءات النظامية، لذلك يجب الرجوع للجهة الرسمية قبل أي قرار مالي أو وظيفي."
      />
    </main>
  );
}
