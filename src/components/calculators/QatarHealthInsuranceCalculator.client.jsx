"use client";

import { useMemo, useState } from 'react';
import { FirstAidKit, Info, Warning } from '@phosphor-icons/react';
import {
  FAMILY_SIZES,
  QATAR_HI_TIERS,
  QATAR_HI_AGE_BANDS,
  estimateQatarHealthInsurancePremium,
} from '@/lib/calculators/health-insurance';
import {
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import CountryFlag from '@/components/shared/CountryFlag';

function fmt(n) { return Math.round(n).toLocaleString('ar-QA-u-nu-latn'); }

/* ── Tier comparison bars ────────────────────────────────────────── */
const TIER_FILL_KEYS = { basic: '--b', standard: '--c', premium: '--d', global: '--e' };
const MAX_TIER_COST  = 20000;

function TierBars({ activeTier }) {
  return (
    <div className="calc-hi-class-bars">
      {QATAR_HI_TIERS.map((t) => {
        const fillPct = Math.round((t.perPerson.max / MAX_TIER_COST) * 100);
        const suffix  = TIER_FILL_KEYS[t.value] ?? '--c';
        return (
          <div key={t.value} className={`calc-hi-class-bar-item${activeTier === t.value ? ' is-active' : ''}`}>
            <div className="calc-hi-class-bar-header">
              <span className="calc-hi-class-bar-name">{t.label} <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({t.sub})</small></span>
              <span className="calc-hi-class-bar-range">
                {fmt(t.perPerson.min)}–{fmt(t.perPerson.max)} ر.ق/سنة
              </span>
            </div>
            <div className="calc-hi-class-bar-track">
              <div
                className={`calc-hi-class-bar-fill calc-hi-class-bar-fill${suffix}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function QatarHealthInsuranceCalculator() {
  const [tier,        setTier]        = useState('standard');
  const [familySize,  setFamilySize]  = useState('1');
  const [mainAge,     setMainAge]     = useState('31-40');
  const [preExisting, setPreExisting] = useState(false);
  const [period,      setPeriod]      = useState('annual');

  const result = useMemo(
    () => estimateQatarHealthInsurancePremium({ tier, familySize, mainAge, preExisting }),
    [tier, familySize, mainAge, preExisting],
  );

  const selectedTier = QATAR_HI_TIERS.find((t) => t.value === tier);
  const ageFactor    = QATAR_HI_AGE_BANDS.find((a) => a.value === mainAge)?.factor ?? 1;
  const memberCount  = FAMILY_SIZES.find((f) => f.value === familySize)?.count ?? 1;

  const displayMin = period === 'annual' ? result.totalMin   : result.monthlyMin;
  const displayMax = period === 'annual' ? result.totalMax   : result.monthlyMax;
  const perPMin    = period === 'annual' ? result.perPersonMin : Math.round((result.perPersonMin ?? 0) / 12);
  const perPMax    = period === 'annual' ? result.perPersonMax : Math.round((result.perPersonMax ?? 0) / 12);

  const shareText = result.isValid
    ? `التأمين الصحي (قطر) — ${selectedTier?.label}:\n${memberCount} ${memberCount === 1 ? 'شخص' : 'أشخاص'}\nسنوياً: ${fmt(result.totalMin)}–${fmt(result.totalMax)} ر.ق`
    : '';

  return (
    <div className="calc-app qa-health-ins-tool" aria-label="حاسبة التأمين الصحي قطر">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Tier selection */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>مستوى التأمين</Label>
                </div>
                <div className="hi-levels">
                  {QATAR_HI_TIERS.map((t) => (
                    <button key={t.value} type="button"
                      className={`hi-level-card${tier === t.value ? ' is-active' : ''}`}
                      onClick={() => setTier(t.value)}
                    >
                      <span className="hi-level-label">{t.label}</span>
                      <span className="hi-level-sub">{t.sub}</span>
                    </button>
                  ))}
                </div>
                {selectedTier && (
                  <p className="calc-hint">{selectedTier.description}</p>
                )}
              </div>

              {/* Family size */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>عدد المؤمَّن عليهم</Label>
                </div>
                <Select value={familySize} onValueChange={setFamilySize}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FAMILY_SIZES.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>عمر المؤمَّن الرئيسي</Label>
                </div>
                <Select value={mainAge} onValueChange={setMainAge}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QATAR_HI_AGE_BANDS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label} — معامل ×{a.factor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(mainAge === '51-60' || mainAge === '60+') && (
                  <p className="calc-hint ci-hint-warning">الفئة 51+ يتطلب بعض المؤمّنين كشفاً طبياً مسبقاً.</p>
                )}
              </div>

              {/* Pre-existing */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>أمراض مزمنة / حالات سابقة</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: false, label: 'لا يوجد',  sub: 'بدون تحميل إضافي' },
                    { value: true,  label: 'يوجد',      sub: 'قد يرتفع القسط ~35%' },
                  ].map((opt) => (
                    <button key={String(opt.value)} type="button"
                      className={`ci-coverage-tab${preExisting === opt.value ? ' is-active' : ''}`}
                      onClick={() => setPreExisting(opt.value)}
                    >
                      <span className="ci-tab-label">{opt.label}</span>
                      <span className="ci-tab-sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                <p className="calc-hint"><Info size={11} /> السكري، ضغط الدم، أمراض القلب، ضغط الدم المزمن.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ────────────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--qa"><CountryFlag code="qa" /> قطر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Period toggle */}
              <div className="calc-period-toggle">
                <button type="button"
                  className={`calc-period-btn${period === 'annual' ? ' is-active' : ''}`}
                  onClick={() => setPeriod('annual')}>سنوياً</button>
                <button type="button"
                  className={`calc-period-btn${period === 'monthly' ? ' is-active' : ''}`}
                  onClick={() => setPeriod('monthly')}>شهرياً</button>
              </div>

              {/* Main amount */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">
                  {selectedTier?.label} — {memberCount} {memberCount === 1 ? 'شخص' : 'أشخاص'}
                </span>
                <div className="ci-range-display">
                  <span className="ci-range-low">{fmt(displayMin)}</span>
                  <span className="ci-range-sep">–</span>
                  <span className="ci-range-high">{fmt(displayMax)}</span>
                  <span className="ci-range-unit">ر.ق</span>
                </div>
                <div className="calc-esb-amount-meta">
                  <span>{period === 'annual' ? 'سنوياً' : 'شهرياً'}</span>
                </div>
              </div>

              {/* Insight cards */}
              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">للشخص {period === 'annual' ? 'سنوياً' : 'شهرياً'}</span>
                  <span className="calc-insight-value">{fmt(perPMin)}–{fmt(perPMax)}</span>
                  <span className="calc-insight-sub">ر.ق</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">معامل العمر</span>
                  <span className="calc-insight-value">×{ageFactor}</span>
                  <span className="calc-insight-sub">شريحة {mainAge} سنة</span>
                </div>
                {preExisting && (
                  <div className="calc-insight-card" style={{ borderColor: 'var(--amber)' }}>
                    <span className="calc-insight-label">تحميل مزمن</span>
                    <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>+35%</span>
                    <span className="calc-insight-sub">حالات سابقة</span>
                  </div>
                )}
                <div className="calc-insight-card">
                  <span className="calc-insight-label">سقف التغطية</span>
                  <span className="calc-insight-value">{fmt(selectedTier?.coverageCeiling ?? 0)}</span>
                  <span className="calc-insight-sub">ر.ق/سنة</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-result-sec-title">ملخص التغطية</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow"><span>مستوى التأمين</span><strong>{selectedTier?.label}</strong></div>
                <div className="calc-esb-brow"><span>عدد المؤمَّن عليهم</span><strong>{memberCount} {memberCount === 1 ? 'شخص' : 'أشخاص'}</strong></div>
                {preExisting && (
                  <div className="calc-esb-brow"><span>تحميل الحالات المزمنة</span><strong style={{ color: 'var(--amber)' }}>+ ~35%</strong></div>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي السنوي التقديري</span>
                  <strong>{fmt(result.totalMin)}–{fmt(result.totalMax)} ر.ق</strong>
                </div>
              </div>

              {/* Tier comparison bars */}
              <div className="calc-result-sec-title">مقارنة المستويات الأربعة (فرد واحد / سنة)</div>
              <TierBars activeTier={tier} />

              <ResultActions copyText={shareText} shareTitle="حاسبة التأمين الصحي قطر" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>أرقام استرشادية من السوق القطري — الأسعار الفعلية تختلف بين QLM وGIG وQIC وغيرها. احصل على عرض رسمي لتأكيد السعر.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <FirstAidKit size={32} weight="duotone" />
              <p>اختر مستوى التأمين وعدد الأشخاص لعرض التقدير.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
