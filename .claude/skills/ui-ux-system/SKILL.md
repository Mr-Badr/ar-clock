---
name: ui-ux-system
description: "Premium Arabic UI and UX design rules. Use when building layouts, navigation, typography, forms, loading states, empty states, mobile interfaces, or any visual component. Covers: RTL architecture, BiDi content, Arabic typography rules, mobile-first, touch targets, cultural design, accessibility."
---

# UI/UX System Rules

## 1. Arabic RTL Is the Architecture — Not a Feature
- RTL is not applied after building the LTR version — it is the base architecture from which everything is designed
- The entire visual hierarchy is mirrored: the most important element is top-right, reading flows right to left, layouts progress from right to left
- Building LTR and then "flipping" it creates structural problems that are expensive to fix and always feel wrong to native Arabic readers
- Eye-tracking studies on Arabic users confirm the F-shaped reading pattern but starting from the top-right corner — all primary content and CTAs must respect this
- Users hold phones in their right hand — navigation and primary actions that sit in the bottom-right quadrant are the easiest to reach with the right thumb

## 2. RTL Layout Rules — Precise and Complete
- Primary navigation is on the right side of the page, with sub-menus expanding to the left
- Back buttons point to the right (toward where the user came from in RTL space), forward buttons point to the left
- Progress bars fill from right to left
- Sliders move from right (start) to left (end)
- Carousels and image galleries slide from right to left — the next item is to the left, the previous item is to the right
- Form fields have labels on the right, input fields expand to the left
- Dropdown menus open below and align to the right edge of the trigger element
- Primary CTA buttons are positioned on the right side of button groups and form footers — right is where the Arabic eye lands first
- Breadcrumbs read from right (most general) to left (most specific) with separators pointing left
- Icons that imply direction must be mirrored: chevrons, arrows, play indicators, and navigation arrows
- Icons that are universal and direction-agnostic must NOT be mirrored: logos, social media icons, play/pause buttons, hearts, stars, search magnifiers

## 3. Bidirectional (BiDi) Content Handling
- Arabic interfaces always contain a mix of RTL Arabic and LTR content (URLs, emails, numbers, brand names, code)
- Numbers always display in LTR order even inside RTL Arabic text — this is a Unicode standard behavior
- Email addresses and URLs remain LTR even in an Arabic interface
- Brand names in Latin script remain LTR within Arabic sentences
- Phone numbers display with digit order LTR but are right-aligned in their container
- Form inputs for email, URL, and phone number fields should be explicitly set to LTR direction regardless of the page direction
- Mixed-direction content must be explicitly tested with real Arabic text input — automated tests miss most BiDi edge cases

## 4. Arabic Typography — Non-Negotiable Rules
- Arabic text must be 10–15% larger than equivalent Latin text to achieve the same legibility — if the English body size is 16px, Arabic body size must be at least 18px
- Minimum line height for Arabic body text is 1.8 — Arabic characters have diacritical marks above and below the baseline that need vertical breathing room
- Never apply letter-spacing to Arabic text — Arabic is a connected script and added spacing visually breaks the letter connections, making words unreadable
- Never use italic for Arabic — italic does not exist in Arabic typography and the browser's synthetic italic looks visually broken
- Never use font weights below 400 (Regular) for Arabic body text — lighter weights become illegible on screens, especially on mobile
- Use weight 600 or higher for Arabic headings — Arabic bold weights are visually heavier than Latin equivalents at the same weight
- Do not justify Arabic body text — justification creates large irregular gaps between Arabic words that disrupt reading flow
- Recommended production fonts: Cairo, Tajawal, IBM Plex Sans Arabic, Noto Sans Arabic — all support full Arabic subsets and render correctly across all devices
- Load only the weights you actually use — every unused font weight adds unnecessary download bytes

## 5. Spacing and Layout for Arabic Readers
- Arabic text typically expands 20–30% wider than its English equivalent at the same font size — all containers must be designed to accommodate this
- Never constrain a text container so tightly that Arabic text clips, overflows, or wraps at awkward points
- Card components, buttons, and navigation items must be sized for the longest expected Arabic label, not the average
- Whitespace between sections is critical for Arabic readability — Arabic readers rely heavily on visual breathing room to separate content blocks
- Padding inside interactive elements (buttons, inputs, tags) must be generous — Arabic characters are taller and wider than Latin characters

