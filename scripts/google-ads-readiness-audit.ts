import * as cheerio from 'cheerio';

type LandingPageKind = 'tool' | 'article' | 'hub' | 'event' | 'trust';

type LandingPageCheck = {
  path: string;
  intent: string;
  kind: LandingPageKind;
  requiredTerms: string[];
};

type AuditIssue = {
  path: string;
  severity: 'error' | 'warning';
  code: string;
  message: string;
  context: Record<string, unknown>;
};

type FetchResult = {
  status: number;
  finalUrl: string;
  contentType: string;
  body: string;
};

type AdSenseConnectionAudit = {
  publisherId: string | null;
  issues: AuditIssue[];
};

const DEFAULT_BASE_URL = 'https://miqatona.com';
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRY_ATTEMPTS = 2;
const MIN_BODY_CHARS = 12000;
const MIN_TEXT_WORDS = 500;
const TRUST_LINKS = ['/about', '/privacy', '/contact', '/terms', '/disclaimer'];
const GOOGLE_PARTNER_DATA_URL = 'https://policies.google.com/technologies/partner-sites';
const PRIVACY_DISCLOSURE_TERMS = [
  'ملفات تعريف الارتباط',
  'إشارات الويب',
  'عناوين IP',
  'معرّفات',
];
const ADSBOT_USER_AGENT = [
  'AdsBot-Google (+http://www.google.com/adsbot.html)',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
  '(KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
].join(' ');

const LANDING_PAGES: LandingPageCheck[] = [
  {
    path: '/mwaqit-al-salat/saudi-arabia/riyadh',
    intent: 'مواقيت الصلاة في الرياض',
    kind: 'tool',
    requiredTerms: ['الرياض', 'الصلاة', 'الفجر'],
  },
  {
    path: '/mwaqit-al-salat/egypt/cairo',
    intent: 'مواقيت الصلاة في القاهرة',
    kind: 'tool',
    requiredTerms: ['القاهرة', 'الصلاة', 'المغرب'],
  },
  {
    path: '/time-now/saudi-arabia/riyadh',
    intent: 'الوقت الآن في الرياض',
    kind: 'tool',
    requiredTerms: ['الرياض', 'الوقت', 'الساعة'],
  },
  {
    path: '/time-now/saudi-arabia',
    intent: 'الوقت الآن في السعودية',
    kind: 'tool',
    requiredTerms: ['السعودية', 'الوقت', 'الساعة'],
  },
  {
    path: '/date/today',
    intent: 'تاريخ اليوم هجري وميلادي',
    kind: 'tool',
    requiredTerms: ['تاريخ اليوم', 'هجري', 'ميلادي'],
  },
  {
    path: '/date/converter',
    intent: 'تحويل التاريخ',
    kind: 'tool',
    requiredTerms: ['تحويل', 'هجري', 'ميلادي'],
  },
  {
    path: '/calculators/monthly-installment',
    intent: 'حاسبة القسط الشهري',
    kind: 'tool',
    requiredTerms: ['القسط', 'الشهري', 'حاسبة'],
  },
  {
    path: '/calculators/vat',
    intent: 'حاسبة ضريبة القيمة المضافة',
    kind: 'tool',
    requiredTerms: ['ضريبة', 'القيمة المضافة', 'حاسبة'],
  },
  {
    path: '/calculators/personal-finance/emergency-fund',
    intent: 'حاسبة صندوق الطوارئ',
    kind: 'tool',
    requiredTerms: ['الطوارئ', 'الادخار', 'حاسبة'],
  },
  {
    path: '/holidays/ramadan',
    intent: 'كم باقي على رمضان',
    kind: 'event',
    requiredTerms: ['رمضان', 'كم باقي', 'هجري'],
  },
  {
    path: '/holidays/eid-al-fitr',
    intent: 'كم باقي على عيد الفطر',
    kind: 'event',
    requiredTerms: ['عيد الفطر', 'كم باقي', 'هجري'],
  },
  {
    path: '/about',
    intent: 'معلومات عن ميقاتنا',
    kind: 'trust',
    requiredTerms: ['ميقاتنا', 'المحتوى', 'الخدمة'],
  },
  {
    path: '/privacy',
    intent: 'سياسة الخصوصية',
    kind: 'trust',
    requiredTerms: ['الخصوصية', 'البيانات', 'الإعلانات'],
  },
];

