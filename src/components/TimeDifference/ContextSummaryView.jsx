import { Info } from 'lucide-react';

export default function ContextSummaryView({ lines, title = 'ملخص فرق التوقيت', className = '' }) {
  if (!lines?.length) return null;

  return (
    <div
      role="region"
      aria-label={title}
      className={`bg-[var(--bg-surface-2)] border border-[var(--border-accent)] rounded-2xl p-5 space-y-2 ${className}`.trim()}
    >
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} className="text-[var(--accent)]" />
        <span className="text-sm font-bold text-[var(--accent)]">{title}</span>
      </div>
      {lines.map((line, index) => (
        <p key={index} className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {line}
        </p>
      ))}
    </div>
  );
}
