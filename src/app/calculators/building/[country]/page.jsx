import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BuildingCostCalculator from '@/components/calculators/building/BuildingCostCalculator.client';
import {
  CalculatorHero,
  CalculatorSection,
  CalculatorSectionNav,
  CalculatorStoryBand,
  CalculatorQuickAnswerGrid,
  CalculatorFaqSection,
  CalculatorFooterCta,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';
import { COUNTRY_DATA, getCountryBySlug, getBuildingCountrySlugs } from '@/lib/calculators/building/country-data';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();

export async function generateStaticParams() {
  return getBuildingCountrySlugs();
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  
  if (!country) return notFound();

  const title = `كم تكلفة البناء في ${country.nameShort}؟ | حاسبة سعر المتر والبيت`;
  const description = `احسب تكلفة البناء التقريبية في ${country.name} (عظم أو تشطيب) بناءً على المساحة وعدد الأدوار، مع أسعار تشمل المواد والعمالة حسب ${country.regions?.[Object.keys(country.regions)[0]]?.name || 'السوق المحلي'}.`;

  return buildCanonicalMetadata({
    title,
    description,
    keywords: getBuildingKeywords(country.countryKey),
    url: `${SITE_URL}/calculators/building/${country.slug}`,
  });
}

export default async function CountryBuildingPage({ params }) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  
  if (!country) return notFound();

  const title = `كم تكلفة البناء في ${country.nameShort}؟`;

  const faqItems = [
    {
      question: `كيف يتم حساب تكلفة المتر المربع في ${country.nameShort}؟`,
      answer: `نعتمد على متوسطات السوق الحالية للمواد الحيوية (حديد، أسمنت، خرسانة، وعمالة). تختلف التكلفة الفعلية بـ ±15% بناءً على تعقيد التصميم وموقع الأرض وتكاليف النقل.`,
    },
    {
      question: `هل الأسعار تشمل ضريبة القيمة المضافة في ${country.nameShort}؟`,
      answer: `الإعدادات الافتراضية تعتمد على أسعار السوق للمواطن/المقاول النهائي (والتي غالباً ما تتضمن الضرائب المعمول بها في السوق المفتوح)، لكن ننصح دائماً بإضافة هامش طوارئ للتغيرات الضريبية أو الرسوم الحكومية.`,
    },
    {
      question: `ما الفرق بين العظم والتشطيب؟`,
      answer: `العظم (الهيكل) يشمل القواعد والأعمدة والأسقف والمباني. التشطيب يشمل السباكة والكهرباء والمحارة (اللياسة) والبلاط والدهانات والواجهات. التشطيب وحده عادة يكلف ضعف العظم.`,
    },
  ];

  const quickAnswers = [
    {
      question: `كم تكلف فيلا 300 متر دورين ${country.nameShort}؟`,
      description: 'مثال شائع جداً للتخطيط المالي',
      answer: `إذا اخترت مستوى (تشطيب عادي)، فإن الحساب الأولي يكون: 600 متر بناء × متوسط التكلفة التقديري الموضح في الحاسبة (اختر العادي). الناتج سيعطيك التصور المبدئي لتجهيز الميزانية قبل الرسومات التفصيلية.`,
    },
  ];

  const sectionNavItems = [
    { href: '#calculator-hero', label: 'الحاسبة', description: `تسعير فوري لمنزلك في ${country.nameShort}` },
    { href: '#building-story', label: 'مراحل البناء', description: 'كيف تتوزع ميزانية المشروع' },
    { href: '#building-materials', label: 'حاسبات المواد', description: 'الأسمنت، الحديد، والبلاط' },
    { href: '#building-faq', label: 'الأسئلة الشائعة', description: 'أسئلة البناء والتسعير' },
  ];

  return (
    <main className="bg-base text-primary">
      <CalculatorHero
        badge={`بناء / ${country.symbol}`}
        title={title}
        description={`حدّد مساحة البناء وعدد الأدوار، وسنقدّر لك تكلفة البناء الإجمالية وسعر المتر في ${country.name} باستخدام متوسط الأسعار الحالية في المدن الرئيسية.`}
        accent="#10B981" // emerald green for building
        highlights={[
          `أسعار تناسب السوق في ${country.nameShort}.`,
          `نتائج تفصيلية: عظم، واجهات، تشطيب داخلي.`,
          `تقدير سريع لكميات الأسمنت والحديد.`,
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <BuildingCostCalculator preSelectedCountrySlug={country.slug} />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="building-overview"
        eyebrow="خريطة الصفحة"
        title="دليلك الكامل للبناء"
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="building-story"
        eyebrow="توزيع الميزانية"
        title="أين يذهب مالك أثناء البناء؟"
        description="البناء ليس مجرد حديد وأسمنت، التخطيط المالي يمنع تعثر المشروع."
        subtle
      >
        <CalculatorStoryBand
          title="التشطيب يستهلك الجزء الأكبر"
          description="الكثيرون يخطئون ويبدأون البناء بـ 40% من الميزانية معتقدين أنها كافية. الحقيقة أن الهيكل (العظم) هو الجزء الأرخص."
          items={[
            { label: 'العظم الإنشائي', value: 'يستهلك عادة 30% إلى 35% من الميزانية الإجمالية (حديد، خرسانة، مقاول هيكل).' },
            { label: 'الكهرباء والسباكة', value: 'تأسيس وتشطيب، تستهلك بين 15% إلى 20% وهي الأصعب في الصيانة لاحقاً.' },
            { label: 'التشطيبات المعمارية', value: 'أرضيات، دهانات، أبواب، ونوافذ، تأخذ النصيب الأكبر (تصل إلى 45%).' },
          ]}
        />
      </CalculatorSection>


      <CalculatorSection
        id="building-materials"
        eyebrow="حاسبات المواد"
        title="احسب الكميات بدقة هندسية"
        description="انتقل من التقدير الإجمالي إلى التقدير الكمي الدقيق. استخدم حاسبات المواد لحساب الكميات المطلوبة لكل بند على حدة."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card className="calc-surface-card hover:border-primary transition-colors hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">حاسبة الأسمنت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                احسب أكياس الأسمنت للخرسانة والمونة بكل دقة (عيار 150 لـ 300).
              </p>
              <Button asChild className="w-full btn btn-primary--flat calc-button">
                <Link href="/calculators/building/cement">جرّب حاسبة الأسمنت</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="calc-surface-card hover:border-primary transition-colors hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">حاسبة الحديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                حوّل الأطوال إلى أوزان أو احسب عدد أسياخ الحديد للأسقف والأعمدة.
              </p>
              <Button asChild className="w-full btn btn-primary--flat calc-button">
                <Link href="/calculators/building/rebar">جرّب حاسبة الحديد</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="calc-surface-card hover:border-primary transition-colors hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">حاسبة البلاط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                احسب كراتين البلاط المطلوبة لغرف المنزل مع إضافة نسبة الهدر الهندسية.
              </p>
              <Button asChild className="w-full btn btn-primary--flat calc-button">
                <Link href="/calculators/building/tiles">جرّب حاسبة البلاط</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="building-answers"
        eyebrow="إجابات مباشرة"
        title="تساؤلات شائعة في السوق"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="building-faq"
        eyebrow="الأسئلة الشائعة"
        title={`أسئلة متكررة حول تكلفة البناء في ${country.nameShort}`}
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="building-related"
        eyebrow="روابط داخلية"
        title="حاسبات مشابهة"
      >
        <RelatedCalculators currentSlug="building" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
