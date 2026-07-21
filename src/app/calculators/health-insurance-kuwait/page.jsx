import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import KuwaitHealthInsuranceCalculator from '@/components/calculators/KuwaitHealthInsuranceCalculator.client';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import CountryFlag from '@/components/shared/CountryFlag';

const SLUG      = 'health-insurance-kuwait';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة التأمين الصحي الكويت — أسعار الوافدين والعائلات بالدينار الكويتي',
  description:
    'قدّر تكلفة التأمين الصحي في الكويت للوافدين والعائلات حسب مستوى التغطية (أساسي / قياسي / مميز / عالمي) والعمر وعدد الأشخاص. أرقام بالدينار الكويتي وفق بيانات السوق الكويتي.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة التأمين الصحي الكويت',
    description: 'تكلفة التأمين الصحي في الكويت للوافدين — 4 مستويات من الأساسي إلى العالمي. أرقام بالدينار الكويتي.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل التأمين الصحي إلزامي في الكويت للوافدين؟',
    answer:
      'نعم. قانون العمل الكويتي يُلزم أصحاب العمل بتوفير تغطية صحية لجميع الموظفين الوافدين. التأمين شرط لاستخراج تصاريح العمل وتجديد الإقامة. المخالف يتعرض لغرامات ومشكلات في التجديد.',
  },
  {
    question: 'ما أسعار التأمين الصحي في الكويت بالدينار الكويتي؟',
    answer:
      'تتراوح الأسعار حسب مستوى التغطية: أساسي 50–140 د.ك للشخص سنوياً، قياسي 140–350 د.ك، مميز 350–750 د.ك، عالمي 750–2,000 د.ك. تزيد الأسعار مع تقدم العمر وبوجود أمراض مزمنة سابقة.',
  },
  {
    question: 'ما أبرز شركات التأمين الصحي في الكويت؟',
    answer:
      'الأبرز في السوق الكويتي: الأهلية للتأمين (Al-Ahleia)، مجموعة الخليج للتأمين (GIG Kuwait)، أول تكافل، شركة الكويت للتأمين، وأوريكس للتأمين. بعض الشركات تقدم خطط شبكة وزارة الصحة وأخرى شبكات خاصة أوسع.',
  },
  {
    question: 'كيف يؤثر العمر على سعر التأمين الصحي في الكويت؟',
    answer:
      'يتضاعف السعر مع العمر: 18–30 سنة (معامل ×1)، 31–40 (×1.25)، 41–50 (×1.6)، 51–55 (×2.2)، 56–60 (×2.9)، 60+ (×3.8). الفئات 55+ تحتاج فحصاً طبياً مسبقاً لدى معظم الشركات.',
  },
  {
    question: 'ما تكلفة التأمين للعائلة في الكويت؟',
    answer:
      'التأمين الجماعي للعائلات أرخص للفرد من الخطط الفردية. عائلة مكونة من 4 أفراد على الخطة القياسية تدفع تقريباً 400–900 د.ك سنوياً، مقارنةً بـ 140–350 د.ك للشخص الواحد، لأن الأطفال يُؤمَّن بمعامل أقل (65% من معامل عمر رب الأسرة).',
  },
  {
    question: 'هل يغطي التأمين الصحي في الكويت الأمراض المزمنة؟',
    answer:
      'تغطي معظم خطط المستوى القياسي والمميز الأمراض المزمنة السابقة بعد فترة انتظار 6–12 شهراً. الخطط الأساسية قد تستثنيها كلياً. وجود حالات سابقة يرفع القسط عادةً بنسبة ~30%. يُنصح بالإفصاح الكامل عند التقديم.',
  },
];

const SCHEMA = buildFreeToolPageSchema({
  name: 'حاسبة التأمين الصحي الكويت',
  description: 'تقدير تكلفة التأمين الصحي في الكويت للوافدين والعائلات بالدينار الكويتي',
  url: CANONICAL,
  faqItems: FAQ_ITEMS,
  howToSteps: [
    { name: 'اختر مستوى التغطية', text: 'من أساسي (الإلزامي) إلى عالمي (شامل دولياً)' },
    { name: 'حدد عدد المؤمَّن عليهم', text: 'فرد أو عائلة حتى 5 أفراد' },
    { name: 'أدخل عمر المؤمَّن الرئيسي', text: 'يزيد المعامل مع التقدم في العمر' },
    { name: 'اقرأ التقدير', text: 'نطاق سنوي وشهري وسقف التغطية' },
  ],
});

