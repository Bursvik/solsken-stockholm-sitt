
import { useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import MapCanvas from './map/MapCanvas';
import MapControls from './map/MapControls';
import MapTimeSlider from './map/MapTimeSlider';
import SunnyVenuesDropdown from './map/SunnyVenuesDropdown';
import MapViewToggle from './map/MapViewToggle';
import MapFilters from './map/MapFilters';

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
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park'>('all');
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.2 : 0.8;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * zoomFactor))
    }));
  };

  const resetView = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  return (
    <div className="relative w-full h-full">
      <MapCanvas
        currentTime={currentTime}
        sunPosition={sunPosition}
        transform={transform}
        filter={filter}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        isDragging={isDragging}
      />
      
      <MapControls
        onZoomIn={() => handleZoom('in')}
        onZoomOut={() => handleZoom('out')}
        onResetView={resetView}
        zoomLevel={transform.scale}
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
    </div>
  );
};

export default StockholmMap;
