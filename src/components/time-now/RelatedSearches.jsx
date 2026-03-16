'use client';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════════════════
   RelatedSearches — server component
   Internal linking grid for SEO + UX.
   Targets the "بحث ذو صلة" / "عمليات بحث مشابهة" SERP feature.
═══════════════════════════════════════════════════════════════════════ */

const TOP_COUNTRIES = [
  { slug:'egypt',        nameAr:'مصر',        code:'EG' },
  { slug:'saudi-arabia', nameAr:'السعودية',   code:'SA' },
  { slug:'uae',          nameAr:'الإمارات',   code:'AE' },
  { slug:'morocco',      nameAr:'المغرب',     code:'MA' },
  { slug:'algeria',      nameAr:'الجزائر',    code:'DZ' },
  { slug:'qatar',        nameAr:'قطر',        code:'QA' },
  { slug:'kuwait',       nameAr:'الكويت',     code:'KW' },
  { slug:'iraq',         nameAr:'العراق',     code:'IQ' },
  { slug:'jordan',       nameAr:'الأردن',     code:'JO' },
  { slug:'lebanon',      nameAr:'لبنان',      code:'LB' },
  { slug:'tunisia',      nameAr:'تونس',       code:'TN' },
  { slug:'libya',        nameAr:'ليبيا',      code:'LY' },
  { slug:'sudan',        nameAr:'السودان',    code:'SD' },
  { slug:'bahrain',      nameAr:'البحرين',    code:'BH' },
  { slug:'oman',         nameAr:'عُمان',      code:'OM' },
  { slug:'turkey',       nameAr:'تركيا',      code:'TR' },
  { slug:'united-kingdom',nameAr:'بريطانيا', code:'GB' },
  { slug:'france',       nameAr:'فرنسا',      code:'FR' },
  { slug:'united-states',nameAr:'الولايات المتحدة', code:'US' },
  { slug:'germany',      nameAr:'ألمانيا',    code:'DE' },
];

function flagEmoji2(cc) {
  if (!cc || cc.length !== 2) return '🌐';
  return String.fromCodePoint(0x1F1E6 - 65 + cc.charCodeAt(0)) +
         String.fromCodePoint(0x1F1E6 - 65 + cc.charCodeAt(1));
}

export function RelatedSearches({ currentCountrySlug, currentCountryAr, currentCityAr }) {
  const related = TOP_COUNTRIES.filter(c => c.slug !== currentCountrySlug).slice(0, 12);

  return (
    <section aria-labelledby="related-searches-heading">
      <h2 id="related-searches-heading"
        style={{ margin:'0 0 1rem', fontSize:'var(--text-xl)', fontWeight:'800', color:'var(--text-primary)' }}
      >
        🔍 عمليات بحث مشابهة
      </h2>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap:                 '0.5rem',
      }}>
        {related.map(c => (
          <Link
            key={c.slug}
            href={`/time-now/${c.slug}`}
            style={{ textDecoration:'none' }}
          >
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '0.6rem',
              padding:      '0.6rem 0.875rem',
              borderRadius: '0.75rem',
              background:   'var(--bg-surface-2)',
              border:       '1px solid var(--border-default)',
              fontSize:     'var(--text-sm)',
              fontWeight:   '500',
              color:        'var(--text-secondary)',
              transition:   'border-color 0.15s, color 0.15s',
              cursor:       'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.color='var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.color='var(--text-secondary)'; }}
            >
              <span style={{ fontSize:'0.9rem', lineHeight:1, flexShrink:0 }} aria-hidden>
                {flagEmoji2(c.code)}
              </span>
              <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                الساعة في {c.nameAr}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Keyword-rich hidden list */}
      <ul aria-hidden="true" style={{ display:'none' }}>
        {related.map(c => (
          <li key={c.slug}>الوقت الآن في {c.nameAr} — كم الساعة في {c.nameAr}</li>
        ))}
        {currentCityAr && <li>الوقت الآن في {currentCityAr} — الساعة في {currentCityAr}</li>}
      </ul>
    </section>
  );
}

export default RelatedSearches;