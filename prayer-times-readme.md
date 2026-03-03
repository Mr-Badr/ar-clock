# Mwaqit Al-Salat (Prayer Times) Prototype

A high-performance, Next.js 16 App Router prototype for calculating and displaying prayer times using pure server-side rendering (SSR/ISR). Built strictly to adhere to Next.js SEO best practices while delivering an instant "zero-latency" feel to end-users via the edge network.

## How to Run
1. Ensure the `adhan` library is installed to support accurate server-side time math: 
   ```bash
   npm install adhan
   ```
2. Start the development server: 
   ```bash
   npm run dev
   ```
3. Visit the dynamic route test page: 
   `http://localhost:3000/mwaqit-al-salat/morocco/rabat`
4. Inspect the source code (`Cmd+Option+U`): Notice that the raw HTML contains the active, computed ISO prayer times inside structural `<time>` tags, and the JSON-LD schemas embedded without needing to run any JS payload.

## Extending the City Database
The prototype uses a hardcoded associative lookup (`src/example-data/cities.js`). In a production environment:
- Replace `getCityData(country, city)` with a DB ORM hit (e.g., `db.city.findUnique({ where: { slug: city } })`) or an external REST call to your Geo service.
- Because `dynamicParams = true` is architected into the main page layout, any new city added to your database will automatically generate its page on the very first user hit without requiring a lengthy redeploy.

## Sitemap Generation Strategy
SEO demands crawlable indexes across millions of dynamically computed cities. Deploy an `app/sitemap.js` file:
```javascript
export default async function sitemap() {
  // Execute a targeted database fetch grouping thousands of slugs efficiently
  const cities = await db.city.findMany({ select: { slug: true, countrySlug: true } });
  
  return cities.map(city => ({
    url: `https://yourdomain.com/mwaqit-al-salat/${city.countrySlug}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));
}
```

## Testing On-Demand Revalidation
If coordinates, time-zones, or Daylight Savings transitions shift and you cannot wait for the 86,400-second ISR cache invalidation, bust it globally on demand:
```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=dev_secret&path=/mwaqit-al-salat/morocco/rabat"
```
