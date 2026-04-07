import { MockNumberWidget } from "@/components/dashboard/mock-number-widget"
import { WeatherWidget } from "@/components/dashboard/weather-widget"

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Widgets overview for your workspace.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MockNumberWidget />
        <WeatherWidget />
      </div>
    </main>
  )
}
