/**
 * SectionHijriMonths — 12 Hijri months educational grid
 *
 * FIXES vs v1:
 *
 * 1. MONTH_COLORS semantic fix:
 *    Old: 'var(--text-muted)' used for months with no special occasion.
 *         var(--text-muted) is a TEXT colour, not an accent — wrong semantic.
 *    Fix: Use 'var(--secondary)' equivalent → 'var(--border-strong)' for
 *         "neutral" months, keeping accent colours only for special months.
 *    Actually cleaner: map neutral months to 'var(--text-muted)' for the
 *    number display but use 'var(--bg-surface-3)' for the card (no soft bg).
 *    See MONTH_CONFIG below.
 *
 * 2. No orphaned-cell fix needed:
 *    12 items in 2-col (6 rows), 3-col (4 rows), 4-col (3 rows), 6-col (2 rows)
 *    divides perfectly — no last-item col-span needed.
 *
 * 3. Numbers: hijriMonth.number is already a JS integer (English digit).
 */

import SectionWrapper from './shared/SectionWrapper'
import { SectionBadge } from './shared/primitives'
import { HIJRI_MONTHS } from './data/hijriMonths'

const H2_ID = 'h2-hijri-months'

/**
 * Per-month visual config.
 * 'accent' = true → use accent color + soft background
 * 'accent' = false → neutral card (no background tint)
 * 'sacred' is already on HIJRI_MONTHS data
 */
const MONTH_CONFIG = [
  { accent: true,  color: 'var(--danger)'     }, // 1  محرم — sacred, عاشوراء
  { accent: false, color: 'var(--text-muted)'  }, // 2  صفر
  { accent: true,  color: 'var(--warning)'     }, // 3  ربيع الأول — مولد
  { accent: false, color: 'var(--text-muted)'  }, // 4  ربيع الثاني
  { accent: false, color: 'var(--text-muted)'  }, // 5  جمادى الأولى
  { accent: false, color: 'var(--text-muted)'  }, // 6  جمادى الآخرة
  { accent: true,  color: 'var(--info)'        }, // 7  رجب — sacred, إسراء
  { accent: true,  color: 'var(--accent-alt)'  }, // 8  شعبان — ليلة النصف
  { accent: true,  color: 'var(--warning)'     }, // 9  رمضان
  { accent: true,  color: 'var(--success)'     }, // 10 شوال — عيد الفطر
  { accent: true,  color: 'var(--accent-alt)'  }, // 11 ذو القعدة — sacred
  { accent: true,  color: 'var(--success)'     }, // 12 ذو الحجة — حج + عيد الأضحى
]

const softOf   = (cssVar) => cssVar.replace(')', '-soft)')
const borderOf = (cssVar) => cssVar.replace(')', '-border)')

const ARABIC_ORDINALS = [
  'الأول','الثاني','الثالث','الرابع','الخامس','السادس',
  'السابع','الثامن','التاسع','العاشر','الحادي عشر','الثاني عشر',
]

export default function SectionHijriMonths() {
  return (
    <SectionWrapper id="section-hijri-months" headingId={H2_ID}>

      <header className="mb-10 space-y-3">
        <div className="flex justify-start">
          <SectionBadge>📅 الأشهر الهجرية</SectionBadge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2
              id={H2_ID}
              className="text-2xl sm:text-3xl font-extrabold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              الأشهر الهجرية الاثنا عشر
              <span
                className="block text-lg sm:text-xl font-semibold mt-1"
                style={{
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                أسماؤها · معانيها · مناسباتها
              </span>
            </h2>
          </div>

          {/* Sacred months legend */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1"
              style={{
                background: 'var(--danger-soft)',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
              }}
            >
              ★ شهر حرام
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          التقويم الهجري يتكوّن من 12 شهراً قمرياً — تعرّف على كل شهر واسمه ومعناه
          وأبرز المناسبات الإسلامية التي تقع فيه
        </p>
      </header>

      {/* 12-month grid: 2 → 3 → 4 → 6 columns — divides evenly, no orphan */}
      <ul
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        role="list"
        aria-label="الأشهر الهجرية الاثنا عشر"
      >
        {HIJRI_MONTHS.map((month, idx) => {
          const cfg      = MONTH_CONFIG[idx]
          const isSacred = month.sacred
          const hasTint  = cfg.accent

          return (
            <li
              key={month.number}
              className="rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: hasTint ? softOf(cfg.color) : 'var(--bg-surface-1)',
                border: isSacred
                  ? `1px solid var(--danger-border)`
                  : `1px solid ${hasTint ? borderOf(cfg.color) : 'var(--border-subtle)'}`,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Month number (JS integer = English digit) + sacred badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-2xl font-extrabold tabular-nums leading-none"
                  style={{
                    color: hasTint ? cfg.color : 'var(--text-muted)',
                  }}
                >
                  {month.number}
                </span>
                {isSacred && (
                  <span
                    className="text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-tight"
                    style={{
                      background: 'var(--danger-soft)',
                      color: 'var(--danger)',
                    }}
                  >
                    حرام
                  </span>
                )}
              </div>

              {/* Month name as h3 — keyword-rich heading */}
              <h3
                className="text-sm font-bold leading-tight mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {month.name}
              </h3>

              {/* Arabic textual ordinal */}
              <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>
                الشهر {ARABIC_ORDINALS[idx]}
              </p>

              {/* Etymological meaning */}
              <p
                className="text-[10px] leading-snug mb-2 line-clamp-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {month.meaning}
              </p>

              {/* Key occasion chip */}
              {month.occasion && (
                <div
                  className="rounded-lg px-2 py-1 mt-auto"
                  style={{
                    background: hasTint ? softOf(cfg.color) : 'var(--bg-surface-3)',
                    border: hasTint ? `1px solid ${borderOf(cfg.color)}` : undefined,
                  }}
                >
                  <p
                    className="text-[10px] font-semibold leading-snug"
                    style={{ color: hasTint ? cfg.color : 'var(--text-muted)' }}
                  >
                    {month.occasion}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>

    </SectionWrapper>
  )
}
