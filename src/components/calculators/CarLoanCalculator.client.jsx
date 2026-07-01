'use client';

import { useMemo, useState } from 'react';
import CalculatorCurrencyField, {
  usePreferredCurrency,
} from '@/components/calculators/CurrencyField.client';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/calculators/engine';

// ─── Math engines ──────────────────────────────────────────────────────────

function toNum(v) {
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isFinite(n) && n >= 0 ? n : 0;
}

/** Conventional declining-balance PMT */
function calcConventional(loan, annualRate, years) {
  const n = Math.round(years * 12);
  if (n <= 0 || loan <= 0) return null;
  if (annualRate === 0) {
    return { monthly: loan / n, totalInterest: 0, totalPaid: loan };
  }
  const r = annualRate / 100 / 12;
  const monthly = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPaid = monthly * n;
  return { monthly, totalInterest: totalPaid - loan, totalPaid };
}

/** Islamic murabaha — flat profit on full loan amount for full duration */
function calcMurabaha(loan, annualRate, years) {
  const n = Math.round(years * 12);
  if (n <= 0 || loan <= 0) return null;
  const totalProfit = loan * (annualRate / 100) * years;
  const monthly = (loan + totalProfit) / n;
  return { monthly, totalInterest: totalProfit, totalPaid: loan + totalProfit };
}

function calc(mode, loan, rate, years) {
  return mode === 'murabaha'
    ? calcMurabaha(loan, rate, years)
    : calcConventional(loan, rate, years);
}

/** Build month-by-month amortization rows */
function buildAmortization(mode, loan, rate, years) {
  const n = Math.round(years * 12);
  if (n <= 0 || loan <= 0) return [];
  const rows = [];
  if (mode === 'conventional') {
    const r = rate / 100 / 12;
    const monthly = r > 0
      ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : loan / n;
    let balance = loan;
    for (let i = 1; i <= n; i++) {
      const interestPart = r > 0 ? balance * r : 0;
      const principalPart = monthly - interestPart;
      balance = Math.max(balance - principalPart, 0);
      rows.push({ month: i, payment: monthly, principal: principalPart, interest: interestPart, balance });
    }
  } else {
    const totalProfit = loan * (rate / 100) * years;
    const monthly = (loan + totalProfit) / n;
    const monthlyProfit = totalProfit / n;
    const monthlyPrincipal = loan / n;
    let balance = loan;
    for (let i = 1; i <= n; i++) {
      balance = Math.max(balance - monthlyPrincipal, 0);
      rows.push({ month: i, payment: monthly, principal: monthlyPrincipal, interest: monthlyProfit, balance });
    }
  }
  return rows;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ModeToggle({ mode, onChange }) {
  return (
    <div className="car-loan-mode" role="radiogroup" aria-label="نوع التمويل">
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'conventional'}
        className={`car-loan-mode__btn${mode === 'conventional' ? ' --active' : ''}`}
        onClick={() => onChange('conventional')}
      >
        <span className="car-loan-mode__icon">🏦</span>
        <span className="car-loan-mode__label">تمويل تقليدي</span>
        <span className="car-loan-mode__sub">فائدة متناقصة</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'murabaha'}
        className={`car-loan-mode__btn${mode === 'murabaha' ? ' --active' : ''}`}
        onClick={() => onChange('murabaha')}
      >
        <span className="car-loan-mode__icon">☪️</span>
        <span className="car-loan-mode__label">مرابحة إسلامية</span>
        <span className="car-loan-mode__sub">هامش ربح ثابت</span>
      </button>
    </div>
  );
}

function DpToggle({ dpMode, onChange }) {
  return (
    <div className="car-loan-dp-toggle" role="radiogroup" aria-label="طريقة إدخال الدفعة">
      <button
        type="button"
        className={`car-loan-dp-toggle__btn${dpMode === 'amount' ? ' --active' : ''}`}
        onClick={() => onChange('amount')}
      >
        مبلغ
      </button>
      <button
        type="button"
        className={`car-loan-dp-toggle__btn${dpMode === 'percent' ? ' --active' : ''}`}
        onClick={() => onChange('percent')}
      >
        نسبة %
      </button>
    </div>
  );
}

function ResultCard({ label, value, sub }) {
  return (
    <div className="calc-metric-card">
      <div className="calc-metric-card__label">{label}</div>
      <div className="calc-metric-card__value">{value}</div>
      {sub && <div className="calc-metric-card__note">{sub}</div>}
    </div>
  );
}

