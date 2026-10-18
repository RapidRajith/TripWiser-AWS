import { z } from 'zod';

const QuerySchema = z.object({
  text: z.string().min(1).max(100).default('Chennai'),
  category: z.string().max(50).default('all'),
  limit: z.coerce.number().min(1).max(50).default(20),
  sortBy: z.enum(['relevance', 'distance']).default('relevance')
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is allowed' } });
  }

  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid query parameters',
        details: parsed.error.format()
      }
    });
  }

  const { text, category, limit } = parsed.data;
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      data: [],
      meta: { count: 0, source: 'fallback', message: 'GEOAPIFY_API_KEY not configured on server' }
    });
  }

  try {
    // 1. Geocode text query
    const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`);
    if (!geoRes.ok) {
      return res.status(502).json({ error: { code: 'GEOCODE_FAILED', message: 'Failed to geocode query' } });
    }
    const geoData = await geoRes.json();
    if (!geoData.features || geoData.features.length === 0) {
      return res.status(200).json({ data: [], meta: { count: 0, source: 'geoapify' } });
    }

    const { lat, lon } = geoData.features[0].properties;

    // 2. Query places
    let catParam = 'tourism,catering,entertainment,heritage,natural';
    if (category && category !== 'all') {
      catParam = category;
    }

    const placesRes = await fetch(
      `https://api.geoapify.com/v2/places?categories=${catParam}&filter=circle:${lon},${lat},20000&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${apiKey}`
    );

    if (!placesRes.ok) {
      return res.status(502).json({ error: { code: 'UPSTREAM_ERROR', message: 'Geoapify places request failed' } });
    }

    const placesData = await placesRes.json();
    const normalized = (placesData.features || []).map((feat: any) => {
      const p = feat.properties;
      return {
        id: p.place_id || `geo-${p.lat}-${p.lon}`,
        provider: 'geoapify',
        name: p.name || p.address_line1 || 'Place of Interest',
        category: p.categories?.[0] || 'tourism',
        categoryLabel: p.categories?.[0]?.replace('_', ' ').toUpperCase(),
        address: p.formatted || p.address_line2,
        city: p.city || text,
        country: p.country,
        latitude: p.lat,
        longitude: p.lon,
        distance: p.distance,
        website: p.datasource?.raw?.website,
        sourceAttribution: 'Geoapify & OpenStreetMap contributors'
      };
    });

    return res.status(200).json({
      data: normalized,
      meta: {
        count: normalized.length,
        source: 'geoapify',
        lat,
        lon
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      }
    });
  }
}
