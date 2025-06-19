
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SunPosition } from '@/utils/sunCalculator';
import MapViewToggle from './map/MapViewToggle';

interface VenueListProps {
  currentTime: Date;
  sunPosition: SunPosition;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

// Expanded venue data with more cafes, bars, restaurants, and parks
const stockholmVenues = [
  // Cafes
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
  },
  {
    id: 10,
    name: 'Cafe Saturnus',
    type: 'cafe',
    address: 'Eriksbergsgatan 6, Stockholm',
    rating: 4.4,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '07:00-19:00',
    description: 'Famous for huge cinnamon buns and great coffee.',
    sunHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    image: '/placeholder.svg'
  },
  {
    id: 13,
    name: 'Vete-Katten',
    type: 'cafe',
    address: 'Kungsgatan 55, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: false,
    sunExposed: false,
    openingHours: '07:30-19:00',
    description: 'Historic pastry shop and café since 1928.',
    sunHours: [],
    image: '/placeholder.svg'
  },
  {
    id: 14,
    name: 'Café String',
    type: 'cafe',
    address: 'Nytorgsgatan 38, Stockholm',
    rating: 4.6,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '08:00-18:00',
    description: 'Trendy Södermalm café with excellent brunch.',
    sunHours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    image: '/placeholder.svg'
  },
  {
    id: 15,
    name: 'Café Pascal',
    type: 'cafe',
    address: 'Norrtullsgatan 4, Stockholm',
    rating: 4.5,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '07:00-19:00',
    description: 'French-style café with outdoor seating.',
    sunHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
    image: '/placeholder.svg'
  },

