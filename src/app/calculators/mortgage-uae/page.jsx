import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import UaeMortgageCalculator from '@/components/calculators/UaeMortgageCalculator.client';

const SLUG = 'mortgage-uae';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة التمويل العقاري الإمارات — القسط الشهري وقدرة الاقتراض',
  description:
    'احسب قسط الرهن العقاري أو تمويل المنزل في الإمارات (دبي وأبوظبي) حسب LTV وDBR الإماراتي. وضعي مقيم / مواطن / منزل ثانٍ. مجاناً وبدون تسجيل.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة الرهن العقاري الإمارات — دبي وأبوظبي',
    description: 'قدّر قسطك الشهري أو أقصى تمويل يعطيك إياه البنك في الإمارات.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'ما هو الحد الأقصى لنسبة التمويل (LTV) في الإمارات؟',
    answer:
      'وفق تعليمات البنك المركزي الإماراتي: المقيم (أجنبي) للمنزل الأول أقل من 5 ملايين درهم = 80% LTV (دفعة أولى 20%). المواطن الإماراتي = 85% LTV. للعقارات فوق 5 ملايين = 70% LTV. المنزل الثاني أو الاستثماري = 65% LTV. غير المقيم = 50% LTV.',
  },
  {
    question: 'ما هو حد DBR في الإمارات؟',
    answer:
      'يحدد البنك المركزي الإماراتي نسبة عبء الدين بـ 50% من الراتب — أي مجموع جميع أقساطك الشهرية (قرض السيارة + بطاقات الائتمان + الرهن العقاري) لا يتجاوز نصف راتبك. هذا أعلى من حد ساما السعودي البالغ 33%.',
  },
  {
    question: 'ما هي مدة التمويل العقاري القصوى في الإمارات؟',
    answer:
      'الحد الأقصى للمدة هو 25 سنة وفق تعليمات البنك المركزي الإماراتي. يجب أن ينتهي التمويل قبل بلوغ المقترض 65 سنة (للوظيفة الحكومية) أو 70 سنة (لأصحاب الأعمال).',
  },
  {
    question: 'ما الفرق بين معدل EIBOR الثابت والمتغير في الإمارات؟',
    answer:
      'المعدل الثابت (Fixed Rate) يبقى محدداً لفترة 1–5 سنوات ثم يتحول لمتغير. المعدل المرتبط بـ EIBOR (Emirates Interbank Offered Rate) يتغير شهرياً. في بيئة ارتفاع الفائدة (2024)، كثير من المقترضين يفضلون الثابت للسنوات الأولى.',
  },
  {
    question: 'هل يمكن للأجانب (المقيمين وغير المقيمين) شراء عقارات في الإمارات؟',
    answer:
      'نعم، في مناطق التملك الحر (Freehold) مثل دبي مارينا وداون تاون ودبي هيلز والسعديات. المقيم يحصل على 80% LTV والغير مقيم على 50%. العقارات خارج مناطق التملك الحر للمواطنين فقط.',
  },
  {
    question: 'ما هي التكاليف الإضافية عند شراء عقار في الإمارات؟',
    answer:
      'رسوم تسجيل دبي لاند: 4% من سعر العقار. رسوم التقييم: 2,500–3,500 درهم. رسوم معالجة القرض: 1% من قيمة التمويل (بحد أقصى 10,000 درهم). تأمين الحياة الرهني: 0.2–0.4% سنوياً. احسب 5–7% تكاليف إضافية فوق سعر العقار.',
  },
  {
    question: 'هل يمكن السداد المبكر للرهن العقاري في الإمارات؟',
    answer:
      'نعم، لكن معظم البنوك تفرض رسوم سداد مبكر = 1–3% من المبلغ المسدد أو 3 أشهر فائدة أيهما أقل. بعض البنوك تسمح بدفع 10–25% سنوياً بدون رسوم. تحقق من شروط البنك قبل التوقيع.',
  },
  {
    question: 'ما الوثائق المطلوبة للتمويل العقاري في الإمارات؟',
    answer:
      'جواز سفر + تأشيرة إقامة سارية، كشف راتب 3–6 أشهر، كشف حساب بنكي 6 أشهر، عقد العمل أو الترخيص التجاري للعمل الحر، اتفاقية البيع الأولية للعقار، تقرير الائتمان من Al Etihad Credit Bureau (AECB).',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر نوع الحساب', text: 'اختر بين "القسط الشهري" (تعرف سعر العقار) أو "قدرة الاقتراض" (تحسب من الراتب).' },
  { name: 'أدخل السعر أو الراتب', text: 'أدخل سعر العقار في وضع القسط، أو راتبك والتزاماتك الشهرية في وضع القدرة.' },
  { name: 'اختر نوع المقترض والعقار', text: 'حدد وضعك: مقيم أجنبي / مواطن إماراتي / منزل ثانٍ / غير مقيم — يؤثر على نسبة LTV وبالتالي الدفعة الأولى.' },
  { name: 'ضبط معدل الفائدة والمدة', text: 'حرك المنزلق للفائدة (متوسط السوق 4–6.5%) واختر المدة من 5 إلى 25 سنة.' },
  { name: 'راجع القسط والتكاليف الإجمالية', text: 'الحاسبة تعرض القسط الشهري، الدفعة الأولى الدنيا، إجمالي الفائدة، وتأثير تغيير السعر على القسط.' },
];

