import Link from 'next/link';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, SITE_CONTACT_EMAIL, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/terms`;

export const metadata = buildCanonicalMetadata({
  title: 'شروط الاستخدام',
  description:
    `شروط استخدام ${SITE_BRAND}، بما يشمل حدود الاستخدام المقبول، الملكية الفكرية، الروابط الخارجية، وطبيعة الأدوات والمحتوى المعروض داخل الموقع.`,
  keywords: [
    `شروط الاستخدام ${SITE_BRAND}`,
    `شروط موقع ${SITE_BRAND}`,
    'استخدام الموقع',
    'الملكية الفكرية للموقع',
    'شروط الأدوات والمحتوى',
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

export default function TermsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `شروط الاستخدام | ${SITE_BRAND}`,
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
            شروط الاستخدام
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
            قواعد استخدام {SITE_BRAND} بصورة واضحة ومباشرة
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            باستخدامك هذا الموقع فأنت توافق على استخدامه كمنصة معلوماتية وأدوات مساعدة، مع
            احترام حدود الاستخدام المعقول وحقوق المحتوى وطبيعة البيانات المعروضة فيه.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <Section title="1. طبيعة الخدمة">
            <p>
              يقدم {SITE_BRAND} صفحات وأدوات تخص الوقت الحالي، مواقيت الصلاة، فرق التوقيت،
              التواريخ، والمناسبات، إضافة إلى بعض الصفحات الاقتصادية التفسيرية. هذه الخدمة
              معلوماتية وإرشادية بالدرجة الأولى، وقد تتغير بعض البيانات بحسب المصدر أو الجهة
              الرسمية أو المنطقة الزمنية أو التحديثات التقنية.
            </p>
            <p>
              استمرارك في استخدام الموقع يعني أنك تتفهم أن بعض النتائج تعتمد على الحساب أو
              التقدير أو البيانات المتاحة وقت الطلب، وأن التحقق من المصدر الرسمي يبقى مطلوباً
              عندما تكون الدقة النهائية حاسمة.
            </p>
          </Section>

          <Section title="2. الاستخدام المقبول">
            <p>
              يمكنك استخدام الموقع للأغراض الشخصية أو المهنية المشروعة، بما في ذلك القراءة،
              المقارنة، الطباعة، أو مشاركة الروابط. ولا يجوز استخدامه بطريقة تضر بتوافر الخدمة
              أو تتجاوز حدود الاستخدام الطبيعي أو تحاول الوصول غير المصرح به إلى البنية
              الداخلية أو واجهات الإدارة أو الخدمات الخلفية.
            </p>
            <p>
              كما لا يجوز نسخ الموقع بالكامل، أو إعادة نشر المحتوى آلياً على نطاق واسع، أو
              استخدامه كأساس لخدمة مضللة توحي بعلاقة رسمية أو شراكة غير موجودة.
            </p>
          </Section>

          <Section title="3. الملكية الفكرية والمحتوى">
            <p>
              يبقى تصميم الموقع، بنية الصفحات، النصوص الأصلية، الترتيب التحريري، والواجهة
              البرمجية جزءاً من أصول المشروع، ما لم يُذكر خلاف ذلك. يمكنك الاقتباس المحدود مع
              الإحالة الواضحة، لكن لا يجوز إعادة نسخ المحتوى الكامل أو إعادة توزيع المواد
              الأصلية على نحو يضر بالمشروع أو يوهم بأنها صادرة عن جهة أخرى.
            </p>
          </Section>

          <Section title="4. الروابط والخدمات الخارجية">
            <p>
              قد يحتوي الموقع على روابط أو أدوات أو تكاملات تخص أطرافاً خارجية، مثل تحليلات
              الاستخدام أو الإعلانات أو خدمات البيانات. نحن نحاول اختيار ما يخدم التجربة، لكننا
              لا نتحكم في سياسات تلك الجهات أو محتواها الخارجي، ويخضع استخدامها لشروطها الخاصة.
            </p>
          </Section>

          <Section title="5. حدود المسؤولية">
            <p>
              نحن نبذل جهداً لتحسين الدقة والوضوح والاستقرار، لكن لا يمكن ضمان أن كل صفحة أو
              أداة ستظل متاحة أو خالية من الانقطاع أو الأخطاء في جميع الأوقات. استخدامك للموقع
              يكون على مسؤوليتك الخاصة، خصوصاً عند اعتمادك على بيانات تتعلق بالتداول أو
              المناسبات الرسمية أو قرارات تحتاج تحققاً نهائياً.
            </p>
            <p>
              لمزيد من التفاصيل حول هذا الجانب، راجع صفحة{' '}
              <Link href="/disclaimer" style={{ color: 'var(--accent-alt)' }}>
                إخلاء المسؤولية
              </Link>
              .
            </p>
          </Section>

          <Section title="6. التحديثات والتواصل">
            <p>
              قد نحدّث هذه الشروط عند تغيّر طبيعة الخدمات أو سياسات التشغيل أو وسائل القياس
              والإعلانات. أحدث نسخة منشورة على هذه الصفحة هي المعتمدة. إذا كانت لديك ملاحظة أو
              استفسار، يمكنك التواصل عبر البريد:
              {' '}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} style={{ color: 'var(--accent-alt)' }}>
                {SITE_CONTACT_EMAIL}
              </a>
              .
            </p>
            <p>آخر تحديث لهذه الصفحة: 10 أبريل 2026.</p>
          </Section>
        </div>
      </main>
    </div>
  );
}
