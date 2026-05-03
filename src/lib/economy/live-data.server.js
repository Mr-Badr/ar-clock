import 'server-only';

import { DateTime } from 'luxon';

import { buildStockMarketsPageModel } from '@/lib/economy/engine';
import { DEFAULT_ECONOMY_VIEWER } from '@/lib/economy/page-helpers';
import { getCachedNowIso } from '@/lib/date-utils';
import { getEnv } from '@/lib/env.server';

const YAHOO_API_ROOT = 'https://query1.finance.yahoo.com/v7/finance/quote';
const YAHOO_CHART_API_ROOT = 'https://query1.finance.yahoo.com/v8/finance/chart';
const ALPHA_VANTAGE_API_ROOT = 'https://www.alphavantage.co/query';
const TWELVE_DATA_API_ROOT = 'https://api.twelvedata.com';
const LIVE_REVALIDATE_SECONDS = 60;
const NUMBER_LOCALE = 'ar-SA-u-nu-latn';
const YAHOO_CHART_INTERVAL = '15m';
const YAHOO_CHART_RANGE = '1d';
const SPARKLINE_POINT_LIMIT = 28;

const LIVE_SYMBOLS = {
  spy: {
    id: 'spy',
    symbol: 'SPY',
    yahooSymbol: 'SPY',
    alphaVantage: { type: 'stock', symbol: 'SPY' },
    nameAr: 'S&P 500',
    href: '/economie/us-market-open',
    scopes: ['landing', 'market-hours', 'us-market-open', 'stock-markets'],
    decimals: 2,
  },
  qqq: {
    id: 'qqq',
    symbol: 'QQQ',
    yahooSymbol: 'QQQ',
    alphaVantage: { type: 'stock', symbol: 'QQQ' },
    nameAr: 'Nasdaq 100',
    href: '/economie/us-market-open',
    scopes: ['landing', 'market-hours', 'us-market-open', 'stock-markets'],
    decimals: 2,
  },
  eurusd: {
    id: 'eurusd',
    symbol: 'EUR/USD',
    yahooSymbol: 'EURUSD=X',
    alphaVantage: { type: 'fx', from: 'EUR', to: 'USD' },
    nameAr: 'EUR/USD',
    href: '/economie/forex-sessions',
    scopes: ['landing', 'market-hours', 'forex-sessions', 'market-clock', 'best-trading-time'],
    decimals: 5,
  },
  gbpusd: {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    yahooSymbol: 'GBPUSD=X',
    alphaVantage: { type: 'fx', from: 'GBP', to: 'USD' },
    nameAr: 'GBP/USD',
    href: '/economie/forex-sessions',
    scopes: ['forex-sessions', 'market-clock', 'best-trading-time'],
    decimals: 5,
  },
  usdjpy: {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    yahooSymbol: 'JPY=X',
    alphaVantage: { type: 'fx', from: 'USD', to: 'JPY' },
    nameAr: 'USD/JPY',
    href: '/economie/forex-sessions',
    scopes: ['landing', 'market-hours', 'forex-sessions', 'market-clock', 'best-trading-time'],
    decimals: 3,
  },
  xauusd: {
    id: 'xauusd',
    symbol: 'XAU/USD',
    yahooSymbol: 'GC=F',
    alphaVantage: { type: 'fx', from: 'XAU', to: 'USD' },
    nameAr: 'XAU/USD',
    href: '/economie/gold-market-hours',
    scopes: ['landing', 'market-hours', 'gold-market-hours', 'forex-sessions', 'best-trading-time'],
    decimals: 2,
  },
};

const SCOPE_MARKET_ROWS = {
  landing: ['nyse', 'nasdaq', 'lse'],
  'market-hours': ['nyse', 'nasdaq', 'lse'],
  'us-market-open': ['nyse', 'nasdaq'],
  'gold-market-hours': ['nyse'],
  'forex-sessions': ['lse', 'nyse'],
  'stock-markets': ['nyse', 'nasdaq', 'lse'],
  'market-clock': ['lse', 'nyse'],
  'best-trading-time': ['lse', 'nyse'],
};

