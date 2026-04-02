import { Mail, ShieldCheck, Wrench } from 'lucide-react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/contact`;

export const metadata = buildCanonicalMetadata({
  title: 'اتصل بنا',
  description:
    'تواصل مع ميقات للإبلاغ عن أخطاء المحتوى، ملاحظات الـ SEO، أو الاستفسارات العامة حول صفحات الوقت والمناسبات والتواريخ.',
  keywords: [
    'اتصل بنا ميقات',
    'مراسلة ميقات',
    'تصحيح خطأ في الموقع',
    'ملاحظات SEO',
    'التواصل مع المطور',
  ],
  url: PAGE_URL,
});

const CONTACT_TOPICS = [
  {
    icon: Wrench,
    title: 'أخطاء المحتوى أو التواريخ',
    body: 'إذا لاحظت تاريخاً غير دقيق أو وصفاً يحتاج تصحيحاً، أرسل الرابط والملاحظة وسنراجعها.',
  },
  {
    icon: ShieldCheck,
    title: 'الخصوصية والسياسات',
    body: 'يمكنك استخدام هذه الصفحة لأي استفسار متعلق بالخصوصية أو بطلبات التوضيح حول سلوك التطبيق.',
  },
];

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `اتصل بنا | ${SITE_BRAND}`,
    url: PAGE_URL,
    inLanguage: 'ar',
  };

  return (
    <div className="bg-base" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="container" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-16)' }}>
        <header style={{ maxWidth: '70ch', marginBottom: 'var(--space-10)' }}>
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
            تواصل مباشر
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
            مراسلة فريق {SITE_BRAND}
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            الموقع يُدار بشكل مستقل، لذلك أفضل طريقة للتواصل هي البريد المباشر مع وصف واضح
            للمشكلة أو الملاحظة والرابط المقصود.
          </p>
        </header>

        <section
          style={{
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <a
            href="mailto:mr.elharchali@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--accent-alt)',
              textDecoration: 'none',
            }}
          >
            <Mail size={18} />
            mr.elharchali@gmail.com
          </a>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginTop: 'var(--space-4)' }}>
            من المفيد عند المراسلة أن تتضمن رسالتك رابط الصفحة، نوع الملاحظة، وما الذي تتوقع رؤيته
            بشكل صحيح حتى تكون المراجعة أسرع.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
          {CONTACT_TOPICS.map((item) => {
            const Icon = item.icon;
            return (
              <section
                key={item.title}
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-2xl)',
                  padding: 'var(--space-6)',
                }}
              >
                <span
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--border-accent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <Icon size={18} color="var(--accent-alt)" />
                </span>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                  {item.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                  {item.body}
                </p>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
