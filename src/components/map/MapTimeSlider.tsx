
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SunPosition, calculateSunPosition } from '@/utils/sunCalculator';

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

  // Calculate sunrise and sunset for the selected date
  const getSunriseSunset = (date: Date) => {
    let sunrise = 24;
    let sunset = 0;
    
    // Check every hour to find sunrise and sunset times
    for (let hour = 0; hour < 24; hour += 0.5) {
      const testTime = new Date(date);
      testTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      const testSunPos = calculateSunPosition(testTime, 59.3293, 18.0686);
      
      if (testSunPos.elevation > 0) {
        sunrise = Math.min(sunrise, hour);
        sunset = Math.max(sunset, hour);
      }
    }
    
    return { sunrise: sunrise === 24 ? 6 : sunrise, sunset: sunset === 0 ? 20 : sunset };
  };

  const { sunrise, sunset } = getSunriseSunset(selectedDate);

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
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 border border-sun-200 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Time of Day</span>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs border-sun-300 hover:bg-sun-50"
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
            
            <span className="text-base font-bold text-gray-900">
              {currentTime.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            
            <Button
              onClick={playAnimation}
              disabled={isPlaying}
              size="sm"
              className="h-6 w-6 p-0 gradient-sun text-white"
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <div className="relative px-2">
          <div className="relative">
            <Slider
              value={[currentHour]}
              onValueChange={handleTimeSliderChange}
              min={0}
              max={24}
              step={0.25}
              className="w-full [&_.slider-track]:h-3 [&_.slider-range]:h-3 [&_.slider-thumb]:w-4 [&_.slider-thumb]:h-4"
              style={{
                '--slider-track-bg': `linear-gradient(to right, 
                  #1e293b 0%, 
                  #1e293b ${(sunrise / 24) * 100}%, 
                  #fbbf24 ${(sunrise / 24) * 100}%, 
                  #fbbf24 ${(sunset / 24) * 100}%, 
                  #1e293b ${(sunset / 24) * 100}%, 
                  #1e293b 100%)`
              } as React.CSSProperties}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>00:00</span>
            <span className="text-sun-600 font-medium">{Math.floor(sunrise).toString().padStart(2, '0')}:{Math.floor((sunrise % 1) * 60).toString().padStart(2, '0')}</span>
            <span>12:00</span>
            <span className="text-sun-600 font-medium">{Math.floor(sunset).toString().padStart(2, '0')}:{Math.floor((sunset % 1) * 60).toString().padStart(2, '0')}</span>
            <span>24:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTimeSlider;
