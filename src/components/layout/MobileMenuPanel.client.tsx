// layout/MobileMenuPanel.client.tsx
"use client";

import Link from "next/link";
import type { CSSProperties, ElementType } from "react";
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
import { CALC_CATEGORIES } from "./NavLinks";

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
            {link.href === "/calculators" ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={link.href} className="border-none">
                  <AccordionTrigger
                    onMouseEnter={() =>
                      prefetchMany(CALC_CATEGORIES.map((cat) => cat.viewAll))
                    }
                    onFocus={() =>
                      prefetchMany(CALC_CATEGORIES.map((cat) => cat.viewAll))
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
                    <Accordion type="single" collapsible className="w-full header-mobile-cat-accordion">
                      {CALC_CATEGORIES.map((cat) => {
                        const CatIcon = cat.icon;
                        const catStyle = { "--cat": cat.color } as CSSProperties;
                        return (
                          <AccordionItem
                            key={cat.id}
                            value={cat.id}
                            className="header-mobile-cat-item"
                          >
                            <AccordionTrigger
                              className="header-mobile-cat-trigger"
                              style={catStyle}
                              onMouseEnter={() =>
                                prefetchMany(cat.tools.map((t) => t.href))
                              }
                              onFocus={() =>
                                prefetchMany(cat.tools.map((t) => t.href))
                              }
                            >
                              <span className="header-mobile-cat-icon" style={catStyle} aria-hidden="true">
                                <CatIcon size={16} weight="duotone" />
                              </span>
                              <span className="header-mobile-cat-body">
                                <span className="header-mobile-cat-label">{cat.label}</span>
                                <span className="header-mobile-cat-sub">{cat.sub}</span>
                              </span>
                            </AccordionTrigger>

                            <AccordionContent className="header-mobile-cat-tools">
                              {cat.tools.map((tool) => {
                                const ToolIcon = tool.icon;
                                const active = pathname === tool.href;
                                return (
                                  <Link
                                    key={tool.href}
                                    href={tool.href}
                                    prefetch
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                      "header-mobile-sublink",
                                      active && "active"
                                    )}
                                    style={catStyle}
                                    {...getPrefetchHandlers(tool.href)}
                                  >
                                    <span className="header-mobile-sublink-icon header-mobile-sublink-icon--cat" aria-hidden="true">
                                      <ToolIcon size={15} weight={active ? "duotone" : "regular"} />
                                    </span>
                                    <span className="header-mobile-sublink-copy">
                                      <span>{tool.label}</span>
                                      <small>{tool.desc}</small>
                                    </span>
                                  </Link>
                                );
                              })}
                              <Link
                                href={cat.viewAll}
                                prefetch
                                className="header-mobile-cat-viewall"
                                style={catStyle}
                                {...getPrefetchHandlers(cat.viewAll)}
                              >
                                عرض كل أدوات {cat.label}
                                <ArrowLeft size={13} weight="bold" aria-hidden="true" />
                              </Link>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>

                    <Link
                      href="/calculators"
                      prefetch
                      className="header-mobile-cat-viewall-all"
                      {...getPrefetchHandlers("/calculators")}
                    >
                      <Calculator size={15} weight="duotone" aria-hidden="true" />
                      عرض جميع الحاسبات
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : link.sublinks ? (() => {
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
