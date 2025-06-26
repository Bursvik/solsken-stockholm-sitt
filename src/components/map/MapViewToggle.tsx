
import { Button } from '@/components/ui/button';

interface MapViewToggleProps {
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

const MapViewToggle = ({ viewMode, onViewModeChange }: MapViewToggleProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-sun-200 overflow-hidden flex shadow-lg">
      <Button
        variant={viewMode === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('map')}
        className={`rounded-none text-xs px-3 h-8 ${
          viewMode === 'map' ? 'bg-sun-500 hover:bg-sun-600 text-white' : ''
        }`}
      >
        Map
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`rounded-none text-xs px-3 h-8 ${
          viewMode === 'list' ? 'bg-sun-500 hover:bg-sun-600 text-white' : ''
        }`}
      >
        List
      </Button>
    </div>
  );
};

export default MapViewToggle;
