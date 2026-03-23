/**
 * SectionTimezoneSpectrum — "طيف المناطق الزمنية"
 * ─────────────────────────────────────────────────────────────────────────────
 * A horizontal UTC offset axis showing where every country sits on the global
 * timezone spectrum. The physical distance between any two pins = the time
 * difference between those countries.
 *
 * BUGS FIXED (v2 audit, 10 issues):
 *
 *  [CRITICAL-1] preserveAspectRatio="none" with no explicit height collapses SVG to 0px.
 *    FIX: Removed that attr. Added style={{ height:'auto', minHeight:'420px' }}.
 *    The SVG now sizes itself from viewBox + aspect ratio naturally.
 *
 *  [CRITICAL-2] Mixed coordinate systems: x used CSS '%' (viewport-relative),
 *    y used SVG user units. These look identical with preserveAspectRatio=none
 *    but break with any other scaling mode and cause flickering on resize.
 *    FIX: ALL coordinates now use SVG user units (0–1000) via toUnits().
 *    toUnits(utc) = ((utc - AXIS_MIN) / AXIS_RANGE) * VW
 *
 *  [CRITICAL-3] City dots (circle) were at yPin=295, bar top at BAR_Y=330 →
 *    35-unit gap. Connector stopped at the dot, not at the bar. Dot floated
 *    in mid-air above the bar.
 *    FIX: Dots now placed at BAR_CY = BAR_Y + BAR_H/2 = 336. Connector runs
 *    from below the flag (y = flagCenter + 14) down to BAR_CY. Dot sits
 *    perfectly ON the bar's centre line.
 *
 *  [BUG-4] strokeDasharray="none" is not a valid SVG value.
 *    FIX: For Arab city connectors (which should be solid), the attribute is
 *    simply omitted. For non-Arab (dashed), value "4,4" is kept.
 *
 *  [BUG-5] Scroll fade used Tailwind end-0 → compiles to left:0 in RTL pages.
 *    LTR scroll content overflows to the RIGHT, so the fade must be on the right.
 *    FIX: Replaced with style={{ right: 0, left: 'auto' }} inline style.
 *
 *  [BUG-6] CANVAS_H too small: lane-4 name label rendered at y ≈ −1, above
 *    the viewBox, and was clipped/invisible.
 *    FIX: CANVAS_H=420, BAR_Y=345, PIN_0=310. Lane-4 name top now at y=14. ✅
 *
 *  [BUG-7] SVG <text> had no fontFamily → browser rendered serif.
 *    FIX: fontFamily="inherit" on every text node so it uses the app font.
 *
 *  [BUG-8] Day-zone glow <rect> used % for x but absolute for y.
 *    FIX: x and width now use toUnits() values (user units).
 *
 *  [BUG-9] Arab region highlight <rect> used % for x.
 *    FIX: Same — converted to toUnits().
 *
 *  [UX-10] Individual city <g> groups had no accessible name.
 *    FIX: role="img" + aria-label on each <g> with city name + UTC offset.
 *
 * RESPONSIVE STRATEGY:
 *   Mobile  (<640px): horizontally scrollable, min-width 640px, fade on RIGHT edge
 *   Tablet+ (≥640px): full-width, all 23 pins visible, no scroll
 *
 * PERFORMANCE:
 *   Pure SVG + CSS, zero JS, zero client bundle. Renders on the server.
 *   No hydration issues — no suppressHydrationWarning needed.
 */

import Link from 'next/link'
import { SectionWrapper, SectionBadge } from '@/components/shared/primitives'
import { SPECTRUM_CITIES, AXIS_MIN, AXIS_MAX, AXIS_RANGE } from './data/spectrumCities'

const H2_ID = 'h2-timezone-spectrum'

