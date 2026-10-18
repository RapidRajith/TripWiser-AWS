import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Trip } from '../types';
import { getTripById } from '../services/trips';
import { StopCard } from '../components/trips/StopCard';
import { TransitConnector } from '../components/trips/TransitConnector';
import { BudgetSummary } from '../components/trips/BudgetSummary';
import { MapView } from '../components/places/MapView';
import { NeoBadge } from '../components/ui/NeoBadge';
import { NeoButton } from '../components/ui/NeoButton';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { Calendar, MapPin, Compass, Printer, Eye, Sparkles } from 'lucide-react';

export const SharedTripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tripId) return;
    setIsLoading(true);
    getTripById(tripId).then(data => {
      setTrip(data);
      setIsLoading(false);
    });
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <LoadingSkeleton className="h-10 w-48" />
        <LoadingSkeleton className="h-40 w-full" />
        <LoadingSkeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <EmptyState
          title="Shared Itinerary Unavailable"
          description="This shared travel plan may have been deleted by the owner or does not exist."
          actionLabel="Explore Places on TripWise"
          onAction={() => window.location.href = '/'}
        />
      </div>
    );
  }

  const allStops = trip.stops || [];
  const daysInTrip = Array.from(new Set(allStops.map(s => s.day_number))).sort((a, b) => a - b);
  if (daysInTrip.length === 0) daysInTrip.push(1);

  const filteredStops = selectedDay === 'all'
    ? allStops.sort((a, b) => (a.day_number - b.day_number) || (a.sort_order - b.sort_order))
    : allStops.filter(s => s.day_number === selectedDay).sort((a, b) => a.sort_order - b.sort_order);

  const mapPlaces = allStops
    .filter(s => s.latitude && s.longitude)
    .map(s => ({
      id: s.id,
      provider: 'geoapify' as const,
      name: s.name,
      category: s.category || 'tourism',
      address: s.address,
      latitude: s.latitude!,
      longitude: s.longitude!,
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border-2 border-[#171717] bg-[#76D7FF]/30 shadow-[3px_3px_0_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-[#171717]">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-[#171717] shrink-0" />
          <span>
            You are viewing a <strong>Read-Only Shared Itinerary</strong>.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="hover:underline flex items-center gap-1 font-extrabold uppercase text-[#171717] cursor-pointer"
          >
            <Printer size={13} /> Print Itinerary
          </button>
          <span className="text-gray-400">|</span>
          <Link
            to="/"
            className="hover:underline font-extrabold uppercase text-[#171717] flex items-center gap-1"
          >
            <Sparkles size={13} /> Plan My Own Trip
          </Link>
        </div>
      </div>

      {/* Trip Header */}
      <section className="neo-card p-6 sm:p-8 bg-white border-[3px] border-[#171717] space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <NeoBadge label="Shared Dossier" variant="sky" />
            {trip.destination_label && (
              <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1 bg-[#D8FF3E]/40 px-2 py-0.5 rounded border border-[#171717]">
                <MapPin size={12} /> {trip.destination_label}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#171717]">
            {trip.title}
          </h1>

          {(trip.start_date || trip.end_date) && (
            <p className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
              <Calendar size={16} className="text-[#171717]" />
              <span>
                {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'} —{' '}
                {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'TBD'}
              </span>
            </p>
          )}

          {trip.notes && (
            <p className="text-sm text-gray-700 bg-[#FFFDF5] p-3 rounded-lg border-2 border-[#171717]/20 font-medium italic mt-3">
              "{trip.notes}"
            </p>
          )}
        </div>
      </section>

      {/* Budget Summary */}
      <section>
        <BudgetSummary stops={allStops} currency={trip.currency} />
      </section>

      {/* Map Overview */}
      {mapPlaces.length > 0 && (
        <section className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
            Itinerary Route Map
          </span>
          <MapView places={mapPlaces} className="h-[400px] w-full" />
        </section>
      )}

      {/* Stops Timeline */}
      <section className="space-y-4">
        {/* Day selection tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-[#171717]">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-1.5 rounded-lg border-2 text-xs font-extrabold uppercase transition-all cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0_#D8FF3E]'
                : 'bg-white text-[#171717] border-[#171717] hover:bg-[#FFE600]'
            }`}
          >
            All Stops ({allStops.length})
          </button>
          {daysInTrip.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-lg border-2 text-xs font-extrabold uppercase transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0_#D8FF3E]'
                  : 'bg-white text-[#171717] border-[#171717] hover:bg-[#FFE600]'
              }`}
            >
              Day {day} ({allStops.filter(s => s.day_number === day).length})
            </button>
          ))}
        </div>

        {/* Read-Only Stop List */}
        <div className="space-y-3">
          {filteredStops.map((stop, idx) => {
            const nextStop = filteredStops[idx + 1];
            const showTransit = nextStop && nextStop.day_number === stop.day_number;

            return (
              <React.Fragment key={stop.id}>
                <StopCard
                  stop={stop}
                  index={idx}
                  totalInDay={filteredStops.length}
                  currency={trip.currency}
                />
                {showTransit && (
                  <TransitConnector fromStop={stop} toStop={nextStop} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA to start own trip */}
      <div className="p-8 rounded-2xl border-[3px] border-[#171717] bg-[#FFFDF5] text-center space-y-4 shadow-[5px_5px_0_#171717]">
        <h3 className="text-2xl font-black uppercase text-[#171717]">
          Inspired by this itinerary?
        </h3>
        <p className="text-sm font-semibold text-gray-600 max-w-md mx-auto">
          TripWise lets you discover places across the world, check live weather, and craft custom day-wise journeys in seconds.
        </p>
        <Link to="/" className="inline-block">
          <NeoButton variant="primary" size="lg">
            <Compass size={18} />
            <span>Create Your Free Itinerary</span>
          </NeoButton>
        </Link>
      </div>
    </div>
  );
};
