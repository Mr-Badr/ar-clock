"use client";

import { useEffect, useMemo, useState } from 'react';
import { Basket, Info } from '@phosphor-icons/react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ZakatCountryPicker from './ZakatCountryPicker.client';
import { getCurrencyByCode } from '@/lib/shared/arab-currencies';
import { FITR_STAPLES, MADHABS, getFitrSaaKg, getMadhabRules } from '@/lib/islamic/zakat-madhab';
import { getFitrReference } from '@/lib/islamic/zakat-fitr-reference';

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
  { id: 'official', label: 'المبلغ المُعلَن رسمياً في بلدي', desc: 'أسرع طريقة — استخدم آخر قيمة أعلنتها جهة الإفتاء في بلدك.' },
  { id: 'compute', label: 'احسبها من سعر القوت عندي', desc: 'أدق طريقة — نحسبها من وزن الصاع الشرعي × سعر الكيلو اليوم.' },
  { id: 'inkind', label: 'أريد إخراجها طعاماً', desc: 'الأصل الشرعي عند أغلب المذاهب — يُخرَج طعاماً لا نقداً.' },
];

export default function ZakatFitrCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [madhabId, setMadhabId] = useState('cautious');
  const [mode, setMode] = useState('official');
  const [familyCount, setFamilyCount] = useState(4);
  const [perPersonAmount, setPerPersonAmount] = useState('');
  const [staple, setStaple] = useState('rice');
  const [pricePerKg, setPricePerKg] = useState('');

  const madhab = getMadhabRules(madhabId);
  const currency = getCurrencyByCode(countryCode);
  const reference = getFitrReference(countryCode);

  // Auto-suggest a mode when the madhab changes — never force it, the user can always override.
  useEffect(() => {
    if (madhab.rules.fitrCashAllowed === false) setMode((prev) => (prev === 'official' ? 'inkind' : prev));
  }, [madhabId, madhab.rules.fitrCashAllowed]);

  const effectiveCount = Math.max(1, Number(familyCount) || 1);
  const saaKg = getFitrSaaKg(madhabId, staple);

  const result = useMemo(() => {
    if (mode === 'inkind') {
      const totalKg = saaKg * effectiveCount;
      return { unit: 'kg', perPerson: saaKg, total: totalKg };
    }
    if (mode === 'compute') {
      const price = Math.max(0, Number(pricePerKg) || 0);
      const perPerson = saaKg * price;
      return { unit: 'money', perPerson, total: perPerson * effectiveCount };
    }
    const amount = Math.max(0, Number(perPersonAmount) || 0);
    return { unit: 'money', perPerson: amount, total: amount * effectiveCount };
  }, [mode, saaKg, effectiveCount, pricePerKg, perPersonAmount]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Basket size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">حاسبة زكاة الفطر</p>
          <p className="guide-v2-checker-sub">اختر مذهبك وطريقة الحساب المناسبة لك</p>
        </div>
      </div>

      <ZakatCountryPicker countryCode={countryCode} onChange={setCountryCode} />

      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>ما مذهبك؟</p>
        <div className="guide-v2-checker-options" role="group" aria-label="المذهب">
          {MADHABS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`guide-v2-checker-chip${madhabId === m.id ? ' is-active' : ''}`}
              aria-pressed={madhabId === m.id}
              onClick={() => setMadhabId(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>كيف تريد الحساب؟</p>
        <div className="tool-v2-choice-list">
          {MODES.map((m) => (
            <label key={m.id} className={`tool-v2-choice-card${mode === m.id ? ' is-active' : ''}`}>
              <input type="radio" name="fitr-mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} />
              <span className="tool-v2-choice-body">
                <span className="tool-v2-choice-title">{m.label}</span>
                <span className="tool-v2-choice-desc">{m.desc}</span>
              </span>
            </label>
          ))}
        </div>
        {madhab.rules.fitrCashAllowed === false && mode !== 'inkind' ? (
          <p className="guide-v2-checker-result-note" style={{ marginTop: 8 }}>
            {madhab.rules.fitrCashCaveat}
          </p>
        ) : null}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="fitr-family-count">عدد أفراد الأسرة (بما فيهم أنت)</label>
        <div id="fitr-family-count" className="tool-v2-stepper" role="group" aria-label="عدد أفراد الأسرة">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setFamilyCount((v) => Math.max(1, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{familyCount}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setFamilyCount((v) => v + 1)} aria-label="زيادة">+</button>
        </div>
      </div>

      {mode === 'official' ? (
        <div className="tool-v2-field">
          <label htmlFor="fitr-amount">
            قيمة الصاع للفرد الواحد هذا العام ({currency.short})
            {reference ? <FieldHint text={`آخر قيمة نعرفها لعام ${reference.year}: ${fmt(reference.amount)} ${currency.short} — ${reference.source.label}. تحقّق من الإعلان الرسمي لهذا العام.`} /> : null}
          </label>
          <input
            id="fitr-amount"
            type="number"
            inputMode="decimal"
            min="0"
            value={perPersonAmount}
            onChange={(e) => setPerPersonAmount(e.target.value)}
            placeholder={reference ? fmt(reference.amount) : 'مثال: 25'}
          />
          {reference ? (
            <p className="guide-v2-checker-result-note" style={{ marginTop: 4 }}>
              آخر قيمة معلنة نعرفها لعام {reference.year}: {fmt(reference.amount)} {currency.short}
              {reference.note ? ` (${reference.note})` : ''} — تحقّق من إعلان هذا العام قبل الإخراج.
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === 'compute' ? (
        <>
          <div className="tool-v2-field">
            <label htmlFor="fitr-staple">القوت الغالب في بلدك</label>
            <select id="fitr-staple" value={staple} onChange={(e) => setStaple(e.target.value)}>
              {FITR_STAPLES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="tool-v2-field">
            <label htmlFor="fitr-price-kg">سعر الكيلوغرام اليوم ({currency.short})</label>
            <input id="fitr-price-kg" type="number" inputMode="decimal" min="0" value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} placeholder="0" />
          </div>
          <p className="guide-v2-checker-result-note">
            وزن الصاع على {madhab.name}: {fmt(saaKg)} كجم للفرد.
          </p>
        </>
      ) : null}

      {mode === 'inkind' ? (
        <p className="guide-v2-checker-result-note">
          وزن الصاع على {madhab.name}: {fmt(saaKg)} كجم للفرد من غالب قوت بلدك.
        </p>
      ) : null}

      <div className="guide-v2-checker-result" aria-live="polite">
        <p className="guide-v2-checker-result-label">إجمالي زكاة الفطر لأسرتك</p>
        {result.unit === 'money' ? (
          <div className="tool-v2-result-stat-row">
            <div className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(effectiveCount)}</span>
              <span className="tool-v2-result-stat-label">عدد الأفراد</span>
            </div>
            <span className="tool-v2-result-stat-sep">×</span>
            <div className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.perPerson)}</span>
              <span className="tool-v2-result-stat-label">للفرد ({currency.short})</span>
            </div>
          </div>
        ) : null}
        <p style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 900, color: 'var(--amber-text)', direction: 'ltr', textAlign: 'end', marginTop: 'var(--space-2)' }}>
          {fmt(result.total)} {result.unit === 'kg' ? 'كجم' : currency.short}
        </p>
        <p className="guide-v2-checker-result-note">
          {result.unit === 'money'
            ? 'القيمة النقدية للصاع تُعلنها جهة الإفتاء في بلدك كل عام حسب سعر قوت البلد الغالب وقتها — تحقّق من المبلغ الرسمي المُعلَن لهذا العام قبل الإخراج.'
            : 'هذا الوزن يُخرَج طعاماً (أرزاً أو قمحاً أو تمراً أو نحوه) لا نقداً — وزّعه على المستحقين قبل صلاة عيد الفطر.'}
        </p>
      </div>
    </div>
  );
}
