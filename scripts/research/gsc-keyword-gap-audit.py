"""
GSC keyword-phrase-gap audit for /holidays/* event pages.

For every holiday page with real Search Console query data (>= 500 impressions/28d), compares
each of its top real search queries against the page's own configured keywords + FAQ + aboutEvent
text (normalized, {{year}}-token-stripped). Flags queries that get real impressions but whose
phrase never actually appears anywhere in the page's content — a genuine, fixable relevance gap,
distinct from a pure ranking/position problem.

Real example this caught: throne-day-morocco only ever targeted "عيد العرش المغربي" (adjectival
form) and was losing ~4,700 clicks/mo on "عيد العرش في المغرب" / bare "عيد العرش" — phrasings real
searchers actually use that never appeared anywhere on the page.

Known false-positive source: queries with Arabic-Indic year digits (٢٠٢٧) aren't stripped the same
way Latin-digit years are (our content only ever has literal "{{year}}"/"{{nextYear}}" tokens, never
literal digits) — a flagged gap where the ONLY difference is the digit script is not a real gap,
verify by eye before fixing.

Usage: requires a fresh `search-console-opportunities__sc-domain_miqatona.com__last-28d.json`
export in `.secrets/cache/` (see the growth-team's GSC pull tooling for how that's generated).
Run: `python3 scripts/research/gsc-keyword-gap-audit.py`

Last run 2026-08-19: found 31 pages with real gaps; 20 fixed same session (see memory index),
~11 remain, all under 300 impressions/28d each.
"""
import json, re, os, sys
from collections import defaultdict

REPO = "/home/badr/Downloads/ar-clock"
GSC_PATH = f"{REPO}/.secrets/cache/search-console-opportunities__sc-domain_miqatona.com__last-28d.json"
EVENTS_DIR = f"{REPO}/src/data/holidays/events"

def normalize(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9؀-ۿ\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

with open(GSC_PATH) as f:
    gsc = json.load(f)
rows = gsc.get("data", gsc)["rows"]

# group by page (holidays only)
by_page = defaultdict(list)
for r in rows:
    page = r.get("page", "")
    if "/holidays/" not in page: continue
    slug = page.rstrip("/").split("/")[-1]
    by_page[slug].append(r)

results = []
for slug, queries in by_page.items():
    pkg_path = f"{EVENTS_DIR}/{slug}/package.json"
    if not os.path.exists(pkg_path):
        continue
    try:
        with open(pkg_path) as f:
            pkg = json.load(f)
    except Exception:
        continue
    rc = pkg.get("richContent", {})
    seo = rc.get("seoMeta", {})

    # collect all configured keyword/content text for this page
    text_parts = []
    text_parts.append(rc.get("answerSummary", ""))
    text_parts.append(seo.get("primaryKeyword", ""))
    text_parts.extend(seo.get("secondaryKeywords", []) or [])
    text_parts.extend(seo.get("longTailKeywords", []) or [])
    text_parts.extend(rc.get("keywords", []) or [])
    ae = rc.get("aboutEvent", {})
    if isinstance(ae, dict):
        text_parts.extend(ae.values())
    for faq in rc.get("faq", []) or []:
        text_parts.append(faq.get("question", ""))
        text_parts.append(faq.get("answer", ""))
    combined = normalize(" ".join(str(p) for p in text_parts))

    # sort queries by impressions, sum total impressions for this page
    queries_sorted = sorted(queries, key=lambda r: -r.get("impressions", 0))
    total_imp = sum(r.get("impressions", 0) for r in queries)
    if total_imp < 500: continue  # skip tiny pages

    gaps = []
    for q in queries_sorted[:15]:  # top 15 queries per page
        query_text = q.get("query", "")
        imp = q.get("impressions", 0)
        if imp < 100: continue
        # strip year tokens for matching since our content uses {{year}} templates
        q_norm = normalize(query_text)
        q_norm_no_year = re.sub(r"\b20\d{2}\b", "", q_norm).strip()
        q_norm_no_year = re.sub(r"\s+", " ", q_norm_no_year)
        if len(q_norm_no_year) < 6: continue
        if q_norm_no_year not in combined:
            gaps.append((query_text, imp, q.get("clicks", 0), q.get("position", 0)))

    if gaps:
        results.append((slug, total_imp, gaps))

results.sort(key=lambda x: -x[1])
print(f"{len(results)} holiday pages with at least one real keyword-phrase gap (imp>=500 pages, 15 top queries checked each)\n")
for slug, total_imp, gaps in results[:40]:
    print(f"=== {slug} (total {total_imp} imp/28d) ===")
    for query, imp, clk, pos in gaps:
        print(f"   MISSING: {imp:>6} imp | {clk:>4} clk | pos={pos:.1f} | {query!r}")
    print()
