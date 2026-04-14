"use client";

import { useMemo, useState } from 'react';
import { Calculator, ReceiptText, Scale, Store } from 'lucide-react';

import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
  CalcTabsList as TabsList,
  CalcTabsTrigger as TabsTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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

export default function VatCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [exclusiveAmount, setExclusiveAmount] = useState('1000');
  const [inclusiveAmount, setInclusiveAmount] = useState('1150');
  const [salesAmount, setSalesAmount] = useState('11500');
  const [purchaseAmount, setPurchaseAmount] = useState('2300');
  const [amountsIncludeVat, setAmountsIncludeVat] = useState(true);
  const [discountAmount, setDiscountAmount] = useState('500');
  const [discountRate, setDiscountRate] = useState('20');
  const [cost, setCost] = useState('100');
  const [marginRate, setMarginRate] = useState('35');

  const country = useMemo(() => getVatCountry(countryCode), [countryCode]);
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

  const shareText = `الدولة: ${country.name}\nالنسبة: ${formatPercent(country.rate, 0)}\nالمبلغ بدون الضريبة: ${formatCurrency(addResult.base, country.currencyCode)}\nالضريبة: ${formatCurrency(addResult.tax, country.currencyCode)}\nالإجمالي: ${formatCurrency(addResult.total, country.currencyCode)}`;

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">إعدادات الضريبة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <Label className="calc-label">اختر الدولة</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VAT_COUNTRIES.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.flag} {item.name} - {formatPercent(item.rate, 0)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="calc-hint">
                النسبة العامة الشائعة حالياً في {country.name}: {formatPercent(country.rate, 0)}.
              </p>
            </div>

            <div className="calc-note">
              هذه الحاسبة إرشادية للمعدل العام. بعض السلع والخدمات قد تخضع لإعفاءات أو نسب مخفضة
              بحسب الدولة والقطاع.
            </div>
          </CardContent>
        </Card>

        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">ملخص سريع</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-metric-grid">
              <div className="card-nested calc-metric-card">
                <div className="calc-metric-card__label">النسبة المعتمدة</div>
                <div className="calc-metric-card__value">{formatPercent(country.rate, 0)}</div>
                <div className="calc-metric-card__note">{country.note}</div>
              </div>
              <div className="card-nested calc-metric-card">
                <div className="calc-metric-card__label">العملة الافتراضية</div>
                <div className="calc-metric-card__value">{country.currency}</div>
                <div className="calc-metric-card__note">{country.flag} {country.name}</div>
              </div>
            </div>
            <ResultActions
              copyText={shareText}
              shareTitle="حاسبة ضريبة القيمة المضافة"
              shareText={shareText}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="add" className="calc-app">
        <TabsList className="calc-tabs-list">
          <TabsTrigger value="add" className="calc-tabs-trigger">إضافة الضريبة</TabsTrigger>
          <TabsTrigger value="extract" className="calc-tabs-trigger">استخراج الضريبة</TabsTrigger>
          <TabsTrigger value="month" className="calc-tabs-trigger">ضريبة الشهر</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="calc-tabs-panel">
          <div className="calc-grid-2">
            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">من مبلغ غير شامل</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-field">
                  <Label className="calc-label" htmlFor="exclusive-amount" style={{ display:'flex', justifyContent: 'flex-end' }}>
                    المبلغ بدون ضريبة</Label>
                  <Input
                    id="exclusive-amount"
                    inputMode="decimal"
                    value={exclusiveAmount}
                    onChange={(event) => setExclusiveAmount(event.target.value)}
                  />
                </div>
                <div className="card-deep calc-inline-formula">
                  <Calculator size={16} />
                  المبلغ × (1 + نسبة الضريبة)
                </div>
              </CardContent>
            </Card>

            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">النتيجة</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-metric-grid">
                  <div className="card-nested calc-metric-card">
                    <div className="calc-metric-card__label">قيمة الضريبة</div>
                    <div className="calc-metric-card__value">
                      {formatCurrency(addResult.tax, country.currencyCode)}
                    </div>
                  </div>
                  <div className="card-nested calc-metric-card">
                    <div className="calc-metric-card__label">الإجمالي شامل الضريبة</div>
                    <div className="calc-metric-card__value">
                      {formatCurrency(addResult.total, country.currencyCode)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="extract" className="calc-tabs-panel">
          <div className="calc-grid-2">
            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">من مبلغ شامل</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-field">
                  <Label className="calc-label" htmlFor="inclusive-amount" style={{ display:'flex', justifyContent: 'flex-end' }}>المبلغ شامل الضريبة</Label>
                  <Input
                    id="inclusive-amount"
                    inputMode="decimal"
                    value={inclusiveAmount}
                    onChange={(event) => setInclusiveAmount(event.target.value)}
                  />
                </div>
                <div className="card-deep calc-inline-formula">
                  <ReceiptText size={16} />
                  المبلغ ÷ (1 + نسبة الضريبة)
                </div>
              </CardContent>
            </Card>

            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">تفصيل الفاتورة</CardTitle>
              </CardHeader>
              <CardContent className="calc-breakdown-list">
                <div className="calc-breakdown-item">
                  <span>قبل الضريبة</span>
                  <strong>{formatCurrency(extractResult.base, country.currencyCode)}</strong>
                </div>
                <div className="calc-breakdown-item">
                  <span>الضريبة المستخرجة</span>
                  <strong>{formatCurrency(extractResult.tax, country.currencyCode)}</strong>
                </div>
                <div className="calc-breakdown-item">
                  <span>الإجمالي</span>
                  <strong>{formatCurrency(extractResult.total, country.currencyCode)}</strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="month" className="calc-tabs-panel">
          <div className="calc-grid-2">
            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">ضريبة المخرجات والمدخلات</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-grid-2">
                  <div className="calc-field">
                    <Label className="calc-label" htmlFor="sales-amount">إجمالي المبيعات</Label>
                    <Input
                      id="sales-amount"
                      inputMode="decimal"
                      value={salesAmount}
                      onChange={(event) => setSalesAmount(event.target.value)}
                    />
                  </div>
                  <div className="calc-field">
                    <Label className="calc-label" htmlFor="purchase-amount">إجمالي المشتريات</Label>
                    <Input
                      id="purchase-amount"
                      inputMode="decimal"
                      value={purchaseAmount}
                      onChange={(event) => setPurchaseAmount(event.target.value)}
                    />
                  </div>
                </div>
                <div className="calc-kbd-row">
                  <button
                    type="button"
                    className={`chip calc-chip-button ${amountsIncludeVat ? 'is-active' : ''}`}
                    onClick={() => setAmountsIncludeVat(true)}
                  >
                    المبالغ شاملة الضريبة
                  </button>
                  <button
                    type="button"
                    className={`chip calc-chip-button ${!amountsIncludeVat ? 'is-active' : ''}`}
                    onClick={() => setAmountsIncludeVat(false)}
                  >
                    المبالغ غير شاملة
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="calc-surface-card">
              <CardHeader>
                <CardTitle className="calc-card-title">صافي الضريبة</CardTitle>
              </CardHeader>
              <CardContent className="calc-form-grid">
                <div className="calc-breakdown-list">
                  <div className="calc-breakdown-item">
                    <span>ضريبة المبيعات</span>
                    <strong>{formatCurrency(monthResult.outputs.tax, country.currencyCode)}</strong>
                  </div>
                  <div className="calc-breakdown-item">
                    <span>ضريبة المشتريات</span>
                    <strong>{formatCurrency(monthResult.inputs.tax, country.currencyCode)}</strong>
                  </div>
                </div>
                <div className={monthResult.status === 'due' ? 'calc-warning' : 'calc-success'}>
                  {monthResult.status === 'due'
                    ? `الصافي المستحق للهيئة: ${formatCurrency(monthResult.net, country.currencyCode)}`
                    : `صافي الرصيد القابل للاسترداد: ${formatCurrency(Math.abs(monthResult.net), country.currencyCode)}`}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="calc-grid-2">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">خصم ثم ضريبة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="discount-amount">السعر الأصلي</Label>
                <Input
                  id="discount-amount"
                  inputMode="decimal"
                  value={discountAmount}
                  onChange={(event) => setDiscountAmount(event.target.value)}
                />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="discount-rate">نسبة الخصم</Label>
                <Input
                  id="discount-rate"
                  inputMode="decimal"
                  value={discountRate}
                  onChange={(event) => setDiscountRate(event.target.value)}
                />
              </div>
            </div>
            <div className="calc-breakdown-list">
              <div className="calc-breakdown-item">
                <span>بعد الخصم</span>
                <strong>{formatCurrency(discountResult.discounted, country.currencyCode)}</strong>
              </div>
              <div className="calc-breakdown-item">
                <span>الضريبة على السعر المخفض</span>
                <strong>{formatCurrency(discountResult.tax, country.currencyCode)}</strong>
              </div>
              <div className="calc-breakdown-item">
                <span>السعر النهائي</span>
                <strong>{formatCurrency(discountResult.total, country.currencyCode)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">هامش الربح ثم الضريبة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="cost">تكلفة المنتج</Label>
                <Input
                  id="cost"
                  inputMode="decimal"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="margin-rate">هامش الربح</Label>
                <Input
                  id="margin-rate"
                  inputMode="decimal"
                  value={marginRate}
                  onChange={(event) => setMarginRate(event.target.value)}
                />
              </div>
            </div>
            <div className="calc-breakdown-list">
              <div className="calc-breakdown-item">
                <span>سعر البيع قبل الضريبة</span>
                <strong>{formatCurrency(marginResult.sellingBeforeVat, country.currencyCode)}</strong>
              </div>
              <div className="calc-breakdown-item">
                <span>الضريبة</span>
                <strong>{formatCurrency(marginResult.tax, country.currencyCode)}</strong>
              </div>
              <div className="calc-breakdown-item">
                <span>سعر البيع النهائي</span>
                <strong>{formatCurrency(marginResult.total, country.currencyCode)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="calc-grid-4">
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label"><Calculator size={16} /></div>
          <div className="calc-metric-card__value">{formatPercent(country.rate, 0)}</div>
          <div className="calc-metric-card__note">النسبة العامة في {country.name}</div>
        </div>
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label"><Store size={16} /></div>
          <div className="calc-metric-card__value">
            {formatCurrency(monthResult.outputs.tax, country.currencyCode)}
          </div>
          <div className="calc-metric-card__note">ضريبة المخرجات حسب بياناتك</div>
        </div>
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label"><Scale size={16} /></div>
          <div className="calc-metric-card__value">
            {formatCurrency(monthResult.inputs.tax, country.currencyCode)}
          </div>
          <div className="calc-metric-card__note">ضريبة المدخلات حسب بياناتك</div>
        </div>
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label"><ReceiptText size={16} /></div>
          <div className="calc-metric-card__value">
            {formatCurrency(addResult.total, country.currencyCode)}
          </div>
          <div className="calc-metric-card__note">مثال الفاتورة الشاملة</div>
        </div>
      </div>
    </div>
  );
}
