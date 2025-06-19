
import { SunPosition, calculateShadowLength } from '@/utils/sunCalculator';

export const drawShadows = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number, currentTime: Date) => {
  const hour = currentTime.getHours();
  
  // Only apply nighttime overlay during actual night hours (before 6 AM or after 9 PM)
  if (hour < 6 || hour > 21 || sunPos.elevation <= 0) {
    // Night time - draw dark overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // During daylight hours, draw building shadows based on actual sun position
  if (sunPos.elevation > 0) {
    // Calculate shadow direction based on sun azimuth (opposite direction)
    const shadowAngle = ((sunPos.azimuth + 180) % 360) * Math.PI / 180;
    
    // Calculate shadow length - higher sun elevation = shorter shadows
    const buildingHeight = 30; // Average building height in meters
    const shadowLength = calculateShadowLength(buildingHeight, sunPos.elevation);
    
    // Scale shadow length for canvas (limit maximum length)
    const maxShadowLength = Math.min(shadowLength / 2, 80);
    
    // Shadow opacity based on sun elevation - lower sun = darker shadows
    const shadowOpacity = Math.max(0.2, 0.6 - (sunPos.elevation / 90) * 0.4);
    ctx.fillStyle = `rgba(15, 23, 42, ${shadowOpacity})`;
    
    // Stockholm buildings with varying heights
    const buildings = [
      { x: width * 0.485, y: height * 0.50, w: 15, h: 20, height: 25 }, // Gamla Stan
      { x: width * 0.28, y: height * 0.38, w: 20, h: 25, height: 106 }, // City Hall
      { x: width * 0.49, y: height * 0.49, w: 18, h: 25, height: 35 }, // Royal Palace
      { x: width * 0.45, y: height * 0.32, w: 12, h: 50, height: 150 }, // Modern office
      { x: width * 0.48, y: height * 0.30, w: 14, h: 55, height: 165 }, // Skyscraper
      { x: width * 0.52, y: height * 0.33, w: 10, h: 42, height: 126 }, // Office building
      { x: width * 0.62, y: height * 0.25, w: 15, h: 30, height: 90 }, // Östermalm
      { x: width * 0.66, y: height * 0.22, w: 12, h: 28, height: 84 }, // Residential
      { x: width * 0.42, y: height * 0.62, w: 13, h: 25, height: 75 }, // Södermalm
      { x: width * 0.48, y: height * 0.60, w: 11, h: 22, height: 66 }, // Mixed use
      { x: width * 0.54, y: height * 0.58, w: 14, h: 28, height: 84 }, // Residential
    ];

    buildings.forEach(building => {
      // Calculate individual shadow length based on building height
      const individualShadowLength = Math.min(calculateShadowLength(building.height, sunPos.elevation) / 3, 100);
      
      // Calculate shadow end position
      const shadowEndX = building.x + Math.cos(shadowAngle) * individualShadowLength;
      const shadowEndY = building.y + Math.sin(shadowAngle) * individualShadowLength;
      
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
