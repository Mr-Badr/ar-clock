/**
 * HowItWorksMockup.jsx
 * Decorative UTC world-clock illustration with SVG analog hands.
 * aria-hidden — content duplicated in adjacent section text.
 *
 * FIX: removed Arabic "ص" (AM marker) — all time labels use 24h Western format.
 * FIX: added gradient border ring (matches PrayerTimesLiveCard pattern).
 * FIX: boxShadow not filter:drop-shadow.
 */

import { Globe2 } from 'lucide-react'

const ZONES = [
  { city: 'الرياض',  utc: 'UTC+3',  hours: 11, color: 'var(--accent-alt)', softBg: 'var(--accent-alt-soft)' },
  { city: 'القاهرة', utc: 'UTC+2',  hours: 10, color: 'var(--success)',    softBg: 'var(--success-soft)'    },
  { city: 'لندن',    utc: 'UTC+0',  hours: 8,  color: 'var(--info)',       softBg: 'var(--info-soft)'       },
  { city: 'نيويورك', utc: 'UTC−5',  hours: 3,  color: 'var(--warning)',    softBg: 'var(--warning-soft)'    },
]

/** Minimalist SVG clock with hour hand and subtle tick marks */
function AnalogClock({ hours, color }) {
  const cx = 24, cy = 24, r = 20
  // 24-hour clock: 0h = top, each hour = 15°
  const angle = (hours / 24) * 360
  const rad   = (deg) => ((deg - 90) * Math.PI) / 180
  const hx    = cx + (r - 5) * Math.cos(rad(angle))
  const hy    = cy + (r - 5) * Math.sin(rad(angle))

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="var(--bg-surface-2)" stroke="var(--border-default)" strokeWidth="1.5" />
      {/* 12 hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * 360
        const x1 = cx + (r - 3) * Math.cos(rad(a))
        const y1 = cy + (r - 3) * Math.sin(rad(a))
        const x2 = cx + r * Math.cos(rad(a))
        const y2 = cy + r * Math.sin(rad(a))
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-default)" strokeWidth="1" />
      })}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Centre dot */}
      <circle cx={cx} cy={cy} r="2.5" fill={color} />
    </svg>
  )
}

export default function HowItWorksMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
      style={{ boxShadow: '0 20px 40px rgba(6,8,18,0.5)', borderRadius: '24px' }}
    >
      {/* Gradient border — matches pattern from PrayerTimesLiveCard */}
      <div
        className="rounded-3xl p-px"
        style={{
          background:
            'linear-gradient(135deg, var(--accent) 0%, var(--border-default) 60%, transparent 100%)',
        }}
      >
        <div
          className="rounded-[23px] overflow-hidden"
          style={{ background: 'var(--bg-surface-1)' }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'var(--accent-gradient)' }}
          >
            <div className="flex items-center gap-2">
              <Globe2 size={16} className="text-white" />
              <span className="text-sm font-bold text-white">المناطق الزمنية الآن</span>
            </div>
            {/* UTC reference — 24h, Western digits only */}
            <span
              className="text-[11px] font-bold tabular-nums rounded-full px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
            >
              UTC+0 = 08:00
            </span>
          </div>

          {/* City rows */}
          <div className="p-4 space-y-2">
            {ZONES.map((z) => (
              <div
                key={z.city}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  background:      z.softBg,
                  borderInlineEnd: `3px solid ${z.color}`,
                }}
              >
                <AnalogClock hours={z.hours} color={z.color} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {z.city}
                    </span>
                    {/* 24h time — Western digits, no Arabic ص/م */}
                    <span
                      className="text-sm font-bold tabular-nums"
                      style={{ color: z.color }}
                    >
                      {String(z.hours).padStart(2, '0')}:00
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold tabular-nums"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {z.utc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation formula strip */}
          <div
            className="px-5 py-3 flex items-center gap-2 flex-wrap text-[11px]"
            style={{
              background:  'var(--bg-surface-2)',
              borderTop:   '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>الفارق:</span>
            <span
              className="font-bold tabular-nums rounded px-1.5 py-0.5"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)' }}
            >
              UTC+3
            </span>
            <span style={{ color: 'var(--text-muted)' }}>−</span>
            <span
              className="font-bold tabular-nums rounded px-1.5 py-0.5"
              style={{ background: 'var(--info-soft)', color: 'var(--info)' }}
            >
              UTC+0
            </span>
            <span style={{ color: 'var(--text-muted)' }}>=</span>
            <span className="font-bold" style={{ color: 'var(--success)' }}>+3 ساعات</span>
          </div>
        </div>
      </div>
    </div>
  )
}
