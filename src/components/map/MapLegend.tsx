
const MapLegend = () => {
  return (
    <div className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-sun-200">
      <h4 className="font-medium text-sm mb-2">Legend</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-sun-500"></div>
          <span>Sunny venues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>Shaded venues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-shadow-700 opacity-60"></div>
          <span>Building shadows</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <span>Parks</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
