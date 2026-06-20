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
  topTimeBanner: '',
  topPrayerBanner: '',
  topTimeDifferenceBanner: '',
  topCalculatorBanner: '',
  inArticle: '1176301123',
  inArticleHolidays: '1176301123',
  inArticleDate: '2723286705', // Date_InArticle_01 — Google-optimized, fluid, in-article
  inArticleBlog: '',
  inArticleTime: '',
  inArticlePrayer: '',
  inArticleTimeDifference: '',
  inArticleCalculator: '',
  inFeed: '1947291465',
  inFeedHolidays: '1947291465',
  inFeedBlog: '1390179264',
  inFeedLayoutKey: '-gw-3+1f-3d+2z',
  eventsFeedHorizontal: '4296454334',
  multiplex: '3132380621',
  multiplexHolidays: '3132380621',
  multiplexDate: '',
  multiplexBlog: '',
  multiplexTime: '',
  multiplexPrayer: '',
  multiplexTimeDifference: '',
  multiplexCalculator: '',
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
