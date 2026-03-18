/**
 * FeatureItem
 * A single bullet-point row used in feature lists across sections 1–3.
 * Icon is decorative (aria-hidden on the wrapper span).
 * Parent <ul> must carry role="list" for Safari VoiceOver compatibility.
 *
 * @param {{ icon: import('lucide-react').LucideIcon, children: React.ReactNode }} props
 */
export default function FeatureItem({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--accent-soft)' }}
        aria-hidden="true"
      >
        <Icon size={13} style={{ color: 'var(--accent-alt)' }} />
      </span>
      <span
        className="text-sm sm:text-base leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {children}
      </span>
    </li>
  )
}
