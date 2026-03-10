'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchCity from '../SearchCity.client';
import LiveClock from './LiveClock.client';
import SmartBadge from './SmartBadge';
import ContextSummary from './ContextSummary.client';
import TimeConverter from './TimeConverter.client';
import Timeline24h from './Timeline24h.client';
import { ArrowLeftRight, Clock, Briefcase, Share2, Sun, Moon, Info, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTimeDiffAction } from '@/app/actions/location';

export default function TimeDiffCalculator({ initialFrom = null, initialTo = null, preloadedCountries = null }) {
  const router = useRouter();
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bizStart, setBizStart] = useState(9);
  const [bizEnd, setBizEnd] = useState(17);

  useEffect(() => {
    if (fromCity && toCity) {
      fetchDiff(fromCity.timezone, toCity.timezone);
    } else {
      setDiffData(null);
    }
  }, [fromCity, toCity]);

  const fetchDiff = useCallback(async (fromTz, toTz) => {
    setLoading(true);
    try {
      const data = await getTimeDiffAction(fromTz, toTz);
      if (data) setDiffData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const constructUrl = (f, t) =>
    `/time-difference/${f.country_slug}-${f.city_slug}/${t.country_slug}-${t.city_slug}`;

  const handleSelectFrom = (city) => {
    if (toCity) router.push(constructUrl(city, toCity));
    else setFromCity(city);
  };

  const handleSelectTo = (city) => {
    if (fromCity) router.push(constructUrl(fromCity, city));
    else setToCity(city);
  };

  const handleSwap = () => {
    if (fromCity && toCity) router.push(constructUrl(toCity, fromCity));
  };

  const handleShare = () => {
    const url = window.location.origin + constructUrl(fromCity, toCity);
    navigator.clipboard.writeText(url).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Business hours overlap with configurable times
  const businessHours = React.useMemo(() => {
    if (!diffData?.success) return null;
    const diffHours = diffData.totalMinutes / 60;
    const toStart = bizStart - diffHours;
    const toEnd = bizEnd - diffHours;
    const overlapStart = Math.max(bizStart, toStart);
    const overlapEnd = Math.min(bizEnd, toEnd);
    const hasOverlap = overlapStart < overlapEnd;

    const fmt = (h) => {
      const totalMins = Math.round(h * 60);
      const norm = ((totalMins % 1440) + 1440) % 1440;
      const hours = Math.floor(norm / 60);
      const minutes = norm % 60;
      const p = hours >= 12 ? 'م' : 'ص';
      const h12 = hours % 12 || 12;
      return `${h12}:${String(minutes).padStart(2, '0')} ${p}`;
    };

    return {
      hasOverlap,
      overlapStart,
      overlapEnd,
      durationHours: hasOverlap ? overlapEnd - overlapStart : 0,
      fromTimeRange: `${fmt(bizStart)} – ${fmt(bizEnd)}`,
      toTimeRange: `${fmt(bizStart + diffHours)} – ${fmt(bizEnd + diffHours)}`,
      overlapFrom: hasOverlap ? fmt(overlapStart) : null,
      overlapTo: hasOverlap ? fmt(overlapEnd) : null,
    };
  }, [diffData, bizStart, bizEnd]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">

      {/* ── Search Controls ───────────────────────────────────────── */}
      <div className="bg-[var(--bg-surface-1)] p-6 rounded-3xl shadow-xl border border-[var(--border-default)] relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4 relative">

          {/* From City */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)] flex items-center gap-2">
              <MapPin size={16} className="text-[var(--accent)]" />
              من مدينة (الوقت الأساسي)
            </label>
            <div className="relative z-50">
              <SearchCity onSelectCity={handleSelectFrom} initialCity={fromCity} preloadedCountries={preloadedCountries} />
            </div>
            {fromCity && (
              <p className="text-sm font-bold text-[var(--accent)] pr-2">
                محدد: {fromCity.city_name_ar}، {fromCity.country_name_ar}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            disabled={!fromCity || !toCity}
            aria-label="تبديل المدينتين"
            className="md:mt-8 h-12 w-12 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all z-0"
          >
            <ArrowLeftRight className="text-[var(--accent)]" />
          </Button>

          {/* To City */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-[var(--text-muted)] flex items-center gap-2">
              <MapPin size={16} className="text-[var(--accent)]" />
              إلى مدينة (الوجهة)
            </label>
            <div className="relative z-40">
              <SearchCity onSelectCity={handleSelectTo} initialCity={toCity} preloadedCountries={preloadedCountries} />
            </div>
            {toCity && (
              <p className="text-sm font-bold text-[var(--accent)] pr-2">
                محدد: {toCity.city_name_ar}، {toCity.country_name_ar}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Loading ───────────────────────────────────────────────── */}
      {loading && !diffData && (
        <div className="flex justify-center py-12" role="status" aria-label="جارٍ الحساب">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]" />
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────── */}
      {diffData?.success && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">

            {/* Card: From City */}
            <div className="bg-gradient-to-br from-[var(--bg-surface-1)] to-[var(--bg-surface-2)] p-6 rounded-3xl shadow-lg border border-[var(--border-subtle)] text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <h3 className="text-xl font-bold mb-1">{fromCity.city_name_ar}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{fromCity.country_name_ar}</p>
              <LiveClock timezone={diffData.from} aria-label={`الساعة الآن في ${fromCity.city_name_ar}`} className="text-4xl text-[var(--text-primary)] mb-4" />
              <div className="inline-flex items-center gap-2 bg-[var(--bg-subtle)] px-3 py-1.5 rounded-xl text-xs font-bold mt-2">
                {diffData.isDSTFrom ? <Sun size={14} className="text-yellow-500" /> : <Moon size={14} className="text-blue-400" />}
                <span>{diffData.isDSTFrom ? 'توقيت صيفي' : 'توقيت شتوي'}</span>
              </div>
            </div>

            {/* Card: Difference Highlight */}
            <div className="flex flex-col justify-center items-center bg-[var(--accent)] text-white p-6 rounded-3xl shadow-2xl shadow-[var(--accent-glow)] transform md:-translate-y-4 relative z-10">
              <Clock size={32} className="mb-3 opacity-80" />
              <h4 className="text-lg font-bold opacity-90 mb-1">فرق التوقيت</h4>

              {/* Smart badge */}
              <div className="mb-3">
                <SmartBadge totalMinutes={diffData.totalMinutes} />
              </div>

              <div className="text-5xl font-black tabular-nums tracking-tighter mb-2" dir="ltr">
                {diffData.totalMinutes === 0 ? (
                  <span className="text-3xl">نفس الوقت</span>
                ) : (
                  <>
                    <span className="text-3xl opacity-80">{diffData.sign}</span>
                    {diffData.formattedHours}
                    {diffData.formattedMinutes > 0 && (
                      <span className="text-2xl opacity-80">:{String(diffData.formattedMinutes).padStart(2, '0')}</span>
                    )}
                    <span className="text-xl opacity-80 ml-1">ساعة</span>
                  </>
                )}
              </div>

              <div className="mt-2 flex flex-col items-center gap-2 text-center">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                  {diffData.dayStatus === 'same' && 'نفس اليوم'}
                  {diffData.dayStatus === 'next' && '⚠️ اليوم التالي'}
                  {diffData.dayStatus === 'prev' && '⚠️ اليوم السابق'}
                </span>
                <p className="text-xs opacity-90 mt-1">
                  {toCity.city_name_ar}{' '}
                  {diffData.totalMinutes > 0 ? 'تسبق' : diffData.totalMinutes < 0 ? 'تتأخر عن' : 'توافق'}{' '}
                  {fromCity.city_name_ar}
                </p>
              </div>

              <Button
                onClick={handleShare}
                variant="secondary"
                className="mt-5 rounded-xl hover:scale-105 transition-all text-[var(--accent)] font-bold px-6"
              >
                {copied ? <Check size={16} className="ml-2" /> : <Share2 size={16} className="ml-2" />}
                {copied ? 'تم النسخ!' : 'مشاركة'}
              </Button>
            </div>

            {/* Card: To City */}
            <div className="bg-gradient-to-br from-[var(--bg-surface-1)] to-[var(--bg-surface-2)] p-6 rounded-3xl shadow-lg border border-[var(--border-subtle)] text-center relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <h3 className="text-xl font-bold mb-1">{toCity.city_name_ar}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{toCity.country_name_ar}</p>
              <LiveClock timezone={diffData.to} aria-label={`الساعة الآن في ${toCity.city_name_ar}`} className="text-4xl text-[var(--text-primary)] mb-4" />
              <div className="inline-flex items-center gap-2 bg-[var(--bg-subtle)] px-3 py-1.5 rounded-xl text-xs font-bold mt-2">
                {diffData.isDSTTo ? <Sun size={14} className="text-yellow-500" /> : <Moon size={14} className="text-blue-400" />}
                <span>{diffData.isDSTTo ? 'توقيت صيفي' : 'توقيت شتوي'}</span>
              </div>
            </div>
          </div>

          {/* ── Context Summary ───────────────────────────────────── */}
          <ContextSummary fromCity={fromCity} toCity={toCity} diffData={diffData} />

          {/* ── Time Conversion Tool ──────────────────────────────── */}
          <TimeConverter
            fromCity={fromCity}
            toCity={toCity}
            totalMinutes={diffData.totalMinutes}
          />

          {/* ── 24h Timeline ──────────────────────────────────────── */}
          <Timeline24h fromCity={fromCity} toCity={toCity} diffData={diffData} />

          {/* ── Business Hours (configurable) ─────────────────────── */}
          <div className="bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
              <div className="bg-[var(--accent-soft)] p-2 rounded-xl text-[var(--accent)]">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="font-bold text-base">ساعات العمل المشتركة</h4>
                <p className="text-xs text-[var(--text-muted)]">
                  ما هو أفضل وقت لعقد اجتماع بين الفريقين؟
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Configurable hour controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">بداية الدوام</label>
                  <div className="flex items-center gap-2 bg-[var(--bg-surface-3)] border border-[var(--border-default)] rounded-xl px-3 py-2">
                    <button
                      onClick={() => setBizStart(s => Math.max(6, s - 1))}
                      aria-label="تقديم بداية الدوام"
                      className="text-[var(--accent)] font-black text-lg leading-none hover:opacity-70 w-6"
                    >−</button>
                    <span className="flex-1 text-center font-black text-[var(--text-primary)]">{bizStart}:00</span>
                    <button
                      onClick={() => setBizStart(s => Math.min(bizEnd - 1, s + 1))}
                      aria-label="تأخير بداية الدوام"
                      className="text-[var(--accent)] font-black text-lg leading-none hover:opacity-70 w-6"
                    >+</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">نهاية الدوام</label>
                  <div className="flex items-center gap-2 bg-[var(--bg-surface-3)] border border-[var(--border-default)] rounded-xl px-3 py-2">
                    <button
                      onClick={() => setBizEnd(e => Math.max(bizStart + 1, e - 1))}
                      aria-label="تقديم نهاية الدوام"
                      className="text-[var(--accent)] font-black text-lg leading-none hover:opacity-70 w-6"
                    >−</button>
                    <span className="flex-1 text-center font-black text-[var(--text-primary)]">{bizEnd}:00</span>
                    <button
                      onClick={() => setBizEnd(e => Math.min(23, e + 1))}
                      aria-label="تأخير نهاية الدوام"
                      className="text-[var(--accent)] font-black text-lg leading-none hover:opacity-70 w-6"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Visual overlap bar */}
              {businessHours && (
                <div className="space-y-3">
                  {/* Row: From city */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[var(--text-muted)]">{fromCity.city_name_ar} ({bizStart}:00 – {bizEnd}:00)</p>
                    <div className="relative h-6 rounded-full bg-[var(--bg-surface-4)] overflow-hidden">
                      {/* from workhours band */}
                      <div
                        className="absolute inset-y-0 rounded-full bg-[var(--accent-soft)] border border-[var(--border-accent)]"
                        style={{ left: `${(bizStart / 24) * 100}%`, width: `${((bizEnd - bizStart) / 24) * 100}%` }}
                      />
                      {/* overlap highlight */}
                      {businessHours.hasOverlap && (
                        <div
                          className="absolute inset-y-0 rounded-full bg-[var(--success)] opacity-70"
                          style={{
                            left: `${(businessHours.overlapStart / 24) * 100}%`,
                            width: `${((businessHours.overlapEnd - businessHours.overlapStart) / 24) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Row: To city */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[var(--text-muted)]">{toCity.city_name_ar} (مقابل {businessHours.overlapFrom ?? '—'} – {businessHours.overlapTo ?? '—'})</p>
                    <div className="relative h-6 rounded-full bg-[var(--bg-surface-4)] overflow-hidden">
                      {/* to-city workhours translated */}
                      {(() => {
                        const diffH = diffData.totalMinutes / 60;
                        const toStart = bizStart + diffH;
                        const toEnd = bizEnd + diffH;
                        const clampStart = ((toStart % 24) + 24) % 24;
                        const clampEnd = ((toEnd % 24) + 24) % 24;
                        return (
                          <div
                            className="absolute inset-y-0 rounded-full bg-[var(--accent-alt-soft)] border border-[var(--accent-alt-soft)]"
                            style={{ left: `${(clampStart / 24) * 100}%`, width: `${((bizEnd - bizStart) / 24) * 100}%` }}
                          />
                        );
                      })()}
                      {businessHours.hasOverlap && (
                        <div
                          className="absolute inset-y-0 rounded-full bg-[var(--success)] opacity-70"
                          style={{
                            left: `${(businessHours.overlapStart / 24) * 100}%`,
                            width: `${((businessHours.overlapEnd - businessHours.overlapStart) / 24) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Scale */}
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                    {[0, 6, 12, 18, 24].map(h => <span key={h}>{h}:00</span>)}
                  </div>

                  {/* Legend */}
                  <div className="flex gap-4 flex-wrap text-[11px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-[var(--accent-soft)] border border-[var(--border-accent)] inline-block" />{fromCity.city_name_ar}</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-[var(--accent-alt-soft)] inline-block" />{toCity.city_name_ar}</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-[var(--success)] opacity-70 inline-block" />وقت مشترك</span>
                  </div>
                </div>
              )}

              {/* Result */}
              {businessHours?.hasOverlap ? (
                <div className="bg-[var(--success-soft)] border border-[var(--success-border)] rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-0.5">في {fromCity.city_name_ar}</p>
                      <p className="text-xl font-black text-[var(--success)]">{businessHours.overlapFrom} – {businessHours.overlapTo}</p>
                    </div>
                    <ArrowLeftRight size={16} className="text-[var(--success)] opacity-50" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-0.5">في {toCity.city_name_ar}</p>
                      <p className="text-xl font-black text-[var(--success)]">{businessHours.overlapFrom ? (() => {
                        // Compute overlap in to-city time
                        const diffH = diffData.totalMinutes / 60;
                        const fmt = (h) => { const n = ((h % 24) + 24) % 24; return `${n % 12 || 12}:00 ${n >= 12 ? 'م' : 'ص'}`; };
                        return `${fmt(businessHours.overlapStart + diffH)} – ${fmt(businessHours.overlapEnd + diffH)}`;
                      })() : '—'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--success)] font-bold mt-3 text-center">
                    ✅ {businessHours.durationHours} ساعة من الوقت المشترك — مثالي للاجتماعات
                  </p>
                </div>
              ) : (
                <div className="bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-2xl p-4 text-center">
                  <p className="font-bold text-[var(--danger)] text-base">⚠️ لا يوجد وقت عمل مشترك</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                    أوقات الدوام في المدينتين ({bizStart}:00–{bizEnd}:00) لا تتقاطع.
                    جرّب تعديل بداية أو نهاية الدوام، أو تواصل خارج ساعات العمل الرسمية.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Empty State ───────────────────────────────────────────── */}
      {!loading && !diffData && (
        <div className="text-center py-16 max-w-lg mx-auto opacity-70">
          <Info size={52} className="mx-auto mb-4 text-[var(--accent)] opacity-40" />
          <h3 className="text-xl font-bold mb-2">اختر مدينتين للمقارنة</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            اختر أي مدينتين حول العالم لمعرفة فرق التوقيت الدقيق، تحويل الوقت الفوري، ورابط مشاركة ذكي — مع دعم تلقائي للتوقيت الصيفي.
          </p>
        </div>
      )}
    </div>
  );
}
