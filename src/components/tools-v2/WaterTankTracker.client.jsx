"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, DownloadSimple } from '@phosphor-icons/react';

// Base interval: 180 days (6 months) is the minimum widely-cited rule for residential water
// tanks — twice yearly, before summer and before winter. Adjustments below are directional
// (more people / metal tanks need more frequent checks), not a separately sourced figure —
// kept small and clearly explained rather than presented as its own precise standard.
const TANK_TYPES = [
  { id: 'plastic', label: 'بلاستيك (بولي إيثيلين)', adjustDays: 0 },
  { id: 'fiberglass', label: 'فايبرجلاس', adjustDays: 0 },
  { id: 'metal', label: 'معدني (ستانلس أو مجلفن)', adjustDays: -15 },
];
const HOUSEHOLD_SIZES = [
  { id: 'small', label: '1-3 أفراد', adjustDays: 15 },
  { id: 'mid', label: '4-6 أفراد', adjustDays: 0 },
  { id: 'large', label: '7 أفراد فأكثر', adjustDays: -15 },
];
const BASE_DAYS = 180;

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
    'PRODID:-//miqatona.com//Water Tank Cleaning//AR',
    'BEGIN:VEVENT',
    `UID:water-tank-${dt}@miqatona.com`,
    `DTSTAMP:${dt}T000000Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    'SUMMARY:تذكير: تنظيف خزان المياه',
    'DESCRIPTION:موعد التنظيف الدوري المقترح لخزان المياه — نظّف الخزان وافحص الأغطية والصمامات.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'تذكير-تنظيف-خزان-المياه.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function WaterTankTracker() {
  const [lastCleaned, setLastCleaned] = useState('');
  const [typeId, setTypeId] = useState('plastic');
  const [sizeId, setSizeId] = useState('mid');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => { setMaxDate(new Date().toISOString().slice(0, 10)); }, []);

  const type = TANK_TYPES.find((t) => t.id === typeId);
  const size = HOUSEHOLD_SIZES.find((s) => s.id === sizeId);
  const intervalDays = Math.max(90, BASE_DAYS + type.adjustDays + size.adjustDays);

  const result = useMemo(() => {
    if (!lastCleaned) return null;
    const nextDate = addDays(lastCleaned, intervalDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((nextDate - today) / (1000 * 60 * 60 * 24));
    let tone = 'is-good';
    let status = `موعدك القادم ${formatArabicDate(nextDate)}`;
    if (diffDays < 0) { tone = 'is-bad'; status = `متأخر — كان موعدك ${formatArabicDate(nextDate)}`; }
    else if (diffDays <= 14) { tone = 'is-warn'; status = `قريب — موعدك ${formatArabicDate(nextDate)}`; }
    return { nextDate, tone, status };
  }, [lastCleaned, intervalDays]);

  return (
    <div className="guide-v2-checker" aria-label="متتبع موعد تنظيف خزان المياه">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><CalendarCheck size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب موعد تنظيف الخزان القادم</p>
          <p className="guide-v2-checker-sub">أدخل تاريخ آخر تنظيف ونوع خزانك وعدد أفراد أسرتك</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="tank-last-cleaned">تاريخ آخر تنظيف للخزان</label>
        <input id="tank-last-cleaned" type="date" value={lastCleaned} onChange={(e) => setLastCleaned(e.target.value)} max={maxDate || undefined} />
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>نوع الخزان</p>
      <div className="guide-v2-checker-options" role="group" aria-label="نوع الخزان">
        {TANK_TYPES.map((t) => (
          <button key={t.id} type="button" className={`guide-v2-checker-chip${typeId === t.id ? ' is-active' : ''}`} aria-pressed={typeId === t.id} onClick={() => setTypeId(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 'var(--space-4) 0 var(--space-2)' }}>عدد أفراد الأسرة</p>
      <div className="guide-v2-checker-options" role="group" aria-label="عدد أفراد الأسرة">
        {HOUSEHOLD_SIZES.map((s) => (
          <button key={s.id} type="button" className={`guide-v2-checker-chip${sizeId === s.id ? ' is-active' : ''}`} aria-pressed={sizeId === s.id} onClick={() => setSizeId(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {result ? (
        <>
          <div className={`guide-v2-checker-result ${result.tone}`} aria-live="polite">
            <p className="guide-v2-checker-result-label">الحالة</p>
            <p className="guide-v2-checker-result-value" style={{ fontSize: '1.05rem' }}>{result.status}</p>
            <p className="guide-v2-checker-result-note">
              مبني على تنظيف كل {intervalDays} يوماً تقريباً حسب نوع خزانك وعدد أفراد أسرتك — القاعدة العامة
              المتفق عليها هي مرتين سنوياً كحد أدنى (قبل الصيف وقبل الشتاء).
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
