"use client";

/**
 * AdSidebarSticky — Desktop sticky sidebar rail ad  (v2 — CLS fixed)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    240px wide × 400–600px tall
 *          Supports: 160×600 wide skyscraper · 300×250 MPU · responsive auto
 *
 * VISIBILITY:
 *   Hidden via CSS-only on all screens < 1280px (display: none in .ad-slot--sidebar)
 *   The component ALWAYS renders in the DOM — CSS hides it.
 *   ⚠️  v1 BUG FIXED: v1 used useState(false) for isDesktop → SSR mismatch + CLS
 *   v2 fix: CSS controls visibility. JS only gates the ad SCRIPT call.
 *
 * WHERE TO USE — as children of .layout-with-ads:
 *
 *   <div className="layout-with-ads">
 *
 *     ┌─────────────────────────────────────────────────────────────────┐
 *     │  RTL GRID ORDER (with dir="rtl" on body):                       │
 *     │  DOM column 1 → visual RIGHT side of page                       │
 *     │  DOM column 2 → visual CENTER (your content)                    │
 *     │  DOM column 3 → visual LEFT side of page                        │
 *     └─────────────────────────────────────────────────────────────────┘
 *
 *     <AdSidebarSticky slotId="sidebar-visual-right" />  ← DOM first = visual RIGHT
 *
 *     <main className="content-col ...">
 *       ...page content...
 *     </main>
 *
 *     <AdSidebarSticky slotId="sidebar-visual-left" />   ← DOM last = visual LEFT
 *
 *   </div>
 *
 * GOOGLE ADSENSE: Best formats for 240px sidebar:
 *   - data-ad-format="auto" + data-full-width-responsive="true"  (recommended)
 *   - Or: fixed 160×600 skyscraper
 */

import { useEffect, useRef, useState } from "react";

interface AdSidebarStickyProps {
  slotId?: string;
  className?: string;
}

export default function AdSidebarSticky({
  slotId = "sidebar-ad",
  className = "",
}: AdSidebarStickyProps) {
  const ref = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;

    // ─────────────────────────────────────────────────────────────────────────
    // v2 FIX: Do NOT use useMediaQuery / window.matchMedia to gate rendering.
    // CSS (display: none) already hides the sidebar on mobile.
    // We only gate the AD SCRIPT call here using matchMedia — not DOM rendering.
    // This avoids the SSR/hydration CLS trap.
    // ─────────────────────────────────────────────────────────────────────────
    const isDesktop = window.matchMedia("(min-width: 1280px)").matches;

    // Don't request ad creative on mobile — saves bandwidth & ad quota
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded.current) {
            loaded.current = true;
            setIsLoading(false);

            // ─────────────────────────────────────────────────────────────────
            // TODO: Replace with your AdSense code when ready:
            //
            //   try {
            //     (window.adsbygoogle = window.adsbygoogle || []).push({});
            //   } catch (e) {}
            //
            // ─────────────────────────────────────────────────────────────────

            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      id={slotId}
      ref={ref}
      className={`ad-slot ad-slot--sidebar ${isLoading ? "is-loading" : ""} ${className}`}
      role="complementary"
      aria-label="إعلانات جانبية"
    >
      {/* Ad label — must be visible per Google AdSense policy */}
      <span className="ad-slot__label">إعلانات</span>

      {/* ─────────────────────────────────────────────────────────────────────
          TODO: Paste your AdSense <ins> tag here when ready.
          Recommended format for this 240px sidebar:

          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          ───────────────────────────────────────────────────────────────────── */}
    </aside>
  );
}