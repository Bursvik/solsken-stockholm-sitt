
import { useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import MapCore from './core/MapCore';
import TerrainSetup from './terrain/TerrainSetup';
import BuildingShadows from './shadows/BuildingShadows';
import VenueMarkers from './markers/VenueMarkers';
import mapboxgl from 'mapbox-gl';

interface MapboxMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
  filter?: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  onVenueHover?: (venue: any) => void;
  mapRotation?: number[];
}

const MapboxMap = ({ currentTime, sunPosition, filter = 'all', onVenueHover, mapRotation = [0] }: MapboxMapProps) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log('Map loaded successfully');
    setMap(loadedMap);
  };

  if (!mapboxgl.accessToken) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Mapbox token not configured</p>
          <p className="text-sm text-gray-600">Please check the Mapbox configuration</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MapCore onMapLoad={handleMapLoad} mapRotation={mapRotation} />
      {map && (
        <>
          <TerrainSetup map={map} />
          <BuildingShadows map={map} sunPosition={sunPosition} />
          <VenueMarkers 
            map={map}
            sunPosition={sunPosition}
            filter={filter}
            currentTime={currentTime}
            onVenueHover={onVenueHover}
          />
        </>
      )}
    </>
  );
};

export default MapboxMap;
