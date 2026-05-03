"use client";

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Eraser, History, RefreshCcw, Sparkles } from 'lucide-react';

import {
  CalcButton as Button,
  CalcInput as Input,
  CalcProgress as Progress,
  CalcTabsList as TabsList,
  CalcTabsTrigger as TabsTrigger,
} from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PERCENTAGE_EXAMPLES } from '@/lib/calculators/data';
import {
  calculateAdjustedValue,
  calculateMultiChange,
  calculatePercentChange,
  calculatePercentageOfValue,
  calculateSequentialDiscounts,
  calculateWhatPercent,
  formatCurrency,
  formatNumber,
  formatPercent,
  splitAmountByPercentages,
} from '@/lib/calculators/engine';

const HISTORY_KEY = 'miqatona-percentage-history';

const TAB_GUIDES = {
  amount: {
    title: 'عندما تريد معرفة قيمة نسبة من مبلغ',
    note: 'مثال: كم يساوي 15% من 500؟ أدخل النسبة في الحقل الأول والمبلغ الأساسي في الحقل الثاني.',
  },
  ratio: {
    title: 'عندما تريد تحويل جزء من كل إلى نسبة',
    note: 'مثال: كم نسبة 42 من 60؟ أدخل الجزء أولاً ثم الكل الذي تريد القياس عليه.',
  },
  adjust: {
    title: 'عندما تريد زيادة مبلغ أو خفضه بنسبة',
    note: 'استخدم هذا التبويب للسعر بعد الخصم أو للراتب بعد الزيادة، وليس لمعرفة نسبة جزء من كل.',
  },
  change: {
    title: 'عندما تريد قياس التغير بين رقمين',
    note: 'مثال: من 100 إلى 150 = زيادة 50%. الحقل الأول هو البداية والثاني هو القيمة الجديدة.',
  },
};

