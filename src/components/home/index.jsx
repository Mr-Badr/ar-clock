/**
 * HomeSections — barrel / composition root
 * ─────────────────────────────────────────────────────────────────────────────
 * Imports every section component and assembles them in the correct order.
 * This is the only file your page.jsx needs to import.
 *
 * USAGE in app/page.jsx:
 *   import HomeSections from '@/components/home'
 *   export default function Page() {
 *     return (
 *       <main>
 *         <YourHeroSection />
 *         <HomeSections />
 *       </main>
 *     )
 *   }
 *
 * INDIVIDUAL IMPORTS (if you need a single section elsewhere):
 *   import SectionFAQ from '@/components/home/SectionFAQ'
 *
 * FILE TREE
 * ─────────
 * components/home/
 * ├── data/
 * │   ├── faqItems.js         — FAQ question/answer pairs
 * │   └── whyFeatures.js      — benefit card objects
 * ├── mockups/
 * │   ├── PrayerTimesLiveCard.client.jsx   — live prayer times preview
 * │   ├── TimeDifferenceLiveCard.client.jsx — live time-diff preview
 * │   └── HolidaysLiveCard.client.jsx      — live holidays preview
 * ├── shared/
 * │   ├── SectionWrapper.jsx  — section shell (overflow, aria-labelledby, glow)
 * │   ├── SectionDivider.jsx  — 1px token-based line between sections
 * │   ├── SectionBadge.jsx    — small pill label above headings
 * │   ├── FeatureItem.jsx     — icon + text bullet row
 * │   └── CtaLink.jsx         — primary CTA link
 * ├── GlobalSchemas.jsx       — WebSite + Organization JSON-LD
 * ├── SectionPrayerTimes.jsx  — feature: prayer times  (Image RIGHT)
 * ├── SectionTimeDifference.jsx — feature: time diff   (Image LEFT)
 * ├── SectionHolidays.jsx     — feature: holidays      (Image RIGHT)
 * ├── SectionStartHere.jsx    — guided entry paths after the hero
 * ├── SectionSEOArticle.jsx   — latest practical guides
 * ├── SectionCitiesGrid.jsx   — footer taxonomy links
 * ├── SectionFAQ.jsx          — 8 Q&A + FAQPage JSON-LD schema
 * └── index.jsx               ← YOU ARE HERE
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Suspense } from 'react'
import SectionStartHere    from './SectionStartHere'
import SectionSkeleton     from '@/components/shared/SectionSkeleton'
import SectionPrayerTimes  from './SectionPrayerTimes'
import SectionTimeDifference from './SectionTimeDifference'
import SectionHolidays     from './SectionHolidays'
import SectionCalculators  from './SectionCalculators'
import SectionSEOArticle   from './SectionSEOArticle'
import SectionCitiesGrid   from './SectionCitiesGrid'
import SectionFAQ          from './SectionFAQ'

export default function HomeSections() {
  return (
    <>
      <SectionStartHere />

      <Suspense fallback={<SectionSkeleton />}>
        <SectionPrayerTimes />
      </Suspense>

      <SectionTimeDifference />

      <Suspense fallback={<SectionSkeleton />}>
        <SectionHolidays />
      </Suspense>

      <SectionCalculators />

      <SectionSEOArticle />

      <SectionFAQ />

      <SectionCitiesGrid />
    </>
  )
}

/* Named re-exports for individual use */
export { default as SectionStartHere }     from './SectionStartHere'
export { default as SectionPrayerTimes }   from './SectionPrayerTimes'
export { default as SectionTimeDifference } from './SectionTimeDifference'
export { default as SectionHolidays }      from './SectionHolidays'
export { default as SectionCalculators }   from './SectionCalculators'
export { default as SectionSEOArticle }    from './SectionSEOArticle'
export { default as SectionCitiesGrid }    from './SectionCitiesGrid'
export { default as SectionFAQ }           from './SectionFAQ'
