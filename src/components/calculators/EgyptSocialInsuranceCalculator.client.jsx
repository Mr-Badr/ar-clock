"use client";

import { useMemo, useState } from 'react';
import { Buildings, Info, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  calculateEgyptSocialInsurance,
  formatCurrency,
} from '@/lib/calculators/engine';

function fmt(v) {
  return formatCurrency(v, 'EGP');
}

export default function EgyptSocialInsuranceCalculator() {
  const [salary, setSalary] = useState('8000');

  const result = useMemo(
    () => calculateEgyptSocialInsurance({ monthlySalary: salary }),
    [salary],
  );

  const shareText = result.isValid
    ? `حاسبة التأمينات الاجتماعية مصر\nالراتب الشهري: ${fmt(result.salary)}\nحصة الموظف (11%): ${fmt(result.employeeShare)}\nحصة صاحب العمل (18.75%): ${fmt(result.employerShare)}\nصافي الراتب بعد التأمينات: ${fmt(result.netAfterSi)}`
    : '';

  return (
    <div className="calc-app eg-si-tool" aria-label="حاسبة التأمينات الاجتماعية مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="eg-si-salary">الراتب الشهري الإجمالي</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="eg-si-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="8000"
                  />
                  <span className="calc-esb-currency">ج.م</span>
                </div>
                <p className="calc-hint">
                  الحد الأقصى للأجر المؤمَّن 10,400 ج.م/شهر (2025) — ما زاد عنه لا يخضع للتأمينات.
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Quick facts */}
          {result.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>الأجر المؤمَّن: <strong>{fmt(result.siBase)}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <Buildings size={15} weight="bold" />
                <span>إجمالي الاشتراك: <strong>{fmt(result.totalShare)}/شهر</strong></span>
              </div>
              {result.cappedNote && (
                <div className="calc-esb-fact">
                  <Warning size={15} weight="bold" />
                  <span>الراتب يتجاوز الحد الأقصى — التأمينات محدودة بـ 10,400 ج.م</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--eg"><CountryFlag code="eg" /> مصر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Net salary hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">صافي الراتب بعد التأمينات</span>
                <div className="calc-esb-amount-value">{fmt(result.netAfterSi)}</div>
                <div className="calc-esb-amount-meta">
                  <span>خصم {result.employeePct}%</span>
                  <span className="calc-esb-sep">·</span>
                  <span>{fmt(result.employeeShare)} شهرياً</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الراتب الإجمالي</span>
                  <strong>{fmt(result.salary)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>الأجر المؤمَّن</span>
                  <strong>{fmt(result.siBase)}</strong>
                </div>

                {/* Employee share */}
                <div className="calc-esb-brow eg-si-employee">
                  <span>حصة الموظف ({result.employeePct}%) — تُخصم</span>
                  <strong>− {fmt(result.employeeShare)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>صافي الراتب</span>
                  <strong>{fmt(result.netAfterSi)}</strong>
                </div>

                {/* Employer share for info */}
                <div className="calc-esb-brow eg-si-employer">
                  <span>
                    <Info size={12} weight="fill" style={{ display: 'inline', marginInlineEnd: '4px' }} />
                    حصة صاحب العمل ({result.employerPct}%) — لا تُخصم
                  </span>
                  <strong>{fmt(result.employerShare)}</strong>
                </div>
                <div className="calc-esb-brow eg-si-total">
                  <span>إجمالي الاشتراك (موظف + صاحب عمل)</span>
                  <strong>{fmt(result.totalShare)}</strong>
                </div>
              </div>

              {/* Tax reduction note */}
              <div className="eg-si-tax-note">
                <Info size={14} weight="fill" />
                <span>
                  حصتك في التأمينات ({fmt(result.employeeShare)}/شهر) تُخصم من الوعاء الضريبي قبل احتساب ضريبة الدخل،
                  مما يقلل ضريبتك السنوية.
                </span>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة التأمينات الاجتماعية مصر"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>الأرقام تقديرية — راجع جهة عملك لمعرفة تفاصيل اشتراكك الفعلي.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Buildings size={28} weight="duotone" />
              <p>أدخل الراتب الشهري لحساب اشتراك التأمينات الاجتماعية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
