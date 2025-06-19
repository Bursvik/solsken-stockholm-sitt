
import { SunPosition, calculateShadowLength } from '@/utils/sunCalculator';

export const drawShadows = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number, currentTime: Date) => {
  const hour = currentTime.getHours();
  
  // Only apply nighttime overlay during actual night hours (before 6 AM or after 9 PM)
  if (hour < 6 || hour > 21) {
    // Night time - draw dark overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // During daylight hours (6 AM to 9 PM), always draw building shadows if sun is above horizon
  if (sunPos.elevation > 0) {
    // Calculate shadow directions based on sun azimuth
    const shadowAngle = (sunPos.azimuth - 180) * Math.PI / 180; // Opposite direction of sun
    const shadowLength = calculateShadowLength(30, sunPos.elevation); // Assuming 30m building height
    
    ctx.fillStyle = `rgba(15, 23, 42, ${Math.max(0.1, 0.4 - sunPos.elevation / 180)})`;
    
    // Draw building shadows for all buildings
    const buildings = [
      { x: width * 0.46, y: height * 0.49, w: 12, h: 18 },
      { x: width * 0.42, y: height * 0.38, w: 20, h: 35 },
      { x: width * 0.45, y: height * 0.36, w: 25, h: 45 },
      { x: width * 0.48, y: height * 0.39, w: 18, h: 28 },
      { x: width * 0.52, y: height * 0.37, w: 22, h: 38 },
      { x: width * 0.38, y: height * 0.58, w: 15, h: 25 },
      { x: width * 0.58, y: height * 0.30, w: 16, h: 26 },
    ];

    buildings.forEach(building => {
      const shadowX = building.x + Math.cos(shadowAngle) * Math.min(shadowLength / 5, 50);
      const shadowY = building.y + Math.sin(shadowAngle) * Math.min(shadowLength / 5, 50);
      
      ctx.beginPath();
      ctx.moveTo(building.x, building.y);
      ctx.lineTo(building.x + building.w, building.y);
      ctx.lineTo(shadowX + building.w, shadowY);
      ctx.lineTo(shadowX, shadowY);
      ctx.closePath();
      ctx.fill();
    });
  }
};
