
import { useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import MapboxMap from './map/MapboxMap';
import MapTimeSlider from './map/MapTimeSlider';
import SunnyVenuesDropdown from './map/SunnyVenuesDropdown';
import MapViewToggle from './map/MapViewToggle';
import MapFilters from './map/MapFilters';
import VenueTooltip from './map/VenueTooltip';
import ErrorBoundary from './ErrorBoundary';

interface StockholmMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
  selectedDate: Date;
  onTimeChange: (time: Date) => void;
  onDateChange: (date: Date) => void;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

const StockholmMap = ({ 
  currentTime, 
  sunPosition, 
  selectedDate, 
  onTimeChange, 
  onDateChange, 
  viewMode, 
  onViewModeChange 
}: StockholmMapProps) => {
  const [filter, setFilter] = useState<'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park'>('all');
  const [hoveredVenue, setHoveredVenue] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleVenueHover = (venue: any) => {
    setHoveredVenue(venue);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <ErrorBoundary>
      <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
        <MapboxMap
          currentTime={currentTime}
          sunPosition={sunPosition}
          filter={filter}
          onVenueHover={handleVenueHover}
        />

        <MapTimeSlider
          currentTime={currentTime}
          selectedDate={selectedDate}
          onTimeChange={onTimeChange}
          onDateChange={onDateChange}
          sunPosition={sunPosition}
        />

        {/* Map Filters */}
        <MapFilters
          filter={filter}
          onFilterChange={setFilter}
        />

        {/* Top right controls - Map/List toggle and Sunny venues dropdown */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <MapViewToggle 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
          <SunnyVenuesDropdown 
            sunPosition={sunPosition}
            currentTime={currentTime}
          />
        </div>

        <VenueTooltip
          venue={hoveredVenue}
          x={mousePosition.x}
          y={mousePosition.y}
        />
      </div>
    </ErrorBoundary>
  );
};

export default StockholmMap;
