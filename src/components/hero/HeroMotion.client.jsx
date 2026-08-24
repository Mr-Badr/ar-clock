'use client';

// hero/HeroMotion.client.jsx
// Client-only motion shell around the server-rendered hero markup (Hero.jsx renders the real
// h1/copy/image as `children` and passes them in — see that file). This component never
// generates any content itself; it only attaches a GSAP entrance timeline once mounted, so the
// hero is fully readable before JS runs. On mount: the image reveals and the [data-hero-item]
// elements (eyebrow, title, lead, CTA, fact strip) stagger up. Above ~768px it also adds a
// scroll-scrubbed parallax on the image — gated out below that width per the skill's mobile-
// first rule (fewer moving parts, no parallax layer on small screens).
//
// Hard rule, found via a real Puppeteer timing test (2026-08-20): [data-hero-item] NEVER
// animates opacity, only `y`. The SSR HTML paints the h1/lead/CTA at opacity:1 immediately
// (correct — readable with zero JS). If hydration is slow (confirmed locally: 800ms+ in dev),
// a `gsap.set(items, {opacity:0})` run at that late point doesn't "reveal on load" — it visibly
// HIDES content the user is already looking at, then re-shows it a second later. That's exactly
// what the skill's "no critical content hidden until GSAP fires" rule forbids. Animating only
// `y` keeps the text fully legible at every point in the timeline — worst case it's offset by a
// few pixels while hydration catches up, never invisible. Same reasoning applied in
// ScrollReveal.client.jsx for every section below the fold.
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/components/motion/gsapClient';

export default function HeroMotion({ children }) {
  const scopeRef = useRef(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const media = scope.querySelector('[data-hero-media]');
      const items = gsap.utils.toArray('[data-hero-item]', scope);

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          fullMotion: '(prefers-reduced-motion: no-preference)',
          canParallax: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
        },
        (context) => {
          const { reduceMotion, canParallax } = context.conditions;

          if (reduceMotion) {
            gsap.set([media, ...items].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
            return;
          }

          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

          if (media) {
            // Media starts at 0.4 opacity, never 0 — a soft settle-in, not a blank flash, even
            // in the worst case where this only runs after the browser already painted it.
            tl.fromTo(media, { opacity: 0.4, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1 });
          }
          if (items.length) {
            // y-only — see the file header comment on why opacity never touches these.
            tl.fromTo(
              items,
              { y: 24 },
              { y: 0, duration: 0.65, stagger: 0.1 },
              media ? '-=0.65' : 0,
            );
          }

          if (canParallax && media) {
            gsap.to(media, {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: scope,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          }
        },
      );

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="hero-v2-scope">
      {children}
    </div>
  );
}
