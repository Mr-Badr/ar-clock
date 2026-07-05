/**
 * Manual ad slots are intentionally code-driven, not env-driven.
 *
 * Activation rule:
 * - If ADSENSE_CLIENT_ID is empty, ads are off everywhere.
 * - ADSENSE_CLIENT_ID may remain set for site verification and ads.txt.
 * - Ad delivery also requires GOOGLE_CERTIFIED_CMP_ENABLED=true.
 * - Manual placements below are optional refinements for higher-control layouts.
 *
 * When you are ready for precise placements, paste the slot ids here once.
 */
const MANUAL_AD_SLOT_REGISTRY = {
  topBanner: '8090183510',
  topHolidaysBanner: '8090183510',
  topDateBanner: '7427984329',
  topBlogBanner: '5906753168',
  // Dedicated per-section units (created 2026-07-05) so AdSense reports show
  // which section actually earns — previously time/prayer/calculators all
  // masqueraded as the Events unit and per-section revenue was invisible.
  topTimeBanner: '5425659014',
  topPrayerBanner: '5557556347',
  topTimeDifferenceBanner: '5425659014',
  topCalculatorBanner: '3292274096',
  // Second in-article for long calculator pages (between editorial + FAQ).
  inArticleCalculatorMid: '1236962564',
  inArticle: '1176301123',
  inArticleHolidays: '1176301123',
  inArticleDate: '2723286705',
  inArticleBlog: '1176301123',
  inArticleTime: '1176301123',
  inArticlePrayer: '1176301123',
  inArticleTimeDifference: '1176301123',
  inArticleCalculator: '1176301123',
  inFeed: '1947291465',
  inFeedHolidays: '1947291465',
  inFeedBlog: '1390179264',
  inFeedLayoutKey: '-gw-3+1f-3d+2z',
  eventsFeedHorizontal: '4296454334',
  multiplex: '3132380621',
  multiplexHolidays: '3132380621',
  multiplexDate: '3132380621',
  multiplexBlog: '3132380621',
  multiplexTime: '3132380621',
  multiplexPrayer: '3132380621',
  multiplexTimeDifference: '3132380621',
  multiplexCalculator: '3132380621',
  // Intentionally empty (2026-07-05): this previously reused the topBanner slot
  // ID ('8090183510'), which AdStickyAnchor's own header forbids (impression
  // conflicts), and it competed with Google's Auto anchor — the site's
  // best-performing format per the 2026-07 AdSense format report (Auto anchor
  // RPM 5.56 MAD / Active View 0.85 vs manual display RPM 1.31 / 0.28). Empty
  // disables the manual anchor so the Auto anchor owns the bottom position.
  // If a manual anchor is ever wanted again, create a DEDICATED anchor unit in
  // AdSense first — never reuse a display slot ID here.
  stickyAnchor: '',
  sidebar: '',
  sidebarRight: '4134471107',
  sidebarLeft: '5183828891',
};

function normalizeManualSlotValue(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function getManualAdsConfig() {
  return {
    topBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topBanner),
    topHolidaysBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topHolidaysBanner),
    topDateBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topDateBanner),
    topBlogBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topBlogBanner),
    topTimeBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topTimeBanner),
    topPrayerBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topPrayerBanner),
    topTimeDifferenceBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topTimeDifferenceBanner),
    topCalculatorBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topCalculatorBanner),
    inArticle: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticle),
    inArticleHolidays: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleHolidays),
    inArticleDate: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleDate),
    inArticleBlog: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleBlog),
    inArticleTime: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleTime),
    inArticlePrayer: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticlePrayer),
    inArticleTimeDifference: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleTimeDifference),
    inArticleCalculator: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleCalculator),
    inArticleCalculatorMid: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticleCalculatorMid),
    inFeed: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inFeed),
    inFeedHolidays: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inFeedHolidays),
    inFeedBlog: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inFeedBlog),
    inFeedLayoutKey: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inFeedLayoutKey),
    eventsFeedHorizontal: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.eventsFeedHorizontal),
    multiplex: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplex),
    multiplexHolidays: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexHolidays),
    multiplexDate: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexDate),
    multiplexBlog: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexBlog),
    multiplexTime: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexTime),
    multiplexPrayer: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexPrayer),
    multiplexTimeDifference: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexTimeDifference),
    multiplexCalculator: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplexCalculator),
    stickyAnchor: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.stickyAnchor),
    sidebar: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebar),
    sidebarRight: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebarRight),
    sidebarLeft: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebarLeft),
  };
}
