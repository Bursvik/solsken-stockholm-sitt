
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  zoomLevel: number;
}

const MapControls = ({ onZoomIn, onZoomOut, onResetView, zoomLevel }: MapControlsProps) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col space-y-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomIn}
        className="bg-white/90 backdrop-blur-sm border-sun-200"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomOut}
        className="bg-white/90 backdrop-blur-sm border-sun-200"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onResetView}
        className="bg-white/90 backdrop-blur-sm border-sun-200"
      >
        <Move className="h-4 w-4" />
      </Button>
      <div className="text-xs text-gray-500 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
};

export default MapControls;
