import Link from 'next/link';

import { getPopularTimeNowCountryLinks } from '@/lib/seo/popular-links';

export async function RelatedSearches({ currentCountrySlug, currentCityAr }) {
  const related = (await getPopularTimeNowCountryLinks(20))
    .filter((country) => country.countrySlug !== currentCountrySlug)
    .slice(0, 12);

  return (
    <section aria-labelledby="related-searches-heading">
      <h2
        id="related-searches-heading"
        style={{
          margin: '0 0 1rem',
          fontSize: 'var(--text-xl)',
          fontWeight: '800',
          color: 'var(--text-primary)',
        }}
      >
        عمليات بحث مشابهة
      </h2>

      <p
        style={{
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          marginBottom: '1rem',
          maxWidth: '68ch',
        }}
      >
        تنتقل عمليات البحث كثيراً بين صفحات "الوقت الآن" في الدول والمدن القريبة.
        {currentCityAr ? ` إذا كنت تتابع ${currentCityAr}، فهذه صفحات مرتبطة يبحث عنها المستخدمون أيضاً.` : ' هذه صفحات مرتبطة يبحث عنها المستخدمون أيضاً.'}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {related.map((country) => (
          <Link
            key={country.href}
            href={country.href}
            style={{ textDecoration: 'none' }}
            title={country.description}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 0.875rem',
                borderRadius: '0.75rem',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-default)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {country.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedSearches;
