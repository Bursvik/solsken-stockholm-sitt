
import { SunPosition } from '@/utils/sunCalculator';

export const drawSunIndicator = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number) => {
  if (sunPos.elevation <= 0) return;

  // Calculate sun position on canvas based on azimuth and elevation
  const sunX = width * 0.8;
  const sunY = height * 0.2;

  // Draw sun
  ctx.beginPath();
  ctx.arc(sunX, sunY, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  
  // Sun glow
  ctx.beginPath();
  ctx.arc(sunX, sunY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.fill();

  // Sun rays
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const startX = sunX + Math.cos(angle) * 16;
    const startY = sunY + Math.sin(angle) * 16;
    const endX = sunX + Math.cos(angle) * 24;
    const endY = sunY + Math.sin(angle) * 24;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
};
