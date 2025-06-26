
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
      console.log('Map not ready yet');
      return;
    }

    const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
    
    // Only update if filter or hour changed
    if (lastFilter.current === filter && lastHour.current === currentHour) {
      return;
    }

    console.log('Updating venue markers', { filter, currentHour, totalVenues: stockholmVenues.length });

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

      console.log('Venues to show:', venuesToShow.length);

      // Add venue markers
      venuesToShow.forEach(venue => {
        try {
          if (typeof venue.lng !== 'number' || typeof venue.lat !== 'number') {
            console.warn('Invalid coordinates for venue:', venue.name);
            return;
          }

          const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
          
          const el = document.createElement('div');
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = inSunlight ? '#f59e0b' : '#64748b';
          el.style.border = '3px solid white';
          el.style.cursor = 'pointer';
          el.style.boxShadow = inSunlight ? '0 0 15px rgba(245, 158, 11, 0.8)' : '0 2px 6px rgba(0,0,0,0.3)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.fontSize = '12px';
          el.style.transition = 'all 0.2s ease';
          el.style.zIndex = '1000';

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
              el.style.transform = 'scale(1.3)';
              el.style.zIndex = '1001';
            });
            
            el.addEventListener('mouseleave', () => {
              if (onVenueHover) onVenueHover(null);
              el.style.transform = 'scale(1)';
              el.style.zIndex = '1000';
            });

            markersRef.current.push(marker);
            console.log('Added marker for:', venue.name, 'at', [venue.lng, venue.lat]);
          }
        } catch (error) {
          console.warn('Error creating marker for venue:', venue.name, error);
        }
      });

      lastFilter.current = filter;
      lastHour.current = currentHour;
      console.log('Total markers added:', markersRef.current.length);
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
