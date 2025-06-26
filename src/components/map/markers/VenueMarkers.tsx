
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
    console.log('VenueMarkers effect triggered', { 
      hasMap: !!map, 
      mapLoaded: map?.isStyleLoaded(), 
      filter, 
      currentTime: currentTime.toISOString() 
    });

    // Enhanced map readiness check
    if (!map) {
      console.log('No map instance available');
      return;
    }

    if (!map.isStyleLoaded()) {
      console.log('Map style not loaded yet, waiting...');
      const handleStyleLoad = () => {
        console.log('Map style loaded, retrying venue markers');
        // Trigger re-render by updating refs
        lastFilter.current = '';
        lastHour.current = '';
      };
      map.once('style.load', handleStyleLoad);
      return () => map.off('style.load', handleStyleLoad);
    }

    if (!map.getCanvas()) {
      console.log('Map canvas not available');
      return;
    }

    const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';
    
    // Only update if filter or hour changed
    if (lastFilter.current === filter && lastHour.current === currentHour) {
      console.log('No changes needed, skipping update');
      return;
    }

    console.log('Updating venue markers', { 
      filter, 
      currentHour, 
      totalVenues: stockholmVenues.length,
      sunElevation: sunPosition.elevation 
    });

    // Clear existing markers with better error handling
    markersRef.current.forEach((marker, index) => {
      try {
        marker.remove();
      } catch (error) {
        console.warn(`Error removing marker ${index}:`, error);
      }
    });
    markersRef.current = [];

    try {
      // Filter venues based on current filter
      let venuesToShow = stockholmVenues.filter(venue => {
        // Validate venue coordinates
        if (typeof venue.lng !== 'number' || typeof venue.lat !== 'number') {
          console.warn('Invalid coordinates for venue:', venue.name, venue.lng, venue.lat);
          return false;
        }
        
        // Check coordinate bounds for Stockholm area
        if (venue.lng < 17.5 || venue.lng > 18.5 || venue.lat < 59.0 || venue.lat > 59.7) {
          console.warn('Coordinates outside Stockholm bounds:', venue.name, venue.lng, venue.lat);
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

      console.log('Venues to show after filtering:', venuesToShow.length);

      // Create markers for filtered venues
      venuesToShow.forEach((venue, index) => {
        try {
          const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
          
          // Create marker element with consistent styling
          const el = document.createElement('div');
          el.className = 'venue-marker';
          
          // Set styles as properties for better reliability
          Object.assign(el.style, {
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: inSunlight ? '#f59e0b' : '#64748b',
            border: '3px solid white',
            cursor: 'pointer',
            boxShadow: inSunlight ? '0 0 15px rgba(245, 158, 11, 0.8)' : '0 2px 6px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: '1000',
            position: 'relative',
            userSelect: 'none',
            pointerEvents: 'auto',
            transformOrigin: 'center center',
            lineHeight: '1'
          });

          // Set emoji content
          const iconMap = {
            'cafe': '☕',
            'bar': '🍺',
            'park': '🌳',
            'restaurant': '🍽️'
          };
          
          el.textContent = iconMap[venue.type] || '📍';

          // Create Mapbox marker
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center'
          }).setLngLat([venue.lng, venue.lat]);

          // Add to map
          marker.addTo(map);

          // Add hover effects with proper event handling
          const handleMouseEnter = () => {
            if (onVenueHover) onVenueHover(venue);
            el.style.transform = 'scale(1.3)';
            el.style.zIndex = '1001';
          };
          
          const handleMouseLeave = () => {
            if (onVenueHover) onVenueHover(null);
            el.style.transform = 'scale(1)';
            el.style.zIndex = '1000';
          };

          el.addEventListener('mouseenter', handleMouseEnter);
          el.addEventListener('mouseleave', handleMouseLeave);

          markersRef.current.push(marker);
          
          console.log(`Added marker ${index + 1}/${venuesToShow.length} for:`, venue.name, 'at', [venue.lng, venue.lat], 'sunny:', inSunlight);
        } catch (error) {
          console.error('Error creating marker for venue:', venue.name, error);
        }
      });

      lastFilter.current = filter;
      lastHour.current = currentHour;
      console.log('Successfully added', markersRef.current.length, 'venue markers');
      
    } catch (error) {
      console.error('Error in VenueMarkers effect:', error);
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach((marker, index) => {
        try {
          marker.remove();
        } catch (error) {
          console.warn(`Error removing marker ${index} in cleanup:`, error);
        }
      });
      markersRef.current = [];
    };
  }, [map, filter, currentTime.getHours(), sunPosition.elevation, onVenueHover]);

  return null;
};

export default VenueMarkers;
