"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export default function HijriBirthdayCalculator({ hijriEventsCatalog = [] }) {
  const [birthDateIso, setBirthDateIso] = useState('1995-06-15');
  const [copyState, setCopyState] = useState('idle');

  const snapshot = useMemo(() => {
    if (!birthDateIso) return null;
    try {
      return computeHijriBirthdaySnapshot(birthDateIso);
    } catch (_error) {
      return null;
    }
  }, [birthDateIso]);

  const matches = useMemo(() => {
    if (!snapshot) return null;
    return findHijriDayMatches(
      snapshot.birthHijri.month,
      snapshot.birthHijri.day,
      hijriEventsCatalog,
      snapshot.todayHijri.year,
    );
  }, [snapshot, hijriEventsCatalog]);

  const shareText = useMemo(() => {
    if (!snapshot) return '';
    const hijriLabel = `${snapshot.birthHijri.day} ${getHijriMonthName(snapshot.birthHijri.month)} ${snapshot.birthHijri.year} هـ`;
    return `🌙 وُلدت يوم ${hijriLabel}. اكتشف تاريخ ميلادك الهجري ومناسبته على ميقاتنا: miqatona.com/calculators/hijri-birthday`;
  }, [snapshot]);

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (_error) {
        // user cancelled or share unsupported — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (_error) {
      setCopyState('failed');
    }
  };

  const isOutOfRange = birthDateIso && !snapshot;

  return (
    <div className="calc-app">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل تاريخ ميلادك الميلادي</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <Input
              type="date"
              value={birthDateIso}
              min="1924-01-01"
              max="2077-12-31"
              onChange={(event) => setBirthDateIso(event.target.value)}
              aria-label="تاريخ الميلاد الميلادي"
            />
            {isOutOfRange ? (
              <p className="calc-hint">
                هذا التاريخ خارج النطاق المدعوم حالياً (1924–2077م) — جرّب تاريخاً ضمن هذا المدى.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {snapshot ? (
            <>
              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">تاريخ ميلادك بالتقويم الهجري</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">الموافق</div>
                    <div className="calc-metric-card__value">
                      {snapshot.birthHijri.day} {getHijriMonthName(snapshot.birthHijri.month)} {snapshot.birthHijri.year} هـ
                    </div>
                    <div className="calc-metric-card__note">
                      {formatGregorian(new Date(birthDateIso))} بالتقويم الميلادي
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">عمرك بالتقويم الهجري</div>
                  <div className="calc-metric-card__value">{formatYmd(snapshot.ageHijri)}</div>
                  <div className="calc-metric-card__note">محسوب بفرق السنة/الشهر/اليوم الهجري الفعلي — لا بالتقريب</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">عمرك بالتقويم الميلادي</div>
                  <div className="calc-metric-card__value">{formatYmd(snapshot.ageGregorian)}</div>
                  <div className="calc-metric-card__note">للمقارنة بين التقويمين</div>
                </div>
              </div>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">عيد ميلادك الهجري القادم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__value">
                      {snapshot.daysUntilNextHijriBirthday === 0
                        ? 'اليوم!'
                        : `باقي ${snapshot.daysUntilNextHijriBirthday} يوم`}
                    </div>
                    <div className="calc-metric-card__note">
                      {snapshot.birthHijri.day} {getHijriMonthName(snapshot.birthHijri.month)} {snapshot.nextHijriBirthdayYear} هـ — الموافق {formatGregorian(snapshot.nextHijriBirthdayGregorian)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {matches ? (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">هل تعلم؟</CardTitle>
                  </CardHeader>
                  <CardContent className="calc-breakdown-list">
                    {matches.exact.length > 0 ? (
                      <div className="calc-metric-card">
                        <div className="calc-metric-card__label">
                          {matches.exact.length === 1 ? 'وُلدت في نفس اليوم الهجري لـ' : 'وُلدت في نفس اليوم الهجري لعدة مناسبات'}
                        </div>
                        <div className="calc-metric-card__value">
                          {matches.exact.map((event, index) => (
                            <span key={event.slug}>
                              {index > 0 ? '، ' : ''}
                              <Link href={`/holidays/${event.slug}`} className="calc-inline-link">
                                {event.name}
                              </Link>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : matches.nearest ? (
                      <div className="calc-metric-card">
                        <div className="calc-metric-card__label">أقرب مناسبة إسلامية ليوم ميلادك الهجري</div>
                        <div className="calc-metric-card__value">
                          <Link href={`/holidays/${matches.nearest.event.slug}`} className="calc-inline-link">
                            {matches.nearest.event.name}
                          </Link>
                        </div>
                        <div className="calc-metric-card__note">
                          {matches.nearest.daysAway === 0
                            ? 'في نفس اليوم تقريباً'
                            : matches.nearest.direction === 'after'
                              ? `بعد ${matches.nearest.daysAway} يوماً من ميلادك الهجري`
                              : `قبل ${matches.nearest.daysAway} يوماً من ميلادك الهجري`}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              <button type="button" className="btn btn-outline" onClick={handleShare}>
                {copyState === 'copied' ? 'تم النسخ ✓' : copyState === 'failed' ? 'انسخ يدوياً' : 'شارك مولدك الهجري'}
              </button>
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">أدخل تاريخ ميلادك لعرض النتيجة.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
