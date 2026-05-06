import test from 'node:test';
import assert from 'node:assert/strict';

import {
  compareHolidayEventsByTargetDate,
  normalizeHolidaySearchText,
  scoreHolidaySearchMatch,
} from '@/app/holidays/search-utils';
import { getHolidayRuntimeRecord } from '@/lib/holidays/repository';

test('holiday search normalizes Arabic hamza and diacritics', () => {
  assert.equal(normalizeHolidaySearchText('  الأبُ  '), 'الاب');
  assert.equal(normalizeHolidaySearchText('إجازة'), 'اجازه');
});

test('holiday search finds world fathers day with hamza-less Arabic query', () => {
  const record = getHolidayRuntimeRecord('world-fathers-day');
  assert.ok(record);
  const event = {
    ...record?.core,
    ...(record?.content || {}),
  };

  assert.ok(
    scoreHolidaySearchMatch(event, 'الاب') > 0,
    'expected world-fathers-day to appear for query "الاب"',
  );
});

test('holiday list sorting compares the nearest target date before later dates', () => {
  const targetTimeBySlug = new Map([
    ['near', new Date('2026-06-21T00:00:00.000Z').getTime()],
    ['far', new Date('2026-12-18T00:00:00.000Z').getTime()],
    ['mid', new Date('2026-08-01T00:00:00.000Z').getTime()],
  ]);
  const events = [
    { slug: 'far', name: 'حدث بعيد' },
    { slug: 'near', name: 'حدث قريب' },
    { slug: 'mid', name: 'حدث متوسط' },
  ];

  const sorted = events
    .slice()
    .sort((left, right) => compareHolidayEventsByTargetDate(left, right, targetTimeBySlug));

  assert.deepEqual(sorted.map((event) => event.slug), ['near', 'mid', 'far']);
});
