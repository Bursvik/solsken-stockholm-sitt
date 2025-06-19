
import { Button } from '@/components/ui/button';

interface VenueFiltersProps {
  filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  sortBy: 'name' | 'rating' | 'sunlight';
  onFilterChange: (filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park') => void;
  onSortChange: (sort: 'name' | 'rating' | 'sunlight') => void;
  resultCount: number;
}

const VenueFilters = ({ filter, sortBy, onFilterChange, onSortChange, resultCount }: VenueFiltersProps) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'sunny', label: 'Sunny Now' },
    { key: 'cafe', label: 'Cafés' },
    { key: 'restaurant', label: 'Restaurants' },
    { key: 'bar', label: 'Bars' },
    { key: 'park', label: 'Parks' }
  ];

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center space-x-2">
          {filters.map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(key as any)}
              className={`text-xs h-7 px-2 ${filter === key ? 'bg-sun-500 hover:bg-sun-600' : ''}`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sun-500"
          >
            <option value="sunlight">Sunlight Status</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {resultCount} {resultCount !== 1 ? 'places' : 'place'} found
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;
