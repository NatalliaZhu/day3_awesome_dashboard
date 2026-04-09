"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { WidgetFrame } from "@/components/dashboard/widget-frame"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function randomIntInclusive(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

type MockNumberWidgetProps = {
  className?: string
}

export function MockNumberWidget({ className }: MockNumberWidgetProps) {
  const [value, setValue] = useState<number | null>(null)

  const roll = useCallback(() => {
    setValue(randomIntInclusive(1, 1000))
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      roll()
    })
    return () => cancelAnimationFrame(id)
  }, [roll])

  return (
    <WidgetFrame
      title="Mock number"
      description="A random integer generated on the client after mount."
      className={className}
    >
      <div className="flex flex-col gap-4">
        <div className="flex min-h-12 items-center">
          {value === null ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <p
              className="font-mono text-3xl font-semibold tabular-nums tracking-tight"
              aria-live="polite"
            >
              {value}
            </p>
          )}
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={roll}
            disabled={value === null}
          >
            <RefreshCw />
            Refresh
          </Button>
        </div>
      </div>
    </WidgetFrame>
  )
}
