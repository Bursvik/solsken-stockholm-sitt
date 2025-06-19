
import { Slider } from '@/components/ui/slider';

interface MapTimeSliderProps {
  currentTime: Date;
  selectedDate: Date;
  onTimeChange: (time: Date) => void;
}

const MapTimeSlider = ({ currentTime, selectedDate, onTimeChange }: MapTimeSliderProps) => {
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

  const handleTimeSliderChange = (values: number[]) => {
    const hour = Math.floor(values[0]);
    const minute = Math.floor((values[0] - hour) * 60);
    const newTime = new Date(selectedDate);
    newTime.setHours(hour, minute, 0, 0);
    onTimeChange(newTime);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-sun-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Time of Day</span>
        <span className="text-lg font-bold text-gray-900">
          {currentTime.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      
      <div className="px-2">
        <Slider
          value={[currentHour]}
          onValueChange={handleTimeSliderChange}
          min={0}
          max={24}
          step={0.25}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

export default MapTimeSlider;
