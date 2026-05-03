"use client";

import { useEffect, useState } from "react";
import { useConsentBannerEnabled } from "@/lib/client/public-runtime";

export const MARKETING_CONSENT_KEY = "miqat-marketing-consent";
export const MARKETING_CONSENT_EVENT = "miqat-consent-changed";

export function isPublicEnvEnabled(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

export function isConsentBannerEnabled() {
  return isPublicEnvEnabled(process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER);
}

function resolveConsentBannerEnabled(consentBannerEnabled) {
  if (typeof consentBannerEnabled === "boolean") {
    return consentBannerEnabled;
  }

  // Backward compatibility for older client chunks that still resolve
  // marketing permission from public env flags instead of runtime config.
  return isConsentBannerEnabled();
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

export function canLoadMarketing(consentBannerEnabled) {
  if (!resolveConsentBannerEnabled(consentBannerEnabled)) return true;
  return readMarketingConsent() === "granted";
}

export function useMarketingPermission(featureEnabled) {
  const runtimeConsentBannerEnabled = useConsentBannerEnabled();
  const consentBannerEnabled = resolveConsentBannerEnabled(runtimeConsentBannerEnabled);
  const [allowed, setAllowed] = useState(() =>
    featureEnabled ? canLoadMarketing(consentBannerEnabled) : false,
  );

  useEffect(() => {
    if (!featureEnabled) {
      setAllowed(false);
      return undefined;
    }

    const sync = () => {
      setAllowed(canLoadMarketing(consentBannerEnabled));
    };

    sync();
    window.addEventListener(MARKETING_CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(MARKETING_CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [consentBannerEnabled, featureEnabled]);

  return allowed;
}
