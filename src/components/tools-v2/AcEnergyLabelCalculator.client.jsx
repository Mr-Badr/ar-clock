"use client";

import { useMemo, useState } from 'react';
import { Star } from '@phosphor-icons/react';

import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';

const STAR_OPTIONS = [1, 2, 3, 4, 5, 6];
// Linear approximation between the two officially-cited reference points (1 star ≈ baseline,
// 6 stars ≈ 30% saving) — stated on the page as an illustrative estimate, not an exact per-device
// figure, since SEEC/SASO doesn't publish a single universal per-star percentage.
const PERCENT_PER_STAR_STEP = 6;

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function StarRow({ count }) {
  return (
    <span className="guide-v2-star-row" aria-hidden="true">
      {STAR_OPTIONS.map((i) => (
        <Star key={i} size={18} weight={i <= count ? 'fill' : 'regular'} className={i <= count ? 'is-filled' : ''} />
      ))}
    </span>
  );
}

export default function AcEnergyLabelCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [stars, setStars] = useState(4);
  const [currentCost, setCurrentCost] = useState('150');

  const currency = GULF_CURRENCIES.find((c) => c.code === countryCode) || GULF_CURRENCIES[0];

  const { percent, newCost, saved } = useMemo(() => {
    const cost = Math.max(0, Number(currentCost) || 0);
    const pct = Math.min(30, Math.max(0, (stars - 1) * PERCENT_PER_STAR_STEP));
    const nc = cost * (1 - pct / 100);
    return { percent: pct, newCost: nc, saved: cost - nc };
  }, [stars, currentCost]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Star size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">قارن التكلفة حسب عدد النجوم</p>
          <p className="guide-v2-checker-sub">اختر عدد نجوم الجهاز الذي تفكر بشرائه</p>
        </div>
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="دولتك">
        {GULF_CURRENCIES.map((c) => (
          <button
            key={c.code}
            type="button"
            className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`}
            aria-pressed={countryCode === c.code}
            onClick={() => setCountryCode(c.code)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <CountryFlag code={c.code} label={c.country} />
            {c.country}
          </button>
        ))}
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="عدد النجوم">
        {STAR_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className={`guide-v2-checker-chip${stars === s ? ' is-active' : ''}`}
            aria-pressed={stars === s}
            onClick={() => setStars(s)}
          >
            {s} <StarRow count={s} />
          </button>
        ))}
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-5)' }}>
        <label htmlFor="current-cost">تكلفة تشغيل مكيفك الحالي تقريباً ({currency.short}/شهرياً)</label>
        <input
          id="current-cost"
          type="number"
          inputMode="decimal"
          min="0"
          value={currentCost}
          onChange={(e) => setCurrentCost(e.target.value)}
          placeholder="150"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        <AnimatedCircularProgressBar
          value={percent}
          max={30}
          gaugePrimaryColor="var(--amber)"
          gaugeSecondaryColor="var(--border)"
          className="size-24 text-base hvac-gauge-text"
        />
        <div>
          <StarRow count={stars} />
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-3)' }}>توفير تقديري نحو {percent}٪ من الاستهلاك</p>
        </div>
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite">
        <p className="guide-v2-checker-result-label">تكلفتك التقديرية بجهاز {stars} نجوم</p>
        <p className="guide-v2-checker-result-value" style={{ direction: 'ltr', textAlign: 'end', display: 'block' }}>
          {fmt(newCost)} {currency.short}/شهرياً
        </p>
        <p className="guide-v2-checker-result-note">
          بمعنى توفير نحو {fmt(saved)} {currency.short} شهرياً مقارنة بجهاز نجمة واحدة بنفس تكلفة التشغيل الحالية.
          هذا تقدير تقريبي خطي بين الحدين المعلنين رسمياً من المركز السعودي لكفاءة الطاقة (نجمة واحدة كخط
          أساس، وست نجوم بتوفير يصل لنحو 30٪) — نفس منطق النجوم تقريباً معتمد أيضاً في بطاقة الإمارات
          (ESMA) ودول خليجية أخرى ضمن معيار الخليج الموحد GSO 2530، وإن اختلفت تفاصيل الحساب قليلاً بين
          دولة وأخرى.
        </p>
      </div>
    </div>
  );
}
