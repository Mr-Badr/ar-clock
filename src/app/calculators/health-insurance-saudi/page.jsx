import { getSiteUrl } from '@/lib/site-config';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common.jsx';
import SaudiHealthInsuranceCalculator from '@/components/calculators/SaudiHealthInsuranceCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';

const SLUG = 'health-insurance-saudi';
const CANONICAL = `${getSiteUrl()}/calculators/${SLUG}`;

export const metadata = {
  title: 'حاسبة التأمين الصحي السعودية — أسعار CCHI حسب الفئة والعمر والعائلة',
  description:
    'احسب تكلفة التأمين الصحي في السعودية حسب فئة CCHI (B/C/D/E) وعدد الأفراد والعمر والمنطقة. أرقام تقديرية شاملة للقطاع الخاص والعائلات. مجاناً وبدون تسجيل.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'حاسبة التأمين الصحي السعودية — CCHI',
    description: 'قدّر تكلفة تأمينك الصحي في السعودية حسب الفئة والعمر والمنطقة.',
    url: CANONICAL,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'هل التأمين الصحي إلزامي في السعودية؟',
    answer:
      'نعم. مجلس الضمان الصحي التعاوني (CCHI) يُلزم جميع أصحاب العمل في القطاع الخاص بتوفير تأمين صحي لموظفيهم وعائلاتهم. التطبيق تدريجي منذ 2006 واكتمل بحلول 2016 ليشمل جميع المنشآت.',
  },
  {
    question: 'ما الفرق بين الفئات B و C و D و E؟',
    answer:
      'الفئة B هي الحد الأدنى الإلزامي: طوارئ وعلاج أساسي. الفئة C تضيف مستشفيات خاصة وأدوية. الفئة D تشمل أفضل المستشفيات والرعاية الموسعة. الفئة E (VIP) تتضمن أسنان ونظر وغرفة خاصة وعلاج خارج المملكة.',
  },
  {
    question: 'كيف يؤثر العمر على قسط التأمين؟',
    answer:
      'العمر هو أكبر محرك للسعر. الشريحة 18-30 سنة هي القاعدة (×1.0). 31-40 يرتفع إلى ×1.4، و41-50 إلى ×2.0، و51-60 إلى ×2.8، وما فوق 60 إلى ×3.8. بعض البوليصات تشترط فحصاً طبياً للفئة 51+.',
  },
  {
    question: 'هل يمكنني إضافة عائلتي في نفس البوليصة؟',
    answer:
      'نعم. معظم بوليصات CCHI تغطي الزوج والأولاد. الأقارب من الدرجة الأولى يُضافون بنفس الفئة مع خصم محتمل للأطفال. تحقق مع شركة التأمين من الحد الأقصى لعدد المُضافين.',
  },
  {
    question: 'ما هي تأثير الأمراض المزمنة على القسط؟',
    answer:
      'الحالات السابقة (السكري، ضغط الدم، أمراض القلب، الربو) عادةً ترفع القسط بنسبة 20–40%. بعض شركات التأمين تستثني تكاليف علاج هذه الحالات في السنة الأولى ثم تغطيها لاحقاً. اقرأ الوثيقة بعناية.',
  },
  {
    question: 'كيف تختلف الأسعار بين الرياض وجدة والمنطقة الشرقية؟',
    answer:
      'جدة ومكة المكرمة تسجل أعلى الأسعار (+8%) بسبب ارتفاع تكاليف مقدمي الخدمة. الرياض في المرتبة الثانية (+5%). المنطقة الشرقية (+2%) والمناطق الأخرى هي الأقل تكلفة بوجه عام.',
  },
  {
    question: 'ماذا يحدث إذا انتهى التأمين وأنا بحاجة إلى علاج؟',
    answer:
      'حالات الطوارئ مغطاة قانونياً حتى بدون بوليصة سارية وفق لوائح وزارة الصحة. لكن للعلاج المخطط، يجب تجديد البوليصة قبل انتهائها بـ 30 يوماً على الأقل لتجنب فترة انتظار جديدة.',
  },
  {
    question: 'هل هذه الأرقام أسعار حقيقية؟',
    answer:
      'هذه أرقام تقديرية مستندة إلى نطاقات السوق المعتمدة لفئات CCHI. السعر الفعلي يختلف بين شركات التأمين المرخصة وفق مخاطر المجموعة وسجل المطالبات. استخدم الحاسبة لتحديد الميزانية ثم اطلب عروضاً من شركات مرخصة.',
  },
];

const HOW_TO_STEPS = [
  { name: 'اختر فئة التأمين', text: 'حدد الفئة المطلوبة من B (أساسي) إلى E (ممتاز VIP) بناءً على مستوى التغطية الذي يحتاجه موظفوك أو عائلتك.' },
  { name: 'أدخل عدد الأفراد', text: 'حدد عدد المؤمَّن عليهم من فرد واحد حتى 6 أفراد. الحاسبة تطبق خصماً تلقائياً للأطفال والمعالين.' },
  { name: 'اختر العمر والمنطقة', text: 'عمر المؤمَّن الرئيسي والمنطقة الجغرافية (الرياض / جدة / الشرقية / أخرى) يؤثران على السعر النهائي.' },
  { name: 'حدد الحالات الصحية', text: 'فعّل خيار الأمراض المزمنة إذا كان المؤمَّن يعاني من حالات سابقة — سيُضاف تحميل ~30% تلقائياً.' },
  { name: 'راجع التقدير السنوي', text: 'الحاسبة تعرض نطاق التكلفة السنوية والشهرية والمتوسط للفرد. استخدمه لمقارنة عروض شركات التأمين المرخصة.' },
];

