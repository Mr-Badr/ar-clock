"use client";

/**
 * AdNavigationInterstitial — manual replacement for Google's Vignette format.
 * ─────────────────────────────────────────────────────────────────────────────
 * Owner directive, 2026-08-13: "sometimes when navigate we should have ad popup clean and
 * can be closed... we delete auto ad so we should provide better version." Vignette (the
 * page-transition interstitial) was the one Auto Ads format the owner explicitly liked —
 * this rebuilds that exact idea as a manual, fully-controlled component now that Auto Ads
 * is off entirely.
 *
 * BEHAVIOR:
 *   - Never on the first page a visitor lands on — only after they've navigated at least
 *     once within the site (tracked via a session nav counter).
 *   - At most ONCE per browser session (sessionStorage flag) — this is deliberately more
 *     conservative than Google's own "once per hour" Vignette cadence, since a first
 *     manual version should err toward not being annoying.
 *   - Always immediately closable — no forced wait, no undismissable state. A dimmed
 *     backdrop is also click-to-close.
 *   - If the ad comes back unfilled, the popup never appears at all (no empty box asking
 *     to be dismissed) — see the `watchAdFill` grace-period logic below.
 *   - `role="dialog"` + `aria-modal`, focus moves to the close button on open and returns
 *     to the previously focused element on close.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { watchAdFill } from "@/lib/ads/unfilled";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";
import { getAdRoutePolicy } from "@/lib/ads/route-policy";
import { logger, serializeError } from "@/lib/logger";

const SHOWN_KEY = "waqt-interstitial-shown";
const NAV_COUNT_KEY = "waqt-interstitial-nav-count";
const MIN_NAV_COUNT_BEFORE_SHOW = 2;
// Grace period to let AdSense resolve fill/unfilled before revealing the modal — long enough
// for a normal creative response, short enough that "preparing" never becomes visible to the
// visitor (the modal itself only mounts visually once phase is "visible").
const FILL_GRACE_MS = 1400;

type Phase = "idle" | "preparing" | "visible" | "done";

export default function AdNavigationInterstitial() {
  const { clientId, manualSlots } = useAdsRuntimeConfig();
  const adSlot = manualSlots.interstitial || "";
  const shouldRenderAds = Boolean(clientId && adSlot);
  const canLoadAds = useMarketingPermission(shouldRenderAds);
  const pathname = usePathname();
  const routePolicy = getAdRoutePolicy(pathname || "/");

  const [phase, setPhase] = useState<Phase>("idle");
  const insRef = useRef<HTMLModElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const firstPathRef = useRef<string | null>(null);
  const triggeredRef = useRef(false);

  // Track navigations within this session — increments on every real pathname change after
  // the first page, never on initial mount.
  useEffect(() => {
    if (!pathname) return;
    if (firstPathRef.current === null) {
      firstPathRef.current = pathname;
      return;
    }
    if (firstPathRef.current === pathname) return;

    try {
      const current = Number(sessionStorage.getItem(NAV_COUNT_KEY) || "0");
      sessionStorage.setItem(NAV_COUNT_KEY, String(current + 1));
    } catch (_) {
      // sessionStorage unavailable (private mode, etc.) — interstitial simply never triggers.
    }
  }, [pathname]);

  // Decide whether to prepare the interstitial on this navigation.
  useEffect(() => {
    if (!canLoadAds) return;
    if (!routePolicy.enableNavigationInterstitial) return;
    if (triggeredRef.current) return;
    if (firstPathRef.current === null || firstPathRef.current === pathname) return;

    let alreadyShown = false;
    let navCount = 0;
    try {
      alreadyShown = sessionStorage.getItem(SHOWN_KEY) === "1";
      navCount = Number(sessionStorage.getItem(NAV_COUNT_KEY) || "0");
    } catch (_) {
      return;
    }
    if (alreadyShown || navCount < MIN_NAV_COUNT_BEFORE_SHOW) return;

    triggeredRef.current = true;
    setPhase("preparing");
  }, [pathname, canLoadAds, routePolicy.enableNavigationInterstitial]);

  // Once "preparing", request the ad and reveal only if it's likely to have real content.
  useEffect(() => {
    if (phase !== "preparing") return;

    let settled = false;
    let stopWatch: (() => void) | undefined;
    const graceTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      markShown();
      setPhase("visible");
    }, FILL_GRACE_MS);

    try {
      const adsWindow = window as Window & { adsbygoogle?: unknown[] };
      (adsWindow.adsbygoogle = adsWindow.adsbygoogle || []).push({});
    } catch (error) {
      logger.warn("adsense-interstitial-init-failed", {
        component: "AdNavigationInterstitial",
        slotId: "interstitial",
        error: serializeError(error),
      });
    }

    stopWatch = watchAdFill(insRef.current, () => {
      if (settled) return;
      settled = true;
      clearTimeout(graceTimer);
      // Unfilled — skip entirely, never show an empty popup. Still counts as "shown" for
      // this session so we don't retry on every subsequent navigation.
      markShown();
      setPhase("done");
    });

    return () => {
      clearTimeout(graceTimer);
      stopWatch?.();
    };
  }, [phase]);

  function markShown() {
    try {
      sessionStorage.setItem(SHOWN_KEY, "1");
    } catch (_) {
      // best-effort
    }
  }

  useEffect(() => {
    if (phase !== "visible") return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function handleClose() {
    setPhase("done");
    previousFocusRef.current?.focus?.();
  }

  if (!shouldRenderAds || !canLoadAds || !routePolicy.enableNavigationInterstitial) return null;
  if (phase !== "preparing" && phase !== "visible") return null;

  return (
    <div
      className={`ad-interstitial-backdrop ${phase === "visible" ? "is-visible" : ""}`}
      onClick={handleClose}
      aria-hidden={phase !== "visible"}
    >
      <div
        className="ad-interstitial-card"
        role="dialog"
        aria-modal="true"
        aria-label="إعلان"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="ad-interstitial-close"
          onClick={handleClose}
          aria-label="إغلاق الإعلان"
        >
          ×
        </button>
        <span className="ad-slot__label">إعلان</span>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId || undefined}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
