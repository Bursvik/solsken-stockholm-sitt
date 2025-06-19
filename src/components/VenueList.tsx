
import { useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import { stockholmVenues } from '@/data/stockholmVenues';
import MapViewToggle from './map/MapViewToggle';
import VenueFilters from './venue/VenueFilters';
import VenueCard from './venue/VenueCard';

interface VenueListProps {
  currentTime: Date;
  sunPosition: SunPosition;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

const VenueList = ({ currentTime, sunPosition, viewMode, onViewModeChange }: VenueListProps) => {
  const [filter, setFilter] = useState<'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'sunlight'>('sunlight');

  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
  
  const getFilteredVenues = () => {
    let filtered = stockholmVenues;

    // Apply type filter
    if (filter !== 'all') {
      if (filter === 'sunny') {
        filtered = filtered.filter(venue => 
          sunPosition.elevation > 0 && 
          venue.sunExposed && 
          venue.sunHours.includes(currentHour)
        );
      } else {
        filtered = filtered.filter(venue => venue.type === filter);
      }
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sunlight':
          const aSunny = sunPosition.elevation > 0 && a.sunExposed && a.sunHours.includes(currentHour);
          const bSunny = sunPosition.elevation > 0 && b.sunExposed && b.sunHours.includes(currentHour);
          if (aSunny && !bSunny) return -1;
          if (!aSunny && bSunny) return 1;
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  };

  const filteredVenues = getFilteredVenues();

  const isVenueSunny = (venue: typeof stockholmVenues[0]) => {
    return sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Map Toggle */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Venues & Parks</h2>
        <MapViewToggle 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

      {/* Filter Controls */}
      <VenueFilters
        filter={filter}
        sortBy={sortBy}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
        resultCount={filteredVenues.length}
      />

      {/* Venue List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isSunny={isVenueSunny(venue)}
              currentHour={currentHour}
            />
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🌥️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or selecting a different time of day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueList;
