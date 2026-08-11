"use client";

import { useMemo, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { Info, Package } from '@phosphor-icons/react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ZakatCountryPicker from './ZakatCountryPicker.client';
import { getCurrencyByCode } from '@/lib/shared/arab-currencies';
import { NISAB_SILVER_GRAMS, ZAKAT_RATE } from '@/lib/islamic/zakat-madhab';

function num(v) {
  return Math.max(0, Number(v) || 0);
}
function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
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

export default function ZakatTradeGoodsCalculator({ livePrices }) {
  const [countryCode, setCountryCode] = useState('sa');
  const [inventoryValue, setInventoryValue] = useState('');
  const [cashOnHand, setCashOnHand] = useState('');
  const [receivableDebt, setReceivableDebt] = useState('');
  const [receivableCollectible, setReceivableCollectible] = useState(true);
  const [payableDebt, setPayableDebt] = useState('');
  const [fixedAssetsNote, setFixedAssetsNote] = useState(false);
  const [silverPriceOverride, setSilverPriceOverride] = useState('');

  const currency = getCurrencyByCode(countryCode);
  const countryLive = livePrices?.byCountry?.[countryCode] ?? null;
  const liveSilverPrice = countryLive?.silverPerGram ?? null;
  const effectiveSilverPrice = silverPriceOverride !== '' ? num(silverPriceOverride) : liveSilverPrice;

  const result = useMemo(() => {
    const inventory = num(inventoryValue);
    const cash = num(cashOnHand);
    const receivable = receivableCollectible ? num(receivableDebt) : 0;
    const payable = num(payableDebt);

    const totalAssets = inventory + cash + receivable;
    const totalZakatable = Math.max(0, totalAssets - payable);

    const nisabValue = NISAB_SILVER_GRAMS * (effectiveSilverPrice || 0);
    const hasPriceData = Boolean(effectiveSilverPrice);
    const meetsNisab = hasPriceData && totalZakatable >= nisabValue && totalZakatable > 0;
    const zakatDue = meetsNisab ? totalZakatable * ZAKAT_RATE : 0;

    return { inventory, cash, receivable, payable, totalZakatable, nisabValue, hasPriceData, meetsNisab, zakatDue };
  }, [inventoryValue, cashOnHand, receivableDebt, receivableCollectible, payableDebt, effectiveSilverPrice]);

  const nisabPercent = result.hasPriceData && result.nisabValue > 0 ? Math.min(100, Math.round((result.totalZakatable / result.nisabValue) * 100)) : 0;
  const ringColor = result.meetsNisab ? 'var(--green)' : nisabPercent >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="guide-v2-checker" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Package size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">حاسبة زكاة عروض التجارة</p>
          <p className="guide-v2-checker-sub">لأصحاب المتاجر والمشاريع التجارية</p>
        </div>
      </div>

      <ZakatCountryPicker countryCode={countryCode} onChange={setCountryCode} />

      <div className="tool-v2-field">
        <label htmlFor="ztg-inventory">
          قيمة البضاعة والمخزون بسعر البيع الحالي ({currency.short})
          <FieldHint text="القيمة السوقية الحالية (سعر البيع لا الشراء) للبضاعة المعروضة للبيع." />
        </label>
        <input id="ztg-inventory" type="number" inputMode="decimal" min="0" value={inventoryValue} onChange={(e) => setInventoryValue(e.target.value)} placeholder="0" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ztg-cash">النقد في صندوق النشاط والحسابات البنكية ({currency.short})</label>
        <input id="ztg-cash" type="number" inputMode="decimal" min="0" value={cashOnHand} onChange={(e) => setCashOnHand(e.target.value)} placeholder="0" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ztg-receivable">مستحقات لك عند العملاء (ذمم مدينة) ({currency.short})</label>
        <input id="ztg-receivable" type="number" inputMode="decimal" min="0" value={receivableDebt} onChange={(e) => setReceivableDebt(e.target.value)} placeholder="0" />
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="حالة العميل">
        <button type="button" className={`guide-v2-checker-chip${receivableCollectible ? ' is-active' : ''}`} aria-pressed={receivableCollectible} onClick={() => setReceivableCollectible(true)}>عميل قادر وغير مماطل</button>
        <button type="button" className={`guide-v2-checker-chip${!receivableCollectible ? ' is-active' : ''}`} aria-pressed={!receivableCollectible} onClick={() => setReceivableCollectible(false)}>معسر أو مماطل</button>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ztg-payable">ديون على نشاطك (موردين، قروض) — تُخصم ({currency.short})</label>
        <input id="ztg-payable" type="number" inputMode="decimal" min="0" value={payableDebt} onChange={(e) => setPayableDebt(e.target.value)} placeholder="0" />
      </div>

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
        <input type="checkbox" checked={fixedAssetsNote} onChange={(e) => setFixedAssetsNote(e.target.checked)} />
        نشاطي يملك أصولاً ثابتة (محل، رفوف، سيارات، معدات)
      </label>
      {fixedAssetsNote ? (
        <p className="guide-v2-checker-result-note">
          الأصول الثابتة المُستخدَمة في إدارة النشاط (لا للبيع) لا تدخل في وعاء الزكاة — لا تُدرجها
          في قيمة البضاعة أعلاه.
        </p>
      ) : null}

      <div className="tool-v2-field">
        <label htmlFor="ztg-silver-price">سعر جرام الفضة اليوم ({currency.short})</label>
        <input id="ztg-silver-price" type="number" inputMode="decimal" min="0" value={silverPriceOverride} onChange={(e) => setSilverPriceOverride(e.target.value)} placeholder={liveSilverPrice ? fmt(liveSilverPrice) : 'أدخل السعر'} />
      </div>

      <div className="guide-v2-checker-result" aria-live="polite">
        <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <AnimatedCircularProgressBar className="tool-v2-progress-ring" value={nisabPercent} gaugePrimaryColor={ringColor} gaugeSecondaryColor="var(--bg-surface-2)" />
          <div style={{ textAlign: 'center' }}>
            <span className="tool-v2-result-label">مقدار الزكاة الواجبة</span>
            <div className="tool-v2-result-value" style={{ color: 'var(--green-text)', direction: 'ltr' }}>{fmt(result.zakatDue)} {currency.short}</div>
          </div>
        </div>
        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">البضاعة والمخزون</span><span className="tool-v2-breakdown-value">{fmt(result.inventory)} {currency.short}</span></div>
          <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">النقد والمستحقات المحتسبة</span><span className="tool-v2-breakdown-value">{fmt(result.cash + result.receivable)} {currency.short}</span></div>
          <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">مخصوم: ديون على النشاط</span><span className="tool-v2-breakdown-value">-{fmt(result.payable)} {currency.short}</span></div>
          <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">قيمة النصاب</span><span className="tool-v2-breakdown-value">{result.hasPriceData ? `${fmt(result.nisabValue)} ${currency.short}` : '— أدخل السعر أولاً'}</span></div>
        </div>
        <p className="guide-v2-checker-result-note">تقدير استرشادي — استشر محاسباً شرعياً لنشاط تجاري كبير أو معقد.</p>
      </div>
    </div>
  );
}
