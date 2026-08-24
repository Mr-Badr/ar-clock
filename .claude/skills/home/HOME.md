---
name: arabic-homepage-gsap
description: Design and build a cinematic, mobile-first, RTL Arabic marketing home page for a Next.js + Tailwind + shadcn product, animated end to end with GSAP and built from Magic UI / React Bits components available through MCP. Use when the user asks to rebuild, redesign, or create the home page (navbar, hero, sections, footer) for an Arabic-first product, or to make a marketing landing page "blow-minded" with scroll animation, or to set up GSAP for this kind of build.
---

# Arabic Home Page, Built on GSAP

Rebuild a product's home page from zero: a new navbar, a new hero built around a real image (not a generated video), new sections with new ideas and new Arabic copy, a new footer, the whole thing animated with GSAP and assembled from Magic UI and React Bits components pulled in through MCP. Built inside the user's existing Next.js + Tailwind + shadcn project, on top of their existing color system and dark/light theme, not a new one.

**This replaces a different skill, on purpose.** An earlier version of this workflow generated its hero from Higgsfield AI video and deployed to a fresh static site on Hostinger. Neither applies here: there is no AI video, there is no separate static site, this is one page inside an existing product. Every video-generation phase, every Hostinger phase, and every "invent a fictional brand" branch from that version is gone. Nothing from that workflow carries over except the discipline: work in phases, get sign-off at the real decision points, write the copy like a human, and self-test before showing anyone.

**Companion skill.** This skill assumes correct GSAP usage but does not itself teach the GSAP API. Before writing any GSAP code, check whether the `gsap-skills` skill (the official GreenSock skill, covering core tweens, timelines, ScrollTrigger, the `useGSAP` React hook, and cleanup rules) is installed. If it is not, tell the user once: `npx skills add https://github.com/greensock/gsap-skills` installs it for Claude Code, or `/plugin marketplace add greensock/gsap-skills` inside Claude Code. If they'd rather skip installing it, proceed anyway using the React rules in Phase 5 of this file, since those cover the load-bearing mistakes (missing cleanup, animating layout properties instead of transforms, no reduced-motion guard).

## Your role

You are the designer, the copywriter, and the engineer. The user already has the product, the brand, and the design system; they are not asking you to invent a company. Your job is to give their home page a new shape: better sections, better Arabic, better motion, built cleanly inside what they already have. Propose, then let them choose. Never invent a new color palette or a new font system when one already exists in the project; find it and use it.

## What done looks like

- The page lives at the route the user points you to, builds with no errors, and looks right in both light and dark mode.
- It is genuinely mobile-first: designed and checked at a 375px width first, scaled up from there, not the other way around.
- Every section is fully RTL: text, icon direction, spacing, scroll direction where it matters.
- The GSAP animation is smooth on a mid-range phone, never blocks the page from being usable if a script is slow to load, and respects `prefers-reduced-motion`.
- The Arabic copy reads like a person wrote it for this product, not like an English marketing template translated a sentence at a time.
- The user has looked at it and said it feels the way they pictured it, in their own words.

## Phase 1: Scan before anything

Before asking the user anything about design, look at what already exists.

1. **Project shape.** Confirm Next.js (App Router or Pages Router), Tailwind version, and that shadcn/ui is installed (check `components.json` and `components/ui/`). Note the routing setup if the site is multilingual (an `[locale]` segment, `next-intl`, or similar), since the Arabic page must slot into that, not fight it.
2. **The existing design system.** Find and read the actual color tokens (`globals.css` CSS variables, or `tailwind.config` theme extension) and the dark/light mode strategy (`class` vs `media`, a theme provider). Find the fonts already wired in, especially the Arabic font. This is the palette and type system the whole page must obey. Do not propose a new one unless the user explicitly asks for a refresh of the system itself.
3. **GSAP.** Check `package.json` for `gsap` and `@gsap/react`. If missing, install both (`npm install gsap @gsap/react`) after telling the user in one line.
4. **Magic UI and React Bits, via MCP.** Confirm both are reachable as MCP tools. List a few components from each that are plausibly useful for a section-heavy marketing page (bento grid, marquee, number ticker, animated beam, testimonial/carousel, accordion, spotlight/border-beam effects). These are sourced live in Phase 6, this is just confirming the pipes work.
5. **Images already dropped in `public/img`.** List what's there. The user has said `hero` and `footer` are fixed names; everything else is section imagery. Where a filename's purpose isn't obvious, ask in one batched question rather than guessing.
6. **What this page replaces.** Confirm explicitly: is this a full replacement of the current home route, including the navbar and footer used on OTHER pages of the site, or a home-page-only navbar/footer variant that other routes keep as-is? Get this answered before building; it changes whether the new Navbar/Footer become the site's shared components or new ones scoped to this route only.

