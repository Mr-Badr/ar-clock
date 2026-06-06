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
    <div className="live-card mx-auto">
          <div className="live-card__header">
            <div>
              <p className="live-card__header-meta">
                {cityNameAr} · مواقيت الصلاة اليوم
              </p>
              <p className="live-card__header-title mt-0.5">
                {PRAYER_AR[nextKey] || nextKey} القادمة
              </p>
            </div>
            <div className="live-card__header-icon">
              <Moon size={18} />
            </div>
          </div>

          <div className="live-card__body">
          <div className="live-card__notice">
            <div>
              <p className="live-card__notice-label">
                الوقت المتبقي على {PRAYER_AR[nextKey] || nextKey}
              </p>
              <span
                className="live-card__notice-value"
                suppressHydrationWarning
              >
                {mounted ? countdown : '--:--:--'}
              </span>
            </div>
            <Bell size={16} aria-hidden="true" />
          </div>

          <ul className="live-card__list" role="list">
            {PRAYER_ORDER.map((key) => {
              const Icon     = PRAYER_ICONS[key]
              const isActive = key === nextKey
              const timeStr  = fmtTime(times?.[key], timezone)

              return (
                <li
                  key={key}
                  className="live-card__row"
                  data-active={isActive ? 'true' : undefined}
                >
                  <div className="live-card__row-main">
                    <span className="live-card__icon-cell" aria-hidden="true">
                      <Icon size={13} />
                    </span>
                    <span className="live-card__label">
                      {PRAYER_AR[key]}
                    </span>
                  </div>

                  <span
                    className="live-card__value"
                  >
                    {timeStr}
                  </span>
                </li>
              )
            })}
          </ul>

          {qiblaText && (
            <div className="live-card__footer">
              <Compass size={14} aria-hidden="true" />
              <span className="live-card__meta">
                اتجاه القبلة:
              </span>
              <span className="live-card__label tabular-nums">
                {qiblaText}
              </span>
            </div>
          )}
      </div>
    </div>
  )
}
