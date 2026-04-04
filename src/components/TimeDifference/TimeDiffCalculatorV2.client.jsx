/* components/TimeDifference/TimeDiffCalculatorV2.client.jsx */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SearchCity from '../SearchCity.client';
import LiveClock from './LiveClock.client';
import SmartBadge from './SmartBadge';
import ContextSummary from './ContextSummary.client';
import TimeConverter from './TimeConverter.client';
import Timeline24h from './Timeline24h.client';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionDivider } from '@/components/shared/primitives';
import {
  ArrowUpDown,
  Briefcase,
  Share2,
  Sun,
  Moon,
  Check,
  MapPin,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { getTimeDiffAction } from '@/app/actions/location';

// ── 24-hour slot helpers ──────────────────────────────────────────────────────
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);

function isInRange(h, start, end) {
  // handles midnight wrap
  const s = ((start % 24) + 24) % 24;
  const e = ((end % 24) + 24) % 24;
  const n = ((h % 24) + 24) % 24;
  return s <= e ? n >= s && n < e : n >= s || n < e;
}

// ── Time format: Western numerals, Arabic period marker ───────────────────────
function fmtTime(totalMins) {
  const norm = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export default function TimeDiffCalculator({ initialFrom = null, initialTo = null, initialDiffData = null }) {
  const router = useRouter();
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [diffData, setDiffData] = useState(initialDiffData);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bizStart, setBizStart] = useState(9);
  const [bizEnd, setBizEnd] = useState(17);

  useEffect(() => {
    if (!fromCity || !toCity) {
      setDiffData(null);
      return;
    }

    const matchesCurrentPair =
      diffData?.success &&
      diffData.from === fromCity.timezone &&
      diffData.to === toCity.timezone;

    if (matchesCurrentPair) {
      return;
    }

    let cancelled = false;

    async function loadDiff() {
      setLoading(true);
      try {
        const data = await getTimeDiffAction(fromCity.timezone, toCity.timezone);
        if (!cancelled && data) {
          setDiffData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDiff();

    return () => {
      cancelled = true;
    };
  }, [fromCity, toCity, diffData]);

  const url = (f, t) =>
    `/time-difference/${f.country_slug}-${f.city_slug}/${t.country_slug}-${t.city_slug}`;

  const handleFrom = (c) => toCity ? router.push(url(c, toCity)) : setFromCity(c);
  const handleTo = (c) => fromCity ? router.push(url(fromCity, c)) : setToCity(c);
  const handleSwap = () => fromCity && toCity && router.push(url(toCity, fromCity));
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + url(fromCity, toCity)).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ── Business hours ────────────────────────────────────────────────────────
  const biz = useMemo(() => {
    if (!diffData?.success) return null;
    const diffH = diffData.totalMinutes / 60;
    const bStartB = bizStart - diffH;  // City B working hours in City A time
    const bEndB = bizEnd - diffH;
    const ovS = Math.max(bizStart, bStartB);
    const ovE = Math.min(bizEnd, bEndB);
    const hasOv = ovS < ovE;
    return {
      hasOverlap: hasOv,
      ovHours: hasOv ? ovE - ovS : 0,
      ovFromA: hasOv ? fmtTime(ovS * 60) : null,
      ovToA: hasOv ? fmtTime(ovE * 60) : null,
      ovFromB: hasOv ? fmtTime((ovS + diffH) * 60) : null,
      ovToB: hasOv ? fmtTime((ovE + diffH) * 60) : null,
      bStartB, bEndB,
    };
  }, [diffData, bizStart, bizEnd]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading && !diffData) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="card p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-3)' }} />
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" style={{ backgroundColor: 'var(--bg-surface-3)' }} />
            <Skeleton className="h-10 flex-1 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-3)' }} />
          </div>
        </div>
        <div className="card p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" style={{ backgroundColor: 'var(--bg-surface-3)' }} />
          <Skeleton className="h-10 w-1/2" style={{ backgroundColor: 'var(--bg-surface-3)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Search row ──────────────────────────────────────────────── */}
      <div className="card p-4">
        <div className="flex flex-wrap flex-col sm:flex-row items-start sm:items-end gap-3">

          <div className="flex-1 w-full input-group">
            <label className="input-label flex items-center gap-1.5">
              <MapPin size={13} className="text-accent-alt shrink-0" aria-hidden="true" />
              المدينة الأولى
            </label>
            <div style={{ position: 'relative', zIndex: 50 }}>
              <SearchCity onSelectCity={handleFrom} initialCity={fromCity} />
            </div>
            {fromCity && (
              <p className="input-hint flex items-center gap-1">
                <Check size={10} className="text-success" />
                <span className="text-accent-alt font-medium">{fromCity.city_name_ar}، {fromCity.country_name_ar}</span>
              </p>
            )}
          </div>

          <div className="flex justify-center w-full my-1">
            <button
              onClick={handleSwap}
              disabled={!fromCity || !toCity}
              aria-label="تبديل المدينتين"
              className="flex justify-center items-center w-10 h-10 shrink-0 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface-3)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-4)] hover:border-[var(--border-accent)] transition-all shadow-sm"
            >
              <ArrowUpDown size={18} className="text-accent-alt opacity-90" />
            </button>
          </div>

          <div className="flex-1 w-full input-group">
            <label className="input-label flex items-center gap-1.5">
              <MapPin size={13} className="text-accent-alt shrink-0" aria-hidden="true" />
              المدينة الثانية
            </label>
            <div style={{ position: 'relative', zIndex: 40 }}>
              <SearchCity onSelectCity={handleTo} initialCity={toCity} />
            </div>
            {toCity && (
              <p className="input-hint flex items-center gap-1">
                <Check size={10} className="text-success" />
                <span className="text-accent-alt font-medium">{toCity.city_name_ar}، {toCity.country_name_ar}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────── */}
      {diffData?.success && (
        <>
          {/* City comparison card — compact, no clock-display sizes */}

            <div style={{
              background: 'var(--bg-surface-2)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-card)',
              transition: 'background-color var(--transition-theme), border-color var(--transition-theme), box-shadow var(--transition-base), transform var(--transition-base)',
              overflow: 'hidden',
            }}>
              {/* Diff header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: 'var(--accent-gradient)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-semibold opacity-80">فارق التوقيت</span>
                  <div dir="ltr" className="text-white font-black tabular-nums">
                    {diffData.totalMinutes === 0 ? (
                      <span className="text-base">متطابق</span>
                    ) : (
                      <span className="text-lg">
                        {diffData.sign}{diffData.formattedHours}
                        {diffData.formattedMinutes > 0 && `:`}
                        {diffData.formattedMinutes > 0 && String(diffData.formattedMinutes).padStart(2, '0')}
                        {' '}ساعة
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <SmartBadge totalMinutes={diffData.totalMinutes} />
                  <button
                    onClick={handleShare}
                    className="btn btn-xs rounded-full bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold gap-1"
                    aria-label={copied ? 'تم النسخ' : 'مشاركة'}
                  >
                    {copied ? <><Check size={12} /> نُسخ</> : <><Share2 size={12} /> مشاركة</>}
                  </button>
                </div>
              </div>
              {/* City times — two columns */}
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[var(--border-subtle)]">

                {/* From city */}
                <div className="p-4 text-center">
                  <p className="text-xs text-muted mb-1">{fromCity.city_name_ar}</p>
                  <p className="text-xs text-muted mb-2">{fromCity.country_name_ar}</p>
                  {/* LiveClock with small styling — NOT clock-display size */}
                  <div className="td-city-time">
                    <LiveClock
                      timezone={diffData.from}
                      aria-label={`الساعة الان في ${fromCity.city_name_ar}`}
                    />
                  </div>
                  <span className={`badge mt-2 ${diffData.isDSTFrom ? 'badge-warning' : 'badge-default'}`}>
                    {diffData.isDSTFrom
                      ? <><Sun size={10} className="text-warning" aria-hidden="true" /> توقيت صيفي</>
                      : <><Moon size={10} className="text-muted" aria-hidden="true" /> توقيت شتوي</>
                    }
                  </span>
                </div>

                {/* To city */}
                <div className="p-4 text-center">
                  <p className="text-xs text-muted mb-1">{toCity.city_name_ar}</p>
                  <p className="text-xs text-muted mb-2">{toCity.country_name_ar}</p>
                  <div className="td-city-time">
                    <LiveClock
                      timezone={diffData.to}
                      aria-label={`الساعة الان في ${toCity.city_name_ar}`}
                    />
                  </div>
                  <span className={`badge mt-2 ${diffData.isDSTTo ? 'badge-warning' : 'badge-default'}`}>
                    {diffData.isDSTTo
                      ? <><Sun size={10} className="text-warning" aria-hidden="true" /> توقيت صيفي</>
                      : <><Moon size={10} className="text-muted" aria-hidden="true" /> توقيت شتوي</>
                    }
                  </span>
                </div>
              </div>
            </div>

          {/* ── Context Summary ───────────────────────────────── */}
          <ContextSummary fromCity={fromCity} toCity={toCity} diffData={diffData} />

          <div className="my-20">
            <SectionDivider />
          </div>

          {/* ── Time Converter ────────────────────────────────── */}
          <TimeConverter fromCity={fromCity} toCity={toCity} totalMinutes={diffData.totalMinutes} />

          {/* ── 24h Timeline ──────────────────────────────────── */}
          <Timeline24h fromCity={fromCity} toCity={toCity} diffData={diffData} />

          {/* ── Business Hours ────────────────────────────────── */}
          <div className="card p-0 overflow-hidden">

            <div className="card__header px-4 pt-4 pb-3 mx-0 mb-0">
              <div className="flex items-center gap-2">
                <div className="bg-accent-soft p-2 rounded-lg text-accent-alt shrink-0">
                  <Briefcase size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="card__title text-base">ساعات العمل المشتركة</p>
                  <p className="card__subtitle">أفضل وقت للاجتماعات بين الطرفين</p>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-4">

              {/* Overlap result — shown first (most important) */}
              {biz && (
                biz.hasOverlap ? (
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ background: 'var(--success-soft)', border: '1px solid var(--success-border)' }}
                  >
                    <p className="text-xs text-success font-semibold mb-2">
                      ✅ <strong className="tabular-nums">{biz.ovHours}</strong> ساعة مشتركة — مثالي للاجتماعات
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted mb-0.5">{fromCity.city_name_ar}</p>
                        <p className="font-black tabular-nums text-success text-base leading-tight" dir="ltr">
                          {biz.ovFromA} – {biz.ovToA}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-0.5">{toCity.city_name_ar}</p>
                        <p className="font-black tabular-nums text-success text-base leading-tight" dir="ltr">
                          {biz.ovFromB} – {biz.ovToB}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-border)' }}
                  >
                    <p className="text-sm font-semibold text-danger">⚠️ لا يوجد وقت عمل مشترك</p>
                    <p className="text-xs text-secondary mt-1">عدّل وقت الدوام أدناه لإيجاد توقيت مناسب.</p>
                  </div>
                )
              )}

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'بداية الدوام',
                    val: bizStart,
                    onDec: () => setBizStart(s => Math.max(0, s - 1)),
                    onInc: () => setBizStart(s => Math.min(bizEnd - 1, s + 1)),
                    decLabel: 'تقليل بداية الدوام',
                    incLabel: 'زيادة بداية الدوام',
                  },
                  {
                    label: 'نهاية الدوام',
                    val: bizEnd,
                    onDec: () => setBizEnd(e => Math.max(bizStart + 1, e - 1)),
                    onInc: () => setBizEnd(e => Math.min(23, e + 1)),
                    decLabel: 'تقليل نهاية الدوام',
                    incLabel: 'زيادة نهاية الدوام',
                  },
                ].map(ctrl => (
                  <div key={ctrl.label} className="input-group">
                    <span className="input-label">{ctrl.label}</span>
                    <div className="card-nested flex items-center justify-between px-2 py-2">
                      <button
                        onClick={ctrl.onDec}
                        aria-label={ctrl.decLabel}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-accent-alt hover:bg-accent-soft transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <span className="font-bold text-primary tabular-nums text-sm" dir="ltr">
                        {ctrl.val}:00
                      </span>
                      <button
                        onClick={ctrl.onInc}
                        aria-label={ctrl.incLabel}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-accent-alt hover:bg-accent-soft transition-colors"
                      >
                        <ChevronUp size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 24-hour slot grid */}
              {biz && (
                <div className="space-y-2">
                  {/* City A row */}
                  <div>
                    <p className="text-xs text-muted mb-1">{fromCity.city_name_ar}</p>
                    <div
                      className="flex rounded-lg overflow-hidden h-6"
                      style={{ border: '1px solid var(--border-default)' }}
                    >
                      {HOURS_24.map(h => {
                        const inA = h >= bizStart && h < bizEnd;
                        const inOv = biz.hasOverlap && h >= biz.ovHours &&
                          h >= Math.max(bizStart, biz.bStartB) &&
                          h < Math.min(bizEnd, biz.bEndB);
                        // Recalculate overlap for grid coloring
                        const ovS = Math.max(bizStart, biz.bStartB);
                        const ovE = Math.min(bizEnd, biz.bEndB);
                        const isOv = biz.hasOverlap && h >= ovS && h < ovE;
                        return (
                          <div
                            key={h}
                            title={`${h}:00`}
                            className="flex-1 border-r border-[var(--border-subtle)] last:border-r-0"
                            style={{
                              backgroundColor: isOv
                                ? 'var(--success-soft)'
                                : inA
                                  ? 'var(--accent-soft)'
                                  : 'var(--bg-surface-3)',
                              borderTop: isOv
                                ? '2px solid var(--success)'
                                : inA
                                  ? '2px solid var(--accent-alt)'
                                  : '2px solid transparent',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* City B row */}
                  <div>
                    <p className="text-xs text-muted mb-1">{toCity.city_name_ar}</p>
                    <div
                      className="flex rounded-lg overflow-hidden h-6"
                      style={{ border: '1px solid var(--border-default)' }}
                    >
                      {HOURS_24.map(h => {
                        const inB = isInRange(h, biz.bStartB, biz.bEndB);
                        const inA = h >= bizStart && h < bizEnd;
                        const isOv = inA && inB;
                        return (
                          <div
                            key={h}
                            title={`${h}:00`}
                            className="flex-1 border-r border-[var(--border-subtle)] last:border-r-0"
                            style={{
                              backgroundColor: isOv
                                ? 'var(--success-soft)'
                                : inB
                                  ? 'var(--info-soft)'
                                  : 'var(--bg-surface-3)',
                              borderTop: isOv
                                ? '2px solid var(--success)'
                                : inB
                                  ? '2px solid var(--info)'
                                  : '2px solid transparent',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Time labels */}
                  <div
                    className="flex justify-between text-muted tabular-nums"
                    style={{ fontSize: '10px' }}
                    aria-hidden="true"
                    dir="ltr"
                  >
                    <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-4 flex-wrap" style={{ fontSize: '11px' }}>
                    {[
                      { color: 'var(--accent-soft)', border: 'var(--accent-alt)', label: fromCity.city_name_ar },
                      { color: 'var(--info-soft)', border: 'var(--info)', label: toCity.city_name_ar },
                      { color: 'var(--success-soft)', border: 'var(--success)', label: 'وقت مشترك' },
                    ].map(item => (
                      <span key={item.label} className="flex items-center gap-1 text-secondary">
                        <span
                          className="inline-block rounded-sm"
                          style={{ width: 14, height: 10, backgroundColor: item.color, border: `1.5px solid ${item.border}` }}
                        />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Empty State ─────────────────────────────────────────── */}
      {!loading && !diffData && (
        <div className="empty-state">
          <span className="empty-state__icon">🌍</span>
          <p className="empty-state__title">اختر مدينتين للمقارنة</p>
          <p className="empty-state__description">
            ابحث عن أي مدينتين لمعرفة فرق التوقيت الدقيق وأفضل وقت للاجتماعات.
          </p>
        </div>
      )}
    </div>
  );
}
