/**
 * components/time-now/SameTimezoneCountries.jsx
 * Pure server component — same-UTC-offset countries grid with internal links.
 * Targets: "الدول في نفس التوقيت" keyword cluster + internal linking.
 */
import Link from 'next/link';

function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return '🌐';
  return String.fromCodePoint(0x1F1E6 - 65 + cc.charCodeAt(0)) +
         String.fromCodePoint(0x1F1E6 - 65 + cc.charCodeAt(1));
}

export function SameTimezoneCountries({ countries = [], utcOffset, currentCityAr }) {
  if (!countries.length) return null;

  return (
    <section aria-labelledby="same-tz-heading">
      <h2 id="same-tz-heading"
        style={{ margin:'0 0 1rem', fontSize:'var(--text-xl)', fontWeight:'800', color:'var(--text-primary)' }}
      >
        🌍 دول تشترك في نفس التوقيت ({utcOffset})
      </h2>

      {currentCityAr && (
        <p style={{ margin:'0 0 1rem', fontSize:'var(--text-sm)', color:'var(--text-muted)', lineHeight:'1.7' }}>
          الدول التالية تتبع نفس المنطقة الزمنية مثل {currentCityAr}، أي {utcOffset} من التوقيت العالمي:
        </p>
      )}

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap:                 '0.5rem',
      }}>
        {countries.map(c => (
          <Link
            key={c.country_slug}
            href={`/time-now/${c.country_slug}`}
            style={{ textDecoration:'none' }}
            aria-label={`الوقت في ${c.country_name_ar || c.country_name_en}`}
          >
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '0.6rem',
              padding:      '0.65rem 0.9rem',
              borderRadius: '0.75rem',
              background:   'var(--bg-surface-2)',
              border:       '1px solid var(--border-default)',
              transition:   'border-color 0.15s, background 0.15s',
              cursor:       'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.background='var(--accent-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.background='var(--bg-surface-2)'; }}
            >
              <span style={{ fontSize:'1.1rem', lineHeight:1, flexShrink:0 }} aria-hidden>
                {flagEmoji(c.country_code)}
              </span>
              <span style={{ fontSize:'var(--text-sm)', fontWeight:'600', color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {c.country_name_ar || c.country_name_en}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SameTimezoneCountries;




