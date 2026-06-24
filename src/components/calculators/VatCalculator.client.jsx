"use client";

import { useMemo, useState } from 'react';
import { ArrowLeft, Calculator, ReceiptText, Scale, Store } from 'lucide-react';

import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { getCurrencyOptions } from '@/lib/calculators/currency-options';
import { VAT_COUNTRIES } from '@/lib/calculators/data';
import {
  calculateDiscountAndVat,
  calculateMarginAndVat,
  calculateVatAdd,
  calculateVatExtract,
  calculateVatReturn,
  formatCurrency,
  formatPercent,
  getVatCountry,
} from '@/lib/calculators/engine';

const VAT_MODES = [
  {
    value: 'add',
    label: 'أضيف الضريبة',
    title: 'لدي سعر قبل الضريبة',
    copy: 'استخدم هذا إذا كان السعر غير شامل وتريد معرفة الإجمالي الذي سيدفعه العميل.',
  },
  {
    value: 'extract',
    label: 'أستخرج الضريبة',
    title: 'لدي سعر شامل الضريبة',
    copy: 'استخدم هذا إذا كانت الفاتورة شاملة وتريد فصل السعر الأصلي وقيمة الضريبة.',
  },
  {
    value: 'month',
    label: 'صافي الشهر',
    title: 'لدي مبيعات ومشتريات',
    copy: 'استخدم هذا كتقدير أولي لصافي ضريبة المخرجات والمدخلات قبل الإقرار الرسمي.',
  },
];

const VAT_AMOUNT_PRESETS = ['100', '500', '1000', '5000'];

function buildCustomCountry(customRate, customCurrencyCode, currencyOptions) {
  const fallbackCurrency = { code: 'USD', label: 'USD — دولار أمريكي' };
  const customCurrency = currencyOptions.find((item) => item.code === customCurrencyCode)
    ?? currencyOptions[0]
    ?? fallbackCurrency;

  return {
    code: 'custom',
    flag: '🌍',
    name: 'نسبة مخصصة',
    rate: Math.max(0, Number(customRate) || 0),
    currency: customCurrency.label,
    currencyCode: customCurrency.code,
    note: 'أدخل النسبة الرسمية المعتمدة في بلدك أو قطاعك',
  };
}

