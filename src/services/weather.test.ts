import { describe, it, expect } from 'vitest';
import { getWeatherCondition } from './weather';

describe('Weather Service - Condition Mapping', () => {
  it('correctly maps code 0 to Clear Sky with no rain', () => {
    const res = getWeatherCondition(0);
    expect(res.label).toBe('Clear Sky');
    expect(res.isRainy).toBe(false);
  });

  it('correctly flags rainy conditions for rain codes (e.g. 61, 65, 80)', () => {
    expect(getWeatherCondition(61).isRainy).toBe(true);
    expect(getWeatherCondition(65).isRainy).toBe(true);
    expect(getWeatherCondition(80).isRainy).toBe(true);
    expect(getWeatherCondition(95).isRainy).toBe(true);
  });

  it('handles overcast and fog without rainy flag', () => {
    expect(getWeatherCondition(3).isRainy).toBe(false);
    expect(getWeatherCondition(45).isRainy).toBe(false);
  });
});
