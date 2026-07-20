# Affiliate & Sponsor Links — fill this in, one section at a time

**How this works:** for each program below, sign up at the exact URL given, wait for approval, then paste
your generated affiliate/referral link (or promo code, where that's the mechanism) into the blank field.
Nothing tied to a program gets published until its link here is filled in — see
`docs/high-value-tools-tracker.md` for what each program unlocks and its current build status.

Leave a field blank if you haven't signed up yet. Delete a row only if you've decided not to pursue it
(note why in the tracker doc instead of just deleting silently).

---

## Confirmed self-serve programs (you can sign up today, no outreach needed)

### ArabClicks
- **What it unlocks:** general retail/fashion affiliate links (Noon, Namshi, 6thStreet, Mumzworld, Faces,
  Sivvi, Sprii) — GCC-wide, 5–20% commission, single-tier, $100 minimum payout.
- **Sign up here:** https://www.arabclicks.com/publishers/
- **Your affiliate link/ID once approved:**
  `` (paste here)

### Admitad — Noon (UAE/Saudi/Egypt)
- **What it unlocks:** Noon promo-code based cashback links — 10% + up to 50 AED/SAR for new customers,
  5% for repeat. Works via a personal promo code, not a standard tracked URL.
- **Sign up here:** https://www.admitad.com/en-ae/store/offers/noon-ae-sa-offline-codes/
- **Your promo code once approved:**
  `` (paste here)

### Wego (travel — only relevant if a travel-angle tool is ever built, see Track B in the tracker)
- **What it unlocks:** 3% commission on completed hotel bookings, 30-day cookie window.
- **Sign up here:** https://company.wego.com/affiliate-program
- **Your affiliate link once approved:**
  `` (paste here)

---

## For the newborn-essentials-guide (`/blog/newborn-essentials-guide`, currently hidden)

### Amazon Associates — multi-marketplace, one button per marketplace (not OneLink redirect)
**France: DONE, live in code (2026-07-17).** Tag `miqatona-21` is set in `src/lib/affiliate-config.js`
(`AMAZON_ASSOCIATE_TAGS.fr`), and every product category on the guide links to a category-specific
amazon.fr search (e.g. car seat → "siège auto bébé groupe 0+") carrying that tag.

**Design decision, 2026-07-17**: rather than rely on Amazon's OneLink to auto-redirect a Gulf visitor from
a single "smart" link, each category shows a SEPARATE, clearly-labeled button per marketplace that has an
approved tag ("تسوقي من Amazon.fr" / "Amazon.sa" / "Amazon.ae") — the reader picks the Amazon site they
actually use. This was a deliberate choice after checking OneLink directly: Saudi Arabia is *listed* as a
supported OneLink country, but multiple sources say amazon.sa doesn't actually redirect in practice (it's
on different platform infrastructure post the Souq.com acquisition), and amazon.ae isn't in the supported
list at all — depending on it would risk silently losing exactly the Gulf traffic this matters most for.
Verified via Puppeteer with test tags that all 3 buttons render correctly, independently, before reverting
to the real (France-only) state.

**Still open — sign up for these two to make their buttons appear (each is self-serve, no code changes
needed once a tag exists — just fill in `AMAZON_ASSOCIATE_TAGS.sa` / `.ae` in `src/lib/affiliate-config.js`):**
- **Saudi Arabia:** https://affiliate-program.amazon.sa/ — needs a Saudi bank account for payout.
- **UAE:** https://affiliate-program.amazon.ae/ — needs a UAE bank account for payout.
- Arabic search queries per category are already written and ready in
  `src/lib/guides/pregnancy-guides.js` (`amazonQueries.sa`/`.ae` on each `productPicks` entry) — filling
  in a tag is the only step left for either marketplace.

### Mumzworld — via Admitad (publisher ID 2552902, approved 2026-07-17)
- **What it unlocks:** "تسوقي من Mumzworld" buttons on the same guide (currently absent since this isn't
  filled in yet — Amazon-only right now).
- **Action needed from you:** you're already approved and in Admitad's store — search the offer catalog
  specifically for "Mumzworld" (it was mentioned as an Admitad-network advertiser in earlier research),
  open that program's page, and apply/request approval for it specifically — being an approved Admitad
  publisher overall doesn't automatically grant every merchant's program, each one needs its own
  approval. Once approved, Admitad gives you a Mumzworld-specific tracked link (or the tools to generate
  one from your publisher ID).
- **Your affiliate link once approved:**
  `` (paste directly into `src/lib/affiliate-config.js`, the `mumzworld` key — same empty-check gate,
  activates automatically)

---

## Needs direct outreach — no confirmed self-serve signup found

### Tameeni (Saudi car/health insurance aggregator)
- **What it could unlock:** monetizing the existing `/calculators/car-insurance-saudi` and
  `/calculators/health-insurance-saudi` pages — insurance-lead CPA reportedly SAR 50–200/qualified lead
  (public commentary, not a confirmed rate card).
- **Action needed from you:** contact Tameeni directly (no public self-serve affiliate page was found) —
  try https://www.tameeni.com/en and ask for their partner/affiliate program.
- **Your link/partner ID once confirmed:**
  `` (paste here)

### Najm (Saudi insurance, motor claims)
- **Action needed from you:** contact directly via https://www.najm.sa/en — same as Tameeni, no public
  self-serve program found.
- **Your link/partner ID once confirmed:**
  `` (paste here)

### A remittance/money-transfer service (Wise, Remitly, or a Gulf exchange house like Al Ansari)
- **What it unlocks:** the "وصل راتبك؟" callout is **already built and live in code**, showing on all 8
  `salary-day-*` pages (bahrain/egypt/jordan/kuwait/oman/qatar/saudi/uae) — but hidden until this link is
  filled in. **Paste your link directly into `src/lib/affiliate-config.js` (the `remittance` key) — that
  single edit activates it everywhere, no other file needs to change.**
- **Action needed from you:** check whether Wise (wise.com — has a known individual referral program,
  unclear if it extends to a content-site affiliate deal), Remitly, or a named Gulf exchange house
  (Al Ansari Exchange, Enjaz) has a real partner program — none confirmed from public search this pass.
- **Your link/partner ID once confirmed:**
  `` (paste directly into `src/lib/affiliate-config.js` instead of here — this row is just tracking status)

---

## Direct sponsorship (not an affiliate network — see `docs/high-value-tools-tracker.md` §Track A pages
## and the sponsorship one-pager artifact from 2026-07-16)

These aren't "sign up" links — they're brands to contact directly. Fill in once you have a deal.

### [Sponsor name — fill in once you've made contact]
- **Page(s) it sponsors:**
- **Deal terms:**
- **Tracked link/code they gave you:**
  `` (paste here)
