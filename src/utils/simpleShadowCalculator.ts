
import { SunPosition } from './sunCalculator';

export interface SimpleShadow {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

export class SimpleShadowCalculator {
  /**
   * Calculate basic shadow for a building based on sun position
   */
  static calculateBuildingShadow(
    buildingX: number,
    buildingY: number,
    buildingWidth: number,
    buildingHeight: number,
    sunPosition: SunPosition
  ): SimpleShadow | null {
    // No shadow if sun is below horizon
    if (sunPosition.elevation <= 0) {
      return null;
    }

    // Calculate shadow length using basic trigonometry
    const shadowLength = Math.min(
      buildingHeight / Math.tan((sunPosition.elevation * Math.PI) / 180),
      200 // Max shadow length to keep reasonable
    );

    // Calculate shadow direction (opposite to sun azimuth)
    const shadowAngle = ((sunPosition.azimuth + 180) % 360) * Math.PI / 180;

    // Calculate shadow end position
    const shadowEndX = buildingX + Math.cos(shadowAngle) * shadowLength;
    const shadowEndY = buildingY + Math.sin(shadowAngle) * shadowLength;

    // Calculate shadow opacity based on sun elevation
    const opacity = Math.max(0.2, Math.min(0.7, (90 - sunPosition.elevation) / 90 * 0.6));

    return {
      x: Math.min(buildingX, shadowEndX),
      y: Math.min(buildingY, shadowEndY),
      width: Math.abs(shadowEndX - buildingX) + buildingWidth,
      height: Math.abs(shadowEndY - buildingY) + buildingHeight,
      opacity
    };
  }
}
