# ميقاتنا (Miqatona) — Logo & Favicon Asset Brief

For: designer (Illustrator) → produces the files.
Then: this doc also tells **you** exactly where each delivered file goes in the codebase.

Brand: single logo, single color, transparent background, no separate light/dark variant, circular mark.

---

## Part A — What to send the designer

Copy the table below to the designer as-is. It's everything they need to set up artboards and export.

### Artwork rules

- **One logo.** No light/dark variants, no alt colorways. Single fill color, transparent background everywhere except the one exception in row 7 below (maskable icon).
- **Circular mark**, works as a self-contained shape — no dependency on a background square/card to read correctly.
- **Single flat fill.** No gradients, no drop shadows, no blend/transparency effects, no strokes with variable width — anything like that breaks when scaled down to 16×16 or auto-converted to ICO/PNG.
- **Vector-first.** Build once at a large artboard (say 512×512 pt), everything else is exported down from that master — never redrawn at each size.
- **Legibility check at 16×16 px.** This is the hardest constraint — a favicon tab icon is genuinely tiny. Before exporting, shrink the artwork on-screen to 16px and confirm the shape still reads as a distinct mark, not a blob. Simplify detail until it survives that test.
- **Safe margin.** Keep the mark's important silhouette inside roughly the center 90% of the artboard — a couple of px of breathing room on all sides so nothing touches the edge when placed in a rounded app-icon frame.

### Files to deliver

| # | File | Format | Size / Canvas | Background | Notes |
|---|------|--------|----------------|------------|-------|
| 1 | `miqatona-logo-master.ai` | Illustrator | 512×512 pt artboard | transparent | Editable master source. Keep layers clean/named. |
| 2 | `miqatona-logo-master.eps` | EPS | vector | transparent | Universal vector export of the same master. |
| 3 | `miqatona-logo-master.pdf` | PDF | vector | transparent | Universal vector export of the same master (print-safe). |
| 4 | `miqatona-logo.svg` | SVG | `viewBox="0 0 512 512"` | transparent | **Production SVG** — clean export (no Illustrator cruft: no `<metadata>`, no editor comments, no unused `<defs>`). This one file gets reused at every size — SVG scales losslessly, so no separate small/large SVG versions are needed. |
| 5 | `icon-512.png` | PNG-24 with alpha | 512×512 px | transparent | Flat raster export of the master, no padding added. |
| 6 | `icon-192.png` | PNG-24 with alpha | 192×192 px | transparent | Same artwork, re-exported at 192, not scaled from the 512 PNG (avoid resampling blur). |
| 7 | `icon-512-maskable.png` | PNG-24, **no alpha** | 512×512 px | **solid fill required — see note below** | Android "maskable" icon. The mark must sit inside the **center 80% safe circle** (≈410px diameter circle centered on the 512 canvas) because Android crops this into a circle/squircle/rounded-square depending on the launcher, and anything outside that zone gets cut off. |
| 8 | `apple-touch-icon.png` | PNG-24 | 180×180 px | transparent (see note) | iOS home-screen icon. |
| 9 | `favicon-32.png` | PNG-24 with alpha | 32×32 px | transparent | Re-exported at this exact size, not resized from 512. |
| 10 | `favicon-16.png` | PNG-24 with alpha | 16×16 px | transparent | **This is the legibility-test size** — see rule above. |
| 11 | `favicon.ico` | ICO (multi-resolution) | embeds 16×16 + 32×32 + 48×48 | transparent | If Illustrator/Photoshop can't export `.ico` directly, deliver the three PNGs (16/32/48) separately and note that — packaging into one `.ico` is a 30-second step on our end. |
| 12 | `og-banner.png` | PNG or JPG | **1200×630 px** | can use padding/a background this one time | Social share banner (Open Graph / Twitter card). This is a landscape banner, not the icon — the mark can be centered with room around it, doesn't need to fill the frame. |

**Note on row 7 (maskable icon):** every other file above is transparent. This one can't be — it's the one required exception. Android's spec fills transparent pixels with black or white depending on the launcher, which looks broken. Any solid fill works (a flat color card behind the mark, or the mark's own color inverted as a background) as long as the actual logo silhouette stays inside the inner safe circle.

