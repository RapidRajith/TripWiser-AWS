import React from 'react';
import type { Trip } from '../../types';
import { createTrip, addTripStop } from '../../services/trips';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { Sparkles, MapPin, Plus } from 'lucide-react';

interface TemplateDef {
  id: string;
  title: string;
  destination: string;
  duration: string;
  currency: string;
  description: string;
  badgeColor: 'lime' | 'sky' | 'lavender';
  stops: Array<{
    name: string;
    category: string;
    day_number: number;
    estimated_cost: number;
    notes: string;
    latitude: number;
    longitude: number;
    address: string;
  }>;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'tpl-chennai',
    title: 'Chennai 48-Hour Heritage & Coastal Trail',
    destination: 'Chennai, Tamil Nadu',
    duration: '2 Days · 4 Stops',
    currency: 'INR',
    description: 'Marina Beach sunrise, historic Mylapore temples, DakshinaChitra cultural museum, and world-famous south Indian dining.',
    badgeColor: 'lime',
    stops: [
      {
        name: 'Marina Beach Sunrise Walk',
        category: 'natural',
        day_number: 1,
        estimated_cost: 100,
        notes: 'Arrive early at 6 AM for cool ocean breeze and fresh coconuts.',
        latitude: 13.0499,
        longitude: 80.2824,
        address: 'Marina Beach Road, Triplicane, Chennai',
      },
      {
        name: 'Murugan Idli Shop Breakfast',
        category: 'catering',
        day_number: 1,
        estimated_cost: 300,
        notes: 'Order signature hot ghee podi idlis and filter coffee.',
        latitude: 13.0003,
        longitude: 80.2678,
        address: 'Besant Nagar 7th Cross Street, Chennai',
      },
      {
        name: 'Kapaleeshwarar Temple Stroll',
        category: 'heritage',
        day_number: 2,
        estimated_cost: 150,
        notes: 'Respect temple timings (opens 5:30 AM, reopens 4 PM). Traditional attire required.',
        latitude: 13.0336,
        longitude: 80.2699,
        address: '12, North Mada Street, Mylapore, Chennai',
      },
      {
        name: 'DakshinaChitra Living Museum',
        category: 'tourism',
        day_number: 2,
        estimated_cost: 350,
        notes: 'Fascinating collection of 18 historic South Indian heritage homes.',
        latitude: 12.8228,
        longitude: 80.2415,
        address: 'East Coast Road, Muttukadu, Chennai',
      }
    ]
  },
  {
    id: 'tpl-paris',
    title: 'Paris 3-Day Art & Patisserie Walk',
    destination: 'Paris, France',
    duration: '3 Days · 3 Stops',
    currency: 'EUR',
    description: 'Eiffel Tower photo walk, world-renowned Louvre masterpieces, and literary coffee at historic Café de Flore.',
    badgeColor: 'sky',
    stops: [
      {
        name: 'Eiffel Tower Sunset & Summit',
        category: 'tourism',
        day_number: 1,
        estimated_cost: 35,
        notes: 'Pre-book online summit ticket to bypass lines.',
        latitude: 48.8584,
        longitude: 2.2945,
        address: 'Champ de Mars, 5 Av. Anatole France, Paris',
      },
      {
        name: 'Louvre Museum Treasures',
        category: 'tourism',
        day_number: 2,
        estimated_cost: 22,
        notes: 'Enter through Richelieu wing for shorter security queue.',
        latitude: 48.8606,
        longitude: 2.3376,
        address: 'Rue de Rivoli, 75001 Paris',
      },
      {
        name: 'Café de Flore Coffee & Croissant',
        category: 'catering',
        day_number: 3,
        estimated_cost: 20,
        notes: 'Historic meeting place of writers & philosophers in Saint-Germain.',
        latitude: 48.8542,
        longitude: 2.3325,
        address: '172 Boulevard Saint-Germain, Paris',
      }
    ]
  }
];

interface TripTemplatesProps {
  onTemplateUsed?: (newTrip: Trip) => void;
}

export const TripTemplates: React.FC<TripTemplatesProps> = ({ onTemplateUsed }) => {
  const [cloningId, setCloningId] = React.useState<string | null>(null);

  const handleUseTemplate = async (tpl: TemplateDef) => {
    setCloningId(tpl.id);
    try {
      // 1. Create trip
      const newTrip = await createTrip({
        title: tpl.title,
        destination_label: tpl.destination,
        currency: tpl.currency,
        notes: tpl.description,
        status: 'planning',
      });

      // 2. Add template stops
      for (let i = 0; i < tpl.stops.length; i++) {
        const s = tpl.stops[i];
        await addTripStop(newTrip.id, {
          name: s.name,
          category: s.category,
          day_number: s.day_number,
          estimated_cost: s.estimated_cost,
          notes: s.notes,
          latitude: s.latitude,
          longitude: s.longitude,
          address: s.address,
          sort_order: i,
        });
      }

      if (onTemplateUsed) {
        onTemplateUsed(newTrip);
      } else {
        window.location.href = `/trips/${newTrip.id}`;
      }
    } catch (err) {
      console.error('Failed to clone template:', err);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#FFE600] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0_#171717]">
          <Sparkles size={16} className="text-[#171717]" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase text-[#171717]">
            Curated 1-Click Expeditions
          </h3>
          <p className="text-xs text-gray-600 font-semibold">
            Jumpstart your planning with verified day-by-day itineraries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map(tpl => (
          <NeoCard key={tpl.id} className="p-5 bg-white border-2 border-[#171717] flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-[#FFE600] px-2 py-0.5 rounded border border-[#171717]">
                  {tpl.duration}
                </span>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {tpl.destination}
                </span>
              </div>

              <h4 className="text-lg font-black text-[#171717]">
                {tpl.title}
              </h4>

              <p className="text-xs text-gray-600 font-medium">
                {tpl.description}
              </p>
            </div>

            <NeoButton
              variant="secondary"
              size="sm"
              onClick={() => handleUseTemplate(tpl)}
              disabled={cloningId === tpl.id}
              className="w-full"
            >
              <Plus size={14} />
              <span>{cloningId === tpl.id ? 'Importing Itinerary...' : 'Clone This Template'}</span>
            </NeoButton>
          </NeoCard>
        ))}
      </div>
    </div>
  );
};
