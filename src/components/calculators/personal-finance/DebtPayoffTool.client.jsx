"use client";

import { useEffect, useMemo, useState } from 'react';
import { Plus, ShareNetwork, Trash, TrendUp } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import { compareDebtPayoffPlans, formatCurrency } from '@/lib/calculators/engine';

const DEFAULT_DEBTS = [
  { id: 'card', name: 'بطاقة ائتمان', balance: '12000', annualRate: '24', minimumPayment: '700' },
  { id: 'loan', name: 'قرض شخصي', balance: '35000', annualRate: '8', minimumPayment: '1100' },
];

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function DebtPayoffTool() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [debts, setDebts] = useState(DEFAULT_DEBTS);
  const [extraPayment, setExtraPayment] = useState('500');
  const [referenceDateIso, setReferenceDateIso] = useState(null);
  const formatMoney = (value) => formatCurrency(value, currency);

  useEffect(() => { setReferenceDateIso(new Date().toISOString()); }, []);

  const result = useMemo(() => compareDebtPayoffPlans({ debts, extraPayment, referenceDateIso }), [debts, extraPayment, referenceDateIso]);

  function updateDebt(id, key, value) {
    setDebts((current) => current.map((debt) => (debt.id === id ? { ...debt, [key]: value } : debt)));
  }
  function addDebt() {
    setDebts((current) => [...current, { id: `debt-${current.length}-${Math.random().toString(36).slice(2, 6)}`, name: `دين ${current.length + 1}`, balance: '0', annualRate: '0', minimumPayment: '0' }]);
  }
  function removeDebt(id) {
    setDebts((current) => current.filter((debt) => debt.id !== id));
  }

  const shareText = result.isValid
    ? `كرة الثلج: ${result.snowball.months} شهر — الانهيار: ${result.avalanche.months} شهر — وفر ${formatMoney(result.interestSavedWithAvalanche)}`
    : '';

  return (
    <div aria-label="حاسبة سداد الديون">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><TrendUp size={14} weight="bold" /> كرة الثلج مقابل الانهيار <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dp-currency">العملة</label>
        <select id="dp-currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {currencyOptions.map((opt) => (<option key={opt.code} value={opt.code}>{opt.label}</option>))}
        </select>
      </div>

      {debts.map((debt, index) => (
        <div key={debt.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md, 12px)', padding: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <strong>{debt.name || `دين ${index + 1}`}</strong>
            {debts.length > 1 ? (
              <button type="button" className="tool-v2-action-btn" onClick={() => removeDebt(debt.id)} aria-label={`حذف ${debt.name}`}>
                <Trash size={14} weight="bold" /> حذف
              </button>
            ) : null}
          </div>
          <div className="tool-v2-field-row-pair">
            <div className="tool-v2-field" style={{ marginBottom: 'var(--space-2)' }}>
              <label htmlFor={`dp-name-${debt.id}`}>الاسم</label>
              <input id={`dp-name-${debt.id}`} value={debt.name} onChange={(e) => updateDebt(debt.id, 'name', e.target.value)} />
            </div>
            <div className="tool-v2-field" style={{ marginBottom: 'var(--space-2)' }}>
              <label htmlFor={`dp-balance-${debt.id}`}>الرصيد الحالي</label>
              <input id={`dp-balance-${debt.id}`} type="number" inputMode="decimal" value={debt.balance} onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)} />
            </div>
          </div>
          <div className="tool-v2-field-row-pair">
            <div className="tool-v2-field" style={{ marginBottom: 0 }}>
              <label htmlFor={`dp-rate-${debt.id}`}>نسبة الفائدة %</label>
              <input id={`dp-rate-${debt.id}`} type="number" inputMode="decimal" value={debt.annualRate} onChange={(e) => updateDebt(debt.id, 'annualRate', e.target.value)} />
            </div>
            <div className="tool-v2-field" style={{ marginBottom: 0 }}>
              <label htmlFor={`dp-min-${debt.id}`}>الحد الأدنى الشهري</label>
              <input id={`dp-min-${debt.id}`} type="number" inputMode="decimal" value={debt.minimumPayment} onChange={(e) => updateDebt(debt.id, 'minimumPayment', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <div className="tool-v2-field">
        <label htmlFor="dp-extra">دفعة إضافية شهرية فوق الحدود الدنيا</label>
        <input id="dp-extra" type="number" inputMode="decimal" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
      </div>

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn" onClick={addDebt}><Plus size={16} weight="bold" /> أضف ديناً آخر</button>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-breakdown-list" style={{ marginTop: 'var(--space-4)' }}>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">كرة الثلج</span><span className="tool-v2-breakdown-value">{result.snowball.isValid ? `${result.snowball.months} شهر — فائدة ${formatMoney(result.snowball.totalInterest)}` : 'أدخل الديون'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الانهيار</span><span className="tool-v2-breakdown-value">{result.avalanche.isValid ? `${result.avalanche.months} شهر — فائدة ${formatMoney(result.avalanche.totalInterest)}` : 'أدخل الديون'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الوفر عند استخدام الانهيار</span><span className="tool-v2-breakdown-value">{formatMoney(result.interestSavedWithAvalanche)}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <TrendUp size={15} weight="fill" />
            <span>الدفعة الإضافية توفر لك {result.monthsSavedWithExtra} شهر أقل مقارنة بالسداد بالحد الأدنى فقط.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة سداد الديون', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
