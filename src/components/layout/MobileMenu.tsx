// layout/MobileMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon, Sun,
  ArrowsCounterClockwise,
  Calendar, CalendarDots,
  ArrowRight, ArrowLeft, ArrowsLeftRight,
  Clock, Timer, Hourglass,
  Globe,
  Calculator,
  Percent,
  Receipt,
  Wallet,
  Buildings,
  List, X,
} from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useIntentPrefetch } from "./useIntentPrefetch";

type SubLink = {
  href: string;
  label: string;
  icon?: string;
  description?: string;
};

type NavLink = {
  href: string;
  label: string;
  sublinks?: SubLink[];
};

function getPhosphorIcon(name?: string): React.ElementType | null {
  if (!name) return null;

  const iconMap: Record<string, React.ElementType> = {
    Moon, Sun, ArrowsCounterClockwise, Calendar, CalendarDots,
    ArrowRight, ArrowLeft, ArrowsLeftRight, Clock, Timer, Hourglass,
    Globe, Calculator, Percent, Receipt, Wallet, Buildings, List, X,
  };

  return iconMap[name] ?? null;
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { getPrefetchHandlers, prefetchMany } = useIntentPrefetch();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        {open
          ? <X size={20} weight="bold" aria-hidden="true" />
          : <List size={20} weight="bold" aria-hidden="true" />
        }
      </button>

      <nav
        className={cn("header-mobile-menu", open && "open")}
        aria-label="القائمة المتنقلة"
      >
        <div className="flex flex-col gap-1 w-full rtl">
          {links.map((link) => (
            <div key={link.href}>
              {link.sublinks ? (() => {
                const sublinkHrefs = link.sublinks.map((s) => s.href);
                return (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={link.href} className="border-none">
                      <AccordionTrigger
                        onMouseEnter={() =>
                          prefetchMany([link.href, ...sublinkHrefs])
                        }
                        onFocus={() =>
                          prefetchMany([link.href, ...sublinkHrefs])
                        }
                        className={cn(
                          "header-mobile-link header-mobile-link--accordion",
                          isActive(link.href) && "active"
                        )}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        <span>{link.label}</span>
                      </AccordionTrigger>

                      <AccordionContent className="header-mobile-sublist">
                        {link.sublinks.map((sublink) => {
                          const SubIcon = getPhosphorIcon(sublink.icon);
                          const active = pathname === sublink.href;
                          return (
                            <Link
                              key={sublink.href}
                              href={sublink.href}
                              prefetch
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "header-mobile-sublink",
                                active && "active"
                              )}
                              {...getPrefetchHandlers(sublink.href)}
                            >
                              {SubIcon && (
                                <span className="header-mobile-sublink-icon" aria-hidden="true">
                                  <SubIcon
                                    size={15}
                                    weight={active ? "duotone" : "regular"}
                                  />
                                </span>
                              )}
                              <span className="header-mobile-sublink-copy">
                                <span>{sublink.label}</span>
                                {sublink.description && (
                                  <small>{sublink.description}</small>
                                )}
                              </span>
                            </Link>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })() : (
                <Link
                  href={link.href}
                  prefetch
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "header-mobile-link",
                    isActive(link.href) && "active"
                  )}
                  {...getPrefetchHandlers(link.href)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
