// layout/ToolsNavButton.jsx
// The "/tools" nav CTA — second pass, 2026-08-20 (owner: "by making it premium i was meaning
// something like having border like this [magicui.design/docs/components/border-beam]"). Swapped
// the earlier filled shimmer-sweep look for Magic UI's BorderBeam: a subtle outlined pill with a
// small light traveling continuously around its border. Also moved out of header-actions and
// into the nav-links row itself (owner: "tools button should be close to other links") — see
// NavLinks.tsx, which renders this in place of a plain link when `link.cta` is true.
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { BorderBeam } from "@/components/ui/border-beam";

export default function ToolsNavButton() {
  return (
    <Link href="/tools" prefetch className="tools-nav-btn">
      <span className="tools-nav-btn__label">الأدوات</span>
      <CaretLeft size={13} weight="bold" aria-hidden="true" />
      <BorderBeam size={40} duration={5} borderWidth={1.5} />
    </Link>
  );
}
