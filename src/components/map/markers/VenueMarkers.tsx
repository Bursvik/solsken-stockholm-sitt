
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { stockholmVenues } from '@/data/stockholmVenues';
import { SunPosition } from '@/utils/sunCalculator';

interface VenueMarkersProps {
  map: mapboxgl.Map | null;
  sunPosition: SunPosition;
  filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  currentTime: Date;
  onVenueHover?: (venue: any) => void;
}

const VenueMarkers = ({ map, sunPosition, filter, currentTime, onVenueHover }: VenueMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';

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
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = inSunlight ? '#f59e0b' : '#64748b';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = inSunlight ? '0 0 10px rgba(245, 158, 11, 0.6)' : '0 2px 4px rgba(0,0,0,0.2)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '10px';
      el.style.transition = 'all 0.2s ease';

      // Add venue type icon
      const icon = venue.type === 'cafe' ? '☕' : 
                   venue.type === 'bar' ? '🍺' : 
                   venue.type === 'park' ? '🌳' : '🍽️';
      
      el.innerHTML = icon;

      // Create marker with exact coordinates
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([venue.lng, venue.lat])
        .addTo(map);

      // Add hover events
      el.addEventListener('mouseenter', () => {
        onVenueHover?.(venue);
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        onVenueHover?.(null);
        el.style.transform = 'scale(1)';
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, filter, sunPosition, currentTime, onVenueHover]);

  return null;
};

export default VenueMarkers;
