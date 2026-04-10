// layout/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  // Date submenu
  Moon,
  Sun,
  ArrowsCounterClockwise,
  Calendar,
  CalendarDots,
  ArrowRight,
  ArrowLeft,
  ArrowsLeftRight,
  CaretLeft,
  CaretLeftIcon,
  Clock,
  Timer,
  Hourglass,
  Globe,
  // Economie submenu — MUST be explicit; namespace fallback fails with Turbopack
  Bank,
  Sparkle,
  ChartLineUp,
  ClockCountdown,
  Target,
} from "@phosphor-icons/react";
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
  panelDescription?: string;
  panelIcon?: string;
};

// All icon names used anywhere in NAV_LINKS must appear here.
// Do NOT rely on the namespace fallback — tree-shaking / Turbopack drops it.
function getPhosphorIcon(name?: string): React.ElementType | null {
  if (!name) return null;

  const iconMap: Record<string, React.ElementType> = {
    // shared / date
    Moon,
    Sun,
    ArrowsCounterClockwise,
    Calendar,
    CalendarDots,
    ArrowRight,
    ArrowLeft,
    ArrowsLeftRight,
    CaretLeft,
    Clock,
    Timer,
    Hourglass,
    Globe,
    // economie
    Bank,
    Sparkle,
    ChartLineUp,
    ClockCountdown,
    Target,
  };

  return iconMap[name] ?? null;
}

export default function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const { getPrefetchHandlers, prefetchMany } = useIntentPrefetch();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <NavigationMenu dir="rtl" className="max-w-none justify-start">
      <NavigationMenuList className="gap-1 flex-row">
        {links.map((link) => (
          <NavigationMenuItem key={link.href} className="flex">
            {link.sublinks
              ? (() => {
                  const sublinkHrefs = link.sublinks.map((s) => s.href);

                  return (
                    <>
                      <NavigationMenuTrigger
                        onMouseEnter={() =>
                          prefetchMany([link.href, ...sublinkHrefs])
                        }
                        onFocus={() =>
                          prefetchMany([link.href, ...sublinkHrefs])
                        }
                        className={cn(
                          "header-nav-link h-9 bg-transparent hover:bg-accent-soft hover:text-primary focus:bg-accent-soft data-[state=open]:bg-accent-soft data-[state=open]:text-primary transition-all rounded-full px-4 border-none shadow-none",
                          isActive(link.href) &&
                            "bg-accent text-on-accent font-semibold shadow-sm hover:text-on-accent hover:bg-accent focus:bg-accent"
                        )}
                      >
                        {link.label}
                      </NavigationMenuTrigger>

                      <NavigationMenuContent className="bg-transparent border-none shadow-none p-0 outline-none !overflow-visible">
                        <div className="nav-mega-menu">

                          {/* ── Side panel ── */}
                          <div className="nav-mega-panel">
                            <div className="nav-mega-panel-inner">
                              {(() => {
                                const PanelIcon = getPhosphorIcon(
                                  link.panelIcon ??
                                    link.sublinks?.[0]?.icon ??
                                    "CalendarDots"
                                );
                                return (
                                  <div className="nav-mega-panel-icon">
                                    {PanelIcon && (
                                      <PanelIcon size={22} weight="duotone" />
                                    )}
                                  </div>
                                );
                              })()}
                              <p className="nav-mega-panel-title">
                                {link.label}
                              </p>
                              <p className="nav-mega-panel-desc">
                                {link.panelDescription ??
                                  `تصفح جميع أدوات ${link.label}`}
                              </p>
                              <Link
                                href={link.href}
                                prefetch
                                className="nav-mega-panel-cta"
                                {...getPrefetchHandlers(link.href)}
                              >
                                استعرض الكل
                                <CaretLeftIcon size={12} weight="bold" />
                              </Link>
                            </div>
                          </div>

                          {/* ── Link grid ── */}
                          <div className="nav-mega-links">
                            {link.sublinks.map((sublink) => {
                              const Icon = getPhosphorIcon(sublink.icon);
                              const active = pathname === sublink.href;

                              return (
                                <NavigationMenuLink key={sublink.href} asChild>
                                  <Link
                                    href={sublink.href}
                                    prefetch
                                    className={cn(
                                      "nav-mega-item",
                                      active && "nav-mega-item--active"
                                    )}
                                    {...getPrefetchHandlers(sublink.href)}
                                  >
                                    <div className="nav-mega-top-row">
                                      {/* Icon wrapper — .nav-mega-icon handles
                                          all colour/bg via CSS; never set color
                                          inline here or shadcn will win */}
                                      <span className="nav-mega-icon">
                                        {Icon && (
                                          <Icon
                                            size={18}
                                            weight={
                                              active ? "duotone" : "regular"
                                            }
                                          />
                                        )}
                                      </span>
                                      <span className="nav-mega-arrow">
                                        <CaretLeft size={14} weight="bold" />
                                      </span>
                                    </div>
                                    <span className="nav-mega-text">
                                      <span className="nav-mega-label">
                                        {sublink.label}
                                      </span>
                                      {sublink.description && (
                                        <span className="nav-mega-desc">
                                          {sublink.description}
                                        </span>
                                      )}
                                    </span>
                                  </Link>
                                </NavigationMenuLink>
                              );
                            })}
                          </div>

                        </div>
                      </NavigationMenuContent>
                    </>
                  );
                })()
              : (
                <NavigationMenuLink asChild active={isActive(link.href)}>
                  <Link
                    href={link.href}
                    prefetch
                    className={cn(
                      "header-nav-link",
                      isActive(link.href) && "active"
                    )}
                    {...getPrefetchHandlers(link.href)}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}