## 6. Mobile Is the Primary Surface
- Over 85% of Arabic-speaking internet users are on mobile — every design decision defaults to mobile first
- Minimum touch target size: 44×44 pixels — anything smaller causes mis-taps and frustration
- Never place important actions at the bottom of a long scroll — they will never be seen by most users
- Bottom navigation bars are preferred for Arabic mobile apps — they place primary actions within thumb reach for right-hand phone holders
- Modals must be dismissible by tapping outside or by a clearly visible close button — trapping users in a modal is a high-frustration pattern
- Horizontal scroll is acceptable for carousels — never require horizontal scrolling for main content
- Test on real Android devices on a real 4G connection — most Arabic mobile users are not on flagship iPhones on Wi-Fi

## 7. Performance Is a UX Requirement, Not a Metric
- A page that takes more than 3 seconds to show content loses over 50% of mobile visitors before they see anything
- Every 1-second delay in mobile load time reduces conversions by up to 20% (Google data)
- Skeleton loaders must be shown immediately — the user must see something structural within 100ms of navigation
- Skeleton shapes must match the real content shape — a generic grey rectangle is not an acceptable skeleton for a card with an image, title, and description
- Layout shift after content loads (images jumping in, fonts swapping) is a direct negative UX event — eliminate all sources of CLS

## 8. Visual Consistency and Premium Quality
- A premium Arabic app is not a template — every visual decision must feel intentional
- Use a maximum of 3 primary colors and 2 accent colors — more than this creates visual noise
- Every interactive element (button, link, input, card) must have distinct default, hover, focus, active, and disabled states
- Focus indicators must be visible and clearly styled — never remove the browser default focus ring without providing a better one
- Error states, success states, and warning states must all be visually designed — they must feel part of the app, not like system OS dialogs
- Loading states must be designed — skeleton loaders that match content shape, not generic spinners on blank white backgrounds
- Empty states must include an illustration or meaningful icon, a clear explanatory heading in Arabic, and an action the user can take

## 9. Culturally Resonant Design for Arabic Audiences
- Warm tones (gold, deep green, burgundy, navy) resonate strongly with Arabic-speaking markets — cold tech blues and greys feel generic
- Geometric patterns inspired by Islamic art can be used sparingly as subtle background textures or section dividers — they signal cultural authenticity without being garish
- Avoid imagery that conflicts with the cultural values of the target audience — family imagery, professional settings, and aspirational but modest success scenes perform best
- Green carries specific religious significance in many Arabic markets — use it with intentionality, not as a generic positive-action color
- Photography of Arabic users in real-world regional contexts builds trust faster than stock photos of Western models
- Arabic calligraphic elements used as graphic design accents (not as functional text) signal premium cultural positioning

## 10. Form and Input Design
- Form labels must be visible at all times — placeholder text disappears on focus and is not an accessible substitute for a label
- For Arabic forms, the label should appear to the right of the input field, with the field expanding left
- Inline validation must appear as the user types, not only on submit — real-time feedback prevents frustration and abandonment
- Error messages must be written in Arabic and explain specifically what is wrong and how to fix it
- Multi-column forms in RTL read the right column first, then the left — tab order must match this reading direction
- Supporting bi-directional input is required — Arabic users switch between Arabic and English keyboards within the same session, sometimes within the same input field

## 11. Navigation Must Never Confuse
- The user must always know where they are in the site — active navigation states must be visually clear and distinct
- Breadcrumbs are required on any page more than one level deep from the homepage
- The site header must be consistent across all pages — a header that changes shape, content, or position on different pages destroys spatial orientation
- Search must be accessible from every page — not hidden in a footer, not behind a secondary menu
- Multi-step flows (checkout, onboarding, forms) must show a clear progress indicator so users know where they are and how much remains

## 12. Accessibility in Arabic Interfaces
- Color contrast ratio must be at least 4.5:1 for normal text and 3:1 for large text — low contrast is especially damaging for Arabic text with its complex letterforms
- Screen readers must handle RTL content correctly — test with NVDA or VoiceOver with Arabic language settings
- Never convey information using color alone — always pair with an icon, text label, or pattern
- All form fields must have explicit `<label>` elements associated by `for`/`id` — screen readers skip placeholders
- Test keyboard navigation in RTL mode — tab order must follow the visual reading order right to left