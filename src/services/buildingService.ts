
interface OSMElement {
  type: string;
  id: number;
  tags?: {
    'building:levels'?: string;
    height?: string;
    'roof:height'?: string;
    building?: string;
  };
  geometry?: Array<{ lat: number; lon: number }>;
  bounds?: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
}

interface OSMResponse {
  elements: OSMElement[];
}

export interface BuildingData {
  id: number;
  height: number;
  center: { lat: number; lng: number };
  bounds: { north: number; south: number; east: number; west: number };
  geometry?: Array<{ lat: number; lng: number }>;
}

export class BuildingService {
  private static readonly OVERPASS_API = 'https://overpass-api.de/api/interpreter';
  private buildingCache = new Map<string, BuildingData[]>();

  async getBuildingsInArea(bounds: { north: number; south: number; east: number; west: number }): Promise<BuildingData[]> {
    const key = `${bounds.north.toFixed(4)},${bounds.south.toFixed(4)},${bounds.east.toFixed(4)},${bounds.west.toFixed(4)}`;
    
    if (this.buildingCache.has(key)) {
      return this.buildingCache.get(key)!;
    }

    const query = `
      [out:json][timeout:25];
      (
        way["building"]["building"!="no"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        relation["building"]["building"!="no"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      );
      out geom;
    `;

    try {
      const response = await fetch(BuildingService.OVERPASS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query
      });

      const data: OSMResponse = await response.json();
      const buildings = this.processBuildingData(data.elements);
      this.buildingCache.set(key, buildings);
      return buildings;
    } catch (error) {
      console.warn('Failed to fetch building data:', error);
      return [];
    }
  }

  private processBuildingData(elements: OSMElement[]): BuildingData[] {
    return elements
      .filter(element => element.geometry && element.geometry.length > 0)
      .map(element => {
        const height = this.calculateBuildingHeight(element.tags);
        const geometry = element.geometry!;
        
        // Calculate center point
        const lats = geometry.map(p => p.lat);
        const lngs = geometry.map(p => p.lon);
        const center = {
          lat: (Math.max(...lats) + Math.min(...lats)) / 2,
          lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
        };

        return {
          id: element.id,
          height,
          center,
          bounds: {
            north: Math.max(...lats),
            south: Math.min(...lats),
            east: Math.max(...lngs),
            west: Math.min(...lngs)
          },
          geometry: geometry.map(p => ({ lat: p.lat, lng: p.lon }))
        };
      });
  }

  private calculateBuildingHeight(tags?: OSMElement['tags']): number {
    if (!tags) return 15; // Default height

    // Try explicit height tag first
    if (tags.height) {
      const height = parseFloat(tags.height.replace(/[^\d.]/g, ''));
      if (!isNaN(height) && height > 0) return height;
    }

    // Try building levels
    if (tags['building:levels']) {
      const levels = parseInt(tags['building:levels']);
      if (!isNaN(levels) && levels > 0) {
        return levels * 3.5; // Assume 3.5m per floor
      }
    }

    // Estimate based on building type
    const buildingType = tags.building;
    switch (buildingType) {
      case 'skyscraper': return 100;
      case 'office': return 25;
      case 'apartments': return 20;
      case 'residential': return 15;
      case 'house': return 8;
      case 'garage': return 3;
      case 'shed': return 2.5;
      default: return 15;
    }
  }
}

export const buildingService = new BuildingService();