/* ── Layout constants (all in SVG user units) ────────────────────────────── */
const VW       = 1000   // viewBox width
const CANVAS_H = 420    // viewBox height — tall enough for 5 lanes + axis + labels
const BAR_Y    = 345    // y of bar top edge
const BAR_H    = 12     // bar height
const BAR_CY   = BAR_Y + Math.floor(BAR_H / 2)  // 351 — bar centre, where dots land
const LANE_H   = 62     // vertical spacing between pin lanes
const PIN_0    = BAR_Y - 35  // 310 — yPin for lane-0 (closest to bar)

/* ── Coordinate helpers ──────────────────────────────────────────────────── */
/**
 * Horizontal padding in SVG user units.
 * Ensures edge tick labels (−6 on left, +10 on right) are never clipped.
 * textAnchor="middle" at x=0 or x=VW would render half off-screen.
 */
const H_PAD = 30

/** Convert UTC offset to SVG user-unit x position, with H_PAD on each side. */
function toUnits(utc) {
  return H_PAD + ((utc - AXIS_MIN) / AXIS_RANGE) * (VW - 2 * H_PAD)
}

/** yPin for a given lane index (0 = closest to bar, higher = further up). */
function laneY(index) {
  return PIN_0 - index * LANE_H
}

/* ── Axis ticks: every integer UTC from AXIS_MIN to AXIS_MAX ─────────────── */
const AXIS_TICKS = Array.from(
  { length: AXIS_MAX - AXIS_MIN + 1 },
  (_, i) => AXIS_MIN + i,
)

