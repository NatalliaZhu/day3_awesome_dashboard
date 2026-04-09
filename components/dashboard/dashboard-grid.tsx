"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Responsive as ResponsiveGridLayout,
  useContainerWidth,
  verticalCompactor,
  type Layout,
  type ResponsiveLayouts,
} from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import { Skeleton } from "@/components/ui/skeleton"
import type { CurrentWeather } from "@/lib/open-meteo"

import { MockNumberWidget } from "@/components/dashboard/mock-number-widget"
import { WeatherWidgetContent } from "@/components/dashboard/weather-widget"

const STORAGE_KEY = "awesome-dashboard:grid-layouts-v1"

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

const defaultLayouts: ResponsiveLayouts = {
  lg: [
    { i: "mock-number", x: 0, y: 0, w: 4, h: 6, minW: 2, minH: 4 },
    { i: "weather", x: 4, y: 0, w: 4, h: 7, minW: 2, minH: 5 },
  ],
  md: [
    { i: "mock-number", x: 0, y: 0, w: 5, h: 6, minW: 2, minH: 4 },
    { i: "weather", x: 5, y: 0, w: 5, h: 7, minW: 2, minH: 5 },
  ],
  sm: [
    { i: "mock-number", x: 0, y: 0, w: 6, h: 6, minW: 2, minH: 4 },
    { i: "weather", x: 0, y: 6, w: 6, h: 7, minW: 2, minH: 5 },
  ],
  xs: [
    { i: "mock-number", x: 0, y: 0, w: 4, h: 6, minW: 2, minH: 4 },
    { i: "weather", x: 0, y: 6, w: 4, h: 7, minW: 2, minH: 5 },
  ],
  xxs: [
    { i: "mock-number", x: 0, y: 0, w: 2, h: 7, minW: 2, minH: 5 },
    { i: "weather", x: 0, y: 7, w: 2, h: 8, minW: 2, minH: 6 },
  ],
}

function loadStoredLayouts(): ResponsiveLayouts | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ResponsiveLayouts
    if (parsed?.lg?.length) return parsed
  } catch {
    // ignore
  }
  return null
}

type DashboardGridProps = {
  weather: CurrentWeather | null
  weatherError: string | null
}

export function DashboardGrid({ weather, weatherError }: DashboardGridProps) {
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  })
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(defaultLayouts)

  useEffect(() => {
    const stored = loadStoredLayouts()
    if (!stored) return
    const id = requestAnimationFrame(() => {
      setLayouts(stored)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const onLayoutChange = useCallback(
    (_layout: Layout, allLayouts: ResponsiveLayouts) => {
      setLayouts(allLayouts)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts))
      } catch {
        // ignore quota / private mode
      }
    },
    []
  )

  return (
    <div ref={containerRef} className="w-full">
      {!mounted ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[280px] rounded-lg" />
          <Skeleton className="h-[320px] rounded-lg" />
        </div>
      ) : (
        <ResponsiveGridLayout
          className="-mx-1 min-h-[200px]"
          width={width}
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={32}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          compactor={verticalCompactor}
          onLayoutChange={onLayoutChange}
        >
          <div key="mock-number" className="h-full overflow-auto">
            <MockNumberWidget className="h-full min-h-0" />
          </div>
          <div key="weather" className="h-full overflow-auto">
            <WeatherWidgetContent
              weather={weather}
              errorMessage={weatherError}
              className="h-full min-h-0"
            />
          </div>
        </ResponsiveGridLayout>
      )}
    </div>
  )
}
