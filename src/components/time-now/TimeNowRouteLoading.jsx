import { Globe2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export default function TimeNowRouteLoading() {
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <main className="content-col pt-24 pb-20">
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.78rem',
              color: 'var(--accent)',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            <Globe2 size={13} aria-hidden />
            الوقت الان في العالم
          </div>
          <Skeleton className="mx-auto mb-3 h-12 w-full max-w-2xl bg-[var(--bg-surface-2)]" />
          <Skeleton className="mx-auto h-5 w-full max-w-xl bg-[var(--bg-surface-2)]" />
        </header>

        <section aria-hidden="true" style={{ marginBottom: '1.5rem', maxWidth: '600px', marginInline: 'auto' }}>
          <Skeleton className="h-16 w-full rounded-[1.5rem] bg-[var(--bg-surface-2)]" />
        </section>

        <section aria-hidden="true" style={{ marginBottom: '3rem', maxWidth: '800px', marginInline: 'auto' }}>
          <Skeleton className="h-80 w-full rounded-[2rem] bg-[var(--bg-surface-2)]" />
        </section>

        <section aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.5rem', marginBottom: '2rem' }}>
          {Array.from({ length: 18 }).map((_, index) => (
            <Skeleton
              key={`time-now-loading-chip-${index}`}
              className="h-[52px] rounded-[var(--radius-lg)] bg-[var(--bg-surface-2)]"
            />
          ))}
        </section>

        <section className="card" aria-hidden="true" style={{ marginBottom: '1.5rem' }}>
          <Skeleton className="h-8 w-56 mb-3 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-full mb-2 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-4/5 mb-6 bg-[var(--bg-surface-2)]" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={`time-now-loading-city-card-${index}`}
                className="h-28 rounded-[var(--radius-lg)] bg-[var(--bg-surface-2)]"
              />
            ))}
          </div>
        </section>

        <section className="card" aria-hidden="true">
          <Skeleton className="h-8 w-48 mb-3 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-full mb-2 bg-[var(--bg-surface-2)]" />
          <Skeleton className="h-4 w-3/4 mb-5 bg-[var(--bg-surface-2)]" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={`time-now-loading-country-pill-${index}`}
                className="h-11 w-40 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)]"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
