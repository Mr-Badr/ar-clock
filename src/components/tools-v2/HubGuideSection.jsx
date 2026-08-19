// Reusable editorial content block for category HUB INDEX pages (/tools/<category>), rendered
// AFTER the required dot-list nav (hero → featured-row → type-groups, per
// .claude/rules/tools-hub-pattern.md — never touch that order or reintroduce a card-grid there).
// This is the "real content" layer the hub was missing: a genuine guide paragraph/section and a
// category-level FAQ, so the hub stops being a pure link directory. Server Components — no client
// JS needed.

export function HubGuideSection({ id, title, children }) {
  return (
    <section id={id} className="tool-v2-hub-guide">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function HubFaq({ items }) {
  return (
    <div className="tool-v2-faq">
      {items.map((item, index) => (
        <details key={item.question} open={index === 0}>
          <summary>
            {item.question}
            <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

// Builds the FAQPage JSON-LD for a hub's FAQ items — same shape used on every tool detail page.
export function buildHubFaqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
