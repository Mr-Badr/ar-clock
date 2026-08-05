"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarBlank, PiggyBank, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import { calculateSavingsGoal, formatCurrency } from '@/lib/calculators/engine';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function SavingsGoalTool() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [goalAmount, setGoalAmount] = useState('24000');
  const [currentSavings, setCurrentSavings] = useState('6000');
  const [months, setMonths] = useState('12');
  const [annualReturn, setAnnualReturn] = useState('0');
  const [referenceDateIso, setReferenceDateIso] = useState(null);
  const formatMoney = (value) => formatCurrency(value, currency);

  useEffect(() => { setReferenceDateIso(new Date().toISOString()); }, []);

  const result = useMemo(
    () => calculateSavingsGoal({ goalAmount, currentSavings, months, annualReturn, referenceDateIso }),
    [goalAmount, currentSavings, months, annualReturn, referenceDateIso],
  );

  const shareText = result.isValid ? `المطلوب شهرياً للوصول للهدف: ${formatMoney(result.monthlyRequired)}` : '';

  return (
    <div aria-label="حاسبة هدف الادخار">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><PiggyBank size={14} weight="bold" /> خطة ادخار شهرية <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sg-currency">العملة</label>
        <select id="sg-currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {currencyOptions.map((opt) => (<option key={opt.code} value={opt.code}>{opt.label}</option>))}
        </select>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="sg-goal">الهدف المالي</label>
          <input id="sg-goal" type="number" inputMode="decimal" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="sg-current">المدخر الحالي</label>
          <input id="sg-current" type="number" inputMode="decimal" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </div>
      </div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="sg-months">المدة بالأشهر</label>
          <input id="sg-months" type="number" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="sg-return">عائد سنوي اختياري %</label>
          <input id="sg-return" type="number" inputMode="decimal" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">المطلوب شهرياً</span>
            <div className="tool-v2-result-value">{formatMoney(result.monthlyRequired)}</div>
            <div className="tool-v2-result-meta">{formatMoney(result.weeklyRequired)} أسبوعياً</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> تاريخ الوصول التقريبي</span><span className="tool-v2-breakdown-value">{result.targetDate || '—'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الفجوة الحالية</span><span className="tool-v2-breakdown-value">{formatMoney(result.gapNow)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إذا زدت المدة 6 أشهر</span><span className="tool-v2-breakdown-value">{formatMoney(result.monthlyRequiredExtended)} — أقل بـ {formatMoney(result.monthlyDifferenceIfExtended)}</span></div>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة هدف الادخار', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <PiggyBank size={28} weight="duotone" />
          <p>أدخل هدفك المالي والمدة لمعرفة خطة الادخار الشهرية.</p>
        </div>
      )}
    </div>
  );
}
