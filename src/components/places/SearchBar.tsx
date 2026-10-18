
import React, { useState, useEffect } from 'react';
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
  isLoading = false,
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const destination = query.trim();

    if (destination) {
      onSearch(destination);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const quickPicks = ['Chennai', 'Paris', 'Tokyo', 'Rome', 'New York'];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch gap-3"
      >
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <MapPin
            size={20}
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-ink)' }}
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where do you want to explore?"
            aria-label="Destination"
            className="w-full box-border border-[2.5px] rounded-lg pl-12 pr-11 py-3.5 text-base sm:text-lg font-semibold outline-none focus:ring-2 focus:ring-[#76D7FF] transition-colors"
            style={{
              backgroundColor: 'var(--color-paper)',
              color: 'var(--color-ink)',
              borderColor: 'var(--color-ink)',
              boxShadow: 'var(--shadow-hard-sm)',
              colorScheme: 'dark light',
            }}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#76D7FF]/20 transition-colors"
              style={{ color: 'var(--color-ink)' }}
              aria-label="Clear destination"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Button */}
        <div className="shrink-0">
          <NeoButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !query.trim()}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <Search size={20} />
            <span>{isLoading ? 'Searching...' : 'Explore Places'}</span>
          </NeoButton>
        </div>
      </form>

      {/* Popular Destinations */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span
          className="text-xs font-bold uppercase tracking-wider mr-1"
          style={{
            color: 'var(--color-ink)',
            opacity: 0.8,
          }}
        >
          Popular:
        </span>

        {quickPicks.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setQuery(city);
              onSearch(city);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-md border-2 transition-colors cursor-pointer hover:!bg-[#FFE600] hover:!text-[#171717] hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--color-paper)',
              color: 'var(--color-ink)',
              borderColor: 'var(--color-ink)',
              boxShadow: 'var(--shadow-hard-sm)',
            }}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
