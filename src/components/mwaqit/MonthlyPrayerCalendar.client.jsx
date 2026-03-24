'use client';

/**
 * MonthlyPrayerCalendar.client.jsx — v9
 *
 * ── CHANGES FROM v8 ──────────────────────────────────────────────────────────
 *   ✦ Print button and window.print() method completely removed
 *   ✦ Only PDF download remains — modal actionType is always 'download'
 *   ✦ Printer icon import removed
 *   ✦ @media print block retained as a safety net (browser menu print)
 *     but no UI button triggers it anymore
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { calculatePrayerTimes } from '@/lib/prayerEngine';
import {
  Download, Moon, Sun, Sunrise, Sunset, Star,
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

let _timeFmtCache = null;
function getTimeFmt(timezone) {
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
  const [modalOpen,  setModalOpen]  = useState(false);

  const todayRowRef   = useRef(null);
  const scrollRef     = useRef(null);
  const rootRef       = useRef(null);
  const pdfLoadingRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => { setMounted(true); setCurrentDay(new Date().getDate()); }, 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted || !todayRowRef.current || !scrollRef.current) return;
    const s = scrollRef.current, r = todayRowRef.current;
    s.scrollTo({ top: Math.max(0, r.offsetTop - s.offsetTop - s.clientHeight / 2 + r.clientHeight / 2), behavior: 'smooth' });
  }, [mounted]);

  const days           = useMemo(() => getDaysInCurrentMonth(), []);
  const gregorianLabel = useMemo(() => mounted ? formatGregorianLabel(new Date()) : '', [mounted]);
  const hijriLabel     = useMemo(() => mounted ? getHijriMonthSpan(days) : '', [mounted, days]);

  const schedule = useMemo(() => {
    if (!mounted || !lat || !lon) return [];
    const timeFmt    = getTimeFmt(timezone);
    const formatTime = (iso) => { if (!iso) return '--:--'; try { return timeFmt.format(new Date(iso)); } catch { return '--:--'; } };
    const dayFmt     = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' });
    return days.map((date, i) => {
      const midDay = new Date(date); midDay.setHours(12, 0, 0, 0);
      const times  = calculatePrayerTimes({ lat, lon, timezone, date: midDay, countryCode, cacheKey: null });
      if (!times) return null;
      const hijri = getHijriParts(date), prevHijri = i > 0 ? getHijriParts(days[i - 1]) : null;
      return {
        dayNumber: date.getDate(), dayName: dayFmt.format(date),
        isFriday: date.getDay() === 5,
        hijriDay: hijri.hijriDay, hijriYear: hijri.hijriYear,
        hijriMonthName: hijri.hijriMonthName,
        isNewHijriMonth: !prevHijri || hijri.hijriMonthNum !== prevHijri.hijriMonthNum,
        fajr: formatTime(times.fajr), sunrise: formatTime(times.sunrise),
        dhuhr: formatTime(times.dhuhr), asr: formatTime(times.asr),
        maghrib: formatTime(times.maghrib), isha: formatTime(times.isha),
      };
    }).filter(Boolean);
  }, [mounted, lat, lon, timezone, days, countryCode]);

  // ── Download handler — opens theme modal ────────────────────────────────────
  const openDownloadModal = useCallback(() => setModalOpen(true), []);

  const handleThemeSelected = useCallback(async (theme) => {
    if (pdfLoadingRef.current || !schedule.length) return;
    pdfLoadingRef.current = true;
    setPdfLoading(true);
    setPdfError('');
    try {
      const res = await fetch('/api/pdf-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode, theme }),
      });
      if (!res.ok) throw new Error('فشل إنشاء الملف');
      const blob = await res.blob(), url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `taqwim-salat-${cityNameAr}-${gregorianLabel}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) {
      setPdfError(e.message || 'حدث خطأ أثناء إنشاء الملف');
    } finally {
      setPdfLoading(false);
      pdfLoadingRef.current = false;
    }
  }, [schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode]);

  if (!mounted || !lat || !lon) {
    return <div className="mpc-skeleton" aria-busy="true" aria-label="جاري تحميل تقويم الصلاة" />;
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');

        /* ── Skeleton ── */
        .mpc-skeleton {
          width:100%;height:520px;border-radius:var(--radius-xl);
          background:linear-gradient(90deg,var(--bg-surface-2) 25%,var(--bg-surface-3) 50%,var(--bg-surface-2) 75%);
          background-size:200% 100%;animation:mpcShimmer 1.6s ease-in-out infinite;
        }
        @keyframes mpcShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes mpcPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
        @keyframes mpcSpin{to{transform:rotate(360deg)}}
        .mpc-spin{animation:mpcSpin .85s linear infinite}

        /* ── Card ── */
        .mpc-card{
          position:relative;background-color:var(--bg-surface-1);
          border:1px solid var(--border-default);border-radius:var(--radius-xl);
          box-shadow:var(--shadow-card);overflow:clip;
        }

        /* ── Header ── */
        .mpc-header{
          display:flex;align-items:flex-start;justify-content:space-between;
          gap:var(--space-4);padding:var(--space-5) var(--space-6) var(--space-4);
          border-bottom:1px solid var(--border-subtle);flex-wrap:wrap;
        }
        .mpc-header-info{display:flex;flex-direction:column;gap:var(--space-2);min-width:0;}
        .mpc-title{
          display:flex;align-items:center;gap:var(--space-2);
          font-size:var(--text-lg);font-weight:var(--font-bold);
          color:var(--text-primary);line-height:var(--leading-tight);margin:0;
        }
        .mpc-title-city{color:var(--accent-alt);}
        .mpc-title-icon{color:var(--accent-alt);flex-shrink:0;opacity:.85;}
        .mpc-subtitle{font-size:var(--text-xs);color:var(--text-muted);margin:0;line-height:var(--leading-snug);}
        .mpc-badges{display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;margin-top:var(--space-1);}
        .mpc-badge{
          display:inline-flex;align-items:center;gap:var(--space-1);
          font-size:var(--text-xs);font-weight:var(--font-semibold);
          border-radius:var(--radius-full);padding:3px 10px;white-space:nowrap;line-height:1.5;
        }
        .mpc-badge--greg{color:var(--accent-alt);background:var(--accent-soft);border:1px solid var(--border-accent);}
        .mpc-badge--hijri{color:var(--text-secondary);background:var(--bg-surface-2);border:1px solid var(--border-subtle);}

        /* ── Download button (single action) ── */
        .mpc-actions{display:flex;align-items:center;flex-shrink:0;padding-top:2px;}
        .mpc-btn-pdf{
          display:inline-flex;align-items:center;gap:var(--space-1-5);
          font-family:inherit;font-size:var(--text-sm);font-weight:var(--font-semibold);
          color:var(--text-on-accent);background:var(--accent-gradient);
          border:1px solid transparent;border-radius:var(--radius-md);
          padding:var(--space-2) var(--space-5);cursor:pointer;
          transition:opacity 150ms ease,transform 100ms ease,box-shadow 150ms ease;
          white-space:nowrap;user-select:none;box-shadow:var(--shadow-accent);
        }
        .mpc-btn-pdf:hover:not(:disabled){opacity:.88;box-shadow:var(--shadow-accent-strong);transform:translateY(-1px);}
        .mpc-btn-pdf:active:not(:disabled){transform:translateY(1px) scale(.99);}
        .mpc-btn-pdf:disabled{opacity:.5;cursor:not-allowed;}

        /* ── Error ── */
        .mpc-error{
          margin:var(--space-3) var(--space-6);padding:var(--space-3) var(--space-4);
          font-size:var(--text-sm);color:var(--danger);
          background:var(--danger-soft);border:1px solid var(--danger-border);border-radius:var(--radius-md);
        }

        /* ── Scroll container ── */
        .mpc-scroll-outer{position:relative;}
        .mpc-scroll-outer::after{
          content:'';position:absolute;top:0;left:0;bottom:0;width:28px;
          background:linear-gradient(to right,var(--bg-surface-1),transparent);
          pointer-events:none;z-index:2;display:none;
        }
        @media(max-width:800px){.mpc-scroll-outer::after{display:block;}}
        .mpc-scroll{
          overflow-x:auto;overflow-y:visible;
          scrollbar-width:thin;scrollbar-color:var(--border-default) transparent;
        }
        .mpc-scroll::-webkit-scrollbar{width:4px;height:4px;}
        .mpc-scroll::-webkit-scrollbar-track{background:transparent;}
        .mpc-scroll::-webkit-scrollbar-thumb{background:var(--border-default);border-radius:9999px;}

        /* ── Table ── */
        .mpc-table{width:100%;min-width:640px;border-collapse:collapse;table-layout:fixed;direction:rtl;}
        .mpc-col-day   {width:14%;}
        .mpc-col-hijri {width:11%;}
        .mpc-col-greg  {width:8%;}
        .mpc-col-prayer{width:calc(67% / 6);}

        /* ── Thead ── */
        .mpc-thead{position:sticky;top:0;z-index:var(--z-sticky);background-color:var(--bg-surface-3);}
        .mpc-thead::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--border-default);}
        .mpc-th{
          padding:var(--space-2) var(--space-2);text-align:center;
          font-size:var(--text-xs);font-weight:var(--font-semibold);
          color:var(--text-secondary);white-space:nowrap;border:none;line-height:var(--leading-snug);
        }
        .mpc-th:first-child{text-align:right;padding-inline-end:var(--space-4);}
        .mpc-th-prayer{padding:var(--space-1-5) var(--space-2);}
        .mpc-th-prayer-inner{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .mpc-th-prayer-icon{color:var(--accent-alt);opacity:.75;}
        .mpc-th-prayer-icon--asr{opacity:.40;}
        .mpc-th-prayer-label{font-size:var(--text-2xs);font-weight:var(--font-semibold);color:var(--text-primary);}

        /* ── Tbody — no stripes ── */
        .mpc-tbody tr{border-bottom:1px solid var(--border-subtle);transition:background-color 120ms ease;}
        .mpc-tbody tr:last-child{border-bottom:none;}
        .mpc-tbody tr td{background-color:var(--bg-surface-1);}
        .mpc-tbody tr:hover td{background-color:var(--bg-surface-2) !important;}

        /* ── Today row — full 1px border via inset box-shadow ── */
        .mpc-row-today td{
          background-color:var(--accent-soft) !important;
          box-shadow:inset 0px 1px 0px var(--accent-alt),inset 0px -1px 0px var(--accent-alt);
        }
        .mpc-row-today td:first-child{
          box-shadow:inset 0px 1px 0px var(--accent-alt),inset 0px -1px 0px var(--accent-alt),inset -1px 0px 0px var(--accent-alt);
        }
        .mpc-row-today td:last-child{
          box-shadow:inset 0px 1px 0px var(--accent-alt),inset 0px -1px 0px var(--accent-alt),inset 1px 0px 0px var(--accent-alt);
        }
        .mpc-row-today:hover td{background-color:var(--accent-soft-hover) !important;}

        /* ── Friday row — full 1px border via inset box-shadow ── */
        .mpc-row-friday td{
          background-color:var(--success-soft) !important;
          box-shadow:inset 0px 1px 0px var(--success),inset 0px -1px 0px var(--success);
        }
        .mpc-row-friday td:first-child{
          box-shadow:inset 0px 1px 0px var(--success),inset 0px -1px 0px var(--success),inset -1px 0px 0px var(--success);
        }
        .mpc-row-friday td:last-child{
          box-shadow:inset 0px 1px 0px var(--success),inset 0px -1px 0px var(--success),inset 1px 0px 0px var(--success);
        }
        .mpc-row-friday:hover td{background-color:rgba(6,214,160,.14) !important;}

        /* ── Cells ── */
        .mpc-td{padding:var(--space-2) var(--space-2);vertical-align:middle;font-size:var(--text-sm);color:var(--text-primary);transition:background-color 120ms ease;}
        .mpc-cell-day{font-weight:var(--font-semibold);font-size:var(--text-sm);padding-inline-end:var(--space-4);padding-inline-start:var(--space-3);text-align:right;white-space:nowrap;}
        .mpc-cell-day-inner{display:flex;align-items:center;gap:var(--space-1-5);justify-content:flex-end;}
        .mpc-row-friday .mpc-cell-day{color:var(--success);}
        .mpc-today-dot{
          display:inline-block;width:6px;height:6px;border-radius:50%;
          background:var(--accent-alt);flex-shrink:0;
          animation:mpcPulse 2.4s ease-in-out infinite;box-shadow:0 0 0 2px var(--accent-soft);
        }
        .mpc-cell-greg{text-align:center;font-size:var(--text-xs);font-weight:var(--font-semibold);color:var(--text-muted);direction:ltr;}
        .mpc-row-today .mpc-cell-greg{color:var(--accent-alt);}
        .mpc-row-friday .mpc-cell-greg{color:var(--success);}
        .mpc-cell-hijri{text-align:center;font-size:var(--text-xs);color:var(--text-secondary);line-height:1.3;}
        .mpc-hijri-day{display:inline-block;font-weight:var(--font-semibold);font-size:var(--text-sm);color:var(--text-primary);}
        .mpc-row-today .mpc-hijri-day{color:var(--accent-alt);}
        .mpc-row-friday .mpc-hijri-day{color:var(--success);}
        .mpc-hijri-pill{
          display:inline-flex;align-items:center;margin-inline-start:3px;
          font-size:var(--text-2xs);font-weight:var(--font-semibold);
          color:var(--accent-alt);background:var(--accent-soft);
          border:1px solid var(--border-accent);border-radius:var(--radius-full);
          padding:1px 5px;white-space:nowrap;vertical-align:middle;line-height:1.5;
        }
        .mpc-row-friday .mpc-hijri-pill{color:var(--success);background:var(--success-soft);border-color:var(--success-border);}
        .mpc-cell-time{
          text-align:center;direction:ltr;
          font-family:'IBM Plex Mono','Courier New',monospace;
          font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1;
          font-size:var(--text-sm);font-weight:var(--font-medium);
          color:var(--accent-alt);letter-spacing:.02em;
        }
        .mpc-row-friday .mpc-cell-time{color:var(--success);}

        /* ── Legend ── */
        .mpc-legend{
          display:flex;align-items:center;justify-content:flex-end;
          gap:var(--space-5);padding:var(--space-3) var(--space-6) var(--space-4);
          border-top:1px solid var(--border-subtle);direction:rtl;
        }
        .mpc-legend-item{display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);color:var(--text-muted);}
        .mpc-legend-swatch{width:24px;height:10px;border-radius:var(--radius-xs);flex-shrink:0;}
        .mpc-legend-swatch--today{
          background:var(--accent-soft);
          box-shadow:inset 0 1px 0 var(--accent-alt),inset 0 -1px 0 var(--accent-alt),inset -1px 0 0 var(--accent-alt),inset 1px 0 0 var(--accent-alt);
        }
        .mpc-legend-swatch--friday{
          background:var(--success-soft);
          box-shadow:inset 0 1px 0 var(--success),inset 0 -1px 0 var(--success),inset -1px 0 0 var(--success),inset 1px 0 0 var(--success);
        }

        /* ── Responsive ── */
        @media(max-width:600px){
          .mpc-header{padding:var(--space-4) var(--space-4) var(--space-3);}
          .mpc-btn-pdf{padding:var(--space-1-5) var(--space-3);font-size:var(--text-xs);}
          .mpc-title{font-size:var(--text-base);}
          .mpc-legend{padding:var(--space-3) var(--space-4);}
        }
      `}</style>

      <div id="mpc-print-root" ref={rootRef}>
        <div className="mpc-card">

          {/* ── Header ── */}
          <div className="mpc-header">
            <div className="mpc-header-info">
              <h2 className="mpc-title">
                {/*
                 * LOGO PLACEHOLDER ─────────────────────────────────────────
                 * Replace CalendarDays with your brand logo:
                 *   <Image src="/logo-miqatime.svg" alt="MiqaTime"
                 *          width={22} height={22} className="mpc-title-icon" />
                 * ────────────────────────────────────────────────────────── */}
                <CalendarDays size={18} className="mpc-title-icon" aria-hidden="true" />
                تقويم مواقيت الصلاة —{' '}
                <span className="mpc-title-city">{cityNameAr}</span>
              </h2>

              <p className="mpc-subtitle">
                جدول أوقات الصلاة الشهري · الفجر · الشروق · الظهر · العصر · المغرب · العشاء
              </p>

              <div className="mpc-badges">
                <span className="mpc-badge mpc-badge--greg" aria-label={`الشهر الميلادي: ${gregorianLabel}`}>
                  <CalendarDays size={10} aria-hidden="true" />
                  {gregorianLabel}
                </span>
                {hijriLabel && (
                  <span className="mpc-badge mpc-badge--hijri" aria-label={`التقويم الهجري: ${hijriLabel}`}>
                    <Moon size={10} aria-hidden="true" />
                    {hijriLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Single download action */}
            <div className="mpc-actions">
              <button
                className="mpc-btn-pdf"
                onClick={openDownloadModal}
                disabled={pdfLoading || !schedule.length}
                aria-busy={pdfLoading}
                aria-label="تحميل تقويم مواقيت الصلاة كملف PDF"
              >
                {pdfLoading
                  ? <><Loader2 size={13} className="mpc-spin" aria-hidden="true" /> جاري الإنشاء…</>
                  : <><Download size={13} aria-hidden="true" /> تحميل PDF</>}
              </button>
            </div>
          </div>

          {pdfError && <p className="mpc-error" role="alert" aria-live="assertive">{pdfError}</p>}

          {/* ── Table ── */}
          <div className="mpc-scroll-outer">
            <div ref={scrollRef} className="mpc-scroll" role="region" aria-label="جدول مواقيت الصلاة الشهري" tabIndex={0}>
              <table className="mpc-table" dir="rtl" aria-label={`تقويم مواقيت الصلاة ${gregorianLabel} — ${cityNameAr}`}>
                <colgroup>
                  <col className="mpc-col-day" />
                  <col className="mpc-col-hijri" />
                  <col className="mpc-col-greg" />
                  {PRAYER_KEYS.map((k) => <col key={k} className="mpc-col-prayer" />)}
                </colgroup>

                <thead className="mpc-thead">
                  <tr>
                    <th className="mpc-th" scope="col">اليوم</th>
                    <th className="mpc-th" scope="col">الهجري</th>
                    <th className="mpc-th" scope="col">الميلادي</th>
                    {PRAYER_KEYS.map((k) => {
                      const { ar, Icon } = PRAYER_META[k];
                      return (
                        <th key={k} className="mpc-th mpc-th-prayer" scope="col" aria-label={ar}>
                          <div className="mpc-th-prayer-inner">
                            <Icon size={12} className={`mpc-th-prayer-icon${k === 'asr' ? ' mpc-th-prayer-icon--asr' : ''}`} aria-hidden="true" />
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
                    const rowClass = isToday ? 'mpc-row-today' : row.isFriday ? 'mpc-row-friday' : '';
                    return (
                      <tr key={row.dayNumber} ref={isToday ? todayRowRef : undefined}
                          className={rowClass} aria-current={isToday ? 'date' : undefined} data-day={row.dayNumber}>
                        <td className="mpc-td mpc-cell-day">
                          <div className="mpc-cell-day-inner">
                            {isToday && <span className="mpc-today-dot" aria-label="اليوم" />}
                            {row.dayName}
                          </div>
                        </td>
                        <td className="mpc-td mpc-cell-hijri">
                          <span className="mpc-hijri-day">{row.hijriDay}</span>
                          {row.isNewHijriMonth && (
                            <span className="mpc-hijri-pill" aria-label={`بداية شهر ${row.hijriMonthName}`}>
                              {row.hijriMonthName}
                            </span>
                          )}
                        </td>
                        <td className="mpc-td mpc-cell-greg" dir="ltr">{row.dayNumber}</td>
                        {PRAYER_KEYS.map((k) => (
                          <td key={k} className="mpc-td mpc-cell-time" dir="ltr">{row[k]}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Legend ── */}
          <div className="mpc-legend" aria-hidden="true">
            <div className="mpc-legend-item">
              <div className="mpc-legend-swatch mpc-legend-swatch--today" />
              <span>اليوم الحالي</span>
            </div>
            <div className="mpc-legend-item">
              <div className="mpc-legend-swatch mpc-legend-swatch--friday" />
              <span>يوم الجمعة</span>
            </div>
          </div>

        </div>
      </div>

      {/* Theme chooser modal — always download */}
      <PrintThemeChooserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleThemeSelected}
        actionType="download"
      />
    </>
  );
}