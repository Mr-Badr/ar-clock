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
  inArticle: '1176301123',
  inFeed: '',
  inFeedLayoutKey: '',
  eventsFeedHorizontal: '4296454334',
  multiplex: '',
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
    eventsFeedHorizontal: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.eventsFeedHorizontal),
    multiplex: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.multiplex),
    stickyAnchor: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.stickyAnchor),
    sidebar: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebar),
    sidebarRight: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebarRight),
    sidebarLeft: normalizeManualSlotValue(MANUAL_AD_SLOT_REGISTRY.sidebarLeft),
  };
}
