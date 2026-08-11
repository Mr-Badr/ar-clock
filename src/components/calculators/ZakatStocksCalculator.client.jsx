"use client";

import { useMemo, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { Info, TrendUp } from '@phosphor-icons/react';

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

const MODES = [
  { id: 'trading', label: 'أسهم مضاربة', desc: 'تشتريها وتبيعها بقصد الربح من فروق الأسعار — تُزكّى بكامل القيمة السوقية.' },
  { id: 'investment', label: 'أسهم استثمار', desc: 'تحتفظ بها طويلاً للأرباح السنوية دون نية بيع — تُزكّى الأرباح فقط.' },
  { id: 'mixed', label: 'محفظة مختلطة', desc: 'جزء للمضاربة وجزء للاستثمار — تُزكّى كل جزء بحكمه الخاص.' },
];

export default function ZakatStocksCalculator({ livePrices }) {
  const [countryCode, setCountryCode] = useState('sa');
  const [mode, setMode] = useState('trading');
  const [shareCount, setShareCount] = useState('');
  const [sharePrice, setSharePrice] = useState('');
  const [dividends, setDividends] = useState('');
  const [mixedTradingValue, setMixedTradingValue] = useState('');
  const [mixedDividends, setMixedDividends] = useState('');
  const [silverPriceOverride, setSilverPriceOverride] = useState('');

  const currency = getCurrencyByCode(countryCode);
  const countryLive = livePrices?.byCountry?.[countryCode] ?? null;
  const liveSilverPrice = countryLive?.silverPerGram ?? null;
  const effectiveSilverPrice = silverPriceOverride !== '' ? num(silverPriceOverride) : liveSilverPrice;

  const result = useMemo(() => {
    let totalZakatable = 0;
    let marketValue = 0;
    if (mode === 'trading') {
      marketValue = num(shareCount) * num(sharePrice);
      totalZakatable = marketValue;
    } else if (mode === 'investment') {
      totalZakatable = num(dividends);
    } else {
      totalZakatable = num(mixedTradingValue) + num(mixedDividends);
    }

    const nisabValue = NISAB_SILVER_GRAMS * (effectiveSilverPrice || 0);
    const hasPriceData = Boolean(effectiveSilverPrice);
    const meetsNisab = hasPriceData && totalZakatable >= nisabValue && totalZakatable > 0;
    const zakatDue = meetsNisab ? totalZakatable * ZAKAT_RATE : 0;

    return { marketValue, totalZakatable, nisabValue, hasPriceData, meetsNisab, zakatDue };
  }, [mode, shareCount, sharePrice, dividends, mixedTradingValue, mixedDividends, effectiveSilverPrice]);

  const nisabPercent = result.hasPriceData && result.nisabValue > 0 ? Math.min(100, Math.round((result.totalZakatable / result.nisabValue) * 100)) : 0;
  const ringColor = result.meetsNisab ? 'var(--green)' : nisabPercent >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="guide-v2-checker" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><TrendUp size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">حاسبة زكاة الأسهم</p>
          <p className="guide-v2-checker-sub">اختر نيتك من الشراء — الحكم يختلف جوهرياً</p>
        </div>
      </div>

      <ZakatCountryPicker countryCode={countryCode} onChange={setCountryCode} />

      <div className="tool-v2-choice-list">
        {MODES.map((m) => (
          <label key={m.id} className={`tool-v2-choice-card${mode === m.id ? ' is-active' : ''}`}>
            <input type="radio" name="stocks-mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} />
            <span className="tool-v2-choice-body">
              <span className="tool-v2-choice-title">{m.label}</span>
              <span className="tool-v2-choice-desc">{m.desc}</span>
            </span>
          </label>
        ))}
      </div>

      {mode === 'trading' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="zs-shares">عدد الأسهم</label>
            <input id="zs-shares" type="number" inputMode="decimal" min="0" value={shareCount} onChange={(e) => setShareCount(e.target.value)} placeholder="0" />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="zs-price">سعر السهم اليوم ({currency.short})</label>
            <input id="zs-price" type="number" inputMode="decimal" min="0" value={sharePrice} onChange={(e) => setSharePrice(e.target.value)} placeholder="0" />
          </div>
        </div>
      ) : null}

      {mode === 'investment' ? (
        <div className="tool-v2-field">
          <label htmlFor="zs-dividends">
            الأرباح الموزَّعة هذا العام ({currency.short})
            <FieldHint text="تُزكّى الأرباح فقط، لا أصل قيمة الأسهم — طالما لا تنوي بيعها." />
          </label>
          <input id="zs-dividends" type="number" inputMode="decimal" min="0" value={dividends} onChange={(e) => setDividends(e.target.value)} placeholder="0" />
        </div>
      ) : null}

      {mode === 'mixed' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="zs-mixed-trading">قيمة الجزء المخصص للمضاربة ({currency.short})</label>
            <input id="zs-mixed-trading" type="number" inputMode="decimal" min="0" value={mixedTradingValue} onChange={(e) => setMixedTradingValue(e.target.value)} placeholder="0" />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="zs-mixed-dividends">أرباح الجزء المخصص للاستثمار ({currency.short})</label>
            <input id="zs-mixed-dividends" type="number" inputMode="decimal" min="0" value={mixedDividends} onChange={(e) => setMixedDividends(e.target.value)} placeholder="0" />
          </div>
        </div>
      ) : null}

      <div className="tool-v2-field">
        <label htmlFor="zs-silver-price">
          سعر جرام الفضة اليوم ({currency.short})
          <FieldHint text="يُستخدم لتحديد النصاب — أغلب هيئات الإفتاء المعاصرة تعتمد نصاب الفضة للأوراق النقدية والأسهم (الأحظ للفقراء)." />
        </label>
        <input id="zs-silver-price" type="number" inputMode="decimal" min="0" value={silverPriceOverride} onChange={(e) => setSilverPriceOverride(e.target.value)} placeholder={liveSilverPrice ? fmt(liveSilverPrice) : 'أدخل السعر'} />
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
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">المبلغ الزكوي</span>
            <span className="tool-v2-breakdown-value">{fmt(result.totalZakatable)} {currency.short}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">قيمة النصاب (نصاب الفضة)</span>
            <span className="tool-v2-breakdown-value">{result.hasPriceData ? `${fmt(result.nisabValue)} ${currency.short}` : '— أدخل السعر أولاً'}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">هل بلغ النصاب؟</span>
            <span className="tool-v2-breakdown-value">{result.hasPriceData ? (result.meetsNisab ? 'نعم' : 'لا') : '—'}</span>
          </div>
        </div>
        <p className="guide-v2-checker-result-note">
          هذا تقدير استرشادي — للشركات التي تنشر "وعاء الزكاة" الرسمي للسهم، استخدم رقمها إن كان
          متوفراً لأنه أدق من التقدير العام. استشر جهة إفتاء موثوقة عند الشك في محفظة كبيرة أو معقدة.
        </p>
      </div>
    </div>
  );
}
