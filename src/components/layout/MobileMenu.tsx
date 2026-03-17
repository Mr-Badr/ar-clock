"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type NavLink = { href: string; label: string };

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="header-mobile-btn"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav
        className={`header-mobile-menu${open ? " open" : ""}`}
        aria-label="القائمة المتنقلة"
      >
        {links.map((link) => (
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