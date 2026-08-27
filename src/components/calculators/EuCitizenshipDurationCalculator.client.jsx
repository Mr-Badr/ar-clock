"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Real rules, verified via direct WebFetch/WebSearch of official sources, 2026-08-27:
// - France: service-public.gouv.fr F2213 — standard naturalization = 5 years residence; reduced
//   to 2 years after completing 2+ years of French higher education; waived entirely for
//   refugees, nationals of francophone countries with French as native language, or 5+ years of
//   French-medium schooling. Marriage to a French citizen ("déclaration"): 4 years married while
//   living together in France, or 5 years if living abroad.
// - Germany: confirmed via BAMF's own page + bundesregierung.de + multiple independent news
//   sources (thelocal.de, iamexpat.de, aljazeera.com) — standard naturalization dropped from 8 to
//   5 years' legal residence as of the 27 June 2024 reform. The "exceptional integration" 3-year
//   fast track introduced by that same reform was REPEALED effective 30 October 2025 — it is
//   deliberately NOT offered as an option here, since it no longer exists (a mistake several
//   Arabic-language articles still make). Marriage to a German citizen: 3 years total legal
//   residence, provided the marriage/registered partnership has existed for at least 2 years.
const COUNTRIES = {
  fr: {
    name: 'فرنسا',
    situations: [
      { id: 'standard', label: 'الإقامة العادية', years: 5, desc: '5 سنوات إقامة قانونية مستمرة في فرنسا.' },
      { id: 'graduate', label: 'تخرجت من جامعة فرنسية', years: 2, desc: 'أنهيت سنتين أو أكثر من الدراسة الجامعية في فرنسا وحصلت على الشهادة.' },
      { id: 'married', label: 'متزوج(ة) من مواطن(ة) فرنسي(ة)', years: 4, desc: 'زواج قائم مع إقامة مشتركة في فرنسا (5 سنوات إذا كانت الإقامة خارج فرنسا).' },
      { id: 'waived', label: 'لاجئ أو من دولة فرنكوفونية', years: 0, desc: 'لاجئ معترف به، أو من دولة فرنكوفونية والفرنسية لغتك الأم، أو 5+ سنوات دراسة بالفرنسية — لا تُشترط مدة إقامة دنيا.' },
    ],
  },
  de: {
    name: 'ألمانيا',
    situations: [
      { id: 'standard', label: 'الإقامة العادية', years: 5, desc: '5 سنوات إقامة قانونية منذ إصلاح يونيو 2024 (كانت 8 سنوات سابقاً).' },
      { id: 'married', label: 'متزوج(ة) من مواطن(ة) ألماني(ة)', years: 3, desc: '3 سنوات إقامة قانونية بشرط أن يكون الزواج قائماً منذ سنتين على الأقل.' },
    ],
  },
};

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

export default function EuCitizenshipDurationCalculator() {
  const [country, setCountry] = useState('fr');
  const [situationId, setSituationId] = useState('standard');
  const [startDate, setStartDate] = useState('');

  const countryData = COUNTRIES[country];
  const situation = countryData.situations.find((s) => s.id === situationId) ?? countryData.situations[0];

  const result = useMemo(() => {
    if (!startDate) return null;
    const start = new Date(`${startDate}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
    const eligible = new Date(start);
    eligible.setFullYear(eligible.getFullYear() + situation.years);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reached = today >= eligible;
    const daysLeft = reached ? 0 : Math.ceil((eligible.getTime() - today.getTime()) / 86400000);
    return { eligible, reached, daysLeft };
  }, [startDate, situation.years]);

  function handleCountryChange(code) {
    setCountry(code);
    setSituationId('standard');
  }

  return (
    <div aria-label="حاسبة مدة الأهلية للجنسية الأوروبية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          {countryData.name}
        </span>
      </div>

      <div className="tool-v2-chip-options" role="group" aria-label="اختر الدولة">
        {Object.entries(COUNTRIES).map(([code, data]) => (
          <button
            key={code}
            type="button"
            className={`tool-v2-chip${country === code ? ' is-active' : ''}`}
            onClick={() => handleCountryChange(code)}
          >
            {data.name}
          </button>
        ))}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="eu-situation">
          حالتك
          <FieldHint text="اختر المسار الذي ينطبق عليك فعلياً — يختلف عدد السنوات المطلوب بشكل كبير حسب الحالة." />
        </label>
        <select id="eu-situation" value={situationId} onChange={(e) => setSituationId(e.target.value)}>
          {countryData.situations.map((s) => (
            <option key={s.id} value={s.id}>{s.label}{s.years > 0 ? ` — ${s.years} سنوات` : ' — بدون حد أدنى'}</option>
          ))}
        </select>
        <p className="tool-v2-field-note">{situation.desc}</p>
      </div>

      {situation.years > 0 ? (
        <div className="tool-v2-field">
          <label htmlFor="eu-start">تاريخ بداية إقامتك القانونية (أو تاريخ الزواج للمسار الزوجي)</label>
          <input id="eu-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
      ) : null}

      {situation.years === 0 ? (
        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>هذا المسار لا يشترط مدة إقامة دنيا محددة، لكن باقي الشروط (اللغة، حسن السيرة، إثبات الوضع) تبقى مطلوبة. راجع الأسئلة الشائعة أدناه.</span>
        </div>
      ) : result ? (
        <div aria-live="polite">
          <div className={`tool-v2-result-hero ${result.reached ? 'is-good' : ''}`}>
            <span className="tool-v2-result-label">{result.reached ? 'تاريخ بلوغ الحد الأدنى للمدة' : 'الوقت المتبقي لبلوغ الحد الأدنى'}</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">
                  {result.reached ? result.eligible.toLocaleDateString('en-GB') : result.daysLeft}
                </span>
                <span className="tool-v2-result-stat-label">{result.reached ? '' : 'يوم'}</span>
              </span>
            </div>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">المدة المطلوبة لهذا المسار</span>
              <span className="tool-v2-breakdown-value">{situation.years} سنوات</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">تاريخ الأهلية المتوقع</span>
              <span className="tool-v2-breakdown-value">{result.eligible.toLocaleDateString('en-GB')}</span>
            </div>
          </div>
          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>بلوغ مدة الإقامة شرط أساسي، لكنه ليس الشرط الوحيد — إتقان اللغة وحسن السيرة وإثبات الاندماج شروط إضافية مطلوبة في كل الحالات. راجع مصادر الصفحة للتفاصيل الرسمية الكاملة.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>أدخل تاريخ البداية لرؤية النتيجة.</span>
        </div>
      )}
    </div>
  );
}
