
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getSunnyVenueCount, getSunnyVenues } from './mapRendering/venueRenderer';
import { SunPosition } from '@/utils/sunCalculator';

interface SunnyVenuesDropdownProps {
  sunPosition: SunPosition;
  currentTime: Date;
}

const SunnyVenuesDropdown = ({ sunPosition, currentTime }: SunnyVenuesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sunnyVenueCount = getSunnyVenueCount(sunPosition);
  const sunnyVenues = getSunnyVenues(sunPosition);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200 hover:bg-white/95 transition-all duration-200 flex items-center space-x-2"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-sun-600">
            {sunnyVenueCount}
          </div>
          <div className="text-xs text-gray-600">venues in sun</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Currently Sunny Venues</h3>
            <p className="text-sm text-gray-600">Venues with direct sunlight right now</p>
          </div>
          
          <div className="py-2">
            {sunnyVenues.length > 0 ? (
              sunnyVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">
                      {venue.type === 'cafe' ? '☕' : venue.type === 'bar' ? '🍺' : '🍽️'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{venue.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{venue.type}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-sun-500 mr-2"></div>
                        <span className="text-xs text-sun-600 font-medium">Direct sunlight</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <div className="text-2xl mb-2">🌫️</div>
                <p className="text-sm">No venues are currently in direct sunlight</p>
                <p className="text-xs text-gray-400 mt-1">
                  {sunPosition.elevation <= 0 ? 'Sun is below horizon' : 'All venues are in shadow'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SunnyVenuesDropdown;
