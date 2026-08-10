// layout/header.jsx
import Link from "next/link";
import { ClockIcon } from "@phosphor-icons/react/ssr";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import HeaderRouteWarmup from "./HeaderRouteWarmup";
import GlobalDiscoverySearch from "@/components/site/GlobalDiscoverySearch.client";
import { SITE_BRAND } from "@/lib/site-config";
import "./header.css";

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
  { href: "/tools", label: "الأدوات" },
  { href: "/time-now",        label: "الوقت الان"   },
  { href: "/holidays",        label: "المناسبات"   },
  { href: "/countdown",       label: "عداد تنازلي"  },
];

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
            <NavLinks links={NAV_LINKS} />
          </nav>

          <div className="header-actions">
            <GlobalDiscoverySearch />
            <ThemeToggle />
            <MobileMenu links={NAV_LINKS} />
          </div>

        </div>
      </header>

      <HeaderRouteWarmup routes={primaryRoutes} />
    </>
  );
}
