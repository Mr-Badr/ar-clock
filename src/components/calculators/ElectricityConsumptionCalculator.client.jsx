"use client";

import { useMemo, useState } from 'react';
import { Check } from '@phosphor-icons/react';

// Watts and typical daily-usage hours are realistic STARTING points (widely-cited household
// figures, cross-checked against goodcalculators.com / gridhacker.com / energyusecalculator.com
// appliance tables), not fixed universal truths — every value below is user-editable in the UI.
// Two households with the same appliance can have very different real wattage (device age,
// efficiency rating, local voltage) and very different daily hours, so a single hardcoded number
// per appliance was never a valid estimate on its own (owner correction, 2026-08-01).
const APPLIANCE_DEFAULTS = [
  { id: 'fridge', label: 'ثلاجة منزلية', watts: 150, hours: 24 },
  { id: 'lighting', label: 'إضاءة المنزل', watts: 150, hours: 6 },
  { id: 'tv', label: 'تلفزيون', watts: 120, hours: 5 },
  { id: 'router', label: 'راوتر وأجهزة صغيرة', watts: 20, hours: 24 },
  { id: 'window-ac', label: 'مكيف شباك', watts: 900, hours: 8 },
  { id: 'split-ac', label: 'مكيف سبليت 1.5 طن', watts: 1500, hours: 8 },
  { id: 'central-ac', label: 'مكيف مركزي', watts: 3500, hours: 8 },
  { id: 'water-heater', label: 'سخان مياه كهربائي', watts: 3000, hours: 2 },
  { id: 'washer', label: 'غسالة ملابس', watts: 500, hours: 1 },
  { id: 'dryer', label: 'نشافة ملابس', watts: 3000, hours: 1 },
  { id: 'pump', label: 'مضخة مياه', watts: 750, hours: 1 },
  { id: 'oven', label: 'فرن كهربائي', watts: 2000, hours: 1 },
  { id: 'microwave', label: 'ميكروويف', watts: 1000, hours: 0.5 },
  { id: 'iron', label: 'مكواة', watts: 1200, hours: 0.5 },
  { id: 'vacuum', label: 'مكنسة كهربائية', watts: 1200, hours: 0.3 },
  { id: 'custom', label: 'جهاز آخر (أدخل يدوياً)', watts: 100, hours: 1 },
];

const DAYS_PER_MONTH = 30;

function fmt(n, digits = 0) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

function defaultValues() {
  const init = {};
  APPLIANCE_DEFAULTS.forEach((a) => {
    init[a.id] = { watts: String(a.watts), hours: String(a.hours), qty: '1' };
  });
  return init;
}

