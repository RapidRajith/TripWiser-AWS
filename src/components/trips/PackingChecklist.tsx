import React, { useState, useEffect } from 'react';
import type { Trip } from '../../types';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { CheckSquare, Square, Plus, Trash2, Luggage, Umbrella, Sun, Shield } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'weather' | 'documents' | 'gear' | 'clothing' | 'custom';
  text: string;
  isPacked: boolean;
}

interface PackingChecklistProps {
  trip: Trip;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({ trip }) => {
  const storageKey = `tripwise_packing_${trip.id}`;

  const defaultItems: ChecklistItem[] = [
    { id: '1', category: 'weather', text: 'Compact travel umbrella or poncho', isPacked: false },
    { id: '2', category: 'weather', text: 'UV-protection sunglasses & sunscreen', isPacked: false },
    { id: '3', category: 'documents', text: 'Government ID & College/Student ID card', isPacked: true },
    { id: '4', category: 'documents', text: 'Confirmed bookings & emergency contacts', isPacked: false },
    { id: '5', category: 'gear', text: 'High-capacity power bank & cables', isPacked: false },
    { id: '6', category: 'gear', text: 'Reusable insulated hydration bottle', isPacked: true },
    { id: '7', category: 'clothing', text: 'Comfortable walking / running shoes', isPacked: false },
    { id: '8', category: 'clothing', text: 'Lightweight breathable attire', isPacked: false },
  ];

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultItems;
    } catch {
      return defaultItems;
    }
  });

  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save packing list:', e);
    }
  }, [items, storageKey]);

  const togglePacked = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isPacked: !item.isPacked } : item));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      category: 'custom',
      text: newItemText.trim(),
      isPacked: false,
    };
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const packedCount = items.filter(i => i.isPacked).length;
  const progressPct = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather':
        return <Umbrella size={13} className="text-[#FF6B5E]" />;
      case 'documents':
        return <Shield size={13} className="text-blue-600" />;
      case 'gear':
        return <Sun size={13} className="text-[#FFE600]" />;
      default:
        return <Luggage size={13} className="text-[#171717]" />;
    }
  };

  return (
    <NeoCard className="p-6 bg-white border-[2.5px] border-[#171717] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#171717]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#D8FF3E] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <Luggage size={20} className="text-[#171717]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                Weather-Smart Packing
              </span>
              <span className="bg-[#FFE600] px-1.5 py-0.2 text-[9px] font-black uppercase rounded border border-[#171717]">
                AI-Suggested
              </span>
            </div>
            <h4 className="font-black text-xl text-[#171717]">
              Travel Checklist
            </h4>
          </div>
        </div>

        {/* Packing Counter & Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-black text-[#171717] block">
              {packedCount} of {items.length} Packed
            </span>
            <span className="text-[10px] font-bold text-gray-500 block">
              {progressPct}% Ready
            </span>
          </div>
          <div className="w-24 h-4 rounded-full border-2 border-[#171717] bg-gray-100 overflow-hidden shadow-[1.5px_1.5px_0_#171717]">
            <div
              className="h-full bg-[#D8FF3E] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => togglePacked(item.id)}
            className={`p-3 rounded-lg border-2 border-[#171717] flex items-center justify-between gap-2.5 cursor-pointer select-none transition-all ${
              item.isPacked
                ? 'bg-[#D8FF3E]/20 text-gray-500 line-through shadow-none'
                : 'bg-[#FFFDF5] text-[#171717] shadow-[2px_2px_0_#171717] hover:bg-[#FFE600]/20'
            }`}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="shrink-0 text-[#171717]">
                {item.isPacked ? (
                  <CheckSquare size={18} className="text-[#171717] fill-[#D8FF3E]" />
                ) : (
                  <Square size={18} className="text-[#171717]" />
                )}
              </span>
              <span className="shrink-0">{getCategoryIcon(item.category)}</span>
              <span className="text-xs sm:text-sm font-bold truncate">
                {item.text}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(item.id);
              }}
              className="p-1 hover:text-[#FF6B5E] text-gray-400 shrink-0 cursor-pointer"
              title="Delete item"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={addItem} className="flex gap-2 pt-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item (e.g. Student bus pass, DSLR battery)..."
          className="neo-input py-2 text-xs sm:text-sm flex-1 font-semibold"
        />
        <NeoButton type="submit" variant="primary" size="sm" disabled={!newItemText.trim()}>
          <Plus size={14} />
          <span>Add</span>
        </NeoButton>
      </form>
    </NeoCard>
  );
};
