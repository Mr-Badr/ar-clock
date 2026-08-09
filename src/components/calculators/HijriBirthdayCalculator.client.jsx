"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarBlank, Sparkle, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';

import {
  computeHijriBirthdaySnapshot,
  findHijriDayMatches,
  getHijriMonthName,
} from '@/lib/calculators/hijri-birthday';

const GREGORIAN_FORMATTER = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatGregorian(date) {
  return GREGORIAN_FORMATTER.format(date);
}

function formatYmd({ years, months, days }) {
  const parts = [];
  if (years > 0) parts.push(`${years} سنة`);
  if (months > 0) parts.push(`${months} شهر`);
  if (years === 0) parts.push(`${days} يوم`);
  return parts.join(' و') || '0 يوم';
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function HijriBirthdayCalculator({ hijriEventsCatalog = [] }) {
  const [birthDateIso, setBirthDateIso] = useState('1995-06-15');
  // `now` starts null and is only set inside useEffect (client-only, post-mount) —
  // never call new Date() directly during render, since Client Components still
  // execute their render function during server prerendering and a bare new Date()
  // there breaks static generation without a Suspense boundary.
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const snapshot = useMemo(() => {
    if (!birthDateIso || !now) return null;
    try {
      return computeHijriBirthdaySnapshot(birthDateIso, now);
    } catch {
      return null;
    }
  }, [birthDateIso, now]);

  const matches = useMemo(() => {
    if (!snapshot) return null;
    return findHijriDayMatches(
      snapshot.birthHijri.month,
      snapshot.birthHijri.day,
      hijriEventsCatalog,
      snapshot.todayHijri.year,
    );
  }, [snapshot, hijriEventsCatalog]);

  const isOutOfRange = birthDateIso && !snapshot;

  const shareText = snapshot
    ? `🌙 وُلدت يوم ${snapshot.birthHijri.day} ${getHijriMonthName(snapshot.birthHijri.month)} ${snapshot.birthHijri.year} هـ`
    : '';

  return (
    <div aria-label="حاسبة مولدك الهجري">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CalendarBlank size={14} weight="bold" /> ميلادك بالهجري <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="hijri-birth-date">تاريخ ميلادك الميلادي</label>
        <input
          id="hijri-birth-date"
          type="date"
          value={birthDateIso}
          min="1924-01-01"
          max="2077-12-31"
          onChange={(event) => setBirthDateIso(event.target.value)}
        />
        {isOutOfRange ? (
          <span className="tool-v2-option-hint">هذا التاريخ خارج النطاق المدعوم حالياً (1924–2077م) — جرّب تاريخاً ضمن هذا المدى.</span>
        ) : null}
      </div>

      {snapshot ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">تاريخ ميلادك بالتقويم الهجري</span>
            <div className="tool-v2-result-value">{snapshot.birthHijri.day} {getHijriMonthName(snapshot.birthHijri.month)} {snapshot.birthHijri.year} هـ</div>
            <div className="tool-v2-result-meta">{formatGregorian(new Date(birthDateIso))} بالتقويم الميلادي</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">عمرك بالتقويم الهجري</span>
              <span className="tool-v2-breakdown-value">{formatYmd(snapshot.ageHijri)}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">عمرك بالتقويم الميلادي</span>
              <span className="tool-v2-breakdown-value">{formatYmd(snapshot.ageGregorian)}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">عيد ميلادك الهجري القادم</span>
              <span className="tool-v2-breakdown-value">
                {snapshot.daysUntilNextHijriBirthday === 0 ? 'اليوم!' : `باقي ${snapshot.daysUntilNextHijriBirthday} يوم`}
              </span>
            </div>
          </div>
          <p className="tool-v2-option-hint">
            {snapshot.birthHijri.day} {getHijriMonthName(snapshot.birthHijri.month)} {snapshot.nextHijriBirthdayYear} هـ — الموافق {formatGregorian(snapshot.nextHijriBirthdayGregorian)}
          </p>

          {matches ? (
            <div className="tool-v2-note-strip">
              <Sparkle size={15} weight="fill" />
              {matches.exact.length > 0 ? (
                <span>
                  {matches.exact.length === 1 ? 'وُلدت في نفس اليوم الهجري لـ ' : 'وُلدت في نفس اليوم الهجري لعدة مناسبات: '}
                  {matches.exact.map((event, index) => (
                    <span key={event.slug}>
                      {index > 0 ? '، ' : ''}
                      <Link href={`/holidays/${event.slug}`}>{event.name}</Link>
                    </span>
                  ))}
                </span>
              ) : matches.nearest ? (
                <span>
                  أقرب مناسبة إسلامية ليوم ميلادك الهجري: <Link href={`/holidays/${matches.nearest.event.slug}`}>{matches.nearest.event.name}</Link>
                  {' — '}
                  {matches.nearest.daysAway === 0
                    ? 'في نفس اليوم تقريباً'
                    : matches.nearest.direction === 'after'
                      ? `بعد ${matches.nearest.daysAway} يوماً من ميلادك الهجري`
                      : `قبل ${matches.nearest.daysAway} يوماً من ميلادك الهجري`}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('مولدك الهجري', shareText)}>
              <ShareNetwork size={18} weight="bold" /> شارك مولدك الهجري
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <CalendarBlank size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لعرض النتيجة.</p>
        </div>
      )}
    </div>
  );
}
