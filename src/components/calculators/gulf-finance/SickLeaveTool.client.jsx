"use client";

import { useMemo, useState } from 'react';
import { CalendarBlank, FirstAidKit, ShareNetwork, Wallet, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { calculateSickLeavePay, formatCurrency, formatNumber } from '@/lib/calculators/engine';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function SickLeaveTool() {
  const [monthlySalary, setMonthlySalary] = useState('8000');
  const [sickDays, setSickDays] = useState('20');

  const formatMoney = (v) => formatCurrency(v, 'SAR');
  const result = useMemo(() => calculateSickLeavePay({ monthlySalary, sickDays }), [monthlySalary, sickDays]);

  const shareText = result.isValid
    ? `حاسبة الإجازة المرضية\nعدد الأيام: ${formatNumber(result.sickDays)} يوم\nإجمالي الراتب خلال الإجازة: ${formatMoney(result.totalPay)}\nالخصم: ${formatMoney(result.totalDeduction)}`
    : '';

  return (
    <div aria-label="حاسبة الإجازة المرضية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="sa" /> نظام العمل السعودي — المادة 117 <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sick-leave-salary">الراتب الشهري (ريال)</label>
        <input id="sick-leave-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="8000" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sick-leave-days">عدد أيام الإجازة المرضية</label>
        <input id="sick-leave-days" type="number" inputMode="numeric" value={sickDays} onChange={(e) => setSickDays(e.target.value)} placeholder="20" />
        <p className="tool-v2-field-hint">إجمالي الأيام المرضية المتراكمة خلال آخر 12 شهراً، لا أيام الإجازة الحالية فقط.</p>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">إجمالي الراتب خلال الإجازة المرضية</span>
            <div className="tool-v2-result-value">{formatMoney(result.totalPay)}</div>
            <div className="tool-v2-result-meta">عن {formatNumber(result.sickDays)} يوم · خصم {formatMoney(result.totalDeduction)} من الراتب الكامل</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><FirstAidKit size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الأيام بأجر كامل (100%)</span><span className="tool-v2-breakdown-value">{formatNumber(result.fullPayDays)} يوم — {formatMoney(result.fullPayAmount)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الأيام بأجر 75%</span><span className="tool-v2-breakdown-value">{formatNumber(result.partialPayDays)} يوم — {formatMoney(result.partialPayAmount)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Wallet size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الأيام بلا أجر (0%)</span><span className="tool-v2-breakdown-value">{formatNumber(result.unpaidDays)} يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إجمالي الراتب المستحق خلال الإجازة</span><span className="tool-v2-breakdown-value">{formatMoney(result.totalPay)}</span></div>
          </div>

          {result.excessDays > 0 ? (
            <div className="tool-v2-note-strip">
              <Warning size={15} weight="fill" />
              <span>تجاوزت {formatNumber(result.excessDays)} يوماً الحد الأقصى (120 يوماً) الذي تغطيه المادة 117 — الأيام الزائدة تخضع لأحكام أخرى، راجع جهة العمل أو التأمينات الاجتماعية (GOSI).</span>
            </div>
          ) : null}

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة الإجازة المرضية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <FirstAidKit size={28} weight="duotone" />
          <p>أدخل الراتب الشهري وعدد أيام الإجازة المرضية لحساب المستحق.</p>
        </div>
      )}
    </div>
  );
}