  // Restaurants
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
    id: 7,
    name: 'Sturehof',
    type: 'restaurant',
    address: 'Stureplan 2, Stockholm',
    rating: 4.4,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '11:30-01:00',
    description: 'Classic brasserie with famous outdoor terrace.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 11,
    name: 'Gondolen',
    type: 'restaurant',
    address: 'Stadsgården 6, Stockholm',
    rating: 4.5,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Elevated restaurant with panoramic city views.',
    sunHours: ['17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 16,
    name: 'Oaxen Krog',
    type: 'restaurant',
    address: 'Beckholmsvägen 26, Stockholm',
    rating: 4.9,
    priceLevel: '€€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '18:00-24:00',
    description: 'Michelin-starred restaurant with terrace seating.',
    sunHours: ['18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 17,
    name: 'Pelikan',
    type: 'restaurant',
    address: 'Blekingegatan 40, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Traditional Swedish beer hall with outdoor seating.',
    sunHours: ['17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 18,
    name: 'Djuret',
    type: 'restaurant',
    address: 'Lilla Nygatan 5, Stockholm',
    rating: 4.6,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-24:00',
    description: 'Meat-focused restaurant with cozy outdoor area.',
    sunHours: ['17:00', '18:00', '19:00'],
    image: '/placeholder.svg'
  },

  // Bars
  {
    id: 8,
    name: 'Tak Stockholm',
    type: 'bar',
    address: 'Brunkebergstorg 2-4, Stockholm',
    rating: 4.4,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Rooftop bar with stunning city views.',
    sunHours: ['17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 9,
    name: 'Riche',
    type: 'bar',
    address: 'Birger Jarlsgatan 4, Stockholm',
    rating: 4.2,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '11:00-03:00',
    description: 'Stylish bar and club with outdoor terrace.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 12,
    name: 'Mosebacke Etablissement',
    type: 'bar',
    address: 'Mosebacke torg 3, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Historic venue with large outdoor terrace.',
    sunHours: ['17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 19,
    name: 'Himlen',
    type: 'bar',
    address: 'Götgatan 78, Stockholm',
    rating: 4.5,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Sky bar with panoramic views and rooftop terrace.',
    sunHours: ['17:00', '18:00', '19:00'],
    image: '/placeholder.svg'
  },
  {
    id: 20,
    name: 'Tjoget',
    type: 'bar',
    address: 'Hornstulls Strand 4, Stockholm',
    rating: 4.4,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Trendy cocktail bar with waterfront terrace.',
    sunHours: ['17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 21,
    name: 'Pharmarium',
    type: 'bar',
    address: 'Östgötagatan 15, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Speakeasy-style cocktail bar with small terrace.',
    sunHours: ['18:00', '19:00'],
    image: '/placeholder.svg'
  },

  // Parks
  {
    id: 22,
    name: 'Kungsträdgården',
    type: 'park',
    address: 'Kungsträdgården, Stockholm',
    rating: 4.6,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Central park perfect for picnics and outdoor activities.',
    sunHours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    image: '/placeholder.svg'
  },
  {
    id: 23,
    name: 'Djurgården Park',
    type: 'park',
    address: 'Djurgården, Stockholm',
    rating: 4.8,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Large royal park with museums, walks, and open spaces.',
    sunHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 24,
    name: 'Humlegården',
    type: 'park',
    address: 'Humlegården, Stockholm',
    rating: 4.4,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Historic park in Östermalm with library and open lawns.',
    sunHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    image: '/placeholder.svg'
  },
  {
    id: 25,
    name: 'Tantolunden',
    type: 'park',
    address: 'Tantolunden, Stockholm',
    rating: 4.5,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Waterfront park on Södermalm with beaches and BBQ areas.',
    sunHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    image: '/placeholder.svg'
  },
  {
    id: 26,
    name: 'Observatorielunden',
    type: 'park',
    address: 'Observatorielunden, Stockholm',
    rating: 4.3,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Small hilltop park with great city views.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 27,
    name: 'Rålambshovsparken',
    type: 'park',
    address: 'Rålambshovsparken, Stockholm',
    rating: 4.7,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Popular waterfront park perfect for sunset views.',
    sunHours: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  }
];

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
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {[
              { key: 'all', label: 'All' },
              { key: 'sunny', label: 'Sunny Now' },
              { key: 'cafe', label: 'Cafés' },
              { key: 'restaurant', label: 'Restaurants' },
              { key: 'bar', label: 'Bars' },
              { key: 'park', label: 'Parks' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as any)}
                className={`text-xs h-7 px-2 ${filter === key ? 'bg-sun-500 hover:bg-sun-600' : ''}`}
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
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sun-500"
            >
              <option value="sunlight">Sunlight Status</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredVenues.length} {filteredVenues.length !== 1 ? 'places' : 'place'} found
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {filteredVenues.map((venue) => {
            const isSunny = isVenueSunny(venue);
            
            return (
              <Card key={venue.id} className={`p-3 transition-all hover:shadow-md ${
                isSunny ? 'ring-2 ring-sun-200 bg-sun-50/50' : ''
              }`}>
                <div className="flex items-start space-x-3">
                  {/* Venue Icon */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-lg">
                      {venue.type === 'cafe' ? '☕' : 
                       venue.type === 'bar' ? '🍺' : 
                       venue.type === 'park' ? '🌳' : '🍽️'}
                    </span>
                  </div>

                  {/* Venue Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                          {venue.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1 truncate">
                          {venue.address}
                        </p>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {venue.description}
                        </p>
                      </div>
                      
                      {/* Status & Rating */}
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        {isSunny ? (
                          <Badge className="bg-sun-500 text-white text-xs px-2 py-0.5">
                            ☀️ Sunny
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-shadow-200 text-xs px-2 py-0.5">
                            🌫️ Shaded
                          </Badge>
                        )}
                        <div className="text-right">
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{venue.rating}</span>
                          </div>
                          <div className="text-xs text-gray-500">{venue.priceLevel}</div>
                        </div>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>
                        <span className="font-medium">Open:</span> {venue.openingHours}
                      </span>
                      <span>
                        <span className="font-medium">Sunny:</span>{' '}
                        {venue.sunHours.length > 0 
                          ? `${venue.sunHours[0]}-${venue.sunHours[venue.sunHours.length - 1]}`
                          : 'Shaded'
                        }
                      </span>
                    </div>

                    {/* Compact Sun Schedule Bar */}
                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: 16 }, (_, i) => {
                        const hour = (i + 8).toString().padStart(2, '0') + ':00';
                        const isCurrentHour = hour === currentHour;
                        const hasSun = venue.sunHours.includes(hour);
                        
                        return (
                          <div
                            key={hour}
                            className={`h-1.5 flex-1 rounded-sm ${
                              hasSun 
                                ? isCurrentHour 
                                  ? 'bg-sun-600' 
                                  : 'bg-sun-400'
                                : 'bg-gray-200'
                            } ${isCurrentHour ? 'ring-1 ring-sun-800' : ''}`}
                            title={`${hour} - ${hasSun ? 'Sunny' : 'Shaded'}`}
                          />
                        );
                      })}
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
