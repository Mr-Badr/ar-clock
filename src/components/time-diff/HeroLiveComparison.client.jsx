'use client';

/**
 * HeroLiveComparison — the page's single "answer" module: a ticking dual
 * clock, the signed diff pill, and share. Replaces the old stack of
 * SSR snapshot + DualLiveClock + the calculator's duplicate city-card.
 *
 * Hydration-safe: seeded with server-computed clock parts (fromInitial/
 * toInitial) so the first paint matches the client tick exactly — no
 * skeleton flash, no CLS.
 */

import { useState, useEffect } from 'react';
import { Share2, Check, Sun, Moon } from 'lucide-react';
import { useCopyFeedback } from '@/lib/share.client';

function clockParts(tz, date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
    }).formatToParts(date);
    const g = (t) => {
      const v = parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);
      return t === 'hour' && v === 24 ? 0 : v;
    };
    return { h: g('hour'), m: g('minute'), s: g('second') };
  } catch { return { h: 0, m: 0, s: 0 }; }
}

function fmt12(h, m, s) {
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${period}`;
}

function diffTone(absHours) {
  if (absHours <= 1) return 'success';
  if (absHours <= 4) return 'warning';
  return 'danger';
}

export default function HeroLiveComparison(props) {
  const { fromCity, toCity, diffMinutes, diffLabel, fromHasDST, toHasDST, fromInitial, toInitial, shareHref } = props;
  const [fromT, setFromT] = useState(fromInitial);
  const [toT, setToT] = useState(toInitial);
  const { copied, copy } = useCopyFeedback();

  useEffect(() => {
    // Re-sync to the real clock on mount (server render used request time,
    // which may be a beat behind by the time this hydrates), then tick.
    const tick = () => {
      const now = new Date();
      setFromT(clockParts(fromCity.timezone, now));
      setToT(clockParts(toCity.timezone, now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fromCity.timezone, toCity.timezone]);

  const absHours = Math.abs(diffMinutes) / 60;
  const tone = diffTone(absHours);
  const ahead = diffMinutes > 0 ? toCity.city_name_ar : fromCity.city_name_ar;
  const behind = diffMinutes > 0 ? fromCity.city_name_ar : toCity.city_name_ar;

  const handleShare = async () => {
    if (!shareHref) return;
    await copy(window.location.origin + shareHref);
  };

  return (
    <div className="card td-hero" role="region" aria-label={`الوقت الآن في ${fromCity.city_name_ar} و${toCity.city_name_ar}، مباشر`}>
      <div className="td-hero__bar">
        <span className="td-hero__live">
          <span className="td-hero__dot" aria-hidden="true" />
          الوقت الآن — مباشر
        </span>
        <button type="button" onClick={handleShare} className="td-hero__share" aria-label={copied ? 'تم نسخ الرابط' : 'مشاركة هذه المقارنة'}>
          {copied ? <><Check size={13} /> تم النسخ</> : <><Share2 size={13} /> مشاركة</>}
        </button>
      </div>

      <div className="td-hero__grid">
        <div className="td-hero__city">
          <p className="td-hero__name">{fromCity.city_name_ar}</p>
          <p className="td-hero__time tabular-nums" dir="ltr" suppressHydrationWarning>{fmt12(fromT.h, fromT.m, fromT.s)}</p>
          <span className={`badge ${fromHasDST ? 'badge-warning' : 'badge-default'}`}>
            {fromHasDST ? <><Sun size={10} aria-hidden="true" /> صيفي</> : <><Moon size={10} aria-hidden="true" /> شتوي</>}
          </span>
        </div>

        <div className="td-hero__diff">
          <span className={`td-hero__diff-pill td-hero__diff-pill--${diffMinutes === 0 ? 'success' : tone}`}>
            {diffMinutes === 0 ? 'متطابق' : diffLabel}
          </span>
          {diffMinutes !== 0 && (
            <span className="td-hero__diff-note">{ahead} تسبق {behind}</span>
          )}
        </div>

        <div className="td-hero__city">
          <p className="td-hero__name">{toCity.city_name_ar}</p>
          <p className="td-hero__time tabular-nums" dir="ltr" suppressHydrationWarning>{fmt12(toT.h, toT.m, toT.s)}</p>
          <span className={`badge ${toHasDST ? 'badge-warning' : 'badge-default'}`}>
            {toHasDST ? <><Sun size={10} aria-hidden="true" /> صيفي</> : <><Moon size={10} aria-hidden="true" /> شتوي</>}
          </span>
        </div>
      </div>
    </div>
  );
}
