import type { Trip, TripStop } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'tripwise_trips_local';

// Seed sample trip for first-time visitors
const DEFAULT_INITIAL_TRIP: Trip = {
  id: 'trip-chennai-sample',
  user_id: 'guest-user',
  title: 'Weekend in Chennai',
  destination_label: 'Chennai, Tamil Nadu',
  start_date: '2026-10-24',
  end_date: '2026-10-26',
  currency: 'INR',
  notes: 'Explore coastal monuments, savor authentic filter coffee, and visit heritage temples.',
  status: 'planning',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  stops: [
    {
      id: 'stop-1',
      trip_id: 'trip-chennai-sample',
      provider: 'geoapify',
      provider_place_id: 'che-1',
      name: 'Marina Beach Sunrise Walk',
      category: 'natural',
      address: 'Marina Beach Road, Triplicane',
      latitude: 13.0499,
      longitude: 80.2824,
      day_number: 1,
      sort_order: 0,
      estimated_cost: 150,
      notes: 'Catch the 6 AM sunrise and fresh coconut water.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'stop-2',
      trip_id: 'trip-chennai-sample',
      provider: 'geoapify',
      provider_place_id: 'che-4',
      name: 'Murugan Idli Shop Breakfast',
      category: 'catering',
      address: 'Besant Nagar 7th Cross Street',
      latitude: 13.0003,
      longitude: 80.2678,
      day_number: 1,
      sort_order: 1,
      estimated_cost: 350,
      notes: 'Try podi idli and authentic filter coffee.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'stop-3',
      trip_id: 'trip-chennai-sample',
      provider: 'geoapify',
      provider_place_id: 'che-2',
      name: 'Kapaleeshwarar Temple Visit',
      category: 'heritage',
      address: '12, North Mada Street, Mylapore',
      latitude: 13.0336,
      longitude: 80.2699,
      day_number: 2,
      sort_order: 0,
      estimated_cost: 200,
      notes: 'Marvel at 7th-century Dravidian architecture.',
      created_at: new Date().toISOString(),
    }
  ]
};

function getLocalTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([DEFAULT_INITIAL_TRIP]));
      return [DEFAULT_INITIAL_TRIP];
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_INITIAL_TRIP];
  }
}

function saveLocalTrips(trips: Trip[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export async function getTrips(): Promise<Trip[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trips')
      .select('*, stops:trip_stops(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data;
    }
  }

  return getLocalTrips();
}

export async function getTripById(id: string): Promise<Trip | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trips')
      .select('*, stops:trip_stops(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      return data;
    }
  }

  const trips = getLocalTrips();
  return trips.find(t => t.id === id) || null;
}

export async function createTrip(tripData: Partial<Trip>): Promise<Trip> {
  const newTrip: Trip = {
    id: `trip-${Date.now()}`,
    user_id: 'current-user',
    title: tripData.title || 'My Next Journey',
    destination_label: tripData.destination_label || 'Destination',
    start_date: tripData.start_date,
    end_date: tripData.end_date,
    currency: tripData.currency || 'INR',
    notes: tripData.notes || '',
    status: tripData.status || 'planning',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stops: [],
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trips')
      .insert([{
        title: newTrip.title,
        destination_label: newTrip.destination_label,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        currency: newTrip.currency,
        notes: newTrip.notes,
        status: newTrip.status,
      }])
      .select()
      .single();

    if (!error && data) {
      return { ...data, stops: [] };
    }
  }

  const trips = getLocalTrips();
  trips.unshift(newTrip);
  saveLocalTrips(trips);
  return newTrip;
}

export async function updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trips')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  }

  const trips = getLocalTrips();
  const idx = trips.findIndex(t => t.id === id);
  if (idx !== -1) {
    trips[idx] = { ...trips[idx], ...updates, updated_at: new Date().toISOString() };
    saveLocalTrips(trips);
    return trips[idx];
  }
  return null;
}

export async function deleteTrip(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (!error) return true;
  }

  const trips = getLocalTrips().filter(t => t.id !== id);
  saveLocalTrips(trips);
  return true;
}

