
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SunPosition } from '@/utils/sunCalculator';
import { stockholmVenues } from '@/data/stockholmVenues';

interface ShadowRendererProps {
  map: mapboxgl.Map | null;
  sunPosition: SunPosition;
  currentTime: Date;
}

const ShadowRenderer = ({ map, sunPosition, currentTime }: ShadowRendererProps) => {
  const shadowLayerId = 'venue-shadows';
  const setupComplete = useRef(false);

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || sunPosition.elevation <= 0) {
      return;
    }

    const addShadowLayer = () => {
      try {
        // Remove existing shadow layer if it exists
        if (map.getLayer(shadowLayerId)) {
          map.removeLayer(shadowLayerId);
        }
        if (map.getSource(shadowLayerId)) {
          map.removeSource(shadowLayerId);
        }

        // Create shadow features
        const shadowFeatures = stockholmVenues
          .filter(venue => {
            // Only create shadows for venues with some height (buildings)
            return venue.type === 'restaurant' || venue.type === 'cafe';
          })
          .map(venue => {
            // Calculate shadow offset based on sun position
            const shadowLength = Math.min(50, 30 / Math.tan(sunPosition.elevation * Math.PI / 180));
            const shadowAngle = (sunPosition.azimuth + 180) * Math.PI / 180;
            
            const shadowOffsetLng = Math.cos(shadowAngle) * shadowLength * 0.00001;
            const shadowOffsetLat = Math.sin(shadowAngle) * shadowLength * 0.00001;

            return {
              type: 'Feature',
              properties: {
                opacity: Math.max(0.2, Math.min(0.6, (90 - sunPosition.elevation) / 90 * 0.5))
              },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [venue.lng, venue.lat],
                  [venue.lng + shadowOffsetLng, venue.lat + shadowOffsetLat],
                  [venue.lng + shadowOffsetLng + 0.0001, venue.lat + shadowOffsetLat + 0.0001],
                  [venue.lng + 0.0001, venue.lat + 0.0001],
                  [venue.lng, venue.lat]
                ]]
              }
            };
          });

        // Add shadow source
        map.addSource(shadowLayerId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: shadowFeatures
          }
        });

        // Add shadow layer
        map.addLayer({
          id: shadowLayerId,
          type: 'fill',
          source: shadowLayerId,
          paint: {
            'fill-color': '#000000',
            'fill-opacity': ['get', 'opacity']
          }
        });

        console.log('ShadowRenderer: Added shadow layer with', shadowFeatures.length, 'shadows');
      } catch (error) {
        console.error('ShadowRenderer: Error adding shadow layer:', error);
      }
    };

    if (map.isStyleLoaded()) {
      addShadowLayer();
    } else {
      map.once('style.load', addShadowLayer);
    }

    return () => {
      try {
        if (map.getLayer(shadowLayerId)) {
          map.removeLayer(shadowLayerId);
        }
        if (map.getSource(shadowLayerId)) {
          map.removeSource(shadowLayerId);
        }
      } catch (error) {
        console.warn('ShadowRenderer: Error cleaning up shadows:', error);
      }
    };
  }, [map, sunPosition.elevation, sunPosition.azimuth, currentTime.getHours()]);

  return null;
};

export default ShadowRenderer;
