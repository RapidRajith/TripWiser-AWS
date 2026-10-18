import React, { useState, useEffect } from 'react';
import type { Place, Trip } from '../../types';
import { getTrips, addTripStop } from '../../services/trips';
import { NeoModal } from '../ui/NeoModal';
import { NeoButton } from '../ui/NeoButton';
import { NeoInput } from '../ui/NeoInput';
import { Check, Plus, Calendar, DollarSign, FileText } from 'lucide-react';

interface AddToTripModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  place,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSavedSuccess(false);
      getTrips().then(data => {
        setTrips(data);
        if (data.length > 0) {
          setSelectedTripId(data[0].id);
        }
      });
    }
  }, [isOpen]);

  if (!place) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) return;

    setIsSubmitting(true);
    try {
      await addTripStop(selectedTripId, {
        provider: place.provider,
        provider_place_id: place.id,
        name: place.name,
        category: place.category,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        day_number: dayNumber,
        estimated_cost: estimatedCost,
        notes: notes.trim(),
      });

      setSavedSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to add stop to trip:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NeoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Place to Trip"
    >
      {savedSuccess ? (
        <div className="py-8 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#D8FF3E] border-2 border-[#171717] flex items-center justify-center shadow-[3px_3px_0_#171717]">
            <Check size={28} className="text-[#171717]" />
          </div>
          <h4 className="text-xl font-black uppercase text-[#171717] mb-1">
            Added to Itinerary!
          </h4>
          <p className="text-sm font-semibold text-gray-600">
            {place.name} has been assigned to Day {dayNumber}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Place summary */}
          <div className="p-3 bg-[#FFFDF5] rounded-lg border-2 border-[#171717]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Selected Attraction
            </span>
            <span className="font-extrabold text-[#171717] block">
              {place.name}
            </span>
            <span className="text-xs text-gray-600">
              {place.address || place.city}
            </span>
          </div>

          {/* Select Trip */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#171717]">
              Choose Itinerary
            </label>
            {trips.length === 0 ? (
              <p className="text-xs text-gray-600 font-semibold mb-2">
                No trips created yet. We will assign this to a new trip automatically!
              </p>
            ) : (
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="neo-input font-bold"
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.destination_label || 'Anywhere'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Day selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#171717] flex items-center gap-1">
              <Calendar size={14} /> Assign to Day
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayNumber(day)}
                  className={`flex-1 py-2 font-black rounded-lg border-2 text-sm uppercase transition-all cursor-pointer ${
                    dayNumber === day
                      ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0_#D8FF3E]'
                      : 'bg-white text-[#171717] border-[#171717] hover:bg-[#FFE600]'
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Cost */}
          <div>
            <NeoInput
              label="Estimated Cost (INR / Local)"
              type="number"
              min="0"
              step="50"
              value={estimatedCost || ''}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
              placeholder="e.g. 200"
              icon={<DollarSign size={16} />}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#171717] flex items-center gap-1">
              <FileText size={14} /> Stop Notes & Tips
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Try to arrive before 10 AM, camera allowed."
              rows={2}
              className="neo-input resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <NeoButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </NeoButton>
            <NeoButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              <Plus size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Add Stop'}</span>
            </NeoButton>
          </div>
        </form>
      )}
    </NeoModal>
  );
};
