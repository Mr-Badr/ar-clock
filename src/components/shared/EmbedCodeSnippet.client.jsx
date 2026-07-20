'use client';

import { useState } from 'react';

export default function EmbedCodeSnippet({
  embedUrl,
  title = 'أداة من ميقاتنا',
  hint = 'هل تدير موقعاً أو منتدى؟ أضف هذه الأداة إلى موقعك مجاناً بنسخ الكود التالي:',
  width = 360,
  height = 320,
}) {
  const [copied, setCopied] = useState(false);
  const snippet = `<iframe src="${embedUrl}" width="${width}" height="${height}" style="border:0;" loading="lazy" title="${title}"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      // clipboard API unavailable — the code is still selectable/visible below
    }
  };

  return (
    <div className="embed-snippet-block">
      <p className="embed-snippet-block__hint">{hint}</p>
      <pre className="embed-snippet-block__code">
        <code>{snippet}</code>
      </pre>
      <button type="button" className="btn btn-outline btn-sm" onClick={handleCopy}>
        {copied ? 'تم النسخ ✓' : 'انسخ كود التضمين'}
      </button>
    </div>
  );
}
