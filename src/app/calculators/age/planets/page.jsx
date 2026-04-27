import AgePlanetsCalculator from '@/components/calculators/age/AgePlanetsCalculator.client';
import { CalculatorHero } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { AgeToolSections } from '../tool-sections';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'كم عمرك على المريخ والكواكب؟';
const description = 'شاهد عمرك إذا قسته بسنوات عطارد والزهرة والمريخ والمشتري وبقية كواكب المجموعة الشمسية.';

export const metadata = buildAgeMetadata({
  title: 'كم عمرك على المريخ والكواكب؟ | احسب عمرك خارج الأرض',
  description,
  keywords: [
    'عمرك على الكواكب',
    'عمري على المريخ',
    'عمري على عطارد',
    'احسب عمرك على كواكب المجموعة الشمسية',
  ],
  path: '/calculators/age/planets',
});

export default function AgePlanetsPage() {
  return (
    <main className="bg-base text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema([
            { name: 'الرئيسية', href: '/' },
            { name: 'الحاسبات', href: '/calculators' },
            { name: 'حاسبات العمر', href: '/calculators/age' },
            { name: title, href: '/calculators/age/planets' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/planets' })) }}
      />

      <CalculatorHero
        badge="زاوية ممتعة"
        title={title}
        description={description}
        accent="#0284C7"
        highlights={[
          'تحويل نفس العمر إلى وحدات كوكبية مختلفة.',
          'توضيح متى يأتي عيدك القادم على كل كوكب.',
          'نتيجة خفيفة وممتعة لكن مبنية على حسابات مدارية ثابتة.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgePlanetsCalculator />
        </Suspense>
      </CalculatorHero>

      <AgeToolSections toolId="planets" />
    </main>
  );
}
