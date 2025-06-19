
import { useEffect, useRef } from 'react';
import { SunPosition } from '@/utils/sunCalculator';
import { drawDetailedMap } from './mapRendering/mapRenderer';
import { drawShadows } from './mapRendering/shadowRenderer';
import { drawVenues } from './mapRendering/venueRenderer';
import { drawSunIndicator } from './mapRendering/sunRenderer';

interface MapCanvasProps {
  currentTime: Date;
  sunPosition: SunPosition;
  transform: {
    scale: number;
    translateX: number;
    translateY: number;
  };
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
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  isDragging
}: MapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    drawVenues(ctx, canvas.offsetWidth, canvas.offsetHeight, sunPosition);
    drawSunIndicator(ctx, sunPosition, canvas.offsetWidth, canvas.offsetHeight);

    ctx.restore();
  }, [currentTime, sunPosition, transform]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ 
        width: '100%', 
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default MapCanvas;
