"use client";

/**
 * AdStickyAnchor — Fixed bottom banner  (v2 — CLS & UX fixed)
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZE:    100vw × 60px fixed height
 *          Respects iOS safe-area-inset-bottom (home bar)
 *          Hidden on ≥960px via CSS
 *
 * v2 FIXES vs v1:
 *   ✅ Anchor hidden via `translateY(100%)` transform, not opacity alone
 *      → slides in from bottom, no layout shift
 *   ✅ sessionStorage check happens synchronously in useState initializer
 *      → avoids flash/re-render on dismissed state
 *   ✅ Cleaner dismiss animation uses transform (not opacity which was clipping)
 *
 * WHERE TO USE in root layout.tsx — LAST elements in <body>:
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="ar" dir="rtl">
 *         <body>
 *           <Navbar />
 *           {children}
 *
 *           ← These two always come last, in this order:
 *           <div className="sticky-anchor-spacer" aria-hidden="true" />
 *           <AdStickyAnchor />
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * WHY THE SPACER MUST BE UNCONDITIONAL:
 *   The .sticky-anchor-spacer CSS always reserves 68px on mobile.
 *   This means the last content item is NEVER hidden behind the anchor,
 *   whether or not the anchor is currently visible.
 *   This is the correct CLS-free pattern: reserve space first, fill later.
 *
 * BEHAVIOR:
 *   - Hidden below screen (translateY: 100%) on page load
 *   - Slides up after user scrolls scrollThreshold (default 25%) down
 *   - Dismissible via × button — remembers dismiss for the session
 *   - Does not re-appear if user dismisses, even after navigation
 */

import { useEffect, useRef, useState } from "react";

interface AdStickyAnchorProps {
  /**
   * How far user must scroll (0–1) before anchor appears.
   * Default: 0.25 (25% of page height)
   * Rationale: user has seen content → ad appears contextually, not aggressively.
   */
  scrollThreshold?: number;
  className?: string;
}

export default function AdStickyAnchor({
  scrollThreshold = 0.25,
  className = "",
}: AdStickyAnchorProps) {
  // Initialize dismissed state synchronously from sessionStorage.
  // This avoids the flash/re-render of v1's useEffect-based check.
  const [dismissed, setDismissed] = useState<boolean>(() => {
    // Server-side: sessionStorage doesn't exist → not dismissed
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("waqt-anchor-dismissed") === "1";
  });

  const [visible, setVisible] = useState(false);
  const loaded = useRef(false);

  // Show anchor after scrollThreshold scroll depth
  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const scrolled =
        window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (scrolled >= scrollThreshold) {
        setVisible(true);
      }
    };

    // Check immediately in case page is short
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, scrollThreshold]);

  // Load ad script once on first appearance
  useEffect(() => {
    if (!visible || loaded.current || dismissed) return;
    loaded.current = true;

    // ─────────────────────────────────────────────────────────────────────────
    // TODO: Replace with your AdSense / ad network code when ready:
    //
    //   try {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    //   } catch (e) {}
    //
    // ─────────────────────────────────────────────────────────────────────────
  }, [visible, dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    // Session-scoped: respects user decision per visit without permanent tracking
    sessionStorage.setItem("waqt-anchor-dismissed", "1");
  };

  // When dismissed: render null (removes from DOM — frees space)
  // The .sticky-anchor-spacer CSS handles the layout reservation independently
  if (dismissed) return null;

  return (
    <div
      className={[
        "ad-slot ad-slot--sticky-anchor",
        !visible ? "is-hidden" : "",  // is-hidden: translateY(100%) via CSS
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="complementary"
      aria-label="إعلانات"
      aria-hidden={!visible}
    >
      {/* Label — visible per Google AdSense policy */}
      <span className="ad-slot__label">إعلانات</span>

      {/* Dismiss button */}
      <button
        type="button"
        className="ad-slot__close"
        onClick={handleDismiss}
        aria-label="إغلاق الإعلان"
      >
        ×
      </button>

      {/* ─────────────────────────────────────────────────────────────────────
          TODO: Paste your AdSense <ins> tag here when ready.
          For mobile anchor, use the fixed 320×50 size:

          <ins
            className="adsbygoogle"
            style={{ display: "inline-block", width: "320px", height: "50px" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
          />
          ───────────────────────────────────────────────────────────────────── */}
    </div>
  );
}