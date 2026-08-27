"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// The "30% rule" — a widely-used personal-finance guideline (not a law), verified across multiple
// real sources (souqalmal.com, a direct scrape of ahsebli.com's own rent calculator) during
// research, 2026-08-25. The 4 tiers below match the same bands ahsebli.com uses, since this is
// generic, widely-cited financial wisdom, not a proprietary formula.
const TIERS = [
  { max: 25, label: 'ممتاز', tone: 'good', desc: 'إيجارك مريح جداً بالنسبة لدخلك، ولديك مساحة ادخار كبيرة.' },
  { max: 30, label: 'مقبول', tone: 'good', desc: 'ضمن الحد الموصى به عالمياً — نسبة صحية بين السكن ومصاريفك الأخرى.' },
  { max: 40, label: 'مرتفع', tone: 'warn', desc: 'أعلى من الموصى به — راجع مصاريفك الأخرى جيداً قبل الالتزام.' },
  { max: Infinity, label: 'خطر مالي', tone: 'bad', desc: 'يستهلك جزءاً كبيراً جداً من دخلك — قد يصعب الادخار أو مواجهة أي طارئ.' },
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

export default function RentAffordabilityCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [monthlyIncome, setMonthlyIncome] = useState('10000');
  const [monthlyRent, setMonthlyRent] = useState('2500');

  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];
  const effectiveIncome = Math.max(0, Number(monthlyIncome) || 0);
  const effectiveRent = Math.max(0, Number(monthlyRent) || 0);

  const result = useMemo(() => {
    const ratio = effectiveIncome > 0 ? (effectiveRent / effectiveIncome) * 100 : 0;
    const tier = TIERS.find((t) => ratio <= t.max) ?? TIERS[TIERS.length - 1];
    const recommendedMax = effectiveIncome * 0.3;
    return { ratio, tier, recommendedMax };
  }, [effectiveIncome, effectiveRent]);

  return (
    <div aria-label="حاسبة نسبة الإيجار من الراتب">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          <CountryFlag code={country.code} /> {country.country}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>دولتك (للعملة فقط)</label>
        <div className="tool-v2-chip-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button key={c.code} type="button" className={`tool-v2-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>
              <CountryFlag code={c.code} /> {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="ra-income">صافي راتبك الشهري ({country.short})</label>
          <input id="ra-income" type="number" inputMode="decimal" min="0" step="100" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="ra-rent">
            الإيجار الشهري ({country.short})
            <FieldHint text="إن كان عقدك سنوياً، اقسم الإيجار السنوي على 12 للحصول على المعدل الشهري." />
          </label>
          <input id="ra-rent" type="number" inputMode="decimal" min="0" step="50" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} />
        </div>
      </div>

      <div aria-live="polite">
        <div className={`tool-v2-result-hero${result.tier.tone === 'bad' ? ' is-bad' : result.tier.tone === 'warn' ? ' is-warn' : ' is-good'}`}>
          <span className="tool-v2-result-label">نسبة الإيجار من راتبك</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.ratio, 1)}%</span>
              <span className="tool-v2-result-stat-label">{result.tier.label}</span>
            </span>
          </div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">الحد الموصى به (30% من راتبك)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.recommendedMax)} {country.short}</span>
          </div>
        </div>

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>{result.tier.desc} هذه قاعدة إرشادية شائعة عالمياً وليست قاعدة ملزمة — قرارك النهائي يعتمد أيضاً على مصاريفك الأخرى والتزاماتك المالية الفعلية.</span>
        </div>
      </div>
    </div>
  );
}
