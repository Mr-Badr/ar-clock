import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import QatarPersonalLoanCalculator from '@/components/calculators/QatarPersonalLoanCalculator.client';

const SLUG = 'personal-loan-qatar';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة القرض الشخصي قطر — القسط الشهري وقدرة الاقتراض QCB',
  description:
    'احسب قسط قرضك الشخصي أو أقصى مبلغ تستطيع اقتراضه في قطر وفق مصرف قطر المركزي (QCB). DBR 50% للجميع، 2M ر.ق قطريين، 400K وافدين. مجاناً.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة القرض الشخصي قطر',
    description: 'قسط قرضك الشهري أو أقصى مبلغ تقترضه في قطر. DBR 50%، 10 سنوات قطريين، 4 سنوات وافدين.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'ما هو حد DBR للقرض الشخصي في قطر؟',
    answer:
      'مصرف قطر المركزي (QCB) يحدد الحد الأقصى لنسبة تحمّل الدين بـ 50% من صافي الراتب للقروض الشخصية، وهو نفسه للقطريين والوافدين على حدٍّ سواء. هذه النسبة أعلى مما هو معمول به في السعودية (33%) والكويت (30-40%).',
  },
  {
    question: 'ما الفرق بين الحد الأقصى للقرض للقطريين والوافدين؟',
    answer:
      'القطريون: يمكنهم اقتراض حتى 2,000,000 ريال قطري بمدة تصل إلى 10 سنوات وبحد أدنى راتب 5,000 ريال. الوافدون: الحد الأقصى 400,000 ريال (وقد يصل إلى مليون لموظفي الجهات الحكومية)، بمدة تصل إلى 4 سنوات، وبحد أدنى راتب 3,000 ريال.',
  },
  {
    question: 'ما معدلات الفائدة على القروض الشخصية في قطر؟',
    answer:
      'تتراوح المعدلات في البنوك القطرية بين 4.8% و7% للقطريين، وبين 5.5% و8% للوافدين سنوياً. البنك التجاري القطري (CBQ) يقدم معدلاً ثابتاً من 2.67% للقطريين (APR ~4.81%) و3.10% للوافدين (APR ~5.75%).',
  },
  {
    question: 'هل يُشترط تحويل الراتب للحصول على قرض شخصي في قطر؟',
    answer:
      'نعم، معظم البنوك القطرية تشترط تحويل الراتب إلى الحساب لديهم كشرط أساسي للحصول على القرض. بعض البنوك الإسلامية تقدم بدائل مرابحة بدون اشتراط التحويل في حالات معينة.',
  },
  {
    question: 'كيف تقارن قطر مع دول الخليج الأخرى في شروط القروض الشخصية؟',
    answer:
      'قطر: DBR 50%، قطري 2M ريال/10 سنوات، وافد 400K ريال/4 سنوات. الإمارات: DBR 50%، حد 250K درهم (غير مضمون)، 7 سنوات. الكويت: DBR 40%/30%، حد 70K/15K دينار، 5 سنوات. السعودية: DBR 33%، حد 60 مرة الراتب، 5 سنوات.',
  },
  {
    question: 'هل يمكن للوافد غير المقيم الحصول على قرض شخصي في قطر؟',
    answer:
      'لا. القروض الشخصية في قطر متاحة للمقيمين فقط (قطريون أو أصحاب إقامة سارية). يشترط معظم البنوك مدة خدمة مستمرة مع صاحب العمل لا تقل عن 6-12 شهراً.',
  },
  {
    question: 'ما الفرق بين القرض التقليدي والتمويل الإسلامي في قطر؟',
    answer:
      'التمويل الإسلامي (مرابحة/تورق): البنك يشتري سلعة ويبيعها للعميل بربح محدد مسبقاً — التكلفة الإجمالية مشابهة للقرض بنفس المعدل لكن يمكن الإقفال المبكر بدون غرامة في بعض المنتجات. كلا النوعين مقيد بحدود QCB ذاتها.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'الحاسبة تعمل وفق حدود مصرف قطر المركزي المعلنة. الأرقام تقديرية — البنوك لها معايير ائتمانية إضافية. احصل على موافقة مبدئية من البنك قبل التخطيط على أساس هذه الأرقام.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر نوع المقترض', text: 'قطري (حد 2M ريال / 10 سنوات) أو وافد (حد 400K ريال / 4 سنوات) — يؤثر على الحد الأقصى والمدة.' },
  { name: 'اختر وضع الحساب', text: '"القسط الشهري" لمبلغ محدد، أو "قدرة الاقتراض" لمعرفة أقصى مبلغ من راتبك.' },
  { name: 'أدخل البيانات', text: 'مبلغ القرض (أو الراتب وأقساطك الحالية)، معدل الفائدة، والمدة.' },
  { name: 'راجع النتيجة', text: 'الحاسبة تعرض القسط الشهري، إجمالي التكلفة، ونسبة DBR المستخدمة مع مقارنة دول الخليج.' },
];

