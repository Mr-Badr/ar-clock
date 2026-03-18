/**
 * SectionIslamicOccasions — 8-card major Islamic occasions grid
 *
 * DATA: now sourced from ISLAMIC_OCCASIONS which connects to holidays-engine.js
 *
 * CSS BUG FIX:
 *   Old: `${occ.color}14`  → e.g. `var(--warning)14`  — INVALID CSS
 *   Old: `${occ.color}20`  → e.g. `var(--warning)20`  — INVALID CSS
 *   Fix: use `-soft` and `-border` CSS variables that already exist in new.css:
 *     var(--warning-soft)   = rgba(255, 209, 102, 0.12)  dark
 *     var(--warning-border) = rgba(255, 209, 102, 0.30)  dark
 *   The `softOf()` helper maps 'var(--warning)' → 'var(--warning-soft)'
 *   The `borderOf()` helper maps 'var(--warning)' → 'var(--warning-border)'
 */

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import { SectionBadge } from './shared/primitives'
import { ISLAMIC_OCCASIONS } from './data/islamicOccasions'

const H2_ID = 'h2-islamic-occasions'

/**
 * Maps e.g. 'var(--warning)' → 'var(--warning-soft)'
 * All -soft vars exist in new.css for: warning, success, info, danger, accent-alt
 */
const softOf = (cssVar) => cssVar.replace(')', '-soft)')

/**
 * Maps e.g. 'var(--warning)' → 'var(--warning-border)'
 * All -border vars exist in new.css for the same set.
 */
const borderOf = (cssVar) => cssVar.replace(')', '-border)')

export default function SectionIslamicOccasions() {
  return (
    <SectionWrapper id="section-islamic-occasions" headingId={H2_ID} subtle>

      {/* Section header */}
      <header className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <div className="flex justify-center">
          <SectionBadge>🌙 المناسبات الإسلامية الكبرى</SectionBadge>
        </div>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          أبرز المناسبات الإسلامية
          <span
            className="block"
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            على مدار العام الهجري
          </span>
        </h2>

        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          دليلك المرجعي لأبرز الأعياد الإسلامية — تاريخها الهجري، معناها، ومدّتها،
          مع عداد تنازلي دقيق لكل منها في صفحة المناسبات
        </p>
      </header>

      {/* 8-card responsive grid */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        role="list"
        aria-label="المناسبات الإسلامية الكبرى"
      >
        {ISLAMIC_OCCASIONS.map((occ) => (
          <li
            key={occ.id}
            className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Card header strip — fixed: uses -soft/-border CSS vars */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{
                background: softOf(occ.color),
                borderBottom: `1px solid ${borderOf(occ.color)}`,
              }}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {occ.icon}
              </span>
              <span
                className="text-[10px] font-bold rounded-full px-2 py-0.5"
                style={{
                  background: softOf(occ.color),
                  color: occ.color,
                  border: `1px solid ${borderOf(occ.color)}`,
                }}
              >
                {occ.badge}
              </span>
            </div>

            {/* Card body */}
            <div className="p-4 space-y-2">
              {/* h3 = keyword-rich heading per event */}
              <h3
                className="text-sm font-bold leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {occ.name}
              </h3>

              {/* Hijri date — English numerals (from engine's quickFacts or hijriDay) */}
              <p className="text-[11px] font-semibold" style={{ color: occ.color }}>
                {occ.hijriDate}
              </p>

              <p
                className="text-xs leading-relaxed line-clamp-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {occ.description}
              </p>

              {/* Duration — English numeral from engine's quickFacts */}
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                المدة: {occ.duration}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* View all CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/holidays"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
          style={{ color: 'var(--accent-alt)' }}
        >
          عرض جميع المناسبات مع العداد التنازلي
          <ArrowLeft size={14} aria-hidden="true" />
        </Link>
      </div>

    </SectionWrapper>
  )
}
