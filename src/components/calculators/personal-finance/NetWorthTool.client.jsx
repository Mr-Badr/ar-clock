"use client";

import { useMemo, useState } from 'react';
import { Bank, Scales, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { calculateNetWorth, formatCurrency, formatNumber } from '@/lib/calculators/engine';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function NetWorthTool() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [cash, setCash] = useState('25000');
  const [investments, setInvestments] = useState('30000');
  const [properties, setProperties] = useState('120000');
  const [otherAssets, setOtherAssets] = useState('10000');
  const [loans, setLoans] = useState('80000');
  const [creditCards, setCreditCards] = useState('5000');
  const [otherLiabilities, setOtherLiabilities] = useState('0');
  const formatMoney = (value) => formatCurrency(value, currency);

  const result = useMemo(
    () => calculateNetWorth({ cash, investments, properties, otherAssets, loans, creditCards, otherLiabilities }),
    [cash, investments, properties, otherAssets, loans, creditCards, otherLiabilities],
  );

  const shareText = result.isValid ? `صافي الثروة: ${formatMoney(result.netWorth)} — ${result.status}` : '';

  return (
    <div aria-label="حاسبة صافي الثروة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Bank size={14} weight="bold" /> الأصول ناقص الالتزامات <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="nw-currency">العملة</label>
        <PremiumSelect
          id="nw-currency"
          value={currency}
          onChange={setCurrency}
          options={currencyOptions.map((opt) => ({ value: opt.code, label: opt.label }))}
        />
      </div>

      <div className="tool-v2-mini-block-head"><span>الأصول</span></div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field"><label htmlFor="nw-cash">النقد والمدخرات</label><input id="nw-cash" type="number" inputMode="decimal" value={cash} onChange={(e) => setCash(e.target.value)} /></div>
        <div className="tool-v2-field"><label htmlFor="nw-investments">الاستثمارات</label><input id="nw-investments" type="number" inputMode="decimal" value={investments} onChange={(e) => setInvestments(e.target.value)} /></div>
      </div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field"><label htmlFor="nw-properties">الممتلكات</label><input id="nw-properties" type="number" inputMode="decimal" value={properties} onChange={(e) => setProperties(e.target.value)} /></div>
        <div className="tool-v2-field"><label htmlFor="nw-other-assets">أصول أخرى</label><input id="nw-other-assets" type="number" inputMode="decimal" value={otherAssets} onChange={(e) => setOtherAssets(e.target.value)} /></div>
      </div>

      <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-3)' }}><span>الالتزامات</span></div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field"><label htmlFor="nw-loans">القروض</label><input id="nw-loans" type="number" inputMode="decimal" value={loans} onChange={(e) => setLoans(e.target.value)} /></div>
        <div className="tool-v2-field"><label htmlFor="nw-credit">بطاقات الائتمان</label><input id="nw-credit" type="number" inputMode="decimal" value={creditCards} onChange={(e) => setCreditCards(e.target.value)} /></div>
      </div>
      <div className="tool-v2-field">
        <label htmlFor="nw-other-liabilities">التزامات أخرى</label>
        <input id="nw-other-liabilities" type="number" inputMode="decimal" value={otherLiabilities} onChange={(e) => setOtherLiabilities(e.target.value)} />
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">صافي الثروة</span>
            <div className="tool-v2-result-value">{formatMoney(result.netWorth)}</div>
            <div className="tool-v2-result-meta">{result.status}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Bank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> إجمالي الأصول</span><span className="tool-v2-breakdown-value">{formatMoney(result.totalAssets)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Scales size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> إجمالي الالتزامات</span><span className="tool-v2-breakdown-value">{formatMoney(result.totalLiabilities)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">نسبة الالتزامات إلى الأصول</span><span className="tool-v2-breakdown-value">{formatNumber(result.liabilitiesRatio)}%</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Scales size={15} weight="fill" />
            <span>{result.nextStep}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة صافي الثروة', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Bank size={28} weight="duotone" />
          <p>أدخل أصولك والتزاماتك لمعرفة صافي ثروتك الحالي.</p>
        </div>
      )}
    </div>
  );
}
