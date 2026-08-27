// home/v2/sections/ValuesRevealSection.jsx
// Server Component — bespoke design #2, replaced the Zakat receipt section 2026-08-23 (owner:
// "remove this section and create a better one that talks about tools and different categories").
// This section's own job is narrower than that: a short, honest statement of the product's real
// values (verification, real sources, effort), scroll-revealed word by word. The follow-up
// section (ToolCategoryStackSection) is what actually covers tools/categories with real examples.
import ScrollRevealText from './ScrollRevealText.client';
import './scroll-reveal-text.css';

const STATEMENT =
  'كل رقـم نـعـرضـه راجـعـنـاه، وكل تـاريـخ تـحـقّـقـنـا مـنـه، وكل أداة بـنـيـنـاهـا مـن جـديـد — لأنـك تـسـتـحـق مـنـصـة تـهـتـم بـالـتـفـاصـيـل بقدر ما تـهـتـم أنت بـوقـتـك.';
export default function ValuesRevealSection() {
  return (
    <section className="srt-section" aria-labelledby="srt-title">
      <div className="srt-inner">
        <p className="srt-kicker" id="srt-title">لماذا ميقاتنا</p>
        <ScrollRevealText text={STATEMENT} />
      </div>
    </section>
  );
}
