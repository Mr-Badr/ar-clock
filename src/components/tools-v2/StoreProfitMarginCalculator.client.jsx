"use client";

import { useMemo, useState } from 'react';
import { Storefront } from '@phosphor-icons/react';

// Real, sourced platform commission rates (see keyword-research/ecommerce-hub/DECISION.md) — the
// differentiator vs. generic profit-margin calculators (including ksatools.com's), which don't
// account for platform-specific fees at all.
const PLATFORMS = [
  { id: 'salla', label: 'سلة', feePercent: 2.5 },
  { id: 'zid', label: 'زد', feePercent: 3 },
  { id: 'none', label: 'متجر خاص / بدون منصة', feePercent: 0 },
];

export default function StoreProfitMarginCalculator() {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('0');
  const [platformId, setPlatformId] = useState('salla');
  const [gatewayFeePercent, setGatewayFeePercent] = useState('2.75');

  const platform = PLATFORMS.find((p) => p.id === platformId);

  const result = useMemo(() => {
    const costNum = Number(cost);
    const priceNum = Number(price);
    const shippingNum = Number(shipping) || 0;
    const gatewayPercent = Number(gatewayFeePercent) || 0;
    if (!costNum || !priceNum || priceNum <= 0) return null;

    const platformFee = priceNum * (platform.feePercent / 100);
    const gatewayFee = priceNum * (gatewayPercent / 100);
    const totalCosts = costNum + shippingNum + platformFee + gatewayFee;
    const netProfit = priceNum - totalCosts;
    const marginPercent = (netProfit / priceNum) * 100;
    const markupPercent = costNum > 0 ? (netProfit / costNum) * 100 : null;

    return { platformFee, gatewayFee, netProfit, marginPercent, markupPercent };
  }, [cost, price, shipping, platform, gatewayFeePercent]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Storefront size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب هامش ربحك الحقيقي</p>
          <p className="guide-v2-checker-sub">بعد خصم عمولة المنصة ورسوم الدفع فعلياً</p>
        </div>
      </div>

      <p className="guide-v2-checker-sub" style={{ marginBottom: 'var(--space-2)' }}>منصتك</p>
      <div className="guide-v2-checker-options" role="group" aria-label="المنصة" style={{ marginBottom: 'var(--space-3)' }}>
        {PLATFORMS.map((p) => (
          <button key={p.id} type="button" className={`guide-v2-checker-chip${platformId === p.id ? ' is-active' : ''}`} aria-pressed={platformId === p.id} onClick={() => setPlatformId(p.id)}>
            {p.label}{p.feePercent > 0 ? ` (${p.feePercent}%)` : ''}
          </button>
        ))}
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="pm-cost">تكلفة المنتج (ريال)</label>
        <input id="pm-cost" type="number" inputMode="decimal" min="0" placeholder="مثال: 40" value={cost} onChange={(e) => setCost(e.target.value)} />
      </div>
      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="pm-price">سعر البيع (ريال)</label>
        <input id="pm-price" type="number" inputMode="decimal" min="0" placeholder="مثال: 100" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="pm-shipping">تكلفة الشحن التي يتحملها متجرك (ريال، اختياري)</label>
        <input id="pm-shipping" type="number" inputMode="decimal" min="0" placeholder="0" value={shipping} onChange={(e) => setShipping(e.target.value)} />
      </div>
      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="pm-gateway">رسوم بوابة الدفع % (تختلف حسب مزوّدك، عدّلها إن عرفت رقمك الفعلي)</label>
        <input id="pm-gateway" type="number" inputMode="decimal" min="0" step="0.1" value={gatewayFeePercent} onChange={(e) => setGatewayFeePercent(e.target.value)} />
      </div>

      {result ? (
        <>
          <div className="tool-v2-result-stat-row" role="status">
            <div className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-label">صافي الربح</span>
              <span className="tool-v2-result-stat-value">{result.netProfit.toFixed(2)}</span>
            </div>
            <div className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-label">هامش الربح</span>
              <span className="tool-v2-result-stat-value">{result.marginPercent.toFixed(1)}%</span>
            </div>
            {result.markupPercent !== null ? (
              <div className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-label">نسبة الماركب</span>
                <span className="tool-v2-result-stat-value">{result.markupPercent.toFixed(1)}%</span>
              </div>
            ) : null}
          </div>
          <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
            عمولة {platform.label}: {result.platformFee.toFixed(2)} ريال — رسوم بوابة الدفع: {result.gatewayFee.toFixed(2)} ريال.
            {result.marginPercent < 20 ? ' هامشك أقل من 20% — منطقة حساسة لأي تقلب في تكلفة المنتج أو الشحن.' : ''}
          </p>
        </>
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>أدخل التكلفة وسعر البيع لحساب هامش ربحك الفعلي.</p>
        </div>
      )}
    </div>
  );
}
