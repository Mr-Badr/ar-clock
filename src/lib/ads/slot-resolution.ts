type ManualAdSlots = Record<string, unknown>;

export type ManualAdFormat = 'topBanner' | 'inArticle' | 'inFeed' | 'multiplex';

type RouteManualAdSlotKeys = Readonly<Partial<Record<ManualAdFormat, string>>>;

type RouteManualAdSlotFamily = {
  prefix: string;
  keys: RouteManualAdSlotKeys;
};

const ROUTE_MANUAL_AD_SLOT_FAMILIES: readonly RouteManualAdSlotFamily[] = [
  {
    prefix: '/holidays',
    keys: {
      topBanner: 'topHolidaysBanner',
      inArticle: 'inArticleHolidays',
      inFeed: 'inFeedHolidays',
      multiplex: 'multiplexHolidays',
    },
  },
  {
    prefix: '/date',
    keys: {
      topBanner: 'topDateBanner',
      inArticle: 'inArticleDate',
      multiplex: 'multiplexDate',
    },
  },
  {
    prefix: '/blog',
    keys: {
      topBanner: 'topBlogBanner',
      inArticle: 'inArticleBlog',
      inFeed: 'inFeedBlog',
      multiplex: 'multiplexBlog',
    },
  },
  {
    prefix: '/time-now',
    keys: {
      topBanner: 'topTimeBanner',
      inArticle: 'inArticleTime',
      multiplex: 'multiplexTime',
    },
  },
  {
    prefix: '/mwaqit-al-salat',
    keys: {
      topBanner: 'topPrayerBanner',
      inArticle: 'inArticlePrayer',
      multiplex: 'multiplexPrayer',
    },
  },
  {
    prefix: '/time-difference',
    keys: {
      topBanner: 'topTimeDifferenceBanner',
      inArticle: 'inArticleTimeDifference',
      multiplex: 'multiplexTimeDifference',
    },
  },
  {
    prefix: '/calculators',
    keys: {
      topBanner: 'topCalculatorBanner',
      inArticle: 'inArticleCalculator',
      multiplex: 'multiplexCalculator',
    },
  },
];

function normalizeManualAdSlotValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function getManualAdSlotValue(
  manualSlots: ManualAdSlots,
  key: string | null | undefined,
): string | null {
  if (!key) return null;
  return normalizeManualAdSlotValue(manualSlots[key]);
}

export function resolveManualAdSlot(
  manualSlots: ManualAdSlots,
  preferredKey: string | null | undefined,
  fallbackKey: string,
): string {
  return (
    getManualAdSlotValue(manualSlots, preferredKey)
    || getManualAdSlotValue(manualSlots, fallbackKey)
    || ''
  );
}

export function getRouteManualAdSlotKey(
  pathname: string,
  format: ManualAdFormat,
): string | null {
  const normalizedPathname = pathname.trim() || '/';
  const family = ROUTE_MANUAL_AD_SLOT_FAMILIES.find(({ prefix }) => (
    normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`)
  ));

  return family?.keys[format] ?? null;
}
