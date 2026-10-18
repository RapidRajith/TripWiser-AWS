
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
  const [selectedPlaceForTrip, setSelectedPlaceForTrip] =
    useState<Place | null>(null);
  const [attribution, setAttribution] = useState<string>('');
  const [spellingCorrection, setSpellingCorrection] =
    useState<SpellingCorrection | null>(null);

  // Load saved favorites
  useEffect(() => {
    getFavorites().then((favs) => {
      setFavoriteIds(new Set(favs.map((f) => f.provider_place_id)));
    });
  }, []);

  // Fetch places when destination or category changes
  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);

    searchPlaces({ text: destination, category, limit: 24 })
      .then((res) => {
        if (isMounted) {
          setPlaces(res.places);
          setAttribution(res.attribution);
          setSpellingCorrection(res.correction || null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.message || 'Failed to discover places for this destination'
          );
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
    <div
      className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10"
      style={{
        color: 'var(--color-ink)',
      }}
    >
      {/* Hero Section */}
      <section
        className="relative text-center py-12 sm:py-16 px-5 sm:px-8 rounded-2xl border-[3px] shadow-[6px_6px_0_#000000] transition-colors duration-200"
        style={{
          backgroundColor: 'var(--color-paper)',
          color: 'var(--color-ink)',
          borderColor: 'var(--color-ink)',
        }}
      >
        {/* Decorative corner tags */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 -rotate-3 z-10">
          <span className="neo-badge bg-[#D8FF3E] px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-[#171717]">
            ✨ AWS VIT Round 1
          </span>
        </div>

        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rotate-2 z-10 hidden sm:block">
          <span className="neo-badge bg-[#76D7FF] px-2 py-1 text-[10px] text-[#171717]">
            🗺️ Powered by Geoapify & Open-Meteo
          </span>
        </div>

        <div className="max-w-3xl mx-auto space-y-5 pt-7 sm:pt-4">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#FFE600] border-2 border-[#171717] shadow-[2px_2px_0_#171717] text-[#171717] text-[10px] sm:text-xs font-black uppercase tracking-wider max-w-full">
            <Compass size={14} className="shrink-0" />
            <span>Smart Itinerary & Place Discovery</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.12]"
            style={{ color: 'var(--color-ink)' }}
          >
            Your Next Story
            <br className="hidden sm:inline" />{' '}
            <span className="bg-[#D8FF3E] text-[#171717] px-2 sm:px-3 border-2 border-[#171717] rounded shadow-[4px_4px_0_#000000] inline-block my-2">
              Starts Here.
            </span>
          </h1>

          <p
            className="text-base sm:text-lg font-semibold max-w-xl mx-auto leading-relaxed"
            style={{
              color: 'var(--color-ink)',
              opacity: 0.85,
            }}
          >
            Discover attractions, check real-time weather forecasts, organize
            day-wise stops, and build stress-free itineraries.
          </p>

          {/* Search bar */}
          <div className="pt-2 sm:pt-4 w-full max-w-3xl mx-auto">
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
        {/* Spelling correction notice */}
        {spellingCorrection && (
          <div
            className="p-4 rounded-xl border-[2.5px] shadow-[3px_3px_0_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-bold"
            style={{
              borderColor: 'var(--color-ink)',
              backgroundColor: 'var(--color-paper)',
              color: 'var(--color-ink)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-[#FFE600] border border-[#171717] shrink-0">
                <Sparkles size={16} className="text-[#171717]" />
              </span>

              <span>
                Showing results for{' '}
                <strong className="text-base uppercase underline decoration-2">
                  {spellingCorrection.correctedQuery}
                </strong>

                <span className="text-xs opacity-75 font-semibold ml-2">
                  (auto-corrected from{' '}
                  <em>"{spellingCorrection.originalQuery}"</em>)
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSpellingCorrection(null)}
              className="text-xs font-black uppercase underline cursor-pointer self-end sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Category filters and view switcher */}
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
              setDestination((current) => current);
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
            <MapView places={places} className="h-[550px] w-full" />

            <p className="text-xs font-bold text-center opacity-70">
              Click on any pin to view place summary and add directly to your
              itinerary.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
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

        {/* Attribution */}
        {attribution && (
          <div
            className="pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-semibold"
            style={{
              borderColor: 'var(--color-ink)',
              color: 'var(--color-ink)',
              opacity: 0.8,
            }}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-600 shrink-0" />
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
