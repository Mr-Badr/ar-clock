"use client";

import { useMemo, useRef, useState } from 'react';
import { FilePlus, Info, Sparkle, Trash } from '@phosphor-icons/react';

import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ZakatCountryPicker from './ZakatCountryPicker.client';
import { getCurrencyByCode } from '@/lib/shared/arab-currencies';
import { GOLD_PURITIES } from '@/lib/islamic/zakat-live-prices';
import { MADHABS, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, ZAKAT_RATE, getMadhabRules } from '@/lib/islamic/zakat-madhab';

function newGoldItem(id) {
  return { id, label: '', weightGrams: '', karat: 21, isPersonal: false };
}
function newSilverItem(id) {
  return { id, label: '', weightGrams: '', isPersonal: false };
}

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

export default function ZakatGoldCalculator({ livePrices }) {
  // Per-instance counter (not module-level) — a module-level `let idCounter` here used to persist
  // across every render on the server process, so a page loaded after other renders in the same
  // request cycle would start from whatever count the server had already reached, while the
  // client's fresh module instance always started at 0 — a real SSR/hydration mismatch, same root
  // cause documented in GpaCalculator.client.jsx, 2026-08-19.
  const idCounterRef = useRef(0);
  const nextId = () => `item-${(idCounterRef.current += 1)}`;

  const [countryCode, setCountryCode] = useState('sa');
  const [madhabId, setMadhabId] = useState('cautious');
  const [goldItems, setGoldItems] = useState(() => [newGoldItem(nextId())]);
  const [silverItems, setSilverItems] = useState(() => []);
  const [goldPriceOverride, setGoldPriceOverride] = useState('');
  const [silverPriceOverride, setSilverPriceOverride] = useState('');
  const [nisabBasis, setNisabBasis] = useState(null);

  const madhab = getMadhabRules(madhabId);
  const currency = getCurrencyByCode(countryCode);
  const countryLive = livePrices?.byCountry?.[countryCode] ?? null;
  const isUnpriced = livePrices?.unpriced?.includes(countryCode) ?? false;
  const livePrice24k = countryLive?.goldPerGramByKarat?.[24] ?? null;
  const liveSilverPrice = countryLive?.silverPerGram ?? null;
  const effectiveGoldPrice24k = goldPriceOverride !== '' ? num(goldPriceOverride) : livePrice24k;
  const effectiveSilverPrice = silverPriceOverride !== '' ? num(silverPriceOverride) : liveSilverPrice;
  const resolvedNisabBasis = nisabBasis ?? madhab.rules.defaultNisabBasis;

  function updateGoldItem(id, patch) {
    setGoldItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function updateSilverItem(id, patch) {
    setSilverItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  const result = useMemo(() => {
    const goldRows = goldItems.map((it) => {
      const karatFraction = GOLD_PURITIES.find((p) => p.karat === it.karat)?.fraction ?? 1;
      const pricePerGram = (effectiveGoldPrice24k || 0) * karatFraction;
      const value = num(it.weightGrams) * pricePerGram;
      const zakatable = !it.isPersonal || madhab.rules.jewelryZakatable;
      return { ...it, value, zakatable, pricePerGram };
    });
    const silverRows = silverItems.map((it) => {
      const value = num(it.weightGrams) * (effectiveSilverPrice || 0);
      const zakatable = !it.isPersonal || madhab.rules.jewelryZakatable;
      return { ...it, value, zakatable };
    });

    const zakatableGoldValue = goldRows.filter((r) => r.zakatable).reduce((s, r) => s + r.value, 0);
    const zakatableSilverValue = silverRows.filter((r) => r.zakatable).reduce((s, r) => s + r.value, 0);
    const excludedValue = [...goldRows, ...silverRows].filter((r) => !r.zakatable).reduce((s, r) => s + r.value, 0);
    const totalZakatable = zakatableGoldValue + zakatableSilverValue;

    const nisabValue = resolvedNisabBasis === 'gold'
      ? NISAB_GOLD_GRAMS * (effectiveGoldPrice24k || 0)
      : NISAB_SILVER_GRAMS * (effectiveSilverPrice || 0);
    const hasPriceData = resolvedNisabBasis === 'gold' ? Boolean(effectiveGoldPrice24k) : Boolean(effectiveSilverPrice);
    const meetsNisab = hasPriceData && totalZakatable >= nisabValue && totalZakatable > 0;
    const zakatDue = meetsNisab ? totalZakatable * ZAKAT_RATE : 0;

    return { goldRows, silverRows, zakatableGoldValue, zakatableSilverValue, excludedValue, totalZakatable, nisabValue, hasPriceData, meetsNisab, zakatDue };
  }, [goldItems, silverItems, effectiveGoldPrice24k, effectiveSilverPrice, madhab, resolvedNisabBasis]);

  const nisabPercent = result.hasPriceData && result.nisabValue > 0 ? Math.min(100, Math.round((result.totalZakatable / result.nisabValue) * 100)) : 0;
  const ringColor = result.meetsNisab ? 'var(--green)' : nisabPercent >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="guide-v2-checker" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Sparkle size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">حاسبة زكاة الذهب والفضة — قطعة بقطعة</p>
          <p className="guide-v2-checker-sub">أضف كل قطعة على حدة بوزنها وعيارها — النتيجة أدق من تقدير إجمالي</p>
        </div>
      </div>

      <ZakatCountryPicker countryCode={countryCode} onChange={setCountryCode} />

      {isUnpriced ? (
        <p className="tool-v2-note-strip">
          <Info size={15} weight="fill" aria-hidden="true" />
          تعذّر جلب سعر السوق اللحظي لعملة {currency.country} بثقة كافية — أدخل سعر جرام الذهب والفضة يدوياً بحسب مصدر تثق به.
        </p>
      ) : livePrices ? (
        <p className="guide-v2-checker-result-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkle size={14} weight="fill" aria-hidden="true" />
          الأسعار محدَّثة تلقائياً بعملة {currency.country}.
        </p>
      ) : null}

      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>ما مذهبك؟</p>
        <div className="guide-v2-checker-options" role="group" aria-label="المذهب">
          {MADHABS.map((m) => (
            <button key={m.id} type="button" className={`guide-v2-checker-chip${madhabId === m.id ? ' is-active' : ''}`} aria-pressed={madhabId === m.id} onClick={() => setMadhabId(m.id)}>
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="zk-gold-price">
          سعر جرام الذهب عيار 24 اليوم ({currency.short})
          <FieldHint text="يُستخدم لتقييم كل قطعة ذهب (مضروباً بنسبة عيارها) ولحساب قيمة النصاب." />
        </label>
        <input id="zk-gold-price" type="number" inputMode="decimal" min="0" value={goldPriceOverride} onChange={(e) => setGoldPriceOverride(e.target.value)} placeholder={livePrice24k ? fmt(livePrice24k) : 'أدخل السعر'} />
      </div>

      <div>
        <label>قطع الذهب</label>
        <div className="tool-v2-addon-list">
          {result.goldRows.map((row) => (
            <div className="tool-v2-addon-row is-active" key={row.id}>
              <div className="tool-v2-field-row-pair" style={{ marginBottom: 0 }}>
                <input type="text" placeholder="وصف القطعة (اختياري)" value={row.label} onChange={(e) => updateGoldItem(row.id, { label: e.target.value })} />
                <input type="number" inputMode="decimal" min="0" placeholder="الوزن (جرام)" value={row.weightGrams} onChange={(e) => updateGoldItem(row.id, { weightGrams: e.target.value })} />
              </div>
              <div className="tool-v2-addon-inputs">
                <select value={row.karat} onChange={(e) => updateGoldItem(row.id, { karat: Number(e.target.value) })}>
                  {GOLD_PURITIES.map((p) => (
                    <option key={p.karat} value={p.karat}>{p.label}</option>
                  ))}
                </select>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                  <input type="checkbox" checked={row.isPersonal} onChange={(e) => updateGoldItem(row.id, { isPersonal: e.target.checked })} />
                  حلي شخصي
                </label>
                <span className="tool-v2-addon-unit">{fmt(row.value)} {currency.short}{!row.zakatable ? ' (لا تُحتسب)' : ''}</span>
                <button type="button" className="tool-v2-stepper-btn" onClick={() => setGoldItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== row.id) : prev))} aria-label="حذف القطعة" style={{ marginInlineStart: 'auto' }}>
                  <Trash size={15} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="tool-v2-action-btn" onClick={() => setGoldItems((prev) => [...prev, newGoldItem(nextId())])} style={{ marginTop: 8 }}>
          <FilePlus size={16} weight="bold" /> إضافة قطعة ذهب
        </button>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="zk-silver-price">سعر جرام الفضة اليوم ({currency.short})</label>
        <input id="zk-silver-price" type="number" inputMode="decimal" min="0" value={silverPriceOverride} onChange={(e) => setSilverPriceOverride(e.target.value)} placeholder={liveSilverPrice ? fmt(liveSilverPrice) : 'أدخل السعر'} />
      </div>

      <div>
        <label>قطع الفضة (اختياري)</label>
        {result.silverRows.length > 0 ? (
          <div className="tool-v2-addon-list">
            {result.silverRows.map((row) => (
              <div className="tool-v2-addon-row is-active" key={row.id}>
                <div className="tool-v2-field-row-pair" style={{ marginBottom: 0 }}>
                  <input type="text" placeholder="وصف القطعة (اختياري)" value={row.label} onChange={(e) => updateSilverItem(row.id, { label: e.target.value })} />
                  <input type="number" inputMode="decimal" min="0" placeholder="الوزن (جرام)" value={row.weightGrams} onChange={(e) => updateSilverItem(row.id, { weightGrams: e.target.value })} />
                </div>
                <div className="tool-v2-addon-inputs">
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                    <input type="checkbox" checked={row.isPersonal} onChange={(e) => updateSilverItem(row.id, { isPersonal: e.target.checked })} />
                    حلي شخصي
                  </label>
                  <span className="tool-v2-addon-unit">{fmt(row.value)} {currency.short}{!row.zakatable ? ' (لا تُحتسب)' : ''}</span>
                  <button type="button" className="tool-v2-stepper-btn" onClick={() => setSilverItems((prev) => prev.filter((it) => it.id !== row.id))} aria-label="حذف القطعة" style={{ marginInlineStart: 'auto' }}>
                    <Trash size={15} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <button type="button" className="tool-v2-action-btn" onClick={() => setSilverItems((prev) => [...prev, newSilverItem(nextId())])} style={{ marginTop: 8 }}>
          <FilePlus size={16} weight="bold" /> إضافة قطعة فضة
        </button>
      </div>

      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>أساس حساب النصاب</p>
        <div className="guide-v2-checker-options" role="group" aria-label="أساس النصاب">
          <button type="button" className={`guide-v2-checker-chip${nisabBasis === null ? ' is-active' : ''}`} aria-pressed={nisabBasis === null} onClick={() => setNisabBasis(null)}>
            تلقائي حسب مذهبك ({resolvedNisabBasis === 'gold' ? 'الذهب' : 'الفضة'})
          </button>
          <button type="button" className={`guide-v2-checker-chip${nisabBasis === 'gold' ? ' is-active' : ''}`} aria-pressed={nisabBasis === 'gold'} onClick={() => setNisabBasis('gold')}>الذهب فقط</button>
          <button type="button" className={`guide-v2-checker-chip${nisabBasis === 'silver' ? ' is-active' : ''}`} aria-pressed={nisabBasis === 'silver'} onClick={() => setNisabBasis('silver')}>الفضة فقط</button>
        </div>
      </div>

      <div className="guide-v2-checker-result" aria-live="polite">
        <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <AnimatedCircularProgressBar className="tool-v2-progress-ring" value={nisabPercent} gaugePrimaryColor={ringColor} gaugeSecondaryColor="var(--bg-surface-2)" />
          <div style={{ textAlign: 'center' }}>
            <span className="tool-v2-result-label">مقدار الزكاة الواجبة</span>
            <div className="tool-v2-result-value" style={{ color: 'var(--green-text)', direction: 'ltr' }}>{fmt(result.zakatDue)} {currency.short}</div>
          </div>
        </div>

        {result.zakatableGoldValue > 0 && result.zakatableSilverValue > 0 ? (
          <div className="tool-v2-chart-card">
            <div className="tool-v2-chart-head"><h3>تفصيل القطع الزكوية</h3></div>
            <div className="tool-v2-hbar-list">
              <div className="tool-v2-hbar-row">
                <span className="tool-v2-hbar-label">الذهب</span>
                <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${(result.zakatableGoldValue / result.totalZakatable) * 100}%`, background: 'var(--amber-text)' }} /></div>
                <span className="tool-v2-hbar-value">{fmt(result.zakatableGoldValue)} {currency.short}</span>
              </div>
              <div className="tool-v2-hbar-row">
                <span className="tool-v2-hbar-label">الفضة</span>
                <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${(result.zakatableSilverValue / result.totalZakatable) * 100}%`, background: 'var(--text-secondary)' }} /></div>
                <span className="tool-v2-hbar-value">{fmt(result.zakatableSilverValue)} {currency.short}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">إجمالي القطع الزكوية</span>
            <span className="tool-v2-breakdown-value">{fmt(result.totalZakatable)} {currency.short}</span>
          </div>
          {result.excludedValue > 0 ? (
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">قطع مستبعدة (حلي على مذهبك)</span>
              <span className="tool-v2-breakdown-value">{fmt(result.excludedValue)} {currency.short}</span>
            </div>
          ) : null}
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">قيمة النصاب</span>
            <span className="tool-v2-breakdown-value">{result.hasPriceData ? `${fmt(result.nisabValue)} ${currency.short}` : '— أدخل السعر أولاً'}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">هل بلغ مالك النصاب؟</span>
            <span className="tool-v2-breakdown-value">{result.hasPriceData ? (result.meetsNisab ? 'نعم' : 'لا') : '—'}</span>
          </div>
        </div>

        <p className="guide-v2-checker-result-note">
          هذا تقدير استرشادي — تحقّق من دقة السعر ليوم إخراج الزكاة الفعلي، واستشر جهة إفتاء موثوقة عند الشك في حالة خاصة.
        </p>
      </div>
    </div>
  );
}
