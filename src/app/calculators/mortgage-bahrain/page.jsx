import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import BahrainMortgageCalculator from '@/components/calculators/BahrainMortgageCalculator.client';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import CountryFlag from '@/components/shared/CountryFlag';

const SLUG      = 'mortgage-bahrain';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة التمويل العقاري البحرين — دفعة أولى وأقساط شهرية وفق CBB',
  description:
    'احسب قسطك الشهري للرهن العقاري في البحرين، الدفعة الأولى ونسبة LTV وفق قواعد البنك المركزي البحريني (CBB). تمويل تقليدي وإسلامي للمواطنين والوافدين.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة التمويل العقاري البحرين',
    description: 'قسطك الشهري ودفعتك الأولى للرهن العقاري في البحرين — وفق قواعد CBB للمواطنين والوافدين.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'ما نسبة التمويل العقاري (LTV) في البحرين؟',
    answer:
      'البنك المركزي البحريني (CBB) يُحدد: 70% للمواطنين البحرينيين على العقارات السكنية (أي دفعة أولى 30%)، 60% للوافدين المقيمين على السكني، و60% لجميع المتقدمين على العقارات الاستثمارية والتجارية والتحت الإنشاء.',
  },
  {
    question: 'ما الحد الأقصى لنسبة تحمّل الديون (DBR) في البحرين؟',
    answer:
      'يُحدد CBB نسبة DBR بـ50% من صافي الدخل الشهري لجميع المقترضين. بمعنى أن مجموع جميع أقساطك الشهرية (بما فيها القسط الجديد) لا يتجاوز نصف راتبك الصافي.',
  },
  {
    question: 'ما الفرق بين التمويل العقاري التقليدي والإسلامي (مرابحة) في البحرين؟',
    answer:
      'التمويل التقليدي يعتمد الفائدة المتناقصة (تنخفض مع سداد الأصل). تمويل المرابحة الإسلامي: البنك يشتري العقار ويبيعه لك بسعر أعلى مُقسَّط على المدة. الفائدة الفعلية للمرابحة تُحسب بطريقة "مسطحة" (flat rate)، مما يجعل المقارنة بالمعدل السنوي الفعلي (APR) ضرورية.',
  },
  {
    question: 'ما الحد الأقصى لمدة التمويل العقاري في البحرين؟',
    answer:
      '25 سنة للمواطنين البحرينيين، و20 سنة للوافدين المقيمين. بعض البنوك كـAhli United و NBB ترفض منح أكثر من 15 سنة للوافدين بصرف النظر عن سقف CBB.',
  },
  {
    question: 'ما أبرز بنوك التمويل العقاري في البحرين؟',
    answer:
      'البنوك التقليدية: NBB (بنك البحرين الوطني)، Ahli United Bank، Standard Chartered، BBK (بنك البحرين والكويت). البنوك الإسلامية: Al Salam Bank، Bahrain Islamic Bank (BIB)، Ithmaar Bank. معدلات 2025 تتراوح بين 4.5%–7.5% سنوياً حسب البنك والملف.',
  },
  {
    question: 'هل يمكن للوافدين شراء عقارات في البحرين؟',
    answer:
      'نعم في مناطق محددة (Freehold Areas) كـ Amwaj Islands وSeef District وBB Bay. خارجها يقتصر التملك على المواطنين الخليجيين والشركات. التمويل العقاري للوافدين ممكن لكن بشروط أشد: LTV 60%، مدة أقل، ومتطلبات وثائق إضافية.',
  },
];

