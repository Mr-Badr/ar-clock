import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import QatarHealthInsuranceCalculator from '@/components/calculators/QatarHealthInsuranceCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';

const SLUG = 'health-insurance-qatar';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة التأمين الصحي قطر — أسعار الوافدين والعائلات بالريال القطري',
  description:
    'قدّر تكلفة التأمين الصحي في قطر للوافدين والعائلات حسب مستوى التأمين (أساسي / قياسي / مميز / عالمي) والعمر وعدد الأشخاص. أرقام بالريال القطري.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة التأمين الصحي قطر',
    description: 'تكلفة التأمين الصحي في قطر للوافدين — 4 مستويات من الأساسي إلى العالمي. أرقام بالريال القطري.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل التأمين الصحي إلزامي في قطر؟',
    answer:
      'نعم. القانون رقم 22 لسنة 2021 يُلزم أصحاب العمل بتوفير تأمين صحي لجميع الموظفين في القطاع الخاص. كذلك يُلزم الزوار بتأمين صحي إلزامي عند الدخول (منذ فبراير 2023). المخالفون يواجهون غرامة تصل إلى 30,000 ريال قطري.',
  },
  {
    question: 'ما المستويات الأربعة للتأمين الصحي في قطر؟',
    answer:
      'أساسي (Law 22): الحد الأدنى القانوني، شبكة محلية، 800-1,500 ريال/سنة. قياسي: أوسع، طب عام وتخصصي، 1,500-3,500 ريال. مميز: تغطية شاملة محلية + إقليمي، 3,500-7,000 ريال. عالمي: كامل محلياً ودولياً بما فيه مستشفى حمد والمراكز الدولية، 7,000-18,000 ريال.',
  },
  {
    question: 'ما أبرز شركات التأمين الصحي في قطر؟',
    answer:
      'اثنتا عشرة شركة مرخصة من وزارة الصحة. الأبرز: QLM (الأرخص للأفراد)، GIG Gulf Qatar (7 خطط)، QIC قطر للتأمين، Al-Koot، Cigna Global (للتغطية الدولية)، وشركة قطر للتأمين الإسلامي (QIIC).',
  },
  {
    question: 'هل يؤثر العمر على سعر التأمين الصحي في قطر؟',
    answer:
      'نعم بشكل كبير. معامل التسعير يرتفع مع العمر: 18-30 (المعامل ×1)، 31-40 (×1.3)، 41-50 (×1.9)، 51-60 (×2.7)، 60+ (×3.8). الفئات 51+ قد تتطلب فحصاً طبياً مسبقاً.',
  },
  {
    question: 'ما هي تكلفة التأمين الصحي للعائلة في قطر؟',
    answer:
      'عائلة من 4 أشخاص (المستوى القياسي): 6,000-14,000 ريال سنوياً. المستوى المميز: 14,000-28,000 ريال. المستوى العالمي: 28,000-72,000 ريال. هذه تقديرات للعائلة بمؤمَّن رئيسي في عمر 31-40.',
  },
  {
    question: 'هل تُغطّي وثيقة التأمين الإلزامية الحمل والولادة؟',
    answer:
      'المستوى الأساسي لا يشمل الحمل عادةً. المستويات القياسية والمميزة تشمل الولادة الطبيعية (حتى 15,000 ريال) والقيصرية (حتى 30,000 ريال) مع فترة انتظار 10-12 شهراً من بدء الوثيقة.',
  },
  {
    question: 'ما هو نطاق التحمّل (المشاركة في التكلفة) في قطر؟',
    answer:
      'معظم خطط قطر تشتمل على نسبة مشاركة 10-20% (co-insurance) مع سقف سنوي. بعض الخطط تفرض مبلغاً ثابتاً للزيارة (co-pay). المستوى العالمي عادةً بلا تحمّل لأكبر المستشفيات.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'هي تقديرات استرشادية من السوق القطري (QLM، GIG Gulf، Al-Koot). الأسعار الفعلية تختلف بين شركات التأمين وتتأثر بعوامل إضافية (مهنة، تاريخ طبي). احصل على عرض رسمي مباشرةً من الشركة.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر مستوى التأمين', text: 'من الأساسي (إلزامي قانوناً) إلى العالمي (دولي مع مستشفى حمد).' },
  { name: 'حدد عدد المؤمَّن عليهم', text: 'فرد أو عائلة — الأطفال والمعالون يُضافون بتكلفة أقل.' },
  { name: 'أدخل عمر المؤمَّن الرئيسي', text: 'العمر يؤثر على السعر — الفئة 51+ تدفع ما يصل إلى 3.8× المعدل الأساسي.' },
  { name: 'حدد الحالات المزمنة', text: 'وجود أمراض مزمنة (سكري، قلب) يرفع القسط بحوالي 35%.' },
  { name: 'راجع التقدير', text: 'الحاسبة تعرض نطاق السعر السنوي والشهري مع مقارنة المستويات الأربعة.' },
];

