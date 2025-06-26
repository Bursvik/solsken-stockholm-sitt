
import { useState, useEffect } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import MapCore from './core/MapCore';
import TerrainSetup from './terrain/TerrainSetup';
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
  const [isMapReady, setIsMapReady] = useState(false);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log('MapboxMap: Map loaded successfully');
    setMap(loadedMap);
    
    // Enhanced readiness check
    const checkMapReady = () => {
      if (loadedMap.isStyleLoaded() && loadedMap.getCanvas()) {
        console.log('MapboxMap: Map is fully ready');
        setIsMapReady(true);
      } else {
        console.log('MapboxMap: Waiting for map to be fully ready...');
        setTimeout(checkMapReady, 100);
      }
    };

    if (loadedMap.isStyleLoaded()) {
      checkMapReady();
    } else {
      loadedMap.once('style.load', checkMapReady);
    }
  };

  // Debug effect to track state changes
  useEffect(() => {
    console.log('MapboxMap state:', { 
      hasMap: !!map, 
      isMapReady, 
      mapLoaded: map?.isStyleLoaded(),
      hasCanvas: !!map?.getCanvas(),
      filter,
      currentTime: currentTime.toISOString()
    });
  }, [map, isMapReady, filter, currentTime]);

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
      {map && isMapReady && (
        <>
          <TerrainSetup map={map} />
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
