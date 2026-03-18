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
 * │   ├── cities.js           — 18 city objects (name, flag, UTC offset, slug)
 * │   ├── faqItems.js         — 8 FAQ question/answer pairs
 * │   ├── stats.js            — 5 trust-bar stat objects
 * │   └── whyFeatures.js      — 6 feature card objects
 * ├── mockups/
 * │   ├── PrayerTimesMockup.jsx   — decorative prayer times UI card
 * │   ├── TimeDifferenceMockup.jsx — decorative time-diff UI card
 * │   └── HolidaysMockup.jsx      — decorative holidays UI card
 * ├── shared/
 * │   ├── SectionWrapper.jsx  — section shell (overflow, aria-labelledby, glow)
 * │   ├── SectionDivider.jsx  — 1px gradient line between sections
 * │   ├── SectionBadge.jsx    — small pill label above headings
 * │   ├── FeatureItem.jsx     — icon + text bullet row
 * │   └── CtaLink.jsx         — gradient CTA button with hover fix
 * ├── GlobalSchemas.jsx       — WebSite + Organization JSON-LD
 * ├── SectionStats.jsx        — trust bar (5 key numbers)
 * ├── SectionPrayerTimes.jsx  — feature: prayer times  (Image RIGHT)
 * ├── SectionTimeDifference.jsx — feature: time diff   (Image LEFT)
 * ├── SectionHolidays.jsx     — feature: holidays      (Image RIGHT)
 * ├── SectionWhyUs.jsx        — 6 benefit cards + SEO paragraph
 * ├── SectionSEOArticle.jsx   — 300+ word editorial Arabic copy
 * ├── SectionCitiesGrid.jsx   — 18-city world clock grid
 * ├── SectionFAQ.jsx          — 8 Q&A + FAQPage JSON-LD schema
 * └── index.jsx               ← YOU ARE HERE
 * ─────────────────────────────────────────────────────────────────────────────
 */

import GlobalSchemas       from './GlobalSchemas'
import SectionStats        from './SectionStats'
import SectionDivider      from './shared/SectionDivider'
import SectionPrayerTimes  from './SectionPrayerTimes'
import SectionTimeDifference from './SectionTimeDifference'
import SectionHolidays     from './SectionHolidays'
import SectionWhyUs        from './SectionWhyUs'
import SectionSEOArticle   from './SectionSEOArticle'
import SectionCitiesGrid   from './SectionCitiesGrid'
import SectionFAQ          from './SectionFAQ'

export default function HomeSections() {
  return (
    <>
      {/* Global JSON-LD: WebSite (SearchAction) + Organization schemas */}
      <GlobalSchemas />

      {/* Trust bar — 5 authority numbers, shown right after hero */}
      <SectionStats />


      {/* Feature 1: Prayer times — Image RIGHT · Text LEFT */}
      <SectionPrayerTimes />

      <SectionDivider />

      {/* Feature 2: Time difference — Image LEFT · Text RIGHT */}
      <SectionTimeDifference />

      <SectionDivider />

      {/* Feature 3: Holidays — Image RIGHT · Text LEFT */}
      <SectionHolidays />

      <SectionDivider />

      {/* 6 benefit cards + SEO intro paragraph */}
      <SectionWhyUs />

      <SectionDivider />

      {/* 300+ word editorial copy in 4 topic cards */}
      <SectionSEOArticle />

      <SectionDivider />

      {/* 18-city world clock grid with internal links */}
      <SectionCitiesGrid />

      <SectionDivider />

      {/* FAQ accordion — FAQPage JSON-LD + microdata */}
      <SectionFAQ />
    </>
  )
}

/* Named re-exports for individual use */
export { default as GlobalSchemas }        from './GlobalSchemas'
export { default as SectionStats }         from './SectionStats'
export { default as SectionPrayerTimes }   from './SectionPrayerTimes'
export { default as SectionTimeDifference } from './SectionTimeDifference'
export { default as SectionHolidays }      from './SectionHolidays'
export { default as SectionWhyUs }         from './SectionWhyUs'
export { default as SectionSEOArticle }    from './SectionSEOArticle'
export { default as SectionCitiesGrid }    from './SectionCitiesGrid'
export { default as SectionFAQ }           from './SectionFAQ'
