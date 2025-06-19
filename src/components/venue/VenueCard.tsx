
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Venue } from '@/data/stockholmVenues';

interface VenueCardProps {
  venue: Venue;
  isSunny: boolean;
  currentHour: string;
}

const VenueCard =({ venue, isSunny, currentHour }: VenueCardProps) => {
  return (
    <Card className={`p-3 transition-all hover:shadow-md ${
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
};

export default VenueCard;