export async function addTripStop(tripId: string, stop: Partial<TripStop>): Promise<TripStop> {
  const newStop: TripStop = {
    id: `stop-${Date.now()}`,
    trip_id: tripId,
    provider: stop.provider || 'geoapify',
    provider_place_id: stop.provider_place_id,
    name: stop.name || 'New Stop',
    category: stop.category || 'tourism',
    address: stop.address || '',
    latitude: stop.latitude,
    longitude: stop.longitude,
    day_number: stop.day_number || 1,
    sort_order: stop.sort_order ?? 99,
    estimated_cost: stop.estimated_cost || 0,
    notes: stop.notes || '',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trip_stops')
      .insert([newStop])
      .select()
      .single();

    if (!error && data) return data;
  }

  const trips = getLocalTrips();
  const trip = trips.find(t => t.id === tripId);
  if (trip) {
    if (!trip.stops) trip.stops = [];
    newStop.sort_order = trip.stops.filter(s => s.day_number === newStop.day_number).length;
    trip.stops.push(newStop);
    trip.updated_at = new Date().toISOString();
    saveLocalTrips(trips);
  }
  return newStop;
}

export async function updateTripStop(stopId: string, updates: Partial<TripStop>): Promise<TripStop | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('trip_stops')
      .update(updates)
      .eq('id', stopId)
      .select()
      .single();

    if (!error && data) return data;
  }

  const trips = getLocalTrips();
  for (const trip of trips) {
    if (trip.stops) {
      const idx = trip.stops.findIndex(s => s.id === stopId);
      if (idx !== -1) {
        trip.stops[idx] = { ...trip.stops[idx], ...updates };
        trip.updated_at = new Date().toISOString();
        saveLocalTrips(trips);
        return trip.stops[idx];
      }
    }
  }
  return null;
}

export async function deleteTripStop(stopId: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('trip_stops')
      .delete()
      .eq('id', stopId);

    if (!error) return true;
  }

  const trips = getLocalTrips();
  for (const trip of trips) {
    if (trip.stops) {
      const initialLen = trip.stops.length;
      trip.stops = trip.stops.filter(s => s.id !== stopId);
      if (trip.stops.length !== initialLen) {
        trip.updated_at = new Date().toISOString();
        saveLocalTrips(trips);
        return true;
      }
    }
  }
  return true;
}

export async function reorderTripStops(tripId: string, dayNumber: number, stopIds: string[]): Promise<boolean> {
  const trips = getLocalTrips();
  const trip = trips.find(t => t.id === tripId);
  if (trip && trip.stops) {
    stopIds.forEach((id, newIndex) => {
      const stop = trip.stops?.find(s => s.id === id);
      if (stop) {
        stop.sort_order = newIndex;
        stop.day_number = dayNumber;
      }
    });
    trip.updated_at = new Date().toISOString();
    saveLocalTrips(trips);
  }

  if (isSupabaseConfigured) {
    for (let i = 0; i < stopIds.length; i++) {
      await supabase
        .from('trip_stops')
        .update({ sort_order: i, day_number: dayNumber })
        .eq('id', stopIds[i]);
    }
  }

  return true;
}

export function calculateTripBudget(stops: TripStop[] = []): { total: number; byDay: Record<number, number> } {
  let total = 0;
  const byDay: Record<number, number> = {};

  stops.forEach(stop => {
    const cost = Number(stop.estimated_cost) || 0;
    total += cost;
    byDay[stop.day_number] = (byDay[stop.day_number] || 0) + cost;
  });

  return { total, byDay };
}

export function exportTripToCSV(trip: Trip): void {
  const headers = ['Day', 'Order', 'Place Name', 'Category', 'Address', 'Estimated Cost (' + trip.currency + ')', 'Notes'];
  const rows = (trip.stops || []).map(s => [
    `Day ${s.day_number}`,
    s.sort_order + 1,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.category || '').replace(/"/g, '""')}"`,
    `"${(s.address || '').replace(/"/g, '""')}"`,
    s.estimated_cost || 0,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TripWise-${trip.title.replace(/\s+/g, '_')}-Itinerary.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTripToJSON(trip: Trip): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(trip, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `TripWise-${trip.title.replace(/\s+/g, '_')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

