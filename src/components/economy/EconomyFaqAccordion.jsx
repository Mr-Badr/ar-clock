'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function EconomyFaqAccordion({ items }) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState({});

  const normalizedItems = (items || [])
    .map((item) => ({
      question: item.question || item.q || '',
      answer: item.answer || item.a || '',
    }))
    .filter((item) => item.question && item.answer);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: normalizedItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  if (normalizedItems.length === 0) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="economy-faq-list">
        {normalizedItems.map((item, index) => {
          const itemKey = item.question;
          const isOpen = Boolean(openItems[itemKey]);
          const triggerId = `${baseId}-trigger-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <div
              key={item.question}
              className="economy-faq-item"
              data-open={isOpen ? 'true' : 'false'}
            >
              <button
                id={triggerId}
                type="button"
                className="economy-faq-item__summary"
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => {
                  setOpenItems((current) => ({
                    ...current,
                    [itemKey]: !current[itemKey],
                  }));
                }}
              >
                <span className="economy-faq-item__question">
                  {item.question}
                </span>
                <ChevronDown
                  size={18}
                  className="economy-faq-item__chevron"
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                className="economy-faq-item__answer"
                role="region"
                aria-labelledby={triggerId}
                hidden={!isOpen}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
