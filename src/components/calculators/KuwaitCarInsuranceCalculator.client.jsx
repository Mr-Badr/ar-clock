"use client";

import { useMemo, useState } from 'react';
import { Car, Info, Warning } from '@phosphor-icons/react';
import {
  KUWAIT_AREA_FACTORS,
  KUWAIT_DRIVER_AGE_BANDS,
  NO_CLAIM_DISCOUNTS,
  estimateKuwaitCarInsurancePremium,
  getKuwaitPriceFactors,
} from '@/lib/calculators/car-insurance';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) { return Math.round(n).toLocaleString('ar-KW-u-nu-latn'); }

/* ── Price breakdown donut ───────────────────────────────────── */
function RangeDonut({ low, high }) {
  const mid = (low + high) / 2;
  const maxRef = 3000;
  const pct = Math.min(Math.round((mid / maxRef) * 100), 98);
  const r = 44; const cx = 52; const cy = 52;
  const circ = 2 * Math.PI * r; const sw = 14;
  const len = (pct / 100) * circ;
  const tier = pct < 30 ? 'var(--green)' : pct < 65 ? 'var(--amber)' : 'var(--red)';
  return (
    <div className="calc-donut-wrap">
      <div className="calc-donut-center-wrap">
        <svg viewBox="0 0 104 104" fill="none">
          <circle cx={cx} cy={cy} r={r} stroke="var(--border-default)" strokeWidth={sw} />
          <circle cx={cx} cy={cy} r={r} stroke={tier} strokeWidth={sw}
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.55s ease' }}
          />
        </svg>
        <div className="calc-donut-center-text">
          <span className="calc-donut-center-pct" style={{ fontSize: '0.85rem' }}>{fmt(low)}–</span>
          <span className="calc-donut-center-pct">{fmt(high)}</span>
          <span className="calc-donut-center-sub">د.ك / سنة</span>
        </div>
      </div>
      <div className="calc-donut-legend">
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: 'var(--green)' }} />
          <span className="calc-donut-legend-label">أدنى تقدير</span>
          <span className="calc-donut-legend-val">{fmt(low)} د.ك</span>
        </div>
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: tier }} />
          <span className="calc-donut-legend-label">أعلى تقدير</span>
          <span className="calc-donut-legend-val">{fmt(high)} د.ك</span>
        </div>
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: 'var(--blue)' }} />
          <span className="calc-donut-legend-label">متوسط تقديري</span>
          <span className="calc-donut-legend-val">{fmt(Math.round(mid))} د.ك</span>
        </div>
      </div>
    </div>
  );
}

const CAR_AGE_OPTIONS = [
  { value: 'new',  label: 'جديدة (صفر – سنة)' },
  { value: '1-3',  label: '1 – 3 سنوات' },
  { value: '4-6',  label: '4 – 6 سنوات' },
  { value: '7+',   label: '7 سنوات فأكثر' },
];

const FACTOR_ICONS = { up: '↑', down: '↓', ok: '✓', info: 'ℹ' };
const FACTOR_COLORS = {
  up:   'var(--amber)',
  down: 'var(--green-text)',
  ok:   'var(--green-text)',
  info: 'var(--blue-text)',
};

