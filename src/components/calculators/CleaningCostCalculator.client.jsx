"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Broom,
  Buildings,
  House,
  Info,
  Minus,
  Plus,
  Share as ShareIcon,
  Sparkle,
  Warning,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Reference rates sourced from homerun.com.sa cost guides (villa packages 900/1400/2000 SAR by
// size) and general Saudi market pricing — see keyword-research/cleaning-hub/DECISION.md §2.
// These are starting DEFAULTS the user can freely overwrite, never a hardcoded final price
// (docs/PLAN.md §5 step 8 "advanced tool" standard — real prices vary too much by city to fix).
const CLEAN_TYPES = [
  {
    id: 'regular',
    label: 'تنظيف عادي',
    desc: 'أرضيات وأسطح ظاهرة وحمامات ومطبخ — للصيانة الدورية.',
    pricePerSqm: 4,
    hoursPerSqm: 1 / 25,
    icon: Broom,
    color: 'blue',
    badge: 'الأكثر استخداماً',
  },
  {
    id: 'deep',
    label: 'تنظيف عميق',
    desc: 'يضيف خلف الأثاث والزوايا والسقوف والمراوح — أشمل بكثير.',
    pricePerSqm: 7,
    hoursPerSqm: 1 / 15,
    icon: Sparkle,
    color: 'green',
  },
  {
    id: 'post_construction',
    label: 'بعد تشطيب أو دهان',
    desc: 'إزالة غبار الإسمنت وبقايا الدهان من كل سطح.',
    pricePerSqm: 9,
    hoursPerSqm: 1 / 12,
    icon: Buildings,
    color: 'amber',
  },
  {
    id: 'move',
    label: 'بعد انتقال (تسليم/استلام)',
    desc: 'تنظيف شامل قبل السكن أو بعد إخلاء العقار.',
    pricePerSqm: 8,
    hoursPerSqm: 1 / 15,
    icon: House,
    color: 'blue',
  },
];

const FREQUENCIES = [
  { id: 'once', label: 'مرة واحدة', discount: 0 },
  { id: 'weekly', label: 'أسبوعياً', discount: 10 },
  { id: 'biweekly', label: 'نصف شهري', discount: 5 },
  { id: 'monthly', label: 'شهرياً', discount: 3 },
];

const ADDONS = [
  { id: 'carpet', label: 'تنظيف سجاد وكنب', unit: 'م²', defaultPrice: 7, defaultQty: 20 },
  { id: 'glass', label: 'واجهات زجاجية خارجية', unit: 'نافذة', defaultPrice: 15, defaultQty: 6 },
  { id: 'tank', label: 'تنظيف خزان المياه', unit: 'خزان', defaultPrice: 150, defaultQty: 1 },
];

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

function Stepper({ id, value, min = 0, max = 60, onChange, label }) {
  return (
    <div id={id} className="tool-v2-stepper" role="group" aria-label={label}>
      <button type="button" className="tool-v2-stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`تقليل ${label}`}>
        <Minus size={15} weight="bold" />
      </button>
      <span className="tool-v2-stepper-val" aria-live="polite">{value}</span>
      <button type="button" className="tool-v2-stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`زيادة ${label}`}>
        <Plus size={15} weight="bold" />
      </button>
    </div>
  );
}

async function shareResult(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ النتيجة إلى الحافظة');
  } catch {
    toast.error('تعذر نسخ النتيجة');
  }
}

