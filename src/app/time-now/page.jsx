import { Suspense } from 'react';
import { Globe2, MapPin } from 'lucide-react';
import LiveClock, { LiveClockSkeleton } from '@/components/clocks/LiveClock';
import SearchCity from '@/components/SearchCityWrapper.client';
import TimeNowClient from './TimeNowClient';
import { getCountriesAction } from '@/app/actions/location';




export default async function TimeNowPage() {
  const allCountries = await getCountriesAction();

  const arabTags = ['SA', 'EG', 'AE', 'KW', 'QA', 'BH', 'OM', 'IQ', 'JO', 'LB', 'SY', 'PS', 'YE', 'MA', 'DZ', 'TN', 'LY', 'SD', 'SO', 'MR', 'DJ'];
  const arabCountries = allCountries.filter(c => arabTags.includes(c.country_code));
  const worldCountries = allCountries.filter(c => !arabTags.includes(c.country_code));

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      {/* Hidden SEO keyword prose — sr-only so it's crawlable but invisible */}
      <ul className="sr-only" aria-hidden="true">
        {allCountries.map((c) => (
          <li key={c.country_slug}>
            الوقت الآن في {c.name_ar} — كم الساعة في {c.name_ar} — الساعة في {c.name_en} — توقيت {c.name_ar} — الوقت الحالي في {c.name_ar} — current time in {c.name_en} — {c.name_en} time now
          </li>
        ))}
      </ul>

      <main style={{ maxWidth: '940px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) 1rem' }}>

        {/* ── Page Header (Centered Hero Style) ── */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.9rem', borderRadius: '999px',
            background: 'var(--accent-soft)', border: '1px solid var(--border-accent)',
            fontSize: '0.78rem', color: 'var(--accent)', fontWeight: '700',
            marginBottom: '1rem',
          }}>
            <Globe2 size={13} aria-hidden /> ساعة عالمية حية
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: '900', lineHeight: 1.1, margin: '0 auto 0.75rem', maxWidth: '800px' }}>
            الوقت الآن في أي <span className="text-accent">دولة</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 auto', maxWidth: '520px', lineHeight: 1.6 }}>
            ساعة حية دقيقة حتى الثانية لأي مدينة في العالم. التاريخ الميلادي والهجري والمنطقة الزمنية.
          </p>
        </header>

        {/* ── Single Search Bar (Above Clock) ── */}
        <section aria-label="البحث عن مدينة" style={{ marginBottom: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <SearchCity mode="time-now" preloadedCountries={allCountries} />
        </section>

        {/* ── Local Clock (Standardized Width) ── */}
        <section aria-label="توقيتك المحلي" style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600',
            marginBottom: '0.75rem',
          }}>
            <MapPin size={14} aria-hidden />
            توقيتك المحلي الآن
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Suspense fallback={<LiveClockSkeleton />}>
              <LiveClock />
            </Suspense>
          </div>
        </section>

        {/* ── Country Grids (Client) ── */}
        <Suspense fallback={
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.45rem' }}>
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} style={{ height: '52px', borderRadius: '0.875rem', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', opacity: 0.6 }} />
            ))}
          </div>
        }>
          <TimeNowClient arabCountries={arabCountries} worldCountries={worldCountries} />
        </Suspense>

      </main>
    </div>
  );
}
