
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SunPosition } from '@/utils/sunCalculator';
import { stockholmVenues } from '@/data/stockholmVenues';

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
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [18.0686, 59.3293],
        zoom: 12,
        pitch: 45,
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

      // Add 3D buildings layer with shadows
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

      // Add shadow layer for ground shadows
      if (!map.current.getLayer('building-shadows')) {
        map.current.addLayer({
          id: 'building-shadows',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill',
          minzoom: 10,
          paint: {
            'fill-color': 'rgba(0, 0, 0, 0.3)',
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10,
              0,
              14,
              0.6
            ],
            'fill-translate': [10, 10],
            'fill-translate-anchor': 'viewport'
          }
        }, '3d-buildings');
      }

    } catch (error) {
      console.error('Error adding 3D buildings:', error);
    }
  }, [styleLoaded]);

  // Update sun lighting and shadows based on sun position
  useEffect(() => {
    if (!map.current || !styleLoaded || !map.current.getLayer('3d-buildings')) return;

    try {
      // Calculate shadow direction based on sun position
      const shadowOffsetX = Math.cos((sunPosition.azimuth - 90) * Math.PI / 180) * (90 - sunPosition.elevation) * 0.5;
      const shadowOffsetY = Math.sin((sunPosition.azimuth - 90) * Math.PI / 180) * (90 - sunPosition.elevation) * 0.5;

      // Update building colors based on sun position and time of day
      const isDay = sunPosition.elevation > 0;
      const buildingColor = isDay 
        ? `hsl(${200 + sunPosition.elevation * 0.5}, 15%, ${85 - sunPosition.elevation * 0.2}%)`
        : '#4a5568';

      // Update 3D buildings
      map.current.setPaintProperty('3d-buildings', 'fill-extrusion-color', [
        'interpolate',
        ['linear'],
        ['get', 'height'],
        0,
        buildingColor,
        200,
        isDay ? '#e2e8f0' : '#2d3748'
      ]);

      // Update shadow position and opacity based on sun elevation
      const shadowOpacity = isDay ? Math.max(0.1, (90 - sunPosition.elevation) / 90 * 0.4) : 0;
      
      if (map.current.getLayer('building-shadows')) {
        map.current.setPaintProperty('building-shadows', 'fill-opacity', shadowOpacity);
        map.current.setPaintProperty('building-shadows', 'fill-translate', [shadowOffsetX, shadowOffsetY]);
      }

    } catch (error) {
      console.error('Error updating sun lighting:', error);
    }
  }, [sunPosition, styleLoaded]);

  // Update venue markers
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

    // Add venue markers
    venuesToShow.forEach(venue => {
      const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'venue-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = inSunlight ? '#f59e0b' : '#64748b';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = inSunlight ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none';

      // Add venue type icon
      const icon = venue.type === 'cafe' ? '☕' : 
                   venue.type === 'bar' ? '🍺' : 
                   venue.type === 'park' ? '🌳' : '🍽️';
      el.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10px;">${icon}</div>`;

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([venue.lng, venue.lat])
        .addTo(map.current!);

      // Add hover events
      el.addEventListener('mouseenter', () => {
        onVenueHover?.(venue);
      });
      
      el.addEventListener('mouseleave', () => {
        onVenueHover?.(null);
      });

      markersRef.current.push(marker);
    });
  }, [filter, sunPosition, currentHour, mapLoaded, onVenueHover]);

  return (
    <div className="relative w-full h-full">
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
          className="absolute w-8 h-8 pointer-events-none"
          style={{
            top: '20px',
            right: '20px',
            background: 'radial-gradient(circle, #fbbf24 30%, rgba(251, 191, 36, 0.3) 70%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}
        >
          ☀️
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
