import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import QatarCarInsuranceCalculator from '@/components/calculators/QatarCarInsuranceCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';

const SLUG = 'car-insurance-qatar';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة تأمين السيارة قطر — ضد الغير والشامل بالريال القطري',
  description:
    'احسب تكلفة تأمين سيارتك في قطر (ضد الغير أو شامل) حسب عمر السائق والبلدية وسنوات الخلو من المطالبات. أرقام تقديرية بالريال القطري. مجاناً.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة تأمين السيارة قطر',
    description: 'قدّر قسط تأمين سيارتك في قطر — ضد الغير أو شامل — بالريال القطري.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل تأمين السيارة إلزامي في قطر؟',
    answer:
      'نعم. يُلزم القانون القطري جميع المركبات بتأمين ضد الغير كحد أدنى. قيادة سيارة بدون تأمين مخالفة قانونية تعرّض صاحبها لغرامة وسحب اللوحة وتوقيف السيارة.',
  },
  {
    question: 'ما الفرق بين التأمين ضد الغير والشامل في قطر؟',
    answer:
      'التأمين ضد الغير يغطي فقط الأضرار التي تسببها لمركبة أو أشخاص آخرين ويُعدّ الحد الأدنى القانوني. التأمين الشامل يغطي سيارتك أيضاً (حوادث، سرقة، حريق، كوارث طبيعية) وهو اختياري لكنه موصى به للسيارات الحديثة والمرهونة للبنوك.',
  },
  {
    question: 'ما العوامل التي تؤثر على سعر التأمين في قطر؟',
    answer:
      'عمر السائق (الأقل من 22 سنة يدفع ضعفين)، بلدية التسجيل (الدوحة الأعلى بـ 12%)، عمر السيارة وقيمتها السوقية، وسنوات الخلو من المطالبات (حتى 30% خصم بعد 5 سنوات نظيفة).',
  },
  {
    question: 'كيف يُحسب خصم الخلو من المطالبات في قطر؟',
    answer:
      'شركات التأمين في قطر تمنح خصماً تدريجياً: 10% بعد 1–2 سنة بدون مطالبات، 20% بعد 3–4 سنوات، 30% بعد 5 سنوات فأكثر. يُنصح بعدم تقديم مطالبات صغيرة للحفاظ على هذا الخصم.',
  },
  {
    question: 'ما هي أبرز شركات التأمين على السيارات في قطر؟',
    answer:
      'أبرز الشركات المرخصة: قطر للتأمين (QIC)، شركة الدوحة للتأمين، الخليج للتأمين، وشركة إنما للتأمين وإعادة التأمين — جميعها خاضعة لرقابة مصرف قطر المركزي.',
  },
  {
    question: 'هل يختلف التأمين بين القطريين والمقيمين في قطر؟',
    answer:
      'السعر يعتمد أساساً على بيانات السيارة والسائق، لا على الجنسية. لكن السائقين الجدد أو الذين لديهم رخصة قطرية حديثة قد يواجهون معدلات أعلى في بعض الشركات.',
  },
  {
    question: 'متى يكون التأمين الشامل ضرورياً في قطر؟',
    answer:
      'إذا كانت السيارة مرهونة للبنك (التمويل)، فالبنك يُلزم بالتأمين الشامل. كذلك يُنصح به للسيارات الأقل من 5 سنوات أو التي تزيد قيمتها على 60,000 ريال قطري.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'هي تقديرات استرشادية مبنية على نطاقات السوق القطري. الأسعار الفعلية تختلف بين شركات التأمين وتتأثر بعوامل إضافية (نوع الاستخدام، مهنة السائق). استخدمها للمقارنة والتخطيط ثم احصل على عرض رسمي.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر نوع التأمين', text: 'ضد الغير (إلزامي، أرخص) أو شامل (كامل الحماية للسيارة والغير).' },
  { name: 'أدخل قيمة السيارة', text: 'للتأمين الشامل: أدخل القيمة السوقية الحالية (لا سعر الشراء الأصلي).' },
  { name: 'حدد عمر السائق والبلدية', text: 'عمر السائق الرئيسي وبلدية التسجيل يؤثران مباشرة على التسعير.' },
  { name: 'أدخل سنوات الخلو', text: 'سجّل سنوات الخلو الصحيحة للحصول على أفضل خصم (حتى 30%).' },
  { name: 'راجع التقدير', text: 'الحاسبة تعرض نطاق السعر وعوامل التسعير والمقارنة بين النوعين.' },
];

