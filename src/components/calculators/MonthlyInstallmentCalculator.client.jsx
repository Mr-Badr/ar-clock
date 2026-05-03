"use client";

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  CalcButton as Button,
  CalcInput as Input,
  CalcTabsList as TabsList,
  CalcTabsTrigger as TabsTrigger,
} from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { LOAN_PRESETS } from '@/lib/calculators/data';
import {
  calculateBorrowingCapacity,
  calculateDebtToIncome,
  calculateEarlyPaymentPlan,
  calculateMonthlyInstallment,
  formatCurrency,
  formatNumber,
  formatPercent,
} from '@/lib/calculators/engine';

const offerMeta = [
  { key: 'lowest-payment', label: 'أقل قسط' },
  { key: 'balanced', label: 'متوازن' },
  { key: 'lowest-total', label: 'أقل تكلفة إجمالية' },
];

export default function MonthlyInstallmentCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [loanType, setLoanType] = useState('personal');
  const [loanAmount, setLoanAmount] = useState(String(LOAN_PRESETS.personal.amount));
  const [years, setYears] = useState([LOAN_PRESETS.personal.years]);
  const [annualRate, setAnnualRate] = useState(String(LOAN_PRESETS.personal.rate));
  const [interestType, setInterestType] = useState('reducing');
  const [downPayment, setDownPayment] = useState(String(LOAN_PRESETS.personal.downPayment));
  const [adminFee, setAdminFee] = useState('1000');
  const [insuranceFee, setInsuranceFee] = useState('0');
  const [appraisalFee, setAppraisalFee] = useState('0');
  const [extraPayment, setExtraPayment] = useState('500');
  const [monthlyBudget, setMonthlyBudget] = useState('3000');
  const [monthlyIncome, setMonthlyIncome] = useState('12000');
  const [showRows, setShowRows] = useState(12);
  const formatMoney = (value) => formatCurrency(value, currency);

  const baseInput = {
    loanAmount,
    downPayment,
    years: years[0],
    annualRate,
    interestType,
    adminFee,
    insuranceFee,
    appraisalFee,
  };

  const result = useMemo(() => calculateMonthlyInstallment(baseInput), [baseInput]);
  const earlyPlan = useMemo(
    () => calculateEarlyPaymentPlan({ ...baseInput, extraPayment }),
    [baseInput, extraPayment],
  );
  const capacity = useMemo(
    () => calculateBorrowingCapacity({
      monthlyBudget,
      annualRate,
      years: years[0],
      interestType,
    }),
    [monthlyBudget, annualRate, years, interestType],
  );
  const debtRatio = useMemo(
    () =>
      calculateDebtToIncome({
        monthlyPayments: result.monthlyOutflow,
        monthlyIncome,
      }),
    [result.monthlyOutflow, monthlyIncome],
  );

  const principalVsInterest = useMemo(
    () => [
      { name: 'الأصل', value: result.principal || 0, color: '#059669' },
      { name: 'الفوائد', value: result.totalInterest || 0, color: '#3B82F6' },
    ],
    [result.principal, result.totalInterest],
  );
  const lineData = useMemo(
    () => (result.schedule || []).map((row) => ({
      month: row.month,
      balance: row.balance,
    })),
    [result.schedule],
  );

  const comparisonOffers = useMemo(() => {
    const currentRate = Number(annualRate) || 0;
    const currentYears = years[0];
    const amount = Number(loanAmount) || 0;
    const down = Number(downPayment) || 0;
    const fees = (Number(adminFee) || 0) + (Number(insuranceFee) || 0) + (Number(appraisalFee) || 0);

    return [
      calculateMonthlyInstallment({
        loanAmount: amount,
        downPayment: down,
        years: Math.min(30, currentYears + 2),
        annualRate: Math.max(0, currentRate - 0.4),
        interestType,
        adminFee: fees + 500,
      }),
      calculateMonthlyInstallment({
        loanAmount: amount,
        downPayment: down,
        years: currentYears,
        annualRate: currentRate,
        interestType,
        adminFee: fees,
      }),
      calculateMonthlyInstallment({
        loanAmount: amount,
        downPayment: down,
        years: Math.max(1, currentYears - 2),
        annualRate: currentRate - 0.2,
        interestType,
        adminFee: fees,
      }),
    ];
  }, [annualRate, years, loanAmount, downPayment, adminFee, insuranceFee, appraisalFee, interestType]);

  const shareText = result.isValid
    ? `القرض الصافي: ${formatMoney(result.principal)}\nالقسط الشهري: ${formatMoney(result.monthlyOutflow)}\nإجمالي الفوائد: ${formatMoney(result.totalInterest)}`
    : '';

  function applyPreset(key) {
    const preset = LOAN_PRESETS[key];
    if (!preset) return;
    setLoanType(key);
    setLoanAmount(String(preset.amount));
    setYears([preset.years]);
    setAnnualRate(String(preset.rate));
    setDownPayment(String(preset.downPayment));
    setAppraisalFee(key === 'mortgage' ? '2500' : '0');
    setInsuranceFee(key === 'car' ? '1800' : '0');
  }

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">إعدادات التمويل</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label">نوع القرض</Label>
                <span className="calc-hint">اختر preset سريعاً ثم عدل كما تشاء</span>
              </div>
              <div className="calc-kbd-row">
                {Object.entries(LOAN_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip calc-chip-button ${loanType === key ? 'is-active' : ''}`}
                    onClick={() => applyPreset(key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <CalculatorCurrencyField
              currency={currency}
              onChange={setCurrency}
              options={currencyOptions}
              hint="هذه العملة تؤثر على كل النتائج والجداول والمقارنات داخل الحاسبة."
              id="monthly-installment-currency"
            />

            <div className="calc-field">
              <Label className="calc-label" htmlFor="loan-amount">
                مبلغ القرض
              </Label>
              <Input
                id="loan-amount"
                inputMode="decimal"
                value={loanAmount}
                onChange={(event) => setLoanAmount(event.target.value)}
              />
            </div>

            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label">مدة القرض</Label>
                <strong>{years[0]} سنة</strong>
              </div>
              <Slider className="calc-slider" min={1} max={30} step={1} value={years} onValueChange={setYears} />
            </div>

            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label" htmlFor="annual-rate">
                  الفائدة السنوية
                </Label>
                <strong>{formatPercent(annualRate || 0)}</strong>
              </div>
              <Input
                id="annual-rate"
                inputMode="decimal"
                value={annualRate}
                onChange={(event) => setAnnualRate(event.target.value)}
              />
            </div>

            <div className="calc-field">
              <Label className="calc-label">نوع الفائدة</Label>
              <RadioGroup value={interestType} onValueChange={setInterestType} className="calc-radio-grid">
                <label className="card-nested calc-radio-card">
                  <RadioGroupItem value="fixed" />
                  <span className="calc-radio-copy">
                    <strong>ثابتة</strong>
                    <span>تقريب مبسط للفائدة المسطحة على كامل الأصل.</span>
                  </span>
                </label>
                <label className="card-nested calc-radio-card">
                  <RadioGroupItem value="reducing" />
                  <span className="calc-radio-copy">
                    <strong>متناقصة</strong>
                    <span>فائدة على الرصيد المتبقي مع جدول استهلاك أوضح.</span>
                  </span>
                </label>
              </RadioGroup>
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="down-payment">
                  الدفعة المقدمة
                </Label>
                <Input
                  id="down-payment"
                  inputMode="decimal"
                  value={downPayment}
                  onChange={(event) => setDownPayment(event.target.value)}
                />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="admin-fee">
                  رسوم إدارية
                </Label>
                <Input
                  id="admin-fee"
                  inputMode="decimal"
                  value={adminFee}
                  onChange={(event) => setAdminFee(event.target.value)}
                />
              </div>
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="insurance-fee">
                  تأمين
                </Label>
                <Input
                  id="insurance-fee"
                  inputMode="decimal"
                  value={insuranceFee}
                  onChange={(event) => setInsuranceFee(event.target.value)}
                />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="appraisal-fee">
                  تقييم أو مصاريف إضافية
                </Label>
                <Input
                  id="appraisal-fee"
                  inputMode="decimal"
                  value={appraisalFee}
                  onChange={(event) => setAppraisalFee(event.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">النتيجة الرئيسية</CardTitle>
            </CardHeader>
            <CardContent className="calc-form-grid">
              {result.isValid ? (
                <>
                  <div className="calc-metric-grid">
                    <div className="card-nested calc-metric-card">
                      <div className="calc-metric-card__label">القسط الشهري</div>
                      <div className="calc-metric-card__value">
                        {formatMoney(result.monthlyOutflow)}
                      </div>
                      <div className="calc-metric-card__note">
                        المدة {formatNumber(result.months)} شهر
                      </div>
                    </div>
                    <div className="card-nested calc-metric-card">
                      <div className="calc-metric-card__label">إجمالي الفوائد</div>
                      <div className="calc-metric-card__value">
                        {formatMoney(result.totalInterest)}
                      </div>
                      <div className="calc-metric-card__note">
                        تشكل {formatPercent(result.interestShare)} من أصل القرض
                      </div>
                    </div>
                  </div>

                  <div className="calc-breakdown-list">
                    <div className="calc-breakdown-item">
                      <span>أصل القرض بعد الدفعة المقدمة</span>
                      <strong>{formatMoney(result.principal)}</strong>
                    </div>
                    <div className="calc-breakdown-item">
                      <span>إجمالي الرسوم</span>
                      <strong>{formatMoney(result.totalFees)}</strong>
                    </div>
                    <div className="calc-breakdown-item">
                      <span>إجمالي المبلغ المدفوع</span>
                      <strong>{formatMoney(result.totalPaid)}</strong>
                    </div>
                  </div>

                  <ResultActions
                    copyText={shareText}
                    shareTitle="حاسبة القسط الشهري"
                    shareText={shareText}
                  />
                </>
              ) : (
                <div className="calc-warning">أدخل مبلغ قرض صالحاً حتى تبدأ الحسابات.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="basic" className="calc-app">
        <TabsList className="calc-tabs-list">
          <TabsTrigger value="basic" className="calc-tabs-trigger">الحاسبة الأساسية</TabsTrigger>
          <TabsTrigger value="prepay" className="calc-tabs-trigger">السداد المبكر</TabsTrigger>
          <TabsTrigger value="capacity" className="calc-tabs-trigger">كم يمكنني اقتراضه؟</TabsTrigger>
          <TabsTrigger value="compare" className="calc-tabs-trigger">مقارنة العروض</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="calc-tabs-panel">
          <div className="calc-grid-2">
            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">الأصل مقابل الفوائد</CardTitle>
              </CardHeader>
              <CardContent className="calc-chart-box">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={principalVsInterest}
                      innerRadius={52}
                      outerRadius={86}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {principalVsInterest.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatMoney(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">الرصيد المتبقي عبر الوقت</CardTitle>
              </CardHeader>
              <CardContent className="calc-chart-box">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={lineData}>
                    <defs>
                      <linearGradient id="loanBalanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => formatMoney(value)} />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#3B82F6"
                      fill="url(#loanBalanceFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">جدول الاستهلاك</CardTitle>
            </CardHeader>
            <CardContent className="calc-form-grid">
              <div className="calc-field-row">
                <span className="calc-hint">أول {showRows} صفوف من الجدول</span>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowRows(showRows === 12 ? 24 : 12)}>
                  {showRows === 12 ? 'اعرض 24 صفاً' : 'اعرض 12 صفاً'}
                </Button>
              </div>
              <div className="calc-table-wrap">
                <Table className="economy-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>القسط</TableHead>
                      <TableHead>الدفعة</TableHead>
                      <TableHead>الأصل</TableHead>
                      <TableHead>الفائدة</TableHead>
                      <TableHead>المتبقي</TableHead> 
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(result.schedule || []).slice(0, showRows).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{formatMoney(row.payment)}</TableCell>
                        <TableCell>{formatMoney(row.principalPaid)}</TableCell>
                        <TableCell>{formatMoney(row.interestPaid)}</TableCell>
                        <TableCell>{formatMoney(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prepay" className="calc-tabs-panel">
          <div className="calc-grid-2">
            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">أدخل سداداً إضافياً شهرياً</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-field">
                  <Label className="calc-label" htmlFor="extra-payment">الدفعة الإضافية</Label>
                  <Input
                    id="extra-payment"
                    inputMode="decimal"
                    value={extraPayment}
                    onChange={(event) => setExtraPayment(event.target.value)}
                  />
                </div>
                {earlyPlan.isEstimate ? (
                  <div className="calc-warning">
                    هذه النتيجة تقديرية لأن أثر السداد المبكر في التمويل ذي الفائدة الثابتة يختلف من
                    عقد إلى آخر.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">أثر السداد المبكر</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-metric-grid">
                  <div className="card-nested calc-metric-card">
                    <div className="calc-metric-card__label">عدد الأشهر بعد السداد الإضافي</div>
                    <div className="calc-metric-card__value">{formatNumber(earlyPlan.payoffMonths)}</div>
                    <div className="calc-metric-card__note">بدلاً من {formatNumber(result.months)} شهراً</div>
                  </div>
                  <div className="card-nested calc-metric-card">
                    <div className="calc-metric-card__label">التوفير في الفوائد</div>
                    <div className="calc-metric-card__value">{formatMoney(earlyPlan.interestSaved)}</div>
                    <div className="calc-metric-card__note">التوفير الإجمالي {formatMoney(earlyPlan.totalSaved)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="calc-tabs-panel">
          <div className="calc-grid-2">
            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">القدرة على الاقتراض</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-grid-2">
                  <div className="calc-field">
                    <Label className="calc-label" htmlFor="monthly-budget">القسط المريح شهرياً</Label>
                    <Input
                      id="monthly-budget"
                      inputMode="decimal"
                      value={monthlyBudget}
                      onChange={(event) => setMonthlyBudget(event.target.value)}
                    />
                  </div>
                  <div className="calc-field">
                    <Label className="calc-label" htmlFor="monthly-income">الدخل الشهري</Label>
                    <Input
                      id="monthly-income"
                      inputMode="decimal"
                      value={monthlyIncome}
                      onChange={(event) => setMonthlyIncome(event.target.value)}
                    />
                  </div>
                </div>
                <div className="calc-note">
                  وفق هذه الفرضيات يمكنك تمويل أصل يقارب {formatMoney(capacity.principal || 0)}.
                </div>
              </CardContent>
            </Card>

            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">نسبة الدين إلى الدخل</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="card-nested calc-metric-card">
                  <div className="calc-metric-card__label">النسبة الحالية</div>
                  <div className="calc-metric-card__value">{formatPercent(debtRatio.ratio || 0)}</div>
                  <div className="calc-metric-card__note">
                    {debtRatio.status === 'safe'
                      ? 'ضمن النطاق الآمن عادة.'
                      : debtRatio.status === 'warning'
                        ? 'تحتاج مراجعة قبل الالتزام.'
                        : 'مرتفعة وقد تضغط على السيولة.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="calc-tabs-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">3 عروض للمقارنة السريعة</CardTitle>
            </CardHeader>
            <CardContent className="calc-table-wrap">
              <Table className="economy-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>العرض</TableHead>
                    <TableHead>الفائدة</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>القسط</TableHead>
                    <TableHead>الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonOffers.map((offer, index) => (
                    <TableRow key={offerMeta[index].key}>
                      <TableCell>{offerMeta[index].label}</TableCell>
                      <TableCell>{formatPercent(index === 0 ? Number(annualRate) - 0.4 : index === 1 ? Number(annualRate) : Number(annualRate) - 0.2)}</TableCell>
                      <TableCell>{formatNumber(index === 0 ? years[0] + 2 : index === 1 ? years[0] : Math.max(1, years[0] - 2))} سنة</TableCell>
                      <TableCell>{formatMoney(offer.monthlyOutflow || 0)}</TableCell>
                      <TableCell>{formatMoney(offer.totalPaid || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="calc-surface-card">
        <CardHeader>
          <CardTitle className="calc-card-title">لمحة سريعة</CardTitle>
        </CardHeader>
        <CardContent className="calc-grid-4">
          <div className="card-nested calc-metric-card">
            <div className="calc-metric-card__label">الأصل</div>
            <div className="calc-metric-card__value">{formatMoney(result.principal || 0)}</div>
            <div className="calc-metric-card__note">بعد خصم الدفعة المقدمة</div>
          </div>
          <div className="card-nested calc-metric-card">
            <div className="calc-metric-card__label">الفوائد</div>
            <div className="calc-metric-card__value">{formatMoney(result.totalInterest || 0)}</div>
            <div className="calc-metric-card__note">تتغير بوضوح مع المدة والنوع</div>
          </div>
          <div className="card-nested calc-metric-card">
            <div className="calc-metric-card__label">الرسوم</div>
            <div className="calc-metric-card__value">{formatMoney(result.totalFees || 0)}</div>
            <div className="calc-metric-card__note">لا تنس إضافتها عند المقارنة</div>
          </div>
          <div className="card-nested calc-metric-card">
            <div className="calc-metric-card__label">إجمالي السداد</div>
            <div className="calc-metric-card__value">{formatMoney(result.totalPaid || 0)}</div>
            <div className="calc-metric-card__note">التكلفة النهائية للقرض</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
