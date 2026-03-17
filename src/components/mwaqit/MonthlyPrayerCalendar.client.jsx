'use client';

/**
 * components/mwaqit/MonthlyPrayerCalendar.client.jsx  — v5  (production)
 *
 * Arabic monthly prayer timetable (تقويم مواقيت الصلاة الشهري)
 *
 * ── NUMERAL / LOCALE STRATEGY ────────────────────────────────────────────────
 *   Day names      : ar-EG weekday          → "الإثنين"   (Arabic)
 *   Hijri day/year : Intl nu-latn           → 5, 1447     (English digits)
 *   Hijri month    : HIJRI_MONTHS_AR array  → "شعبان"     (Arabic)
 *   Gregorian day  : raw JS integer         → 17           (English digits)
 *   Gregorian label: ar-EG-u-nu-latn        → "مارس 2026" (Arabic month, English year)
 *   Prayer times   : 'en' hr12:false        → "05:30"     (English digits)
 *
 * ── DEPENDENCY ───────────────────────────────────────────────────────────────
 *   lib/hijri-utils.js (native Intl, 0 KB)  — no moment.js needed
 *   lib/prayerEngine (existing)
 *   lucide-react (existing)
 *
 * ── PDF ──────────────────────────────────────────────────────────────────────
 *   Primary:  POST /api/pdf-calendar  (Puppeteer, pixel-perfect A4 landscape)
 *   Fallback: window.print()
 *
 * ── CSS ──────────────────────────────────────────────────────────────────────
 *   All values reference var(--*) from new.css.
 *   overflow:clip (not hidden) keeps position:sticky on thead working.
 *   RTL accent stripe on td:first-child (اليوم column = rightmost in RTL).
 */

import { useState, useEffect, useMemo } from 'react';
import { calculatePrayerTimes } from '@/lib/prayerEngine';
import { Printer, Download, CalendarDays, Moon, Loader2 } from 'lucide-react';
import {
  getDaysInCurrentMonth,
  getHijriParts,
  getHijriMonthSpan,
  formatGregorianLabel,
} from '@/lib/hijri-utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_AR   = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر',  maghrib: 'المغرب', isha: 'العشاء',
};

