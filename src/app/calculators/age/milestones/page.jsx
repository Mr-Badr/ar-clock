import AgeMilestonesCalculator from '@/components/calculators/age/AgeMilestonesCalculator.client';
import { CalculatorHero, CalculatorSection } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'متى تكمل 10000 يوم أو مليار ثانية؟';
const description = 'اكتشف متى تكمل 10,000 يوم أو مليار ثانية، وما المحطات التي تجاوزتها بالفعل منذ تاريخ ميلادك.';

export const metadata = buildAgeMetadata({
  title: 'متى تكمل 10000 يوم أو مليار ثانية؟ | إنجازات العمر',
  description,
  keywords: [
    'متى يكون عمري مليار ثانية',
    '10000 يوم كم سنة',
    'حاسبة الإنجازات العمرية',
    'متى أكمل 10000 يوم',
  ],
  path: '/calculators/age/milestones',
});

export default function AgeMilestonesPage() {
  return (
    <main className="bg-base text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema([
            { name: 'الرئيسية', href: '/' },
            { name: 'الحاسبات', href: '/calculators' },
            { name: 'حاسبات العمر', href: '/calculators/age' },
            { name: title, href: '/calculators/age/milestones' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/milestones' })) }}
      />

      <CalculatorHero
        badge="محطات كبيرة"
        title={title}
        description={description}
        accent="#7C3AED"
        highlights={[
          'قائمة بالماضية والقادمة في شاشة واحدة.',
          'تاريخ واضح لكل محطة كبيرة.',
          'مفيد للمحتوى القابل للمشاركة أو الفضول الشخصي.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeMilestonesCalculator />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="milestones-content"
        eyebrow="فكرة الصفحة"
        title="لماذا يحب الناس هذه الحاسبة؟"
        description="لأنها تحول العمر إلى محطات قابلة للقياس والانتظار، فتجعل الزمن محسوساً أكثر من مجرد رقم سنوي ثابت."
      />
    </main>
  );
}
