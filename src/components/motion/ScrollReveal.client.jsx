'use client';

// motion/ScrollReveal.client.jsx
// Generic "fade + rise in once, as the section enters the viewport" wrapper used by every
// homepage v2 section below the hero (categories bento, trust section, FAQ). Renders its
// server-rendered children untouched — this only attaches a GSAP timeline to their DOM after
// mount, so the content is fully present and readable even if the script is slow to hydrate.
//
// Respects prefers-reduced-motion via gsap.matchMedia(): the "reduce" branch sets the final
// state instantly instead of animating. Plays once per visit (toggleActions "play none none
// none") — replaying on scroll-up reads as glitchy, not cinematic, per the skill's motion rules.
//
// Never animates opacity, only `y` — see HeroMotion.client.jsx's header comment for the full
// reasoning (a real Puppeteer timing test caught this exact class of bug in the hero). The SSR
// content here is already visible in the DOM the instant it exists; if the user scrolls to it
// before GSAP/ScrollTrigger has initialized, hiding it via opacity would hide content they're
// actively looking at, not "reveal on scroll." Animating y keeps it always legible.
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsapClient';

export default function ScrollReveal({
  children,
  as: Tag = 'div',
  className,
  itemSelector = ':scope > *',
  y = 28,
  stagger = 0.08,
  start = 'top 82%',
  ...rest
}) {
  const scopeRef = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(itemSelector, scopeRef.current);
      if (!items.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          fullMotion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduceMotion } = context.conditions;

          if (reduceMotion) {
            gsap.set(items, { y: 0 });
            return;
          }

          gsap.set(items, { y });
          gsap.to(items, {
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger,
            scrollTrigger: {
              trigger: scopeRef.current,
              start,
              toggleActions: 'play none none none',
              once: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <Tag ref={scopeRef} className={className} {...rest}>
      {children}
    </Tag>
  );
}
