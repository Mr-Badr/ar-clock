#!/usr/bin/env node
/**
 * topic-research.ts — Main research orchestrator for miqatona.com
 *
 * Usage:
 *   npm run research:topic -- --seed "نتيجة الباك الجزائر" --countries dz,ma
 *   npm run research:topic -- --seed "عيد الأضحى" --countries dz,ma,tn,sa,eg
 *   npm run research:topic -- --seed "موعد الراتب السعودي" --countries sa
 *
 * Output: scripts/research/output/<slug>-research-brief.json
 *
 * Free tools used (no credit card required):
 *   1. Google Autosuggest — real user queries by country, no auth
 *   2. DuckDuckGo Suggest — secondary source, no auth
 *   3. Serper.dev — SERP + PAA (set SERPER_API_KEY in .env.local for 2500 free/month)
 *   4. Jina AI Reader (r.jina.ai) — competitor page content, no auth
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAllSuggestions, type SuggestionResult } from './keyword-suggest.js';
import { getSerpData } from './serp-research.js';
import { readCompetitorPages } from './competitor-reader.js';

// ── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const idx = args.findIndex((a) => a === flag || a.startsWith(`${flag}=`));
    if (idx === -1) return undefined;
    if (args[idx].includes('=')) return args[idx].split('=').slice(1).join('=');
    return args[idx + 1];
  };

  const seed = get('--seed');
  const countries = get('--countries') || 'dz,ma,tn';
  const outputDir = get('--output-dir') || 'scripts/research/output';
  const skipCompetitors = args.includes('--skip-competitors');

  if (!seed) {
    console.error('Usage: npm run research:topic -- --seed "نتيجة الباك" --countries dz,ma');
    process.exit(1);
  }

  return { seed, countries: countries.split(',').map((c) => c.trim()), outputDir, skipCompetitors };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function groupSuggestionsByPattern(suggestions: SuggestionResult[]) {
  const questions = suggestions.filter((s) =>
    /^(متى|كيف|هل|كم|ما|لماذا|أين|من)/.test(s.query),
  );
  const intent = suggestions.filter((s) =>
    /^(موعد|رابط|طريقة|نتيجة|تاريخ|إجازة|العد|كم باقي)/.test(s.query),
  );
  const yearBased = suggestions.filter((s) => /202[0-9]/.test(s.query));
  const other = suggestions.filter(
    (s) => !questions.includes(s) && !intent.includes(s) && !yearBased.includes(s),
  );

  return { questions, intent, yearBased, other };
}

function printSection(title: string, items: string[]) {
  if (!items.length) return;
  console.log(`\n  ${title}:`);
  items.slice(0, 8).forEach((item) => console.log(`    • ${item}`));
  if (items.length > 8) console.log(`    … and ${items.length - 8} more`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { seed, countries, outputDir, skipCompetitors } = parseArgs();

  console.log(`\n🔍 Research: "${seed}"`);
  console.log(`   Countries: ${countries.join(', ')}`);
  if (process.env.SERPER_API_KEY) {
    console.log('   SERP: Serper.dev (API key detected)');
  } else {
    console.log('   SERP: Puppeteer fallback (add SERPER_API_KEY to .env.local for better results)');
  }
  console.log('');

  // Step 1: Keyword suggestions ─────────────────────────────────────────────
  console.log('Step 1/3: Fetching keyword suggestions from Google + DuckDuckGo...');
  const suggestions = await getAllSuggestions(seed, countries, { verbose: true });
  console.log(`  Found ${suggestions.length} unique suggestions`);

  const grouped = groupSuggestionsByPattern(suggestions);
  printSection('Question queries', grouped.questions.map((s) => s.query));
  printSection('Intent queries', grouped.intent.map((s) => s.query));
  printSection('Year-based', grouped.yearBased.map((s) => s.query));

  // Step 2: SERP data ────────────────────────────────────────────────────────
  console.log('\nStep 2/3: Fetching SERP data...');
  const serpData = await getSerpData(seed, countries[0]);
  console.log(`  Source: ${serpData.source}`);
  console.log(`  PAA questions: ${serpData.paaQuestions.length}`);
  console.log(`  Related searches: ${serpData.relatedSearches.length}`);
  console.log(`  Competitor URLs: ${serpData.competitors.length}`);

  if (serpData.paaQuestions.length) {
    printSection('People Also Ask', serpData.paaQuestions);
  }
  if (serpData.relatedSearches.length) {
    printSection('Related searches', serpData.relatedSearches);
  }

  // Step 3: Competitor reading ───────────────────────────────────────────────
  let competitorContent: Awaited<ReturnType<typeof readCompetitorPages>> = [];
  if (!skipCompetitors && serpData.competitors.length > 0) {
    console.log('\nStep 3/3: Reading competitor pages via Jina AI...');
    const competitorUrls = serpData.competitors
      .map((c) => c.url)
      .filter((url) => !url.includes('google.com') && !url.includes('youtube.com'));
    competitorContent = await readCompetitorPages(competitorUrls, 4);
    const successful = competitorContent.filter((c) => c.success);
    console.log(`  Read ${successful.length}/${competitorUrls.length} pages successfully`);
    successful.forEach((c) => {
      console.log(`  ✓ ${c.url.slice(0, 60)} — ${c.headings.length} headings, ${c.wordCount} words`);
    });
  } else {
    console.log('\nStep 3/3: Skipped competitor reading (--skip-competitors or no SERP results)');
  }

  // Compile output ──────────────────────────────────────────────────────────

  // All unique questions from all sources
  const allQuestions = [
    ...new Set([
      ...serpData.paaQuestions,
      ...competitorContent.flatMap((c) => c.questions),
      ...grouped.questions.map((s) => s.query),
    ]),
  ];

  // Primary keywords: deduplicated, filtered, limited
  const primaryQueries = [
    ...new Set([
      seed,
      ...grouped.yearBased.map((s) => s.query),
      ...grouped.intent.map((s) => s.query),
      ...grouped.questions.map((s) => s.query),
      ...serpData.relatedSearches,
      ...grouped.other.map((s) => s.query),
    ]),
  ].slice(0, 15);

  // Key facts from competitors
  const keyFacts = [
    ...new Set(competitorContent.flatMap((c) => c.keyFacts)),
  ].slice(0, 20);

  const brief = {
    slug: slugify(seed),
    seed,
    capturedAt: new Date().toISOString(),
    countries,
    serpSource: serpData.source,

    // Direct paste-able into research.json
    primaryQueries,
    paaSuggestions: serpData.paaQuestions,
    relatedSearches: serpData.relatedSearches,

    // Suggested FAQ questions for qa.json
    suggestedFaqQuestions: allQuestions.slice(0, 12),

    // Keyword groups for analysis
    keywordGroups: {
      questions: grouped.questions.map((s) => s.query),
      intent: grouped.intent.map((s) => s.query),
      yearBased: grouped.yearBased.map((s) => s.query),
      other: grouped.other.map((s) => s.query),
    },

    // All raw suggestions
    allSuggestions: suggestions.map((s) => ({
      query: s.query,
      source: s.source,
    })),

    // Competitor intelligence
    competitors: serpData.competitors.map((c) => {
      const content = competitorContent.find((cc) => cc.url === c.url);
      return {
        url: c.url,
        title: c.title,
        snippet: c.snippet,
        position: c.position,
        headings: content?.headings || [],
        questions: content?.questions || [],
        wordCount: content?.wordCount || 0,
        readSuccess: content?.success || false,
      };
    }),

    // Key facts extracted from competitor pages
    keyFactsFromCompetitors: keyFacts,

    // Guidance for filling research.json
    _notes: {
      primaryKeyword: primaryQueries[0] || seed,
      secondaryKeyword: primaryQueries[1] || '',
      howToUse: [
        'Copy primaryQueries into research.json primaryQueries (pick top 12)',
        'Copy suggestedFaqQuestions into qa.json as FAQ question seeds',
        'Use keywordGroups.questions for answerSummary coverage check',
        'Competitor headings show what topics users expect — cover them all',
        'keyFactsFromCompetitors = facts users already get elsewhere — beat them',
      ],
    },
  };

  // Write output ─────────────────────────────────────────────────────────────
  const root = join(process.cwd(), outputDir);
  if (!existsSync(root)) mkdirSync(root, { recursive: true });

  const filename = `${brief.slug}-brief.json`;
  const outputPath = join(root, filename);
  writeFileSync(outputPath, JSON.stringify(brief, null, 2), 'utf-8');

  console.log(`\n✓ Research brief saved to: ${outputDir}/${filename}`);
  console.log(`\n  Quick summary:`);
  console.log(`    • ${primaryQueries.length} primary queries found`);
  console.log(`    • ${allQuestions.length} FAQ question suggestions`);
  console.log(`    • ${serpData.competitors.length} competitor URLs`);
  console.log(`    • ${competitorContent.filter((c) => c.success).length} competitor pages read`);
  console.log(`    • ${keyFacts.length} key facts extracted`);
  console.log(`\n  Next steps:`);
  console.log(`    1. Review the brief in ${outputDir}/${filename}`);
  console.log(`    2. Copy top queries into src/data/holidays/events/<slug>/research.json`);
  console.log(`    3. Use suggestedFaqQuestions to write qa.json answers`);
  console.log(`    4. Use keyFactsFromCompetitors to verify content accuracy\n`);
}

main().catch((err) => {
  console.error('Research failed:', err);
  process.exit(1);
});
