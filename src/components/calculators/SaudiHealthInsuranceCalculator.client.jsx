"use client";

import { useMemo, useState } from 'react';
import { FirstAidKit, Info, Warning } from '@phosphor-icons/react';
import {
  FAMILY_SIZES,
  SAUDI_AGE_BANDS,
  SAUDI_CCHI_CLASSES,
  SAUDI_REGIONS,
  estimateSaudiHealthInsurancePremium,
} from '@/lib/calculators/health-insurance';
import {
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) { return Math.round(n).toLocaleString('ar-SA-u-nu-latn'); }

/* ── CCHI class bar chart ────────────────────────────────────── */
const CLASS_FILL_MAP = { B: '--b', C: '--c', D: '--d', E: '--e' };
const MAX_CLASS_COST = 30000;

function ClassBars({ activeCls }) {
  return (
    <div className="calc-hi-class-bars">
      {SAUDI_CCHI_CLASSES.map((cls) => {
        const fillPct = Math.round((cls.perMember.max / MAX_CLASS_COST) * 100);
        const suffix = CLASS_FILL_MAP[cls.value] ?? '--c';
        return (
          <div key={cls.value} className={`calc-hi-class-bar-item${activeCls === cls.value ? ' is-active' : ''}`}>
            <div className="calc-hi-class-bar-header">
              <span className="calc-hi-class-bar-name">{cls.label}</span>
              <span className="calc-hi-class-bar-range">
                {fmt(cls.perMember.min)}–{fmt(cls.perMember.max)} ر.س
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

export default function SaudiHealthInsuranceCalculator() {
  const [cchiClass,   setCchiClass]   = useState('C');
  const [familySize,  setFamilySize]  = useState('1');
  const [mainAge,     setMainAge]     = useState('18-30');
  const [region,      setRegion]      = useState('riyadh');
  const [preExisting, setPreExisting] = useState(false);
  const [period,      setPeriod]      = useState('annual'); // 'annual' | 'monthly'

  const result = useMemo(
    () => estimateSaudiHealthInsurancePremium({ cchiClass, familySize, mainAge, region, preExisting }),
    [cchiClass, familySize, mainAge, region, preExisting],
  );

  const selectedClass = SAUDI_CCHI_CLASSES.find((l) => l.value === cchiClass);
  const ageFactor     = SAUDI_AGE_BANDS.find((a) => a.value === mainAge)?.factor ?? 1;
  const memberCount   = FAMILY_SIZES.find((f) => f.value === familySize)?.count ?? 1;

  const shareText = result.isValid
    ? `التأمين الصحي (السعودية) — ${selectedClass?.label}:\n${memberCount} ${memberCount === 1 ? 'فرد' : 'أفراد'}\nسنوياً: ${fmt(result.totalMin)}–${fmt(result.totalMax)} ر.س\nشهرياً: ${fmt(result.monthlyMin)}–${fmt(result.monthlyMax)} ر.س`
    : '';

  const displayMin = period === 'annual' ? result.totalMin   : result.monthlyMin;
  const displayMax = period === 'annual' ? result.totalMax   : result.monthlyMax;
  const perMemMin  = period === 'annual' ? result.perMemberMin : Math.round((result.perMemberMin ?? 0) / 12);
  const perMemMax  = period === 'annual' ? result.perMemberMax : Math.round((result.perMemberMax ?? 0) / 12);

  return (
    <div className="calc-app saudi-health-ins-tool" aria-label="حاسبة التأمين الصحي السعودية">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* CCHI class */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>فئة التأمين (CCHI)</Label>
                </div>
                <div className="hi-levels">
                  {SAUDI_CCHI_CLASSES.map((cls) => (
                    <button key={cls.value} type="button"
                      className={`hi-level-card${cchiClass === cls.value ? ' is-active' : ''}`}
                      onClick={() => setCchiClass(cls.value)}
                    >
                      <span className="hi-level-label">{cls.label}</span>
                      <span className="hi-level-sub">{cls.sub}</span>
                    </button>
                  ))}
                </div>
                {selectedClass && <p className="calc-hint">{selectedClass.description}</p>}
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
                    {SAUDI_AGE_BANDS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label} — معامل ×{a.factor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(mainAge === '51-60' || mainAge === '60+') && (
                  <p className="calc-hint ci-hint-warning">الفئة 51+ قد تتطلب فحصاً طبياً.</p>
                )}
              </div>

              {/* Region */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>المنطقة</Label>
                </div>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SAUDI_REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label} {r.factor > 1 ? `(+${Math.round((r.factor - 1) * 100)}%)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pre-existing */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">5</span>
                  <Label>أمراض مزمنة / حالات سابقة</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: false, label: 'لا يوجد',  sub: 'بدون تحميل إضافي' },
                    { value: true,  label: 'يوجد',      sub: 'قد يرتفع القسط ~30%' },
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
                <p className="calc-hint"><Info size={11} /> السكري، ضغط الدم، أمراض القلب.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ────────────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">🇸🇦 السعودية</span>
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
                  {selectedClass?.label} — {memberCount} {memberCount === 1 ? 'فرد' : 'أفراد'}
                </span>
                <div className="ci-range-display">
                  <span className="ci-range-low">{fmt(displayMin)}</span>
                  <span className="ci-range-sep">–</span>
                  <span className="ci-range-high">{fmt(displayMax)}</span>
                  <span className="ci-range-unit">ر.س</span>
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
                  <span className="calc-insight-sub">ر.س</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">معامل العمر</span>
                  <span className="calc-insight-value">×{ageFactor}</span>
                  <span className="calc-insight-sub">شريحة {mainAge} سنة</span>
                </div>
                {preExisting && (
                  <div className="calc-insight-card" style={{ borderColor: 'var(--amber)' }}>
                    <span className="calc-insight-label">تحميل مزمن</span>
                    <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>+30%</span>
                    <span className="calc-insight-sub">حالات سابقة</span>
                  </div>
                )}
                <div className="calc-insight-card">
                  <span className="calc-insight-label">عدد الأفراد</span>
                  <span className="calc-insight-value">{memberCount}</span>
                  <span className="calc-insight-sub">{memberCount === 1 ? 'مؤمَّن واحد' : 'مؤمَّن عليهم'}</span>
                </div>
              </div>

              {/* Breakdown rows */}
              <div className="calc-result-sec-title">ملخص التغطية</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الفئة</span>
                  <strong>{selectedClass?.label}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>عدد المؤمَّن عليهم</span>
                  <strong>{memberCount} {memberCount === 1 ? 'فرد' : 'أفراد'}</strong>
                </div>
                {preExisting && (
                  <div className="calc-esb-brow">
                    <span>تحميل الحالات المزمنة</span>
                    <strong style={{ color: 'var(--amber)' }}>+ ~30%</strong>
                  </div>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي السنوي التقديري</span>
                  <strong>{fmt(result.totalMin)}–{fmt(result.totalMax)} ر.س</strong>
                </div>
              </div>

              {/* Class comparison bars */}
              <div className="calc-result-sec-title">مقارنة فئات CCHI (فرد واحد / سنة)</div>
              <ClassBars activeCls={cchiClass} />

              <ResultActions copyText={shareText} shareTitle="حاسبة التأمين الصحي السعودية" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>أرقام تقديرية — التأمين الصحي إلزامي للقطاع الخاص (CCHI). احصل على عرض رسمي من شركة مرخصة.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <FirstAidKit size={32} weight="duotone" />
              <p>اختر الفئة وعدد الأفراد لعرض التقدير.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
