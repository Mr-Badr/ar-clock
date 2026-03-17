"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Before mount: both server and client render Moon (matches defaultTheme="dark")
  // After mount: render the real resolved icon
  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : true;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="header-theme-btn"
      title="تبديل الوضع"
      aria-label="تبديل وضع العرض"
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}