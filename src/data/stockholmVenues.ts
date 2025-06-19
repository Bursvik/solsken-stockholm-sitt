
export interface Venue {
  id: number;
  name: string;
  type: 'cafe' | 'restaurant' | 'bar' | 'park';
  lat: number;
  lng: number;
  address: string;
  rating: number;
  priceLevel: string;
  terrace: boolean;
  sunExposed: boolean;
  openingHours: string;
  description: string;
  sunHours: string[];
  image: string;
}

// Helper function to create venue objects
const createVenue = (
  id: number,
  name: string,
  type: Venue['type'],
  lat: number,
  lng: number,
  address: string,
  rating: number,
  priceLevel: string,
  terrace: boolean,
  sunExposed: boolean,
  openingHours: string,
  description: string,
  sunHours: string[],
  image: string = '/placeholder.svg'
): Venue => ({
  id,
  name,
  type,
  lat,
  lng,
  address,
  rating,
  priceLevel,
  terrace,
  sunExposed,
  openingHours,
  description,
  sunHours,
  image
});

// Venue data organized by type
const cafes: Venue[] = [
  createVenue(1, 'Café Nizza', 'cafe', 59.3293, 18.0686, 'Strandvägen 30, Stockholm', 4.5, '€€', true, true, '08:00-22:00', 'Charming waterfront café with excellent coffee and pastries.', ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']),
  createVenue(5, 'Blå Porten', 'cafe', 59.3201, 18.0912, 'Djurgårdsslätten 26, Stockholm', 4.2, '€€', true, false, '08:00-20:00', 'Cozy café with garden seating in Djurgården.', ['08:00', '09:00', '10:00']),
  createVenue(6, 'Rosendals Trädgård', 'cafe', 59.3231, 18.1156, 'Rosendalsterrassen 12, Stockholm', 4.7, '€€', true, true, '09:00-19:00', 'Garden café with organic food and beautiful greenhouse.', ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']),
  createVenue(10, 'Cafe Saturnus', 'cafe', 59.3422, 18.0743, 'Eriksbergsgatan 6, Stockholm', 4.4, '€€', true, true, '07:00-19:00', 'Famous for huge cinnamon buns and great coffee.', ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00']),
  createVenue(13, 'Vete-Katten', 'cafe', 59.3362, 18.0686, 'Kungsgatan 55, Stockholm', 4.3, '€€', false, false, '07:30-19:00', 'Historic pastry shop and café since 1928.', []),
  createVenue(14, 'Café String', 'cafe', 59.3156, 18.0756, 'Nytorgsgatan 38, Stockholm', 4.6, '€€', true, true, '08:00-18:00', 'Trendy Södermalm café with excellent brunch.', ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']),
  createVenue(28, 'Drop Coffee', 'cafe', 59.3156, 18.0756, 'Wollmar Yxkullsgatan 10, Stockholm', 4.7, '€€', true, true, '07:00-18:00', 'Specialty coffee roastery with sunny outdoor seating.', ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00']),
  createVenue(56, 'Moderna Museet Café', 'cafe', 59.3251, 18.0946, 'Exercisplan 4, Stockholm', 4.2, '€€', true, true, '10:00-18:00', 'Museum café with sculpture garden seating.', ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']),
];

const restaurants: Venue[] = [
  createVenue(2, 'Operakällaren', 'restaurant', 59.3278, 18.0717, 'Operahuset, Karl XII:s torg, Stockholm', 4.8, '€€€€', true, false, '17:00-01:00', 'Historic fine dining restaurant with elegant terrace.', ['16:00', '17:00', '18:00']),
  createVenue(3, 'Fotografiska Restaurant', 'restaurant', 59.3181, 18.0844, 'Stadsgårdshamnen 22, Stockholm', 4.3, '€€€', true, true, '11:00-23:00', 'Modern restaurant with stunning harbor views.', ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00']),
  createVenue(4, 'Hermitage Restaurant', 'restaurant', 59.3251, 18.0946, 'Djurgården, Stockholm', 4.6, '€€€', true, true, '10:00-22:00', 'Garden restaurant in beautiful Djurgården park.', ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']),
  createVenue(7, 'Sturehof', 'restaurant', 59.3342, 18.0743, 'Stureplan 2, Stockholm', 4.4, '€€€', true, true, '11:30-01:00', 'Classic brasserie with famous outdoor terrace.', ['11:00', '12:00', '13:00', '14:00', '15:00']),
  createVenue(16, 'Oaxen Krog', 'restaurant', 59.3251, 18.1156, 'Beckholmsvägen 26, Stockholm', 4.9, '€€€€', true, true, '18:00-24:00', 'Michelin-starred restaurant with terrace seating.', ['18:00', '19:00', '20:00']),
  createVenue(34, 'Mathias Dahlgren', 'restaurant', 59.3278, 18.0717, 'Grand Hôtel, Södra Blasieholmshamnen 6, Stockholm', 4.9, '€€€€', true, true, '18:00-23:00', 'Michelin-starred restaurant with waterfront terrace.', ['18:00', '19:00', '20:00']),
];

const bars: Venue[] = [
  createVenue(8, 'Tak Stockholm', 'bar', 59.3311, 18.0686, 'Brunkebergstorg 2-4, Stockholm', 4.4, '€€€', true, false, '17:00-01:00', 'Rooftop bar with stunning city views.', ['17:00', '18:00']),
  createVenue(9, 'Riche', 'bar', 59.3328, 18.0743, 'Birger Jarlsgatan 4, Stockholm', 4.2, '€€€', true, true, '11:00-03:00', 'Stylish bar and club with outdoor terrace.', ['11:00', '12:00', '13:00', '14:00', '15:00']),
  createVenue(12, 'Mosebacke Etablissement', 'bar', 59.3156, 18.0756, 'Mosebacke torg 3, Stockholm', 4.3, '€€', true, true, '17:00-01:00', 'Historic venue with large outdoor terrace.', ['17:00', '18:00', '19:00', '20:00']),
  createVenue(19, 'Himlen', 'bar', 59.3156, 18.0756, 'Götgatan 78, Stockholm', 4.5, '€€€', true, true, '17:00-01:00', 'Sky bar with panoramic views and rooftop terrace.', ['17:00', '18:00', '19:00']),
  createVenue(42, 'Cadier Bar', 'bar', 59.3278, 18.0717, 'Grand Hôtel, Södra Blasieholmshamnen 8, Stockholm', 4.6, '€€€€', true, true, '11:00-02:00', 'Luxury hotel bar with waterfront terrace.', ['16:00', '17:00', '18:00', '19:00']),
];

const parks: Venue[] = [
  createVenue(22, 'Djurgården', 'park', 59.3251, 18.0946, 'Djurgården, Stockholm', 4.8, 'Free', false, true, '24/7', 'Large island park with museums, gardens, and walking paths.', ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']),
  createVenue(23, 'Kungsträdgården', 'park', 59.3311, 18.0686, 'Kungsträdgården, Stockholm', 4.6, 'Free', false, true, '24/7', 'Central park famous for cherry blossoms and events.', ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']),
  createVenue(24, 'Humlegården', 'park', 59.3422, 18.0743, 'Humlegården, Stockholm', 4.4, 'Free', false, true, '24/7', 'Historic park with the National Library and plenty of green space.', ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']),
  createVenue(50, 'Berzelii Park', 'park', 59.3328, 18.0686, 'Berzelii Park, Stockholm', 4.3, 'Free', false, true, '24/7', 'Small central park perfect for lunch breaks.', ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00']),
  createVenue(54, 'Vitabergsparken', 'park', 59.3156, 18.0756, 'Vitabergsparken, Stockholm', 4.6, 'Free', false, true, '24/7', 'Hilltop park with excellent city views.', ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']),
];

// Combine all venues
export const stockholmVenues: Venue[] = [
  ...cafes,
  ...restaurants,
  ...bars,
  ...parks
];

// Utility functions
export const getSunnyVenues = (sunPos: { elevation: number }, currentHour: string) => {
  return stockholmVenues.filter(venue => 
    sunPos.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour)
  );
};

export const getVenuesByType = (type: string) => {
  if (type === 'all') return stockholmVenues;
  if (type === 'sunny') return [];
  return stockholmVenues.filter(venue => venue.type === type);
};

export const getVenueStats = () => {
  const stats = {
    total: stockholmVenues.length,
    cafes: cafes.length,
    restaurants: restaurants.length,
    bars: bars.length,
    parks: parks.length,
    withTerrace: stockholmVenues.filter(v => v.terrace).length,
    sunExposed: stockholmVenues.filter(v => v.sunExposed).length
  };
  return stats;
};
