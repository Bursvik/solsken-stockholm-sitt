
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SunPosition } from '@/utils/sunCalculator';

interface MapTimeSliderProps {
  currentTime: Date;
  selectedDate: Date;
  onTimeChange: (time: Date) => void;
  onDateChange: (date: Date) => void;
  sunPosition: SunPosition;
}

const MapTimeSlider = ({ currentTime, selectedDate, onTimeChange, onDateChange, sunPosition }: MapTimeSliderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

  // Calculate sunrise and sunset (approximation for Stockholm)
  const sunrise = 6; // 6 AM
  const sunset = 20; // 8 PM

  const handleTimeSliderChange = (values: number[]) => {
    const hour = Math.floor(values[0]);
    const minute = Math.floor((values[0] - hour) * 60);
    const newTime = new Date(selectedDate);
    newTime.setHours(hour, minute, 0, 0);
    onTimeChange(newTime);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newTime = new Date(date);
      newTime.setHours(currentTime.getHours(), currentTime.getMinutes());
      onDateChange(date);
      onTimeChange(newTime);
    }
  };

  const playAnimation = () => {
    setIsPlaying(true);
    let hour = sunrise;
    const interval = setInterval(() => {
      if (hour >= sunset) {
        setIsPlaying(false);
        clearInterval(interval);
        return;
      }
      
      const newTime = new Date(selectedDate);
      newTime.setHours(hour, 0, 0, 0);
      onTimeChange(newTime);
      hour += 0.5;
    }, 200);
  };

  const isDaylight = currentHour >= sunrise && currentHour <= sunset;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-sun-200 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Time of Day</span>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs border-sun-300 hover:bg-sun-50"
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {format(selectedDate, "MMM d")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDaylight ? 'bg-sun-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-gray-600">
              {isDaylight ? '☀️ Daylight' : '🌙 Night'}
            </span>
          </div>
          
          <span className="text-lg font-bold text-gray-900">
            {currentTime.toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          <Button
            onClick={playAnimation}
            disabled={isPlaying}
            size="sm"
            className="h-7 w-7 p-0 gradient-sun text-white"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      
      <div className="relative px-2">
        <Slider
          value={[currentHour]}
          onValueChange={handleTimeSliderChange}
          min={0}
          max={24}
          step={0.25}
          className="w-full"
        />
        
        {/* Daylight indicator bar */}
        <div className="absolute top-6 left-2 right-2 h-1 bg-gray-200 rounded">
          <div 
            className="h-full bg-gradient-sun rounded"
            style={{
              marginLeft: `${(sunrise / 24) * 100}%`,
              width: `${((sunset - sunrise) / 24) * 100}%`
            }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span>00:00</span>
          <span className="text-sun-600 font-medium">06:00 ☀️</span>
          <span>12:00</span>
          <span className="text-sun-600 font-medium">☀️ 20:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

export default MapTimeSlider;
