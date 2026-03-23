/**
 * HolidaysSections — barrel / composition root  v3
 * ─────────────────────────────────────────────────────────────────────────────
 * BEST PRACTICES:
 * 1. Lazy Loading: Uses `next/dynamic` for sections below the fold.
 * 2. Streaming: Wraps every section in `<Suspense>` with a Skeleton fallback.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import HolidaysGlobalSchemas   from './GlobalSchemas'
import { SectionDivider }      from '@/components/shared/primitives'
import SectionSkeleton         from '@/components/shared/SectionSkeleton'

// Immediately loaded (likely above the fold or close to it)
import SectionHijriCalendar    from './SectionHijriCalendar'
import SectionOccasionTypes    from './SectionOccasionTypes'

// Lazy loaded (below the fold)
const SectionIslamicOccasions = dynamic(() => import('./SectionIslamicOccasions'), { ssr: true })
const SectionCountryDates     = dynamic(() => import('./SectionCountryDates'), { ssr: true })
const SectionHijriMonths      = dynamic(() => import('./SectionHijriMonths'), { ssr: true })
const SectionQuickFacts       = dynamic(() => import('./SectionQuickFacts'), { ssr: true })
const SectionSEOArticle       = dynamic(() => import('./SectionSEOArticle'), { ssr: true })
const SectionFAQ              = dynamic(() => import('./SectionFAQ'), { ssr: true })

/** @param {{ nowIso?: string }} props */
export default function HolidaysSections({ nowIso }) {
  return (
    <>
      {/* WebPage + BreadcrumbList + FAQPage + ItemList JSON-LD (Critical) */}
      <HolidaysGlobalSchemas nowIso={nowIso} />

      {/* 1 — التقويم الهجري: Image RIGHT */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionHijriCalendar />
      </Suspense>

      <SectionDivider />

      {/* 2 — أنواع المناسبات: Image LEFT */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionOccasionTypes />
      </Suspense>

      <SectionDivider />

      {/* 3 — 8 major Islamic occasions grid */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionIslamicOccasions />
      </Suspense>

      <SectionDivider />

      {/* 4 — Country-specific dates for Ramadan/Eid */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionCountryDates />
      </Suspense>

      <SectionDivider />

      {/* 5 — 12 Hijri months educational grid */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionHijriMonths />
      </Suspense>

      <SectionDivider />

      {/* 6 — quickFacts + history + year table */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionQuickFacts nowIso={nowIso} />
      </Suspense>

      <SectionDivider />

      {/* 7 — Long-copy editorial SEO article */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionSEOArticle />
      </Suspense>

      <SectionDivider />

      {/* 8 — FAQ accordion (engine per-event questions) */}
      <Suspense fallback={<SectionSkeleton />}>
        <SectionFAQ />
      </Suspense>
    </>
  )
}

/* Named re-exports for flexibility */
export { default as HolidaysGlobalSchemas }   from './GlobalSchemas'
export { default as SectionHijriCalendar }    from './SectionHijriCalendar'
export { default as SectionOccasionTypes }    from './SectionOccasionTypes'
export { default as SectionIslamicOccasions } from './SectionIslamicOccasions'
export { default as SectionCountryDates }     from './SectionCountryDates'
export { default as SectionHijriMonths }      from './SectionHijriMonths'
export { default as SectionQuickFacts }       from './SectionQuickFacts'
export { default as SectionSEOArticle }       from './SectionSEOArticle'
export { default as SectionFAQ }              from './SectionFAQ'
