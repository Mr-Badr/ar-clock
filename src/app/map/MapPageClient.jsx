// app/map/page.jsx — Redesigned Hero Section
"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import {
  Globe,
  Sun,
  Moon,
  CalendarDays,
  MapPin,
  Clock3,
  ArrowLeft,
  Zap,
  LocateFixed,
  Navigation,
} from "lucide-react";
import { DottedMap } from "@/components/ui/dotted-map";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

const CITIES = [
  { id: "riyadh",     label: "الرياض",        country: "السعودية",        timezone: "Asia/Riyadh",       lat: 24.7136, lng: 46.6753 },
  { id: "dubai",      label: "دبي",            country: "الإمارات",        timezone: "Asia/Dubai",        lat: 25.2048, lng: 55.2708 },
  { id: "cairo",      label: "القاهرة",        country: "مصر",             timezone: "Africa/Cairo",      lat: 30.0444, lng: 31.2357 },
  { id: "casablanca", label: "الدار البيضاء",  country: "المغرب",          timezone: "Africa/Casablanca", lat: 33.5731, lng: -7.5898 },
  { id: "istanbul",   label: "إسطنبول",        country: "تركيا",           timezone: "Europe/Istanbul",   lat: 41.0082, lng: 28.9784 },
  { id: "london",     label: "لندن",           country: "المملكة المتحدة", timezone: "Europe/London",     lat: 51.5072, lng: -0.1276 },
  { id: "paris",      label: "باريس",          country: "فرنسا",           timezone: "Europe/Paris",      lat: 48.8566, lng: 2.3522  },
  { id: "newyork",    label: "نيويورك",        country: "أمريكا",          timezone: "America/New_York",  lat: 40.7128, lng: -74.006 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

function formatTime(timezone, seconds = true) {
  return new Intl.DateTimeFormat("ar", {
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
    hour12: false,
    timeZone: timezone,
  }).format(new Date());
}

function getUtcOffset(timezone) {
  const now = new Date();
  const local = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const diff = Math.round((local - now) / 60000);
  const sign = diff >= 0 ? "+" : "-";
  const h = Math.floor(Math.abs(diff) / 60);
  const m = Math.abs(diff) % 60;
  return m === 0 ? `UTC ${sign}${h}` : `UTC ${sign}${h}:${String(m).padStart(2, "0")}`;
}

function formatArabicDate(timezone) {
  return new Intl.DateTimeFormat("ar", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: timezone,
  }).format(new Date());
}

function getWeekNumber() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}

function getSolar(timezone) {
  const city = CITIES.find((c) => c.timezone === timezone);
  if (!city) return { sunrise: "06:00", sunset: "18:00", daylight: "12 س" };
  const rH = city.lat > 40 ? 7 : city.lat > 30 ? 6 : 5;
  const sH = city.lng > 30 ? 18 : 19;
  return {
    sunrise: `${String(rH).padStart(2, "0")}:03`,
    sunset:  `${String(sH).padStart(2, "0")}:14`,
    daylight: `${sH - rH} س 11 د`,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════════ */

function useLiveClock(timezone, seconds = true) {
  const [t, setT] = useState(() => formatTime(timezone, seconds));
  useEffect(() => {
    setT(formatTime(timezone, seconds));
    const id = setInterval(() => setT(formatTime(timezone, seconds)), 1000);
    return () => clearInterval(id);
  }, [timezone, seconds]);
  return t;
}

function useGeoCity() {
  const [city, setCity] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const fallback = () => {
      if (cancelled) return;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const known = CITIES.find((c) => c.timezone === tz);
      if (known) { setCity(known); return; }
      setCity({
        id: "user",
        label: tz.split("/").pop()?.replace(/_/g, " ") || "موقعك",
        country: "",
        timezone: tz,
        lat: 24.7136,
        lng: 46.6753,
      });
    };
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setCity({
          id: "user",
          label: d.city || d.region || "موقعك",
          country: d.country_name || "",
          timezone: d.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          lat: +d.latitude || 24.7136,
          lng: +d.longitude || 46.6753,
        });
      })
      .catch(fallback);
    return () => { cancelled = true; };
  }, []);
  return city;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/** Featured user-city card with large live clock */
