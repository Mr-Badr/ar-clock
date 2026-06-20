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
      topHolidaysBanner: null,
      topDateBanner: null,
      topBlogBanner: null,
      topTimeBanner: null,
      topPrayerBanner: null,
      topTimeDifferenceBanner: null,
      topCalculatorBanner: null,
      inArticle: null,
      inArticleHolidays: null,
      inArticleDate: null,
      inArticleBlog: null,
      inArticleTime: null,
      inArticlePrayer: null,
      inArticleTimeDifference: null,
      inArticleCalculator: null,
      inFeed: null,
      inFeedHolidays: null,
      inFeedBlog: null,
      inFeedLayoutKey: null,
      eventsFeedHorizontal: null,
      multiplex: null,
      multiplexHolidays: null,
      multiplexDate: null,
      multiplexBlog: null,
      multiplexTime: null,
      multiplexPrayer: null,
      multiplexTimeDifference: null,
      multiplexCalculator: null,
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
