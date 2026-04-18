import RebarCalculator from '@/components/calculators/building/RebarCalculator.client';
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
import {
  REBAR_DIAMETERS,
  REBAR_WEIGHT_PER_METER,
  REBAR_TYPICAL_USE,
} from '@/lib/calculators/building/constants';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.rebar);

export const metadata = buildCanonicalMetadata({
  title: 'كم وزن الحديد؟ | احسب وزن سيخ 12 متر وحديد التسليح بالكجم والطن',
  description:
    'إذا كان سؤالك: كم وزن الحديد؟ فهذه الصفحة تحسب وزن حديد التسليح حسب القطر والطول والعدد، وتحوّل النتيجة إلى كجم وطن وعدد الأسياخ القياسية 12 متر فوراً.',
  keywords: getBuildingKeywords('rebar'),
  url: `${SITE_URL}/calculators/building/rebar`,
});

export default function RebarPage() {
  const faqItems = [
    {
      question: 'ما هو معيار حساب وزن حديد التسليح؟',
      answer: 'المعادلة الهندسية القياسية هي: الوزن (كجم/م) = قطر الحديد (مم)² ÷ 162. هذه المعادلة مشتقة من كثافة الفولاذ (7850 كجم/م³) وهي معتمدة في الكودات الهندسية العالمية (ACI, BS, ECP).',
    },
    {
      question: 'كم وزن سيخ حديد 12 متر قطر 16 ملم؟',
      answer: 'وزن المتر لقطر 16 هو 1.578 كجم/م. إذاً سيخ 12 متر = 1.578 × 12 = 18.94 كجم تقريباً.',
    },
    {
      question: 'ما الفرق بين الحديد الملساء والمشرشرة؟',
      answer: 'الحديد المشرشر (الربيط) يتمسك بالخرسانة أفضل ويستخدم للتسليح الرئيسي. الحديد الملساء يستخدم للكانات (الأساور). الفرق في الشكل فقط، الوزن لنفس القطر متقارب جداً.',
    },
    {
      question: 'كم كيلو حديد في المتر المربع من السقف؟',
      answer: 'يعتمد على نوع السقف والتصميم الإنشائي. بشكل تقريبي، السقف الهوردي يحتاج 10-15 كجم/م²، والسقف المصمت يحتاج 15-25 كجم/م². هذه أرقام تقديرية فقط خارج نطاق المخطط الإنشائي الفعلي.',
    },
  ];

  const quickAnswers = [
    {
      question: 'وزن حديد قطر 12 ملم لكل متر؟',
      description: 'من أكثر الأسئلة شيوعاً في مواقع البناء',
      answer: 'وزن المتر الطولي لقطر 12 ملم هو 0.888 كجم. أي سيخ 12 متر يزن 0.888 × 12 = 10.66 كجم.',
    },
    {
      question: 'كم طن حديد لبناء 200 متر مربع (دورين)؟',
      description: 'تقدير مبدئي لمنزل عائلي',
      answer: 'بشكل تقديري عام (مع مراعاة وجود مخطط إنشائي): مبنى 400 م² إجمالي × 45 كجم/م² تقديرياً = حوالي 18 طن حديد. هذا مجرد مؤشر أولي.',
    },
    {
      question: 'كم وزن سيخ 16 بطول 12 متر؟',
      description: 'سؤال شراء وتسعير متكرر',
      answer: 'سيخ 16 ملم يزن تقريباً 18.94 كجم عند طول 12 متر، لأن وزن المتر الواحد منه 1.578 كجم تقريباً.',
    },
  ];

  const sectionNavItems = [
    { href: '#calculator-hero', label: 'الحاسبة', description: 'أدخل القطر والطول واحسب الوزن' },
    { href: '#rebar-table', label: 'جدول الأقطار', description: 'وزن كل قطر من ⌀8 إلى ⌀32' },
    { href: '#rebar-story', label: 'فهم الحديد', description: 'استخدامات كل قطر' },
    { href: '#rebar-answers', label: 'إجابات سريعة', description: 'أرقام جاهزة' },
    { href: '#rebar-faq', label: 'الأسئلة الشائعة', description: 'المزيد' },
  ];

  return (
    <main className="bg-base text-primary">
      <CalculatorHero
        badge="هندسة / حديد"
        title="كم وزن الحديد؟ احسب وزن حديد التسليح وسيخ 12 متر"
        description="أدخل قطر الحديد والأطوال والعدد لتحصل فوراً على الوزن الإجمالي بالكجم والطن، مع وزن المتر الطولي وعدد الأسياخ القياسية 12 متر بطريقة واضحة وسريعة."
        accent="#EF4444"
        highlights={[
          'يعطيك الوزن بالكجم والطن في نفس اللحظة.',
          'يدعم جميع الأقطار الشائعة من ⌀8 إلى ⌀32.',
          'يحوّل النتيجة إلى عدد أسياخ 12 متر بسهولة.',
        ]}
      >
        <RebarCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="rebar-overview"
        eyebrow="خريطة الصفحة"
        title="كل ما تحتاجه عن وزن الحديد"
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-table"
        eyebrow="مرجع هندسي"
        title="جدول أوزان أقطار الحديد"
        description="مشتق من المعادلة القياسية: وزن (كجم/م) = قطر (مم)² ÷ 162"
        subtle
      >
        <div className="calc-table-wrap">
          <table className="calc-guide-table">
            <thead>
              <tr>
                <th>القطر (مم)</th>
                <th>الوزن (كجم/م)</th>
                <th>وزن سيخ 12م</th>
                <th>الاستخدام الشائع</th>
              </tr>
            </thead>
            <tbody>
              {REBAR_DIAMETERS.map((d, idx) => (
                <tr key={d} className={idx % 2 === 0 ? 'bg-base' : ''}>
                  <td>⌀{d}</td>
                  <td className="font-mono">{REBAR_WEIGHT_PER_METER[d]}</td>
                  <td className="font-mono font-bold">{(REBAR_WEIGHT_PER_METER[d] * 12).toFixed(2)} كجم</td>
                  <td>{REBAR_TYPICAL_USE[d]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="rebar-story"
        eyebrow="دليل الأقطار"
        title="أيّ قطر لأيّ استخدام؟"
        description="اختيار القطر الصحيح لا يقل أهمية عن الكمية. كل عنصر إنشائي يتطلب قطراً محدداً في المخطط الهندسي."
        subtle
      >
        <CalculatorStoryBand
          title="القطر الصغير لا يعني القطع الضعيف"
          description="الكانات (حديد ⌀8 أو ⌀10) هي التي تمنع الانهيار المفاجئ في الأعمدة، على الرغم من قطرها الصغير."
          items={[
            { label: 'الأقطار الصغيرة (⌀8 - ⌀12)', value: 'كانات توزيع، حديد الأسقف الثانوي. متوفرة عادة في شدة 4200 أو 5200.' },
            { label: 'الأقطار المتوسطة (⌀14 - ⌀20)', value: 'التسليح الرئيسي للأشرطة والكمرات والأعمدة المتوسطة.' },
            { label: 'الأقطار الكبيرة (⌀22 - ⌀32)', value: 'الأعمدة الكبيرة والجسور والمنشآت الثقيلة. نادر في المساكن.' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-answers"
        eyebrow="إجابات مباشرة"
        title="أرقام جاهزة قبل شراء الحديد"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-guides"
        eyebrow="دليل داعم"
        title="قبل شراء الحديد أو طلب العرض"
        description="هذا الدليل يشرح طريقة تقدير الوزن والصيغة الأقرب للشراء، ثم يربطك مباشرة بحاسبة الحديد لتطبيق الحساب على القطر والطول والعدد."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة حول وزن الحديد"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="rebar-related"
        eyebrow="روابط داخلية"
        title="حاسبات مكملة"
      >
        <RelatedCalculators currentSlug="rebar" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
