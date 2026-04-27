import AgeHijriCalculator from '@/components/calculators/age/AgeHijriCalculator.client';
import { CalculatorHero } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { AgeToolSections } from '../tool-sections';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'كم عمري بالهجري؟';
const description = 'احسب عمرك بالهجري أو ابدأ بتاريخ هجري ثم حوّله إلى الميلادي مع عرض الفارق بين التقويمين في نفس الشاشة.';

export const metadata = buildAgeMetadata({
  title: 'كم عمري بالهجري؟ | حاسبة العمر الهجري والميلادي',
  description,
  keywords: [
    'حاسبة العمر الهجري',
    'كم عمري بالهجري',
    'احسب عمرك بالهجري',
    'تحويل عمر ميلادي لهجري',
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

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: title, description, path: '/calculators/age/hijri' })) }} />

      <CalculatorHero
        badge="هجري / ميلادي"
        title={title}
        description={description}
        accent="#0F766E"
        highlights={[
          'إدخال ميلادي أو هجري من نفس الصفحة.',
          'عرض مزدوج للتاريخين والفرق التراكمي بينهما.',
          'توضيح سريع للشهر الهجري الذي وُلدت فيه.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeHijriCalculator />
        </Suspense>
      </CalculatorHero>

      <AgeToolSections toolId="hijri" />
    </main>
  );
}
