"use client";

// Classic ad-blocker bait technique: EasyList and most cosmetic filter lists
// hide elements by class name (display:none) regardless of what's actually
// inside them. If our bait element gets hidden, an ad blocker is active.
const BAIT_CLASS_NAMES = "ad ads adsbox doubleclick ad-placement ad-banner banner-ad textAd";

export function detectAdBlockViaBait() {
  return new Promise((resolve) => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      resolve(false);
      return;
    }

    const bait = document.createElement("div");
    bait.className = BAIT_CLASS_NAMES;
    bait.setAttribute("aria-hidden", "true");
    bait.style.cssText = "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;";
    document.body.appendChild(bait);

    window.setTimeout(() => {
      let blocked = false;
      try {
        const style = window.getComputedStyle(bait);
        blocked = bait.offsetParent === null || style.display === "none" || style.visibility === "hidden";
      } catch (_) {
        blocked = false;
      }
      bait.remove();
      resolve(blocked);
    }, 150);
  });
}

// Real adsbygoogle.js sets `window.adsbygoogle.loaded = true` the moment it
// initializes — independent of whether any individual ad slot later gets
// filled. Our own components also do `window.adsbygoogle = window.adsbygoogle
// || []` as a defensive no-op, so the array existing proves nothing; only
// `.loaded` proves the real script executed. This catches blocking the bait
// check can't see: DNS-level filters, enterprise/security-suite proxies, and
// network-request blockers that silently drop the script request without
// touching the page's DOM or ever hitting the script's onerror handler.
export function detectAdBlockViaScriptFlag(timeoutMs = 5000) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    window.setTimeout(() => {
      resolve(!(window.adsbygoogle && window.adsbygoogle.loaded === true));
    }, timeoutMs);
  });
}
