"use client";

import { useMemo, useState } from 'react';
import { FirstAidKit, Info, Warning } from '@phosphor-icons/react';
import {
  AGE_BANDS_HEALTH,
  FAMILY_SIZES,
  HEALTH_COVERAGE_LEVELS,
  NETWORK_TYPES,
  estimateHealthInsurancePremium,
} from '@/lib/calculators/health-insurance';
import {
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) { return Math.round(n).toLocaleString('ar-AE-u-nu-latn'); }

/* ── Coverage level bars ─────────────────────────────────────────── */
const LEVEL_FILL_KEYS = { basic: '--b', enhanced: '--c', premium: '--d' };
const MAX_LEVEL_COST  = 13000;

function CoverageBars({ activeLevel }) {
  return (
    <div className="calc-hi-class-bars">
      {HEALTH_COVERAGE_LEVELS.map((l) => {
        const fillPct = Math.round((l.perMember.max / MAX_LEVEL_COST) * 100);
        const suffix  = LEVEL_FILL_KEYS[l.value] ?? '--c';
        return (
          <div key={l.value} className={`calc-hi-class-bar-item${activeLevel === l.value ? ' is-active' : ''}`}>
            <div className="calc-hi-class-bar-header">
              <span className="calc-hi-class-bar-name">{l.label}</span>
              <span className="calc-hi-class-bar-range">
                {fmt(l.perMember.min)}–{fmt(l.perMember.max)} د.إ/سنة
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

export default function UaeHealthInsuranceCalculator() {
  const [coverageLevel, setCoverageLevel] = useState('enhanced');
  const [familySize,    setFamilySize]    = useState('1');
  const [mainAge,       setMainAge]       = useState('18-35');
  const [emirate,       setEmirate]       = useState('dubai');
  const [preExisting,   setPreExisting]   = useState(false);
  const [period,        setPeriod]        = useState('annual');

  const result = useMemo(
    () => estimateHealthInsurancePremium({ coverageLevel, familySize, mainAge, emirate, preExisting }),
    [coverageLevel, familySize, mainAge, emirate, preExisting],
  );

  const selectedLevel  = HEALTH_COVERAGE_LEVELS.find((l) => l.value === coverageLevel);
  const ageFactor      = AGE_BANDS_HEALTH.find((a) => a.value === mainAge)?.factor ?? 1;
  const emirateFactor  = NETWORK_TYPES.find((n) => n.value === emirate)?.factor ?? 1;
  const memberCount    = FAMILY_SIZES.find((f) => f.value === familySize)?.count ?? 1;

  const displayMin = period === 'annual' ? result.totalMin    : result.monthlyMin;
  const displayMax = period === 'annual' ? result.totalMax    : result.monthlyMax;
  const perMemMin  = period === 'annual' ? result.perMemberMin : Math.round((result.perMemberMin ?? 0) / 12);
  const perMemMax  = period === 'annual' ? result.perMemberMax : Math.round((result.perMemberMax ?? 0) / 12);

  const shareText = result.isValid
    ? `التأمين الصحي (الإمارات) — ${selectedLevel?.label}:\n${memberCount} ${memberCount === 1 ? 'فرد' : 'أفراد'}\nسنوياً: ${fmt(result.totalMin)}–${fmt(result.totalMax)} د.إ`
    : '';

  return (
    <div className="calc-app uae-health-ins-tool" aria-label="حاسبة التأمين الصحي الإمارات">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Coverage level */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>مستوى التغطية</Label>
                </div>
                <div className="hi-levels">
                  {HEALTH_COVERAGE_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      className={`hi-level-card${coverageLevel === level.value ? ' is-active' : ''}`}
                      onClick={() => setCoverageLevel(level.value)}
                      type="button"
                    >
                      <span className="hi-level-label">{level.label}</span>
                      <span className="hi-level-sub">{level.sub}</span>
                    </button>
                  ))}
                </div>
                {selectedLevel && (
                  <p className="calc-hint">{selectedLevel.description}</p>
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

              {/* Main member age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>عمر المؤمَّن الرئيسي</Label>
                </div>
                <Select value={mainAge} onValueChange={setMainAge}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AGE_BANDS_HEALTH.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label} — معامل ×{a.factor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(mainAge === '56-60' || mainAge === '60+') && (
                  <p className="calc-hint ci-hint-warning">
                    الفئة 56+ قد تتطلب فحصاً طبياً مسبقاً وترتفع أقساطها بشكل ملحوظ.
                  </p>
                )}
              </div>

              {/* Emirate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>الإمارة</Label>
                </div>
                <Select value={emirate} onValueChange={setEmirate}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NETWORK_TYPES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                        {n.factor > 1 ? ` (+${Math.round((n.factor - 1) * 100)}%)` : n.factor < 1 ? ` (${Math.round((n.factor - 1) * 100)}%)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pre-existing conditions */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">5</span>
                  <Label>أمراض مزمنة / حالات سابقة</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: false, label: 'لا يوجد', sub: 'بدون تحميل إضافي' },
                    { value: true,  label: 'يوجد',    sub: 'قد يرتفع القسط ~30%' },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      className={`ci-coverage-tab${preExisting === opt.value ? ' is-active' : ''}`}
                      onClick={() => setPreExisting(opt.value)}
                      type="button"
                    >
                      <span className="ci-tab-label">{opt.label}</span>
                      <span className="ci-tab-sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                <p className="calc-hint">
                  <Info size={11} /> السكري، ضغط الدم، أمراض القلب، والأمراض المزمنة تُعدّ حالات سابقة.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--ae">🇦🇪 الإمارات</span>
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
                  {selectedLevel?.label} — {memberCount} {memberCount === 1 ? 'فرد' : 'أفراد'}
                </span>
                <div className="ci-range-display">
                  <span className="ci-range-low">{fmt(displayMin)}</span>
                  <span className="ci-range-sep">–</span>
                  <span className="ci-range-high">{fmt(displayMax)}</span>
                  <span className="ci-range-unit">د.إ</span>
                </div>
                <div className="calc-esb-amount-meta">
                  <span>{period === 'annual' ? 'سنوياً' : 'شهرياً'}</span>
                </div>
              </div>

              {/* Insight cards */}
              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">للفرد {period === 'annual' ? 'سنوياً' : 'شهرياً'}</span>
                  <span className="calc-insight-value">{fmt(perMemMin)}–{fmt(perMemMax)}</span>
                  <span className="calc-insight-sub">د.إ</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">معامل العمر</span>
                  <span className="calc-insight-value">×{ageFactor}</span>
                  <span className="calc-insight-sub">شريحة {mainAge} سنة</span>
                </div>
                {emirate === 'abudhabi' && (
                  <div className="calc-insight-card">
                    <span className="calc-insight-label">تحميل الإمارة</span>
                    <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>+12%</span>
                    <span className="calc-insight-sub">شبكة أبوظبي</span>
                  </div>
                )}
                {preExisting && (
                  <div className="calc-insight-card" style={{ borderColor: 'var(--amber)' }}>
                    <span className="calc-insight-label">تحميل مزمن</span>
                    <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>+30%</span>
                    <span className="calc-insight-sub">حالات سابقة</span>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="calc-result-sec-title">ملخص التغطية</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>مستوى التغطية</span>
                  <strong>{selectedLevel?.label}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>عدد المؤمَّن عليهم</span>
                  <strong>{memberCount} {memberCount === 1 ? 'فرد' : 'أفراد'}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>الإمارة / الشبكة</span>
                  <strong>{NETWORK_TYPES.find((n) => n.value === emirate)?.label}</strong>
                </div>
                {preExisting && (
                  <div className="calc-esb-brow">
                    <span>تحميل الحالات المزمنة</span>
                    <strong style={{ color: 'var(--amber)' }}>+ ~30%</strong>
                  </div>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي السنوي التقديري</span>
                  <strong>{fmt(result.totalMin)}–{fmt(result.totalMax)} د.إ</strong>
                </div>
              </div>

              {/* Coverage level comparison bars */}
              <div className="calc-result-sec-title">مقارنة مستويات التغطية (فرد واحد / سنة)</div>
              <CoverageBars activeLevel={coverageLevel} />

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة التأمين الصحي الإمارات"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>أرقام تقديرية — التأمين الصحي إلزامي لجميع المقيمين في الإمارات. احصل على عرض رسمي من شركة مرخصة (Daman، AXA، Cigna، MetLife وغيرها).</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <FirstAidKit size={32} weight="duotone" />
              <p>اختر مستوى التغطية وعدد الأفراد لعرض التقدير.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
