'use client';

// hero/HeroSearchTrigger.client.jsx
// The site's single search entry point, moved out of the navbar and into the hero (owner
// directive, 2026-08-20: "search input should be in hero not navbar"). Was previously
// src/components/site/GlobalDiscoverySearch.client.jsx (deleted — this replaces its only real
// usage); the open/dialog-mount logic is unchanged, only the trigger's visual size/styling is
// new — a large, real-looking input rather than a small nav pill. Clicking/focusing it opens
// the same GlobalDiscoverySearchDialog used everywhere else on the site.
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { ShineBorder } from '@/components/ui/shine-border';

const GlobalDiscoverySearchDialog = dynamic(
  () => import('@/components/site/GlobalDiscoverySearchDialog.client'),
  { ssr: false, loading: () => null },
);

export default function HeroSearchTrigger() {
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogRequested, setDialogRequested] = useState(false);

  const requestDialog = useCallback(() => {
    if (pathname === '/fahras' || pathname === '/search') return;
    setDialogRequested(true);
  }, [pathname]);

  const openSearch = useCallback(() => {
    if (pathname === '/fahras' || pathname === '/search') return;
    setDialogRequested(true);
    setDialogOpen(true);
  }, [pathname]);

  const handleOpenChange = useCallback((nextOpen) => {
    if (nextOpen) setDialogRequested(true);
    setDialogOpen(nextOpen);
  }, []);

  return (
    <>
      <span className="hero-v2-search-wrap" data-hero-item>
        <ShineBorder shineColor={['#fb7185', '#fbbf24', '#34d399', '#38bdf8', '#818cf8']} borderWidth={1.5} duration={10} />
        <button
          type="button"
          aria-label="ابحث عن أي أداة أو صفحة داخل ميقاتنا"
          aria-haspopup="dialog"
          className="hero-v2-search"
          onClick={openSearch}
          onPointerEnter={requestDialog}
          onFocus={requestDialog}
        >
          <span className="hero-v2-search__placeholder">ابحث عن أداة، حاسبة، أو مناسبة...</span>
          <MagnifyingGlass size={19} className="hero-v2-search__icon" aria-hidden="true" />
        </button>
      </span>

      {dialogRequested ? (
        <GlobalDiscoverySearchDialog open={dialogOpen} onOpenChange={handleOpenChange} />
      ) : null}
    </>
  );
}
