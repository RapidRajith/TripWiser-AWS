import { describe, it, expect } from 'vitest';
import { verifyAndCorrectSpelling, getLevenshteinDistance } from './spelling';

describe('Spelling Engine - Levenshtein & Auto-Correction', () => {
  it('correctly calculates distance for small typos', () => {
    expect(getLevenshteinDistance('Chenai', 'Chennai')).toBe(1);
    expect(getLevenshteinDistance('Pariss', 'Paris')).toBe(1);
    expect(getLevenshteinDistance('Dubia', 'Dubai')).toBe(1); // 1 operation (transposition of 'i' and 'a')
  });

  it('auto-corrects common destination typos', () => {
    const r1 = verifyAndCorrectSpelling('Chenai');
    expect(r1.isCorrected).toBe(true);
    expect(r1.correctedQuery).toBe('Chennai');

    const r2 = verifyAndCorrectSpelling('Pariss');
    expect(r2.isCorrected).toBe(true);
    expect(r2.correctedQuery).toBe('Paris');

    const r3 = verifyAndCorrectSpelling('Tokiyo');
    expect(r3.isCorrected).toBe(true);
    expect(r3.correctedQuery).toBe('Tokyo');

    const r4 = verifyAndCorrectSpelling('Dubia');
    expect(r4.isCorrected).toBe(true);
    expect(r4.correctedQuery).toBe('Dubai');

    const r5 = verifyAndCorrectSpelling('Barcolona');
    expect(r5.isCorrected).toBe(true);
    expect(r5.correctedQuery).toBe('Barcelona');
  });

  it('handles space-less compound queries (e.g. newyork, tajmahal)', () => {
    const r1 = verifyAndCorrectSpelling('newyork');
    expect(r1.isCorrected).toBe(true);
    expect(r1.correctedQuery).toBe('New York');

    const r2 = verifyAndCorrectSpelling('tajmahal');
    expect(r2.isCorrected).toBe(true);
    expect(r2.correctedQuery).toBe('Taj Mahal');
  });

  it('keeps accurately spelled destinations untouched', () => {
    const r = verifyAndCorrectSpelling('London');
    expect(r.isCorrected).toBe(false);
    expect(r.correctedQuery).toBe('London');
  });
});
