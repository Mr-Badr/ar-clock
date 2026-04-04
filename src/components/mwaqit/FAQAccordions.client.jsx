import { ChevronDown } from 'lucide-react';

/**
 * FAQAccordions — Generic FAQ accordion using shadcn/ui primitives.
 *
 * Props:
 *  items: Array<{
 *    q: string          — question (accordion trigger)
 *    a?: string         — plain-text answer
 *    node?: ReactNode   — rich JSX answer (takes priority over `a`)
 *    badge?: string     — optional badge label shown in the trigger (e.g. "شافعي")
 *  }>
 *
 * Usage (plain text):
 *   <FAQAccordions items={[{ q: '...', a: '...' }]} />
 *
 * Usage (rich content):
 *   <FAQAccordions items={[{ q: '...', node: <><strong>bold</strong> text</> }]} />
 */
export default function FAQAccordions({ items = [] }) {
  return (
    <div className="w-full space-y-3">
      {items.map((it, idx) => (
        <details
          key={idx}
          className="group overflow-hidden rounded-xl border border-subtle bg-surface-2 shadow-sm transition-all duration-200 hover:border-default hover:shadow-md"
        >
          <summary
            className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-right text-base font-bold text-primary [&::-webkit-details-marker]:hidden"
          >
            <span className="flex items-center gap-2 leading-snug">
              {it.icon && (
                <span
                  aria-hidden="true"
                  className="text-xl shrink-0 w-8 h-8 flex items-center justify-center"
                >
                  {it.icon}
                </span>
              )}
              {it.badge && (
                <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-alt border border-accent">
                  {it.badge}
                </span>
              )}
              {it.q}
            </span>
            <ChevronDown
              size={18}
              className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="px-5 pb-5 pt-3 text-right text-sm text-secondary leading-relaxed bg-surface-2">
            {it.node ?? <p>{it.a}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}
