
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyc3ZpayIsImEiOiJjbWMzd3ByYXMwOHltMmxxdDV6bTdndnhtIn0.WzSEFPqiDkHGq4_XArpJ0g';

interface MapCoreProps {
  onMapLoad: (map: mapboxgl.Map) => void;
  mapRotation?: number[];
}

const MapCore = ({ onMapLoad, mapRotation = [0] }: MapCoreProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentRotation = useRef(0);

  // Memoize the map load handler to prevent unnecessary re-renders
  const handleMapLoad = useCallback(() => {
    console.log('Map fully loaded');
    setMapLoaded(true);
    setError(null);
    if (map.current) {
      onMapLoad(map.current);
    }
  }, [onMapLoad]);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Initializing Mapbox map...');
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [18.0686, 59.3293],
        zoom: 13,
        pitch: 60,
        bearing: 0,
        antialias: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

      // Event listeners
      map.current.on('load', handleMapLoad);

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map. Please check your internet connection.');
      });

      map.current.on('style.error', (e) => {
        console.error('Mapbox style error:', e);
        setError('Failed to load map style.');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map');
    }

    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        map.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  // Handle map rotation with debouncing
  useEffect(() => {
    if (!map.current || !mapLoaded || mapRotation[0] === currentRotation.current) return;
    
    try {
      if (map.current.getCanvas()) {
        currentRotation.current = mapRotation[0];
        map.current.setBearing(mapRotation[0]);
      }
    } catch (error) {
      console.error('Error setting map bearing:', error);
    }
  }, [mapRotation[0], mapLoaded]); // Only depend on the actual rotation value

  if (error) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Stockholm map with terrain...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapCore;
