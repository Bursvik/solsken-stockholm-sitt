
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';

interface MapFiltersProps {
  filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  onFilterChange: (filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park') => void;
  mapRotation?: number[];
  onRotationChange?: (value: number[]) => void;
}

const MapFilters = ({ filter, onFilterChange, mapRotation = [0], onRotationChange }: MapFiltersProps) => {
  const [currentRotation, setCurrentRotation] = useState(mapRotation);

  useEffect(() => {
    setCurrentRotation(mapRotation);
  }, [mapRotation]);

  const handleRotationChange = (value: number[]) => {
    setCurrentRotation(value);
    onRotationChange?.(value);
  };

  const filterButtons = [
    { key: 'all' as const, label: 'All Venues', icon: '🏢' },
    { key: 'sunny' as const, label: 'Sunny Now', icon: '☀️' },
    { key: 'cafe' as const, label: 'Cafés', icon: '☕' },
    { key: 'restaurant' as const, label: 'Restaurants', icon: '🍽️' },
    { key: 'bar' as const, label: 'Bars', icon: '🍺' },
    { key: 'park' as const, label: 'Parks', icon: '🌳' },
  ];

  return (
    <div className="absolute top-4 left-4 z-20 space-y-3">
      {/* Filter Buttons */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <Button
              key={btn.key}
              variant={filter === btn.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(btn.key)}
              className="text-xs whitespace-nowrap"
            >
              <span className="mr-1">{btn.icon}</span>
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Rotation Slider */}
      {onRotationChange && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-3 min-w-[250px]">
            <span className="text-sm font-medium text-gray-700">Rotate</span>
            <Slider
              value={currentRotation}
              onValueChange={handleRotationChange}
              max={380}
              min={-20}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 min-w-[40px]">{currentRotation[0]}°</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapFilters;
