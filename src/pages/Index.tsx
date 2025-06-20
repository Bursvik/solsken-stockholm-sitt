
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import StockholmMap from '@/components/StockholmMap';
import VenueList from '@/components/VenueList';
import SunIndicator from '@/components/SunIndicator';
import ErrorBoundary from '@/components/ErrorBoundary';
import { calculateSunPosition } from '@/utils/sunCalculator';
import { getSunnyVenues, getVenueStats } from '@/data/stockholmVenues';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  const sunPosition = calculateSunPosition(currentTime, 59.3293, 18.0686);
  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
  const sunnyVenues = getSunnyVenues(sunPosition, currentHour);
  const venueStats = getVenueStats();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-sky">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-sun-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full gradient-sun sun-glow flex items-center justify-center">
                  <span className="text-white text-sm">☀</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Stockholm Sun Tracker</h1>
                  <p className="text-sm text-gray-600">Find sunny outdoor dining spots</p>
                </div>
              </div>
              
              <SunIndicator sunPosition={sunPosition} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map/List View - takes up 3 columns */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] overflow-hidden bg-white/90 backdrop-blur-sm border-sun-200">
                {viewMode === 'map' ? (
                  <StockholmMap 
                    currentTime={currentTime}
                    sunPosition={sunPosition}
                    selectedDate={selectedDate}
                    onTimeChange={setCurrentTime}
                    onDateChange={setSelectedDate}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                ) : (
                  <VenueList 
                    currentTime={currentTime}
                    sunPosition={sunPosition}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                )}
              </Card>
            </div>

            {/* Info Panel - takes up 1 column */}
            <div className="space-y-4">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-sun-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Current Venues</h3>
                <div className="text-2xl font-bold text-sun-600 mb-2">
                  {sunnyVenues.length} sunny
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Places with direct sunlight right now
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Restaurants</span>
                    <span className="font-medium">
                      {sunnyVenues.filter(v => v.type === 'restaurant').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cafes</span>
                    <span className="font-medium">
                      {sunnyVenues.filter(v => v.type === 'cafe').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bars</span>
                    <span className="font-medium">
                      {sunnyVenues.filter(v => v.type === 'bar').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Parks</span>
                    <span className="font-medium">
                      {sunnyVenues.filter(v => v.type === 'park').length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
