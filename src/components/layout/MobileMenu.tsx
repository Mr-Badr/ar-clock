"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Moon, Sun, ArrowsCounterClockwise, Calendar, CalendarDots, 
  ArrowRight, ArrowLeft, ArrowsLeftRight, Clock, Timer, Hourglass,
  List, X, CaretDown, CaretUp
} from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as PhosphorIcons from "@phosphor-icons/react";

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
    ArrowRight, ArrowLeft, ArrowsLeftRight, Clock, Timer, Hourglass, List, X
  };

  if (iconMap[name]) return iconMap[name];

  const p = PhosphorIcons as any;
  const icon = p[name] || p[`${name}Icon`];
  return typeof icon === "function" ? (icon as React.ElementType) : null;
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
              {link.sublinks ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={link.href} className="border-none">
                    <AccordionTrigger
                      className={cn(
                        "header-mobile-link hover:no-underline py-3 px-4 w-full justify-between flex [&>svg]:order-first border-none shadow-none",
                        isActive(link.href) && "active"
                      )}
                    >
                      <span>{link.label}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-6 flex flex-col gap-1">
                      {link.sublinks.map((sublink) => {
                        const SubIcon = getPhosphorIcon(sublink.icon);
                        return (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-md text-sm transition-colors hover:bg-accent-soft hover:text-primary",
                              pathname === sublink.href &&
                                "text-primary font-bold bg-accent-soft"
                            )}
                          >
                            {SubIcon && (
                              <SubIcon
                                size={17}
                                weight={
                                  pathname === sublink.href
                                    ? "duotone"
                                    : "regular"
                                }
                                className="text-accent flex-shrink-0"
                              />
                            )}
                            {sublink.label}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={link.href}
                  prefetch
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "header-mobile-link",
                    isActive(link.href) && "active"
                  )}
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