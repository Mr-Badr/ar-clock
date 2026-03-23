/**
 * TimeDiffSections — barrel / composition root  v3.0
 *
 * USAGE in app/time-difference/page.jsx — place BELOW the search widget:
 *
 *   import TimeDiffSections from '@/components/time-diff'
 *
 *   export default function TimeDifferencePage() {
 *     return (
 *       <main>
 *         <PageHero />
 *         <SearchWidget />
 *         <TimeDiffSections />
 *       </main>
 *     )
 *   }
 */

import GlobalSchemas            from './GlobalSchemas'
import { SectionDivider }       from '@/components/shared/primitives'
import SectionPopularPairs      from './SectionPopularPairs'
import SectionTimezoneSpectrum  from './SectionTimezoneSpectrum'
import SectionHowItWorks        from './SectionHowItWorks'
import SectionDST               from './SectionDST'
import SectionArabTimezones     from './SectionArabTimezones'
import SectionUseCases          from './SectionUseCases'
import SectionSEOArticle        from './SectionSEOArticle'
import SectionFAQ               from './SectionFAQ'

export default function TimeDiffSections() {
  return (
    <>
      <GlobalSchemas />

      {/* 1 — Popular pairs quick-access grid */}
      <SectionPopularPairs />
      <SectionDivider />

      {/* 2 — ★ PREMIUM UNIQUE: UTC offset axis spectrum — no clocks, pure concept */}
      <SectionTimezoneSpectrum />
      <SectionDivider />

      {/* 3 — UTC/GMT explainer + HowTo JSON-LD */}
      <SectionHowItWorks />
      <SectionDivider />

      {/* 4 — DST education */}
      <SectionDST />
      <SectionDivider />

      {/* 5 — Arab world reference table with live times */}
      <SectionArabTimezones />
      <SectionDivider />

      {/* 6 — 6 use-case cards */}
      <SectionUseCases />
      <SectionDivider />

      {/* 7 — 300+ word editorial SEO copy */}
      <SectionSEOArticle />
      <SectionDivider />

      {/* 8 — 10 Q&A + FAQPage JSON-LD */}
      <SectionFAQ />
    </>
  )
}

export { default as GlobalSchemas }           from './GlobalSchemas'
export { default as SectionPopularPairs }     from './SectionPopularPairs'
export { default as SectionTimezoneSpectrum } from './SectionTimezoneSpectrum'
export { default as SectionHowItWorks }       from './SectionHowItWorks'
export { default as SectionDST }              from './SectionDST'
export { default as SectionArabTimezones }    from './SectionArabTimezones'
export { default as SectionUseCases }         from './SectionUseCases'
export { default as SectionSEOArticle }       from './SectionSEOArticle'
export { default as SectionFAQ }              from './SectionFAQ'
