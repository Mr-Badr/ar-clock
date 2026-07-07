---
name: architecture-rules
description: "Codebase structure and organization rules. Use when creating folders, naming components or hooks or utilities, adding dependencies, designing API routes, managing state, or organizing features. Covers: folder structure, naming conventions, separation of concerns, pre-merge checklist."
---

# Architecture Rules

## 1. Structure Communicates Intent
- A codebase that is easy to navigate is a codebase that is easy to maintain — the folder structure must tell a new developer what the app does within 60 seconds
- Feature folders group everything related to one feature together — not split by technical type across the codebase
- The distinction between what belongs in `components/`, `lib/`, and `app/` must be explicit and consistently respected
- When a new developer asks "where does this go?", the answer must be obvious from the existing structure

## 2. Component Responsibility
- A component does exactly one thing — if you cannot describe it in one sentence without using "and", it needs to be split
- Data fetching is a responsibility — it belongs in Server Components, hooks, or API routes, not inside UI components
- Rendering is a responsibility — it belongs in components, which receive data as props and produce markup
- A component that both fetches data and renders complex UI is two components merged into one — split them
- Components beyond 150 lines of JSX logic are a sign of a missing split — identify the distinct responsibilities and separate them

## 3. Data Flows Down
- Parent components fetch data and pass it to children via props — children do not independently re-fetch the same data
- Children communicate back to parents only through explicit callback props — never through shared global state without a pattern
- Server Components pass data to Client Components via props — Client Components do not fetch server data through their own effect hooks when a Server Component above them already has it
- Avoid prop drilling beyond 2 levels — if a value needs to travel through 3+ levels of props, introduce a Context or a state management solution

## 4. Naming Is Precise and Consistent
- Component names are nouns describing what they render: `ArticleCard`, `UserAvatar`, `PricingTable`, `SearchInput`
- Hook names start with `use` and describe what they manage: `useArticleData`, `useAuthState`, `useScrollPosition`
- Utility functions describe their return value: `formatArabicDate`, `slugify`, `truncateText`, `parseQueryParams`
- Boolean variables and props are phrased as present-tense assertions: `isLoading`, `hasError`, `canSubmit`, `isVisible`
- Event handler functions start with `handle`: `handleSubmit`, `handleDelete`, `handlePageChange`
- Never abbreviate unless the abbreviation is universally understood in the codebase — `err` for `error` is fine; `usrPrflDt` is not

## 5. Absolute Imports Over Relative Imports
- Absolute imports using configured path aliases are mandatory — relative imports that climb multiple directories are fragile
- A file moved to a different folder breaks every relative import that pointed to it — absolute imports are unaffected by file location
- Configure path aliases in `tsconfig.json` and use them consistently across the entire codebase

## 6. No Dead Code in Production
- Commented-out code must not exist in the main branch — it creates confusion about what is active and what is not
- Unused imports must be removed — they bloat bundles and signal lack of care
- `console.log`, `console.warn`, and `console.error` used for debugging must not reach production — use a proper logging utility or remove them
- `TODO` and `FIXME` comments in production code must have a corresponding issue/ticket reference — floating TODOs are forgotten permanently
- Features being removed must be removed completely, not left in place but disabled — disabled code is still read, still confuses, still causes merge conflicts

## 7. Constants and Configuration Are Centralized
- No URL, API endpoint, revalidation time, magic number, or configuration value is hardcoded inline in a component or route
- All configuration lives in a single constants file or environment variable system
- When a value needs to change, it changes in one place and propagates everywhere — scattered inline values require hunting through the entire codebase

## 8. Separation of Concerns
- Business logic (validation, calculation, transformation) does not belong inside JSX components — extract it to pure functions in `lib/`
- Formatting logic (date formatting, number formatting, text truncation) is always centralized — never duplicated across components
- Authentication logic does not live in individual pages — it belongs in middleware or a dedicated auth layer
- Error handling logic is never ad-hoc per component — it follows the patterns established in `error-resilience.md`

## 9. Dependencies Must Be Justified
- Every added package must solve a real problem that the existing codebase and native platform APIs cannot solve
- Check the existing codebase before adding a dependency — the project may already have something that does it
- Consider: package size, maintenance status (last commit, open issues), Next.js App Router compatibility, and whether it requires `"use client"` unnecessarily
- A package that saves 10 lines of code but adds 50KB to the bundle is not worth it
- Packages that have not been updated in over a year for any active feature are a maintenance risk

## 10. API Routes Follow a Consistent Contract
- Every API route returns the same shape for success (`{ data: ... }`) and the same shape for failure (`{ error: "..." }`)
- Inconsistent API response shapes force every consumer to handle them differently — consistency enables shared error handling
- Every API route validates its inputs before using them
- Every API route is wrapped in try/catch — unhandled promise rejections in API routes crash the server process
- No API route exposes internal error details, stack traces, or database errors to the client

## 11. State Management Belongs in the Right Layer
- Component-local UI state (open/closed, active tab, hover state) belongs in component state — do not put it in a global store
- Feature-shared state (user selections, filter state shared between a search bar and results) belongs in a feature-level context or store
- Server state (data fetched from APIs) belongs in the Server Component layer or a dedicated data-fetching hook — not in a global client state store where it becomes stale
- Global application state (auth, theme, language direction) belongs in a root-level context or store
- Never duplicate server state into client state — it creates two sources of truth that will inevitably diverge

## 12. Pre-Merge Checklist
- Does this change affect any shared component, layout, or utility used by multiple features?
- Does this change affect the SEO metadata of any existing page?
- Does every new page have an `error.tsx`, `loading.tsx`, and metadata export?
- Is all external data access guarded with optional chaining and fallback values?
- Are there any hardcoded values that should be constants or environment variables?
- Are there any new dependencies that need justification?
- Does the change work correctly with Arabic text, RTL layout, and on a 375px mobile screen?