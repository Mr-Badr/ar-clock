"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : true;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="header-theme-btn"
      title="تبديل الوضع"
      aria-label="تبديل وضع العرض"
    >
      {isDark
        ? <SunIcon size={18} weight="duotone" />
        : <MoonIcon size={18} weight="duotone" />
      }
    </button>
  );
}