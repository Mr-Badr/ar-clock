import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import BahrainCarInsuranceCalculator from '@/components/calculators/BahrainCarInsuranceCalculator.client';

const SLUG = 'car-insurance-bahrain';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة تأمين السيارة البحرين — الحد الأقصى القانوني بالدينار البحريني',
  description:
    'احسب تكلفة تأمين سيارتك في البحرين (ضد الغير أو شامل) حسب سعة المحرك والمحافظة وسنوات الخلو من المطالبات، مع الحد الأقصى القانوني المعتمد من مصرف البحرين المركزي. مجاناً.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة تأمين السيارة البحرين',
    description: 'قدّر قسط تأمين سيارتك في البحرين — ضد الغير أو شامل — بالدينار البحريني.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل تأمين السيارة إلزامي في البحرين؟',
    answer:
      'نعم. التأمين ضد الغير إلزامي لجميع المركبات في البحرين، ويحدد مصرف البحرين المركزي (CBB) حداً أقصى قانونياً لسعره بموجب القرار رقم 2 لسنة 2005 — لا يجوز لأي شركة تأمين تجاوزه.',
  },
  {
    question: 'ما هو الحد الأقصى لسعر تأمين السيارة ضد الغير في البحرين؟',
    answer:
      'يعتمد الحد الأقصى على سعة محرك السيارة: 53 د.ب لسعة 1400 سم³ أو أقل، 59 د.ب لسعة 1401–2200 سم³، 71 د.ب لسعة 2201–3650 سم³، و83 د.ب لسعة 3651 سم³ فأكثر. هذه أرقام سقف قانوني من مصرف البحرين المركزي — السعر الفعلي قد يكون أقل حسب سجلك وشركة التأمين.',
  },
  {
    question: 'ما الفرق بين التأمين ضد الغير والشامل في البحرين؟',
    answer:
      'التأمين ضد الغير: يغطي الأضرار التي تسببها لسيارة أو أشخاص آخرين فقط، وسعره محدد بسقف قانوني حسب سعة المحرك. الشامل: يغطي سيارتك أيضاً (حوادث، سرقة، حريق) بسعر يحدده السوق وليس مسقوفاً قانونياً — الأنسب للسيارات الحديثة أو المرهونة لدى البنوك.',
  },
  {
    question: 'ما العوامل التي تؤثر على سعر التأمين الشامل في البحرين؟',
    answer:
      'عمر السائق (الأقل من 22 سنة يدفع ضعف السعر تقريباً)، المحافظة (العاصمة الأعلى بنسبة 10%)، عمر السيارة وقيمتها السوقية، وسجل المطالبات — كل سنة بدون مطالبة تمنح خصماً حتى 30%.',
  },
  {
    question: 'كيف يُحسب خصم الخلو من المطالبات في البحرين؟',
    answer:
      'شركات التأمين في البحرين تمنح خصماً تدريجياً مشابهاً لبقية دول الخليج: 10% بعد سنة أو سنتين، 20% بعد 3–4 سنوات، و30% بعد 5 سنوات فأكثر بدون مطالبات.',
  },
  {
    question: 'من الجهة المسؤولة عن تنظيم التأمين في البحرين؟',
    answer:
      'مصرف البحرين المركزي (Central Bank of Bahrain — CBB) هو الجهة الرقابية على قطاع التأمين، بما في ذلك تحديد السقف الأقصى لأسعار التأمين ضد الغير على المركبات.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'رقم التأمين ضد الغير هو السقف القانوني الرسمي من مصرف البحرين المركزي — دقيق ولا يمكن لأي شركة تجاوزه. أرقام التأمين الشامل تقديرية استرشادية مبنية على نطاقات السوق، وتختلف فعلياً بين شركات التأمين. استخدمها للمقارنة والتخطيط ثم احصل على عرض رسمي.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر نوع التأمين', text: 'ضد الغير (إلزامي، سقفه قانوني) أو شامل (كامل الحماية للسيارة والغير).' },
  { name: 'حدد سعة المحرك أو قيمة السيارة', text: 'لضد الغير: اختر سعة المحرك. للشامل: أدخل القيمة السوقية الحالية.' },
  { name: 'حدد عمر السائق والمحافظة', text: 'عمر السائق الرئيسي والمحافظة يؤثران على السعر الفعلي ضمن السقف القانوني.' },
  { name: 'أدخل سنوات الخلو', text: 'كل سنة بدون مطالبة تخفض القسط — سجّل سنوات الخلو من المطالبات الصحيحة.' },
  { name: 'راجع التقدير', text: 'الحاسبة تعرض النطاق التقديري وعوامل التسعير والمقارنة بين النوعين.' },
];

