import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';

import { ALL_RAW_EVENTS } from '../src/lib/events/index.js';
import { GENERATED_ALIAS_TO_CANONICAL } from '../src/lib/events/generated-aliases.js';
import { getAllCountryNamesAr } from '../src/lib/events/country-dictionary.js';
import { parseEventPackage } from '../src/lib/events/package-schema.js';
import { getRichContent } from '../src/lib/event-content/index.js';
import { describeHolidayDistribution } from '../src/lib/holidays/distribution.js';
import { parseRichContent } from '../src/lib/event-content/schema.js';
import { pickFaqEntries } from '../src/lib/holidays/faq-normalizer.js';

type DistributionKind = 'shared' | 'country_specific' | 'selective' | 'standalone';
type Severity = 'error' | 'warn';

type Issue = {
  code: string;
  severity: Severity;
  message: string;
};

type Row = {
  slug: string;
  publishStatus: string;
  state: 'hidden' | 'live';
  distribution: DistributionKind;
  countryCodes: string[];
  issues: Issue[];
};

const ROOT = process.cwd();
const MANIFEST_PATH = join(ROOT, 'src/data/holidays/generated/manifest.json');
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');
const DEFAULT_JSON_REPORT_PATH = join(ROOT, 'reports/holiday-content-validation.json');

const PLACEHOLDER_RE = /(^|[\s(])(?:سيتم الإضافة|TBD|TODO|placeholder)(?=$|[\s).،])/i;
const DISCLAIMER_RE = /(قد يختلف|تقريبي|قد يتغير|رؤية الهلال|إعلان رسمي|تقديري)/i;
const SOURCE_TEXT_RE = /(المصدر|وفق|مصدر)/i;
const TECHNICAL_JARGON_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'HTML', pattern: /\bHTML\b/i },
  { label: 'JSON', pattern: /\bJSON\b/i },
  { label: 'Open Graph', pattern: /\bOpen Graph\b/i },
  { label: 'og image', pattern: /\bog image\b/i },
  { label: 'canonicalPath', pattern: /\bcanonicalPath\b/i },
  { label: 'countryOverrides', pattern: /\bcountryOverrides\b/i },
  { label: 'countryScope', pattern: /\bcountryScope\b/i },
  { label: 'schemaData', pattern: /\bschemaData\b/i },
  { label: 'slug', pattern: /\bslug\b/i },
];
const TOKEN_RE = /\{\{\s*([\w.]+)\s*\}\}/g;
const ALLOWED_TEMPLATE_TOKENS = new Set([
  'year',
  'hijriYear',
  'nextYear',
  'daysRemaining',
  'eventName',
  'formattedDate',
  'hijriDate',
  'dayName',
]);
const VALID_PUBLISH_STATUSES = new Set([
  'briefed',
  'drafted',
  'validated',
  'fact_checked',
  'editor_approved',
  'published',
  'monitored',
]);
const COUNTRY_NAME_SET = new Set(getAllCountryNamesAr().filter(Boolean));

const LIVE_PUBLISH_STATUSES = new Set(['published', 'monitored']);
const REQUIRED_BASE_SECTIONS = ['quickFacts', 'faq', 'seoMeta'];
const REQUIRED_LIVE_SECTIONS = [
  'answerSummary',
  'quickFacts',
  'aboutEvent',
  'faq',
  'seoMeta',
  'schemaData',
];

const MIN_FAQ_BY_CATEGORY: Record<string, number> = {
  islamic: 6,
  national: 6,
  school: 6,
  holidays: 6,
  astronomy: 6,
  social: 6,
  business: 4,
  support: 4,
};

function normalizeText(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasBaseCountryLeak(text: string, countryName: string) {
  if (!text || !countryName) return false;
  if (countryName === 'المغرب') {
    return /(?:في|ب|داخل)\s+المغرب|المغرب(?:ي|ية|يون|يات)/.test(text);
  }
  const pattern = new RegExp(`(^|\\s)${escapeRegExp(countryName)}(?=$|\\s)`);
  return pattern.test(text);
}

function firstSentence(text: string) {
  return text.split(/[.!؟\n]/).map((s) => s.trim()).find(Boolean) || '';
}

function hasData(value: any) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function collectStringValues(value: any, out: string[] = []) {
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value.trim())) return out;
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStringValues(item, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) collectStringValues(nested, out);
  }
  return out;
}

function uniqueNormalizedPhrases(values: string[]) {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const value of values) {
    const normalized = normalizeText(String(value || ''));
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    phrases.push(normalized);
  }
  return phrases;
}

function countPhraseMatchesInText(text: string, phrases: string[]) {
  const normalizedText = normalizeText(text);
  if (!normalizedText) return 0;
  let matchCount = 0;
  for (const phrase of uniqueNormalizedPhrases(phrases)) {
    if (phrase.length < 6) continue;
    if (normalizedText.includes(phrase)) matchCount += 1;
  }
  return matchCount;
}

