
interface VenueTooltipProps {
  venue: {
    id: number;
    name: string;
    type: string;
  } | null;
  x: number;
  y: number;
}

const VenueTooltip = ({ venue, x, y }: VenueTooltipProps) => {
  if (!venue) return null;

  return (
    <div
      className="absolute pointer-events-none bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50"
      style={{
        left: x + 10,
        top: y - 40,
        transform: x > window.innerWidth - 200 ? 'translateX(-100%)' : 'translateX(0)'
      }}
    >
      <div className="font-medium">{venue.name}</div>
      <div className="text-xs text-gray-300 capitalize">{venue.type}</div>
    </div>
  );
};

export default VenueTooltip;
