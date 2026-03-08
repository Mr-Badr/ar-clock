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
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-[var(--z-sticky)]
        h-16
        border-b border-border
        bg-glass backdrop-blur-md
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
            transition-all
            duration-200
          "
        >
          <Clock className="w-6 h-6" />
          <span className="hidden sm:inline">ساعة عربية</span>
        </Link>

        {/* ── Navigation & Controls ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

          {/* Nav links */}
          <nav className="flex items-center">
            {[
              { href: "/", label: "الرئيسية", shortLabel: "الرئيسية" },
              { href: "/mwaqit-al-salat", label: "مواقيت الصلاة", shortLabel: "الصلاة" },
              { href: "/time-difference", label: "فرق التوقيت", shortLabel: "الفرق" },
              { href: "/holidays", label: "المناسبات", shortLabel: "المناسبات" },
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
                    flex items-center justify-center
                    relative
                    text-xs sm:text-sm font-medium
                    px-3 sm:px-3 py-3 sm:py-2
                    min-h-[44px] sm:min-h-0
                    rounded-lg
                    transition-all
                    duration-200
                    ${isActive
                      ? "text-accent font-bold"
                      : "text-secondary hover:bg-surface-1 hover:text-primary"
                    }
                  `}
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
                        bg-accent
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
                min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0
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
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}