export default function CleaningCostCalculator() {
  const [area, setArea] = useState('120');
  const [cleanId, setCleanId] = useState('regular');
  const [pricePerSqm, setPricePerSqm] = useState(String(CLEAN_TYPES[0].pricePerSqm));
  const [freqId, setFreqId] = useState('once');
  const [countryCode, setCountryCode] = useState('sa');
  const [addonState, setAddonState] = useState(() =>
    Object.fromEntries(ADDONS.map((a) => [a.id, { enabled: false, qty: a.defaultQty, price: a.defaultPrice }])),
  );

  const cleanType = CLEAN_TYPES.find((c) => c.id === cleanId);
  const frequency = FREQUENCIES.find((f) => f.id === freqId);
  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];

  const a = Math.max(0, Number(area) || 0);
  const rate = Math.max(0, Number(pricePerSqm) || 0);
  const hasInput = a > 0 && rate > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const baseTotal = a * rate;
    const discounted = baseTotal * (1 - frequency.discount / 100);
    const addonRows = ADDONS.filter((ad) => addonState[ad.id]?.enabled).map((ad) => {
      const qty = Math.max(0, Number(addonState[ad.id].qty) || 0);
      const price = Math.max(0, Number(addonState[ad.id].price) || 0);
      return { ...ad, qty, price, total: qty * price };
    });
    const addonsTotal = addonRows.reduce((sum, r) => sum + r.total, 0);
    const grandTotal = discounted + addonsTotal;
    const low = grandTotal * 0.9;
    const high = grandTotal * 1.15;
    const hours = a * cleanType.hoursPerSqm;
    return { baseTotal, discounted, addonRows, addonsTotal, grandTotal, low, high, hours };
  }, [a, rate, frequency, addonState, hasInput, cleanType]);

  const shareText = result
    ? `حاسبة تكلفة التنظيف: من ${fmt(result.low)} إلى ${fmt(result.high)} ${country.short} لتنظيف ${a} م² (${cleanType.label})`
    : '';

  const quoteHref = result
    ? `/tools/cleaning/quote-generator?amount=${Math.round(result.grandTotal)}&service=${encodeURIComponent(cleanType.label)}&area=${a}`
    : '/tools/cleaning/quote-generator';

  return (
    <div aria-label="حاسبة تكلفة تنظيف المنزل">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          <CountryFlag code={country.code} /> {country.country}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>دولتك (للعملة فقط — السعر يبقى تحت تحكمك الكامل)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`}
              aria-pressed={countryCode === c.code}
              onClick={() => setCountryCode(c.code)}
            >
              <CountryFlag code={c.code} /> {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="cleaning-area">مساحة المنزل (م²)</label>
        <input id="cleaning-area" type="number" inputMode="decimal" min="0" step="5" value={area} onChange={(e) => setArea(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>نوع التنظيف</label>
        <div className="tool-v2-choice-list">
          {CLEAN_TYPES.map((c) => {
            const Icon = c.icon;
            const active = cleanId === c.id;
            return (
              <label key={c.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`clean-${c.id}`}>
                <input
                  type="radio"
                  id={`clean-${c.id}`}
                  name="clean-type"
                  checked={active}
                  onChange={() => {
                    setCleanId(c.id);
                    setPricePerSqm(String(c.pricePerSqm));
                  }}
                />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${c.color}`} aria-hidden="true">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {c.label}
                    {c.badge ? <span className="tool-v2-choice-badge">{c.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{c.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="cleaning-rate">
          سعر المتر في سوقك ({country.short})
          <FieldHint text="قيمة مبدئية تقريبية بناءً على متوسط السوق السعودي — عدّلها لتطابق مدينتك ودولتك الفعلية." />
        </label>
        <input id="cleaning-rate" type="number" inputMode="decimal" min="0" step="0.5" value={pricePerSqm} onChange={(e) => setPricePerSqm(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>تكرار التنظيف</label>
        <div className="guide-v2-checker-options" role="group" aria-label="تكرار التنظيف">
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`guide-v2-checker-chip${freqId === f.id ? ' is-active' : ''}`}
              aria-pressed={freqId === f.id}
              onClick={() => setFreqId(f.id)}
            >
              {f.label}{f.discount ? ` (خصم ${f.discount}%)` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>إضافات اختيارية</label>
        <div className="tool-v2-addon-list">
          {ADDONS.map((ad) => {
            const state = addonState[ad.id];
            return (
              <div key={ad.id} className={`tool-v2-addon-row${state.enabled ? ' is-active' : ''}`}>
                <label className="tool-v2-addon-toggle">
                  <input
                    type="checkbox"
                    checked={state.enabled}
                    onChange={(e) =>
                      setAddonState((prev) => ({ ...prev, [ad.id]: { ...prev[ad.id], enabled: e.target.checked } }))
                    }
                  />
                  <span>{ad.label}</span>
                </label>
                {state.enabled ? (
                  <div className="tool-v2-addon-inputs">
                    <Stepper
                      id={`addon-${ad.id}-qty`}
                      value={state.qty}
                      onChange={(v) => setAddonState((prev) => ({ ...prev, [ad.id]: { ...prev[ad.id], qty: v } }))}
                      label={`عدد ${ad.unit}`}
                    />
                    <span className="tool-v2-addon-unit">{ad.unit}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      className="tool-v2-addon-price"
                      value={state.price}
                      onChange={(e) =>
                        setAddonState((prev) => ({ ...prev, [ad.id]: { ...prev[ad.id], price: e.target.value } }))
                      }
                      aria-label={`سعر ${ad.unit} الواحد`}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">النطاق التقديري لهذه الزيارة</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.low)}</span>
                <span className="tool-v2-result-stat-label">من ({country.short})</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">—</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.high)}</span>
                <span className="tool-v2-result-stat-label">إلى ({country.short})</span>
              </span>
            </div>
            <div className="tool-v2-result-meta">وقت العمل التقديري ≈ {fmt(result.hours, 1)} ساعة</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الخدمة الأساسية ({cleanType.label}{frequency.discount ? ` — بعد خصم ${frequency.discount}%` : ''})</span>
              <span className="tool-v2-breakdown-value">{fmt(result.discounted)} {country.short}</span>
            </div>
            {result.addonRows.map((r) => (
              <div className="tool-v2-breakdown-row" key={r.id}>
                <span className="tool-v2-breakdown-label">{r.label} ({r.qty} × {fmt(r.price)})</span>
                <span className="tool-v2-breakdown-value">{fmt(r.total)} {country.short}</span>
              </div>
            ))}
          </div>

          <div className="tool-v2-note-strip">
            <Sparkle size={15} weight="fill" />
            <span>هذا تقدير استرشادي لمساعدتك على وضع ميزانية ومقارنة عروض حقيقية — السعر النهائي يتحدد بعد معاينة المنزل فعلياً.</span>
          </div>

          <div className="tool-v2-action-row">
            <Link href={quoteHref} className="tool-v2-action-btn is-primary">
              حوّل إلى عرض سعر PDF
            </Link>
            <button type="button" className="tool-v2-action-btn" onClick={() => shareResult('حاسبة تكلفة التنظيف', shareText)}>
              <ShareIcon size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل مساحة صحيحة وسعر متر أكبر من صفر.</p>
        </div>
      )}
    </div>
  );
}