export default function PercentageCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [activeTab, setActiveTab] = useState('amount');
  const [amountPercent, setAmountPercent] = useState('15');
  const [amountValue, setAmountValue] = useState('500');
  const [ratioPart, setRatioPart] = useState('85');
  const [ratioWhole, setRatioWhole] = useState('100');
  const [adjustMode, setAdjustMode] = useState('increase');
  const [adjustValue, setAdjustValue] = useState('1000');
  const [adjustPercent, setAdjustPercent] = useState('20');
  const [changeFrom, setChangeFrom] = useState('100');
  const [changeTo, setChangeTo] = useState('150');
  const [discountBase, setDiscountBase] = useState('1000');
  const [discount1, setDiscount1] = useState('20');
  const [discount2, setDiscount2] = useState('10');
  const [discount3, setDiscount3] = useState('0');
  const [splitTotal, setSplitTotal] = useState('10000');
  const [splitA, setSplitA] = useState('50');
  const [splitB, setSplitB] = useState('30');
  const [splitC, setSplitC] = useState('20');
  const [multiInitial, setMultiInitial] = useState('100');
  const [multiA, setMultiA] = useState('10');
  const [multiB, setMultiB] = useState('-5');
  const [multiC, setMultiC] = useState('12');
  const [history, setHistory] = useState([]);
  const formatMoney = (value) => formatCurrency(value, currency);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      setHistory([]);
    }
  }, []);

  const amountResult = useMemo(
    () => calculatePercentageOfValue(amountPercent, amountValue),
    [amountPercent, amountValue],
  );
  const ratioResult = useMemo(
    () => calculateWhatPercent(ratioPart, ratioWhole),
    [ratioPart, ratioWhole],
  );
  const adjustResult = useMemo(
    () => calculateAdjustedValue(adjustValue, adjustPercent, adjustMode),
    [adjustValue, adjustPercent, adjustMode],
  );
  const changeResult = useMemo(
    () => calculatePercentChange(changeFrom, changeTo),
    [changeFrom, changeTo],
  );
  const discountResult = useMemo(
    () => calculateSequentialDiscounts(discountBase, [discount1, discount2, discount3]),
    [discountBase, discount1, discount2, discount3],
  );
  const splitResult = useMemo(
    () => splitAmountByPercentages(splitTotal, [splitA, splitB, splitC]),
    [splitTotal, splitA, splitB, splitC],
  );
  const multiResult = useMemo(
    () => calculateMultiChange(multiInitial, [multiA, multiB, multiC]),
    [multiInitial, multiA, multiB, multiC],
  );

  const currentSummary = useMemo(() => {
    switch (activeTab) {
      case 'amount':
        return {
          title: `${formatPercent(amountResult.percent, 0)} من ${formatNumber(amountResult.value)}`,
          value: formatNumber(amountResult.result),
          payload: { activeTab, amountPercent, amountValue },
        };
      case 'ratio':
        return {
          title: `${formatNumber(ratioResult.part)} من ${formatNumber(ratioResult.whole)}`,
          value: formatPercent(ratioResult.result, 2),
          payload: { activeTab, ratioPart, ratioWhole },
        };
      case 'adjust':
        return {
          title: `${adjustMode === 'increase' ? 'زيادة' : 'خفض'} ${formatPercent(adjustResult.percent, 0)}`,
          value: formatNumber(adjustResult.result),
          payload: { activeTab, adjustMode, adjustValue, adjustPercent },
        };
      default:
        return {
          title: `من ${formatNumber(changeResult.fromValue)} إلى ${formatNumber(changeResult.toValue)}`,
          value: formatPercent(changeResult.percentChange, 2),
          payload: { activeTab, changeFrom, changeTo },
        };
    }
  }, [
    activeTab,
    amountPercent,
    amountResult.percent,
    amountResult.result,
    amountResult.value,
    amountValue,
    ratioPart,
    ratioResult.part,
    ratioResult.result,
    ratioResult.whole,
    ratioWhole,
    adjustMode,
    adjustPercent,
    adjustResult.percent,
    adjustResult.result,
    adjustValue,
    changeFrom,
    changeResult.fromValue,
    changeResult.percentChange,
    changeResult.toValue,
    changeTo,
  ]);

  function persistHistory(nextHistory) {
    setHistory(nextHistory);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    } catch {
      // ignore storage errors
    }
  }

  function saveCurrentResult() {
    const entry = {
      id: `${Date.now()}`,
      title: currentSummary.title,
      value: currentSummary.value,
      payload: currentSummary.payload,
    };
    const nextHistory = [entry, ...history].slice(0, 10);
    persistHistory(nextHistory);
  }

  function restoreHistory(entry) {
    const payload = entry?.payload || {};
    setActiveTab(payload.activeTab || 'amount');

    if (payload.amountPercent !== undefined) setAmountPercent(payload.amountPercent);
    if (payload.amountValue !== undefined) setAmountValue(payload.amountValue);
    if (payload.ratioPart !== undefined) setRatioPart(payload.ratioPart);
    if (payload.ratioWhole !== undefined) setRatioWhole(payload.ratioWhole);
    if (payload.adjustMode !== undefined) setAdjustMode(payload.adjustMode);
    if (payload.adjustValue !== undefined) setAdjustValue(payload.adjustValue);
    if (payload.adjustPercent !== undefined) setAdjustPercent(payload.adjustPercent);
    if (payload.changeFrom !== undefined) setChangeFrom(payload.changeFrom);
    if (payload.changeTo !== undefined) setChangeTo(payload.changeTo);
  }

  function clearCurrentTab() {
    if (activeTab === 'amount') {
      setAmountPercent('');
      setAmountValue('');
    } else if (activeTab === 'ratio') {
      setRatioPart('');
      setRatioWhole('');
    } else if (activeTab === 'adjust') {
      setAdjustValue('');
      setAdjustPercent('');
    } else {
      setChangeFrom('');
      setChangeTo('');
    }
  }

  function swapNumbers() {
    if (activeTab === 'ratio') {
      setRatioPart(ratioWhole);
      setRatioWhole(ratioPart);
    } else if (activeTab === 'change') {
      setChangeFrom(changeTo);
      setChangeTo(changeFrom);
    }
  }

  function applyExample(tab, payload) {
    setActiveTab(tab);

    if (tab === 'amount') {
      setAmountPercent(String(payload.percent));
      setAmountValue(String(payload.value));
    }
    if (tab === 'ratio') {
      setRatioPart(String(payload.part));
      setRatioWhole(String(payload.whole));
    }
    if (tab === 'adjust') {
      setAdjustMode(payload.mode);
      setAdjustValue(String(payload.value));
      setAdjustPercent(String(payload.percent));
    }
    if (tab === 'change') {
      setChangeFrom(String(payload.fromValue));
      setChangeTo(String(payload.toValue));
    }
  }

  function applyRandomExample() {
    const allExamples = [
      ...PERCENTAGE_EXAMPLES.amount.map((item) => ({ tab: 'amount', payload: item })),
      ...PERCENTAGE_EXAMPLES.ratio.map((item) => ({ tab: 'ratio', payload: item })),
      ...PERCENTAGE_EXAMPLES.adjust.map((item) => ({ tab: 'adjust', payload: item })),
      ...PERCENTAGE_EXAMPLES.change.map((item) => ({ tab: 'change', payload: item })),
    ];
    const random = allExamples[Math.floor(Math.random() * allExamples.length)];
    if (random) applyExample(random.tab, random.payload);
  }

  const shareText = `${currentSummary.title}\nالنتيجة: ${currentSummary.value}`;
  const activeGuide = TAB_GUIDES[activeTab];

  return (
    <div className="calc-app">
      <Card className="calc-surface-card">
        <CardHeader>
          <CardTitle className="calc-card-title">أدوات سريعة</CardTitle>
        </CardHeader>
        <CardContent className="calc-kbd-row">
          <Button type="button" variant="outline" size="sm" onClick={swapNumbers}>
            <ArrowUpDown size={16} />
            بدّل الأرقام
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearCurrentTab}>
            <Eraser size={16} />
            امسح الحالي
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={applyRandomExample}>
            <Sparkles size={16} />
            مثال عشوائي
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={saveCurrentResult}>
            <History size={16} />
            احفظ النتيجة
          </Button>
          {history[0] ? (
            <Button type="button" variant="outline" size="sm" onClick={() => restoreHistory(history[0])}>
              <RefreshCcw size={16} />
              كرر آخر حساب
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">الحاسبة الرئيسية</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="calc-app">
              <TabsList className="calc-tabs-list">
                <TabsTrigger value="amount" className="calc-tabs-trigger">كم يساوي X%؟</TabsTrigger>
                <TabsTrigger value="ratio" className="calc-tabs-trigger">كم نسبة X من Y؟</TabsTrigger>
                <TabsTrigger value="adjust" className="calc-tabs-trigger">زيادة أو خفض</TabsTrigger>
                <TabsTrigger value="change" className="calc-tabs-trigger">نسبة التغيير</TabsTrigger>
              </TabsList>
              <div className="calc-note">
                <strong>{activeGuide.title}:</strong> {activeGuide.note}
              </div>

              <TabsContent value="amount" className="calc-tabs-panel">
                <div className="calc-form-grid">
                  <div className="calc-grid-2">
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="amount-percent">النسبة المئوية</Label>
                      <Input
                        id="amount-percent"
                        inputMode="decimal"
                        value={amountPercent}
                        onChange={(event) => setAmountPercent(event.target.value)}
                      />
                    </div>
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="amount-value">من المبلغ</Label>
                      <Input
                        id="amount-value"
                        inputMode="decimal"
                        value={amountValue}
                        onChange={(event) => setAmountValue(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="calc-kbd-row">
                    {PERCENTAGE_EXAMPLES.amount.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="chip calc-chip-button"
                        onClick={() => applyExample('amount', item)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ratio" className="calc-tabs-panel">
                <div className="calc-form-grid">
                  <div className="calc-grid-2">
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="ratio-part">الجزء</Label>
                      <Input
                        id="ratio-part"
                        inputMode="decimal"
                        value={ratioPart}
                        onChange={(event) => setRatioPart(event.target.value)}
                      />
                    </div>
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="ratio-whole">الكل</Label>
                      <Input
                        id="ratio-whole"
                        inputMode="decimal"
                        value={ratioWhole}
                        onChange={(event) => setRatioWhole(event.target.value)}
                      />
                    </div>
                  </div>
                  <Progress value={Math.min(100, Math.max(0, ratioResult.result))} />
                  <div className="calc-kbd-row">
                    {PERCENTAGE_EXAMPLES.ratio.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="chip calc-chip-button"
                        onClick={() => applyExample('ratio', item)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="calc-tabs-panel">
                <div className="calc-form-grid">
                  <div className="calc-kbd-row">
                    <button
                      type="button"
                      className={`chip calc-chip-button ${adjustMode === 'increase' ? 'is-active' : ''}`}
                      onClick={() => setAdjustMode('increase')}
                    >
                      زيادة
                    </button>
                    <button
                      type="button"
                      className={`chip calc-chip-button ${adjustMode === 'decrease' ? 'is-active' : ''}`}
                      onClick={() => setAdjustMode('decrease')}
                    >
                      خفض
                    </button>
                  </div>
                  <div className="calc-grid-2">
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="adjust-value">المبلغ الأصلي</Label>
                      <Input
                        id="adjust-value"
                        inputMode="decimal"
                        value={adjustValue}
                        onChange={(event) => setAdjustValue(event.target.value)}
                      />
                    </div>
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="adjust-percent">النسبة</Label>
                      <Input
                        id="adjust-percent"
                        inputMode="decimal"
                        value={adjustPercent}
                        onChange={(event) => setAdjustPercent(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="calc-kbd-row">
                    {PERCENTAGE_EXAMPLES.adjust.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="chip calc-chip-button"
                        onClick={() => applyExample('adjust', item)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="change" className="calc-tabs-panel">
                <div className="calc-form-grid">
                  <div className="calc-grid-2">
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="change-from">القيمة الأولى</Label>
                      <Input
                        id="change-from"
                        inputMode="decimal"
                        value={changeFrom}
                        onChange={(event) => setChangeFrom(event.target.value)}
                      />
                    </div>
                    <div className="calc-field">
                      <Label className="calc-label" htmlFor="change-to">القيمة الثانية</Label>
                      <Input
                        id="change-to"
                        inputMode="decimal"
                        value={changeTo}
                        onChange={(event) => setChangeTo(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="calc-kbd-row">
                    {PERCENTAGE_EXAMPLES.change.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="chip calc-chip-button"
                        onClick={() => applyExample('change', item)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">النتيجة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            {activeTab === 'amount' ? (
              <div className="calc-form-grid">
                <div className="card-nested calc-metric-card">
                  <div className="calc-metric-card__label">الناتج</div>
                  <div className="calc-metric-card__value">{formatNumber(amountResult.result)}</div>
                  <div className="calc-metric-card__note">
                    {formatNumber(amountResult.value)} × ({formatNumber(amountResult.percent)} ÷ 100)
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'ratio' ? (
              <div className="calc-form-grid">
                <div className="card-nested calc-metric-card">
                  <div className="calc-metric-card__label">النسبة</div>
                  <div className="calc-metric-card__value">{formatPercent(ratioResult.result, 2)}</div>
                  <div className="calc-metric-card__note">
                    ({formatNumber(ratioResult.part)} ÷ {formatNumber(ratioResult.whole)}) × 100
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'adjust' ? (
              <div className="calc-form-grid">
                <div className="card-nested calc-metric-card">
                  <div className="calc-metric-card__label">
                    {adjustMode === 'increase' ? 'بعد الزيادة' : 'بعد الخفض'}
                  </div>
                  <div className="calc-metric-card__value">{formatNumber(adjustResult.result)}</div>
                  <div className="calc-metric-card__note">
                    قيمة {adjustMode === 'increase' ? 'الزيادة' : 'الخصم'} {formatNumber(adjustResult.delta)}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'change' ? (
              <div className="calc-form-grid">
                <div className="card-nested calc-metric-card">
                  <div className="calc-metric-card__label">نسبة التغيير</div>
                  <div className="calc-metric-card__value">{formatPercent(changeResult.percentChange, 2)}</div>
                  <div className="calc-metric-card__note">
                    الفرق المطلق {formatNumber(changeResult.difference)} -{' '}
                    {changeResult.direction === 'increase'
                      ? 'زيادة'
                      : changeResult.direction === 'decrease'
                        ? 'انخفاض'
                        : 'بدون تغيير'}
                  </div>
                </div>
              </div>
            ) : null}

            <ResultActions
              copyText={shareText}
              shareTitle="حاسبة النسبة المئوية"
              shareText={shareText}
            />
          </CardContent>
        </Card>
      </div>

      <div className="calc-grid-3">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">عملة النتائج المالية</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <CalculatorCurrencyField
              currency={currency}
              onChange={setCurrency}
              options={currencyOptions}
              hint="تؤثر على أقسام الخصومات وتقسيم المبالغ والتغيرات المتتابعة."
              id="percentage-currency"
            />
          </CardContent>
        </Card>

        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">ماذا لو كان عندي خصمان متتاليان؟</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <p className="calc-note">
              مفيدة للعروض من نوع: خصم 20% ثم خصم إضافي 10%. النتيجة النهائية ليست جمع النسبتين
              ببساطة، لذلك تفصل لك هذه البطاقة السعر النهائي والخصم الفعلي.
            </p>
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="discount-base">السعر الأصلي قبل الخصومات</Label>
                <Input id="discount-base" inputMode="decimal" value={discountBase} onChange={(event) => setDiscountBase(event.target.value)} placeholder="مثال: 1000" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="discount-1">الخصم الأول %</Label>
                <Input id="discount-1" inputMode="decimal" value={discount1} onChange={(event) => setDiscount1(event.target.value)} placeholder="مثال: 20" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="discount-2">الخصم الثاني %</Label>
                <Input id="discount-2" inputMode="decimal" value={discount2} onChange={(event) => setDiscount2(event.target.value)} placeholder="مثال: 10" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="discount-3">خصم إضافي اختياري %</Label>
                <Input id="discount-3" inputMode="decimal" value={discount3} onChange={(event) => setDiscount3(event.target.value)} placeholder="اتركه 0 إذا لا يوجد" />
              </div>
            </div>
            <div className="calc-breakdown-list">
              <div className="calc-breakdown-item">
                <span>السعر النهائي</span>
                <strong>{formatMoney(discountResult.finalAmount)}</strong>
              </div>
              <div className="calc-breakdown-item">
                <span>الخصم الفعلي</span>
                <strong>{formatPercent(discountResult.effectiveRate, 2)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">كيف أقسم مبلغًا بالنسب؟</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <p className="calc-note">
              مناسبة للميزانيات من نوع 50% ادخار و30% مصاريف و20% التزامات. أدخل المبلغ الكلي ثم
              نسب التوزيع لترى حصة كل جزء وما إذا بقي مبلغ غير موزع.
            </p>
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="split-total">المبلغ الكلي</Label>
                <Input id="split-total" inputMode="decimal" value={splitTotal} onChange={(event) => setSplitTotal(event.target.value)} placeholder="مثال: 10000" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="split-a">النسبة الأولى %</Label>
                <Input id="split-a" inputMode="decimal" value={splitA} onChange={(event) => setSplitA(event.target.value)} placeholder="مثال: 50" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="split-b">النسبة الثانية %</Label>
                <Input id="split-b" inputMode="decimal" value={splitB} onChange={(event) => setSplitB(event.target.value)} placeholder="مثال: 30" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="split-c">النسبة الثالثة %</Label>
                <Input id="split-c" inputMode="decimal" value={splitC} onChange={(event) => setSplitC(event.target.value)} placeholder="مثال: 20" />
              </div>
            </div>
            <div className="calc-breakdown-list">
              {splitResult.allocations.map((item) => (
                <div key={item.index} className="calc-breakdown-item">
                  <span>الحصة {item.index + 1}</span>
                  <strong>{formatMoney(item.amount)}</strong>
                </div>
              ))}
              <div className="calc-breakdown-item">
                <span>المتبقي</span>
                <strong>{formatMoney(splitResult.remainingAmount)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">ماذا يحدث بعد عدة تغيرات متتابعة؟</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <p className="calc-note">
              استخدمها إذا كان السعر أو الراتب أو المؤشر يتغير أكثر من مرة، مثل: +10% ثم -5% ثم
              +12%. هذا أفضل من الحساب الذهني لأن كل نسبة تُطبَّق على قيمة جديدة.
            </p>
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="multi-initial">القيمة الأولية</Label>
                <Input id="multi-initial" inputMode="decimal" value={multiInitial} onChange={(event) => setMultiInitial(event.target.value)} placeholder="مثال: 100" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="multi-a">التغير الأول %</Label>
                <Input id="multi-a" inputMode="decimal" value={multiA} onChange={(event) => setMultiA(event.target.value)} placeholder="مثال: 10" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="multi-b">التغير الثاني %</Label>
                <Input id="multi-b" inputMode="decimal" value={multiB} onChange={(event) => setMultiB(event.target.value)} placeholder="مثال: -5" />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="multi-c">التغير الثالث %</Label>
                <Input id="multi-c" inputMode="decimal" value={multiC} onChange={(event) => setMultiC(event.target.value)} placeholder="مثال: 12" />
              </div>
            </div>
            <div className="calc-breakdown-list">
              <div className="calc-breakdown-item">
                <span>القيمة النهائية</span>
                <strong>{formatMoney(multiResult.finalValue)}</strong>
              </div>
              <div className="calc-breakdown-item">
                <span>التغير الكلي</span>
                <strong>{formatPercent(multiResult.totalChangePercent, 2)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="calc-surface-card">
        <CardHeader>
          <CardTitle className="calc-card-title">آخر النتائج المحفوظة</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length ? (
            <div className="calc-history-list">
              {history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card-nested calc-history-item"
                  onClick={() => restoreHistory(item)}
                >
                  <span className="calc-history-item__copy">
                    <strong>{item.title}</strong>
                    <span>{item.value}</span>
                  </span>
                  <RefreshCcw size={16} />
                </button>
              ))}
            </div>
          ) : (
            <div className="calc-note">احفظ نتيجة واحدة على الأقل لتظهر هنا.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
