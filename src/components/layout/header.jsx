// layout/header.jsx
import Link from "next/link";
import { ClockIcon } from "@phosphor-icons/react/ssr";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import HeaderScrollEffect from "./HeaderScrollEffect";
import HeaderRouteWarmup from "./HeaderRouteWarmup";
import GlobalDiscoverySearch from "@/components/site/GlobalDiscoverySearch.client";
import { SITE_BRAND } from "@/lib/site-config";
import "./header.css";

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/fahras", label: "استكشف" },
  { href: "/blog", label: "المدونة" },
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
  {
    href: "/calculators",
    label: "الحاسبات",
    panelIcon: "Calculator",
    panelDescription: "احسب النوم، التخطيط المالي، العمر، القروض، الضريبة، البناء، والنسب المئوية من صفحات عربية واضحة",
    sublinks: [
      {
        href: "/calculators/personal-finance",
        label: "التخطيط المالي الشخصي",
        icon: "Wallet",
        description: "احسب صندوق الطوارئ والديون والادخار وصافي الثروة",
      },
      {
        href: "/calculators/sleep",
        label: "حاسبات النوم الذكي",
        icon: "Moon",
        description: "متى أنام، متى أستيقظ، القيلولة، ودين النوم",
      },
      {
        href: "/calculators/finance",
        label: "حاسبات المال والعمل",
        icon: "Calculator",
        description: "القسط والضريبة والنسبة المئوية ونهاية الخدمة في مركز واحد",
      },
      {
        href: "/calculators/age",
        label: "حاسبات العمر",
        icon: "Hourglass",
        description: "العمر الشامل، فرق العمر، العد التنازلي، والكواكب",
      },
      {
        href: "/calculators/end-of-service-benefits",
        label: "مكافأة نهاية الخدمة",
        icon: "Wallet",
        description: "احسب الاستحقاق وفق مدة الخدمة وسبب الإنهاء",
      },
      {
        href: "/calculators/monthly-installment",
        label: "القسط الشهري",
        icon: "Calculator",
        description: "قارن القرض والمدة والفائدة والسداد المبكر",
      },
      {
        href: "/calculators/vat",
        label: "ضريبة القيمة المضافة",
        icon: "Receipt",
        description: "أضف الضريبة أو استخرجها وراجع صافي الشهر",
      },
      {
        href: "/calculators/percentage",
        label: "النسبة المئوية",
        icon: "Percent",
        description: "احسب النسبة والزيادة والخصم ونسبة التغيير",
      },
      {
        href: "/calculators/building",
        label: "حاسبة البناء",
        icon: "Buildings",
        description: "تكلفة المنزل، الأسمنت، الحديد — 12 دولة",
      },
    ],
  },
  { href: "/time-now",        label: "الوقت الان"   },
  { href: "/holidays",        label: "المناسبات"   },
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
      <HeaderScrollEffect />
    </>
  );
}
