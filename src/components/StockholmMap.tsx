
import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SunPosition, calculateShadowLength } from '@/utils/sunCalculator';

interface StockholmMapProps {
  currentTime: Date;
  sunPosition: SunPosition;
}

// More detailed Stockholm venues with realistic coordinates
const stockholmVenues = [
  { id: 1, name: 'Café Nizza', type: 'cafe', lat: 59.3293, lng: 18.0686, terrace: true, sunExposed: true },
  { id: 2, name: 'Operakällaren', type: 'restaurant', lat: 59.3278, lng: 18.0717, terrace: true, sunExposed: false },
  { id: 3, name: 'Fotografiska Restaurant', type: 'restaurant', lat: 59.3181, lng: 18.0844, terrace: true, sunExposed: true },
  { id: 4, name: 'Hermitage Restaurant', type: 'restaurant', lat: 59.3251, lng: 18.0946, terrace: true, sunExposed: true },
  { id: 5, name: 'Blå Porten', type: 'cafe', lat: 59.3201, lng: 18.0912, terrace: true, sunExposed: false },
  { id: 6, name: 'Rosendals Trädgård', type: 'cafe', lat: 59.3231, lng: 18.1156, terrace: true, sunExposed: true },
  { id: 7, name: 'Sturehof', type: 'restaurant', lat: 59.3342, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 8, name: 'Tak Stockholm', type: 'bar', lat: 59.3311, lng: 18.0686, terrace: true, sunExposed: false },
  { id: 9, name: 'Riche', type: 'bar', lat: 59.3328, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 10, name: 'Cafe Saturnus', type: 'cafe', lat: 59.3422, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 11, name: 'Gondolen', type: 'restaurant', lat: 59.3186, lng: 18.0711, terrace: true, sunExposed: true },
  { id: 12, name: 'Mosebacke Etablissement', type: 'bar', lat: 59.3156, lng: 18.0756, terrace: true, sunExposed: true },
];

