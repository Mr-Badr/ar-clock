'use client'

/**
 * PrayerTimesLiveCard.client.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Client Component: renders real prayer times received from the Server Component
 * parent and adds a live countdown ticker that updates every second.
 *
 * Props (all serializable — safe across the server/client boundary):
 *   cityNameAr  {string}  Arabic city name shown in the card header
 *   times       {object}  ISO strings: { fajr, sunrise, dhuhr, asr, maghrib, isha }
 *   nextKey     {string}  Key of the next prayer e.g. 'asr'
 *   nextIso     {string}  ISO datetime of the next prayer
 *   timezone    {string}  IANA timezone e.g. 'Asia/Riyadh'
 *   qiblaText   {string|null}  Formatted Qibla direction e.g. '157° جنوب غرب'
 *
 * NUMERAL RULE: all numbers rendered via toLocaleTimeString with locale='en-US'
 * or via JS arithmetic → English (Western) digits only.
 *
 * HYDRATION: the countdown is wrapped in suppressHydrationWarning because
 * server render time !== client render time. The static ring/rows are safe.
 */

import { useState, useEffect, useCallback } from 'react'
import { Moon, Sunrise, Sun, Sunset, Bell, Compass } from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

const PRAYER_AR = {
  fajr:    'الفجر',
  sunrise: 'الشروق',
  dhuhr:   'الظهر',
  asr:     'العصر',
  maghrib: 'المغرب',
  isha:    'العشاء',
}

const PRAYER_ICONS = {
  fajr:    Moon,
  sunrise: Sunrise,
  dhuhr:   Sun,
  asr:     Sun,
  maghrib: Sunset,
  isha:    Moon,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format an ISO string for display in the given timezone.
 * Always returns English (Western) digits and 24-hour format.
 */
function fmtTime(iso, timezone) {
  if (!iso) return '--:--'
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      timeZone:  timezone,
      hour:      '2-digit',
      minute:    '2-digit',
      hour12:    false,
    })
  } catch {
    return '--:--'
  }
}

/**
 * Convert milliseconds to a short countdown string.
 * Returns "HH:MM:SS" with Arabic time labels for context.
 * All digits are Western (en-US toLocaleString is not used — raw JS strings).
 */
function fmtCountdown(ms) {
  if (ms <= 0) return '00:00:00'
  const totalSec = Math.floor(ms / 1000)
  const h        = Math.floor(totalSec / 3600)
  const m        = Math.floor((totalSec % 3600) / 60)
  const s        = totalSec % 60
  const pad      = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PrayerTimesLiveCard({
  cityNameAr,
  times,
  nextKey,
  nextIso,
  timezone,
  qiblaText,
}) {
  const [countdown, setCountdown]   = useState('--:--:--')
  const [mounted,   setMounted]     = useState(false)

  // Mount flag — prevents hydration mismatch on countdown
  useEffect(() => { setMounted(true) }, [])

  // Live countdown: re-calculates every second
  useEffect(() => {
    if (!nextIso) return
    const tick = () => {
      const ms = new Date(nextIso).getTime() - Date.now()
      setCountdown(fmtCountdown(Math.max(0, ms)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextIso])

  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      style={{ boxShadow: '0 20px 40px rgba(6,8,18,0.5)', borderRadius: '24px' }}
    >
      {/* Gradient border ring */}
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

          {/* ── Header ── */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'var(--accent-gradient)' }}
          >
            <div>
              <p className="text-[11px] font-medium text-white/75 leading-tight">
                {cityNameAr} · مواقيت الصلاة اليوم
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                {PRAYER_AR[nextKey] || nextKey} القادمة
              </p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <Moon size={18} className="text-white" />
            </div>
          </div>

          {/* ── Countdown chip ── */}
          <div
            className="mx-4 mt-4 mb-2 rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
            }}
          >
            <div>
              <p
                className="text-[10px] font-semibold"
                style={{ color: 'var(--accent-alt)' }}
              >
                الوقت المتبقي على {PRAYER_AR[nextKey] || nextKey}
              </p>
              {/* suppressHydrationWarning: server time ≠ client time */}
              <p
                className="text-sm font-bold tabular-nums mt-0.5"
                style={{ color: 'var(--text-primary)' }}
                suppressHydrationWarning
              >
                {mounted ? countdown : '--:--:--'}
              </p>
            </div>
            <Bell size={16} style={{ color: 'var(--accent-alt)' }} />
          </div>

          {/* ── Prayer rows ── */}
          <ul
            className="divide-y"
            style={{ borderColor: 'var(--border-subtle)' }}
            role="list"
          >
            {PRAYER_ORDER.map((key) => {
              const Icon     = PRAYER_ICONS[key]
              const isActive = key === nextKey
              const timeStr  = fmtTime(times[key], timezone)

              return (
                <li
                  key={key}
                  className="flex items-center justify-between px-5 py-2.5"
                  style={
                    isActive
                      ? {
                          background:      'var(--accent-soft)',
                          borderInlineEnd: '3px solid var(--accent-alt)',
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        background: isActive
                          ? 'var(--accent-soft)'
                          : 'var(--bg-surface-3)',
                      }}
                    >
                      <Icon
                        size={13}
                        style={{
                          color: isActive
                            ? 'var(--accent-alt)'
                            : 'var(--text-muted)',
                        }}
                      />
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isActive
                          ? 'var(--accent-alt)'
                          : 'var(--text-primary)',
                      }}
                    >
                      {PRAYER_AR[key]}
                    </span>
                  </div>

                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: isActive
                        ? 'var(--accent-alt)'
                        : 'var(--text-secondary)',
                    }}
                  >
                    {timeStr}
                  </span>
                </li>
              )
            })}
          </ul>

          {/* ── Qibla row ── */}
          {qiblaText && (
            <div
              className="flex items-center gap-3 mx-4 mb-4 mt-3 rounded-xl px-4 py-2.5"
              style={{ background: 'var(--bg-surface-3)' }}
            >
              <Compass size={14} style={{ color: 'var(--accent-alt)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                اتجاه القبلة:
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: 'var(--text-primary)' }}
              >
                {qiblaText}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
