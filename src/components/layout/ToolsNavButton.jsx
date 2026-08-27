// layout/ToolsNavButton.jsx
// The "/tools" nav CTA — second pass, 2026-08-20 (owner: "by making it premium i was meaning
// something like having border like this [magicui.design/docs/components/border-beam]"). Swapped
// the earlier filled shimmer-sweep look for Magic UI's BorderBeam: a subtle outlined pill with a
// small light traveling continuously around its border. Also moved out of header-actions and
// into the nav-links row itself (owner: "tools button should be close to other links") — see
// NavLinks.tsx, which renders this in place of a plain link when `link.cta` is true.
//
// Third pass, 2026-08-27 (owner: "this button should have no arrow just text because it has no
// drop down menu, this is in mobile and desktop") — the trailing CaretLeft was left over from
// when other nav triggers had a caret for their dropdown; "/tools" never had one, so the arrow
// implied a menu that doesn't open. Dropped it here (shared by both surfaces): NavLinks.tsx uses
// this directly for desktop, and MobileMenuPanel.client.tsx now reuses this exact component
// (owner: "the button of tools on mobile... should be like desktop") instead of its own separate
// styled link, passing `className` to stretch it full-width in the drawer's list.
import Link from "next/link";

import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

export default function ToolsNavButton({ className = "" }) {
  return (
    <Link href="/tools" prefetch className={cn("tools-nav-btn", className)}>
      <span className="tools-nav-btn__label">الأدوات</span>
      <BorderBeam size={40} duration={5} borderWidth={1.5} />
    </Link>
  );
}
