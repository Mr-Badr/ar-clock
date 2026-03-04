'use client';
import React, { useMemo } from 'react';
import { Info } from 'lucide-react';

/**
 * ContextSummary — auto-generates a human-readable Arabic paragraph
 * that explains the time difference, with DST awareness and next-day warnings.
 */
export default function ContextSummary({ fromCity, toCity, diffData }) {
  const summary = useMemo(() => {
    if (!diffData?.success || !fromCity || !toCity) return null;

    const { totalMinutes, isDSTFrom, isDSTTo, dayStatus } = diffData;
    const absHours = Math.abs(totalMinutes) / 60;
    const absH = Math.floor(absHours);
    const absM = Math.abs(totalMinutes) % 60;

    const fromName = fromCity.city_name_ar;
    const toName   = toCity.city_name_ar;

    // Direction sentence
    let directionSentence;
    if (totalMinutes === 0) {
      directionSentence = `${fromName} و${toName} في نفس التوقيت تمامًا.`;
    } else {
      const ahead = totalMinutes > 0 ? toName : fromName;
      const behind = totalMinutes > 0 ? fromName : toName;
      const hStr = absH > 0 ? `${absH} ساعة` : '';
      const mStr = absM > 0 ? `${absM} دقيقة` : '';
      const diff = [hStr, mStr].filter(Boolean).join(' و');
      directionSentence = `تسبق ${ahead} ${behind} بـ${diff}.`;
    }

    // Conversion example
    let exampleSentence = '';
    if (totalMinutes !== 0) {
      const exFromHour = 9;
      const exToHour = exFromHour + totalMinutes / 60;
      const normTo = ((exToHour % 24) + 24) % 24;
      const period = normTo >= 12 ? 'مساءً' : 'صباحًا';
      const h12 = normTo % 12 || 12;
      const toTime = `${h12}:00 ${period}`;
      exampleSentence = `إذا كانت الساعة 9:00 صباحًا في ${fromName}، فهي الساعة ${toTime} في ${toName}.`;
    }

    // DST note
    let dstSentence = '';
    if (isDSTFrom || isDSTTo) {
      const dstCity = isDSTFrom ? fromName : toName;
      dstSentence = `تطبّق ${dstCity} التوقيت الصيفي حاليًا، مما قد يؤثر على الفارق الزمني خلال أشهر معينة.`;
    } else {
      dstSentence = 'لا يوجد تغيير متوقع في فرق التوقيت خلال هذه الفترة.';
    }

    // Day status note
    let daySentence = '';
    if (dayStatus === 'next') {
      daySentence = `⚠️ الساعة في ${toName} تشير إلى اليوم التالي.`;
    } else if (dayStatus === 'prev') {
      daySentence = `⚠️ الساعة في ${toName} تشير إلى اليوم السابق.`;
    }

    return [directionSentence, exampleSentence, dstSentence, daySentence].filter(Boolean);
  }, [fromCity, toCity, diffData]);

  if (!summary) return null;

  return (
    <div
      role="region"
      aria-label="ملخص فرق التوقيت"
      className="bg-[var(--bg-surface-2)] border border-[var(--border-accent)] rounded-2xl p-5 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} className="text-[var(--accent)]" />
        <span className="text-sm font-bold text-[var(--accent)]">ملخص المقارنة</span>
      </div>
      {summary.map((line, i) => (
        <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {line}
        </p>
      ))}
    </div>
  );
}
