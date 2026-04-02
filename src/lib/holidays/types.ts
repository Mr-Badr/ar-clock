export type EventCategory =
  | 'islamic'
  | 'national'
  | 'school'
  | 'holidays'
  | 'astronomy'
  | 'business'
  | 'support';

export interface EventCore {
  id: string;
  slug: string;
  name: string;
  type: 'hijri' | 'fixed' | 'estimated' | 'monthly' | 'easter';
  category: EventCategory;
  _countryCode?: string | null;
  month?: number;
  day?: number;
  date?: string;
  hijriMonth?: number;
  hijriDay?: number;
}

export interface EventRichContent {
  answerSummary?: string;
  quickFacts?: Record<string, string> | Array<{ label: string; value: string }>;
  aboutEvent?: Record<string, string>;
  faq?: Array<{ question: string; answer: string }>;
  faqItems?: Array<{ q: string; a: string }>;
  seoMeta?: Record<string, unknown>;
  recurringYears?: Record<string, unknown>;
  schemaData?: Record<string, unknown>;
  relatedSlugs?: string[];
}

export interface ResolvedEventViewModel {
  event: EventCore & EventRichContent;
  targetDateISO: string;
  daysRemaining: number;
  formattedDate: string;
  faqItems: Array<{ q: string; a: string }>;
  quickFacts: Record<string, string> | Array<{ label: string; value: string }>;
}

export interface RankingBrief {
  slug: string;
  locale: 'ar';
  primaryKeyword: string;
  secondaryKeywords: string[];
  intentClass: 'informational' | 'commercial' | 'navigational';
  uniquenessThesis: string[];
  mustCoverSections: string[];
}

export interface CompetitorSnapshot {
  slug: string;
  capturedAt: string;
  queries: string[];
  competitors: Array<{
    url: string;
    title?: string;
    coveredTopics: string[];
    missingTopics: string[];
  }>;
}

export interface CountryOverlay {
  aliasSlugs?: string[];
  seoTitle?: string;
  description?: string;
  keywords?: string[];
  quickFacts?: Record<string, string> | Array<{ label: string; value: string }>;
  countryDates?: Array<Record<string, unknown>>;
  sources?: Array<Record<string, unknown>>;
  seoMeta?: Record<string, unknown>;
}

export interface AliasMapping {
  aliasSlug: string;
  canonicalSlug: string;
  countryCode?: string | null;
}

export interface KeywordTemplateSet {
  base: string[];
  country: string[];
}

export interface EventPackage {
  schemaVersion: number;
  core: EventCore;
  richContent: EventRichContent & Record<string, unknown>;
  countryOverrides?: Record<string, CountryOverlay>;
  aliasSlugs?: string[];
  countryScope?: 'none' | 'all' | 'custom';
  countryAliasTemplate?: string;
  keywordTemplateSet?: KeywordTemplateSet;
  tier: 'tier1' | 'tier2' | 'tier3';
  publishStatus: EventPublishStatus;
  canonicalPath?: string;
}

export type EventPublishStatus =
  | 'briefed'
  | 'drafted'
  | 'validated'
  | 'fact_checked'
  | 'editor_approved'
  | 'published'
  | 'monitored';
