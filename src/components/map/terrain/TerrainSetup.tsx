
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface TerrainSetupProps {
  map: mapboxgl.Map | null;
}

const TerrainSetup = ({ map }: TerrainSetupProps) => {
  useEffect(() => {
    if (!map) return;

    const setupTerrain = () => {
      try {
        // Add terrain source and layer for 3D elevation
        if (!map.getSource('mapbox-dem')) {
          map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          });
          
          // Set terrain after source is added
          map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
          
          // Add hillshade for better terrain visualization
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

          // Add enhanced 3D buildings layer that follows terrain
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
      } catch (error) {
        console.error('Error setting up terrain:', error);
      }
    };

    map.on('style.load', setupTerrain);
    
    // If style is already loaded, setup terrain immediately
    if (map.isStyleLoaded()) {
      setupTerrain();
    }

    return () => {
      map.off('style.load', setupTerrain);
    };
  }, [map]);

  return null;
};

export default TerrainSetup;
