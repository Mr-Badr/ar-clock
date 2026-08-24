"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { ElementType } from "react";
import {
  ArrowsCounterClockwise,
  ArrowsLeftRight,
  Calendar,
  CalendarDots,
  CaretDown,
  Globe,
  Moon,
  Sun,
} from "@phosphor-icons/react/ssr";

import ToolsNavButton from "./ToolsNavButton";

// ─────────────────────────────────────────────────
// Generic nav types
// ─────────────────────────────────────────────────

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
  panelDescription?: string;
  panelIcon?: string;
  cta?: boolean;
};

const ICONS: Record<string, ElementType> = {
  ArrowsCounterClockwise,
  ArrowsLeftRight,
  Calendar,
  CalendarDots,
  Globe,
  Moon,
  Sun,
};

// The "الحاسبات" mega menu (CALC_CATEGORIES + CalculatorMegaMenu) was removed 2026-08-09
// (owner directive: no more calculators dropdown in the navbar — keep just the single
// "/tools" link so users land on the real hub page and browse from there). No NAV_LINKS
// entry has both href "/tools" and a `sublinks` array anymore — see header.jsx.

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

function getMegaMenuAlignment(href: string): "right" | "center" | "left" {
  if (href === "/date") return "right";
  if (href === "/tools") return "center";
  return "center";
}

function getPanelLabel(link: NavLink): string {
  if (link.panelIcon) return link.label.slice(0, 1);
  if (link.sublinks?.[0]?.label) return link.sublinks[0].label.slice(0, 1);
  return link.label.slice(0, 1);
}

function getIcon(name: string | undefined): ElementType | null {
  if (!name) return null;
  return ICONS[name] ?? null;
}

// ─────────────────────────────────────────────────
// Main NavLinks component
// ─────────────────────────────────────────────────

export default function NavLinks({ links }: { links: NavLink[] }) {
  const [openHref, setOpenHref] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPanel = useCallback((href: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenHref(href);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setOpenHref(null), 120);
  }, []);

  const closeNow = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenHref(null);
  }, []);

  return (
    <ul className="header-nav-list" dir="rtl">
      {links.map((link) => {
        const PanelIcon = getIcon(link.panelIcon);
        const isOpen = openHref === link.href;

        if (link.cta) {
          return (
            <li key={link.href} className="header-nav-item header-nav-item--cta">
              <ToolsNavButton />
            </li>
          );
        }

        if (!link.sublinks?.length) {
          return (
            <li key={link.href} className="header-nav-item">
              <Link href={link.href} prefetch className="header-nav-link">
                {link.label}
                <span className="header-nav-underline" aria-hidden="true" />
              </Link>
            </li>
          );
        }

        return (
          <li
            key={link.href}
            className="header-nav-item header-nav-item--has-panel"
            onMouseEnter={() => openPanel(link.href)}
            onMouseLeave={scheduleClose}
          >
            <Link
              href={link.href}
              prefetch
              className="header-nav-link header-nav-link--trigger"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              {link.label}
              <CaretDown className="header-nav-caret" size={14} weight="bold" aria-hidden="true" />
              <span className="header-nav-underline" aria-hidden="true" />
            </Link>

            <div
              className={[
                "nav-mega-content",
                `nav-mega-content--${getMegaMenuAlignment(link.href)}`,
                isOpen ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => openPanel(link.href)}
              onMouseLeave={scheduleClose}
            >
              <div className="nav-mega-menu nav-mega-menu--default">
                <div className="nav-mega-panel">
                  <div className="nav-mega-panel-inner">
                    <div className="nav-mega-panel-icon" aria-hidden="true">
                      {PanelIcon ? (
                        <PanelIcon size={22} weight="duotone" />
                      ) : (
                        getPanelLabel(link)
                      )}
                    </div>
                    <p className="nav-mega-panel-title">{link.label}</p>
                    <p className="nav-mega-panel-desc">
                      {link.panelDescription ?? `اختر من أدوات ${link.label}`}
                    </p>
                    <Link
                      href={link.href}
                      prefetch
                      className="nav-mega-panel-cta"
                      onClick={closeNow}
                    >
                      استعرض الكل
                      <span className="nav-mega-cta-arrow" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="nav-mega-links">
                  {link.sublinks.map((sublink) => {
                    const SublinkIcon = getIcon(sublink.icon);
                    return (
                      <Link
                        key={sublink.href}
                        href={sublink.href}
                        prefetch
                        className="nav-mega-item"
                        onClick={closeNow}
                      >
                        <span className="nav-mega-icon" aria-hidden="true">
                          {SublinkIcon ? (
                            <SublinkIcon size={18} weight="duotone" />
                          ) : null}
                        </span>
                        <span className="nav-mega-text">
                          <span className="nav-mega-label">{sublink.label}</span>
                          {sublink.description ? (
                            <span className="nav-mega-desc">{sublink.description}</span>
                          ) : null}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
