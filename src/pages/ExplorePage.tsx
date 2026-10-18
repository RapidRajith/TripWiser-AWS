import React, { useState, useEffect } from 'react';
import type { Place, PlaceCategory, SpellingCorrection } from '../types';
import { searchPlaces } from '../services/places';
import { addFavorite, removeFavorite, getFavorites } from '../services/favorites';
import { SearchBar } from '../components/places/SearchBar';
import { CategoryFilter } from '../components/places/CategoryFilter';
import { PlaceCard } from '../components/places/PlaceCard';
import { MapView } from '../components/places/MapView';
import { AddToTripModal } from '../components/trips/AddToTripModal';
import { PlaceCardSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { ErrorState } from '../components/feedback/ErrorState';
import { Compass, ShieldCheck, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [destination, setDestination] = useState<string>('Chennai');
  const [category, setCategory] = useState<PlaceCategory>('all');
  const [places, setPlaces] = useState<Place[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaceForTrip, setSelectedPlaceForTrip] = useState<Place | null>(null);
  const [attribution, setAttribution] = useState<string>('');
  const [spellingCorrection, setSpellingCorrection] = useState<SpellingCorrection | null>(null);

  // Load user favorites on mount
  useEffect(() => {
    getFavorites().then(favs => {
      setFavoriteIds(new Set(favs.map(f => f.provider_place_id)));
    });
  }, []);

  // Fetch places when destination or category changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    searchPlaces({ text: destination, category, limit: 24 })
      .then(res => {
        if (isMounted) {
          setPlaces(res.places);
          setAttribution(res.attribution);
          setSpellingCorrection(res.correction || null);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to discover places for this destination');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [destination, category]);

  const handleToggleFavorite = async (place: Place) => {
    const isFav = favoriteIds.has(place.id);

    const nextSet = new Set(favoriteIds);

    if (isFav) {
      nextSet.delete(place.id);
      setFavoriteIds(nextSet);
      await removeFavorite(place.id);
    } else {
      nextSet.add(place.id);
      setFavoriteIds(nextSet);
      await addFavorite(place);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="relative text-center py-10 sm:py-14 px-4 rounded-2xl bg-[#FFFDF5] border-[3px] border-[#171717] shadow-[6px_6px_0_#171717] overflow-hidden">
        {/* Decorative corner tags */}
        <div className="absolute -top-3 -left-3 rotate-[-6deg]">
          <span className="neo-badge bg-[#D8FF3E] px-3 py-1 text-xs">
            ✨ AWS VIT Round 1
          </span>
        </div>
        <div className="absolute -bottom-3 -right-3 rotate-[4deg] hidden sm:block">
          <span className="neo-badge bg-[#76D7FF] px-3 py-1 text-xs">
            🗺️ Powered by Geoapify & Open-Meteo
          </span>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-[#171717] shadow-[2px_2px_0_#171717] text-xs font-black uppercase tracking-wider">
            <Compass size={14} /> Smart Itinerary & Place Discovery
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#171717] leading-[1.08]">
            Your Next Story <br className="hidden sm:inline" />
            <span className="bg-[#D8FF3E] px-3 border-2 border-[#171717] rounded shadow-[4px_4px_0_#171717] inline-block my-1">
              Starts Here.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 font-semibold max-w-xl mx-auto">
            Discover attractions, check real-time weather forecasts, organize day-wise stops, and build stress-free itineraries.
          </p>

          {/* Search bar component */}
          <div className="pt-4">
            <SearchBar
              initialValue={destination}
              onSearch={(dest) => setDestination(dest)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="space-y-6">
        {/* Spelling Verification & Auto-Correction Notice */}
        {spellingCorrection && (
          <div className="p-4 rounded-xl border-[2.5px] border-[#171717] bg-[#FFE600]/30 shadow-[3px_3px_0_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-bold text-[#171717]">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-[#FFE600] border border-[#171717] shrink-0">
                <Sparkles size={16} className="text-[#171717]" />
              </span>
              <span>
                Showing results for <strong className="text-base uppercase underline decoration-2">{spellingCorrection.correctedQuery}</strong>
                <span className="text-xs text-gray-700 font-semibold ml-2">
                  (auto-corrected from <em>"{spellingCorrection.originalQuery}"</em>)
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSpellingCorrection(null)}
              className="text-xs font-black uppercase text-gray-600 hover:text-black underline cursor-pointer self-end sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Category filters & view switcher */}
        <CategoryFilter
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
          resultCount={places.length}
          viewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
        />


        {/* Content View */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Discovery Error"
            message={error}
            onRetry={() => {
              setDestination(destination);
            }}
          />
        ) : places.length === 0 ? (
          <EmptyState
            title="No Places Found"
            description={`We couldn't find any places matching "${destination}" in category "${category}". Try another destination or clear filters.`}
            actionLabel="Reset to All Places"
            onAction={() => {
              setCategory('all');
              setDestination('Chennai');
            }}
          />
        ) : viewMode === 'map' ? (
          <div className="space-y-4">
            <MapView
              places={places}
              className="h-[550px] w-full"
            />
            <p className="text-xs text-gray-500 font-bold text-center">
              Click on any pin to view place summary and add directly to your itinerary.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                isFavorite={favoriteIds.has(place.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToTrip={(p) => setSelectedPlaceForTrip(p)}
              />
            ))}
          </div>
        )}

        {/* Attribution Bar */}
        {attribution && (
          <div className="pt-6 border-t border-gray-300 flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-600" />
              {attribution}
            </span>
            <span>Real-time location data</span>
          </div>
        )}
      </section>

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
