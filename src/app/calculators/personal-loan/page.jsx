import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import PersonalLoanCalculator from '@/components/calculators/PersonalLoanCalculator.client';

const SLUG = 'personal-loan';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة القرض الشخصي — كم أستطيع اقتراض براتبي (السعودية والإمارات)',
  description:
    'احسب قسط قرضك الشهري أو أقصى مبلغ يمكنك اقتراضه من راتبك حسب حدود ساما (33% DBR) والبنك المركزي الإماراتي (50% DBR). السعودية والإمارات. مجاناً.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة القرض الشخصي — السعودية والإمارات',
    description: 'كم أستطيع اقتراض براتبي؟ احسب أقصى قرض حسب DBR الرسمي في السعودية والإمارات.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'كم أستطيع اقتراض براتبي في السعودية؟',
    answer:
      'ساما تحدد حد DBR بـ 33% من الراتب — أي أن مجموع جميع أقساطك الشهرية لا يتجاوز ثلث راتبك. الحد الأقصى الإجمالي هو 60 ضعف الراتب الشهري. مثال: راتب 10,000 ر.س بدون التزامات → أقصى قسط = 3,333 ر.س → أقصى قرض لـ 60 شهراً بـ 7% = نحو 167,000 ر.س.',
  },
  {
    question: 'كم أستطيع اقتراض براتبي في الإمارات؟',
    answer:
      'البنك المركزي الإماراتي يضع حد DBR بـ 50% من الراتب. أيضاً القروض الشخصية غير المضمونة لها حد أقصى 250,000 درهم. مثال: راتب 15,000 د.إ بدون التزامات → أقصى قسط = 7,500 د.إ → أقصى قرض لـ 60 شهراً بـ 8% = نحو 250,000 د.إ (يطبق السقف).',
  },
  {
    question: 'ما الفرق بين DBR في السعودية والإمارات؟',
    answer:
      'السعودية (ساما): 33% من الراتب + قيد إضافي بـ 60× الراتب الشهري. الإمارات (CBUAE): 50% من الراتب + سقف 250,000 درهم للقروض غير المضمونة. الإمارات أكثر مرونة في نسبة الراتب لكن لها سقف مطلق للقروض غير المضمونة.',
  },
  {
    question: 'ما معدل الفائدة الطبيعي للقرض الشخصي في السعودية؟',
    answer:
      'المتوسط في 2024 بين 5 – 9% سنوياً حسب البنك وتصنيف العميل وجهة الراتب. موظفو القطاع الحكومي والشركات الكبرى يحصلون عادةً على أسعار أفضل. بعض البنوك الإسلامية تعرض هامش مرابحة يتراوح بين 5.5 – 8%.',
  },
  {
    question: 'ما معدل الفائدة الطبيعي للقرض الشخصي في الإمارات؟',
    answer:
      'المتوسط في 2024 بين 6 – 12% سنوياً. العملاء ذوو الجهات المحولة لبنوك كبيرة (ENBD, FAB, ADCB) يحصلون على أسعار أفضل. سعر الفائدة مرتبط جزئياً بـ EIBOR في القروض المتغيرة.',
  },
  {
    question: 'هل هناك رسوم إضافية على القروض الشخصية؟',
    answer:
      'نعم عادةً: رسوم معالجة 1–2% من مبلغ القرض، تأمين حياة إجباري 0.3–0.5% سنوياً، رسوم سداد مبكر 1–3% من المبلغ المتبقي. احسب هذه الرسوم عند مقارنة العروض لمعرفة التكلفة الإجمالية الحقيقية.',
  },
  {
    question: 'متى أحتاج ضمانات للقرض الشخصي في الإمارات؟',
    answer:
      'القروض فوق 250,000 درهم تستلزم عادةً ضمانات أو راتباً مرتفعاً جداً. أيضاً غير المقيمين وأصحاب الأعمال الحرة أحياناً يُطلب منهم ضمانات. الموظفون بجهات مؤهلة يحصلون على قروض غير مضمونة بشكل أسهل.',
  },
  {
    question: 'هل تؤثر الديون القائمة على قدرة الاقتراض؟',
    answer:
      'نعم — كل قسط شهري تسدده (قرض سيارة، بطاقة ائتمان، قرض سابق) يُطرح من حد DBR المتاح. إذا كانت التزاماتك تستنفد 20% من راتبك مثلاً، تبقى 13% فقط في السعودية (33%-20%) أو 30% في الإمارات (50%-20%) للقرض الجديد.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر الدولة', text: 'السعودية (ساما 33% DBR) أو الإمارات (CBUAE 50% DBR). كل دولة لها قواعد احتساب مختلفة.' },
  { name: 'اختر نوع الحساب', text: '"القسط الشهري" إذا عندك مبلغ محدد تريد معرفة قسطه، أو "كم أستطيع اقتراض" لحساب أقصى قرض من راتبك.' },
  { name: 'أدخل المبلغ أو الراتب', text: 'في وضع القسط أدخل مبلغ القرض. في وضع القدرة أدخل راتبك والتزاماتك الشهرية القائمة.' },
  { name: 'ضبط الفائدة والمدة', text: 'حرك منزلق الفائدة وحدد المدة. الحاسبة تطبق حدود ساما أو CBUAE تلقائياً.' },
  { name: 'راجع النتيجة', text: 'تظهر القسط الشهري وإجمالي الفائدة وتنبيه إذا تجاوزت حدود DBR أو سقف القرض غير المضمون.' },
];

