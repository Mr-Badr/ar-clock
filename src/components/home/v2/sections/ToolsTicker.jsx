// home/v2/sections/ToolsTicker.jsx
// Third pass, 2026-08-21 (owner: "we should make them move by implementing this component:
// magicui.design/docs/components/marquee"). Two rows of real category-name pills, each row a
// real Magic UI Marquee (src/components/ui/marquee.tsx — unmodified mechanics, pure CSS
// animation, no JS), moving in opposite directions (`reverse` on the second row) with
// `pauseOnHover`. Reduced-motion is handled once, globally, in globals.css. This no longer
// needs "use client" — Marquee itself has none.
import { Marquee } from '@/components/ui/marquee';

export default function ToolsTicker({ items }) {
  const half = Math.ceil(items.length / 2);
  const rowA = items.slice(0, half);
  const rowB = items.slice(half);

  return (
    <div className="tb-band" aria-hidden="true">
      <div className="tb-band-row">
        {/* Owner, 2026-08-23: slower pace so category names are actually readable while
            scrolling — was 38s (a fast, illegible blur at this pill count), now 95s. */}
        <Marquee pauseOnHover className="[--duration:95s] [--gap:0.75rem]">
          {rowA.map((name) => (
            <span key={name} className="tb-band-pill">{name}</span>
          ))}
        </Marquee>
      </div>
      <div className="tb-band-row">
        <Marquee reverse pauseOnHover className="[--duration:95s] [--gap:0.75rem]">
          {rowB.map((name) => (
            <span key={name} className="tb-band-pill">{name}</span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
