import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';

import { ALL_RAW_EVENTS } from '../src/lib/events/index.js';
import { GENERATED_ALIAS_TO_CANONICAL } from '../src/lib/events/generated-aliases.js';
import { getAllCountryNamesAr } from '../src/lib/events/country-dictionary.js';
import { parseEventPackage } from '../src/lib/events/package-schema.js';
import { getRichContent } from '../src/lib/event-content/index.js';
import { parseRichContent } from '../src/lib/event-content/schema.js';
import { pickFaqEntries } from '../src/lib/holidays/faq-normalizer.js';

type Tier = 'tier1' | 'tier2' | 'tier3';
type Severity = 'error' | 'warn';

type Issue = {
  code: string;
  severity: Severity;
  message: string;
};

type Row = {
  slug: string;
  tier: Tier;
  publishStatus: string;
  issues: Issue[];
};

const ROOT = process.cwd();
const MANIFEST_PATH = join(ROOT, 'src/data/holidays/generated/manifest.json');
const SHARDED_CONTENT_DIR = join(ROOT, 'src/lib/event-content/items');
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');
const DEFAULT_JSON_REPORT_PATH = join(ROOT, 'reports/holiday-content-validation.json');

const PLACEHOLDER_RE = /(^|[\s(])(?:قريباً|سيتم الإضافة|TBD|TODO|placeholder)(?=$|[\s).،])/i;
const DISCLAIMER_RE = /(قد يختلف|تقريبي|قد يتغير|رؤية الهلال|إعلان رسمي|تقديري)/i;
const SOURCE_TEXT_RE = /(المصدر|وفق|مصدر)/i;
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

const REQUIRED_BY_TIER: Record<Tier, string[]> = {
  tier1: [
    'answerSummary',
    'quickFacts',
    'aboutEvent',
    'faq',
    'seoMeta',
    'schemaData',
    'relatedSlugs',
  ],
  tier2: ['quickFacts', 'faq', 'seoMeta', 'relatedSlugs'],
  tier3: ['quickFacts', 'faq'],
};

