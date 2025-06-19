
import { SunPosition } from '@/utils/sunCalculator';

interface SunIndicatorProps {
  sunPosition: SunPosition;
}

const SunIndicator = ({ sunPosition }: SunIndicatorProps) => {
  const getSunPhase = () => {
    if (sunPosition.elevation < -18) return { phase: 'Night', icon: '🌙', color: 'text-blue-600' };
    if (sunPosition.elevation < -6) return { phase: 'Dawn', icon: '🌅', color: 'text-orange-500' };
    if (sunPosition.elevation < 6) return { phase: 'Sunrise', icon: '🌄', color: 'text-yellow-500' };
    if (sunPosition.elevation < 60) return { phase: 'Day', icon: '☀️', color: 'text-sun-500' };
    return { phase: 'High Sun', icon: '🌞', color: 'text-sun-600' };
  };

  const sunPhase = getSunPhase();
  const intensity = Math.max(0, Math.min(100, (sunPosition.elevation + 18) / 78 * 100));

  return (
    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-sun-200">
      <div className="text-2xl">{sunPhase.icon}</div>
      <div className="text-right">
        <div className={`font-medium ${sunPhase.color}`}>
          {sunPhase.phase}
        </div>
        <div className="text-xs text-gray-600">
          {intensity.toFixed(0)}% intensity
        </div>
      </div>
    </div>
  );
};

export default SunIndicator;
