'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton({ event, className }) {
  const shareEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In Next.js, window.location is client-only
    const url = `${window.location.origin}/holidays/${event.slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.name,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('تم نسخ الرابط!');
    }
  };

  return (
    <button 
      onClick={shareEvent}
      className={className}
      title="مشاركة"
    >
      <Share2 className="w-full h-full" />
    </button>
  );
}
