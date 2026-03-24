'use client'

/**
 * PopularPairsLiveClient.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Client Component: the 12 most-searched time-difference pairs as premium cards.
 *
 * Design upgrades vs v1:
 *  - Stacked city names (from / to) with full country label visible
 *  - UTC offset shown per city (not just the diff)
 *  - Diff direction arrow (→ or ←) replaced with semantic text to avoid RTL confusion
 *  - Urgent top-card highlight with gradient border
 *  - Consistent min-height touch targets (min-h-[100px])
 *  - Skeleton loading state while diffs compute
 *
 * NUMERAL RULE: all digits from Intl or JS arithmetic → Western (en-US)
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, TrendingUp } from 'lucide-react'
import { ArrowLeft } from '@phosphor-icons/react';

// ─── UTC helpers (mirror time-diff.js) ──────────────────────────────────────

function getOffsetMinutes(tz, date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
    }).formatToParts(date)
    const p = {}
    parts.forEach(({ type, value }) => { p[type] = value })
    let h = parseInt(p.hour, 10); if (h === 24) h = 0
    const local = new Date(Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second))
    const utc   = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()))
    return Math.round((local - utc) / 60000)
  } catch { return 0 }
}

/** Format diff in hours, Western digits, Arabic label */
function fmtDiff(minutes) {
  const abs  = Math.abs(minutes)
  const h    = Math.floor(abs / 60)
  const m    = abs % 60
  if (abs === 0) return 'نفس التوقيت'
  const sign = minutes > 0 ? '+' : '−'
  const hStr = m > 0 ? `${h}:${String(m).padStart(2, '0')}` : String(h)
  return `${sign}${hStr} ${h === 1 && m === 0 ? 'ساعة' : 'ساعات'}`
}

/** Format UTC offset as "UTC+3" */
function fmtOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '−'
  const h    = Math.floor(Math.abs(minutes) / 60)
  const m    = Math.abs(minutes) % 60
  return m > 0 ? `UTC${sign}${h}:${String(m).padStart(2,'0')}` : `UTC${sign}${h}`
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div
      className="rounded-2xl p-4 min-h-[100px] animate-pulse"
      style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="h-3 rounded mb-3" style={{ background: 'var(--bg-surface-3)', width: '50%' }} />
      <div className="h-5 rounded mb-2" style={{ background: 'var(--bg-surface-3)', width: '70%' }} />
      <div className="h-3 rounded"     style={{ background: 'var(--bg-surface-3)', width: '40%' }} />
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PopularPairsLiveClient({ pairs }) {
  const [diffs,   setDiffs]   = useState(null)
  const [offsets, setOffsets] = useState({})

  useEffect(() => {
    const now      = new Date()
    const newDiffs  = {}
    const newOff    = {}

    pairs.forEach((pair) => {
      const fromOff = getOffsetMinutes(pair.from.tz, now)
      const toOff   = getOffsetMinutes(pair.to.tz, now)
      const key     = `${pair.from.slug}-${pair.to.slug}`
      newDiffs[key] = toOff - fromOff
      newOff[pair.from.tz] = fromOff
      newOff[pair.to.tz]   = toOff
    })

    setDiffs(newDiffs)
    setOffsets(newOff)
  }, [pairs])

  if (!diffs) {
    return (
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" role="list">
        {pairs.map((_, i) => <li key={i}><CardSkeleton /></li>)}
      </ul>
    )
  }

  return (
    <ul
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      role="list"
      aria-label="فروق التوقيت الأكثر بحثاً"
    >
      {pairs.map((pair, idx) => {
        const key     = `${pair.from.slug}-${pair.to.slug}`
        const diff    = diffs[key] ?? 0
        const fromOff = offsets[pair.from.tz] ?? 0
        const toOff   = offsets[pair.to.tz]   ?? 0
        const isTop   = idx === 0
        const isZero  = diff === 0

        return (
          <li key={key}>
            <Link
              href={`/time-difference/${pair.from.slug}/${pair.to.slug}`}
              className="group flex flex-col rounded-2xl p-4 min-h-[100px] h-full transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background:  isTop ? 'var(--accent-soft)' : 'var(--bg-surface-1)',
                border:      `1px solid ${isTop ? 'var(--border-accent-strong)' : 'var(--border-subtle)'}`,
                boxShadow:   isTop ? 'var(--shadow-accent)' : 'var(--shadow-sm)',
              }}
              aria-label={`فرق التوقيت بين ${pair.from.nameAr} و${pair.to.nameAr}: ${fmtDiff(diff)}`}
            >
              {/* Top badge */}
              {isTop && (
                <div className="flex items-center gap-1 mb-2">
                  <TrendingUp size={10} style={{ color: 'var(--accent-alt)' }} />
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: 'var(--accent-alt)' }}
                  >
                    الأعلى بحثاً
                  </span>
                </div>
              )}

              {/* Cities row */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl leading-none">{pair.from.flag}</span>
                  <span
                    className="text-[9px] tabular-nums"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {fmtOffset(fromOff)}
                  </span>
                </div>

                {/* Diff pill */}
                <div className="flex-1 flex justify-center">
                  <span
                    className="text-[10px] font-bold tabular-nums rounded-full px-2 py-0.5"
                    style={{
                      background: isZero ? 'var(--success-soft)' : 'var(--bg-surface-3)',
                      color:      isZero ? 'var(--success)'      : 'var(--accent-alt)',
                    }}
                    suppressHydrationWarning
                  >
                    {fmtDiff(diff)}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl leading-none">{pair.to.flag}</span>
                  <span
                    className="text-[9px] tabular-nums"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {fmtOffset(toOff)}
                  </span>
                </div>
              </div>

              {/* Label */}
              <p
                className="text-xs font-bold leading-tight mt-auto"
                style={{ color: isTop ? 'var(--accent-alt)' : 'var(--text-primary)' }}
              >
                {pair.labelAr}
              </p>

              {/* Hover CTA */}
              <p
                className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                style={{ color: 'var(--text-muted)' }}
              >
                عرض التفاصيل
                <ArrowLeft size={10} weight="bold" />
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
