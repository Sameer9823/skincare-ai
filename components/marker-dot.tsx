import { cn } from "@/lib/utils"

/**
 * The signature mark of the app: a small ringed dot, styled after the dotted
 * flags a dermatologist uses to annotate a body map. Reused as the logo, as
 * list bullets, and in the home page's annotated hero graphic.
 */
export function MarkerDot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("h-3 w-3 shrink-0", className)} aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" className="text-accent" />
      <circle cx="8" cy="8" r="2.25" fill="currentColor" className="text-accent" />
    </svg>
  )
}
