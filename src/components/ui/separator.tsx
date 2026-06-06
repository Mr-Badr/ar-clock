"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation,
  decorative,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>): React.JSX.Element {
  const resolvedOrientation = orientation ?? "horizontal"
  const resolvedDecorative = decorative ?? true

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={resolvedDecorative}
      orientation={resolvedOrientation}
      className={cn(
        "shrink-0 bg-[var(--border-default)] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
