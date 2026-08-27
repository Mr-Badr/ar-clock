"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls the window to (0,0) on every client-side NAVIGATION — not on the initial page load.
 *
 * Uses double-RAF so the scroll fires AFTER all component effects (including
 * Radix UI accordion/tabs which call scrollIntoView on mount), preventing
 * them from overriding us. Also disables browser scroll-restoration so the
 * browser doesn't interfere on back/forward navigation.
 *
 * Bug fixed 2026-08-27 (owner: "at first reload... i scroll fast, but after that the page
 * automatically going to top... we do not need that"): the pathname-keyed effect below also
 * fires on the component's very first mount — i.e. on a fresh full page load, not just on a
 * real client-side route change — since React always runs an effect after its first render
 * regardless of whether its dependency actually changed. On a slow first load (images/effects
 * still coming in), a visitor scrolling during that window would get forcibly snapped back to
 * the top ~200ms later by the "belt-and-suspenders" re-check below, fighting a scroll they never
 * asked to have undone. This component's actual job is only to reset scroll on a REAL SPA
 * navigation (so a new page doesn't inherit the old page's scroll position) — a first load has
 * no "old page" to reset away from, so `isFirstRun` skips the whole effect that one time.
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    let raf1: number;
    let raf2: number;
    let tid: ReturnType<typeof setTimeout>;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        // Belt-and-suspenders: fire again after 200ms to override any late
        // scrollIntoView calls from Radix UI Tabs/Accordion mounting effects.
        tid = setTimeout(() => {
          if (window.scrollY > 0) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
        }, 200);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(tid);
    };
  }, [pathname]);

  return null;
}
