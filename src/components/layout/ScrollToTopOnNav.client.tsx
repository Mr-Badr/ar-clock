"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls the window to (0,0) on every client-side navigation.
 *
 * Mounted early (in the hydrated phase of ClientRuntimeMounts) so it
 * fires before the idle-deferred ads/analytics. This counteracts two
 * sources of unwanted scroll position on navigation:
 *  1. Radix UI accordion/collapsible triggering scrollIntoView on mount.
 *  2. Browser scroll-restoration interfering with Next.js App Router.
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();

  useEffect(() => {
    // Use instant scroll (not smooth) so the user never sees a fly-down.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
