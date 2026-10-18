import React from 'react';
import { Link } from 'react-router-dom';
import type { Place } from '../../types';
import { MapPin, Plus, Heart, Navigation, Info } from 'lucide-react';
import { NeoBadge } from '../ui/NeoBadge';
import { NeoButton } from '../ui/NeoButton';

interface PlaceCardProps {
  place: Place;
  isFavorite?: boolean;
  onToggleFavorite?: (place: Place) => void;
  onAddToTrip?: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isFavorite = false,
  onToggleFavorite,
  onAddToTrip
}) => {
  const getCategoryColor = (cat: string): 'lime' | 'sky' | 'coral' | 'lavender' | 'lemon' => {
    const lower = cat.toLowerCase();
    if (lower.includes('cater') || lower.includes('food')) return 'lemon';
    if (lower.includes('natur') || lower.includes('park')) return 'lime';
    if (lower.includes('herit') || lower.includes('histor')) return 'lavender';
    if (lower.includes('entertain')) return 'coral';
    return 'sky';
  };

  const badgeColor = getCategoryColor(place.category);

  return (
    <div className="neo-card neo-card-hover p-5 flex flex-col justify-between bg-white h-full relative group">
      <div>
        {/* Top Badges & Favorite Action */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <NeoBadge
            label={place.categoryLabel || place.category}
            variant={badgeColor}
          />
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(place);
              }}
              className={`p-2 rounded-lg border-2 border-[#171717] transition-transform active:scale-90 cursor-pointer ${
                isFavorite
                  ? 'bg-[#FF6B5E] text-white shadow-[2px_2px_0_#171717]'
                  : 'bg-[#FFFDF5] text-[#171717] hover:bg-[#FFE600] shadow-[2px_2px_0_#171717]'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
            </button>
          )}
        </div>

        {/* Place Title */}
        <Link to={`/places/${place.id}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="text-xl font-black tracking-tight text-[#171717] mb-2 line-clamp-2">
            {place.name}
          </h3>
        </Link>

        {/* Address / Location */}
        {place.address && (
          <p className="flex items-start gap-1.5 text-xs text-gray-700 font-medium mb-3 line-clamp-2">
            <MapPin size={14} className="shrink-0 mt-0.5 text-[#171717]" />
            <span>{place.address}</span>
          </p>
        )}

        {/* Coordinates / Distance Indicator */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase mb-4">
          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
            {place.latitude.toFixed(3)}° N, {place.longitude.toFixed(3)}° E
          </span>
          {place.city && <span>• {place.city}</span>}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t-2 border-[#171717]/10 flex items-center justify-between gap-2">
        <Link
          to={`/places/${place.id}`}
          className="text-xs font-extrabold uppercase flex items-center gap-1 text-[#171717] hover:underline"
        >
          <Info size={14} />
          <span>Details</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* External Directions Link */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md border-2 border-[#171717] bg-white hover:bg-[#76D7FF] text-[#171717] shadow-[1.5px_1.5px_0_#171717] transition-colors"
            title="Open Directions in Google Maps"
          >
            <Navigation size={14} />
          </a>

          {/* Add to Trip CTA */}
          {onAddToTrip && (
            <NeoButton
              size="sm"
              variant="primary"
              onClick={() => onAddToTrip(place)}
            >
              <Plus size={14} />
              <span>Add to Trip</span>
            </NeoButton>
          )}
        </div>
      </div>
    </div>
  );
};
