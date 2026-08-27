// layout/MobileMenuPanel.client.tsx
"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Moon, Sun,
  ArrowsCounterClockwise,
  Calendar, CalendarDots,
  ArrowsLeftRight,
  Globe,
} from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useIntentPrefetch } from "./useIntentPrefetch";
import ToolsNavButton from "./ToolsNavButton";

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
  cta?: boolean;
};

function getPhosphorIcon(name: string | undefined): ElementType | null {
  if (!name) return null;

  const iconMap: Record<string, ElementType> = {
    Moon, Sun, ArrowsCounterClockwise, Calendar, CalendarDots,
    ArrowsLeftRight, Globe,
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

  // Owner, 2026-08-27: "if he click in a space out of menu the menu should close, not just from
  // the close button" — Escape is the keyboard equivalent of that same "dismiss the overlay"
  // intent, and MobileMenu.tsx already unmounts this whole component on close, so the listener
  // is cleaned up for free without an `open` guard here.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Owner: "everything behind the menu should be glassy and blur, when the menu is open,
          and if he click in a space out of menu the menu should close, not just from the close
          button." A full-viewport fixed layer, blurred + tinted, sitting just below the header
          pill and this panel (both `--z-sticky`) so they stay crisp/interactive above it; a
          click anywhere on it (i.e. anywhere that isn't the header or the panel) closes the
          menu — the standard "click outside" mechanism, implemented as "click ON the backdrop"
          rather than a document-wide listener that has to distinguish inside/outside itself. */}
      <div
        className="header-mobile-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />

      <nav
        className={cn("header-mobile-menu", open && "open")}
        aria-label="القائمة المتنقلة"
        aria-hidden={!open}
      >
        {/* Owner, 2026-08-27 follow-up: "the first section that have close button should not
            appear at all, he can close the navbar by clicking same button of burger menu or
            click outside navbar" — the head row (close button, previously kicker/title text
            before that) is gone entirely now. The burger button itself already toggles
            open/closed (MobileMenu.tsx's `handleToggle`), and the backdrop click-outside above
            closes it too, so a third, dedicated close control was redundant. */}
        <div className="header-mobile-menu-body rtl">
        {links.map((link) => (
          <div key={link.href}>
            {/* The dedicated "/tools" rich-category accordion (CALC_CATEGORIES) was removed
                2026-08-09 (owner directive: no more calculators dropdown anywhere in the
                navbar — "/tools" now renders through the same generic sublinks/plain-link
                logic as every other nav item below, and since it has no `sublinks`, it
                falls through to a plain link). */}
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
            })() : link.cta ? (
              // Owner, 2026-08-27: "the button of tools on mobile... should be like desktop,
              // but this button should have no arrow just text" — reuses the exact same
              // component as the desktop pill (border-beam outline, no caret) instead of its
              // own separately-styled `--cta` link, just stretched full-width for the drawer's
              // list via this className.
              <ToolsNavButton className="header-mobile-tools-btn" />
            ) : (
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