export default function HealthInsuranceQatarPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة التأمين الصحي قطر', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة التأمين الصحي قطر',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'QAR' },
    description: 'حاسبة تكلفة التأمين الصحي في قطر للوافدين والعائلات بالريال القطري.',
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
    name: 'كيف تستخدم حاسبة التأمين الصحي قطر',
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
        title="حاسبة التأمين الصحي قطر"
        description="قدّر تكلفة تأمينك الصحي في قطر — للأفراد والعائلات والوافدين — وفق المستوى المطلوب والعمر وعدد الأشخاص. أرقام استرشادية بالريال القطري."
        highlights={[
          { label: '4 مستويات تأمين', desc: 'من الأساسي الإلزامي إلى العالمي الشامل' },
          { label: 'معامل العمر تلقائي', desc: 'الفئة 51+ تدفع حتى 3.8× المعدل الأساسي' },
          { label: 'مقارنة المستويات', desc: 'رسم بياني يوضح الفرق بين الخطط الأربع' },
          { label: 'QAR — ريال قطري', desc: 'أرقام سنوية وشهرية للفرد والعائلة' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة التأمين" title="قدّر تكلفة تأمينك الصحي في قطر">
        <QatarHealthInsuranceCalculator />
      </CalculatorSection>

      <CalculatorSection
        id="guide"
        eyebrow="دليل التأمين"
        title="التأمين الصحي في قطر — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            التأمين الصحي إلزامي لجميع العمالة الوافدة في قطر منذ تفعيل القانون رقم 22 لسنة 2021.
            صاحب العمل ملزم بتوفيره، لكن كثيراً من الموظفين يختارون ترقية مستوى التغطية على حسابهم الخاص.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>المستوى</th><th>التغطية الرئيسية</th><th>سقف التغطية</th><th>السعر التقديري / فرد / سنة</th></tr>
            </thead>
            <tbody>
              <tr><td>أساسي (Law 22)</td><td>طوارئ، عيادات مختارة</td><td>30,000 ر.ق</td><td>800–1,500 ر.ق</td></tr>
              <tr><td>قياسي</td><td>طب عام، تخصصي، أدوية</td><td>150,000 ر.ق</td><td>1,500–3,500 ر.ق</td></tr>
              <tr><td>مميز</td><td>شامل محلي + إقليمي + أسنان</td><td>300,000 ر.ق</td><td>3,500–7,000 ر.ق</td></tr>
              <tr><td>عالمي</td><td>كامل محلياً ودولياً</td><td>500,000 ر.ق</td><td>7,000–18,000 ر.ق</td></tr>
            </tbody>
          </table>

          <h3>كيف يؤثر العمر على سعر التأمين الصحي في قطر</h3>
          <table className="calc-editorial-table">
            <thead>
              <tr><th>الفئة العمرية</th><th>معامل التسعير</th><th>مثال (مستوى قياسي)</th></tr>
            </thead>
            <tbody>
              <tr><td>18 – 30 سنة</td><td>×1.0 (أساسي)</td><td>1,500–3,500 ر.ق</td></tr>
              <tr><td>31 – 40 سنة</td><td>×1.3</td><td>1,950–4,550 ر.ق</td></tr>
              <tr><td>41 – 50 سنة</td><td>×1.9</td><td>2,850–6,650 ر.ق</td></tr>
              <tr><td>51 – 60 سنة</td><td>×2.7</td><td>4,050–9,450 ر.ق</td></tr>
              <tr><td>60+ سنة</td><td>×3.8</td><td>5,700–13,300 ر.ق</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح لاختيار التأمين الصحي المناسب في قطر</h3>
          <ul className="calc-tip-list">
            <li>تحقق من شبكة المستشفيات في الوثيقة — المستوى الأساسي قد لا يشمل مستشفيات كبرى مثل سيدرز سيناي أو سيول ميديكال.</li>
            <li>للمستوى العالمي: تأكد من شمول مستشفى حمد الطبي وهاملين أو بيوتيفول هورايزون.</li>
            <li>إذا كان صاحب العمل يوفر التأمين الأساسي، يمكنك دفع الفرق للترقية — سعل الفارق عادةً أقل من الإنشاء من جديد.</li>
            <li>مقارنة QLM وGIG والشركات الأخرى مهمة — الفرق في السعر بين شركتين لنفس المستوى يصل إلى 30%.</li>
            <li>للعائلات: بعض شركات التأمين تمنح خصماً للعائلات الكبيرة (أكثر من 4 أفراد).</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن التأمين الصحي في قطر">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </>
  );
}
