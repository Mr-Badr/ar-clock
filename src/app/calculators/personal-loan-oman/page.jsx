import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import OmanPersonalLoanCalculator from '@/components/calculators/OmanPersonalLoanCalculator.client';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';

const SLUG      = 'personal-loan-oman';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة القرض الشخصي عمان — أقساط ومدة وأهلية وفق CBO',
  description:
    'احسب قسطك الشهري للقرض الشخصي في سلطنة عمان، أو احسب أقصى قرض تستطيع الحصول عليه من راتبك وفق قواعد البنك المركزي العماني (CBO). نسبة DBR 50%.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة القرض الشخصي عمان',
    description: 'قسط شهري وأهلية القرض الشخصي في عمان — وفق CBO بنسبة DBR 50% للمواطنين والوافدين.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'ما نسبة DBR للقرض الشخصي في عمان؟',
    answer:
      'البنك المركزي العماني (CBO) يُحدد الحد الأقصى لنسبة تحمّل الديون بـ50% من صافي الدخل الشهري. مجموع جميع أقساطك الشهرية (بما فيها القرض الجديد) لا يجوز أن يتجاوز 50% من راتبك الصافي.',
  },
  {
    question: 'ما الحد الأقصى لمدة القرض الشخصي في عمان؟',
    answer:
      '10 سنوات (120 شهراً) للمواطنين العمانيين. 5 سنوات (60 شهراً) للوافدين المقيمين في معظم البنوك، رغم أن قواعد CBO تسمح بـ120 شهراً للجميع نظرياً — لكن البنوك تقيّد الوافدين عملياً.',
  },
  {
    question: 'ما أبرز بنوك القروض الشخصية في عمان؟',
    answer:
      'بنك مسقط (الأكبر بحصة سوق ~30%)، بنك نزوى الإسلامي، البنك الوطني العماني (NBO)، بنك ظفار، بنك صحار الدولي، الأهلي بنك، وHSBC عمان (للوافدين بدخل مرتفع). المعدلات تتراوح بين 5.5%–11% حسب الملف والبنك.',
  },
  {
    question: 'هل يمكن للوافدين الحصول على قروض شخصية في عمان؟',
    answer:
      'نعم، لكن بشروط أشد: الحد الأقصى للمدة 60 شهراً، وكثير من البنوك تضع سقفاً للمبلغ (عادة 25,000–30,000 ر.ع). يحتاج الوافد إلى عقد عمل ساري، وكشف راتب، وبعض البنوك تشترط 2 سنة خدمة على الأقل.',
  },
  {
    question: 'كيف تختلف معدلات الفائدة في عمان عن دول الخليج الأخرى؟',
    answer:
      'معدلات القروض الشخصية في عمان (5.5%–11% سنوياً) أعلى من الكويت والإمارات، لكن أقل من البحرين. عمان ترتبط بالدولار (الريال العماني مربوط بـ1 ريال = 2.6 دولار)، مما يجعل معدلاتها متأثرة بقرارات الفيدرالي الأمريكي مع هامش إضافي للسوق المحلي.',
  },
  {
    question: 'ما الوثائق المطلوبة للقرض الشخصي في عمان؟',
    answer:
      'بطاقة هوية عمانية أو تصريح إقامة ساري، كشف راتب آخر 3 أشهر، كشف حساب بنكي 6 أشهر، شهادة راتب من صاحب العمل، وعقد عمل (للوافدين). بعض البنوك تطلب ضامناً أو وثيقة ملكية عقارية للمبالغ الكبيرة.',
  },
];

const SCHEMA = buildFreeToolPageSchema({
  name: 'حاسبة القرض الشخصي عمان',
  description: 'حاسبة القرض الشخصي في سلطنة عمان: قسط شهري وأهلية من الراتب وفق قواعد البنك المركزي العماني (CBO)',
  url: CANONICAL,
  faqItems: FAQ_ITEMS,
  howToSteps: [
    { name: 'اختر نوع المقترض', text: 'عماني أو وافد — يحدد الحد الأقصى للمدة والمبلغ' },
    { name: 'أدخل مبلغ القرض أو الراتب', text: 'وضع حساب القسط أو حساب الأهلية' },
    { name: 'اضبط معدل الفائدة', text: 'من 5.5% إلى 12% حسب البنك والملف' },
    { name: 'اختر مدة القرض', text: 'حتى 120 شهراً للمواطنين و60 للوافدين' },
  ],
});

export default function OmanPersonalLoanPage() {
  return (
    <main>
      <JsonLd data={SCHEMA} />

      <CalculatorHero
        badge="🇴🇲 عُمان"
        title="حاسبة القرض الشخصي عمان"
        description="احسب قسطك الشهري أو أقصى قرض تستطيع الحصول عليه في سلطنة عمان وفق قواعد البنك المركزي العماني — DBR 50%."
        highlights={[
          { label: 'DBR 50%', desc: 'وفق قواعد CBO' },
          { label: '10 سنوات', desc: 'الحد الأقصى للمواطنين' },
          { label: '5 سنوات', desc: 'الحد المعتاد للوافدين' },
          { label: 'بنك مسقط + NBO', desc: 'أبرز بنوك الإقراض' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة القرض" title="احسب قسطك أو أهليتك للقرض الشخصي في عمان">
        <OmanPersonalLoanCalculator />
      </CalculatorSection>

      <CalculatorSection id="guide" eyebrow="دليل القروض الشخصية" title="قواعد CBO وبنوك عمان">
        <div className="calc-editorial">
          <h3>مقارنة قواعد القروض الشخصية في دول الخليج</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="calc-data-table">
              <thead>
                <tr>
                  <th>الدولة</th>
                  <th>الجهة التنظيمية</th>
                  <th>نسبة DBR</th>
                  <th>الحد الأقصى للمدة</th>
                  <th>معدل الفائدة التقريبي</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>🇴🇲 عمان</td><td>CBO</td><td>50%</td><td>120 شهراً (مواطن)</td><td>5.5%–11%</td></tr>
                <tr><td>🇦🇪 الإمارات</td><td>CBUAE</td><td>50%</td><td>48 شهراً (وافد)</td><td>5%–10%</td></tr>
                <tr><td>🇸🇦 السعودية</td><td>SAMA</td><td>33%</td><td>60 شهراً</td><td>4%–8%</td></tr>
                <tr><td>🇶🇦 قطر</td><td>QCB</td><td>50%</td><td>48 شهراً</td><td>5%–10%</td></tr>
                <tr><td>🇰🇼 الكويت</td><td>CBK</td><td>40%</td><td>60 شهراً</td><td>4%–9%</td></tr>
                <tr><td>🇧🇭 البحرين</td><td>CBB</td><td>50%</td><td>84 شهراً (مواطن)</td><td>5%–10%</td></tr>
              </tbody>
            </table>
          </div>

          <h3>كيف يُحسب الحد الأقصى لقرضك؟</h3>
          <p>
            القاعدة بسيطة: <strong>الراتب الصافي × 50% − الأقساط الحالية = أقصى قسط شهري للقرض الجديد</strong>.
            ثم بناءً على هذا القسط ومعدل الفائدة والمدة يُحسب الحد الأقصى للمبلغ.
            مثال: راتب 800 ر.ع × 50% = 400 ر.ع. إذا كان لديك قسط سيارة 100 ر.ع، فأقصى قسط قرض شخصي = 300 ر.ع.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن القرض الشخصي في عمان">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </main>
  );
}
