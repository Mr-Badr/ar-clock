"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}): React.JSX.Element {
  const resolvedSize = size ?? "default"

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={resolvedSize}
      className={cn(
        "group/avatar relative flex size-[var(--space-8)] shrink-0 select-none overflow-hidden rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--muted)] data-[size=lg]:size-[var(--space-10)] data-[size=sm]:size-[var(--space-6)]",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[var(--radius-full)] bg-[var(--muted)] text-[var(--text-sm)] text-[var(--text-2)] group-data-[size=sm]/avatar:text-[var(--text-xs)]",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute inset-inline-end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-[var(--radius-full)] bg-[var(--blue)] text-[var(--text-on-accent)] ring-2 ring-[var(--surface)] select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-[var(--surface)] [&>*+*]:-ms-[var(--space-2)]",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-[var(--space-8)] shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--muted)] text-[var(--text-sm)] text-[var(--text-2)] ring-2 ring-[var(--surface)] group-has-data-[size=lg]/avatar-group:size-[var(--space-10)] group-has-data-[size=sm]/avatar-group:size-[var(--space-6)] [&>svg]:size-[var(--space-4)] group-has-data-[size=lg]/avatar-group:[&>svg]:size-[var(--space-5)] group-has-data-[size=sm]/avatar-group:[&>svg]:size-[var(--space-3)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}
