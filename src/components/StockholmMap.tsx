
import { useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import MapboxMap from './map/MapboxMap';
import MapTimeSlider from './map/MapTimeSlider';
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
  const [mapRotation, setMapRotation] = useState([0]);

  const handleVenueHover = (venue: any) => {
    setHoveredVenue(venue);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleRotationChange = (value: number[]) => {
    setMapRotation(value);
  };

  return (
    <ErrorBoundary>
      <div className="relative w-full h-full overflow-hidden" onMouseMove={handleMouseMove}>
        <MapboxMap
          currentTime={currentTime}
          sunPosition={sunPosition}
          filter={filter}
          onVenueHover={handleVenueHover}
          mapRotation={mapRotation}
        />

        <MapTimeSlider
          currentTime={currentTime}
          selectedDate={selectedDate}
          onTimeChange={onTimeChange}
          onDateChange={onDateChange}
          sunPosition={sunPosition}
        />

        {/* Map Filters - Centered and mobile-friendly */}
        <MapFilters
          filter={filter}
          onFilterChange={setFilter}
          mapRotation={mapRotation}
          onRotationChange={handleRotationChange}
        />

        {/* Top right controls - Map/List toggle only, mobile positioned */}
        <div className="absolute top-4 right-4 z-30">
          <MapViewToggle 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>

        {/* Venue tooltip - hidden on mobile to avoid blocking interaction */}
        <div className="hidden md:block">
          <VenueTooltip
            venue={hoveredVenue}
            x={mousePosition.x}
            y={mousePosition.y}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StockholmMap;
