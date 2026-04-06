# Miqat Brand Assets Guide

This document defines the full logo, favicon, and app icon package for `ميقات`, based on the current visual language already used in the header and footer.

It is written as a design-and-implementation handoff so a designer can build the assets in Adobe Illustrator, and a developer can place them in the correct paths without guesswork.

## 1. Brand Direction

The current UI already gives us the right direction:

- Header: compact clock mark, simple, recognizable, readable at `28x28`.
- Footer: stronger brand lockup with a rounded square icon tile, blue gradient background, white clock symbol, and Arabic wordmark `ميقات`.
- Theme system: the app supports both light and dark mode, so the logo system must have dark-surface and light-surface variants.

### Visual rules to keep

- Use the clock symbol as the primary brand mark.
- Use the footer style as the main logo foundation: rounded square tile + clock + `ميقات`.
- Keep the icon simple enough to survive `16x16`, `32x32`, and `48x48`.
- Do not place the full Arabic wordmark inside any favicon or launcher icon.
- For tiny sizes, use a simplified clock mark, not a detailed duotone drawing.

### Brand colors from the live design system

Use these values as the starting palette in Illustrator:

| Token | Dark mode | Light mode | Notes |
|---|---:|---:|---|
| `--accent` | `#1D4ED8` | `#1D4ED8` | Primary brand blue |
| `--accent-alt` | `#8CAEFF` | `#1D4ED8` | Brighter accent on dark surfaces |
| `--bg-subtle` | `#111827` | `#F0F2FA` | Surface background |
| `--text-primary` | `#F0F4FF` | `#0E1220` | Main text color |
| Gradient start | `#1D4ED8` | `#1D4ED8` | From `--accent-gradient` |
| Gradient end | `#4338CA` | `#4338CA` | From `--accent-gradient` |

### Recommended logo system

Create these 4 brand families:

| Family | Purpose | Theme variants |
|---|---|---|
| `mark` | Icon-only symbol for favicon, PWA, compact UI | Light, dark, monochrome |
| `wordmark` | Arabic wordmark `ميقات` only | Light, dark |
| `horizontal-lockup` | Icon + wordmark for footer, docs, brand sections | Light, dark |
| `app-tile` | Square filled icon for PWA, iOS, Android, social app icon usage | Stable shipping version + optional light/dark source variants |

## 2. Where To Store Everything

Do not mix editable design source files with runtime web assets.

### Editable source files

Store Illustrator source files here:

```text
/design/brand/source/
```

Recommended files:

```text
/design/brand/source/miqat-brand-master.ai
/design/brand/source/miqat-brand-master.pdf
```

Notes:

- The `.ai` file is the editable master.
- The `.pdf` export is a safety backup for handoff and printing.
- Keep source files out of `public/`.

### Runtime assets used by the app

Store brand assets here:

```text
/public/brand/
```

Store favicon, browser, PWA, and device icons here:

```text
/public/icons/
```

Store these root-level browser files exactly here:

```text
/public/favicon.ico
/public/apple-touch-icon.png
/public/safari-pinned-tab.svg
```

### Recommended final folder structure

```text
/design/brand/source/miqat-brand-master.ai
/public/brand/miqat-logo-horizontal-light.svg
/public/brand/miqat-logo-horizontal-dark.svg
/public/brand/miqat-wordmark-light.svg
/public/brand/miqat-wordmark-dark.svg
/public/brand/miqat-mark-light.svg
/public/brand/miqat-mark-dark.svg
/public/icons/favicon.svg
/public/icons/favicon-light.svg
/public/icons/favicon-dark.svg
/public/icons/favicon-16x16.png
/public/icons/favicon-32x32.png
/public/icons/favicon-48x48.png
/public/icons/favicon-64x64.png
/public/icons/icon-192.svg
/public/icons/icon-192.png
/public/icons/icon-512.svg
/public/icons/icon-512.png
/public/icons/icon-512-maskable.png
/public/icons/icon-1024.png
/public/apple-touch-icon.png
/public/safari-pinned-tab.svg
/public/favicon.ico
```

