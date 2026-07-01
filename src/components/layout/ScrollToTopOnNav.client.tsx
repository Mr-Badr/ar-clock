"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls the window to (0,0) on every client-side navigation.
 *
 * Uses double-RAF so the scroll fires AFTER all component effects (including
 * Radix UI accordion/tabs which call scrollIntoView on mount), preventing
 * them from overriding us. Also disables browser scroll-restoration so the
 * browser doesn't interfere on back/forward navigation.
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
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
