"use client";

import { useMemo, useState } from 'react';
import { CalendarBlank, CalendarCheck, CurrencyDollar, Info, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { ANNUAL_LEAVE_COUNTRIES, calculateAnnualLeave, formatCurrency, formatNumber } from '@/lib/calculators/engine';

const COUNTRY_CURRENCY = { sa: 'SAR', ae: 'AED', kw: 'KWD', qa: 'QAR', bh: 'BHD', om: 'OMR', eg: 'EGP', jo: 'JOD' };

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AnnualLeaveTool() {
  const [country, setCountry] = useState('sa');
  const [monthlySalary, setMonthlySalary] = useState('8000');
  const [yearsWorked, setYearsWorked] = useState('3');
  const [daysUsed, setDaysUsed] = useState('0');

  const currency = COUNTRY_CURRENCY[country] || 'SAR';
  const formatMoney = (v) => formatCurrency(v, currency);

  const result = useMemo(
    () => calculateAnnualLeave({ monthlySalary, yearsWorked, daysUsed, country }),
    [monthlySalary, yearsWorked, daysUsed, country],
  );

  const usagePct = result.isValid ? Math.min(100, Math.round((result.daysUsed / result.entitledDays) * 100)) : 0;
  const shareText = result.isValid
    ? `حاسبة الإجازة السنوية — ${ANNUAL_LEAVE_COUNTRIES[country]?.label}\nالاستحقاق: ${formatNumber(result.entitledDays)} يوم\nالرصيد المتبقي: ${formatNumber(result.balance)} يوم\nقيمة الرصيد: ${formatMoney(result.leaveBalance)}`
    : '';

  return (
    <div aria-label="حاسبة الإجازة السنوية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code={country} /> {ANNUAL_LEAVE_COUNTRIES[country]?.label} <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>دولة العمل</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولة العمل">
          {Object.entries(ANNUAL_LEAVE_COUNTRIES).map(([code, c]) => (
            <button key={code} type="button" className={`guide-v2-checker-chip${country === code ? ' is-active' : ''}`} aria-pressed={country === code} onClick={() => setCountry(code)}>
              <CountryFlag code={code} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="leave-salary">الراتب الشهري ({currency})</label>
        <input id="leave-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="8000" />
        <p className="tool-v2-field-hint">استخدم الراتب الأساسي أو الإجمالي حسب ما ينص عليه عقدك.</p>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="leave-years">سنوات الخدمة</label>
          <input id="leave-years" type="number" inputMode="decimal" value={yearsWorked} onChange={(e) => setYearsWorked(e.target.value)} placeholder="3" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="leave-used">أيام الإجازة المأخوذة هذه السنة</label>
          <input id="leave-used" type="number" inputMode="decimal" value={daysUsed} onChange={(e) => setDaysUsed(e.target.value)} placeholder="0" />
        </div>
      </div>
      {result.isValid && result.entitlementNote ? (
        <p className="tool-v2-field-hint"><Info size={12} weight="bold" style={{ verticalAlign: '-1px' }} /> {result.entitlementNote}</p>
      ) : null}

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">قيمة رصيد الإجازة</span>
            <div className="tool-v2-result-value">{formatMoney(result.leaveBalance)}</div>
            <div className="tool-v2-result-meta">{formatNumber(result.balance)} يوم متبقي · من أصل {formatNumber(result.entitledDays)} يوم</div>
          </div>

          {result.entitledDays > 0 ? (
            <div className="tool-v2-hbar-list" style={{ margin: 'var(--space-3) 0' }}>
              <div className="tool-v2-hbar-row">
                <span className="tool-v2-hbar-label">مستخدم</span>
                <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${usagePct}%`, background: 'var(--amber)' }} /></div>
                <span className="tool-v2-hbar-value">{formatNumber(result.daysUsed)} يوم</span>
              </div>
              <div className="tool-v2-hbar-row">
                <span className="tool-v2-hbar-label">متبقي</span>
                <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${100 - usagePct}%`, background: 'var(--green)' }} /></div>
                <span className="tool-v2-hbar-value">{formatNumber(result.balance)} يوم</span>
              </div>
            </div>
          ) : null}

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الاستحقاق السنوي</span><span className="tool-v2-breakdown-value">{formatNumber(result.entitledDays)} يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarCheck size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> يتراكم شهرياً</span><span className="tool-v2-breakdown-value">{result.accrualPerMonth.toFixed(2)} يوم/شهر</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CurrencyDollar size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الأجر اليومي</span><span className="tool-v2-breakdown-value">{formatMoney(result.dailySalary)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إجمالي قيمة الإجازة السنوية</span><span className="tool-v2-breakdown-value">{formatMoney(result.totalLeaveValue)}</span></div>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة الإجازة السنوية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <CalendarBlank size={28} weight="duotone" />
          <p>أدخل الراتب وسنوات الخدمة لحساب رصيد الإجازة.</p>
        </div>
      )}
    </div>
  );
}
