import { PERSONAL_FINANCE_GUIDES } from '@/lib/calculators/personal-finance-data';
import { SLEEP_GUIDES } from '@/lib/sleep/content';
import { TOOLS_AND_ECONOMY_GUIDES } from '@/lib/guides/tools-and-economy-guides';

const PERSONAL_FINANCE_GUIDES_ENRICHED = PERSONAL_FINANCE_GUIDES.map((guide) => ({
  hubTitle: 'التخطيط المالي الشخصي',
  hubHref: '/calculators/personal-finance',
  badge: guide.badge || 'دليل التخطيط المالي',
  accent: guide.accent || '#2563EB',
  ...guide,
}));

export const ALL_GUIDES = [
  ...PERSONAL_FINANCE_GUIDES_ENRICHED,
  ...SLEEP_GUIDES,
  ...TOOLS_AND_ECONOMY_GUIDES,
];

export function getGuideBySlug(slug) {
  return ALL_GUIDES.find((guide) => guide.slug === slug) || null;
}

export function getGuidesBySlugs(slugs = []) {
  return slugs.map((slug) => getGuideBySlug(slug)).filter(Boolean);
}

export function getGuideCardsBySlugs(slugs = [], ctaLabel = 'افتح الدليل') {
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
