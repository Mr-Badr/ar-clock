"use client";

import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import type { ElementType } from "react";
import {
  ArrowsCounterClockwise,
  ArrowsLeftRight,
  Baby,
  Barbell,
  Briefcase,
  Buildings,
  Calculator,
  Calendar,
  CalendarDots,
  Car,
  CaretDown,
  Coins,
  CreditCard,
  Flower,
  Globe,
  GraduationCap,
  Heart,
  Hourglass,
  IdentificationCard,
  Lightning,
  Moon,
  Percent,
  Receipt,
  Scales,
  ShieldCheck,
  Sun,
  Timer,
  TrendUp,
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

type CalcTool = {
  href: string;
  label: string;
  desc: string;
  icon: ElementType;
};

type CalcCategory = {
  id: string;
  label: string;
  sub: string;
  icon: ElementType;
  color: string;
  tools: CalcTool[];
  viewAll: string;
};

const CALC_CATEGORIES: CalcCategory[] = [
  {
    id: "gulf",
    label: "مال وخليج",
    sub: "إقامة • راتب • كهرباء • ميراث",
    icon: Wallet,
    color: "var(--calc-cat-finance)",
    viewAll: "/calculators/finance",
    tools: [
      {
        href: "/calculators/iqama",
        label: "حاسبة الإقامة",
        desc: "انتهاء الإقامة والغرامة اليومية",
        icon: IdentificationCard,
      },
      {
        href: "/calculators/electricity-bill",
        label: "فاتورة الكهرباء",
        desc: "شرائح SEC السعودية وDEWA الإماراتية",
        icon: Lightning,
      },
      {
        href: "/calculators/net-salary",
        label: "صافي الراتب",
        desc: "الراتب بعد GOSI والاستقطاعات",
        icon: Wallet,
      },
      {
        href: "/calculators/inheritance",
        label: "الميراث الإسلامي",
        desc: "توزيع التركة وفق الفرائض",
        icon: Scales,
      },
      {
        href: "/calculators/car-loan",
        label: "تمويل السيارة",
        desc: "تقليدي أم مرابحة؟ قسط وجدول سداد",
        icon: Car,
      },
      {
        href: "/calculators/monthly-installment",
        label: "القسط الشهري",
        desc: "مقارنة القرض والمدة والفائدة",
        icon: CreditCard,
      },
      {
        href: "/calculators/end-of-service-benefits",
        label: "نهاية الخدمة",
        desc: "المستحقات بحسب مدة الخدمة",
        icon: Briefcase,
      },
      {
        href: "/calculators/salary",
        label: "حاسبة الراتب",
        desc: "الراتب الأساسي والبدلات وصافي الدخل",
        icon: Wallet,
      },
      {
        href: "/calculators/zakat",
        label: "حاسبة الزكاة",
        desc: "زكاة المال والذهب والأسهم والمخزون",
        icon: Coins,
      },
      {
        href: "/calculators/investment",
        label: "العائد الاستثماري",
        desc: "احسب نمو مالك بالربح المركب",
        icon: TrendUp,
      },
      {
        href: "/calculators/gosi-retirement",
        label: "التقاعد المبكر GOSI",
        desc: "متى يحق لك؟ وكم معاشك الشهري؟",
        icon: ShieldCheck,
      },
      {
        href: "/calculators/eos-qatar",
        label: "نهاية الخدمة قطر",
        desc: "21 يوماً ثابتاً — الاستقالة لا تنقص مكافأتك",
        icon: Briefcase,
      },
      {
        href: "/calculators/eos-kuwait",
        label: "نهاية الخدمة الكويت",
        desc: "مكافأتك وفق قانون العمل الكويتي 6/2010",
        icon: Briefcase,
      },
      {
        href: "/calculators/eos-bahrain",
        label: "نهاية الخدمة البحرين",
        desc: "نصف شهر ثم شهر كامل — وفق قانون 36/2012",
        icon: Briefcase,
      },
      {
        href: "/calculators/eos-egypt",
        label: "نهاية الخدمة مصر",
        desc: "شهر ثم شهر ونصف بعد 10 سنوات — قانون 12/2003",
        icon: Briefcase,
      },
    ],
  },
  {
    id: "health",
    label: "صحة وأسرة",
    sub: "حمل • تبويض • أسابيع الحمل",
    icon: Heart,
    color: "var(--calc-cat-health)",
    viewAll: "/calculators/pregnancy",
    tools: [
      {
        href: "/calculators/pregnancy",
        label: "حاسبة الحمل",
        desc: "موعد الولادة بالهجري والميلادي",
        icon: Baby,
      },
      {
        href: "/calculators/pregnancy-weeks",
        label: "أسابيع الحمل",
        desc: "أنتِ في الأسبوع كم الآن؟",
        icon: Calendar,
      },
      {
        href: "/calculators/ovulation",
        label: "أيام التبويض",
        desc: "نافذة الخصوبة ودورتك الشهرية",
        icon: Flower,
      },
      {
        href: "/calculators/bmi",
        label: "مؤشر كتلة الجسم",
        desc: "هل وزنك صحي؟ احسب BMI الآن",
        icon: Barbell,
      },
      {
        href: "/calculators/fasting",
        label: "الصيام المتقطع",
        desc: "مؤقت نافذة الأكل وجدول 16:8",
        icon: Timer,
      },
    ],
  },
  {
    id: "education",
    label: "تعليم ومعدل",
    sub: "GPA • تحويل المعدل • نسبة مئوية",
    icon: GraduationCap,
    color: "var(--calc-cat-education)",
    viewAll: "/calculators/gpa",
    tools: [
      {
        href: "/calculators/gpa",
        label: "المعدل التراكمي GPA",
        desc: "احسب معدلك من 5 أو من 4",
        icon: GraduationCap,
      },
      {
        href: "/calculators/gpa-to-percent",
        label: "المعدل إلى نسبة",
        desc: "حوّل GPA إلى نسبة مئوية",
        icon: Percent,
      },
      {
        href: "/calculators/percentage",
        label: "النسبة المئوية",
        desc: "احسب النسبة والخصم والزيادة",
        icon: Percent,
      },
    ],
  },
  {
    id: "age",
    label: "عمر ووقت",
    sub: "عمر دقيق • تقاعد • فرق العمر",
    icon: Hourglass,
    color: "var(--calc-cat-age)",
    viewAll: "/calculators/age",
    tools: [
      {
        href: "/calculators/age/calculator",
        label: "حاسبة العمر",
        desc: "عمرك بالتقويمين والأيام والأشهر",
        icon: Hourglass,
      },
      {
        href: "/calculators/age/difference",
        label: "الفرق بين تاريخين",
        desc: "احسب الفارق بالأيام والأشهر",
        icon: ArrowsLeftRight,
      },
      {
        href: "/calculators/age/retirement",
        label: "حاسبة التقاعد",
        desc: "متى تتقاعد وكم تبقى؟",
        icon: CalendarDots,
      },
    ],
  },
  {
    id: "sleep",
    label: "نوم وروتين",
    sub: "وقت النوم • القيلولة • دين النوم",
    icon: Moon,
    color: "var(--calc-cat-sleep)",
    viewAll: "/calculators/sleep",
    tools: [
      {
        href: "/calculators/sleep/bedtime",
        label: "متى أنام؟",
        desc: "وقت النوم الأمثل لوقت استيقاظك",
        icon: Moon,
      },
      {
        href: "/calculators/sleep/wake-time",
        label: "متى أستيقظ؟",
        desc: "أفضل أوقات الاستيقاظ بدورات نوم",
        icon: Sun,
      },
      {
        href: "/calculators/sleep/sleep-duration",
        label: "مدة النوم",
        desc: "كم نمت فعلياً اليوم؟",
        icon: Timer,
      },
      {
        href: "/calculators/sleep/nap-calculator",
        label: "القيلولة",
        desc: "أفضل وقت وعدد الدورات",
        icon: Moon,
      },
    ],
  },
  {
    id: "building",
    label: "بناء ومواد",
    sub: "تكلفة البناء • أسمنت • حديد",
    icon: Buildings,
    color: "var(--calc-cat-building)",
    viewAll: "/calculators/building",
    tools: [
      {
        href: "/calculators/building",
        label: "تكلفة البناء",
        desc: "سعر المتر في 12 دولة عربية",
        icon: Buildings,
      },
      {
        href: "/calculators/building/cement",
        label: "حاسبة الأسمنت",
        desc: "كمية الأسمنت لمساحتك",
        icon: Calculator,
      },
      {
        href: "/calculators/building/rebar",
        label: "حاسبة الحديد",
        desc: "وزن الحديد المطلوب",
        icon: Calculator,
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
          <Link href="/calculators" className="nav-calc-hub-link" onClick={onClose}>
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
  if (href === "/calculators") return "center";
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
