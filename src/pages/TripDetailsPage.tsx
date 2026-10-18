import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Trip } from '../types';
import { getTripById, deleteTripStop, reorderTripStops, exportTripToCSV, exportTripToJSON } from '../services/trips';
import { StopCard } from '../components/trips/StopCard';
import { TransitConnector } from '../components/trips/TransitConnector';
import { PackingChecklist } from '../components/trips/PackingChecklist';
import { TripPassport } from '../components/trips/TripPassport';
import { BudgetSummary } from '../components/trips/BudgetSummary';
import { MapView } from '../components/places/MapView';
import { NeoBadge } from '../components/ui/NeoBadge';
import { NeoButton } from '../components/ui/NeoButton';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Printer,
  Plus,
  Check,
  Download,
  FileSpreadsheet,
  Map as MapIcon,
  List as ListIcon
} from 'lucide-react';

export const TripDetailsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fetchTrip = async () => {
    if (!tripId) return;
    setIsLoading(true);
    const data = await getTripById(tripId);
    setTrip(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
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
          title="Trip Not Found"
          description="This itinerary does not exist or may have been deleted."
          actionLabel="Return to My Trips"
          onAction={() => window.location.href = '/trips'}
        />
      </div>
    );
  }

  const allStops = trip.stops || [];

  // Group stops by day
  const daysInTrip = Array.from(new Set(allStops.map(s => s.day_number))).sort((a, b) => a - b);
  if (daysInTrip.length === 0) daysInTrip.push(1);

  const filteredStops = selectedDay === 'all'
    ? allStops.sort((a, b) => (a.day_number - b.day_number) || (a.sort_order - b.sort_order))
    : allStops.filter(s => s.day_number === selectedDay).sort((a, b) => a.sort_order - b.sort_order);

  // Stop Reordering Handlers
  const handleMoveStop = async (stopId: string, direction: 'up' | 'down') => {
    const stopToMove = allStops.find(s => s.id === stopId);
    if (!stopToMove) return;

    const dayStops = allStops
      .filter(s => s.day_number === stopToMove.day_number)
      .sort((a, b) => a.sort_order - b.sort_order);

    const currentIndex = dayStops.findIndex(s => s.id === stopId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= dayStops.length) return;

    // Swap IDs
    const newOrderedIds = [...dayStops.map(s => s.id)];
    const temp = newOrderedIds[currentIndex];
    newOrderedIds[currentIndex] = newOrderedIds[targetIndex];
    newOrderedIds[targetIndex] = temp;

    await reorderTripStops(trip.id, stopToMove.day_number, newOrderedIds);
    await fetchTrip();
  };

  const handleDeleteStop = async (stopId: string) => {
    await deleteTripStop(stopId);
    await fetchTrip();
  };

  const handleShareTrip = () => {
    const sharedUrl = `${window.location.origin}/shared/${trip.id}`;
    navigator.clipboard.writeText(sharedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert stops to Map Place format
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
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 font-bold text-sm uppercase text-[#171717] hover:underline bg-white px-3 py-1.5 rounded-lg border-2 border-[#171717] shadow-[2px_2px_0_#171717] self-start"
        >
          <ArrowLeft size={16} /> All Trips
        </Link>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export to CSV */}
          <button
            onClick={() => exportTripToCSV(trip)}
            className="neo-btn neo-btn-secondary neo-btn-sm"
            title="Download CSV spreadsheet"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            <span>CSV</span>
          </button>

          {/* Export to JSON */}
          <button
            onClick={() => exportTripToJSON(trip)}
            className="neo-btn neo-btn-secondary neo-btn-sm"
            title="Export JSON itinerary dossier"
          >
            <Download size={14} />
            <span>JSON</span>
          </button>

          <button
            onClick={handleShareTrip}
            className="neo-btn neo-btn-secondary neo-btn-sm"
            title="Copy shareable link"
          >
            {copiedLink ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="neo-btn neo-btn-secondary neo-btn-sm hidden sm:inline-flex"
            title="Print itinerary"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Trip Header Banner */}
      <section className="neo-card p-6 sm:p-8 bg-white border-[3px] border-[#171717] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <NeoBadge label={trip.status} variant="lemon" />
              {trip.destination_label && (
                <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1 bg-[#76D7FF]/30 px-2 py-0.5 rounded border border-[#171717]">
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
          </div>

          <Link to="/">
            <NeoButton variant="primary" size="lg">
              <Plus size={18} />
              <span>Explore More Places</span>
            </NeoButton>
          </Link>
        </div>

        {trip.notes && (
          <p className="text-sm text-gray-700 bg-[#FFFDF5] p-3 rounded-lg border-2 border-[#171717]/20 font-medium italic">
            "{trip.notes}"
          </p>
        )}
      </section>

      {/* Trip Passport & Verification Meter (Feature Catalogue Section 4) */}
      <section>
        <TripPassport trip={trip} />
      </section>

      {/* Budget Summary Component */}
      <section>
        <BudgetSummary stops={allStops} currency={trip.currency} />
      </section>

      {/* Day Tabs & View Switcher */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#171717]">
          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3.5 py-1.5 rounded-lg border-2 text-xs sm:text-sm font-extrabold uppercase transition-all cursor-pointer ${
                selectedDay === 'all'
                  ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0_#D8FF3E]'
                  : 'bg-white text-[#171717] border-[#171717] hover:bg-[#FFE600]'
              }`}
            >
              All Days ({allStops.length})
            </button>

            {daysInTrip.map(day => {
              const countInDay = allStops.filter(s => s.day_number === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-1.5 rounded-lg border-2 text-xs sm:text-sm font-extrabold uppercase transition-all cursor-pointer ${
                    selectedDay === day
                      ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0_#D8FF3E]'
                      : 'bg-white text-[#171717] border-[#171717] hover:bg-[#FFE600]'
                  }`}
                >
                  Day {day} ({countInDay})
                </button>
              );
            })}
          </div>

          {/* List vs Map Switcher */}
          <div className="inline-flex rounded-lg border-2 border-[#171717] bg-white p-0.5 shadow-[2px_2px_0_#171717] shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded transition-colors ${
                viewMode === 'list' ? 'bg-[#171717] text-white' : 'text-gray-600'
              }`}
            >
              <ListIcon size={14} /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded transition-colors ${
                viewMode === 'map' ? 'bg-[#171717] text-white' : 'text-gray-600'
              }`}
            >
              <MapIcon size={14} /> Map
            </button>
          </div>
        </div>

        {/* Itinerary Stops View */}
        {filteredStops.length === 0 ? (
          <EmptyState
            title="No Stops on This Day"
            description="Browse places to add attractions, cafes, and activities to your itinerary."
            actionLabel="Discover Places to Add"
            onAction={() => window.location.href = '/'}
          />
        ) : viewMode === 'map' ? (
          <div className="space-y-2">
            <MapView places={mapPlaces} className="h-[500px] w-full" />
            <p className="text-xs text-gray-500 font-bold text-center">
              All mapped stops in your itinerary view.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStops.map((stop, idx) => {
              const nextStop = filteredStops[idx + 1];
              // Only show transit connector between consecutive stops on the same day
              const showTransit = nextStop && nextStop.day_number === stop.day_number;

              return (
                <React.Fragment key={stop.id}>
                  <StopCard
                    stop={stop}
                    index={idx}
                    totalInDay={filteredStops.length}
                    currency={trip.currency}
                    onMoveUp={() => handleMoveStop(stop.id, 'up')}
                    onMoveDown={() => handleMoveStop(stop.id, 'down')}
                    onDelete={() => handleDeleteStop(stop.id)}
                  />
                  {showTransit && (
                    <TransitConnector fromStop={stop} toStop={nextStop} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature: Weather-Smart Travel Checklist */}
      <section className="pt-4">
        <PackingChecklist trip={trip} />
      </section>
    </div>
  );
};
