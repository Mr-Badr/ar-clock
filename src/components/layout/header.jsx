import Link from "next/link";
import { Clock } from "lucide-react";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import HeaderScrollEffect from "./HeaderScrollEffect";
import "./header.css";

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/mwaqit-al-salat", label: "مواقيت الصلاة" },
  {
    href: "/date",
    label: "التاريخ والتحويل",
    sublinks: [
      { href: '/date/today/hijri', label: 'التاريخ الهجري اليوم', icon: 'Moon', description: 'عرض تاريخ اليوم بالتقويم الهجري' },
      { href: '/date/today/gregorian', label: 'التاريخ الميلادي اليوم', icon: 'Sun', description: 'عرض تاريخ اليوم بالتقويم الميلادي' },
      { href: '/date/converter', label: 'محول التاريخ', icon: 'RefreshCw', description: 'تحويل بين الهجري والميلادي' },
      { href: '/date/calendar/hijri', label: 'التقويم الهجري', icon: 'Calendar', description: 'عرض تقويم السنة الهجرية كاملة' },
      { href: '/date/calendar', label: 'التقويم الميلادي', icon: 'CalendarDays', description: 'عرض تقويم السنة الميلادية كاملة' },
      { href: '/date/hijri-to-gregorian', label: 'هجري إلى ميلادي', icon: 'ArrowRightLeft', description: 'تحويل سريع من الهجري للميلادي' },
      { href: '/date/gregorian-to-hijri', label: 'ميلادي إلى هجري', icon: 'ArrowRightLeft', description: 'تحويل سريع من الميلادي للهجري' },
    ]
  },
  { href: "/time-difference", label: "فرق التوقيت" },
  { href: "/holidays", label: "المناسبات" },
];

export default function Header() {
  return (
    <>
      {/* id is used by HeaderScrollEffect to toggle the "scrolled" class */}
      <header className="header-nav" id="main-header">
        <div className="header-inner">

          <Link
            href="/"
            prefetch
            aria-label="ميقات - الصفحة الرئيسية"
            className="header-logo"
          >
            <Clock className="header-logo-icon" />
          </Link>

          <nav className="header-center-nav" aria-label="التنقل الرئيسي">
            {/* Active-link state needs usePathname → client */}
            <NavLinks links={NAV_LINKS} />
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ThemeToggle />          {/* useTheme → client */}
            <MobileMenu links={NAV_LINKS} />  {/* useState → client */}
          </div>

        </div>
      </header>

      {/* Attaches the scroll listener; renders nothing visible */}
      <HeaderScrollEffect />
    </>
  );
}