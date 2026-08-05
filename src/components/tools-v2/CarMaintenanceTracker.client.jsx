"use client";

import { useEffect, useMemo, useState } from 'react';
import { Wrench, DownloadSimple } from '@phosphor-icons/react';

// Interval data synthesized from converging manufacturer/workshop guidance found across multiple
// sourced Arabic guides (see sources on the page) — general consensus figures, not any single car
// model's exact schedule. Real rule (kia.com/aljabr, mismarapp.com, autof7.com): "whichever comes
// first" between distance and time — the component below implements exactly that, not just one axis.
const SERVICES = [
  { id: 'oil', label: 'زيت المحرك والفلتر', kmInterval: 10000, monthInterval: 6 },
  { id: 'tires', label: 'فحص/تبديل الإطارات', kmInterval: 60000, monthInterval: null },
  { id: 'coolant', label: 'سائل التبريد (الرديتر)', kmInterval: 50000, monthInterval: 36 },
  { id: 'brake-fluid', label: 'زيت الفرامل', kmInterval: null, monthInterval: 60 },
];

const PACE_CHIPS = [
  { id: 'light', label: 'خفيف (~800 كم/شهر)', km: 800 },
  { id: 'average', label: 'متوسط (~1500 كم/شهر)', km: 1500 },
  { id: 'heavy', label: 'كثيف (~3000 كم/شهر)', km: 3000 },
];

