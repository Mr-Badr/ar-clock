"use client";

import { useMemo, useState } from 'react';
import { ArrowsLeftRight } from '@phosphor-icons/react';

// Standard, textbook conversion factors — all expressed "to Watts" so any pair converts through
// one common base. HP here is mechanical horsepower (745.7 W), the figure used in electrical
// motor/generator sizing contexts (as opposed to metric horsepower at 735.5 W).
const POWER_UNITS = [
  { id: 'w', label: 'واط (W)', toWatts: 1 },
  { id: 'kw', label: 'كيلو واط (kW)', toWatts: 1000 },
  { id: 'hp', label: 'حصان (HP)', toWatts: 745.7 },
  { id: 'btu', label: 'BTU/ساعة', toWatts: 0.29307107 },
  { id: 'ton', label: 'طن تبريد', toWatts: 3516.85 },
];

function fmt(n, digits = 2) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

// Gulf standard circuit voltages: 230V single-phase (most home circuits), 400V three-phase
// (larger loads — central AC, workshops). Three-phase amps use the standard √3 line factor.
const VOLTAGE_OPTIONS = [
  { id: '230-1p', label: '230 فولت — أحادي الطور', volts: 230, phases: 1 },
  { id: '400-3p', label: '400 فولت — ثلاثي الطور', volts: 400, phases: 3 },
];
const SQRT3 = 1.7320508;

