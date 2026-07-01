'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { CurrencyCircleDollar, TrendUp, Warning } from '@phosphor-icons/react';

import CalculatorCurrencyField, {
  usePreferredCurrency,
} from '@/components/calculators/CurrencyField.client';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/calculators/engine';

// ─── Math ──────────────────────────────────────────────────────────────────

function toNum(v) {
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isFinite(n) ? n : 0;
}

function calcFV(principal, ratePercent, years, monthlyContrib) {
  if (years <= 0) return null;
  const rate = ratePercent / 100;
  const rMo  = rate / 12;
  const n    = Math.round(years * 12);

  const fvPrincipal = principal * (rMo > 0 ? Math.pow(1 + rMo, n) : 1);
  const fvContribs  = monthlyContrib > 0
    ? (rMo > 0 ? monthlyContrib * ((Math.pow(1 + rMo, n) - 1) / rMo) : monthlyContrib * n)
    : 0;

  const totalFV       = fvPrincipal + fvContribs;
  const totalInvested = principal + monthlyContrib * n;
  const totalProfit   = totalFV - totalInvested;
  const profitRatio   = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  return { totalFV, totalProfit, totalInvested, profitRatio };
}

function buildChartData(principal, ratePercent, years, monthlyContrib) {
  const pts = Math.min(Math.round(years), 40);
  return Array.from({ length: pts }, (_, i) => {
    const yr = i + 1;
    const r  = calcFV(principal, ratePercent, yr, monthlyContrib);
    if (!r) return null;
    return {
      year:     yr <= 20 ? `${yr}س` : yr % 5 === 0 ? `${yr}س` : '',
      yearNum:  yr,
      invested: Math.round(r.totalInvested),
      profit:   Math.round(r.totalProfit),
      total:    Math.round(r.totalFV),
    };
  }).filter(Boolean);
}

