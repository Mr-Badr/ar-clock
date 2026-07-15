"use client";

import { useMemo, useState } from 'react';
import { Coins, Info, Scales, ShieldCheck, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  calculateZakat,
  formatCurrency,
  formatNumber,
  ZAKAT_NISAB_GOLD_GRAMS,
  ZAKAT_NISAB_SILVER_GRAMS,
} from '@/lib/calculators/engine';

const GOLD_PRICE_DEFAULT = {
  SAR: 340, AED: 338, KWD: 110, QAR: 1310, BHD: 135, OMR: 138, EGP: 4900, JOD: 254, USD: 93,
};

export default function ZakatCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();

  const [goldPricePerGram, setGoldPricePerGram] = useState('');
  const [silverPricePerGram, setSilverPricePerGram] = useState('');
  const [nisabBasis, setNisabBasis] = useState('gold');

  const [cash, setCash] = useState('');
  const [bankDeposits, setBankDeposits] = useState('');
  const [goldGrams, setGoldGrams] = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [investments, setInvestments] = useState('');
  const [businessInventory, setBusinessInventory] = useState('');
  const [receivables, setReceivables] = useState('');
  const [debts, setDebts] = useState('');

  const formatMoney = (v) => formatCurrency(v, currency);

  const defaultGold = GOLD_PRICE_DEFAULT[currency] || GOLD_PRICE_DEFAULT.SAR;
  const resolvedGoldPrice = goldPricePerGram !== '' ? goldPricePerGram : String(defaultGold);
  const resolvedSilverPrice = silverPricePerGram !== '' ? silverPricePerGram : String(Math.round(defaultGold * 0.012));

  const result = useMemo(() => calculateZakat({
    cash,
    bankDeposits,
    gold: goldGrams,
    silver: silverGrams,
    investments,
    businessInventory,
    receivables,
    debts,
    goldPricePerGram: resolvedGoldPrice,
    silverPricePerGram: resolvedSilverPrice,
    nisabBasis,
  }), [cash, bankDeposits, goldGrams, silverGrams, investments, businessInventory, receivables, debts, resolvedGoldPrice, resolvedSilverPrice, nisabBasis]);

  const shareText = result.isValid
    ? `حاسبة الزكاة\nالوعاء الزكوي: ${formatMoney(result.netZakatable)}\nالزكاة الواجبة: ${formatMoney(result.zakatDue)}`
    : '';

  const breakdownItems = [
    { label: 'النقود في اليد', value: result.breakdown?.cash, key: 'cash' },
    { label: 'الودائع المصرفية', value: result.breakdown?.bankDeposits, key: 'bank' },
    { label: 'الذهب (قيمة سوقية)', value: result.breakdown?.gold, key: 'gold' },
    { label: 'الفضة (قيمة سوقية)', value: result.breakdown?.silver, key: 'silver' },
    { label: 'الاستثمارات والأسهم', value: result.breakdown?.investments, key: 'inv' },
    { label: 'البضاعة التجارية', value: result.breakdown?.businessInventory, key: 'biz' },
    { label: 'الديون المستحقة لك', value: result.breakdown?.receivables, key: 'rec' },
  ].filter((item) => item.value > 0);

  return (
    <div className="calc-app zakat-tool" aria-label="حاسبة الزكاة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* Currency */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>العملة وأسعار المعادن</Label>
                </div>
                <CalculatorCurrencyField
                  currency={currency}
                  onChange={setCurrency}
                  options={currencyOptions}
                  id="zakat-currency"
                />
                <div className="zakat-price-row">
                  <div>
                    <Label htmlFor="zakat-gold-price" className="calc-hint">
                      سعر جرام الذهب
                    </Label>
                    <Input
                      id="zakat-gold-price"
                      inputMode="decimal"
                      value={goldPricePerGram}
                      onChange={(e) => setGoldPricePerGram(e.target.value)}
                      placeholder={String(defaultGold)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zakat-silver-price" className="calc-hint">
                      سعر جرام الفضة
                    </Label>
                    <Input
                      id="zakat-silver-price"
                      inputMode="decimal"
                      value={silverPricePerGram}
                      onChange={(e) => setSilverPricePerGram(e.target.value)}
                      placeholder={String(Math.round(defaultGold * 0.012))}
                    />
                  </div>
                </div>
              </div>

              {/* Assets */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>أصولك الزكوية</Label>
                </div>
                {[
                  { id: 'zakat-cash', label: 'النقود في اليد', value: cash, setter: setCash, placeholder: '0' },
                  { id: 'zakat-bank', label: 'الودائع المصرفية والحسابات', value: bankDeposits, setter: setBankDeposits, placeholder: '0' },
                  { id: 'zakat-invest', label: 'الأسهم والاستثمارات (قيمة السوقية)', value: investments, setter: setInvestments, placeholder: '0' },
                  {
                    id: 'zakat-biz',
                    label: 'البضاعة التجارية (بالقيمة السوقية الحالية)',
                    value: businessInventory,
                    setter: setBusinessInventory,
                    placeholder: '0',
                    hint: 'قوّمها بسعر البيع الحالي في السوق يوم الزكاة، لا بسعر شرائها — وهو قول جمهور الفقهاء.',
                  },
                  {
                    id: 'zakat-rec',
                    label: 'الديون المستحقة لك (قابلة للسداد)',
                    value: receivables,
                    setter: setReceivables,
                    placeholder: '0',
                    hint: 'أدخل الديون التي تتوقع تحصيلها (دين على مليء باذل). الديون المعدومة أو المشكوك فيها لا تُزكّى إلا بعد قبضها.',
                  },
                ].map((field) => (
                  <div key={field.id} className="zakat-asset-row">
                    <Label htmlFor={field.id} className="zakat-asset-label">{field.label}</Label>
                    <div className="calc-esb-money-row">
                      <Input
                        id={field.id}
                        inputMode="decimal"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                      />
                      <span className="calc-esb-currency">{currency}</span>
                    </div>
                    {field.hint && <p className="calc-hint">{field.hint}</p>}
                  </div>
                ))}
              </div>

              {/* Gold & Silver grams */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>الذهب والفضة (بالجرام)</Label>
                </div>
                <div className="zakat-price-row">
                  <div>
                    <Label htmlFor="zakat-gold" className="calc-hint">ذهب (جرام)</Label>
                    <Input id="zakat-gold" inputMode="decimal" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} placeholder="0" />
                    <p className="calc-hint">نصاب: {ZAKAT_NISAB_GOLD_GRAMS} جرام</p>
                  </div>
                  <div>
                    <Label htmlFor="zakat-silver" className="calc-hint">فضة (جرام)</Label>
                    <Input id="zakat-silver" inputMode="decimal" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} placeholder="0" />
                    <p className="calc-hint">نصاب: {ZAKAT_NISAB_SILVER_GRAMS} جرام</p>
                  </div>
                </div>
              </div>

              {/* Debts */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label htmlFor="zakat-debts">ديونك قصيرة الأجل (المستحقة هذا العام)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="zakat-debts"
                    inputMode="decimal"
                    value={debts}
                    onChange={(e) => setDebts(e.target.value)}
                    placeholder="0"
                  />
                  <span className="calc-esb-currency">{currency}</span>
                </div>
                <p className="calc-hint">تُطرح من الوعاء الزكوي وفق الرأي الراجح</p>
              </div>

              {/* Nisab basis */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">5</span>
                  <Label>أساس النصاب</Label>
                </div>
                <div className="zakat-nisab-toggle">
                  <button
                    type="button"
                    className={`chip calc-chip-button${nisabBasis === 'gold' ? ' is-active' : ''}`}
                    onClick={() => setNisabBasis('gold')}
                  >
                    نصاب الذهب (85 جرام)
                  </button>
                  <button
                    type="button"
                    className={`chip calc-chip-button${nisabBasis === 'silver' ? ' is-active' : ''}`}
                    onClick={() => setNisabBasis('silver')}
                  >
                    نصاب الفضة (595 جرام)
                  </button>
                </div>
                <p className="calc-hint">
                  <Info size={12} weight="bold" />
                  {' '}نصاب الفضة أنفع للفقراء — كثير من العلماء المعاصرين يُرجّحونه
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel zakat-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">☪️ حاسبة الزكاة</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Nisab status */}
              {result.nisab > 0 && (
                <div className={`zakat-nisab-badge${result.meetsNisab ? ' --met' : ' --not-met'}`}>
                  {result.meetsNisab ? (
                    <><ShieldCheck size={14} weight="bold" /> بلغت النصاب — الزكاة واجبة</>
                  ) : (
                    <><Warning size={14} weight="bold" /> لم تبلغ النصاب — لا زكاة واجبة الآن</>
                  )}
                </div>
              )}

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">الزكاة الواجبة</span>
                <div className="calc-esb-amount-value">
                  {result.meetsNisab ? formatMoney(result.zakatDue) : '—'}
                </div>
                <div className="calc-esb-amount-meta">
                  <span>2.5% من الوعاء الصافي</span>
                  {result.nisab > 0 && (
                    <>
                      <span className="calc-esb-sep">·</span>
                      <span>النصاب: {formatMoney(result.nisab)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="calc-esb-breakdown">
                {breakdownItems.map((item) => (
                  <div key={item.key} className="calc-esb-brow">
                    <span>{item.label}</span>
                    <strong>{formatMoney(item.value)}</strong>
                  </div>
                ))}
                {result.breakdown?.debts > 0 && (
                  <div className="calc-esb-brow calc-esb-brow--neg">
                    <span>الديون المخصومة</span>
                    <strong>- {formatMoney(result.breakdown.debts)}</strong>
                  </div>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الوعاء الزكوي الصافي</span>
                  <strong>{formatMoney(result.netZakatable)}</strong>
                </div>
              </div>

              {/* Asset distribution bars */}
              {result.netZakatable > 0 && breakdownItems.some(i => (i.value || 0) > 0) && (
                <div className="zakat-asset-bars">
                  <p className="zakat-asset-bars__heading">توزيع الأصول</p>
                  {breakdownItems.filter(i => (i.value || 0) > 0).map((item) => {
                    const pct = Math.round(((item.value || 0) / result.netZakatable) * 100);
                    return (
                      <div key={item.key} className="zakat-bar-item">
                        <div className="zakat-bar-meta">
                          <span>{item.label}</span>
                          <span className="zakat-bar-pct">{pct}%</span>
                        </div>
                        <div className="zakat-bar-track">
                          <div className="zakat-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="zakat-disclaimer">
                <Info size={13} weight="bold" />
                <span>هذه الحاسبة أداة استرشادية. راجع عالماً موثوقاً لتأكيد وضعك الخاص.</span>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الزكاة"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Coins size={28} weight="duotone" />
              <p>أدخل ما تملكه من أصول لحساب الزكاة.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
