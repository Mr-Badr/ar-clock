"use client";

import { useEffect, useMemo, useState } from 'react';
import { ShareNetwork, ShieldCheck, Wallet } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { calculateEmergencyFund, formatCurrency, formatNumber } from '@/lib/calculators/engine';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function EmergencyFundTool() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [monthlyExpenses, setMonthlyExpenses] = useState('5000');
  const [targetMonths, setTargetMonths] = useState('6');
  const [currentSavings, setCurrentSavings] = useState('8000');
  const [monthlyContribution, setMonthlyContribution] = useState('1500');
  const [referenceDateIso, setReferenceDateIso] = useState(null);
  const formatMoney = (value) => formatCurrency(value, currency);

  useEffect(() => { setReferenceDateIso(new Date().toISOString()); }, []);

  const result = useMemo(
    () => calculateEmergencyFund({ monthlyExpenses, targetMonths, currentSavings, monthlyContribution, referenceDateIso }),
    [monthlyExpenses, targetMonths, currentSavings, monthlyContribution, referenceDateIso],
  );

  const shareText = result.isValid
    ? `هدف صندوق الطوارئ: ${formatMoney(result.targetAmount)} — المتبقي: ${formatMoney(result.remainingAmount)}`
    : '';

  return (
    <div aria-label="حاسبة صندوق الطوارئ">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><ShieldCheck size={14} weight="bold" /> 3 إلى 6 أشهر مصاريف <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ef-currency">العملة</label>
        <PremiumSelect
          id="ef-currency"
          value={currency}
          onChange={setCurrency}
          options={currencyOptions.map((opt) => ({ value: opt.code, label: opt.label }))}
        />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="ef-expenses">المصاريف الشهرية</label>
          <input id="ef-expenses" type="number" inputMode="decimal" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="ef-months">عدد الأشهر المستهدفة</label>
          <input id="ef-months" type="number" inputMode="numeric" value={targetMonths} onChange={(e) => setTargetMonths(e.target.value)} />
        </div>
      </div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="ef-current">المدخر الحالي</label>
          <input id="ef-current" type="number" inputMode="decimal" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="ef-monthly">الادخار الشهري</label>
          <input id="ef-monthly" type="number" inputMode="decimal" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">الهدف الكلي</span>
            <div className="tool-v2-result-value">{formatMoney(result.targetAmount)}</div>
            <div className="tool-v2-result-meta">{result.recommendedRange}</div>
          </div>

          {result.progressPercent != null ? (
            <div className="tool-v2-hbar-list" style={{ margin: 'var(--space-3) 0' }}>
              <div className="tool-v2-hbar-row">
                <span className="tool-v2-hbar-label">الإنجاز</span>
                <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${Math.min(100, result.progressPercent)}%`, background: 'var(--green)' }} /></div>
                <span className="tool-v2-hbar-value">{formatNumber(result.progressPercent)}%</span>
              </div>
            </div>
          ) : null}

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المبلغ المتبقي</span><span className="tool-v2-breakdown-value">{formatMoney(result.remainingAmount)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">التغطية الحالية</span><span className="tool-v2-breakdown-value">{formatNumber(result.coverageMonths)} شهر</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Wallet size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الوقت المتوقع للوصول</span><span className="tool-v2-breakdown-value">{result.monthsToGoal === null ? 'غير محدد' : `${result.monthsToGoal} شهر`}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <ShieldCheck size={15} weight="fill" />
            <span>التقييم الحالي: {result.status}{result.targetDate ? ` — الوصول التقريبي: ${result.targetDate}` : ''}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة صندوق الطوارئ', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <ShieldCheck size={28} weight="duotone" />
          <p>أدخل مصاريفك الشهرية لمعرفة حجم صندوق الطوارئ المناسب لك.</p>
        </div>
      )}
    </div>
  );
}
