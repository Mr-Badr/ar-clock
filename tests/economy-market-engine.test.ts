import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildBestTradingTimePageModel,
  buildForexPageModel,
  buildGoldMarketHoursPageModel,
  buildStockMarketsPageModel,
  buildUsMarketOpenPageModel,
  getEconomyToolCards,
} from '@/lib/economy/engine';

const viewer = {
  timezone: 'Asia/Riyadh',
  cityNameAr: 'الرياض',
  countryNameAr: 'السعودية',
  countryCode: 'SA',
  source: 'test',
};

test('forex model detects London and New York overlap in Riyadh during April DST window', () => {
  const model = buildForexPageModel(viewer, new Date('2026-04-06T12:30:00.000Z'));

  assert.equal(model.hero.label, 'نافذة السيولة العالية');
  assert.equal(model.bestWindow.isActive, true);

  const london = model.cards.find((card) => card.id === 'london');
  const newYork = model.cards.find((card) => card.id === 'newyork');

  assert.ok(london?.isOpen);
  assert.ok(newYork?.isOpen);
});

test('stock model marks Tadawul open on Sunday while US market remains closed', () => {
  const model = buildStockMarketsPageModel(viewer, new Date('2026-04-05T08:00:00.000Z'));

  const saudi = model.cards.find((card) => card.id === 'sa');
  const us = model.cards.find((card) => card.id === 'us');

  assert.equal(saudi?.statusLabel, 'مفتوحة الآن');
  assert.equal(us?.isOpen, false);
});

test('stock model exposes extended-hours labels for the US market', () => {
  const model = buildStockMarketsPageModel(viewer, new Date('2026-04-06T10:00:00.000Z'));

  assert.match(model.extendedHours.premarketLabel, /\d/);
  assert.match(model.extendedHours.afterhoursLabel, /\d/);
  assert.match(model.usFocus.openLabel, /\d/);
});

test('economy tool cards expose the new related live routes', () => {
  const cards = getEconomyToolCards();

  assert.equal(cards.some((card) => card.href === '/economie/us-market-open' && card.isLive), true);
  assert.equal(cards.some((card) => card.href === '/economie/gold-market-hours' && card.isLive), true);
  assert.equal(cards.some((card) => card.href === '/economie/market-clock' && card.isLive), true);
  assert.equal(cards.some((card) => card.href === '/economie/best-trading-time' && card.isLive), true);
});

test('best trading time model builds chart data and weekly windows', () => {
  const model = buildBestTradingTimePageModel(viewer, new Date('2026-04-06T12:30:00.000Z'));

  assert.equal(model.activityChart.points.length, 24);
  assert.equal(model.tradingWeek.length, 5);
  assert.match(model.bestWindow.startLabel, /\d/);
  assert.equal(model.helpSections.length >= 3, true);
  assert.equal(model.disclaimerCards.length >= 3, true);
  assert.match(model.legalDisclaimer.summary, /ليست|مطلق/);
});

test('us market open model exposes Arab-country reference rows and countdown summary', () => {
  const model = buildUsMarketOpenPageModel(viewer, new Date('2026-04-06T10:00:00.000Z'));

  assert.equal(model.countryOpenRows.length, 4);
  assert.equal(model.countryExtendedRows.length, 4);
  assert.match(model.countdownSummary, /السوق الأمريكي|الافتتاح/);
  assert.equal(model.sourceLinks.length >= 3, true);
});

test('gold market hours model exposes country rows and maintenance window', () => {
  const model = buildGoldMarketHoursPageModel(viewer, new Date('2026-04-06T12:30:00.000Z'));

  assert.equal(model.goldSessionRows.length, 4);
  assert.equal(model.countryRows.length, 4);
  assert.match(model.maintenanceWindow.startLabel, /\d/);
  assert.equal(model.sourceLinks.length >= 3, true);
});