function jaccard(tokensA: Set<string>, tokensB: Set<string>) {
  if (!tokensA.size || !tokensB.size) return 0;
  let intersection = 0;
  for (const token of Array.from(tokensA)) {
    if (tokensB.has(token)) intersection += 1;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out: {
    strict: boolean;
    liveOnly: boolean;
    statuses: string[] | null;
    jsonPath: string | null;
    changedOnly: boolean;
    slugs: string[] | null;
  } = {
    strict: false,
    liveOnly: false,
    statuses: null,
    jsonPath: null,
    changedOnly: false,
    slugs: null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--strict') out.strict = true;
    if (arg === '--live') out.liveOnly = true;
    if (arg.startsWith('--status=')) {
      const value = arg.split('=')[1] || '';
      out.statuses = value.split(',').map((entry) => entry.trim()).filter(Boolean);
    }
    if (arg === '--status' && args[i + 1] && !args[i + 1].startsWith('--')) {
      out.statuses = args[i + 1].split(',').map((entry) => entry.trim()).filter(Boolean);
      i += 1;
    }
    if (arg === '--json') {
      out.jsonPath = DEFAULT_JSON_REPORT_PATH;
    }
    if (arg.startsWith('--json=')) {
      out.jsonPath = arg.split('=')[1] || DEFAULT_JSON_REPORT_PATH;
    }
    if (arg === '--changed') {
      out.changedOnly = true;
    }
    if (arg.startsWith('--slug=')) {
      out.slugs = arg
        .split('=')[1]
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }
    if (arg === '--slug' && args[i + 1] && !args[i + 1].startsWith('--')) {
      out.slugs = args[i + 1]
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      i += 1;
    }
  }
  return out;
}

function getChangedSlugs() {
  const slugs = new Set<string>();
  const collect = (line: string) => {
    const match =
      line.match(/^src\/data\/holidays\/events\/([^/]+)\/package\.json$/) ||
      line.match(/^src\/data\/holidays\/events\/([^/]+)\/research\.json$/) ||
      line.match(/^src\/data\/holidays\/events\/([^/]+)\/qa\.json$/);
    if (match?.[1]) slugs.add(match[1]);
  };

  try {
    const diffOutput = execSync('git diff --name-only HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    for (const rawLine of diffOutput.split('\n')) {
      const line = rawLine.trim();
      if (!line) continue;
      collect(line);
    }
  } catch {}

  try {
    const statusOutput = execSync('git status --porcelain --untracked-files=all', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    for (const rawLine of statusOutput.split('\n')) {
      const line = rawLine.trim();
      if (!line) continue;
      const statusPath = line.replace(/^[MADRCU?! ]+/, '').trim();
      const path = statusPath.includes('->')
        ? statusPath.split('->')[1].trim()
        : statusPath;
      if (!path) continue;
      collect(path);
    }
  } catch {}

  return slugs;
}

function shouldShortCircuitForChanged(changedOnly: boolean, changedSlugs: Set<string> | null) {
  if (!changedOnly || !changedSlugs) return false;
  if (changedSlugs.size > 0) return false;
  console.log('[validate-holiday-content] No changed event/content slugs found.');
  return true;
}

function currentChangedSlugs(changedOnly: boolean) {
  if (!changedOnly) return null;
  const changedSlugs = getChangedSlugs();
  if (shouldShortCircuitForChanged(changedOnly, changedSlugs)) {
    process.exit(0);
  }
  return changedSlugs;
}

function isValidIsoDate(value: string) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return null;
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function loadEventPackage(slug: string) {
  const filePath = join(EVENTS_SOURCE_DIR, slug, 'package.json');
  if (!existsSync(filePath)) return null;
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf8'));
    return parseEventPackage(slug, raw);
  } catch {
    return null;
  }
}

function loadEventJson(slug: string, filename: string) {
  const filePath = join(EVENTS_SOURCE_DIR, slug, filename);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function listPackageSlugs() {
  if (!existsSync(EVENTS_SOURCE_DIR)) return [];
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(EVENTS_SOURCE_DIR, entry.name, 'package.json')))
    .map((entry) => entry.name);
}

function isLivePublishStatus(publishStatus: string) {
  return LIVE_PUBLISH_STATUSES.has(String(publishStatus || '').trim());
}

function describeEventState(publishStatus: string): 'hidden' | 'live' {
  return isLivePublishStatus(publishStatus) ? 'live' : 'hidden';
}

