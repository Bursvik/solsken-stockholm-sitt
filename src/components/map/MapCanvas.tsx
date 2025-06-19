
import { useEffect, useRef, useState } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import { drawDetailedMap } from './mapRendering/mapRenderer';
import { drawShadows } from './mapRendering/shadowRenderer';
import { drawVenues, getVenueAtPosition } from './mapRendering/venueRenderer';
import { drawSunIndicator } from './mapRendering/sunRenderer';
import VenueTooltip from './VenueTooltip';

interface MapCanvasProps {
  currentTime: Date;
  sunPosition: SunPosition;
  transform: {
    scale: number;
    translateX: number;
    translateY: number;
  };
  filter?: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park';
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  isDragging: boolean;
}

const MapCanvas = ({
  currentTime,
  sunPosition,
  transform,
  filter = 'all',
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  isDragging
}: MapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredVenue, setHoveredVenue] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentHour = currentTime.getHours().toString().padStart(2, '0') + ':00';

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Account for transform when checking venue positions
    const adjustedX = (mouseX - transform.translateX) / transform.scale;
    const adjustedY = (mouseY - transform.translateY) / transform.scale;
    
    const venue = getVenueAtPosition(adjustedX, adjustedY, canvas.offsetWidth, canvas.offsetHeight);
    setHoveredVenue(venue);
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    onMouseMove(e);
  };

  const handleMouseLeave = () => {
    setHoveredVenue(null);
    onMouseLeave();
  };

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

    // Draw all map layers
    drawDetailedMap(ctx, canvas.offsetWidth, canvas.offsetHeight);
    drawShadows(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight, currentTime);
    drawVenues(ctx, canvas.offsetWidth, canvas.offsetHeight, sunPosition, filter, currentHour);
    drawSunIndicator(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight);

    ctx.restore();
  }, [currentTime, sunPosition, transform, filter]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: isDragging ? 'grabbing' : hoveredVenue ? 'pointer' : 'grab'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      
      <VenueTooltip
        venue={hoveredVenue}
        x={mousePosition.x}
        y={mousePosition.y}
      />
    </div>
  );
};

export default MapCanvas;
