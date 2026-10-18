import React, { useState } from 'react';
import { createTrip } from '../../services/trips';
import type { Trip } from '../../types';
import { NeoModal } from '../ui/NeoModal';
import { NeoButton } from '../ui/NeoButton';
import { NeoInput } from '../ui/NeoInput';
import { Plus, MapPin, Calendar, FileText } from 'lucide-react';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (trip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Trip title is required');
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot precede start date');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newTrip = await createTrip({
        title: title.trim(),
        destination_label: destination.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        currency,
        notes: notes.trim() || undefined,
        status: 'planning',
      });

      onCreated(newTrip);
      onClose();
      // Reset form
      setTitle('');
      setDestination('');
      setStartDate('');
      setEndDate('');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NeoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Trip"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#FF6B5E]/15 border-2 border-[#FF6B5E] text-[#171717] rounded-lg text-xs font-bold">
            {error}
          </div>
        )}

        <NeoInput
          label="Trip Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Goa Beach Escape or Chennai Heritage Trail"
          required
        />

        <NeoInput
          label="Destination Location"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Chennai, Tamil Nadu"
          icon={<MapPin size={16} />}
        />

        <div className="grid grid-cols-2 gap-3">
          <NeoInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            icon={<Calendar size={16} />}
          />
          <NeoInput
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            icon={<Calendar size={16} />}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#171717]">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="neo-input font-bold"
          >
            <option value="INR">INR (₹) - Indian Rupee</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="JPY">JPY (¥) - Japanese Yen</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#171717] flex items-center gap-1">
            <FileText size={14} /> Trip Goals & Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Budget weekend trip with college friends. Need to cover coastal temples and street food."
            rows={2}
            className="neo-input resize-none"
          />
        </div>

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
            <span>{isSubmitting ? 'Creating...' : 'Create Itinerary'}</span>
          </NeoButton>
        </div>
      </form>
    </NeoModal>
  );
};
