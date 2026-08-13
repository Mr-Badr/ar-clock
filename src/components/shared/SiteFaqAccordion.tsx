import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * SiteFaqAccordion — the ONE FAQ pattern for the whole site (owner directive, 2026-08-13:
 * "FAQ should always be like the FAQ in tools pages"). Mirrors CalculatorFaqSection's exact
 * shadcn Accordion usage (src/components/calculators/common.jsx) instead of each section
 * (date, holidays, ...) hand-rolling its own `<details>`/card version. Border-bottom between
 * items only — never a bordered card, never a two-column layout next to it.
 *
 * items[].answer accepts a string or JSX (some pages need a link inline in the answer).
 */
export type SiteFaqItem = {
  question: string;
  answer: React.ReactNode;
};

export function SiteFaqAccordion({
  items,
  className,
}: {
  items: SiteFaqItem[];
  className?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return null;

  return (
    <Accordion type="single" collapsible className={className}>
      {safeItems.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
