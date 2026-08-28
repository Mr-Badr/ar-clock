"use client";

import { useEffect, useState } from 'react';
import {
  Buildings,
  Crown,
  DownloadSimple,
  House,
  Info,
  MapPin,
  Share as ShareIcon,
  Sparkle,
  Warning,
  Wrench,
} from '@phosphor-icons/react';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  BUILDING_TYPES,
  FINISH_LEVELS,
  calcBuildingCost,
  fmt,
  formatCurrency,
} from '@/lib/calculators/building/constants';
import { getCountryBySlug } from '@/lib/calculators/building/country-data';

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

// All 14 supported countries — extended 2026-08-04 from the original 6-GCC-only selector once the
// 8 non-GCC countries' cost_per_m2 figures were re-sourced with real 2025/2026 data (see
// country-data.js inline citations per country; Libya kept its original rough estimate, flagged —
// no reliable source was found). Order: GCC first (Saudi as the primary market, then the rest of
// the GCC, matching the site's established Gulf-wide selector convention), then the other Arab
// markets grouped by region (Levant/Egypt, then Maghreb).
const ALL_COUNTRY_SLUGS = [
  'saudi-arabia', 'uae', 'kuwait', 'qatar', 'bahrain', 'oman',
  'egypt', 'jordan', 'iraq', 'lebanon',
  'morocco', 'algeria', 'tunisia', 'libya',
];
const ALL_COUNTRIES = ALL_COUNTRY_SLUGS.map((slug) => getCountryBySlug(slug)).filter(Boolean);

// Human-language description + icon/color per finish level — same choice-card pattern as
// PaintCalculator's PAINT_TYPES, keeps FINISH_LEVELS (building/constants.js) as the source of
// numeric truth and only adds display metadata here.
const FINISH_META = {
  skeleton: { icon: Wrench, color: 'blue', desc: 'الهيكل الإنشائي فقط — أساسات وأعمدة وأسقف وجدران خارجية بلا أي تشطيب داخلي.' },
  economy: { icon: House, color: 'blue', desc: 'تشطيب بسيط بمواد اقتصادية — يقلل التكلفة الإجمالية بشكل ملحوظ عن المستوى العادي.' },
  standard: { icon: Buildings, color: 'green', badge: 'الأكثر شيوعاً', desc: 'توازن جيد بين الجودة والسعر — المستوى الذي يختاره معظم أصحاب المنازل.' },
  luxury: { icon: Sparkle, color: 'amber', desc: 'مواد وتشطيبات أرقى — مطابخ وحمامات وأرضيات بمستوى أعلى من المعتاد.' },
  super_lux: { icon: Crown, color: 'red', desc: 'أعلى مستوى تشطيب متاح — مواد مستوردة وتفاصيل معمارية متقدمة.' },
};

