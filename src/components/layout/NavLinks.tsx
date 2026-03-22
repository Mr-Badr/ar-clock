"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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

export default function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <NavigationMenu dir="rtl" className="max-w-none justify-start">
      <NavigationMenuList className="gap-1 flex-row">
        {links.map((link) => (
          <NavigationMenuItem key={link.href} className="flex">
            {link.sublinks ? (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    "header-nav-link h-9 bg-transparent hover:bg-accent-soft hover:text-primary focus:bg-accent-soft data-[state=open]:bg-accent-soft data-[state=open]:text-primary transition-all rounded-full px-4 border-none shadow-none",
                    isActive(link.href) && "bg-accent text-on-accent font-semibold shadow-sm hover:text-on-accent hover:bg-accent focus:bg-accent"
                  )}
                >
                  {link.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-surface-1 border border-border rounded-xl shadow-xl">
                    {link.sublinks.map((sublink) => {
                      const Icon = Icons[sublink.icon as keyof typeof Icons] as any;
                      return (
                        <li key={sublink.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={sublink.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent-soft hover:text-primary focus:bg-accent-soft focus:text-primary",
                                pathname === sublink.href && "bg-accent-soft text-primary font-bold"
                              )}
                            >
                              <div className="flex items-center gap-2 text-sm font-semibold leading-none">
                                {Icon && <Icon className="size-4 text-accent" />}
                                {sublink.label}
                              </div>
                              {sublink.description && (
                                <p className="line-clamp-2 text-xs leading-snug text-muted mt-1">
                                  {sublink.description}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild active={isActive(link.href)}>
                <Link
                  href={link.href}
                  className={cn(
                    "header-nav-link",
                    isActive(link.href) && "active"
                  )}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}