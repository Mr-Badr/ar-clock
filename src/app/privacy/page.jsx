import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/privacy`;

export const metadata = buildCanonicalMetadata({
  title: 'سياسة الخصوصية',
  description:
    'سياسة الخصوصية الخاصة بموقع ميقات: ما البيانات التي قد تُستخدم داخل التطبيق، وكيف نتعامل مع التخزين المحلي وخدمات الطرف الثالث وطلبات التصحيح.',
  keywords: [
    'سياسة الخصوصية ميقات',
    'خصوصية الموقع',
    'بيانات الموقع الجغرافي',
    'التخزين المحلي في المتصفح',
    'اتصال ميقات',
  ],
  url: PAGE_URL,
});

function PolicySection({ title, children }) {
  return (
    <section
      style={{
        background: 'var(--bg-surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-6)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'grid', gap: 'var(--space-4)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `سياسة الخصوصية | ${SITE_BRAND}`,
    url: PAGE_URL,
    inLanguage: 'ar',
    dateModified: '2026-04-03',
  };

  return (
    <div className="bg-base" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="container" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-16)' }}>
        <header style={{ maxWidth: '74ch', marginBottom: 'var(--space-10)' }}>
          <p
            style={{
              display: 'inline-flex',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--border-accent)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-4)',
            }}
          >
            سياسة الخصوصية
          </p>
          <h1
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-4)',
            }}
          >
            كيف يتعامل {SITE_BRAND} مع البيانات والميزات الحساسة
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            هذه الصفحة تلخص بشكل واضح نوع البيانات التي قد تُستخدم داخل التطبيق، ولماذا تُستخدم،
            وما الذي يُخزَّن محلياً في المتصفح، وكيف يمكن طلب تصحيح أو حذف أي معلومة تحتاج مراجعة.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <PolicySection title="1. البيانات التي قد نستخدمها داخل الموقع">
            <p>
              لا يطلب الموقع إنشاء حساب مستخدم حتى تستفيد من أغلب الصفحات. لكن بعض الأدوات قد
              تعتمد على مدخلات تقدمها أنت مباشرة، مثل اسم المدينة أو الدولة أو المدن التي تختارها
              للمقارنة أو البحث.
            </p>
            <p>
              بعض الواجهات قد تستخدم موقعك الجغرافي إذا منحت الإذن في المتصفح، وذلك لتقريب الوقت
              المحلي أو المدينة الأقرب أو تجربة البحث. ويمكنك استخدام الموقع بدون منح هذا الإذن.
            </p>
          </PolicySection>

          <PolicySection title="2. التخزين المحلي داخل المتصفح">
            <p>
              يستخدم التطبيق التخزين المحلي `localStorage` و`sessionStorage` في بعض الأدوات لحفظ
              تفضيلات مثل المدينة المختارة، المنطقة الزمنية، المذهب أو طريقة الحساب، وبعض الحالات
              المؤقتة التي تجعل الواجهة أسرع وأكثر راحة.
            </p>
            <p>
              هذه البيانات تبقى عادة على جهازك داخل المتصفح ولا تُعد حساباً شخصياً على خوادمنا.
              ويمكنك حذفها في أي وقت من إعدادات المتصفح.
            </p>
          </PolicySection>

          <PolicySection title="3. خدمات الطرف الثالث">
            <p>
              يعتمد الموقع على خدمات وواجهات خارجية لتشغيل بعض البيانات، مثل قواعد بيانات المدن
              والدول، وخدمات تقريب الموقع الجغرافي، وبعض مصادر التواريخ أو الحسابات الزمنية. كما قد
              تعتمد بعض الأجزاء على مزودي طقس أو موقع جغرافي عند الحاجة الوظيفية.
            </p>
            <p>
              بحسب إعدادات النشر، قد تُفعَّل أدوات قياس الأداء مثل Google Analytics أو Google Tag
              Manager، وقد تُفعَّل وحدات إعلانية من Google AdSense. عند تشغيل شريط الموافقة في
              الواجهة، لا تُحمَّل أدوات القياس أو الإعلانات التسويقية إلا بعد منح الموافقة المناسبة.
            </p>
          </PolicySection>

          <PolicySection title="4. ما الذي لا نقوم به حالياً">
            <p>
              لا نوفر حالياً نظام عضويات أو ملفات شخصية عامة للمستخدمين داخل الموقع. كما أننا لا
              نطلب منك إدخال بيانات دفع لاستخدام الأدوات الأساسية المعروضة حالياً.
            </p>
            <p>
              لا نبيع بياناتك الشخصية لطرف ثالث. وإذا لاحظت أي نص قانوني هنا لا يطابق السلوك الفعلي
              للموقع أو إعدادات النشر، فهذا يعني أننا بحاجة إلى تحديث الوثيقة، ويمكنك الإبلاغ مباشرة
              عبر البريد التالي:
              {' '}
              <a href="mailto:mr.elharchali@gmail.com" style={{ color: 'var(--accent-alt)' }}>
                mr.elharchali@gmail.com
              </a>
              .
            </p>
          </PolicySection>

          <PolicySection title="5. التواصل وطلبات التصحيح">
            <p>
              إذا كنت ترغب في الإبلاغ عن خطأ في المحتوى، أو لديك سؤال متعلق بالخصوصية، أو تحتاج إلى
              توضيح بخصوص البيانات المستخدمة في صفحة معينة، يمكنك مراسلتنا على:
              {' '}
              <a href="mailto:mr.elharchali@gmail.com" style={{ color: 'var(--accent-alt)' }}>
                mr.elharchali@gmail.com
              </a>
              .
            </p>
            <p>آخر تحديث لهذه الصفحة: 3 أبريل 2026.</p>
          </PolicySection>
        </div>
      </main>
    </div>
  );
}
