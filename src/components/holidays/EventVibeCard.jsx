'use client'

/**
 * components/holidays/EventVibeCard.jsx
 * ─────────────────────────────────────────────────────────────────────
 * The "WOW" section — premium animated card, one per event page.
 * Splits:
 *   Logic   → ./useEventVibe.js
 *   Styles  → ./event-vibe-card.css
 *   UI      → THIS FILE
 *
 * Props:
 *   eventName   {string}  — event.name from engine
 *   daysLeft    {number}  — integer days remaining
 *   categoryId  {string}  — event.category (one of 7 categories)
 *   countryCode {string|null} — event._countryCode
 *   slug        {string}  — event slug
 *   eventType   {string}  — event.type ('hijri'|'fixed'|'estimated'|'monthly')
 *
 * Design contract:
 *   ✅ CSS vars only — zero hardcoded colors
 *   ✅ RTL-first layout
 *   ✅ Container queries for responsive sizing (not viewport queries)
 *   ✅ prefers-reduced-motion via CSS
 *   ✅ WCAG AA contrast on all visible text
 *   ✅ No new npm packages
 *   ✅ Works in both .dark and .light themes automatically
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'
import './event-vibe-card.css'
import {
  getCategoryConfig,
  getUrgencyTier,
  getEventHeadline,
  getEventSubtext,
  getArcData,
  getVibeStats,
} from './useEventVibe'

/* ══════════════════════════════════════════════════════════════════════
   SVG BACKGROUND PATTERNS
   Each pattern is purely decorative (aria-hidden).
   All colors via `currentColor` — parent sets `color: var(--accent-alt)`.
   ══════════════════════════════════════════════════════════════════════ */

/** Islamic geometric: rotating dashed ring + crescent silhouette + star dots */
function MoonPattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 200 200" className="evibe-pattern"
      style={{ opacity: 0.08, color: 'inherit' }}
    >
      {/* Dashed outer ring — slow clockwise rotation */}
      <circle cx="100" cy="100" r="88" fill="none"
        stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 10"
        className="spin-cw"
      />
      {/* Dashed inner ring — counter-clockwise */}
      <circle cx="100" cy="100" r="62" fill="none"
        stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 7"
        className="spin-ccw"
      />
      {/* Crescent: large circle minus offset circle */}
      <path
        d="M100 28 A72 72 0 1 0 100 172 A50 50 0 1 1 100 28Z"
        fill="currentColor" className="breathe"
      />
      {/* Star dots at different positions */}
      <circle cx="160" cy="45"  r="2.5" fill="currentColor" className="twinkle-1" />
      <circle cx="38"  cy="62"  r="2"   fill="currentColor" className="twinkle-2" />
      <circle cx="168" cy="125" r="3"   fill="currentColor" className="twinkle-3" />
      <circle cx="30"  cy="148" r="2.5" fill="currentColor" className="twinkle-4" />
      <circle cx="145" cy="172" r="2"   fill="currentColor" className="twinkle-5" />
    </svg>
  )
}

/** Astronomy: concentric orbit rings + true orbiting planet */
function OrbitPattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 200 200" className="evibe-pattern"
      style={{ opacity: 0.07, color: 'inherit' }}
    >
      {/* Static rings */}
      {[28, 46, 64, 82].map((r, i) => (
        <circle key={r} cx="100" cy="100" r={r}
          fill="none" stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 0.7 : 0.4}
          strokeDasharray={i % 2 === 0 ? 'none' : '2 5'}
        />
      ))}
      {/*
        True orbital motion:
        - A <g> element centered at (100,100) rotates the "arm"
        - The planet circle is offset 64px from center on the arm
        - A counter-rotating child keeps the planet non-spinning
      */}
      <g className="orbit-arm" style={{ transformOrigin: '100px 100px' }}>
        <g transform="translate(164, 100)">
          <circle r="5" fill="currentColor" className="orbit-planet" />
        </g>
      </g>
      {/* Second smaller planet on inner orbit */}
      <g className="spin-ccw" style={{ animationDuration: '8s', transformOrigin: '100px 100px' }}>
        <g transform="translate(146, 100)">
          <circle r="3" fill="currentColor" />
        </g>
      </g>
    </svg>
  )
}

/**
 * Grid pattern using SVG <pattern> fill — ONE DOM node instead of 64 circles.
 * Much more performant and creates a uniform dot grid.
 */
function GridPattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 200 200" className="evibe-pattern"
      style={{ opacity: 0.06, color: 'inherit' }}
    >
      <defs>
        <pattern id="evibe-dot-grid" x="0" y="0" width="22" height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="11" cy="11" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#evibe-dot-grid)" />
      {/* Animated diagonal accent line */}
      <line x1="0" y1="200" x2="200" y2="0"
        stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 12"
        className="spin-cw" style={{ transformOrigin: '100px 100px', animationDuration: '60s' }}
      />
    </svg>
  )
}

