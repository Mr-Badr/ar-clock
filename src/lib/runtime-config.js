import { getManualAdsConfig } from '@/lib/ads/manual-config';

const TRUTHY_VALUES = new Set(['1', 'true', 'yes', 'on']);
const ADSENSE_CLIENT_PREFIX = 'ca-pub-';

function resolveEnvValue(...values) {
  for (const value of values) {
    const normalized = normalizeNonEmptyString(value);
    if (normalized) return normalized;
  }

  return null;
}

export function normalizeNonEmptyString(value) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function normalizeBooleanEnv(value, fallback = false) {
  const normalized = normalizeNonEmptyString(String(value ?? ''));
  if (!normalized) return fallback;
  return TRUTHY_VALUES.has(normalized.toLowerCase());
}

export function normalizeAdsenseClientId(value) {
  const normalized = normalizeNonEmptyString(value);
  if (!normalized || !normalized.startsWith(ADSENSE_CLIENT_PREFIX)) {
    return null;
  }

  return normalized;
}

export function getAppVersion() {
  return (
    normalizeNonEmptyString(process.env.APP_VERSION)
    || normalizeNonEmptyString(process.env.NEXT_PUBLIC_APP_VERSION)
    || 'dev'
  );
}

export function getServerAdsConfig() {
  const clientId = normalizeAdsenseClientId(
    resolveEnvValue(
      process.env.ADSENSE_CLIENT_ID,
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    ),
  );
  const manualSlots = getManualAdsConfig();
  const hasManualPlacements = Boolean(
    manualSlots.topBanner
    || manualSlots.inArticle
    || manualSlots.inFeed
    || manualSlots.stickyAnchor
    || manualSlots.sidebar
    || manualSlots.sidebarRight
    || manualSlots.sidebarLeft,
  );

  return {
    clientId,
    enabled: Boolean(clientId),
    autoAdsEnabled: Boolean(clientId) && !hasManualPlacements,
    hasManualPlacements,
    manualSlots,
  };
}

export function getPublicRuntimeConfig() {
  const gaMeasurementId = resolveEnvValue(
    process.env.GA_MEASUREMENT_ID,
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  );
  const gtmId = resolveEnvValue(
    process.env.GTM_ID,
    process.env.NEXT_PUBLIC_GTM_ID,
  );
  const analyticsExplicitFlag = resolveEnvValue(
    process.env.ENABLE_ANALYTICS,
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  );
  const hasTrackingId = Boolean(gtmId || gaMeasurementId);
  const analyticsEnabled = analyticsExplicitFlag
    ? normalizeBooleanEnv(analyticsExplicitFlag, false)
    : hasTrackingId;

  return {
    appVersion: getAppVersion(),
    consentBannerEnabled: normalizeBooleanEnv(
      resolveEnvValue(
        process.env.ENABLE_CONSENT_BANNER,
        process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER,
      ),
      false,
    ),
    serviceWorkerEnabled: normalizeBooleanEnv(
      resolveEnvValue(
        process.env.ENABLE_SW,
        process.env.NEXT_PUBLIC_ENABLE_SW,
      ),
      false,
    ),
    analytics: {
      enabled: analyticsEnabled && hasTrackingId,
      gaMeasurementId,
      gtmId,
      mode: gtmId ? 'gtm' : gaMeasurementId ? 'ga4' : 'none',
    },
    ads: getServerAdsConfig(),
  };
}
