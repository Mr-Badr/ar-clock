# Miqatona Routes And Sitemap Inventory

Canonical production domain: `https://miqatona.com`

Primary robots URL:
- `https://miqatona.com/robots.txt`

Primary sitemap submission URL:
- `https://miqatona.com/sitemap-index.xml`

## Public Pages

### Core pages
- `/` — homepage
- `/fahras`
- `/about`
- `/contact`
- `/privacy`
- `/disclaimer`
- `/offline`

### Time now
- `/time-now`
- `/time-now/[country]`
- `/time-now/[country]/[city]`

### Prayer times
- `/mwaqit-al-salat`
- `/mwaqit-al-salat/[country]`
- `/mwaqit-al-salat/[country]/[city]`

### Holidays
- `/holidays`
- `/holidays/[slug]`

### Time difference
- `/time-difference`
- `/time-difference/[from]/[to]`

### Date
- `/date`
- `/date/today`
- `/date/today/hijri`
- `/date/today/gregorian`
- `/date/converter`
- `/date/gregorian-to-hijri`
- `/date/hijri-to-gregorian`
- `/date/country` — redirect helper
- `/date/country/[countrySlug]`
- `/date/calendar` — redirect helper
- `/date/calendar/[year]`
- `/date/calendar/hijri` — redirect helper
- `/date/calendar/hijri/[year]`
- `/date/[year]/[month]/[day]`
- `/date/hijri/[year]/[month]/[day]`

### Economy
- `/economie`
- `/economie/us-market-open`
- `/economie/gold-market-hours`
- `/economie/forex-sessions`
- `/economie/stock-markets`
- `/economie/market-clock`
- `/economie/best-trading-time`

## Sitemap Routes

### Root sitemap layer
- `/robots.txt`
- `/sitemap-index.xml`
- `/sitemap.xml`

### Feature sitemaps
- `/calculators/sitemap.xml`
- `/economie/sitemap.xml`
- `/holidays/sitemap.xml`
- `/time-difference/sitemap.xml`
- `/time-now/sitemap.xml`
- `/mwaqit-al-salat/sitemap.xml`
- `/date/sitemap.xml` — feature-local diagnostic index
- `/date/gregorian/sitemap.xml` — intentionally empty in bridge mode
- `/date/hijri/sitemap.xml` — intentionally empty in bridge mode

### Date child sitemap routes
- `/date/sitemaps/static`
- `/date/sitemaps/countries`
- `/date/sitemaps/calendars`

## Sitemap Coverage Map

### Covered by `/sitemap.xml`
- `/`
- `/fahras`
- `/time-now`
- `/mwaqit-al-salat`
- `/holidays`
- `/time-difference`
- `/calculators`
- `/calculators/sleep`
- `/calculators/personal-finance`
- `/calculators/finance`
- `/economie/market-hours`
- `/about`
- `/editorial-policy`
- `/terms`
- `/disclaimer`
- `/privacy`
- `/contact`

### Covered by `/calculators/sitemap.xml`
- `/calculators`
- `/calculators/sleep`
- `/calculators/sleep/bedtime`
- `/calculators/sleep/wake-time`
- `/calculators/sleep/sleep-duration`
- `/calculators/sleep/nap-calculator`
- `/calculators/sleep/sleep-debt`
- `/calculators/sleep/sleep-needs-by-age`
- `/calculators/personal-finance`
- `/calculators/personal-finance/emergency-fund`
- `/calculators/personal-finance/debt-payoff`
- `/calculators/personal-finance/savings-goal`
- `/calculators/personal-finance/net-worth`
- `/calculators/finance`
- `/calculators/age`
- `/calculators/age/*`
- `/calculators/building`
- `/calculators/building/cement`
- `/calculators/building/rebar`
- `/calculators/building/tiles`
- `/calculators/building/[country]`
- `/calculators/end-of-service-benefits`
- `/calculators/monthly-installment`
- `/calculators/vat`
- `/calculators/percentage`

