import { describe, it, expect } from 'vitest';
import { calculateDistanceKm, estimateTransitBetween } from './geo';

describe('Geo Utilities - Distance & Transit Estimator', () => {
  it('calculates distance between Marina Beach and Kapaleeshwarar Temple accurately', () => {
    // Marina Beach: 13.0499, 80.2824
    // Kapaleeshwarar: 13.0336, 80.2699
    const km = calculateDistanceKm(13.0499, 80.2824, 13.0336, 80.2699);
    // Straight line distance is roughly 2.3 - 2.5 km
    expect(km).toBeGreaterThan(1.8);
    expect(km).toBeLessThan(3.0);
  });

  it('estimates sensible driving and walking times', () => {
    const transit = estimateTransitBetween(13.0499, 80.2824, 13.0336, 80.2699);
    expect(transit.drivingMinutes).toBeGreaterThan(0);
    expect(transit.walkingMinutes).toBeGreaterThan(transit.drivingMinutes);
    expect(transit.distanceFormatted).toContain('km');
  });

  it('handles identical coordinates gracefully', () => {
    const km = calculateDistanceKm(13.0, 80.0, 13.0, 80.0);
    expect(km).toBe(0);
  });
});
