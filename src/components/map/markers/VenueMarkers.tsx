
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
  const lastUpdateRef = useRef<string>('');

  useEffect(() => {
    console.log('VenueMarkers: Starting effect', { 
      hasMap: !!map, 
      mapLoaded: map?.isStyleLoaded(), 
      filter, 
      currentTime: currentTime.toISOString() 
    });

    if (!map || !map.isStyleLoaded()) {
      console.log('VenueMarkers: Map not ready, skipping');
      return;
    }

    const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
    const updateKey = `${filter}-${currentHour}-${sunPosition.elevation}`;
    
    console.log('VenueMarkers: Creating markers', { 
      filter, 
      currentHour, 
      totalVenues: stockholmVenues.length,
      sunElevation: sunPosition.elevation 
    });

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Error removing marker:', error);
      }
    });
    markersRef.current = [];

    // Filter venues
    let venuesToShow = stockholmVenues.filter(venue => {
      // Validate coordinates
      if (typeof venue.lng !== 'number' || typeof venue.lat !== 'number') {
        return false;
      }
      
      // Check Stockholm bounds
      if (venue.lng < 17.5 || venue.lng > 18.5 || venue.lat < 59.0 || venue.lat > 59.7) {
        return false;
      }
      
      return true;
    });

    // Apply type filter
    if (filter !== 'all') {
      if (filter === 'sunny') {
        venuesToShow = venuesToShow.filter(venue => 
          sunPosition.elevation > 0 && 
          venue.sunExposed && 
          venue.sunHours.includes(currentHour)
        );
      } else {
        venuesToShow = venuesToShow.filter(venue => venue.type === filter);
      }
    }

    console.log('VenueMarkers: Filtered venues count:', venuesToShow.length);

    // Create markers
    venuesToShow.forEach((venue, index) => {
      try {
        const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'venue-marker';
        
        // Apply styles directly with fixed positioning
        el.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: ${inSunlight ? '#f59e0b' : '#64748b'};
          border: 2px solid white;
          cursor: pointer;
          box-shadow: ${inSunlight ? '0 0 12px rgba(245, 158, 11, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-family: system-ui, -apple-system, sans-serif;
          transition: all 0.2s ease;
          user-select: none;
          pointer-events: auto;
          position: relative;
          z-index: 1000;
        `;

        // Set emoji
        const iconMap = {
          'cafe': '☕',
          'bar': '🍺',
          'park': '🌳',
          'restaurant': '🍽️'
        };
        
        el.textContent = iconMap[venue.type] || '📍';

        // Create marker with proper anchor
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center'
        }).setLngLat([venue.lng, venue.lat]);

        // Add to map
        marker.addTo(map);

        // Add stable hover effects without transform
        el.addEventListener('mouseenter', () => {
          if (onVenueHover) onVenueHover(venue);
          el.style.boxShadow = inSunlight ? '0 0 20px rgba(245, 158, 11, 0.8)' : '0 4px 8px rgba(0,0,0,0.4)';
          el.style.backgroundColor = inSunlight ? '#fbbf24' : '#475569';
          el.style.zIndex = '1001';
        });
        
        el.addEventListener('mouseleave', () => {
          if (onVenueHover) onVenueHover(null);
          el.style.boxShadow = inSunlight ? '0 0 12px rgba(245, 158, 11, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)';
          el.style.backgroundColor = inSunlight ? '#f59e0b' : '#64748b';
          el.style.zIndex = '1000';
        });

        markersRef.current.push(marker);
        
        console.log(`VenueMarkers: Added marker ${index + 1}/${venuesToShow.length}:`, venue.name, 'at', [venue.lng, venue.lat]);
      } catch (error) {
        console.error('VenueMarkers: Error creating marker for:', venue.name, error);
      }
    });

    lastUpdateRef.current = updateKey;
    console.log('VenueMarkers: Successfully added', markersRef.current.length, 'markers');

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('Error removing marker in cleanup:', error);
        }
      });
      markersRef.current = [];
    };
  }, [map, filter, currentTime.getHours(), sunPosition.elevation, onVenueHover]);

  return null;
};

export default VenueMarkers;
