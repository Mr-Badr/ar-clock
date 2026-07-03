import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import KuwaitPersonalLoanCalculator from '@/components/calculators/KuwaitPersonalLoanCalculator.client';

const SLUG = 'personal-loan-kuwait';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة القرض الشخصي الكويت — القسط الشهري وقدرة الاقتراض',
  description:
    'احسب قسط قرضك الشخصي في الكويت أو معرفة أقصى مبلغ تستطيع اقتراضه. يحسب حد DBR (40% كويتي / 30% وافد) تلقائياً. بالدينار الكويتي. مجاناً.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة القرض الشخصي الكويت',
    description: 'قسط قرضك الشهري أو أقصى مبلغ تقترضه في الكويت. DBR 40% كويتي، 30% وافد.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'ما هو الحد الأقصى لنسبة الدين من الراتب (DBR) في الكويت؟',
    answer:
      'بموجب لوائح بنك الكويت المركزي: 40% للمواطنين الكويتيين، و30% للمقيمين من غير الكويتيين. يعني ذلك أن الأقساط الشهرية الإجمالية لا يمكن أن تتجاوز هذه النسبة من صافي الراتب.',
  },
  {
    question: 'ما هو الحد الأقصى لقيمة القرض الشخصي في الكويت؟',
    answer:
      'للكويتيين: لا يتجاوز 15 مرة من الراتب الشهري الصافي أو 70,000 دينار كويتي (أيهما أقل). للوافدين: الحد الأقصى 15,000 دينار كويتي. القرار الأخير يعود للبنك حسب معايير التقييم الخاصة به.',
  },
  {
    question: 'ما هي مدة القرض الشخصي القصوى في الكويت؟',
    answer:
      'وفق تعليمات بنك الكويت المركزي، الحد الأقصى لمدة القرض الشخصي 60 شهراً (5 سنوات). بعض البنوك قد تقدم قروضاً بضمانات بمدد أطول.',
  },
  {
    question: 'ما معدلات الفائدة على القروض الشخصية في الكويت؟',
    answer:
      'تتراوح معدلات الفائدة في البنوك الكويتية بين 5% و9% سنوياً للقروض الشخصية. يعتمد المعدل على تقييم الائتمان، طول فترة القرض، وما إذا كان القرض إسلامياً (مرابحة/مشاركة) أو تقليدياً.',
  },
  {
    question: 'هل يمكن للوافد الحصول على قرض شخصي في الكويت؟',
    answer:
      'نعم، لكن بشروط أكثر صرامة: DBR لا يتجاوز 30%، الحد الأقصى 15,000 دينار، ويشترط معظم البنوك تحويل الراتب وإقامة صالحة ومدة خدمة مع صاحب العمل لا تقل عن 6–12 شهراً.',
  },
  {
    question: 'ما الفرق بين القرض التقليدي والإسلامي في الكويت؟',
    answer:
      'القرض الإسلامي (المرابحة أو التورق): البنك يشتري سلعة ويبيعها للعميل بربح محدد مسبقاً — التكلفة الإجمالية مشابهة لقرض بنفس المعدل. القرض التقليدي: فائدة مركبة. كلاهما مقيد بنفس حدود CBK.',
  },
  {
    question: 'كيف تقارن حدود الاقتراض في الكويت مع الإمارات والسعودية؟',
    answer:
      'الإمارات (CBUAE): DBR 50% للجميع، حد غير مضمون 250,000 درهم. السعودية (ساما): DBR 33%، حد 60 مرة الراتب. الكويت (CBK): DBR 40% كويتي / 30% وافد. الكويت أكثر تساهلاً مع المواطنين مقارنة بالسعودية.',
  },
  {
    question: 'هل هذه الأرقام دقيقة؟',
    answer:
      'الحاسبة تعمل وفق حدود بنك الكويت المركزي المعلنة. الأرقام تقديرية — البنوك لها معايير تقييم إضافية (سجل ائتماني، طبيعة العمل). احصل على موافقة مبدئية رسمية من البنك قبل التخطيط.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر نوع المقترض', text: 'كويتي (DBR 40%, حد 70,000 د.ك) أو وافد (DBR 30%, حد 15,000 د.ك).' },
  { name: 'اختر وضع الحساب', text: '"القسط الشهري" لمبلغ محدد، أو "قدرة الاقتراض" لمعرفة أقصى مبلغ من راتبك.' },
  { name: 'أدخل البيانات', text: 'مبلغ القرض (أو الراتب وأقساطك الحالية)، معدل الفائدة، والمدة.' },
  { name: 'راجع النتيجة', text: 'الحاسبة تعرض القسط الشهري، إجمالي التكلفة، ونسبة DBR المستخدمة.' },
];

export default function PersonalLoanKuwaitPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة القرض الشخصي الكويت', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة القرض الشخصي الكويت',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KWD' },
    description: 'حاسبة القرض الشخصي في الكويت — القسط الشهري وقدرة الاقتراض وفق حدود بنك الكويت المركزي.',
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
    name: 'كيف تستخدم حاسبة القرض الشخصي الكويت',
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
        title="حاسبة القرض الشخصي الكويت"
        description="احسب قسطك الشهري أو اعرف أقصى مبلغ تستطيع اقتراضه في الكويت وفق حدود بنك الكويت المركزي (CBK). يحسب DBR تلقائياً بحسب جنسيتك. بالدينار الكويتي."
        highlights={[
          { label: 'DBR تلقائي', desc: '40% كويتي / 30% وافد — حسب CBK' },
          { label: 'وضعان', desc: 'قسط شهري أو قدرة اقتراض من الراتب' },
          { label: 'حد الوافدين', desc: 'تنبيه تلقائي عند تجاوز 15,000 د.ك' },
          { label: 'KWD — دينار كويتي', desc: 'مقارنة تكلفة الفائدة الإجمالية' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة القرض" title="احسب قرضك الشخصي في الكويت">
        <KuwaitPersonalLoanCalculator />
      </CalculatorSection>

      <CalculatorSection
        id="guide"
        eyebrow="دليل الاقتراض"
        title="القرض الشخصي في الكويت — ما تحتاج معرفته"
      >
        <div className="calc-editorial-body">
          <p>
            يُنظّم بنك الكويت المركزي سوق الإقراض الشخصي من خلال حدود صارمة تختلف بين المواطنين
            والمقيمين الأجانب. الهدف من هذه الحدود حماية المقترضين من الإفراط في الاستدانة.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr><th>المعيار</th><th>كويتي</th><th>وافد</th></tr>
            </thead>
            <tbody>
              <tr><td>حد DBR الشهري</td><td>40% من الراتب</td><td>30% من الراتب</td></tr>
              <tr><td>الحد الأقصى للقرض</td><td>أقل من: 15× الراتب أو 70,000 د.ك</td><td>15,000 د.ك</td></tr>
              <tr><td>الحد الأقصى للمدة</td><td>60 شهراً (5 سنوات)</td><td>60 شهراً (5 سنوات)</td></tr>
              <tr><td>تحويل الراتب</td><td>مطلوب عادةً</td><td>إلزامي في معظم البنوك</td></tr>
            </tbody>
          </table>

          <h3>مقارنة CBK مع أنظمة الخليج</h3>
          <table className="calc-editorial-table">
            <thead>
              <tr><th>الدولة</th><th>الجهة التنظيمية</th><th>حد DBR</th><th>الحد الأقصى للقرض</th></tr>
            </thead>
            <tbody>
              <tr><td>🇰🇼 الكويت</td><td>CBK</td><td>40% (مواطن) / 30% (وافد)</td><td>70,000 / 15,000 د.ك</td></tr>
              <tr><td>🇦🇪 الإمارات</td><td>CBUAE</td><td>50% للجميع</td><td>250,000 درهم (غير مضمون)</td></tr>
              <tr><td>🇸🇦 السعودية</td><td>ساما</td><td>33% للجميع</td><td>60× الراتب الشهري</td></tr>
              <tr><td>🇶🇦 قطر</td><td>QCB</td><td>~50% للجميع</td><td>حسب تقدير البنك</td></tr>
            </tbody>
          </table>

          <h3>5 نصائح قبل التقدم للقرض في الكويت</h3>
          <ul className="calc-tip-list">
            <li>تأكد من سجلك الائتماني في الشركة الكويتية للمعلومات الائتمانية (CI-Net) قبل التقدم.</li>
            <li>قارن المعدل الفعلي (APR) لا المعلن فقط — بعض البنوك تُضمّن رسوم إدارية في السعر.</li>
            <li>لا تطلب أقصى مبلغ متاح — اقترض ما تحتاجه فعلاً والزمن الأقصر يوفر فائدة أعلى.</li>
            <li>الوافدون: تأكد أن تأشيرتك صالحة طوال فترة القرض — انتهاء الإقامة يُجمّد الحساب.</li>
            <li>القرض الإسلامي (مرابحة) يُحدد الربح مسبقاً — مناسب إذا أردت إقفاله مبكراً بدون غرامة.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن القروض الشخصية في الكويت">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </>
  );
}
