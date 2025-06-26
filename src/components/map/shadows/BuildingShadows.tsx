
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SunPosition } from '@/utils/sunCalculator';
import { EnhancedShadowCalculator } from '@/utils/enhancedShadowCalculator';

interface BuildingShadowsProps {
  map: mapboxgl.Map | null;
  sunPosition: SunPosition;
}

const BuildingShadows = ({ map, sunPosition }: BuildingShadowsProps) => {
  const lastSunPosition = useRef<SunPosition | null>(null);

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Only update if sun position changed significantly
    if (lastSunPosition.current && 
        Math.abs(lastSunPosition.current.elevation - sunPosition.elevation) < 1 &&
        Math.abs(lastSunPosition.current.azimuth - sunPosition.azimuth) < 5) {
      return;
    }

    const updateShadows = () => {
      try {
        // Remove existing shadow layers
        if (map.getLayer('building-shadows')) {
          map.removeLayer('building-shadows');
        }
        if (map.getSource('building-shadows')) {
          map.removeSource('building-shadows');
        }

        // Only add shadows when sun is above horizon
        if (sunPosition.elevation > 0) {
          const shadowOpacity = Math.max(0.2, Math.min(0.7, (90 - sunPosition.elevation) / 90 * 0.8));
          const shadowAzimuth = (sunPosition.azimuth + 180) % 360;

          // Create building shadows with optimized data
          const buildingsWithShadows = [
            { center: [18.0656, 59.3293], height: 30, size: 0.0003 },
            { center: [18.0548, 59.3275], height: 106, size: 0.0005 },
            { center: [18.0713, 59.3269], height: 35, size: 0.0004 },
            { center: [18.0686, 59.3365], height: 150, size: 0.0006 },
            { center: [18.0725, 59.3385], height: 165, size: 0.0007 },
            { center: [18.0625, 59.3325], height: 90, size: 0.0004 },
            { center: [18.0775, 59.3275], height: 84, size: 0.0003 },
            { center: [18.0456, 59.3193], height: 75, size: 0.0003 },
          ];

          const shadowGeoJSON = {
            type: 'FeatureCollection' as const,
            features: buildingsWithShadows.map((building, index) => {
              const shadowLengthMeters = EnhancedShadowCalculator.calculateRealisticShadowLength(
                building.height,
                sunPosition.elevation
              );

              const shadowRadians = (shadowAzimuth * Math.PI) / 180;
              const metersPerDegree = 111000;
              const shadowOffsetLng = (Math.cos(shadowRadians) * shadowLengthMeters) / metersPerDegree;
              const shadowOffsetLat = (Math.sin(shadowRadians) * shadowLengthMeters) / (metersPerDegree * Math.cos(59.3293 * Math.PI / 180));

              return {
                type: 'Feature' as const,
                properties: { opacity: shadowOpacity, buildingId: index },
                geometry: {
                  type: 'Polygon' as const,
                  coordinates: [[
                    [building.center[0] - building.size, building.center[1] - building.size],
                    [building.center[0] + building.size, building.center[1] - building.size],
                    [building.center[0] + building.size + shadowOffsetLng, building.center[1] - building.size + shadowOffsetLat],
                    [building.center[0] - building.size + shadowOffsetLng, building.center[1] - building.size + shadowOffsetLat],
                    [building.center[0] - building.size, building.center[1] - building.size]
                  ]]
                }
              };
            })
          };

          map.addSource('building-shadows', {
            type: 'geojson',
            data: shadowGeoJSON
          });

          map.addLayer({
            id: 'building-shadows',
            source: 'building-shadows',
            type: 'fill',
            paint: {
              'fill-color': '#000000',
              'fill-opacity': shadowOpacity
            }
          }, '3d-buildings');
        }

        lastSunPosition.current = { ...sunPosition };
      } catch (error) {
        console.error('Error updating building shadows:', error);
      }
    };

    // Debounce shadow updates
    const timeoutId = setTimeout(updateShadows, 100);
    return () => clearTimeout(timeoutId);
  }, [map, sunPosition.elevation, sunPosition.azimuth]);

  return null;
};

export default BuildingShadows;
