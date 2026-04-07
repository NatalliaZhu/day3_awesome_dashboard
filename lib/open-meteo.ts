const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast"

export type CurrentWeather = {
  temperatureC: number
  weatherCode: number
  windSpeedKmh: number
  observedAt: string
}

type OpenMeteoForecastJson = {
  current_weather?: {
    temperature?: number
    weathercode?: number
    windspeed?: number
    time?: string
  }
}

export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Clear sky"
  if (code === 1) return "Mainly clear"
  if (code === 2) return "Partly cloudy"
  if (code === 3) return "Overcast"
  if (code === 45 || code === 48) return "Fog"
  if (code >= 51 && code <= 55) return "Drizzle"
  if (code === 56 || code === 57) return "Freezing drizzle"
  if (code >= 61 && code <= 65) return "Rain"
  if (code === 66 || code === 67) return "Freezing rain"
  if (code >= 71 && code <= 77) return "Snow"
  if (code >= 80 && code <= 82) return "Rain showers"
  if (code === 85 || code === 86) return "Snow showers"
  if (code === 95) return "Thunderstorm"
  if (code === 96 || code === 99) return "Thunderstorm with hail"
  return "Weather"
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current_weather: "true",
  })
  const url = `${OPEN_METEO_BASE}?${params.toString()}`

  const res = await fetch(url, {
    next: { revalidate: 600 },
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Weather request failed (${res.status})`)
  }

  const data = (await res.json()) as OpenMeteoForecastJson
  const cw = data.current_weather
  if (
    cw?.temperature === undefined ||
    cw.weathercode === undefined ||
    cw.windspeed === undefined ||
    cw.time === undefined
  ) {
    throw new Error("Weather response missing current_weather fields")
  }

  return {
    temperatureC: cw.temperature,
    weatherCode: cw.weathercode,
    windSpeedKmh: cw.windspeed,
    observedAt: cw.time,
  }
}