### Covered by `/sitemap.xml` via priority paths
- `/guides/emergency-fund`
- `/guides/how-to-compare-loan-offers`
- `/guides/fixed-vs-reducing-loan-rate`
- `/guides/vat-inclusive-vs-exclusive-price`
- `/guides/what-is-vat-input-vs-output-tax`
- `/guides/how-to-calculate-percentage-discount`
- `/guides/percentage-change-vs-percentage-points`
- `/guides/how-many-cement-bags-do-i-need`
- `/guides/how-to-estimate-rebar-weight`
- `/guides/end-of-service-benefits-saudi`
- `/guides/resignation-vs-contract-end-gratuity`
- `/guides/what-is-a-sleep-cycle`
- `/guides/how-many-hours-of-sleep-do-i-need`
- `/guides/best-nap-length`
- `/guides/sleep-debt-explained`
- `/guides/why-am-i-tired-after-sleeping`
- `/guides/how-long-does-it-take-to-fall-asleep`
- `/guides/rem-vs-deep-sleep`
- `/guides/sleep-hygiene-basics`
- `/guides/debt-payoff-methods`
- `/guides/how-much-save-monthly`
- `/guides/net-worth-explained`
- `/guides/how-many-months-emergency-fund`
- `/guides/how-to-pay-off-debt-fast`
- `/guides/save-for-goal`
- `/guides/assets-vs-liabilities`
- `/guides/when-does-us-market-open`
- `/guides/what-are-forex-sessions`
- `/guides/best-time-to-trade-gold`
- `/guides/how-to-read-market-clock`

### Covered by `/economie/sitemap.xml`
- `/economie`
- `/economie/market-hours`
- `/economie/us-market-open`
- `/economie/gold-market-hours`
- `/economie/forex-sessions`
- `/economie/stock-markets`
- `/economie/market-clock`
- `/economie/best-trading-time`

### Covered by `/holidays/sitemap.xml`
- `/holidays/[slug]`
- holiday alias slugs generated from the manifest

### Covered by `/time-difference/sitemap.xml`
- `/time-difference`
- popular `/time-difference/[from]/[to]` pairs from the data source

### Covered by `/time-now/sitemap.xml`
- `/time-now/[country]`
- `/time-now/[country]/[city]`

### Covered by `/mwaqit-al-salat/sitemap.xml`
- `/mwaqit-al-salat/[country]`
- `/mwaqit-al-salat/[country]/[city]`

### Covered by `/date/sitemaps/static`
- `/date`
- `/date/today`
- `/date/today/hijri`
- `/date/today/gregorian`
- `/date/converter`
- `/date/hijri-to-gregorian`
- `/date/gregorian-to-hijri`

### Covered by `/date/sitemaps/countries`
- `/date/country/[countrySlug]`

### Covered by `/date/sitemaps/calendars`
- `/date/calendar/[year]`
- `/date/calendar/hijri/[year]`

## Intentionally Not In Sitemaps

- `/offline` — utility/offline fallback page
- `/date/country` — redirects to a detected country page
- `/date/calendar` — redirects to the current Gregorian year calendar
- `/date/calendar/hijri` — redirects to the current Hijri year calendar
- `/date/[year]/[month]/[day]` — bridge mode keeps daily Gregorian date pages reachable but not submitted
- `/date/hijri/[year]/[month]/[day]` — bridge mode keeps daily Hijri date pages reachable but not submitted
- API routes under `/api/*`
- metadata/image/helper routes such as Open Graph image handlers

## Google Search Console Submission List

Recommended steady-state submission:
- `https://miqatona.com/sitemap-index.xml`

Optional temporary diagnostic submissions:
- `https://miqatona.com/sitemap.xml`
- `https://miqatona.com/economie/sitemap.xml`
- `https://miqatona.com/holidays/sitemap.xml`
- `https://miqatona.com/time-difference/sitemap.xml`
- `https://miqatona.com/time-now/sitemap.xml`
- `https://miqatona.com/mwaqit-al-salat/sitemap.xml`
- `https://miqatona.com/date/sitemaps/static`
- `https://miqatona.com/date/sitemaps/countries`
- `https://miqatona.com/date/sitemaps/calendars`
- `https://miqatona.com/date/sitemap.xml` — optional feature-local diagnostic index
