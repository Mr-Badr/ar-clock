// Fiqh basis (majority Sunni view, hadith of Aisha via Tirmidhi/Abu Dawud, confirmed by
// binbaz.org.sa): 2 sheep/goats for a boy, 1 for a girl. Price tiers below are sourced from
// Saudi livestock-market price trackers (anaam.app, alsahaksa.com, pricedalil.com) for
// regular (non-Eid-season) pricing — Eid al-Adha season prices run 30-50% higher and are a
// different market, not reflected here since Aqiqah is not tied to the Eid calendar.
export const PRICE_TIERS = [
  {
    id: 'economical',
    label: 'اقتصادي (بربري)',
    pricePerHead: 660,
    note: 'أصغر حجماً (9-13 كجم) وأقل الأسعار.',
  },
  {
    id: 'standard',
    label: 'متوسط (حري)',
    pricePerHead: 1200,
    note: 'الأكثر طلباً، شامل الذبح والتوزيع عبر المنصات الرسمية.',
  },
  {
    id: 'premium',
    label: 'ممتاز (نعيمي / نجدي)',
    pricePerHead: 1750,
    note: 'سلالات سعودية فاخرة، أعلى جودة لحم.',
  },
];

export function getPriceTier(tierId) {
  return PRICE_TIERS.find((tier) => tier.id === tierId) || PRICE_TIERS[1];
}

/**
 * @param {{ boys: number, girls: number, tierId: string }} input
 */
export function computeAqiqahCost({ boys, girls, tierId }) {
  const boysCount = Math.max(0, Math.floor(Number(boys) || 0));
  const girlsCount = Math.max(0, Math.floor(Number(girls) || 0));
  const totalNewborns = boysCount + girlsCount;
  if (totalNewborns === 0) return null;

  const sheepForBoys = boysCount * 2;
  const sheepForGirls = girlsCount * 1;
  const totalSheep = sheepForBoys + sheepForGirls;

  const tier = getPriceTier(tierId);
  const totalCost = totalSheep * tier.pricePerHead;

  const lowTier = PRICE_TIERS[0];
  const highTier = PRICE_TIERS[PRICE_TIERS.length - 1];

  return {
    boysCount,
    girlsCount,
    totalNewborns,
    sheepForBoys,
    sheepForGirls,
    totalSheep,
    tier,
    totalCost,
    costRange: {
      min: totalSheep * lowTier.pricePerHead,
      max: totalSheep * highTier.pricePerHead,
    },
  };
}
