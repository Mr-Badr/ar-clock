import { Globe2, MapPin } from 'lucide-react';
import LiveClock from '@/components/clocks/LiveClock';
import SearchCity from '@/components/SearchCity.client';
import TimeNowClient from './TimeNowClient';
import { getAllCountries } from '@/lib/db/queries/countries';



export default async function TimeNowPage() {
  const allCountries = await getAllCountries();

  const arabTags = ['SA','EG','AE','KW','QA','BH','OM','IQ','JO','LB','SY','PS','YE','MA','DZ','TN','LY','SD','SO','MR','DJ'];
  const arabCountries = allCountries.filter(c => arabTags.includes(c.country_code));
  const worldCountries = allCountries.filter(c => !arabTags.includes(c.country_code));

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      {/* Hidden SEO keyword prose (crawlable, invisible) */}
      <ul aria-hidden="true" style={{ display: 'none' }}>
        {allCountries.map((c) => (
          <li key={c.country_slug}>
            الوقت الآن في {c.name_ar} — كم الساعة في {c.name_ar} — الساعة في {c.name_en} — توقيت {c.name_ar} — الوقت الحالي في {c.name_ar} — current time in {c.name_en} — {c.name_en} time now
          </li>
        ))}
      </ul>

      <main style={{ maxWidth: '940px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) 1rem' }}>

        {/* ── Page Header ── */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.9rem', borderRadius: '999px',
            background: 'var(--accent-soft)', border: '1px solid var(--border-accent)',
            fontSize: '0.78rem', color: 'var(--accent)', fontWeight: '700',
            marginBottom: '0.75rem',
          }}>
            <Globe2 size={13} aria-hidden /> ساعة عالمية حية
          </div>
          <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.8rem)', fontWeight: '800', lineHeight: 1.15, margin: '0 0 0.4rem' }}>
            الوقت الآن في أي دولة
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, maxWidth: '460px' }}>
            ساعة حية دقيقة حتى الثانية لأي مدينة في العالم. التاريخ الميلادي والهجري والمنطقة الزمنية.
          </p>
        </header>

        {/* ── Local Clock ── */}
        <section aria-label="توقيتك المحلي" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: '600',
            marginBottom: '0.6rem',
          }}>
            <MapPin size={13} aria-hidden />
            توقيتك المحلي
          </div>
          <div style={{ maxWidth: '580px' }}>
            <LiveClock />
          </div>
        </section>

        {/* ── Single Search Bar ── */}
        <section aria-label="البحث عن مدينة" style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: '600',
            marginBottom: '0.6rem',
          }}>
            <Globe2 size={13} aria-hidden />
            اعرف الوقت في أي مدينة أو دولة
          </div>
          <div style={{ maxWidth: '580px' }}>
            <SearchCity mode="time-now" />
          </div>
        </section>

        {/* ── Country Grids (Client) ── */}
        <TimeNowClient arabCountries={arabCountries} worldCountries={worldCountries} />

      </main>
    </div>
  );
}
