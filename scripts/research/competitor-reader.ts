/**
 * competitor-reader.ts
 * Extracts clean content from competitor pages using Jina AI Reader.
 * Free, no auth required. Works on any public page.
 *
 * Falls back to Cheerio + fetch for simpler pages.
 */

import { load } from 'cheerio';

export interface CompetitorContent {
  url: string;
  title: string;
  headings: string[];
  questions: string[];
  keyFacts: string[];
  wordCount: number;
  success: boolean;
  source: 'jina' | 'cheerio' | 'failed';
}

function extractHeadingsFromMarkdown(markdown: string): string[] {
  const matches = [...markdown.matchAll(/^#{1,3}\s+(.+)$/gm)];
  return matches.map((m) => m[1].trim()).filter(Boolean);
}

function extractQuestionsFromText(texts: string[]): string[] {
  return texts.filter(
    (t) => t.includes('؟') || t.endsWith('?') || /^(كيف|متى|ما|هل|كم|لماذا|أين|من)/.test(t),
  );
}

function extractKeyFacts(markdown: string): string[] {
  const facts: string[] = [];
  // Bullet points
  const bullets = [...markdown.matchAll(/^[-*•]\s+(.{20,200})$/gm)].map((m) => m[1].trim());
  // Numbered lists
  const numbered = [...markdown.matchAll(/^\d+\.\s+(.{20,200})$/gm)].map((m) => m[1].trim());
  // Short declarative sentences (likely facts)
  const sentences = [...markdown.matchAll(/([^.!؟\n]{40,180}[.!؟])/g)].map((m) => m[1].trim());

  facts.push(...bullets.slice(0, 5), ...numbered.slice(0, 5));

  // Add sentences that contain numbers (likely dates/counts/percentages)
  const numericFacts = sentences.filter((s) => /\d/.test(s)).slice(0, 5);
  facts.push(...numericFacts);

  return [...new Set(facts)].slice(0, 15);
}

/** Use Jina AI Reader to get clean markdown of any page */
async function readWithJina(url: string): Promise<CompetitorContent> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)',
        'X-Return-Format': 'markdown',
      },
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) throw new Error(`Jina returned ${res.status}`);

    let markdown = '';
    let title = '';

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      markdown = data.content || data.markdown || data.text || '';
      title = data.title || '';
    } else {
      markdown = await res.text();
      // Extract title from first H1 in markdown
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      title = titleMatch ? titleMatch[1] : '';
    }

    const headings = extractHeadingsFromMarkdown(markdown);
    const questions = extractQuestionsFromText(headings);
    const keyFacts = extractKeyFacts(markdown);
    const wordCount = markdown.split(/\s+/).length;

    return { url, title, headings, questions, keyFacts, wordCount, success: true, source: 'jina' };
  } catch (err) {
    return readWithCheerio(url);
  }
}

/** Simple Cheerio fallback for plain HTML pages */
async function readWithCheerio(url: string): Promise<CompetitorContent> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)' },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = load(html);

    // Remove noise
    $('script, style, nav, footer, header, aside, .sidebar, .menu').remove();

    const title = $('h1').first().text().trim() || $('title').text().trim();
    const headings = $('h2, h3, h4')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((h) => h.length > 5 && h.length < 200);

    const questions = extractQuestionsFromText(headings);
    const bodyText = $('body').text();
    const wordCount = bodyText.split(/\s+/).length;

    return {
      url,
      title,
      headings,
      questions,
      keyFacts: [],
      wordCount,
      success: true,
      source: 'cheerio',
    };
  } catch (err) {
    return {
      url,
      title: '',
      headings: [],
      questions: [],
      keyFacts: [],
      wordCount: 0,
      success: false,
      source: 'failed',
    };
  }
}

/**
 * Read up to `limit` competitor pages concurrently.
 * Uses Jina AI with Cheerio fallback.
 */
export async function readCompetitorPages(
  urls: string[],
  limit = 5,
): Promise<CompetitorContent[]> {
  const targets = urls.slice(0, limit);

  // Read in small batches to avoid rate limits
  const results: CompetitorContent[] = [];
  for (let i = 0; i < targets.length; i += 2) {
    const batch = targets.slice(i, i + 2);
    const batchResults = await Promise.all(batch.map((url) => readWithJina(url)));
    results.push(...batchResults);
    if (i + 2 < targets.length) {
      await new Promise((r) => setTimeout(r, 1500)); // gentle pacing
    }
  }

  return results;
}
