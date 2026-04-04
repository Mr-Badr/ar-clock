import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import Link from 'next/link';

import MapPageClient from './MapPageClient';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'خريطة الوقت العالمي',
  description:
    'استكشف الوقت الحالي عبر خريطة تفاعلية للمدن والمناطق الزمنية، مع مقارنة سريعة بين أهم المدن العربية والعالمية.',
  keywords: [
    'خريطة الوقت العالمي',
    'خريطة المناطق الزمنية',
    'الوقت في العالم',
    'توقيت المدن',
    'world time map',
  ],
  url: `${SITE_URL}/map`,
});

export default function MapPage() {
  return (
    <main className="content-col pt-24 pb-20 mt-12" dir="rtl">
      <section
        className="card card--glass mb-8"
        style={{ padding: 'var(--space-8)', textAlign: 'center' }}
      >
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
          خريطة الوقت العالمي
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 'var(--font-black)',
            color: 'var(--text-primary)',
            lineHeight: 'var(--leading-tight)',
            marginBottom: 'var(--space-4)',
          }}
        >
          خريطة تفاعلية لمقارنة الوقت الآن في أهم مدن العالم
        </h1>
        <p
          style={{
            maxWidth: '72ch',
            margin: '0 auto',
            color: 'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          تعرض هذه الصفحة الوقت الحالي على خريطة العالم بشكل تفاعلي، مع إبراز المدن
          العربية والعالمية الأكثر بحثاً، وفروقات المناطق الزمنية، وروابط مباشرة إلى
          صفحات الوقت الآن وفرق التوقيت داخل الموقع.
        </p>
      </section>

      <section className="mb-8">
        <MapPageClient />
      </section>

      <section className="card mb-8" style={{ padding: 'var(--space-6)' }}>
        <h2
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          ماذا تفيدك خريطة الوقت؟
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)' }}>
          تساعد خريطة الوقت العالمي على فهم التوزيع الفوري للمناطق الزمنية بين الشرق
          والغرب، ومعرفة الساعة الآن في المدن الكبرى، ورؤية الفروق الزمنية بشكل بصري
          أسهل من القوائم التقليدية.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
          إذا كنت تبحث عن الوقت الآن في مدينة محددة أو تريد مقارنة مدينتين بدقة أكبر،
          فستجد صفحات داخلية مهيأة لذلك مع محتوى ظاهر لمحركات البحث وروابط مباشرة إلى
          نتائج أكثر تفصيلاً.
        </p>
      </section>

      <nav
        aria-label="روابط أدوات الوقت"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
      >
        {[
          { href: '/time-now', label: 'الوقت الآن' },
          { href: '/time-difference', label: 'فرق التوقيت' },
          { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.7rem 1rem',
              borderRadius: '999px',
              textDecoration: 'none',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-default)',
              fontWeight: '600',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
