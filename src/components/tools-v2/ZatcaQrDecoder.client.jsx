"use client";

import { useState } from 'react';
import { QrCode, CheckCircle, WarningCircle } from '@phosphor-icons/react';

import { decodeZatcaQr } from '@/lib/tools/zatca-qr-decode';

export default function ZatcaQrDecoder() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  function handleDecode() {
    setResult(decodeZatcaQr(input));
  }

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><QrCode size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">تحقق من محتوى كود QR لفاتورتك</p>
          <p className="guide-v2-checker-sub">الصق النص المشفّر (Base64) الذي يظهر عند مسح الكود بكاميرا هاتفك</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="zatca-qr-input">نص كود QR</label>
        <textarea
          id="zatca-qr-input"
          rows={3}
          placeholder="مثال: ASbYtNix2YPYqSDYqtis2LHZitio2YrYqSDZhNmE2KrYrNin2LHYqQIPMzAwMDAwMDAwMDAwMDAz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: '0.8rem', direction: 'ltr', textAlign: 'left', width: '100%', resize: 'vertical' }}
        />
      </div>

      <button type="button" className="guide-v2-checker-chip is-active" onClick={handleDecode} disabled={!input.trim()} style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        فكّ تشفير الكود
      </button>

      {result ? (
        result.ok ? (
          <div className={`guide-v2-checker-result ${result.hasAllMandatory ? 'is-good' : 'is-warn'}`} aria-live="polite">
            <p className="guide-v2-checker-result-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {result.hasAllMandatory ? (
                <><CheckCircle size={16} weight="bold" style={{ color: 'var(--green-text)' }} /> يحتوي على كل الحقول الإلزامية الخمسة</>
              ) : (
                <><WarningCircle size={16} weight="bold" style={{ color: 'var(--amber-text)' }} /> ينقصه حقل إلزامي واحد أو أكثر — تحقق من مصدر الفاتورة</>
              )}
            </p>
            <div style={{ marginTop: 'var(--space-3)' }}>
              {result.fields.map((f) => (
                <div key={f.tag} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-2)' }}>{f.label}</p>
                  <p style={{ margin: 0, fontWeight: 700, direction: 'ltr', textAlign: 'right', unicodeBidi: 'plaintext' }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="guide-v2-checker-result is-bad" aria-live="polite">
            <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>{result.error}</p>
          </div>
        )
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>الصق النص المشفّر واضغط "فكّ تشفير الكود" لرؤية بيانات الفاتورة الحقيقية.</p>
        </div>
      )}

      <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
        كل الحساب يتم داخل متصفحك فقط — لا يُرسَل نص الكود لأي خادم أو يُحفَظ في أي مكان.
      </p>
    </div>
  );
}