Report all of this as a short checklist, then move straight into Phase 2.

## Phase 2: Lock the brief

State your understanding back to the user in a few plain lines and get it confirmed or corrected, rather than re-asking from scratch:

- **The product:** an Arabic-first calculator and utility web app for the Gulf/MENA market, 150+ tools across roughly 24 categories, competing against generic Google-result calculators and English-only tools by being genuinely built for Arabic speakers.
- **The goal of this page:** convert a visitor who lands here into someone who opens a tool. This is a marketing page, not a documentation page, and not optimized for SEO first.
- **Tone:** ask this one directly, since it isn't in the project already. Offer choices like trustworthy/expert (like a professional reference tool), premium/modern (like a fintech app), or warm/local (friendly Gulf voice) and let the user pick, because it sets the register for every line of copy that follows.
- **The single call to action:** almost certainly "open a tool" or "browse the categories," since there's no signup or purchase. Confirm the exact destination (a tools listing page, a search bar, a specific popular tool) so every section can funnel to it.

## Phase 3: Find the real language

Before writing a single headline, spend a short round finding how Gulf/MENA Arabic speakers actually talk about this problem, the same way a human researcher would before a campaign brief.

Search for Arabic-language forum posts, review comments, and social discussion about frustration with existing calculators and conversion tools: complaints about English-only interfaces, distrust of ad-heavy sites, confusion with tools not built for local units, currencies, or Islamic/Gulf-specific needs (zakat, GOSI, inheritance shares). A handful of real sources is enough. Pull out the actual phrases people use for the pain, the outcome they want, and the objection that stops them trusting a new tool.

Use this three ways: the hero's subheadline should echo the real pain in one line, one section should speak directly to the trust objection (why this tool, why now), and the FAQ should answer the real objections found, not invented ones.

## Phase 4: The sitemap, proposed fresh

This is where the "new sections, new ideas" part of the brief lives. Do not just port the old page's structure. Propose a full section list to the user as one message, each with a one-line purpose, and let them add, cut, or reorder before you build. A strong default order for this kind of product:

