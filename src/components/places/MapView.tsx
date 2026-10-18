import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Place } from '../../types';

interface MapViewProps {
  places: Place[];
  selectedPlace?: Place | null;
  onSelectPlace?: (place: Place) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  className = 'h-[500px] w-full'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Default center (Chennai or first place)
    const initialLat = places[0]?.latitude || 13.0827;
    const initialLon = places[0]?.longitude || 80.2707;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLon], 12);
    mapInstanceRef.current = map;

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (places.length === 0) return;

    const bounds = L.latLngBounds([]);

    places.forEach(place => {
      if (!place.latitude || !place.longitude) return;

      const marker = L.marker([place.latitude, place.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 160px;">
            <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #666; margin-bottom: 2px;">
              ${place.category}
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #171717; margin-bottom: 4px;">
              ${place.name}
            </div>
            <div style="font-size: 11px; color: #444; margin-bottom: 8px;">
              ${place.address || ''}
            </div>
            <a href="/places/${place.id}" style="display: inline-block; font-size: 11px; font-weight: 700; color: #171717; background: #D8FF3E; padding: 4px 8px; border: 1.5px solid #171717; border-radius: 4px; text-decoration: none;">
              View Details →
            </a>
          </div>
        `);

      marker.on('click', () => {
        if (onSelectPlace) onSelectPlace(place);
      });

      markersRef.current.push(marker);
      bounds.extend([place.latitude, place.longitude]);
    });

    if (markersRef.current.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [places, onSelectPlace]);

  // Center on selectedPlace if passed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && selectedPlace?.latitude && selectedPlace?.longitude) {
      map.setView([selectedPlace.latitude, selectedPlace.longitude], 14, { animate: true });
    }
  }, [selectedPlace]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full rounded-xl border-[2.5px] border-[#171717] shadow-[4px_4px_0_#171717]" />
    </div>
  );
};
