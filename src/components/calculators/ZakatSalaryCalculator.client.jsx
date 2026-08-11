"use client";

import { useMemo, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { Bank, Info } from '@phosphor-icons/react';

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

const METHODS = [
  { id: 'unified', label: 'حول موحّد (الطريقة الموصى بها)', desc: 'حدّد يوماً واحداً كل سنة هجرية، وزكِّ كامل رصيدك المتراكم من الراتب في ذلك اليوم — الأسهل تطبيقاً وهو ما توصي به أغلب هيئات الإفتاء المعاصرة للموظفين.' },
  { id: 'per-payment', label: 'حول مستقل لكل دفعة راتب', desc: 'كل راتب شهري له حوله الخاص من تاريخ استلامه — أدق نظرياً لكنه يحتاج تتبع عشرات الحولات المنفصلة، غير عملي لأغلب الموظفين.' },
];

export default function ZakatSalaryCalculator({ livePrices }) {
  const [countryCode, setCountryCode] = useState('sa');
  const [method, setMethod] = useState('unified');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [monthsSaved, setMonthsSaved] = useState(12);
  const [otherSavings, setOtherSavings] = useState('');
  const [silverPriceOverride, setSilverPriceOverride] = useState('');

  const currency = getCurrencyByCode(countryCode);
  const countryLive = livePrices?.byCountry?.[countryCode] ?? null;
  const liveSilverPrice = countryLive?.silverPerGram ?? null;
  const effectiveSilverPrice = silverPriceOverride !== '' ? num(silverPriceOverride) : liveSilverPrice;

  const result = useMemo(() => {
    const accumulated = num(monthlySavings) * Math.max(1, Number(monthsSaved) || 1);
    const totalZakatable = accumulated + num(otherSavings);

    const nisabValue = NISAB_SILVER_GRAMS * (effectiveSilverPrice || 0);
    const hasPriceData = Boolean(effectiveSilverPrice);
    const meetsNisab = hasPriceData && totalZakatable >= nisabValue && totalZakatable > 0;
    const zakatDue = meetsNisab ? totalZakatable * ZAKAT_RATE : 0;

    return { accumulated, totalZakatable, nisabValue, hasPriceData, meetsNisab, zakatDue };
  }, [monthlySavings, monthsSaved, otherSavings, effectiveSilverPrice]);

  const nisabPercent = result.hasPriceData && result.nisabValue > 0 ? Math.min(100, Math.round((result.totalZakatable / result.nisabValue) * 100)) : 0;
  const ringColor = result.meetsNisab ? 'var(--green)' : nisabPercent >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="guide-v2-checker" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Bank size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">حاسبة زكاة الراتب والمدخرات</p>
          <p className="guide-v2-checker-sub">اختر طريقة حساب الحول المناسبة لك</p>
        </div>
      </div>

      <ZakatCountryPicker countryCode={countryCode} onChange={setCountryCode} />

      <div className="tool-v2-choice-list">
        {METHODS.map((m) => (
          <label key={m.id} className={`tool-v2-choice-card${method === m.id ? ' is-active' : ''}`}>
            <input type="radio" name="salary-method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
            <span className="tool-v2-choice-body">
              <span className="tool-v2-choice-title">{m.label}</span>
              <span className="tool-v2-choice-desc">{m.desc}</span>
            </span>
          </label>
        ))}
      </div>

      {method === 'per-payment' ? (
        <p className="tool-v2-note-strip">
          <Info size={15} weight="fill" aria-hidden="true" />
          هذه الطريقة تحتاج تتبع تاريخ استلام كل راتب شهري على حدة — استخدم متتبع الحول في{' '}
          <strong>حاسبة زكاة المال الشاملة</strong> لكل دفعة إن أردت هذه الدقة. الحاسبة أدناه تحسب
          حسب الطريقة الموحّدة الأسهل والأكثر شيوعاً.
        </p>
      ) : null}

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="zsal-monthly">متوسط ما تدَّخره من راتبك شهرياً ({currency.short})</label>
          <input id="zsal-monthly" type="number" inputMode="decimal" min="0" value={monthlySavings} onChange={(e) => setMonthlySavings(e.target.value)} placeholder="0" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="zsal-months">عدد الأشهر منذ بدأت الادخار (أو منذ آخر زكاة)</label>
          <div id="zsal-months" className="tool-v2-stepper" role="group" aria-label="عدد الأشهر">
            <button type="button" className="tool-v2-stepper-btn" onClick={() => setMonthsSaved((v) => Math.max(1, v - 1))} aria-label="تقليل">−</button>
            <span className="tool-v2-stepper-val">{monthsSaved}</span>
            <button type="button" className="tool-v2-stepper-btn" onClick={() => setMonthsSaved((v) => Math.min(60, v + 1))} aria-label="زيادة">+</button>
          </div>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="zsal-other">
          مدخرات أخرى لديك بالفعل ({currency.short})
          <FieldHint text="أي نقد أو رصيد آخر لديك غير الادخار الشهري من الراتب — يُضاف للمجموع." />
        </label>
        <input id="zsal-other" type="number" inputMode="decimal" min="0" value={otherSavings} onChange={(e) => setOtherSavings(e.target.value)} placeholder="0" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="zsal-silver-price">سعر جرام الفضة اليوم ({currency.short})</label>
        <input id="zsal-silver-price" type="number" inputMode="decimal" min="0" value={silverPriceOverride} onChange={(e) => setSilverPriceOverride(e.target.value)} placeholder={liveSilverPrice ? fmt(liveSilverPrice) : 'أدخل السعر'} />
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
          <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المدَّخر المتراكم من الراتب</span><span className="tool-v2-breakdown-value">{fmt(result.accumulated)} {currency.short}</span></div>
          <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">قيمة النصاب</span><span className="tool-v2-breakdown-value">{result.hasPriceData ? `${fmt(result.nisabValue)} ${currency.short}` : '— أدخل السعر أولاً'}</span></div>
        </div>
        <p className="guide-v2-checker-result-note">
          هذا تقدير استرشادي بالطريقة الموحّدة — يفترض ثبات مبلغ الادخار الشهري تقريباً. إن تفاوتت
          مدخراتك كثيراً من شهر لآخر، احسب المجموع الفعلي المتبقي لديك يوم زكاتك مباشرة بدل هذا التقدير.
        </p>
      </div>
    </div>
  );
}
