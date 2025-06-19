
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SunPosition } from '@/utils/sunCalculator';

interface VenueListProps {
  currentTime: Date;
  sunPosition: SunPosition;
}

// Mock venue data with more details
const stockholmVenues = [
  {
    id: 1,
    name: 'Café Nizza',
    type: 'cafe',
    address: 'Strandvägen 30, Stockholm',
    rating: 4.5,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '08:00-22:00',
    description: 'Charming waterfront café with excellent coffee and pastries.',
    sunHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Operakällaren',
    type: 'restaurant',
    address: 'Operahuset, Karl XII:s torg, Stockholm',
    rating: 4.8,
    priceLevel: '€€€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Historic fine dining restaurant with elegant terrace.',
    sunHours: ['16:00', '17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Fotografiska Restaurant',
    type: 'restaurant',
    address: 'Stadsgårdshamnen 22, Stockholm',
    rating: 4.3,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '11:00-23:00',
    description: 'Modern restaurant with stunning harbor views.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Hermitage Restaurant',
    type: 'restaurant',
    address: 'Djurgården, Stockholm',
    rating: 4.6,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '10:00-22:00',
    description: 'Garden restaurant in beautiful Djurgården park.',
    sunHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    image: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Blå Porten',
    type: 'cafe',
    address: 'Djurgårdsslätten 26, Stockholm',
    rating: 4.2,
    priceLevel: '€€',
    terrace: true,
    sunExposed: false,
    openingHours: '08:00-20:00',
    description: 'Cozy café with garden seating in Djurgården.',
    sunHours: ['08:00', '09:00', '10:00'],
    image: '/placeholder.svg'
  },
  {
    id: 6,
    name: 'Rosendals Trädgård',
    type: 'cafe',
    address: 'Rosendalsterrassen 12, Stockholm',
    rating: 4.7,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '09:00-19:00',
    description: 'Garden café with organic food and beautiful greenhouse.',
    sunHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    image: '/placeholder.svg'
  }
];

const VenueList = ({ currentTime, sunPosition }: VenueListProps) => {
  const [filter, setFilter] = useState<'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar'>('all');
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
      {/* Filter Controls */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {[
              { key: 'all', label: 'All Venues' },
              { key: 'sunny', label: 'Currently Sunny' },
              { key: 'cafe', label: 'Cafés' },
              { key: 'restaurant', label: 'Restaurants' },
              { key: 'bar', label: 'Bars' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as any)}
                className={filter === key ? 'bg-sun-500 hover:bg-sun-600' : ''}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sun-500"
            >
              <option value="sunlight">Sunlight Status</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {filteredVenues.map((venue) => {
            const isSunny = isVenueSunny(venue);
            
            return (
              <Card key={venue.id} className={`p-4 transition-all hover:shadow-md ${
                isSunny ? 'ring-2 ring-sun-200 bg-sun-50/50' : ''
              }`}>
                <div className="flex items-start space-x-4">
                  {/* Venue Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">
                      {venue.type === 'cafe' ? '☕' : venue.type === 'bar' ? '🍺' : '🍽️'}
                    </span>
                  </div>

                  {/* Venue Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {venue.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {venue.address}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          {venue.description}
                        </p>
                      </div>
                      
                      {/* Sun Status Indicator */}
                      <div className="flex flex-col items-end space-y-2">
                        {isSunny ? (
                          <Badge className="bg-sun-500 text-white">
                            ☀️ Sunny Now
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-shadow-200">
                            🌫️ Shaded
                          </Badge>
                        )}
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{venue.rating}</span>
                          </div>
                          <div className="text-sm text-gray-500">{venue.priceLevel}</div>
                        </div>
                      </div>
                    </div>

                    {/* Opening Hours & Sun Schedule */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="text-gray-600">Open: </span>
                        <span className="font-medium">{venue.openingHours}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-600">Sunny hours: </span>
                        <span className="font-medium">
                          {venue.sunHours.length > 0 
                            ? `${venue.sunHours[0]} - ${venue.sunHours[venue.sunHours.length - 1]}`
                            : 'Shaded all day'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Sun Schedule Bar */}
                    <div className="mt-3">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 16 }, (_, i) => {
                          const hour = (i + 8).toString().padStart(2, '0') + ':00'; // 8 AM to 11 PM
                          const isCurrentHour = hour === currentHour;
                          const hasSun = venue.sunHours.includes(hour);
                          
                          return (
                            <div
                              key={hour}
                              className={`h-2 flex-1 rounded-sm ${
                                hasSun 
                                  ? isCurrentHour 
                                    ? 'bg-sun-600' 
                                    : 'bg-sun-400'
                                  : 'bg-gray-200'
                              } ${isCurrentHour ? 'ring-2 ring-sun-800' : ''}`}
                              title={`${hour} - ${hasSun ? 'Sunny' : 'Shaded'}`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>8 AM</span>
                        <span>3 PM</span>
                        <span>11 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🌥️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
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
