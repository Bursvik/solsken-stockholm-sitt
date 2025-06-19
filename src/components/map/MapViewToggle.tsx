
import { Button } from '@/components/ui/button';

interface MapViewToggleProps {
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

const MapViewToggle = ({ viewMode, onViewModeChange }: MapViewToggleProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-sun-200 overflow-hidden flex">
      <Button
        variant={viewMode === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('map')}
        className="rounded-none text-xs px-3 h-8"
      >
        Map
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="rounded-none text-xs px-3 h-8"
      >
        List
      </Button>
    </div>
  );
};

export default MapViewToggle;
