const AD_FREE_EXACT_PATHS = new Set([
  '/404',
  '/_not-found',
  '/about',
  '/contact',
  '/disclaimer',
  '/editorial-policy',
  '/fahras',
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

  const isHolidayDetail = normalized.startsWith('/holidays/');
  const isDateSection = normalized === '/date' || normalized.startsWith('/date/');
  const isTimeNowSection = normalized === '/time-now' || normalized.startsWith('/time-now/');
  const isTimeDifferenceSection = normalized === '/time-difference' || normalized.startsWith('/time-difference/');
  // Blog articles and prayer pages are long, high-dwell surfaces where the
  // dismissible mobile anchor adds viewable impressions without covering content.
  const isBlogDetail = normalized.startsWith('/blog/');
  const isPrayerSection = normalized === '/mwaqit-al-salat' || normalized.startsWith('/mwaqit-al-salat/');
  const isCalculatorSection = normalized === '/calculators' || normalized.startsWith('/calculators/');

  return {
    allowAdDelivery,
    enableFullscreenCompanion:
      allowAdDelivery && (
      normalized === '/' ||
      isHolidayDetail ||
      isDateSection ||
      isTimeNowSection ||
      isTimeDifferenceSection ||
      isBlogDetail ||
      isPrayerSection ||
      isCalculatorSection
      ),
    // Auto Ads enabled on all monetized routes. Side-rail visibility at laptop
    // widths is controlled by CSS in ads.css (hidden below 1600px).
    enableAutoAds: allowAdDelivery,
  };
}
