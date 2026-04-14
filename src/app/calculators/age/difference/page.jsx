import AgeDifferenceCalculator from '@/components/calculators/age/AgeDifferenceCalculator.client';
import { CalculatorHero, CalculatorSection } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'حاسبة فرق العمر';
const description = 'قارن بين عمر شخصين بالسنوات والأشهر والأيام، واعرف من الأكبر سناً وهل أنتما من الجيل نفسه أم لا.';

export const metadata = buildAgeMetadata({
  title: 'حاسبة فرق العمر | الفرق بين شخصين بالأيام والسنوات',
  description,
  keywords: [
    'حاسبة فرق العمر',
    'فرق العمر بين شخصين',
    'فرق العمر بين الزوجين',
    'حساب الفارق العمري',
  ],
  path: '/calculators/age/difference',
});

export default function AgeDifferencePage() {
  return (
    <main className="bg-base text-primary">
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

      <CalculatorHero
        badge="مقارنة مباشرة"
        title={title}
        description={description}
        accent="#2563EB"
        highlights={[
          'فارق واضح بالسنوات والأيام.',
          'تحديد الشخص الأكبر سناً مباشرة.',
          'إشارة سريعة إلى الجيل المشترك أو المختلف.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeDifferenceCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="age-difference-content"
        eyebrow="استخدامات شائعة"
        title="متى تحتاج هذه الحاسبة؟"
        description="تفيد للمقارنات العائلية، والأسئلة اليومية من نوع من الأكبر؟ وبكم؟، وكذلك للمحتوى الاجتماعي الذي يحتاج نتيجة مختصرة وواضحة بالأيام والسنوات."
      />
    </main>
  );
}
