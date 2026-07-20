/**
 * Affiliate link registry — intentionally code-driven, not env-driven, same
 * pattern as `src/lib/ads/manual-config.js`.
 *
 * Every consumer of a link here MUST treat an empty value as "not ready yet"
 * and render nothing — this is the whole mechanism behind "built but hidden
 * until a real link exists" from `docs/high-value-tools-tracker.md`. Never
 * fall back to a placeholder URL.
 *
 * Fill in a value here once the matching row in `docs/affiliate-links-to-fill.md`
 * has a real, approved affiliate link — nothing else needs to change in code.
 */
const AFFILIATE_LINKS = {
  // Shown as a short callout on salary-day-* holiday event pages (see
  // HolidayDetailsSections.jsx). Tracker doc: "Track A extension" section.
  remittance: '',
  // Store link inside productPicks on content-commerce guides (see
  // src/lib/guides/pregnancy-guides.js) — a plain store link, not per-category.
  // Fill in once a Mumzworld offer is approved inside Admitad (publisher ID
  // 2552902, approved 2026-07-17) — see docs/affiliate-links-to-fill.md.
  mumzworld: '',
};

// Amazon Associate tags, one per marketplace — approved so far: France only
// (partenaires.amazon.fr, tag confirmed live 2026-07-17).
//
// WHY SEPARATE TAGS PER MARKETPLACE, NOT ONE "SMART" REDIRECT LINK:
// Amazon's OneLink feature CAN redirect a visitor to their local marketplace
// while crediting one linked account, but only for marketplaces it actually
// supports — checked 2026-07-17 and found conflicting signals specifically
// for the Gulf: Saudi Arabia is *listed* in Amazon's OneLink country list,
// but multiple sources say amazon.sa doesn't actually redirect in practice
// (it runs on different platform infrastructure, inherited from the Souq.com
// acquisition), and amazon.ae isn't in the supported list at all. Rather than
// depend on a redirect that may silently fail for exactly the Gulf audience
// this site cares about most, every marketplace gets its own real tag and its
// own visible button — the reader picks the Amazon site they actually use.
// Add 'sa'/'ae' values here once those Associates programs are approved
// (self-serve signup: affiliate-program.amazon.sa / .amazon.ae, needs a local
// bank account per marketplace) — nothing else needs to change in code, a
// button appears automatically for any marketplace with a non-empty tag.
const AMAZON_ASSOCIATE_TAGS = {
  fr: 'miqatona-21',
  sa: '',
  ae: '',
};

const AMAZON_MARKETPLACE_LABELS = {
  fr: 'Amazon.fr',
  sa: 'Amazon.sa',
  ae: 'Amazon.ae',
};

const AMAZON_MARKETPLACE_DOMAINS = {
  fr: 'amazon.fr',
  sa: 'amazon.sa',
  ae: 'amazon.ae',
};

function normalizeLink(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function getAffiliateLink(key) {
  return normalizeLink(AFFILIATE_LINKS[key]);
}

function buildAmazonSearchLink(marketplace, query) {
  const tag = normalizeLink(AMAZON_ASSOCIATE_TAGS[marketplace]);
  const domain = AMAZON_MARKETPLACE_DOMAINS[marketplace];
  if (!tag || !domain || !query) return null;

  return `https://www.${domain}/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}`;
}

/**
 * Builds one "shop" option per Amazon marketplace that (a) has an approved
 * tag and (b) has a query provided for it in `queriesByMarketplace`. A
 * marketplace with no tag yet (e.g. 'sa'/'ae' today) is silently skipped —
 * filling in its tag later makes its button appear with zero other changes.
 *
 * @param {{fr?: string, sa?: string, ae?: string}} queriesByMarketplace
 * @returns {{store: string, href: string}[]}
 */
export function buildAmazonStoreOptions(queriesByMarketplace = {}) {
  return Object.entries(queriesByMarketplace)
    .map(([marketplace, query]) => {
      const href = buildAmazonSearchLink(marketplace, query);
      if (!href) return null;
      return { store: AMAZON_MARKETPLACE_LABELS[marketplace] || 'Amazon', href };
    })
    .filter(Boolean);
}
