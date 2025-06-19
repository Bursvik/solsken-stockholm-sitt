
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSunnyVenues } from '@/data/stockholmVenues';
import { SunPosition } from '@/utils/sunCalculator';
import { ChevronDown } from 'lucide-react';

interface SunnyVenuesDropdownProps {
  sunPosition: SunPosition;
  currentTime: Date;
}

const SunnyVenuesDropdown = ({ sunPosition, currentTime }: SunnyVenuesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
  const sunnyVenues = getSunnyVenues(sunPosition, currentHour);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm border-sun-200 text-gray-700 hover:bg-sun-50 text-xs px-2 py-1 h-8"
      >
        <span className="text-sun-500 mr-1">☀️</span>
        {sunnyVenues.length} Venues
        <ChevronDown className="w-3 h-3 ml-1" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm">Venues in Sun</h3>
            <p className="text-xs text-gray-600">Currently sunny outdoor areas</p>
          </div>
          
          {sunnyVenues.length > 0 ? (
            <div className="p-2">
              {sunnyVenues.map((venue) => (
                <div key={venue.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded text-xs">
                  <span className="text-sm">
                    {venue.type === 'cafe' ? '☕' : 
                     venue.type === 'bar' ? '🍺' : 
                     venue.type === 'park' ? '🌳' : '🍽️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{venue.name}</div>
                    <div className="text-gray-500 capitalize">{venue.type}</div>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <span>★</span>
                    <span className="ml-1 text-gray-600">{venue.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-xs">
              <div className="text-2xl mb-2">🌙</div>
              <p>No venues are currently in direct sunlight</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SunnyVenuesDropdown;
