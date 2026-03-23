'use client';

/**
 * MonthlyPrayerCalendar.client.jsx — v7 (premium full-redesign)
 *
 * ── WHAT CHANGED FROM v6 ─────────────────────────────────────────────────────
 *   ✦ No inner vertical scroll — table flows naturally, page scrolls instead
 *   ✦ Print isolation — @media print hides the whole page except this component
 *   ✦ Theme chooser modal (PrintThemeChooserModal) before every print / download
 *   ✦ Today row NOT shown in print/PDF (per requirements)
 *   ✦ Dark-mode PDF supported (theme passed to /api/pdf-calendar)
 *   ✦ Print CSS forces light OR dark colour tokens via data-print-theme attr
 *   ✦ Better compact typography — rows never need a scrollbar on desktop
 *   ✦ Legend row at bottom (screen only) explains row colour coding
 *   ✦ All bugs from v6 fixed
 *
 * ── PRINT STRATEGY ────────────────────────────────────────────────────────────
 *   Browser print (window.print):
 *     – body * { visibility: hidden } + #mpc-print-root * { visible }
 *     – Isolates ONLY this component on any page layout
 *     – data-print-theme="light|dark" on the root div drives colour overrides
 *     – @page { size: A4 landscape; margin: 10mm 14mm }
 *     – Row height clamped to 18px so 31 rows fit on one sheet
 *   PDF download (/api/pdf-calendar):
 *     – Puppeteer generates pixel-perfect A4 landscape
 *     – theme param controls the colour palette server-side
 *
 * ── LAYOUT (screen) ──────────────────────────────────────────────────────────
 *   .mpc-card  — rounded card, 4px gradient crown, natural height
 *     .mpc-header   — city, month badges, action buttons
 *     .mpc-scroll   — overflow-x: auto (mobile), overflow-y: visible
 *       .mpc-table  — min-width: 640px, compact row padding
 *     .mpc-legend   — screen-only colour key
 *     .mpc-print-footer — print-only branding line
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { calculatePrayerTimes } from '@/lib/prayerEngine';
import {
  Printer, Download, Moon, Sun, Sunrise, Sunset, Star,
  CalendarDays, Loader2,
} from 'lucide-react';
import {
  getDaysInCurrentMonth,
  getHijriParts,
  getHijriMonthSpan,
  formatGregorianLabel,
} from '@/lib/hijri-utils';
import PrintThemeChooserModal from './PrintThemeChooserModal';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PRAYER_META = {
  fajr:    { ar: 'الفجر',  Icon: Moon    },
  sunrise: { ar: 'الشروق', Icon: Sunrise },
  dhuhr:   { ar: 'الظهر',  Icon: Sun     },
  asr:     { ar: 'العصر',  Icon: Sun     },
  maghrib: { ar: 'المغرب', Icon: Sunset  },
  isha:    { ar: 'العشاء', Icon: Star    },
};

// Module-level formatter singleton
let _timeFmtCache = null;
function getTimeFmt(timezone) {
  if (!_timeFmtCache || _timeFmtCache.tz !== timezone) {
    _timeFmtCache = {
      tz: timezone,
      fmt: new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      }),
    };
  }
  return _timeFmtCache.fmt;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MonthlyPrayerCalendar({
  lat, lon, timezone, cityNameAr, countryCode,
}) {
  const [mounted,      setMounted]      = useState(false);
  const [currentDay,   setCurrentDay]   = useState(null);
  const [pdfLoading,   setPdfLoading]   = useState(false);
  const [pdfError,     setPdfError]     = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [modalAction,  setModalAction]  = useState(null); // 'print' | 'download'
  const [printTheme,   setPrintTheme]   = useState(null); // 'light' | 'dark'

  const todayRowRef  = useRef(null);
  const scrollRef    = useRef(null);
  const rootRef      = useRef(null);
  const pdfLoadingRef = useRef(false); // prevent double-click

  // ── Hydration guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setCurrentDay(new Date().getDate());
    }, 80);
    return () => clearTimeout(t);
  }, []);

  // ── Auto-scroll today into view on mount ────────────────────────────────────
  useEffect(() => {
    if (!mounted || !todayRowRef.current || !scrollRef.current) return;
    const scrollEl = scrollRef.current;
    const rowEl    = todayRowRef.current;
    const offset   = rowEl.offsetTop
      - scrollEl.offsetTop
      - scrollEl.clientHeight / 2
      + rowEl.clientHeight / 2;
    scrollEl.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
  }, [mounted]);

  // ── Build schedule ───────────────────────────────────────────────────────────
  const days   = useMemo(() => getDaysInCurrentMonth(), []);

  const gregorianLabel = useMemo(() => {
    if (!mounted) return '';
    return formatGregorianLabel(new Date());
  }, [mounted]);

  const hijriLabel = useMemo(() => {
    if (!mounted) return '';
    return getHijriMonthSpan(days);
  }, [mounted, days]);

  const schedule = useMemo(() => {
    if (!mounted || !lat || !lon) return [];

    const timeFmt   = getTimeFmt(timezone);
    const formatTime = (iso) => {
      if (!iso) return '--:--';
      try { return timeFmt.format(new Date(iso)); } catch { return '--:--'; }
    };

    const dayFmt = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' });

    return days.map((date, i) => {
      const midDay = new Date(date);
      midDay.setHours(12, 0, 0, 0);

      const times = calculatePrayerTimes({
        lat, lon, timezone, date: midDay, countryCode, cacheKey: null,
      });
      if (!times) return null;

      const hijri     = getHijriParts(date);
      const prevHijri = i > 0 ? getHijriParts(days[i - 1]) : null;

      return {
        dayNumber:       date.getDate(),
        dayName:         dayFmt.format(date),
        isFriday:        date.getDay() === 5,
        hijriDay:        hijri.hijriDay,
        hijriYear:       hijri.hijriYear,
        hijriMonthName:  hijri.hijriMonthName,
        isNewHijriMonth: !prevHijri || hijri.hijriMonthNum !== prevHijri.hijriMonthNum,
        fajr:    formatTime(times.fajr),
        sunrise: formatTime(times.sunrise),
        dhuhr:   formatTime(times.dhuhr),
        asr:     formatTime(times.asr),
        maghrib: formatTime(times.maghrib),
        isha:    formatTime(times.isha),
      };
    }).filter(Boolean);
  }, [mounted, lat, lon, timezone, days, countryCode]);

  // ── Action handlers ──────────────────────────────────────────────────────────

  const openModal = useCallback((action) => {
    setModalAction(action);
    setModalOpen(true);
  }, []);

  const handleThemeSelected = useCallback(async (theme) => {
    setPrintTheme(theme);

    if (modalAction === 'print') {
      // Apply theme data attribute, then print
      if (rootRef.current) rootRef.current.dataset.printTheme = theme;
      // Let the DOM update before opening print dialog
      await new Promise((r) => setTimeout(r, 60));
      window.print();
      // Clean up after print dialog closes
      setTimeout(() => {
        if (rootRef.current) delete rootRef.current.dataset.printTheme;
      }, 1500);

    } else if (modalAction === 'download') {
      if (pdfLoadingRef.current || !schedule.length) return;
      pdfLoadingRef.current = true;
      setPdfLoading(true);
      setPdfError('');
      try {
        const res = await fetch('/api/pdf-calendar', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            schedule,
            cityNameAr,
            gregorianLabel,
            hijriLabel,
            countryCode,
            theme, // ← tells server which colour palette to use
          }),
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
        pdfLoadingRef.current = false;
      }
    }
  }, [modalAction, schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode]);

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  if (!mounted || !lat || !lon) {
    return (
      <div
        className="mpc-skeleton"
        aria-busy="true"
        aria-label="جاري تحميل تقويم الصلاة"
      />
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Styles ── */}
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');

        /* ═══════════════════════════════════════════════════════════════════
           SKELETON
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-skeleton {
          width: 100%; height: 520px;
          border-radius: var(--radius-xl);
          background: linear-gradient(90deg,
            var(--bg-surface-2) 25%, var(--bg-surface-3) 50%, var(--bg-surface-2) 75%);
          background-size: 200% 100%;
          animation: mpcShimmer 1.6s ease-in-out infinite;
        }
        @keyframes mpcShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes mpcPulse {
          0%, 100% { opacity: 1;    transform: scale(1);    }
          50%      { opacity: 0.45; transform: scale(0.75); }
        }
        @keyframes mpcSpin { to { transform: rotate(360deg); } }
        .mpc-spin { animation: mpcSpin 0.85s linear infinite; }

        /* ═══════════════════════════════════════════════════════════════════
           CARD
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-card {
          position: relative;
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
          overflow: clip;
        }
        /* 4px gradient crown */
        .mpc-card::before {
          content: '';
          position: absolute;
          top: 0; inset-inline-start: 0; inset-inline-end: 0;
          height: 4px;
          background: var(--accent-gradient);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          z-index: 1;
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════════════════════════════
           HEADER
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-5) var(--space-6) var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
        }
        .mpc-header-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          min-width: 0;
        }

        .mpc-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          line-height: var(--leading-tight);
          margin: 0;
        }
        .mpc-title-city { color: var(--accent-alt); }
        .mpc-title-icon { color: var(--accent-alt); flex-shrink: 0; opacity: 0.85; }

        .mpc-subtitle {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
          line-height: var(--leading-snug);
        }

        .mpc-badges {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
          margin-top: var(--space-1);
        }
        .mpc-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          border-radius: var(--radius-full);
          padding: 3px 10px;
          white-space: nowrap;
          line-height: 1.5;
        }
        .mpc-badge--greg {
          color: var(--accent-alt);
          background: var(--accent-soft);
          border: 1px solid var(--border-accent);
        }
        .mpc-badge--hijri {
          color: var(--text-secondary);
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
        }

        /* ═══════════════════════════════════════════════════════════════════
           ACTION BUTTONS
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
          padding-top: 2px;
        }

        .mpc-btn-print {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          font-family: inherit;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          transition: background-color var(--transition-fast),
                      color var(--transition-fast),
                      border-color var(--transition-fast),
                      transform var(--transition-fast);
          white-space: nowrap;
          user-select: none;
        }
        .mpc-btn-print:hover {
          background: var(--bg-surface-3);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }
        .mpc-btn-print:active { transform: translateY(1px) scale(0.99); }

        .mpc-btn-pdf {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          font-family: inherit;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-on-accent);
          background: var(--accent-gradient);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          transition: opacity var(--transition-fast),
                      transform var(--transition-fast),
                      box-shadow var(--transition-fast);
          white-space: nowrap;
          user-select: none;
          box-shadow: var(--shadow-accent);
        }
        .mpc-btn-pdf:hover:not(:disabled) {
          opacity: 0.88;
          box-shadow: var(--shadow-accent-strong);
          transform: translateY(-1px);
        }
        .mpc-btn-pdf:active:not(:disabled) { transform: translateY(1px) scale(0.99); }
        .mpc-btn-pdf:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ═══════════════════════════════════════════════════════════════════
           ERROR
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-error {
          margin: var(--space-3) var(--space-6);
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          color: var(--danger);
          background: var(--danger-soft);
          border: 1px solid var(--danger-border);
          border-radius: var(--radius-md);
        }

        /* ═══════════════════════════════════════════════════════════════════
           SCROLL / TABLE WRAPPER
           — overflow-x: auto   → mobile horizontal scroll
           — overflow-y: visible → NO inner vertical scroll (full table shows)
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-scroll-outer {
          position: relative;
        }
        /* Left-edge fade hint on mobile */
        .mpc-scroll-outer::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 28px;
          background: linear-gradient(to right, var(--bg-surface-1), transparent);
          pointer-events: none;
          z-index: 2;
          display: none;
        }
        @media (max-width: 800px) {
          .mpc-scroll-outer::after { display: block; }
        }

        .mpc-scroll {
          overflow-x: auto;
          overflow-y: visible;   /* ← KEY: no vertical scroll inside table */
          scrollbar-width: thin;
          scrollbar-color: var(--border-default) transparent;
        }
        .mpc-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .mpc-scroll::-webkit-scrollbar-track { background: transparent; }
        .mpc-scroll::-webkit-scrollbar-thumb {
          background: var(--border-default);
          border-radius: 9999px;
        }
        .mpc-scroll::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }

        /* ═══════════════════════════════════════════════════════════════════
           TABLE
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-table {
          width: 100%;
          min-width: 640px;
          border-collapse: collapse;
          table-layout: fixed;
          direction: rtl;
        }

        /* Column widths */
        .mpc-col-day    { width: 13%; }
        .mpc-col-hijri  { width: 10%; }
        .mpc-col-greg   { width:  5%; }
        .mpc-col-prayer { width: calc(72% / 6); }

        /* ── Thead ── */
        .mpc-thead {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          background-color: var(--bg-surface-4);
        }
        .mpc-thead::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: var(--border-default);
        }

        .mpc-th {
          padding: var(--space-2) var(--space-2);
          text-align: center;
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          white-space: nowrap;
          border: none;
          line-height: var(--leading-snug);
          border-bottom: none;
        }
        .mpc-th:first-child {
          text-align: right;
          padding-inline-end: var(--space-4);
        }

        .mpc-th-prayer { padding: var(--space-1-5) var(--space-2); }
        .mpc-th-prayer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .mpc-th-prayer-icon { color: var(--accent-alt); opacity: 0.75; }
        .mpc-th-prayer-icon--asr { opacity: 0.40; }
        .mpc-th-prayer-label {
          font-size: var(--text-2xs);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        /* ── Tbody ── */
        .mpc-tbody tr:last-child { border-bottom: none; }

        /* Zebra — surface-3 is the right stripe partner of surface-2 */
        .mpc-tbody tr:nth-child(odd)  td { background-color: var(--bg-surface-1); }
        .mpc-tbody tr:nth-child(even) td { background-color: var(--bg-surface-2); }

        .mpc-tbody tr:hover td {
          background-color: var(--bg-surface-3) !important;
        }

        /* ── Today row (screen only — hidden in print) ── */
        .mpc-row-today { border: 1.5px solid var(--accent-alt); }
        .mpc-row-today td { background-color: var(--accent-soft) !important; }
        .mpc-row-today:hover td { background-color: var(--accent-soft-hover) !important; }

        /* ── Friday row ── */
        .mpc-row-friday td { background-color: var(--success-soft) !important; }
        .mpc-row-friday:hover td { background-color: rgba(6,214,160,0.16) !important; }

        /* ── Cells ── */
        .mpc-td {
          padding: var(--space-2) var(--space-2);
          vertical-align: middle;
          font-size: var(--text-sm);
          color: var(--text-primary);
          transition: background-color 120ms ease;
        }

        .mpc-cell-day {
          font-weight: var(--font-semibold);
          font-size: var(--text-sm);
          padding-inline-end: var(--space-4);
          padding-inline-start: var(--space-3);
          text-align: right;
          white-space: nowrap;
        }
        .mpc-cell-day-inner {
          display: flex;
          align-items: center;
          gap: var(--space-1-5);
          justify-content: flex-end;
        }
        .mpc-row-friday .mpc-cell-day { color: var(--success); }

        /* Pulsing dot — today indicator, screen only */
        .mpc-today-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent-alt);
          flex-shrink: 0;
          animation: mpcPulse 2.4s ease-in-out infinite;
          box-shadow: 0 0 0 2px var(--accent-soft);
        }

        .mpc-cell-greg {
          text-align: center;
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-muted);
          direction: ltr;
        }
        .mpc-row-today .mpc-cell-greg  { color: var(--accent-alt); }
        .mpc-row-friday .mpc-cell-greg { color: var(--success); }

        .mpc-cell-hijri {
          text-align: center;
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: 1.3;
        }
        .mpc-hijri-day {
          display: inline-block;
          font-weight: var(--font-semibold);
          font-size: var(--text-sm);
          color: var(--text-primary);
        }
        .mpc-row-today  .mpc-hijri-day { color: var(--accent-alt); }
        .mpc-row-friday .mpc-hijri-day { color: var(--success); }

        .mpc-hijri-pill {
          display: inline-flex;
          align-items: center;
          margin-inline-start: 3px;
          font-size: var(--text-2xs);
          font-weight: var(--font-semibold);
          color: var(--accent-alt);
          background: var(--accent-soft);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-full);
          padding: 1px 5px;
          white-space: nowrap;
          vertical-align: middle;
          line-height: 1.5;
        }
        .mpc-row-friday .mpc-hijri-pill {
          color: var(--success);
          background: var(--success-soft);
          border-color: var(--success-border);
        }

        .mpc-cell-time {
          text-align: center;
          direction: ltr;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--accent-alt);
          letter-spacing: 0.02em;
        }
        .mpc-row-friday .mpc-cell-time { color: var(--success); }

        /* ═══════════════════════════════════════════════════════════════════
           LEGEND (screen only)
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-legend {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--space-4);
          padding: var(--space-3) var(--space-6) var(--space-4);
          border-top: 1px solid var(--border-subtle);
          direction: rtl;
        }
        .mpc-legend-item {
          display: flex;
          align-items: center;
          gap: var(--space-1-5);
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        .mpc-legend-dot {
          width: 10px; height: 10px;
          border-radius: var(--radius-xs);
          flex-shrink: 0;
        }
        .mpc-legend-dot--today   { background: var(--accent-soft);  border: 1.5px solid var(--accent-alt); }
        .mpc-legend-dot--friday  { background: var(--success-soft); border: 1.5px solid var(--success); }

        /* ═══════════════════════════════════════════════════════════════════
           PRINT FOOTER (hidden on screen, shown in print)
        ═══════════════════════════════════════════════════════════════════ */
        .mpc-print-footer {
          display: none;
          padding: var(--space-3) var(--space-6);
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-align: center;
          border-top: 1px solid var(--border-subtle);
        }

        /* ═══════════════════════════════════════════════════════════════════
           PRINT MEDIA
           Strategy: hide body, show only #mpc-print-root.
           data-print-theme="light|dark" overrides CSS variables.
        ═══════════════════════════════════════════════════════════════════ */
        @media print {
          /* 1. Hide the entire page */
          body * { visibility: hidden !important; }

          /* 2. Show only our component */
          #mpc-print-root,
          #mpc-print-root * { visibility: visible !important; }

          /* 3. Position our component as the whole page */
          #mpc-print-root {
            position: fixed !important;
            inset: 0 !important;
            z-index: 99999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 4. Page size */
          @page { size: A4 landscape; margin: 10mm 14mm; }

          /* 5. Card becomes the page canvas */
          .mpc-card {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .mpc-card::before { display: none !important; }

          /* 6. Table layout adjustments for A4 */
          .mpc-scroll { overflow: visible !important; }
          .mpc-scroll-outer::after { display: none !important; }
          .mpc-thead { position: static !important; }
          .mpc-thead::after { display: none !important; }

          /* 7. Compact rows so all 31 fit on one sheet */
          .mpc-tbody tr { height: 18px !important; max-height: 18px !important; }
          .mpc-td        { padding: 0 4px !important; font-size: 7pt !important; }
          .mpc-cell-time { font-size: 7pt !important; }
          .mpc-cell-greg { font-size: 6.5pt !important; }
          .mpc-cell-hijri{ font-size: 6.5pt !important; }
          .mpc-cell-day  { padding-inline-end: 8pt !important; font-size: 7pt !important; }
          .mpc-th        { padding: 2px !important; font-size: 6.5pt !important; }
          .mpc-th-prayer-label { font-size: 6pt !important; }
          .mpc-header { padding: 6pt 10pt 5pt !important; }
          .mpc-title  { font-size: 11pt !important; }
          .mpc-subtitle { display: none !important; }

          /* 8. Hide interactive elements */
          .mpc-actions        { display: none !important; }
          .mpc-error          { display: none !important; }
          .mpc-legend         { display: none !important; }
          .mpc-today-dot      { display: none !important; }

          /* 9. Show print footer */
          .mpc-print-footer { display: block !important; font-size: 6.5pt !important; padding: 4pt 0 0 !important; }

          /* 10. Remove today highlighting (today is irrelevant on a printed sheet) */
          .mpc-row-today td {
            background-color: inherit !important;
            border-right: none !important;
          }
          .mpc-row-today .mpc-cell-day  { color: var(--text-primary) !important; }
          .mpc-row-today .mpc-cell-greg { color: var(--text-muted) !important; }
          .mpc-row-today .mpc-hijri-day { color: var(--text-primary) !important; }
          .mpc-row-today .mpc-cell-time { color: var(--accent-alt) !important; }

          /* 11. Keep Friday colouring — it's always meaningful */
          .mpc-row-friday td:first-child { box-shadow: inset -3px 0 0 currentColor !important; }

          /* ─── LIGHT THEME OVERRIDES ────────────────────────────────────── */
          #mpc-print-root[data-print-theme="light"] {
            --bg-surface-1: #FFFFFF;
            --bg-surface-2: #F4F7FC;
            --bg-surface-3: #EAEEF8;
            --bg-surface-4: #1E3A8A;
            --text-primary: #0E1220;
            --text-secondary: #3D4668;
            --text-muted: #536080;
            --accent-alt: #1D4ED8;
            --border-subtle: #DDE3EF;
            --border-default: #C8D4E8;
            --border-accent: rgba(29,78,216,0.22);
            --accent-soft: rgba(29,78,216,0.06);
            --accent-soft-hover: rgba(29,78,216,0.12);
            --success: #046645;
            --success-soft: rgba(4,102,69,0.07);
            --success-border: rgba(4,102,69,0.25);
            background-color: #FFFFFF !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-card {
            background-color: #FFFFFF !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-tbody tr:nth-child(odd) td {
            background-color: #FFFFFF !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-tbody tr:nth-child(even) td {
            background-color: #F4F7FC !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-thead {
            background-color: #1E3A8A !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-th {
            color: #FFFFFF !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-th-prayer-icon {
            color: #BFDBFE !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-th-prayer-label {
            color: #FFFFFF !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-cell-time {
            color: #1D4ED8 !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-cell-day {
            color: #0E1220 !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-tbody tr {
            border-bottom-color: #DDE3EF !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-hijri-day {
            color: #0E1220 !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-cell-greg {
            color: #536080 !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-row-friday td {
            background-color: rgba(4,102,69,0.06) !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-row-friday .mpc-cell-day { color: #046645 !important; }
          #mpc-print-root[data-print-theme="light"] .mpc-row-friday .mpc-cell-time { color: #046645 !important; }
          #mpc-print-root[data-print-theme="light"] .mpc-row-friday .mpc-hijri-day { color: #046645 !important; }
          #mpc-print-root[data-print-theme="light"] .mpc-hijri-pill {
            color: #1D4ED8 !important;
            background: rgba(29,78,216,0.06) !important;
            border-color: rgba(29,78,216,0.22) !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-row-friday .mpc-hijri-pill {
            color: #046645 !important;
            background: rgba(4,102,69,0.06) !important;
            border-color: rgba(4,102,69,0.25) !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-header {
            border-bottom-color: #C8D4E8 !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-title {
            color: #0E1220 !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-title-city { color: #1D4ED8 !important; }
          #mpc-print-root[data-print-theme="light"] .mpc-badge--greg {
            color: #1D4ED8 !important;
            background: rgba(29,78,216,0.06) !important;
            border-color: rgba(29,78,216,0.22) !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-badge--hijri {
            color: #3D4668 !important;
            background: #F4F7FC !important;
            border-color: #DDE3EF !important;
          }
          #mpc-print-root[data-print-theme="light"] .mpc-print-footer {
            color: #536080 !important;
            border-top-color: #DDE3EF !important;
          }

          /* ─── DARK THEME OVERRIDES ─────────────────────────────────────── */
          #mpc-print-root[data-print-theme="dark"] {
            --bg-surface-1: #161D2E;
            --bg-surface-2: #1E2640;
            --bg-surface-3: #252F50;
            --bg-surface-4: #0D1117;
            --text-primary: #F0F4FF;
            --text-secondary: #A8B2CB;
            --text-muted: #90AACC;
            --accent-alt: #8CAEFF;
            --border-subtle: #1A2035;
            --border-default: #222C45;
            --border-accent: rgba(59,130,246,0.25);
            --accent-soft: rgba(59,130,246,0.14);
            --accent-soft-hover: rgba(59,130,246,0.22);
            --success: #06D6A0;
            --success-soft: rgba(6,214,160,0.12);
            --success-border: rgba(6,214,160,0.30);
            background-color: #0D1117 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-card {
            background-color: #161D2E !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-tbody tr:nth-child(odd) td {
            background-color: #161D2E !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-tbody tr:nth-child(even) td {
            background-color: #1E2640 !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-thead {
            background-color: #0D1117 !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-th {
            color: #F0F4FF !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-th-prayer-icon {
            color: #8CAEFF !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-th-prayer-label {
            color: #F0F4FF !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-cell-time {
            color: #8CAEFF !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-cell-day {
            color: #F0F4FF !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-tbody tr {
            border-bottom-color: #222C45 !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-hijri-day {
            color: #F0F4FF !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-cell-greg {
            color: #A8B2CB !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-row-friday td {
            background-color: rgba(6,214,160,0.1) !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-row-friday .mpc-cell-day { color: #06D6A0 !important; }
          #mpc-print-root[data-print-theme="dark"] .mpc-row-friday .mpc-cell-time { color: #06D6A0 !important; }
          #mpc-print-root[data-print-theme="dark"] .mpc-row-friday .mpc-hijri-day { color: #06D6A0 !important; }
          #mpc-print-root[data-print-theme="dark"] .mpc-hijri-pill {
            color: #8CAEFF !important;
            background: rgba(59,130,246,0.14) !important;
            border-color: rgba(59,130,246,0.25) !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-row-friday .mpc-hijri-pill {
            color: #06D6A0 !important;
            background: rgba(6,214,160,0.12) !important;
            border-color: rgba(6,214,160,0.30) !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-header {
            border-bottom-color: #222C45 !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-title { color: #F0F4FF !important; }
          #mpc-print-root[data-print-theme="dark"] .mpc-title-city { color: #8CAEFF !important; }
          #mpc-print-root[data-print-theme="dark"] .mpc-badge--greg {
            color: #8CAEFF !important;
            background: rgba(59,130,246,0.14) !important;
            border-color: rgba(59,130,246,0.25) !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-badge--hijri {
            color: #A8B2CB !important;
            background: #1E2640 !important;
            border-color: #222C45 !important;
          }
          #mpc-print-root[data-print-theme="dark"] .mpc-print-footer {
            color: #90AACC !important;
            border-top-color: #222C45 !important;
          }
        }

        /* ═══════════════════════════════════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════════════════════════════════ */
        @media (max-width: 600px) {
          .mpc-header { padding: var(--space-4) var(--space-4) var(--space-3); }
          .mpc-actions { gap: var(--space-1-5); }
          .mpc-btn-print, .mpc-btn-pdf { padding: var(--space-1-5) var(--space-3); font-size: var(--text-xs); }
          .mpc-title { font-size: var(--text-base); }
        }
      `}</style>

      {/* ── Root — receives data-print-theme for scoped print CSS ── */}
      <div id="mpc-print-root" ref={rootRef}>
        <div className="mpc-card">

          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="mpc-header">
            <div className="mpc-header-info">
              <h2 className="mpc-title">
                <CalendarDays size={18} className="mpc-title-icon" aria-hidden="true" />
                تقويم مواقيت الصلاة —{' '}
                <span className="mpc-title-city">{cityNameAr}</span>
              </h2>

              <p className="mpc-subtitle">
                جدول أوقات الصلاة الشهري · الفجر · الشروق · الظهر · العصر · المغرب · العشاء
              </p>

              <div className="mpc-badges">
                <span
                  className="mpc-badge mpc-badge--greg"
                  aria-label={`الشهر الميلادي: ${gregorianLabel}`}
                >
                  <CalendarDays size={10} aria-hidden="true" />
                  {gregorianLabel}
                </span>
                {hijriLabel && (
                  <span
                    className="mpc-badge mpc-badge--hijri"
                    aria-label={`التقويم الهجري: ${hijriLabel}`}
                  >
                    <Moon size={10} aria-hidden="true" />
                    {hijriLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="mpc-actions">
              <button
                className="mpc-btn-print"
                onClick={() => openModal('print')}
                aria-label="طباعة تقويم مواقيت الصلاة"
              >
                <Printer size={13} aria-hidden="true" />
                طباعة
              </button>

              <button
                className="mpc-btn-pdf"
                onClick={() => openModal('download')}
                disabled={pdfLoading || !schedule.length}
                aria-busy={pdfLoading}
                aria-label="تحميل تقويم مواقيت الصلاة كملف PDF"
              >
                {pdfLoading ? (
                  <><Loader2 size={13} className="mpc-spin" aria-hidden="true" /> جاري الإنشاء…</>
                ) : (
                  <><Download size={13} aria-hidden="true" /> تحميل PDF</>
                )}
              </button>
            </div>
          </div>

          {/* ── Error ───────────────────────────────────────────────── */}
          {pdfError && (
            <p className="mpc-error" role="alert" aria-live="assertive">
              {pdfError}
            </p>
          )}

          {/* ── Table ───────────────────────────────────────────────── */}
          <div className="mpc-scroll-outer">
            <div
              ref={scrollRef}
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
                  {PRAYER_KEYS.map((k) => (
                    <col key={k} className="mpc-col-prayer" />
                  ))}
                </colgroup>

                <thead className="mpc-thead">
                  <tr>
                    <th className="mpc-th" scope="col">اليوم</th>
                    <th className="mpc-th" scope="col">الهجري</th>
                    <th className="mpc-th" scope="col">الميلادي</th>
                    {PRAYER_KEYS.map((k) => {
                      const { ar, Icon } = PRAYER_META[k];
                      return (
                        <th
                          key={k}
                          className="mpc-th mpc-th-prayer"
                          scope="col"
                          aria-label={ar}
                        >
                          <div className="mpc-th-prayer-inner">
                            <Icon
                              size={12}
                              className={`mpc-th-prayer-icon${k === 'asr' ? ' mpc-th-prayer-icon--asr' : ''}`}
                              aria-hidden="true"
                            />
                            <span className="mpc-th-prayer-label">{ar}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="mpc-tbody">
                  {schedule.map((row) => {
                    const isToday  = row.dayNumber === currentDay;
                    const rowClass = isToday
                      ? 'mpc-row-today'
                      : row.isFriday ? 'mpc-row-friday' : '';

                    return (
                      <tr
                        key={row.dayNumber}
                        ref={isToday ? todayRowRef : undefined}
                        className={rowClass}
                        aria-current={isToday ? 'date' : undefined}
                        data-day={row.dayNumber}
                      >
                        {/* اليوم */}
                        <td className="mpc-td mpc-cell-day">
                          <div className="mpc-cell-day-inner">
                            {isToday && (
                              <span className="mpc-today-dot" aria-label="اليوم" />
                            )}
                            {row.dayName}
                          </div>
                        </td>

                        {/* الهجري */}
                        <td className="mpc-td mpc-cell-hijri">
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

                        {/* الميلادي */}
                        <td className="mpc-td mpc-cell-greg" dir="ltr">
                          {row.dayNumber}
                        </td>

                        {/* Prayer times */}
                        {PRAYER_KEYS.map((k) => (
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
          </div>

          {/* ── Screen-only legend ──────────────────────────────────── */}
          <div className="mpc-legend" aria-hidden="true">
            <div className="mpc-legend-item">
              <div className="mpc-legend-dot mpc-legend-dot--today" />
              <span>اليوم الحالي</span>
            </div>
            <div className="mpc-legend-item">
              <div className="mpc-legend-dot mpc-legend-dot--friday" />
              <span>يوم الجمعة</span>
            </div>
          </div>

          {/* ── Print-only footer ───────────────────────────────────── */}
          <div className="mpc-print-footer" aria-hidden="true">
            تقويم مواقيت الصلاة الشهري — {cityNameAr} — {gregorianLabel} — waqt.app
          </div>

        </div>
      </div>

      {/* ── Theme chooser modal ─────────────────────────────────────── */}
      <PrintThemeChooserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleThemeSelected}
        actionType={modalAction}
      />
    </>
  );
}