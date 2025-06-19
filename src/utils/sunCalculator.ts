
export interface SunPosition {
  elevation: number; // angle above horizon in degrees
  azimuth: number;   // angle clockwise from north in degrees
  isVisible: boolean; // whether sun is above horizon
}

export function calculateSunPosition(date: Date, latitude: number, longitude: number): SunPosition {
  // Convert date to Julian day number
  const julianDay = dateToJulianDay(date);
  
  // Calculate number of days since J2000.0
  const n = julianDay - 2451545.0;
  
  // Mean longitude of the Sun (corrected formula)
  const L = (280.460 + 0.9856474 * n) % 360;
  
  // Mean anomaly of the Sun (corrected)
  const g = toRadians((357.528 + 0.9856003 * n) % 360);
  
  // Ecliptic longitude of the Sun (equation of center applied)
  const lambda = toRadians(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  
  // Obliquity of the ecliptic (more precise)
  const epsilon = toRadians(23.4393 - 3.563e-7 * n);
  
  // Right ascension and declination
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  
  // Greenwich Mean Sidereal Time
  const gmst = (280.460 + 360.9856235 * n) % 360;
  
  // Local Mean Sidereal Time
  const lmst = (gmst + longitude) % 360;
  
  // Hour angle (corrected calculation)
  const hourAngle = toRadians(lmst - toDegrees(alpha));
  
  // Convert to radians for calculation
  const latRad = toRadians(latitude);
  
  // Calculate elevation (altitude) using proper spherical trigonometry
  const sinElevation = Math.sin(latRad) * Math.sin(delta) + 
                      Math.cos(latRad) * Math.cos(delta) * Math.cos(hourAngle);
  const elevation = Math.asin(Math.max(-1, Math.min(1, sinElevation)));
  
  // Calculate azimuth
  const y = -Math.sin(hourAngle);
  const x = Math.tan(delta) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(hourAngle);
  let azimuth = Math.atan2(y, x);
  
  // Convert azimuth to 0-360 degrees from north
  azimuth = (toDegrees(azimuth) + 360) % 360;
  
  const elevationDegrees = toDegrees(elevation);
  
  return {
    elevation: elevationDegrees,
    azimuth: azimuth,
    isVisible: elevationDegrees > -0.833 // Account for atmospheric refraction
  };
}

function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  let jdn = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  const fraction = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  
  return jdn + fraction - 0.5;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

export function calculateShadowLength(objectHeight: number, sunElevation: number): number {
  if (sunElevation <= 0) return Infinity;
  return objectHeight / Math.tan(toRadians(sunElevation));
}

export function getSunIntensity(sunElevation: number): number {
  if (sunElevation <= 0) return 0;
  const airMass = 1 / Math.sin(toRadians(Math.max(sunElevation, 1)));
  return Math.max(0, Math.pow(0.7, airMass) * Math.sin(toRadians(sunElevation)));
}
