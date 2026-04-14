import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateAdjustedValue,
  calculateBorrowingCapacity,
  calculateDebtToIncome,
  calculateEndOfServiceBenefit,
  calculateMarginAndVat,
  calculateMonthlyInstallment,
  calculateMultiChange,
  calculatePercentChange,
  calculatePercentageOfValue,
  calculateSequentialDiscounts,
  calculateVatAdd,
  calculateVatExtract,
  calculateVatReturn,
  calculateWhatPercent,
  splitAmountByPercentages,
} from '@/lib/calculators/engine';
import {
  buildAgeDifference,
  buildAgeMilestones,
  buildAgeSnapshot,
  buildPlanetaryAges,
  calculateRetirement,
} from '@/lib/calculators/age';

test('end of service benefit handles resignation tiers', () => {
  const result = calculateEndOfServiceBenefit({
    salary: 10000,
    startDate: '2020-01-01',
    endDate: '2023-01-01',
    reason: 'resignation',
  });

  assert.equal(result.isValid, true);
  assert.equal(result.entitlementPercent, 33.3);
  assert.ok(result.award > 0);
  assert.ok(result.fullAward > result.award);
});

test('monthly installment returns amortized result for reducing loans', () => {
  const result = calculateMonthlyInstallment({
    loanAmount: 100000,
    years: 5,
    annualRate: 6,
    interestType: 'reducing',
  });

  assert.equal(result.isValid, true);
  if (!result.isValid) throw new Error('expected valid monthly installment result');
  assert.equal(result.months, 60);
  assert.ok((result.monthlyOutflow ?? 0) > 1500);
  assert.ok((result.totalPaid ?? 0) > result.principal);
  assert.equal(result.schedule?.length, 60);
});

test('vat add and extract are inverse operations up to rounding', () => {
  const added = calculateVatAdd(1000, 15);
  const extracted = calculateVatExtract(added.total, 15);

  assert.equal(added.tax, 150);
  assert.equal(added.total, 1150);
  assert.equal(extracted.base, 1000);
  assert.equal(extracted.tax, 150);
});

test('vat return differentiates due vs refund', () => {
  const due = calculateVatReturn({
    salesAmount: 11500,
    purchaseAmount: 2300,
    rate: 15,
    amountsIncludeVat: true,
  });
  const refund = calculateVatReturn({
    salesAmount: 1150,
    purchaseAmount: 5750,
    rate: 15,
    amountsIncludeVat: true,
  });

  assert.equal(due.status, 'due');
  assert.ok(due.net > 0);
  assert.equal(refund.status, 'refund');
  assert.ok(refund.net < 0);
});

test('percentage helper functions stay consistent', () => {
  assert.equal(calculatePercentageOfValue(20, 500).result, 100);
  assert.equal(calculateWhatPercent(40, 200).result, 20);
  assert.equal(calculateAdjustedValue(1000, 25, 'decrease').result, 750);
  assert.equal(calculatePercentChange(100, 150).percentChange, 50);
});

test('sequential discounts and split helpers return expected totals', () => {
  const discounts = calculateSequentialDiscounts(1000, [20, 10]);
  const split = splitAmountByPercentages(1000, [50, 30, 20]);

  assert.equal(discounts.finalAmount, 720);
  assert.equal(discounts.effectiveRate, 28);
  assert.equal(split.remainingAmount, 0);
  assert.deepEqual(
    split.allocations.map((item) => item.amount),
    [500, 300, 200],
  );
});

test('loan capacity and debt ratio provide sensible outputs', () => {
  const capacity = calculateBorrowingCapacity({
    monthlyBudget: 3000,
    annualRate: 5,
    years: 5,
    interestType: 'reducing',
  });
  const debt = calculateDebtToIncome({
    monthlyPayments: 3500,
    monthlyIncome: 10000,
  });

  assert.equal(capacity.isValid, true);
  assert.ok(capacity.principal > 100000);
  assert.equal(debt.status, 'warning');
});

test('margin and multi-change helpers are stable', () => {
  const margin = calculateMarginAndVat({
    cost: 100,
    marginRate: 30,
    vatRate: 15,
  });
  const multi = calculateMultiChange(100, [10, -5, 10]);

  assert.equal(margin.total, 149.5);
  assert.ok(multi.finalValue > 110);
});

test('age snapshot exposes age totals and upcoming birthday', () => {
  const result = buildAgeSnapshot({
    birthDateIso: '1995-03-12',
    targetDateIso: '2026-04-14',
  });

  assert.equal(result.isValid, true);
  if (!result.isValid) throw new Error('expected valid age snapshot');
  assert.equal(result.years, 31);
  assert.equal(result.months, 1);
  assert.equal(result.days, 2);
  assert.equal(result.nextBirthday.iso, '2027-03-12');
  assert.ok(result.totals.days > 11000);
  assert.ok(result.birthdayProgress.progressPercent > 0);
});

test('age milestones mix reached and upcoming checkpoints', () => {
  const milestones = buildAgeMilestones('1995-03-12', '2026-04-14');
  const billion = milestones.find((item) => item.key === '1b-seconds');

  assert.equal(Array.isArray(milestones), true);
  assert.ok(milestones.some((item) => item.isReached));
  assert.ok(milestones.some((item) => !item.isReached));
  assert.equal(Boolean(billion), true);
});

test('age difference identifies older person and shared generation state', () => {
  const result = buildAgeDifference({
    firstBirthDateIso: '1985-04-08',
    secondBirthDateIso: '1990-06-16',
    targetDateIso: '2026-04-14',
    firstName: 'أحمد',
    secondName: 'سارة',
  });

  assert.equal(result.isValid, true);
  if (!result.isValid) throw new Error('expected valid age difference result');
  assert.equal(result.older?.name, 'أحمد');
  assert.ok((result.totalDays ?? 0) > 1800);
  assert.equal(result.sameGeneration, true);
});

test('planetary ages are derived from the same birth date', () => {
  const result = buildPlanetaryAges({
    birthDateIso: '1995-03-12',
    targetDateIso: '2026-04-14',
  });

  assert.equal(result.isValid, true);
  if (!result.isValid || !('planets' in result)) {
    throw new Error('expected valid planetary age result');
  }
  assert.equal(result.planets.length, 8);
  const mercury = result.planets.find((planet: { key: string; age: number }) => planet.key === 'mercury');
  const saturn = result.planets.find((planet: { key: string; age: number }) => planet.key === 'saturn');
  assert.ok((mercury?.age ?? 0) > 100);
  assert.ok((saturn?.age ?? 0) < 2);
});

test('retirement calculator returns a simple retirement estimate', () => {
  const result = calculateRetirement({
    birthDateIso: '1995-03-12',
    countryCode: 'sa',
    sector: 'government',
    gender: 'male',
    targetDateIso: '2026-04-14',
  });

  assert.equal(result.isValid, true);
  if (!result.isValid) throw new Error('expected valid retirement result');
  assert.equal(result.retirementAge, 65);
  assert.equal(result.retirementDateIso, '2060-03-12');
  assert.equal(result.isRetired, false);
});
