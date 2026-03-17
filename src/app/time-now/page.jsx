// app/time-now/page.jsx
import { Suspense } from 'react';
import { Globe2, MapPin } from 'lucide-react';
import TimeNowHero from '@/components/time-now/TimeNowHero';
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
            الوقت الان في {c.name_ar} — كم الساعة في {c.name_ar} — الساعة في {c.name_en} — توقيت {c.name_ar} — الوقت الحالي في {c.name_ar} — current time in {c.name_en} — {c.name_en} time now
          </li>
        ))}
      </ul>

      <main style={{ maxWidth: '940px', margin: '0 auto' }}>

        {/* ── Page Header (Centered Hero Style) ── */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.9rem', borderRadius: '999px',
            background: 'var(--accent-soft)', border: '1px solid var(--border-accent)',
            fontSize: '0.78rem', color: 'var(--accent)', fontWeight: '700',
            marginBottom: '1rem',
          }}>
            <Globe2 size={13} aria-hidden /> 
            الوقت الان في العالم  
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2rem)', fontWeight: '900', lineHeight: 1.1, margin: '0 auto 0.75rem', maxWidth: '800px' }}>
            الساعة الان في <span className="text-accent">مدينتك</span> — كل ما يتعلق بالوقت في مكان واحد
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 auto', maxWidth: '520px', lineHeight: 1.6 }}>
            اعرف توقيتك بدقة لحظة بلحظة، واستكشف كل ما تحتاجه لفهم الوقت حولك وفي العالم في تجربة بسيطة وسريعة.
          </p>
        </header>

        {/* ── Single Search Bar (Above Clock) ── */}
        <section aria-label="البحث عن مدينة" style={{ marginBottom: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <SearchCity mode="time-now" preloadedCountries={allCountries} />
        </section>

        {/* ── Local Clock (Standardized Width) ── */}
        <section aria-label="توقيتك المحلي" style={{ marginBottom: '4rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Suspense fallback={<div style={{ height: '320px', borderRadius: '1rem', background: 'var(--bg-surface-2)', opacity: 0.5, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />}>
              <TimeNowHero cityNameAr="توقيتك المحلي" />
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
