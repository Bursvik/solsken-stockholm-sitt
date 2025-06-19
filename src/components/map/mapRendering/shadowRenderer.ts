
import { SunPosition, calculateShadowLength } from '@/utils/sunCalculator';

export const drawShadows = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number, currentTime: Date) => {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const timeDecimal = hour + minute / 60;
  
  // Only apply nighttime overlay during actual night hours (before 6 AM or after 9 PM)
  if (hour < 6 || hour > 21 || sunPos.elevation <= 0) {
    // Night time - draw dark overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // During daylight hours, draw building shadows based on sun position relative to noon
  if (sunPos.elevation > 0) {
    // Calculate how far we are from solar noon (12:00)
    const hoursFromNoon = Math.abs(12 - timeDecimal);
    
    // Shadow direction based on time of day
    // Morning: shadows point west (270°), Evening: shadows point east (90°)
    // At noon: minimal shadows pointing north
    let shadowAngle;
    if (timeDecimal < 12) {
      // Morning: sun is in east, shadows point west
      shadowAngle = (270 - (hoursFromNoon * 15)) * Math.PI / 180; // 15° per hour
    } else {
      // Afternoon/Evening: sun is in west, shadows point east
      shadowAngle = (90 + (hoursFromNoon * 15)) * Math.PI / 180;
    }
    
    // Calculate shadow length based on distance from noon
    // Longer shadows in morning/evening, shorter at midday
    const maxShadowHours = 6; // Maximum shadow at 6 hours from noon
    const shadowMultiplier = Math.min(hoursFromNoon / maxShadowHours, 1);
    
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

    // Shadow opacity based on time from noon - darker shadows when sun is lower
    const shadowOpacity = Math.max(0.3, 0.7 * shadowMultiplier);
    ctx.fillStyle = `rgba(15, 23, 42, ${shadowOpacity})`;

    buildings.forEach(building => {
      // Calculate shadow length: longer when further from noon
      const baseShadowLength = building.height * shadowMultiplier * 2;
      const maxShadowLength = Math.min(baseShadowLength, 120);
      
      // At noon, shadows are very short and point roughly north
      const shadowLength = timeDecimal === 12 ? building.height * 0.1 : maxShadowLength;
      
      // Calculate shadow end position
      const shadowEndX = building.x + Math.cos(shadowAngle) * shadowLength;
      const shadowEndY = building.y + Math.sin(shadowAngle) * shadowLength;
      
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