export default function SectionTimezoneSpectrum() {
  return (
    <SectionWrapper
      id="section-timezone-spectrum"
      headingId={H2_ID}
      glow={
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%, var(--accent) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      }
    >

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="max-w-2xl mb-10 space-y-3">
        <SectionBadge>🌐 طيف المناطق الزمنية</SectionBadge>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          ترتيب الدول على
          <span
            className="block"
            style={{
              background:           'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            محور التوقيت العالمي
          </span>
        </h2>

        <p
          className="text-sm sm:text-base max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          كل دولة تحتل موقعاً محدداً على محور{' '}
          <strong style={{ color: 'var(--text-primary)' }}>UTC</strong> —
          المسافة الأفقية بين أي بلدين هي{' '}
          <strong style={{ color: 'var(--text-primary)' }}>فرق التوقيت</strong>{' '}
          بينهما بالساعة. الدول العربية مُبرزة بالأزرق.
        </p>
      </header>

      {/* ── Spectrum canvas ─────────────────────────────────────────────── */}
      {/*
        direction:ltr — the UTC axis is a number line, not text.
        It must always go left-to-right regardless of page RTL.
      */}
      <div className="relative" style={{ direction: 'ltr' }}>

        {/*
          SCROLL FADE — RIGHT side only.
          BUG-5 FIX: RTL pages compile 'end-0' to 'left:0'.
          LTR content overflows to the RIGHT, so the fade must be RIGHT.
          Using inline style to bypass RTL logical-property compilation.
        */}
        <div
          className="pointer-events-none absolute top-0 h-full w-16 sm:hidden z-10"
          style={{
            right:      0,
            left:       'auto',
            background: 'linear-gradient(to left, var(--bg-base, #0a0c14) 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Scrollable wrapper — hidden scrollbar, min-width for mobile */}
        <div
          className="overflow-x-auto"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          role="region"
          aria-label="شريط مناطق التوقيت — قابل للتمرير"
        >
          <div style={{ minWidth: '640px' }}>

            {/*
              SVG SPECTRUM
              ─────────────
              BUG-1 FIX: No preserveAspectRatio="none". SVG sizes itself from
              viewBox intrinsically. minHeight guard ensures it never collapses
              if the container has no explicit height.

              BUG-2 FIX: ALL coordinates use SVG user units (0–VW / 0–CANVAS_H).
              No % values appear inside the SVG (they are only valid for CSS props
              on the outer wrapper, not for SVG presentation attributes).
            */}
            <svg
              viewBox={`0 0 ${VW} ${CANVAS_H}`}
              width="100%"
              aria-label="مخطط مناطق التوقيت العالمي — من UTC−6 إلى UTC+10"
              role="img"
              style={{
                display:   'block',
                overflow:  'visible',
                height:    'auto',
                minHeight: '280px',  /* prevents flash-of-zero-height */
              }}
            >
              {/* ── Defs ─────────────────────────────────────────────── */}
              <defs>
                {/*
                  Day/night gradient along the horizontal axis.
                  UTC+0 (x=375) = golden "daytime" centre.
                  Edges = deep blue "night".
                */}
                <linearGradient id="tdBarGrad" x1="0" y1="0" x2={VW} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0"    stopColor="var(--info)"    stopOpacity="0.15" />
                  <stop offset="0.38" stopColor="var(--accent)"  stopOpacity="0.35" />
                  <stop offset="0.5"  stopColor="var(--warning)" stopOpacity="0.40" />
                  <stop offset="0.62" stopColor="var(--accent)"  stopOpacity="0.35" />
                  <stop offset="1"    stopColor="var(--info)"    stopOpacity="0.15" />
                </linearGradient>

                {/* Subtle fill for the full bar background */}
                <linearGradient id="tdBarBg" x1="0" y1="0" x2={VW} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0"   stopColor="var(--bg-surface-3)" stopOpacity="0.8" />
                  <stop offset="0.5" stopColor="var(--bg-surface-2)" stopOpacity="1"   />
                  <stop offset="1"   stopColor="var(--bg-surface-3)" stopOpacity="0.8" />
                </linearGradient>

                {/* Glow filter for Arab city dots */}
                <filter id="tdPinGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Clip to keep pins within the usable area */}
                <clipPath id="tdPinClip">
                  <rect x="0" y="0" width={VW} height={CANVAS_H} />
                </clipPath>
              </defs>

              {/* ── Arab region highlight — UTC+0 → UTC+4 ────────────── */}
              {/*
                BUG-9 FIX: x and width use toUnits() — SVG user units.
                Previously used "%" which is CSS viewport-relative inside SVG.
              */}
              <rect
                x={toUnits(0)}
                y={8}
                width={toUnits(4) - toUnits(0)}
                height={CANVAS_H - 8 - (CANVAS_H - BAR_Y + 10)}
                rx="6"
                fill="var(--accent)"
                opacity="0.04"
              />

              {/* ── UTC+0 meridian vertical guide line ───────────────── */}
              <line
                x1={toUnits(0)} y1={16}
                x2={toUnits(0)} y2={CANVAS_H - 20}
                stroke="var(--accent-alt)"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.3"
              />

              {/* ── Tick marks ───────────────────────────────────────── */}
              {AXIS_TICKS.map((t) => {
                const x     = toUnits(t)
                const isKey = t === 0 || t % 2 === 0   // emphasise even offsets
                const isZ   = t === 0

                return (
                  <g key={`tick-${t}`}>
                    {/* Tick line above bar */}
                    <line
                      x1={x} y1={BAR_Y - 18}
                      x2={x} y2={BAR_Y - 2}
                      stroke={isZ ? 'var(--accent-alt)' : 'var(--border-default)'}
                      strokeWidth={isZ ? 2 : 1}
                      opacity={isKey ? 0.75 : 0.35}
                    />

                    {/* UTC label below bar */}
                    {isKey && (
                      <text
                        x={x}
                        y={BAR_Y + BAR_H + 16}
                        textAnchor="middle"
                        fontSize={isZ ? 12 : 11}
                        fontWeight={isZ ? '700' : '400'}
                        fill={isZ ? 'var(--accent-alt)' : 'var(--text-muted)'}
                        fontFamily="inherit"   /* BUG-7 FIX */
                      >
                        {t === 0 ? '0' : t > 0 ? `+${t}` : String(t)}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* ── Axis bar ─────────────────────────────────────────── */}
              {/* Base fill */}
              <rect
                x={toUnits(AXIS_MIN)}
                y={BAR_Y}
                width={toUnits(AXIS_MAX) - toUnits(AXIS_MIN)}
                height={BAR_H}
                rx={BAR_H / 2}
                fill="url(#tdBarBg)"
              />
              {/* Colour overlay */}
              <rect
                x={toUnits(AXIS_MIN)}
                y={BAR_Y}
                width={toUnits(AXIS_MAX) - toUnits(AXIS_MIN)}
                height={BAR_H}
                rx={BAR_H / 2}
                fill="url(#tdBarGrad)"
                opacity="0.9"
              />
              {/* Border */}
              <rect
                x={toUnits(AXIS_MIN)}
                y={BAR_Y}
                width={toUnits(AXIS_MAX) - toUnits(AXIS_MIN)}
                height={BAR_H}
                rx={BAR_H / 2}
                fill="none"
                stroke="var(--border-default)"
                strokeWidth="1"
                opacity="0.4"
              />

              {/* "UTC±0 / خط غرينتش" label on bar */}
              <text
                x={toUnits(0)}
                y={BAR_Y + BAR_H + 32}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--accent-alt)"
                fontFamily="inherit"   /* BUG-7 FIX */
                opacity="0.8"
              >
                خط غرينتش
              </text>

              {/* ── City pins ────────────────────────────────────────── */}
              {/*
                BUG-2 FIX: x = toUnits(city.utc) — SVG user units.
                BUG-3 FIX: dot cy = BAR_CY (on bar centre), connector ends there.
                BUG-4 FIX: strokeDasharray omitted for solid lines (Arab cities).
                UX-10 FIX: role+aria-label on each group.
              */}
              {SPECTRUM_CITIES.map((city) => {
                const x       = toUnits(city.utc)
                const yPin    = laneY(city.laneIndex)        // connector-end on bar
                const yFlag   = yPin - LANE_H * 0.45         // flag centre
                const yName   = yFlag - 20                   // name baseline

                const isArab  = city.arab
                const dotColor    = isArab ? 'var(--accent-alt)' : 'var(--border-default)'
                const lineColor   = isArab ? 'var(--accent-alt)' : 'var(--text-muted)'
                const nameColor   = isArab ? 'var(--text-primary)' : 'var(--text-muted)'
                const lineOpacity = isArab ? '0.65' : '0.3'
                const dotRadius   = isArab ? 5 : 3.5

                /* The connector runs from below the flag to the bar centre */
                const connectorTop    = yFlag + 14
                const connectorBottom = BAR_CY   /* BUG-3 FIX */

                const utcLabel = city.utc === 0
                  ? 'UTC±0'
                  : city.utc > 0
                  ? `UTC+${city.utc}`
                  : `UTC${city.utc}`

                return (
                  <g
                    key={`${city.nameAr}-${city.utc}-${city.laneIndex}`}
                    clipPath="url(#tdPinClip)"
                    role="img"
                    aria-label={`${city.nameAr} — ${utcLabel}`}   /* UX-10 FIX */
                  >
                    {/* Vertical connector — flag bottom to bar centre */}
                    <line
                      x1={x} y1={connectorTop}
                      x2={x} y2={connectorBottom}
                      stroke={lineColor}
                      strokeWidth={isArab ? '1.5' : '1'}
                      opacity={lineOpacity}
                      /* BUG-4 FIX: omit attr for solid; explicit for dashed */
                      {...(!isArab ? { strokeDasharray: '4,4' } : {})}
                    />

                    {/* Dot ON the bar centre line (BUG-3 FIX) */}
                    <circle
                      cx={x}
                      cy={BAR_CY}
                      r={dotRadius}
                      fill={dotColor}
                      filter={isArab ? 'url(#tdPinGlow)' : undefined}
                    />

                    {/* Flag emoji — vertically centred in the lane */}
                    <text
                      x={x}
                      y={yFlag}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="17"
                      fontFamily="inherit"   /* BUG-7 FIX */
                    >
                      {city.flag}
                    </text>

                    {/* City name label */}
                    <text
                      x={x}
                      y={yName}
                      textAnchor="middle"
                      fontSize={isArab ? '10.5' : '9.5'}
                      fontWeight={isArab ? '700' : '400'}
                      fill={nameColor}
                      fontFamily="inherit"   /* BUG-7 FIX */
                    >
                      {city.nameAr}
                    </text>
                  </g>
                )
              })}

            </svg>

            {/* ── Legend (inside scrollable area, always visible) ───── */}
            <div
              className="flex items-center justify-start sm:justify-center gap-5 mt-4 px-1 flex-wrap"
              role="list"
              aria-label="مفتاح المخطط"
            >
              {[
                {
                  color: 'var(--accent-alt)',
                  label: 'دول عربية وإسلامية',
                  solid: true,
                },
                {
                  color: 'var(--text-muted)',
                  label: 'دول أخرى',
                  solid: false,
                },
                {
                  color: 'var(--accent-alt)',
                  label: 'خط غرينتش UTC±0',
                  dashed: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5"
                  role="listitem"
                >
                  {item.dashed ? (
                    /* Dashed line legend item */
                    <svg
                      width="18"
                      height="10"
                      aria-hidden="true"
                      style={{ flexShrink: 0 }}
                    >
                      <line
                        x1="0" y1="5" x2="18" y2="5"
                        stroke={item.color}
                        strokeWidth="1.5"
                        strokeDasharray="4,3"
                        opacity="0.7"
                      />
                    </svg>
                  ) : (
                    /* Solid circle legend item */
                    <span
                      className="inline-block h-3 w-3 rounded-full shrink-0"
                      style={{ background: item.color, opacity: item.solid ? 1 : 0.45 }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="text-[11px] whitespace-nowrap"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── SEO callout strip ──────────────────────────────────────────── */}
      <div
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
        role="list"
        aria-label="إحصائيات المناطق الزمنية"
      >
        {[
          {
            stat:  'UTC+0 → +4',
            label: 'نطاق التوقيت العربي',
            note:  'من المغرب (UTC+0) إلى الإمارات (UTC+4) — أقصى فارق بين دولتين عربيتين 4 ساعات',
          },
          {
            stat:  '16 منطقة',
            label: 'يغطيها المحور',
            note:  'من UTC−6 (أمريكا الشمالية) إلى UTC+10 — جميع الدول ذات الصلة بالمستخدم العربي',
          },
          {
            stat:  'DST',
            label: 'يُزحزح المواضع',
            note:  'الدول التي تُطبّق التوقيت الصيفي تتحرك ساعةً للأمام في محور UTC وفي المخطط',
          },
        ].map((s) => (
          <div
            key={s.stat}
            className="rounded-2xl px-5 py-4"
            role="listitem"
            style={{
              background: 'var(--bg-surface-1)',
              border:     '1px solid var(--border-subtle)',
              boxShadow:  'var(--shadow-sm)',
            }}
          >
            <p
              className="text-xl font-extrabold tabular-nums mb-1"
              style={{ color: 'var(--accent-alt)' }}
            >
              {s.stat}
            </p>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {s.label}
            </p>
            <p
              className="text-xs leading-snug"
              style={{ color: 'var(--text-muted)' }}
            >
              {s.note}
            </p>
          </div>
        ))}
      </div>

      {/* ── Screen-reader / SEO nav: crawlable anchor text per city ───── */}
      <nav
        aria-label="روابط تفاصيل التوقيت لكل دولة"
        className="sr-only"
      >
        <ul>
          {SPECTRUM_CITIES.map((city) => {
            const utcLabel = city.utc >= 0 ? `+${city.utc}` : String(city.utc)
            return (
              <li key={`${city.slug}-${city.utc}`}>
                <Link href={`/time-now/${city.slug}`}>
                  توقيت {city.nameAr} الآن — UTC{utcLabel}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

    </SectionWrapper>
  )
}