const PROVIDER_LABELS = {
  yahoo: 'Yahoo Finance (best effort)',
  alphavantage: 'Alpha Vantage Free',
  twelvedata: 'Twelve Data Free',
};
const MARKET_ROW_LABELS = {
  nyse: 'NYSE',
  nasdaq: 'NASDAQ',
  lse: 'بورصة لندن',
};

export const LIVE_DATA_SCOPES = Object.keys(SCOPE_MARKET_ROWS);

function getScopeSymbols(scope) {
  return Object.values(LIVE_SYMBOLS).filter((item) => item.scopes.includes(scope));
}

function formatNumber(value, minimumFractionDigits = 2, maximumFractionDigits = minimumFractionDigits) {
  const numericValue = Number.parseFloat(value);
  if (!Number.isFinite(numericValue)) return '--';

  return new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericValue);
}

function formatPercent(value) {
  const numericValue = Number.parseFloat(value);
  if (!Number.isFinite(numericValue)) return '--';

  const sign = numericValue > 0 ? '+' : '';
  return `${sign}${formatNumber(numericValue, 2, 2)}%`;
}

function formatTimeAgo(input) {
  if (!input) return 'غير متاح';

  let updatedAt = null;

  if (typeof input === 'number' || /^\d+$/.test(String(input))) {
    updatedAt = DateTime.fromSeconds(Number.parseInt(input, 10), { zone: 'utc' });
  } else {
    updatedAt = DateTime.fromISO(String(input), { zone: 'utc' });
  }

  if (!updatedAt?.isValid) return 'غير متاح';

  const diffMinutes = Math.max(0, Math.round(DateTime.utc().diff(updatedAt, 'minutes').minutes));
  if (diffMinutes < 1) return 'قبل أقل من دقيقة';
  if (diffMinutes === 1) return 'قبل دقيقة واحدة';
  if (diffMinutes < 60) return `قبل ${diffMinutes} دقيقة`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours === 1) return 'قبل ساعة واحدة';
  return `قبل ${diffHours} ساعات`;
}

function resolveTone(percentChange) {
  const numericValue = Number.parseFloat(percentChange);
  if (!Number.isFinite(numericValue)) return 'default';
  if (numericValue > 0) return 'success';
  if (numericValue < 0) return 'danger';
  return 'default';
}

function parseMaybeJsonError(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return payload.message || payload.status === 'error' ? payload.message || 'Upstream error' : null;
}

