export type PlaceCategory = 
  | 'all'
  | 'tourism'
  | 'catering'
  | 'entertainment'
  | 'heritage'
  | 'natural'
  | 'accommodation'
  | 'leisure';

export interface Place {
  id: string;
  provider: 'geoapify' | 'opentripmap' | 'custom';
  name: string;
  category: string;
  categoryLabel?: string;
  address?: string;
  formatted_address?: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  website?: string;
  phone?: string;
  opening_hours?: string;
  wheelchair?: string;
  sourceAttribution?: string;
}

export interface PlaceSearchParams {
  text?: string;
  category?: string;
  lat?: number;
  lon?: number;
  limit?: number;
  sortBy?: 'relevance' | 'distance';
}

export interface WeatherCondition {
  label: string;
  icon: string;
  isRainy: boolean;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    condition: WeatherCondition;
    time: string;
  };
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitationProb: number;
    weathercode: number;
    condition: WeatherCondition;
  }>;
}

export type TripStatus = 'planning' | 'upcoming' | 'completed';

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination_label?: string;
  start_date?: string;
  end_date?: string;
  currency: string;
  notes?: string;
  status: TripStatus;
  share_token?: string;
  created_at: string;
  updated_at: string;
  stops?: TripStop[];
}

export interface TripStop {
  id: string;
  trip_id: string;
  provider: string;
  provider_place_id?: string;
  name: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  day_number: number;
  sort_order: number;
  estimated_cost?: number;
  notes?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  provider: string;
  provider_place_id: string;
  place_snapshot: Place;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  created_at: string;
}