function ResultRow({ label, value, strong }) {
  return (
    <div className={`vat-result-row${strong ? ' vat-result-row--strong' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function VatSplitBar({ base, tax, total, rate }) {
  if (!total || total <= 0 || !base) return null;
  const basePct = Math.round((base / total) * 100);
  const taxPct  = 100 - basePct;
  const perHundred = rate > 0
    ? `لكل 100 وحدة: ${(100 / (1 + rate / 100)).toFixed(1)} سعر + ${(rate / (1 + rate / 100) * 100 / 100).toFixed(1)} ضريبة`
    : null;
  return (
    <div style={{ marginTop: '14px', direction: 'rtl' }}>
      <div style={{
        display: 'flex', gap: '2px', height: '9px',
        borderRadius: '9999px', overflow: 'hidden',
      }}>
        <div style={{
          width: `${basePct}%`, background: '#10b981',
          borderRadius: '9999px 0 0 9999px',
          transition: 'width 0.55s ease',
        }} />
        <div style={{
          width: `${taxPct}%`, background: '#f59e0b',
          borderRadius: '0 9999px 9999px 0',
          transition: 'width 0.55s ease',
        }} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
          المبلغ الأصلي {basePct}٪
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          الضريبة {taxPct}٪
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
        </span>
      </div>
      {perHundred && (
        <p style={{
          marginTop: '8px', marginBottom: 0,
          fontSize: '11px', color: 'var(--text-secondary)',
          textAlign: 'center', opacity: 0.8,
        }}>
          💡 {perHundred}
        </p>
      )}
    </div>
  );
}

function ModeButton({ mode, activeMode, onSelect }) {
  const isActive = mode.value === activeMode;

  return (
    <button
      type="button"
      className={`vat-mode-card${isActive ? ' is-active' : ''}`}
      onClick={() => onSelect(mode.value)}
      aria-pressed={isActive}
    >
      <span className="vat-mode-card__label">{mode.label}</span>
      <strong>{mode.title}</strong>
      <span>{mode.copy}</span>
    </button>
  );
}

function PresetButtons({ values, currencyCode, onSelect }) {
  return (
    <div className="vat-presets" aria-label="أمثلة مبالغ جاهزة">
      <span>أمثلة جاهزة</span>
      <div className="vat-presets__buttons">
        {values.map((value) => (
          <button key={value} type="button" onClick={() => onSelect(value)}>
            {formatCurrency(Number(value), currencyCode)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VatCalculator() {
  const [mode, setMode] = useState('add');
  const [countryCode, setCountryCode] = useState('sa');
  const [customRate, setCustomRate] = useState('15');
  const [customCurrencyCode, setCustomCurrencyCode] = useState('SAR');
  const [exclusiveAmount, setExclusiveAmount] = useState('1000');
  const [inclusiveAmount, setInclusiveAmount] = useState('1150');
  const [salesAmount, setSalesAmount] = useState('11500');
  const [purchaseAmount, setPurchaseAmount] = useState('2300');
  const [amountsIncludeVat, setAmountsIncludeVat] = useState(true);
  const [discountAmount, setDiscountAmount] = useState('500');
  const [discountRate, setDiscountRate] = useState('20');
  const [cost, setCost] = useState('100');
  const [marginRate, setMarginRate] = useState('35');
  const currencyOptions = useMemo(() => getCurrencyOptions('ar'), []);

  const country = useMemo(() => {
    if (countryCode !== 'custom') return getVatCountry(countryCode);

    return buildCustomCountry(customRate, customCurrencyCode, currencyOptions);
  }, [countryCode, currencyOptions, customCurrencyCode, customRate]);
  const addResult = useMemo(
    () => calculateVatAdd(exclusiveAmount, country.rate),
    [exclusiveAmount, country.rate],
  );
  const extractResult = useMemo(
    () => calculateVatExtract(inclusiveAmount, country.rate),
    [inclusiveAmount, country.rate],
  );
  const monthResult = useMemo(
    () =>
      calculateVatReturn({
        salesAmount,
        purchaseAmount,
        rate: country.rate,
        amountsIncludeVat,
      }),
    [salesAmount, purchaseAmount, country.rate, amountsIncludeVat],
  );
  const discountResult = useMemo(
    () => calculateDiscountAndVat({ amount: discountAmount, discountRate, vatRate: country.rate }),
    [discountAmount, discountRate, country.rate],
  );
  const marginResult = useMemo(
    () => calculateMarginAndVat({ cost, marginRate, vatRate: country.rate }),
    [cost, marginRate, country.rate],
  );

  const activeAmount = mode === 'extract' ? inclusiveAmount : exclusiveAmount;
  const activeResult = mode === 'extract' ? extractResult : addResult;
  const shareText = `البلد/النسبة: ${country.name} - ${formatPercent(country.rate, 0)}\nالمبلغ: ${activeAmount}\nقبل الضريبة: ${formatCurrency(activeResult.base, country.currencyCode)}\nقيمة الضريبة: ${formatCurrency(activeResult.tax, country.currencyCode)}\nالإجمالي: ${formatCurrency(activeResult.total, country.currencyCode)}`;

  return (
    <section className="vat-tool" aria-label="حاسبة ضريبة القيمة المضافة">
      <div className="vat-tool__intro">
        <span className="vat-tool__eyebrow">ابدأ من السؤال الحقيقي</span>
        <h2>هل السعر عندك شامل الضريبة أم قبل الضريبة؟</h2>
        <p>
          اختر حالتك أولاً، ثم أدخل الرقم. الحاسبة تعرض السعر قبل الضريبة، قيمة الضريبة،
          والإجمالي في نفس المكان حتى لا تختلط عليك المعادلة.
        </p>
      </div>

      <ol className="vat-flow-steps" aria-label="خطوات استخدام الحاسبة">
        <li>
          <span>01</span>
          <strong>اختر الحالة</strong>
        </li>
        <li>
          <span>02</span>
          <strong>اكتب الرقم</strong>
        </li>
        <li>
          <span>03</span>
          <strong>راجع التفصيل</strong>
        </li>
      </ol>

      <div className="vat-mode-grid" aria-label="اختر نوع حساب الضريبة">
        {VAT_MODES.map((item) => (
          <ModeButton key={item.value} mode={item} activeMode={mode} onSelect={setMode} />
        ))}
      </div>

      <div className="vat-settings">
        <div className="vat-field">
          <Label className="calc-label" htmlFor="vat-country">الدولة أو النسبة</Label>
          <p className="calc-hint">اختر دولة جاهزة أو استخدم نسبة مخصصة لأي بلد لا يظهر في القائمة.</p>
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger id="vat-country" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VAT_COUNTRIES.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.flag} {item.name} - {formatPercent(item.rate, 0)}
                </SelectItem>
              ))}
              <SelectItem value="custom">🌍 نسبة مخصصة لأي دولة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {countryCode === 'custom' ? (
          <>
            <div className="vat-field">
              <Label className="calc-label" htmlFor="custom-vat-rate">نسبة الضريبة</Label>
              <p className="calc-hint">اكتب النسبة كما تظهر في الجهة الرسمية، مثل 19 أو 20.</p>
              <Input
                id="custom-vat-rate"
                inputMode="decimal"
                value={customRate}
                onChange={(event) => setCustomRate(event.target.value)}
              />
            </div>
            <div className="vat-field">
              <Label className="calc-label" htmlFor="custom-vat-currency">العملة</Label>
              <p className="calc-hint">تستطيع اختيار معظم العملات المتداولة عالمياً، وليس عملات القائمة المختصرة فقط.</p>
              <Select value={customCurrencyCode} onValueChange={setCustomCurrencyCode}>
                <SelectTrigger id="custom-vat-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : null}

        <div className="vat-rate-card" aria-live="polite">
          <span>{country.flag} {country.name}</span>
          <strong>{formatPercent(country.rate, 0)}</strong>
          <small>{country.note}</small>
        </div>
      </div>

      <div className="vat-workspace">
        {mode === 'add' ? (
        <div className="vat-panel" role="region" aria-label="إضافة ضريبة القيمة المضافة">
          <div className="vat-main-flow">
            <div className="vat-entry-card">
              <span className="vat-entry-card__icon"><Calculator size={18} aria-hidden="true" /></span>
              <div className="vat-field">
                <Label className="calc-label" htmlFor="exclusive-amount">
                  اكتب السعر قبل الضريبة
                </Label>
                <Input
                  id="exclusive-amount"
                  inputMode="decimal"
                  value={exclusiveAmount}
                  onChange={(event) => setExclusiveAmount(event.target.value)}
                />
                <p className="calc-hint">
                  مثال: إذا كان المنتج سعره 1000 قبل ضريبة 15%، فالإجمالي سيكون 1150.
                </p>
              </div>
              <PresetButtons values={VAT_AMOUNT_PRESETS} currencyCode={country.currencyCode} onSelect={setExclusiveAmount} />
            </div>

            <div className="vat-result-card" aria-live="polite">
              <span className="vat-result-card__label">الإجمالي شامل الضريبة</span>
              <strong className="vat-result-card__value">
                {formatCurrency(addResult.total, country.currencyCode)}
              </strong>
              <div className="vat-result-list">
                <ResultRow label="السعر قبل الضريبة" value={formatCurrency(addResult.base, country.currencyCode)} />
                <ResultRow label="قيمة الضريبة" value={formatCurrency(addResult.tax, country.currencyCode)} strong />
              </div>
              <div className="vat-formula">
                <span>المعادلة</span>
                <strong>
                  {formatCurrency(addResult.base, country.currencyCode)}
                  {' + '}
                  {formatCurrency(addResult.tax, country.currencyCode)}
                  {' = '}
                  {formatCurrency(addResult.total, country.currencyCode)}
                </strong>
              </div>
              <VatSplitBar
                base={addResult.base}
                tax={addResult.tax}
                total={addResult.total}
                rate={country.rate}
              />
            </div>
          </div>
        </div>
        ) : null}

        {mode === 'extract' ? (
        <div className="vat-panel" role="region" aria-label="استخراج ضريبة القيمة المضافة">
          <div className="vat-main-flow">
            <div className="vat-entry-card">
              <span className="vat-entry-card__icon"><ReceiptText size={18} aria-hidden="true" /></span>
              <div className="vat-field">
                <Label className="calc-label" htmlFor="inclusive-amount">
                  اكتب السعر الشامل للضريبة
                </Label>
                <Input
                  id="inclusive-amount"
                  inputMode="decimal"
                  value={inclusiveAmount}
                  onChange={(event) => setInclusiveAmount(event.target.value)}
                />
                <p className="calc-hint">
                  لا تضرب السعر الشامل في النسبة مباشرة. نستخرج السعر الأصلي بالقسمة على 1 + النسبة.
                </p>
              </div>
              <PresetButtons values={VAT_AMOUNT_PRESETS} currencyCode={country.currencyCode} onSelect={setInclusiveAmount} />
            </div>

            <div className="vat-result-card" aria-live="polite">
              <span className="vat-result-card__label">قيمة الضريبة داخل الفاتورة</span>
              <strong className="vat-result-card__value">
                {formatCurrency(extractResult.tax, country.currencyCode)}
              </strong>
              <div className="vat-result-list">
                <ResultRow label="السعر قبل الضريبة" value={formatCurrency(extractResult.base, country.currencyCode)} strong />
                <ResultRow label="الإجمالي كما كتبته" value={formatCurrency(extractResult.total, country.currencyCode)} />
              </div>
              <div className="vat-formula">
                <span>المعادلة</span>
                <strong>
                  {formatCurrency(extractResult.total, country.currencyCode)}
                  {' - '}
                  {formatCurrency(extractResult.tax, country.currencyCode)}
                  {' = '}
                  {formatCurrency(extractResult.base, country.currencyCode)}
                </strong>
              </div>
              <VatSplitBar
                base={extractResult.base}
                tax={extractResult.tax}
                total={extractResult.total}
                rate={country.rate}
              />
            </div>
          </div>
        </div>
        ) : null}

        {mode === 'month' ? (
        <div className="vat-panel" role="region" aria-label="صافي ضريبة الفترة">
          <div className="vat-main-flow">
            <div className="vat-entry-card">
              <span className="vat-entry-card__icon"><Store size={18} aria-hidden="true" /></span>
              <div className="vat-field">
                <Label className="calc-label" htmlFor="sales-amount">إجمالي المبيعات</Label>
                <Input
                  id="sales-amount"
                  inputMode="decimal"
                  value={salesAmount}
                  onChange={(event) => setSalesAmount(event.target.value)}
                />
              </div>
              <div className="vat-field">
                <Label className="calc-label" htmlFor="purchase-amount">إجمالي المشتريات</Label>
                <Input
                  id="purchase-amount"
                  inputMode="decimal"
                  value={purchaseAmount}
                  onChange={(event) => setPurchaseAmount(event.target.value)}
                />
              </div>
              <div className="vat-toggle-row">
                <button
                  type="button"
                  className={`vat-toggle${amountsIncludeVat ? ' is-active' : ''}`}
                  onClick={() => setAmountsIncludeVat(true)}
                >
                  الأرقام شاملة الضريبة
                </button>
                <button
                  type="button"
                  className={`vat-toggle${!amountsIncludeVat ? ' is-active' : ''}`}
                  onClick={() => setAmountsIncludeVat(false)}
                >
                  الأرقام قبل الضريبة
                </button>
              </div>
            </div>

            <div className="vat-result-card" aria-live="polite">
              <span className="vat-result-card__label">
                {monthResult.status === 'due' ? 'الصافي المستحق تقريباً' : 'رصيد قابل للاسترداد تقريباً'}
              </span>
              <strong className="vat-result-card__value">
                {formatCurrency(Math.abs(monthResult.net), country.currencyCode)}
              </strong>
              <div className="vat-result-list">
                <ResultRow label="ضريبة المبيعات" value={formatCurrency(monthResult.outputs.tax, country.currencyCode)} />
                <ResultRow label="ضريبة المشتريات" value={formatCurrency(monthResult.inputs.tax, country.currencyCode)} />
              </div>
              <div className="vat-formula">
                <span>المعادلة</span>
                <strong>
                  ضريبة المبيعات - ضريبة المشتريات = صافي الفترة
                </strong>
              </div>
            </div>
          </div>
        </div>
        ) : null}
      </div>

      <details className="vat-advanced">
        <summary>
          أدوات تسعير إضافية
          <ArrowLeft size={14} aria-hidden="true" />
        </summary>
        <div className="vat-advanced-grid">
          <div className="vat-mini-tool">
            <h3>خصم ثم ضريبة</h3>
            <div className="vat-mini-tool__fields">
              <div className="vat-field">
                <Label className="calc-label" htmlFor="discount-amount">السعر الأصلي</Label>
                <Input
                  id="discount-amount"
                  inputMode="decimal"
                  value={discountAmount}
                  onChange={(event) => setDiscountAmount(event.target.value)}
                />
              </div>
              <div className="vat-field">
                <Label className="calc-label" htmlFor="discount-rate">نسبة الخصم</Label>
                <Input
                  id="discount-rate"
                  inputMode="decimal"
                  value={discountRate}
                  onChange={(event) => setDiscountRate(event.target.value)}
                />
              </div>
            </div>
            <div className="vat-result-list">
              <ResultRow label="بعد الخصم" value={formatCurrency(discountResult.discounted, country.currencyCode)} />
              <ResultRow label="الضريبة" value={formatCurrency(discountResult.tax, country.currencyCode)} />
              <ResultRow label="السعر النهائي" value={formatCurrency(discountResult.total, country.currencyCode)} strong />
            </div>
          </div>

          <div className="vat-mini-tool">
            <h3>هامش ربح ثم ضريبة</h3>
            <div className="vat-mini-tool__fields">
              <div className="vat-field">
                <Label className="calc-label" htmlFor="cost">تكلفة المنتج</Label>
                <Input
                  id="cost"
                  inputMode="decimal"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                />
              </div>
              <div className="vat-field">
                <Label className="calc-label" htmlFor="margin-rate">هامش الربح</Label>
                <Input
                  id="margin-rate"
                  inputMode="decimal"
                  value={marginRate}
                  onChange={(event) => setMarginRate(event.target.value)}
                />
              </div>
            </div>
            <div className="vat-result-list">
              <ResultRow label="قبل الضريبة" value={formatCurrency(marginResult.sellingBeforeVat, country.currencyCode)} />
              <ResultRow label="الضريبة" value={formatCurrency(marginResult.tax, country.currencyCode)} />
              <ResultRow label="السعر النهائي" value={formatCurrency(marginResult.total, country.currencyCode)} strong />
            </div>
          </div>
        </div>
      </details>

      <div className="vat-tool__footer">
        <div className="vat-footnote">
          <Scale size={16} aria-hidden="true" />
          النتيجة للتقدير السريع. عند الفاتورة الرسمية أو الإقرار، راجع النسبة الرسمية وحالة السلعة أو الخدمة.
        </div>
        <ResultActions
          copyText={shareText}
          shareTitle="حاسبة ضريبة القيمة المضافة"
          shareText={shareText}
        />
      </div>
    </section>
  );
}
