
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SunPosition } from '@/utils/sunCalculator';

interface SimpleBuildingShadowsProps {
  map: mapboxgl.Map | null;
  sunPosition: SunPosition;
}

const SimpleBuildingShadows = ({ map, sunPosition }: SimpleBuildingShadowsProps) => {
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) {
      console.log('Map not ready for shadows');
      return;
    }

    const now = Date.now();
    // Only update shadows every 2 seconds to avoid constant updates
    if (now - lastUpdate.current < 2000) return;

    console.log('Updating shadows with sun position:', sunPosition);

    const updateShadows = () => {
      try {
        // Remove existing shadow layer if it exists
        if (map.getLayer('simple-building-shadows')) {
          map.removeLayer('simple-building-shadows');
        }
        if (map.getSource('simple-building-shadows')) {
          map.removeSource('simple-building-shadows');
        }

        // Only add shadows when sun is above horizon
        if (sunPosition.elevation > 0) {
          console.log('Adding shadows - sun elevation:', sunPosition.elevation);
          
          const shadowOpacity = Math.max(0.4, Math.min(0.8, (90 - sunPosition.elevation) / 90 * 0.8));
          
          // Simple building locations around Stockholm with larger shadows
          const buildings = [
            { lng: 18.0656, lat: 59.3293, size: 0.0008 }, // Gamla Stan - larger
            { lng: 18.0548, lat: 59.3275, size: 0.0010 }, // City Hall area - larger
            { lng: 18.0713, lat: 59.3269, size: 0.0008 }, // Royal Palace
            { lng: 18.0686, lat: 59.3365, size: 0.0012 }, // Norrmalm - larger
            { lng: 18.0625, lat: 59.3325, size: 0.0009 }, // Central areas
          ];

          // Calculate shadow offset based on sun azimuth
          const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
          const shadowRadians = (shadowAzimuth * Math.PI) / 180;
          
          // Increased shadow length for visibility
          const shadowLength = Math.min(100 / Math.tan((sunPosition.elevation * Math.PI) / 180), 200);
          const shadowOffset = shadowLength * 0.00003; // Increased offset

          const shadowOffsetLng = Math.cos(shadowRadians) * shadowOffset;
          const shadowOffsetLat = Math.sin(shadowRadians) * shadowOffset;

          const shadowGeoJSON = {
            type: 'FeatureCollection' as const,
            features: buildings.map((building, index) => ({
              type: 'Feature' as const,
              properties: { 
                opacity: shadowOpacity,
                buildingId: index 
              },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                  [building.lng - building.size, building.lat - building.size],
                  [building.lng + building.size, building.lat - building.size],
                  [building.lng + building.size + shadowOffsetLng, building.lat - building.size + shadowOffsetLat],
                  [building.lng - building.size + shadowOffsetLng, building.lat + building.size + shadowOffsetLat],
                  [building.lng - building.size, building.lat + building.size],
                  [building.lng - building.size, building.lat - building.size]
                ]]
              }
            }))
          };

          console.log('Adding shadow source with', shadowGeoJSON.features.length, 'features');

          map.addSource('simple-building-shadows', {
            type: 'geojson',
            data: shadowGeoJSON
          });

          map.addLayer({
            id: 'simple-building-shadows',
            source: 'simple-building-shadows',
            type: 'fill',
            paint: {
              'fill-color': '#1a1a1a',
              'fill-opacity': shadowOpacity
            }
          });

          console.log('Shadows added successfully with opacity:', shadowOpacity);
        } else {
          console.log('Sun below horizon - no shadows');
        }

        lastUpdate.current = now;
      } catch (error) {
        console.error('Error updating simple shadows:', error);
      }
    };

    updateShadows();
  }, [map, Math.floor(sunPosition.elevation / 2), Math.floor(sunPosition.azimuth / 5)]); // More frequent updates

  return null;
};

export default SimpleBuildingShadows;
