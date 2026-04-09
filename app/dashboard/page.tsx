import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import {
  WEATHER_DEFAULT_LAT,
  WEATHER_DEFAULT_LON,
} from "@/components/dashboard/weather-widget"
import { getCurrentWeather, type CurrentWeather } from "@/lib/open-meteo"

export default async function DashboardPage() {
  let weather: CurrentWeather | null = null
  let weatherError: string | null = null

  try {
    weather = await getCurrentWeather(WEATHER_DEFAULT_LAT, WEATHER_DEFAULT_LON)
  } catch (e) {
    weatherError =
      e instanceof Error ? e.message : "Could not load weather."
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Widgets overview for your workspace. Drag and resize cards to arrange
          the layout; positions are saved in this browser.
        </p>
      </div>
      <DashboardGrid weather={weather} weatherError={weatherError} />
    </main>
  )
}