function issueSeverity(code: string, publishStatus: string): Severity {
  if (
    code.startsWith('schema_invalid') ||
    code.startsWith('placeholder_text_detected') ||
    code.startsWith('related_slug_not_found') ||
    code.startsWith('canonical_path_invalid') ||
    code.startsWith('missing_required_section') ||
    code.startsWith('unknown_template_token') ||
    code.startsWith('technical_jargon_detected') ||
    code.startsWith('manifest_publish_status_invalid') ||
    code.startsWith('missing_event_package') ||
    code.startsWith('package_canonical_path_invalid') ||
    code.startsWith('package_alias_invalid') ||
    code.startsWith('alias_mapping_mismatch') ||
    code.startsWith('answer_summary_too_short') ||
    code.startsWith('about_sections_below_minimum') ||
    code.startsWith('seo_secondary_keywords_count_out_of_range') ||
    code.startsWith('seo_extended_keywords_count_out_of_range') ||
    code.startsWith('keyword_integration_below_minimum') ||
    code.startsWith('research_primary_queries_below_minimum') ||
    code.startsWith('research_coverage_matrix_below_minimum') ||
    code.startsWith('research_keyword_gaps_below_minimum') ||
    code.startsWith('research_unanswered_questions_below_minimum') ||
    code.startsWith('research_fact_sources_below_minimum')
  ) {
    return 'error';
  }
  if (
    code.startsWith('hardcoded_year_detected') ||
    code.startsWith('islamic_year_pair_missing') ||
    code.startsWith('faq_below_minimum') ||
    code.startsWith('direct_answer_missing') ||
    code.startsWith('missing_source_attribution') ||
    code.startsWith('missing_date_confidence_disclaimer') ||
    code.startsWith('content_similarity_high') ||
    code.startsWith('base_country_leakage')
  ) {
    return isLivePublishStatus(publishStatus) ? 'error' : 'warn';
  }
  return 'warn';
}

function pushIssue(list: Issue[], publishStatus: string, code: string, message: string) {
  list.push({
    code,
    severity: issueSeverity(code, publishStatus),
    message,
  });
}

function ensureJsonPath(path: string) {
  mkdirSync(dirname(path), { recursive: true });
}

function collectEventText(content: any) {
  const pieces: string[] = [];
  if (content.answerSummary) pieces.push(content.answerSummary);
  if (content.about?.paragraphs?.length) pieces.push(content.about.paragraphs.join(' '));
  if (content.aboutEvent) pieces.push(Object.values(content.aboutEvent).join(' '));
  const faq = pickFaqEntries(content);
  if (faq.length) pieces.push(faq.map((item: any) => `${item.question} ${item.answer}`).join(' '));
  return normalizeText(pieces.join(' '));
}

function collectTemplateTokens(content: any) {
  const tokens = new Set<string>();
  const stack = [content];
  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    if (typeof current === 'string') {
      TOKEN_RE.lastIndex = 0;
      let match = TOKEN_RE.exec(current);
      while (match) {
        tokens.add(match[1]);
        match = TOKEN_RE.exec(current);
      }
      continue;
    }
    if (Array.isArray(current)) {
      for (const item of current) stack.push(item);
      continue;
    }
    if (typeof current === 'object') {
      for (const value of Object.values(current)) stack.push(value);
    }
  }
  return tokens;
}

function collectBaseContentText(content: any) {
  const pieces: string[] = [];
  if (typeof content.answerSummary === 'string') pieces.push(content.answerSummary);
  if (typeof content.description === 'string') pieces.push(content.description);
  if (typeof content.details === 'string') pieces.push(content.details);
  if (typeof content.history === 'string') pieces.push(content.history);
  if (content.about?.paragraphs?.length) pieces.push(content.about.paragraphs.join(' '));
  if (content.aboutEvent) pieces.push(Object.values(content.aboutEvent).join(' '));
  const faq = pickFaqEntries(content);
  if (faq.length) pieces.push(faq.map((item: any) => `${item.question || ''} ${item.answer || ''}`).join(' '));
  return normalizeText(pieces.join(' '));
}

function isKnownToken(token: string, event: any, content: any) {
  if (ALLOWED_TEMPLATE_TOKENS.has(token)) return true;
  if (token.startsWith('event.')) {
    return token.split('.')[1] in event;
  }
  if (token in event) return true;
  if (token in content) return true;
  if (content?.seoMeta && token in content.seoMeta) return true;
  return false;
}

function hasIslamicYearPair(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return false;
  return (
    /\{\{\s*year\s*\}\}\s*-\s*\{\{\s*hijriYear\s*\}\}\s*هـ/.test(value) ||
    /\b20\d{2}\s*-\s*1\d{3}\s*هـ\b/.test(value)
  );
}

