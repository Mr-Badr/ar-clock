"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useMarketingPermission } from "@/lib/client/marketing";
import { useAnalyticsRuntimeConfig } from "@/lib/client/public-runtime";

function RouteChangeTracker({ activeMode, measurementId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.toString() || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pagePath = searchQuery ? `${pathname}?${searchQuery}` : pathname;
    const pagePayload = {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    };

    if (activeMode === "gtm") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pageview",
        ...pagePayload,
      });
      return;
    }

    if (activeMode === "ga4" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        send_to: measurementId,
        ...pagePayload,
      });
    }
  }, [activeMode, measurementId, pathname, searchQuery]);

  return null;
}

export default function AnalyticsProvider() {
  const { enabled, gaMeasurementId, gtmId, mode } = useAnalyticsRuntimeConfig();
  const shouldLoadAnalytics = enabled && (Boolean(gtmId) || Boolean(gaMeasurementId));
  const canLoad = useMarketingPermission(shouldLoadAnalytics);

  if (!shouldLoadAnalytics || !canLoad) return null;

  const useGtm = mode === "gtm" && Boolean(gtmId);

  if (useGtm) {
    return (
      <>
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer' ? '&l='+l : '';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <Suspense fallback={null}>
          <RouteChangeTracker activeMode="gtm" measurementId="" />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <Script
        id="ga4-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}', {
            send_page_view: false,
            anonymize_ip: true
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteChangeTracker activeMode="ga4" measurementId={gaMeasurementId} />
      </Suspense>
    </>
  );
}
