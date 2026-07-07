---
name: component-design
description: "Rules for building React components correctly. Use when creating or editing any component, deciding between Server and Client Component, designing props, building skeleton loaders, empty states, or error states. Covers: component contract, atomic hierarchy, props design, RTL text fit testing."
---

# Component Design Rules

## 1. Every Component Has a Contract
- A component's contract is: given these inputs (props), it renders this output (JSX) — nothing more
- Required props must be required in the type signature — making everything optional to silence TypeScript errors hides real bugs
- Optional props must have sensible defaults — a component must render correctly using only its required props
- A component that renders nothing or crashes under common prop combinations is a broken contract — fix the component, not the caller

## 2. Know the Boundary Before Writing the Component
- Before writing any component, decide: is this a Server Component or a Client Component?
- Start with Server Component — add `"use client"` only when you have a concrete reason: state, lifecycle effects, browser APIs, or third-party library requirements
- The `"use client"` directive is a performance decision — it means every line of that component's code ships as JavaScript to every browser that loads the page
- Moving the client boundary deeper (closer to the leaf that actually needs interactivity) is always better — wrap only the interactive part, not the entire section

## 3. The Component Hierarchy
- **Primitives**: the smallest reusable units — Button, Input, Badge, Icon, Avatar — they contain no business logic and no data fetching
- **Compound components**: combinations of primitives for a specific pattern — Card, Modal, Dropdown, FormField, Tooltip
- **Section components**: full-page sections combining compounds — HeroSection, PricingTable, TestimonialCarousel, ArticleGrid
- **Page components**: compose sections — they contain no direct styling or business logic, they are orchestrators
- Never skip levels: a Page must not directly contain primitive styles, a Primitive must not contain business logic

## 4. Props Must Be Minimal and Typed
- Pass only what the component needs — not the entire data object when the component uses two fields from it
- Passing entire objects creates invisible coupling: the component becomes dependent on the object's full shape, making refactoring dangerous
- Boolean props that completely change the component's appearance signal that two separate components are needed
- Avoid prop objects nested more than one level deep — they make the component difficult to use and the TypeScript types difficult to read
- Callback props (functions passed as props) should follow the `on` naming convention: `onSubmit`, `onDelete`, `onPageChange`

## 5. Skeleton Loaders Are Required for Every Data-Driven Component
- Every component that appears inside a Suspense boundary must have a corresponding skeleton loader
- The skeleton must structurally match the real component: same number of cards, same approximate element heights, same layout regions
- A skeleton that is dramatically different in shape from the real content causes CLS (Cumulative Layout Shift) — this hurts Core Web Vitals and feels jarring
- Never use a generic spinner or a plain rectangle as a skeleton — they provide no structural anticipation for the incoming content
- Name skeletons by appending `Skeleton` to the component name: `ArticleCardSkeleton`, `UserProfileSkeleton`, `PricingTableSkeleton`

## 6. Empty States Are Required for Every Data-Driven Component
- Every component that renders a list or data-driven content must have an explicit empty state
- An empty state is not a blank space — it is a designed component with an illustration or icon, an Arabic heading explaining the state, and a relevant action
- Different empty states for different causes: "nothing created yet" is not the same as "no results match your search" is not the same as "content not available in your region"
- Empty state copy must be written in Arabic and must be specific — "لا توجد مقالات بعد" is better than "لا يوجد شيء هنا"

## 7. Error States Are Required for Every Data-Fetching Component
- Every component that fetches its own data must handle fetch failure
- An error state must be visible, written in Arabic, and explain what failed without exposing technical details
- An error state must offer an action: retry, go back, or contact support — depending on whether the error is recoverable
- Never silently render nothing when a fetch fails — an invisible failure is an invisible broken page to the user

## 8. Component Isolation
- A component must not depend on CSS, JavaScript variables, or context that is not explicitly passed to it or defined in its file
- A component must not assume the container it is placed in — it must function correctly in any reasonable layout
- A component that breaks when moved to a different part of the page has hidden dependencies — find them and remove them
- A component must not produce side effects outside of its render: no global DOM mutations, no external state changes, no analytics events fired from inside JSX

## 9. Do Not Abstract Too Early
- Extract a reusable component only when you have at least two genuine, live use cases for it
- Premature abstraction creates components with too many props, too many conditions, and confusing behavior — they are harder to use than writing the specific version twice
- When two similar components start to diverge in behavior, the shared abstraction becomes a liability — sometimes two separate components are the right answer
- The right moment to extract: three or more places in the codebase use the same structure with minor variations

## 10. Component Files Must Be Self-Contained
- Each component lives in its own file named exactly as the component: `ArticleCard.tsx` exports `ArticleCard`
- A component file contains: the component, its prop types, and its tightly-coupled sub-components — nothing else
- If a component file grows beyond 200 lines, it is a signal that it contains too much — split the sub-components into their own files
- Import only what is used — unused imports signal confusion about what the component actually needs

## 11. Shared UI Primitives Are Never Modified for One Use Case
- If a primitive needs to behave differently in one specific context, the solution is a variant prop on the primitive — not modifying the primitive to work for that one case
- Modifying a shared primitive for a specific use case breaks every other use of that primitive
- If a variant prop on the primitive is not sufficient, create a new component that wraps the primitive — do not modify the primitive itself

## 12. Arabic Text Must Fit All Components
- All components must be tested with real Arabic text, not placeholder text
- Arabic text is 20–30% wider than English text at the same font size — containers that look fine in English will overflow or clip in Arabic
- All text containers must accommodate the longest expected Arabic string without truncating or overflowing unless truncation is explicitly designed
- Interactive elements (buttons, tabs, navigation items) must be sized for the longest Arabic label they will ever display