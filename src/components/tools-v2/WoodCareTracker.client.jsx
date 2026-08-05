"use client";

import { useEffect, useMemo, useState } from 'react';
import { Sparkle, DownloadSimple } from '@phosphor-icons/react';

// Interval days per environment — synthesized from converging, sourced recommendations: general
// polish every 4 months (2-3×/year) for normal indoor conditions, more frequent dusting/checks in
// dry climates (cracking risk) or humid ones (swelling/mold risk). See sources on the page.
const ENVIRONMENTS = [
  { id: 'normal', label: 'عادية (منزل مكيّف)', days: 120 },
  { id: 'dry', label: 'جافة جداً (صحراوية)', days: 75 },
  { id: 'humid', label: 'رطبة (ساحلية)', days: 60 },
];

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d;
}
function formatArabicDate(d) {
  return d.toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
}
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
    'PRODID:-//miqatona.com//Wood Furniture Care//AR',
    'BEGIN:VEVENT',
    `UID:wood-care-${dt}@miqatona.com`,
    `DTSTAMP:${dt}T000000Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    'SUMMARY:تذكير: عناية دورية بالأثاث الخشبي',
    'DESCRIPTION:نظّف الغبار جيداً ولمّع الأثاث الخشبي، وافحص المفصلات والأرجل.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'تذكير-عناية-الأثاث-الخشبي.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function WoodCareTracker() {
  const [lastCare, setLastCare] = useState('');
  const [envId, setEnvId] = useState('normal');
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => { setMaxDate(new Date().toISOString().slice(0, 10)); }, []);

  const env = ENVIRONMENTS.find((e) => e.id === envId);

  const result = useMemo(() => {
    if (!lastCare) return null;
    const nextDate = addDays(lastCare, env.days);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((nextDate - today) / (1000 * 60 * 60 * 24));
    let tone = 'is-good';
    let status = `موعدك القادم ${formatArabicDate(nextDate)}`;
    if (diffDays < 0) { tone = 'is-bad'; status = `متأخر — كان موعدك ${formatArabicDate(nextDate)}`; }
    else if (diffDays <= 14) { tone = 'is-warn'; status = `قريب — موعدك ${formatArabicDate(nextDate)}`; }
    return { nextDate, tone, status };
  }, [lastCare, env]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Sparkle size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب موعد العناية القادمة</p>
          <p className="guide-v2-checker-sub">أدخل تاريخ آخر تلميع ونوع بيئتك</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="wc-last-care">تاريخ آخر تنظيف عميق أو تلميع</label>
        <input id="wc-last-care" type="date" value={lastCare} onChange={(e) => setLastCare(e.target.value)} max={maxDate || undefined} />
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
              مبني على عناية كل {env.days} يوماً لبيئة "{env.label}". قطع معرّضة لاستخدام يومي مكثف
              (طاولة طعام، مكتب) قد تحتاج فحصاً أقرب من هذه الفترة.
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
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>أدخل تاريخ آخر عناية لحساب موعدك القادم.</p>
        </div>
      )}
    </div>
  );
}
