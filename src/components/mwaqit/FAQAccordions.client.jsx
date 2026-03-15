'use client';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';

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
    <Accordion type="single" collapsible className="w-full space-y-3">
      {items.map((it, idx) => (
        <AccordionItem
          key={idx}
          value={`faq-${idx}`}
          className="overflow-hidden rounded-xl border border-subtle bg-surface-2 shadow-sm transition-all duration-200 hover:border-default hover:shadow-md"
        >
          <AccordionTrigger
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right text-base font-bold text-primary hover:no-underline transition-colors [&[data-state=open]]:bg-surface-3 [&[data-state=open]]:border-b [&[data-state=open]]:border-subtle"
          >
            <span className="flex items-center gap-2 leading-snug">
              {it.badge && (
                <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-alt border border-accent">
                  {it.badge}
                </span>
              )}
              {it.q}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-3 text-right text-sm text-secondary leading-relaxed bg-surface-2">
            {it.node ?? <p>{it.a}</p>}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}