import Link from 'next/link';
import { ArrowLeft, Hourglass, MoonStar, Orbit, TimerReset } from 'lucide-react';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/shared/SectionSkeleton'
import AgeCalculator from '@/components/calculators/age/AgeCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  CalculatorSectionNav,
} from '@/components/calculators/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AGE_CALCULATOR_ROUTES, AGE_COMMON_FAQ, AGE_HUB_QUICK_LINKS, AGE_ROUTE } from '@/lib/calculators/age-data';
import { buildBreadcrumbSchema, buildSoftwareSchema, buildAgeMetadata } from './page-helpers';

export const metadata = buildAgeMetadata({
  title: 'حاسبات العمر الشاملة | احسب عمرك بالهجري والميلادي',
  description:
    'قسم عربي متكامل لحساب العمر: العمر الشامل، العمر الهجري، فرق العمر، يوم الميلاد، الإنجازات الزمنية، العد التنازلي، وعمرك على الكواكب.',
  keywords: AGE_ROUTE.keywords,
  path: AGE_ROUTE.href,
});

export default function AgeHubPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', href: '/' },
    { name: 'الحاسبات', href: '/calculators' },
    { name: 'حاسبات العمر', href: '/calculators/age' },
  ]);
  const softwareSchema = buildSoftwareSchema({
    name: 'حاسبات العمر الشاملة',
    description: metadata.description,
    path: '/calculators/age',
  });

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <CalculatorHero
        badge="قسم جديد داخل الحاسبات"
        title="حاسبات العمر الشاملة في مكان واحد"
        description="بَنينا هذا القسم ليجمع أهم ما يحتاجه المستخدم حول العمر: الحساب الدقيق بالسنوات والأيام، المقارنة بين الهجري والميلادي، فرق العمر، تفاصيل يوم الميلاد، الإنجازات الزمنية، العد التنازلي، وعمرك على الكواكب."
        accent={AGE_ROUTE.accent}
        highlights={[
          'التركيز هنا على أدوات عمر عملية ومباشرة بلا تشتيت.',
          'لا يوجد تكرار لمحوّل التاريخ لأن التطبيق يملكه بالفعل في قسم التاريخ.',
          'تم استبعاد أي محتوى متعلق بالأبراج من هذا القسم بالكامل.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCalculator compact />
        </Suspense>
        
      </CalculatorHero>

      <CalculatorSection
        id="age-hub-tools"
        eyebrow="خريطة القسم"
        title="أدوات متخصصة بدلاً من صفحة واحدة مزدحمة"
        description="كل أداة في هذا القسم تخدم نية مختلفة: أحياناً تريد العمر الكامل، وأحياناً تريد فرق العمر، أو فقط كم بقي على عيد الميلاد القادم."
      >
        <CalculatorSectionNav items={AGE_HUB_QUICK_LINKS} />

        <div className="age-bento-grid">
          {AGE_CALCULATOR_ROUTES.map((item) => (
            <Card key={item.slug} className={`calc-surface-card age-bento-card age-bento-card--${item.slug}`}>
              <CardHeader>
                <CardTitle className="calc-card-title">{item.title}</CardTitle>
                <CardDescription className="calc-card-description">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="calc-hub-card__actions">
                <Link href={item.href} className="btn btn-primary--flat calc-button calc-inline-button">
                  افتح الصفحة
                  <ArrowLeft size={16} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="age-hub-demo"
        eyebrow="تجربة فورية"
        title="احسب عمرك سريعاً من صفحة القسم"
        description="إذا كنت تريد إجابة سريعة بدون دخول صفحة فرعية، فهذه المعاينة تعطيك العمر الحالي وموعد عيد الميلاد القادم مباشرة."
        subtle
      >
        <Suspense fallback={<SectionSkeleton />}>
          <AgeCalculator />
        </Suspense>
      </CalculatorSection>

      <CalculatorSection
        id="age-hub-compare"
        eyebrow="تعليم سريع"
        title="لماذا يبدو العمر الهجري أكبر قليلاً؟"
        description="السنة الهجرية قمرية وأقصر من السنة الميلادية، لذلك يتراكم فرق صغير مع مرور الوقت ويظهر في النتائج."
      >
        <div className="calc-grid-3">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><Hourglass size={16} /> السنة الميلادية</div>
            <div className="calc-metric-card__value">365.25 يوم</div>
            <div className="calc-metric-card__note">تقويم شمسي وهو المرجع الأكثر شيوعاً في الحياة اليومية.</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><MoonStar size={16} /> السنة الهجرية</div>
            <div className="calc-metric-card__value">354 يوماً تقريباً</div>
            <div className="calc-metric-card__note">تقويم قمري ولذلك يدور أسرع قليلاً من الميلادي.</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><TimerReset size={16} /> الفرق السنوي</div>
            <div className="calc-metric-card__value">10-11 أيام</div>
            <div className="calc-metric-card__note">بعد 30 سنة مثلاً يصبح الفرق ملحوظاً في العمر المعروض.</div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="age-hub-more"
        eyebrow="ما الذي ستجده أيضاً؟"
        title="القسم يغطي أكثر من مجرد رقم العمر"
        description="إلى جانب الحاسبة الأساسية، أضفنا أدوات تمنح النتيجة سياقاً مفيداً أو جانباً مرحاً مقنعاً للمشاركة."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'فرق العمر',
              description: 'مفيد للأزواج والأصدقاء والإخوة.',
              content: 'يعرض الفرق الحقيقي بالسنوات والأشهر والأيام مع توضيح من الأكبر سناً وهل الشخصان من الجيل نفسه أم لا.',
            },
            {
              title: 'يوم الميلاد',
              description: 'صفحة خفيفة لفهم تاريخك أكثر.',
              content: 'تعرض يوم الأسبوع الذي وُلدت فيه، تاريخك الهجري، فصلك، جيلك، ونصف عيد ميلادك دون أي محتوى متعلق بالأبراج.',
            },
            {
              title: 'الإنجازات الزمنية',
              description: 'من 10,000 يوم إلى مليار ثانية.',
              content: 'إذا كنت تحب المحطات الكبيرة، فهذه الصفحة تريك ما تجاوزته وما ينتظرك مع تواريخ واضحة ونِسَب تقدّم سهلة.',
            },
            {
              title: 'الكواكب والعد التنازلي',
              description: 'زاوية بصرية وممتعة قابلة للمشاركة.',
              content: 'شاهد عمرك على المريخ وعطارد وزحل، أو افتح العداد الحي لعيد الميلاد القادم إذا كنت تريد تجربة خفيفة ومباشرة.',
            },
            {
              title: 'سن التقاعد',
              description: 'مرجع أولي لا نهائي.',
              content: 'أضفنا حاسبة تقديرية للتقاعد مع تنبيه واضح بأن المرجع النهائي دائماً هو الجهة الرسمية أو نظام الخدمة/التأمينات في بلدك.',
            },
            {
              title: 'تكامل مع قسم التاريخ',
              description: 'منعنا التكرار داخل المشروع.',
              content: 'لم نكرر محوّل التاريخ داخل هذا القسم لأن التطبيق يملك بالفعل محوّلاً مستقلاً ومتكاملاً ضمن قسم التاريخ والتحويل.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="age-hub-faq"
        eyebrow="الأسئلة الشائعة"
        title="FAQ سريع حول حساب العمر"
        description="هذه الصفحة تُمهّد لكل الأدوات داخل القسم وتجيب عن أكثر الأسئلة تكراراً قبل الدخول إلى الحاسبات الفرعية."
      >
        <CalculatorFaqSection items={AGE_COMMON_FAQ} />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
