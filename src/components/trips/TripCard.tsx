import React from 'react';
import { Link } from 'react-router-dom';
import type { Trip } from '../../types';
import { Calendar, MapPin, ArrowRight, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { NeoBadge } from '../ui/NeoBadge';
import { NeoButton } from '../ui/NeoButton';

interface TripCardProps {
  trip: Trip;
  onDelete?: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onDelete
}) => {
  const stopCount = trip.stops?.length || 0;

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return 'Dates Flexible';
    if (start && !end) return `From ${new Date(start).toLocaleDateString()}`;
    if (start && end) return `${new Date(start).toLocaleDateString()} — ${new Date(end).toLocaleDateString()}`;
    return '';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <NeoBadge label="Completed" variant="lime" icon={<CheckCircle2 size={12} />} />;
      case 'upcoming':
        return <NeoBadge label="Upcoming" variant="sky" icon={<Clock size={12} />} />;
      default:
        return <NeoBadge label="Planning" variant="lemon" icon={<Clock size={12} />} />;
    }
  };

  return (
    <div className="neo-card neo-card-hover p-6 bg-white flex flex-col justify-between h-full border-2 border-[#171717] group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {getStatusBadge(trip.status)}
          <span className="text-xs font-black uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
            {stopCount} {stopCount === 1 ? 'Stop' : 'Stops'}
          </span>
        </div>

        <Link to={`/trips/${trip.id}`}>
          <h3 className="text-2xl font-black tracking-tight text-[#171717] mb-2 group-hover:text-blue-600 transition-colors">
            {trip.title}
          </h3>
        </Link>

        {trip.destination_label && (
          <p className="flex items-center gap-1.5 text-xs text-gray-700 font-bold mb-2">
            <MapPin size={14} className="text-[#171717]" />
            <span>{trip.destination_label}</span>
          </p>
        )}

        <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-4">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
        </p>

        {trip.notes && (
          <p className="text-xs text-gray-600 line-clamp-2 bg-[#FFFDF5] p-2 rounded border border-gray-200 mb-4">
            {trip.notes}
          </p>
        )}
      </div>

      <div className="pt-4 border-t-2 border-[#171717]/10 flex items-center justify-between gap-3">
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
                onDelete(trip.id);
              }
            }}
            className="p-2 rounded-lg border-2 border-[#171717] bg-white hover:bg-[#FF6B5E] hover:text-white transition-colors cursor-pointer shadow-[1.5px_1.5px_0_#171717]"
            title="Delete trip"
            aria-label="Delete trip"
          >
            <Trash2 size={16} />
          </button>
        )}

        <Link to={`/trips/${trip.id}`} className="flex-1">
          <NeoButton variant="primary" size="sm" className="w-full">
            <span>Open Itinerary</span>
            <ArrowRight size={14} />
          </NeoButton>
        </Link>
      </div>
    </div>
  );
};
