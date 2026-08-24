// home/v2/HomeFeatureSections.jsx
// Server Component — six bespoke sections. The Zakat receipt section was replaced 2026-08-23
// (owner: "remove this section and create a better one that talks about tools and different
// categories... blow-minding idea") with two new sections together:
//   1. ToolsBreadthSection    — pure typography: a gradient-clipped numeral + a ticker of real
//                               category names.
//   2. ValuesRevealSection    — a scroll-scrubbed statement of the product's real values.
//   3. ToolCategoryStackSection — real ScrollStack mechanic, one card per real app section.
//   4. TimeOrbitSection       — real cities orbiting a center hub (Magic UI OrbitingCircles,
//                               pure CSS animation) — geometric, not a clock digit.
//   5. HolidaysTimelineSection — a fanned, auto-cycling card deck of real event names.
//   6. AppOverviewBentoSection — React Bits MagicBento (owner, 2026-08-21: "exactly using this
//                               component"), six cards = the six real navbar destinations.
// Every stat/fact used across all six is real (150+ tools, 24 categories, real city names,
// 400+ events / 2500+ aliases) — nothing invented.
import ToolsBreadthSection from './sections/ToolsBreadthSection';
import ValuesRevealSection from './sections/ValuesRevealSection';
import ToolCategoryStackSection from './sections/ToolCategoryStackSection';
import TimeOrbitSection from './sections/TimeOrbitSection';
import HolidaysTimelineSection from './sections/HolidaysTimelineSection';
import AppOverviewBentoSection from './sections/AppOverviewBentoSection';

export default function HomeFeatureSections() {
  return (
    <>
      <ToolsBreadthSection />
      <ValuesRevealSection />
      <ToolCategoryStackSection />
      <TimeOrbitSection />
      <HolidaysTimelineSection />
      <AppOverviewBentoSection />
    </>
  );
}
