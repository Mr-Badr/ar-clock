'use client';

// home/v2/sections/ScrollRevealText.client.jsx
// Real content is server-rendered here (this is still a Client Component, but Next.js server-
// renders client components too — the words below exist as real text nodes in the initial HTML,
// this only attaches motion after mount). A scroll-scrubbed word-by-word reveal: as the section
// scrolls into view, each word sharpens from blurred/faint to fully legible, and the whole block
// straightens out of a slight tilt — tied directly to scroll position (not a one-shot play), so
// it tracks the user's own scroll speed instead of running on a fixed timer. Below the fold on
// every real visit (third section down), so there's no "content already visible, then hidden"
// risk the way an above-the-fold element would have.
import { useEffect, useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/components/motion/gsapClient';
import './scroll-reveal-text.css';

export default function ScrollRevealText({ text, baseOpacity = 0.15, baseRotation = 3, blurStrength = 5 }) {
  const containerRef = useRef(null);

  const words = useMemo(
    () => text.split(/(\s+)/).map((chunk, i) => (/^\s+$/.test(chunk) ? chunk : { chunk, i })),
    [text],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    // Scroll-scrubbed reveal tied directly to the visitor's own deliberate scrolling (not an
    // autoplaying/parallax effect) — deliberately NOT gated behind prefers-reduced-motion, same
    // judgment call as the homepage marquee/ShineBorder (see base.css's reduced-motion kill-rule
    // comment). An earlier version bailed out entirely here, which is exactly why the section had
    // no effect for anyone with OS-level reduced-motion on.
    const wordEls = el.querySelectorAll('.srt-word');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: '50% 0%', rotate: baseRotation },
        {
          rotate: 0,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom center', scrub: true },
        },
      );

      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity, filter: `blur(${blurStrength}px)` },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top bottom-=15%', end: 'bottom center', scrub: true },
        },
      );
    }, el);

    // Safety net: if content above this section (hero image, font swap-in, ad slots) shifts the
    // page's layout AFTER these ScrollTriggers already cached their start/end positions, the
    // trigger points go stale relative to where the section actually sits — recompute once
    // fonts/images have settled so the effect fires exactly when the section is really in view.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [baseOpacity, baseRotation, blurStrength]);

  return (
    <p ref={containerRef} className="srt-text">
      {words.map((w, idx) =>
        typeof w === 'string' ? (
          <span key={idx}>{w}</span>
        ) : (
          <span className="srt-word" key={idx}>{w.chunk}</span>
        ),
      )}
    </p>
  );
}
