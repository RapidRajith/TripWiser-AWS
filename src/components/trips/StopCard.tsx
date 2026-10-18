import type { TripStop } from '../../types';

import { ArrowUp, ArrowDown, Trash2, MapPin, Navigation, DollarSign } from 'lucide-react';
import { NeoBadge } from '../ui/NeoBadge';

interface StopCardProps {
  stop: TripStop;
  index: number;
  totalInDay: number;
  currency?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  index,
  totalInDay,
  currency = 'INR',
  onMoveUp,
  onMoveDown,
  onDelete
}) => {
  return (
    <div className="neo-card p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-[#171717]">
      <div className="flex items-start gap-3.5 flex-1">
        {/* Step Number Badge */}
        <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#171717] shadow-[2px_2px_0_#D8FF3E]">
          {index + 1}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-black text-lg text-[#171717]">
              {stop.name}
            </h4>
            {stop.category && (
              <NeoBadge label={stop.category} variant="sky" />
            )}
          </div>

          {stop.address && (
            <p className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <MapPin size={13} className="shrink-0 text-[#171717]" />
              <span>{stop.address}</span>
            </p>
          )}

          {stop.notes && (
            <p className="text-xs bg-[#FFFDF5] p-2 rounded border border-[#171717]/20 text-gray-800 font-medium mt-1 italic">
              "{stop.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Right meta and actions */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#171717]/10">
        {/* Estimated cost badge */}
        {Number(stop.estimated_cost) > 0 && (
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-gray-400 block">Est. Cost</span>
            <span className="text-sm font-black text-[#171717] flex items-center gap-0.5 bg-[#D8FF3E]/40 px-2 py-0.5 rounded border border-[#171717]">
              <DollarSign size={12} /> {currency} {stop.estimated_cost}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {/* External map directions */}
          {stop.latitude && stop.longitude && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded border border-[#171717] bg-white hover:bg-[#76D7FF] text-[#171717] shadow-[1px_1px_0_#171717] cursor-pointer"
              title="Directions in Google Maps"
            >
              <Navigation size={14} />
            </a>
          )}

          {/* Accessible Reorder controls */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded border border-[#171717] bg-white hover:bg-[#FFE600] disabled:opacity-30 disabled:hover:bg-white shadow-[1px_1px_0_#171717] cursor-pointer"
            title="Move stop up"
            aria-label="Move stop up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalInDay - 1}
            className="p-1.5 rounded border border-[#171717] bg-white hover:bg-[#FFE600] disabled:opacity-30 disabled:hover:bg-white shadow-[1px_1px_0_#171717] cursor-pointer"
            title="Move stop down"
            aria-label="Move stop down"
          >
            <ArrowDown size={14} />
          </button>

          {/* Remove action */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded border border-[#171717] bg-white hover:bg-[#FF6B5E] hover:text-white shadow-[1px_1px_0_#171717] cursor-pointer transition-colors"
            title="Remove stop"
            aria-label="Remove stop"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
