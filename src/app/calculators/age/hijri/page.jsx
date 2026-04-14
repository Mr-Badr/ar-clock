import AgeHijriCalculator from '@/components/calculators/age/AgeHijriCalculator.client';
import { CalculatorHero, CalculatorSection } from '@/components/calculators/common';
import { buildAgeMetadata, buildBreadcrumbSchema, buildSoftwareSchema } from '../page-helpers';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'

const title = 'حاسبة العمر الهجري';
const description = 'احسب عمرك بالهجري أو ابدأ بتاريخ هجري ثم حوّله إلى الميلادي مع عرض الفارق بين التقويمين في نفس الشاشة.';

export const metadata = buildAgeMetadata({
  title: 'حاسبة العمر الهجري | احسب عمرك بالتقويم الإسلامي',
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

      <CalculatorSection
        id="age-hijri-content"
        eyebrow="شرح سريع"
        title="لماذا هذه الصفحة مفيدة؟"
        description="بعض المستخدمين يعرف تاريخ ميلاده الميلادي فقط، وآخرون يعتمدون على التاريخ الهجري داخل الأسرة أو الوثائق. هذه الصفحة تربط بين الجانبين دون الحاجة لفتح محول منفصل."
      />
    </main>
  );
}
