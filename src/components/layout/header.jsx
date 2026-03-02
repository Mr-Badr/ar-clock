"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Sun, Moon } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — render nothing until client-side theme is known
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("contrast");
    else setTheme("dark");
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        h-16
        border-b border-[--border-default]
        btn-glass
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link
          href="/"
          prefetch
          aria-label="ساعة عربية - الصفحة الرئيسية"
          className="
            flex items-center gap-2
            text-xl font-bold
            text-primary
            hover:text-accent
            transition-colors
          "
          style={{ transition: "color var(--transition-fast)" }}
        >
          <Clock className="w-6 h-6" />
          <span className="hidden sm:inline">ساعة عربية</span>
        </Link>

        {/* ── Navigation & Controls ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

          {/* Nav links */}
          <nav className="flex items-center">
            {[
              { href: "/",         label: "الساعة الرئيسية", shortLabel: "الرئيسية"  },
              { href: "/holidays", label: "المناسبات",        shortLabel: "المناسبات" },
            ].map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  title={link.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    relative
                    text-xs sm:text-sm font-medium
                    px-2 sm:px-3 py-2
                    rounded-lg
                    transition-colors
                    ${
                      isActive
                        ? "text-accent font-bold"
                        : "text-secondary hover:bg-surface-1 hover:text-primary"
                    }
                  `}
                  style={{ transition: "color var(--transition-fast), background-color var(--transition-fast)" }}
                >
                  {/* Show full label on xs+ screens, short label on tiny screens */}
                  <span className="hidden xs:inline">{link.label}</span>
                  <span className="xs:hidden">{link.shortLabel}</span>

                  {/* Active underline indicator */}
                  {isActive && (
                    <span
                      className="
                        absolute bottom-0 left-0 right-0
                        h-0.5 rounded-full
                        bg-[--accent]
                      "
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Theme toggle ──────────────────────────────────────────────── */}
          <div className="border-r border-[--border-default] pr-2 sm:pr-4 mx-1 sm:mx-2">
            <button
              onClick={toggleTheme}
              className="
                btn btn-ghost btn-icon
                group
              "
              title="تبديل الوضع"
              aria-label="تبديل وضع العرض"
            >
              {theme === "dark" && (
                <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              )}
              {theme === "light" && (
                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              )}
              {theme === "contrast" && (
                <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}