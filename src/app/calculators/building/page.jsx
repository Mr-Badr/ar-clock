import Link from 'next/link';
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
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'حاسبة تكلفة البناء الإجمالية',
  description: 'أدق حاسبة لتكلفة البناء في العالم العربي. احسب تكلفة البيت، العظم، والتشطيب، مع تقديرات فورية لكمية الحديد والأسمنت لـ 12 دولة عربية.',
  keywords: getBuildingKeywords('global'),
  url: `${SITE_URL}/calculators/building`,
});

export default function BuildingHubPage() {
  const faqItems = [
    {
      question: 'كيف تحسب هذه الأداة تكلفة البناء؟',
      answer: 'تعتمد الحاسبة على معادلات هندسية لحساب المساحة الإجمالية المبنية، ثم تضربها في متوسط تكلفة المتر المربع للتشطيب الذي تختاره، مع مراعاة نوع المبنى والدولة المحددة.',
    },
    {
      question: 'هل نسبة المقاول (الربح) مشمولة في النتيجة؟',
      answer: 'نعم، التقدير المعروض يمثل (سعر المتر تسليم مفتاح للمقاول أو المطور)، وليس فقط سعر الشراء الصافي للمواد الخام.',
    },
    {
      question: 'هل يمكنني تغيير أسعار المواد (الأسمنت، الحديد)؟',
      answer: 'للحصول على دقة أعلى، يمكنك استخدام "حاسبة الأسمنت" أو "حاسبة الحديد" المنفصلتين ضمن قسم حاسبات البناء وضخ الأسعار المحلية الدقيقة الخاصة بك فيها.',
    },
    {
      question: 'ما هو التشطيب الاقتصادي؟',
      answer: 'التشطيب الاقتصادي يستخدم مواد محلية أساسية: سيراميك عادي، دهانات قياسية، وأبواب خشبية بسيطة. ممتاز للفيلا الاستثمارية.',
    },
  ];

  const quickAnswers = [
    {
      question: 'كم متر يكفي لبناء عائلة 5 أشخاص؟',
      description: 'سؤال تخطيطي ممتاز',
      answer: 'فيلا بمسطح بناء 350 إلى 400 متر مربع (طابقين) تعتبر قياسية جداً ومثالية لعائلة من 5 أشخاص.',
    },
  ];

  const sectionNavItems = [
    { href: '#calculator-hero', label: 'الحاسبة الإجمالية', description: 'تكلفة البناء كاملة' },
    { href: '#tools-grid', label: 'حاسبات المواد', description: 'أسمنت، حديد، بلاط' },
    { href: '#country-hub', label: 'حسب دولتك', description: 'اذهب لصفحة دولتك المخصصة' },
    { href: '#building-story', label: 'دليل شامل', description: 'مفاهيم مهمة في البناء' },
    { href: '#building-faq', label: 'الأسئلة الشائعة', description: 'إجابات على أهم الأسئلة' },
  ];

  return (
    <main className="bg-base text-primary">
      <CalculatorHero
        badge="هندسة / بناء"
        title="حاسبات البناء والتشييد"
        description="خطط لمشروع عمرك بذكاء. حاسبة تسعير دقيقة لمنزلك، و أدوات هندسية لحساب كميات الأسمنت والحديد بأيسر الطرق."
        accent="#10B981"
        highlights={[
          'حاسبات للحديد والأسمنت والمواد الأساسية.',
          'تحديثات لأسعار 12 دولة عربية.',
          'واجهة صديقة لغير المهندسين.',
        ]}
      >
        <BuildingCostCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="building-overview"
        eyebrow="خريطة القسم"
        title="دليلك الكامل للبناء"
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="tools-grid"
        eyebrow="حاسبات المواد"
        title="حاسبات تفصيلية للكميات"
        description="انتقل من التقدير الإجمالي إلى التقدير الكمي الدقيق. استخدم حاسبات المواد لحساب الكميات المطلوبة لكل بند على حدة."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card className="calc-surface-card hover:border-primary transition-colors hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">حاسبة الأسمنت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                احسب أكياس الأسمنت للخرسانة والمونة بكل دقة (عيار 150 لـ 300). كم رمل وحصى وماء؟
              </p>
              <Button asChild className="w-full btn btn-primary--flat calc-button">
                <Link href="/calculators/building/cement">حاسبة الأسمنت</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="calc-surface-card hover:border-primary transition-colors hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">حاسبة الحديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                حوّل الأطوال والأقطار (⌀8 إلى ⌀32) إلى أوزان (كجم أو طن) بشكل فوري.
              </p>
              <Button asChild className="w-full btn btn-primary--flat calc-button">
                <Link href="/calculators/building/rebar">حاسبة الحديد</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="calc-surface-card hover:border-primary transition-colors hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">حاسبة البلاط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                احسب كراتين البلاط المطلوبة لغرفك مع حساب الهدر وتوزيع المقاسات الشائعة.
              </p>
              <Button asChild className="w-full btn btn-primary--flat calc-button">
                <Link href="/calculators/building/tiles">حاسبة البلاط</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="country-hub"
        eyebrow="حسب دولتك"
        title="الحاسبة المخصصة لدولتك"
        description="نحن ندعم 12 دولة عربية بأسعار وعملات ولغة تناسبك."
        subtle
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {COUNTRY_LIST.map(country => (
            <Link
              key={country.slug}
              href={`/calculators/building/${country.slug}`}
              className="flex items-center gap-3 p-4 bg-base border border-accent/10 rounded-xl hover:bg-accent/5 hover:border-primary/50 transition-all font-bold"
            >
              <span className="text-2xl">{country.flag}</span>
              <span>{country.nameShort}</span>
            </Link>
          ))}
        </div>
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
          description="الكثيرون يخطئون ويبدأون البناء بـ 40% من الميزانية معتقدين أنها كافية. الحقيقة أن الهيكل الإنشائي هو الجزء الأصغر من التكلفة."
          items={[
            { label: 'الهيكل (العظم)', value: 'يستهلك عادة 30% إلى 35% من الميزانية الإجمالية.' },
            { label: 'الأعمال الإلكتروميكانيكية', value: 'تأسيس وتشطيب الكهرباء والسباكة، تستهلك بين 15% إلى 20%.' },
            { label: 'التشطيبات المعمارية', value: 'أرضيات، دهانات، أبواب، ونوافذ، تأخذ بين 40% إلى 50%.' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="building-answers"
        eyebrow="إجابات مباشرة"
        title="تساؤلات معمارية"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="building-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة حول تكلفة البناء"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="building-related"
        eyebrow="روابط داخلية"
        title="حاسبات مشابهة قد تهمك"
      >
        <RelatedCalculators currentSlug="building" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
