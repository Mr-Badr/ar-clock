'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CircleDollarSign, TrendingUp } from 'lucide-react';

import CalculatorCurrencyField, {
  usePreferredCurrency,
} from '@/components/calculators/CurrencyField.client';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const rMo = rate / 12;
  const n = Math.round(years * 12);

  const fvPrincipal = principal * (rMo > 0 ? Math.pow(1 + rMo, n) : 1);
  const fvContribs =
    monthlyContrib > 0
      ? rMo > 0
        ? monthlyContrib * ((Math.pow(1 + rMo, n) - 1) / rMo)
        : monthlyContrib * n
      : 0;

  const totalFV = fvPrincipal + fvContribs;
  const totalInvested = principal + monthlyContrib * n;
  const totalProfit = totalFV - totalInvested;
  const profitRatio = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  return { totalFV, totalProfit, totalInvested, profitRatio };
}

function buildChartData(principal, ratePercent, years, monthlyContrib) {
  const pts = Math.min(Math.round(years), 40);
  return Array.from({ length: pts }, (_, i) => {
    const yr = i + 1;
    const r = calcFV(principal, ratePercent, yr, monthlyContrib);
    if (!r) return null;
    return {
      year: yr <= 20 ? `${yr}س` : yr % 5 === 0 ? `${yr}س` : '',
      yearNum: yr,
      invested: Math.round(r.totalInvested),
      profit: Math.round(r.totalProfit),
      total: Math.round(r.totalFV),
    };
  }).filter(Boolean);
}

// ─── Presets ───────────────────────────────────────────────────────────────

const RATE_PRESETS = [
  { label: 'محافظ ٣٪', rate: 3, hint: 'ودائع بنكية وصكوك' },
  { label: 'متوازن ٥٪', rate: 5, hint: 'صناديق متنوعة' },
  { label: 'نمو ٨٪', rate: 8, hint: 'أسهم ومحافظ' },
];

