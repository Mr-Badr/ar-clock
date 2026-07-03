import { getSiteUrl } from '@/lib/site-config';
import JsonLd from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
} from '@/components/calculators/common.jsx';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import KuwaitCarInsuranceCalculator from '@/components/calculators/KuwaitCarInsuranceCalculator.client';

const SLUG = 'car-insurance-kuwait';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة تأمين السيارة الكويت — ضد الغير والشامل بالدينار الكويتي',
  description:
    'احسب تكلفة تأمين سيارتك في الكويت (ضد الغير أو شامل) حسب عمر السائق والمحافظة وسنوات الخلو من المطالبات. أرقام تقديرية بالدينار الكويتي. مجاناً.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة تأمين السيارة الكويت',
    description: 'قدّر قسط تأمين سيارتك في الكويت — ضد الغير أو شامل — بالدينار الكويتي.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل تأمين السيارة إلزامي في الكويت؟',
    answer:
      'نعم. قانون تأمين المركبات الكويتي رقم 29 لسنة 2000 يُلزم جميع المركبات بتأمين ضد الغير كحد أدنى. قيادة سيارة بدون تأمين تعرّض صاحبها لغرامة مالية وسحب اللوحة.',
  },
  {
    question: 'ما الفرق بين التأمين ضد الغير والشامل في الكويت؟',
    answer:
      'التأمين ضد الغير: يغطي الأضرار التي تسببها لسيارة أو أشخاص آخرين فقط. الشامل: يغطي سيارتك (حوادث، سرقة، حريق، كوارث طبيعية) إضافةً لتغطية الغير. الشامل أغلى لكنه الأنسب للسيارات الحديثة ذات القيمة المرتفعة.',
  },
  {
    question: 'ما العوامل التي تؤثر على سعر التأمين في الكويت؟',
    answer:
      'عمر السائق (الأقل من 22 سنة يدفع ضعفين)، محافظة التسجيل (العاصمة الأعلى بنسبة 15%)، عمر السيارة وقيمتها السوقية، وسجل المطالبات — كل سنة بدون مطالبة تمنح خصماً حتى 30%.',
  },
  {
    question: 'كيف يُحسب خصم الخلو من المطالبات في الكويت؟',
    answer:
      'شركات التأمين في الكويت تمنح خصماً تدريجياً: 10% بعد سنة أو سنتين، 20% بعد 3–4 سنوات، و30% بعد 5 سنوات فأكثر. احتفظ بوثيقة تأمين مستمرة وبدون مطالبات للحصول على أفضل سعر.',
  },
  {
    question: 'ما هي الشركات المرخصة لتأمين السيارات في الكويت؟',
    answer:
      'أبرزها: شركة الكويت للتأمين، الوطنية للتأمين، الخليج للتأمين، التأمين الوطني، وعدد من شركات التأمين العربية المرخصة من وزارة التجارة والصناعة الكويتية.',
  },
  {
    question: 'هل يمكنني تأمين سيارة يزيد عمرها عن 10 سنوات في الكويت؟',
    answer:
      'للتأمين ضد الغير: نعم دائماً بغض النظر عن العمر. للتأمين الشامل: بعض شركات التأمين تشترط الكشف الفني وقد ترفض التأمين الشامل للسيارات فوق 7–10 سنوات أو تُخفّض الحد الأقصى للتعويض.',
  },
  {
    question: 'ما هي تكلفة التأمين الشامل للسيارات الفارهة في الكويت؟',
    answer:
      'سيارات فوق 20,000 دينار: يتراوح التأمين الشامل بين 400–900 دينار سنوياً لسائق في عمر 30–45 بدون مطالبات سابقة. السيارات الفارهة فوق 50,000 دينار قد تتجاوز 1,500–3,000 دينار حسب الشركة والشروط.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'هي تقديرات استرشادية مبنية على نطاقات السوق الكويتي. الأسعار الفعلية تختلف بين شركات التأمين وتتأثر بعوامل إضافية (مهنة السائق، استخدام السيارة التجاري/الشخصي). استخدمها للمقارنة والتخطيط ثم احصل على عرض رسمي.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر نوع التأمين', text: 'ضد الغير (إلزامي، أرخص) أو شامل (كامل الحماية للسيارة والغير).' },
  { name: 'أدخل قيمة السيارة', text: 'للتأمين الشامل: أدخل القيمة السوقية الحالية للسيارة (وليس سعر الشراء الأصلي).' },
  { name: 'حدد عمر السائق والمنطقة', text: 'عمر السائق الرئيسي والمحافظة يؤثران مباشرة على التسعير.' },
  { name: 'أدخل سنوات الخلو', text: 'كل سنة بدون مطالبة تخفض القسط — سجّل سنوات الخلو من المطالبات الصحيحة.' },
  { name: 'راجع التقدير', text: 'الحاسبة تعرض نطاق السعر وعوامل التسعير والمقارنة بين النوعين.' },
];

export default function CarInsuranceKuwaitPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة تأمين السيارة الكويت', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة تأمين السيارة الكويت',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KWD' },
    description: 'حاسبة أسعار تأمين السيارة في الكويت ضد الغير والشامل بالدينار الكويتي.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'كيف تستخدم حاسبة تأمين السيارة الكويت',
    step: HOW_TO_STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={softwareApp} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />

      <CalculatorHero
        badge="🇰🇼 الكويت"
        title="حاسبة تأمين السيارة الكويت"
        description="قدّر قسط تأمين سيارتك في الكويت — ضد الغير أو شامل — حسب عمر السائق والمحافظة وسنوات الخلو من المطالبات. أرقام بالدينار الكويتي (KWD)."
        highlights={[
          { label: 'ضد الغير والشامل', desc: 'كلا النوعين مع مقارنة التغطية' },
          { label: 'خصم الخلو من المطالبات', desc: 'حتى 30% لمن لديه سجل نظيف' },
          { label: 'عوامل التسعير مفصّلة', desc: 'العمر، المحافظة، عمر السيارة' },
          { label: 'KWD — دينار كويتي', desc: 'أرقام بالعملة المحلية مع تقدير شهري' },
        ]}
      />

      <CalculatorSection
        id="tool"
        eyebrow="حاسبة التأمين"
        title="احسب قسط تأمين سيارتك"
      >
        <KuwaitCarInsuranceCalculator />
      </CalculatorSection>

      {/* Editorial */}
      <CalculatorSection
        id="guide"
        eyebrow="دليل التأمين"
        title="تأمين السيارات في الكويت — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            يُنظّم قانون تأمين المركبات الكويتي رقم 29 لسنة 2000 سوق التأمين ويُلزم جميع المركبات
            بتأمين ضد الغير كحد أدنى. التأمين الشامل اختياري لكنه ضروري للسيارات الحديثة والمرهونة لدى البنوك.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>العامل</th><th>تأثيره على القسط</th></tr>
            </thead>
            <tbody>
              <tr><td>عمر السائق (18–21)</td><td>× 2.2 من معدل الأساس</td></tr>
              <tr><td>محافظة العاصمة</td><td>+ 15% كثافة مرورية عالية</td></tr>
              <tr><td>محافظة حولي / الفروانية</td><td>+ 10%</td></tr>
              <tr><td>سنة الخلو من المطالبات</td><td>− 10% لكل سنة حتى 30%</td></tr>
              <tr><td>سيارة جديدة (شامل)</td><td>2.8–4.4% من القيمة</td></tr>
              <tr><td>سيارة 7 سنوات+ (شامل)</td><td>1.6–2.4% من القيمة</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح لتخفيض قسط تأمين السيارة في الكويت</h3>
          <ul className="calc-tip-list">
            <li>لا تُقدّم مطالبات صغيرة (أقل من 200 دينار) — الخصم الذي ستحصل عليه العام القادم قد يوفر أكثر.</li>
            <li>قارن 3 شركات على الأقل — الفرق بين شركتين لنفس السيارة قد يصل إلى 30–40%.</li>
            <li>للسيارات فوق 5 سنوات، قيّم التحول من الشامل لضد الغير إذا كانت القيمة السوقية منخفضة.</li>
            <li>تأكد من صحة قيمة السيارة المدرجة في الوثيقة — تقليلها قد يُقلّل التعويض عند الحادث.</li>
            <li>انتبه لشروط الاستثناء: الحوادث تحت تأثير المخدرات والكحول مستثناة في جميع وثائق التأمين.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن تأمين السيارات في الكويت"
      >
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="related"
        eyebrow="حاسبات ذات صلة"
        title="أدوات مالية أخرى"
      >
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </>
  );
}