## 3. Illustrator Setup

Create the master logo pack in Illustrator with these settings:

| Setting | Value |
|---|---|
| Color mode | `RGB` |
| Color profile | `sRGB IEC61966-2.1` |
| Raster effects | `300 ppi` for master document |
| Grid | Enable pixel preview for small icon artboards |
| Stroke handling | Convert final shipping icons to outlined shapes before export |
| Text handling | Keep a live-text master, then create an outlined export copy |

### Artboards to create in Illustrator

Use separate artboards for each logo family and for pixel QA:

| Artboard name | Size | Use |
|---|---:|---|
| `mark-master` | `1024x1024` | Main icon master |
| `app-tile-master` | `1024x1024` | Filled launcher icon |
| `horizontal-lockup-master` | `1600x400` | Main logo lockup |
| `wordmark-master` | `1200x300` | Arabic wordmark only |
| `favicon-preview-64` | `64x64` | Preview favicon clarity |
| `favicon-preview-32` | `32x32` | Preview favicon clarity |
| `favicon-preview-16` | `16x16` | Final readability check |
| `pinned-tab-master` | `512x512` | Monochrome Safari pinned tab |

### Small-size design rules

- The `16x16` and `32x32` previews are not optional; they are part of QA.
- Remove tiny decorative details at favicon size.
- Keep the clock hands thick enough to survive browser antialiasing.
- Do not rely on a subtle duotone effect in the favicon.
- Keep clear padding around the icon so it does not feel cramped in tabs.

## 4. Light And Dark Mode Strategy

Not every icon type behaves the same way across platforms.

### Assets that should switch by theme

These should exist in both light and dark variants:

- `miqat-logo-horizontal-light`
- `miqat-logo-horizontal-dark`
- `miqat-wordmark-light`
- `miqat-wordmark-dark`
- `miqat-mark-light`
- `miqat-mark-dark`
- `favicon-light.svg`
- `favicon-dark.svg`

### Assets that should not depend on theme switching

These are better shipped as one stable, high-contrast icon:

