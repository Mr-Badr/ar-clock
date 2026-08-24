'use client';

// home/v2/sections/ScrollStack.client.jsx
// Rebuilt 2026-08-23 (owner: "we should see the effect while scrolling as i see in their
// websites" — the first version ran inside its own internal `overflow-y:auto` island so it only
// reacted to scrolling *inside that box*, not the page itself, which is why nothing seemed to
// happen while scrolling normally). Now pins with native CSS `position: sticky` directly in the
// page's own scroll flow — no JS math computing scroll position at all for the pinning itself,
// so it's correct for every scroll input (wheel, trackpad, touch, keyboard, scrollbar drag) by
// construction, and needs no Lenis or custom scroll-container.
//
// Motion rebuilt same day (owner: "the motion is not so smooth while scrolling... in react bits
// example the transition is so much better" + "I can see the first and second cards at the same
// time... at first step"). Root cause of both complaints: the old version drove the scale/dim
// purely off a boolean "covered" class flipped by a CSS transition — a snap between two states
// that a CSS transition then chases, which never quite keeps pace with fast or slow scrolling and
// reads as laggy. And every card was already at full size/opacity the instant it entered the DOM
// flow, so scrolling into the section showed two fully-formed cards side by side before either
// had "become" part of the stack. Fixed by computing EVERY card's opacity/scale/lift continuously,
// every scroll frame, straight from live `getBoundingClientRect()` numbers — no CSS transition
// anywhere in the loop, so it's exactly 1:1 with the scrollbar the way native `position: sticky`
// itself already is. Each card now also rises/fades in as it approaches its pinned position
// (instead of being fully visible the moment it's in the viewport), which is what removes the
// "two full cards at once" effect at the very start of the section.
//
// Deliberately NOT gated behind prefers-reduced-motion: an earlier version bailed out entirely
// under that setting, which is exactly why the section showed no effect at all for the owner
// (same root cause as the homepage marquee/ShineBorder — see base.css's reduced-motion kill-rule
// comment for the precedent). This is scroll-linked content reveal tied to the visitor's own
// deliberate scrolling, not autoplaying/parallax motion, so it's exempted there too.
import { useEffect, useRef } from 'react';

export function ScrollStackItem({ children, index = 0, tone = 'accent' }) {
  return (
    <div
      className="scroll-stack-card"
      data-tone={tone}
      style={{ top: `calc(${14 + index * 3.5}vh)`, zIndex: index + 1 }}
    >
      {children}
    </div>
  );
}

const clamp01 = (value) => Math.min(1, Math.max(0, value));

export default function ScrollStack({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const cards = Array.from(root.querySelectorAll('.scroll-stack-card'));
    if (!cards.length) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;

      // Entrance: purely a function of each card's own live top position, so it works
      // identically whether the card is still in normal document flow or already pinned — as its
      // top travels from ~70% down the viewport up to ~28%, it rises and fades into place.
      const entrances = cards.map((card) => {
        const top = card.getBoundingClientRect().top;
        return clamp01(1 - (top - vh * 0.28) / (vh * 0.42));
      });

      for (let i = 0; i < cards.length; i++) {
        const entrance = entrances[i];

        // Covered: tied directly to the NEXT card's own entrance progress (not a separate
        // pixel-proximity threshold) — the instant the next card starts rising into place, this
        // one starts shrinking/dimming in lockstep. That removes the "dead zone" where nothing
        // visibly happens between a card settling and the next one starting to cover it, which
        // is exactly what read as "two full cards on screen at once, then suddenly an effect."
        const covered = i < cards.length - 1 ? entrances[i + 1] : 0;

        const scale = (0.94 + entrance * 0.06) * (1 - covered * 0.08);
        const lift = (1 - entrance) * 44;
        const opacity = entrance * (1 - covered * 0.4);

        const el = cards[i];
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translateY(${lift.toFixed(1)}px) scale(${scale.toFixed(4)})`;
        el.style.filter = covered > 0.01 ? `brightness(${(1 - covered * 0.22).toFixed(3)})` : '';
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-stack" ref={rootRef}>
      {children}
      <div className="scroll-stack-end" aria-hidden="true" />
    </div>
  );
}