1. **Navbar** — sticky, RTL-mirrored (logo on the visual right, primary nav flowing right-to-left), a search-forward element if the product has one, one clear CTA button.
2. **Hero** — built around `hero` from `public/img`. Not a video scrub; a real image with GSAP entrance motion (staggered text reveal, subtle parallax on the image, a live-feeling number like "+150 أداة" that counts up on load). Headline states the outcome, not the feature list.
3. **The pain, named plainly** — one short section that says the quiet part out loud: searching in Arabic for a simple calculation and landing on a broken English tool, an ad-choked page, or a generic converter that doesn't understand Gulf-specific needs.
4. **The categories, shown as a system** — a bento-style grid (pull this shape from Magic UI or React Bits) showing category groups, not a flat list, so the sheer breadth reads visually in one glance.
5. **How it works** — three short steps, pinned/scroll-synced with GSAP ScrollTrigger, ending on "start typing, get your answer."
6. **A moving proof strip** — a marquee (Magic UI's marquee component is a good fit) of tool names or category names, reinforcing scale without another wall of text.
7. **Trust section** — a short, honest paragraph on why an Arabic-first tool matters (built for Arabic speakers first, not translated after the fact), paired with animated stat counters if the numbers are real; skip invented testimonials entirely unless the user has real ones to supply.
8. **Comparison** — this tool vs. the generic Google-result calculator: two or three sharp contrasts, not a full feature-matrix table.
9. **FAQ** — answers to the real objections surfaced in Phase 3, as a shadcn accordion.
10. **Final CTA band** — one line, one button, reusing the exact CTA phrase from the hero so the page feels like it resolves.
11. **Footer** — built around `footer` from `public/img`, RTL layout, real links (categories, about, contact), no fictional-brand disclaimer since this is a real product.

Confirm the list, then map the 5–8 remaining images the user mentioned to whichever sections need them (categories grid, trust section, comparison) before building.

## Phase 5: The motion system

**Respect the existing system; don't invent a new one.** Every color, every dark/light swap, comes from the tokens found in Phase 1. New GSAP-driven elements (glow, gradient accents, highlight sweeps) should key off those same CSS variables so the page doesn't visually fork from the rest of the product.

**RTL is not an afterthought, it's the default.** `dir="rtl"` at the page root. Use logical Tailwind properties (`ps-`, `pe-`, `ms-`, `me-`, `text-start`, `text-end`) instead of physical ones (`pl-`, `pr-`, `ml-`, `mr-`) everywhere, so spacing doesn't silently break. Directional icons (arrows, chevrons) mirror; icons that represent objects (play buttons, a magnifying glass) do not. Decide once, up front, whether numerals in copy and UI are Western digits (١٢٣ vs 123) — for a calculator product aimed at a Gulf audience already used to Western digits in finance UIs, default to Western digits unless the user says otherwise.

**Mobile-first, genuinely.** Build and check every section at a 375px width before scaling up. GSAP timelines should be lighter on small screens: fewer simultaneous moving parts, shorter distances, no parallax layer that causes scroll jank on a mid-range phone. `matchMedia`-gate any heavier desktop-only motion.

**GSAP patterns per section, as a starting menu (adapt per what gsap-skills recommends if installed):**
- Hero: a `useGSAP` timeline on mount for the text stagger and image reveal, a scroll-linked subtle parallax via ScrollTrigger with `scrub`.
- Categories bento grid: staggered fade/scale-in as the grid enters the viewport (`ScrollTrigger` with `toggleActions`, not `scrub`, so it plays once cleanly).
- How-it-works: a pinned section (`pin: true`) that steps through the three stages as the user scrolls through it, released cleanly after.
- Marquee: CSS or a Magic UI component is usually enough on its own; only reach for GSAP here if the built-in marquee doesn't support RTL direction cleanly.
- Every section: entrance only needs to happen once per section per visit; use `once: true` or `toggleActions: "play none none none"` rather than replaying on every scroll direction, since replay-on-scroll-up reads as glitchy, not cinematic.

**The non-negotiables:** animate `transform` and `opacity`, never `top`/`left`/`width`/`height`. Every `ScrollTrigger` and every `useGSAP` scope gets cleaned up on unmount so navigating away doesn't leak triggers. Wrap all entrance motion in a `prefers-reduced-motion` check that swaps to instant appearance. The page must be fully readable and usable if JavaScript is slow to hydrate — no critical content hidden until a GSAP timeline fires.

## Phase 6: Source components before building custom

For each section, before writing a bespoke component, check Magic UI and React Bits through MCP for a component that already does the shape you need (bento grid, marquee, animated counter, spotlight card, accordion, testimonial carousel). Adapt what you pull in: restyle it onto the project's existing shadcn tokens, mirror it for RTL, and verify it still respects `prefers-reduced-motion` and dark/light mode after the restyle. Only build fully custom where nothing close exists, most likely the hero and the pinned how-it-works section, since those are specific to this brief.

## Phase 7: Write the Arabic copy yourself, deliberately

Long-generated Arabic marketing copy drifts toward stiff, over-translated phrasing even when told to be natural, so treat every line as a written deliverable, not a fill-in-the-blank.

- Write in the tone locked in Phase 2, in a register a Gulf-based reader would actually speak or read comfortably, not textbook MSA stiffness and not heavy slang either, unless the user specifically asked for a local dialect feel.
- Every headline is short enough to read in one glance while scrolling on a phone. Prefer two tight clauses over one long sentence: state a headline size and rhythm, for example "أداة لكل حساب. بالعربي، من أول مرة." rather than a run-on sentence explaining the whole value proposition at once.
- Reuse the exact same CTA phrase everywhere it appears (hero, final band, nav button), so the page reads as one funnel, not several separate pitches.
- Avoid the Arabic-marketing equivalents of English filler: "نقدم لكم حلولاً مبتكرة", "استكشف عالماً من الإمكانيات", "رحلتك تبدأ من هنا", "بضغطة زر" used as a crutch, and generic "الأفضل في المنطقة" claims with nothing backing them. If a sentence could be pasted onto any unrelated product's landing page unchanged, rewrite it to say something only true of this product.
- Write the FAQ answers directly from the real objections found in Phase 3, not invented ones.

**Gate before showing the page to the user:** reread every section's copy end to end and flag any line that sounds translated rather than written. Fix it before the first preview, don't wait for the user to catch it.

## Phase 8: Self-test before showing anyone

- Check the page at 375px, 768px, and desktop widths, in both RTL rendering and both color themes.
- Scroll the full page slowly and then quickly; confirm no animation replays oddly on scroll-up, nothing snaps, nothing causes layout shift.
- Toggle `prefers-reduced-motion` (via devtools) and confirm the page is still complete and readable with motion off.
- Throttle to a slow connection and confirm the hero and above-the-fold content are usable before every script has finished loading.
- Check the console for errors, especially around ScrollTrigger cleanup warnings on route navigation if this is inside a Next.js app with client-side routing.
- Then hand it to the user for their own plain-words pass, in their own language: what feels off, what they'd change, before calling it finished.

## Phase 9: Iterate

From here, treat it as a standing loop: the user describes a change in plain words, you make it, you re-check mobile, RTL, and both themes, and you show the result. Small changes don't need the full Phase 8 pass, but any change touching layout or motion gets at least the mobile-width and reduced-motion checks before being called done.
