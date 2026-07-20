// Fiqh basis (agreed upon, Bukhari & Muslim, hadith of Sa'd ibn Abi Waqqas): a Muslim may
// bequeath (وصية) at most one third of their NET estate (after funeral costs and debts) to
// someone who is not a legal heir, or for a charitable purpose, without requiring the heirs'
// consent. A bequest beyond one third is only valid for the excess if the (adult, of sound
// mind) legal heirs unanimously agree to it after death. A bequest TO an existing legal heir
// is not valid at all unless the other heirs consent, regardless of the amount.
export function computeWasiyya({ netEstate, desiredBequest }) {
  const estate = Math.max(0, Number(netEstate) || 0);
  if (estate <= 0) return null;

  const oneThird = estate / 3;
  const twoThirds = estate - oneThird;
  const desired = Math.max(0, Number(desiredBequest) || 0);
  const hasDesired = desired > 0;
  const isWithinLimit = !hasDesired || desired <= oneThird;
  const excessAmount = isWithinLimit ? 0 : desired - oneThird;

  return {
    estate,
    oneThird,
    twoThirds,
    desired,
    hasDesired,
    isWithinLimit,
    excessAmount,
    maxAllowed: oneThird,
  };
}
