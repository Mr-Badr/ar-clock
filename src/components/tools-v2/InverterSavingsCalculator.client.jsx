"use client";

import { useMemo, useState } from 'react';
import { Lightning } from '@phosphor-icons/react';

import { NumberTicker } from '@/components/ui/number-ticker';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';

// Average running power per ton, derived from a commonly-cited real-world example (1.5-ton unit,
// 8h/day: ~9 kWh/day conventional vs ~5 kWh/day inverter) — see sources on the page. Presented as
// an estimate, not a per-device spec sheet number, since actual draw depends on the unit's own
// EER/SEER rating and outdoor temperature.
const KW_PER_TON_CONVENTIONAL = 0.75;
const KW_PER_TON_INVERTER = 0.4167;
const DAYS_PER_MONTH = 30;
const TON_OPTIONS = [1, 1.5, 2, 2.5, 3];

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function InverterSavingsCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [ton, setTon] = useState(1.5);
  const [hours, setHours] = useState('8');
  const [tariff, setTariff] = useState('0.18');

  const currency = GULF_CURRENCIES.find((c) => c.code === countryCode) || GULF_CURRENCIES[0];

  const { monthlyConventional, monthlyInverter, monthlySavings, annualSavings, fiveYearSavings } = useMemo(() => {
    const h = Math.max(0, Number(hours) || 0);
    const price = Math.max(0, Number(tariff) || 0);
    const dailyConventional = ton * KW_PER_TON_CONVENTIONAL * h;
    const dailyInverter = ton * KW_PER_TON_INVERTER * h;
    const mConventional = dailyConventional * DAYS_PER_MONTH * price;
    const mInverter = dailyInverter * DAYS_PER_MONTH * price;
    const mSavings = Math.max(0, mConventional - mInverter);
    return {
      monthlyConventional: mConventional,
      monthlyInverter: mInverter,
      monthlySavings: mSavings,
      annualSavings: mSavings * 12,
      fiveYearSavings: mSavings * 12 * 5,
    };
  }, [ton, hours, tariff]);

  const maxCost = Math.max(monthlyConventional, 1);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Lightning size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب توفيرك بالتحويل إلى انفرتر</p>
          <p className="guide-v2-checker-sub">أداة تعمل لأي دولة خليجية — أدخل بيانات مكيفك وتعرفة بلدك فعلياً</p>
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

      <div className="guide-v2-checker-options" role="group" aria-label="حجم المكيف بالطن">
        {TON_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            className={`guide-v2-checker-chip${ton === t ? ' is-active' : ''}`}
            aria-pressed={ton === t}
            onClick={() => setTon(t)}
          >
            {t} طن
          </button>
        ))}
      </div>

      <div className="tool-v2-field-row-pair" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="tool-v2-field">
          <label htmlFor="inv-hours">ساعات التشغيل يومياً</label>
          <input
            id="inv-hours"
            type="number"
            inputMode="decimal"
            min="0"
            max="24"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="8"
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="inv-tariff">سعر الكيلوواط/ساعة ({currency.short})</label>
          <input
            id="inv-tariff"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={tariff}
            onChange={(e) => setTariff(e.target.value)}
            placeholder="0.18"
          />
        </div>
      </div>

      <div className="tool-v2-chart-card" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="tool-v2-chart-head">
          <h3>فاتورتك الشهرية: عادي مقابل انفرتر</h3>
          <p>نفس الحجم، نفس ساعات التشغيل — الفرق فقط في نوع الضاغط.</p>
        </div>
        <div className="tool-v2-hbar-list">
          <div className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">عادي</span>
            <div className="tool-v2-hbar-track">
              <div className="tool-v2-hbar-fill" style={{ width: `${(monthlyConventional / maxCost) * 100}%`, background: 'var(--red-text)' }} />
            </div>
            <span className="tool-v2-hbar-value">{fmt(monthlyConventional)} {currency.short}</span>
          </div>
          <div className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">انفرتر</span>
            <div className="tool-v2-hbar-track">
              <div className="tool-v2-hbar-fill" style={{ width: `${(monthlyInverter / maxCost) * 100}%`, background: 'var(--green-text)' }} />
            </div>
            <span className="tool-v2-hbar-value">{fmt(monthlyInverter)} {currency.short}</span>
          </div>
        </div>
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite">
        <p className="guide-v2-checker-result-label">توفيرك التقديري</p>
        <p className="guide-v2-checker-result-value" style={{ direction: 'ltr', textAlign: 'end', display: 'block' }}>
          <NumberTicker value={Math.round(monthlySavings)} style={{ color: 'var(--green-text)' }} /> {currency.short}/شهرياً
        </p>
        <p className="guide-v2-checker-result-note">
          يعني ذلك نحو {fmt(annualSavings)} {currency.short} سنوياً، ونحو {fmt(fiveYearSavings)} {currency.short} على مدى
          5 سنوات — مبلغ يغطي غالباً فرق سعر الشراء الأعلى للانفرتر خلال السنوات الأولى من عمره فقط.
          الأرقام تقديرية بمعدل استهلاك شائع (نحو {KW_PER_TON_CONVENTIONAL} كيلوواط لكل طن تبريد للعادي، مقابل نحو
          {' '}{KW_PER_TON_INVERTER.toFixed(2)} كيلوواط للانفرتر) وقد تختلف حسب كفاءة جهازك الفعلية ودرجة الحرارة الخارجية.
        </p>
      </div>
    </div>
  );
}
