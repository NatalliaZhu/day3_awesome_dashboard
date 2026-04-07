import { WidgetFrame } from "@/components/dashboard/widget-frame"
import {
  getCurrentWeather,
  weatherCodeLabel,
} from "@/lib/open-meteo"

/** Moscow — matches other app copy */
const DEFAULT_LAT = 55.7558
const DEFAULT_LON = 37.6173

export async function WeatherWidget() {
  let weather: Awaited<ReturnType<typeof getCurrentWeather>> | null = null
  let errorMessage: string | null = null

  try {
    weather = await getCurrentWeather(DEFAULT_LAT, DEFAULT_LON)
  } catch (e) {
    errorMessage =
      e instanceof Error ? e.message : "Could not load weather."
  }

  return (
    <WidgetFrame
      title="Weather"
      description="Open-Meteo forecast (current conditions, Moscow)."
    >
      {errorMessage ? (
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      ) : weather ? (
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Conditions
            </dt>
            <dd className="mt-0.5 font-medium">
              {weatherCodeLabel(weather.weatherCode)}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Temperature
              </dt>
              <dd className="mt-0.5 font-mono text-2xl font-semibold tabular-nums">
                {Math.round(weather.temperatureC)}°C
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Wind
              </dt>
              <dd className="mt-0.5 tabular-nums">
                {Math.round(weather.windSpeedKmh)} km/h
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Observed
            </dt>
            <dd className="mt-0.5 tabular-nums text-muted-foreground">
              <time dateTime={weather.observedAt}>{weather.observedAt}</time>
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">No data.</p>
      )}
    </WidgetFrame>
  )
}
