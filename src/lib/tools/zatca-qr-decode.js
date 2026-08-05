// ZATCA simplified tax invoice QR code — TLV (Tag-Length-Value) decoder. Real, documented format:
// base64-encoded bytes, each field is [1 byte tag][1 byte length][N bytes UTF-8 value].
// Standard tags 1-5 (mandatory on every compliant simplified invoice QR since Phase 1):
//   1 = Seller name, 2 = VAT registration number, 3 = Invoice timestamp (ISO 8601),
//   4 = Invoice total (with VAT), 5 = VAT total.
// Phase 2 invoices may include additional tags (6=hash, 7=digital signature, 8=public key,
// 9=signature) which aren't human-readable — decoded as raw byte length only, not shown as text.
const TAG_LABELS = {
  1: 'اسم البائع',
  2: 'الرقم الضريبي (VAT)',
  3: 'تاريخ ووقت الفاتورة',
  4: 'إجمالي الفاتورة (شامل الضريبة)',
  5: 'إجمالي ضريبة القيمة المضافة',
};

export function decodeZatcaQr(rawInput) {
  const trimmed = String(rawInput || '').trim();
  if (!trimmed) return { ok: false, error: 'الصق نص كود QR أولاً.' };

  let bytes;
  try {
    const binary = atob(trimmed.replace(/\s+/g, ''));
    bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  } catch {
    return { ok: false, error: 'هذا النص ليس Base64 صالحاً — تأكد أنك نسخت كود QR كاملاً دون نقص.' };
  }

  const fields = [];
  let i = 0;
  while (i < bytes.length) {
    const tag = bytes[i];
    const length = bytes[i + 1];
    if (length === undefined || i + 2 + length > bytes.length) break;
    const valueBytes = bytes.slice(i + 2, i + 2 + length);
    const label = TAG_LABELS[tag];
    if (label) {
      const value = new TextDecoder('utf-8').decode(valueBytes);
      fields.push({ tag, label, value });
    } else {
      fields.push({ tag, label: `حقل إضافي رقم ${tag}`, value: `(${length} بايت غير نصّي — توقيع أو تجزئة رقمية)` });
    }
    i += 2 + length;
  }

  const hasAllMandatory = [1, 2, 3, 4, 5].every((t) => fields.some((f) => f.tag === t));

  if (fields.length === 0) {
    return { ok: false, error: 'تعذّر فك تشفير أي حقل من هذا النص — تأكد أنه كود QR فاتورة زاتكا حقيقي، لا نص أو رابط آخر.' };
  }

  return { ok: true, fields, hasAllMandatory };
}
