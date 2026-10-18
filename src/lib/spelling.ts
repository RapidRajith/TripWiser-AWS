/**
 * Intelligent Spelling Verification and Auto-Correction for Global Travel Destinations
 * Implements Levenshtein Distance & Normalized Token Matching across world cities and landmarks.
 */

export interface SpellingCheckResult {
  isCorrected: boolean;
  originalQuery: string;
  correctedQuery: string;
  confidence: number;
}

// Curated worldwide registry of top visited cities, countries, and landmark destinations
export const GLOBAL_DESTINATIONS: string[] = [
  // India & South Asia
  'Chennai', 'Mumbai', 'Delhi', 'New Delhi', 'Bangalore', 'Bengaluru', 'Kolkata', 'Hyderabad',
  'Jaipur', 'Goa', 'Kochi', 'Varanasi', 'Agra', 'Udaipur', 'Amritsar', 'Shimla', 'Manali',
  'Ooty', 'Kodaikanal', 'Munnar', 'Pondicherry', 'Puducherry', 'Mysore', 'Rishikesh', 'Darjeeling',
  'Kathmandu', 'Colombo', 'Maldives',

  // Europe
  'Paris', 'London', 'Rome', 'Barcelona', 'Madrid', 'Amsterdam', 'Berlin', 'Prague', 'Vienna',
  'Venice', 'Florence', 'Milan', 'Dublin', 'Edinburgh', 'Munich', 'Budapest', 'Lisbon', 'Porto',
  'Athens', 'Santorini', 'Zurich', 'Geneva', 'Brussels', 'Copenhagen', 'Stockholm', 'Oslo',
  'Helsinki', 'Warsaw', 'Krakow', 'Dubrovnik', 'Reykjavik',

  // Middle East & Africa
  'Dubai', 'Abu Dhabi', 'Doha', 'Muscat', 'Istanbul', 'Cairo', 'Giza', 'Cape Town',
  'Johannesburg', 'Nairobi', 'Marrakech', 'Casablanca', 'Zanzibar',

  // Asia Pacific
  'Tokyo', 'Kyoto', 'Osaka', 'Seoul', 'Singapore', 'Bangkok', 'Phuket', 'Chiang Mai',
  'Bali', 'Jakarta', 'Kuala Lumpur', 'Penang', 'Hanoi', 'Ho Chi Minh City', 'Da Nang',
  'Hong Kong', 'Taipei', 'Beijing', 'Shanghai', 'Sydney', 'Melbourne', 'Auckland', 'Queenstown',

  // Americas
  'New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami', 'Orlando', 'Chicago',
  'Washington DC', 'Honolulu', 'Hawaii', 'Toronto', 'Vancouver', 'Montreal', 'Cancun',
  'Mexico City', 'Rio de Janeiro', 'Sao Paulo', 'Buenos Aires', 'Lima', 'Cusco', 'Santiago',

  // Global Iconic Landmarks
  'Taj Mahal', 'Eiffel Tower', 'Colosseum', 'Statue of Liberty', 'Burj Khalifa', 'Big Ben',
  'Sydney Opera House', 'Sagrada Familia', 'Louvre Museum', 'Machu Picchu', 'Petra',
  'Great Wall of China', 'Mount Fuji', 'Marina Beach', 'Kapaleeshwarar Temple'
];

/**
 * Computes Damerau-Levenshtein Distance between two strings (case-insensitive)
 * Supports insertions, deletions, substitutions, and adjacent transpositions.
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();

  const dp: number[][] = Array.from({ length: s1.length + 1 }, () =>
    Array(s2.length + 1).fill(0)
  );

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,       // deletion
        dp[i][j - 1] + 1,       // insertion
        dp[i - 1][j - 1] + cost  // substitution
      );

      // Adjacent Transposition check (e.g. "ia" <-> "ai" in "dubia" vs "dubai")
      if (
        i > 1 &&
        j > 1 &&
        s1[i - 1] === s2[j - 2] &&
        s1[i - 2] === s2[j - 1]
      ) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[s1.length][s2.length];
}


/**
 * Normalizes string for space-agnostic comparison (e.g. "newyork" -> "new york")
 */
function normalizeCompact(str: string): string {
  return str.toLowerCase().replace(/[\s\-_]/g, '');
}

/**
 * Verifies spelling and auto-corrects typos against the global registry
 */
export function verifyAndCorrectSpelling(input: string): SpellingCheckResult {
  const cleanInput = input.trim();
  if (!cleanInput) {
    return { isCorrected: false, originalQuery: input, correctedQuery: input, confidence: 1 };
  }

  const cleanLower = cleanInput.toLowerCase();
  const compactInput = normalizeCompact(cleanInput);

  // 1. Exact match check (case-insensitive)
  const exactMatch = GLOBAL_DESTINATIONS.find(d => d.toLowerCase() === cleanLower);
  if (exactMatch) {
    return { isCorrected: false, originalQuery: cleanInput, correctedQuery: exactMatch, confidence: 1 };
  }

  // 2. Compact match check (e.g. "newyork" matches "New York", "tajmahal" matches "Taj Mahal")
  const compactMatch = GLOBAL_DESTINATIONS.find(d => normalizeCompact(d) === compactInput);
  if (compactMatch) {
    return {
      isCorrected: true,
      originalQuery: cleanInput,
      correctedQuery: compactMatch,
      confidence: 0.98,
    };
  }

  // 3. Multi-word phrase check (e.g. "visiting tokyo" or "explore paris")
  if (cleanInput.split(/\s+/).length > 1) {
    const phraseMatch = GLOBAL_DESTINATIONS.find(d => {
      const dLower = d.toLowerCase();
      const regex = new RegExp(`\\b${dLower}\\b`, 'i');
      return regex.test(cleanLower);
    });
    if (phraseMatch) {
      return {
        isCorrected: false,
        originalQuery: cleanInput,
        correctedQuery: phraseMatch,
        confidence: 0.95,
      };
    }
  }


  // 4. Fuzzy Levenshtein Distance Matching
  let bestCandidate = cleanInput;
  let minDistance = Infinity;

  for (const destination of GLOBAL_DESTINATIONS) {
    // Check against standard destination name
    const dist = getLevenshteinDistance(cleanLower, destination.toLowerCase());

    // Also check against compact version
    const compactDist = getLevenshteinDistance(compactInput, normalizeCompact(destination));
    const effectiveDist = Math.min(dist, compactDist);

    if (effectiveDist < minDistance) {
      minDistance = effectiveDist;
      bestCandidate = destination;
    }
  }

  // Determine allowed distance threshold based on input length
  // e.g. "Pari" (len 4) -> dist 1 to "Paris"
  // "Chenai" (len 6) -> dist 1 to "Chennai"
  // "Barcolona" (len 9) -> dist 2 to "Barcelona"
  const maxAllowedDistance = cleanInput.length <= 4 ? 1 : cleanInput.length <= 8 ? 2 : 3;

  if (minDistance > 0 && minDistance <= maxAllowedDistance) {
    const similarity = 1 - (minDistance / Math.max(cleanInput.length, bestCandidate.length));
    return {
      isCorrected: true,
      originalQuery: cleanInput,
      correctedQuery: bestCandidate,
      confidence: Math.round(similarity * 100) / 100,
    };
  }

  // If no confident dictionary typo found, return original query (geocoder will query global Nominatim/Geoapify)
  return {
    isCorrected: false,
    originalQuery: cleanInput,
    correctedQuery: cleanInput,
    confidence: 1,
  };
}
