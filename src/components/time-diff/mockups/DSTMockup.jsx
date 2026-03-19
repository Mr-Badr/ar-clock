/**
 * DSTMockup.jsx
 * Decorative illustration: shows how DST changes the time difference.
 * aria-hidden — content duplicated in adjacent section text.
 */

import { Sun, Snowflake, RefreshCcw } from 'lucide-react'

export default function DSTMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
      style={{ boxShadow: '0 20px 40px rgba(6,8,18,0.5)', borderRadius: '24px' }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, var(--warning) 0%, var(--info) 100%)' }}
        >
          <span className="text-sm font-bold text-white">التوقيت الصيفي DST</span>
          <RefreshCcw size={16} className="text-white/80" />
        </div>

        {/* Visual: summer vs winter */}
        <div className="p-4 grid grid-cols-2 gap-3">

          {/* Winter column */}
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'var(--info-soft)', border: '1px solid var(--info-border)' }}
          >
            <div className="flex items-center gap-2">
              <Snowflake size={14} style={{ color: 'var(--info)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--info)' }}>الشتاء</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>مصر (UTC+2)</p>
                <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>10:00</p>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>السعودية (UTC+3)</p>
                <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>11:00</p>
              </div>
              <div
                className="text-center rounded-lg py-1.5"
                style={{ background: 'var(--info-soft)' }}
              >
                <span className="text-xs font-bold" style={{ color: 'var(--info)' }}>الفرق: 1 ساعة</span>
              </div>
            </div>
          </div>

          {/* Summer column */}
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'var(--warning-soft)', border: '1px solid var(--warning-border)' }}
          >
            <div className="flex items-center gap-2">
              <Sun size={14} style={{ color: 'var(--warning)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--warning)' }}>الصيف</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>مصر (UTC+3 DST)</p>
                <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>10:00</p>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>السعودية (UTC+3)</p>
                <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>10:00</p>
              </div>
              <div
                className="text-center rounded-lg py-1.5"
                style={{ background: 'var(--success-soft)' }}
              >
                <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>الفرق: 0 ساعات!</span>
              </div>
            </div>
          </div>

        </div>

        {/* Explanation row */}
        <div
          className="px-5 py-3"
          style={{ background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-subtle)' }}
        >
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            🔄 مصر تُطبّق التوقيت الصيفي (UTC+3) في الصيف فيصبح الفرق مع السعودية 0 بدل 1 ساعة
          </p>
        </div>

        {/* DST countries note */}
        <div className="px-5 pb-4 pt-3">
          <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
            دول عربية تُطبّق التوقيت الصيفي:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['🇪🇬 مصر', '🇲🇦 المغرب', '🇯🇴 الأردن', '🇱🇧 لبنان', '🇸🇾 سوريا'].map((c) => (
              <span
                key={c}
                className="text-[10px] font-medium rounded-full px-2 py-0.5"
                style={{ background: 'var(--bg-surface-3)', color: 'var(--text-secondary)' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
