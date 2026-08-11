"use client";

import { useState } from 'react';
import { Drop } from '@phosphor-icons/react';

// Formula: capacity (L) = people × daily wastewater rate (L/person/day) × retention days.
// Daily rate default 120 L/person/day sits inside the real documented range (95-150 L/person/day
// including kitchen drainage) — editable since real household usage varies. Retention days
// default 15 sits inside the real documented range (10-30 days before pumping is needed) —
// editable since this is a genuine design choice (more days = bigger tank, less frequent pumping)
// not a fixed constant. See keyword-research/septic-tank-hub/DECISION.md for sources.
const BUCKETS = [
  { id: '1-2', label: '1-2', people: 2 },
  { id: '3-4', label: '3-4', people: 4 },
  { id: '5-6', label: '5-6', people: 6 },
  { id: '7-9', label: '7-9', people: 9 },
  { id: '10+', label: '10+', people: 13 },
];

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function SepticTankSizeChecker() {
  const [active, setActive] = useState('3-4');
  const [dailyRate, setDailyRate] = useState('120');
  const [retentionDays, setRetentionDays] = useState(15);

  const bucket = BUCKETS.find((b) => b.id === active);
  const effectiveRate = Math.max(0, Number(dailyRate) || 0);
  const isLarge = active === '10+';

  const dailyLiters = bucket.people * effectiveRate;
  const capacityLiters = dailyLiters * retentionDays;
  const capacityCubicMeters = capacityLiters / 1000;

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Drop size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">ما حجم البيارة المناسب لعائلتك؟</p>
          <p className="guide-v2-checker-sub">اختر عدد أفراد الأسرة وعدّل مدة التفريغ حسب رغبتك</p>
        </div>
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="عدد أفراد الأسرة">
        {BUCKETS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`guide-v2-checker-chip${active === b.id ? ' is-active' : ''}`}
            aria-pressed={active === b.id}
            onClick={() => setActive(b.id)}
          >
            {b.label} أفراد
          </button>
        ))}
      </div>

      <div className="tool-v2-field-row-pair" style={{ marginTop: 'var(--space-3)' }}>
        <div className="tool-v2-field">
          <label htmlFor="septic-daily-rate">استهلاك الفرد اليومي (لتر)</label>
          <input
            id="septic-daily-rate"
            type="number"
            inputMode="decimal"
            min="0"
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
            placeholder="120"
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="septic-retention-days">مدة التفريغ (أيام)</label>
          <div id="septic-retention-days" className="tool-v2-stepper" role="group" aria-label="مدة التفريغ بالأيام">
            <button type="button" className="tool-v2-stepper-btn" onClick={() => setRetentionDays((v) => Math.max(5, v - 5))} aria-label="تقليل">−</button>
            <span className="tool-v2-stepper-val">{retentionDays}</span>
            <button type="button" className="tool-v2-stepper-btn" onClick={() => setRetentionDays((v) => Math.min(30, v + 5))} aria-label="زيادة">+</button>
          </div>
        </div>
      </div>

      <div className="guide-v2-checker-result" aria-live="polite">
        <p className="guide-v2-checker-result-label">السعة المطلوبة تقريباً</p>
        <p className="guide-v2-checker-result-value">
          {isLarge ? `${fmt(capacityCubicMeters)} م³ فأكثر` : `نحو ${fmt(capacityCubicMeters)} م³ (${fmt(capacityLiters)} لتر)`}
        </p>
        <p className="guide-v2-checker-result-note">
          {isLarge
            ? 'لعائلة كبيرة أو مبنى سكنياً صغيراً، راجع مقاولاً متخصصاً لتوزيع السعة على أكثر من بيارة بدل بيارة واحدة ضخمة.'
            : `مبني على ${fmt(effectiveRate)} لتراً للفرد يومياً × ${retentionDays} يوماً قبل التفريغ — عدّل الرقمين حسب استهلاك منزلك الفعلي والمدة التي تفضّل الانتظار بينها قبل استدعاء شركة الشفط.`}
        </p>
      </div>
    </div>
  );
}
