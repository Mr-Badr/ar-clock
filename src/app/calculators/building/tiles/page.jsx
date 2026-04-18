import TilesCalculator from '@/components/calculators/building/TilesCalculator.client';
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
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'كم كرتون بلاط أحتاج؟ | حاسبة البلاط والسيراميك',
  description: 'احسب كمية البلاط والسيراميك المطلوبة لأي عدد من الغرف، مع معرفة عدد الكراتين المطلوبة ونسبة الهدر حسب طريقة التركيب.',
  keywords: getBuildingKeywords('tiles'),
  url: `${SITE_URL}/calculators/building/tiles`,
});

export default function TilesPage() {
  const faqItems = [
    {
      question: 'كيف أحسب نسبة الهدر في البلاط؟',
      answer: 'التركيب المعتاد يحتاج 10% هدر. التركيب المائل (القطري) أو البلاط ذو التصاميم الخاصة اللي بتحتاج (توزين الرسوم) يحتاج 15% إلى 20%.',
    },
    {
      question: 'كم عدد حبات البلاط في الكرتون؟',
      answer: 'حسب المقاس. مقاس 60×60 غالباً 4 حبات للكرتون. مقاس 80×80 غالباً 2 أو 3 حبات. مقاس 30×30 يأتي 11 حبة. يفضل دائماً التأكد من المورد.',
    },
    {
      question: 'شلون أحسب وزن البلاط للنقل؟',
      answer: 'يختلف حسب السُمك والنوع لكن بشكل تقريبي: كرتون السيراميك العادي يزن من 18 إلى 22 كجم. كرتون البورسلان (60*60 / 4 حبات) يصل لـ 30 كجم تقريباً.',
    },
    {
      question: 'ما هي المسافة المطلوبة للفواصل (الترويبة)؟',
      answer: 'عادة من 1.5 ملم ليزر للبورسلان، وحتى 3 ملم أو 4 ملم للسيراميك العادي والأمور المعمارية التي تحتاج تمدّد حراري عالي. المسافة هذه لا تؤثر على حساب كمية البلاط تقريباً لكنها مهمة لشراء مادة الترويبة.',
    },
  ];

  const quickAnswers = [
    {
      question: 'غرفة 4×4 كم كرتون سيراميك تحتاج؟',
      description: 'مثال لمقاس قياسي',
      answer: 'المساحة الصافية 16 متر مربع. بإضافة نسبة الهدر 10% تصبح تقريباً 17.6 م². في حال كان مقاس السيراميك 60×60 (الكرتون يعطي 1.44 م²) فستحتاج حوالي 13 كرتون.',
    },
    {
      question: 'كم مساحة الكرتون للبلاط 60×60؟',
      description: 'السؤال الأهم عند الشراء',
      answer: 'كرتون 60×60 المكون من 4 حبات يغطي مساحة صافية قدرها 1.44 متر مربع بالتمام والكمال.',
    },
  ];

  const sectionNavItems = [
    { href: '#calculator-hero', label: 'الحاسبة', description: 'أدخل الغرف واحسب الكمية' },
    { href: '#tiles-story', label: 'دليل المقاسات', description: 'مقاسات الكراتين' },
    { href: '#tiles-answers', label: 'أمثلة جاهزة', description: 'حساب غرف معتادة' },
    { href: '#tiles-faq', label: 'الأسئلة الشائعة', description: 'أسئلة حول الهدر' },
  ];

  return (
    <main className="bg-base text-primary">
      <CalculatorHero
        badge="هندسة / تشطيب"
        title="كم كرتون بلاط أحتاج؟ حاسبة البلاط والسيراميك"
        description="خطط لأرضيات بيتك بسهولة. أضف مقاسات كل غرفة وحدد نمط التركيب لنعطيك عدد البلاطات والكراتين المطلوبة مع إضافة الهدر الهندسي الدقيق."
        accent="#06B6D4" // Cyan
        highlights={[
          'يمكن إضافة أكثر من غرفة في نفس الحسبة.',
          'حساب الهدر بشكل ديناميكي بناءً على نمط التركيب (عادي - مائل).',
          'تحويل لعدد كراتين بناء على معلومات التعبئة القياسية للشركات.',
        ]}
      >
        <TilesCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="tiles-overview"
        eyebrow="خريطة الصفحة"
        title="المرجع الكامل للأرضيات"
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-story"
        eyebrow="أسرار التشطيب"
        title="الهدر في عالم الأرضيات"
        description="معظم الناس يشتري كميات إما ناقصة وتعطل المقاول، أو زائدة وتتكدس في الحوش."
        subtle
      >
        <CalculatorStoryBand
          title="شكل التركيب يحدد ميزانيتك"
          description="بعض المقاسات الكبيرة (مثل 120×60) تسبب هدراً كبيراً في الممرات والغرف الصغيرة جداً لأن القطع المقصوص لا يمكن استخدامه، لذا نحسب الهدر بشكل مختلف."
          items={[
            { label: 'التركيب المستقيم (العادي)', value: 'الهدر الطبيعي هو 10% بحد أقصى. القطع المقصوص يوضع غالباً أسفل النعلة (الوزرة) أو خلف الأبواب.' },
            { label: 'التركيب القطري / المائل 45 درجة', value: 'يحتاج هدر من 15% إلى 20% بسبب كثرة القص بزوايا في أطراف الغرفة.' },
            { label: 'باركيه السيراميك', value: 'تركيب السيراميك الخشبي على شكل متخالف يحتاج هدر متوسط، وقد يرتفع إذا كان النقش معقداً.' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-answers"
        eyebrow="إجابات مباشرة"
        title="حسابات شائعة جدولة"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة حول البلاط والبورسلان"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="tiles-related"
        eyebrow="روابط داخلية"
        title="حاسبات تفيدك قبل التشطيب"
      >
        <RelatedCalculators currentSlug="tiles" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