// ─── Custom tooltip ────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="inv-tooltip">
      <p className="inv-tooltip__year">السنة {d.yearNum}</p>
      <p className="inv-tooltip__total">{formatCurrency(d.total, currency)}</p>
      <p className="inv-tooltip__sub">
        <span className="inv-tooltip__dot --invested" />
        مستثمر: {formatCurrency(d.invested, currency)}
      </p>
      <p className="inv-tooltip__sub">
        <span className="inv-tooltip__dot --profit" />
        ربح: {formatCurrency(d.profit, currency)}
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function InvestmentReturnCalculator() {
  const { currency, setCurrency, options: currencyOptions } =
    usePreferredCurrency({ storageKey: 'miqatona-investment-currency' });

  const [principal, setPrincipal] = useState('100000');
  const [ratePercent, setRatePercent] = useState('5');
  const [years, setYears] = useState('10');
  const [monthlyContrib, setMonthlyContrib] = useState('0');

  const fmt = (v) => formatCurrency(v, currency);

  const result = useMemo(() => {
    const p = toNum(principal);
    const r = toNum(ratePercent);
    const y = toNum(years);
    const m = toNum(monthlyContrib);
    return calcFV(p, r, y, m);
  }, [principal, ratePercent, years, monthlyContrib]);

  const chartData = useMemo(() => {
    const p = toNum(principal);
    const r = toNum(ratePercent);
    const y = toNum(years);
    const m = toNum(monthlyContrib);
    if (y <= 0) return [];
    return buildChartData(p, r, y, m);
  }, [principal, ratePercent, years, monthlyContrib]);

  const shareText = result
    ? [
        `المبلغ الابتدائي: ${fmt(toNum(principal))}`,
        `معدل الربح السنوي: ${ratePercent}%`,
        `المدة: ${years} سنة`,
        monthlyContrib !== '0' ? `إضافة شهرية: ${fmt(toNum(monthlyContrib))}` : '',
        `القيمة المستقبلية: ${fmt(result.totalFV)}`,
        `صافي الربح: ${fmt(result.totalProfit)} (${result.profitRatio.toFixed(1)}%)`,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">

        {/* ── Inputs ─────────────────────────────── */}
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">بيانات الاستثمار</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">

            <CalculatorCurrencyField
              currency={currency}
              onChange={setCurrency}
              options={currencyOptions}
              hint="اختر العملة المناسبة لحسابك"
              id="inv-currency"
            />

            <div className="calc-field">
              <Label className="calc-label" htmlFor="inv-principal">المبلغ الابتدائي</Label>
              <Input
                id="inv-principal"
                inputMode="numeric"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>

            <div className="calc-field">
              <Label className="calc-label" htmlFor="inv-rate">
                معدل الربح السنوي %
              </Label>
              <Input
                id="inv-rate"
                inputMode="decimal"
                value={ratePercent}
                onChange={(e) => setRatePercent(e.target.value)}
              />
              <div className="inv-presets">
                {RATE_PRESETS.map((p) => (
                  <button
                    key={p.rate}
                    type="button"
                    className={`inv-preset${String(p.rate) === ratePercent ? ' inv-preset--active' : ''}`}
                    onClick={() => setRatePercent(String(p.rate))}
                  >
                    <span className="inv-preset__label">{p.label}</span>
                    <span className="inv-preset__hint">{p.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="inv-years">المدة (سنوات)</Label>
                <Input
                  id="inv-years"
                  inputMode="numeric"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="inv-monthly">
                  إضافة شهرية (اختياري)
                </Label>
                <Input
                  id="inv-monthly"
                  inputMode="numeric"
                  value={monthlyContrib}
                  onChange={(e) => setMonthlyContrib(e.target.value)}
                />
              </div>
            </div>

            <div className="calc-note">
              معدل الربح هو تقدير. الأداء الفعلي يختلف حسب نوع الاستثمار والسوق.
              استخدم هذه الحاسبة للتخطيط لا للضمان.
            </div>
          </CardContent>
        </Card>

        {/* ── Results ────────────────────────────── */}
        <div className="calc-results-panel">

          {result ? (
            <>
              {/* Hero value */}
              <div className="inv-hero" aria-live="polite">
                <div className="inv-hero__icon">
                  <TrendingUp size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="inv-hero__label">القيمة المستقبلية</p>
                  <p className="inv-hero__value">{fmt(result.totalFV)}</p>
                  <p className="inv-hero__sub">بعد {years} سنة</p>
                </div>
              </div>

              {/* Breakdown grid */}
              <div className="inv-breakdown">
                <div className="inv-breakdown__item --invested">
                  <CircleDollarSign size={14} aria-hidden="true" />
                  <span className="inv-breakdown__key">إجمالي ما استثمرت</span>
                  <span className="inv-breakdown__val">{fmt(result.totalInvested)}</span>
                </div>
                <div className="inv-breakdown__item --profit">
                  <TrendingUp size={14} aria-hidden="true" />
                  <span className="inv-breakdown__key">صافي الربح</span>
                  <span className="inv-breakdown__val">{fmt(result.totalProfit)}</span>
                </div>
                <div className="inv-breakdown__item --ratio">
                  <span className="inv-breakdown__key">نسبة الربح الإجمالية</span>
                  <span className="inv-breakdown__val">{result.profitRatio.toFixed(1)}%</span>
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 1 && (
                <div className="inv-chart-wrap">
                  <p className="inv-chart-title">نمو الاستثمار سنة بسنة</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="invGradProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--calc-cat-finance)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--calc-cat-finance)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="invGradInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--border-strong)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--border-strong)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border-subtle)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10, fill: 'var(--text-muted)', direction: 'ltr' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis hide />
                      <Tooltip
                        content={<ChartTooltip currency={currency} />}
                        cursor={{ stroke: 'var(--calc-cat-finance)', strokeWidth: 1, strokeDasharray: '4 2' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        stackId="1"
                        stroke="var(--border-strong)"
                        fill="url(#invGradInvested)"
                        strokeWidth={1.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stackId="1"
                        stroke="var(--calc-cat-finance)"
                        fill="url(#invGradProfit)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="inv-chart-legend">
                    <span className="inv-chart-dot --invested" aria-hidden="true" />
                    <span>رأس المال</span>
                    <span className="inv-chart-dot --profit" aria-hidden="true" />
                    <span>الربح</span>
                  </div>
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة الاستثمار"
                shareText={shareText}
              />
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__label">أدخل بيانات الاستثمار</div>
              <div className="calc-metric-card__value">—</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
