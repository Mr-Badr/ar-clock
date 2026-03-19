'use client'

/**
 * ArabTimezonesLiveClient.jsx
 * Renders the Arab world timezone table with live current times.
 * Each country card links to /time-now/[countrySlug].
 *
 * Live time updates every 60 seconds (not every second — better battery/CPU).
 * suppressHydrationWarning on time span only — rest is static.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'

function liveTime(tz, date) {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour:     '2-digit',
      minute:   '2-digit',
      hour12:   false,
    })
  } catch { return '--:--' }
}

export default function ArabTimezonesLiveClient({ groups }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.utcLabel}>

          {/* Group header */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-bold tabular-nums shrink-0"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent-alt)' }}
            >
              {group.utcLabel}
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* Countries grid */}
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5"
            role="list"
            aria-label={`دول التوقيت ${group.utcLabel}`}
          >
            {group.countries.map((c) => {
              /* Build a best-effort country slug for internal link */
              const countrySlug = c.nameAr
                .replace('السعودية', 'saudi-arabia')
                .replace('الإمارات', 'united-arab-emirates')
                .replace('مصر',      'egypt')
                .replace('المغرب',   'morocco')
                .replace('الأردن',   'jordan')
                .replace('لبنان',    'lebanon')
                .replace('سوريا',    'syria')
                .replace('العراق',   'iraq')
                .replace('الكويت',   'kuwait')
                .replace('قطر',      'qatar')
                .replace('البحرين',  'bahrain')
                .replace('عُمان',    'oman')
                .replace('اليمن',    'yemen')
                .replace('الجزائر',  'algeria')
                .replace('تونس',     'tunisia')
                .replace('ليبيا',    'libya')
                .replace('السودان',  'sudan')
                .replace('موريتانيا','mauritania')
                .replace('الصومال',  'somalia')
                .replace('فلسطين',   'palestine')
                .replace('تركيا',    'turkey')
                .replace('إيران',    'iran')
                .toLowerCase().replace(/\s+/g, '-')

              const currentTime = liveTime(c.tz, now)

              return (
                <li key={c.tz}>
                  <Link
                    href={`/time-now/${countrySlug}`}
                    className="flex items-start gap-2.5 rounded-2xl px-3.5 py-3 h-full transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      background: 'var(--bg-surface-1)',
                      border:     `1px solid ${c.dstNote ? 'var(--warning-border)' : 'var(--border-subtle)'}`,
                      boxShadow:  'var(--shadow-sm)',
                    }}
                    aria-label={`توقيت ${c.nameAr} الآن — ${group.utcLabel}`}
                  >
                    {/* Flag */}
                    <span className="text-xl leading-none shrink-0 mt-0.5">{c.flag}</span>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-xs font-bold leading-tight"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {c.nameAr}
                      </p>

                      {/* Live time */}
                      <p
                        className="text-sm font-bold tabular-nums mt-0.5"
                        style={{ color: 'var(--accent-alt)' }}
                        suppressHydrationWarning
                      >
                        {currentTime}
                      </p>

                      {/* Capital + DST badge row */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <p
                          className="text-[10px] truncate"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {c.capital}
                        </p>
                        {c.dstNote && (
                          <span
                            className="inline-block text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none shrink-0"
                            style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}
                          >
                            DST
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

        </div>
      ))}
    </div>
  )
}
