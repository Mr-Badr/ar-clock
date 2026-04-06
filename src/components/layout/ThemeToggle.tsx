"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";

// Safely detect View Transition API support
function supportsViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  );
}

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : true;
  const nextTheme = isDark ? "light" : "dark";  

const handleToggle = useCallback(
  (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!supportsViewTransition()) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition!(() => {
      // flushSync forces React to commit the DOM update immediately,
      // eliminating the gap between before/after snapshots → no blink
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-out", // ease-out feels snappier than ease-in-out
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  },
  [isDark, nextTheme, setTheme]
);
  return (
    <button
      onClick={handleToggle}
      className="header-theme-btn"
      title="تبديل الوضع"
      aria-label="تبديل وضع العرض"
    >
      {/* Always render both icons but hide one — avoids flash on mount */}
      {mounted ? (
        isDark ? (
          <SunIcon size={18} weight="duotone" />
        ) : (
          <MoonIcon size={18} weight="duotone" />
        )
      ) : (
        // SSR/hydration placeholder — invisible, same size, no layout shift
        <span style={{ display: "inline-block", width: 18, height: 18 }} />
      )}
    </button>
  );
}