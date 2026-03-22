// src/components/date/DateStatCard.tsx
// Reusable premium stat card — uses new.css design tokens exclusively
// .card class from new.css for elevation; Tailwind bridge for text/color utilities

interface DateStatCardProps {
  label:   string;
  value:   string | number;
  icon?:   string;
  accent?: boolean;
}

export function DateStatCard({ label, value, icon, accent }: DateStatCardProps) {
  return (
    <div className={`card text-center transition-all hover:-translate-y-0.5 ${accent ? 'card--accent' : ''}`}>
      {icon && (
        <div className="text-2xl mb-2 leading-none" aria-hidden="true">{icon}</div>
      )}
      <div
        className="text-sm font-black leading-tight tabular-nums mb-1.5"
        style={{ color: accent ? 'var(--accent-alt)' : 'var(--text-primary)' }}
      >
        {value}
      </div>
      <div className="text-xs text-muted font-semibold leading-tight">{label}</div>
    </div>
  );
}
