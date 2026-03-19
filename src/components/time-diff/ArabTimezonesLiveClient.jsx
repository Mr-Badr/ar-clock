/**
 * ArabTimezonesLiveClient.jsx
 *
 * 'use client' — all interactivity lives here.
 * Server component (SectionArabTimezones) passes TIMEZONE_GROUPS as props.
 *
 * BUGS FIXED vs previous version:
 * ① PHASE.night.nodeColor was var(--bg-surface-4) → breaks "#hex"+"22" string concat
 *    → replaced with real hex #2E3A60
 * ② display:'none' on sm:block time div → inline style overrides Tailwind, always hidden
 *    → removed inline style, Tailwind class only
 * ③ UTCZoneSection useState(defaultOpen) ignores prop changes after activeRegion switch
 *    → added useEffect sync + prev-ref guard
 * ④ memo(UTCZoneSection) received whole `times` object (new ref every tick) → memo useless
 *    → custom areEqual comparator: only checks this section's timezone keys
 * ⑤ Dead formatTime() function (never called) → removed
 * ⑥ WebkitOverflowScrolling:'touch' deprecated → removed
 * ⑦ role="img" + aria-hidden="true" contradiction on flag spans → removed role="img"
 * ⑧ aria-live on 91 individual chip time spans → fired 91 announcements per tick
 *    → moved to single section-level container with aria-atomic="false"
 * ⑨ countForRegion was useCallback called in JSX → replaced with useMemo regionCounts map
 * ⑩ Missing type="button" on every <button> → added
 * ⑪ No IntersectionObserver → clock ticked off-screen wasting CPU
 *    → added IO with rootMargin 400px, clock only starts when section near viewport
 * ⑫ <style> tag injected inline → risks duplicate class rules if component mounts twice
 *    → moved to module-level CSS-in-JS string, injected once via useInsertionEffect
 *
 * PERFORMANCE:
 *   - IntersectionObserver: clock deferred until section is within 400px of viewport
 *   - memo + areEqual: UTCZoneSection only re-renders when ITS times change
 *   - memo on CountryChip: re-renders only if time string changed (primitives compare by value)
 *   - Intl.DateTimeFormat instances cached per timezone (avoids new instance per tick)
 *   - useInsertionEffect for the <style> block (React 18 best practice)
 *
 * SEO:
 *   - sr-only <nav> with all 91 country links always in DOM (never collapsed/filtered out)
 *   - Rich anchor text: "توقيت [country] الآن — UTC[offset] — عاصمة [capital]"
 *   - aria-label on every interactive element for screen readers + crawlers
 */

'use client'

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC GLOBAL STYLES — injected once via useInsertionEffect (React 18)
   This avoids duplicate rule injection if the component ever mounts twice.
═══════════════════════════════════════════════════════════════════════════ */

const GLOBAL_STYLES = `
.atz-chip:hover{transform:translateY(-2px) scale(1.02);box-shadow:var(--shadow-md);}
.atz-chip:focus-visible{outline:2px solid var(--accent-alt);outline-offset:3px;border-radius:var(--radius-lg);}
.atz-chip:active{transform:scale(0.98);}
.atz-rail-btn:focus-visible{outline:2px solid var(--accent-alt);outline-offset:4px;border-radius:50%;}
.atz-filter-btn:focus-visible{outline:2px solid var(--accent-alt);outline-offset:3px;}
.atz-zone-btn:focus-visible{outline:2px solid var(--accent-alt);outline-offset:-2px;}
@media(max-width:479px){.atz-phase-legend{display:none!important;}}
`

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC CONFIG
═══════════════════════════════════════════════════════════════════════════ */

