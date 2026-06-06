"use client";

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Landmark,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import {
  CalcInput as Input,
  CalcProgress as Progress,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  buildEndOfServiceComparison,
  buildEndOfServiceMilestones,
  calculateEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
  formatNumber,
  formatPercent,
} from '@/lib/calculators/engine';

const terminationOptions = [
  { value: 'contract_end', label: 'انتهاء مدة العقد', hint: 'استحقاق كامل وفق القاعدة العامة.' },
  { value: 'resignation', label: 'استقالة', hint: 'تحسب النسبة تلقائياً حسب مدة الخدمة.' },
  { value: 'employer_termination', label: 'فصل أو إنهاء من صاحب العمل', hint: 'استحقاق كامل عادة.' },
  { value: 'retirement', label: 'تقاعد', hint: 'تعامل كاستحقاق كامل في هذه الحاسبة.' },
];

const contractOptions = [
  {
    value: 'fixed',
    title: 'محدد المدة',
    description: 'مفيد عند نهاية العقد أو عدم تجديده.',
  },
  {
    value: 'open',
    title: 'غير محدد المدة',
    description: 'شائع في العقود المستمرة والاستقالات.',
  },
];

export default function EndOfServiceCalculator({
  initialStartDate,
  initialEndDate,
}) {
  const formatMoney = (value) => formatCurrency(value, 'SAR');
  const [contractType, setContractType] = useState('open');
  const [salary, setSalary] = useState('8000');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [reason, setReason] = useState('resignation');
  const [waitMonths, setWaitMonths] = useState([6]);

  const result = useMemo(
    () => calculateEndOfServiceBenefit({ salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );
  const comparison = useMemo(
    () => buildEndOfServiceComparison({
      salary,
      startDate,
      endDate,
      reason,
      waitMonths: waitMonths[0],
    }),
    [salary, startDate, endDate, reason, waitMonths],
  );
  const milestones = useMemo(
    () => buildEndOfServiceMilestones(startDate),
    [startDate],
  );
  const selectedTermination = terminationOptions.find((option) => option.value === reason);
  const nextMilestone = reason === 'resignation'
    ? milestones.find((item) => item.date && item.date > endDate)
    : null;
  const contractLabel = contractOptions.find((option) => option.value === contractType)?.title;
  const resultContext = reason === 'resignation'
    ? `استقالة: ${result.resignationBracket?.label || 'تحتاج مدة صحيحة'}`
    : selectedTermination?.label || 'سبب الإنهاء';
  const nextMilestoneText = nextMilestone
    ? `إذا كنت قريباً من ${formatDateArabic(nextMilestone.date)} فراجع أثر الانتظار قبل تقديم الاستقالة.`
    : 'راجع السبب المكتوب في الخطاب قبل الاعتماد على النتيجة.';
  const summaryCards = [
    {
      key: 'salary',
      tone: 'salary',
      icon: Wallet,
      value: formatMoney(result.salary || 0),
      label: 'الأجر المرجعي للحساب',
      tag: 'مدخل أساسي',
      note: 'تأكد هل المقصود الأجر الأخير أم الأساسي فقط.',
    },
    {
      key: 'service',
      tone: 'service',
      icon: CalendarClock,
      value: result.serviceLabel || 'أقل من يوم',
      label: result.service?.totalDays ? `${formatNumber(result.service.totalDays)} يوم فعلي` : 'مدة الخدمة غير مكتملة',
      tag: 'مدة الخدمة',
      note: 'طابقها مع سجل التأمينات أو عقد العمل.',
    },
    {
      key: 'full-award',
      tone: 'award',
      icon: Landmark,
      value: formatMoney(result.fullAward || 0),
      label: 'الاستحقاق الكامل قبل التعديل',
      tag: 'قبل سبب الإنهاء',
      note: 'هذا الرقم قبل تطبيق نسبة الاستقالة.',
    },
    {
      key: 'percent',
      tone: 'percent',
      icon: BriefcaseBusiness,
      value: formatPercent(result.entitlementPercent || 0),
      label: 'نسبة الاستحقاق الحالية',
      tag: reason === 'resignation' ? 'استقالة' : 'استحقاق كامل',
      note: resultContext,
    },
  ];

  const shareText = result.isValid
    ? `الأجر المرجعي: ${formatMoney(result.salary)}\nمدة الخدمة: ${result.serviceLabel}\nمكافأة نهاية الخدمة: ${formatMoney(result.award)}\nنسبة الاستحقاق: ${formatPercent(result.entitlementPercent)}`
    : '';

  return (
    <div className="calc-app end-service-tool" aria-label="حاسبة مكافأة نهاية الخدمة">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel calc-esb-form-card">
          <CardHeader>
            <div className="calc-esb-panel-heading">
              <span className="calc-esb-panel-kicker">المدخلات</span>
              <CardTitle className="calc-card-title">أدخل بيانات التسوية بترتيب واضح</CardTitle>
              <p>غيّر أي رقم وستتحدث النتيجة فوراً. ابدأ بالراتب والتواريخ، ثم اختر سبب الإنهاء كما هو مكتوب في المستند.</p>
            </div>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field calc-esb-step-field">
              <div className="calc-field-row">
                <Label className="calc-label">نوع العقد</Label>
                <span className="calc-esb-step-number">01</span>
              </div>
              <RadioGroup
                value={contractType}
                onValueChange={setContractType}
                className="calc-radio-grid"
              >
                {contractOptions.map((option) => (
                  <label key={option.value} className="calc-radio-card">
                    <RadioGroupItem value={option.value} />
                    <span className="calc-radio-copy">
                      <strong>{option.title}</strong>
                      <span>{option.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="calc-field calc-esb-step-field">
              <div className="calc-field-row">
                <Label className="calc-label" htmlFor="salary">
                  الأجر أو الراتب المرجعي الشهري
                </Label>
                <span className="calc-esb-step-number">02</span>
              </div>
              <div className="calc-esb-money-field">
                <Input
                  id="salary"
                  inputMode="decimal"
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                  placeholder="8000"
                />
                <span>ر.س</span>
              </div>
              <p className="calc-hint">
                أدخل الرقم الذي ستُبنى عليه التسوية. إن لم تكن متأكداً، استخدم الراتب الأساسي كتقدير أولي ثم راجع الأجر الأخير والعناصر المتغيرة.
              </p>
            </div>

            <div className="calc-grid-2 calc-esb-date-grid">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="start-date">
                  تاريخ بداية العمل
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="end-date">
                  تاريخ نهاية العمل
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>

            <div className="calc-field calc-esb-step-field">
              <div className="calc-field-row">
                <Label className="calc-label">سبب إنهاء العلاقة التعاقدية</Label>
                <span className="calc-esb-step-number">03</span>
              </div>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {terminationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="calc-esb-reason-note">
                <AlertTriangle size={16} aria-hidden="true" />
                <span>{selectedTermination?.hint}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card calc-results-panel calc-esb-result-card">
            <CardHeader>
              <div className="calc-esb-panel-heading">
                <span className="calc-esb-panel-kicker">النتيجة المباشرة</span>
                <CardTitle className="calc-card-title">المبلغ الذي ستراجعه الآن</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="calc-form-grid" aria-live="polite">
              {result.isValid ? (
                <>
                  <div className="calc-esb-answer">
                    <div className="calc-esb-answer__copy">
                      <span>مكافأة نهاية الخدمة المقدرة</span>
                      <strong>{formatMoney(result.award)}</strong>
                      <p>
                        {resultContext}. أصل المكافأة قبل التعديل هو {formatMoney(result.fullAward)}.
                      </p>
                    </div>
                    <ResultActions
                      copyText={shareText}
                      shareTitle="حاسبة مكافأة نهاية الخدمة"
                      shareText={shareText}
                    />
                  </div>

                  <div className="calc-esb-result-context">
                    <div>
                      <span>مدة الخدمة</span>
                      <strong>{result.serviceLabel}</strong>
                      <small>{contractLabel}</small>
                    </div>
                    <div>
                      <span>نسبة الاستحقاق</span>
                      <strong>{formatPercent(result.entitlementPercent)}</strong>
                      <small>{reason === 'resignation' ? result.resignationBracket.label : 'القاعدة العامة'}</small>
                    </div>
                    <div>
                      <span>الأيام المحتسبة</span>
                      <strong>{formatNumber(result.service.totalDays)}</strong>
                      <small>يوم فعلي بين التاريخين</small>
                    </div>
                  </div>

                  <div className="calc-field calc-esb-progress-block">
                    <div className="calc-field-row">
                      <span className="calc-label">نسبة الاستحقاق المطبقة على أصل المكافأة</span>
                      <strong>{formatPercent(result.entitlementPercent)}</strong>
                    </div>
                    <Progress value={result.entitlementPercent} />
                  </div>

                  <div className="calc-breakdown-list calc-esb-breakdown">
                    <div className="calc-breakdown-item">
                      <span>نصف شهر عن السنوات الخمس الأولى</span>
                      <strong>{formatMoney(result.firstFiveAmount)}</strong>
                    </div>
                    <div className="calc-breakdown-item">
                      <span>شهر كامل عن السنوات بعد الخامسة</span>
                      <strong>{formatMoney(result.remainingAmount)}</strong>
                    </div>
                    <div className="calc-breakdown-item">
                      <span>كسور السنة من الأشهر والأيام</span>
                      <strong>{formatMoney(result.partialAmount)}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="calc-warning calc-esb-empty-result">
                  <AlertTriangle size={18} aria-hidden="true" />
                  <span>أدخل راتباً صحيحاً وتأكد أن تاريخ نهاية الخدمة بعد تاريخ البداية.</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="calc-surface-card calc-support-panel calc-esb-support-card">
            <CardHeader>
              <CardTitle className="calc-card-title">
                <TrendingUp size={18} aria-hidden="true" />
                هل الانتظار يفيدك؟
              </CardTitle>
            </CardHeader>
            <CardContent className="calc-form-grid">
              <div className="calc-field">
                <div className="calc-field-row">
                  <Label className="calc-label">قارن مع الاستقالة بعد</Label>
                  <strong>{waitMonths[0]} شهر</strong>
                </div>
                <Slider
                  className="calc-slider"
                  min={0}
                  max={24}
                  step={1}
                  value={waitMonths}
                  onValueChange={setWaitMonths}
                />
              </div>

              {comparison.projected?.isValid ? (
                <div className={comparison.difference >= 0 ? 'calc-success' : 'calc-warning'}>
                  إذا تغيّر تاريخ النهاية إلى {formatDateArabic(comparison.projectedEndDate)} فسيصبح
                  الاستحقاق {formatMoney(comparison.projected.award)}، أي فرق{' '}
                  {formatMoney(comparison.difference)} عن الحساب الحالي.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="calc-surface-card calc-support-panel calc-esb-support-card">
            <CardHeader>
              <CardTitle className="calc-card-title">
                <CalendarClock size={18} aria-hidden="true" />
                خط زمني للاستحقاق
              </CardTitle>
            </CardHeader>
            <CardContent className="calc-mini-list">
              {milestones.map((item) => (
                <div key={item.years} className="calc-mini-item">
                  <span>
                    <strong>{item.label}</strong>
                    <br />
                    <span className="calc-hint">{item.years} سنوات من تاريخ البداية</span>
                  </span>
                  <strong>{item.date ? formatDateArabic(item.date) : '-'}</strong>
                </div>
              ))}
              <div className="calc-note">
                {nextMilestoneText}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="end-service-summary-strip" aria-label="مراجعة سريعة قبل الاعتماد على النتيجة">
        <div className="end-service-summary-strip__head">
          <span>راجع قبل الاعتماد</span>
          <strong>أربع نقاط تمنع أغلب أخطاء التسوية</strong>
        </div>
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.key} className={`end-service-summary-card end-service-summary-card--${card.tone}`}>
              <div className="end-service-summary-card__top">
                <span className="end-service-summary-card__icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="end-service-summary-card__tag">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  {card.tag}
                </span>
              </div>
              <div className="end-service-summary-card__value">{card.value}</div>
              <div className="end-service-summary-card__label">{card.label}</div>
              <p>{card.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
