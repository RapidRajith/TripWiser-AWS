import type { Favorite, Place } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const FAVORITES_STORAGE_KEY = 'tripwise_favorites_local';

function getLocalFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFavorites(favs: Favorite[]) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
  } catch (e) {
    console.error('Failed to save favorites to localStorage:', e);
  }
}

export async function getFavorites(): Promise<Favorite[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) return data;
  }

  return getLocalFavorites();
}

export async function addFavorite(place: Place): Promise<Favorite> {
  const newFav: Favorite = {
    id: `fav-${Date.now()}`,
    user_id: 'current-user',
    provider: place.provider,
    provider_place_id: place.id,
    place_snapshot: place,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        provider: place.provider,
        provider_place_id: place.id,
        place_snapshot: place,
      }])
      .select()
      .single();

    if (!error && data) return data;
  }

  const favs = getLocalFavorites();
  if (!favs.some(f => f.provider_place_id === place.id)) {
    favs.unshift(newFav);
    saveLocalFavorites(favs);
  }
  return newFav;
}

export async function removeFavorite(placeId: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('provider_place_id', placeId);

    if (!error) return true;
  }

  const favs = getLocalFavorites().filter(f => f.provider_place_id !== placeId);
  saveLocalFavorites(favs);
  return true;
}

export async function checkIsFavorite(placeId: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.some(f => f.provider_place_id === placeId);
}
