/**
 * TimeDifferenceMockup
 * Decorative UI card that visualises the time-difference tool.
 * Fully aria-hidden — all content is duplicated in the adjacent section text.
 */

import { Globe2, Clock } from 'lucide-react'

const CITIES = [
  { name: 'الرياض',  offset: '+3', time: '14:22', flag: '🇸🇦', primary: true  },
  { name: 'القاهرة', offset: '+2', time: '13:22', flag: '🇪🇬', primary: false },
  { name: 'دبي',     offset: '+4', time: '15:22', flag: '🇦🇪', primary: false },
  { name: 'لندن',    offset: '+0', time: '11:22', flag: '🇬🇧', primary: false },
]

export default function TimeDifferenceMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(6,8,18,0.5))' }}
    >
      <div
        className="rounded-3xl p-5"
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* City pickers */}
        <div className="flex items-center gap-2 mb-5">
          {['الرياض', 'لندن'].map((city) => (
            <div
              key={city}
              className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)' }}
            >
              <Globe2 size={13} style={{ color: 'var(--accent-alt)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {city}
              </span>
            </div>
          ))}
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)' }}
          >
            ⇌
          </div>
        </div>

        {/* Difference badge */}
        <div
          className="flex items-center justify-center gap-2 rounded-2xl py-3 mb-5"
          style={{ background: 'var(--accent-gradient)' }}
        >
          <Clock size={15} className="text-white" />
          <span className="text-white font-bold text-base">فارق التوقيت: +3 ساعات</span>
        </div>

        {/* City list */}
        <ul className="space-y-2" role="list">
          {CITIES.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: c.primary ? 'var(--accent-soft)' : 'var(--bg-surface-3)',
                borderInlineEnd: c.primary ? '3px solid var(--accent-alt)' : undefined,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg leading-none">{c.flag}</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {c.name}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    UTC {c.offset}
                  </p>
                </div>
              </div>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: c.primary ? 'var(--accent-alt)' : 'var(--text-secondary)' }}
              >
                {c.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
