// layout/MobileMenu.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SubLink = {
  href: string;
  label: string;
  icon?: string;
  description?: string;
};

type NavLink = {
  href: string;
  label: string;
  sublinks?: SubLink[];
};

const MobileMenuPanel = dynamic(
  () => import("./MobileMenuPanel.client"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleToggle = () => {
    setRequested(true);
    setOpen((value) => !value);
  };

  const handleWarmPanel = () => {
    setRequested(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        onPointerEnter={handleWarmPanel}
        onFocus={handleWarmPanel}
        className="header-mobile-btn"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
      >
        <span
          className={[
            "header-mobile-btn-icon",
            open ? "header-mobile-btn-icon--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      </button>

      {requested && open ? (
        <MobileMenuPanel links={links} open={open} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
