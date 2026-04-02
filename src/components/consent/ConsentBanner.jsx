"use client";

import { useEffect, useState } from "react";
import {
  isConsentBannerEnabled,
  readMarketingConsent,
  writeMarketingConsent,
} from "@/lib/client/marketing";

export default function ConsentBanner() {
  const enabled = isConsentBannerEnabled();
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    setChoice(readMarketingConsent());
    setReady(true);
  }, [enabled]);

  if (!enabled || !ready || choice) return null;

  const handleChoice = (status) => {
    writeMarketingConsent(status);
    setChoice(status);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="خيارات الخصوصية"
      style={{
        position: "fixed",
        insetInline: "var(--space-4)",
        bottom: "var(--space-4)",
        zIndex: "var(--z-toast)",
        maxWidth: "42rem",
        marginInline: "auto",
        background: "var(--bg-surface-2)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-lg)",
        padding: "var(--space-4)",
      }}
    >
      <p
        style={{
          color: "var(--text-primary)",
          fontWeight: "var(--font-semibold)",
          marginBottom: "var(--space-2)",
        }}
      >
        نستخدم أدوات قياس الأداء وتحسين الإعلانات لاحقاً بعد موافقتك.
      </p>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-relaxed)",
          marginBottom: "var(--space-4)",
        }}
      >
        يمكنك السماح بالتتبع التحليلي والتسويقي، أو الاستمرار بدون ذلك. هذا
        القرار قابل للتغيير لاحقاً عند الحاجة.
      </p>
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleChoice("granted")}
        >
          أوافق
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => handleChoice("denied")}
        >
          متابعة بدون تتبع
        </button>
      </div>
    </div>
  );
}