const SCHEMA = buildFreeToolPageSchema({
  name: 'حاسبة التمويل العقاري البحرين',
  description: 'حاسبة الرهن العقاري في البحرين: دفعة أولى، قسط شهري، ونسبة LTV وفق قواعد البنك المركزي البحريني (CBB)',
  url: CANONICAL,
  faqItems: FAQ_ITEMS,
  howToSteps: [
    { name: 'اختر نوع المقترض', text: 'بحريني أو وافد — يحدد نسبة LTV والمدة القصوى' },
    { name: 'اختر نوع العقار', text: 'سكني، استثماري، أو تحت الإنشاء' },
    { name: 'أدخل قيمة العقار أو الراتب', text: 'وضع القسط أو وضع الأهلية' },
    { name: 'اضبط معدل الفائدة والمدة', text: 'تقليدي أو إسلامي (مرابحة)' },
  ],
});

export default function BahrainMortgagePage() {
  return (
    <main>
      <JsonLd data={SCHEMA} />

      <CalculatorHero
        badge={<><CountryFlag code="bh" /> البحرين</>}
        title="حاسبة التمويل العقاري البحرين"
        description="احسب قسطك الشهري والدفعة الأولى ونسبة LTV وفق قواعد البنك المركزي البحريني — تمويل تقليدي وإسلامي للمواطنين والوافدين."
        highlights={[
          { label: 'LTV 70% للمواطنين', desc: 'و60% للوافدين على السكني' },
          { label: 'DBR 50%', desc: 'وفق توجيهات CBB' },
          { label: 'تقليدي وإسلامي', desc: 'مرابحة بمعدل مسطح' },
          { label: '25 سنة', desc: 'الحد الأقصى للمواطنين' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة التمويل" title="احسب قسطك أو أهليتك للتمويل العقاري في البحرين">
        <BahrainMortgageCalculator />
      </CalculatorSection>

      <CalculatorSection id="guide" eyebrow="دليل التمويل العقاري" title="قواعد CBB والبنوك البحرينية">
        <div className="calc-editorial">
          <h3>نسبة LTV — جدول القواعد الكاملة (CBB)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="calc-data-table">
              <thead>
                <tr>
                  <th>نوع المقترض</th>
                  <th>نوع العقار</th>
                  <th>نسبة التمويل (LTV)</th>
                  <th>الدفعة الأولى</th>
                  <th>الحد الأقصى للمدة</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>بحريني</td><td>سكني</td><td>70%</td><td>30%</td><td>25 سنة</td></tr>
                <tr><td>بحريني</td><td>استثماري/تجاري</td><td>60%</td><td>40%</td><td>25 سنة</td></tr>
                <tr><td>بحريني</td><td>تحت الإنشاء</td><td>60%</td><td>40%</td><td>25 سنة</td></tr>
                <tr><td>وافد مقيم</td><td>سكني</td><td>60%</td><td>40%</td><td>20 سنة</td></tr>
                <tr><td>وافد مقيم</td><td>استثماري/تجاري</td><td>50%</td><td>50%</td><td>20 سنة</td></tr>
                <tr><td>وافد مقيم</td><td>تحت الإنشاء</td><td>50%</td><td>50%</td><td>20 سنة</td></tr>
              </tbody>
            </table>
          </div>

          <h3>كيف تختلف المرابحة عن التمويل التقليدي؟</h3>
          <p>
            في التمويل التقليدي (فائدة متناقصة)، تسدّد فائدة على الرصيد المتبقي فقط — كلما سددت أكثر انخفضت الفائدة.
            في المرابحة الإسلامية، يشتري البنك العقار ثم يبيعه لك بربح متفق عليه مقسّم على المدة.
            المبلغ الإجمالي ثابت من البداية (مسطح)، مما يعني أن التسديد المبكر لا يخفض الربح المتبقي بنفس طريقة الفائدة المتناقصة.
          </p>
          <p>
            <strong>النصيحة:</strong> اطلب من البنك معدل النسبة السنوية الفعلية (APR) لمقارنة العروض بشكل صحيح،
            لأن معدل المرابحة المسطح يبدو أقل بكثير من معدل الفائدة المتناقصة المعادل.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن التمويل العقاري في البحرين">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </main>
  );
}