// Module-level time formatter singleton — created once, reused for all 31×6 calls
// 'en' locale + hour12:false guarantees English digits in HH:MM format
let _timeFmtCache = null;
function getTimeFmt(timezone) {
  // Re-create only when timezone changes (rare)
  if (!_timeFmtCache || _timeFmtCache.tz !== timezone) {
    _timeFmtCache = {
      tz: timezone,
      fmt: new Intl.DateTimeFormat('en', {
        timeZone: timezone, hour: 'numeric', minute: '2-digit', hour12: false,
      }),
    };
  }
  return _timeFmtCache.fmt;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MonthlyPrayerCalendar({ lat, lon, timezone, cityNameAr, countryCode }) {

  const [mounted,    setMounted]    = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError,   setPdfError]   = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setCurrentDay(new Date().getDate());
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // getDaysInCurrentMonth from lib/hijri-utils — no duplication
  const days = useMemo(() => getDaysInCurrentMonth(), []);

  // formatGregorianLabel: "مارس 2026" — Arabic month + English year via nu-latn
  const gregorianLabel = useMemo(() => {
    if (!mounted) return '';
    return formatGregorianLabel(new Date());
  }, [mounted]);

  // getHijriMonthSpan: "شعبان — رمضان 1447 هـ" — Arabic months + English year
  const hijriLabel = useMemo(() => {
    if (!mounted) return '';
    return getHijriMonthSpan(days);
  }, [mounted, days]);

  // ── Build schedule ──────────────────────────────────────────────────────────
  const schedule = useMemo(() => {
    if (!mounted || !lat || !lon) return [];

    const timeFmt   = getTimeFmt(timezone);
    const formatTime = (iso) => {
      if (!iso) return '--:--';
      try { return timeFmt.format(new Date(iso)); } catch { return '--:--'; }
    };

    // Day-name formatter (Arabic weekday names, no numeral extension needed)
    const dayFmt = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' });

    return days.map((date, i) => {
      const midDay = new Date(date);
      midDay.setHours(12, 0, 0, 0);

      const times = calculatePrayerTimes({
        lat, lon, timezone, date: midDay, countryCode, cacheKey: null,
      });
      if (!times) return null;

      // getHijriParts: English numerals for day/year, Arabic name for month
      const hijri     = getHijriParts(date);
      const prevHijri = i > 0 ? getHijriParts(days[i - 1]) : null;

      return {
        dayNumber:       date.getDate(),             // JS integer → English digit
        dayName:         dayFmt.format(date),         // "الإثنين"
        isFriday:        date.getDay() === 5,
        hijriDay:        hijri.hijriDay,              // English digit
        hijriYear:       hijri.hijriYear,             // English digit
        hijriMonthName:  hijri.hijriMonthName,        // Arabic name
        isNewHijriMonth: !prevHijri || hijri.hijriMonthNum !== prevHijri.hijriMonthNum,
        fajr:    formatTime(times.fajr),              // "05:30" English
        sunrise: formatTime(times.sunrise),
        dhuhr:   formatTime(times.dhuhr),
        asr:     formatTime(times.asr),
        maghrib: formatTime(times.maghrib),
        isha:    formatTime(times.isha),
      };
    }).filter(Boolean);
  }, [mounted, lat, lon, timezone, days, countryCode]);

  // ── PDF download (Puppeteer route) ─────────────────────────────────────────
  const handlePdfDownload = async () => {
    if (!schedule.length) return;
    setPdfLoading(true);
    setPdfError('');
    try {
      const res = await fetch('/api/pdf-calendar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode }),
      });
      if (!res.ok) throw new Error('فشل إنشاء الملف');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `taqwim-salat-${cityNameAr}-${gregorianLabel}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setPdfError(e.message || 'حدث خطأ أثناء إنشاء الملف');
    } finally {
      setPdfLoading(false);
    }
  };

  // ── Skeleton (before hydration) ────────────────────────────────────────────
  if (!mounted || !lat || !lon) {
    return <div className="mpc-skeleton" aria-busy="true" aria-label="جاري تحميل تقويم الصلاة" />;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style suppressHydrationWarning>{`

        /* ── Skeleton ───────────────────────────────────────────────────── */
        .mpc-skeleton {
          width: 100%; height: 420px;
          border-radius: var(--radius-xl);
          background: linear-gradient(90deg,
            var(--bg-surface-2) 25%,
            var(--bg-surface-3) 50%,
            var(--bg-surface-2) 75%);
          background-size: 200% 100%;
          animation: mpcShimmer 1.5s ease-in-out infinite;
        }
        @keyframes mpcShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes mpcSpin { to { transform: rotate(360deg); } }
        .mpc-spin { animation: mpcSpin 1s linear infinite; }

        /* ── Card ───────────────────────────────────────────────────────── */
        /* overflow:clip (not hidden) — clips visually at border-radius but  */
        /* does NOT create a scroll container → position:sticky on thead ✓   */
        .mpc-card {
          background-color: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
          overflow: clip;
          direction: rtl;
          font-family: var(--font-base);
          transition:
            background-color var(--transition-theme),
            border-color     var(--transition-theme),
            box-shadow       var(--transition-base);
        }

        /* ── Header ─────────────────────────────────────────────────────── */
        .mpc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--border-subtle);
          background: linear-gradient(135deg,
            var(--bg-surface-3) 0%, var(--bg-surface-2) 60%);
        }
        .mpc-header-left    { display: flex; flex-direction: column; gap: var(--space-1-5); }
        .mpc-title {
          display: flex; align-items: center; gap: var(--space-2);
          font-size: var(--text-lg); font-weight: var(--font-bold);
          color: var(--text-primary); margin: 0; line-height: var(--leading-tight);
        }
        .mpc-title-icon     { color: var(--accent-alt); flex-shrink: 0; }
        .mpc-subtitle       { font-size: var(--text-sm); color: var(--text-muted); }
        .mpc-hijri-badge {
          display: inline-flex; align-items: center; gap: var(--space-1-5);
          font-size: var(--text-xs); font-weight: var(--font-medium);
          color: var(--accent-alt);
          background: var(--accent-alt-soft);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-full);
          padding: var(--space-1) var(--space-3);
          width: fit-content;
        }
        .mpc-header-actions {
          display: flex; align-items: center;
          gap: var(--space-2); flex-shrink: 0; align-self: flex-start;
        }

        /* ── Buttons ────────────────────────────────────────────────────── */
        /* Mirrors .btn .btn-primary from new.css exactly */
        .mpc-btn-pdf {
          display: inline-flex; align-items: center; justify-content: center;
          gap: var(--space-2);
          font-family: var(--font-base); font-size: var(--text-sm);
          font-weight: var(--font-semibold); line-height: var(--leading-none);
          white-space: nowrap; cursor: pointer;
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-4);
          background: var(--accent-gradient);
          color: var(--text-on-accent);
          border: 1px solid transparent;
          user-select: none; -webkit-user-select: none;
          transition:
            box-shadow var(--transition-fast),
            transform  var(--transition-fast);
        }
        .mpc-btn-pdf:hover:not(:disabled) {
          background: var(--accent-gradient-hover);
          box-shadow: var(--shadow-accent);
        }
        .mpc-btn-pdf:active:not(:disabled) { transform: translateY(1px) scale(0.99); }
        .mpc-btn-pdf:disabled {
          opacity: 0.38; cursor: not-allowed; pointer-events: none;
        }

        /* Mirrors .btn .btn-ghost from new.css */
        .mpc-btn-print {
          display: inline-flex; align-items: center; justify-content: center;
          gap: var(--space-2);
          font-family: var(--font-base); font-size: var(--text-sm);
          font-weight: var(--font-medium); line-height: var(--leading-none);
          white-space: nowrap; cursor: pointer;
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-4);
          background: transparent; color: var(--text-secondary);
          border: 1px solid var(--border-default);
          user-select: none; -webkit-user-select: none;
          transition:
            background-color var(--transition-fast),
            color            var(--transition-fast),
            border-color     var(--transition-fast);
        }
        .mpc-btn-print:hover {
          background-color: var(--bg-surface-3);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }
        .mpc-btn-print:active { transform: translateY(1px) scale(0.99); }

        /* Error — horizontally padded to align with header content */
        .mpc-error {
          font-size: var(--text-xs); color: var(--danger);
          padding: var(--space-2) var(--space-6);
        }

        /* ── Scroll wrapper ──────────────────────────────────────────────── */
        /* tabIndex="0" allows keyboard users to scroll horizontally         */
        /* padding-bottom: var(--space-2) prevents scrollbar clipping rows   */
        .mpc-scroll {
          overflow-x: auto;
          padding-bottom: var(--space-2);
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
        }
        .mpc-scroll::-webkit-scrollbar        { height: 5px; }
        .mpc-scroll::-webkit-scrollbar-track  { background: var(--scrollbar-track); }
        .mpc-scroll::-webkit-scrollbar-thumb  {
          background: var(--scrollbar-thumb); border-radius: 9999px;
        }

        /* ── Table ──────────────────────────────────────────────────────── */
        /* font-family inherited from .mpc-card — no redundant declaration  */
        .mpc-table {
          width: 100%; border-collapse: collapse;
          table-layout: fixed; min-width: 680px;
        }
        .mpc-col-day    { width: 13%; }
        .mpc-col-hijri  { width: 13%; }
        .mpc-col-greg   { width:  6%; }
        .mpc-col-prayer { width: calc(68% / 6); }

        /* ── Thead — sticky, no overflow:hidden conflict (overflow:clip fixes it) */
        .mpc-thead tr {
          background-color: var(--bg-surface-4);
          position: sticky; top: 0; z-index: var(--z-raised);
        }
        .mpc-th {
          font-size: var(--text-xs); font-weight: var(--font-bold);
          color: var(--text-secondary); text-align: center;
          padding: var(--space-3) var(--space-2);
          letter-spacing: 0; white-space: nowrap;
          /* border on th (not tr) — correct in border-collapse */
          border-bottom: 2px solid var(--border-default);
          transition: color var(--transition-theme);
        }
        .mpc-th--prayer { color: var(--accent-alt); }

        /* ── Striped rows ────────────────────────────────────────────────── */
        .mpc-tbody tr:nth-child(odd)  td { background-color: var(--bg-surface-2); }
        .mpc-tbody tr:nth-child(even) td { background-color: var(--bg-surface-1); }
        .mpc-tbody tr {
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color var(--transition-fast);
        }
        .mpc-tbody tr:hover td { background-color: var(--bg-surface-3) !important; }
        .mpc-tbody tr:last-child { border-bottom: none; }

        /* ── Today row ───────────────────────────────────────────────────── */
        .mpc-row-today td {
          background-color: var(--accent-soft) !important;
          border-top:    1px solid var(--border-accent-strong) !important;
          border-bottom: 1px solid var(--border-accent-strong) !important;
        }
        .mpc-row-today:hover td { background-color: var(--accent-soft-hover) !important; }
        /* RTL accent stripe: td:first-child = اليوم = rightmost column in RTL */
        /* inset 3px 0 0 = stripe on physical RIGHT edge ✓                    */
        .mpc-row-today td:first-child { box-shadow: inset 3px 0 0 var(--accent); }

        /* ── Friday row ──────────────────────────────────────────────────── */
        /* --success-soft token (not color-mix) for design system compliance */
        .mpc-row-friday td         { background-color: var(--success-soft) !important; }
        .mpc-row-friday:hover td   { filter: brightness(0.92); }

        /* ── Cells ───────────────────────────────────────────────────────── */
        .mpc-td {
          padding: var(--space-2);
          text-align: center; vertical-align: middle;
          font-size: var(--text-sm); color: var(--text-primary);
        }

        /* Day name */
        .mpc-cell-day            { font-weight: var(--font-medium); }
        .mpc-row-today  .mpc-cell-day { color: var(--accent-alt); font-weight: var(--font-bold); }
        .mpc-row-friday .mpc-cell-day { color: var(--success);    font-weight: var(--font-semibold); }

        /* Hijri */
        .mpc-cell-hijri { vertical-align: middle; }
        .mpc-hijri-day  { display: block; font-weight: var(--font-semibold); }
        .mpc-row-today  .mpc-hijri-day { color: var(--accent-alt); }
        .mpc-row-friday .mpc-hijri-day { color: var(--success); }

        /* Hijri month-change pill */
        .mpc-hijri-pill {
          display: inline-block;
          font-size: var(--text-2xs); font-weight: var(--font-semibold);
          color: var(--accent-alt);
          background: var(--accent-alt-soft);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-full);
          padding: 1px 5px; margin-top: 2px;
          white-space: nowrap; line-height: 1.4;
        }
        /* Friday: override pill to green family for visual consistency */
        .mpc-row-friday .mpc-hijri-pill {
          color: var(--success);
          background: var(--success-soft);
          border-color: var(--success-border);
        }

        /* Gregorian day number — raw integer always English */
        .mpc-cell-greg {
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          font-weight: var(--font-bold);
          color: var(--text-secondary);
        }
        .mpc-row-today  .mpc-cell-greg { color: var(--accent-alt); }
        .mpc-row-friday .mpc-cell-greg { color: var(--success); }

        /* Today badge */
        .mpc-today-badge {
          display: inline-block;
          font-size: var(--text-2xs); font-weight: var(--font-bold);
          color: var(--text-on-accent); background: var(--accent-gradient);
          border-radius: var(--radius-full);
          padding: 1px 6px; margin-inline-start: var(--space-1);
          vertical-align: middle;
        }

        /* Prayer times — IBM Plex Mono for consistent digit width */
        .mpc-cell-time {
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          font-size: var(--text-sm); color: var(--text-primary);
          letter-spacing: var(--tracking-clock);
        }
        .mpc-row-today  .mpc-cell-time { color: var(--accent-alt); font-weight: var(--font-semibold); }
        .mpc-row-friday .mpc-cell-time { color: var(--success); }

        /* Print-only footer — hidden on screen */
        .mpc-print-footer { display: none; }

        /* ════════════════════════════════════════════════════════════════
           BROWSER PRINT — A4 landscape fallback
           Primary path: /api/pdf-calendar (Puppeteer).
           This CSS handles window.print() fallback.
        ════════════════════════════════════════════════════════════════ */
        @media print {
          body * { visibility: hidden !important; }
          #mpc-print-root, #mpc-print-root * { visibility: visible !important; }
          #mpc-print-root {
            position: absolute !important; inset: 0 !important;
            padding: 0 !important; margin: 0 !important;
            background: white !important;
          }
          @page { size: A4 landscape; margin: 0.8cm 1cm; }
          .mpc-card {
            border: none !important; box-shadow: none !important;
            border-radius: 0 !important; background: white !important;
            overflow: visible !important;
          }
          .mpc-header {
            background: transparent !important;
            border-bottom: 2pt solid #000 !important;
            padding: 4px 0 6px !important;
          }
          .mpc-title      { font-size: 10pt !important; color: black !important; }
          .mpc-title-icon { display: none !important; }
          .mpc-subtitle   { font-size: 7.5pt !important; color: #333 !important; }
          .mpc-hijri-badge {
            font-size: 7pt !important; color: #555 !important;
            background: transparent !important; border-color: #999 !important;
          }
          .mpc-header-actions, .mpc-error { display: none !important; }
          .mpc-scroll { overflow: visible !important; }
          .mpc-table  {
            min-width: unset !important; font-size: 7.5pt !important;
            page-break-inside: avoid !important;
          }
          .mpc-thead tr  { position: static !important; background: transparent !important; }
          .mpc-th {
            font-size: 7.5pt !important; color: black !important;
            padding: 3px 2px !important; background: #e8e8e8 !important;
            border-bottom: 1.5pt solid black !important;
          }
          .mpc-td        { font-size: 7pt !important; padding: 2px !important; color: black !important; }
          .mpc-cell-time { font-size: 7.5pt !important; color: black !important; }
          .mpc-tbody tr:nth-child(odd)  td { background-color: white !important; }
          .mpc-tbody tr:nth-child(even) td { background-color: #f5f5f5 !important; }
          .mpc-row-today td {
            background-color: #fffbe6 !important;
            border-top: 1pt solid #999 !important; border-bottom: 1pt solid #999 !important;
          }
          .mpc-row-friday td { background-color: #f0fff4 !important; }
          .mpc-row-today td, .mpc-row-friday td,
          .mpc-row-today  .mpc-cell-day,  .mpc-row-friday .mpc-cell-day,
          .mpc-row-today  .mpc-cell-time, .mpc-row-friday .mpc-cell-time,
          .mpc-row-today  .mpc-cell-greg, .mpc-row-friday .mpc-cell-greg,
          .mpc-row-today  .mpc-hijri-day, .mpc-row-friday .mpc-hijri-day
          { color: black !important; }
          .mpc-row-today td:first-child { box-shadow: inset 3px 0 0 #555 !important; }
          .mpc-hijri-pill, .mpc-row-friday .mpc-hijri-pill {
            color: #444 !important; background: transparent !important;
            border-color: #999 !important; font-size: 5pt !important;
          }
          .mpc-today-badge { display: none !important; }
          .mpc-print-footer {
            display: block !important; font-size: 6pt !important; color: #666 !important;
            text-align: center !important; padding-top: 4px !important;
            border-top: 0.5pt solid #ccc !important; margin-top: 4px !important;
          }
        }
      `}</style>

      <div id="mpc-print-root">
        <div className="mpc-card">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="mpc-header">
            <div className="mpc-header-left">
              <h2 className="mpc-title">
                <CalendarDays size={18} className="mpc-title-icon" aria-hidden="true" />
                {/* Tier-2 keyword: تقويم مواقيت الصلاة */}
                تقويم مواقيت الصلاة — {gregorianLabel}
              </h2>
              {/* Tier-3 keyword: جدول أوقات الصلاة الشهري */}
              <p className="mpc-subtitle">
                جدول أوقات الصلاة الشهري لمدينة {cityNameAr}
              </p>
              <span
                className="mpc-hijri-badge"
                aria-label={`التقويم الهجري: ${hijriLabel}`}
              >
                <Moon size={11} aria-hidden="true" />
                {hijriLabel}
              </span>
            </div>

            <div className="mpc-header-actions">
              {/* Primary: Puppeteer PDF — Tier-3: تحميل تقويم الصلاة PDF */}
              <button
                className="mpc-btn-pdf"
                onClick={handlePdfDownload}
                disabled={pdfLoading || !schedule.length}
                aria-busy={pdfLoading}
                aria-label="تحميل تقويم مواقيت الصلاة كملف PDF"
              >
                {pdfLoading ? (
                  <>
                    <Loader2 size={14} className="mpc-spin" aria-hidden="true" />
                    جاري الإنشاء…
                  </>
                ) : (
                  <>
                    <Download size={14} aria-hidden="true" />
                    تحميل PDF
                  </>
                )}
              </button>

              {/* Secondary: browser print fallback */}
              <button
                className="mpc-btn-print"
                onClick={() => window.print()}
                aria-label="طباعة تقويم مواقيت الصلاة"
              >
                <Printer size={14} aria-hidden="true" />
                طباعة
              </button>
            </div>
          </div>

          {pdfError && (
            <p className="mpc-error" role="alert" aria-live="assertive">
              {pdfError}
            </p>
          )}

          {/* ── Table ───────────────────────────────────────────────────── */}
          <div
            className="mpc-scroll"
            role="region"
            aria-label="جدول مواقيت الصلاة الشهري"
            tabIndex={0}
          >
            <table
              className="mpc-table"
              dir="rtl"
              aria-label={`تقويم مواقيت الصلاة ${gregorianLabel} — ${cityNameAr}`}
            >
              <colgroup>
                <col className="mpc-col-day" />
                <col className="mpc-col-hijri" />
                <col className="mpc-col-greg" />
                {PRAYER_KEYS.map(k => <col key={k} className="mpc-col-prayer" />)}
              </colgroup>

              <thead className="mpc-thead">
                <tr>
                  <th className="mpc-th" scope="col">اليوم</th>
                  <th className="mpc-th" scope="col">الهجري</th>
                  <th className="mpc-th" scope="col">الميلادي</th>
                  {PRAYER_KEYS.map(k => (
                    <th key={k} className="mpc-th mpc-th--prayer" scope="col">
                      {PRAYER_AR[k]}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="mpc-tbody">
                {schedule.map((row) => {
                  const isToday = row.dayNumber === currentDay;
                  const rowCls  = isToday
                    ? 'mpc-row-today'
                    : row.isFriday ? 'mpc-row-friday' : '';

                  return (
                    <tr
                      key={row.dayNumber}
                      className={rowCls}
                      aria-current={isToday ? 'date' : undefined}
                    >
                      {/* td:first-child = اليوم = rightmost in RTL = accent stripe */}
                      <td className="mpc-td mpc-cell-day">
                        {row.dayName}
                        {isToday && (
                          <span className="mpc-today-badge" aria-label="اليوم">
                            اليوم
                          </span>
                        )}
                      </td>

                      {/* Hijri: day + optional month-change pill */}
                      <td className="mpc-td mpc-cell-hijri">
                        {/* hijriDay is always an English digit (nu-latn) */}
                        <span className="mpc-hijri-day">{row.hijriDay}</span>
                        {row.isNewHijriMonth && (
                          <span
                            className="mpc-hijri-pill"
                            aria-label={`بداية شهر ${row.hijriMonthName}`}
                          >
                            {row.hijriMonthName}
                          </span>
                        )}
                      </td>

                      {/* Gregorian day number — raw integer always English */}
                      <td className="mpc-td mpc-cell-greg" dir="ltr">
                        {row.dayNumber}
                      </td>

                      {/* Prayer times — dir="ltr" so HH:MM reads correctly */}
                      {PRAYER_KEYS.map(k => (
                        <td key={k} className="mpc-td mpc-cell-time" dir="ltr">
                          {row[k]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Print-only footer */}
          <div className="mpc-print-footer">
            تقويم مواقيت الصلاة الشهري — {cityNameAr} — waqt.app
          </div>

        </div>
      </div>
    </>
  );
}