const StockholmMap = ({ currentTime, sunPosition }: StockholmMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredVenue, setHoveredVenue] = useState<typeof stockholmVenues[0] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });

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

    // Apply transform
    ctx.save();
    ctx.translate(transform.translateX, transform.translateY);
    ctx.scale(transform.scale, transform.scale);

    // Draw base map (detailed Stockholm city layout)
    drawDetailedMap(ctx, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw shadows based on sun position
    drawShadows(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight, currentTime);
    
    // Draw venues
    drawVenues(ctx, stockholmVenues, canvas.offsetWidth, canvas.offsetHeight, sunPosition);
    
    // Draw sun position indicator
    drawSunIndicator(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight);

    ctx.restore();
  }, [currentTime, sunPosition, transform]);

  const drawDetailedMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Water bodies - more detailed Stockholm archipelago
    ctx.fillStyle = '#3b82f6'; // Deeper water color
    ctx.fillRect(0, 0, width, height);

    // Main islands and land areas
    const landAreas = [
      // Gamla Stan (Old Town)
      { x: width * 0.45, y: height * 0.48, w: width * 0.08, h: height * 0.06, type: 'island' },
      // Södermalm
      { x: width * 0.35, y: height * 0.55, w: width * 0.25, h: height * 0.15, type: 'main' },
      // Norrmalm & City
      { x: width * 0.4, y: height * 0.35, w: width * 0.2, h: height * 0.12, type: 'main' },
      // Östermalm
      { x: width * 0.55, y: height * 0.25, w: width * 0.18, h: height * 0.18, type: 'main' },
      // Djurgården
      { x: width * 0.65, y: height * 0.45, w: width * 0.15, h: height * 0.12, type: 'park' },
      // Vasastan
      { x: width * 0.35, y: height * 0.25, w: width * 0.15, h: height * 0.12, type: 'main' },
    ];

    landAreas.forEach(area => {
      if (area.type === 'park') {
        ctx.fillStyle = '#22c55e'; // Green for parks
      } else if (area.type === 'island') {
        ctx.fillStyle = '#f59e0b'; // Historic areas
      } else {
        ctx.fillStyle = '#e5e7eb'; // Regular land
      }
      
      // Rounded rectangles for more organic shapes
      ctx.beginPath();
      ctx.roundRect(area.x, area.y, area.w, area.h, 8);
      ctx.fill();
    });

    // Streets and major roads
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    
    // Major streets
    const streets = [
      // Horizontal streets
      { startX: width * 0.3, startY: height * 0.4, endX: width * 0.7, endY: height * 0.4 },
      { startX: width * 0.35, startY: height * 0.6, endX: width * 0.65, endY: height * 0.6 },
      // Vertical streets
      { startX: width * 0.5, startY: height * 0.2, endX: width * 0.5, endY: height * 0.7 },
      { startX: width * 0.42, startY: height * 0.3, endX: width * 0.42, endY: height * 0.65 },
    ];

    streets.forEach(street => {
      ctx.beginPath();
      ctx.moveTo(street.startX, street.startY);
      ctx.lineTo(street.endX, street.endY);
      ctx.stroke();
    });

    // Buildings - more realistic distribution
    ctx.fillStyle = '#4b5563';
    const buildings = [
      // Gamla Stan buildings
      { x: width * 0.46, y: height * 0.49, w: 12, h: 18 },
      { x: width * 0.48, y: height * 0.50, w: 10, h: 22 },
      { x: width * 0.50, y: height * 0.49, w: 14, h: 16 },
      
      // City center buildings
      { x: width * 0.42, y: height * 0.38, w: 20, h: 35 },
      { x: width * 0.45, y: height * 0.36, w: 25, h: 45 },
      { x: width * 0.48, y: height * 0.39, w: 18, h: 28 },
      { x: width * 0.52, y: height * 0.37, w: 22, h: 38 },
      { x: width * 0.55, y: height * 0.40, w: 16, h: 32 },
      
      // Södermalm buildings
      { x: width * 0.38, y: height * 0.58, w: 15, h: 25 },
      { x: width * 0.41, y: height * 0.60, w: 18, h: 30 },
      { x: width * 0.44, y: height * 0.57, w: 12, h: 20 },
      { x: width * 0.50, y: height * 0.59, w: 20, h: 28 },
      
      // Östermalm buildings
      { x: width * 0.58, y: height * 0.30, w: 16, h: 26 },
      { x: width * 0.61, y: height * 0.28, w: 14, h: 22 },
      { x: width * 0.64, y: height * 0.32, w: 18, h: 24 },
      { x: width * 0.67, y: height * 0.29, w: 20, h: 30 },
    ];
    
    buildings.forEach(building => {
      ctx.fillRect(building.x, building.y, building.w, building.h);
      
      // Add building details
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(building.x + 2, building.y + 2, building.w - 4, 3);
      ctx.fillStyle = '#4b5563';
    });

    // Bridges
    ctx.fillStyle = '#9ca3af';
    const bridges = [
      { x: width * 0.44, y: height * 0.46, w: width * 0.12, h: 4 },
      { x: width * 0.48, y: height * 0.53, w: width * 0.08, h: 3 },
    ];
    
    bridges.forEach(bridge => {
      ctx.fillRect(bridge.x, bridge.y, bridge.w, bridge.h);
    });
  };

  const drawShadows = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number, currentTime: Date) => {
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

  const drawVenues = (ctx: CanvasRenderingContext2D, venues: typeof stockholmVenues, width: number, height: number, sunPos: SunPosition) => {
    venues.forEach(venue => {
      // Convert lat/lng to canvas coordinates with better scaling
      const x = ((venue.lng - 18.0686) * 4000) + width * 0.5;
      const y = height * 0.5 - ((venue.lat - 59.3293) * 4000);

      // Determine if venue is currently in sunlight
      const inSunlight = sunPos.elevation > 0 && venue.sunExposed;
      
      // Draw venue marker
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = inSunlight ? '#f59e0b' : '#64748b';
      ctx.fill();
      ctx.strokeStyle = inSunlight ? '#d97706' : '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add glow effect for sunny venues
      if (inSunlight) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fill();
      }

      // Draw venue type icon
      ctx.fillStyle = 'white';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      const icon = venue.type === 'cafe' ? '☕' : venue.type === 'bar' ? '🍺' : '🍽️';
      ctx.fillText(icon, x, y + 2);

      // Draw venue name on hover (simplified)
      if (hoveredVenue?.id === venue.id) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x + 12, y - 10, venue.name.length * 6, 16);
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(venue.name, x + 14, y);
      }
    });
  };

  const drawSunIndicator = (ctx: CanvasRenderingContext2D, sunPos: SunPosition, width: number, height: number) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.2 : 0.8;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * zoomFactor))
    }));
  };

  const resetView = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab"
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleZoom('in')}
          className="bg-white/90 backdrop-blur-sm border-sun-200"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleZoom('out')}
          className="bg-white/90 backdrop-blur-sm border-sun-200"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetView}
          className="bg-white/90 backdrop-blur-sm border-sun-200"
        >
          <Move className="h-4 w-4" />
        </Button>
      </div>

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
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <span>Parks</span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200">
        <h4 className="font-medium text-sm mb-2">Controls</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div>🖱️ Click & drag to pan</div>
          <div>🔍 Use zoom buttons</div>
          <div>↺ Reset view button</div>
        </div>
      </div>

      {/* Venue count indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-sun-600">
            {stockholmVenues.filter(v => sunPosition.elevation > 0 && v.sunExposed).length}
          </div>
          <div className="text-xs text-gray-600">venues in sun</div>
          <div className="text-xs text-gray-500 mt-1">
            Zoom: {Math.round(transform.scale * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockholmMap;
