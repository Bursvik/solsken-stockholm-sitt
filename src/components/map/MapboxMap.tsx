
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SunPosition } from '@/utils/sunCalculator';
import { stockholmVenues } from '@/data/stockholmVenues';
import { buildingService, BuildingData } from '@/services/buildingService';
import { terrainService } from '@/services/terrainService';
import { EnhancedShadowCalculator } from '@/utils/enhancedShadowCalculator';

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyc3ZpayIsImEiOiJjbWMzd3ByYXMwOHltMmxxdDV6bTdndnhtIn0.WzSEFPqiDkHGq4_XArpJ0g';

interface MapboxMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
  filter?: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  onVenueHover?: (venue: any) => void;
  mapRotation?: number[];
}

const MapboxMap = ({ currentTime, sunPosition, filter = 'all', onVenueHover, mapRotation = [0] }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [buildingData, setBuildingData] = useState<BuildingData[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [18.0686, 59.3293],
        zoom: 13,
        pitch: 60,
        bearing: 0,
        antialias: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

      // Wait for both style and data to load
      map.current.on('style.load', () => {
        console.log('Map style loaded');
        
        // Add terrain source and layer for 3D elevation after style loads
        if (map.current && !map.current.getSource('mapbox-dem')) {
          map.current.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          });
          
          // Set terrain after source is added
          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
          
          // Add hillshade for better terrain visualization
          map.current.addLayer({
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
        
        setStyleLoaded(true);
      });

      map.current.on('load', () => {
        console.log('Map fully loaded');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Load building data when map is ready
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const loadBuildingData = async () => {
      try {
        const bounds = map.current!.getBounds();
        const buildings = await buildingService.getBuildingsInArea({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        });
        setBuildingData(buildings);
      } catch (error) {
        console.error('Failed to load building data:', error);
      }
    };

    loadBuildingData();

    // Reload building data when map moves significantly
    map.current.on('moveend', () => {
      if (map.current!.getZoom() > 12) {
        loadBuildingData();
      }
    });
  }, [mapLoaded]);

  // Add enhanced 3D buildings with properly anchored shadows
  useEffect(() => {
    if (!map.current || !styleLoaded) return;

    const updateBuildingsAndShadows = async () => {
      try {
        // Remove existing layers if they exist
        if (map.current!.getLayer('building-shadow-extrusions')) {
          map.current!.removeLayer('building-shadow-extrusions');
        }
        if (map.current!.getLayer('building-shadows')) {
          map.current!.removeLayer('building-shadows');
        }
        if (map.current!.getSource('building-shadows')) {
          map.current!.removeSource('building-shadows');
        }
        if (map.current!.getLayer('3d-buildings')) {
          map.current!.removeLayer('3d-buildings');
        }

        // Add enhanced 3D buildings layer that follows terrain
        map.current!.addLayer({
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

        // Add realistic building shadows that are properly anchored
        if (sunPosition.elevation > 0) {
          // Calculate shadow parameters based on sun position
          const shadowLength = EnhancedShadowCalculator.calculateRealisticShadowLength(
            30, // Average building height for shadow calculation
            sunPosition.elevation
          );

          // Shadow opacity - lower sun = darker shadows
          const shadowOpacity = Math.max(0.2, Math.min(0.7, (90 - sunPosition.elevation) / 90 * 0.8));
          
          // Calculate shadow direction (opposite to sun azimuth)
          const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
          
          // Create anchored shadow polygons using building footprints
          const shadowGeoJSON = {
            type: 'FeatureCollection' as const,
            features: [] as any[]
          };

          // For now, create sample shadow polygons for major buildings
          const sampleBuildings = [
            { center: [18.0656, 59.3293], height: 30 }, // Gamla Stan
            { center: [18.0548, 59.3275], height: 106 }, // City Hall
            { center: [18.0713, 59.3269], height: 35 }, // Royal Palace
            { center: [18.0686, 59.3365], height: 150 }, // Norrmalm
            { center: [18.0725, 59.3385], height: 165 }, // Modern towers
          ];

          sampleBuildings.forEach((building, index) => {
            const shadowLengthMeters = EnhancedShadowCalculator.calculateRealisticShadowLength(
              building.height,
              sunPosition.elevation
            );

            // Convert shadow direction to coordinate offset
            const shadowRadians = (shadowAzimuth * Math.PI) / 180;
            const metersPerDegree = 111000;
            const shadowOffsetLng = (Math.cos(shadowRadians) * shadowLengthMeters) / metersPerDegree;
            const shadowOffsetLat = (Math.sin(shadowRadians) * shadowLengthMeters) / (metersPerDegree * Math.cos(59.3293 * Math.PI / 180));

            // Create shadow polygon anchored to building base
            const buildingSize = 0.0002; // Building footprint size
            const shadowFeature = {
              type: 'Feature' as const,
              properties: {
                opacity: shadowOpacity
              },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                  [building.center[0] - buildingSize, building.center[1] - buildingSize], // Building corner
                  [building.center[0] + buildingSize, building.center[1] - buildingSize], // Building corner
                  [building.center[0] + buildingSize + shadowOffsetLng, building.center[1] - buildingSize + shadowOffsetLat], // Shadow end
                  [building.center[0] - buildingSize + shadowOffsetLng, building.center[1] - buildingSize + shadowOffsetLat], // Shadow end
                  [building.center[0] - buildingSize, building.center[1] - buildingSize] // Close polygon
                ]]
              }
            };

            shadowGeoJSON.features.push(shadowFeature);
          });

          // Add shadow source and layer
          map.current!.addSource('building-shadows', {
            type: 'geojson',
            data: shadowGeoJSON
          });

          map.current!.addLayer({
            id: 'building-shadows',
            source: 'building-shadows',
            type: 'fill',
            paint: {
              'fill-color': '#000000',
              'fill-opacity': [
                'get',
                ['get', 'opacity'],
                shadowOpacity
              ]
            }
          }, '3d-buildings');
        }

      } catch (error) {
        console.error('Error updating buildings and shadows:', error);
      }
    };

    updateBuildingsAndShadows();
  }, [styleLoaded, sunPosition]);

  // Handle map rotation
  useEffect(() => {
    if (!map.current) return;
    map.current.setBearing(mapRotation[0]);
  }, [mapRotation]);

  // Update venue markers with precise geographic positioning
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

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

    // Add venue markers with exact geographic coordinates
    venuesToShow.forEach(venue => {
      const inSunlight = sunPosition.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
      
      // Create marker element
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

      // Add venue type icon
      const icon = venue.type === 'cafe' ? '☕' : 
                   venue.type === 'bar' ? '🍺' : 
                   venue.type === 'park' ? '🌳' : '🍽️';
      
      el.innerHTML = icon;

      // Create marker with exact coordinates
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([venue.lng, venue.lat])
        .addTo(map.current!);

      // Add hover events with proper venue data
      el.addEventListener('mouseenter', () => {
        onVenueHover?.(venue);
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        onVenueHover?.(null);
        el.style.transform = 'scale(1)';
      });

      markersRef.current.push(marker);
    });
  }, [filter, sunPosition, currentHour, mapLoaded, onVenueHover]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Stockholm map with terrain...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