export default function SaudiHealthInsurancePage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${getSiteUrl()}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبة التأمين الصحي السعودية', item: CANONICAL },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'حاسبة التأمين الصحي السعودية',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: CANONICAL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
    description: 'حاسبة أسعار التأمين الصحي في السعودية حسب فئات CCHI والعمر والمنطقة والعائلة.',
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
    name: 'كيف تستخدم حاسبة التأمين الصحي السعودية',
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
        badge={<><CountryFlag code="sa" /> السعودية</>}
        title="حاسبة التأمين الصحي السعودية"
        description="قدّر تكلفة تأمينك الصحي حسب فئة CCHI (B / C / D / E) وعدد أفراد العائلة والعمر والمنطقة. إلزامي لجميع موظفي القطاع الخاص منذ 2016."
        highlights={[
          { label: 'فئات CCHI الأربع', desc: 'من الأساسي إلى VIP بأوصاف عربية واضحة' },
          { label: 'تغطية العائلة', desc: 'من فرد واحد حتى 6 أفراد' },
          { label: 'تحميل الأمراض المزمنة', desc: 'خيار تلقائي لحالات السكري والضغط وغيرها' },
          { label: 'SAR — ريال سعودي', desc: 'أرقام بالعملة المحلية مقارنةً بفئات CCHI' },
        ]}
      />

      <CalculatorSection
        id="tool"
        eyebrow="حاسبة التأمين الصحي"
        title="احسب تكلفة تأمينك الصحي"
      >
        <SaudiHealthInsuranceCalculator />
      </CalculatorSection>

      {/* Editorial: CCHI framework */}
      <CalculatorSection
        id="cchi-guide"
        eyebrow="دليل CCHI"
        title="فئات التأمين الصحي في السعودية — ما الفرق؟"
      >
        <div className="calc-editorial-body">
          <p>
            يُنظّم مجلس الضمان الصحي التعاوني (CCHI) سوق التأمين الصحي في المملكة ويُصنّف البوليصات
            إلى أربع فئات رئيسية تتدرج من الحد الأدنى الإلزامي إلى التغطية الشاملة للمدراء والتنفيذيين.
          </p>

          <table className="calc-editorial-table">
            <thead>
              <tr>
                <th>الفئة</th>
                <th>المستوى</th>
                <th>التغطية الرئيسية</th>
                <th>نطاق السعر / فرد / سنة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>B</strong></td>
                <td>أساسي (إلزامي)</td>
                <td>طوارئ + علاج أساسي + مستشفيات حكومية</td>
                <td>500 – 1,200 ر.س</td>
              </tr>
              <tr>
                <td><strong>C</strong></td>
                <td>معياري</td>
                <td>مستشفيات خاصة + أدوية + متابعة مزمنة</td>
                <td>1,200 – 3,500 ر.س</td>
              </tr>
              <tr>
                <td><strong>D</strong></td>
                <td>مميز</td>
                <td>أفضل المستشفيات + رعاية موسعة + علاج خارجي (بعض الوثائق)</td>
                <td>3,500 – 10,000 ر.س</td>
              </tr>
              <tr>
                <td><strong>E</strong></td>
                <td>ممتاز VIP</td>
                <td>غرفة خاصة + أسنان + نظر + إخلاء طبي دولي</td>
                <td>10,000 – 30,000+ ر.س</td>
              </tr>
            </tbody>
          </table>

          <h3>العوامل التي تحرك السعر</h3>
          <ul className="calc-tip-list">
            <li><strong>العمر</strong> — أكبر محرك: ما فوق 51 سنة يرتفع القسط إلى 3× أو أكثر</li>
            <li><strong>المنطقة</strong> — جدة ومكة المكرمة أعلى بـ 8% بسبب تكاليف مقدمي الخدمة</li>
            <li><strong>الحالات الصحية السابقة</strong> — السكري وضغط الدم وأمراض القلب تُضيف 20–40%</li>
            <li><strong>حجم المجموعة</strong> — الشركات الكبيرة تحصل على أسعار أفضل من الأفراد</li>
            <li><strong>سجل المطالبات</strong> — خلو البوليصة من مطالبات العام السابق يخفض القسط</li>
          </ul>

          <h3>5 نصائح لاختيار التأمين الصحي في السعودية</h3>
          <ul className="calc-tip-list">
            <li>لا تختار الحد الأدنى (B) إذا كان لدى أحد أفراد عائلتك أمراض مزمنة — الفئة C توفر تغطية أدوية فعلية.</li>
            <li>اطلب عروضاً من 3 شركات على الأقل — الفرق قد يصل إلى 30% لنفس الفئة.</li>
            <li>تحقق من شبكة مزودي الخدمة قبل التوقيع — الفئة D بشبكة ضيقة أسوأ من C بشبكة واسعة.</li>
            <li>انتبه لفترات الانتظار للأمراض المزمنة والولادة في البوليصات الجديدة (عادةً 6–12 شهراً).</li>
            <li>احتفظ بنسخة رقمية من بطاقة التأمين وأرقام خط الطوارئ 24/7 لشركة التأمين.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن التأمين الصحي في السعودية"
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