const REGIONS = [
  { id: 'all',       label: 'الكل',           icon: '🌐', arLabel: 'عرض جميع الدول'      },
  { id: 'arab',      label: 'الدول العربية',   icon: '🌙', arLabel: 'الدول العربية فقط'   },
  { id: 'europe',    label: 'أوروبا',          icon: '🏛',  arLabel: 'الدول الأوروبية'     },
  { id: 'asia',      label: 'آسيا',            icon: '⛩',  arLabel: 'دول آسيا'            },
  { id: 'africa',    label: 'أفريقيا',         icon: '🌍', arLabel: 'الدول الأفريقية'     },
  { id: 'neighbour', label: 'المجاورة',        icon: '🤝', arLabel: 'الدول المجاورة'      },
  { id: 'americas',  label: 'الأمريكتان',      icon: '🗽', arLabel: 'دول الأمريكتين'     },
]

/** Colour tokens per country group — all reference CSS vars from new.css */
const GC = {
  arab:      { soft: 'var(--accent-soft)',     border: 'var(--border-accent)'  },
  europe:    { soft: 'var(--info-soft)',        border: 'var(--info-border)'    },
  asia:      { soft: 'var(--success-soft)',     border: 'var(--success-border)' },
  africa:    { soft: 'var(--warning-soft)',     border: 'var(--warning-border)' },
  neighbour: { soft: 'var(--accent-alt-soft)', border: 'var(--border-subtle)'  },
  americas:  { soft: 'var(--danger-soft)',      border: 'var(--danger-border)'  },
}

/**
 * FIX ①: night nodeColor MUST be a real hex value.
 * var(--bg-surface-4) cannot be appended with "22"/"55" for alpha — invalid CSS.
 * #2E3A60 is the exact resolved value of --raw-slate-650 used for bg-surface-4 in dark theme.
 */
const PHASE = {
  night:     { label: 'ليل',   icon: '🌙', nodeColor: '#2E3A60', glowColor: 'rgba(46,58,96,0.6)'    },
  dawn:      { label: 'فجر',   icon: '🌅', nodeColor: '#FFB347', glowColor: 'rgba(255,179,71,0.4)'  },
  morning:   { label: 'صباح',  icon: '☀️', nodeColor: '#60A5FA', glowColor: 'rgba(96,165,250,0.4)'  },
  afternoon: { label: 'ظهر',   icon: '🌤', nodeColor: '#3B82F6', glowColor: 'rgba(59,130,246,0.4)'  },
  evening:   { label: 'مساء',  icon: '🌆', nodeColor: '#FB923C', glowColor: 'rgba(251,146,60,0.4)'  },
  dusk:      { label: 'غسق',   icon: '🌇', nodeColor: '#A78BFA', glowColor: 'rgba(167,139,250,0.4)' },
}

/* ═══════════════════════════════════════════════════════════════════════════
   CACHED Intl.DateTimeFormat INSTANCES
   Creating a new Intl.DateTimeFormat on every tick for 91 timezones is
   expensive (~0.3ms each). Cache them at module level — they are immutable.
═══════════════════════════════════════════════════════════════════════════ */

const _fmtCache = new Map()

function getFormatter(tz) {
  if (!_fmtCache.has(tz)) {
    try {
      _fmtCache.set(
        tz,
        new Intl.DateTimeFormat('ar-MA', {
          timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true,
        }),
      )
    } catch {
      return null
    }
  }
  return _fmtCache.get(tz)
}

/* ═══════════════════════════════════════════════════════════════════════════
   PURE HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function buildUtcLabel(utc) {
  const sign = utc < 0 ? '-' : '+'
  const abs  = Math.abs(utc)
  const h    = Math.floor(abs)
  const m    = Math.round((abs - h) * 60)
  return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, '0')}`
}

function localHour(utcOffset) {
  const d   = new Date()
  const utc = d.getUTCHours() + d.getUTCMinutes() / 60
  return ((utc + utcOffset) % 24 + 24) % 24
}

function getPhase(hour) {
  if (hour >= 5  && hour < 7)  return 'dawn'
  if (hour >= 7  && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  if (hour >= 20 && hour < 22) return 'dusk'
  return 'night'
}

function slugify(name) {
  return name.trim().replace(/\s+/g, '-')
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENT: CountryChip
═══════════════════════════════════════════════════════════════════════════ */

