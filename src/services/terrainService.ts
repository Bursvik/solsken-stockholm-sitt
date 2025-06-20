
interface ElevationPoint {
  latitude: number;
  longitude: number;
  elevation: number;
}

interface ElevationResponse {
  results: ElevationPoint[];
}

export class TerrainService {
  private static readonly API_URL = 'https://api.open-elevation.com/api/v1/lookup';
  private elevationCache = new Map<string, number>();

  async getElevation(lat: number, lng: number): Promise<number> {
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    
    if (this.elevationCache.has(key)) {
      return this.elevationCache.get(key)!;
    }

    try {
      const response = await fetch(`${TerrainService.API_URL}?locations=${lat},${lng}`);
      const data: ElevationResponse = await response.json();
      
      if (data.results && data.results.length > 0) {
        const elevation = data.results[0].elevation;
        this.elevationCache.set(key, elevation);
        return elevation;
      }
    } catch (error) {
      console.warn('Failed to fetch elevation data:', error);
    }
    
    // Default Stockholm elevation if API fails
    return 28; // Stockholm's average elevation
  }

  async getGridElevations(bounds: { north: number; south: number; east: number; west: number }, gridSize: number = 5): Promise<ElevationPoint[]> {
    const locations: string[] = [];
    const step = Math.max((bounds.north - bounds.south) / gridSize, 0.001);
    
    for (let lat = bounds.south; lat <= bounds.north; lat += step) {
      for (let lng = bounds.west; lng <= bounds.east; lng += step) {
        locations.push(`${lat.toFixed(4)},${lng.toFixed(4)}`);
      }
    }

    try {
      const response = await fetch(TerrainService.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: locations.join('|') })
      });
      
      const data: ElevationResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.warn('Failed to fetch grid elevation data:', error);
      return [];
    }
  }
}

export const terrainService = new TerrainService();
