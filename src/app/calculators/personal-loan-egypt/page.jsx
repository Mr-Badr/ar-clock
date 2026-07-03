import { getSiteUrl } from '@/lib/site-config';
import JsonLd from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
} from '@/components/calculators/common.jsx';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EgyptPersonalLoanCalculator from '@/components/calculators/EgyptPersonalLoanCalculator.client';
import { buildFreeToolPageSchema } from '@/lib/calculators/schema';

const SLUG      = 'personal-loan-egypt';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة القرض الشخصي مصر — أقساط ومدة وأهلية وفق CBE',
  description:
    'احسب قسطك الشهري للقرض الشخصي في مصر، أو أقصى قرض تستطيع الحصول عليه من راتبك وفق قواعد البنك المركزي المصري (CBE). DBR 35% قطاع خاص، 40% قطاع عام.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة القرض الشخصي مصر',
    description: 'قسط شهري وأهلية القرض الشخصي في مصر — وفق CBE بنسبة DBR 35%/40% للموظفين والعمل الحر.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'ما نسبة DBR للقرض الشخصي في مصر؟',
    answer:
      'البنك المركزي المصري (CBE) يُحدد نسبة DBR بـ35% من صافي الدخل الشهري لموظفي القطاع الخاص والعمل الحر، و40% لموظفي الحكومة والقطاع العام. مجموع جميع الأقساط لا يتجاوز هذه النسبة من الراتب الصافي.',
  },
  {
    question: 'ما الحد الأقصى لمدة القرض الشخصي في مصر؟',
    answer:
      '60 شهراً (5 سنوات) لموظفي القطاع الخاص والأجانب المقيمين. 84 شهراً (7 سنوات) لموظفي الحكومة والقطاع العام في بعض البنوك. NBE وبنك مصر يصلان أحياناً إلى 7 سنوات للموظفين الحكوميين بضمانات إضافية.',
  },
  {
    question: 'ما أبرز بنوك القروض الشخصية في مصر؟',
    answer:
      'CIB (بنك الكريدي إيبولييه المصري) — أفضل معدلات للقطاع الخاص بدخل مرتفع. البنك الأهلي المصري (NBE) — أوسع شبكة وأفضل معدل للحكوميين. بنك مصر — تميّز للقطاع العام والتعليمي. QNB مصر — للعملاء المميزين. ADIB مصر — تمويل إسلامي. المعدلات تتراوح بين 22%–32% سنوياً (2024–2025) بعد قرارات الفائدة.',
  },
  {
    question: 'كيف أثّرت قرارات الفائدة المصرية على القروض الشخصية؟',
    answer:
      'رفع البنك المركزي المصري الفائدة بشكل حاد في 2022–2024 (من 8.25% إلى 27.25%) لمواجهة التضخم. هذا رفع معدلات القروض الشخصية من 15%–18% إلى 22%–32% حالياً. ابدأ دائماً بالحاسبة بمعدل 27% كتقدير وسط، واسأل البنك عن المعدل الدقيق.',
  },
  {
    question: 'ما الحد الأدنى للراتب للحصول على قرض شخصي في مصر؟',
    answer:
      'يتفاوت حسب البنك: CIB يشترط 3,000 ج.م صافي شهرياً كحد أدنى. NBE وبنك مصر يقبلان من 2,000 ج.م للحكوميين. QNB يشترط 5,000 ج.م. بعض البنوك ترفع الحد لـ10,000 ج.م للقروض الكبيرة (500,000 ج.م+).',
  },
  {
    question: 'هل يوجد حد أقصى لمبلغ القرض الشخصي في مصر؟',
    answer:
      'CBE لا يُحدد سقفاً بالجنيه مباشرةً — السقف يأتي من تطبيق نسبة DBR على الراتب. لكن كل بنك له سياسته: CIB حتى 2,000,000 ج.م. NBE حتى 500,000 ج.م. بنك مصر حتى 1,000,000 ج.م. الحد الفعلي دائماً هو: أقل قيمة بين سقف البنك وما تسمح به نسبة الـDBR من راتبك.',
  },
];

