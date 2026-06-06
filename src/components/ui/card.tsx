import * as React from "react"

import { cn } from "@/lib/utils"

type CardElementProps = React.ComponentProps<"div">

function Card({ className, ...props }: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-[var(--space-5)] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] py-[var(--space-6)] text-[var(--text-1)] shadow-none transition-[background-color,border-color] duration-100 data-[interactive=true]:hover:border-[var(--border-strong)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-[var(--space-2)] px-[var(--space-6)] has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:border-[var(--border)] [.border-b]:pb-[var(--space-5)]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-[var(--text-lg)] font-semibold leading-[var(--leading-snug)] text-[var(--text-1)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-[var(--text-sm)] leading-[var(--leading-snug)] text-[var(--text-2)]",
        className
      )}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card-content"
      className={cn("px-[var(--space-6)]", className)}
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}: CardElementProps): React.JSX.Element {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-[var(--space-3)] px-[var(--space-6)] [.border-t]:border-[var(--border)] [.border-t]:pt-[var(--space-6)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
