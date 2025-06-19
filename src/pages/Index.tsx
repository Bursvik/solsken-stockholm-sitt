
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import StockholmMap from '@/components/StockholmMap';
import VenueList from '@/components/VenueList';
import SunIndicator from '@/components/SunIndicator';
import { calculateSunPosition } from '@/utils/sunCalculator';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  const sunPosition = calculateSunPosition(currentTime, 59.3293, 18.0686);

  return (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map/List View */}
          <div className="lg:col-span-2">
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
                />
              )}
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-sun-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Sun Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Elevation</span>
                  <span className="font-medium">{sunPosition.elevation.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Azimuth</span>
                  <span className="font-medium">{sunPosition.azimuth.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daylight</span>
                  <span className="font-medium">
                    {sunPosition.elevation > 0 ? '☀️ Day' : '🌙 Night'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm border-sun-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Sunny Venues</h3>
              <div className="text-2xl font-bold text-sun-600 mb-2">
                12 venues
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Currently have direct sunlight on their outdoor seating
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Restaurants</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cafes</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bars</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm border-sun-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Best sun exposure is typically between 11 AM - 3 PM</p>
                <p>• South-facing terraces get the most sunlight</p>
                <p>• Check weather conditions for cloud coverage</p>
                <p>• Taller buildings create more shadows in winter</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
