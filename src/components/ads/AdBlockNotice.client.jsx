"use client";

import { HeartStraight, X } from "@phosphor-icons/react";

export default function AdBlockNotice({ onDismiss }) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="ملاحظة عن حظر الإعلانات"
      style={{
        position: "fixed",
        insetInline: "var(--space-4)",
        bottom: "var(--space-4)",
        zIndex: "var(--z-toast)",
        maxWidth: "30rem",
        marginInline: "auto",
        background: "var(--bg-surface-2)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg, 0 12px 32px rgba(0,0,0,0.18))",
        padding: "var(--space-4)",
        display: "flex",
        gap: "var(--space-3)",
        alignItems: "flex-start",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "var(--radius-full, 999px)",
          background: "var(--color-primary-soft, var(--bg-surface-3))",
          color: "var(--color-primary, var(--text-primary))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HeartStraight size={22} weight="fill" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: "var(--text-primary)",
            fontWeight: "var(--font-semibold)",
            marginBottom: "var(--space-1)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          لاحظنا أنك تستخدم أداة حظر الإعلانات
        </p>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            marginBottom: "var(--space-3)",
          }}
        >
          الإعلانات هي الطريقة الوحيدة التي تُبقي الموقع مجانياً بالكامل بلا اشتراكات. لو أعجبك
          المحتوى، يسعدنا لو استثنيت miqatona.com من أداة الحظر.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onDismiss}
          style={{ fontSize: "var(--text-sm)" }}
        >
          فهمت، شكراً
        </button>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="إغلاق"
        style={{
          flexShrink: 0,
          width: "2.75rem",
          height: "2.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-full, 999px)",
          color: "var(--text-tertiary, var(--text-secondary))",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginTop: "calc(var(--space-1) * -1)",
          marginInlineEnd: "calc(var(--space-2) * -1)",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
