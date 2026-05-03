/**
 * Manual ad slots are intentionally code-driven, not env-driven.
 *
 * Activation rule:
 * - If ADSENSE_CLIENT_ID is empty, ads are off everywhere.
 * - If ADSENSE_CLIENT_ID is set, Google Auto Ads can run globally.
 * - Manual placements below are optional refinements for higher-control layouts.
 *
 * When you are ready for precise placements, paste the slot ids here once.
 */
const MANUAL_AD_SLOT_REGISTRY = {
  topBanner: '',
  inArticle: '',
  inFeed: '',
  inFeedLayoutKey: '',
  stickyAnchor: '',
  sidebar: '',
  sidebarRight: '',
  sidebarLeft: '',
};

function normalizeManualSlotValue(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function getManualAdsConfig() {
  return {
    topBanner: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.topBanner),
    inArticle: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inArticle),
    inFeed: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inFeed),
    inFeedLayoutKey: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.inFeedLayoutKey),
    stickyAnchor: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.stickyAnchor),
    sidebar: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebar),
    sidebarRight: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebarRight),
    sidebarLeft: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebarLeft),
  };
}