/** Wave pattern: three sinusoidal paths that float up/down */
function WavePattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 400 160" preserveAspectRatio="none"
      className="evibe-pattern"
      style={{ opacity: 0.07, color: 'inherit' }}
    >
      <path d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80"
        fill="none" stroke="currentColor" strokeWidth="1.8"
        className="wave-1"
      />
      <path d="M0 105 Q50 75 100 105 T200 105 T300 105 T400 105"
        fill="none" stroke="currentColor" strokeWidth="1.2"
        className="wave-2"
      />
      <path d="M0 130 Q50 100 100 130 T200 130 T300 130 T400 130"
        fill="none" stroke="currentColor" strokeWidth="0.8"
        className="wave-3"
      />
    </svg>
  )
}

const PATTERN_MAP = {
  moon:  MoonPattern,
  orbit: OrbitPattern,
  grid:  GridPattern,
  wave:  WavePattern,
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

export default function EventVibeCard({
  eventName,
  daysLeft,
  categoryId,
  countryCode,
  slug,
  eventType,
}) {
  const [isVisible, setIsVisible] = useState(false)

  // Delay the entry animation until after initial paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // ── Derived state from logic hook ─────────────────────────────────
  const config   = getCategoryConfig(categoryId)
  const urgency  = getUrgencyTier(daysLeft, categoryId)
  const headline = getEventHeadline(slug, categoryId, daysLeft, eventName)
  const subtext  = getEventSubtext(slug, categoryId, countryCode)
  const arcData  = getArcData(categoryId, daysLeft)
  const stats    = getVibeStats(categoryId, daysLeft, slug)

  // ── SVG pattern component ─────────────────────────────────────────
  const Pattern = PATTERN_MAP[config.pattern] ?? MoonPattern

  // ── Arc CSS custom property values ───────────────────────────────
  // These go on the SVG circle element via inline style.
  // CSS reads them in the @keyframes animation.
  const arcStyle = {
    '--evibe-circ':   arcData.circ,
    '--evibe-offset': arcData.offset,
  }

  // ── Urgency color styles ──────────────────────────────────────────
  const urgencyStyle = {
    color:           `var(${urgency.cssVar})`,
    backgroundColor: `var(${urgency.softVar})`,
    borderColor:     `var(${urgency.cssVar})`,
    '--evibe-urgency-color-soft': `var(${urgency.softVar})`,
  }

  return (
    <section
      aria-label={`نظرة على ${eventName}`}
      className={`evibe-wrapper${isVisible ? '' : ' evibe-hidden'}`}
      style={{ opacity: isVisible ? undefined : 0 }}
    >
      {/* ── Ambient glow behind everything ────────────────────────── */}
      <div className="evibe-bg-glow" aria-hidden="true" />

      {/* ── Category-specific SVG pattern ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ color: `var(${config.accentCssVar})` }}
      >
        <Pattern />
      </div>

      {/* ── All content sits above the pattern ────────────────────── */}
      <div className="evibe-content">

        {/* Top row: category chip + urgency badge */}
        <div className="evibe-top-row">
          <div className="evibe-category-chip">
            <span role="img" aria-hidden="true" style={{ fontSize: 'var(--text-lg)' }}>
              {config.emoji}
            </span>
            <span>{config.label}</span>
          </div>

          {urgency.label && (
            <span
              className={`evibe-urgency-badge${urgency.ringPulse ? ' evibe-urgency-badge--ring' : ''}`}
              style={urgencyStyle}
              role="status"
              aria-live="polite"
            >
              {urgency.ringPulse && (
                <span className="evibe-pulse-ring" aria-hidden="true"
                  style={{ borderColor: `var(${urgency.cssVar})` }}
                />
              )}
              {urgency.label}
            </span>
          )}
        </div>

        {/* Main body: arc meter + headline text */}
        <div className="evibe-body">

          {/* Arc meter */}
          <div className="evibe-arc-container" role="img"
            aria-label={`${arcData.pct}٪ من فترة الانتظار مضت`}
          >
            <svg
              viewBox="0 0 108 108"
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                className="evibe-arc-track"
                cx="54" cy="54"
                r={arcData.radius}
              />
              {/* Filled arc */}
              <circle
                className="evibe-arc-fill"
                cx="54" cy="54"
                r={arcData.radius}
                style={{
                  ...arcStyle,
                  stroke: `var(${config.accentCssVar})`,
                }}
              />
            </svg>

            {/* Number overlay */}
            <div className="evibe-arc-center" aria-hidden="true">
              <span className="evibe-arc-number"
                style={{ color: `var(${config.accentCssVar})` }}
              >
                {daysLeft}
              </span>
              <span className="evibe-arc-label">يوم</span>
            </div>
          </div>

          {/* Headline + subtext */}
          <div className="evibe-text">
            <h3 className="evibe-headline">{headline}</h3>
            <p className="evibe-subtext">{subtext}</p>
          </div>
        </div>

        {/* Stats pills */}
        {stats.length > 0 && (
          <div className="evibe-stats" role="list" aria-label="إحصائيات">
            {stats.map(stat => (
              <div key={stat.label} className="evibe-stat-pill" role="listitem">
                <span className="evibe-stat-label">{stat.label}</span>
                <span className="evibe-stat-value"
                  style={{ color: `var(${config.accentCssVar})` }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}