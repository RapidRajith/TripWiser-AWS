/**
 * Geo calculation utilities for TripWise
 * Calculates straight-line and estimated transit distance and travel time between stops.
 */

export interface TransitEstimate {
  distanceKm: number;
  distanceFormatted: string;
  drivingMinutes: number;
  walkingMinutes: number;
  drivingFormatted: string;
  walkingFormatted: string;
}

/**
 * Calculates the great-circle distance between two points on the Earth using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimates driving and walking duration between two coordinate pairs
 * Assumes average urban driving speed of 25 km/h and walking speed of 4.5 km/h
 * Multiplies straight-line distance by 1.3 to account for road curvature
 */
export function estimateTransitBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): TransitEstimate {
  const straightLine = calculateDistanceKm(lat1, lon1, lat2, lon2);
  const roadDistance = Math.round(straightLine * 1.3 * 10) / 10;

  const drivingMinutes = Math.max(2, Math.round((roadDistance / 25) * 60));
  const walkingMinutes = Math.round((roadDistance / 4.5) * 60);

  return {
    distanceKm: roadDistance,
    distanceFormatted: roadDistance < 1 ? `${Math.round(roadDistance * 1000)} m` : `${roadDistance} km`,
    drivingMinutes,
    walkingMinutes,
    drivingFormatted: formatMinutes(drivingMinutes),
    walkingFormatted: formatMinutes(walkingMinutes),
  };
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}