function FeaturedClockCard({ city, isUser }) {
  const time = useLiveClock(city.timezone, true);
  const utc = getUtcOffset(city.timezone);

  return (
    <div
      className="card card--accent hero-clock-card"
      style={{ padding: "var(--space-6)", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient inner glow */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          background: "radial-gradient(ellipse at 30% 0%, var(--accent-glow) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "var(--radius-full)",
            background: "var(--accent-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {isUser
              ? <Navigation size={17} style={{ color: "var(--accent-alt)" }} />
              : <Globe size={17} style={{ color: "var(--accent-alt)" }} />
            }
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: 2, letterSpacing: "var(--tracking-wide)" }}>
              {isUser ? "📍 موقعك الحالي" : city.country}
            </div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", color: "var(--text-primary)", lineHeight: 1.2 }}>
              {city.label}
            </div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-surface-4)",
          border: "1px solid var(--border-accent)",
          borderRadius: "var(--radius-full)",
          padding: "var(--space-1-5) var(--space-4)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--font-medium)",
          color: "var(--accent-alt)",
          direction: "ltr",
          fontVariantNumeric: "tabular-nums",
        }}>
          {utc}
        </div>
      </div>

      {/* Clock display */}
      <div
        className="tabular-nums"
        style={{
          position: "relative",
          fontSize: "clamp(3.2rem, 8vw, 5.5rem)",
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "0.02em",
          color: "var(--clock-digit-color, #fff)",
          direction: "ltr",
        }}
      >
        {time}
      </div>

      {/* Live pulse */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
        <span className="accent-dot hero-pulse" />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>تحديث مباشر كل ثانية</span>
      </div>
    </div>
  );
}

