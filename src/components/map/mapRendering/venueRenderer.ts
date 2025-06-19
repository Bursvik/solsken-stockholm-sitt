
import { SunPosition } from '@/utils/sunCalculator';
import { stockholmVenues, Venue } from '@/data/stockholmVenues';

export const drawVenues = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  sunPos: SunPosition,
  filter: 'all' | 'sunny' | 'cafe' | 'restaurant' | 'bar' | 'park' = 'all',
  currentHour: string = '12:00'
) => {
  // Filter venues based on the current filter
  let venuesToShow = stockholmVenues;
  
  if (filter !== 'all') {
    if (filter === 'sunny') {
      venuesToShow = stockholmVenues.filter(venue => 
        sunPos.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour)
      );
    } else {
      venuesToShow = stockholmVenues.filter(venue => venue.type === filter);
    }
  }

  venuesToShow.forEach(venue => {
    // Convert lat/lng to canvas coordinates with better scaling
    const x = ((venue.lng - 18.0686) * 4000) + width * 0.5;
    const y = height * 0.5 - ((venue.lat - 59.3293) * 4000);

    // Determine if venue is currently in sunlight
    const inSunlight = sunPos.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour);
    
    // Draw venue marker
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = inSunlight ? '#f59e0b' : '#64748b';
    ctx.fill();
    ctx.strokeStyle = inSunlight ? '#d97706' : '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add glow effect for sunny venues
    if (inSunlight) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.fill();
    }

    // Draw venue type icon
    ctx.fillStyle = 'white';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    const icon = venue.type === 'cafe' ? '☕' : 
                 venue.type === 'bar' ? '🍺' : 
                 venue.type === 'park' ? '🌳' : '🍽️';
    ctx.fillText(icon, x, y + 2);
  });
};

export const getVenueAtPosition = (mouseX: number, mouseY: number, width: number, height: number): Venue | null => {
  for (const venue of stockholmVenues) {
    const x = ((venue.lng - 18.0686) * 4000) + width * 0.5;
    const y = height * 0.5 - ((venue.lat - 59.3293) * 4000);
    
    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
    if (distance <= 10) {
      return venue;
    }
  }
  return null;
};

export const getSunnyVenueCount = (sunPos: SunPosition, currentHour: string = '12:00') => {
  return stockholmVenues.filter(v => 
    sunPos.elevation > 0 && v.sunExposed && v.sunHours.includes(currentHour)
  ).length;
};

export const getSunnyVenues = (sunPos: SunPosition, currentHour: string = '12:00') => {
  return stockholmVenues.filter(v => 
    sunPos.elevation > 0 && v.sunExposed && v.sunHours.includes(currentHour)
  );
};
