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
  List, X,
  // Economie — must be explicit imports, namespace fallback is unreliable
  Bank,
  Sparkle,
  ChartLineUp,
  ClockCountdown,
  Target,
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
    // date
    Moon, Sun, ArrowsCounterClockwise, Calendar, CalendarDots,
    ArrowRight, ArrowLeft, ArrowsLeftRight, Clock, Timer, Hourglass,
    Globe, Calculator, Percent, Receipt, Wallet, List, X,
    // economie
    Bank, Sparkle, ChartLineUp, ClockCountdown, Target,
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
          ? <X size={20} weight="bold" />
          : <List size={20} weight="bold" />
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
                          "header-mobile-link hover:no-underline py-3 px-4 w-full justify-between flex [&>svg]:order-last border-none shadow-none",
                          isActive(link.href) && "active"
                        )}
                      >
                        <span>{link.label}</span>
                      </AccordionTrigger>

                      <AccordionContent className="pb-2 px-6 flex flex-col gap-1">
                        {link.sublinks.map((sublink) => {
                          const SubIcon = getPhosphorIcon(sublink.icon);
                          const active = pathname === sublink.href;
                          return (
                            <Link
                              key={sublink.href}
                              href={sublink.href}
                              prefetch
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-md text-sm transition-colors",
                                "text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)]",
                                active && "text-[var(--text-primary)] font-bold bg-[var(--accent-soft)]"
                              )}
                              {...getPrefetchHandlers(sublink.href)}
                            >
                              {SubIcon && (
                                <span
                                  className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
                                  style={{
                                    background: active
                                      ? "var(--accent)"
                                      : "var(--bg-surface-2)",
                                    border: "1px solid var(--border-default)",
                                    color: active
                                      ? "#fff"
                                      : "var(--accent-alt)",
                                  }}
                                >
                                  <SubIcon
                                    size={15}
                                    weight={active ? "duotone" : "regular"}
                                  />
                                </span>
                              )}
                              <span>{sublink.label}</span>
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
