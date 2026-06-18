// layout/MobileMenuPanel.client.tsx
"use client";

import Link from "next/link";
import type { ElementType } from "react";
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
  X,
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

function getPhosphorIcon(name: string | undefined): ElementType | null {
  if (!name) return null;

  const iconMap: Record<string, ElementType> = {
    Moon, Sun, ArrowsCounterClockwise, Calendar, CalendarDots,
    ArrowRight, ArrowLeft, ArrowsLeftRight, Clock, Timer, Hourglass,
    Globe, Calculator, Percent, Receipt, Wallet, Buildings,
  };

  return iconMap[name] ?? null;
}

export default function MobileMenuPanel({
  links,
  open,
  onClose,
}: {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { getPrefetchHandlers, prefetchMany } = useIntentPrefetch();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={cn("header-mobile-menu", open && "open")}
      aria-label="القائمة المتنقلة"
      aria-hidden={!open}
    >
      <div className="header-mobile-menu-head">
        <div>
          <p className="header-mobile-menu-kicker">القائمة</p>
          <p className="header-mobile-menu-title">تنقّل سريع داخل ميقاتنا</p>
        </div>
        <button
          type="button"
          className="header-mobile-menu-close"
          onClick={onClose}
          aria-label="إغلاق القائمة"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <div className="header-mobile-menu-body rtl">
        {links.map((link) => (
          <div key={link.href}>
            {link.sublinks ? (() => {
              const sublinkHrefs = link.sublinks.map((sublink) => sublink.href);
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
                            {SubIcon ? (
                              <span className="header-mobile-sublink-icon" aria-hidden="true">
                                <SubIcon
                                  size={15}
                                  weight={active ? "duotone" : "regular"}
                                />
                              </span>
                            ) : null}
                            <span className="header-mobile-sublink-copy">
                              <span>{sublink.label}</span>
                              {sublink.description ? (
                                <small>{sublink.description}</small>
                              ) : null}
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
  );
}
