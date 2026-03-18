/**
 * OccasionTypesMockup
 * Decorative UI card — aria-hidden, all content duplicated in adjacent text.
 *
 * BUG FIXES:
 *
 * 1. CRITICAL CSS BUG (was in v1):
 *    `'var(--success)' + '10'` → produces the string `var(--success)10`
 *    which is INVALID CSS — the browser ignores it silently.
 *    FIX: use `var(--success-soft)` which already exists in new.css:
 *      dark:  `rgba(6, 214, 160, 0.12)`
 *      light: `rgba(4, 102, 69, 0.08)`
 *    Same fix applied to every place that appended hex chars to CSS vars.
 *
 * 2. ARABIC NUMERALS:
 *    '٥٨' → '58'    '١' → '1'    '٦٧' → '67'    '٦٨' → '68'
 *    Per hijri-utils.js: all numbers must be English (Western) digits.
 */

import { Moon, Flag, GraduationCap, Globe2, Clock } from 'lucide-react'

const FILTERS = [
  { label: 'الكل',     icon: Globe2,        active: false },
  { label: 'إسلامية',  icon: Moon,          active: true  },
  { label: 'وطنية',    icon: Flag,          active: false },
  { label: 'مدرسية',   icon: GraduationCap, active: false },
]

// English numerals for daysLeft
const SAMPLE_CARDS = [
  {
    name:       'عيد الفطر المبارك',
    hijri:      '1 شوال 1448',
    daysLeft:   '1',
    badge:      'إسلامي',
    urgentColor:'var(--success)',
    icon:       '🎉',
    urgent:     true,
  },
  {
    name:       'يوم عرفة',
    hijri:      '9 ذو الحجة 1448',
    daysLeft:   '67',
    badge:      'إسلامي',
    urgentColor:'var(--accent-alt)',
    icon:       '🕋',
    urgent:     false,
  },
  {
    name:       'عيد الأضحى المبارك',
    hijri:      '10 ذو الحجة 1448',
    daysLeft:   '68',
    badge:      'إسلامي',
    urgentColor:'var(--success)',
    icon:       '🐑',
    urgent:     false,
  },
]

export default function OccasionTypesMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(6,8,18,0.5))' }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Search bar */}
        <div className="px-4 pt-4 pb-3">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{
              background: 'var(--bg-surface-3)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span className="text-sm" aria-hidden="true">🔍</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ابحث عن مناسبة...
            </span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-hidden">
          {FILTERS.map((f) => (
            <div
              key={f.label}
              className="flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5"
              style={
                f.active
                  ? { background: 'var(--accent-gradient)', color: '#fff' }
                  : { background: 'var(--bg-surface-3)', color: 'var(--text-secondary)' }
              }
            >
              <f.icon size={11} />
              <span className="text-[11px] font-semibold">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Count — English numeral */}
        <div className="px-4 pb-2">
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            58 مناسبة · مرتّبة حسب الأقرب
          </p>
        </div>

        {/* Occasion cards */}
        <div className="px-4 pb-4 space-y-2.5">
          {SAMPLE_CARDS.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl p-3.5"
              style={{
                /*
                 * FIX: was `'var(--success)' + '10'` which produced the invalid
                 * string `var(--success)10`. Now uses the pre-defined -soft variable.
                 */
                background: c.urgent ? 'var(--success-soft)' : 'var(--bg-surface-2)',
                border: `1px solid ${c.urgent ? 'var(--success-border)' : 'var(--border-subtle)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: icon + name + hijri date */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl leading-none shrink-0">{c.icon}</span>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-bold leading-tight truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {c.name}
                    </p>
                    {/* English numerals in hijri date string */}
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {c.hijri}
                    </p>
                  </div>
                </div>

                {/* Countdown badge — English numeral */}
                <div
                  className="shrink-0 flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 min-w-[52px]"
                  style={{
                    background: c.urgent ? 'var(--success)' : 'var(--bg-surface-3)',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Clock
                      size={9}
                      style={{ color: c.urgent ? '#fff' : 'var(--text-muted)' }}
                    />
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: c.urgent ? '#fff' : 'var(--text-secondary)' }}
                    >
                      يوم متبقي
                    </span>
                  </div>
                  <span
                    className="text-lg font-extrabold tabular-nums leading-tight"
                    style={{ color: c.urgent ? '#fff' : 'var(--text-primary)' }}
                  >
                    {c.daysLeft}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
