
export interface Venue {
  id: number;
  name: string;
  type: 'cafe' | 'restaurant' | 'bar' | 'park';
  lat: number;
  lng: number;
  rating: number;
  sunExposed: boolean;
  sunHours: string[];
  description: string;
  address?: string;
  openingHours?: string;
  priceLevel?: string;
}
