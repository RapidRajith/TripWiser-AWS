import type { WeatherData, WeatherCondition } from '../types';

export function getWeatherCondition(code: number): WeatherCondition {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { label: 'Clear Sky', icon: '☀️', isRainy: false };
  if (code === 1) return { label: 'Mainly Clear', icon: '🌤️', isRainy: false };
  if (code === 2) return { label: 'Partly Cloudy', icon: '⛅', isRainy: false };
  if (code === 3) return { label: 'Overcast', icon: '☁️', isRainy: false };
  if (code >= 45 && code <= 48) return { label: 'Foggy', icon: '🌫️', isRainy: false };
  if (code >= 51 && code <= 55) return { label: 'Drizzle', icon: '🌦️', isRainy: true };
  if (code >= 61 && code <= 65) return { label: 'Rain', icon: '🌧️', isRainy: true };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: '❄️', isRainy: true };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: '🌧️', isRainy: true };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: '⛈️', isRainy: true };
  return { label: 'Fair', icon: '🌤️', isRainy: false };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather service error: ${res.statusText}`);
  }

  const data = await res.json();

  const currentCode = data.current?.weather_code ?? 0;
  const currentCondition = getWeatherCondition(currentCode);

  const daily = (data.daily?.time || []).slice(0, 5).map((date: string, idx: number) => {
    const code = data.daily.weather_code[idx] ?? 0;
    return {
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[idx] ?? 0),
      tempMin: Math.round(data.daily.temperature_2m_min[idx] ?? 0),
      precipitationProb: data.daily.precipitation_probability_max[idx] ?? 0,
      weathercode: code,
      condition: getWeatherCondition(code),
    };
  });

  return {
    latitude: lat,
    longitude: lon,
    timezone: data.timezone || 'UTC',
    current: {
      temperature: Math.round(data.current?.temperature_2m ?? 0),
      windspeed: Math.round(data.current?.wind_speed_10m ?? 0),
      weathercode: currentCode,
      condition: currentCondition,
      time: data.current?.time || new Date().toISOString(),
    },
    daily,
  };
}
