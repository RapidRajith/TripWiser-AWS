import { describe, it, expect } from 'vitest';
import { calculateTripBudget } from './trips';
import type { TripStop } from '../types';

describe('Trip Service - Budget Estimator', () => {
  it('returns 0 for an empty stops list', () => {
    const res = calculateTripBudget([]);
    expect(res.total).toBe(0);
    expect(Object.keys(res.byDay).length).toBe(0);
  });

  it('accurately sums costs across days', () => {
    const mockStops: TripStop[] = [
      {
        id: '1',
        trip_id: 't1',
        provider: 'geoapify',
        name: 'Marina Beach',
        day_number: 1,
        sort_order: 0,
        estimated_cost: 150,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        trip_id: 't1',
        provider: 'geoapify',
        name: 'Murugan Idli',
        day_number: 1,
        sort_order: 1,
        estimated_cost: 350,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        trip_id: 't1',
        provider: 'geoapify',
        name: 'Kapaleeshwarar Temple',
        day_number: 2,
        sort_order: 0,
        estimated_cost: 200,
        created_at: new Date().toISOString()
      }
    ];

    const res = calculateTripBudget(mockStops);
    expect(res.total).toBe(700);
    expect(res.byDay[1]).toBe(500);
    expect(res.byDay[2]).toBe(200);
  });

  it('handles stops with missing or non-numeric costs gracefully', () => {
    const mockStops: any[] = [
      { id: '1', day_number: 1, estimated_cost: null },
      { id: '2', day_number: 1, estimated_cost: undefined },
      { id: '3', day_number: 2, estimated_cost: 100 }
    ];

    const res = calculateTripBudget(mockStops as TripStop[]);
    expect(res.total).toBe(100);
    expect(res.byDay[1]).toBe(0);
    expect(res.byDay[2]).toBe(100);
  });
});
