"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, DownloadSimple } from '@phosphor-icons/react';

// Interval days per environment — synthesized from several sourced, converging recommendations:
// "كل 3 أشهر" for normal use, "شهرياً خاصة بالصيف" for dusty/desert conditions (with the more
// aggressive "كل 10 أيام" cited only for extreme desert dust, kept as a note not the default), and
// a moderate interval for humid coastal air (mold/odor risk, not dust).
const ENVIRONMENTS = [
  { id: 'normal', label: 'عادية', days: 90 },
  { id: 'dusty', label: 'مغبرة أو صحراوية', days: 30 },
  { id: 'coastal', label: 'ساحلية رطبة', days: 45 },
];

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d;
}

function formatArabicDate(d) {
  return d.toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Local date components, not `toISOString()` — that forces UTC and silently shifts the date back
// by one day for every positive-UTC-offset timezone (Saudi UTC+3, UAE UTC+4, ...), i.e. almost
// every market this tool targets.
function toIcsDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function downloadIcs(nextDate) {
  const dt = toIcsDate(nextDate);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//miqatona.com//AC Maintenance//AR',
    'BEGIN:VEVENT',
    `UID:ac-maintenance-${dt}@miqatona.com`,
    `DTSTAMP:${dt}T000000Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    'SUMMARY:تذكير: تنظيف فلتر المكيف',
    'DESCRIPTION:موعد الصيانة الدورية المقترح لمكيفك — نظّف الفلتر وافحص الوحدة الخارجية.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'تذكير-صيانة-المكيف.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AcMaintenanceTracker() {
  const [lastCleaned, setLastCleaned] = useState('');
  const [envId, setEnvId] = useState('normal');
  const env = ENVIRONMENTS.find((e) => e.id === envId);

  // Computed post-mount only (not during any server/prerender pass) to avoid calling `new Date()`
  // in the render body — Next.js flags that as a prerender hazard for client components too.
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => { setMaxDate(new Date().toISOString().slice(0, 10)); }, []);

  const result = useMemo(() => {
    if (!lastCleaned) return null;
    const nextDate = addDays(lastCleaned, env.days);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((nextDate - today) / (1000 * 60 * 60 * 24));
    let tone = 'is-good';
    let status = `موعدك القادم ${formatArabicDate(nextDate)}`;
    if (diffDays < 0) { tone = 'is-bad'; status = `متأخر — كان موعدك ${formatArabicDate(nextDate)}`; }
    else if (diffDays <= 7) { tone = 'is-warn'; status = `قريب — موعدك ${formatArabicDate(nextDate)}`; }
    return { nextDate, tone, status };
  }, [lastCleaned, env]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><CalendarCheck size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب موعد الصيانة القادمة</p>
          <p className="guide-v2-checker-sub">أدخل تاريخ آخر تنظيف ونوع بيئتك</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="last-cleaned">تاريخ آخر تنظيف للفلتر</label>
        <input
          id="last-cleaned"
          type="date"
          value={lastCleaned}
          onChange={(e) => setLastCleaned(e.target.value)}
          max={maxDate || undefined}
        />
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="نوع البيئة">
        {ENVIRONMENTS.map((e) => (
          <button
            key={e.id}
            type="button"
            className={`guide-v2-checker-chip${envId === e.id ? ' is-active' : ''}`}
            aria-pressed={envId === e.id}
            onClick={() => setEnvId(e.id)}
          >
            {e.label}
          </button>
        ))}
      </div>

      {result ? (
        <>
          <div className={`guide-v2-checker-result ${result.tone}`} aria-live="polite">
            <p className="guide-v2-checker-result-label">الحالة</p>
            <p className="guide-v2-checker-result-value" style={{ fontSize: '1.05rem' }}>{result.status}</p>
            <p className="guide-v2-checker-result-note">
              مبني على تنظيف كل {env.days} يوماً لبيئة "{env.label}". عدّل الفترة إن كان استخدامك للمكيف أعلى من المعتاد
              (تشغيل شبه دائم في الصيف يحتاج فترات أقصر).
            </p>
          </div>
          <button
            type="button"
            className="guide-v2-checker-chip"
            style={{ marginTop: 'var(--space-4)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
            onClick={() => downloadIcs(result.nextDate)}
          >
            <DownloadSimple size={16} weight="bold" aria-hidden="true" />
            حمّل تذكيراً لتقويمك (.ics)
          </button>
        </>
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>أدخل تاريخ آخر تنظيف لحساب موعدك القادم.</p>
        </div>
      )}
    </div>
  );
}
