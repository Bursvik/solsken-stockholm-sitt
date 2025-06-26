
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
    { key: 'all' as const, label: 'All', icon: '🏢' },
    { key: 'sunny' as const, label: 'Sunny', icon: '☀️' },
    { key: 'cafe' as const, label: 'Cafés', icon: '☕' },
    { key: 'restaurant' as const, label: 'Food', icon: '🍽️' },
    { key: 'bar' as const, label: 'Bars', icon: '🍺' },
    { key: 'park' as const, label: 'Parks', icon: '🌳' },
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 space-y-2 w-full max-w-sm md:max-w-2xl px-4">
      {/* Filter Buttons - Centered */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-gray-200 shadow-lg">
        <div className="grid grid-cols-3 md:flex md:flex-wrap gap-1 md:gap-2 justify-center">
          {filterButtons.map((btn) => (
            <Button
              key={btn.key}
              variant={filter === btn.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(btn.key)}
              className="text-xs whitespace-nowrap h-8 px-2 md:h-9 md:px-3"
            >
              <span className="mr-1">{btn.icon}</span>
              <span className="hidden sm:inline">{btn.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Rotation Slider - Smaller and centered */}
      {onRotationChange && (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-700 min-w-[40px]">Rotate</span>
            <Slider
              value={currentRotation}
              onValueChange={handleRotationChange}
              max={380}
              min={-20}
              step={5}
              className="flex-1"
            />
            <span className="text-xs text-gray-600 min-w-[35px] text-right">{currentRotation[0]}°</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapFilters;
