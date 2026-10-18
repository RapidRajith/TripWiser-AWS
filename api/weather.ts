import { z } from 'zod';

const WeatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180)
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is allowed' } });
  }

  const parsed = WeatherQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: 'INVALID_COORDINATES',
        message: 'Valid latitude (-90 to 90) and longitude (-180 to 180) required'
      }
    });
  }

  const { lat, lon } = parsed.data;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const upstreamRes = await fetch(url);

    if (!upstreamRes.ok) {
      return res.status(502).json({
        error: { code: 'UPSTREAM_WEATHER_FAILED', message: 'Weather provider returned an error' }
      });
    }

    const data = await upstreamRes.json();
    return res.status(200).json({ data, meta: { source: 'Open-Meteo' } });
  } catch (error: any) {
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to fetch weather' }
    });
  }
}
