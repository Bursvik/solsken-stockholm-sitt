
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MapTimeSliderProps {
  currentTime: Date;
  selectedDate: Date;
  onTimeChange: (time: Date) => void;
  onDateChange: (date: Date) => void;
}

const MapTimeSlider = ({ currentTime, selectedDate, onTimeChange, onDateChange }: MapTimeSliderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

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
    let hour = 6; // Start at 6 AM
    const interval = setInterval(() => {
      if (hour >= 22) { // Stop at 10 PM
        setIsPlaying(false);
        clearInterval(interval);
        return;
      }
      
      const newTime = new Date(selectedDate);
      newTime.setHours(hour, 0, 0, 0);
      onTimeChange(newTime);
      hour += 0.5; // Increment by 30 minutes
    }, 200); // Update every 200ms
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-sun-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Time of Day</span>
          
          {/* Date Picker Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal h-8 px-2",
                  "text-xs"
                )}
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
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {currentTime.toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {/* Play Animation Button */}
          <Button
            onClick={playAnimation}
            disabled={isPlaying}
            size="sm"
            className="h-8 w-8 p-0 gradient-sun text-white"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
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