export default function KuwaitHealthInsurancePage() {
  return (
    <main>
      <JsonLd data={SCHEMA} />

      <CalculatorHero
        badge={<><CountryFlag code="kw" /> الكويت</>}
        title="حاسبة التأمين الصحي الكويت"
        description="قدّر تكلفة التأمين الصحي للوافدين والعائلات في الكويت — 4 مستويات من الأساسي إلى العالمي بالدينار الكويتي."
        highlights={[
          { label: 'إلزامي للوافدين', desc: 'شرط تصريح العمل والإقامة' },
          { label: '4 مستويات تغطية', desc: 'أساسي → قياسي → مميز → عالمي' },
          { label: 'معامل العمر', desc: 'سعر دقيق حسب الفئة العمرية' },
          { label: 'تسعير العائلة', desc: 'خصم الأطفال محسوب تلقائياً' },
        ]}
      />

      <CalculatorSection id="tool" eyebrow="حاسبة التأمين" title="قدّر تكلفة تأمينك الصحي في الكويت">
        <KuwaitHealthInsuranceCalculator />
      </CalculatorSection>

      <CalculatorSection id="guide" eyebrow="دليل التأمين الصحي" title="ما تحتاج معرفته عن التأمين الصحي في الكويت">
        <div className="calc-editorial">
          <h3>من يلتزم بتأمين موظفيه في الكويت؟</h3>
          <p>
            قانون العمل في القطاع الخاص رقم 6/2010 يُلزم صاحب العمل بتوفير تغطية صحية ملائمة لجميع موظفيه،
            وهو ما يُطبَّق فعلياً عبر اشتراط التأمين لاستخراج تصاريح العمل من وزارة الشؤون الاجتماعية.
            تجديد الإقامة مرتبط كذلك بوجود وثيقة تأمين سارية.
          </p>
          <h3>4 مستويات تغطية في السوق الكويتي</h3>
          <p>
            <strong>أساسي (50–140 د.ك/سنة):</strong> الحد الأدنى الإلزامي، يشمل المستشفيات الحكومية وعيادات محددة.
            مناسب للعمالة المنزلية وصغار الموظفين.
          </p>
          <p>
            <strong>قياسي (140–350 د.ك/سنة):</strong> شبكة خاصة موسّعة، طب عام وتخصصي، أدوية جزئية.
            الأكثر طلباً بين الشركات للموظفين المتوسطين.
          </p>
          <p>
            <strong>مميز (350–750 د.ك/سنة):</strong> مستشفيات خاصة أولى، تغطية أسنان وبصريات، دعم دوائي واسع.
            مناسب للمدراء والمتخصصين.
          </p>
          <p>
            <strong>عالمي (750–2,000 د.ك/سنة):</strong> تغطية كاملة محلياً ودولياً بما فيه أوروبا وأمريكا الشمالية.
            للتنفيذيين وذوي الاحتياجات الطبية الخاصة.
          </p>
          <h3>جدول مقارنة المستويات الأربعة</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="calc-data-table">
              <thead>
                <tr>
                  <th>المستوى</th>
                  <th>السعر/شخص/سنة</th>
                  <th>سقف التغطية</th>
                  <th>الشبكة</th>
                  <th>الأسنان/البصريات</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>أساسي</td>
                  <td style={{ direction: 'ltr', textAlign: 'end' }}>50–140 د.ك</td>
                  <td>25,000 د.ك</td>
                  <td>حكومي + محلي محدود</td>
                  <td>لا</td>
                </tr>
                <tr>
                  <td>قياسي</td>
                  <td style={{ direction: 'ltr', textAlign: 'end' }}>140–350 د.ك</td>
                  <td>75,000 د.ك</td>
                  <td>خاص موسّع</td>
                  <td>جزئي</td>
                </tr>
                <tr>
                  <td>مميز</td>
                  <td style={{ direction: 'ltr', textAlign: 'end' }}>350–750 د.ك</td>
                  <td>200,000 د.ك</td>
                  <td>خاص + مستشفيات رئيسية</td>
                  <td>نعم</td>
                </tr>
                <tr>
                  <td>عالمي</td>
                  <td style={{ direction: 'ltr', textAlign: 'end' }}>750–2,000 د.ك</td>
                  <td>1,000,000 د.ك</td>
                  <td>محلي + دولي</td>
                  <td>نعم (شامل)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection id="faq" eyebrow="أسئلة شائعة" title="أسئلة عن التأمين الصحي في الكويت">
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug={SLUG} />
      </CalculatorSection>
    </main>
  );
}
