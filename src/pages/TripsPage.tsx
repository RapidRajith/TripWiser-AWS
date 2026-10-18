import React, { useState, useEffect } from 'react';
import type { Trip } from '../types';
import { getTrips, deleteTrip } from '../services/trips';
import { TripCard } from '../components/trips/TripCard';
import { CreateTripModal } from '../components/trips/CreateTripModal';
import { EmptyState } from '../components/feedback/EmptyState';
import { NeoButton } from '../components/ui/NeoButton';
import { Plus, Compass } from 'lucide-react';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (e) {
      console.error('Failed to load trips:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDeleteTrip = async (tripId: string) => {
    await deleteTrip(tripId);
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const handleTripCreated = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[2.5px] border-[#171717]">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Compass size={14} className="text-[#171717]" /> Personal Travel Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#171717]">
            My Saved Trips
          </h1>
        </div>

        <NeoButton
          variant="primary"
          size="lg"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          <span>New Itinerary</span>
        </NeoButton>
      </div>

      {/* Trips Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="neo-card p-6 bg-white space-y-4">
              <LoadingSkeleton className="h-6 w-1/3" />
              <LoadingSkeleton className="h-8 w-3/4" />
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="No Trips Planned Yet"
          description="Create your first adventure itinerary or explore popular places to start adding stops!"
          actionLabel="Create First Trip"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleTripCreated}
      />
    </div>
  );
};
