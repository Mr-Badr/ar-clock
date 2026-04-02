"use client";

import { useEffect, useState } from "react";

export const MARKETING_CONSENT_KEY = "miqat-marketing-consent";
export const MARKETING_CONSENT_EVENT = "miqat-consent-changed";

export function isPublicEnvEnabled(value) {
  return String(value).trim().toLowerCase() === "true";
}

export function isConsentBannerEnabled() {
  return isPublicEnvEnabled(process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER);
}

export function readMarketingConsent() {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(MARKETING_CONSENT_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

export function writeMarketingConsent(status) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MARKETING_CONSENT_KEY, status);
  window.dispatchEvent(
    new CustomEvent(MARKETING_CONSENT_EVENT, {
      detail: { status },
    }),
  );
}

export function canLoadMarketing() {
  if (!isConsentBannerEnabled()) return true;
  return readMarketingConsent() === "granted";
}

export function useMarketingPermission(featureEnabled) {
  const [allowed, setAllowed] = useState(() =>
    featureEnabled ? canLoadMarketing() : false,
  );

  useEffect(() => {
    if (!featureEnabled) {
      setAllowed(false);
      return undefined;
    }

    const sync = () => {
      setAllowed(canLoadMarketing());
    };

    sync();
    window.addEventListener(MARKETING_CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(MARKETING_CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [featureEnabled]);

  return allowed;
}
