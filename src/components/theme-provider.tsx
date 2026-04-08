"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Theme names MUST exactly match the CSS class selectors in design-system.css:
//   .dark      → slate-blue night mode     (section 03)
//   .light     → warm-white day mode       (section 04)
//
// next-themes writes one of these as a class on <html>:
//   <html class="dark">   or   <html class="light">
//
// The CSS variable tokens (--bg-base, --accent, --text-primary, etc.) are
// then resolved by whichever .dark / .light block is active.
//
// disableTransitionOnChange is intentionally NOT set here.
// Our CSS handles theme transitions via .theme-transition on <html>
// (see design-system.css section 30), and prefers-reduced-motion is
// also handled globally in the CSS (section 07 @layer base).
// Adding disableTransitionOnChange would override our CSS transition
// with an inline style, breaking the designed animation.

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme
      themes={["dark", "light"]}
    >
      {children}
    </NextThemesProvider>
  );
}
