/**
 * PrayerTimesMockup
 * Decorative UI card that visualises the prayer times feature.
 * Fully aria-hidden — all content is duplicated in the adjacent section text.
 */

import { Moon, Sunrise, Sun, Sunset, Bell, Compass } from 'lucide-react'

const PRAYERS = [
  { name: 'الفجر',  time: '04:38', icon: Moon,    active: false },
  { name: 'الشروق', time: '06:05', icon: Sunrise, active: false },
  { name: 'الظهر',  time: '12:17', icon: Sun,     active: true  },
  { name: 'العصر',  time: '15:42', icon: Sun,     active: false },
  { name: 'المغرب', time: '18:29', icon: Sunset,  active: false },
  { name: 'العشاء', time: '19:55', icon: Moon,    active: false },
]

export default function PrayerTimesMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(6,8,18,0.5))' }}
    >
      {/* Gradient border */}
      <div
        className="rounded-3xl p-px"
        style={{
          background:
            'linear-gradient(135deg, var(--accent) 0%, var(--border-default) 60%, transparent 100%)',
        }}
      >
        <div className="rounded-[23px] overflow-hidden" style={{ background: 'var(--bg-surface-1)' }}>

          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'var(--accent-gradient)' }}
          >
            <div>
              <p className="text-[11px] font-medium text-white/75">
                الرياض · المملكة العربية السعودية
              </p>
              <p className="text-base font-bold text-white mt-0.5">مواقيت الصلاة اليوم</p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <Moon size={18} className="text-white" />
            </div>
          </div>

          {/* Next prayer countdown */}
          <div
            className="mx-4 mt-4 mb-2 rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}
          >
            <div>
              <p className="text-[10px] font-medium" style={{ color: 'var(--accent-alt)' }}>
                الصلاة القادمة
              </p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                العصر — 2:23 ساعة
              </p>
            </div>
            <Bell size={16} style={{ color: 'var(--accent-alt)' }} />
          </div>

          {/* Prayer rows */}
          <ul
            className="divide-y"
            style={{ borderColor: 'var(--border-subtle)' }}
            role="list"
          >
            {PRAYERS.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between px-5 py-2.5"
                style={
                  p.active
                    ? { background: 'var(--accent-soft)', borderInlineEnd: '3px solid var(--accent-alt)' }
                    : {}
                }
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: p.active ? 'var(--accent-soft)' : 'var(--bg-surface-3)' }}
                  >
                    <p.icon
                      size={13}
                      style={{ color: p.active ? 'var(--accent-alt)' : 'var(--text-muted)' }}
                    />
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: p.active ? 'var(--accent-alt)' : 'var(--text-primary)' }}
                  >
                    {p.name}
                  </span>
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: p.active ? 'var(--accent-alt)' : 'var(--text-secondary)' }}
                >
                  {p.time}
                </span>
              </li>
            ))}
          </ul>

          {/* Qibla row */}
          <div
            className="flex items-center gap-3 mx-4 mb-4 mt-3 rounded-xl px-4 py-2.5"
            style={{ background: 'var(--bg-surface-3)' }}
          >
            <Compass size={14} style={{ color: 'var(--accent-alt)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              اتجاه القبلة:
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              157.4° جنوب غرب
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
