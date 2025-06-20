
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SunPosition } from '@/utils/sunCalculator';
import { stockholmVenues } from '@/data/stockholmVenues';
import { Slider } from '@/components/ui/slider';

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyc3ZpayIsImEiOiJjbWMzd3ByYXMwOHltMmxxdDV6bTdndnhtIn0.WzSEFPqiDkHGq4_XArpJ0g';

interface MapboxMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
  filter?: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  onVenueHover?: (venue: any) => void;
}

const MapboxMap = ({ currentTime, sunPosition, filter = 'all', onVenueHover }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [mapRotation, setMapRotation] = useState([0]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
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

      // Wait for both style and data to load
      map.current.on('style.load', () => {
        console.log('Map style loaded');
        setStyleLoaded(true);
      });

      map.current.on('load', () => {
        console.log('Map fully loaded');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add enhanced 3D buildings with individual shadow sources
  useEffect(() => {
    if (!map.current || !styleLoaded) return;

    try {
      // Remove existing layers if they exist
      if (map.current.getLayer('3d-buildings')) {
        map.current.removeLayer('3d-buildings');
      }
      if (map.current.getLayer('building-shadows')) {
        map.current.removeLayer('building-shadows');
      }
      if (map.current.getSource('building-shadows')) {
        map.current.removeSource('building-shadows');
      }

      // Add enhanced 3D buildings layer
      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 10,
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'height'],
            0,
            '#e2e8f0',
            50,
            '#cbd5e1',
            100,
            '#94a3b8',
            200,
            '#64748b'
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            0,
            12.5,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            0,
            12.5,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-ambient-occlusion-intensity': 0.4,
          'fill-extrusion-ambient-occlusion-radius': 3.0
        }
      });

      // Add individual building shadows that are attached to each building
      if (sunPosition.elevation > 5) {
        const shadowOpacity = Math.max(0.2, Math.min(0.7, (90 - sunPosition.elevation) / 90 * 0.8));
        
        // Calculate shadow offset based on sun position
        const sunAzimuthMath = (90 - sunPosition.azimuth + 360) % 360;
        const sunAzimuthRadians = (sunAzimuthMath * Math.PI) / 180;
        const shadowAzimuthRadians = sunAzimuthRadians + Math.PI;
        
        // Shadow length calculation based on sun elevation
        const baseShadowLength = sunPosition.elevation > 0 ? 
          Math.max(5, 50 / Math.tan(Math.max(sunPosition.elevation * Math.PI / 180, 0.1))) : 0;
        
        const shadowOffsetX = Math.cos(shadowAzimuthRadians) * baseShadowLength;
        const shadowOffsetY = Math.sin(shadowAzimuthRadians) * baseShadowLength;

        // Create individual shadow layer for each building
        map.current.addLayer({
          id: 'building-shadows',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': 'rgba(0, 0, 0, 0.6)',
            'fill-extrusion-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              0,
              16,
              shadowOpacity
            ],
            'fill-extrusion-height': 0.5,
            'fill-extrusion-base': 0,
            // Translate each building's shadow individually
            'fill-extrusion-translate': [shadowOffsetX, shadowOffsetY],
            'fill-extrusion-translate-anchor': 'map'
          }
        }, '3d-buildings');
      }

    } catch (error) {
      console.error('Error adding 3D buildings and shadows:', error);
    }
  }, [styleLoaded, sunPosition]);

  // Handle map rotation
  useEffect(() => {
    if (!map.current) return;
    map.current.setBearing(mapRotation[0]);
  }, [mapRotation]);

  // Update venue markers with fixed positioning
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter venues
    let venuesToShow = stockholmVenues;
    if (filter !== 'all') {
      if (filter === 'sunny') {
        venuesToShow = stockholmVenues.filter(venue => 
          sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour)
        );
      } else {
        venuesToShow = stockholmVenues.filter(venue => venue.type === filter);
      }
    }

    // Add venue markers with precise geographic positioning
    venuesToShow.forEach(venue => {
      const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
      
      // Create marker element with larger hover area
      const el = document.createElement('div');
      el.className = 'venue-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = inSunlight ? '#f59e0b' : '#64748b';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = inSunlight ? '0 0 15px rgba(245, 158, 11, 0.8)' : '0 3px 6px rgba(0,0,0,0.3)';
      el.style.position = 'relative';
      el.style.zIndex = '100';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.transition = 'all 0.2s ease';

      // Add larger invisible hover area
      const hoverArea = document.createElement('div');
      hoverArea.style.position = 'absolute';
      hoverArea.style.width = '40px';
      hoverArea.style.height = '40px';
      hoverArea.style.top = '-8px';
      hoverArea.style.left = '-8px';
      hoverArea.style.borderRadius = '50%';
      hoverArea.style.backgroundColor = 'transparent';
      hoverArea.style.cursor = 'pointer';
      hoverArea.style.zIndex = '101';
      
      el.appendChild(hoverArea);

      // Add venue type icon
      const icon = venue.type === 'cafe' ? '☕' : 
                   venue.type === 'bar' ? '🍺' : 
                   venue.type === 'park' ? '🌳' : '🍽️';
      
      el.innerHTML = `<span style="font-size: 12px; z-index: 102; position: relative;">${icon}</span>` + el.innerHTML;

      // Create marker with exact coordinates that stay fixed to map
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([venue.lng, venue.lat])
        .addTo(map.current!);

      // Add hover events to the hover area
      hoverArea.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        onVenueHover?.(venue);
        el.style.transform = 'scale(1.3)';
        el.style.zIndex = '200';
      });
      
      hoverArea.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        onVenueHover?.(null);
        el.style.transform = 'scale(1)';
        el.style.zIndex = '100';
      });

      markersRef.current.push(marker);
    });
  }, [filter, sunPosition, currentHour, mapLoaded, onVenueHover]);

  const handleRotationChange = (value: number[]) => {
    setMapRotation(value);
  };

  return (
    <div className="relative w-full h-full">
      {/* Rotation Slider */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-sun-200 shadow-lg">
        <div className="flex items-center space-x-3 min-w-[200px]">
          <span className="text-sm font-medium text-gray-700">Rotate</span>
          <Slider
            value={mapRotation}
            onValueChange={handleRotationChange}
            max={360}
            min={0}
            step={5}
            className="flex-1"
            style={{
              '--slider-track-bg': 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)'
            } as any}
          />
          <span className="text-sm text-gray-600 min-w-[30px]">{mapRotation[0]}°</span>
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Stockholm map...</p>
          </div>
        </div>
      )}
      
      {/* Sun indicator overlay */}
      {sunPosition.elevation > 0 && (
        <div 
          className="absolute w-10 h-10 pointer-events-none z-30"
          style={{
            top: '20px',
            right: '20px',
            background: 'radial-gradient(circle, #fbbf24 30%, rgba(251, 191, 36, 0.4) 70%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
          }}
        >
          ☀️
        </div>
      )}

      {/* Sun Information Box - moved to bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-sun-200 shadow-lg min-w-[400px]">
        <div className="flex items-center justify-between space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Elevation:</span>
            <span className="font-medium text-gray-900">{sunPosition.elevation.toFixed(1)}°</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Azimuth:</span>
            <span className="font-medium text-gray-900">{sunPosition.azimuth.toFixed(1)}°</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{sunPosition.elevation > 0 ? '☀️' : '🌙'}</span>
            <span className="font-medium text-gray-900">
              {sunPosition.elevation > 0 ? 'Day' : 'Night'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxMap;