function toFiniteNumber(value) {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

async function fetchJson(url) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json,text/plain,*/*',
        'user-agent': 'Mozilla/5.0 (compatible; MiqatonaBot/1.0; +https://miqatona.com)',
      },
      next: { revalidate: LIVE_REVALIDATE_SECONDS, tags: ['economy-live-feed'] },
    });

    if (!response.ok) return null;

    const text = await response.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function compactSeries(values, limit = SPARKLINE_POINT_LIMIT) {
  if (!Array.isArray(values) || values.length <= limit) return values;

  const step = (values.length - 1) / (limit - 1);
  const compacted = [];

  for (let index = 0; index < limit; index += 1) {
    compacted.push(values[Math.round(index * step)]);
  }

  return compacted;
}

function buildSparkline(values) {
  const numericSeries = (values || [])
    .map(toFiniteNumber)
    .filter((value) => value != null);

  if (numericSeries.length < 2) return null;
  return compactSeries(numericSeries);
}

function formatRangeLabel(low, high, decimals = 2) {
  const safeLow = toFiniteNumber(low);
  const safeHigh = toFiniteNumber(high);

  if (safeLow == null || safeHigh == null) return '';
  return `مدى اليوم: ${formatNumber(safeLow, decimals, decimals)} - ${formatNumber(safeHigh, decimals, decimals)}`;
}

async function fetchYahooSparkline(definition) {
  if (!definition?.yahooSymbol) return null;

  const payload = await fetchJson(
    `${YAHOO_CHART_API_ROOT}/${encodeURIComponent(definition.yahooSymbol)}?range=${YAHOO_CHART_RANGE}&interval=${YAHOO_CHART_INTERVAL}&includePrePost=false&events=div%2Csplit`,
  );

  const result = payload?.chart?.result?.[0];
  const closes = result?.indicators?.quote?.[0]?.close;
  return buildSparkline(closes);
}

function buildQuoteCard(definition, payload) {
  const price = payload?.price;
  const percentChange = payload?.percentChange;
  const change = payload?.change;

  return {
    id: definition.id,
    title: definition.nameAr,
    symbol: definition.symbol,
    href: definition.href,
    value: formatNumber(price, definition.decimals, definition.decimals),
    changeLabel:
      change != null && percentChange != null
        ? `${Number.parseFloat(change) > 0 ? '+' : ''}${formatNumber(change, definition.decimals, definition.decimals)} · ${formatPercent(percentChange)}`
        : payload?.changeLabel || 'آخر سعر متاح',
    detail: payload?.detail || 'سعر مرجعي حي',
    updateLabel: formatTimeAgo(payload?.updatedAt),
    tone: payload?.tone || resolveTone(percentChange),
    exchange: payload?.exchange || '',
    rangeLabel: payload?.rangeLabel || '',
    sparkline: Array.isArray(payload?.sparkline) && payload.sparkline.length >= 2 ? payload.sparkline : null,
  };
}

function buildPlaceholderCards(scope) {
  return getScopeSymbols(scope).map((item) => ({
    id: item.id,
    title: item.nameAr,
    symbol: item.symbol,
    href: item.href,
    value: '—',
    changeLabel: 'بيانات حية غير مفعلة',
    detail: 'الصفحة تعرض الآن طبقة التوقيت والسيولة فقط',
    updateLabel: 'بدون مزامنة',
    tone: 'default',
    exchange: '',
    rangeLabel: '',
    sparkline: null,
  }));
}

async function buildLocalMarketRows(scope) {
  const requestedIds = SCOPE_MARKET_ROWS[scope] || [];
  const nowIso = await getCachedNowIso();
  const model = buildStockMarketsPageModel(DEFAULT_ECONOMY_VIEWER, nowIso);
  const usCard = model.cards.find((card) => card.id === 'us');
  const ukCard = model.cards.find((card) => card.id === 'uk');

  const rowMap = {
    nyse: usCard
      ? {
          id: 'nyse',
          label: 'NYSE',
          status: usCard.statusLabel,
          detail: `${usCard.isOpen ? 'إلى الإغلاق' : 'إلى الافتتاح'}: ${usCard.countdownLabel}`,
          tone: usCard.statusTone || 'default',
        }
      : null,
    nasdaq: usCard
      ? {
          id: 'nasdaq',
          label: 'NASDAQ',
          status: usCard.statusLabel,
          detail: `${usCard.isOpen ? 'إلى الإغلاق' : 'إلى الافتتاح'}: ${usCard.countdownLabel}`,
          tone: usCard.statusTone || 'default',
        }
      : null,
    lse: ukCard
      ? {
          id: 'lse',
          label: 'بورصة لندن',
          status: ukCard.statusLabel,
          detail: `${ukCard.isOpen ? 'إلى الإغلاق' : 'إلى الافتتاح'}: ${ukCard.countdownLabel}`,
          tone: ukCard.statusTone || 'default',
        }
      : null,
  };

  return requestedIds.map((id) => rowMap[id]).filter(Boolean);
}

function buildPreviewMarketRows(scope) {
  const requestedIds = SCOPE_MARKET_ROWS[scope] || [];

  return requestedIds.map((id) => {
    const label = MARKET_ROW_LABELS[id];
    if (!label) return null;

    return {
      id,
      label,
      status: 'تحديث بعد الفتح',
      detail: 'نعرض الحالة الحالية لهذه السوق فور فتح الصفحة وبدء المزامنة الحية.',
      tone: 'default',
    };
  }).filter(Boolean);
}

async function fetchYahooCards(symbolDefs) {
  const yahooDefs = symbolDefs.filter((item) => item.yahooSymbol);
  if (!yahooDefs.length) return [];

  const payload = await fetchJson(
    `${YAHOO_API_ROOT}?symbols=${encodeURIComponent(yahooDefs.map((item) => item.yahooSymbol).join(','))}`,
  );

  const rows = payload?.quoteResponse?.result;
  if (!Array.isArray(rows) || !rows.length) return [];

  const sparklineResults = await Promise.allSettled(
    yahooDefs.map(async (definition) => [definition.id, await fetchYahooSparkline(definition)]),
  );
  const sparklineById = new Map(
    sparklineResults
      .map((item) => (item.status === 'fulfilled' ? item.value : null))
      .filter(Boolean),
  );

  return yahooDefs
    .map((definition) => {
      const quote = rows.find((item) => item.symbol === definition.yahooSymbol);
      if (!quote) return null;

      const marketState = String(
        quote.marketState || quote.quoteType || quote.exchangeDataDelayedBy || '',
      ).toLowerCase();
      const detail = marketState.includes('regular')
        ? 'السوق في الجلسة الرئيسية'
        : marketState.includes('pre')
          ? 'السوق في ما قبل الافتتاح'
          : marketState.includes('post')
            ? 'السوق في ما بعد الإغلاق'
            : 'سعر مرجعي حي';

      return buildQuoteCard(definition, {
        price:
          quote.regularMarketPrice
          ?? quote.postMarketPrice
          ?? quote.preMarketPrice
          ?? quote.bid
          ?? quote.ask,
        change: quote.regularMarketChange,
        percentChange: quote.regularMarketChangePercent,
        updatedAt:
          quote.regularMarketTime
          ?? quote.postMarketTime
          ?? quote.preMarketTime,
        detail,
        exchange: quote.fullExchangeName || quote.exchange || '',
        rangeLabel: formatRangeLabel(
          quote.regularMarketDayLow ?? quote.fiftyTwoWeekLow,
          quote.regularMarketDayHigh ?? quote.fiftyTwoWeekHigh,
          definition.decimals,
        ),
        sparkline: sparklineById.get(definition.id) || null,
      });
    })
    .filter(Boolean);
}

async function fetchAlphaVantageCards(symbolDefs) {
  const env = getEnv();
  const apiKey = env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [];

  const cards = [];

  for (const definition of symbolDefs) {
    const config = definition.alphaVantage;
    if (!config) continue;

    let payload = null;

    if (config.type === 'stock') {
      payload = await fetchJson(
        `${ALPHA_VANTAGE_API_ROOT}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(config.symbol)}&apikey=${encodeURIComponent(apiKey)}`,
      );
      const quote = payload?.['Global Quote'];
      if (!quote) continue;

      cards.push(
        buildQuoteCard(definition, {
          price: quote['05. price'],
          change: quote['09. change'],
          percentChange: String(quote['10. change percent'] || '').replace('%', ''),
          updatedAt: quote['07. latest trading day'],
          detail: 'سعر مرجعي من الخطة المجانية',
          exchange: 'Alpha Vantage',
        }),
      );
      continue;
    }

    payload = await fetchJson(
      `${ALPHA_VANTAGE_API_ROOT}?function=CURRENCY_EXCHANGE_RATE&from_currency=${encodeURIComponent(config.from)}&to_currency=${encodeURIComponent(config.to)}&apikey=${encodeURIComponent(apiKey)}`,
    );

    const quote = payload?.['Realtime Currency Exchange Rate'];
    if (!quote) continue;

    cards.push(
      buildQuoteCard(definition, {
        price: quote['5. Exchange Rate'],
        changeLabel: 'سعر صرف فوري من الخطة المجانية',
        updatedAt: quote['6. Last Refreshed'],
        detail: `${config.from}/${config.to} من Alpha Vantage`,
        exchange: 'Alpha Vantage',
      }),
    );
  }

  return cards;
}

async function fetchTwelveData(path, params) {
  const env = getEnv();
  const apiKey = env.TWELVE_DATA_API_KEY;

  if (!apiKey) return null;

  const searchParams = new URLSearchParams({
    ...params,
    apikey: apiKey,
    format: 'JSON',
  });

  const payload = await fetchJson(`${TWELVE_DATA_API_ROOT}${path}?${searchParams.toString()}`);
  if (parseMaybeJsonError(payload)) return null;
  return payload;
}

async function fetchTwelveDataCards(symbolDefs) {
  const quoteRequests = symbolDefs.map(async (definition) => {
    const payload = await fetchTwelveData('/quote', {
      symbol: definition.symbol,
      dp: String(definition.decimals),
    });

    if (!payload) return null;

    return buildQuoteCard(definition, {
      price: payload.close,
      change: payload.change,
      percentChange: payload.percent_change,
      updatedAt: payload.timestamp || payload.last_quote_at,
      detail: payload.is_market_open ? 'السوق مفتوح الآن' : 'السوق مغلق حالياً أو خارج الجلسة',
      exchange: payload.exchange || '',
    });
  });

  const settled = await Promise.allSettled(quoteRequests);
  return settled
    .map((item) => (item.status === 'fulfilled' ? item.value : null))
    .filter(Boolean);
}

function resolveProviderOrder(provider) {
  if (provider && provider !== 'auto') return [provider];
  return ['yahoo', 'twelvedata', 'alphavantage'];
}

async function fetchCardsFromProvider(provider, symbolDefs) {
  if (provider === 'yahoo') {
    return {
      provider,
      label: PROVIDER_LABELS.yahoo,
      cards: await fetchYahooCards(symbolDefs),
    };
  }

  if (provider === 'alphavantage') {
    return {
      provider,
      label: PROVIDER_LABELS.alphavantage,
      cards: await fetchAlphaVantageCards(symbolDefs),
    };
  }

  if (provider === 'twelvedata') {
    return {
      provider,
      label: PROVIDER_LABELS.twelvedata,
      cards: await fetchTwelveDataCards(symbolDefs),
    };
  }

  return { provider, label: provider, cards: [] };
}

export async function getEconomyFallbackSnapshot(scope = 'landing') {
  return {
    scope,
    mode: 'fallback',
    providerLabel: 'وضع عرض تجريبي مجاني',
    updateLabel: 'الأسعار الحية غير مفعلة أو لم تصل من المصادر المجانية بعد',
    coverageNote: 'نستمر في عرض توقيت السوق والسيولة المرجعية حتى إذا لم تصل الأسعار الحية من المصادر المجانية في هذه اللحظة.',
    noticeTitle: 'الأسعار الحية غير متاحة الآن',
    noticeText: 'إذا لم تظهر الأسعار أو المخططات الآن فهذا يعني أن المصادر المجانية لم ترجع بيانات كافية في هذه اللحظة. سنعرض التوقيت والسيولة المرجعية الآن، وسنوفر التحديثات الجديدة حالما تعود البيانات.',
    retryLabel: 'جرّب لاحقاً خلال 10 إلى 15 دقيقة أو أعد فتح الصفحة',
    cards: buildPlaceholderCards(scope),
    rows: await buildLocalMarketRows(scope),
  };
}

export async function getEconomyPreviewSnapshot(scope = 'landing') {
  return {
    scope,
    mode: 'preview',
    providerLabel: 'سيبدأ التحديث بعد فتح الصفحة',
    updateLabel: 'لم نطلب أي مصدر خارجي بعد',
    coverageNote: 'تحافظ الصفحة على HTML قوي وقابل للفهرسة من دون استهلاك أي حصص مجانية قبل أن يفتحها زائر فعلي.',
    noticeTitle: 'التحديث الحي يبدأ عند الزيارة',
    noticeText: 'عند دخول المستخدم إلى هذه الصفحة نبدأ محاولة جلب الأسعار والمخططات من المصادر المجانية المتاحة. إذا لم تصل البيانات سنبقي طبقة التوقيت والسيولة ونطلب منك العودة لاحقاً.',
    retryLabel: 'افتح الصفحة وانتظر لحظات لبدء المزامنة',
    cards: buildPlaceholderCards(scope),
    rows: buildPreviewMarketRows(scope),
  };
}

export async function getEconomyLiveSnapshot(scope = 'landing') {
  const env = getEnv();
  const requestedProvider = env.ECONOMY_LIVE_DATA_PROVIDER || 'auto';
  const symbolDefs = getScopeSymbols(scope);
  const liveCardsById = new Map();
  const usedProviderLabels = [];

  for (const provider of resolveProviderOrder(requestedProvider)) {
    const remainingDefs = symbolDefs.filter((item) => !liveCardsById.has(item.id));
    if (!remainingDefs.length) break;

    const result = await fetchCardsFromProvider(provider, remainingDefs);
    if (!result.cards.length) continue;

    result.cards.forEach((card) => {
      if (!liveCardsById.has(card.id)) {
        liveCardsById.set(card.id, card);
      }
    });
    usedProviderLabels.push(result.label);
  }

  const placeholderCards = buildPlaceholderCards(scope);
  const cards = symbolDefs.map((definition) => {
    const liveCard = liveCardsById.get(definition.id);
    if (liveCard) return liveCard;

    return placeholderCards.find((item) => item.id === definition.id);
  });

  const liveCount = cards.filter((card) => card && card.value !== '—').length;

  if (!liveCount) {
    return getEconomyFallbackSnapshot(scope);
  }

  return {
    scope,
    mode: liveCount === symbolDefs.length ? 'live' : 'partial',
    providerLabel: usedProviderLabels.join(' + ') || 'مصادر مجانية',
    updateLabel: cards.find((card) => card?.updateLabel && card.updateLabel !== 'بدون مزامنة')?.updateLabel || 'مزامنة حديثة',
    coverageNote:
      liveCount === symbolDefs.length
        ? 'الصفحة تعرض الآن أسعاراً مرجعية حية مع نبض يومي سريع يساعد الزائر على قراءة السوق قبل الدخول إلى اللوحة الكاملة.'
        : 'بعض الأسعار المرجعية وصلت من المصادر المجانية الآن، بينما تستمر بقية الصفحة في العمل من طبقة التوقيت والسيولة المحلية.',
    noticeTitle: liveCount === symbolDefs.length ? 'المزامنة الحية تعمل الآن' : 'تم تفعيل جزء من البيانات الحية',
    noticeText:
      liveCount === symbolDefs.length
        ? 'الأسعار المرجعية الحالية وصلت من أكثر من مصدر مجاني حسب التوفر، مع إبقاء الصفحة صالحة حتى لو انقطع أحدها لاحقاً.'
        : 'بعض البطاقات تعمل الآن من المصادر المجانية، بينما تبقى البطاقات الأخرى على وضع التوقيت والسيولة حتى تعود البيانات.',
    retryLabel: liveCount === symbolDefs.length ? 'يتم التحديث تلقائياً كل دقيقة تقريباً' : 'يمكنك تحديث الصفحة أو العودة بعد قليل لاكتمال التغطية',
    cards,
    rows: await buildLocalMarketRows(scope),
  };
}
