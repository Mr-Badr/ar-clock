"use client";

import { useMemo, useState } from 'react';
import { CookingPot } from '@phosphor-icons/react';

// No hardcoded market prices — cost varies too much between countries and cities to state as a
// fixed number and still be "real data" everywhere. Real universal facts only: standard cabinet
// module widths (a genuine carpentry convention, not market-dependent) drive the unit/area count;
// cost (if the user wants it) is a pure multiplication of a price THEY provide from their own
// real quote, never a number we invented.
const MODULE_WIDTHS = [
  { id: '30', label: '30 سم (وحدات ضيقة)', cm: 30 },
  { id: '40', label: '40 سم', cm: 40 },
  { id: '45', label: '45 سم (الأشيع)', cm: 45 },
  { id: '60', label: '60 سم (وحدات عريضة)', cm: 60 },
];
const STANDARD_HEIGHT_M = 0.75; // typical base-cabinet front height, independent of country

function fmt(n, digits = 0) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function KitchenCabinetCostCalculator() {
  const [length, setLength] = useState('4');
  const [moduleId, setModuleId] = useState('45');
  const [pricePerMeter, setPricePerMeter] = useState('');

  const module_ = MODULE_WIDTHS.find((m) => m.id === moduleId);

  const { unitCount, panelArea, totalCost } = useMemo(() => {
    const len = Math.max(0, Number(length) || 0);
    const units = module_.cm > 0 ? len / (module_.cm / 100) : 0;
    const area = len * STANDARD_HEIGHT_M;
    const price = Math.max(0, Number(pricePerMeter) || 0);
    return { unitCount: units, panelArea: area, totalCost: len * price };
  }, [length, module_, pricePerMeter]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><CookingPot size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب عدد الوحدات ومساحة الواجهات</p>
          <p className="guide-v2-checker-sub">أداة تعمل بنفس الدقة في أي بلد — لا تعتمد على أسعار سوق محدد</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="kc-length">الطول الإجمالي للخزائن (متر خطي)</label>
        <input id="kc-length" type="number" inputMode="decimal" min="0" step="0.5" value={length} onChange={(e) => setLength(e.target.value)} placeholder="4" />
      </div>

      <p className="guide-v2-checker-sub" style={{ margin: '0 0 var(--space-2)' }}>عرض الوحدة القياسية</p>
      <div className="guide-v2-checker-options" role="group" aria-label="عرض الوحدة">
        {MODULE_WIDTHS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`guide-v2-checker-chip${moduleId === m.id ? ' is-active' : ''}`}
            aria-pressed={moduleId === m.id}
            onClick={() => setModuleId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite" style={{ marginTop: 'var(--space-5)' }}>
        <p className="guide-v2-checker-result-label">عدد الوحدات ومساحة الواجهات التقديرية</p>
        <p className="guide-v2-checker-result-value" style={{ fontSize: '1.15rem' }}>
          نحو {fmt(unitCount, 1)} وحدة · {fmt(panelArea, 2)} م² واجهات
        </p>
        <p className="guide-v2-checker-result-note">
          محسوبة من طول خزائنك مقسوماً على عرض الوحدة، بارتفاع واجهة قياسي {STANDARD_HEIGHT_M} م —
          هذان الرقمان ثابتان بغض النظر عن بلدك أو مدينتك، لأنهما معيار نجارة حقيقي لا سعر سوق.
        </p>
      </div>

      <div className="tool-v2-field" style={{ marginTop: 'var(--space-5) ' }}>
        <label htmlFor="kc-price">هل لديك عرض سعر فعلي لكل متر خطي؟ (اختياري، بعملتك)</label>
        <input id="kc-price" type="number" inputMode="decimal" min="0" value={pricePerMeter} onChange={(e) => setPricePerMeter(e.target.value)} placeholder="مثال: 1800" />
      </div>
      {Number(pricePerMeter) > 0 ? (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-label">التكلفة الإجمالية بناءً على عرضك</p>
          <p className="guide-v2-checker-result-value" style={{ direction: 'ltr', textAlign: 'end', display: 'block' }}>
            {fmt(totalCost)}
          </p>
          <p className="guide-v2-checker-result-note">
            هذا ضرب مباشر لعرض السعر الذي أدخلته × طول مطبخك — تحقق منه دائماً مقابل عرض سعر مكتوب
            فعلي من النجار، وقارنه بعرض ثانٍ على الأقل قبل الالتزام.
          </p>
        </div>
      ) : null}
    </div>
  );
}
