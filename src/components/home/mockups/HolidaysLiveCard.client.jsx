'use client'

/**
 * HolidaysLiveCard.client.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Client Component: receives resolved holiday data from the Server Component
 * parent and computes/displays real days-remaining per occasion.
 *
 * Props:
 *   occasions  {Array}  Resolved occasions, each:
 *     {
 *       slug:        string   — e.g. 'eid-fitr'
 *       name:        string   — Arabic name e.g. 'عيد الفطر المبارك'
 *       isoDate:     string   — ISO date e.g. '2025-03-31'
 *       hijriDate:   string   — Hijri label e.g. '1 شوال 1447'
 *       type:        string   — 'ديني' | 'وطني' | 'هجري'
 *       icon:        string   — emoji
 *       color:       string   — CSS variable
 *       softBg:      string   — CSS variable
 *       accuracy:    string   — 'high' | 'medium' | 'low'
 *       note:        string   — calendar method note
 *     }
 *
 * NUMERAL RULE: daysRemaining via JS arithmetic → Western digits.
 * Date formatting via 'ar-EG-u-nu-latn' → Arabic month names, Western digits.
 */

import { useMemo, useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute days remaining from today until an ISO date string.
 * Returns 0 if the date is today or in the past.
 * Western digits (plain JS arithmetic).
 */
function daysUntil(isoDate) {
  try {
    const target = new Date(isoDate + 'T00:00:00')
    const today  = new Date()
    today.setHours(0, 0, 0, 0)
    const ms = target.getTime() - today.getTime()
    return Math.max(0, Math.round(ms / 86_400_000))
  } catch {
    return 0
  }
}

/**
 * Format ISO date as Arabic with Western digits.
 * e.g. '2025-03-31' → '31 مارس 2025'
 * Uses 'ar-EG-u-nu-latn' (Arabic month names, Latin/Western digits).
 */
function fmtDate(isoDate) {
  try {
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString('ar-EG-u-nu-latn', {
      day:   'numeric',
      month: 'long',
      year:  'numeric',
    })
  } catch {
    return isoDate
  }
}

/**
 * Urgency styling: cards with ≤14 days get a stronger accent.
 */
function isUrgent(days) {
  return days >= 0 && days <= 14
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HolidaysLiveCard({ occasions = [] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* Enrich with client-computed days */
  const enriched = useMemo(() => {
    if (!mounted) return []
    return occasions.map((occ) => ({
      ...occ,
      daysRemaining: daysUntil(occ.isoDate),
      dateLabel:     fmtDate(occ.isoDate),
    }))
  }, [occasions, mounted])

  if (!mounted) {
    return (
      <div
        className="relative w-full max-w-sm mx-auto animate-pulse"
        style={{ height: '300px', background: 'var(--bg-surface-1)', borderRadius: '24px' }}
      />
    )
  }

  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      style={{ boxShadow: '0 20px 40px rgba(6,8,18,0.5)', borderRadius: '24px' }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-default)',
        }}
      >

        {/* ── Header ── */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: 'var(--bg-surface-2)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={15} style={{ color: 'var(--accent-alt)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              المناسبات القادمة
            </span>
          </div>
          <span
            className="text-[11px] rounded-full px-2.5 py-0.5 font-semibold"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)' }}
          >
            هجري + ميلادي
          </span>
        </div>

        {/* ── Occasion rows ── */}
        <ul className="p-4 space-y-3" role="list">
          {enriched.map((occ) => {
            const urgent = isUrgent(occ.daysRemaining)

            return (
              <li
                key={occ.slug}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  background:      urgent ? occ.softBg      : 'var(--bg-surface-2)',
                  borderInlineEnd: `3px solid ${occ.color}`,
                }}
              >
                {/* Days-remaining badge */}
                <div
                  className="flex shrink-0 flex-col items-center justify-center rounded-xl w-14 min-h-[52px] px-1"
                  style={{ background: urgent ? occ.color : 'var(--bg-surface-3)' }}
                >
                  <div className="flex items-center gap-0.5">
                    <Clock
                      size={9}
                      style={{ color: urgent ? '#fff' : 'var(--text-muted)' }}
                    />
                    <span
                      className="text-[9px] font-semibold leading-none"
                      style={{ color: urgent ? '#fff' : 'var(--text-muted)' }}
                    >
                      يوم
                    </span>
                  </div>
                  <span
                    className="text-xl font-extrabold tabular-nums leading-tight"
                    style={{ color: urgent ? '#fff' : 'var(--text-primary)' }}
                  >
                    {occ.daysRemaining}
                  </span>
                </div>

                {/* Name + dates */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-base leading-none" aria-hidden="true">
                      {occ.icon}
                    </span>
                    <p
                      className="text-xs font-bold leading-tight truncate"
                      style={{ color: urgent ? occ.color : 'var(--text-primary)' }}
                    >
                      {occ.name}
                    </p>
                  </div>
                  <p
                    className="text-[10px] tabular-nums leading-snug"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {occ.dateLabel}
                  </p>
                  {occ.hijriDate && (
                    <p
                      className="text-[9px] leading-snug mt-0.5"
                      style={{ color: occ.color, fontWeight: 600 }}
                    >
                      {occ.hijriDate}
                    </p>
                  )}
                  {/* Accuracy badge for medium/low accuracy dates */}
                  {occ.accuracy === 'medium' && (
                    <p
                      className="text-[9px] leading-snug mt-0.5"
                      style={{ color: 'var(--warning)' }}
                    >
                      * قد يختلف بيوم حسب الرؤية
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

      </div>
    </div>
  )
}
