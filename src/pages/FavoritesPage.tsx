import React, { useState, useEffect } from 'react';
import type { Favorite, Place } from '../types';
import { getFavorites, removeFavorite } from '../services/favorites';
import { PlaceCard } from '../components/places/PlaceCard';
import { AddToTripModal } from '../components/trips/AddToTripModal';
import { EmptyState } from '../components/feedback/EmptyState';
import { Bookmark, Heart } from 'lucide-react';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlaceForTrip, setSelectedPlaceForTrip] = useState<Place | null>(null);

  const loadFavorites = async () => {
    setIsLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (place: Place) => {
    await removeFavorite(place.id);
    setFavorites(prev => prev.filter(f => f.provider_place_id !== place.id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-[2.5px] border-[#171717]">
        <span className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Bookmark size={14} className="text-[#171717]" /> Shortlisted Spots
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#171717]">
          Saved Destinations
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="neo-card p-5 bg-white space-y-4">
              <LoadingSkeleton className="h-6 w-1/3" />
              <LoadingSkeleton className="h-8 w-3/4" />
              <LoadingSkeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No Favorites Saved Yet"
          description="While exploring, click the heart icon on any place to bookmark it for later."
          actionLabel="Explore Places Now"
          onAction={() => window.location.href = '/'}
          icon={<Heart size={32} className="text-[#FF6B5E]" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => (
            <PlaceCard
              key={fav.id}
              place={fav.place_snapshot}
              isFavorite={true}
              onToggleFavorite={handleRemoveFavorite}
              onAddToTrip={(p) => setSelectedPlaceForTrip(p)}
            />
          ))}
        </div>
      )}

      {/* Add To Trip Modal */}
      <AddToTripModal
        place={selectedPlaceForTrip}
        isOpen={Boolean(selectedPlaceForTrip)}
        onClose={() => setSelectedPlaceForTrip(null)}
        onSuccess={() => setSelectedPlaceForTrip(null)}
      />
    </div>
  );
};