/** Compact city card for the grid */
function CityMiniCard({ city, selected, onClick }) {
  const time = useLiveClock(city.timezone, false);
  return (
    <button
      onClick={() => onClick(city)}
      style={{
        background: selected ? "var(--accent-soft)" : "var(--bg-surface-2)",
        border: `1px solid ${selected ? "var(--border-accent-strong)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-4) var(--space-5)",
        textAlign: "right",
        cursor: "pointer",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all var(--transition-fast)",
        boxShadow: selected ? "var(--shadow-accent)" : "var(--shadow-xs)",
      }}
    >
      <div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: 2 }}>{city.country}</div>
        <div style={{
          fontSize: "var(--text-base)",
          fontWeight: "var(--font-semibold)",
          color: selected ? "var(--accent-alt)" : "var(--text-primary)",
        }}>
          {city.label}
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2, direction: "ltr", textAlign: "right" }}>
          {getUtcOffset(city.timezone)}
        </div>
      </div>
      <div
        className="tabular-nums"
        style={{
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          color: selected ? "var(--accent-alt)" : "var(--clock-digit-color, #fff)",
          direction: "ltr",
        }}
      >
        {time}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN HERO CONTENT
═══════════════════════════════════════════════════════════════════════════ */

function WorldClockHeroContent() {
  const userCity = useGeoCity();

  // Default to Casablanca, switch to user's city when detected
  const [selectedCity, setSelectedCity] = useState(CITIES[3]);
  useEffect(() => {
    if (userCity) setSelectedCity(userCity);
  }, [userCity?.label, userCity?.timezone]);

  const sol = getSolar(selectedCity.timezone);
  const wk = getWeekNumber();

  // 4 side cities (exclude selected)
  const sideCities = useMemo(() => {
    return CITIES.filter((c) => c.timezone !== selectedCity.timezone).slice(0, 4);
  }, [selectedCity.timezone]);

  // Map dots: all 8 cities + user pin if detected
  const mapDots = useMemo(() => {
    const dots = CITIES.map((c) => ({ lat: c.lat, lng: c.lng, label: c.label }));
    if (userCity && !CITIES.find((c) => c.timezone === userCity.timezone)) {
      dots.push({ lat: userCity.lat, lng: userCity.lng, label: "📍" });
    }
    return dots;
  }, [userCity]);

  const isUserCity =
    !!userCity &&
    (selectedCity.id === "user" || selectedCity.timezone === userCity.timezone);

  return (
    <>
      {/* ── Keyframes & hero-specific styles ── */}
      <style>{`
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes hero-glow-drift {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -52%) scale(1.08); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-pulse { animation: hero-pulse 2.4s ease-in-out infinite; }
        .hero-clock-card { animation: fade-up 0.6s var(--ease-spring, cubic-bezier(.175,.885,.32,1.275)) both; animation-delay: 0.25s; }
        .hero-text-block { animation: fade-up 0.55s var(--ease-out, ease-out) both; }
        .hero-map-block  { animation: fade-up 0.6s var(--ease-out, ease-out) both; animation-delay: 0.1s; }
        .hero-grid-item  { animation: fade-up 0.5s var(--ease-out, ease-out) both; }
        .hero-grid-item:nth-child(1) { animation-delay: 0.15s; }
        .hero-grid-item:nth-child(2) { animation-delay: 0.22s; }
        .hero-grid-item:nth-child(3) { animation-delay: 0.29s; }
        .hero-grid-item:nth-child(4) { animation-delay: 0.36s; }
        .hero-cta-btn:hover { transform: translateY(-2px) scale(1.01); }
        .hero-cta-btn { transition: transform var(--transition-fast, 150ms ease); }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-city-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-bottom-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .hero-city-grid  { grid-template-columns: 1fr !important; }
          .hero-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        dir="rtl"
        style={{
          padding: "var(--space-14) 0 var(--space-20)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Ambient background glow ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "15%",
            left: "55%",
            width: 700,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(29,78,216,0.12) 0%, transparent 70%)",
            animation: "hero-glow-drift 8s ease-in-out infinite",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container container--wide" style={{ position: "relative", zIndex: 1 }}>
          {/* ════════ TWO-COLUMN GRID ════════ */}
          <div
            className="hero-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "var(--space-10)", alignItems: "start" }}
          >
            {/* ── COLUMN A (visually right in RTL): Branding + Clock + CTA ── */}
            <div className="hero-text-block" style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

              {/* Badge */}
              <div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
                  background: "var(--accent-soft)", border: "1px solid var(--border-accent-strong)",
                  borderRadius: "var(--radius-full)", padding: "var(--space-2) var(--space-4)",
                  fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)",
                  color: "var(--accent-alt)", letterSpacing: "var(--tracking-wide)",
                }}>
                  <Zap size={12} />
                  لوحة الوقت العالمية
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}>
                  راقب الوقت في
                  <span style={{
                    display: "block",
                    color: "var(--accent-alt)",
                    fontWeight: 300,
                    marginTop: "var(--space-1)",
                  }}>
                    أي مكان حول العالم
                  </span>
                </h1>
                <p style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginTop: "var(--space-5)",
                  maxWidth: "48ch",
                }}>
                  توقيت حي لأبرز المدن العربية والعالمية. اكتشف فارق التوقيت، مواعيد الشروق والغروب، والتاريخ المحلي — كل ذلك محدَّث لحظة بلحظة.
                </p>
              </div>

              {/* Featured city live clock */}
              <FeaturedClockCard city={selectedCity} isUser={isUserCity} />

              {/* CTA buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <Link
                  href="/time-now"
                  className="btn btn-primary btn-lg hero-cta-btn"
                  style={{ gap: "var(--space-2)", borderRadius: "var(--radius-md)" }}
                >
                  <span>استكشف كل مدن العالم</span>
                  <ArrowLeft size={18} />
                </Link>
                <button
                  className="btn btn-secondary btn-lg hero-cta-btn"
                  style={{ gap: "var(--space-2)", borderRadius: "var(--radius-md)" }}
                >
                  <Globe size={16} />
                  <span>اختر مدينة</span>
                </button>
              </div>

              {/* Stats strip */}
              <div style={{
                display: "flex", gap: "var(--space-8)",
                paddingTop: "var(--space-5)",
                borderTop: "1px solid var(--border-subtle)",
              }}>
                {[
                  { val: "+200", lbl: "دولة" },
                  { val: "500+", lbl: "مدينة" },
                  { val: "24/7", lbl: "تحديث حي" },
                ].map(({ val, lbl }) => (
                  <div key={lbl}>
                    <div className="tabular-nums" style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--accent-alt)" }}>
                      {val}
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: 2 }}>
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── COLUMN B (visually left in RTL): Map + Data grid ── */}
            <div className="hero-map-block" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

              {/* ── MAP CARD ── */}
              <div
                className="card"
                style={{
                  padding: "var(--space-5)",
                  background: "var(--bg-surface-2)",
                  position: "relative",
                  overflow: "hidden",
                  borderColor: "var(--border-default)",
                }}
              >
                {/* Map header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: "var(--space-4)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span className="accent-dot hero-pulse" />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: "var(--font-semibold)" }}>
                      الخريطة التفاعلية
                    </span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "var(--space-2)",
                    background: "var(--bg-surface-3)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-full)",
                    padding: "var(--space-1-5) var(--space-3)",
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                  }}>
                    {userCity
                      ? <><LocateFixed size={12} style={{ color: "var(--accent-alt)" }} /> <span style={{ color: "var(--accent-alt)" }}>تم تحديد موقعك</span></>
                      : <><Clock3 size={12} /> <span>جاري التحديد…</span></>
                    }
                  </div>
                </div>

                {/* Dotted world map */}
                <div style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  background: "var(--bg-surface-1)",
                  minHeight: 240,
                  position: "relative",
                }}>
                  <DottedMap
                    dots={mapDots}
                    dotColor="rgba(140,174,255,0.35)"
                    lineColor="rgba(140,174,255,0.10)"
                    glowColor="#8CAEFF"
                    className="h-full w-full"
                  />

                  {/* User location overlay pin */}
                  {userCity && (
                    <div style={{
                      position: "absolute",
                      bottom: "var(--space-4)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--bg-glass)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid var(--border-accent)",
                      borderRadius: "var(--radius-full)",
                      padding: "var(--space-2) var(--space-4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      whiteSpace: "nowrap",
                    }}>
                      <MapPin size={13} style={{ color: "var(--accent-alt)", flexShrink: 0 }} />
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--text-primary)" }}>
                        {selectedCity.label}
                      </span>
                      <span style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--accent-alt)",
                        background: "var(--accent-soft)",
                        borderRadius: "var(--radius-full)",
                        padding: "1px var(--space-2)",
                        direction: "ltr",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {getUtcOffset(selectedCity.timezone)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 2×2 CITY GRID ── */}
              <div
                className="hero-city-grid"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}
              >
                {sideCities.map((city, i) => (
                  <div key={city.id} className="hero-grid-item">
                    <CityMiniCard
                      city={city}
                      selected={selectedCity.timezone === city.timezone}
                      onClick={setSelectedCity}
                    />
                  </div>
                ))}
              </div>

              {/* ── DATE + SUNRISE CARDS ── */}
              <div
                className="hero-bottom-grid"
                style={{ display: "grid", gridTemplateColumns: "1.15fr 0.95fr", gap: "var(--space-4)" }}
              >
                {/* Date card — orange */}
                <div style={{
                  borderRadius: "var(--radius-2xl)",
                  background: "#f89a50",
                  padding: "var(--space-5)",
                  color: "#000",
                  boxShadow: "0 18px 45px rgba(248,154,80,0.28)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, opacity: 0.75, margin: 0 }}>التاريخ المحلي</p>
                      <h3 style={{
                        marginTop: "var(--space-4)",
                        fontSize: "clamp(1.5rem, 3vw, 2.6rem)",
                        fontWeight: 300,
                        lineHeight: 1.15,
                        letterSpacing: "-0.04em",
                        margin: "var(--space-4) 0 0",
                      }}>
                        {formatArabicDate(selectedCity.timezone)}
                      </h3>
                      <p style={{ marginTop: "var(--space-3)", fontSize: "var(--text-sm)", opacity: 0.8 }}>
                        الأسبوع {wk}
                      </p>
                    </div>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-full)",
                      background: "rgba(0,0,0,0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <CalendarDays size={20} />
                    </div>
                  </div>
                  <div style={{
                    marginTop: "var(--space-6)",
                    fontSize: "var(--text-sm)", fontWeight: 500, opacity: 0.65,
                    direction: "ltr", textAlign: "left",
                  }}>
                    {new Intl.DateTimeFormat("en", { year: "numeric", timeZone: selectedCity.timezone }).format(new Date())}
                  </div>
                </div>

                {/* Sunrise card — yellow */}
                <div style={{
                  borderRadius: "var(--radius-2xl)",
                  background: "#ebe81e",
                  padding: "var(--space-5)",
                  color: "#000",
                  boxShadow: "0 18px 45px rgba(235,232,30,0.18)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, opacity: 0.72, margin: 0 }}>الشروق والغروب</p>
                      <div style={{ marginTop: "var(--space-4)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", alignItems: "end" }}>
                        <div>
                          <div style={{ fontSize: "var(--text-xs)", opacity: 0.7 }}>شروق</div>
                          <div className="tabular-nums" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", fontWeight: 300, letterSpacing: "-0.05em", lineHeight: 1 }}>
                            {sol.sunrise}
                          </div>
                          <div style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", opacity: 0.7 }}>
                            {sol.daylight}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "var(--text-xs)", opacity: 0.7 }}>غروب</div>
                          <div className="tabular-nums" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", fontWeight: 300, letterSpacing: "-0.05em", lineHeight: 1 }}>
                            {sol.sunset}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-full)", background: "rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Sun size={18} />
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-full)", background: "rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Moon size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End column B */}
            </div>
          </div>
          {/* End grid */}
        </div>
      </section>
    </>
  );
}

export default function WorldClockHero() {
  return (
    <Suspense fallback={null}>
      <WorldClockHeroContent />
    </Suspense>
  );
}