export default function KuwaitCarInsuranceCalculator() {
  const [coverage,      setCoverage]      = useState('third-party');
  const [carValue,      setCarValue]      = useState('8000');
  const [carAge,        setCarAge]        = useState('1-3');
  const [driverAge,     setDriverAge]     = useState('31-45');
  const [area,          setArea]          = useState('capital');
  const [noClaimYears,  setNoClaimYears]  = useState('0');

  const result = useMemo(
    () => estimateKuwaitCarInsurancePremium({ coverageType: coverage, carValue, carAge, driverAge, area, noClaimYears }),
    [coverage, carValue, carAge, driverAge, area, noClaimYears],
  );
  const factors = useMemo(
    () => getKuwaitPriceFactors({ coverageType: coverage, carValue, carAge, driverAge, area, noClaimYears }),
    [coverage, carValue, carAge, driverAge, area, noClaimYears],
  );

  const shareText = result.isValid
    ? `تأمين السيارة (الكويت):\nنوع: ${coverage === 'third-party' ? 'ضد الغير' : 'شامل'}\nالتقدير: ${fmt(result.low)} – ${fmt(result.high)} د.ك/سنة`
    : '';

  const monthly = result.isValid ? Math.round((result.low + result.high) / 2 / 12) : 0;

  return (
    <div className="calc-app kw-car-ins-tool" aria-label="حاسبة تأمين السيارة الكويت">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Coverage type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع التأمين</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: 'third-party',   label: 'ضد الغير',  sub: 'الحد الأدنى القانوني' },
                    { value: 'comprehensive', label: 'شامل',       sub: 'تغطية كاملة للسيارة' },
                  ].map((opt) => (
                    <button key={opt.value} type="button"
                      className={`ci-coverage-tab${coverage === opt.value ? ' is-active' : ''}`}
                      onClick={() => setCoverage(opt.value)}
                    >
                      <span className="ci-tab-label">{opt.label}</span>
                      <span className="ci-tab-sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                <p className="calc-hint">
                  <Info size={11} /> التأمين ضد الغير إلزامي بموجب قانون تأمين المركبات 2000.
                </p>
              </div>

              {/* Car value (comprehensive only) */}
              {coverage === 'comprehensive' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label htmlFor="kw-val">قيمة السيارة السوقية</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="kw-val" inputMode="numeric" value={carValue}
                      onChange={(e) => setCarValue(e.target.value)} placeholder="8000" />
                    <span className="calc-esb-currency">د.ك</span>
                  </div>
                </div>
              )}

              {/* Car age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{coverage === 'comprehensive' ? '3' : '2'}</span>
                  <Label>عمر السيارة</Label>
                </div>
                <Select value={carAge} onValueChange={setCarAge}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CAR_AGE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{coverage === 'comprehensive' ? '4' : '3'}</span>
                  <Label>عمر السائق الرئيسي</Label>
                </div>
                <Select value={driverAge} onValueChange={setDriverAge}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KUWAIT_DRIVER_AGE_BANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {driverAge === '18-21' && (
                  <p className="calc-hint ci-hint-warning">السائقون أقل من 22 سنة يدفعون أعلى أقساط.</p>
                )}
              </div>

              {/* Area */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{coverage === 'comprehensive' ? '5' : '4'}</span>
                  <Label>المنطقة / المحافظة</Label>
                </div>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(KUWAIT_AREA_FACTORS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* No-claim */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{coverage === 'comprehensive' ? '6' : '5'}</span>
                  <Label>سنوات الخلو من المطالبات</Label>
                </div>
                <Select value={noClaimYears} onValueChange={setNoClaimYears}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(NO_CLAIM_DISCOUNTS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label} {v.discount > 0 ? `(خصم ${v.discount * 100}%)` : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ────────────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--kw">🇰🇼 الكويت</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Amount hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">
                  {coverage === 'third-party' ? 'تأمين ضد الغير' : 'تأمين شامل'} — تقدير سنوي
                </span>
                <div className="ci-range-display">
                  <span className="ci-range-low">{fmt(result.low)}</span>
                  <span className="ci-range-sep">–</span>
                  <span className="ci-range-high">{fmt(result.high)}</span>
                  <span className="ci-range-unit">د.ك</span>
                </div>
                <div className="calc-esb-amount-meta">
                  <span>متوسط ~{fmt(monthly)} د.ك/شهر</span>
                </div>
              </div>

              {/* Visual donut showing range vs max */}
              <div className="calc-result-sec-title">تصور التقدير</div>
              <RangeDonut low={result.low} high={result.high} />

              {/* Insight cards */}
              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">شهرياً (وسطياً)</span>
                  <span className="calc-insight-value">{fmt(monthly)} د.ك</span>
                  <span className="calc-insight-sub">تقريب بسيط</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">نوع التغطية</span>
                  <span className="calc-insight-value">{coverage === 'third-party' ? 'ضد الغير' : 'شامل'}</span>
                  <span className="calc-insight-sub">{coverage === 'third-party' ? 'أقل تكلفة' : 'أوسع حماية'}</span>
                </div>
              </div>

              {/* Price factors */}
              {factors.length > 0 && (
                <>
                  <div className="calc-result-sec-title">عوامل التسعير</div>
                  <div className="ci-factors">
                    {factors.map((f, i) => (
                      <div key={i} className="ci-factor-row">
                        <span
                          className={`ci-factor-icon ci-factor-icon--${f.icon}`}
                          aria-hidden="true"
                        >
                          {FACTOR_ICONS[f.icon]}
                        </span>
                        <span className="ci-factor-label">{f.label}</span>
                        <span className="ci-factor-effect" style={{ color: FACTOR_COLORS[f.icon] }}>
                          {f.effect}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* TP vs Comprehensive comparison */}
              <div className="calc-result-sec-title">مقارنة سريعة</div>
              <div className="ci-compare-strip">
                <div className="ci-compare-row ci-compare-header">
                  <span>نوع التأمين</span><span>المميزات الرئيسية</span>
                </div>
                {[
                  { label: 'ضد الغير', desc: 'إلزامي · يغطي أضرار الآخرين فقط', active: coverage === 'third-party' },
                  { label: 'شامل',     desc: 'يغطي سيارتك + الآخرين + السرقة والحريق', active: coverage === 'comprehensive' },
                ].map((row) => (
                  <div key={row.label} className={`ci-compare-row${row.active ? ' ci-compare-active' : ''}`}>
                    <span>{row.label}</span><span>{row.desc}</span>
                  </div>
                ))}
              </div>

              <ResultActions copyText={shareText} shareTitle="حاسبة تأمين السيارة الكويت" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>تقدير استرشادي — احصل على عرض رسمي من شركة تأمين مرخصة من وزارة التجارة الكويتية.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Car size={32} weight="duotone" />
              <p>
                {coverage === 'comprehensive'
                  ? 'أدخل قيمة السيارة لعرض تقدير التأمين الشامل.'
                  : 'اختر بيانات السائق للحصول على تقدير التأمين ضد الغير.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
