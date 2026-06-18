'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

import { OPEN_DISCOVERY_SEARCH_EVENT } from '@/lib/site/discovery-events';

const GlobalDiscoverySearchDialog = dynamic(
  () => import('./GlobalDiscoverySearchDialog.client'),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function GlobalDiscoverySearch() {
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogRequested, setDialogRequested] = useState(false);

  const requestDialog = useCallback(() => {
    if (pathname === '/fahras' || pathname === '/search') return;
    setDialogRequested(true);
  }, [pathname]);

  const openSearch = useCallback(() => {
    if (pathname === '/fahras' || pathname === '/search') {
      window.dispatchEvent(new CustomEvent(OPEN_DISCOVERY_SEARCH_EVENT));
      return;
    }

    setDialogRequested(true);
    setDialogOpen(true);
  }, [pathname]);

  const handleOpenChange = useCallback((nextOpen) => {
    if (nextOpen) {
      setDialogRequested(true);
    }

    setDialogOpen(nextOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="ابحث عن أي أداة أو صفحة داخل ميقاتنا"
        aria-haspopup="dialog"
        className="header-search-link"
        onClick={openSearch}
        onPointerEnter={requestDialog}
        onFocus={requestDialog}
      >
        <span className="header-search-link__icon" aria-hidden="true">
          <Search size={16} />
        </span>
        <span className="header-search-link__label">بحث</span>
      </button>

      {dialogRequested ? (
        <GlobalDiscoverySearchDialog
          open={dialogOpen}
          onOpenChange={handleOpenChange}
        />
      ) : null}
    </>
  );
}
