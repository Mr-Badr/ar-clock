"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdBlockNotice from "@/components/ads/AdBlockNotice.client";
import { detectAdBlockViaBait, detectAdBlockViaScriptFlag } from "@/lib/client/adblock-detection";
import { getAdRoutePolicy } from "@/lib/ads/route-policy";
import { useAdsRuntimeConfig } from "@/lib/client/public-runtime";

const SESSION_NOTICE_KEY = "miqat-adblock-notice-shown";
const ADSENSE_BLOCKED_EVENT = "miqat-adsense-blocked";

function trackAdblockDetected(source) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "adblock_detected", { detection_source: source });
    }
  } catch (_) {
    // analytics not ready — measurement is best-effort, never block on it
  }
}

function wasNoticeAlreadyShownThisSession() {
  try {
    return Boolean(window.sessionStorage.getItem(SESSION_NOTICE_KEY));
  } catch (_) {
    return false;
  }
}

function markNoticeShown() {
  try {
    window.sessionStorage.setItem(SESSION_NOTICE_KEY, "1");
  } catch (_) {
    // sessionStorage unavailable (private mode) — notice just won't persist across reloads
  }
}

/**
 * Measures real ad-blocker prevalence (via gtag `adblock_detected`) and shows
 * a single, dismissible, non-blocking notice per session. Never hides content,
 * never nags repeatedly, never attempts to circumvent the blocker — forcing
 * ads through a blocker violates Google's publisher policies and risks the
 * AdSense account. There is also no browser API that lets a webpage disable a
 * user's extension; the notice can only ask, not act, on their browser.
 */
export default function AdBlockDetector() {
  const [showNotice, setShowNotice] = useState(false);
  const pathname = usePathname();
  const { clientId } = useAdsRuntimeConfig();
  const adsExpected = Boolean(clientId) && getAdRoutePolicy(pathname || "/").allowAdDelivery;

  useEffect(() => {
    let cancelled = false;

    function reveal(source) {
      if (cancelled || wasNoticeAlreadyShownThisSession()) return;
      markNoticeShown();
      trackAdblockDetected(source);
      setShowNotice(true);
    }

    detectAdBlockViaBait().then((blocked) => {
      if (blocked) reveal("bait-element");
    });

    // Only meaningful on routes where an ad script load was actually attempted —
    // on ad-free routes (e.g. /fahras) adsbygoogle.js never loads by design,
    // so this check would always false-positive there.
    if (adsExpected) {
      detectAdBlockViaScriptFlag().then((blocked) => {
        if (blocked) reveal("script-flag-timeout");
      });
    }

    function onAdsenseScriptBlocked() {
      reveal("script-network-block");
    }
    window.addEventListener(ADSENSE_BLOCKED_EVENT, onAdsenseScriptBlocked);

    return () => {
      cancelled = true;
      window.removeEventListener(ADSENSE_BLOCKED_EVENT, onAdsenseScriptBlocked);
    };
  }, [adsExpected]);

  if (!showNotice) return null;

  return <AdBlockNotice onDismiss={() => setShowNotice(false)} />;
}
