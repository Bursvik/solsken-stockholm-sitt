
import { useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import MapCanvas from './map/MapCanvas';
import MapControls from './map/MapControls';
import MapLegend from './map/MapLegend';
import MapTimeSlider from './map/MapTimeSlider';
import { getSunnyVenueCount } from './map/mapRendering/venueRenderer';

interface StockholmMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
  selectedDate: Date;
  onTimeChange: (time: Date) => void;
}

const StockholmMap = ({ currentTime, sunPosition, selectedDate, onTimeChange }: StockholmMapProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
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

  const sunnyVenueCount = getSunnyVenueCount(sunPosition);

  return (
    <div className="relative w-full h-full">
      <MapCanvas
        currentTime={currentTime}
        sunPosition={sunPosition}
        transform={transform}
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

      <MapLegend />

      <MapTimeSlider
        currentTime={currentTime}
        selectedDate={selectedDate}
        onTimeChange={onTimeChange}
      />

      {/* Venue count indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-sun-600">
            {sunnyVenueCount}
          </div>
          <div className="text-xs text-gray-600">venues in sun</div>
        </div>
      </div>
    </div>
  );
};

export default StockholmMap;
