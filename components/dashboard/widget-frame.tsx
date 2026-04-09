import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type WidgetFrameProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function WidgetFrame({
  title,
  description,
  children,
  className,
}: WidgetFrameProps) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
    >
      <header className="space-y-0.5">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}
