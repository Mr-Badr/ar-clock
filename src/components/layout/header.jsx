"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Sun, Moon } from "lucide-react";

const DEFAULT_THEME = 'dark';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState(DEFAULT_THEME);

  // Apply theme to document
  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border btn-glass shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          prefetch={true}
          aria-label="ساعة عربية - الصفحة الرئيسية"
          className="flex items-center gap-2 text-xl font-bold text-heading hover:text-emerald-accent transition-colors"
        >
          <Clock className="w-6 h-6" />
          <span className="hidden sm:inline">ساعة عربية</span>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <nav className="flex items-center">
            {[
              { href: "/", label: "الساعة الرئيسية", shortLabel: "الرئيسية" },
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
                  prefetch={true}
                  title={link.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 rounded-lg transition-colors
                    ${isActive
                      ? "text-emerald-accent font-bold"
                      : "text-subtle hover:bg-panel-bg hover:text-heading"
                    }`}
                >
                  <span className="hidden xs:inline">{link.label}</span>
                  <span className="xs:hidden">{link.shortLabel}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="border-r border-border pr-2 sm:pr-4 mx-1 sm:mx-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-panel-bg rounded-xl transition-all text-subtle hover:text-emerald-accent group"
              title={theme === 'dark' ? "تبديل للوضع النهاري" : "تبديل للوضع الليلي"}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}