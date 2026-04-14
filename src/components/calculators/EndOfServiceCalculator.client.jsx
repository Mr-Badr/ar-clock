"use client";

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarClock, Landmark, Wallet } from 'lucide-react';

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

  const shareText = result.isValid
    ? `مدة الخدمة: ${result.serviceLabel}\nمكافأة نهاية الخدمة: ${formatCurrency(result.award)}\nنسبة الاستحقاق: ${formatPercent(result.entitlementPercent)}`
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">بيانات الحساب</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label">نوع العقد</Label>
                <span className="calc-hint">يظهر في الملخص للمراجعة السريعة</span>
              </div>
              <RadioGroup
                value={contractType}
                onValueChange={setContractType}
                className="calc-radio-grid"
              >
                {contractOptions.map((option) => (
                  <label key={option.value} className="card-nested calc-radio-card">
                    <RadioGroupItem value={option.value} />
                    <span className="calc-radio-copy">
                      <strong>{option.title}</strong>
                      <span>{option.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="calc-field">
              <Label className="calc-label" htmlFor="salary">
                الراتب الأساسي الشهري
              </Label>
              <Input
                id="salary"
                inputMode="decimal"
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
                placeholder="8000"
              />
              <p className="calc-hint">استخدم الراتب الأساسي فقط بدون البدلات.</p>
            </div>

            <div className="calc-grid-2">
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

            <div className="calc-field">
              <Label className="calc-label">سبب إنهاء العلاقة التعاقدية</Label>
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
              <p className="calc-hint">
                {terminationOptions.find((option) => option.value === reason)?.hint}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card calc-results-panel">
            <CardHeader>
              <CardTitle className="calc-card-title">ملخص الاستحقاق</CardTitle>
            </CardHeader>
            <CardContent className="calc-form-grid">
              {result.isValid ? (
                <>
                  <div className="calc-metric-grid">
                    <div className="card-nested calc-metric-card">
                      <div className="calc-metric-card__label">مدة الخدمة</div>
                      <div className="calc-metric-card__value">{result.serviceLabel}</div>
                      <div className="calc-metric-card__note">
                        {contractType === 'fixed' ? 'عقد محدد المدة' : 'عقد غير محدد المدة'}
                      </div>
                    </div>
                    <div className="card-nested calc-metric-card">
                      <div className="calc-metric-card__label">المكافأة المستحقة</div>
                      <div className="calc-metric-card__value">{formatCurrency(result.award)}</div>
                      <div className="calc-metric-card__note">
                        كامل الاستحقاق قبل التعديل: {formatCurrency(result.fullAward)}
                      </div>
                    </div>
                  </div>

                  <div className="calc-field">
                    <div className="calc-field-row">
                      <span className="calc-label">نسبة الاستحقاق</span>
                      <strong>{formatPercent(result.entitlementPercent)}</strong>
                    </div>
                    <Progress value={result.entitlementPercent} />
                    {reason === 'resignation' ? (
                      <p className="calc-hint">
                        الفئة الحالية: {result.resignationBracket.label}
                      </p>
                    ) : null}
                  </div>

                  <div className="calc-breakdown-list">
                    <div className="calc-breakdown-item">
                      <span>السنوات الخمس الأولى</span>
                      <strong>{formatCurrency(result.firstFiveAmount)}</strong>
                    </div>
                    <div className="calc-breakdown-item">
                      <span>ما بعد خمس سنوات</span>
                      <strong>{formatCurrency(result.remainingAmount)}</strong>
                    </div>
                    <div className="calc-breakdown-item">
                      <span>الأشهر والأيام الإضافية</span>
                      <strong>{formatCurrency(result.partialAmount)}</strong>
                    </div>
                  </div>

                  <ResultActions
                    copyText={shareText}
                    shareTitle="حاسبة مكافأة نهاية الخدمة"
                    shareText={shareText}
                  />
                </>
              ) : (
                <div className="calc-warning">
                  أدخل راتباً صحيحاً وتأكد أن تاريخ نهاية الخدمة بعد تاريخ البداية.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="calc-surface-card calc-support-panel">
            <CardHeader>
              <CardTitle className="calc-card-title">هل الانتظار يفيدك؟</CardTitle>
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
                  الاستحقاق {formatCurrency(comparison.projected.award)}، أي فرق{' '}
                  {formatCurrency(comparison.difference)} عن الحساب الحالي.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="calc-surface-card calc-support-panel">
            <CardHeader>
              <CardTitle className="calc-card-title">خط زمني للاستحقاق</CardTitle>
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
                الحاسبة تقديرية لتوضيح القاعدة العامة، وقد تتأثر النتيجة بعناصر عقدية أو قضائية
                خاصة مثل الإجازات غير المدفوعة أو أي تسويات مكتوبة.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="calc-grid-4">
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label">
            <Wallet size={16} />
          </div>
          <div className="calc-metric-card__value">{formatCurrency(result.salary || 0)}</div>
          <div className="calc-metric-card__note">الراتب المعتمد للحساب</div>
        </div>
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label">
            <CalendarClock size={16} />
          </div>
          <div className="calc-metric-card__value">
            {result.service?.totalDays ? formatNumber(result.service.totalDays) : '0'}
          </div>
          <div className="calc-metric-card__note">إجمالي أيام الخدمة</div>
        </div>
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label">
            <Landmark size={16} />
          </div>
          <div className="calc-metric-card__value">{formatCurrency(result.fullAward || 0)}</div>
          <div className="calc-metric-card__note">الاستحقاق الكامل قبل التعديل</div>
        </div>
        <div className="card-nested calc-metric-card">
          <div className="calc-metric-card__label">
            <BriefcaseBusiness size={16} />
          </div>
          <div className="calc-metric-card__value">{formatPercent(result.entitlementPercent || 0)}</div>
          <div className="calc-metric-card__note">نسبة الاستحقاق الحالية</div>
        </div>
      </div>
    </div>
  );
}
