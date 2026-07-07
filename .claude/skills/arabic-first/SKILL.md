---
name: arabic-first
description: "Arabic language, culture, and regional rules. Use when writing Arabic content, handling RTL direction, formatting dates or numbers or currency, targeting specific Arabic markets, building bilingual features, or testing with Arabic text input. Covers: MSA writing, regional differences, BiDi forms, trust signals."
---

# Arabic First

## 1. Arabic Is the Origin Language — Not a Translation
- This product is designed for Arabic speakers — Arabic is not a localization of an English product
- Never build the app in English and translate it — the structural assumptions of English design (LTR layout, Western idioms, Latin typography) create problems that translation cannot fix
- Every content decision, every layout decision, every naming decision is made with an Arabic reader as the primary user
- Arabic is the 5th most spoken language in the world and the primary language of some of the world's highest internet penetration markets (UAE 99%, Saudi Arabia 98%)

## 2. Writing in Modern Standard Arabic
- Use Modern Standard Arabic (MSA) for all formal, professional, and product content — it is understood across all 22 Arabic-speaking countries
- MSA is the correct choice when the app targets a broad Arabic-speaking audience rather than one specific country
- Colloquial dialects may be used for very casual microcopy (notifications, onboarding) when targeting a single country audience — never in formal content, never in headings, never in metadata
- Avoid Arabizi (Arabic written in Latin characters with numbers) — it is appropriate for WhatsApp but signals low quality in a product interface
- Never mix Arabic and English in the same sentence — it reads as careless and undermines both language registers
- If a technical term has no established Arabic equivalent, use the English term in parentheses after the Arabic explanation on first use, then use the Arabic from then on

## 3. Arabic Grammar and Style Quality
- AI-generated Arabic contains subtle but noticeable grammatical errors: broken gender agreement, incorrect verb conjugations, awkward preposition choices
- These errors are immediately detected by native Arabic readers and destroy credibility faster than any design flaw
- Every piece of Arabic content must be reviewed by a native speaker before it goes to production
- Subject-verb agreement in Arabic is complex — singular subjects take singular verbs but plural non-human subjects take feminine singular verbs; this rule is frequently violated by AI output
- Dual forms (مثنى) are rarely produced correctly by AI — verify them manually when content refers to two of something
- Broken plural forms (جمع التكسير) are a frequent AI weakness — validate every plural noun in content

## 4. RTL Direction Is the Structural Foundation
- Every HTML element that wraps Arabic content must have `dir="rtl"` set — either at the root `<html>` level or on the containing element
- CSS logical properties (`margin-inline-start`, `padding-inline-end`, `border-inline-end`) automatically adapt to direction — use them instead of physical properties (`margin-left`, `padding-right`) wherever possible
- Physical CSS properties for spacing (`margin-left`, `padding-right`) must be reviewed when content switches between RTL and LTR to ensure they do not produce mirrored spacing bugs
- Text alignment defaults to right — never set `text-align: right` explicitly in Arabic layouts, let the direction cascade handle it naturally

## 5. Numbers, Dates, and Currency
- Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩) are used in Arabic-language formal and editorial content
- Western Arabic numerals (0-9) are used in: technical content, form inputs, URLs, code, and any context where the user must type the number
- Never mix numeral systems in the same UI element — pick one and be consistent per context
- Date format across most Arabic markets: day/month/year — not month/day/year
- During Ramadan and Islamic holidays, displaying the Hijri date alongside the Gregorian date builds cultural credibility
- Currency must display in the local currency of the target country with the correct symbol placement — do not default to USD or EUR for Arabic-market pricing pages
- Large numbers use Arabic thousand separators — verify formatting in the local convention of the target country

## 6. Regional Market Differentiation
- Arabic-speaking markets are 22 countries with distinct vocabulary, cultural references, payment preferences, and regulatory requirements
- Saudi Arabia: formal MSA is expected, Vision 2030 references resonate strongly, PaymentsTechnology (Mada, Apple Pay) is dominant
- Egypt: largest Arabic-speaking internet population, Ammiya (Egyptian dialect) is understood across the region and can be used for informal microcopy
- Morocco: French co-exists with Arabic, Darija (Moroccan dialect) is common in informal contexts, payments are more cash-reliant
- UAE: highly international audience, English is widely used alongside Arabic, luxury and innovation positioning works well
- If targeting a single country, use that country's specific vocabulary, regional holidays, and cultural references — generic pan-Arab content performs less well than locally specific content

## 7. Arabic SEO Keyword Reality
- Arabic keywords are not translated English keywords — the search volume, competition, and intent behind them are completely different
- Research keywords using actual Arabic-language search behavior: Google Search Console data from Arabic markets, Google Autocomplete in Arabic, Arabic-language keyword research tools
- Long-tail Arabic queries follow natural conversational question structures: "كيف أفعل X" , "ما هو أفضل Y", "هل يمكنني Z" — match these structures
- Saudi users, Egyptian users, and Moroccan users may search for the same concept using entirely different words — consider whether to target multiple regional variants or commit to one
- Voice search in Arabic is growing rapidly across the Gulf — optimize for spoken question formats

## 8. Trust Signals for Arabic Users
- Phone number as a contact option is strongly expected — email-only contact is seen as evasive in many Arabic markets
- WhatsApp contact is a major trust signal in most Arabic markets — it signals a real business with real people
- Displaying pricing in local currency builds trust immediately — foreign currency pricing creates friction and uncertainty
- Social proof from recognized Arabic-speaking individuals, companies, or organizations performs significantly better than generic international social proof
- Company registration information, physical address, and regulatory compliance details build disproportionate trust with Arabic business users who have been burned by unregulated online services
- Religious sensitivity must be considered: avoid scheduling major campaigns or sales events to coincide with Friday prayers, Ramadan fasting hours, or major Islamic holidays without adapting the message appropriately

## 9. Bilingual and Multilingual Handling
- Every Arabic page must have `lang="ar"` on the `<html>` element and `dir="rtl"` — these are not optional
- If the site supports multiple languages, `hreflang` tags must be correct — the Arabic page points to itself with `hreflang="ar"`, not to the English page
- Language switching must be seamless — the user switching from Arabic to English (or reverse) must land on the equivalent page, not the homepage
- Never auto-translate Arabic content to another language for the site — produce original content in each language
- Canonical tags must be language-specific — Arabic and English versions of the same content must each have their own canonical pointing to themselves

## 10. Testing Arabic Content With Real Users
- Automated testing catches technical RTL bugs but never catches cultural and linguistic quality problems
- At minimum, every major content piece must be read by one native Arabic speaker before publishing
- UI layout must be tested with real Arabic content — testing with Lorem Ipsum text misses all text overflow, wrapping, and spacing issues that appear with actual Arabic words
- Test multi-language switching under realistic conditions — switching keyboards mid-session is normal behavior for Arabic users
- Test form inputs with Arabic text, mixed Arabic/English text, and pure numbers — BiDi input causes unexpected behavior in forms that look perfect in development