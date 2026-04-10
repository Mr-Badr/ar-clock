// layout/header.jsx
import Link from "next/link";
import { ClockIcon } from "@phosphor-icons/react/ssr";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import HeaderScrollEffect from "./HeaderScrollEffect";
import HeaderRouteWarmup from "./HeaderRouteWarmup";
import { SITE_BRAND } from "@/lib/site-config";
import "./header.css";

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/mwaqit-al-salat", label: "مواقيت الصلاة" },
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
  { href: "/time-now",        label: "الوقت الآن"   },
  { href: "/holidays",        label: "المناسبات"   },
  {
    href: "/economie",
    label: "الاقتصاد",
    panelIcon: "ChartLineUp",
    panelDescription: "أدوات مجانية مبنية على التوقيت المحلي: السوق الأمريكي، الذهب، جلسات الفوركس، والبورصات العالمية",
    sublinks: [
      {
        href: '/economie/us-market-open',
        label: 'متى يفتح السوق الأمريكي؟',
        icon: 'Bank',
        description: 'الافتتاح الرسمي والعد التنازلي بتوقيتك',
      },
      {
        href: '/economie/gold-market-hours',
        label: 'هل الذهب مفتوح الآن؟',
        icon: 'Sparkle',
        description: 'أوقات الذهب وأفضل نافذة سيولة يومية',
      },
      {
        href: '/economie/forex-sessions',
        label: 'جلسات الفوركس الآن',
        icon: 'ChartLineUp',
        description: 'سيدني وطوكيو ولندن ونيويورك بتوقيتك المحلي',
      },
      {
        href: '/economie/stock-markets',
        label: 'البورصات العالمية الآن',
        icon: 'Bank',
        description: 'تتبّع NYSE وتداول ولندن وطوكيو وباريس بتوقيتك',
      },
      {
        href: '/economie/market-clock',
        label: 'ساعة التداول',
        icon: 'ClockCountdown',
        description: 'خريطة بصرية 24 ساعة لجلسات الفوركس والسيولة',
      },
      {
        href: '/economie/best-trading-time',
        label: 'أفضل وقت للتداول',
        icon: 'Target',
        description: 'أفضل نافذة يومية وأسبوعية من مدينتك',
      },
    ],
  },
];

export default function Header() {
  const primaryRoutes = NAV_LINKS.map((link) => link.href);

  return (
    <>
      <header className="header-nav" id="main-header">
        <div className="header-inner">

          <Link
            href="/"
            prefetch
            aria-label={`${SITE_BRAND} - الصفحة الرئيسية`}
            className="header-logo"
          >
            {/* ClockIcon from /ssr for Server Component safety */}
            <ClockIcon className="header-logo-icon" weight="duotone" />
          </Link>

          <nav className="header-center-nav" aria-label="التنقل الرئيسي">
            <NavLinks links={NAV_LINKS} />
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ThemeToggle />
            <MobileMenu links={NAV_LINKS} />
          </div>

        </div>
      </header>

      <HeaderRouteWarmup routes={primaryRoutes} />
      <HeaderScrollEffect />
    </>
  );
}
