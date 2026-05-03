"use client";

import { createContext, createElement, useContext } from "react";

const defaultConfig = Object.freeze({
  appVersion: "dev",
  consentBannerEnabled: false,
  serviceWorkerEnabled: false,
  analytics: {
    enabled: false,
    gaMeasurementId: null,
    gtmId: null,
    mode: "none",
  },
  ads: {
    enabled: false,
    clientId: null,
    autoAdsEnabled: false,
    manualSlots: {
      topBanner: null,
      inArticle: null,
      inFeed: null,
      inFeedLayoutKey: null,
      stickyAnchor: null,
      sidebar: null,
      sidebarRight: null,
      sidebarLeft: null,
    },
  },
});

const PublicRuntimeContext = createContext(defaultConfig);

export function PublicRuntimeProvider({ value, children }) {
  return createElement(
    PublicRuntimeContext.Provider,
    { value: value || defaultConfig },
    children,
  );
}

export function usePublicRuntimeConfig() {
  return useContext(PublicRuntimeContext);
}

export function useAdsRuntimeConfig() {
  return usePublicRuntimeConfig().ads || defaultConfig.ads;
}

export function useAnalyticsRuntimeConfig() {
  return usePublicRuntimeConfig().analytics || defaultConfig.analytics;
}

export function useConsentBannerEnabled() {
  return Boolean(usePublicRuntimeConfig().consentBannerEnabled);
}

export function useServiceWorkerEnabled() {
  return Boolean(usePublicRuntimeConfig().serviceWorkerEnabled);
}