const MIN_FAQ_BY_CATEGORY: Record<string, number> = {
  islamic: 6,
  national: 6,
  school: 6,
  holidays: 6,
  astronomy: 6,
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
    tiers: Tier[] | null;
    jsonPath: string | null;
    changedOnly: boolean;
    slugs: string[] | null;
  } = {
    strict: false,
    tiers: null,
    jsonPath: null,
    changedOnly: false,
    slugs: null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--strict') out.strict = true;
    if (arg.startsWith('--tier=')) {
      const value = arg.split('=')[1] || '';
      out.tiers = value.split(',').filter(Boolean) as Tier[];
    }
    if (arg === '--tier' && args[i + 1] && !args[i + 1].startsWith('--')) {
      out.tiers = args[i + 1].split(',').filter(Boolean) as Tier[];
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
      line.match(/^src\/lib\/events\/items\/(.+)\.json$/) ||
      line.match(/^src\/lib\/event-content\/items\/(.+)\.json$/) ||
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

function loadShardContent(slug: string) {
  const filePath = join(SHARDED_CONTENT_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
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

function listPackageSlugs() {
  if (!existsSync(EVENTS_SOURCE_DIR)) return [];
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(EVENTS_SOURCE_DIR, entry.name, 'package.json')))
    .map((entry) => entry.name);
}

function issueSeverity(code: string, tier: Tier): Severity {
  if (
    code.startsWith('schema_invalid') ||
    code.startsWith('placeholder_text_detected') ||
    code.startsWith('related_slug_not_found') ||
    code.startsWith('canonical_path_invalid') ||
    code.startsWith('missing_required_section') ||
    code.startsWith('unknown_template_token') ||
    code.startsWith('manifest_publish_status_invalid') ||
    code.startsWith('missing_event_package') ||
    code.startsWith('package_canonical_path_invalid') ||
    code.startsWith('package_alias_invalid') ||
    code.startsWith('alias_mapping_mismatch')
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
    return tier === 'tier1' ? 'error' : 'warn';
  }
  return 'warn';
}

function pushIssue(list: Issue[], tier: Tier, code: string, message: string) {
  list.push({
    code,
    severity: issueSeverity(code, tier),
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

function main() {
  const { strict, tiers, jsonPath, changedOnly, slugs } = parseArgs();
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
    const event = rawEventBySlug.get(slug) || eventPackage?.core || null;
    const tier = (eventPackage?.tier || manifestRow?.tier || 'tier3') as Tier;
    if (tiers && !tiers.includes(tier)) continue;
    const issues: Issue[] = [];

    if (!event) {
      pushIssue(
        issues,
        tier,
        'missing_event_package',
        `No event core found for "${slug}" in generated or package sources.`,
      );
      rows.push({
        slug,
        tier,
        publishStatus: manifestRow?.publishStatus || eventPackage?.publishStatus || 'unknown',
        issues,
      });
      continue;
    }

    const raw = loadShardContent(event.slug) || eventPackage?.richContent || getRichContent(event.slug);
    const { content: parsedContent, flags } = parseRichContent(event.slug, raw);
    const content: any = parsedContent;

    if (!eventPackage) {
      pushIssue(
        issues,
        tier,
        'missing_event_package',
        'Missing or invalid canonical event package.',
      );
    } else {
      const expectedCanonical = `/holidays/${event.slug}`;
      if ((eventPackage.canonicalPath || expectedCanonical) !== expectedCanonical) {
        pushIssue(
          issues,
          tier,
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
            tier,
            `package_alias_invalid:${aliasSlug}`,
            'Package alias slug must be non-empty and different from canonical slug.',
          );
          continue;
        }
        if ((GENERATED_ALIAS_TO_CANONICAL as Record<string, string>)?.[aliasSlug] !== event.slug) {
          pushIssue(
            issues,
            tier,
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
              tier,
              `base_country_leakage:${countryName}`,
              `Country mention "${countryName}" found in base canonical content.`,
            );
          }
        }
      }
    }

    if (!flags.isValid) {
      pushIssue(issues, tier, 'schema_invalid', 'Rich content does not match schema.');
    }
    if (manifestRow?.publishStatus && !VALID_PUBLISH_STATUSES.has(manifestRow.publishStatus)) {
      pushIssue(
        issues,
        tier,
        'manifest_publish_status_invalid',
        `Unsupported manifest publishStatus "${manifestRow.publishStatus}".`,
      );
    }

    const blob = JSON.stringify(content);
    if (PLACEHOLDER_RE.test(blob)) {
      pushIssue(issues, tier, 'placeholder_text_detected', 'Placeholder text is present.');
    }
    if (flags.hasHardcodedYear) {
      pushIssue(issues, tier, 'hardcoded_year_detected', 'Hardcoded year detected in content.');
    }
    for (const token of Array.from(collectTemplateTokens(content))) {
      if (!isKnownToken(token, event, content)) {
        pushIssue(
          issues,
          tier,
          `unknown_template_token:${token}`,
          `Unknown template token "{{${token}}}" in content.`,
        );
      }
    }

    if (event.category === 'islamic') {
      for (const [field] of validateIslamicYearPairFields(content)) {
        pushIssue(
          issues,
          tier,
          `islamic_year_pair_missing:${field}`,
          `Islamic events must include the paired Gregorian and Hijri year label "{{year}} - {{hijriYear}} هـ" in ${field}.`,
        );
      }
    }

    const required = REQUIRED_BY_TIER[tier] || REQUIRED_BY_TIER.tier3;
    for (const section of required) {
      const value =
        section === 'faq'
          ? pickFaqEntries(content)
          : (content as any)[section];
      if (!hasData(value)) {
        pushIssue(
          issues,
          tier,
          `missing_required_section:${section}`,
          `Missing required section "${section}" for ${tier}.`,
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
        tier,
        `faq_below_minimum:${faq.length}`,
        `FAQ count ${faq.length} is below category minimum ${minFaq}.`,
      );
    }

    if (content.seoMeta?.canonicalPath) {
      const expectedCanonical = `/holidays/${event.slug}`;
      if (content.seoMeta.canonicalPath !== expectedCanonical) {
        pushIssue(
          issues,
          tier,
          'canonical_path_invalid',
          `Canonical path must be "${expectedCanonical}".`,
        );
      }
    }

    if (content.seoMeta) {
      const titleTag = String(content.seoMeta.titleTag || '').trim();
      const metaDescription = String(content.seoMeta.metaDescription || '').trim();
      const primaryKeyword = String(content.seoMeta.primaryKeyword || '').trim();
      const datePublished = content.seoMeta.datePublished;
      const dateModified = content.seoMeta.dateModified;

      if (!titleTag) {
        pushIssue(issues, tier, 'seo_title_missing', 'seoMeta.titleTag is required.');
      } else if (titleTag.length < 35 || titleTag.length > 70) {
        pushIssue(
          issues,
          tier,
          `seo_title_length_out_of_range:${titleTag.length}`,
          'seoMeta.titleTag should usually stay between 35 and 70 characters.',
        );
      }

      if (!metaDescription) {
        pushIssue(issues, tier, 'seo_meta_description_missing', 'seoMeta.metaDescription is required.');
      } else if (metaDescription.length < 110 || metaDescription.length > 170) {
        pushIssue(
          issues,
          tier,
          `seo_meta_description_length_out_of_range:${metaDescription.length}`,
          'seoMeta.metaDescription should usually stay between 110 and 170 characters.',
        );
      }

      if (!primaryKeyword) {
        pushIssue(issues, tier, 'seo_primary_keyword_missing', 'seoMeta.primaryKeyword is required.');
      }

      if (datePublished && !isValidIsoDate(String(datePublished))) {
        pushIssue(issues, tier, 'seo_date_published_invalid', 'seoMeta.datePublished must be a valid ISO date.');
      }
      if (dateModified && !isValidIsoDate(String(dateModified))) {
        pushIssue(issues, tier, 'seo_date_modified_invalid', 'seoMeta.dateModified must be a valid ISO date.');
      }
      if (!datePublished) {
        pushIssue(issues, tier, 'seo_date_published_missing', 'seoMeta.datePublished is required.');
      }
      if (!dateModified) {
        pushIssue(issues, tier, 'seo_date_modified_missing', 'seoMeta.dateModified is required.');
      }
    }

    const relatedSlugs = content.relatedSlugs || [];
    relatedMap.set(event.slug, relatedSlugs);
    if (relatedSlugs.length > 0 && (relatedSlugs.length < 4 || relatedSlugs.length > 6)) {
      pushIssue(
        issues,
        tier,
        `related_slugs_count_out_of_range:${relatedSlugs.length}`,
        'relatedSlugs should contain 4 to 6 slugs.',
      );
    }
    for (const relatedSlug of relatedSlugs) {
      if (!slugSet.has(relatedSlug)) {
        pushIssue(
          issues,
          tier,
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
            tier,
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
          tier,
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
          tier,
          'missing_source_attribution',
          'Calculated-date events must include source attribution.',
        );
      }
      if (!DISCLAIMER_RE.test(blob)) {
        pushIssue(
          issues,
          tier,
          'missing_date_confidence_disclaimer',
          'Calculated-date events must include date confidence/disclaimer text.',
        );
      }
    }

    const text = collectEventText(content);
    textTokensBySlug.set(event.slug, new Set(text.split(' ').filter((token) => token.length >= 3)));

    rows.push({
      slug: event.slug,
      tier,
      publishStatus: manifestRow?.publishStatus || eventPackage?.publishStatus || 'unknown',
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
          row.tier,
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
          a.tier,
          `content_similarity_high:${b.slug}:${score.toFixed(2)}`,
          `Content similarity with "${b.slug}" is high (${score.toFixed(2)}).`,
        );
        pushIssue(
          b.issues,
          b.tier,
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
    tiers: tiers || ['tier1', 'tier2', 'tier3'],
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
    const label = strict ? 'Failed checks' : 'Warnings';
    console.error(`\n[validate-holiday-content] ${label}:`);
    for (const row of failingRows) {
      const summary = row.issues.map((issue) => issue.code).join(', ');
      console.error(`- ${row.slug} (${row.tier}): ${summary}`);
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
