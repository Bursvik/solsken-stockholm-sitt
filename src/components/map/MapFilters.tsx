
import { Button } from '@/components/ui/button';

interface MapFiltersProps {
  filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  onFilterChange: (filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park') => void;
}

const MapFilters = ({ filter, onFilterChange }: MapFiltersProps) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'sunny', label: 'Sunny Now' },
    { key: 'cafe', label: 'Cafés' },
    { key: 'restaurant', label: 'Restaurants' },
    { key: 'bar', label: 'Bars' },
    { key: 'park', label: 'Parks' }
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-sun-200 shadow-lg">
        {filters.map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(key as any)}
            className={`text-xs h-7 px-2 ${
              filter === key 
                ? 'bg-sun-500 hover:bg-sun-600 text-white' 
                : 'hover:bg-sun-100 text-gray-700'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MapFilters;
