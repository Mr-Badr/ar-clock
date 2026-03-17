"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

export default function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {links.map((link) => (
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
    </>
  );
}