export default function CarInsuranceBahrainPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة تأمين السيارة البحرين', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة تأمين السيارة البحرين',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BHD' },
    description: 'حاسبة أسعار تأمين السيارة في البحرين ضد الغير والشامل بالدينار البحريني.',
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
    name: 'كيف تستخدم حاسبة تأمين السيارة البحرين',
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
        badge="🇧🇭 البحرين"
        title="حاسبة تأمين السيارة البحرين"
        description="قدّر قسط تأمين سيارتك في البحرين — ضد الغير أو شامل — مع الحد الأقصى القانوني الرسمي من مصرف البحرين المركزي لتأمين ضد الغير. أرقام بالدينار البحريني (BHD)."
        highlights={[
          { label: 'الحد الأقصى القانوني', desc: 'من قرار مصرف البحرين المركزي رقم 2/2005' },
          { label: 'ضد الغير والشامل', desc: 'كلا النوعين مع مقارنة التغطية' },
          { label: 'خصم الخلو من المطالبات', desc: 'حتى 30% لمن لديه سجل نظيف' },
          { label: 'BHD — دينار بحريني', desc: 'أرقام بالعملة المحلية مع تقدير شهري' },
        ]}
      >
        <BahrainCarInsuranceCalculator />
      </CalculatorHero>

      {/* Editorial */}
      <CalculatorSection
        id="guide"
        eyebrow="دليل التأمين"
        title="تأمين السيارات في البحرين — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            يخضع سوق تأمين المركبات في البحرين لرقابة <strong>مصرف البحرين المركزي (CBB)</strong>، الذي يحدد
            سقفاً قانونياً صارماً لأسعار التأمين ضد الغير حسب سعة محرك السيارة بموجب القرار رقم 2 لسنة 2005 —
            لا يجوز لأي شركة تأمين مرخصة تجاوز هذا السقف. التأمين الشامل، على عكس ذلك، سعره غير مسقوف ويحدده
            السوق حسب قيمة السيارة وعوامل الخطورة.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>سعة المحرك</th><th>الحد الأقصى القانوني (ضد الغير)</th></tr>
            </thead>
            <tbody>
              <tr><td>1400 سم³ أو أقل</td><td>53 د.ب</td></tr>
              <tr><td>1401 – 2200 سم³</td><td>59 د.ب</td></tr>
              <tr><td>2201 – 3650 سم³</td><td>71 د.ب</td></tr>
              <tr><td>3651 سم³ فأكثر</td><td>83 د.ب</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح لتخفيض قسط تأمين السيارة في البحرين</h3>
          <ul className="calc-tip-list">
            <li>للتأمين ضد الغير، تأكد أن السعر المعروض عليك لا يتجاوز السقف القانوني حسب سعة محرك سيارتك.</li>
            <li>لا تُقدّم مطالبات صغيرة — الخصم الذي ستحصل عليه العام القادم قد يوفر أكثر من قيمة المطالبة.</li>
            <li>قارن عروض عدة شركات تأمين مرخصة من مصرف البحرين المركزي قبل التجديد.</li>
            <li>للسيارات فوق 5 سنوات بقيمة سوقية منخفضة، قيّم التحول من الشامل لضد الغير.</li>
            <li>تأكد من صحة قيمة السيارة المدرجة في وثيقة التأمين الشامل — تقليلها قد يُقلّل التعويض عند الحادث.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن تأمين السيارات في البحرين"
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
