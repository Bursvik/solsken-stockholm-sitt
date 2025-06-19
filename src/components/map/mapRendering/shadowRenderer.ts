
import { SunPosition, calculateShadowLength } from '@/utils/sunCalculator';

export const drawShadows = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number, currentTime: Date) => {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  // Only apply nighttime overlay during actual night hours when sun is below horizon
  if (sunPos.elevation <= 0) {
    // Night time - draw dark overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // During daylight hours, draw building shadows based on actual sun position
  if (sunPos.elevation > 0) {
    // Convert azimuth to shadow direction (azimuth is degrees from north, clockwise)
    // Shadow points in opposite direction of sun
    const shadowAzimuth = (sunPos.azimuth + 180) % 360;
    const shadowAngle = (shadowAzimuth - 90) * Math.PI / 180; // Convert to radians, adjust for canvas coordinates
    
    // Stockholm buildings with realistic heights and positions
    const buildings = [
      { x: width * 0.485, y: height * 0.50, w: 15, h: 20, height: 25 }, // Gamla Stan buildings
      { x: width * 0.28, y: height * 0.38, w: 20, h: 25, height: 106 }, // Stockholm City Hall
      { x: width * 0.49, y: height * 0.49, w: 18, h: 25, height: 35 }, // Royal Palace
      { x: width * 0.45, y: height * 0.32, w: 12, h: 50, height: 150 }, // Norrmalm office buildings
      { x: width * 0.48, y: height * 0.30, w: 14, h: 55, height: 165 }, // Modern skyscrapers
      { x: width * 0.52, y: height * 0.33, w: 10, h: 42, height: 126 }, // Financial district
      { x: width * 0.62, y: height * 0.25, w: 15, h: 30, height: 90 }, // Östermalm buildings
      { x: width * 0.66, y: height * 0.22, w: 12, h: 28, height: 84 }, // Residential blocks
      { x: width * 0.42, y: height * 0.62, w: 13, h: 25, height: 75 }, // Södermalm buildings
      { x: width * 0.48, y: height * 0.60, w: 11, h: 22, height: 66 }, // Mixed use buildings
      { x: width * 0.54, y: height * 0.58, w: 14, h: 28, height: 84 }, // Residential towers
    ];

    // Calculate shadow opacity based on sun elevation - higher sun = darker shadows
    const shadowOpacity = Math.max(0.2, Math.min(0.8, sunPos.elevation / 90 * 0.6));
    ctx.fillStyle = `rgba(15, 23, 42, ${shadowOpacity})`;

    buildings.forEach(building => {
      // Calculate shadow length based on sun elevation using proper trigonometry
      const shadowLength = calculateShadowLength(building.height, sunPos.elevation);
      
      // Limit shadow length to reasonable bounds
      const maxShadowLength = Math.min(shadowLength, 200);
      
      // Calculate shadow end position using actual sun azimuth
      const shadowEndX = building.x + Math.cos(shadowAngle) * maxShadowLength;
      const shadowEndY = building.y + Math.sin(shadowAngle) * maxShadowLength;
      
      // Draw shadow as a polygon
      ctx.beginPath();
      ctx.moveTo(building.x, building.y + building.h); // Bottom left of building
      ctx.lineTo(building.x + building.w, building.y + building.h); // Bottom right of building
      ctx.lineTo(shadowEndX + building.w, shadowEndY + building.h); // Shadow end right
      ctx.lineTo(shadowEndX, shadowEndY + building.h); // Shadow end left
      ctx.closePath();
      ctx.fill();
    });
  }
};
