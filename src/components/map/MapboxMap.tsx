
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [18.0686, 59.3293], // Stockholm coordinates
      zoom: 12,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    map.current.on('load', () => {
      if (!map.current) return;
      
      // Add 3D buildings layer
      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 10,
        paint: {
          'fill-extrusion-color': '#aaa',
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
          'fill-extrusion-opacity': 0.8
        }
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update sun lighting based on sun position
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Convert sun position to Mapbox light direction
    const sunAzimuthRadians = (sunPosition.azimuth - 90) * Math.PI / 180;
    const sunElevationRadians = sunPosition.elevation * Math.PI / 180;
    
    // Calculate light direction vector
    const lightDirection = [
      Math.cos(sunElevationRadians) * Math.cos(sunAzimuthRadians),
      Math.cos(sunElevationRadians) * Math.sin(sunAzimuthRadians),
      Math.sin(sunElevationRadians)
    ];

    // Update building colors based on sun position
    const buildingColor = sunPosition.elevation > 0 
      ? `hsl(${30 + sunPosition.elevation}, 20%, ${60 + sunPosition.elevation * 0.3}%)`
      : '#555';

    map.current.setPaintProperty('3d-buildings', 'fill-extrusion-color', buildingColor);

    // Adjust map lighting for day/night
    if (sunPosition.elevation <= 0) {
      // Night time - darker style
      map.current.setStyle('mapbox://styles/mapbox/dark-v11');
    } else {
      // Day time - lighter style
      map.current.setStyle('mapbox://styles/mapbox/light-v11');
    }
  }, [sunPosition, mapLoaded]);

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