function validateIslamicYearPairFields(content: any) {
  return [
    ['richContent.seoTitle', content?.seoTitle],
    ['richContent.description', content?.description],
    ['richContent.seoMeta.titleTag', content?.seoMeta?.titleTag],
    ['richContent.seoMeta.metaDescription', content?.seoMeta?.metaDescription],
    ['richContent.seoMeta.h1', content?.seoMeta?.h1],
    ['richContent.seoMeta.ogTitle', content?.seoMeta?.ogTitle],
    ['richContent.seoMeta.ogDescription', content?.seoMeta?.ogDescription],
    ['richContent.schemaData.eventName', content?.schemaData?.eventName],
    ['richContent.schemaData.eventDescription', content?.schemaData?.eventDescription],
    ['richContent.schemaData.articleHeadline', content?.schemaData?.articleHeadline],
  ].filter(([, value]) => typeof value === 'string' && value.trim() && !hasIslamicYearPair(value));
}

function getRequiredSectionsForStatus(publishStatus: string) {
  return isLivePublishStatus(publishStatus)
    ? REQUIRED_LIVE_SECTIONS
    : REQUIRED_BASE_SECTIONS;
}

function main() {
  const { strict, liveOnly, statuses, jsonPath, changedOnly, slugs } = parseArgs();
  const manifest = loadManifest();
  const rawEventBySlug = new Map<string, any>(ALL_RAW_EVENTS.map((event: any) => [event.slug, event]));
  const packageSlugs = listPackageSlugs();
  const slugSet = new Set([...Array.from(rawEventBySlug.keys()), ...packageSlugs]);
  const slugFilter = slugs ? new Set(slugs) : null;
  const manifestBySlug = new Map<string, any>(
    (manifest?.events || []).map((entry: any) => [entry.slug, entry]),
  );

  const rows: Row[] = [];
  const textTokensBySlug = new Map<string, Set<string>>();
  const relatedMap = new Map<string, string[]>();
  const changedSlugs = currentChangedSlugs(changedOnly);
  const selectedSlugs = new Set<string>();

  const addSelectedSlug = (inputSlug: string) => {
    if (!inputSlug) return;
    const canonicalSlug = (GENERATED_ALIAS_TO_CANONICAL as Record<string, string>)?.[inputSlug] || inputSlug;
    selectedSlugs.add(canonicalSlug);
  };

  if (slugFilter) {
    for (const slug of Array.from(slugFilter)) addSelectedSlug(slug);
  } else if (changedSlugs) {
    for (const slug of Array.from(changedSlugs)) addSelectedSlug(slug);
  } else {
    for (const slug of Array.from(rawEventBySlug.keys())) selectedSlugs.add(slug);
  }

  for (const slug of Array.from(selectedSlugs).sort((a, b) => a.localeCompare(b))) {
    const manifestRow = manifestBySlug.get(slug);
    const eventPackage = loadEventPackage(slug);
    const eventResearch = loadEventJson(slug, 'research.json');
    const event = rawEventBySlug.get(slug) || eventPackage?.core || null;
    const publishStatus = manifestRow?.publishStatus || eventPackage?.publishStatus || 'unknown';
    if (liveOnly && !isLivePublishStatus(publishStatus)) continue;
    if (statuses && !statuses.includes(publishStatus)) continue;
    const packageDistribution = eventPackage
      ? describeHolidayDistribution(eventPackage)
      : null;
    const distributionInfo: {
      kind: DistributionKind;
      countryCodes: string[];
      autoExpandCountries: boolean;
      isShared: boolean;
      isCountrySpecific: boolean;
    } = packageDistribution
      ? {
          kind: packageDistribution.kind as DistributionKind,
          countryCodes: Array.isArray(packageDistribution.countryCodes) ? packageDistribution.countryCodes : [],
          autoExpandCountries: Boolean(packageDistribution.autoExpandCountries),
          isShared: Boolean(packageDistribution.isShared),
          isCountrySpecific: Boolean(packageDistribution.isCountrySpecific),
        }
      : {
          kind: ((manifestRow?.distribution || 'standalone') as DistributionKind),
          countryCodes: Array.isArray(manifestRow?.countryCodes) ? manifestRow.countryCodes : [],
          autoExpandCountries: false,
          isShared: manifestRow?.distribution === 'shared',
          isCountrySpecific: manifestRow?.distribution === 'country_specific',
        };
    const issues: Issue[] = [];

    if (!event) {
      pushIssue(
        issues,
        publishStatus,
        'missing_event_package',
        `No event core found for "${slug}" in generated or package sources.`,
      );
      rows.push({
        slug,
        publishStatus,
        state: describeEventState(publishStatus),
        distribution: distributionInfo.kind,
        countryCodes: distributionInfo.countryCodes,
        issues,
      });
      continue;
    }

    const raw = eventPackage?.richContent || getRichContent(event.slug);
    const { content: parsedContent, flags } = parseRichContent(event.slug, raw);
    const content: any = parsedContent;

    if (!eventPackage) {
      pushIssue(
        issues,
        publishStatus,
        'missing_event_package',
        'Missing or invalid canonical event package.',
      );
    } else {
      if (distributionInfo.isShared && eventPackage.countryScope !== 'all') {
        pushIssue(
          issues,
          publishStatus,
          'shared_country_scope_should_be_all',
          'Shared events should explicitly use countryScope="all" for future-safe country expansion.',
        );
      }

      if (
        distributionInfo.isShared &&
        (!Array.isArray(eventPackage.keywordTemplateSet?.country) || eventPackage.keywordTemplateSet.country.length === 0)
      ) {
        pushIssue(
          issues,
          publishStatus,
          'shared_country_keywords_missing',
          'Shared events should define keywordTemplateSet.country templates for country-level SEO generation.',
        );
      }

      const expectedCanonical = `/holidays/${event.slug}`;
      if ((eventPackage.canonicalPath || expectedCanonical) !== expectedCanonical) {
        pushIssue(
          issues,
          publishStatus,
          'package_canonical_path_invalid',
          `Package canonicalPath must be "${expectedCanonical}".`,
        );
      }

      const packageAliases = new Set<string>(eventPackage.aliasSlugs || []);
      for (const override of Object.values(eventPackage.countryOverrides || {})) {
        for (const aliasSlug of override.aliasSlugs || []) packageAliases.add(aliasSlug);
      }

      for (const aliasSlug of Array.from(packageAliases)) {
        if (!aliasSlug || aliasSlug === event.slug) {
          pushIssue(
            issues,
            publishStatus,
            `package_alias_invalid:${aliasSlug}`,
            'Package alias slug must be non-empty and different from canonical slug.',
          );
          continue;
        }
        if ((GENERATED_ALIAS_TO_CANONICAL as Record<string, string>)?.[aliasSlug] !== event.slug) {
          pushIssue(
            issues,
            publishStatus,
            `alias_mapping_mismatch:${aliasSlug}`,
            `Alias "${aliasSlug}" is not mapped to canonical "${event.slug}".`,
          );
        }
      }

      if (packageAliases.size > 0) {
        const baseText = collectBaseContentText(eventPackage.richContent || {});
        for (const countryName of Array.from(COUNTRY_NAME_SET)) {
          const marker = normalizeText(countryName);
          if (!marker) continue;
          if (hasBaseCountryLeak(baseText, marker)) {
            pushIssue(
              issues,
              publishStatus,
              `base_country_leakage:${countryName}`,
              `Country mention "${countryName}" found in base canonical content.`,
            );
          }
        }
      }
    }

    if (!flags.isValid) {
      pushIssue(issues, publishStatus, 'schema_invalid', 'Rich content does not match schema.');
    }
    if (manifestRow?.publishStatus && !VALID_PUBLISH_STATUSES.has(manifestRow.publishStatus)) {
      pushIssue(
        issues,
        publishStatus,
        'manifest_publish_status_invalid',
        `Unsupported manifest publishStatus "${manifestRow.publishStatus}".`,
      );
    }

    const blob = JSON.stringify(content);
    const placeholderMatch = blob.match(PLACEHOLDER_RE);
    if (placeholderMatch) {
      pushIssue(
        issues,
        publishStatus,
        `placeholder_text_detected:${String(placeholderMatch[0] || '').trim()}`,
        `Placeholder text is present: "${String(placeholderMatch[0] || '').trim()}".`,
      );
    }
    const technicalCorpus = collectStringValues(content).join('\n');
    for (const { label, pattern } of TECHNICAL_JARGON_PATTERNS) {
      if (!pattern.test(technicalCorpus)) continue;
      pushIssue(
        issues,
        publishStatus,
        `technical_jargon_detected:${label}`,
        `Technical wording "${label}" found in public-facing content.`,
      );
    }
    if (flags.hasHardcodedYear) {
      pushIssue(issues, publishStatus, 'hardcoded_year_detected', 'Hardcoded year detected in content.');
    }
    for (const token of Array.from(collectTemplateTokens(content))) {
      if (!isKnownToken(token, event, content)) {
        pushIssue(
          issues,
          publishStatus,
          `unknown_template_token:${token}`,
          `Unknown template token "{{${token}}}" in content.`,
        );
      }
    }

    if (event.category === 'islamic') {
      for (const [field] of validateIslamicYearPairFields(content)) {
        pushIssue(
          issues,
          publishStatus,
          `islamic_year_pair_missing:${field}`,
          `Islamic events must include the paired Gregorian and Hijri year label "{{year}} - {{hijriYear}} هـ" in ${field}.`,
        );
      }
    }

    const required = getRequiredSectionsForStatus(publishStatus);
    for (const section of required) {
      const value =
        section === 'faq'
          ? pickFaqEntries(content)
          : (content as any)[section];
      if (!hasData(value)) {
        pushIssue(
          issues,
          publishStatus,
          `missing_required_section:${section}`,
          `Missing required section "${section}" for publishStatus "${publishStatus}".`,
        );
      }
    }

    const faq: Array<{ question?: string; answer?: string }> = pickFaqEntries(content) as Array<{
      question?: string;
      answer?: string;
    }>;
    const minFaq = MIN_FAQ_BY_CATEGORY[event.category] || 4;
    if (faq.length < minFaq) {
      pushIssue(
        issues,
        publishStatus,
        `faq_below_minimum:${faq.length}`,
        `FAQ count ${faq.length} is below category minimum ${minFaq}.`,
      );
    }

    if (content.seoMeta?.canonicalPath) {
      const expectedCanonical = `/holidays/${event.slug}`;
      if (content.seoMeta.canonicalPath !== expectedCanonical) {
        pushIssue(
          issues,
          publishStatus,
          'canonical_path_invalid',
          `Canonical path must be "${expectedCanonical}".`,
        );
      }
    }

    if (content.seoMeta) {
      const titleTag = String(content.seoMeta.titleTag || '').trim();
      const metaDescription = String(content.seoMeta.metaDescription || '').trim();
      const primaryKeyword = String(content.seoMeta.primaryKeyword || '').trim();
      const secondaryKeywords = Array.isArray(content.seoMeta.secondaryKeywords)
        ? content.seoMeta.secondaryKeywords.filter(Boolean)
        : [];
      const longTailKeywords = Array.isArray(content.seoMeta.longTailKeywords)
        ? content.seoMeta.longTailKeywords.filter(Boolean)
        : [];
      const datePublished = content.seoMeta.datePublished;
      const dateModified = content.seoMeta.dateModified;

      if (!titleTag) {
        pushIssue(issues, publishStatus, 'seo_title_missing', 'seoMeta.titleTag is required.');
      } else if (titleTag.length < 35 || titleTag.length > 70) {
        pushIssue(
          issues,
          publishStatus,
          `seo_title_length_out_of_range:${titleTag.length}`,
          'seoMeta.titleTag should usually stay between 35 and 70 characters.',
        );
      }

      if (!metaDescription) {
        pushIssue(issues, publishStatus, 'seo_meta_description_missing', 'seoMeta.metaDescription is required.');
      } else if (metaDescription.length < 110 || metaDescription.length > 170) {
        pushIssue(
          issues,
          publishStatus,
          `seo_meta_description_length_out_of_range:${metaDescription.length}`,
          'seoMeta.metaDescription should usually stay between 110 and 170 characters.',
        );
      }

      if (!primaryKeyword) {
        pushIssue(issues, publishStatus, 'seo_primary_keyword_missing', 'seoMeta.primaryKeyword is required.');
      }
      if (secondaryKeywords.length < 6 || secondaryKeywords.length > 14) {
        pushIssue(
          issues,
          publishStatus,
          `seo_secondary_keywords_count_out_of_range:${secondaryKeywords.length}`,
          'seoMeta.secondaryKeywords should usually contain 6 to 14 phrases with real Arabic variations.',
        );
      }
      if (longTailKeywords.length < 10 || longTailKeywords.length > 24) {
        pushIssue(
          issues,
          publishStatus,
          `seo_extended_keywords_count_out_of_range:${longTailKeywords.length}`,
          'seoMeta.longTailKeywords should usually contain 10 to 24 richer phrases that cover longer Arabic intent.',
        );
      }

      const integratedKeywordMatches = countPhraseMatchesInText(collectEventText(content), [
        primaryKeyword,
        ...secondaryKeywords,
        ...longTailKeywords,
      ]);
      if (integratedKeywordMatches < 5) {
        pushIssue(
          issues,
          publishStatus,
          `keyword_integration_below_minimum:${integratedKeywordMatches}`,
          'The strongest keyword phrases should appear naturally in the summary, sections, and FAQ instead of living only inside keyword arrays.',
        );
      }

      if (datePublished && !isValidIsoDate(String(datePublished))) {
        pushIssue(issues, publishStatus, 'seo_date_published_invalid', 'seoMeta.datePublished must be a valid ISO date.');
      }
      if (dateModified && !isValidIsoDate(String(dateModified))) {
        pushIssue(issues, publishStatus, 'seo_date_modified_invalid', 'seoMeta.dateModified must be a valid ISO date.');
      }
      if (!datePublished) {
        pushIssue(issues, publishStatus, 'seo_date_published_missing', 'seoMeta.datePublished is required.');
      }
      if (!dateModified) {
        pushIssue(issues, publishStatus, 'seo_date_modified_missing', 'seoMeta.dateModified is required.');
      }
    }

    const answerSummary = String(content.answerSummary || '').trim();
    if (answerSummary && answerSummary.length < 110) {
      pushIssue(
        issues,
        publishStatus,
        `answer_summary_too_short:${answerSummary.length}`,
        'answerSummary should usually be rich enough to answer the main query with more substance.',
      );
    }

    const aboutEntries = content.aboutEvent && typeof content.aboutEvent === 'object'
      ? Object.entries(content.aboutEvent)
      : [];
    if (aboutEntries.length > 0 && aboutEntries.length < 4) {
      pushIssue(
        issues,
        publishStatus,
        `about_sections_below_minimum:${aboutEntries.length}`,
        'aboutEvent should usually contain 4 strong sections with distinct angles.',
      );
    }
    for (const [heading, value] of aboutEntries) {
      const plain = String(value || '').trim();
      if (plain && plain.length < 140) {
        pushIssue(
          issues,
          publishStatus,
          `about_section_too_short:${heading}:${plain.length}`,
          `aboutEvent "${heading}" looks thin and should usually provide more unique detail.`,
        );
      }
    }

    const intentCards = Array.isArray(content.intentCards) ? content.intentCards.filter(Boolean) : [];
    if (intentCards.length > 0 && intentCards.length < 2) {
      pushIssue(
        issues,
        publishStatus,
        `intent_cards_below_minimum:${intentCards.length}`,
        'intentCards should usually contain at least 2 useful cards when authored.',
      );
    }

    const engagementContent = Array.isArray(content.engagementContent)
      ? content.engagementContent.filter((item: any) => item?.text)
      : [];
    if (engagementContent.length > 0 && engagementContent.length < 3) {
      pushIssue(
        issues,
        publishStatus,
        `engagement_content_below_minimum:${engagementContent.length}`,
        'engagementContent should usually contain at least 3 useful items when authored.',
      );
    }

    if (eventResearch && typeof eventResearch === 'object') {
      const primaryQueries = Array.isArray(eventResearch.primaryQueries)
        ? eventResearch.primaryQueries.filter(Boolean)
        : [];
      const coverageMatrix = Array.isArray(eventResearch.coverageMatrix)
        ? eventResearch.coverageMatrix.filter(Boolean)
        : [];
      const keywordGaps = Array.isArray(eventResearch.keywordGaps)
        ? eventResearch.keywordGaps.filter(Boolean)
        : [];
      const unansweredQuestions = Array.isArray(eventResearch.unansweredQuestions)
        ? eventResearch.unansweredQuestions.filter(Boolean)
        : [];
      const factSources = Array.isArray(eventResearch.factSources)
        ? eventResearch.factSources.filter((item: any) => item?.label && item?.url)
        : [];
      const competitors = Array.isArray(eventResearch.competitors)
        ? eventResearch.competitors.filter((item: any) => item?.site || item?.url)
        : [];

      if (primaryQueries.length < 10) {
        pushIssue(
          issues,
          publishStatus,
          `research_primary_queries_below_minimum:${primaryQueries.length}`,
          'research.json should usually contain at least 10 primaryQueries for a broader Arabic search map.',
        );
      }
      if (coverageMatrix.length < 8) {
        pushIssue(
          issues,
          publishStatus,
          `research_coverage_matrix_below_minimum:${coverageMatrix.length}`,
          'research.json should usually contain at least 8 coverageMatrix rows.',
        );
      }
      if (keywordGaps.length < 8) {
        pushIssue(
          issues,
          publishStatus,
          `research_keyword_gaps_below_minimum:${keywordGaps.length}`,
          'research.json should usually contain at least 8 keyword gaps or missed angles.',
        );
      }
      if (unansweredQuestions.length < 6) {
        pushIssue(
          issues,
          publishStatus,
          `research_unanswered_questions_below_minimum:${unansweredQuestions.length}`,
          'research.json should usually contain at least 6 unanswered questions.',
        );
      }
      if (factSources.length < 3) {
        pushIssue(
          issues,
          publishStatus,
          `research_fact_sources_below_minimum:${factSources.length}`,
          'research.json should usually contain at least 3 trustworthy fact sources for a real event.',
        );
      }
      if (competitors.length < 3) {
        pushIssue(
          issues,
          publishStatus,
          `research_competitors_below_minimum:${competitors.length}`,
          'research.json should usually contain at least 3 competitor/reference entries.',
        );
      }
    }

    const relatedSlugs = content.relatedSlugs || [];
    relatedMap.set(event.slug, relatedSlugs);
    if (relatedSlugs.length > 0 && (relatedSlugs.length < 4 || relatedSlugs.length > 6)) {
      pushIssue(
        issues,
        publishStatus,
        `related_slugs_count_out_of_range:${relatedSlugs.length}`,
        'relatedSlugs should contain 4 to 6 slugs.',
      );
    }
    for (const relatedSlug of relatedSlugs) {
      if (!slugSet.has(relatedSlug)) {
        pushIssue(
          issues,
          publishStatus,
          `related_slug_not_found:${relatedSlug}`,
          `related slug "${relatedSlug}" does not exist.`,
        );
      }
    }

    if (content.aboutEvent && typeof content.aboutEvent === 'object') {
      for (const [heading, value] of Object.entries(content.aboutEvent)) {
        const sentence = firstSentence(String(value || ''));
        if (sentence.length < 20) {
          pushIssue(
            issues,
            publishStatus,
            `direct_answer_missing:aboutEvent:${heading}`,
            `aboutEvent "${heading}" does not start with a strong direct-answer sentence.`,
          );
        }
      }
    }

    for (const faqItem of faq) {
      const answer = faqItem?.answer || '';
      const sentence = firstSentence(String(answer));
      if (sentence.length < 20) {
        pushIssue(
          issues,
          publishStatus,
          `direct_answer_missing:faq:${String(faqItem?.question || '').slice(0, 30)}`,
          'FAQ answer should start with a direct-answer sentence.',
        );
      }
    }

    if (event.type === 'hijri' || event.type === 'estimated') {
      const hasSource =
        (Array.isArray(content.sources) && content.sources.length > 0) ||
        Boolean(content.recurringYears?.sourceNote) ||
        SOURCE_TEXT_RE.test(blob);
      if (!hasSource) {
        pushIssue(
          issues,
          publishStatus,
          'missing_source_attribution',
          'Calculated-date events must include source attribution.',
        );
      }
      if (!DISCLAIMER_RE.test(blob)) {
        pushIssue(
          issues,
          publishStatus,
          'missing_date_confidence_disclaimer',
          'Calculated-date events must include date confidence/disclaimer text.',
        );
      }
    }

    const text = collectEventText(content);
    textTokensBySlug.set(event.slug, new Set(text.split(' ').filter((token) => token.length >= 3)));

    rows.push({
      slug: event.slug,
      publishStatus,
      state: describeEventState(publishStatus),
      distribution: distributionInfo.kind,
      countryCodes: distributionInfo.countryCodes,
      issues,
    });
  }

  // Reciprocal link health.
  for (const row of rows) {
    const related = relatedMap.get(row.slug) || [];
    for (const target of related) {
      const targetRelated = relatedMap.get(target) || [];
      if (targetRelated.length > 0 && !targetRelated.includes(row.slug)) {
        pushIssue(
          row.issues,
          row.publishStatus,
          `related_not_reciprocal:${target}`,
          `Related link "${target}" does not reciprocate link back to "${row.slug}".`,
        );
      }
    }
  }

  // Duplicate-content similarity audit.
  const similarityThreshold = 0.82;
  for (let i = 0; i < rows.length; i += 1) {
    for (let j = i + 1; j < rows.length; j += 1) {
      const a = rows[i];
      const b = rows[j];
      const score = jaccard(
        textTokensBySlug.get(a.slug) || new Set<string>(),
        textTokensBySlug.get(b.slug) || new Set<string>(),
      );
      if (score >= similarityThreshold) {
        pushIssue(
          a.issues,
          a.publishStatus,
          `content_similarity_high:${b.slug}:${score.toFixed(2)}`,
          `Content similarity with "${b.slug}" is high (${score.toFixed(2)}).`,
        );
        pushIssue(
          b.issues,
          b.publishStatus,
          `content_similarity_high:${a.slug}:${score.toFixed(2)}`,
          `Content similarity with "${a.slug}" is high (${score.toFixed(2)}).`,
        );
      }
    }
  }

  const byCode: Record<string, number> = {};
  const severityCount = { error: 0, warn: 0 };
  const failingRows = rows.filter((row) => row.issues.length > 0);
  for (const row of failingRows) {
    for (const issue of row.issues) {
      severityCount[issue.severity] += 1;
      byCode[issue.code] = (byCode[issue.code] || 0) + 1;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    strict,
    changedOnly,
    liveOnly,
    publishStatuses: statuses,
    totals: {
      checked: rows.length,
      withIssues: failingRows.length,
      errors: severityCount.error,
      warnings: severityCount.warn,
    },
    byCode,
    events: failingRows,
  };

  if (jsonPath) {
    ensureJsonPath(jsonPath);
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  if (failingRows.length === 0) {
    console.log(`[validate-holiday-content] OK — ${rows.length} events validated`);
  } else {
    const label = severityCount.error > 0 && strict ? 'Failed checks' : 'Warnings';
    console.error(`\n[validate-holiday-content] ${label}:`);
    for (const row of failingRows) {
      const summary = row.issues.map((issue) => issue.code).join(', ');
      console.error(`- ${row.slug} [${row.state} | ${row.distribution}]: ${summary}`);
    }
  }

  if (jsonPath) {
    console.log(`[validate-holiday-content] JSON report: ${jsonPath}`);
  }

  if (strict && severityCount.error > 0) {
    process.exit(1);
  }
}

main();
