import Link from 'next/link';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, SITE_CONTACT_EMAIL, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/editorial-policy`;

export const metadata = buildCanonicalMetadata({
  title: 'السياسة التحريرية',
  description:
    `توضح هذه الصفحة كيف ينشئ ${SITE_BRAND} المحتوى، وكيف نراجع التواريخ والبيانات، ومتى نستخدم المصادر الرسمية، وكيف نستقبل طلبات التصحيح والتحديث.`,
  keywords: [
    `السياسة التحريرية ${SITE_BRAND}`,
    `معايير المحتوى ${SITE_BRAND}`,
    'تصحيح المحتوى',
    'مصادر التواريخ والمعلومات',
    'سياسة التحديث والمراجعة',
  ],
  url: PAGE_URL,
});

function Section({ title, children }) {
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

export default function EditorialPolicyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `السياسة التحريرية | ${SITE_BRAND}`,
    url: PAGE_URL,
    inLanguage: 'ar',
    dateModified: '2026-04-10',
  };

  return (
    <div className="bg-base" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="container" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-16)' }}>
        <header style={{ maxWidth: '76ch', marginBottom: 'var(--space-10)' }}>
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
            السياسة التحريرية
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
            كيف ننشئ المحتوى ونراجعه ونحدّثه في {SITE_BRAND}
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            هدفنا أن تكون صفحات الوقت والتاريخ والمناسبات والمقارنات مفيدة فعلاً، لا مجرد صفحات
            مكررة لمحركات البحث. لذلك نعتمد على مراجعة بنيوية واضحة للمصادر، ونشير عندما تكون
            المعلومة تقديرية أو قابلة للتغيّر أو مرتبطة بجهة رسمية محددة.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <Section title="1. فلسفة المحتوى">
            <p>
              نبني المحتوى حول نية البحث الحقيقية للمستخدم العربي: معرفة الوقت الآن، مواقيت
              الصلاة، فرق التوقيت، تاريخ اليوم، أو موعد مناسبة قادمة. هذا يعني أن الصفحة يجب أن
              تجيب أولاً بشكل مباشر، ثم توسّع الشرح عند الحاجة، مع الحفاظ على السرعة والبنية
              الواضحة واللغة العربية السليمة.
            </p>
          </Section>

          <Section title="2. كيف نتحقق من المعلومات؟">
            <p>
              عندما تكون المعلومة ثابتة نسبياً، نعتمد على قواعد البيانات الداخلية والحسابات
              الزمنية الموثقة. وعندما تكون المعلومة قابلة للتغيّر، مثل بعض التواريخ الرسمية أو
              مواعيد الأسواق أو النتائج المرتبطة بإعلان جهة معينة، نحاول ربط المحتوى بالمصدر
              الرسمي أو الإشارة إلى أن الموعد تقريبي أو ينتظر اعتماداً نهائياً.
            </p>
            <p>
              في المناسبات الإسلامية، نوضح الفرق بين الحساب والتقويم الرسمي والرؤية أو الإعلان
              المحلي عند الحاجة، ولا نتعامل مع التقدير على أنه حقيقة نهائية إذا لم يكن الأمر كذلك.
            </p>
          </Section>

          <Section title="3. ما الذي نرفض نشره؟">
            <p>
              لا ننشر محتوى منسوخاً أو معاد صياغته بشكل آلي من مواقع أخرى، ولا نضيف تواريخ أو
              أرقاماً غير متحقق منها لمجرد سد فراغ في الصفحة. كما لا نحول الأدوات الاقتصادية إلى
              توصيات استثمارية، ونبقي التنبيه القانوني واضحاً في الصفحات الحساسة.
            </p>
          </Section>

          <Section title="4. التحديثات والمراجعات">
            <p>
              نراجع الصفحات عالية الحساسية بشكل دوري، خصوصاً الصفحات المرتبطة بالتاريخ الحالي،
              مواقيت الصلاة، فرق التوقيت، والمناسبات القريبة. كما نضيف تحديثات عندما نكتشف فجوة
              في الربط الداخلي أو الـ metadata أو الـ structured data أو وضوح المحتوى نفسه.
            </p>
          </Section>

          <Section title="5. التصحيحات وطلبات المراجعة">
            <p>
              إذا لاحظت خطأ في تاريخ أو وصف أو وقت أو مصدر، يمكنك مراسلتنا مع رابط الصفحة
              والتصحيح المقترح عبر:
              {' '}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} style={{ color: 'var(--accent-alt)' }}>
                {SITE_CONTACT_EMAIL}
              </a>
              .
            </p>
            <p>
              كما يمكنك الرجوع إلى صفحات{' '}
              <Link href="/about" style={{ color: 'var(--accent-alt)' }}>
                من نحن
              </Link>
              {' '}و{' '}
              <Link href="/contact" style={{ color: 'var(--accent-alt)' }}>
                اتصل بنا
              </Link>
              {' '}و{' '}
              <Link href="/privacy" style={{ color: 'var(--accent-alt)' }}>
                سياسة الخصوصية
              </Link>
              {' '}للاطلاع على مزيد من سياق المشروع.
            </p>
            <p>آخر تحديث لهذه الصفحة: 10 أبريل 2026.</p>
          </Section>
        </div>
      </main>
    </div>
  );
}
