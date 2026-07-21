"use client";

import { useMemo, useState } from 'react';
import { Briefcase, IdentificationCard, Info, ShieldCheck, Wallet } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import CountryFlag from '@/components/shared/CountryFlag';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  calculateDomesticWorkerCost,
  DOMESTIC_WORKER_GOV_FEES,
  formatCurrency,
  formatNumber,
} from '@/lib/calculators/engine';

const CONTRACT_YEAR_OPTIONS = [
  { value: '1', title: 'سنة واحدة', description: 'عقد قصير' },
  { value: '2', title: 'سنتان', description: 'المدة الأكثر شيوعاً' },
  { value: '3', title: '3 سنوات', description: 'عقد ممتد' },
];

export default function DomesticWorkerCostCalculator() {
  const [monthlySalary, setMonthlySalary] = useState('1500');
  const [recruitmentOfficeFee, setRecruitmentOfficeFee] = useState('9000');
  const [contractYears, setContractYears] = useState('2');

  const formatMoney = (v) => formatCurrency(v, 'SAR');

  const result = useMemo(
    () => calculateDomesticWorkerCost({ monthlySalary, recruitmentOfficeFee, contractYears }),
    [monthlySalary, recruitmentOfficeFee, contractYears],
  );

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية\nمدة العقد: ${result.contractYears} سنة\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}\nتكلفة السنة الأولى: ${formatMoney(result.firstYearCost)}`
    : '';

  return (
    <div className="calc-app domestic-worker-cost-tool" aria-label="حاسبة تكلفة استقدام عاملة منزلية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="dwc-salary">الراتب الشهري المتفق عليه</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="dwc-salary"
                    inputMode="decimal"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    placeholder="1500"
                  />
                  <span className="calc-esb-currency">SAR</span>
                </div>
                <p className="calc-hint">
                  <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                  {' '}الراتب الشهري لا يشمله صاحب العمل في الخصم — القيمة كما ورد في العقد
                </p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="dwc-office-fee">رسوم مكتب الاستقدام</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="dwc-office-fee"
                    inputMode="decimal"
                    value={recruitmentOfficeFee}
                    onChange={(e) => setRecruitmentOfficeFee(e.target.value)}
                    placeholder="9000"
                  />
                  <span className="calc-esb-currency">SAR</span>
                </div>
                <p className="calc-hint">
                  <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                  {' '}أدخل الرقم الفعلي من عرض السعر الذي تلقيته (يشمل عادة تأمين العقد لدى مساند)
                </p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>مدة العقد</Label>
                </div>
                <RadioGroup value={contractYears} onValueChange={setContractYears} className="calc-esb-radio-row">
                  {CONTRACT_YEAR_OPTIONS.map((opt) => (
                    <label key={opt.value} className="calc-esb-radio-card">
                      <RadioGroupItem value={opt.value} />
                      <span className="calc-esb-radio-copy">
                        <strong>{opt.title}</strong>
                        <span>{opt.description}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

            </div>
          </div>

          <div className="calc-esb-sidebar-facts">
            <span>تأشيرة: {formatMoney(DOMESTIC_WORKER_GOV_FEES.visaIssuance)}</span>
            <span>خدمة مساند: {formatMoney(DOMESTIC_WORKER_GOV_FEES.musanedEService)}</span>
            <span>إقامة سنوية: {formatMoney(DOMESTIC_WORKER_GOV_FEES.annualIqama)}</span>
            <span>تأمين صحي سنوي: {formatMoney(DOMESTIC_WORKER_GOV_FEES.annualHealthInsurance)}</span>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel domestic-worker-cost-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">
                  <CountryFlag code="sa" /> منصة مساند — رسوم حكومية رسمية
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">التكلفة الإجمالية لكامل مدة العقد ({result.contractYears} {result.contractYears === 1 ? 'سنة' : 'سنوات'})</span>
                <div className="calc-esb-amount-value">{formatMoney(result.grandTotal)}</div>
                <div className="calc-esb-amount-meta">
                  <span>≈ {formatMoney(result.monthlyEquivalent)} شهرياً</span>
                </div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <IdentificationCard size={14} weight="bold" />
                    رسوم حكومية لمرة واحدة (تأشيرة + مساند)
                  </span>
                  <strong>{formatMoney(result.oneTimeGovFees)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <ShieldCheck size={14} weight="bold" />
                    رسوم حكومية سنوية (إقامة + تأمين) × {result.contractYears}
                  </span>
                  <strong>{formatMoney(result.totalAnnualGovFees)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Briefcase size={14} weight="bold" />
                    رسوم مكتب الاستقدام
                  </span>
                  <strong>{formatMoney(result.officeFee)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Wallet size={14} weight="bold" />
                    إجمالي الراتب لكامل المدة
                  </span>
                  <strong>{formatMoney(result.totalSalaryCost)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>تكلفة السنة الأولى فقط</span>
                  <strong>{formatMoney(result.firstYearCost)}</strong>
                </div>
              </div>

              <p className="calc-hint" style={{ marginTop: '0.5rem' }}>
                جميع تكاليف الاستقدام تقع على صاحب العمل — لا يجوز تحميل العاملة أي جزء منها.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة تكلفة استقدام عاملة منزلية"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <IdentificationCard size={28} weight="duotone" />
              <p>أدخل الراتب الشهري ورسوم مكتب الاستقدام لحساب التكلفة الإجمالية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
