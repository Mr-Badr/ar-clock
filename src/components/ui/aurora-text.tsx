"use client"

import React, { memo } from "react"

import { cn } from "@/lib/utils"

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
}

export const AuroraText = memo(
  ({
    children,
    className,
  }: AuroraTextProps) => {
    return (
      <span className={cn("relative inline-block text-[var(--text-1)]", className)}>
        {children}
      </span>
    )
  }
)

AuroraText.displayName = "AuroraText"
