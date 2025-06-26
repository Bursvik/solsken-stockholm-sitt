
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
  const lastFilter = useRef<string>('');
  const lastHour = useRef<string>('');

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || !map.getCanvas()) {
      return;
    }

    const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
    
    // Only update if filter or hour changed
    if (lastFilter.current === filter && lastHour.current === currentHour) {
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Error removing marker:', error);
      }
    });
    markersRef.current = [];

    try {
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
        try {
          if (typeof venue.lng !== 'number' || typeof venue.lat !== 'number') {
            return;
          }

          const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
          
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

          const icon = venue.type === 'cafe' ? '☕' : 
                       venue.type === 'bar' ? '🍺' : 
                       venue.type === 'park' ? '🌳' : '🍽️';
          
          el.innerHTML = icon;

          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center'
          }).setLngLat([venue.lng, venue.lat]);

          if (map && map.getCanvas()) {
            marker.addTo(map);

            el.addEventListener('mouseenter', () => {
              if (onVenueHover) onVenueHover(venue);
              el.style.transform = 'scale(1.2)';
            });
            
            el.addEventListener('mouseleave', () => {
              if (onVenueHover) onVenueHover(null);
              el.style.transform = 'scale(1)';
            });

            markersRef.current.push(marker);
          }
        } catch (error) {
          console.warn('Error creating marker for venue:', venue.name, error);
        }
      });

      lastFilter.current = filter;
      lastHour.current = currentHour;
    } catch (error) {
      console.error('Error in VenueMarkers effect:', error);
    }

    return () => {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('Error removing marker in cleanup:', error);
        }
      });
      markersRef.current = [];
    };
  }, [map, filter, currentTime.getHours(), sunPosition.elevation]);

  return null;
};

export default VenueMarkers;
