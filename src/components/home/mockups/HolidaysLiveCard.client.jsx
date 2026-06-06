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
        className="skeleton-card mx-auto h-[300px] w-full max-w-sm animate-pulse"
        aria-busy="true"
        aria-label="جاري تحميل المناسبات القادمة"
      />
    )
  }

  return (
    <div className="live-card mx-auto">

        <div className="live-card__header">
          <div className="flex items-center gap-2">
            <span className="live-card__header-icon h-8 w-8" aria-hidden="true">
              <Calendar size={15} />
            </span>
            <span className="live-card__header-title">
              المناسبات القادمة
            </span>
          </div>
          <span className="badge badge-default">
            هجري + ميلادي
          </span>
        </div>

        <ul className="live-card__body live-card__list" role="list">
          {enriched.map((occ) => {
            const urgent = isUrgent(occ.daysRemaining)

            return (
              <li
                key={occ.slug}
                className="live-card__row"
                data-urgent={urgent ? 'true' : undefined}
              >
                <div className="live-card__row-main">
                <div className="live-card__count">
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    <Clock size={9} />
                    <span className="live-card__count-label">
                      يوم
                    </span>
                  </div>
                  <span className="live-card__count-value">
                    {occ.daysRemaining}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="live-card__icon-cell" aria-hidden="true">
                      <Calendar size={13} />
                    </span>
                    <p className="live-card__label truncate">
                      {occ.name}
                    </p>
                  </div>
                  <p className="live-card__meta tabular-nums">
                    {occ.dateLabel}
                  </p>
                  {occ.hijriDate && (
                    <p className="live-card__meta mt-0.5 font-semibold">
                      {occ.hijriDate}
                    </p>
                  )}
                  {occ.accuracy === 'medium' && (
                    <p className="mt-0.5 text-[9px] font-semibold leading-snug text-warning">
                      * قد يختلف بيوم حسب الرؤية
                    </p>
                  )}
                </div>
                </div>
              </li>
            )
          })}
        </ul>

    </div>
  )
}
