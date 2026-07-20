/* components/TimeDifference/TimeDiffCalculatorV2.client.jsx */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchCity from '../SearchCity.client';
import TimeConverter from './TimeConverter.client';
import SharedHoursBar from './SharedHoursBar.client';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, Check, Globe2, MapPin } from 'lucide-react';
import { getTimeDiffAction } from '@/app/actions/location';

export default function TimeDiffCalculator(props) {
  const initialFrom = props.initialFrom ?? null;
  const initialTo = props.initialTo ?? null;
  const initialDiffData = props.initialDiffData ?? null;
  const router = useRouter();
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [diffData, setDiffData] = useState(initialDiffData);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

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
      setLoadError(null);
      try {
        const data = await getTimeDiffAction(fromCity.timezone, toCity.timezone);
        if (!cancelled && data) {
          setDiffData(data);
          setLoadError(null);
        }
      } catch (e) {
        const serializedError = e instanceof Error
          ? { name: e.name, message: e.message }
          : { message: String(e) };

        console.error('time-difference-load-failed', {
          fromTimezone: fromCity.timezone,
          toTimezone: toCity.timezone,
          fromCitySlug: fromCity.city_slug,
          toCitySlug: toCity.city_slug,
          error: serializedError,
        });

        if (!cancelled) {
          setDiffData(null);
          setLoadError({
            title: 'تعذر تحميل فرق التوقيت الآن',
            detail: 'حدثت مشكلة أثناء جلب المقارنة بين المدينتين. حاول التحديث مرة أخرى خلال لحظات.',
          });
        }
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
  }, [fromCity, toCity, diffData, requestVersion]);

  const url = (f, t) =>
    `/time-difference/${f.country_slug}-${f.city_slug}/${t.country_slug}-${t.city_slug}`;

  const handleFrom = (c) => toCity ? router.push(url(c, toCity)) : setFromCity(c);
  const handleTo = (c) => fromCity ? router.push(url(fromCity, c)) : setToCity(c);
  const handleSwap = () => fromCity && toCity && router.push(url(toCity, fromCity));

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

  if (loadError && !diffData) {
    return (
      <div className="card" role="alert" style={{ borderColor: 'var(--warning-border)', background: 'var(--warning-soft)' }}>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          <div>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {loadError.title}
            </strong>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {loadError.detail}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary--flat"
              onClick={() => setRequestVersion((value) => value + 1)}
            >
              أعد المحاولة
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              {fromCity?.city_name_ar && toCity?.city_name_ar
                ? `المقارنة الحالية: ${fromCity.city_name_ar} ↔ ${toCity.city_name_ar}`
                : 'اختر المدينتين ثم أعد المحاولة.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Search row — change the city pair ──────────────────────── */}
      <div className="card p-4">
        <div className="flex flex-wrap flex-col sm:flex-row items-start sm:items-end gap-3">

          <div className="flex-1 w-full sm:w-auto input-group">
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

          <div className="flex justify-center w-full sm:w-auto my-1">
            <button
              onClick={handleSwap}
              disabled={!fromCity || !toCity}
              aria-label="تبديل المدينتين"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-surface-3)] transition-colors hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-4)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUpDown size={18} className="text-accent-alt opacity-90" />
            </button>
          </div>

          <div className="flex-1 w-full sm:w-auto input-group">
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

      {/* ── Results: converter first (flagship tool), then shared hours ── */}
      {diffData?.success && (
        <>
          <TimeConverter fromCity={fromCity} toCity={toCity} totalMinutes={diffData.totalMinutes} />
          <SharedHoursBar
            fromCityAr={fromCity.city_name_ar}
            toCityAr={toCity.city_name_ar}
            fromTz={fromCity.timezone}
            diffMinutes={diffData.totalMinutes}
          />
        </>
      )}

      {/* ── Empty State ─────────────────────────────────────────── */}
      {!loading && !diffData && (
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            <Globe2 size={24} />
          </span>
          <p className="empty-state__title">اختر مدينتين للمقارنة</p>
          <p className="empty-state__description">
            ابحث عن أي مدينتين لمعرفة فرق التوقيت الدقيق وأفضل وقت للاجتماعات.
          </p>
        </div>
      )}
    </div>
  );
}