const SCHEMA = buildFreeToolPageSchema({
  name: 'حاسبة القرض الشخصي مصر',
  description: 'حاسبة القرض الشخصي في مصر: قسط شهري وأهلية من الراتب وفق قواعد البنك المركزي المصري (CBE)',
  url: CANONICAL,
  faqItems: FAQ_ITEMS,
  howToSteps: [
    { name: 'اختر نوع المقترض', text: 'موظف خاص أو حكومي أو أجنبي — يحدد DBR والمدة' },
    { name: 'أدخل مبلغ القرض أو الراتب', text: 'وضع حساب القسط أو حساب الأهلية' },
    { name: 'اضبط معدل الفائدة', text: 'من 18% إلى 35% حسب البنك وقرارات CBE' },
    { name: 'اختر مدة القرض', text: 'حتى 60 شهراً للخاص و84 للحكومي' },
  ],
});

export default function EgyptPersonalLoanPage() {
  return (
    <main>
      <JsonLd data={SCHEMA} />

      <CalculatorHero
        badge="🇪🇬 مصر"
        title="حاسبة القرض الشخصي مصر"
        description="احسب قسطك الشهري أو أقصى قرض تستطيع الحصول عليه في مصر وفق قواعد البنك المركزي المصري — DBR 35% للقطاع الخاص و40% للحكومي."
        highlights={[
          { label: 'DBR 35%/40%', desc: 'خاص وحكومي وفق CBE' },
          { label: 'حتى 84 شهراً', desc: 'للموظفين الحكوميين' },
          { label: 'معدلات 2024–2025', desc: 'محدّثة بعد قرارات الفائدة' },
          { label: 'CIB + NBE + بنك مصر', desc: 'أبرز بنوك القروض' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة القرض" title="احسب قسطك أو أهليتك للقرض الشخصي في مصر">
        <EgyptPersonalLoanCalculator />
      </CalculatorSection>

      <CalculatorSection id="guide" eyebrow="دليل القروض الشخصية" title="قواعد CBE وأبرز البنوك المصرية">
        <div className="calc-editorial">
          <h3>مقارنة بنوك القروض الشخصية في مصر</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="calc-data-table">
              <thead>
                <tr>
                  <th>البنك</th>
                  <th>الحد الأدنى للراتب</th>
                  <th>الحد الأقصى للمبلغ</th>
                  <th>الحد الأقصى للمدة</th>
                  <th>مزية رئيسية</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>CIB</td><td>3,000 ج.م</td><td>2,000,000 ج.م</td><td>60 شهراً</td><td>أسرع موافقة</td></tr>
                <tr><td>NBE الأهلي</td><td>2,000 ج.م</td><td>500,000 ج.م</td><td>84 شهراً (حكومي)</td><td>أفضل معدل للحكوميين</td></tr>
                <tr><td>بنك مصر</td><td>2,000 ج.م</td><td>1,000,000 ج.م</td><td>84 شهراً (حكومي)</td><td>قطاع عام وتعليم</td></tr>
                <tr><td>QNB مصر</td><td>5,000 ج.م</td><td>1,500,000 ج.م</td><td>60 شهراً</td><td>عملاء VIP</td></tr>
                <tr><td>ADIB مصر</td><td>3,000 ج.م</td><td>500,000 ج.م</td><td>60 شهراً</td><td>تمويل إسلامي</td></tr>
              </tbody>
            </table>
          </div>
          <p className="calc-hint" style={{ marginTop: 'var(--space-2)' }}>
            المعدلات تتغير مع قرارات لجنة السياسة النقدية للبنك المركزي المصري. تحقق من البنك قبل التقديم.
          </p>

          <h3>DBR في مصر مقارنة بالدول العربية</h3>
          <p>
            نسبة DBR المصرية (35% للقطاع الخاص) هي <strong>الأكثر تحفظاً</strong> في المنطقة العربية —
            إذ تتيح الإمارات وعمان وقطر والبحرين 50%، والسعودية 33%.
            هذا يعني أن المصري بنفس الراتب قادر على الاقتراض أقل نسبياً من نظيره في الخليج،
            لكن هذا يقلل مخاطر التعثر ويحمي المقترض من الإفراط في الديون.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن القرض الشخصي في مصر">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </main>
  );
}