const CountryChip = memo(function CountryChip({ country, time }) {
  const c  = GC[country.group] ?? GC.neighbour
  const ph = PHASE[getPhase(localHour(country.utc))]

  return (
    <Link
      href={`/time-now/${slugify(country.nameAr)}`}
      title={`توقيت ${country.nameAr} — العاصمة: ${country.capital}`}
      aria-label={`توقيت ${country.nameAr} الآن، ${country.utcLabel}`}
      style={{
        background:     c.soft,
        border:         `1px solid ${c.border}`,
        display:        'flex',
        flexDirection:  'column',
        gap:            '6px',
        borderRadius:   'var(--radius-lg)',
        padding:        '10px 12px',
        textDecoration: 'none',
        transition:     'transform 150ms var(--ease-spring), box-shadow 150ms var(--ease-out)',
        willChange:     'transform',
        minWidth:       0,
      }}
      className="atz-chip"
    >
      {/* Flag + Name row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          {/* FIX ⑦: was role="img" + aria-hidden — contradictory. Just aria-hidden. */}
          <span style={{ fontSize: '1.125rem', lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
            {country.flag}
          </span>
          <span
            style={{
              fontSize:      '0.8125rem',
              fontWeight:    600,
              lineHeight:    'var(--leading-tight)',
              color:         'var(--text-primary)',
              overflow:      'hidden',
              textOverflow:  'ellipsis',
              whiteSpace:    'nowrap',
            }}
          >
            {country.nameAr}
          </span>
        </div>
        <span style={{ fontSize: '0.6875rem', opacity: 0.6, flexShrink: 0 }} aria-hidden="true">
          {ph.icon}
        </span>
      </div>

      {/* Time + DST row */}
      {/* FIX ⑧: aria-live removed from individual span (was firing 91×/tick) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        <span
          style={{
            fontSize:           '0.75rem',
            fontFamily:         'monospace',
            fontVariantNumeric: 'tabular-nums',
            color:              'var(--text-secondary)',
          }}
        >
          {time || '- -:- -'}
        </span>
        {country.dstNote && (
          <span
            style={{
              fontSize:     '9px',
              fontWeight:   700,
              padding:      '1px 5px',
              borderRadius: 'var(--radius-full)',
              background:   'var(--warning-soft)',
              color:        'var(--warning)',
              lineHeight:   1.6,
              flexShrink:   0,
            }}
            title="يُطبّق التوقيت الصيفي (DST)"
            aria-label="يُطبّق التوقيت الصيفي"
          >
            DST
          </span>
        )}
      </div>
    </Link>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENT: UTCZoneSection

   FIX ④: custom areEqual comparator — only re-renders when this section's
           own timezone strings change, not when OTHER zones tick.
   FIX ③: useEffect to sync defaultOpen when activeRegion filter changes.
═══════════════════════════════════════════════════════════════════════════ */

function UTCZoneSectionBase({ group, times, isUserZone, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const bodyId              = `zone-body-${String(group.utc).replace('.', '_')}`

  /* FIX ③: sync isOpen when the parent recomputes defaultOpen (e.g. filter change) */
  const prevDefault = useRef(defaultOpen)
  useEffect(() => {
    if (prevDefault.current !== defaultOpen) {
      prevDefault.current = defaultOpen
      setIsOpen(defaultOpen)
    }
  }, [defaultOpen])

  const repCountry = group.countries.find(c => c.group === 'arab') ?? group.countries[0]
  const repTime    = repCountry ? (times[repCountry.tz] ?? '') : ''
  const phKey      = getPhase(localHour(group.utc))
  const ph         = PHASE[phKey]
  const arabCount  = group.countries.filter(c => c.group === 'arab').length

  return (
    <div
      id={`zone-${String(group.utc).replace('.', '_')}`}
      style={{
        background:   isUserZone
          ? 'linear-gradient(135deg, rgba(29,78,216,0.08) 0%, rgba(67,56,202,0.04) 100%)'
          : 'var(--bg-surface-1)',
        border:       `1px solid ${isUserZone ? 'var(--border-accent-strong)' : 'var(--border-subtle)'}`,
        boxShadow:    isUserZone ? 'var(--shadow-accent)' : 'none',
        borderRadius: 'var(--radius-2xl)',
        overflow:     'hidden',
        transition:   'box-shadow var(--transition-base), border-color var(--transition-base)',
      }}
    >
      {/* ── Collapsible Header ── */}
      <button
        type="button"   /* FIX ⑩ */
        onClick={() => setIsOpen(o => !o)}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        aria-label={`${isOpen ? 'طي' : 'توسيع'} قسم ${group.utcLabel} — ${group.countries.length} دولة`}
        className="atz-zone-btn"
        style={{
          width:       '100%',
          display:     'flex',
          alignItems:  'center',
          gap:         '12px',
          padding:     '14px 18px',
          background:  'transparent',
          border:      'none',
          cursor:      'pointer',
          textAlign:   'start',
        }}
      >
        {/* UTC offset badge */}
        <div
          aria-hidden="true"
          style={{
            background:         isUserZone ? 'var(--accent-gradient)' : `${ph.nodeColor}22`,
            border:             `1px solid ${isUserZone ? 'transparent' : ph.nodeColor + '55'}`,
            color:              isUserZone ? 'var(--text-on-accent)' : ph.nodeColor,
            borderRadius:       'var(--radius-xl)',
            padding:            '6px 14px',
            fontSize:           '0.8125rem',
            fontWeight:         700,
            fontFamily:         'monospace',
            fontVariantNumeric: 'tabular-nums',
            minWidth:           '92px',
            textAlign:          'center',
            flexShrink:         0,
            letterSpacing:      '0.03em',
            whiteSpace:         'nowrap',
          }}
        >
          {group.utcLabel}
        </div>

        {/* Meta block */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {isUserZone && (
              <span
                style={{
                  fontSize:     '11px',
                  fontWeight:   600,
                  padding:      '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background:   'var(--accent-soft)',
                  color:        'var(--accent-alt)',
                  lineHeight:   1.6,
                  whiteSpace:   'nowrap',
                }}
              >
                📍 توقيتك
              </span>
            )}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {group.countries.length} دولة
              {arabCount > 0 && ` · ${arabCount} عربية`}
            </span>
          </div>

          {/* Flag preview strip — visible only when collapsed */}
          {!isOpen && (
            <div
              style={{
                display:    'flex',
                gap:        '3px',
                alignItems: 'center',
                overflow:   'hidden',
                maxHeight:  '22px',
              }}
              aria-hidden="true"
            >
              {group.countries.slice(0, 14).map(c => (
                <span key={c.tz} style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>
                  {c.flag}
                </span>
              ))}
              {group.countries.length > 14 && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                  +{group.countries.length - 14}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side: live time + phase — shown on sm+ screens */}
        {/* FIX ②: removed inline display:'none' that overrode the Tailwind sm:block class */}
        {repTime && (
          <div className="hidden sm:flex" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
            <div
              style={{
                fontSize:           '0.875rem',
                fontFamily:         'monospace',
                fontVariantNumeric: 'tabular-nums',
                fontWeight:         600,
                color:              'var(--text-secondary)',
              }}
            >
              {repTime}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {ph.icon} {ph.label}
            </div>
          </div>
        )}

        {/* Chevron */}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          aria-hidden="true"
          style={{
            color:      'var(--text-muted)',
            transform:  isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-base)',
            flexShrink: 0,
          }}
        >
          <path
            d="M3.5 6L8 10.5L12.5 6"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Expandable chip grid ── */}
      {isOpen && (
        <div
          id={bodyId}
          role="region"
          aria-label={`دول ${group.utcLabel}`}
          style={{
            borderTop:           '1px solid var(--border-subtle)',
            padding:             '12px',
            display:             'grid',
            gap:                 '8px',
            /**
             * Responsive auto-fill: min 140px per chip.
             * Gives: 2 cols @ 320px, 3 @ 480px, 4 @ 640px, 5+ @ 768px+
             */
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          }}
        >
          {group.countries.map(c => (
            <CountryChip key={c.tz} country={c} time={times[c.tz] ?? ''} />
          ))}
        </div>
      )}
    </div>
  )
}

/** FIX ④: custom comparator — only re-renders if this section's own times changed */
function zoneSectionEqual(prev, next) {
  if (
    prev.isUserZone  !== next.isUserZone  ||
    prev.defaultOpen !== next.defaultOpen ||
    prev.group       !== next.group
  ) return false
  // Check only the timezones belonging to this section
  return next.group.countries.every(c => prev.times[c.tz] === next.times[c.tz])
}

const UTCZoneSection = memo(UTCZoneSectionBase, zoneSectionEqual)

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENT: UTCRail
   FIX ⑥: removed WebkitOverflowScrolling
   FIX ⑩: added type="button"
═══════════════════════════════════════════════════════════════════════════ */

function UTCRail({ allGroups, userOffset, onSelectUtc }) {
  const railRef = useRef(null)

  /* Centre user's UTC node in the scrollable rail after hydration */
  useEffect(() => {
    if (userOffset == null || !railRef.current) return
    const key  = String(userOffset).replace('.', '_')
    const node = railRef.current.querySelector(`[data-utckey="${key}"]`)
    if (node) {
      /* Use scrollLeft arithmetic to avoid page-level scroll side effects */
      const containerRect = railRef.current.getBoundingClientRect()
      const nodeRect      = node.getBoundingClientRect()
      const target        = railRef.current.scrollLeft +
        (nodeRect.left - containerRect.left) -
        (containerRect.width / 2) +
        (nodeRect.width / 2)
      railRef.current.scrollTo({ left: target, behavior: 'smooth' })
    }
  }, [userOffset])

  return (
    <div
      style={{
        background:   'var(--bg-surface-1)',
        border:       '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-2xl)',
        overflow:     'hidden',
        marginBottom: '20px',
      }}
      role="navigation"
      aria-label="مخطط المناطق الزمنية — اضغط للانتقال"
    >
      {/* Scrollable track — FIX ⑥: removed WebkitOverflowScrolling */}
      <div
        ref={railRef}
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        <div
          dir="ltr"
          aria-hidden="true"
          style={{
            display:           'grid',
            gridTemplateRows:  'auto auto auto auto',
            minWidth:          'max-content',
            padding:           '16px 28px 12px',
          }}
        >
          {/* Row 1 — Phase icons */}
          <div style={{ display: 'flex' }}>
            {allGroups.map((g, i) => {
              const ph     = PHASE[getPhase(localHour(g.utc))]
              const isUser = userOffset != null && Math.abs(g.utc - userOffset) < 0.26
              return (
                <Fragment key={`icon-${g.utc}`}>
                  <div
                    style={{
                      minWidth:     '56px',
                      textAlign:    'center',
                      fontSize:     isUser ? '1.1rem' : '0.875rem',
                      lineHeight:   1,
                      paddingBottom:'4px',
                      opacity:      isUser ? 1 : 0.5,
                      transition:   'opacity 200ms ease, font-size 200ms ease',
                    }}
                  >
                    {ph.icon}
                  </div>
                  {i < allGroups.length - 1 && <div style={{ width: '24px' }} />}
                </Fragment>
              )
            })}
          </div>

          {/* Row 2 — Circles + connectors */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {allGroups.map((g, i) => {
              const ph     = PHASE[getPhase(localHour(g.utc))]
              const isUser = userOffset != null && Math.abs(g.utc - userOffset) < 0.26
              const nextPh = i < allGroups.length - 1
                ? PHASE[getPhase(localHour(allGroups[i + 1].utc))]
                : null

              return (
                <Fragment key={`node-${g.utc}`}>
                  <button
                    type="button"   /* FIX ⑩ */
                    data-utckey={String(g.utc).replace('.', '_')}
                    onClick={() => onSelectUtc(g.utc)}
                    title={`${g.utcLabel} — انقر للانتقال`}
                    aria-label={`انتقل إلى قسم ${g.utcLabel}`}
                    className="atz-rail-btn"
                    style={{
                      minWidth:   '56px',
                      height:     '32px',
                      display:    'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'none',
                      border:     'none',
                      cursor:     'pointer',
                      padding:    0,
                      position:   'relative',
                    }}
                  >
                    {/* Glow ring for user zone */}
                    {isUser && (
                      <span
                        style={{
                          position:     'absolute',
                          width:        '30px',
                          height:       '30px',
                          borderRadius: '50%',
                          background:   'var(--accent-glow-strong)',
                        }}
                      />
                    )}
                    {/* Node circle */}
                    <span
                      style={{
                        display:      'block',
                        width:        isUser ? '18px' : '10px',
                        height:       isUser ? '18px' : '10px',
                        borderRadius: '50%',
                        background:   isUser ? 'var(--accent-gradient)' : ph.nodeColor,
                        border:       `2px solid ${isUser ? 'var(--accent-alt)' : ph.nodeColor}`,
                        boxShadow:    isUser
                          ? 'var(--shadow-accent-strong)'
                          : `0 0 8px ${ph.glowColor}`,
                        position:     'relative',
                        zIndex:       2,
                        transition:   'all 200ms var(--ease-spring)',
                        flexShrink:   0,
                      }}
                    />
                  </button>

                  {/* Connector */}
                  {i < allGroups.length - 1 && (
                    <div
                      style={{
                        width:      '24px',
                        height:     '2px',
                        flexShrink: 0,
                        background: `linear-gradient(to right, ${ph.nodeColor}88, ${nextPh?.nodeColor ?? ph.nodeColor}88)`,
                        borderRadius: '1px',
                      }}
                    />
                  )}
                </Fragment>
              )
            })}
          </div>

          {/* Row 3 — UTC labels */}
          <div style={{ display: 'flex', marginTop: '6px' }}>
            {allGroups.map((g, i) => {
              const isUser = userOffset != null && Math.abs(g.utc - userOffset) < 0.26
              return (
                <Fragment key={`label-${g.utc}`}>
                  <div
                    style={{
                      minWidth:           '56px',
                      textAlign:          'center',
                      fontSize:           '10px',
                      fontFamily:         'monospace',
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight:         isUser ? 700 : 400,
                      color:              isUser ? 'var(--accent-alt)' : 'var(--text-muted)',
                      whiteSpace:         'nowrap',
                      letterSpacing:      '0.04em',
                    }}
                  >
                    {g.utcLabel}
                  </div>
                  {i < allGroups.length - 1 && <div style={{ width: '24px' }} />}
                </Fragment>
              )
            })}
          </div>

          {/* Row 4 — Country counts */}
          <div style={{ display: 'flex', marginTop: '4px' }}>
            {allGroups.map((g, i) => (
              <Fragment key={`count-${g.utc}`}>
                <div
                  style={{
                    minWidth:  '56px',
                    textAlign: 'center',
                    fontSize:  '9px',
                    color:     'var(--text-disabled)',
                  }}
                >
                  {g.countries.length}🌍
                </div>
                {i < allGroups.length - 1 && <div style={{ width: '24px' }} />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: user offset + phase legend */}
      <div
        style={{
          borderTop:  '1px solid var(--border-subtle)',
          padding:    '8px 16px',
          display:    'flex',
          alignItems: 'center',
          gap:        '8px',
          flexWrap:   'wrap',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          اضغط على نقطة للانتقال
        </span>
        {userOffset != null ? (
          <span style={{ fontSize: '11px', color: 'var(--accent-alt)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            📍 {buildUtcLabel(userOffset)}
          </span>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>
            جارٍ تحديد موقعك…
          </span>
        )}

        {/* Phase legend — hidden on very small screens via GLOBAL_STYLES media query */}
        <div
          className="atz-phase-legend"
          style={{
            marginInlineStart: 'auto',
            display:           'flex',
            gap:               '8px',
            flexWrap:          'wrap',
            justifyContent:    'flex-end',
          }}
        >
          {Object.entries(PHASE).map(([key, val]) => (
            <span
              key={key}
              style={{ fontSize: '10px', color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}
            >
              {val.icon} {val.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT: ArabTimezonesLiveClient
═══════════════════════════════════════════════════════════════════════════ */

export default function ArabTimezonesLiveClient({ groups }) {
  const [activeRegion, setActiveRegion] = useState('all')
  const [times, setTimes]               = useState({})
  const [userOffset, setUserOffset]     = useState(null)
  const [isInView, setIsInView]         = useState(false)  /* FIX ⑪ */
  const containerRef                    = useRef(null)

  /* FIX ⑫: inject global styles once with useInsertionEffect (React 18) */
  useInsertionEffect(() => {
    if (typeof document === 'undefined') return
    const id = 'atz-styles'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = GLOBAL_STYLES
      document.head.appendChild(el)
    }
  }, [])

  /* Detect user UTC offset after hydration */
  useEffect(() => {
    setUserOffset(-new Date().getTimezoneOffset() / 60)
  }, [])

  /**
   * FIX ⑪: IntersectionObserver — defer clock start until section is near viewport.
   * rootMargin '400px' means we start ticking 400px BEFORE the section enters view,
   * so times are ready by the time the user actually sees the component.
   * Once visible, we disconnect the observer (stays ticking as long as page is open).
   */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setIsInView(true)  // SSR/old browser fallback
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Live clock — only starts when section is within 400px of viewport */
  useEffect(() => {
    if (!isInView) return

    function tick() {
      const now  = new Date()
      const next = {}
      groups.forEach(g =>
        g.countries.forEach(c => {
          const fmt = getFormatter(c.tz)
          if (fmt) next[c.tz] = fmt.format(now)
        }),
      )
      setTimes(next)
    }

    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [groups, isInView])

  /**
   * FIX ⑨: regionCounts as useMemo — computed once per groups reference,
   *         not recalculated on every render as a useCallback.
   */
  const regionCounts = useMemo(() => {
    const counts = { all: 0 }
    REGIONS.forEach(r => { if (r.id !== 'all') counts[r.id] = 0 })
    groups.forEach(g =>
      g.countries.forEach(c => {
        counts.all = (counts.all ?? 0) + 1
        if (counts[c.group] !== undefined) counts[c.group] += 1
      }),
    )
    return counts
  }, [groups])

  /* Filter groups by active region */
  const filteredGroups = useMemo(() => {
    if (activeRegion === 'all') return groups
    return groups
      .map(g => ({ ...g, countries: g.countries.filter(c => c.group === activeRegion) }))
      .filter(g => g.countries.length > 0)
  }, [groups, activeRegion])

  /* Scroll to a UTC zone section */
  const handleSelectUtc = useCallback((utc) => {
    const id = `zone-${String(utc).replace('.', '_')}`
    const el = document.getElementById(id)
    if (!el) return
    const offset = 80  // clear sticky navbar (72px) + breathing room
    const top    = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  /* Decide if a section should start open */
  const isDefaultOpen = useCallback((group) => {
    if (activeRegion !== 'all') return true
    if (group.countries.some(c => c.group === 'arab')) return true
    if (userOffset != null && Math.abs(group.utc - userOffset) < 0.26) return true
    return false
  }, [activeRegion, userOffset])

  return (
    <div dir="rtl" ref={containerRef}>

      {/* ══════════════════════════════════════════════════════
          ① REGION FILTER TABS
          role="group" + aria-label groups the pills semantically.
          type="button" on each (FIX ⑩).
      ══════════════════════════════════════════════════════ */}
      <div
        style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '20px' }}
        role="group"
        aria-label="تصفية الدول حسب المنطقة الجغرافية"
      >
        <div
          dir="rtl"
          style={{ display: 'flex', gap: '8px', minWidth: 'max-content', paddingBottom: '4px' }}
        >
          {REGIONS.map(r => {
            const active = activeRegion === r.id
            const count  = regionCounts[r.id] ?? 0
            return (
              <button
                key={r.id}
                type="button"   /* FIX ⑩ */
                onClick={() => setActiveRegion(r.id)}
                aria-pressed={active}
                aria-label={`${r.arLabel} — ${count} دولة`}
                className="atz-filter-btn"
                style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          '6px',
                  padding:      '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border:       `1px solid ${active ? 'transparent' : 'var(--border-default)'}`,
                  background:   active ? 'var(--accent-gradient)' : 'var(--bg-surface-2)',
                  color:        active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                  fontSize:     '0.8125rem',
                  fontWeight:   600,
                  cursor:       'pointer',
                  flexShrink:   0,
                  whiteSpace:   'nowrap',
                  transition:   'all var(--transition-fast)',
                  fontFamily:   'inherit',
                }}
              >
                <span aria-hidden="true">{r.icon}</span>
                <span>{r.label}</span>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize:     '10px',
                    fontWeight:   700,
                    padding:      '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background:   active ? 'rgba(255,255,255,0.22)' : 'var(--bg-surface-3)',
                    color:        active ? 'var(--text-on-accent)' : 'var(--text-muted)',
                    lineHeight:   1.6,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ② UTC TIMELINE RAIL
          Always shows ALL groups (unfiltered) — provides
          global context even when filter is active.
      ══════════════════════════════════════════════════════ */}
      <UTCRail
        allGroups={groups}
        userOffset={userOffset}
        onSelectUtc={handleSelectUtc}
      />

      {/* ══════════════════════════════════════════════════════
          ③ UTC ZONE SECTIONS
          Single aria-live region wraps all sections so screen
          readers get one "times updated" announcement per tick
          instead of 91 (FIX ⑧).
      ══════════════════════════════════════════════════════ */}
      <div
        aria-live="polite"
        aria-atomic="false"
        aria-label="الأوقات الحالية لكل دولة"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredGroups.map(group => (
            <UTCZoneSection
              key={group.utc}
              group={group}
              times={times}
              isUserZone={userOffset != null && Math.abs(group.utc - userOffset) < 0.26}
              defaultOpen={isDefaultOpen(group)}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filteredGroups.length === 0 && (
        <div
          role="status"
          style={{
            textAlign:    'center',
            padding:      '64px 24px',
            borderRadius: 'var(--radius-2xl)',
            background:   'var(--bg-surface-1)',
            border:       '1px solid var(--border-subtle)',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>
            🌐
          </span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            لا توجد دول في هذا التصنيف
          </p>
        </div>
      )}

      {/* Live-update dot */}
      <div
        style={{
          marginTop:      '16px',
          display:        'flex',
          alignItems:     'center',
          gap:            '6px',
          justifyContent: 'flex-end',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display:      'inline-block',
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   isInView ? 'var(--success)' : 'var(--text-disabled)',
            boxShadow:    isInView ? '0 0 6px var(--success)' : 'none',
            transition:   'all 300ms ease',
          }}
        />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {isInView ? 'يتحدث تلقائياً كل ٣٠ ثانية' : 'سيبدأ التحديث عند الوصول…'}
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════
          SEO HIDDEN NAV — all 91+ country links always in DOM.
          Never filtered, never collapsed, always crawlable.
          Rich anchor text: name + UTC + capital + full phrase.
      ══════════════════════════════════════════════════════ */}
      <nav
        aria-label="روابط توقيت جميع الدول"
        className="sr-only"
      >
        <ul>
          {groups.flatMap(g =>
            g.countries.map(c => (
              <li key={c.tz}>
                <Link href={`/time-now/${slugify(c.nameAr)}`}>
                  {`توقيت ${c.nameAr} الآن — الوقت في ${c.capital} — ${c.utcLabel}`}
                </Link>
              </li>
            )),
          )}
        </ul>
      </nav>

    </div>
  )
}