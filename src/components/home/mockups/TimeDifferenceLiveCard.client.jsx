'use client'

/**
 * TimeDifferenceLiveCard.client.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Client Component: shows live current time in 4 fixed reference cities PLUS
 * the user's own city, updating every second using Intl.DateTimeFormat.
 *
 * No props needed — everything is computed client-side from the browser's
 * Intl API, which has access to the real current time and DST rules.
 *
 * APPROACH (mirrors time-diff.js logic):
 *   • getOffsetMinutes(tz, date) — same algorithm as time-diff.js
 *   • Detects user's IANA timezone from Intl.DateTimeFormat().resolvedOptions()
 *   • Shows user's city at top (highlighted) + 4 reference cities
 *   • Difference badge shows offset from user's timezone to first reference city
 *
 * NUMERAL RULE: all digits from toLocaleTimeString('en-US', …) → Western digits.
 *
 * HYDRATION: entire card is mounted=false guarded; server renders a skeleton
 * to avoid mismatch (time at server ≠ time at client).
 */

import { useState, useEffect } from 'react'
import { Globe2, Clock } from 'lucide-react'

// ─── Reference cities shown in the card ──────────────────────────────────────
const REFERENCE_CITIES = [
  { nameAr: 'الرياض',   timezone: 'Asia/Riyadh' },
  { nameAr: 'القاهرة',  timezone: 'Africa/Cairo' },
  { nameAr: 'دبي',      timezone: 'Asia/Dubai' },
  { nameAr: 'لندن',     timezone: 'Europe/London' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format current time in a timezone — Western digits, 24-hour, HH:MM:SS.
 * Mirrors time-diff.js formatTimeEn but with seconds for the live feel.
 */
function liveTime(timezone, date) {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   false,
    })
  } catch {
    return '--:--:--'
  }
}

/**
 * Compute UTC offset in minutes for a timezone — mirrors time-diff.js exactly.
 * Returns e.g. 180 for Asia/Riyadh, 0 for UTC.
 */
function getOffsetMinutes(tz, date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
    }).formatToParts(date)

    const p = {}
    parts.forEach(({ type, value }) => { p[type] = value })
    let h = parseInt(p.hour, 10)
    if (h === 24) h = 0

    const local = new Date(Date.UTC(
      parseInt(p.year, 10),
      parseInt(p.month, 10) - 1,
      parseInt(p.day, 10),
      h,
      parseInt(p.minute, 10),
      parseInt(p.second, 10),
    ))
    const utc = new Date(Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
    ))
    return Math.round((local.getTime() - utc.getTime()) / 60000)
  } catch {
    return 0
  }
}

/**
 * Format offset as "UTC+3" or "UTC−5:30".
 * Western digits throughout.
 */
function fmtOffset(minutes) {
  const sign    = minutes >= 0 ? '+' : '−'
  const abs     = Math.abs(minutes)
  const h       = Math.floor(abs / 60)
  const m       = abs % 60
  return m > 0 ? `UTC${sign}${h}:${String(m).padStart(2, '0')}` : `UTC${sign}${h}`
}

/**
 * Difference badge text: "+3 ساعات" or "−5 ساعة".
 */
function fmtDiff(diffMinutes) {
  const sign   = diffMinutes >= 0 ? '+' : '−'
  const h      = Math.floor(Math.abs(diffMinutes) / 60)
  const m      = Math.abs(diffMinutes) % 60
  const label  = h === 1 ? 'ساعة' : 'ساعات'
  if (m > 0) return `${sign}${h}:${String(m).padStart(2, '0')} ${label}`
  return `${sign}${h} ${label}`
}

// ─── Skeleton (rendered server-side before mount) ─────────────────────────────
function Skeleton() {
  return (
    <div
      className="live-card mx-auto"
      aria-busy="true"
      aria-label="جاري تحميل بيانات التوقيت"
    >
      <div className="live-card__body space-y-3">
        <div className="skeleton-block h-5 w-3/5 animate-pulse" />
        <div className="skeleton-block h-10 animate-pulse" />
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton-block h-10 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimeDifferenceLiveCard() {
  const [mounted,   setMounted]   = useState(false)
  const [now,       setNow]       = useState(null)
  const [userTz,    setUserTz]    = useState('Asia/Riyadh')

  /* Detect browser timezone once on mount */
  useEffect(() => {
    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Riyadh')
    setNow(new Date())
    setMounted(true)
  }, [])

  /* Tick every second */
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [mounted])

  if (!mounted) return <Skeleton />

  /* Compute user city offset */
  const userOffset = getOffsetMinutes(userTz, now)
  const userTime   = liveTime(userTz, now)
  /* Pick the first reference city that is NOT the user's timezone for the badge */
  const diffCity  = REFERENCE_CITIES.find(c => c.timezone !== userTz) || REFERENCE_CITIES[0]
  const diffMs    = getOffsetMinutes(diffCity.timezone, now) - userOffset

  return (
    <div className="live-card mx-auto">

        <div className="live-card__toolbar">
          <div
            className="live-card__select"
            data-active="true"
          >
            <Globe2 size={13} aria-hidden="true" />
            <span className="truncate text-xs font-semibold">
              موقعك الحالي
            </span>
          </div>

          <div className="live-card__swap" aria-hidden="true">
            ⇌
          </div>

          <div className="live-card__select">
            <Globe2 size={13} aria-hidden="true" />
            <span className="truncate text-xs font-semibold text-primary">
              {diffCity.nameAr}
            </span>
          </div>
        </div>

        <div className="live-card__metric">
          <Clock size={15} aria-hidden="true" />
          <span>
            فارق التوقيت: {fmtDiff(diffMs)}
          </span>
        </div>

        <div className="live-card__body pt-0">
          <div
            className="live-card__row"
            data-active="true"
          >
            <div className="live-card__row-main">
              <span className="live-card__icon-cell" aria-hidden="true">
                <Globe2 size={13} />
              </span>
              <div>
                <p className="live-card__label">
                  موقعك
                </p>
                <p className="live-card__meta tabular-nums">
                  {fmtOffset(userOffset)}
                </p>
              </div>
            </div>
            <span
              className="live-card__value"
              suppressHydrationWarning
            >
              {userTime}
            </span>
          </div>

        <ul className="live-card__list mt-2" role="list">
          {REFERENCE_CITIES.map((c) => {
            const offset  = getOffsetMinutes(c.timezone, now)
            const time    = liveTime(c.timezone, now)
            const diff    = offset - userOffset
            const diffStr = diff === 0 ? 'نفس التوقيت' : fmtDiff(diff)

            return (
              <li
                key={c.timezone}
                className="live-card__row"
              >
                <div className="live-card__row-main">
                  <span className="live-card__icon-cell" aria-hidden="true">
                    <Globe2 size={13} />
                  </span>
                  <div>
                    <p className="live-card__label">
                      {c.nameAr}
                    </p>
                    <p className="live-card__meta tabular-nums">
                      {fmtOffset(offset)} · {diffStr}
                    </p>
                  </div>
                </div>
                <span
                  className="live-card__value"
                  suppressHydrationWarning
                >
                  {time}
                </span>
              </li>
            )
          })}
        </ul>

      </div>
    </div>
  )
}
