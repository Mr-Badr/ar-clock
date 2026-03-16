'use client';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';

/**
 * FeaturesAccordions — Reusable features/benefits accordion using shadcn/ui.
 *
 * Props:
 *  items: Array<{
 *    q: string          — feature title (accordion trigger)
 *    a?: string         — plain-text description
 *    node?: ReactNode   — rich JSX description (takes priority over `a`)
 *    icon?: string      — emoji or short text icon shown before the title
 *  }>
 *
 *  defaultOpen?: boolean  — if true, all items start open (default: true)
 */
export default function FeaturesAccordions({ items = [], defaultOpen = true }) {
  // For `type="multiple"`, defaultValue accepts an array of value strings
  const defaultValue = defaultOpen ? items.map((_, i) => `feat-${i}`) : [];

  return (
    <Accordion type="multiple" defaultValue={defaultValue} className="w-full space-y-3">
      {items.map((it, idx) => (
        <AccordionItem
          key={idx}
          value={`feat-${idx}`}
          className="overflow-hidden rounded-xl border border-subtle bg-surface-1 transition-all duration-300 hover:shadow-md hover:border-default"
        >
          <AccordionTrigger
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right text-base font-semibold text-primary hover:no-underline [&[data-state=open]]:text-accent-alt [&[data-state=open]]:border-b [&[data-state=open]]:border-subtle transition-colors duration-150"
          >
            <span className="flex items-center gap-2.5">
              {it.icon && (
                <span
                  aria-hidden="true"
                  className="text-xl shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-3 border border-subtle"
                >
                  {it.icon}
                </span>
              )}
              {it.q}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-3 text-right text-sm text-muted leading-loose">
            {it.node ?? <p>{it.a}</p>}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}