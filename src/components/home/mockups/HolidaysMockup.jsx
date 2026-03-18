/**
 * HolidaysMockup
 * Decorative UI card that visualises the holidays/calendar feature.
 * Fully aria-hidden — all content is duplicated in the adjacent section text.
 */

import { Calendar } from 'lucide-react'

const HOLIDAYS = [
  { name: 'عيد الفطر المبارك',    date: '٣١ مارس ٢٠٢٥',   type: 'ديني',  color: 'var(--success)'    },
  { name: 'اليوم الوطني السعودي', date: '٢٣ سبتمبر ٢٠٢٥', type: 'وطني',  color: 'var(--accent-alt)' },
  { name: 'عيد الأضحى المبارك',   date: '٦ يونيو ٢٠٢٥',   type: 'ديني',  color: 'var(--warning)'    },
  { name: 'رأس السنة الهجرية',     date: '٢٧ يوليو ٢٠٢٥',  type: 'هجري', color: 'var(--info)'       },
]

export default function HolidaysMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(6,8,18,0.5))' }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={15} style={{ color: 'var(--accent-alt)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              مناسبات ٢٠٢٥
            </span>
          </div>
          <span
            className="text-[11px] rounded-full px-2.5 py-0.5 font-semibold"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)' }}
          >
            هجري + ميلادي
          </span>
        </div>

        {/* Holiday rows */}
        <ul className="p-4 space-y-2.5" role="list">
          {HOLIDAYS.map((h) => (
            <li
              key={h.name}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                background: 'var(--bg-surface-2)',
                borderInlineEnd: `3px solid ${h.color}`,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl"
                style={{ background: `${h.color}18` }}
              >
                <span className="text-[9px] font-bold" style={{ color: h.color }}>
                  {h.type}
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {h.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {h.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
