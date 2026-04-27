"use client";

import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";

const THEME_STORAGE_KEY = "theme";

function readThemeFromDom(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function applyTheme(nextTheme: "dark" | "light") {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(nextTheme);
  root.style.colorScheme = nextTheme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // Ignore storage failures and keep the visual change.
  }
}

// Safely detect View Transition API support
function supportsViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  );
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setMounted(true);
    setTheme(readThemeFromDom());

    const observer = new MutationObserver(() => {
      setTheme(readThemeFromDom());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        setTheme(readThemeFromDom());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  const nextTheme = isDark ? "light" : "dark";  

const handleToggle = useCallback(
  (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!supportsViewTransition()) {
      applyTheme(nextTheme);
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
        applyTheme(nextTheme);
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
  [nextTheme]
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
