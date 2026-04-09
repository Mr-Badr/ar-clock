# Miqatona Routes And Sitemap Inventory

Canonical production domain: `https://miqatona.com`

Primary robots URL:
- `https://miqatona.com/robots.txt`

Primary sitemap submission URL:
- `https://miqatona.com/sitemap-index.xml`

## Public Pages

### Core pages
- `/` — homepage
- `/about`
- `/contact`
- `/privacy`
- `/disclaimer`
- `/map`
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
- `/economie/sitemap.xml`
- `/holidays/sitemap.xml`
- `/time-difference/sitemap.xml`
- `/date/sitemap.xml`
- `/date/gregorian/sitemap.xml`
- `/date/hijri/sitemap.xml`

### Date child sitemap routes
- `/date/sitemaps/static`
- `/date/sitemaps/countries`
- `/date/sitemaps/calendars`

### Country-sharded sitemap routes
- `/time-now/sitemap/[country].xml`
- `/mwaqit-al-salat/sitemap/[country].xml`

## Sitemap Coverage Map

### Covered by `/sitemap.xml`
- `/`
- `/time-now`
- `/mwaqit-al-salat`
- `/holidays`
- `/time-difference`
- `/map`
- `/about`
- `/disclaimer`
- `/privacy`
- `/contact`

### Covered by `/economie/sitemap.xml`
- `/economie`
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

### Covered by `/time-now/sitemap/[country].xml`
- `/time-now/[country]`
- `/time-now/[country]/[city]`

### Covered by `/mwaqit-al-salat/sitemap/[country].xml`
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

### Covered by `/date/gregorian/sitemap.xml`
- `/date/[year]/[month]/[day]` for current year ±1

### Covered by `/date/hijri/sitemap.xml`
- `/date/hijri/[year]/[month]/[day]` for current Hijri year ±1

## Intentionally Not In Sitemaps

- `/offline` — utility/offline fallback page
- `/date/country` — redirects to a detected country page
- `/date/calendar` — redirects to the current Gregorian year calendar
- `/date/calendar/hijri` — redirects to the current Hijri year calendar
- API routes under `/api/*`
- metadata/image/helper routes such as Open Graph image handlers

## Google Search Console Submission List

Submit this main sitemap:
- `https://miqatona.com/sitemap-index.xml`

Optional manual submissions:
- `https://miqatona.com/sitemap.xml`
- `https://miqatona.com/economie/sitemap.xml`
- `https://miqatona.com/holidays/sitemap.xml`
- `https://miqatona.com/time-difference/sitemap.xml`
- `https://miqatona.com/date/sitemap.xml`
- `https://miqatona.com/date/gregorian/sitemap.xml`
- `https://miqatona.com/date/hijri/sitemap.xml`
- `https://miqatona.com/date/sitemaps/static`
- `https://miqatona.com/date/sitemaps/countries`
- `https://miqatona.com/date/sitemaps/calendars`

Do not submit country shard sitemaps manually unless you have a specific reason. They are already discoverable from the root sitemap index.