export default function MortgageUaePage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة التمويل العقاري الإمارات', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة التمويل العقاري الإمارات',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED' },
    description: 'حاسبة قسط الرهن العقاري وقدرة الاقتراض في الإمارات مع LTV وDBR الإماراتي.',
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
    name: 'كيف تستخدم حاسبة التمويل العقاري الإمارات',
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
        badge="🇦🇪 الإمارات"
        title="حاسبة التمويل العقاري الإمارات"
        description="احسب قسطك الشهري أو اعرف كم يعطيك البنك بناءً على راتبك — مع LTV وDBR الإماراتي ومقارنة تأثير الفائدة. لدبي وأبوظبي والشارقة وسائر الإمارات."
        highlights={[
          { label: 'LTV حسب نوع المقترض', desc: 'مقيم / مواطن / منزل ثانٍ / غير مقيم' },
          { label: 'وضع القدرة والاقتراض', desc: 'كم أستطيع اقتراض براتبي؟ مع DBR 50%' },
          { label: 'مقارنة الفائدة', desc: 'ماذا يحدث للقسط عند رفع أو خفض 1%؟' },
          { label: 'AED — درهم إماراتي', desc: 'أرقام بالدرهم مع دفعة أولى ومجموع مدفوعات' },
        ]}
      />

      <CalculatorSection
        id="tool"
        eyebrow="حاسبة التمويل العقاري"
        title="احسب قسطك أو قدرتك الشرائية"
      >
        <UaeMortgageCalculator />
      </CalculatorSection>

      {/* Editorial: LTV guide */}
      <CalculatorSection
        id="ltv-guide"
        eyebrow="دليل LTV"
        title="قواعد التمويل العقاري في الإمارات — ماذا يقول البنك المركزي؟"
      >
        <div className="calc-editorial-body">
          <p>
            يُنظّم البنك المركزي الإماراتي (CBUAE) سوق الرهن العقاري عبر نسب LTV (Loan-to-Value)
            تختلف بحسب نوع المقترض وقيمة العقار والاستخدام. فهم هذه النسب يحدد حجم الدفعة الأولى
            التي تحتاجها ويؤثر مباشرة على القسط الشهري.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr>
                <th>نوع المقترض / العقار</th>
                <th>أقصى LTV</th>
                <th>أدنى دفعة أولى</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>مقيم أجنبي — منزل أول (≤ 5M د.إ)</td>
                <td>80%</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>مواطن إماراتي — منزل أول (≤ 5M د.إ)</td>
                <td>85%</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>{'منزل أول (> 5M د.إ)'}</td>
                <td>70%</td>
                <td>30%</td>
              </tr>
              <tr>
                <td>منزل ثانٍ / استثماري</td>
                <td>65%</td>
                <td>35%</td>
              </tr>
              <tr>
                <td>غير مقيم</td>
                <td>50%</td>
                <td>50%</td>
              </tr>
            </tbody>
          </table>

          <h3>نسبة DBR في الإمارات — 50% وليس 33%</h3>
          <p>
            الفارق الجوهري بين الإمارات والسعودية: البنك المركزي الإماراتي يسمح بتخصيص 50% من الراتب
            لخدمة الديون مقابل 33% في ساما السعودية. هذا يعني أن راتباً بـ 20,000 درهم يتيح قسطاً
            شهرياً يصل إلى 10,000 درهم (بعد خصم الالتزامات القائمة).
          </p>

          <h3>5 نصائح للتمويل العقاري في الإمارات</h3>
          <ul className="calc-tip-list">
            <li>تحقق من تقرير Al Etihad Credit Bureau (AECB) قبل التقدم — درجة الائتمان تؤثر على الفائدة والموافقة.</li>
            <li>احجز الموافقة المبدئية (Pre-Approval) قبل التعاقد — تُثبّت لك السعر لـ 60–90 يوماً في بعض البنوك.</li>
            <li>لا تنسَ تكاليف التسجيل: 4% رسوم دبي لاند + 1% رسوم قرض + تأمين حياة = 5–7% إضافية فوق سعر العقار.</li>
            <li>قارن بين الفائدة الثابتة (3–5 سنوات) والمرتبطة بـ EIBOR. في 2024 بعض البنوك تقدم 4.2% ثابتة لـ 3 سنوات وهو جذاب.</li>
            <li>فكر في صناديق الرهن الإسلامي (المرابحة / الإجارة) كبديل مشروع — النتيجة المالية مشابهة لكن الهيكل يختلف.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن التمويل العقاري في الإمارات"
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
