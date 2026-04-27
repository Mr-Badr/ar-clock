import BirthdayDetailsCalculator from '@/components/calculators/age/BirthdayDetailsCalculator.client';
import { CalculatorHero } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { AgeToolSections } from '../tool-sections';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'يوم ميلادك';
const description = 'اعرف اليوم الذي وُلدت فيه، تاريخك الهجري، جيلك، وفصلك ونصف عيد ميلادك القادم في صفحة واحدة.';

export const metadata = buildAgeMetadata({
  title: 'في أي يوم وُلدت؟ | تفاصيل يوم الميلاد',
  description,
  keywords: [
    'في أي يوم ولدت',
    'يوم ميلادي كان في أي يوم',
    'اكتشف يوم ميلادك',
    'نصف عيد الميلاد',
  ],
  path: '/calculators/age/birth-day',
});

export default function BirthdayPage() {
  return (
    <main className="bg-base text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema([
            { name: 'الرئيسية', href: '/' },
            { name: 'الحاسبات', href: '/calculators' },
            { name: 'حاسبات العمر', href: '/calculators/age' },
            { name: title, href: '/calculators/age/birth-day' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/birth-day' })) }}
      />

      <CalculatorHero
        badge="تفاصيل الميلاد"
        title={title}
        description={description}
        accent="#D97706"
        highlights={[
          'تركيز على يوم الميلاد نفسه لا على التنبؤ أو الأبراج.',
          'عرض الجيل والفصل والتاريخ الهجري ونصف عيد الميلاد.',
          'بطاقة خفيفة وسهلة للمشاركة.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <BirthdayDetailsCalculator />
        </Suspense>
      </CalculatorHero>

      <AgeToolSections toolId="birth-day" />
    </main>
  );
}