export default function BuildCostCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const country = ALL_COUNTRIES.find((c) => c.countryKey === countryCode) || ALL_COUNTRIES[0];
  const regionEntries = Object.entries(country?.regions || {});

  const [areaM2, setAreaM2] = useState('250');
  const [floors, setFloors] = useState(1);
  const [finishLevel, setFinishLevel] = useState('standard');
  const [buildingType, setBuildingType] = useState('villa');
  const [region, setRegion] = useState(regionEntries[0]?.[0] || '');

  // Reset the region to the new country's first region whenever the country changes — a stale
  // region key from the previous country wouldn't exist in the new country's `regions` object.
  useEffect(() => {
    const firstRegionKey = Object.keys(country?.regions || {})[0] || '';
    setRegion(firstRegionKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  const areaNum = Math.max(0, Number(areaM2) || 0);
  const regionMultiplier = country?.regions?.[region]?.m ?? 1;
  const hasInput = areaNum > 0;
  const result = hasInput
    ? calcBuildingCost(areaNum, floors, finishLevel, country, buildingType, regionMultiplier)
    : null;

  const selectedFinish = FINISH_LEVELS.find((f) => f.key === finishLevel);
  const selectedRegionName = country?.regions?.[region]?.name || '';

  const shareText = result
    ? `تقدير تكلفة البناء في ${country.nameShort}: ${formatCurrency(result.minCost, country.symbol)} — ${formatCurrency(result.maxCost, country.symbol)}\nالمساحة: ${areaNum} م² × ${floors} دور — ${selectedFinish?.label} — ${selectedRegionName}`
    : '';

  function handlePrint() {
    window.print();
  }

  return (
    <div aria-label="حاسبة تكلفة البناء">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code={countryCode} /> {country?.nameShort} <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>اختر دولتك</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {ALL_COUNTRIES.map((c) => (
            <button
              key={c.countryKey}
              type="button"
              className={`guide-v2-checker-chip${countryCode === c.countryKey ? ' is-active' : ''}`}
              aria-pressed={countryCode === c.countryKey}
              onClick={() => setCountryCode(c.countryKey)}
            >
              <CountryFlag code={c.countryKey} /> {c.nameShort}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="build-cost-area">
          مساحة البناء (م² لكل دور)
          <FieldHint text="مساحة الدور الواحد فقط — إذا كان عندك أكثر من دور، اضبط عدد الأدوار في الحقل التالي." />
        </label>
        <input
          id="build-cost-area"
          type="number"
          inputMode="decimal"
          min="0"
          value={areaM2}
          onChange={(e) => setAreaM2(e.target.value)}
          placeholder="250"
        />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="build-cost-floors">عدد الأدوار</label>
          <input
            id="build-cost-floors"
            type="number"
            inputMode="numeric"
            min="1"
            max="6"
            value={floors}
            onChange={(e) => setFloors(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="build-cost-type">نوع المبنى</label>
          <PremiumSelect
            id="build-cost-type"
            value={buildingType}
            onChange={setBuildingType}
            options={BUILDING_TYPES.map((t) => ({ value: t.key, label: t.label }))}
          />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>
          مرحلة العمل
          <FieldHint text="عظم فقط = الهيكل الإنشائي دون تشطيب. تسليم مفتاح = عظم + تشطيب كامل جاهز للسكن." />
        </label>
        <div className="tool-v2-choice-list">
          {FINISH_LEVELS.map((f) => {
            const meta = FINISH_META[f.key] || {};
            const Icon = meta.icon || Buildings;
            const active = finishLevel === f.key;
            return (
              <label
                key={f.key}
                className={`tool-v2-choice-card${active ? ' is-active' : ''}`}
                htmlFor={`finish-${f.key}`}
              >
                <input
                  type="radio"
                  id={`finish-${f.key}`}
                  name="finish-level"
                  checked={active}
                  onChange={() => setFinishLevel(f.key)}
                />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${meta.color || 'blue'}`} aria-hidden="true">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {f.label}
                    {meta.badge ? <span className="tool-v2-choice-badge">{meta.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{meta.desc || f.subLabel}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="build-cost-region">
          <MapPin size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} /> المدينة
        </label>
        <PremiumSelect
          id="build-cost-region"
          value={region}
          onChange={setRegion}
          options={regionEntries.map(([key, r]) => ({ value: key, label: r.name }))}
        />
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">التكلفة التقديرية</span>
            <div className="tool-v2-result-value tool-v2-result-value--range">
              <span className="tool-v2-result-range-part">{formatCurrency(result.minCost, country.symbol)}</span>
              <span className="tool-v2-result-range-sep" aria-hidden="true">–</span>
              <span className="tool-v2-result-range-part">{formatCurrency(result.maxCost, country.symbol)}</span>
            </div>
            <div className="tool-v2-result-meta">
              ≈ {formatCurrency(result.costPerM2Mid, country.symbol)}/م² — {selectedFinish?.label} — {selectedRegionName}
            </div>
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>نتيجة تقديرية بنطاق سعري وليست عرض سعر نهائي — راجع مقاولاً مرخصاً قبل أي قرار.</span>
          </div>

          <div className="tool-v2-mini-block-head">
            <Buildings size={14} weight="bold" />
            <span>توزيع التكلفة التقديري</span>
          </div>
          <div className="tool-v2-breakdown-list">
            {result.breakdown.map((item) => (
              <div key={item.key} className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-pct">{item.pct}</span>
                <span className="tool-v2-breakdown-label">{item.name}</span>
                <span className="tool-v2-breakdown-value">{formatCurrency(item.value, country.symbol)}</span>
              </div>
            ))}
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>تقدير سريع للمواد: نحو {fmt(result.cementBags)} كيس أسمنت و{fmt(result.rebarTons, 2)} طن حديد لكامل المشروع.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل مساحة صحيحة أكبر من صفر.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn" onClick={handlePrint} disabled={!result}>
          <DownloadSimple size={18} weight="bold" /> تحميل كعرض سعر
        </button>
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة تكلفة البناء', shareText)}
          disabled={!result}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
