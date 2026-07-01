import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input">

const ltrInputTypes: ReadonlySet<string> = new Set(["email", "tel", "url", "number"])
const ltrInputModes: ReadonlySet<string> = new Set(["decimal", "numeric"])

function Input({
  className,
  dir,
  type,
  inputMode,
  ...props
}: InputProps): React.JSX.Element {
  const resolvedDir: InputProps["dir"] =
    dir ??
    (typeof type === "string" && ltrInputTypes.has(type) ? "ltr" : undefined) ??
    (typeof inputMode === "string" && ltrInputModes.has(inputMode) ? "ltr" : undefined)

  return (
    <input
      type={type}
      inputMode={inputMode}
      dir={resolvedDir}
      data-slot="input"
      className={cn(
        "h-[var(--space-11)] w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-base)] leading-[var(--leading-snug)] text-[var(--text-1)] shadow-none outline-none transition-[background-color,border-color,box-shadow,color] file:inline-flex file:h-[var(--space-7)] file:border-0 file:bg-transparent file:text-[var(--text-sm)] file:font-medium file:text-[var(--blue)] placeholder:text-[var(--text-4)] selection:bg-[var(--blue)] selection:text-[var(--text-on-accent)] hover:border-[var(--border-strong)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-55 md:text-[var(--text-sm)]",
        "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)]",
        "aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
