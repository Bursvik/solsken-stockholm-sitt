
import { SunPosition } from '@/utils/sunCalculator';

// More detailed Stockholm venues with realistic coordinates
const stockholmVenues = [
  { id: 1, name: 'Café Nizza', type: 'cafe', lat: 59.3293, lng: 18.0686, terrace: true, sunExposed: true },
  { id: 2, name: 'Operakällaren', type: 'restaurant', lat: 59.3278, lng: 18.0717, terrace: true, sunExposed: false },
  { id: 3, name: 'Fotografiska Restaurant', type: 'restaurant', lat: 59.3181, lng: 18.0844, terrace: true, sunExposed: true },
  { id: 4, name: 'Hermitage Restaurant', type: 'restaurant', lat: 59.3251, lng: 18.0946, terrace: true, sunExposed: true },
  { id: 5, name: 'Blå Porten', type: 'cafe', lat: 59.3201, lng: 18.0912, terrace: true, sunExposed: false },
  { id: 6, name: 'Rosendals Trädgård', type: 'cafe', lat: 59.3231, lng: 18.1156, terrace: true, sunExposed: true },
  { id: 7, name: 'Sturehof', type: 'restaurant', lat: 59.3342, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 8, name: 'Tak Stockholm', type: 'bar', lat: 59.3311, lng: 18.0686, terrace: true, sunExposed: false },
  { id: 9, name: 'Riche', type: 'bar', lat: 59.3328, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 10, name: 'Cafe Saturnus', type: 'cafe', lat: 59.3422, lng: 18.0743, terrace: true, sunExposed: true },
  { id: 11, name: 'Gondolen', type: 'restaurant', lat: 59.3186, lng: 18.0711, terrace: true, sunExposed: true },
  { id: 12, name: 'Mosebacke Etablissement', type: 'bar', lat: 59.3156, lng: 18.0756, terrace: true, sunExposed: true },
];

export const drawVenues = (ctx: CanvasRenderingContext2D, width: number, height: number, sunPos: SunPosition) => {
  stockholmVenues.forEach(venue => {
    // Convert lat/lng to canvas coordinates with better scaling
    const x = ((venue.lng - 18.0686) * 4000) + width * 0.5;
    const y = height * 0.5 - ((venue.lat - 59.3293) * 4000);

    // Determine if venue is currently in sunlight
    const inSunlight = sunPos.elevation > 0 && venue.sunExposed;
    
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
    const icon = venue.type === 'cafe' ? '☕' : venue.type === 'bar' ? '🍺' : '🍽️';
    ctx.fillText(icon, x, y + 2);
  });
};

export const getVenueAtPosition = (mouseX: number, mouseY: number, width: number, height: number) => {
  for (const venue of stockholmVenues) {
    const x = ((venue.lng - 18.0686) * 4000) + width * 0.5;
    const y = height * 0.5 - ((venue.lat - 59.3293) * 4000);
    
    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
    if (distance <= 10) { // 10px hover radius
      return venue;
    }
  }
  return null;
};

export const getSunnyVenueCount = (sunPos: SunPosition) => {
  return stockholmVenues.filter(v => sunPos.elevation > 0 && v.sunExposed).length;
};

export const getSunnyVenues = (sunPos: SunPosition) => {
  return stockholmVenues.filter(v => sunPos.elevation > 0 && v.sunExposed);
};
