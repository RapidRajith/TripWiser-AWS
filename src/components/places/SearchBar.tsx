import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (destination: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  isLoading = false
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const quickPicks = ['Chennai', 'Paris', 'Tokyo', 'Rome', 'New York'];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171717]">
            <MapPin size={22} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where do you want to explore? (e.g. Chennai, Paris)"
            className="neo-input pl-12 pr-10 py-3.5 text-base sm:text-lg font-semibold"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black"
              aria-label="Clear destination"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <NeoButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading || !query.trim()}
          className="whitespace-nowrap"
        >
          <Search size={20} />
          <span>{isLoading ? 'Searching...' : 'Explore Places'}</span>
        </NeoButton>
      </form>

      {/* Quick destination suggestion tags */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-1">
          Popular:
        </span>
        {quickPicks.map(city => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setQuery(city);
              onSearch(city);
            }}
            className="text-xs font-bold px-2.5 py-1 rounded-md border-1.5 border-[#171717] bg-white hover:bg-[#FFE600] transition-colors shadow-[1.5px_1.5px_0_#171717] cursor-pointer"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
