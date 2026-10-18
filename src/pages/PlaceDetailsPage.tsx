import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Place } from '../types';
import { getPlaceDetails, searchPlaces } from '../services/places';
import { addFavorite, removeFavorite, checkIsFavorite } from '../services/favorites';
import { MapView } from '../components/places/MapView';
import { WeatherWidget } from '../components/places/WeatherWidget';
import { AddToTripModal } from '../components/trips/AddToTripModal';
import { NeoBadge } from '../components/ui/NeoBadge';
import { NeoButton } from '../components/ui/NeoButton';
import { ArrowLeft, MapPin, Heart, Navigation, Plus, Clock, ShieldCheck } from 'lucide-react';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/feedback/ErrorState';

export const PlaceDetailsPage: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    setIsLoading(true);
    setError(null);

    // Look for place in details service or search across known places
    getPlaceDetails(placeId)
      .then(async found => {
        if (found) {
          setPlace(found);
          const fav = await checkIsFavorite(found.id);
          setIsFavorite(fav);
          setIsLoading(false);
        } else {
          // If not in static list, query places
          const results = await searchPlaces({ text: 'Chennai', limit: 30 });
          const match = results.places.find(p => p.id === placeId);
          if (match) {
            setPlace(match);
            const fav = await checkIsFavorite(match.id);
            setIsFavorite(fav);
          } else {
            setError('Place details could not be found');
          }
          setIsLoading(false);
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load destination details');
        setIsLoading(false);
      });
  }, [placeId]);

  const handleToggleFavorite = async () => {
    if (!place) return;
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(place.id);
    } else {
      setIsFavorite(true);
      await addFavorite(place);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <LoadingSkeleton className="h-10 w-48" />
        <LoadingSkeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-80 w-full" />
          <LoadingSkeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <ErrorState
          title="Place Not Found"
          message={error || "We couldn't locate details for this destination."}
        />
        <div className="text-center mt-6">
          <Link to="/" className="neo-btn neo-btn-primary">
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold text-sm uppercase text-[#171717] hover:underline bg-white px-3 py-1.5 rounded-lg border-2 border-[#171717] shadow-[2px_2px_0_#171717]"
        >
          <ArrowLeft size={16} /> Back to Places
        </Link>
      </div>

      {/* Place Header Card */}
      <section className="neo-card p-6 sm:p-8 bg-white border-[3px] border-[#171717]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <NeoBadge label={place.categoryLabel || place.category} variant="lime" />
              {place.city && (
                <span className="text-xs font-black uppercase text-gray-600 bg-gray-100 px-2.5 py-1 rounded border border-gray-300">
                  {place.city}, {place.country || 'India'}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#171717]">
              {place.name}
            </h1>

            {place.address && (
              <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700 font-semibold">
                <MapPin size={18} className="text-[#171717] shrink-0" />
                <span>{place.address}</span>
              </p>
            )}

            {place.opening_hours && (
              <p className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Clock size={15} className="text-[#171717]" />
                <span>Visiting Hours: {place.opening_hours}</span>
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-col gap-3 shrink-0">
            <NeoButton
              variant="primary"
              size="lg"
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>Add to Itinerary</span>
            </NeoButton>

            <button
              onClick={handleToggleFavorite}
              className={`neo-btn ${isFavorite ? 'neo-btn-danger' : 'neo-btn-secondary'} w-full sm:w-auto`}
            >
              <Heart size={18} className={isFavorite ? 'fill-white' : ''} />
              <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-sky w-full sm:w-auto"
            >
              <Navigation size={18} />
              <span>Open Directions</span>
            </a>
          </div>
        </div>
      </section>

      {/* Grid: Map & Weather Forecast Side-by-Side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Interactive Map */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
            Location Map
          </span>
          <MapView
            places={[place]}
            selectedPlace={place}
            className="h-[420px] w-full"
          />
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
            <span>Coordinates: {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-green-600" /> OpenStreetMap Tiles
            </span>
          </div>
        </div>

        {/* Real-time Weather Widget */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
            Forecast & Advisory
          </span>
          <WeatherWidget
            latitude={place.latitude}
            longitude={place.longitude}
            cityName={place.city || place.name}
          />
        </div>
      </section>

      {/* Add To Trip Modal */}
      <AddToTripModal
        place={place}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => setShowAddModal(false)}
      />
    </div>
  );
};
