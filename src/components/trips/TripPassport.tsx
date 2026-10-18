import React from 'react';
import type { Trip } from '../../types';
import { NeoCard } from '../ui/NeoCard';
import { CheckCircle2, Circle, Plane } from 'lucide-react';

interface TripPassportProps {
  trip: Trip;
}

export const TripPassport: React.FC<TripPassportProps> = ({ trip }) => {
  const stops = trip.stops || [];
  const hasDestination = Boolean(trip.destination_label);
  const hasDates = Boolean(trip.start_date);
  const hasStops = stops.length > 0;
  const hasBudgetOrNotes = stops.some(s => Number(s.estimated_cost) > 0) || Boolean(trip.notes);

  const criteria = [
    { label: 'Destination Selected', met: hasDestination, hint: trip.destination_label || 'Set destination' },
    { label: 'Travel Dates Fixed', met: hasDates, hint: trip.start_date ? 'Dates locked in' : 'Add travel dates' },
    { label: 'Itinerary Stops Added', met: hasStops, hint: `${stops.length} stops mapped` },
    { label: 'Budget & Tips Reviewed', met: hasBudgetOrNotes, hint: 'Cost estimates included' },
  ];

  const metCount = criteria.filter(c => c.met).length;
  const readinessPct = Math.round((metCount / criteria.length) * 100);

  const getPassportStatus = () => {
    if (readinessPct === 100) return { label: 'PASSED · READY FOR TAKEOFF', color: 'bg-[#D8FF3E]', stamp: 'APPROVED' };
    if (readinessPct >= 50) return { label: 'IN PROGRESS · EXPEDITION DRAFT', color: 'bg-[#FFE600]', stamp: 'IN REVIEW' };
    return { label: 'INITIALIZING · PASSPORT REQUIRED', color: 'bg-[#FF6B5E]', stamp: 'DRAFT' };
  };

  const status = getPassportStatus();

  return (
    <NeoCard className="p-6 bg-[#FFFDF5] border-[3px] border-[#171717] relative overflow-hidden">
      {/* Neo-Brutalist Official Passport Stamp */}
      <div className="absolute top-4 right-4 rotate-[12deg] pointer-events-none select-none opacity-85 hidden sm:block">
        <div className="border-[3px] border-dashed border-[#171717] p-2 text-center rounded-lg bg-white shadow-[2px_2px_0_#171717]">
          <span className="text-[10px] font-black uppercase tracking-widest block text-gray-500">TRIPWISE VISA</span>
          <span className="text-sm font-black text-[#171717] tracking-wider block">{status.stamp}</span>
          <span className="text-[9px] font-bold text-gray-400 block">{new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b-2 border-[#171717]/15">
        <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center border-2 border-[#171717] shadow-[2px_2px_0_#D8FF3E]">
          <Plane size={20} />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
            Trip Dossier Verification
          </span>
          <h4 className="font-black text-xl text-[#171717] uppercase flex items-center gap-2">
            Trip Passport & Readiness
          </h4>
        </div>
      </div>

      {/* Readiness Meter */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs font-black uppercase">
          <span className="text-gray-700">Readiness Score</span>
          <span className={`px-2 py-0.5 rounded border border-[#171717] ${status.color}`}>
            {readinessPct}% Complete
          </span>
        </div>
        <div className="w-full h-3.5 bg-white rounded-full border-2 border-[#171717] overflow-hidden p-0.5 shadow-[1.5px_1.5px_0_#171717]">
          <div
            className="h-full bg-[#171717] rounded-full transition-all duration-500"
            style={{ width: `${readinessPct}%` }}
          />
        </div>
      </div>

      {/* 4 Checklist Criteria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {criteria.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border-2 border-[#171717] flex items-start gap-2.5 ${
              item.met ? 'bg-white shadow-[2px_2px_0_#D8FF3E]' : 'bg-gray-50 opacity-60'
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {item.met ? (
                <CheckCircle2 size={16} className="text-black fill-[#D8FF3E]" />
              ) : (
                <Circle size={16} className="text-gray-400" />
              )}
            </span>
            <div>
              <span className="text-xs font-black text-[#171717] block leading-tight">
                {item.label}
              </span>
              <span className="text-[11px] font-semibold text-gray-500 block">
                {item.hint}
              </span>
            </div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
};
