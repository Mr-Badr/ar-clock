// layout/NavLinks.tsx
import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowsCounterClockwise,
  ArrowsLeftRight,
  Buildings,
  Calculator,
  Calendar,
  CalendarDots,
  CaretDown,
  Globe,
  Hourglass,
  Moon,
  Percent,
  Receipt,
  Sun,
  Wallet,
} from "@phosphor-icons/react/ssr";

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
};

const ICONS = {
  ArrowsCounterClockwise,
  ArrowsLeftRight,
  Buildings,
  Calculator,
  Calendar,
  CalendarDots,
  Globe,
  Hourglass,
  Moon,
  Percent,
  Receipt,
  Sun,
  Wallet,
};

function getMegaMenuAlignment(href: string): "right" | "center" | "left" {
  if (href === "/date") return "right";
  return "center";
}

function getMegaMenuVariant(href: string): "calculators" | "default" {
  if (href === "/calculators") return "calculators";
  return "default";
}

function getPanelLabel(link: NavLink): string {
  if (link.panelIcon) return link.label.slice(0, 1);
  if (link.sublinks?.[0]?.label) return link.sublinks[0].label.slice(0, 1);
  return link.label.slice(0, 1);
}

function getIcon(name: string | undefined): ElementType | null {
  if (!name) return null;
  return ICONS[name as keyof typeof ICONS] ?? null;
}

export default function NavLinks({ links }: { links: NavLink[] }) {
  return (
    <ul className="header-nav-list" dir="rtl">
      {links.map((link) => {
        const PanelIcon = getIcon(link.panelIcon);

        if (!link.sublinks?.length) {
          return (
            <li key={link.href} className="header-nav-item">
              <Link href={link.href} prefetch className="header-nav-link">
                {link.label}
              </Link>
            </li>
          );
        }

        return (
          <li key={link.href} className="header-nav-item header-nav-item--has-panel">
            <Link
              href={link.href}
              prefetch
              className="header-nav-link header-nav-link--trigger"
              aria-haspopup="true"
            >
              {link.label}
              <CaretDown className="header-nav-caret" size={14} weight="bold" aria-hidden="true" />
            </Link>

            <div
              className={[
                "nav-mega-content",
                `nav-mega-content--${getMegaMenuAlignment(link.href)}`,
              ].join(" ")}
            >
              <div
                className={[
                  "nav-mega-menu",
                  `nav-mega-menu--${getMegaMenuVariant(link.href)}`,
                ].join(" ")}
              >
                <div className="nav-mega-panel">
                  <div className="nav-mega-panel-inner">
                    <div className="nav-mega-panel-icon" aria-hidden="true">
                      {PanelIcon ? <PanelIcon size={22} weight="duotone" /> : getPanelLabel(link)}
                    </div>
                    <p className="nav-mega-panel-title">{link.label}</p>
                    <p className="nav-mega-panel-desc">
                      {link.panelDescription ?? `اختر من أدوات ${link.label}`}
                    </p>
                    <Link href={link.href} prefetch className="nav-mega-panel-cta">
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
                      >
                        <span className="nav-mega-icon" aria-hidden="true">
                          {SublinkIcon ? <SublinkIcon size={18} weight="duotone" /> : null}
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
