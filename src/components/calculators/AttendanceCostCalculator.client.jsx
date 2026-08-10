"use client";

import { useMemo, useState } from 'react';
import { Info, UsersThree } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Per-employee monthly subscription tiers — real, sourced, verified via direct WebFetch of vendor
// pricing pages (not a search-engine AI summary, which was caught fabricating a device price
// during this tool's research — see keyword-research/access-control-intercom-hub/DECISION.md):
// - "اقتصادي" ~5: Zoho People real published rate (5 SAR/user/month, annual billing, free ≤5 users)
// - "شائع" ~15: mid-market anchor between Zoho's 5 and ZenHR's ~30
// - "متقدم" ~30: ZenHR real published rate (~8 USD/user/month ≈ 30 SAR, annual billing)
// All three stay fully editable — real vendor pricing varies by contract size and negotiation,
// per docs/PLAN.md §5 step 8 (no fixed number presented as a false authority).
const PRICE_TIERS = [
  { id: 'basic', label: 'اقتصادي', desc: 'خطط أساسية مثل Zoho People', rate: 5 },
  { id: 'standard', label: 'شائع', desc: 'متوسط السوق للأنظمة السحابية', rate: 15 },
  { id: 'advanced', label: 'متقدم', desc: 'خطط متكاملة مثل ZenHR', rate: 30 },
];

const SYSTEM_TYPES = [
  { id: 'cloud', label: 'برنامج سحابي فقط', desc: 'تطبيق جوال/ويب — بصمة وجه أو GPS، بدون جهاز فعلي' },
  { id: 'device', label: 'جهاز + برنامج', desc: 'جهاز بصمة/كارت فعلي في المكتب مع لوحة تحكم سحابية' },
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

export default function AttendanceCostCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [employeeCount, setEmployeeCount] = useState(20);
  const [systemType, setSystemType] = useState('cloud');
  const [tierId, setTierId] = useState('standard');
  const [ratePerEmployee, setRatePerEmployee] = useState('15');
  const [deviceCost, setDeviceCost] = useState('');

  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];

  function applyTier(tier) {
    setTierId(tier.id);
    setRatePerEmployee(String(tier.rate));
  }

  const effectiveRate = Math.max(0, Number(ratePerEmployee) || 0);
  const effectiveEmployees = Math.max(1, Math.round(Number(employeeCount) || 1));
  const effectiveDeviceCost = Math.max(0, Number(deviceCost) || 0);

  const result = useMemo(() => {
    const monthly = effectiveRate * effectiveEmployees;
    const annual = monthly * 12;
    const firstYearTotal = annual + effectiveDeviceCost;
    return { monthly, annual, firstYearTotal };
  }, [effectiveRate, effectiveEmployees, effectiveDeviceCost]);

  const qualifiesForFreeTier = effectiveEmployees <= 5 && tierId === 'basic';

  return (
    <div aria-label="حاسبة تكلفة نظام الحضور والانصراف">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          <CountryFlag code={country.code} /> {country.country}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>دولتك (للعملة فقط)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button key={c.code} type="button" className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>
              <CountryFlag code={c.code} /> {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="attendance-employee-count">عدد الموظفين</label>
        <div id="attendance-employee-count" className="tool-v2-stepper" role="group" aria-label="عدد الموظفين">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setEmployeeCount((v) => Math.max(1, v - 5))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{employeeCount}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setEmployeeCount((v) => Math.min(2000, v + 5))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع النظام</label>
        <div className="tool-v2-choice-list">
          {SYSTEM_TYPES.map((t) => {
            const active = systemType === t.id;
            return (
              <label key={t.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`system-${t.id}`}>
                <input type="radio" id={`system-${t.id}`} name="attendance-system-type" checked={active} onChange={() => setSystemType(t.id)} />
                <span className="tool-v2-choice-icon" aria-hidden="true"><UsersThree size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{t.label}</span>
                  <span className="tool-v2-choice-desc">{t.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>مستوى الاشتراك السحابي</label>
        <div className="guide-v2-checker-options" role="group" aria-label="مستوى الاشتراك">
          {PRICE_TIERS.map((t) => (
            <button key={t.id} type="button" className={`guide-v2-checker-chip${tierId === t.id ? ' is-active' : ''}`} aria-pressed={tierId === t.id} onClick={() => applyTier(t)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="attendance-rate">
            السعر الشهري لكل موظف ({country.short})
            <FieldHint text="مقترح تلقائياً حسب المستوى المختار — عدّله إن حصلت على عرض سعر فعلي من مزود." />
          </label>
          <input id="attendance-rate" type="number" inputMode="decimal" min="0" step="0.5" value={ratePerEmployee} onChange={(e) => setRatePerEmployee(e.target.value)} />
        </div>
        {systemType === 'device' ? (
          <div className="tool-v2-field">
            <label htmlFor="attendance-device-cost">
              تكلفة الجهاز (اختياري، {country.short})
              <FieldHint text="إن حصلت على عرض سعر لجهاز البصمة أو الكارت، أضفه هنا لحساب التكلفة الكاملة للسنة الأولى. الأسعار تختلف كثيراً حسب الموديل والمزود." />
            </label>
            <input id="attendance-device-cost" type="number" inputMode="decimal" min="0" step="10" placeholder="0" value={deviceCost} onChange={(e) => setDeviceCost(e.target.value)} />
          </div>
        ) : null}
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">التكلفة الشهرية التقديرية لـ{fmt(effectiveEmployees)} موظف</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.monthly)}</span>
              <span className="tool-v2-result-stat-label">{country.short} / شهرياً</span>
            </span>
          </div>
          <div className="tool-v2-result-meta">التكلفة السنوية للاشتراك: {fmt(result.annual)} {country.short}</div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">السعر لكل موظف شهرياً</span>
            <span className="tool-v2-breakdown-value">{fmt(effectiveRate)} {country.short}</span>
          </div>
          {systemType === 'device' && effectiveDeviceCost > 0 ? (
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">تكلفة الجهاز (مرة واحدة)</span>
              <span className="tool-v2-breakdown-value">{fmt(effectiveDeviceCost)} {country.short}</span>
            </div>
          ) : null}
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">إجمالي السنة الأولى</span>
            <span className="tool-v2-breakdown-value">{fmt(result.firstYearTotal)} {country.short}</span>
          </div>
        </div>

        {qualifiesForFreeTier ? (
          <div className="tool-v2-note-strip">
            <UsersThree size={15} weight="fill" />
            <span>مع 5 موظفين أو أقل، بعض المزودين مثل Zoho People يقدمون النسخة السحابية مجاناً بالكامل — تحقق من الخطط المجانية قبل الاشتراك.</span>
          </div>
        ) : (
          <div className="tool-v2-note-strip">
            <UsersThree size={15} weight="fill" />
            <span>هذا تقدير استرشادي بناءً على متوسط أسعار السوق — اطلب دائماً عرض سعر مباشر من المزود قبل التعاقد، فبعض الأنظمة الكبرى مثل جسر وبيزات لا تُعلن أسعارها وتتفاوض حسب حجم شركتك.</span>
          </div>
        )}
      </div>
    </div>
  );
}
