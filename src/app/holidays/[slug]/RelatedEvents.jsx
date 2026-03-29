/**
 * RelatedEvents — Related events section
 * Shows other events in the same category
 */

import Link from 'next/link';

export default function RelatedEvents({ events, currentSlug }) {
  if (!events?.length) return null;
  
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="related-h">
      <h2 id="related-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
        مناسبات ذات صلة
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {events.map((event) => (
          <Link
            key={event.slug}
            href={`/holidays/${event.slug}`}
            style={{
              display: 'block',
              padding: 'var(--space-4)',
              background: 'var(--bg-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-2xl)' }}>{event.emoji}</span>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  {event.name}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {event.categoryName}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {event.description?.substring(0, 100)}...
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