- `favicon.ico`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`

Reason: iOS home screen icons, Android launcher icons, and many installed app surfaces do not reliably swap between light and dark versions. For these, use the strong filled square tile with the white clock mark.

## 5. Export Matrix

This is the professional export set to build.

### A. Brand logos for UI and marketing

| File | Format | Size | Theme | Purpose |
|---|---|---:|---|---|
| `miqat-logo-horizontal-light.svg` | SVG | Responsive | Light asset | Use on dark surfaces |
| `miqat-logo-horizontal-dark.svg` | SVG | Responsive | Dark asset | Use on light surfaces |
| `miqat-logo-horizontal-light.png` | PNG | `1600x400` | Light asset | Fallback export |
| `miqat-logo-horizontal-dark.png` | PNG | `1600x400` | Dark asset | Fallback export |
| `miqat-wordmark-light.svg` | SVG | Responsive | Light asset | Text-only brand |
| `miqat-wordmark-dark.svg` | SVG | Responsive | Dark asset | Text-only brand |
| `miqat-wordmark-light.png` | PNG | `1200x300` | Light asset | Fallback export |
| `miqat-wordmark-dark.png` | PNG | `1200x300` | Dark asset | Fallback export |
| `miqat-mark-light.svg` | SVG | Responsive | Light asset | Icon-only brand |
| `miqat-mark-dark.svg` | SVG | Responsive | Dark asset | Icon-only brand |
| `miqat-mark-light.png` | PNG | `1024x1024` | Light asset | Archive/export |
| `miqat-mark-dark.png` | PNG | `1024x1024` | Dark asset | Archive/export |

### B. Browser favicon package

| File | Format | Size | Theme | Required |
|---|---|---:|---|---|
| `/public/favicon.ico` | ICO | `16, 32, 48` inside one file | Stable | Yes |
| `/public/icons/favicon.svg` | SVG | Scalable | Theme-aware or neutral | Yes |
| `/public/icons/favicon-light.svg` | SVG | Scalable | Light | Recommended |
| `/public/icons/favicon-dark.svg` | SVG | Scalable | Dark | Recommended |
| `/public/icons/favicon-16x16.png` | PNG | `16x16` | Neutral | Yes |
| `/public/icons/favicon-32x32.png` | PNG | `32x32` | Neutral | Yes |
| `/public/icons/favicon-48x48.png` | PNG | `48x48` | Neutral | Yes |
| `/public/icons/favicon-64x64.png` | PNG | `64x64` | Neutral | Recommended |

### C. Apple, Android, and PWA package

These are the sizes I recommend shipping from day one:

| File | Format | Size | Purpose | Required |
|---|---|---:|---|---|
| `/public/apple-touch-icon.png` | PNG | `180x180` | iPhone/iPad home screen | Yes |
| `/public/icons/icon-192.svg` | SVG | `192x192` viewBox | Manifest vector source | Yes |
| `/public/icons/icon-192.png` | PNG | `192x192` | Android/PWA icon | Yes |
| `/public/icons/icon-512.svg` | SVG | `512x512` viewBox | Manifest vector source | Yes |
| `/public/icons/icon-512.png` | PNG | `512x512` | Android/PWA icon | Yes |
| `/public/icons/icon-512-maskable.png` | PNG | `512x512` | Android maskable icon | Yes |
| `/public/icons/icon-1024.png` | PNG | `1024x1024` | Archive/master delivery | Recommended |

### D. Extended production sizes for wider device coverage

If you want the full professional pack, also export these PNGs from the same master app tile:

| Size | Use |
|---:|---|
| `72x72` | Older Android / generic launcher support |
| `96x96` | Generic launcher support |
| `120x120` | Older iPhone touch icon support |
| `128x128` | Generic app icon export |
| `144x144` | Legacy tile / device support |
| `152x152` | iPad touch icon |
| `167x167` | iPad Pro touch icon |
| `180x180` | Main Apple touch icon |
| `192x192` | Android install icon |
| `256x256` | High-density launcher / archive |
| `384x384` | Android launcher support |
| `512x512` | PWA install icon |
| `1024x1024` | Master raster export |

### E. Safari pinned tab

| File | Format | Size | Style | Required |
|---|---|---:|---|---|
| `/public/safari-pinned-tab.svg` | SVG | Scalable | Monochrome only | Recommended |

Rules:

- Use a single solid shape, no gradients.
- Use the simplified clock mark only.
- Test it as a one-color vector.

### F. Optional legacy Windows tile support

These are optional, not required for the current Next.js setup, but they are the professional extras if you want maximum legacy coverage:

| File | Format | Size | Purpose |
|---|---|---:|---|
| `/public/icons/mstile-150x150.png` | PNG | `150x150` | Legacy Windows tile |
| `/public/icons/mstile-310x310.png` | PNG | `310x310` | Large legacy Windows tile |
| `/public/browserconfig.xml` | XML | N/A | Legacy Microsoft tile config |

## 6. Maskable Icon Rules

`icon-512-maskable.png` must be designed differently from a normal square app icon.

### Safe-zone rule

- Keep all critical logo shapes inside the center `80%` of the canvas.
- On a `512x512` export, keep the important mark inside roughly `410x410`.
- The background can fill the full square.
- Do not let clock hands or outer ring touch the edges.

### Best approach

- Use the rounded-square or full-square blue/gradient tile.
- Center the white clock mark inside it.
- Do not include the wordmark.

## 7. Practical Naming Convention

Use this naming format consistently:

```text
miqat-[asset]-[variant]-[theme].[ext]
```

Examples:

```text
miqat-logo-horizontal-light.svg
miqat-logo-horizontal-dark.svg
miqat-wordmark-light.svg
miqat-mark-dark.svg
favicon-light.svg
favicon-dark.svg
icon-512-maskable.png
```

## 8. Recommended Production Workflow

### Step 1

Build the master system in Illustrator:

- Create the icon mark.
- Create the Arabic wordmark.
- Create the horizontal lockup.
- Create the app tile.

### Step 2

Create both UI-theme logo variants:

- Light asset for dark backgrounds.
- Dark asset for light backgrounds.

### Step 3

Create the compact icon system:

- Simplified favicon mark.
- Stable app tile icon.
- Monochrome pinned-tab icon.

### Step 4

Export SVG first, then export PNG sizes from the same masters.

### Step 5

Generate `favicon.ico` from the exported `16x16`, `32x32`, and `48x48` PNG versions.

Important: Illustrator is excellent for the source artwork, SVG, and PNG exports, but `.ico` is usually generated after export using a converter or an asset pipeline step.

## 9. Recommended Asset Behavior In This Repo

This repo already expects some icon paths, so the new package should respect the current structure.

### Paths already used by the app

- `src/app/manifest.js` already uses:
  - `/icons/icon-192.svg`
  - `/icons/icon-192.png`
  - `/icons/icon-512.svg`
  - `/icons/icon-512.png`
  - `/icons/icon-512-maskable.png`
- `public/sw.js` already caches `/favicon.ico`.
- Structured data and page metadata currently reference `/icons/icon-512.png` in several places.

### Important implementation note

The current manifest theme color is `#4ECDC4`, which does not match the current blue brand system. When the new icons are implemented, it would be better to align the manifest theme color with the live brand palette.

