
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

export const stockholmVenues: Venue[] = [
  // Cafes
  {
    id: 1,
    name: 'Café Nizza',
    type: 'cafe',
    lat: 59.3293,
    lng: 18.0686,
    address: 'Strandvägen 30, Stockholm',
    rating: 4.5,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '08:00-22:00',
    description: 'Charming waterfront café with excellent coffee and pastries.',
    sunHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Blå Porten',
    type: 'cafe',
    lat: 59.3201,
    lng: 18.0912,
    address: 'Djurgårdsslätten 26, Stockholm',
    rating: 4.2,
    priceLevel: '€€',
    terrace: true,
    sunExposed: false,
    openingHours: '08:00-20:00',
    description: 'Cozy café with garden seating in Djurgården.',
    sunHours: ['08:00', '09:00', '10:00'],
    image: '/placeholder.svg'
  },
  {
    id: 6,
    name: 'Rosendals Trädgård',
    type: 'cafe',
    lat: 59.3231,
    lng: 18.1156,
    address: 'Rosendalsterrassen 12, Stockholm',
    rating: 4.7,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '09:00-19:00',
    description: 'Garden café with organic food and beautiful greenhouse.',
    sunHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    image: '/placeholder.svg'
  },
  {
    id: 10,
    name: 'Cafe Saturnus',
    type: 'cafe',
    lat: 59.3422,
    lng: 18.0743,
    address: 'Eriksbergsgatan 6, Stockholm',
    rating: 4.4,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '07:00-19:00',
    description: 'Famous for huge cinnamon buns and great coffee.',
    sunHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    image: '/placeholder.svg'
  },
  {
    id: 13,
    name: 'Vete-Katten',
    type: 'cafe',
    lat: 59.3362,
    lng: 18.0686,
    address: 'Kungsgatan 55, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: false,
    sunExposed: false,
    openingHours: '07:30-19:00',
    description: 'Historic pastry shop and café since 1928.',
    sunHours: [],
    image: '/placeholder.svg'
  },
  {
    id: 14,
    name: 'Café String',
    type: 'cafe',
    lat: 59.3156,
    lng: 18.0756,
    address: 'Nytorgsgatan 38, Stockholm',
    rating: 4.6,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '08:00-18:00',
    description: 'Trendy Södermalm café with excellent brunch.',
    sunHours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    image: '/placeholder.svg'
  },
  {
    id: 15,
    name: 'Café Pascal',
    type: 'cafe',
    lat: 59.3451,
    lng: 18.0743,
    address: 'Norrtullsgatan 4, Stockholm',
    rating: 4.5,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '07:00-19:00',
    description: 'French-style café with outdoor seating.',
    sunHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
    image: '/placeholder.svg'
  },

  // Restaurants
  {
    id: 2,
    name: 'Operakällaren',
    type: 'restaurant',
    lat: 59.3278,
    lng: 18.0717,
    address: 'Operahuset, Karl XII:s torg, Stockholm',
    rating: 4.8,
    priceLevel: '€€€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Historic fine dining restaurant with elegant terrace.',
    sunHours: ['16:00', '17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Fotografiska Restaurant',
    type: 'restaurant',
    lat: 59.3181,
    lng: 18.0844,
    address: 'Stadsgårdshamnen 22, Stockholm',
    rating: 4.3,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '11:00-23:00',
    description: 'Modern restaurant with stunning harbor views.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Hermitage Restaurant',
    type: 'restaurant',
    lat: 59.3251,
    lng: 18.0946,
    address: 'Djurgården, Stockholm',
    rating: 4.6,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '10:00-22:00',
    description: 'Garden restaurant in beautiful Djurgården park.',
    sunHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    image: '/placeholder.svg'
  },
  {
    id: 7,
    name: 'Sturehof',
    type: 'restaurant',
    lat: 59.3342,
    lng: 18.0743,
    address: 'Stureplan 2, Stockholm',
    rating: 4.4,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '11:30-01:00',
    description: 'Classic brasserie with famous outdoor terrace.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 11,
    name: 'Gondolen',
    type: 'restaurant',
    lat: 59.3186,
    lng: 18.0711,
    address: 'Stadsgården 6, Stockholm',
    rating: 4.5,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Elevated restaurant with panoramic city views.',
    sunHours: ['17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 16,
    name: 'Oaxen Krog',
    type: 'restaurant',
    lat: 59.3251,
    lng: 18.1156,
    address: 'Beckholmsvägen 26, Stockholm',
    rating: 4.9,
    priceLevel: '€€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '18:00-24:00',
    description: 'Michelin-starred restaurant with terrace seating.',
    sunHours: ['18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 17,
    name: 'Pelikan',
    type: 'restaurant',
    lat: 59.3156,
    lng: 18.0756,
    address: 'Blekingegatan 40, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Traditional Swedish beer hall with outdoor seating.',
    sunHours: ['17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 18,
    name: 'Djuret',
    type: 'restaurant',
    lat: 59.3293,
    lng: 18.0717,
    address: 'Lilla Nygatan 5, Stockholm',
    rating: 4.6,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-24:00',
    description: 'Meat-focused restaurant with cozy outdoor area.',
    sunHours: ['17:00', '18:00', '19:00'],
    image: '/placeholder.svg'
  },

  // Bars
  {
    id: 8,
    name: 'Tak Stockholm',
    type: 'bar',
    lat: 59.3311,
    lng: 18.0686,
    address: 'Brunkebergstorg 2-4, Stockholm',
    rating: 4.4,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Rooftop bar with stunning city views.',
    sunHours: ['17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 9,
    name: 'Riche',
    type: 'bar',
    lat: 59.3328,
    lng: 18.0743,
    address: 'Birger Jarlsgatan 4, Stockholm',
    rating: 4.2,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '11:00-03:00',
    description: 'Stylish bar and club with outdoor terrace.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 12,
    name: 'Mosebacke Etablissement',
    type: 'bar',
    lat: 59.3156,
    lng: 18.0756,
    address: 'Mosebacke torg 3, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Historic venue with large outdoor terrace.',
    sunHours: ['17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 19,
    name: 'Himlen',
    type: 'bar',
    lat: 59.3156,
    lng: 18.0756,
    address: 'Götgatan 78, Stockholm',
    rating: 4.5,
    priceLevel: '€€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Sky bar with panoramic views and rooftop terrace.',
    sunHours: ['17:00', '18:00', '19:00'],
    image: '/placeholder.svg'
  },
  {
    id: 20,
    name: 'Tjoget',
    type: 'bar',
    lat: 59.3186,
    lng: 18.0844,
    address: 'Hornstulls Strand 4, Stockholm',
    rating: 4.4,
    priceLevel: '€€',
    terrace: true,
    sunExposed: true,
    openingHours: '17:00-01:00',
    description: 'Trendy cocktail bar with waterfront terrace.',
    sunHours: ['17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  },
  {
    id: 21,
    name: 'Pharmarium',
    type: 'bar',
    lat: 59.3156,
    lng: 18.0756,
    address: 'Östgötagatan 15, Stockholm',
    rating: 4.3,
    priceLevel: '€€',
    terrace: true,
    sunExposed: false,
    openingHours: '17:00-01:00',
    description: 'Speakeasy-style cocktail bar with small terrace.',
    sunHours: ['18:00', '19:00'],
    image: '/placeholder.svg'
  },

  // Parks
  {
    id: 22,
    name: 'Kungsträdgården',
    type: 'park',
    lat: 59.3328,
    lng: 18.0686,
    address: 'Kungsträdgården, Stockholm',
    rating: 4.6,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Central park perfect for picnics and outdoor activities.',
    sunHours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    image: '/placeholder.svg'
  },
  {
    id: 23,
    name: 'Djurgården Park',
    type: 'park',
    lat: 59.3251,
    lng: 18.0946,
    address: 'Djurgården, Stockholm',
    rating: 4.8,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Large royal park with museums, walks, and open spaces.',
    sunHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    image: '/placeholder.svg'
  },
  {
    id: 24,
    name: 'Humlegården',
    type: 'park',
    lat: 59.3422,
    lng: 18.0743,
    address: 'Humlegården, Stockholm',
    rating: 4.4,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Historic park in Östermalm with library and open lawns.',
    sunHours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    image: '/placeholder.svg'
  },
  {
    id: 25,
    name: 'Tantolunden',
    type: 'park',
    lat: 59.3186,
    lng: 18.0844,
    address: 'Tantolunden, Stockholm',
    rating: 4.5,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Waterfront park on Södermalm with beaches and BBQ areas.',
    sunHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    image: '/placeholder.svg'
  },
  {
    id: 26,
    name: 'Observatorielunden',
    type: 'park',
    lat: 59.3451,
    lng: 18.0743,
    address: 'Observatorielunden, Stockholm',
    rating: 4.3,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Small hilltop park with great city views.',
    sunHours: ['11:00', '12:00', '13:00', '14:00', '15:00'],
    image: '/placeholder.svg'
  },
  {
    id: 27,
    name: 'Rålambshovsparken',
    type: 'park',
    lat: 59.3362,
    lng: 18.0686,
    address: 'Rålambshovsparken, Stockholm',
    rating: 4.7,
    priceLevel: 'Free',
    terrace: false,
    sunExposed: true,
    openingHours: '24/7',
    description: 'Popular waterfront park perfect for sunset views.',
    sunHours: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    image: '/placeholder.svg'
  }
];

export const getSunnyVenues = (sunPos: { elevation: number }, currentHour: string) => {
  return stockholmVenues.filter(venue => 
    sunPos.elevation > 0 && venue.sunExposed && venue.sunHours.includes(currentHour)
  );
};

export const getVenuesByType = (type: string) => {
  if (type === 'all') return stockholmVenues;
  if (type === 'sunny') return []; // Will be filtered by current conditions
  return stockholmVenues.filter(venue => venue.type === type);
};
