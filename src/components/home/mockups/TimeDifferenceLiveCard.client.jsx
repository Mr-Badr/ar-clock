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
  { nameAr: 'الرياض',   timezone: 'Asia/Riyadh',    flag: '🇸🇦' },
  { nameAr: 'القاهرة',  timezone: 'Africa/Cairo',   flag: '🇪🇬' },
  { nameAr: 'دبي',      timezone: 'Asia/Dubai',     flag: '🇦🇪' },
  { nameAr: 'لندن',     timezone: 'Europe/London',  flag: '🇬🇧' },
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
      className="relative w-full max-w-sm mx-auto"
      aria-busy="true"
      aria-label="جاري تحميل بيانات التوقيت"
      style={{
        borderRadius: '24px',
        background: 'var(--bg-surface-1)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 20px 40px rgba(6,8,18,0.5)',
      }}
    >
      <div className="p-5 space-y-3">
        <div className="h-5 rounded-lg animate-pulse" style={{ background: 'var(--bg-surface-3)', width: '60%' }} />
        <div className="h-10 rounded-2xl animate-pulse" style={{ background: 'var(--accent-soft)' }} />
        {[1,2,3,4].map(i => (
          <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'var(--bg-surface-3)' }} />
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
  const userHour   = now.toLocaleTimeString('en-US', {
    timeZone: userTz, hour: 'numeric', hour12: false,
  })

  /* Pick the first reference city that is NOT the user's timezone for the badge */
  const diffCity  = REFERENCE_CITIES.find(c => c.timezone !== userTz) || REFERENCE_CITIES[0]
  const diffMs    = getOffsetMinutes(diffCity.timezone, now) - userOffset

  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      style={{
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(6,8,18,0.5)',
      }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-default)',
        }}
      >

        {/* ── City pickers (decorative — mirrors the real tool's UI) ── */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          {/* User's city */}
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border-accent)' }}
          >
            <Globe2 size={13} style={{ color: 'var(--accent-alt)' }} />
            <span className="text-xs font-semibold truncate" style={{ color: 'var(--accent-alt)' }}>
              موقعك الحالي
            </span>
          </div>

          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)' }}
          >
            ⇌
          </div>

          {/* Reference city */}
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)' }}
          >
            <Globe2 size={13} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {diffCity.nameAr}
            </span>
          </div>
        </div>

        {/* ── Difference badge ── */}
        <div
          className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-2xl py-3"
          style={{ background: 'var(--accent-gradient)' }}
        >
          <Clock size={15} className="text-white" />
          <span className="text-white font-bold text-base tabular-nums">
            فارق التوقيت: {fmtDiff(diffMs)}
          </span>
        </div>

        {/* ── User's city (highlighted) ── */}
        <div className="px-4 mb-2">
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background:      'var(--accent-soft)',
              borderInlineEnd: '3px solid var(--accent-alt)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg leading-none">📍</span>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--accent-alt)' }}>
                  موقعك
                </p>
                <p className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {fmtOffset(userOffset)}
                </p>
              </div>
            </div>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: 'var(--accent-alt)' }}
              suppressHydrationWarning
            >
              {userTime}
            </span>
          </div>
        </div>

        {/* ── Reference cities ── */}
        <ul className="px-4 pb-4 space-y-2" role="list">
          {REFERENCE_CITIES.map((c) => {
            const offset  = getOffsetMinutes(c.timezone, now)
            const time    = liveTime(c.timezone, now)
            const diff    = offset - userOffset
            const diffStr = diff === 0 ? 'نفس التوقيت' : fmtDiff(diff)

            return (
              <li
                key={c.timezone}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: 'var(--bg-surface-3)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{c.flag}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {c.nameAr}
                    </p>
                    <p className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {fmtOffset(offset)} · {diffStr}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: 'var(--text-secondary)' }}
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
