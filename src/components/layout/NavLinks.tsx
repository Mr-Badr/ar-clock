"use client";

import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import type { ElementType } from "react";
import {
  ArrowsCounterClockwise,
  ArrowsLeftRight,
  Baby,
  Barbell,
  Buildings,
  Calculator,
  Calendar,
  CalendarDots,
  CaretDown,
  Coins,
  CreditCard,
  Flower,
  Globe,
  GraduationCap,
  Heart,
  Hourglass,
  Moon,
  Percent,
  PiggyBank,
  Planet,
  Receipt,
  Sun,
  Target,
  Timer,
  Trophy,
  TrendUp,
  Umbrella,
  Wallet,
} from "@phosphor-icons/react/ssr";

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
};

const ICONS: Record<string, ElementType> = {
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

// ─────────────────────────────────────────────────
// Calculator mega menu — category data
// ─────────────────────────────────────────────────

export type CalcTool = {
  href: string;
  label: string;
  desc: string;
  icon: ElementType;
};

export type CalcCategory = {
  id: string;
  label: string;
  sub: string;
  icon: ElementType;
  color: string;
  tools: CalcTool[];
  viewAll: string;
};

export const CALC_CATEGORIES: CalcCategory[] = [
  {
    id: "personal-finance",
    label: "تخطيط مالي",
    sub: "صندوق طوارئ • ديون • ادخار",
    icon: PiggyBank,
    color: "var(--calc-cat-personal)",
    viewAll: "/tools/personal-finance",
    tools: [
      {
        href: "/tools/personal-finance/emergency-fund",
        label: "صندوق الطوارئ",
        desc: "كم تحتاج لتغطية أشهر مصاريفك؟",
        icon: Umbrella,
      },
      {
        href: "/tools/personal-finance/debt-payoff",
        label: "سداد الديون",
        desc: "متى تخلص من ديونك؟ كرة الثلج أم الانهيار؟",
        icon: CreditCard,
      },
      {
        href: "/tools/personal-finance/savings-goal",
        label: "هدف الادخار",
        desc: "كم تدخر شهرياً للوصول إلى هدفك؟",
        icon: Coins,
      },
      {
        href: "/tools/personal-finance/net-worth",
        label: "صافي الثروة",
        desc: "أصولك ناقص التزاماتك",
        icon: TrendUp,
      },
    ],
  },
  {
    id: "health",
    label: "صحة وأسرة",
    sub: "حمل • تبويض • أسابيع الحمل",
    icon: Heart,
    color: "var(--calc-cat-health)",
    viewAll: "/tools/health/pregnancy",
    tools: [
      {
        href: "/tools/health/pregnancy",
        label: "حاسبة الحمل",
        desc: "موعد الولادة بالهجري والميلادي",
        icon: Baby,
      },
      {
        href: "/tools/health/pregnancy-weeks",
        label: "أسابيع الحمل",
        desc: "أنتِ في الأسبوع كم الآن؟",
        icon: Calendar,
      },
      {
        href: "/tools/health/ovulation",
        label: "أيام التبويض",
        desc: "نافذة الخصوبة ودورتك الشهرية",
        icon: Flower,
      },
      {
        href: "/tools/health/weaning-schedule",
        label: "جدول إدخال الطعام للرضيع",
        desc: "ماذا يأكل رضيعك الآن حسب عمره",
        icon: Baby,
      },
      {
        href: "/tools/health/bmi",
        label: "مؤشر كتلة الجسم",
        desc: "هل وزنك صحي؟ احسب BMI الآن",
        icon: Barbell,
      },
      {
        href: "/tools/health/fasting",
        label: "الصيام المتقطع",
        desc: "مؤقت نافذة الأكل وجدول 16:8",
        icon: Timer,
      },
      {
        href: "/tools/health/calories",
        label: "السعرات الحرارية",
        desc: "احتياجك اليومي ومؤشر كتلة الجسم",
        icon: Barbell,
      },
    ],
  },
  {
    id: "education",
    label: "تعليم ومعدل",
    sub: "GPA • تحويل المعدل • نسبة مئوية",
    icon: GraduationCap,
    color: "var(--calc-cat-education)",
    viewAll: "/tools/education/gpa",
    tools: [
      {
        href: "/tools/education/gpa",
        label: "المعدل التراكمي GPA",
        desc: "احسب معدلك من 5 أو من 4",
        icon: GraduationCap,
      },
      {
        href: "/tools/education/gpa-to-percent",
        label: "المعدل إلى نسبة",
        desc: "حوّل GPA إلى نسبة مئوية",
        icon: Percent,
      },
      {
        href: "/tools/education/weighted-grade",
        label: "الدرجة النهائية بالأوزان",
        desc: "كم تحتاج في الاختبار النهائي؟",
        icon: Target,
      },
      {
        href: "/tools/education/saudi-school-calendar",
        label: "التقويم الدراسي السعودي",
        desc: "بداية الدراسة والإجازات 1448",
        icon: Calendar,
      },
    ],
  },
  {
    id: "age",
    label: "عمر ووقت",
    sub: "عمر دقيق • تقاعد • فرق العمر",
    icon: Hourglass,
    color: "var(--calc-cat-age)",
    viewAll: "/tools/health",
    tools: [
      {
        href: "/tools/health/age-calculator",
        label: "حاسبة العمر",
        desc: "عمرك بالتقويمين والأيام والأشهر",
        icon: Hourglass,
      },
      {
        href: "/tools/health/age-difference",
        label: "الفرق بين تاريخين",
        desc: "احسب الفارق بالأيام والأشهر",
        icon: ArrowsLeftRight,
      },
      {
        href: "/tools/health/age-retirement",
        label: "حاسبة التقاعد",
        desc: "متى تتقاعد وكم تبقى؟",
        icon: CalendarDots,
      },
      {
        href: "/tools/health/age-hijri",
        label: "العمر بالهجري",
        desc: "عمرك بالتقويمين الهجري والميلادي معاً",
        icon: Moon,
      },
      {
        href: "/tools/health/hijri-birthday",
        label: "مولدك الهجري",
        desc: "تاريخ ميلادك الهجري وأقرب مناسبة إسلامية",
        icon: Moon,
      },
      {
        href: "/tools/health/date-add-subtract",
        label: "إضافة وطرح الأيام",
        desc: "أضف أو اطرح من تاريخ هجري وميلادي معاً",
        icon: ArrowsCounterClockwise,
      },
      {
        href: "/tools/health/age-birth-day",
        label: "في أي يوم وُلدت؟",
        desc: "تفاصيل يوم ميلادك وجيلك",
        icon: Calendar,
      },
      {
        href: "/tools/health/age-countdown",
        label: "عداد عيد الميلاد",
        desc: "كم باقي على عيد ميلادك القادم؟",
        icon: Timer,
      },
      {
        href: "/tools/health/age-milestones",
        label: "محطات العمر",
        desc: "10,000 يوم أو مليار ثانية من عمرك",
        icon: Trophy,
      },
      {
        href: "/tools/health/age-planets",
        label: "عمرك على الكواكب",
        desc: "كم عمرك بسنوات المريخ والمشتري؟",
        icon: Planet,
      },
    ],
  },
  {
    id: "sleep",
    label: "نوم وروتين",
    sub: "وقت النوم • القيلولة • دين النوم",
    icon: Moon,
    color: "var(--calc-cat-sleep)",
    viewAll: "/tools/sleep",
    tools: [
      {
        href: "/tools/sleep/bedtime",
        label: "متى أنام؟",
        desc: "وقت النوم الأمثل لوقت استيقاظك",
        icon: Moon,
      },
      {
        href: "/tools/sleep/wake-time",
        label: "متى أستيقظ؟",
        desc: "أفضل أوقات الاستيقاظ بدورات نوم",
        icon: Sun,
      },
      {
        href: "/tools/sleep/sleep-duration",
        label: "مدة النوم",
        desc: "كم نمت فعلياً اليوم؟",
        icon: Timer,
      },
      {
        href: "/tools/sleep/nap-calculator",
        label: "القيلولة",
        desc: "أفضل وقت وعدد الدورات",
        icon: Moon,
      },
      {
        href: "/tools/sleep/sleep-debt",
        label: "دين النوم",
        desc: "هل لديك عجز نوم متراكم هذا الأسبوع؟",
        icon: Hourglass,
      },
      {
        href: "/tools/sleep/sleep-needs-by-age",
        label: "النوم حسب العمر",
        desc: "الاحتياج الموصى به لكل فئة عمرية",
        icon: CalendarDots,
      },
    ],
  },
];

// ─────────────────────────────────────────────────
// Calculator Mega Menu Component
// ─────────────────────────────────────────────────

function CalculatorMegaMenu({ onClose }: { onClose: () => void }) {
  const [activeId, setActiveId] = useState<string>(CALC_CATEGORIES[0].id);
  const active = CALC_CATEGORIES.find((c) => c.id === activeId) ?? CALC_CATEGORIES[0];

  return (
    <>
      {/* Categories sidebar — right (second column in LTR grid = physical right) */}
      <nav className="nav-calc-sidebar" aria-label="أقسام الحاسبات">
        <p className="nav-calc-sidebar-title">اختر قسماً</p>
        {CALC_CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              className={`nav-calc-cat${isActive ? " nav-calc-cat--active" : ""}`}
              style={
                isActive
                  ? ({
                      "--cat": cat.color,
                      background: `color-mix(in srgb, ${cat.color} 11%, var(--recessed))`,
                      borderColor: `color-mix(in srgb, ${cat.color} 30%, var(--border-default))`,
                      color: cat.color,
                    } as React.CSSProperties)
                  : undefined
              }
              onMouseEnter={() => setActiveId(cat.id)}
              onClick={() => setActiveId(cat.id)}
              aria-pressed={isActive}
            >
              <span
                className="nav-calc-cat-icon"
                style={
                  isActive
                    ? {
                        background: `color-mix(in srgb, ${cat.color} 18%, var(--surface))`,
                        color: cat.color,
                        borderColor: `color-mix(in srgb, ${cat.color} 30%, var(--border-default))`,
                      }
                    : undefined
                }
              >
                <CatIcon size={15} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
              </span>
              <span className="nav-calc-cat-body">
                <span className="nav-calc-cat-label">{cat.label}</span>
                <span className="nav-calc-cat-sub">{cat.sub}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Tools panel — left (second column in RTL grid) */}
      <div className="nav-calc-tools">
        <div className="nav-calc-tools-head">
          <span className="nav-calc-tools-label" style={{ color: active.color }}>
            {active.label}
          </span>
          <Link href={active.viewAll} className="nav-calc-viewall" onClick={onClose}>
            عرض الكل
            <span className="nav-mega-cta-arrow" aria-hidden="true" />
          </Link>
        </div>
        <div className="nav-calc-grid">
          {active.tools.map((tool) => {
            const TIcon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="nav-calc-tool"
                onClick={onClose}
              >
                <span
                  className="nav-calc-tool-icon"
                  style={{
                    background: `color-mix(in srgb, ${active.color} 12%, var(--surface))`,
                    color: active.color,
                  }}
                >
                  <TIcon size={18} weight="duotone" aria-hidden="true" />
                </span>
                <span className="nav-calc-tool-copy">
                  <span className="nav-calc-tool-name">{tool.label}</span>
                  <span className="nav-calc-tool-desc">{tool.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="nav-calc-tools-foot">
          <Link href="/tools" className="nav-calc-hub-link" onClick={onClose}>
            <Calculator size={14} weight="duotone" aria-hidden="true" />
            عرض جميع الحاسبات
            <span className="nav-mega-cta-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

function getMegaMenuAlignment(href: string): "right" | "center" | "left" {
  if (href === "/date") return "right";
  if (href === "/tools") return "center";
  return "center";
}

function getMegaMenuVariant(href: string): "calculators" | "default" {
  if (href === "/tools") return "calculators";
  return "default";
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
        const isCalc = getMegaMenuVariant(link.href) === "calculators";

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
              {isCalc ? (
                /* ── Calculator mega menu v2 ── */
                <div className="nav-mega-menu nav-mega-menu--calc-v2">
                  <CalculatorMegaMenu onClose={closeNow} />
                </div>
              ) : (
                /* ── Standard mega menu ── */
                <div
                  className={[
                    "nav-mega-menu",
                    `nav-mega-menu--${getMegaMenuVariant(link.href)}`,
                  ].join(" ")}
                >
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
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
