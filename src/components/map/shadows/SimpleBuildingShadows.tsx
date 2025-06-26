
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SunPosition } from '@/utils/sunCalculator';

interface SimpleBuildingShadowsProps {
  map: mapboxgl.Map | null;
  sunPosition: SunPosition;
}

const SimpleBuildingShadows = ({ map, sunPosition }: SimpleBuildingShadowsProps) => {
  const lastUpdate = useRef<number>(0);
  const shadowsAdded = useRef(false);

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    const now = Date.now();
    // Only update shadows every 5 seconds to avoid constant updates
    if (now - lastUpdate.current < 5000) return;

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
          const shadowOpacity = Math.max(0.3, Math.min(0.7, (90 - sunPosition.elevation) / 90 * 0.7));
          
          // Simple building locations around Stockholm
          const buildings = [
            { lng: 18.0656, lat: 59.3293, size: 0.0002 }, // Gamla Stan
            { lng: 18.0548, lat: 59.3275, size: 0.0003 }, // City Hall area
            { lng: 18.0713, lat: 59.3269, size: 0.0002 }, // Royal Palace
            { lng: 18.0686, lat: 59.3365, size: 0.0003 }, // Norrmalm
            { lng: 18.0625, lat: 59.3325, size: 0.0002 }, // Central areas
          ];

          // Calculate shadow offset based on sun azimuth
          const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
          const shadowRadians = (shadowAzimuth * Math.PI) / 180;
          
          // Simple shadow length calculation
          const shadowLength = Math.min(50 / Math.tan((sunPosition.elevation * Math.PI) / 180), 100);
          const shadowOffset = shadowLength * 0.00001; // Convert to map coordinates

          const shadowOffsetLng = Math.cos(shadowRadians) * shadowOffset;
          const shadowOffsetLat = Math.sin(shadowRadians) * shadowOffset;

          const shadowGeoJSON = {
            type: 'FeatureCollection' as const,
            features: buildings.map((building, index) => ({
              type: 'Feature' as const,
              properties: { opacity: shadowOpacity },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                  [building.lng - building.size, building.lat - building.size],
                  [building.lng + building.size, building.lat - building.size],
                  [building.lng + building.size + shadowOffsetLng, building.lat - building.size + shadowOffsetLat],
                  [building.lng - building.size + shadowOffsetLng, building.lat - building.size + shadowOffsetLat],
                  [building.lng - building.size, building.lat - building.size]
                ]]
              }
            }))
          };

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

          shadowsAdded.current = true;
        }

        lastUpdate.current = now;
      } catch (error) {
        console.error('Error updating simple shadows:', error);
      }
    };

    updateShadows();
  }, [map, Math.floor(sunPosition.elevation / 5), Math.floor(sunPosition.azimuth / 10)]); // Reduce update frequency

  return null;
};

export default SimpleBuildingShadows;