export default function CarInsuranceQatarPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة تأمين السيارة قطر', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة تأمين السيارة قطر',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'QAR' },
    description: 'حاسبة أسعار تأمين السيارة في قطر ضد الغير والشامل بالريال القطري.',
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
    name: 'كيف تستخدم حاسبة تأمين السيارة قطر',
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
        badge={<><CountryFlag code="qa" /> قطر</>}
        title="حاسبة تأمين السيارة قطر"
        description="قدّر قسط تأمين سيارتك في قطر — ضد الغير أو شامل — حسب عمر السائق والبلدية وسنوات الخلو من المطالبات. أرقام بالريال القطري (QAR)."
        highlights={[
          { label: 'ضد الغير والشامل', desc: 'كلا النوعين مع مقارنة التغطية' },
          { label: 'خصم الخلو من المطالبات', desc: 'حتى 30% لمن لديه سجل نظيف' },
          { label: 'عوامل التسعير مفصّلة', desc: 'العمر، البلدية، عمر السيارة' },
          { label: 'QAR — ريال قطري', desc: 'أرقام بالعملة المحلية مع تقدير شهري' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة التأمين" title="احسب قسط تأمين سيارتك">
        <QatarCarInsuranceCalculator />
      </CalculatorSection>

      <CalculatorSection
        id="guide"
        eyebrow="دليل التأمين"
        title="تأمين السيارات في قطر — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            يُلزم القانون القطري جميع المركبات بتأمين ضد الغير كحد أدنى. التأمين الشامل اختياري
            لكنه ضروري للسيارات المرهونة للبنوك والحديثة ذات القيمة العالية.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>العامل</th><th>تأثيره على القسط</th></tr>
            </thead>
            <tbody>
              <tr><td>عمر السائق (18–21)</td><td>× 2.0 من معدل الأساس</td></tr>
              <tr><td>الدوحة (بلدية)</td><td>+ 12% كثافة مرورية عالية</td></tr>
              <tr><td>الريان (بلدية)</td><td>+ 8%</td></tr>
              <tr><td>الوكرة (بلدية)</td><td>+ 4%</td></tr>
              <tr><td>سنة الخلو من المطالبات</td><td>− 10% لكل سنة حتى 30%</td></tr>
              <tr><td>سيارة جديدة (شامل)</td><td>2.5–4.2% من القيمة</td></tr>
              <tr><td>سيارة 7 سنوات+ (شامل)</td><td>1.4–2.2% من القيمة</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح لتخفيض قسط تأمين السيارة في قطر</h3>
          <ul className="calc-tip-list">
            <li>لا تُقدّم مطالبات صغيرة (أقل من 500 ريال) — الخصم السنوي أكبر من قيمة المطالبة.</li>
            <li>قارن 3 شركات على الأقل — الفرق بين شركتين لنفس السيارة قد يصل 25–35%.</li>
            <li>للسيارات فوق 5 سنوات وقيمة منخفضة، قيّم التحول من الشامل لضد الغير.</li>
            <li>تأكد من تسجيل قيمة السيارة الصحيحة — تقليلها يُقلّل التعويض عند الحادث.</li>
            <li>احتفظ بوثيقة تأمين مستمرة — الانقطاع يفقدك خصم الخلو من المطالبات.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن تأمين السيارات في قطر">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </>
  );
}