## 10. Future Code Updates After Assets Are Ready

Once the designer exports the files, update the app in these places:

| File | Why |
|---|---|
| `src/app/layout.tsx` | Add explicit metadata icon links |
| `src/app/manifest.js` | Keep manifest icon list aligned with shipped files |
| `public/sw.js` | Ensure cached root icon files stay correct |
| `src/components/layout/header.jsx` | Optional future use of real SVG logo in header |
| `src/components/layout/Footer.jsx` | Optional future use of exported logo asset in footer |

### Suggested metadata setup

When you wire the icons later, this is the right direction:

```ts
icons: {
  icon: [
    { url: '/icons/favicon-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
    { url: '/icons/favicon-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
    { url: '/favicon.ico', sizes: 'any' },
  ],
  apple: [
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
  other: [
    { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1D4ED8' },
  ],
}
```

If you prefer one single theme-aware SVG instead of two separate SVG files, `favicon.svg` can contain `prefers-color-scheme` styles inside the SVG itself.

## 11. QA Checklist Before Shipping

Use this checklist before adding the assets to production:

- The favicon is readable at `16x16`.
- The mark is recognizable at `32x32`.
- The small icon has enough inner padding.
- The light logo is clean on dark backgrounds.
- The dark logo is clean on light backgrounds.
- The app tile remains clear without the wordmark.
- The maskable icon keeps the symbol inside the safe zone.
- The Safari pinned tab works as a one-color shape.
- All SVG exports are optimized and clean.
- All PNG exports are crisp, not blurry.
- `favicon.ico`, `apple-touch-icon.png`, and manifest icons all exist at the exact final paths.

## 12. Final Deliverables Checklist

This is the exact handoff package I recommend:

### Source package

- `miqat-brand-master.ai`
- `miqat-brand-master.pdf`

### Web logo package

- `miqat-logo-horizontal-light.svg`
- `miqat-logo-horizontal-dark.svg`
- `miqat-wordmark-light.svg`
- `miqat-wordmark-dark.svg`
- `miqat-mark-light.svg`
- `miqat-mark-dark.svg`

### Browser and favicon package

- `favicon.ico`
- `favicon.svg`
- `favicon-light.svg`
- `favicon-dark.svg`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `favicon-64x64.png`
- `safari-pinned-tab.svg`

### Device and PWA package

- `apple-touch-icon.png`
- `icon-192.svg`
- `icon-192.png`
- `icon-512.svg`
- `icon-512.png`
- `icon-512-maskable.png`
- `icon-1024.png`

If you want the cleanest professional setup, build the logo system once in Illustrator, export the full package above, store sources under `/design/brand/source`, and store runtime assets under `/public/brand`, `/public/icons`, and the root-level `public` icon files.
