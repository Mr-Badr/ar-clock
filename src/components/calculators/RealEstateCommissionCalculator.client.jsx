"use client";

import { useEffect, useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Real, per-country defaults — only for the 2 countries verified via direct WebFetch of a real
// regulation citation (Saudi) or cross-checked market-convention sources (UAE), 2026-08-25. Saudi's
// 2.5% is a REGULATED LEGAL CAP (Real Estate Brokerage System, Royal Decree M/130, Art. 14-15) —
// UAE's 2%/5% is a market CONVENTION, not a hard legal ceiling, so its FAQ language must never
// claim it's a cap the way Saudi's genuinely is. Every other Gulf country intentionally has no
// asserted rate here — the field stays editable with a neutral default rather than fabricating a
// number for a country never individually verified.
const COUNTRY_DEFAULTS = {
  sa: { saleRate: 2.5, rentRate: 2.5, vatRate: 15, isLegalCap: true },
  ae: { saleRate: 2, rentRate: 5, vatRate: 5, isLegalCap: false },
};
const GENERIC_DEFAULT = { saleRate: 2.5, rentRate: 2.5, vatRate: 15, isLegalCap: false };

const TRANSACTION_TYPES = [
  { id: 'sale', label: 'بيع', desc: 'العمولة على كامل قيمة الصفقة' },
  { id: 'rent', label: 'إيجار', desc: 'العمولة على قيمة إيجار السنة الأولى' },
];

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function RealEstateCommissionCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [transactionType, setTransactionType] = useState('sale');
  const [value, setValue] = useState('1000000');
  const [rate, setRate] = useState('2.5');
  const [applyVat, setApplyVat] = useState(true);
  const [vatRate, setVatRate] = useState('15');

  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];
  const defaults = COUNTRY_DEFAULTS[countryCode] ?? GENERIC_DEFAULT;

  // Re-apply the country's real defaults whenever country or transaction type changes — the user
  // can still override both afterward, this only sets a sensible starting point.
  useEffect(() => {
    setRate(String(transactionType === 'rent' ? defaults.rentRate : defaults.saleRate));
    setVatRate(String(defaults.vatRate));
  }, [countryCode, transactionType, defaults]);

  const effectiveValue = Math.max(0, Number(value) || 0);
  const effectiveRate = Math.max(0, Number(rate) || 0);
  const effectiveVatRate = Math.max(0, Number(vatRate) || 0);

  const result = useMemo(() => {
    const commission = effectiveValue * (effectiveRate / 100);
    const vat = applyVat ? commission * (effectiveVatRate / 100) : 0;
    const total = commission + vat;
    return { commission, vat, total };
  }, [effectiveValue, effectiveRate, effectiveVatRate, applyVat]);

  return (
    <div aria-label="حاسبة عمولة الوسيط العقاري">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          <CountryFlag code={country.code} /> {country.country}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>دولتك</label>
        <div className="tool-v2-chip-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button key={c.code} type="button" className={`tool-v2-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>
              <CountryFlag code={c.code} /> {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع الصفقة</label>
        <div className="tool-v2-choice-list">
          {TRANSACTION_TYPES.map((t) => {
            const active = transactionType === t.id;
            return (
              <label key={t.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`re-type-${t.id}`}>
                <input type="radio" id={`re-type-${t.id}`} name="re-transaction-type" checked={active} onChange={() => setTransactionType(t.id)} />
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{t.label}</span>
                  <span className="tool-v2-choice-desc">{t.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="re-value">
            {transactionType === 'rent' ? `إيجار السنة الأولى (${country.short})` : `قيمة الصفقة (${country.short})`}
          </label>
          <input id="re-value" type="number" inputMode="decimal" min="0" step="1000" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="re-rate">
            نسبة العمولة (%)
            <FieldHint text={defaults.isLegalCap ? 'الحد الأقصى النظامي في دولتك — يمكنك إدخال نسبة أقل إن اتفقت عليها فعلياً مع الوسيط.' : 'نسبة شائعة في السوق، وليست سقفاً نظامياً ملزماً — عدّلها حسب اتفاقك الفعلي مع الوسيط.'} />
          </label>
          <input id="re-rate" type="number" inputMode="decimal" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="re-vat-toggle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <input id="re-vat-toggle" type="checkbox" checked={applyVat} onChange={(e) => setApplyVat(e.target.checked)} />
          إضافة ضريبة القيمة المضافة على العمولة
        </label>
        {applyVat ? (
          <input type="number" inputMode="decimal" min="0" step="0.5" value={vatRate} onChange={(e) => setVatRate(e.target.value)} aria-label="نسبة ضريبة القيمة المضافة" style={{ marginTop: 'var(--space-2)' }} />
        ) : null}
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">إجمالي المستحق للوسيط</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.total)}</span>
              <span className="tool-v2-result-stat-label">{country.short}</span>
            </span>
          </div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">العمولة ({effectiveRate.toFixed(1)}%)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.commission)} {country.short}</span>
          </div>
          {applyVat ? (
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">ضريبة القيمة المضافة ({effectiveVatRate.toFixed(1)}%)</span>
              <span className="tool-v2-breakdown-value">{fmt(result.vat)} {country.short}</span>
            </div>
          ) : null}
        </div>

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>
            {defaults.isLegalCap
              ? 'هذه النسبة سقف نظامي في دولتك — أي اتفاق يتجاوزها يُعد باطلاً قانوناً. تحقق من عقدك الفعلي قبل أي دفعة.'
              : 'هذه نسبة شائعة في السوق وليست سقفاً نظامياً ملزماً في كل الحالات — راجع اتفاقك المكتوب مع الوسيط دائماً.'}
          </span>
        </div>
      </div>
    </div>
  );
}
