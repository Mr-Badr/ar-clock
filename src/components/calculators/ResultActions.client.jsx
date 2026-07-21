"use client";

import { useEffect, useId, useState } from 'react';
import {
  Copy,
  Link2,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

import { CalcButton as Button } from '@/components/calculators/controls.client';

export default function ResultActions({
  copyText,
  shareTitle,
  shareText,
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const sharePanelId = useId();

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Some calculators sync their inputs into the URL query string as the
  // user types (e.g. EndOfServiceCalculator) so the link below stays a
  // shareable snapshot of the current result, not just the bare page URL.
  // The mount-only effect above can't see that later change, so re-read the
  // live URL right before it's used — every time the panel opens and at the
  // moment each share action actually fires.
  useEffect(() => {
    if (isShareOpen) setShareUrl(window.location.href);
  }, [isShareOpen]);
  const getLiveShareUrl = () => (typeof window !== 'undefined' ? window.location.href : shareUrl);

  const shareSummary = [shareTitle, shareText].filter(Boolean).join('\n');
  const shareBundle = [shareSummary, shareUrl].filter(Boolean).join('\n');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedSummary = encodeURIComponent(shareSummary);
  const encodedBundle = encodeURIComponent(shareBundle);
  const isShareReady = Boolean(shareUrl);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const shareLinks = [
    {
      key: 'whatsapp',
      label: 'واتساب',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedBundle}`,
    },
    {
      key: 'telegram',
      label: 'تيليجرام',
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedSummary}`,
    },
    {
      key: 'x',
      label: 'X',
      icon: Share2,
      href: `https://twitter.com/intent/tweet?text=${encodedSummary}&url=${encodedUrl}`,
    },
    {
      key: 'facebook',
      label: 'فيسبوك',
      icon: Share2,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: 'linkedin',
      label: 'لينكدإن',
      icon: Link2,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      key: 'email',
      label: 'البريد',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(shareTitle || 'مشاركة نتيجة الحاسبة')}&body=${encodedBundle}`,
      external: false,
    },
  ];

  async function handleCopy() {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      toast.success('تم نسخ الملخص');
    } catch {
      toast.error('تعذر نسخ الملخص');
    }
  }

  async function handleCopyLink() {
    const liveUrl = getLiveShareUrl();
    if (!liveUrl) {
      toast.error('الرابط لم يجهز بعد');
      return;
    }

    try {
      await navigator.clipboard.writeText(liveUrl);
      toast.success('تم نسخ الرابط');
    } catch {
      toast.error('تعذر نسخ الرابط');
    }
  }

  async function handleNativeShare() {
    const liveUrl = getLiveShareUrl();
    if (!canNativeShare || !shareText || !liveUrl) return;

    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: liveUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      toast.error('تعذر فتح قائمة المشاركة');
    }
  }

  return (
    <div className="calc-share-wrap">
      <div className="calc-result-actions__intro">
        <strong>احتفظ بهذه النتيجة</strong>
        <span>انسخ الملخص أو شارك رابط الحاسبة للرجوع إليه بسهولة.</span>
      </div>
      <div className="calc-result-actions">
        <Button type="button" variant="outline" size="sm" onClick={handleCopy} disabled={!copyText}>
          <Copy size={16} aria-hidden="true" />
          نسخ الملخص
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={isShareOpen}
          aria-controls={sharePanelId}
          onClick={() => setIsShareOpen((current) => !current)}
          disabled={!isShareReady}
        >
          <Share2 size={16} aria-hidden="true" />
          مشاركة
        </Button>
      </div>

      {isShareOpen ? (
        <div id={sharePanelId} className="calc-share-panel" role="region" aria-label="خيارات مشاركة النتيجة">
          <div className="calc-share-meta">
            <strong>شارك النتيجة في المكان المناسب لك</strong>
            <span>
              أرسل ملخص النتيجة أو انسخ رابط الصفحة حتى تراجعه لاحقاً مع نفس المدخلات والسياق.
            </span>
          </div>

          <div className="calc-share-grid">
            {canNativeShare ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="calc-share-link"
                onClick={handleNativeShare}
                disabled={!isShareReady}
              >
                <Share2 size={16} aria-hidden="true" />
                مشاركة عبر التطبيقات
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="calc-share-link"
              onClick={handleCopyLink}
              disabled={!isShareReady}
            >
              <Link2 size={16} aria-hidden="true" />
              نسخ الرابط
            </Button>

            {isShareReady ? shareLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Button key={item.key} asChild variant="outline" size="sm" className="calc-share-link">
                  <a
                    href={item.href}
                    target={item.external === false ? undefined : '_blank'}
                    rel={item.external === false ? undefined : 'noopener noreferrer'}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </a>
                </Button>
              );
            }) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
