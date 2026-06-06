import { normalizeGuideCollection } from '@/lib/guides/page-model';
import { SLEEP_GUIDES } from '@/lib/sleep/content';
import { TOOL_GUIDES } from '@/lib/guides/tool-guides';

const RAW_ALL_GUIDES = [
  ...SLEEP_GUIDES,
  ...TOOL_GUIDES,
];

export const ALL_GUIDES = normalizeGuideCollection(RAW_ALL_GUIDES);

export function getGuideBySlug(slug) {
  return ALL_GUIDES.find((guide) => guide.slug === slug) || null;
}

function deduplicateGuides(guides) {
  const seenHrefs = new Set();

  return guides.filter((guide) => {
    const href = String(guide?.href || '');
    if (!href || seenHrefs.has(href)) {
      return false;
    }

    seenHrefs.add(href);
    return true;
  });
}

export function getGuidesBySlugs(slugs = []) {
  return slugs.map((slug) => getGuideBySlug(slug)).filter(Boolean);
}

export function getGuideCardsBySlugs(slugs = [], ctaLabel = 'اقرأ المقال') {
  return getGuidesBySlugs(slugs).map((guide) => ({
    href: guide.href,
    title: guide.title,
    description: guide.description,
    ctaLabel,
  }));
}

export function getRelatedGuidesBySlugs(slugs = []) {
  return getGuidesBySlugs(slugs);
}

export function getGuidesByHub(hubHref, excludedSlug) {
  return ALL_GUIDES.filter((guide) => {
    if (!hubHref || guide.slug === excludedSlug) {
      return false;
    }

    return guide.hubHref === hubHref;
  });
}

export function getSuggestedGuides(guide, limit) {
  const curatedGuides = getGuidesBySlugs(guide?.relatedGuideSlugs || []);
  const sameHubGuides = getGuidesByHub(guide?.hubHref || '', guide?.slug || '');

  return deduplicateGuides([...curatedGuides, ...sameHubGuides]).slice(0, limit);
}
