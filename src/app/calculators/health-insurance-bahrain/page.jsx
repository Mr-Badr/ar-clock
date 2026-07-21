import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import BahrainHealthInsuranceCalculator from '@/components/calculators/BahrainHealthInsuranceCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';

const SLUG = 'health-insurance-bahrain';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة التأمين الصحي البحرين — أسعار الوافدين والعائلات بالدينار البحريني',
  description:
    'قدّر تكلفة التأمين الصحي التكميلي في البحرين فوق برنامج سيهاتي الإلزامي، حسب مستوى التأمين والعمر وعدد الأشخاص. أرقام بالدينار البحريني.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة التأمين الصحي البحرين',
    description: 'تكلفة التأمين الصحي التكميلي في البحرين للوافدين — 4 مستويات من الأساسي إلى العالمي. أرقام بالدينار البحريني.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل التأمين الصحي إلزامي في البحرين؟',
    answer:
      'نعم. القرار رقم 23 لسنة 2018 (نافذ منذ 1 يناير 2019) أسّس برنامج سيهاتي الوطني، ويُلزم أصحاب العمل بتسجيل موظفيهم الوافدين ضمن التغطية الأساسية عبر رسوم تصريح العمل. المخالفون يواجهون عقوبات تصل إلى 50,000 دينار بحريني.',
  },
  {
    question: 'ما الذي يغطيه برنامج سيهاتي الأساسي؟',
    answer:
      'الرعاية الأولية في المراكز الصحية الحكومية، خدمات الطوارئ، إصابات الحوادث، وعلاج الحالات الحادة والأدوية الجنيسة، بحد أقصى سنوي 1,500 دينار بحريني. لا يشمل عادة طب الأسنان والبصريات والولادة (فترة انتظار 10-12 شهراً) والصحة النفسية والعلاج الطبيعي.',
  },
  {
    question: 'ما مستويات التأمين الصحي التكميلي في البحرين؟',
    answer:
      'أساسي: تغطية محلية محدودة فوق سيهاتي، 200-400 دينار/سنة. قياسي: شبكة أوسع وأدوية جزئية، 400-800 دينار. مميز: مستشفيات خاصة كبرى وأسنان وبصريات، 800-1,500 دينار. عالمي: تغطية محلية ودولية شاملة، 1,500-4,000 دينار.',
  },
  {
    question: 'ما أبرز شركات التأمين الصحي في البحرين؟',
    answer:
      'أبرزها: Bupa Middle East، AXA Gulf البحرين، Gulf Union Insurance، Al Ahlia Insurance، National Insurance Company (NIC)، GIG Gulf البحرين، وCigna Global للتغطية الدولية.',
  },
  {
    question: 'هل يؤثر العمر على سعر التأمين الصحي في البحرين؟',
    answer:
      'نعم بشكل كبير. معامل التسعير يرتفع مع العمر: 18-30 (المعامل ×1)، 31-40 (×1.3)، 41-50 (×1.85)، 51-60 (×2.6)، 60+ (×3.6). الفئات 51+ قد تتطلب فحصاً طبياً مسبقاً من بعض شركات التأمين.',
  },
  {
    question: 'ما هي تكلفة التأمين الصحي التكميلي للعائلة في البحرين؟',
    answer:
      'عائلة من 4 أشخاص (المستوى القياسي): 1,600-3,200 دينار سنوياً تقريباً. المستوى المميز: 3,200-6,000 دينار تقريباً. هذه تقديرات للعائلة بمؤمَّن رئيسي في عمر 31-40، والأسعار الفعلية قد تنخفض مع خصومات عائلية من بعض الشركات.',
  },
  {
    question: 'هل التأمين التكميلي ضروري إذا كان لدي سيهاتي؟',
    answer:
      'سيهاتي الأساسي مخصص للطوارئ والرعاية الأولية الحكومية فقط، ولا يشمل غالباً طب الأسنان أو الولادة أو الرعاية الخاصة. لهذا يلجأ معظم الوافدين والعائلات إلى تأمين تكميلي خاص لتغطية هذه الفجوات.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'هي تقديرات استرشادية من السوق البحريني للتأمين التكميلي الخاص (Bupa، AXA Gulf، GIG Gulf وغيرها)، وليست تسعيرة رسمية من الحكومة. الأسعار الفعلية تختلف بين شركات التأمين وتتأثر بعوامل إضافية (المهنة، التاريخ الطبي). احصل على عرض رسمي مباشرةً من الشركة.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر مستوى التأمين', text: 'من الأساسي التكميلي فوق سيهاتي إلى العالمي الشامل.' },
  { name: 'حدد عدد المؤمَّن عليهم', text: 'فرد أو عائلة — الأطفال والمعالون يُضافون بتكلفة أقل.' },
  { name: 'أدخل عمر المؤمَّن الرئيسي', text: 'العمر يؤثر على السعر — الفئة 51+ تدفع ما يصل إلى 3.6× المعدل الأساسي.' },
  { name: 'حدد الحالات المزمنة', text: 'وجود أمراض مزمنة (سكري، قلب) يرفع القسط بحوالي 30%.' },
  { name: 'راجع التقدير', text: 'الحاسبة تعرض نطاق السعر السنوي والشهري مع مقارنة المستويات الأربعة.' },
];

export default function HealthInsuranceBahrainPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة التأمين الصحي البحرين', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة التأمين الصحي البحرين',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BHD' },
    description: 'حاسبة تكلفة التأمين الصحي التكميلي في البحرين للوافدين والعائلات بالدينار البحريني.',
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
    name: 'كيف تستخدم حاسبة التأمين الصحي البحرين',
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
        badge={<><CountryFlag code="bh" /> البحرين</>}
        title="حاسبة التأمين الصحي البحرين"
        description="قدّر تكلفة تأمينك الصحي التكميلي في البحرين فوق برنامج سيهاتي الإلزامي — للأفراد والعائلات والوافدين — وفق المستوى المطلوب والعمر وعدد الأشخاص. أرقام استرشادية بالدينار البحريني."
        highlights={[
          { label: '4 مستويات تأمين', desc: 'من الأساسي التكميلي إلى العالمي الشامل' },
          { label: 'معامل العمر تلقائي', desc: 'الفئة 51+ تدفع حتى 3.6× المعدل الأساسي' },
          { label: 'مقارنة المستويات', desc: 'رسم بياني يوضح الفرق بين الخطط الأربع' },
          { label: 'BHD — دينار بحريني', desc: 'أرقام سنوية وشهرية للفرد والعائلة' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة التأمين" title="قدّر تكلفة تأمينك الصحي التكميلي في البحرين">
        <BahrainHealthInsuranceCalculator />
      </CalculatorSection>

      <CalculatorSection
        id="guide"
        eyebrow="دليل التأمين"
        title="التأمين الصحي في البحرين — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            أسّس القرار رقم 23 لسنة 2018 برنامج سيهاتي الوطني للتأمين الصحي في البحرين، وهو نافذ منذ
            1 يناير 2019. يُلزم صاحب العمل بتسجيل موظفيه الوافدين ضمن التغطية الأساسية عبر رسوم تصريح
            العمل، وتشرف الهيئة الوطنية لتنظيم المهن والخدمات الصحية (NHRA) على تطبيق البرنامج. المخالفون
            من أصحاب العمل يواجهون عقوبات جنائية ومدنية تصل إلى 50,000 دينار بحريني.
          </p>
          <p>
            التغطية الأساسية لسيهاتي تقتصر على الرعاية الأولية الحكومية والطوارئ وحالات الحوادث والأمراض
            الحادة، بحد أقصى سنوي 1,500 دينار بحريني، ولا تشمل عادة طب الأسنان والبصريات والولادة (فترة
            انتظار 10-12 شهراً) والصحة النفسية والعلاج الطبيعي. لهذا يلجأ معظم الوافدين والعائلات إلى
            تأمين تكميلي خاص — وهو ما تقدّره هذه الحاسبة.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>المستوى</th><th>التغطية الرئيسية</th><th>سقف التغطية</th><th>السعر التقديري / فرد / سنة</th></tr>
            </thead>
            <tbody>
              <tr><td>أساسي (تكميلي)</td><td>شبكة محلية محدودة فوق سيهاتي</td><td>15,000 د.ب</td><td>200–400 د.ب</td></tr>
              <tr><td>قياسي</td><td>طب عام، تخصصي، أدوية جزئية</td><td>50,000 د.ب</td><td>400–800 د.ب</td></tr>
              <tr><td>مميز</td><td>مستشفيات خاصة كبرى + أسنان وبصريات</td><td>150,000 د.ب</td><td>800–1,500 د.ب</td></tr>
              <tr><td>عالمي</td><td>تغطية محلية ودولية شاملة</td><td>750,000 د.ب</td><td>1,500–4,000 د.ب</td></tr>
            </tbody>
          </table>

          <h3>كيف يؤثر العمر على سعر التأمين الصحي في البحرين</h3>
          <table className="calc-editorial-table">
            <thead>
              <tr><th>الفئة العمرية</th><th>معامل التسعير</th><th>مثال (مستوى قياسي)</th></tr>
            </thead>
            <tbody>
              <tr><td>18 – 30 سنة</td><td>×1.0 (أساسي)</td><td>400–800 د.ب</td></tr>
              <tr><td>31 – 40 سنة</td><td>×1.3</td><td>520–1,040 د.ب</td></tr>
              <tr><td>41 – 50 سنة</td><td>×1.85</td><td>740–1,480 د.ب</td></tr>
              <tr><td>51 – 60 سنة</td><td>×2.6</td><td>1,040–2,080 د.ب</td></tr>
              <tr><td>60+ سنة</td><td>×3.6</td><td>1,440–2,880 د.ب</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح لاختيار التأمين الصحي التكميلي في البحرين</h3>
          <ul className="calc-tip-list">
            <li>تحقق أولاً من حدود تغطية سيهاتي الإلزامية قبل شراء أي تأمين تكميلي — كثير من الوافدين يدفعون مقابل تغطية لديهم أصلاً.</li>
            <li>طب الأسنان والولادة والصحة النفسية غالباً غير مشمولة في سيهاتي — تأكد من شمولها في الخطة التكميلية إن كانت أولوية لك.</li>
            <li>للمستوى العالمي: تأكد من شمول الإخلاء الطبي والعلاج خارج البحرين إذا كنت تسافر كثيراً.</li>
            <li>قارن بين Bupa وAXA Gulf وGIG Gulf — الفرق في السعر بين شركتين لنفس المستوى قد يصل إلى 25-30%.</li>
            <li>للعائلات: بعض شركات التأمين تمنح خصماً حقيقياً عند تأمين 4 أفراد أو أكثر ضمن وثيقة واحدة.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن التأمين الصحي في البحرين">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </>
  );
}
