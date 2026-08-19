"use client";

import { useMemo, useState } from 'react';
import {
  CalendarCheck, CheckCircle, CurrencyCircleDollar, Hourglass, Info, Warning, XCircle,
} from '@phosphor-icons/react';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  checkSanedEligibility,
  estimateSanedCompensation,
  getContributionRequirement,
  getRegistrationDeadline,
  MAX_BENEFIT_MONTHS,
  REGISTRATION_DEADLINE_DAYS,
} from '@/lib/calculators/saned-eligibility-engine';

const JOB_LOSS_REASONS = [
  { id: 'endOfContract', label: 'انتهاء العقد' },
  { id: 'employerTerminatedNoFault', label: 'فصل من صاحب العمل بلا سبب راجع إليّ' },
  { id: 'resigned', label: 'استقالة اختيارية' },
  { id: 'disciplinaryDismissal', label: 'فصل تأديبي بسبب راجع إليّ' },
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

function fmt(n) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn').format(Math.round(n));
}

export default function SanedEligibilityChecker() {
  const [isSaudi, setIsSaudi] = useState(true);
  const [age, setAge] = useState('35');
  const [jobLossReason, setJobLossReason] = useState('endOfContract');
  const [hasOtherIncome, setHasOtherIncome] = useState(false);
  const [ableToWork, setAbleToWork] = useState(true);
  const [claimNumber, setClaimNumber] = useState(1);
  const [contributedMonths, setContributedMonths] = useState('12');
  const [jobLossDate, setJobLossDate] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');

  const requirement = useMemo(() => getContributionRequirement(claimNumber), [claimNumber]);

  const result = useMemo(() => checkSanedEligibility({
    isSaudi, age, jobLossReason, hasOtherIncome, ableToWork, claimNumber, contributedMonths,
  }), [isSaudi, age, jobLossReason, hasOtherIncome, ableToWork, claimNumber, contributedMonths]);

  const deadline = useMemo(() => {
    if (!jobLossDate) return null;
    const parsed = new Date(jobLossDate);
    return getRegistrationDeadline(parsed);
  }, [jobLossDate]);

  const compensation = useMemo(() => estimateSanedCompensation(monthlySalary), [monthlySalary]);

  return (
    <div aria-label="مدقق أهلية ساند">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <CountryFlag code="sa" /> ساند — السعودية <span className="tool-v2-live-dot" aria-hidden="true" />
        </span>
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-addon-toggle" htmlFor="sn-nationality">
          <input id="sn-nationality" type="checkbox" checked={isSaudi} onChange={(e) => setIsSaudi(e.target.checked)} />
          <span>أنا سعودي الجنسية</span>
        </label>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sn-age">عمرك</label>
        <input id="sn-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>
          سبب فقدان العمل
          <FieldHint text="ساند لا يشمل الاستقالة الاختيارية أو الفصل التأديبي بسبب راجع إليك — فقط فقدان العمل خارج إرادتك." />
        </label>
        <div className="guide-v2-checker-options" role="group" aria-label="سبب فقدان العمل">
          {JOB_LOSS_REASONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`guide-v2-checker-chip${jobLossReason === r.id ? ' is-active' : ''}`}
              aria-pressed={jobLossReason === r.id}
              onClick={() => setJobLossReason(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-addon-toggle" htmlFor="sn-income">
          <input id="sn-income" type="checkbox" checked={hasOtherIncome} onChange={(e) => setHasOtherIncome(e.target.checked)} />
          <span>لديّ دخل حالياً من عمل أو نشاط خاص آخر</span>
        </label>
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-addon-toggle" htmlFor="sn-able">
          <input id="sn-able" type="checkbox" checked={ableToWork} onChange={(e) => setAbleToWork(e.target.checked)} />
          <span>أنا قادر على العمل وأبحث عنه فعلياً</span>
        </label>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sn-claim">
          كم مرة صرفت ساند من قبل؟
          <FieldHint text="مدة الاشتراك المطلوبة ترتفع مع كل مرة تصرف فيها ساند سابقاً." />
        </label>
        <div id="sn-claim" className="tool-v2-stepper" role="group" aria-label="عدد مرات الاستحقاق السابقة">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setClaimNumber((v) => Math.max(1, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{claimNumber >= 4 ? 'الرابعة+' : requirement.label}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setClaimNumber((v) => Math.min(4, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sn-months">
          عدد أشهر اشتراكك في ساند خلال آخر {requirement.windowMonths} شهراً
        </label>
        <input id="sn-months" type="number" inputMode="numeric" value={contributedMonths} onChange={(e) => setContributedMonths(e.target.value)} />
      </div>

      <div className={`guide-v2-checker-result ${result.eligible ? 'is-good' : 'is-bad'}`} aria-live="polite">
        <p className="guide-v2-checker-result-label">
          {result.eligible
            ? <CheckCircle size={16} weight="fill" style={{ verticalAlign: 'middle' }} />
            : <XCircle size={16} weight="fill" style={{ verticalAlign: 'middle' }} />}
          {' '}
          {result.eligible ? 'تستوفي شروط استحقاق ساند' : `تستوفي ${result.passedCount} من ${result.total} شروط`}
        </p>
        <ul className="tool-v2-addon-list" style={{ marginTop: 8 }}>
          {result.checks.map((c) => (
            <li key={c.id} className="tool-v2-addon-row" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {c.ok ? <CheckCircle size={14} weight="fill" style={{ color: 'var(--green-text)' }} /> : <XCircle size={14} weight="fill" style={{ color: 'var(--red-text)' }} />}
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sn-job-loss-date">
          <CalendarCheck size={14} weight="bold" style={{ verticalAlign: 'middle' }} />
          {' '}تاريخ آخر يوم عمل (اختياري)
          <FieldHint text={`يجب تسجيل طلبك خلال ${REGISTRATION_DEADLINE_DAYS} يوماً من هذا التاريخ.`} />
        </label>
        <input id="sn-job-loss-date" type="date" value={jobLossDate} onChange={(e) => setJobLossDate(e.target.value)} />
      </div>

      {deadline ? (
        <div className={`guide-v2-checker-result ${deadline.isPastDeadline ? 'is-bad' : deadline.isUrgent ? 'is-bad' : 'is-good'}`} aria-live="polite">
          <p className="guide-v2-checker-result-label">
            <Hourglass size={16} weight="fill" style={{ verticalAlign: 'middle' }} />
            {' '}
            {deadline.isPastDeadline
              ? 'انتهت مهلة التسجيل'
              : `متبقٍ ${fmt(deadline.daysRemaining)} يوماً لتسجيل طلبك`}
          </p>
          <p className="guide-v2-checker-result-note">
            آخر موعد للتسجيل: {deadline.deadline.toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })}
            {deadline.isPastDeadline ? ' — تواصل مع GOSI مباشرة إن كان لديك عذر مقبول للتأخير.' : ''}
          </p>
        </div>
      ) : null}

      <div className="tool-v2-field">
        <label htmlFor="sn-salary">
          <CurrencyCircleDollar size={14} weight="bold" style={{ verticalAlign: 'middle' }} />
          {' '}متوسط راتبك الشهري الخاضع للاشتراك (اختياري)
        </label>
        <input id="sn-salary" type="number" inputMode="decimal" placeholder="مثال: 8000" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
      </div>

      {compensation ? (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-label">تقدير تقريبي للتعويض الشهري</p>
          {compensation.map((tier) => (
            <p key={tier.fromMonth} className="tool-v2-result-stat-row" style={{ marginTop: 6 }}>
              <span>{tier.fromMonth === 1 ? `الأشهر ${tier.fromMonth}-${tier.toMonth}` : `الأشهر ${tier.fromMonth}-${tier.toMonth}`} ({Math.round(tier.rate * 100)}%)</span>
              <span className="calc-amount-value" style={{ fontSize: '1.1rem' }}>{fmt(tier.monthlyAmount)} ريال/شهرياً</span>
            </p>
          ))}
          <p className="guide-v2-checker-result-note">
            الحد الأقصى الكلي {MAX_BENEFIT_MONTHS} شهراً لكل استحقاق — هذا تقدير تقريبي وليس الرقم الرسمي، احسب رقمك الدقيق عبر بوابة تأميناتي.
          </p>
        </div>
      ) : null}

      <div className="tool-v2-note-strip">
        <Warning size={14} weight="fill" />
        <span>أداة استرشادية لمساعدتك على التحضير — القرار النهائي للاستحقاق يعود للمؤسسة العامة للتأمينات الاجتماعية (GOSI) بعد مراجعة طلبك الفعلي.</span>
      </div>
    </div>
  );
}
