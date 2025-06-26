
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface TerrainSetupProps {
  map: mapboxgl.Map | null;
}

const TerrainSetup = ({ map }: TerrainSetupProps) => {
  const setupComplete = useRef(false);

  useEffect(() => {
    if (!map || setupComplete.current) return;

    const setupTerrain = () => {
      try {
        // Only setup terrain once
        if (setupComplete.current || !map.isStyleLoaded()) return;

        console.log('Setting up terrain and 3D buildings...');

        // Add terrain source
        if (!map.getSource('mapbox-dem')) {
          map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          });
        }
        
        // Set terrain
        if (!map.getTerrain()) {
          map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        }
        
        // Add hillshade layer
        if (!map.getLayer('hillshading')) {
          map.addLayer({
            id: 'hillshading',
            source: 'mapbox-dem',
            type: 'hillshade',
            paint: {
              'hillshade-shadow-color': '#473B24',
              'hillshade-highlight-color': '#FFF',
              'hillshade-exaggeration': 0.25
            }
          });
        }

        // Add 3D buildings layer
        if (!map.getLayer('3d-buildings')) {
          map.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 12,
            paint: {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'height'],
                0,
                '#e2e8f0',
                50,
                '#cbd5e1',
                100,
                '#94a3b8',
                200,
                '#64748b'
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12,
                0,
                12.5,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12,
                0,
                12.5,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.9
            }
          });
        }

        setupComplete.current = true;
        console.log('Terrain setup completed');
      } catch (error) {
        console.error('Error setting up terrain:', error);
      }
    };

    // Setup terrain when style is loaded
    if (map.isStyleLoaded()) {
      setupTerrain();
    } else {
      map.once('style.load', setupTerrain);
    }

    return () => {
      setupComplete.current = false;
    };
  }, [map]);

  return null;
};

export default TerrainSetup;