export default function ElectricalUnitConverter() {
  // Block A — power unit converter
  const [fromUnit, setFromUnit] = useState('kw');
  const [toUnit, setToUnit] = useState('hp');
  const [powerValue, setPowerValue] = useState('5');

  const powerResult = useMemo(() => {
    const num = Math.max(0, Number(powerValue) || 0);
    const from = POWER_UNITS.find((u) => u.id === fromUnit);
    const to = POWER_UNITS.find((u) => u.id === toUnit);
    if (!from || !to) return null;
    const watts = num * from.toWatts;
    return watts / to.toWatts;
  }, [powerValue, fromUnit, toUnit]);

  function swapPowerUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  // Block B — Watts/kW ↔ Amps, with a voltage + power-factor assumption
  const [ampsDirection, setAmpsDirection] = useState('kw-to-amps');
  const [kwValue, setKwValue] = useState('1.5');
  const [ampsValue, setAmpsValue] = useState('10');
  const [voltageId, setVoltageId] = useState('230-1p');
  const [powerFactor, setPowerFactor] = useState('1');

  const voltage = VOLTAGE_OPTIONS.find((v) => v.id === voltageId) ?? VOLTAGE_OPTIONS[0];
  const pf = Math.min(1, Math.max(0.1, Number(powerFactor) || 1));

  const ampsResult = useMemo(() => {
    const lineFactor = voltage.phases === 3 ? SQRT3 : 1;
    if (ampsDirection === 'kw-to-amps') {
      const kw = Math.max(0, Number(kwValue) || 0);
      const watts = kw * 1000;
      const amps = watts / (lineFactor * voltage.volts * pf);
      return { amps, kw, kva: kw / pf };
    }
    const amps = Math.max(0, Number(ampsValue) || 0);
    const watts = amps * lineFactor * voltage.volts * pf;
    const kw = watts / 1000;
    return { amps, kw, kva: kw / pf };
  }, [ampsDirection, kwValue, ampsValue, voltage, pf]);

  return (
    <div aria-label="محول وحدات الكهرباء">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" /> معاملات تحويل قياسية
        </span>
      </div>

      <div className="tool-v2-mini-block-head">
        <span>تحويل وحدات القدرة</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="power-value">القيمة</label>
        <input
          id="power-value"
          type="number"
          inputMode="decimal"
          min="0"
          value={powerValue}
          onChange={(e) => setPowerValue(e.target.value)}
          placeholder="5"
        />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="power-from">من</label>
          <select id="power-from" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {POWER_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
        <div className="tool-v2-field">
          <label htmlFor="power-to">إلى</label>
          <select id="power-to" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {POWER_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
      </div>

      <button type="button" className="tool-v2-swap-btn" onClick={swapPowerUnits}>
        <span className="tool-v2-swap-btn-icon" aria-hidden="true">
          <ArrowsLeftRight size={13} weight="bold" />
        </span>
        عكس الاتجاه
      </button>

      {powerResult !== null ? (
        <div className="tool-v2-result-hero" aria-live="polite" style={{ marginTop: 'var(--space-4)' }}>
          <span className="tool-v2-result-label">النتيجة</span>
          <div className="tool-v2-result-value">{fmt(powerResult)} {POWER_UNITS.find((u) => u.id === toUnit)?.label}</div>
          <div className="tool-v2-result-meta">
            {fmt(Number(powerValue) || 0)} {POWER_UNITS.find((u) => u.id === fromUnit)?.label} = {fmt(powerResult)} {POWER_UNITS.find((u) => u.id === toUnit)?.label}
          </div>
        </div>
      ) : null}

      <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-6)' }}>
        <span>تحويل بين الواط والأمبير وكيلو فولت أمبير (kVA)</span>
      </div>

      <div className="tool-v2-checker-options" role="group" aria-label="اتجاه التحويل" style={{ marginBottom: 'var(--space-3)' }}>
        <button
          type="button"
          className={`guide-v2-checker-chip${ampsDirection === 'kw-to-amps' ? ' is-active' : ''}`}
          aria-pressed={ampsDirection === 'kw-to-amps'}
          onClick={() => setAmpsDirection('kw-to-amps')}
        >
          من كيلوواط إلى أمبير
        </button>
        <button
          type="button"
          className={`guide-v2-checker-chip${ampsDirection === 'amps-to-kw' ? ' is-active' : ''}`}
          aria-pressed={ampsDirection === 'amps-to-kw'}
          onClick={() => setAmpsDirection('amps-to-kw')}
        >
          من أمبير إلى كيلوواط
        </button>
      </div>

      {ampsDirection === 'kw-to-amps' ? (
        <div className="tool-v2-field">
          <label htmlFor="kw-value">الحمل (كيلو واط)</label>
          <input id="kw-value" type="number" inputMode="decimal" min="0" value={kwValue} onChange={(e) => setKwValue(e.target.value)} placeholder="1.5" />
        </div>
      ) : (
        <div className="tool-v2-field">
          <label htmlFor="amps-value">التيار (أمبير)</label>
          <input id="amps-value" type="number" inputMode="decimal" min="0" value={ampsValue} onChange={(e) => setAmpsValue(e.target.value)} placeholder="10" />
        </div>
      )}

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="voltage-select">جهد الدائرة</label>
          <select id="voltage-select" value={voltageId} onChange={(e) => setVoltageId(e.target.value)}>
            {VOLTAGE_OPTIONS.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </div>
        <div className="tool-v2-field">
          <label htmlFor="pf-value">معامل القدرة</label>
          <input id="pf-value" type="number" inputMode="decimal" min="0.1" max="1" step="0.05" value={powerFactor} onChange={(e) => setPowerFactor(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-result-hero" aria-live="polite" style={{ marginTop: 'var(--space-4)' }}>
        <span className="tool-v2-result-label">النتيجة</span>
        {ampsDirection === 'kw-to-amps' ? (
          <>
            <div className="tool-v2-result-value">{fmt(ampsResult.amps)} أمبير</div>
            <div className="tool-v2-result-meta">{fmt(ampsResult.kw)} كيلو واط = {fmt(ampsResult.kva)} kVA عند {voltage.label}، معامل قدرة {fmt(pf, 2)}</div>
          </>
        ) : (
          <>
            <div className="tool-v2-result-value">{fmt(ampsResult.kw)} كيلو واط</div>
            <div className="tool-v2-result-meta">{fmt(ampsResult.amps)} أمبير = {fmt(ampsResult.kva)} kVA عند {voltage.label}، معامل قدرة {fmt(pf, 2)}</div>
          </>
        )}
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.7, marginTop: 'var(--space-3)' }}>
        معامل القدرة الافتراضي 1 يناسب الأحمال المقاومة البحتة (إضاءة، تسخين). للمكيفات والمحركات
        استخدم قيمة واقعية بين 0.8 و0.95 حسب بيانات الجهاز. كيلو فولت أمبير (kVA) هي القدرة الظاهرية
        (kW ÷ معامل القدرة) — الرقم الذي تحتاجه فعلياً لاختيار حجم المولد أو المحول المناسب.
      </p>
    </div>
  );
}
