'use client';

export default function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="btn"
      style={{
        width: '100%',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--accent)',
        color: '#fff',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-base)',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      إعادة المحاولة
    </button>
  );
}
