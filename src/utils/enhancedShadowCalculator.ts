
import { SunPosition } from './sunCalculator';
import { BuildingData } from '../services/buildingService';
import { terrainService } from '../services/terrainService';

export interface ShadowPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1, where 1 is complete shadow
}

export class EnhancedShadowCalculator {
  private static readonly EARTH_RADIUS = 6371000; // meters

  /**
   * Calculate realistic shadow length based on sun elevation and terrain
   */
  static calculateRealisticShadowLength(
    buildingHeight: number, 
    sunElevation: number, 
    terrainElevation: number = 0
  ): number {
    if (sunElevation <= 0) return Infinity;
    
    // Adjust for very low sun angles - shadows become extremely long
    const minElevation = 0.1; // Minimum elevation to prevent infinite shadows
    const adjustedElevation = Math.max(sunElevation, minElevation);
    
    // Calculate shadow length using trigonometry
    const shadowLength = buildingHeight / Math.tan(adjustedElevation * Math.PI / 180);
    
    // For very low sun (sunrise/sunset), shadows can be kilometers long
    const maxReasonableShadow = sunElevation < 5 ? 2000 : 500; // meters
    
    return Math.min(shadowLength, maxReasonableShadow);
  }

  /**
   * Calculate shadow polygon for a building
   */
  static async calculateBuildingShadow(
    building: BuildingData,
    sunPosition: SunPosition
  ): Promise<ShadowPoint[]> {
    if (sunPosition.elevation <= 0 || !building.geometry) return [];

    const shadowLength = this.calculateRealisticShadowLength(
      building.height,
      sunPosition.elevation
    );

    // Calculate shadow direction (opposite to sun azimuth)
    const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
    const shadowBearing = shadowAzimuth * Math.PI / 180;

    // Get terrain elevation at building location
    const buildingElevation = await terrainService.getElevation(
      building.center.lat,
      building.center.lng
    );

    // Calculate shadow intensity based on sun elevation
    const shadowIntensity = Math.max(0.2, Math.min(0.9, (90 - sunPosition.elevation) / 90));

    // Create shadow polygon by projecting building corners
    const shadowPoints: ShadowPoint[] = [];

    for (const corner of building.geometry) {
      // Calculate shadow end point for each corner
      const shadowEnd = this.projectPoint(
        corner.lat,
        corner.lng,
        shadowBearing,
        shadowLength
      );

      shadowPoints.push({
        lat: shadowEnd.lat,
        lng: shadowEnd.lng,
        intensity: shadowIntensity
      });
    }

    return shadowPoints;
  }

  /**
   * Calculate terrain shadows from hills and elevated areas
   */
  static async calculateTerrainShadows(
    bounds: { north: number; south: number; east: number; west: number },
    sunPosition: SunPosition,
    gridResolution: number = 20
  ): Promise<ShadowPoint[]> {
    if (sunPosition.elevation <= 0) return [];

    const shadows: ShadowPoint[] = [];
    const step = (bounds.north - bounds.south) / gridResolution;

    // Sample terrain elevations in a grid
    for (let lat = bounds.south; lat <= bounds.north; lat += step) {
      for (let lng = bounds.west; lng <= bounds.east; lng += step) {
        try {
          const elevation = await terrainService.getElevation(lat, lng);
          
          // Check if this point casts a shadow
          const shadowLength = this.calculateRealisticShadowLength(
            elevation,
            sunPosition.elevation
          );

          if (shadowLength > 0 && shadowLength < 1000) {
            const shadowAzimuth = (sunPosition.azimuth + 180) % 360;
            const shadowBearing = shadowAzimuth * Math.PI / 180;

            const shadowEnd = this.projectPoint(lat, lng, shadowBearing, shadowLength);
            
            shadows.push({
              lat: shadowEnd.lat,
              lng: shadowEnd.lng,
              intensity: Math.max(0.1, Math.min(0.4, elevation / 100)) // Terrain shadows are lighter
            });
          }
        } catch (error) {
          // Skip points that fail elevation lookup
          continue;
        }
      }
    }

    return shadows;
  }

  /**
   * Project a point along a bearing for a given distance
   */
  private static projectPoint(
    lat: number,
    lng: number,
    bearing: number,
    distance: number
  ): { lat: number; lng: number } {
    const angularDistance = distance / this.EARTH_RADIUS;
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;

    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const newLngRad = lngRad + Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    return {
      lat: newLatRad * 180 / Math.PI,
      lng: newLngRad * 180 / Math.PI
    };
  }
}
