import AgeCountdownCalculator from '@/components/calculators/age/AgeCountdownCalculator.client';
import { CalculatorHero } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { AgeToolSections } from '../tool-sections';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'العد التنازلي لعيد الميلاد';
const description = 'عداد حي للأيام والساعات والدقائق والثواني حتى عيد ميلادك القادم، مع نسبة التقدّم من عيد الميلاد الأخير إلى القادم.';

export const metadata = buildAgeMetadata({
  title: 'كم باقي على عيد ميلادك؟ | عداد عيد الميلاد',
  description,
  keywords: [
    'كم باقي على عيد ميلادي',
    'عداد عيد الميلاد',
    'عد تنازلي عيد الميلاد',
    'متى عيد ميلادي القادم',
  ],
  path: '/calculators/age/countdown',
});

export default function AgeCountdownPage() {
  return (
    <main className="bg-base text-primary">
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

      <CalculatorHero
        badge="عداد حي"
        title={title}
        description={description}
        accent="#DC2626"
        highlights={[
          'يتحرك كل ثانية داخل الصفحة.',
          'يُظهر تاريخ عيد الميلاد القادم بوضوح.',
          'يربط العد التنازلي بنسبة التقدم بين آخر عيد والقادم.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCountdownCalculator />
        </Suspense>
      </CalculatorHero>

      <AgeToolSections toolId="countdown" />
    </main>
  );
}