export default function PersonalLoanPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة القرض الشخصي', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة القرض الشخصي',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
    description: 'حاسبة القرض الشخصي للسعودية والإمارات مع حدود DBR وقدرة الاقتراض من الراتب.',
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
    name: 'كيف تستخدم حاسبة القرض الشخصي',
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
        badge="السعودية · الإمارات"
        title="حاسبة القرض الشخصي"
        description="احسب قسط قرضك الشهري أو اعرف أقصى مبلغ يمكنك اقتراضه براتبك — مع تطبيق تلقائي لحدود ساما (33% DBR) في السعودية وBCUAE (50% DBR) في الإمارات."
        highlights={[
          { label: 'DBR تلقائي', desc: 'ساما 33% للسعودية · CBUAE 50% للإمارات' },
          { label: 'وضع قدرة الاقتراض', desc: 'كم أستطيع اقتراض براتب X مع التزامات Y؟' },
          { label: 'سقف 250,000 د.إ', desc: 'تنبيه عند تجاوز حد القرض غير المضمون بالإمارات' },
          { label: 'مقارنة السعودية والإمارات', desc: 'قيّم الفارق في قدرة الاقتراض بين البلدين' },
        ]}
      />

      <CalculatorSection
        id="tool"
        eyebrow="حاسبة القرض الشخصي"
        title="القسط الشهري أو أقصى قرض من الراتب"
      >
        <PersonalLoanCalculator />
      </CalculatorSection>

      {/* Editorial */}
      <CalculatorSection
        id="dbr-guide"
        eyebrow="دليل DBR"
        title="قواعد الاقتراض — ساما مقابل CBUAE"
      >
        <div className="calc-editorial-body">
          <p>
            قبل الموافقة على أي قرض شخصي، يتحقق البنك من نسبة عبء الدين (Debt Burden Ratio).
            هذه النسبة تحدد كم من راتبك يمكن تخصيصه لسداد الأقساط — والرقم يختلف بين دولة وأخرى.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr>
                <th>الجهة</th>
                <th>حد DBR</th>
                <th>قيود إضافية</th>
                <th>الحد الأقصى للمدة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ساما (السعودية)</td>
                <td>33% من الراتب</td>
                <td>أقصى 60 ضعف الراتب الشهري</td>
                <td>60 شهراً (5 سنوات)</td>
              </tr>
              <tr>
                <td>CBUAE (الإمارات)</td>
                <td>50% من الراتب</td>
                <td>سقف 250,000 درهم للقروض غير المضمونة</td>
                <td>48 شهراً للقروض السريعة / أطول للمضمونة</td>
              </tr>
            </tbody>
          </table>

          <h3>مثال تطبيقي: راتب 15,000</h3>
          <ul className="calc-tip-list">
            <li><strong>في السعودية (ساما):</strong> أقصى قسط = 15,000 × 33% = 4,950 ر.س/شهر. مع فائدة 7% لـ 60 شهراً = أقصى قرض ≈ 250,000 ر.س.</li>
            <li><strong>في الإمارات (CBUAE):</strong> أقصى قسط = 15,000 × 50% = 7,500 د.إ/شهر. لكن السقف 250,000 د.إ يطبق — هو الحد الفعلي.</li>
          </ul>

          <h3>5 نصائح قبل التقدم لقرض شخصي</h3>
          <ul className="calc-tip-list">
            <li>تحقق من تقرير سمة (السعودية) أو AECB (الإمارات) قبل التقدم — درجة الائتمان تؤثر على الموافقة والسعر.</li>
            <li>اجمع عروض 3 بنوك على الأقل وقارن APR الفعلي (سعر + رسوم) لا الفائدة الاسمية وحدها.</li>
            <li>انتبه لتأمين الحياة الإلزامي — يُضيف 0.3–0.5% سنوياً للتكلفة الفعلية.</li>
            <li>احسب إمكانية السداد المبكر إذا توقعت تحسناً مالياً — بعض البنوك تقبل 25% سنوياً بدون رسوم.</li>
            <li>تجنب فتح أكثر من طلب واحد في وقت واحد — كل استفسار ائتماني يؤثر مؤقتاً على درجتك.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن القرض الشخصي"
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
