import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, SITE_CONTACT_EMAIL, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/about`;

export const metadata = buildCanonicalMetadata({
  title: 'من نحن',
  description:
    `تعرف على مشروع ${SITE_BRAND}، رؤيته، وكيف بُني كمنصة عربية مستقلة للوقت والمواعيد والمناسبات مع تركيز قوي على الدقة والـ SEO.`,
  keywords: [
    `من نحن ${SITE_BRAND}`,
    `عن موقع ${SITE_BRAND}`,
    'منصة عربية للوقت',
    'عداد المناسبات العربي',
    `مواقيت الصلاة ${SITE_BRAND}`,
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
          marginBottom: 'var(--space-4)',
          color: 'var(--text-primary)',
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

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `من نحن | ${SITE_BRAND}`,
    url: PAGE_URL,
    inLanguage: 'ar',
    description:
      `صفحة تعريفية بمشروع ${SITE_BRAND}، وهو موقع عربي مستقل يركز على الوقت، التواريخ، والمناسبات بصفحات سريعة ومهيأة لمحركات البحث.`,
    publisher: {
      '@type': 'Organization',
      name: SITE_BRAND,
      url: SITE_URL,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_CONTACT_EMAIL,
        availableLanguage: ['ar'],
      },
    },
  };

  return (
    <div className="bg-base" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="container" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-16)' }}>
        <header style={{ maxWidth: '72ch', marginBottom: 'var(--space-10)' }}>
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
            عن {SITE_BRAND}
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
            مشروع عربي مستقل لبناء صفحات وقت ومناسبات دقيقة وسريعة
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            {SITE_BRAND} مشروع يطوره ويديره مطور واحد بشكل مستقل، بهدف بناء مرجع عربي
            موثوق للوقت الحالي، مواقيت الصلاة، التواريخ، وعدّادات المناسبات مع تجربة سريعة
            ومحتوى منظّم ومهيأ لمحركات البحث.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <Section title="ما الذي نبنيه هنا؟">
            <p>
              نركز على صفحات تحل نية بحث واضحة: معرفة الوقت الآن، الوصول إلى مواقيت الصلاة،
              مقارنة فرق التوقيت، ومعرفة موعد المناسبات القادمة. هذا يعني أن كل صفحة يجب أن تكون
              مفيدة فعلاً، سريعة، وواضحة من أول شاشة.
            </p>
            <p>
              نعتمد على بنية Next.js حديثة، ونفصل بين طبقة البيانات، التوليد، والعرض حتى يصبح
              التوسع أسهل على مستوى المحتوى والـ SEO معاً.
            </p>
          </Section>

          <Section title="معايير الجودة التي نعمل بها">
            <p>
              نعطي أولوية عالية للدقة، خاصة في صفحات التواريخ والمناسبات الدينية والوطنية. كما
              نهتم بأن تكون البيانات قابلة للتوسع، وأن تكون كل صفحة قابلة للفهرسة ومزودة
              بالـ metadata والـ structured data وروابط داخلية سليمة.
            </p>
            <p>
              وعندما يكون التاريخ تقديرياً أو مرتبطاً بإعلان رسمي، نوضح ذلك داخل المحتوى بدلاً من
              عرض معلومة تبدو نهائية وهي ليست كذلك.
            </p>
          </Section>

          <Section title="من يدير المشروع؟">
            <p>
              المشروع يُدار بشكل مستقل من مطور واحد، مع تركيز على بناء نظام نظيف يسهل تطويره على
              المدى الطويل. هذا يعني أن قرارات المعمارية، جودة المحتوى، والجاهزية الإنتاجية كلها
              تُراجع بعناية لأن أي تعقيد زائد سيؤثر مباشرة على سرعة التوسع.
            </p>
            <p>
              إذا لاحظت خطأ في تاريخ أو وصف أو صفحة قانونية أو كانت لديك ملاحظة تخص المحتوى أو
              الأداء، يمكنك التواصل مباشرة عبر البريد التالي:
              {' '}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} style={{ color: 'var(--accent-alt)' }}>
                {SITE_CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}
