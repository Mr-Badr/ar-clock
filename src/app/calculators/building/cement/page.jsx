import CementCalculator from '@/components/calculators/building/CementCalculator.client';
import {
  CalculatorHero,
  CalculatorSection,
  CalculatorSectionNav,
  CalculatorStoryBand,
  CalculatorQuickAnswerGrid,
  CalculatorFaqSection,
  CalculatorResourceLinks,
  CalculatorFooterCta,
  RelatedCalculators,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getGuidesBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.cement);

export const metadata = buildCanonicalMetadata({
  title: 'كم كيس أسمنت أحتاج لصبة اليوم؟ | احسب الأسمنت والرمل والحصى بسرعة',
  description:
    'إذا كان سؤالك: كم كيس أسمنت أحتاج؟ فهذه الحاسبة تعطيك فوراً عدد الأكياس وكمية الرمل والحصى والماء لأي صبة خرسانة، مع العيار والهدر ونتيجة واضحة قبل الشراء.',
  keywords: getBuildingKeywords('cement'),
  url: `${SITE_URL}/calculators/building/cement`,
});

export default function CementPage() {
  const faqItems = [
    {
      question: 'كم كيس أسمنت في المتر المكعب؟',
      answer: 'يعتمد على العيار (قوة الخرسانة). المتر المكعب عيار 200 (M20)يحتاج تقريباً 7 إلى 7.5 أكياس (350 إلى 370 كجم)، بينما عيار 250 (M25) يحتاج حوالي 8.5 إلى 9 أكياس (425 إلى 450 كجم).',
    },
    {
      question: 'ما هو العيار المناسب للأسقف والأعمدة؟',
      answer: 'العرف الهندسي للمباني السكنية المعتادة هو استخدام عيار M20 أو M25 (200 إلى 250 كجم/سم²) للأعمدة والأسقف. الأفضل دائماً الرجوع للمخطط الإنشائي.',
    },
    {
      question: 'ما هي نسبة الرمل للحصى؟',
      answer: 'في الخلطات القياسية (النسبية)، تكون كمية الحصى أو الزلط ضِعف كمية الرمل تقريباً.',
    },
  ];

  const quickAnswers = [
    {
      question: 'كم كيس أسمنت لصبة 10 متر مكعب؟',
      description: 'حساب سريع لكمية بسيطة',
      answer: 'في حالة استخدام عيار 200 (المتوسط)، ستحتاج 10 متر × 7.4 أكياس = 74 كيس أسمنت تقريباً (وزن 50 كجم للكيس).',
    },
    {
      question: 'كم كيس أسمنت في متر خرسانة واحد؟',
      description: 'من أكثر الأسئلة قبل الشراء',
      answer: 'في أغلب الصبات السكنية المتوسطة عيار M20 تحتاج تقريباً من 7 إلى 7.5 أكياس لكل متر مكعب، لكن الرقم يرتفع أو ينخفض حسب العيار والهدر.',
    },
  ];

  const sectionNavItems = [
    { href: '#calculator-hero', label: 'الحاسبة', description: 'كمية الأسمنت، الرمل، الماء' },
    { href: '#cement-story', label: 'عيارات الخرسانة', description: 'أنواع الخرسانة واستخداماتها' },
    { href: '#cement-answers', label: 'إجابات مباشرة', description: 'أسئلة معتادة' },
    { href: '#cement-faq', label: 'الأسئلة الشائعة', description: 'المزيد من الأسئلة' },
  ];

  return (
    <main className="bg-base text-primary">
      <CalculatorHero
        badge="هندسة / مواد"
        title="كم كيس أسمنت أحتاج؟ احسب الأسمنت والرمل والحصى لصبتك"
        description="أدخل حجم الخرسانة المطلوبة لتحصل فوراً على عدد أكياس الأسمنت وكمية الرمل والحصى والماء، مع تقدير العيار والهدر بطريقة سريعة وواضحة قبل التنفيذ أو طلب المواد."
        accent="#8B5CF6" // Violet for specific materials
        highlights={[
          'يعطيك عدد الأكياس فوراً من M15 إلى M30.',
          'يحسب الرمل والحصى والماء في نفس الشاشة.',
          'يضيف الهدر المتوقع حتى لا تنقصك المواد وقت الصبة.',
        ]}
      >
        <CementCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="cement-overview"
        eyebrow="خريطة الصفحة"
        title="كل ما يخص الأسمنت"
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="cement-story"
        eyebrow="دليل العيارات"
        title="قوة الخرسانة (العيار)"
        description="العيار أو (Grade) يعبر عن قوة تحمل الخرسانة بالنيوتن/مم مربع."
        subtle
      >
        <CalculatorStoryBand
          title="كل عنصر إنشائي يحتاج عياراً مختلفاً"
          description="لا تستخدم نفس الخلطة لكل شيء. استخدام عيار ضعيف للأسقف خطر، واستخدام عيار عالي جداً للنظافة هدر للأموال."
          items={[
            { label: 'عيار 150 (M15)', value: 'يستخدم للحوائط غير الحاملة والصبات الأرضية البسيطة (خرسانة النظافة).' },
            { label: 'عيار 200 (M20)', value: 'الأكثر شيوعاً في المساكن. للأسقف، الأعمدة البسيطة، والكمرات.' },
            { label: 'عيار 250 (M25)', value: 'للقواعد والأساسات والمناطق المعرضة لأحمال متوسطة.' },
            { label: 'عيار 300 (M30)', value: 'للمنشآت الكبيرة والأعمدة الثقيلة، ويحتاج إشرافاً هندسياً دقيقاً.' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="cement-answers"
        eyebrow="إجابات مباشرة"
        title="إجابات سريعة قبل شراء الأسمنت"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="cement-guides"
        eyebrow="دليل داعم"
        title="افهم السؤال قبل شراء الأسمنت"
        description="هذا الدليل القصير يلتقط السؤال التعليمي الشائع حول عدد الأكياس والعيار والهدر، ثم يعيد الزائر إلى الحاسبة لتطبيق الفكرة فوراً."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} />
      </CalculatorSection>

      <CalculatorSection
        id="cement-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة حول الأسمنت والخرسانة"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="cement-related"
        eyebrow="روابط داخلية"
        title="أكمل حساب مواد البناء"
      >
        <RelatedCalculators currentSlug="cement" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