function ComparisonBadge({ mode, altResult, loanAmount, currency, years, rate }) {
  if (!altResult) return null;
  const altMode = mode === 'conventional' ? 'murabaha' : 'conventional';
  const altLabel = altMode === 'murabaha' ? 'المرابحة' : 'التقليدي';
  const diff = altResult.totalInterest - (mode === 'conventional'
    ? calcConventional(loanAmount, rate, years)?.totalInterest ?? 0
    : calcMurabaha(loanAmount, rate, years)?.totalInterest ?? 0);
  const diffAbs = Math.abs(diff);
  const cheaper = diff > 0 ? 'التقليدي' : 'المرابحة';
  return (
    <div className="car-loan-compare">
      <span className="car-loan-compare__label">مقارنة مع {altLabel}</span>
      <span className="car-loan-compare__monthly">
        قسطه {formatCurrency(Math.round(altResult.monthly), currency)}/شهر
      </span>
      {diffAbs > 100 && (
        <span className="car-loan-compare__diff">
          {cheaper} أقل تكلفةً إجمالاً بـ {formatCurrency(Math.round(diffAbs), currency)}
        </span>
      )}
    </div>
  );
}

function AmortizationTable({ rows, currency, mode }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? rows : rows.slice(0, 12);
  const interestLabel = mode === 'murabaha' ? 'الربح' : 'الفائدة';
  return (
    <div className="car-loan-amort">
      <div className="calc-table-wrap">
        <table className="calc-table calc-table--sm">
          <thead>
            <tr>
              <th>الشهر</th>
              <th>القسط</th>
              <th>الأصل</th>
              <th>{interestLabel}</th>
              <th>الرصيد</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{formatCurrency(Math.round(r.payment), currency)}</td>
                <td>{formatCurrency(Math.round(r.principal), currency)}</td>
                <td>{formatCurrency(Math.round(r.interest), currency)}</td>
                <td>{formatCurrency(Math.round(r.balance), currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 12 && (
        <button
          type="button"
          className="car-loan-amort__toggle"
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? `إخفاء الجدول ▲` : `عرض كامل الجدول (${rows.length} شهراً) ▼`}
        </button>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function CarLoanCalculator() {
  const { currency, setCurrency, options: currencyOptions } =
    usePreferredCurrency({ storageKey: 'miqatona-car-loan-currency' });

  const [mode, setMode] = useState('conventional');
  const [carPrice, setCarPrice] = useState('100000');
  const [downPayment, setDownPayment] = useState('20000');
  const [dpMode, setDpMode] = useState('amount'); // 'amount' | 'percent'
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState('5');
  const [showTable, setShowTable] = useState(false);

  const fmt = (v) => formatCurrency(Math.round(v), currency);

  const { loanAmount, result, altResult, amortRows } = useMemo(() => {
    const price = toNum(carPrice);
    const dp = dpMode === 'percent'
      ? price * (toNum(downPayment) / 100)
      : toNum(downPayment);
    const loan = Math.max(price - dp, 0);
    const r = toNum(rate);
    const y = years;

    const res = calc(mode, loan, r, y);
    const altMode = mode === 'conventional' ? 'murabaha' : 'conventional';
    const alt = calc(altMode, loan, r, y);
    const rows = showTable ? buildAmortization(mode, loan, r, y) : [];

    return { loanAmount: loan, result: res, altResult: alt, amortRows: rows };
  }, [carPrice, downPayment, dpMode, years, rate, mode, showTable]);

  const dpLabel = dpMode === 'percent' ? 'الدفعة الأولى (%)' : 'الدفعة الأولى';
  const rateLabel = mode === 'murabaha' ? 'هامش الربح السنوي (%)' : 'نسبة الفائدة السنوية (%)';

  return (
    <Card className="car-loan-card">
      <CardContent className="car-loan-content">
        <ModeToggle mode={mode} onChange={(m) => { setMode(m); setShowTable(false); }} />

        <div className="car-loan-fields">
          <div className="car-loan-field-row">
            <div className="car-loan-field">
              <CalculatorCurrencyField
                value={currency}
                onChange={setCurrency}
                options={currencyOptions}
                label="العملة"
              />
            </div>
          </div>

          <div className="car-loan-field-row">
            <div className="car-loan-field">
              <Label htmlFor="cl-price">سعر السيارة</Label>
              <Input
                id="cl-price"
                type="number"
                min="0"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                placeholder="100000"
              />
            </div>
          </div>

          <div className="car-loan-field-row car-loan-field-row--dp">
            <div className="car-loan-field car-loan-field--grow">
              <Label htmlFor="cl-dp">{dpLabel}</Label>
              <Input
                id="cl-dp"
                type="number"
                min="0"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder={dpMode === 'percent' ? '20' : '20000'}
              />
            </div>
            <DpToggle dpMode={dpMode} onChange={setDpMode} />
          </div>

          <div className="car-loan-field-row">
            <div className="car-loan-field">
              <Label htmlFor="cl-term">
                مدة التمويل — <strong>{years} {years === 1 ? 'سنة' : 'سنوات'}</strong>
              </Label>
              <input
                id="cl-term"
                type="range"
                min="1"
                max="7"
                step="1"
                value={years}
                onChange={(e) => { setYears(Number(e.target.value)); setShowTable(false); }}
                className="car-loan-slider"
                aria-label={`مدة التمويل: ${years} سنوات`}
              />
              <div className="car-loan-slider-labels" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                  <span key={y} className={y === years ? '--active' : ''}>{y}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="car-loan-field-row">
            <div className="car-loan-field">
              <Label htmlFor="cl-rate">{rateLabel}</Label>
              <Input
                id="cl-rate"
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {result && loanAmount > 0 && (
          <div className="car-loan-results">
            <div className="car-loan-results__hero">
              <div className="car-loan-results__label">القسط الشهري</div>
              <div className="car-loan-results__monthly">{fmt(result.monthly)}</div>
              <div className="car-loan-results__sub">شهرياً × {Math.round(years * 12)} دفعة</div>
            </div>

            <div className="calc-metric-grid">
              <ResultCard
                label="إجمالي ما ستدفع"
                value={fmt(result.totalPaid + (toNum(carPrice) - loanAmount))}
                sub="شامل الدفعة الأولى"
              />
              <ResultCard
                label={mode === 'murabaha' ? 'إجمالي الربح' : 'إجمالي الفائدة'}
                value={fmt(result.totalInterest)}
                sub={`${((result.totalInterest / loanAmount) * 100).toFixed(1)}% من مبلغ التمويل`}
              />
              <ResultCard
                label="مبلغ التمويل"
                value={fmt(loanAmount)}
                sub={`الدفعة الأولى: ${fmt(toNum(carPrice) - loanAmount)}`}
              />
            </div>

            {altResult && (
              <ComparisonBadge
                mode={mode}
                altResult={altResult}
                loanAmount={loanAmount}
                currency={currency}
                years={years}
                rate={toNum(rate)}
              />
            )}

            <button
              type="button"
              className="car-loan-amort-btn"
              onClick={() => setShowTable((s) => !s)}
            >
              {showTable ? 'إخفاء جدول الأقساط ▲' : 'عرض جدول الأقساط التفصيلي ▼'}
            </button>

            {showTable && amortRows.length > 0 && (
              <AmortizationTable rows={amortRows} currency={currency} mode={mode} />
            )}

            <ResultActions
              title={`حاسبة تمويل السيارة — ${mode === 'murabaha' ? 'مرابحة' : 'تقليدي'}`}
              summaryLines={[
                `القسط الشهري: ${fmt(result.monthly)}`,
                `إجمالي ${mode === 'murabaha' ? 'الربح' : 'الفائدة'}: ${fmt(result.totalInterest)}`,
                `إجمالي ما ستدفع: ${fmt(result.totalPaid + (toNum(carPrice) - loanAmount))}`,
              ]}
            />
          </div>
        )}

        {loanAmount === 0 && toNum(carPrice) > 0 && (
          <div className="car-loan-notice">الدفعة الأولى تساوي أو تتجاوز سعر السيارة — لا حاجة لتمويل.</div>
        )}
      </CardContent>

      <style>{`
        .car-loan-card { --cl-accent: var(--calc-cat-finance, #2563eb); background: var(--bg-surface-1, #fff); }
        .car-loan-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

        /* Mode toggle */
        .car-loan-mode { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .car-loan-mode__btn {
          display: flex; flex-direction: column; align-items: center; gap: 0.125rem;
          padding: 0.75rem 1rem; border-radius: 0.75rem; border: 2px solid var(--border, #e2e8f0);
          background: var(--bg-surface-2, #f8fafc); cursor: pointer; transition: all 0.15s;
          font-family: inherit; color: var(--text-secondary, #64748b);
        }
        .car-loan-mode__btn.--active {
          border-color: var(--cl-accent); background: color-mix(in srgb, var(--cl-accent) 8%, var(--bg-surface-1, #fff));
          color: var(--cl-accent);
        }
        .car-loan-mode__icon { font-size: 1.25rem; }
        .car-loan-mode__label { font-size: 0.875rem; font-weight: 600; }
        .car-loan-mode__sub { font-size: 0.7rem; opacity: 0.7; }

        /* Fields */
        .car-loan-fields { display: flex; flex-direction: column; gap: 1rem; }
        .car-loan-field-row { display: flex; gap: 0.75rem; align-items: flex-end; }
        .car-loan-field { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; }
        .car-loan-field--grow { flex: 1; min-width: 0; }

        /* Down payment toggle */
        .car-loan-dp-toggle { display: flex; border-radius: 0.5rem; overflow: hidden; border: 1px solid var(--border, #e2e8f0); flex-shrink: 0; height: 2.5rem; align-self: flex-end; }
        .car-loan-dp-toggle__btn { padding: 0 0.75rem; font-size: 0.8rem; background: var(--bg-surface-2, #f8fafc); color: var(--text-secondary, #64748b); border: none; cursor: pointer; font-family: inherit; }
        .car-loan-dp-toggle__btn.--active { background: var(--cl-accent); color: #fff; }

        /* Slider */
        .car-loan-slider { width: 100%; accent-color: var(--cl-accent); cursor: pointer; }
        .car-loan-slider-labels { display: flex; justify-content: space-between; padding: 0.125rem 0.125rem 0; font-size: 0.7rem; color: var(--text-secondary, #64748b); }
        .car-loan-slider-labels .--active { color: var(--cl-accent); font-weight: 700; }

        /* Results */
        .car-loan-results { display: flex; flex-direction: column; gap: 1rem; padding-top: 0.5rem; border-top: 1px solid var(--border, #e2e8f0); }
        .car-loan-results__hero { text-align: center; padding: 1rem 0.5rem; background: color-mix(in srgb, var(--cl-accent) 6%, var(--bg-surface-1, #fff)); border-radius: 0.75rem; }
        .car-loan-results__label { font-size: 0.8rem; color: var(--text-secondary, #64748b); margin-bottom: 0.25rem; }
        .car-loan-results__monthly { font-size: 2rem; font-weight: 700; color: var(--cl-accent); line-height: 1.1; }
        .car-loan-results__sub { font-size: 0.75rem; color: var(--text-secondary, #64748b); margin-top: 0.25rem; }

        /* Comparison badge */
        .car-loan-compare { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; padding: 0.625rem 0.875rem; background: var(--bg-surface-2, #f8fafc); border-radius: 0.625rem; font-size: 0.8rem; color: var(--text-secondary, #64748b); }
        .car-loan-compare__label { font-weight: 600; color: var(--text-primary, #1e293b); }
        .car-loan-compare__diff { color: var(--green, #16a34a); font-weight: 600; }

        /* Amortization toggle button */
        .car-loan-amort-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border, #e2e8f0); background: transparent; color: var(--cl-accent); cursor: pointer; font-size: 0.8rem; font-family: inherit; font-weight: 500; transition: background 0.15s; text-align: center; }
        .car-loan-amort-btn:hover { background: color-mix(in srgb, var(--cl-accent) 6%, transparent); }

        /* Amortization table */
        .car-loan-amort { display: flex; flex-direction: column; gap: 0.75rem; }
        .car-loan-amort__toggle { padding: 0.4rem 1rem; border-radius: 0.5rem; border: 1px dashed var(--border, #e2e8f0); background: transparent; color: var(--text-secondary, #64748b); cursor: pointer; font-size: 0.75rem; font-family: inherit; }
        .calc-table--sm td, .calc-table--sm th { padding: 0.4rem 0.5rem; font-size: 0.75rem; }

        /* Notice */
        .car-loan-notice { padding: 0.75rem 1rem; border-radius: 0.625rem; background: var(--amber-subtle, #fef3c7); color: var(--amber-dark, #92400e); font-size: 0.85rem; text-align: center; }

        @media (max-width: 480px) {
          .car-loan-content { padding: 1rem; }
          .car-loan-results__monthly { font-size: 1.6rem; }
          .car-loan-field-row--dp { flex-wrap: wrap; }
          .car-loan-dp-toggle { align-self: flex-start; }
        }
      `}</style>
    </Card>
  );
}
