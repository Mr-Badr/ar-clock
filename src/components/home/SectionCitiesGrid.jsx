/**
 * SectionCitiesGrid — World clock city grid
 *
 * 18 cities in a responsive grid: 3 → 4 → 6 → 9 columns.
 * Every card is an internal link → distributes PageRank to city pages.
 * Anchor text = city name in Arabic (exact-match keyword for local queries).
 *
 * Touch-target fix: min-h-[56px] ensures ≥44px WCAG 2.5.5 on all cards.
 * Hover label fix: opacity-60 default (visible on touch), full on hover.
 */

import Link from 'next/link'
import { Globe2, ArrowLeft } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'
import { CITIES } from './data/cities'

const H2_ID = 'h2-cities'

export default function SectionCitiesGrid() {
  return (
    <SectionWrapper id="section-cities" headingId={H2_ID} subtle>

      {/* Header */}
      <div className="mb-8 space-y-3">
        <SectionBadge><Globe2 size={11} />ساعة العالم</SectionBadge>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl font-extrabold"
          style={{ color: 'var(--text-primary)' }}
        >
          الوقت الآن في{' '}
          <span
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            أشهر المدن العربية والعالمية
          </span>
        </h2>

        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          اضغط على أي مدينة لعرض الوقت المحلي الكامل، مواقيت الصلاة، وحساب فرق
          التوقيت
        </p>
      </div>

      {/* Cities grid */}
      <ul
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 sm:gap-3"
        role="list"
        aria-label="قائمة المدن"
      >
        {CITIES.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/time-now/${city.slug}`}
              className="group flex flex-col items-center text-center rounded-2xl p-2.5 sm:p-3 min-h-[56px] transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
              aria-label={`الوقت الآن في ${city.name}، ${city.country}`}
            >
              <span className="text-xl sm:text-2xl mb-1 leading-none" aria-hidden="true">
                {city.flag}
              </span>
              <span
                className="text-[11px] sm:text-xs font-bold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {city.name}
              </span>
              {/* opacity-60 default = readable on touch; group-hover:opacity-100 on desktop */}
              <span
                className="text-[10px] mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--accent-alt)' }}
              >
                UTC +{city.offset}
              </span>
            </Link>
          </li>
        ))}
      </ul>

    </SectionWrapper>
  )
}