**Note on row 8 (apple icon):** transparent is fine on current iOS, but some older iOS/Safari versions fill transparent regions with solid black on the home screen. If the designer wants one extra safety net, a version with a solid backing (any single flat color) is a nice-to-have — but not required to ship.

That's 12 files. Rows 1–4 are the reusable masters; rows 5–12 are the fixed exports every site needs.

---

## Part B — Where each file goes (after you receive them)

This repo already has slots wired up for exactly this file set — same names, same folders, so dropping the new files in place is a straight swap, no code changes required for rows 5, 6, 7, 9/10/11, 12.

| Delivered file | Destination path | Replaces |
|---|---|---|
| `icon-512.png` | `public/icons/icon-512.png` | existing placeholder |
| `icon-192.png` | `public/icons/icon-192.png` | existing placeholder |
| `miqatona-logo.svg` | `public/icons/icon-512.svg` **and** `public/icons/icon-192.svg` (same file, both names — SVG is resolution-independent) | existing placeholder SVGs |
| `icon-512-maskable.png` | `public/icons/icon-512-maskable.png` | existing placeholder |
| `favicon.ico` (or the 16/32/48 PNG set, packaged) | `src/app/favicon.ico` | existing favicon |
| `og-banner.png` | `public/og-default.png` | existing 1024×1024 image — replace with the new 1200×630 banner |
| `apple-touch-icon.png` | `public/icons/apple-touch-icon.png` | *(new file — needs one line of code wiring, see Part C)* |
| `miqatona-logo.svg` (a second copy) | `public/img/logo.svg` | *(new — for on-site header/footer use, see Part C)* |
| `miqatona-logo-master.ai` / `.eps` / `.pdf` | **do not commit to the git repo** — these are large editable binaries. Keep them in your design drive/folder (Drive, Dropbox, etc.) as the source-of-truth master. Only the exported production files above belong in the codebase. |

Everything currently reads from `public/icons/` with those exact filenames (`src/app/manifest.js` and `src/app/layout.tsx` already point at `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`), so as long as the new files use the same names, you can literally overwrite them in place — no other file needs to change.

---

## Part C — What still needs a code change on my end (after files land)

Two small wiring steps that Part B's file-drop alone doesn't cover — tell me when the files are in and I'll do these:

1. **Apple touch icon** — `src/app/layout.tsx`'s `metadata.icons.apple` currently points at `icon-192.png` (works, just not pixel-native). Once `apple-touch-icon.png` (180×180) exists at `public/icons/apple-touch-icon.png`, I'll repoint that one metadata entry to it.
2. **Header/footer logo** — right now the site header (`src/components/layout/header.jsx`) uses a generic clock icon as a placeholder mark, not a real logo file. Once `public/img/logo.svg` exists, I'll swap that placeholder for the real logo in the header (and footer, if it uses the same mark).

Nothing else needs a code change — `manifest.js`, the favicon, and the OG image are all consumed by filename already.

---

## Part D — Quick copy-paste checklist for you

When the designer delivers:

- [ ] 12 files received per Part A's table
- [ ] `favicon-16.png` actually reads clearly at real 16px (open it at 100% zoom, not scaled up)
- [ ] `icon-512-maskable.png` mark sits inside the inner safe circle, has a solid (non-transparent) fill
- [ ] Overwrite `public/icons/icon-512.png`, `public/icons/icon-192.png`, `public/icons/icon-512.svg`, `public/icons/icon-192.svg`, `public/icons/icon-512-maskable.png`
- [ ] Replace `src/app/favicon.ico`
- [ ] Replace `public/og-default.png` with the new 1200×630 banner
- [ ] Add `public/icons/apple-touch-icon.png` (new file)
- [ ] Add `public/img/logo.svg` (new file)
- [ ] Store `.ai` / `.eps` / `.pdf` masters outside the repo (design drive)
- [ ] Ping me to wire up Part C (apple icon metadata + header/footer logo swap)