export default function ElectricityConsumptionCalculator() {
  const [selected, setSelected] = useState(() => new Set(['fridge', 'lighting', 'tv', 'router']));
  const [values, setValues] = useState(defaultValues);
  const [tariff, setTariff] = useState('0.3');

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateValue(id, field, val) {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  }

  const breakdown = useMemo(() => {
    return APPLIANCE_DEFAULTS
      .filter((a) => selected.has(a.id))
      .map((a) => {
        const v = values[a.id] || {};
        const watts = Math.max(0, Number(v.watts) || 0);
        const hours = Math.max(0, Number(v.hours) || 0);
        const qty = Math.max(1, Number(v.qty) || 1);
        const dailyWh = watts * hours * qty;
        return { ...a, watts, hours, qty, dailyWh };
      })
      .sort((a, b) => b.dailyWh - a.dailyWh);
  }, [selected, values]);

  const dailyWattHours = breakdown.reduce((sum, a) => sum + a.dailyWh, 0);
  const monthlyKwh = (dailyWattHours * DAYS_PER_MONTH) / 1000;
  const rate = Math.max(0, Number(tariff) || 0);
  const estimatedCost = monthlyKwh * rate;
  const maxDailyWh = breakdown.length ? breakdown[0].dailyWh : 0;

  return (
    <div aria-label="حاسبة استهلاك وفاتورة الكهرباء">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" /> قيم قابلة للتعديل بالكامل
        </span>
      </div>

      <div className="tool-v2-mini-block-head">
        <span>اختر أجهزتك، وعدّل الواط والساعات لتطابق جهازك فعلياً</span>
      </div>

      <div className="guide-v2-checker-list" role="group" aria-label="الأجهزة المنزلية">
        {APPLIANCE_DEFAULTS.map((a) => {
          const active = selected.has(a.id);
          return (
            <button
              key={a.id}
              type="button"
              className={`guide-v2-checker-item${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => toggle(a.id)}
            >
              <span className="guide-v2-checker-item-box" aria-hidden="true">
                {active ? <Check size={14} weight="bold" /> : null}
              </span>
              <span className="guide-v2-checker-item-label">{a.label}</span>
              <span className="guide-v2-checker-item-watt">
                {values[a.id]?.watts || a.watts} واط × {values[a.id]?.hours || a.hours} س
              </span>
            </button>
          );
        })}
      </div>

      {breakdown.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          {breakdown.map((a) => (
            <div
              key={a.id}
              style={{
                padding: 'var(--space-3)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{a.label}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{fmt(a.dailyWh / 1000, 2)} ك.و.س/يوم</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div className="tool-v2-rebar-row-field">
                  <label htmlFor={`watts-${a.id}`}>واط</label>
                  <input
                    id={`watts-${a.id}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={values[a.id]?.watts ?? ''}
                    onChange={(e) => updateValue(a.id, 'watts', e.target.value)}
                  />
                </div>
                <div className="tool-v2-rebar-row-field">
                  <label htmlFor={`hours-${a.id}`}>ساعة/يوم</label>
                  <input
                    id={`hours-${a.id}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={values[a.id]?.hours ?? ''}
                    onChange={(e) => updateValue(a.id, 'hours', e.target.value)}
                  />
                </div>
                <div className="tool-v2-rebar-row-field">
                  <label htmlFor={`qty-${a.id}`}>العدد</label>
                  <input
                    id={`qty-${a.id}`}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={values[a.id]?.qty ?? ''}
                    onChange={(e) => updateValue(a.id, 'qty', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {breakdown.length ? (
        <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-5)' }}>
          <span>أكبر الأجهزة استهلاكاً</span>
        </div>
      ) : null}
      {breakdown.length ? (
        <div className="tool-v2-breakdown-list" aria-hidden="true">
          {breakdown.slice(0, 6).map((a) => {
            const pct = maxDailyWh > 0 ? Math.max(4, Math.round((a.dailyWh / maxDailyWh) * 100)) : 0;
            return (
              <div key={a.id} className="tool-v2-breakdown-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span className="tool-v2-breakdown-label">{a.label}</span>
                  <span className="tool-v2-breakdown-value">{fmt(a.dailyWh / 1000, 2)} ك.و.س/يوم</span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'var(--bg-surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: '999px', background: 'var(--accent)' }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="tool-v2-field" style={{ marginTop: 'var(--space-5)' }}>
        <label htmlFor="tariff-value">سعر الكيلوواط/ساعة (بعملتك)</label>
        <input
          id="tariff-value"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={tariff}
          onChange={(e) => setTariff(e.target.value)}
          placeholder="0.30"
        />
      </div>

      <div className="tool-v2-result-hero" aria-live="polite" style={{ marginTop: 'var(--space-4)' }}>
        <span className="tool-v2-result-label">التكلفة الشهرية التقديرية</span>
        <div className="tool-v2-result-value">{fmt(estimatedCost, 1)}</div>
        <div className="tool-v2-result-stat-row">
          <span className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-value">{fmt(monthlyKwh)}</span>
            <span className="tool-v2-result-stat-label">كيلوواط/ساعة شهرياً</span>
          </span>
          <span className="tool-v2-result-stat-sep" aria-hidden="true">×</span>
          <span className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-value">{fmt(rate, 2)}</span>
            <span className="tool-v2-result-stat-label">سعر الوحدة</span>
          </span>
        </div>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.7, marginTop: 'var(--space-3)' }}>
        القيم المعبأة تلقائياً نقطة بداية واقعية فقط — عدّل الواط والساعات لتطابق جهازك الفعلي (تجده
        عادة على ملصق الجهاز نفسه أو دليل المستخدم)، فاستهلاكك الحقيقي يختلف عن جهاز آخر من نفس
        النوع حسب العمر والكفاءة وعدد ساعات استخدامك الفعلية. أدخل سعر الوحدة من فاتورتك الأخيرة
        للحصول على تقدير أدق.
      </p>
    </div>
  );
}
