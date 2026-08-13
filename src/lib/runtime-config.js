import { getManualAdsConfig } from '@/lib/ads/manual-config';
import { ADSENSE_ACCOUNT_CLIENT_ID } from '@/lib/ads/account';

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
  const configuredClientId = normalizeAdsenseClientId(
    resolveEnvValue(
      process.env.ADSENSE_CLIENT_ID,
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    ),
  );
  const clientIdMatchesAccount = (
    !configuredClientId || configuredClientId === ADSENSE_ACCOUNT_CLIENT_ID
  );
  const clientId = clientIdMatchesAccount ? configuredClientId : null;
  const certifiedCmpEnabled = normalizeBooleanEnv(
    process.env.GOOGLE_CERTIFIED_CMP_ENABLED,
    false,
  );
  const manualSlots = getManualAdsConfig();
  const hasManualPlacements = Object.values(manualSlots).some(Boolean);
  const enabled = Boolean(clientId) && certifiedCmpEnabled;

  return {
    clientId,
    enabled,
    certifiedCmpEnabled,
    clientIdMatchesAccount,
    // Google Auto Ads (enable_page_level_ads) DISABLED sitewide, fully — owner directive,
    // 2026-08-13 (see .claude/plans/curried-questing-fox.md Track 1): "we do not want auto
    // ads... we should create our ads but better than auto ads." Auto Ads was running as an
    // uncoordinated layer on top of the hand-built manual `.ad-slot` system, injecting its own
    // containers as raw `body` children completely outside that system's CLS reservations,
    // theme-safe transparent background/no-border rules, and RTL fixes — the confirmed root
    // cause of white boxes in dark mode, pages growing/shrinking, drifting desktop rails
    // merging into the footer, and ad clusters with no content between them. The manual system
    // (topBanner, inArticle, multiplex, sidebar rails, and a top/bottom sticky anchor bar) is
    // the sole ad source now, built to match or beat what Auto Ads' better formats looked like
    // (fixed top/bottom bars, closable, fixed clean sidebar rails) under our own full control.
    // Do not flip this back to `enabled` without a deliberate decision; if Auto Ads is ever
    // reconsidered, also re-check the AdSense dashboard's own Auto ads toggle for the site,
    // which independently gates it.
    autoAdsEnabled: false,
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
  const analyticsEnabled = normalizeBooleanEnv(analyticsExplicitFlag, false);
  const adsConfig = getServerAdsConfig();

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
    ads: adsConfig.enabled
      ? adsConfig
      : {
        ...adsConfig,
        clientId: null,
      },
  };
}