const RATE_PRESETS = [
  { label: 'محافظ 3%',  rate: 3, hint: 'ودائع وصكوك' },
  { label: 'متوازن 5%', rate: 5, hint: 'صناديق متنوعة' },
  { label: 'نمو 8%',    rate: 8, hint: 'أسهم ومحافظ' },
];

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="inv-tooltip">
      <p className="inv-tooltip-year">السنة {d.yearNum}</p>
      <p className="inv-tooltip-total">{formatCurrency(d.total, currency)}</p>
      <p className="inv-tooltip-sub">
        <span className="inv-dot inv-dot--invested" />
        رأس المال: {formatCurrency(d.invested, currency)}
      </p>
      <p className="inv-tooltip-sub">
        <span className="inv-dot inv-dot--profit" />
        الربح: {formatCurrency(d.profit, currency)}
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function InvestmentReturnCalculator() {
  const { currency, setCurrency, options: currencyOptions } =
    usePreferredCurrency({ storageKey: 'miqatona-investment-currency' });

  const [principal, setPrincipal]         = useState('100000');
  const [ratePercent, setRatePercent]     = useState('5');
  const [years, setYears]                 = useState('10');
  const [monthlyContrib, setMonthlyContrib] = useState('0');

  const fmt = (v) => formatCurrency(v, currency);

  const result = useMemo(() => {
    return calcFV(toNum(principal), toNum(ratePercent), toNum(years), toNum(monthlyContrib));
  }, [principal, ratePercent, years, monthlyContrib]);

  const chartData = useMemo(() => {
    const y = toNum(years);
    if (y <= 0) return [];
    return buildChartData(toNum(principal), toNum(ratePercent), y, toNum(monthlyContrib));
  }, [principal, ratePercent, years, monthlyContrib]);

  const shareText = result
    ? [
        `المبلغ الابتدائي: ${fmt(toNum(principal))}`,
        `معدل الربح السنوي: ${ratePercent}%`,
        `المدة: ${years} سنة`,
        toNum(monthlyContrib) > 0 ? `إضافة شهرية: ${fmt(toNum(monthlyContrib))}` : '',
        `القيمة المستقبلية: ${fmt(result.totalFV)}`,
        `صافي الربح: ${fmt(result.totalProfit)} (${result.profitRatio.toFixed(1)}%)`,
      ].filter(Boolean).join('\n')
    : '';

  return (
    <div className="calc-app inv-tool" aria-label="حاسبة العائد الاستثماري">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Currency */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="inv-currency">العملة</Label>
                </div>
                <CalculatorCurrencyField
                  currency={currency}
                  onChange={setCurrency}
                  options={currencyOptions}
                  id="inv-currency"
                />
              </div>

              {/* Principal */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="inv-principal">المبلغ الابتدائي</Label>
                </div>
                <Input
                  id="inv-principal"
                  inputMode="numeric"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="100000"
                />
              </div>

              {/* Rate with presets */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="inv-rate">معدل الربح السنوي (%)</Label>
                </div>
                <Input
                  id="inv-rate"
                  inputMode="decimal"
                  value={ratePercent}
                  onChange={(e) => setRatePercent(e.target.value)}
                  placeholder="5"
                />
                <div className="inv-presets">
                  {RATE_PRESETS.map(p => (
                    <button
                      key={p.rate}
                      type="button"
                      className={`inv-preset${String(p.rate) === ratePercent ? ' inv-preset--active' : ''}`}
                      onClick={() => setRatePercent(String(p.rate))}
                    >
                      <span className="inv-preset-label">{p.label}</span>
                      <span className="inv-preset-hint">{p.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Years + monthly */}
              <div className="calc-esb-date-row">
                <div className="calc-esb-date-field">
                  <Label htmlFor="inv-years" className="calc-esb-date-label">المدة (سنوات)</Label>
                  <Input
                    id="inv-years"
                    inputMode="numeric"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="calc-esb-date-field">
                  <Label htmlFor="inv-monthly" className="calc-esb-date-label">إضافة شهرية (اختياري)</Label>
                  <Input
                    id="inv-monthly"
                    inputMode="numeric"
                    value={monthlyContrib}
                    onChange={(e) => setMonthlyContrib(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <p className="calc-hint">معدل الربح تقديري. الأداء الفعلي يختلف حسب نوع الاستثمار والسوق.</p>

            </CardContent>
          </Card>

          {/* Quick facts */}
          {result && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <CurrencyCircleDollar size={15} weight="bold" />
                <span>رأس المال: <strong>{fmt(result.totalInvested)}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <TrendUp size={15} weight="bold" />
                <span>ربح: <strong>{result.profitRatio.toFixed(1)}%</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result ? (
            <div className="calc-esb-result-panel inv-result" aria-live="polite">

              {/* Header badge */}
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge inv-badge">
                  <TrendUp size={12} weight="bold" /> استثمار إسلامي
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Future value hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">القيمة المستقبلية</span>
                <div className="calc-esb-amount-value">{fmt(result.totalFV)}</div>
                <div className="calc-esb-amount-meta">
                  <span>بعد {years} سنة</span>
                  <span className="calc-esb-sep">·</span>
                  <span>{ratePercent}% سنوياً</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>إجمالي ما ستستثمره</span>
                  <strong>{fmt(result.totalInvested)}</strong>
                </div>
                <div className="calc-esb-brow inv-profit-row">
                  <span>صافي الربح</span>
                  <strong>{fmt(result.totalProfit)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>نسبة الربح الإجمالية</span>
                  <strong>{result.profitRatio.toFixed(1)}%</strong>
                </div>
              </div>

              {/* Growth chart */}
              {chartData.length > 1 && (
                <div className="inv-chart-wrap">
                  <p className="inv-chart-title">نمو الاستثمار سنة بسنة</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="invGradProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="invGradInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--border-strong)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--border-strong)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10, fill: 'var(--text-secondary)', direction: 'ltr' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ stroke: 'var(--green)', strokeWidth: 1, strokeDasharray: '4 2' }} />
                      <Area type="monotone" dataKey="invested" stackId="1" stroke="var(--border-strong)"    fill="url(#invGradInvested)" strokeWidth={1.5} />
                      <Area type="monotone" dataKey="profit"   stackId="1" stroke="var(--green)"            fill="url(#invGradProfit)"   strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="inv-chart-legend">
                    <span className="inv-dot inv-dot--invested" aria-hidden="true" />
                    <span>رأس المال</span>
                    <span className="inv-dot inv-dot--profit" aria-hidden="true" />
                    <span>الربح</span>
                  </div>
                </div>
              )}

              <ResultActions copyText={shareText} shareTitle="نتيجة حاسبة الاستثمار" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>تقديري فقط — الاستثمار الفعلي يتأثر بظروف السوق والعوائد المتغيرة.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <TrendUp size={28} weight="duotone" />
              <p>أدخل المبلغ والمدة والمعدل لرؤية القيمة المستقبلية ومنحنى النمو.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
