
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
        style: 'mapbox://styles/mapbox/outdoors-v12', // Better style for seeing terrain
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

  // Add 3D buildings when style is loaded
  useEffect(() => {
    if (!map.current || !styleLoaded) return;

    try {
      // Check if layer already exists
      if (map.current.getLayer('3d-buildings')) {
        map.current.removeLayer('3d-buildings');
      }

      // Add 3D buildings layer with proper shadow casting
      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 10,
        paint: {
          'fill-extrusion-color': [
            'case',
            ['boolean', ['feature-state', 'shadow'], false],
            'rgba(100, 100, 100, 0.8)',
            '#d4d4d8'
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
          'fill-extrusion-opacity': 0.9,
          'fill-extrusion-ambient-occlusion-intensity': 0.3,
          'fill-extrusion-ambient-occlusion-radius': 3.0
        }
      });

    } catch (error) {
      console.error('Error adding 3D buildings:', error);
    }
  }, [styleLoaded]);

  // Update sun lighting and shadows based on corrected sun position
  useEffect(() => {
    if (!map.current || !styleLoaded || !map.current.getLayer('3d-buildings')) return;

    try {
      // Correct shadow direction calculation
      // Sun azimuth: 0° = North, 90° = East, 180° = South, 270° = West
      // Shadow points opposite to sun direction
      const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
      const shadowAngle = (shadowAzimuth - 90) * Math.PI / 180;
      
      // Calculate shadow offset based on sun elevation (lower sun = longer shadows)
      const shadowLength = sunPosition.elevation > 0 ? (90 - sunPosition.elevation) * 0.8 : 0;
      const shadowOffsetX = Math.cos(shadowAngle) * shadowLength;
      const shadowOffsetY = Math.sin(shadowAngle) * shadowLength;

      // Update building colors based on sun position and time of day
      const isDay = sunPosition.elevation > 0;
      const lightIntensity = Math.max(0, Math.sin(sunPosition.elevation * Math.PI / 180));
      
      const buildingColor = isDay 
        ? `hsl(${200 + sunPosition.elevation * 0.3}, ${10 + lightIntensity * 20}%, ${75 + lightIntensity * 15}%)`
        : '#4a5568';

      // Update 3D buildings with proper lighting
      map.current.setPaintProperty('3d-buildings', 'fill-extrusion-color', [
        'interpolate',
        ['linear'],
        ['get', 'height'],
        0,
        buildingColor,
        200,
        isDay ? '#e2e8f0' : '#2d3748'
      ]);

      // Add ground shadow layer if it doesn't exist
      if (!map.current.getLayer('building-shadows')) {
        map.current.addLayer({
          id: 'building-shadows',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill',
          minzoom: 10,
          paint: {
            'fill-color': 'rgba(0, 0, 0, 0.4)',
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10,
              0,
              14,
              isDay ? Math.max(0.1, (90 - sunPosition.elevation) / 90 * 0.6) : 0
            ],
            'fill-translate': [shadowOffsetX, shadowOffsetY],
            'fill-translate-anchor': 'viewport'
          }
        }, '3d-buildings');
      } else {
        // Update existing shadow layer
        const shadowOpacity = isDay ? Math.max(0.1, (90 - sunPosition.elevation) / 90 * 0.6) : 0;
        map.current.setPaintProperty('building-shadows', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          0,
          14,
          shadowOpacity
        ]);
        map.current.setPaintProperty('building-shadows', 'fill-translate', [shadowOffsetX, shadowOffsetY]);
      }

    } catch (error) {
      console.error('Error updating sun lighting:', error);
    }
  }, [sunPosition, styleLoaded]);

  // Handle map rotation
  useEffect(() => {
    if (!map.current) return;
    map.current.setBearing(mapRotation[0]);
  }, [mapRotation]);

  // Update venue markers with improved hover detection
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

    // Add venue markers with improved hover zones
    venuesToShow.forEach(venue => {
      const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
      
      // Create marker element with larger hover area
      const el = document.createElement('div');
      el.className = 'venue-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = inSunlight ? '#f59e0b' : '#64748b';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = inSunlight ? '0 0 12px rgba(245, 158, 11, 0.6)' : '0 2px 4px rgba(0,0,0,0.2)';
      el.style.position = 'relative';
      el.style.zIndex = '10';

      // Add venue type icon
      const icon = venue.type === 'cafe' ? '☕' : 
                   venue.type === 'bar' ? '🍺' : 
                   venue.type === 'park' ? '🌳' : '🍽️';
      
      // Create inner icon container
      const iconContainer = document.createElement('div');
      iconContainer.style.position = 'absolute';
      iconContainer.style.top = '50%';
      iconContainer.style.left = '50%';
      iconContainer.style.transform = 'translate(-50%, -50%)';
      iconContainer.style.fontSize = '12px';
      iconContainer.innerHTML = icon;
      
      // Create larger invisible hover area
      const hoverArea = document.createElement('div');
      hoverArea.style.position = 'absolute';
      hoverArea.style.top = '-8px';
      hoverArea.style.left = '-8px';
      hoverArea.style.width = '40px';
      hoverArea.style.height = '40px';
      hoverArea.style.borderRadius = '50%';
      hoverArea.style.backgroundColor = 'transparent';
      hoverArea.style.zIndex = '11';

      el.appendChild(iconContainer);
      el.appendChild(hoverArea);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([venue.lng, venue.lat])
        .addTo(map.current!);

      // Add hover events to the hover area
      hoverArea.addEventListener('mouseenter', () => {
        onVenueHover?.(venue);
        el.style.transform = 'scale(1.1)';
        el.style.transition = 'transform 0.2s ease';
      });
      
      hoverArea.addEventListener('mouseleave', () => {
        onVenueHover?.(null);
        el.style.transform = 'scale(1)';
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
    </div>
  );
};

export default MapboxMap;
