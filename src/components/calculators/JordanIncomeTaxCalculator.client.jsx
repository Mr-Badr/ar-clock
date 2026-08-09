"use client";

import { useMemo, useState } from 'react';
import { ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';

import CountryFlag from '@/components/shared/CountryFlag';
import { calculateJordanIncomeTax, formatCurrency } from '@/lib/calculators/engine';

const BRACKET_COLORS = [
  'var(--green)',
  'var(--blue)',
  'var(--amber)',
  'color-mix(in srgb, var(--red) 70%, var(--amber))',
  'var(--red)',
  'color-mix(in srgb, var(--red) 80%, #000)',
];

function fmt(v) {
  return formatCurrency(v, 'JOD');
}

function fmtPct(v) {
  return `${v.toFixed(1)}%`;
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function JordanIncomeTaxCalculator() {
  const [salary, setSalary] = useState('700');
  const [hasDependents, setHasDependents] = useState(true);
  const [includeSsc, setIncludeSsc] = useState(true);

  const result = useMemo(
    () => calculateJordanIncomeTax({ monthlySalary: salary, hasDependents, includeSsc }),
    [salary, hasDependents, includeSsc],
  );

  const shareText = result.isValid
    ? `حاسبة ضريبة الدخل الأردن\nالراتب الإجمالي: ${fmt(result.salary)}\nالضريبة الشهرية: ${fmt(result.monthlyTax)}\nصافي الراتب: ${fmt(result.netMonthly)}\nالمعدل الفعلي: ${fmtPct(result.effectiveTaxRate)}`
    : '';

  return (
    <div aria-label="حاسبة ضريبة الدخل الأردن">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="jo" /> الأردن <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="jo-tax-salary">الراتب الشهري الإجمالي</label>
        <input id="jo-tax-salary" type="number" inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="700" />
        <span className="tool-v2-option-hint">أدخل راتبك الإجمالي (الأساسي + البدلات) قبل أي خصم.</span>
      </div>

      <div className="tool-v2-field">
        <label>إعفاء المعالين (زوج/أبناء)</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="إعفاء المعالين">
          <button type="button" className={`tool-v2-chip${hasDependents ? ' is-active' : ''}`} onClick={() => setHasDependents(true)}>مفعّل</button>
          <button type="button" className={`tool-v2-chip${!hasDependents ? ' is-active' : ''}`} onClick={() => setHasDependents(false)}>غير مفعّل</button>
        </div>
        <span className="tool-v2-option-hint">{hasDependents ? 'إعفاء إضافي 9,000 د.أ سنوياً' : 'إعفاء شخصي فقط'}</span>
      </div>

      <div className="tool-v2-field">
        <label>الضمان الاجتماعي (7.5%)</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="الضمان الاجتماعي">
          <button type="button" className={`tool-v2-chip${includeSsc ? ' is-active' : ''}`} onClick={() => setIncludeSsc(true)}>مفعّل</button>
          <button type="button" className={`tool-v2-chip${!includeSsc ? ' is-active' : ''}`} onClick={() => setIncludeSsc(false)}>غير مفعّل</button>
        </div>
        <span className="tool-v2-option-hint">
          {includeSsc && result.isValid ? `خصم ${fmt(result.sscMonthly)}/شهر — حصة الموظف في القطاع الخاص` : 'الحساب لضريبة الدخل فقط إن أُوقف'}
        </span>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">صافي الراتب الشهري</span>
            <div className="tool-v2-result-value">{fmt(result.netMonthly)}</div>
            <div className="tool-v2-result-meta">معدل فعلي {fmtPct(result.effectiveTaxRate)} — ضريبة شهرية {fmt(result.monthlyTax)}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الراتب الإجمالي</span><span className="tool-v2-breakdown-value">{fmt(result.salary)}</span></div>
            {result.sscMonthly > 0 && (
              <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">ضمان اجتماعي (7.5%)</span><span className="tool-v2-breakdown-value">− {fmt(result.sscMonthly)}</span></div>
            )}
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">ضريبة دخل شهرية</span><span className="tool-v2-breakdown-value">− {fmt(result.monthlyTax)}</span></div>
          </div>

          {result.bracketBreakdown.length > 0 && (
            <>
              <div className="tool-v2-mini-block-head"><span>توزيع الدخل السنوي الخاضع للضريبة على الشرائح</span></div>
              <div className="tool-v2-hbar-list">
                {result.bracketBreakdown.map((b, i) => (b.pct > 0 && (
                  <div key={i} className="tool-v2-hbar-row">
                    <span className="tool-v2-hbar-label">{b.label}</span>
                    <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${b.pct}%`, background: BRACKET_COLORS[i] }} /></div>
                    <span className="tool-v2-hbar-value">{fmt(b.taxAmount)}</span>
                  </div>
                )))}
              </div>
              {result.surcharge > 0 && (
                <p className="tool-v2-option-hint">+ {fmt(result.surcharge)} مساهمة وطنية (1% على ما يتجاوز 200,000 د.أ سنوياً)</p>
              )}
            </>
          )}

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>نتيجة تقديرية — الإعفاءات الإضافية (طبي/تعليم/سكن) قد ترفع إعفاءك حتى سقف 23,000 د.أ، تحقق مع دائرة ضريبة الدخل والمبيعات.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة ضريبة الدخل الأردن', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل راتباً شهرياً صحيحاً لحساب الضريبة وصافي الراتب.</p>
        </div>
      )}
    </div>
  );
}
