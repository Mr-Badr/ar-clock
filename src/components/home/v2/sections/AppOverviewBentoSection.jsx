// home/v2/sections/AppOverviewBentoSection.jsx
// Server Component wrapper — bespoke design #5, added 2026-08-21 (owner: "we should add a
// sections that talk about different things that we have in our app and it can have things
// that we have in navbar and should be exactli using this components:
// reactbits.dev/components/magic-bento"). Keeps the heading/kicker/lead server-rendered for SEO
// (real text, not decorative) while the interactive bento grid itself — hover particles, a
// cursor-following spotlight appended to document.body, magnetism, border-glow, click ripple —
// is necessarily a Client Component (see MagicBento.client.jsx). The six cards are the exact
// six destinations in the navbar (see header.jsx NAV_LINKS), so this section doubles as a
// second, richer entry point into the same six sections rather than inventing new content.
//
// Real bug found + fixed 2026-08-23: this was the only one of the five homepage sections NOT
// wrapped in ScrollReveal — every sibling section animates its content in on scroll, this one
// just appeared instantly with zero entrance motion, which is exactly the kind of thing that
// makes a page feel flat while scrolling.
import MagicBento from './MagicBento.client';
import ScrollReveal from '@/components/motion/ScrollReveal.client';
import './magic-bento.css';

export default function AppOverviewBentoSection() {
  return (
    <section className="mb-section" aria-labelledby="mb-title">
      <ScrollReveal className="mb-inner" itemSelector=":scope > *">
        <div>
          <p className="mb-kicker">كل ما في ميقاتنا</p>
          <h2 id="mb-title" className="mb-title">ست أدوات، من مكان واحد</h2>
          <p className="mb-lead">
            من الوقت الآن إلى الأدوات — كل قسم رئيسي في الموقع في بطاقة واحدة. مرّر مؤشرك فوق أي
            بطاقة أو المسها لتنتقل مباشرة.
          </p>
        </div>

        <MagicBento />
      </ScrollReveal>
    </section>
  );
}
