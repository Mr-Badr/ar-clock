"use client";

import { useMemo, useState } from 'react';
import { Ruler } from '@phosphor-icons/react';

// Real industry formula (tube-and-coupler system, the most common in Gulf construction sites) —
// verticals spaced every 2-2.5m along the facade, lifts (horizontal rows) every ~2m in height.
// Both spacings editable since real site conditions vary — see
// keyword-research/scaffolding-hub/DECISION.md for sourcing.
function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function ScaffoldingQuantityChecker() {
  const [length, setLength] = useState('20');
  const [height, setHeight] = useState('12');
  const [baySpacing, setBaySpacing] = useState('2');
  const [liftHeight, setLiftHeight] = useState('2');

  const effectiveLength = Math.max(0, Number(length) || 0);
  const effectiveHeight = Math.max(0, Number(height) || 0);
  const effectiveBay = Math.max(0.5, Number(baySpacing) || 2);
  const effectiveLift = Math.max(0.5, Number(liftHeight) || 2);

  const result = useMemo(() => {
    const bays = Math.ceil(effectiveLength / effectiveBay);
    const verticals = (bays + 1) * 2; // front and back row of standards
    const lifts = Math.ceil(effectiveHeight / effectiveLift);
    const ledgers = bays * lifts * 2; // front and back horizontal runs per lift
    const boards = bays * lifts; // one working platform board-set per bay per lift
    return { bays, verticals, lifts, ledgers, boards };
  }, [effectiveLength, effectiveHeight, effectiveBay, effectiveLift]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Ruler size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">تقدير كمية السقالة المطلوبة</p>
          <p className="guide-v2-checker-sub">أدخل طول وارتفاع واجهة العمل</p>
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="scaffold-length">طول الواجهة (متر)</label>
          <input id="scaffold-length" type="number" inputMode="decimal" min="0" value={length} onChange={(e) => setLength(e.target.value)} placeholder="20" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="scaffold-height">الارتفاع (متر)</label>
          <input id="scaffold-height" type="number" inputMode="decimal" min="0" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="12" />
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="scaffold-bay">مسافة الأعمدة (متر)</label>
          <input id="scaffold-bay" type="number" inputMode="decimal" min="0.5" step="0.5" value={baySpacing} onChange={(e) => setBaySpacing(e.target.value)} placeholder="2" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="scaffold-lift">ارتفاع الطبقة (متر)</label>
          <input id="scaffold-lift" type="number" inputMode="decimal" min="0.5" step="0.5" value={liftHeight} onChange={(e) => setLiftHeight(e.target.value)} placeholder="2" />
        </div>
      </div>

      <div className="guide-v2-checker-result" aria-live="polite">
        <p className="guide-v2-checker-result-label">الكمية التقديرية</p>
        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">عدد الأعمدة الرأسية (Standards)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.verticals)}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">عدد طبقات العمل (Lifts)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.lifts)}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">عدد العوارض الأفقية (Ledgers)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.ledgers)}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">مجموعات ألواح العمل (Boards)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.boards)}</span>
          </div>
        </div>
        <p className="guide-v2-checker-result-note">
          تقدير مبني على نظام السقالة الأنبوبية القياسي (مسافة أعمدة وارتفاع طبقة قابلين للتعديل) —
          أضف هامش 10-15% للقطع الإضافية (دعامات مائلة، وصلات كوبلر، درابزين حماية) غير المحسوبة هنا،
          واطلب من المورد قائمة القطع الكاملة قبل التعاقد.
        </p>
      </div>
    </div>
  );
}