function getArgumentValue(args: string[], key: string) {
  const prefix = `--${key}=`;
  const value = args.find((item) => item.startsWith(prefix));
  if (!value) return null;
  return value.slice(prefix.length).trim() || null;
}

function normalizeBaseUrl(value: string | null) {
  const rawValue = value || process.env.GOOGLE_ADS_AUDIT_BASE_URL || DEFAULT_BASE_URL;
  return rawValue.replace(/\/+$/, '');
}

function normalizeCanonicalBaseUrl(value: string | null, fetchBaseUrl: string) {
  const rawValue = value
    || process.env.GOOGLE_ADS_AUDIT_CANONICAL_BASE_URL
    || fetchBaseUrl;
  return rawValue.replace(/\/+$/, '');
}

function getRequestTimeoutMs(args: string[]) {
  const rawValue = getArgumentValue(args, 'timeout-ms') || process.env.GOOGLE_ADS_AUDIT_TIMEOUT_MS || '';
  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : DEFAULT_REQUEST_TIMEOUT_MS;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function countWords(value: string) {
  const normalized = normalizeText(value);
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

function parseRobotsContent(value: string) {
  return value
    .toLowerCase()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseGooglePublisherId(adsTxtBody: string) {
  const match = adsTxtBody.match(
    /^google\.com,\s*(pub-\d+),\s*DIRECT,\s*f08c47fec0942fa0\s*$/im,
  );

  return match?.[1] || null;
}

function isSameCanonicalPath(canonicalUrl: string, expectedUrl: string) {
  try {
    const canonical = new URL(canonicalUrl);
    const expected = new URL(expectedUrl);
    return canonical.origin === expected.origin && canonical.pathname === expected.pathname;
  } catch {
    return false;
  }
}

function pushIssue(
  issues: AuditIssue[],
  path: string,
  severity: AuditIssue['severity'],
  code: string,
  message: string,
  context: Record<string, unknown>,
) {
  issues.push({ path, severity, code, message, context });
}

async function fetchWithRetry(url: string, attempt: number, timeoutMs: number): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'ar,en;q=0.8',
        'User-Agent': ADSBOT_USER_AGENT,
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    const body = await response.text();

    return {
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get('content-type') || '',
      body,
    };
  } catch (error) {
    if (attempt < MAX_RETRY_ATTEMPTS) {
      console.warn('[google-ads-readiness] fetch-retry', JSON.stringify({
        url,
        attempt,
        error: error instanceof Error ? error.message : String(error),
      }));
      return fetchWithRetry(url, attempt + 1, timeoutMs);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function auditAdSenseConnection(
  baseUrl: string,
  timeoutMs: number,
): Promise<AdSenseConnectionAudit> {
  const issues: AuditIssue[] = [];

  try {
    const adsTxtResult = await fetchWithRetry(`${baseUrl}/ads.txt`, 1, timeoutMs);
    const publisherId = parseGooglePublisherId(adsTxtResult.body);

    if (!publisherId) {
      return { publisherId: null, issues };
    }

    const homeResult = await fetchWithRetry(`${baseUrl}/`, 1, timeoutMs);
    const $ = cheerio.load(homeResult.body);
    const expectedAccountId = `ca-${publisherId}`;
    const accountId = normalizeText(
      $('meta[name="google-adsense-account"]').attr('content') || '',
    );

    if (accountId !== expectedAccountId) {
      pushIssue(
        issues,
        '/',
        'error',
        'adsense-account-verification',
        'The AdSense account meta tag must match the publisher declared in ads.txt.',
        {
          adsTxtPublisherId: publisherId,
          expectedAccountId,
          accountId: accountId || null,
        },
      );
    }

    return { publisherId, issues };
  } catch (error) {
    pushIssue(
      issues,
      '/ads.txt',
      'error',
      'adsense-connection-fetch-failed',
      'The audit could not verify ads.txt and the AdSense account meta tag.',
      {
        timeoutMs,
        error: error instanceof Error ? error.message : String(error),
      },
    );
    return { publisherId: null, issues };
  }
}

function auditHtml(
  canonicalBaseUrl: string,
  page: LandingPageCheck,
  result: FetchResult,
) {
  const issues: AuditIssue[] = [];
  const expectedUrl = `${canonicalBaseUrl}${page.path}`;
  const $ = cheerio.load(result.body);
  const title = normalizeText($('title').first().text());
  const description = normalizeText($('meta[name="description"]').attr('content') || '');
  const robots = parseRobotsContent($('meta[name="robots"]').attr('content') || '');
  const googlebot = parseRobotsContent($('meta[name="googlebot"]').attr('content') || '');
  const adsbot = parseRobotsContent($('meta[name="AdsBot-Google"]').attr('content') || '');
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const h1Texts = $('h1').map((_, node) => normalizeText($(node).text())).get().filter(Boolean);
  const bodyText = normalizeText($('body').text());
  const wordCount = countWords(bodyText);
  const firstH1Index = result.body.indexOf('<h1');
  const firstAdIndex = result.body.indexOf('ad-slot');
  const firstMainIndex = result.body.indexOf('<main');
  const trustLinks = TRUST_LINKS.filter((href) => $(`a[href="${href}"], a[href^="${href}#"]`).length > 0);
  const missingTerms = page.requiredTerms.filter((term) => !bodyText.includes(term));
  const hasAdsenseMarkup = $('.adsbygoogle').length > 0 || result.body.includes('adsbygoogle');
  const hasUsefulAction = $('form, table, details, input, button, [data-testid], [aria-live]').length > 0;

  if (result.status !== 200) {
    pushIssue(issues, page.path, 'error', 'http-status', 'Landing page must return HTTP 200.', {
      status: result.status,
      finalUrl: result.finalUrl,
    });
  }

  if (!result.contentType.toLowerCase().includes('text/html')) {
    pushIssue(issues, page.path, 'error', 'content-type', 'Landing page must return HTML.', {
      contentType: result.contentType,
    });
  }

  if (result.body.length < MIN_BODY_CHARS) {
    pushIssue(issues, page.path, 'warning', 'short-html', 'HTML body is unusually small for an Ads landing page.', {
      chars: result.body.length,
      minimum: MIN_BODY_CHARS,
    });
  }

  if (h1Texts.length !== 1) {
    pushIssue(issues, page.path, 'error', 'h1-count', 'Landing page should render exactly one primary H1.', {
      h1Count: h1Texts.length,
      h1Texts,
    });
  }

  if (wordCount < MIN_TEXT_WORDS && page.kind !== 'trust') {
    pushIssue(issues, page.path, 'warning', 'thin-content', 'Indexable ad landing page has low visible word count.', {
      wordCount,
      minimum: MIN_TEXT_WORDS,
    });
  }

  if (!title || title.length < 20 || title.length > 80) {
    pushIssue(issues, page.path, 'warning', 'title-length', 'Title is missing or outside the preferred snippet range.', {
      title,
      length: title.length,
    });
  }

  if (!description || description.length < 90 || description.length > 175) {
    pushIssue(issues, page.path, 'warning', 'description-length', 'Description is missing or outside the preferred snippet range.', {
      description,
      length: description.length,
    });
  }

  if (!canonical || !isSameCanonicalPath(canonical, expectedUrl)) {
    pushIssue(issues, page.path, 'error', 'canonical', 'Canonical URL should match the final ad landing path.', {
      canonical,
      expectedUrl,
    });
  }

  if ([...robots, ...googlebot, ...adsbot].some((rule) => rule === 'noindex' || rule === 'none')) {
    pushIssue(issues, page.path, 'error', 'noindex', 'Ad landing page must not be noindexed for crawlers.', {
      robots,
      googlebot,
      adsbot,
    });
  }

  if ([...robots, ...googlebot, ...adsbot].some((rule) => rule === 'nofollow' || rule === 'none')) {
    pushIssue(issues, page.path, 'error', 'nofollow', 'Ad landing page must allow crawlable internal links.', {
      robots,
      googlebot,
      adsbot,
    });
  }

  if (missingTerms.length > 0) {
    pushIssue(issues, page.path, 'warning', 'message-match', 'Page body does not contain all required intent terms.', {
      intent: page.intent,
      missingTerms,
    });
  }

  if (trustLinks.length < TRUST_LINKS.length) {
    pushIssue(issues, page.path, 'warning', 'trust-links', 'Landing page should expose core trust/legal links.', {
      present: trustLinks,
      missing: TRUST_LINKS.filter((href) => !trustLinks.includes(href)),
    });
  }

  if (firstMainIndex === -1) {
    pushIssue(issues, page.path, 'warning', 'main-landmark', 'Page should include a main landmark for navigation.', {});
  }

  if (firstAdIndex !== -1 && firstH1Index !== -1 && firstAdIndex < firstH1Index) {
    pushIssue(issues, page.path, 'error', 'ad-before-h1', 'Ad markup appears before the first H1.', {
      firstAdIndex,
      firstH1Index,
    });
  }

  if (page.kind === 'tool' && !hasUsefulAction) {
    pushIssue(issues, page.path, 'warning', 'missing-task-surface', 'Tool landing page should expose a form, table, live result, or interactive control.', {
      hasUsefulAction,
    });
  }

  if (page.kind === 'trust' && hasAdsenseMarkup) {
    pushIssue(issues, page.path, 'warning', 'ads-on-trust-page', 'Trust/legal pages should normally avoid ad markup.', {
      hasAdsenseMarkup,
    });
  }

  if (page.path === '/privacy') {
    const missingPrivacyTerms = PRIVACY_DISCLOSURE_TERMS.filter((term) => !bodyText.includes(term));
    const hasGooglePartnerDataLink = $(`a[href="${GOOGLE_PARTNER_DATA_URL}"]`).length > 0;

    if (missingPrivacyTerms.length > 0 || !hasGooglePartnerDataLink) {
      pushIssue(
        issues,
        page.path,
        'error',
        'privacy-disclosure',
        'Privacy policy must disclose Google ad-serving identifiers and link to Google partner data usage.',
        {
          missingPrivacyTerms,
          requiredLink: GOOGLE_PARTNER_DATA_URL,
          hasGooglePartnerDataLink,
        },
      );
    }
  }

  return issues;
}

async function auditLandingPage(
  fetchBaseUrl: string,
  canonicalBaseUrl: string,
  page: LandingPageCheck,
  timeoutMs: number,
) {
  const url = `${fetchBaseUrl}${page.path}`;
  try {
    const result = await fetchWithRetry(url, 1, timeoutMs);
    return auditHtml(canonicalBaseUrl, page, result);
  } catch (error) {
    const issues: AuditIssue[] = [];
    pushIssue(
      issues,
      page.path,
      'error',
      'fetch-failed',
      'Landing page could not be fetched by the Ads readiness audit.',
      {
        url,
        timeoutMs,
        error: error instanceof Error ? error.message : String(error),
      },
    );
    return issues;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = normalizeBaseUrl(getArgumentValue(args, 'base'));
  const canonicalBaseUrl = normalizeCanonicalBaseUrl(
    getArgumentValue(args, 'canonical-base'),
    baseUrl,
  );
  const timeoutMs = getRequestTimeoutMs(args);
  const selectedPath = getArgumentValue(args, 'path');
  const pages = selectedPath
    ? LANDING_PAGES.filter((page) => page.path === selectedPath)
    : LANDING_PAGES;

  if (selectedPath && pages.length === 0) {
    throw new Error(`Unknown landing page path for audit: ${selectedPath}`);
  }

  const allIssues: AuditIssue[] = [];
  const adsenseConnection = await auditAdSenseConnection(baseUrl, timeoutMs);
  allIssues.push(...adsenseConnection.issues);

  for (const page of pages) {
    const issues = await auditLandingPage(
      baseUrl,
      canonicalBaseUrl,
      page,
      timeoutMs,
    );
    allIssues.push(...issues);
  }

  const errors = allIssues.filter((issue) => issue.severity === 'error');
  const warnings = allIssues.filter((issue) => issue.severity === 'warning');

  console.log('[google-ads-readiness] summary');
  console.log(JSON.stringify({
    baseUrl,
    canonicalBaseUrl,
    timeoutMs,
    checkedPages: pages.length,
    adsTxtPublisherId: adsenseConnection.publisherId,
    errors: errors.length,
    warnings: warnings.length,
  }, null, 2));

  if (allIssues.length > 0) {
    console.log('[google-ads-readiness] issues');
    console.log(JSON.stringify(allIssues, null, 2));
  }

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[google-ads-readiness] crashed');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
