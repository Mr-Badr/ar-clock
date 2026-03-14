"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Sun, Moon, Menu, X } from "lucide-react";
import "./header.css";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/mwaqit-al-salat", label: "مواقيت الصلاة" },
  { href: "/time-difference", label: "فرق التوقيت" },
  { href: "/holidays", label: "المناسبات" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`header-nav${scrolled ? " scrolled" : ""}`}>
        <div className="header-inner">
          {/* ── Logo (Right side in RTL) ── */}
          <Link
            href="/"
            prefetch
            aria-label="ساعة عربية - الصفحة الرئيسية"
            className="header-logo"
          >
            <Clock className="header-logo-icon" />
          </Link>

          {/* ── Center Nav (Desktop) ── */}
          <nav className="header-center-nav" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                aria-current={isActive(link.href) ? "page" : undefined}
                className="header-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Left controls ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="header-theme-btn"
              title="تبديل الوضع"
              aria-label="تبديل وضع العرض"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="header-mobile-btn"
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <nav
        className={`header-mobile-menu${mobileOpen ? " open" : ""}`}
        aria-label="القائمة المتنقلة"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch
            aria-current={isActive(link.href) ? "page" : undefined}
            className="header-mobile-link"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
