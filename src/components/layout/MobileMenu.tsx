"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

type SubLink = {
  href: string;
  label: string;
  icon?: keyof typeof Icons;
  description?: string
};

type NavLink = {
  href: string;
  label: string;
  sublinks?: SubLink[]
};

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="header-mobile-btn"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav
        className={cn("header-mobile-menu", open && "open")}
        aria-label="القائمة المتنقلة"
      >
        <div className="flex flex-col gap-1 w-full rtl">
          {links.map((link) => (
            <div key={link.href}>
              {link.sublinks ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={link.href} className="border-none">
                    <AccordionTrigger
                      className={cn(
                        "header-mobile-link hover:no-underline py-3 px-4 w-full justify-between flex flex-row-reverse border-none shadow-none",
                        isActive(link.href) && "active"
                      )}
                    >
                      <span>{link.label}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-6 flex flex-col gap-1">
                      {link.sublinks.map((sublink) => {
                        const SubIcon = Icons[sublink.icon as keyof typeof Icons] as any;
                        return (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-md text-sm transition-colors hover:bg-accent-soft hover:text-primary",
                              pathname === sublink.href && "text-primary font-bold bg-accent-soft"
                            )}
                          >
                            {SubIcon && <SubIcon className="size-4 text-accent" />}
                            {sublink.label}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={link.href}
                  prefetch
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "header-mobile-link",
                    isActive(link.href) && "active"
                  )}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}