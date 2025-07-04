import { Venue } from '@/types/venue';

// Export the Venue type for other components to use
export type { Venue };

export const stockholmVenues: Venue[] = [
  {
    id: 1,
    name: "Gamla Stan Café",
    type: "cafe",
    lat: 59.3240,
    lng: 18.0700,
    rating: 4.5,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Cozy café in the old town",
    address: "Stora Nygatan 11, Gamla Stan",
    openingHours: "08:00-18:00",
    priceLevel: "$$"
  },
  {
    id: 2,
    name: "City Hall Restaurant",
    type: "restaurant",
    lat: 59.3275,
    lng: 18.0580,
    rating: 4.7,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "Fine dining with a view",
    address: "Hantverkargatan 1, Kungsholmen",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 3,
    name: "Södermalm Park",
    type: "park",
    lat: 59.3120,
    lng: 18.0700,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Popular park with sunny spots",
    address: "Södermalm, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 4,
    name: "Norrmalm Bar",
    type: "bar",
    lat: 59.3360,
    lng: 18.0650,
    rating: 4.1,
    sunExposed: false,
    sunHours: [],
    description: "Trendy bar with indoor seating",
    address: "Norrmalmstorg, Stockholm",
    openingHours: "17:00-01:00",
    priceLevel: "$$"
  },
  {
    id: 5,
    name: "Djurgården Café",
    type: "cafe",
    lat: 59.3265,
    lng: 18.1030,
    rating: 4.6,
    sunExposed: true,
    sunHours: ["09:00", "10:00", "11:00", "12:00", "13:00"],
    description: "Café near the park",
    address: "Djurgården, Stockholm",
    openingHours: "09:00-19:00",
    priceLevel: "$"
  },
  {
    id: 6,
    name: "Östermalm Market",
    type: "restaurant",
    lat: 59.3360,
    lng: 18.0780,
    rating: 4.4,
    sunExposed: false,
    sunHours: [],
    description: "Indoor market with food stalls",
    address: "Östermalmstorg, Stockholm",
    openingHours: "10:00-20:00",
    priceLevel: "$$"
  },
  {
    id: 7,
    name: "Kungsholmen Park",
    type: "park",
    lat: 59.3320,
    lng: 18.0400,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Quiet park with sunny benches",
    address: "Kungsholmen, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 8,
    name: "Vasastan Bistro",
    type: "restaurant",
    lat: 59.3390,
    lng: 18.0550,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00"],
    description: "Bistro with outdoor seating",
    address: "Vasastan, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$"
  },
  {
    id: 9,
    name: "Hornstull Bar",
    type: "bar",
    lat: 59.3090,
    lng: 18.0400,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["16:00", "17:00", "18:00"],
    description: "Bar with terrace",
    address: "Hornstull, Stockholm",
    openingHours: "17:00-01:00",
    priceLevel: "$$"
  },
  {
    id: 10,
    name: "Sergels Torg Square",
    type: "park",
    lat: 59.3322,
    lng: 18.0635,
    rating: 3.6,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "Famous central square",
    address: "Sergels torg, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 101,
    name: "Sturekompaniet",
    type: "bar",
    lat: 59.3350,
    lng: 18.0750,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Upscale nightclub and bar",
    address: "Stureplan, Stockholm",
    openingHours: "22:00-03:00",
    priceLevel: "$$$$"
  },
  {
    id: 102,
    name: "Stureplan Square",
    type: "park",
    lat: 59.3345,
    lng: 18.0745,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Famous Stockholm square",
    address: "Stureplan, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 103,
    name: "Brasserie Le Rouge",
    type: "restaurant",
    lat: 59.3340,
    lng: 18.0760,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "French brasserie",
    address: "Klarabergsviadukten 90, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$"
  },
  {
    id: 104,
    name: "East",
    type: "restaurant",
    lat: 59.3355,
    lng: 18.0755,
    rating: 4.4,
    sunExposed: false,
    sunHours: [],
    description: "Asian fusion cuisine",
    address: "Sturegatan 15, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 105,
    name: "Spy Bar",
    type: "bar",
    lat: 59.3348,
    lng: 18.0752,
    rating: 4.1,
    sunExposed: false,
    sunHours: [],
    description: "Exclusive cocktail bar",
    address: "Kommendörsgatan 21, Stockholm",
    openingHours: "22:00-03:00",
    priceLevel: "$$$$"
  },
  {
    id: 106,
    name: "NK Department Store Café",
    type: "cafe",
    lat: 59.3320,
    lng: 18.0640,
    rating: 3.8,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00"],
    description: "Department store café",
    address: "Hamngatan 18-20, Stockholm",
    openingHours: "10:00-20:00",
    priceLevel: "$"
  },
  {
    id: 107,
    name: "Haymarket by Scandic",
    type: "restaurant",
    lat: 59.3315,
    lng: 18.0620,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["14:00", "15:00", "16:00"],
    description: "Hotel restaurant with terrace",
    address: "Drottninggatan 71A, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$"
  },
  {
    id: 108,
    name: "Östermalms Saluhall",
    type: "restaurant",
    lat: 59.3365,
    lng: 18.0780,
    rating: 4.5,
    sunExposed: false,
    sunHours: [],
    description: "Historic food market",
    address: "Östermalmstorg 1, Stockholm",
    openingHours: "10:00-20:00",
    priceLevel: "$$"
  },
  {
    id: 109,
    name: "Bibliotekstan",
    type: "park",
    lat: 59.3330,
    lng: 18.0700,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["13:00", "14:00", "15:00", "16:00"],
    description: "Shopping district square",
    address: "Biblioteksgatan, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 110,
    name: "Riche",
    type: "restaurant",
    lat: 59.3325,
    lng: 18.0680,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00"],
    description: "Classic Stockholm brasserie",
    address: "Kålsängsgränd 1, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$"
  },
  {
    id: 111,
    name: "Dramaten Café",
    type: "cafe",
    lat: 59.3342,
    lng: 18.0735,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00"],
    description: "Royal Dramatic Theatre café",
    address: "Nybroplan, Stockholm",
    openingHours: "10:00-20:00",
    priceLevel: "$"
  },
  {
    id: 112,
    name: "Humlegården Park",
    type: "park",
    lat: 59.3380,
    lng: 18.0720,
    rating: 4.6,
    sunExposed: true,
    sunHours: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    description: "Beautiful central park",
    address: "Humlegården, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 113,
    name: "Taverna Brillo",
    type: "restaurant",
    lat: 59.3338,
    lng: 18.0742,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "Italian restaurant",
    address: "Strandvägen 7A, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$"
  },
  {
    id: 114,
    name: "Café Saturnus",
    type: "cafe",
    lat: 59.3375,
    lng: 18.0685,
    rating: 4.4,
    sunExposed: true,
    sunHours: ["09:00", "10:00", "11:00", "12:00"],
    description: "Famous for huge cinnamon buns",
    address: "Saturnusgatan 1, Stockholm",
    openingHours: "08:00-18:00",
    priceLevel: "$"
  },
  {
    id: 115,
    name: "Vasaparken",
    type: "park",
    lat: 59.3400,
    lng: 18.0550,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Popular neighborhood park",
    address: "Vasaparken, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 116,
    name: "Stockholms Stadshus Restaurant",
    type: "restaurant",
    lat: 59.3275,
    lng: 18.0540,
    rating: 4.4,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "City Hall restaurant",
    address: "Hantverkargatan 1, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 117,
    name: "Kungsholmen Beach",
    type: "park",
    lat: 59.3260,
    lng: 18.0450,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    description: "Urban beach area",
    address: "Kungsholmen, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 118,
    name: "Restaurang Volt",
    type: "restaurant",
    lat: 59.3200,
    lng: 18.0520,
    rating: 4.5,
    sunExposed: false,
    sunHours: [],
    description: "Modern Nordic cuisine",
    address: "Norrlandsgatan 24, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 119,
    name: "Café String",
    type: "cafe",
    lat: 59.3180,
    lng: 18.0580,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00"],
    description: "Cozy neighborhood café",
    address: "Folkungagatan 47, Stockholm",
    openingHours: "08:00-18:00",
    priceLevel: "$"
  },
  {
    id: 120,
    name: "Mariatorget Square",
    type: "park",
    lat: 59.3150,
    lng: 18.0650,
    rating: 4.4,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Södermalm central square",
    address: "Mariatorget, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 121,
    name: "Hermans Vegetarian Restaurant",
    type: "restaurant",
    lat: 59.3125,
    lng: 18.0695,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Vegetarian with great views",
    address: "Fjällgatan 23B, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 122,
    name: "Monteliusvägen Viewpoint",
    type: "park",
    lat: 59.3175,
    lng: 18.0520,
    rating: 4.7,
    sunExposed: true,
    sunHours: ["14:00", "15:00", "16:00", "17:00", "18:00"],
    description: "Famous viewpoint walkway",
    address: "Monteliusvägen, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 123,
    name: "Fotografiska Restaurant",
    type: "restaurant",
    lat: 59.3165,
    lng: 18.0845,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["13:00", "14:00", "15:00", "16:00"],
    description: "Museum restaurant",
    address: "Stadsgårdshamnen 22, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 124,
    name: "Urban Deli Sveavägen",
    type: "cafe",
    lat: 59.3365,
    lng: 18.0595,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00"],
    description: "Deli and café",
    address: "Sveavägen 44, Stockholm",
    openingHours: "08:00-20:00",
    priceLevel: "$"
  },
  {
    id: 125,
    name: "Observatorielunden",
    type: "park",
    lat: 59.3425,
    lng: 18.0545,
    rating: 4.1,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Observatory hill park",
    address: "Observatoriegatan 1, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 126,
    name: "Café Rival",
    type: "cafe",
    lat: 59.3145,
    lng: 18.0645,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00"],
    description: "Hotel café in Södermalm",
    address: "Hälsingegatan 40, Stockholm",
    openingHours: "08:00-18:00",
    priceLevel: "$"
  },
  {
    id: 127,
    name: "Gondolen",
    type: "restaurant",
    lat: 59.3190,
    lng: 18.0715,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["16:00", "17:00", "18:00"],
    description: "Restaurant with panoramic views",
    address: "Slussen, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$"
  },
  {
    id: 128,
    name: "Tantolunden Park",
    type: "park",
    lat: 59.3080,
    lng: 18.0520,
    rating: 4.5,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    description: "Large park with activities",
    address: "Tantolunden, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 129,
    name: "Hornstulls Strand",
    type: "park",
    lat: 59.3095,
    lng: 18.0385,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["13:00", "14:00", "15:00", "16:00", "17:00"],
    description: "Waterfront promenade",
    address: "Hornstull, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 130,
    name: "Rosendals Trädgård",
    type: "cafe",
    lat: 59.3240,
    lng: 18.1150,
    rating: 4.6,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Garden café on Djurgården",
    address: "Rosendalsvägen 38, Stockholm",
    openingHours: "09:00-19:00",
    priceLevel: "$"
  },
  {
    id: 131,
    name: "Skansen Solliden",
    type: "restaurant",
    lat: 59.3255,
    lng: 18.1045,
    rating: 4.1,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "Open-air museum restaurant",
    address: "Djurgårdsslätten 49, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 132,
    name: "Waldemarsudde Café",
    type: "cafe",
    lat: 59.3215,
    lng: 18.1180,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00"],
    description: "Art museum café",
    address: "Waldemarsudde, Stockholm",
    openingHours: "10:00-18:00",
    priceLevel: "$"
  },
  {
    id: 133,
    name: "Blå Porten",
    type: "restaurant",
    lat: 59.3245,
    lng: 18.1095,
    rating: 4.3,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Traditional Swedish restaurant",
    address: "Djurgården, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$"
  },
  {
    id: 134,
    name: "Villa Godthem",
    type: "restaurant",
    lat: 59.3250,
    lng: 18.1120,
    rating: 4.4,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "Fine dining on Djurgården",
    address: "Djurgården, Stockholm",
    openingHours: "11:00-22:00",
    priceLevel: "$$$$"
  },
  {
    id: 135,
    name: "Gröna Lund Café",
    type: "cafe",
    lat: 59.3235,
    lng: 18.0975,
    rating: 3.8,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Amusement park café",
    address: "Djurgården, Stockholm",
    openingHours: "10:00-19:00",
    priceLevel: "$"
  },
  {
    id: 136,
    name: "Djurgården Beach",
    type: "park",
    lat: 59.3280,
    lng: 18.1200,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Island beach area",
    address: "Djurgården, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "Free"
  },
  {
    id: 137,
    name: "Oaxen Krog",
    type: "restaurant",
    lat: 59.3225,
    lng: 18.1165,
    rating: 4.8,
    sunExposed: false,
    sunHours: [],
    description: "Michelin-starred restaurant",
    address: "Oaxen, Stockholm",
    openingHours: "12:00-22:00",
    priceLevel: "$$$$"
  },
  {
    id: 138,
    name: "Spritmuseum Bar",
    type: "bar",
    lat: 59.3220,
    lng: 18.0950,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["16:00", "17:00", "18:00"],
    description: "Museum bar with terrace",
    address: "Djurgården, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$"
  },
  {
    id: 139,
    name: "Café Blasieholmen",
    type: "cafe",
    lat: 59.3285,
    lng: 18.0825,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00"],
    description: "Waterfront café",
    address: "Blasieholmsgatan 4, Stockholm",
    openingHours: "08:00-18:00",
    priceLevel: "$"
  },
  {
    id: 140,
    name: "Grand Hôtel Terrace",
    type: "restaurant",
    lat: 59.3295,
    lng: 18.0795,
    rating: 4.5,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Luxury hotel terrace",
    address: "Södra Blasieholmshamnen 8, Stockholm",
    openingHours: "11:00-23:00",
    priceLevel: "$$$$"
  },
  {
    id: 141,
    name: "Archipelago Tours Café",
    type: "cafe",
    lat: 59.3305,
    lng: 18.0855,
    rating: 3.9,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00"],
    description: "Harbor café",
    address: "Strandvägen, Stockholm",
    openingHours: "09:00-19:00",
    priceLevel: "$"
  },
  {
    id: 142,
    name: "Nybroplan Square",
    type: "park",
    lat: 59.3315,
    lng: 18.0795,
    rating: 4.0,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00", "16:00"],
    description: "Central square and transport hub",
    address: "Nybroplan, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 143,
    name: "Berzelii Park",
    type: "park",
    lat: 59.3325,
    lng: 18.0725,
    rating: 4.2,
    sunExposed: true,
    sunHours: ["11:00", "12:00", "13:00", "14:00", "15:00"],
    description: "Small central park",
    address: "Berzelii Park, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 144,
    name: "Berns Salonger",
    type: "restaurant",
    lat: 59.3320,
    lng: 18.0715,
    rating: 4.3,
    sunExposed: false,
    sunHours: [],
    description: "Historic venue and restaurant",
    address: "Norrmalmstorg 2, Stockholm",
    openingHours: "17:00-01:00",
    priceLevel: "$$$$"
  },
  {
    id: 145,
    name: "Tegelbacken Square",
    type: "park",
    lat: 59.3265,
    lng: 18.0625,
    rating: 3.8,
    sunExposed: true,
    sunHours: ["13:00", "14:00", "15:00", "16:00"],
    description: "Transport hub square",
    address: "Tegelbacken, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 146,
    name: "T-Centralen Food Court",
    type: "restaurant",
    lat: 59.3310,
    lng: 18.0595,
    rating: 3.5,
    sunExposed: false,
    sunHours: [],
    description: "Central station food court",
    address: "T-Centralen, Stockholm",
    openingHours: "06:00-22:00",
    priceLevel: "$"
  },
  {
    id: 147,
    name: "Sergels Torg",
    type: "park",
    lat: 59.3322,
    lng: 18.0635,
    rating: 3.6,
    sunExposed: true,
    sunHours: ["12:00", "13:00", "14:00", "15:00"],
    description: "Famous central square",
    address: "Sergels torg, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 148,
    name: "Kulturhuset Café",
    type: "cafe",
    lat: 59.3318,
    lng: 18.0632,
    rating: 4.0,
    sunExposed: false,
    sunHours: [],
    description: "Cultural center café",
    address: "Torsgatan 19, Stockholm",
    openingHours: "10:00-20:00",
    priceLevel: "$"
  },
  {
    id: 149,
    name: "Hötorget Square",
    type: "park",
    lat: 59.3355,
    lng: 18.0625,
    rating: 4.1,
    sunExposed: true,
    sunHours: ["10:00", "11:00", "12:00", "13:00", "14:00"],
    description: "Market square",
    address: "Hötorget, Stockholm",
    openingHours: "Open 24 hours",
    priceLevel: "Free"
  },
  {
    id: 150,
    name: "Café Opera",
    type: "bar",
    lat: 59.3298,
    lng: 18.0715,
    rating: 4.0,
    sunExposed: false,
    sunHours: [],
    description: "Nightclub near Royal Opera",
    address: "Karl XII:s torg, Stockholm",
    openingHours: "22:00-03:00",
    priceLevel: "$$$$"
  }
];

export function getVenueStats() {
  const total = stockholmVenues.length;
  const cafes = stockholmVenues.filter(v => v.type === 'cafe').length;
  const restaurants = stockholmVenues.filter(v => v.type === 'restaurant').length;
  const bars = stockholmVenues.filter(v => v.type === 'bar').length;
  const parks = stockholmVenues.filter(v => v.type === 'park').length;

  return { total, cafes, restaurants, bars, parks };
}

export function getSunnyVenues(sunPosition: { elevation: number }, currentHour: string) {
  if (sunPosition.elevation <= 0) return [];

  return stockholmVenues.filter(venue => 
    venue.sunExposed && venue.sunHours.includes(currentHour)
  );
}
