// layout/header.jsx
import Link from "next/link";
import { ClockIcon } from "@phosphor-icons/react/ssr";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import HeaderRouteWarmup from "./HeaderRouteWarmup";
import HeaderScrollEffect from "./HeaderScrollEffect";
import { SITE_BRAND } from "@/lib/site-config";
import "./header.css";

// Third pass, 2026-08-20 (owner feedback): "/tools" moved from header-actions back INTO the
// nav-links row itself — "tools button should be close to other links" — see NavLinks.tsx,
// which renders <ToolsNavButton> in place of a plain link when `link.cta` is true, right where
// it sits in this array (last). No search trigger here at all anymore — it moved into the hero
// (src/components/hero/HeroSearchTrigger.client.jsx). "/" (الرئيسية) is still dropped from the
// DESKTOP pill only (logo already goes home) — it stays in NAV_LINKS so the mobile drawer (no
// persistent logo while it's open) still offers it explicitly.
export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  {
    href: "/date",
    label: "التاريخ والتحويل",
    panelIcon: "CalendarDots",
    panelDescription: "أدوات احترافية للتواريخ والتحويل بين التقويمين الهجري والميلادي",
    sublinks: [
      { href: '/date/today/hijri',           label: 'التاريخ الهجري اليوم',  icon: 'Moon',                   description: 'عرض تاريخ اليوم بالتقويم الهجري'       },
      { href: '/date/today/gregorian',       label: 'التاريخ الميلادي اليوم', icon: 'Sun',                    description: 'عرض تاريخ اليوم بالتقويم الميلادي'      },
      { href: '/date/converter',             label: 'محول التاريخ',           icon: 'ArrowsCounterClockwise', description: 'تحويل بين الهجري والميلادي'              },
      { href: '/date/country',               label: 'التاريخ حسب الدولة',     icon: 'Globe',                  description: 'التاريخ الهجري في الدول العربية'        },
      { href: '/date/calendar/hijri',        label: 'التقويم الهجري',         icon: 'Calendar',               description: 'عرض تقويم السنة الهجرية كاملة'          },
      { href: '/date/calendar',              label: 'التقويم الميلادي',       icon: 'CalendarDots',           description: 'عرض تقويم السنة الميلادية كاملة'        },
      { href: '/date/hijri-to-gregorian',    label: 'هجري إلى ميلادي',       icon: 'ArrowsLeftRight',        description: 'تحويل سريع من الهجري للميلادي'          },
      { href: '/date/gregorian-to-hijri',    label: 'ميلادي إلى هجري',       icon: 'ArrowsLeftRight',        description: 'تحويل سريع من الميلادي للهجري'          },
    ],
  },
  { href: "/time-difference", label: "فرق التوقيت" },
  { href: "/time-now",        label: "الوقت الان"   },
  { href: "/holidays",        label: "المناسبات"   },
  { href: "/countdown",       label: "عداد تنازلي"  },
  { href: "/tools", label: "الأدوات", cta: true },
];

const DESKTOP_NAV_LINKS = NAV_LINKS.filter((link) => link.href !== "/");

export default function Header() {
  const primaryRoutes = NAV_LINKS.map((link) => link.href);

  return (
    <>
      <header className="header-nav" id="main-header">
        <div className="header-inner" data-nosnippet>

          <Link
            href="/"
            prefetch
            aria-label={`${SITE_BRAND} - الصفحة الرئيسية`}
            className="header-logo"
          >
            <span className="header-logo-mark" aria-hidden="true">
              <ClockIcon className="header-logo-icon" weight="duotone" />
            </span>
          </Link>

          <nav className="header-center-nav" aria-label="التنقل الرئيسي">
            <NavLinks links={DESKTOP_NAV_LINKS} />
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <MobileMenu links={NAV_LINKS} />
          </div>

        </div>
      </header>

      <HeaderScrollEffect />
      <HeaderRouteWarmup routes={primaryRoutes} />
    </>
  );
}
