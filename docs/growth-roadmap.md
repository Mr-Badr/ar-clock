# Miqatona — Growth Roadmap (Traffic · CTR · Revenue · UX)

Rewritten clean 2026-07-17: every track from the original June-2026 plan (A–I, ~45 checklist items) was
verified against current code and confirmed **done** — CTR title rewrites, prayer-page differentiation,
internal-link mesh, programmatic expansion, indexing hygiene, ad placement, schema, calculator UX
overhaul. Full historical detail lives in git history (this file's own prior revisions) and
`.claude/session-notes.md` — not repeated here per this doc's own "forward-only, delete what's shipped"
policy (same policy `docs/holiday-event-opportunity-backlog.md` already follows).

**This file now contains ONLY what's still genuinely open.** When an item ships, delete it.

---

## Still open

- **GSC CTR triage cadence** — `npm run growth:ctr -- --input=<gsc-export.csv>` exists and works, but
  needs a fresh CSV export to run against. **Blocked on owner**: export Search Console Performance CSV
  (Search Console → Performance → Export). Run this weekly once unblocked.
- **Father's Day / national-day cluster — remaining countries.** The format is proven
  (`fathers-day-tunisia` ranked pos 2.54 @ 1.83% CTR) and Libya/Iraq/Palestine national days are already
  live. Extending to more countries needs a **fresh research pass** (real per-country search-volume
  confirmation, competitor check) before building anything — same Golden Rule as
  `.claude/rules/event-creation-lessons.md` §0. Not scoped yet.
- **Ongoing priority principle (not a one-time task)**: when choosing between two similarly-ranked
  opportunities, prioritize high-CPM geo (US/EU/Gulf) over Maghreb traffic — the RPM difference (US
  20-35 MAD vs. Maghreb ~2 MAD) makes it a revenue multiplier, not just a traffic add. Keep applying this
  when triaging future CTR/content work.

## Verification commands (run before any PR in this area merges)

```bash
npm run ci:check          # lint + typecheck + test:unit + seo:validate + validate:holidays
npm run build             # includes seo:audit:rendered
npm run ads:readiness -- --base=http://localhost:3000
npm run health:routes     # add --base=https://miqatona.com for live
```