export default function PersonalLoanQatarPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة القرض الشخصي قطر', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة القرض الشخصي قطر',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'QAR' },
    description: 'حاسبة القرض الشخصي في قطر — القسط الشهري وقدرة الاقتراض وفق حدود مصرف قطر المركزي QCB.',
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
    name: 'كيف تستخدم حاسبة القرض الشخصي قطر',
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
        badge="🇶🇦 قطر"
        title="حاسبة القرض الشخصي قطر"
        description="احسب قسطك الشهري أو أقصى مبلغ تستطيع اقتراضه في قطر وفق حدود مصرف قطر المركزي (QCB). يحسب DBR 50% تلقائياً مع مقارنة الوافد والقطري."
        highlights={[
          { label: 'DBR 50% للجميع', desc: 'قطري ووافد — أعلى من الكويت والسعودية' },
          { label: 'وضعان', desc: 'قسط شهري أو قدرة اقتراض من الراتب' },
          { label: 'الفرق واضح', desc: '2M ر.ق / 10 سنوات قطريين — 400K / 4 سنوات وافدين' },
          { label: 'مقارنة خليجية', desc: 'قطر vs الإمارات vs الكويت vs السعودية' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة القرض" title="احسب قرضك الشخصي في قطر">
        <QatarPersonalLoanCalculator />
      </CalculatorSection>

      <CalculatorSection
        id="guide"
        eyebrow="دليل الاقتراض"
        title="القرض الشخصي في قطر — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            ينظّم مصرف قطر المركزي (QCB) سوق الإقراض الشخصي بضوابط تميّز بين القطريين والوافدين
            في الحد الأقصى والمدة، مع الإبقاء على نفس نسبة DBR 50% للطرفين.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>المعيار</th><th>قطري</th><th>وافد</th></tr>
            </thead>
            <tbody>
              <tr><td>حد DBR</td><td>50% من الراتب</td><td>50% من الراتب</td></tr>
              <tr><td>الحد الأقصى للقرض</td><td>2,000,000 ريال قطري</td><td>400,000 ريال (1M لحكومي)</td></tr>
              <tr><td>الحد الأقصى للمدة</td><td>10 سنوات (120 شهراً)</td><td>4 سنوات (48 شهراً)</td></tr>
              <tr><td>الحد الأدنى للراتب</td><td>5,000 ريال</td><td>3,000 ريال</td></tr>
              <tr><td>تحويل الراتب</td><td>مطلوب عادةً</td><td>إلزامي في معظم البنوك</td></tr>
            </tbody>
          </table>

          <h3>مقارنة حدود الاقتراض في دول الخليج</h3>
          <table className="calc-editorial-table">
            <thead>
              <tr><th>الدولة</th><th>الجهة</th><th>DBR</th><th>الحد (مواطن)</th><th>الحد (وافد)</th></tr>
            </thead>
            <tbody>
              <tr><td>🇶🇦 قطر</td><td>QCB</td><td>50%</td><td>2,000,000 ريال / 10 سنوات</td><td>400,000 ريال / 4 سنوات</td></tr>
              <tr><td>🇦🇪 الإمارات</td><td>CBUAE</td><td>50%</td><td>—</td><td>250,000 درهم / 7 سنوات</td></tr>
              <tr><td>🇰🇼 الكويت</td><td>CBK</td><td>40%</td><td>70,000 دينار / 5 سنوات</td><td>15,000 دينار / 5 سنوات</td></tr>
              <tr><td>🇸🇦 السعودية</td><td>ساما</td><td>33%</td><td>60× الراتب / 5 سنوات</td><td>نفس الشروط</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح قبل التقدم لقرض شخصي في قطر</h3>
          <ul className="calc-tip-list">
            <li>تحقق من سجلك في <strong>QCB Credit Bureau</strong> قبل التقدم — الديون المتأخرة تُقلّل فرص الموافقة.</li>
            <li>قارن المعدل الفعلي (APR) لا المعلن — رسوم الإدارة والتأمين تُضاف على بعض القروض.</li>
            <li>للوافدين: تأكد أن إقامتك سارية طوال فترة القرض — انتهاؤها يُعرّضك لإشكاليات مع البنك.</li>
            <li>القروض الإسلامية (مرابحة) مناسبة إذا أردت السداد المبكر — معظمها بدون غرامة إقفال مبكر.</li>
            <li>لا تقترض الحد الأقصى — اقترض ما تحتاجه فعلاً، ومدة أقصر تعني فائدة أقل.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن القروض الشخصية في قطر">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </>
  );
}
