/**
 * serp-research.ts
 * SERP data via Serper.dev (free: 2500 searches/month, no credit card).
 * Sign up at https://serper.dev — add your key to .env.local as SERPER_API_KEY.
 *
 * Falls back to Puppeteer for People Also Ask when no API key is set.
 */

import { launch } from 'puppeteer';

export interface CompetitorResult {
  url: string;
  title: string;
  snippet: string;
  position: number;
}

export interface SerpResult {
  paaQuestions: string[];
  relatedSearches: string[];
  competitors: CompetitorResult[];
  source: 'serper' | 'puppeteer' | 'none';
}

// ── Serper.dev ──────────────────────────────────────────────────────────────

async function querySerper(
  query: string,
  country: string,
  lang = 'ar',
): Promise<SerpResult | null> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, gl: country, hl: lang, num: 10 }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      console.error(`Serper API error: ${res.status}`);
      return null;
    }

    const data = await res.json();

    const paaQuestions = (data.peopleAlsoAsk || []).map(
      (p: { question: string }) => p.question,
    );

    const relatedSearches = (data.relatedSearches || []).map(
      (r: { query: string }) => r.query,
    );

    const competitors = (data.organic || []).slice(0, 8).map(
      (r: { link: string; title: string; snippet: string }, i: number) => ({
        url: r.link,
        title: r.title,
        snippet: r.snippet,
        position: i + 1,
      }),
    );

    // PAA is often empty for Arabic on Serper — do a parallel English query for PAA
    let enPaaQuestions: string[] = [];
    if (paaQuestions.length === 0) {
      try {
        const enRes = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: query, gl: country, hl: 'en', num: 10 }),
          signal: AbortSignal.timeout(10000),
        });
        if (enRes.ok) {
          const enData = await enRes.json();
          enPaaQuestions = (enData.peopleAlsoAsk || []).map(
            (p: { question: string }) => p.question,
          );
          // Also pull related searches if Arabic didn't have any
          if (relatedSearches.length === 0) {
            relatedSearches.push(
              ...(enData.relatedSearches || []).map((r: { query: string }) => r.query),
            );
          }
        }
      } catch {
        // ignore — English PAA is supplementary
      }
    }

    const allPaaQuestions = [...paaQuestions, ...enPaaQuestions];

    return { paaQuestions: allPaaQuestions, relatedSearches, competitors, source: 'serper' };
  } catch (err) {
    console.error('Serper fetch failed:', (err as Error).message);
    return null;
  }
}

// ── Puppeteer fallback (PAA only) ───────────────────────────────────────────

async function queryPuppeteerPAA(query: string): Promise<SerpResult> {
  let browser;
  try {
    browser = await launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ar'],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ar' });

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=ar&num=10`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);

    // Extract People Also Ask
    const paaQuestions = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('[data-q]'));
      return spans.map((el) => el.getAttribute('data-q') || el.textContent?.trim() || '').filter(Boolean);
    });

    // Extract organic results
    const competitors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div.g')).slice(0, 5).map((el, i) => {
        const titleEl = el.querySelector('h3');
        const linkEl = el.querySelector('a[href]');
        const snippetEl = el.querySelector('.VwiC3b, .s3v9rd');
        return {
          url: (linkEl as HTMLAnchorElement)?.href || '',
          title: titleEl?.textContent?.trim() || '',
          snippet: snippetEl?.textContent?.trim() || '',
          position: i + 1,
        };
      }).filter((r) => r.url && r.title);
    });

    // Extract related searches
    const relatedSearches = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.Q71vJc, .k8XOCe')).map((el) =>
        el.textContent?.trim() || '',
      ).filter(Boolean);
    });

    return { paaQuestions, relatedSearches, competitors, source: 'puppeteer' };
  } catch (err) {
    console.error('Puppeteer PAA failed:', (err as Error).message);
    return { paaQuestions: [], relatedSearches: [], competitors: [], source: 'none' };
  } finally {
    await browser?.close();
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Get SERP data for a query.
 * Uses Serper.dev if SERPER_API_KEY is in env, otherwise falls back to Puppeteer.
 */
export async function getSerpData(query: string, country = 'dz'): Promise<SerpResult> {
  // Try Serper first
  const serperResult = await querySerper(query, country);
  if (serperResult) return serperResult;

  // Fall back to Puppeteer
  console.log('  (no SERPER_API_KEY — using Puppeteer for PAA)');
  return queryPuppeteerPAA(query);
}
