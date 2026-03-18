/**
 * HijriCalendarMockup
 * Decorative UI card — aria-hidden, all content duplicated in adjacent text.
 *
 * NUMERAL FIX (per hijri-utils.js):
 *   All Arabic-Indic digits (١٢٣) replaced with English/Western digits (123).
 *   Arabic month names are kept in Arabic — only numbers are English.
 *
 *   Before: '١٤٤٧ هـ', '٠٩', '١٥', '١٥٧.٤°'
 *   After:  '1447 هـ',  '09', '15', '157.4°'
 */

import { Moon, ChevronLeft, ChevronRight } from 'lucide-react'

// Month strip — English numeral month codes, Arabic names, Arabic event labels
const MONTHS_PREVIEW = [
  { number: '09', name: 'رمضان',     event: 'شهر الصيام',        color: 'var(--warning)',    active: true  },
  { number: '10', name: 'شوال',      event: 'عيد الفطر',         color: 'var(--success)',    active: false },
  { number: '11', name: 'ذو القعدة', event: 'شهر حرام',          color: 'var(--accent-alt)', active: false },
  { number: '12', name: 'ذو الحجة',  event: 'الحج · عيد الأضحى', color: 'var(--info)',       active: false },
]

// Calendar grid — English digits, null = empty cell
const HIJRI_DAYS = [
  [null, null, '1',  '2',  '3',  '4',  '5' ],
  ['6',  '7',  '8',  '9',  '10', '11', '12'],
  ['13', '14', '15', '16', '17', '18', '19'],
  ['20', '21', '22', '23', '24', '25', '26'],
  ['27', '28', '29', null, null, null, null ],
]

const DAY_LABELS = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب']
const TODAY      = '15'   // English digit — highlighted in calendar
const ODD_NIGHT  = '27'   // Laylat al-Qadr candidate — subtle highlight

export default function HijriCalendarMockup() {
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
            'linear-gradient(135deg, var(--warning) 0%, var(--border-default) 60%, transparent 100%)',
        }}
      >
        <div
          className="overflow-hidden"
          style={{ background: 'var(--bg-surface-1)', borderRadius: '32px' }}
        >
          {/* ── Header ── */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background:
                'linear-gradient(135deg, rgba(146,64,14,0.12) 0%, var(--bg-surface-2) 100%)',
            }}
          >
            <div>
              {/* English numeral year */}
              <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                1447 هـ
              </p>
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                رمضان المبارك
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'var(--bg-surface-3)' }}
                tabIndex={-1}
              >
                <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,209,102,0.18)' }}
              >
                <Moon size={16} style={{ color: 'var(--warning)' }} />
              </div>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'var(--bg-surface-3)' }}
                tabIndex={-1}
              >
                <ChevronLeft size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          </div>

          {/* ── Day-of-week labels ── */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1 gap-0.5">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold"
                style={{ color: 'var(--text-muted)' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* ── Calendar day grid ── */}
          <div className="px-3 pb-3 space-y-0.5">
            {HIJRI_DAYS.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-0.5">
                {week.map((day, di) => {
                  const isToday  = day === TODAY
                  const isOdd    = day === ODD_NIGHT
                  return (
                    <div
                      key={di}
                      className="flex h-7 w-full items-center justify-center rounded-lg text-[11px] font-medium"
                      style={
                        !day
                          ? { background: 'transparent' }
                          : isToday
                          ? { background: 'var(--warning)', color: '#fff', fontWeight: 800 }
                          : isOdd
                          ? { background: 'var(--accent-soft)', color: 'var(--accent-alt)', fontWeight: 700 }
                          : { color: 'var(--text-secondary)' }
                      }
                    >
                      {day || ''}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* ── Upcoming months strip ── */}
          <div className="px-3 pb-4 space-y-1.5">
            <p
              className="text-[10px] font-semibold mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              الأشهر القادمة
            </p>
            {MONTHS_PREVIEW.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{
                  background: m.active ? `var(--warning-soft)` : 'var(--bg-surface-3)',
                  borderInlineEnd: m.active ? `2px solid ${m.color}` : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  {/* English numeral month number */}
                  <span
                    className="text-[10px] font-bold tabular-nums w-5 text-center"
                    style={{ color: m.color }}
                  >
                    {m.number}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: m.active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {m.name}
                  </span>
                </div>
                <span
                  className="text-[10px]"
                  style={{ color: m.active ? m.color : 'var(--text-muted)' }}
                >
                  {m.event}
                </span>
              </div>
            ))}
          </div>

          {/* ── Qibla row ── */}
          <div
            className="mx-3 mb-4 rounded-xl px-4 py-2.5 flex items-center gap-2"
            style={{ background: 'var(--bg-surface-3)' }}
          >
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              اتجاه القبلة:
            </span>
            {/* English numeral degrees */}
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              157.4° جنوب غرب
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
