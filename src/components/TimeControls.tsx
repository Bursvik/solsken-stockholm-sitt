
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { SunPosition } from '@/utils/sunCalculator';

interface TimeControlsProps {
  currentTime: Date;
  selectedDate: Date;
  onTimeChange: (time: Date) => void;
  onDateChange: (date: Date) => void;
  sunPosition: SunPosition;
}

const TimeControls = ({ 
  currentTime, 
  selectedDate, 
  onTimeChange, 
  onDateChange, 
  sunPosition 
}: TimeControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTimeSliderChange = (values: number[]) => {
    const hour = Math.floor(values[0]);
    const minute = Math.floor((values[0] - hour) * 60);
    const newTime = new Date(selectedDate);
    newTime.setHours(hour, minute, 0, 0);
    onTimeChange(newTime);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    const newTime = new Date(newDate);
    newTime.setHours(currentTime.getHours(), currentTime.getMinutes());
    onDateChange(newDate);
    onTimeChange(newTime);
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

  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Time Controls</h2>
          <p className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={playAnimation}
            disabled={isPlaying}
            className="gradient-sun text-white"
          >
            {isPlaying ? '⏸️ Playing...' : '▶️ Animate Day'}
          </Button>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-sm text-gray-600">
              Sun: {sunPosition.elevation.toFixed(1)}°
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sun-500"
          />
        </div>

        {/* Time Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time of Day
          </label>
          <div className="px-3">
            <Slider
              value={[currentHour]}
              onValueChange={handleTimeSliderChange}
              min={0}
              max={24}
              step={0.25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Time Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Sunrise (06:00)', hour: 6 },
          { label: 'Morning (09:00)', hour: 9 },
          { label: 'Lunch (12:00)', hour: 12 },
          { label: 'Afternoon (15:00)', hour: 15 },
          { label: 'Dinner (18:00)', hour: 18 },
          { label: 'Sunset (21:00)', hour: 21 },
        ].map(({ label, hour }) => (
          <Button
            key={hour}
            variant="outline"
            size="sm"
            onClick={() => {
              const newTime = new Date(selectedDate);
              newTime.setHours(hour, 0, 0, 0);
              onTimeChange(newTime);
            }}
            className={currentTime.getHours() === hour ? 'bg-sun-100 border-sun-300' : ''}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Sun Path Visualization */}
      <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sun Path Today</h3>
        <div className="relative h-16 bg-white/50 rounded border overflow-hidden">
          {/* Hour markers */}
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-gray-300"
              style={{ left: `${(i / 24) * 100}%` }}
            >
              {i % 6 === 0 && (
                <span className="absolute -bottom-5 -left-2 text-xs text-gray-500">
                  {i.toString().padStart(2, '0')}
                </span>
              )}
            </div>
          ))}
          
          {/* Current time indicator */}
          <div
            className="absolute top-0 h-full w-0.5 bg-sun-500 z-10"
            style={{ left: `${(currentHour / 24) * 100}%` }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-sun-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* Daylight period */}
          <div
            className="absolute top-2 h-12 bg-gradient-to-r from-sun-200 to-sun-300 rounded opacity-60"
            style={{ 
              left: '25%', // 6 AM
              width: '62.5%' // Until 9 PM (15 hours)
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TimeControls;
