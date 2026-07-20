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
  { href: "/fahras", label: "استكشف" },
  { href: "/blog", label: "المدونة" },
  {
    href: "/mwaqit-al-salat",
    label: "مواقيت الصلاة",
    panelIcon: "Moon",
    panelDescription: "مواقيت اليوم في مدينتك، وأوقات مستحبة أخرى محسوبة حياً: الثلث الأخير من الليل، الضحى، ساعة الاستجابة، أيام البيض، وأوقات النهي",
    sublinks: [
      { href: '/mwaqit-al-salat/last-third-of-night', label: 'الثلث الأخير من الليل', icon: 'Moon', description: 'ومنتصف الليل الشرعي، محسوبان حسب مدينتك' },
      { href: '/mwaqit-al-salat/duha-prayer-time',    label: 'وقت صلاة الضحى',        icon: 'Sun',  description: 'البداية والنهاية حسب مدينتك اليوم' },
      { href: '/mwaqit-al-salat/friday-response-hour', label: 'ساعة الاستجابة',        icon: 'Hourglass', description: 'آخر ساعة قبل المغرب كل جمعة' },
      { href: '/mwaqit-al-salat/white-days',           label: 'أيام البيض',            icon: 'CalendarDots', description: '13 و14 و15 من كل شهر هجري' },
      { href: '/mwaqit-al-salat/prohibited-prayer-times', label: 'أوقات النهي عن الصلاة', icon: 'Timer', description: 'الشروق والاستواء والغروب، محسوبة حسب مدينتك' },
    ],
  },
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
    panelDescription: "احسب الإقامة والراتب والكهرباء والميراث والحمل والمعدل والبناء من صفحات عربية واضحة",
    sublinks: [
      {
        href: "/calculators/iqama",
        label: "حاسبة الإقامة",
        icon: "Wallet",
        description: "انتهاء الإقامة والغرامة اليومية للسعودية والإمارات",
      },
      {
        href: "/calculators/electricity-bill",
        label: "فاتورة الكهرباء",
        icon: "Receipt",
        description: "شرائح SEC السعودية وDEWA الإماراتية مع الضريبة",
      },
      {
        href: "/calculators/inheritance",
        label: "الميراث الإسلامي",
        icon: "Calculator",
        description: "توزيع التركة وفق الفرائض مع رسم بياني",
      },
      {
        href: "/calculators/net-salary",
        label: "صافي الراتب",
        icon: "Wallet",
        description: "الراتب بعد GOSI والاستقطاعات الشهرية",
      },
      {
        href: "/calculators/pregnancy",
        label: "حاسبة الحمل",
        icon: "CalendarDots",
        description: "موعد الولادة بالهجري والميلادي وأسابيع الحمل",
      },
      {
        href: "/calculators/gpa",
        label: "المعدل التراكمي GPA",
        icon: "Percent",
        description: "احسب معدلك من 5 أو من 4 وحوّله لنسبة",
      },
      {
        href: "/calculators/end-of-service-benefits",
        label: "نهاية الخدمة",
        icon: "Wallet",
        description: "المستحقات بحسب مدة الخدمة وسبب الإنهاء",
      },
      {
        href: "/calculators/monthly-installment",
        label: "القسط الشهري",
        icon: "Calculator",
        description: "قارن القرض والمدة والفائدة والسداد المبكر",
      },
      {
        href: "/calculators/age-calculator",
        label: "حاسبة العمر",
        icon: "Hourglass",
        description: "عمرك بالتقويمين والأيام والأشهر والدقائق",
      },
      {
        href: "/calculators/sleep",
        label: "حاسبات النوم",
        icon: "Moon",
        description: "متى أنام، متى أستيقظ، القيلولة، ودين النوم",
      },
      {
        href: "/calculators/building",
        label: "حاسبات البناء",
        icon: "Buildings",
        description: "تكلفة المنزل، الأسمنت، الحديد — 12 دولة",
      },
      {
        href: "/calculators",
        label: "كل الحاسبات",
        icon: "Calculator",
        description: "استعرض جميع الأدوات مرتبة حسب القسم",
      },
    ],
  },
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