function addMonths(dateStr, months) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setMonth(d.getMonth() + months);
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
function downloadIcs(nextDate, serviceLabel) {
  const dt = toIcsDate(nextDate);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//miqatona.com//Car Maintenance Tracker//AR',
    'BEGIN:VEVENT',
    `UID:car-maint-${dt}-${Math.random().toString(36).slice(2, 8)}@miqatona.com`,
    `DTSTAMP:${dt}T000000Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    `SUMMARY:تذكير صيانة السيارة: ${serviceLabel}`,
    'DESCRIPTION:موعد الصيانة القادم المقدّر بناءً على معدل قيادتك الشهري.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'تذكير-صيانة-السيارة.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function CarMaintenanceTracker() {
  const [serviceId, setServiceId] = useState('oil');
  const [lastDate, setLastDate] = useState('');
  const [lastOdo, setLastOdo] = useState('');
  const [paceId, setPaceId] = useState('average');
  const [customKm, setCustomKm] = useState('');
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => { setMaxDate(new Date().toISOString().slice(0, 10)); }, []);

  const service = SERVICES.find((s) => s.id === serviceId);
  const pace = PACE_CHIPS.find((p) => p.id === paceId);
  const monthlyKm = customKm ? Number(customKm) : pace.km;

  const result = useMemo(() => {
    if (!lastDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDateObj = new Date(`${lastDate}T00:00:00`);
    const monthsElapsed = Math.max(0, (today - lastDateObj) / (1000 * 60 * 60 * 24 * 30.44));

    let dateByTime = null;
    if (service.monthInterval) {
      dateByTime = addMonths(lastDate, service.monthInterval);
    }

    let dateByKm = null;
    if (service.kmInterval && lastOdo && monthlyKm > 0) {
      const estimatedCurrentOdo = Number(lastOdo) + monthsElapsed * monthlyKm;
      const nextDueOdo = Number(lastOdo) + service.kmInterval;
      const kmRemaining = nextDueOdo - estimatedCurrentOdo;
      const monthsRemaining = kmRemaining / monthlyKm;
      dateByKm = new Date(today);
      dateByKm.setDate(dateByKm.getDate() + Math.round(monthsRemaining * 30.44));
    }

    let nextDate;
    let reason;
    if (dateByTime && dateByKm) {
      if (dateByTime <= dateByKm) { nextDate = dateByTime; reason = `حسب الزمن (كل ${service.monthInterval} شهراً)`; }
      else { nextDate = dateByKm; reason = `حسب المسافة (كل ${service.kmInterval.toLocaleString('en-US')} كم)`; }
    } else if (dateByTime) {
      nextDate = dateByTime;
      reason = `حسب الزمن (كل ${service.monthInterval} شهراً)`;
    } else if (dateByKm) {
      nextDate = dateByKm;
      reason = `حسب المسافة (كل ${service.kmInterval.toLocaleString('en-US')} كم)`;
    } else {
      return null;
    }

    const diffDays = Math.round((nextDate - today) / (1000 * 60 * 60 * 24));
    let tone = 'is-good';
    let status = `موعدك القادم ${formatArabicDate(nextDate)}`;
    if (diffDays < 0) { tone = 'is-bad'; status = `متأخر — كان موعدك ${formatArabicDate(nextDate)}`; }
    else if (diffDays <= 14) { tone = 'is-warn'; status = `قريب — موعدك ${formatArabicDate(nextDate)}`; }
    return { nextDate, tone, status, reason };
  }, [lastDate, lastOdo, monthlyKm, service]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Wrench size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب موعد الصيانة القادمة</p>
          <p className="guide-v2-checker-sub">اختر نوع الصيانة، وأدخل بيانات آخر مرة</p>
        </div>
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="نوع الصيانة" style={{ marginBottom: 'var(--space-4)' }}>
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`guide-v2-checker-chip${serviceId === s.id ? ' is-active' : ''}`}
            aria-pressed={serviceId === s.id}
            onClick={() => setServiceId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="cm-last-date">تاريخ آخر صيانة من هذا النوع</label>
        <input id="cm-last-date" type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} max={maxDate || undefined} />
      </div>

      {service.kmInterval ? (
        <>
          <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
            <label htmlFor="cm-last-odo">قراءة العداد وقتها (كم)</label>
            <input id="cm-last-odo" type="number" inputMode="numeric" min="0" placeholder="مثال: 85000" value={lastOdo} onChange={(e) => setLastOdo(e.target.value)} />
          </div>

          <p className="guide-v2-checker-sub" style={{ marginBottom: 'var(--space-2)' }}>معدل قيادتك الشهري</p>
          <div className="guide-v2-checker-options" role="group" aria-label="معدل القيادة الشهري" style={{ marginBottom: 'var(--space-3)' }}>
            {PACE_CHIPS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`guide-v2-checker-chip${paceId === p.id && !customKm ? ' is-active' : ''}`}
                aria-pressed={paceId === p.id && !customKm}
                onClick={() => { setPaceId(p.id); setCustomKm(''); }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
            <label htmlFor="cm-custom-km">أو أدخل رقماً مخصصاً (كم/شهر)</label>
            <input id="cm-custom-km" type="number" inputMode="numeric" min="0" placeholder="اختياري" value={customKm} onChange={(e) => setCustomKm(e.target.value)} />
          </div>
        </>
      ) : null}

      {result ? (
        <>
          <div className={`guide-v2-checker-result ${result.tone}`} aria-live="polite">
            <p className="guide-v2-checker-result-label">الحالة</p>
            <p className="guide-v2-checker-result-value" style={{ fontSize: '1.05rem' }}>{result.status}</p>
            <p className="guide-v2-checker-result-note">تقدير {result.reason} — تاريخ تقريبي وليس دقيقاً، يعتمد على ثبات معدل قيادتك.</p>
          </div>
          <button
            type="button"
            className="guide-v2-checker-chip"
            style={{ marginTop: 'var(--space-4)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
            onClick={() => downloadIcs(result.nextDate, service.label)}
          >
            <DownloadSimple size={16} weight="bold" aria-hidden="true" />
            حمّل تذكيراً لتقويمك (.ics)
          </button>
        </>
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>
            {service.kmInterval ? 'أدخل التاريخ وقراءة العداد لحساب موعدك القادم.' : 'أدخل التاريخ لحساب موعدك القادم.'}
          </p>
        </div>
      )}
    </div>
  );
}
