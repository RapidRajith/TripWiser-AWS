import type { PlaceCategory } from '../../types';

import { Sparkles, Landmark, Utensils, Trees, Film, Hotel, Map, List } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: PlaceCategory;
  onSelectCategory: (category: PlaceCategory) => void;
  resultCount: number;
  viewMode: 'list' | 'map';
  onToggleViewMode: (mode: 'list' | 'map') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  resultCount,
  viewMode,
  onToggleViewMode
}) => {
  const categories: Array<{ id: PlaceCategory; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Places', icon: <Sparkles size={15} /> },
    { id: 'tourism', label: 'Attractions', icon: <Landmark size={15} /> },
    { id: 'catering', label: 'Food & Dining', icon: <Utensils size={15} /> },
    { id: 'natural', label: 'Nature & Parks', icon: <Trees size={15} /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film size={15} /> },
    { id: 'accommodation', label: 'Stays', icon: <Hotel size={15} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 my-2 border-y-2 border-[#171717]">
      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-2 text-xs sm:text-sm font-bold uppercase tracking-wide cursor-pointer whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#171717] text-white border-[#171717] shadow-[2.5px_2.5px_0_#D8FF3E]'
                  : 'bg-white text-[#171717] border-[#171717] hover:bg-[#D8FF3E]/30 shadow-[2px_2px_0_#171717]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Result Count and View Switcher */}
      <div className="flex items-center justify-between md:justify-end gap-4">
        <span className="text-xs sm:text-sm font-extrabold uppercase text-[#171717] bg-[#FFE600] px-2.5 py-1 rounded border border-[#171717] shadow-[1.5px_1.5px_0_#171717]">
          {resultCount} {resultCount === 1 ? 'Place' : 'Places'} Found
        </span>

        {/* View Mode Toggle: Grid vs Map */}
        <div className="inline-flex rounded-lg border-2 border-[#171717] bg-white p-0.5 shadow-[2px_2px_0_#171717]">
          <button
            onClick={() => onToggleViewMode('list')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-[#171717] text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <List size={14} />
            <span>List</span>
          </button>
          <button
            onClick={() => onToggleViewMode('map')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-md transition-colors ${
              viewMode === 'map'
                ? 'bg-[#171717] text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Map size={14} />
            <span>Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
