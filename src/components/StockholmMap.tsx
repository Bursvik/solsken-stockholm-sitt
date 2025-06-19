
import { useEffect, useRef, useState } from 'react';
import { SunPosition, calculateShadowLength } from '@/utils/sunCalculator';

interface StockholmMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
}

// Mock data for Stockholm venues with outdoor seating
const stockholmVenues = [
  { id: 1, name: 'Café Nizza', type: 'cafe', lat: 59.3293, lng: 18.0686, terrace: true, sunExposed: true },
  { id: 2, name: 'Operakällaren', type: 'restaurant', lat: 59.3278, lng: 18.0717, terrace: true, sunExposed: false },
  { id: 3, name: 'Fotografiska Restaurant', type: 'restaurant', lat: 59.3181, lng: 18.0844, terrace: true, sunExposed: true },
  { id: 4, name: 'Hermitage Restaurant', type: 'restaurant', lat: 59.3251, lng: 18.0946, terrace: true, sunExposed: true },
  { id: 5, name: 'Blå Porten', type: 'cafe', lat: 59.3201, lng: 18.0912, terrace: true, sunExposed: false },
  { id: 6, name: 'Rosendals Trädgård', type: 'cafe', lat: 59.3231, lng: 18.1156, terrace: true, sunExposed: true },
  { id: 7, name: 'Sturehof', type: 'restaurant', lat: 59.3342, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 8, name: 'Tak Stockholm', type: 'bar', lat: 59.3311, lng: 18.0686, terrace: true, sunExposed: false },
];

const StockholmMap = ({ currentTime, sunPosition }: StockholmMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredVenue, setHoveredVenue] = useState<typeof stockholmVenues[0] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw base map (simplified Stockholm city layout)
    drawBaseMap(ctx, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw shadows based on sun position
    drawShadows(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw venues
    drawVenues(ctx, stockholmVenues, canvas.offsetWidth, canvas.offsetHeight, sunPosition);
    
    // Draw sun position indicator
    drawSunIndicator(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight);

  }, [currentTime, sunPosition]);

  const drawBaseMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simplified Stockholm water and land areas
    ctx.fillStyle = '#bfdbfe'; // Water color
    ctx.fillRect(0, 0, width, height);

    // Land areas (simplified)
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.4);
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.3, height * 0.3);
    ctx.fillRect(width * 0.6, height * 0.6, width * 0.3, height * 0.3);

    // Major buildings (dark rectangles)
    ctx.fillStyle = '#6b7280';
    const buildings = [
      { x: width * 0.3, y: height * 0.4, w: 20, h: 30 },
      { x: width * 0.5, y: height * 0.3, w: 25, h: 40 },
      { x: width * 0.4, y: height * 0.6, w: 15, h: 25 },
      { x: width * 0.6, y: height * 0.5, w: 30, h: 35 },
      { x: width * 0.2, y: height * 0.2, w: 20, h: 20 },
    ];
    
    buildings.forEach(building => {
      ctx.fillRect(building.x, building.y, building.w, building.h);
    });
  };

  const drawShadows = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number) => {
    if (sunPos.elevation <= 0) {
      // Night time - draw dark overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Calculate shadow directions based on sun azimuth
    const shadowAngle = (sunPos.azimuth - 180) * Math.PI / 180; // Opposite direction of sun
    const shadowLength = calculateShadowLength(30, sunPos.elevation); // Assuming 30m building height
    
    ctx.fillStyle = `rgba(15, 23, 42, ${Math.max(0.2, 0.7 - sunPos.elevation / 90)})`;
    
    // Draw building shadows
    const buildings = [
      { x: width * 0.3, y: height * 0.4, w: 20, h: 30 },
      { x: width * 0.5, y: height * 0.3, w: 25, h: 40 },
      { x: width * 0.4, y: height * 0.6, w: 15, h: 25 },
      { x: width * 0.6, y: height * 0.5, w: 30, h: 35 },
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
  };

  const drawVenues = (ctx: CanvasRenderingContext2D, venues: typeof stockholmVenues, width: number, height: number, sunPos: SunPosition) => {
    venues.forEach(venue => {
      // Convert lat/lng to canvas coordinates (simplified)
      const x = ((venue.lng - 18.0686) * 2000) + width * 0.5;
      const y = height * 0.5 - ((venue.lat - 59.3293) * 2000);

      // Determine if venue is currently in sunlight
      const inSunlight = sunPos.elevation > 0 && venue.sunExposed;
      
      // Draw venue marker
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = inSunlight ? '#f59e0b' : '#64748b';
      ctx.fill();
      ctx.strokeStyle = inSunlight ? '#d97706' : '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add glow effect for sunny venues
      if (inSunlight) {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fill();
      }

      // Draw venue type icon
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      const icon = venue.type === 'cafe' ? '☕' : venue.type === 'bar' ? '🍺' : '🍽️';
      ctx.fillText(icon, x, y + 3);
    });
  };

  const drawSunIndicator = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number) => {
    if (sunPos.elevation <= 0) return;

    // Calculate sun position on canvas
    const sunX = width * 0.8;
    const sunY = height * 0.2;

    // Draw sun
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    
    // Sun glow
    ctx.beginPath();
    ctx.arc(sunX, sunY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const startX = sunX + Math.cos(angle) * 20;
      const startY = sunY + Math.sin(angle) * 20;
      const endX = sunX + Math.cos(angle) * 30;
      const endY = sunY + Math.sin(angle) * 30;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200">
        <h4 className="font-medium text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-sun-500"></div>
            <span>Sunny venues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Shaded venues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-shadow-700 opacity-60"></div>
            <span>Building shadows</span>
          </div>
        </div>
      </div>

      {/* Venue count indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-sun-600">
            {stockholmVenues.filter(v => sunPosition.elevation > 0 && v.sunExposed).length}
          </div>
          <div className="text-xs text-gray-600">venues in sun</div>
        </div>
      </div>
    </div>
  );
};

export default StockholmMap;
