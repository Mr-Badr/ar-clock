const AD_FREE_EXACT_PATHS = new Set([
  '/404',
  '/_not-found',
  '/about',
  '/contact',
  '/disclaimer',
  '/editorial-policy',
  '/offline',
  '/privacy',
  '/search',
  '/terms',
]);


export function normalizeAdPathname(pathname = '/') {
  if (!pathname) return '/';
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
}

export function getAdRoutePolicy(pathname = '/') {
  const normalized = normalizeAdPathname(pathname);
  const allowAdDelivery = (
    !AD_FREE_EXACT_PATHS.has(normalized)
    && !normalized.startsWith('/api/')
    // Embed widgets render on third-party sites — never serve this site's own
    // ads inside someone else's page, and never load third-party ad scripts
    // inside an iframe whose framing policy we've deliberately relaxed.
    && !normalized.startsWith('/embed/')
  );

  return {
    allowAdDelivery,
    // The sticky top/bottom anchor bar (AdStickyAnchor) is now the standard ad chrome fixture
    // on every ad-delivering route, mobile and desktop/tablet alike (owner directive,
    // 2026-08-13 — see .claude/plans/curried-questing-fox.md Track 1). It used to be
    // whitelisted to a handful of route families; that whitelist is gone because the bar is
    // meant to feel like a consistent piece of the product chrome, not a per-page extra.
    enableFullscreenCompanion: allowAdDelivery,
    // The manual navigation interstitial (AdNavigationInterstitial) — the owner's requested
    // replacement for Google's Vignette format, which only Auto Ads could provide and is now
    // fully off. Same route scope as the bar above; the component itself handles the "not on
    // the first page, at most once per session" frequency capping.
    enableNavigationInterstitial: allowAdDelivery,
    // Google Auto Ads DISABLED sitewide (2026-08-13) — was running as an uncoordinated layer
    // on top of the manual .ad-slot system; see the `autoAdsEnabled` comment in
    // runtime-config.js (the actual master switch) and .claude/plans/curried-questing-fox.md
    // Track 1 for the full root-cause writeup. This route-level flag is kept at `false` in
    // step with that master switch rather than removed, so a route-specific re-enable stays a
    // one-line, reviewable change instead of resurrecting removed code.
    enableAutoAds: false,
  };
}
