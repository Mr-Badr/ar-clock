"use client";

import { useMemo, useState } from 'react';
import { Buildings, Warning } from '@phosphor-icons/react';
import {
  ACTIVITY_TYPES,
  JURISDICTION_TYPES,
  OFFICE_TYPES,
  VISA_COUNTS,
  estimateDubaiCompanySetup,
} from '@/lib/calculators/dubai-company-setup';
import {
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) {
  return Math.round(n).toLocaleString('ar-AE');
}

export default function DubaiCompanySetupCalculator() {
  const [jurisdiction, setJurisdiction] = useState('mainland');
  const [activity,     setActivity]     = useState('services');
  const [visaCount,    setVisaCount]    = useState('1');
  const [officeType,   setOfficeType]   = useState('flexi');
  const [foreignName,  setForeignName]  = useState(false);

  const result = useMemo(
    () => estimateDubaiCompanySetup({ jurisdiction, activity, visaCount, officeType, foreignName }),
    [jurisdiction, activity, visaCount, officeType, foreignName],
  );

  const shareText = result.isValid
    ? `تكلفة تأسيس شركة دبي (تقديري):\n${jurisdiction === 'mainland' ? 'براً' : 'منطقة حرة'} — نشاط: ${ACTIVITY_TYPES.find((a) => a.value === activity)?.label ?? ''}\nالإجمالي: ${fmt(result.totalMin)} – ${fmt(result.totalMax)} د.إ`
    : '';

  return (
    <div className="calc-app dubai-setup-tool" aria-label="حاسبة تكلفة تأسيس شركة في دبي">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Jurisdiction */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع الجهة</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {JURISDICTION_TYPES.map((j) => (
                    <button
                      key={j.value}
                      className={`ci-coverage-tab${jurisdiction === j.value ? ' is-active' : ''}`}
                      onClick={() => setJurisdiction(j.value)}
                      type="button"
                    >
                      <span className="ci-tab-label">{j.label}</span>
                      <span className="ci-tab-sub">{j.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>نوع النشاط</Label>
                </div>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Office type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>نوع المكتب</Label>
                </div>
                <Select value={officeType} onValueChange={setOfficeType}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OFFICE_TYPES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Visa count */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>عدد تأشيرات الإقامة</Label>
                </div>
                <Select value={visaCount} onValueChange={setVisaCount}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VISA_COUNTS.map((v) => (
                      <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="calc-hint">كل تأشيرة تشمل: إذن دخول + فحص طبي + بطاقة هوية إماراتية + بطاقة عمل.</p>
              </div>

              {/* Foreign name toggle */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">5</span>
                  <Label>الاسم التجاري</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: false, label: 'عربي / محلي', sub: 'أقل رسوماً' },
                    { value: true,  label: 'أجنبي / إنجليزي', sub: 'رسوم أعلى قليلاً' },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      className={`ci-coverage-tab${foreignName === opt.value ? ' is-active' : ''}`}
                      onClick={() => setForeignName(opt.value)}
                      type="button"
                    >
                      <span className="ci-tab-label">{opt.label}</span>
                      <span className="ci-tab-sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--ae">🇦🇪 دبي</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">
                  {jurisdiction === 'mainland' ? 'براً (Mainland)' : 'منطقة حرة'} — التكلفة التأسيسية
                </span>
                <div className="ci-range-display">
                  <span className="ci-range-low">{fmt(result.totalMin)}</span>
                  <span className="ci-range-sep">–</span>
                  <span className="ci-range-high">{fmt(result.totalMax)}</span>
                  <span className="ci-range-unit">د.إ</span>
                </div>
                <div className="calc-esb-amount-meta">
                  <span>~ {fmt(result.totalMin / 3.67)} – {fmt(result.totalMax / 3.67)} دولار</span>
                </div>
              </div>

              {/* Itemized breakdown */}
              <div className="calc-esb-breakdown">
                {result.items.map((item) => (
                  <div key={item.label} className="calc-esb-brow">
                    <span>
                      {item.label}
                      {item.note && <span className="calc-hint"> ({item.note})</span>}
                    </span>
                    <strong>
                      {item.min === item.max
                        ? `${fmt(item.min)} د.إ`
                        : `${fmt(item.min)} – ${fmt(item.max)} د.إ`}
                    </strong>
                  </div>
                ))}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي التقديري</span>
                  <strong>{fmt(result.totalMin)} – {fmt(result.totalMax)} د.إ</strong>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة تأسيس شركة دبي"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>تقدير استرشادي محايد — تحقق من الرسوم الرسمية في DED أو موقع المنطقة الحرة المختارة.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Buildings size={32} weight="duotone" />
              <p>اختر بيانات الشركة للحصول على تقدير التكلفة.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
