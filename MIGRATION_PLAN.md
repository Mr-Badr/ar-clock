# 🏗️ Events Data Architecture — Migration Plan

**Status:** Modularized for better performance and safety.

The migration plan has been split into smaller, focused documents to ensure safety and improve maintainability. Please follow the phases in order:

---

## 🗺️ Roadmap & Audit
- [**00 — Migration Overview**](./migration/00_OVERVIEW.md)
  *Audit findings, Roadmap, and Checklist.*

---

## 🛠️ Implementation Phases

1. [**Phase 1 — Data Split**](./migration/01_DATA_SPLIT.md)
   *Moving event data from the engine to modular files.*

2. [**Phase 2 — Date System Overhaul**](./migration/02_DATE_SYSTEM.md)
   *Infinite future-proofing with `replaceTokens` and `_dynamic` flags.*

3. [**Phase 3 — Rich Content by Country**](./migration/03_RICH_CONTENT.md)
   *Reorganizing content into country-specific files.*

4. [**Phase 4 — Hijri Engine Improvements**](./migration/04_HIJRI_ENGINE.md)
   *Accuracy, resolver optimization, and API speed.*

5. [**Phase 5 — Filtering Correctness**](./migration/05_FILTERING.md)
   *Fixes for Category, Country, and TimeRange filters.*

6. [**Phase 6 — Production Arabic SEO**](./migration/06_SEO.md)
   *Dynamic JSON-LD, RTL best practices, and Sitemap.*

---

## 📋 Resources
- [**Slug Inventory (57 slugs)**](./migration/APPENDIX_SLUGS.md)
- [**How to Add a New Country**](./migration/00_OVERVIEW.md#adding-a-new-country)
