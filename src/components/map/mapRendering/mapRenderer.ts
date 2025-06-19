
export const drawDetailedMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Clear canvas with Baltic Sea color
  ctx.fillStyle = '#1e3a8a'; // Deep Baltic Sea blue
  ctx.fillRect(0, 0, width, height);

  // Stockholm's complex water system - more realistic shapes
  const waterBodies = [
    // Lake Mälaren (western waters)
    { 
      type: 'lake',
      points: [
        { x: width * 0.05, y: height * 0.35 },
        { x: width * 0.35, y: height * 0.30 },
        { x: width * 0.40, y: height * 0.45 },
        { x: width * 0.35, y: height * 0.55 },
        { x: width * 0.10, y: height * 0.60 },
        { x: width * 0.05, y: height * 0.50 }
      ]
    },
    // Riddarfjärden (central bay)
    {
      type: 'bay',
      points: [
        { x: width * 0.35, y: height * 0.45 },
        { x: width * 0.48, y: height * 0.43 },
        { x: width * 0.50, y: height * 0.50 },
        { x: width * 0.45, y: height * 0.55 },
        { x: width * 0.35, y: height * 0.52 }
      ]
    },
    // Strömmen (connecting waterway)
    {
      type: 'channel',
      points: [
        { x: width * 0.48, y: height * 0.47 },
        { x: width * 0.58, y: height * 0.45 },
        { x: width * 0.60, y: height * 0.50 },
        { x: width * 0.50, y: height * 0.52 }
      ]
    },
    // Saltsjön (eastern archipelago waters)
    {
      type: 'sea',
      points: [
        { x: width * 0.58, y: height * 0.40 },
        { x: width * 0.95, y: height * 0.30 },
        { x: width * 1.0, y: height * 0.70 },
        { x: width * 0.60, y: height * 0.65 }
      ]
    },
    // Årstaviken (southern waters)
    {
      type: 'bay',
      points: [
        { x: width * 0.35, y: height * 0.65 },
        { x: width * 0.65, y: height * 0.68 },
        { x: width * 0.68, y: height * 0.78 },
        { x: width * 0.30, y: height * 0.80 }
      ]
    }
  ];

  // Draw water bodies with realistic colors
  waterBodies.forEach(water => {
    let color;
    switch(water.type) {
      case 'sea': color = '#1e3a8a'; break;
      case 'lake': color = '#1e40af'; break;
      case 'bay': color = '#2563eb'; break;
      case 'channel': color = '#3b82f6'; break;
      default: color = '#2563eb';
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(water.points[0].x, water.points[0].y);
    water.points.forEach((point, index) => {
      if (index > 0) ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
  });

  // Stockholm's main islands and districts with accurate geography
  const stockholmIslands = [
    // Gamla Stan (Old Town) - the heart of Stockholm
    {
      name: 'Gamla Stan',
      color: '#f59e0b',
      points: [
        { x: width * 0.475, y: height * 0.485 },
        { x: width * 0.520, y: height * 0.480 },
        { x: width * 0.525, y: height * 0.510 },
        { x: width * 0.515, y: height * 0.530 },
        { x: width * 0.470, y: height * 0.525 },
        { x: width * 0.465, y: height * 0.500 }
      ]
    },
    
    // Riddarholmen - small island next to Gamla Stan
    {
      name: 'Riddarholmen',
      color: '#dc2626',
      points: [
        { x: width * 0.455, y: height * 0.505 },
        { x: width * 0.475, y: height * 0.500 },
        { x: width * 0.480, y: height * 0.520 },
        { x: width * 0.460, y: height * 0.525 }
      ]
    },

    // Södermalm - large southern island
    {
      name: 'Södermalm',
      color: '#e5e7eb',
      points: [
        { x: width * 0.30, y: height * 0.55 },
        { x: width * 0.68, y: height * 0.52 },
        { x: width * 0.70, y: height * 0.58 },
        { x: width * 0.68, y: height * 0.68 },
        { x: width * 0.32, y: height * 0.72 },
        { x: width * 0.25, y: height * 0.65 },
        { x: width * 0.28, y: height * 0.58 }
      ]
    },
    
    // Norrmalm - central business district
    {
      name: 'Norrmalm',
      color: '#6b7280',
      points: [
        { x: width * 0.38, y: height * 0.25 },
        { x: width * 0.62, y: height * 0.22 },
        { x: width * 0.65, y: height * 0.30 },
        { x: width * 0.63, y: height * 0.42 },
        { x: width * 0.48, y: height * 0.47 },
        { x: width * 0.35, y: height * 0.40 },
        { x: width * 0.35, y: height * 0.30 }
      ]
    },
    
    // Östermalm - upscale eastern district
    {
      name: 'Östermalm',
      color: '#f3f4f6',
      points: [
        { x: width * 0.60, y: height * 0.18 },
        { x: width * 0.80, y: height * 0.15 },
        { x: width * 0.85, y: height * 0.25 },
        { x: width * 0.82, y: height * 0.35 },
        { x: width * 0.65, y: height * 0.38 },
        { x: width * 0.58, y: height * 0.30 },
        { x: width * 0.58, y: height * 0.22 }
      ]
    },
    
    // Djurgården - royal park island
    {
      name: 'Djurgården',
      color: '#22c55e',
      points: [
        { x: width * 0.60, y: height * 0.40 },
        { x: width * 0.88, y: height * 0.35 },
        { x: width * 0.92, y: height * 0.45 },
        { x: width * 0.90, y: height * 0.55 },
        { x: width * 0.70, y: height * 0.58 },
        { x: width * 0.58, y: height * 0.50 }
      ]
    },
    
    // Vasastan - northern residential area
    {
      name: 'Vasastan',
      color: '#f9fafb',
      points: [
        { x: width * 0.30, y: height * 0.12 },
        { x: width * 0.58, y: height * 0.10 },
        { x: width * 0.60, y: height * 0.18 },
        { x: width * 0.58, y: height * 0.25 },
        { x: width * 0.35, y: height * 0.28 },
        { x: width * 0.28, y: height * 0.20 }
      ]
    },
    
    // Kungsholmen - western island
    {
      name: 'Kungsholmen',
      color: '#f3f4f6',
      points: [
        { x: width * 0.15, y: height * 0.30 },
        { x: width * 0.35, y: height * 0.27 },
        { x: width * 0.38, y: height * 0.35 },
        { x: width * 0.35, y: height * 0.45 },
        { x: width * 0.18, y: height * 0.48 },
        { x: width * 0.12, y: height * 0.40 }
      ]
    },

    // Skeppsholmen - museum island
    {
      name: 'Skeppsholmen',
      color: '#fbbf24',
      points: [
        { x: width * 0.540, y: height * 0.460 },
        { x: width * 0.575, y: height * 0.455 },
        { x: width * 0.580, y: height * 0.480 },
        { x: width * 0.545, y: height * 0.485 }
      ]
    },

    // Kastellholmen - tiny fortress island
    {
      name: 'Kastellholmen',
      color: '#dc2626',
      points: [
        { x: width * 0.580, y: height * 0.470 },
        { x: width * 0.590, y: height * 0.468 },
        { x: width * 0.592, y: height * 0.478 },
        { x: width * 0.582, y: height * 0.480 }
      ]
    }
  ];

  // Draw all islands and districts
  stockholmIslands.forEach(area => {
    ctx.fillStyle = area.color;
    ctx.beginPath();
    ctx.moveTo(area.points[0].x, area.points[0].y);
    
    area.points.forEach((point, index) => {
      if (index > 0) {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.closePath();
    ctx.fill();
    
    // Add realistic borders with varying thickness
    ctx.strokeStyle = area.name === 'Djurgården' ? '#16a34a' : '#9ca3af';
    ctx.lineWidth = area.name === 'Gamla Stan' ? 2 : 1;
    ctx.stroke();
  });

  // Historic Stockholm bridges - accurate positions
  ctx.fillStyle = '#374151';
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 1;
  
  const bridges = [
    // Centralbron (Central Bridge)
    { x: width * 0.44, y: height * 0.425, w: width * 0.08, h: 4, angle: 0 },
    // Västerbron (Western Bridge) 
    { x: width * 0.25, y: height * 0.42, w: width * 0.12, h: 5, angle: -15 },
    // Djurgårdsbron (Djurgården Bridge)
    { x: width * 0.58, y: height * 0.41, w: width * 0.08, h: 3, angle: 10 },
    // Strömbron (Stream Bridge)
    { x: width * 0.51, y: height * 0.47, w: width * 0.06, h: 3, angle: 0 },
    // Slussenbron (Sluice Bridge)
    { x: width * 0.47, y: height * 0.515, w: width * 0.06, h: 4, angle: 5 },
    // Riddarholmsbron
    { x: width * 0.465, y: height * 0.495, w: width * 0.025, h: 3, angle: 0 }
  ];

  bridges.forEach(bridge => {
    ctx.save();
    ctx.translate(bridge.x + bridge.w/2, bridge.y + bridge.h/2);
    ctx.rotate(bridge.angle * Math.PI / 180);
    ctx.fillRect(-bridge.w/2, -bridge.h/2, bridge.w, bridge.h);
    ctx.strokeRect(-bridge.w/2, -bridge.h/2, bridge.w, bridge.h);
    ctx.restore();
  });

  // Iconic Stockholm landmarks with realistic positioning
  const landmarks = [
    // Stockholm City Hall (Stadshuset) - iconic red brick building
    { x: width * 0.27, y: height * 0.37, w: 25, h: 30, type: 'cityhall' },
    // Royal Palace (Kungliga Slottet)
    { x: width * 0.495, y: height * 0.485, w: 20, h: 25, type: 'palace' },
    // Riddarholmen Church - medieval church with spire
    { x: width * 0.465, y: height * 0.510, w: 8, h: 25, type: 'church' },
    // Stockholm Cathedral (Storkyrkan)
    { x: width * 0.485, y: height * 0.495, w: 10, h: 20, type: 'cathedral' },
    // Modern office towers in Norrmalm
    { x: width * 0.45, y: height * 0.30, w: 12, h: 55, type: 'office' },
    { x: width * 0.48, y: height * 0.28, w: 14, h: 65, type: 'office' },
    { x: width * 0.52, y: height * 0.32, w: 10, h: 45, type: 'office' },
    // Globen Arena (Avicii Arena) - distinctive spherical building
    { x: width * 0.50, y: height * 0.82, w: 18, h: 18, type: 'arena' },
    // Vasa Museum on Djurgården
    { x: width * 0.70, y: height * 0.50, w: 15, h: 12, type: 'museum' },
    // ABBA Museum
    { x: width * 0.75, y: height * 0.52, w: 12, h: 10, type: 'museum' }
  ];

  landmarks.forEach(building => {
    ctx.save();
    
    switch (building.type) {
      case 'cityhall':
        // Stockholm City Hall - red brick with distinctive tower
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        // Main tower
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(building.x + building.w - 8, building.y - 25, 6, 25);
        // Three crowns on top
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(building.x + building.w - 7, building.y - 28, 4, 3);
        break;
        
      case 'palace':
        // Royal Palace - baroque architecture
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        // Palace details
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(building.x + 2, building.y + 2, building.w - 4, building.h - 4);
        break;
        
      case 'church':
        // Riddarholmen Church - Gothic brick church
        ctx.fillStyle = '#059669';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        // Distinctive spire
        ctx.beginPath();
        ctx.moveTo(building.x + building.w/2, building.y - 15);
        ctx.lineTo(building.x + building.w/2 - 4, building.y);
        ctx.lineTo(building.x + building.w/2 + 4, building.y);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'cathedral':
        // Stockholm Cathedral
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        break;
        
      case 'office':
        // Modern skyscrapers
        ctx.fillStyle = '#374151';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        // Windows
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 4; i < building.h - 4; i += 6) {
          for (let j = 2; j < building.w - 2; j += 4) {
            ctx.fillRect(building.x + j, building.y + i, 2, 3);
          }
        }
        break;
        
      case 'arena':
        // Globen - spherical arena
        ctx.fillStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.arc(building.x + building.w/2, building.y + building.h/2, building.w/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
        
      case 'museum':
        // Museums on Djurgården
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        break;
    }
    
    ctx.restore();
  });

  // Major Stockholm streets and thoroughfares
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  
  const streets = [
    // Strandvägen - famous waterfront boulevard
    { start: { x: width * 0.58, y: height * 0.30 }, end: { x: width * 0.78, y: height * 0.28 } },
    // Kungsgatan - major shopping street
    { start: { x: width * 0.35, y: height * 0.33 }, end: { x: width * 0.58, y: height * 0.31 } },
    // Götgatan - main street of Södermalm
    { start: { x: width * 0.45, y: height * 0.56 }, end: { x: width * 0.60, y: height * 0.54 } },
    // Sveavägen - runs north-south through the city
    { start: { x: width * 0.48, y: height * 0.18 }, end: { x: width * 0.50, y: height * 0.42 } },
    // Hornsgatan - runs east-west through Södermalm
    { start: { x: width * 0.30, y: height * 0.58 }, end: { x: width * 0.65, y: height * 0.56 } },
    // Drottninggatan - pedestrian shopping street
    { start: { x: width * 0.46, y: height * 0.35 }, end: { x: width * 0.48, y: height * 0.47 } }
  ];

  streets.forEach(street => {
    ctx.beginPath();
    ctx.moveTo(street.start.x, street.start.y);
    ctx.lineTo(street.end.x, street.end.y);
    ctx.stroke();
  });

  // Parks and green spaces - Stockholm is known for its greenery
  ctx.fillStyle = '#16a34a';
  const parks = [
    // Kungsträdgården - central park
    { x: width * 0.52, y: height * 0.38, w: width * 0.04, h: height * 0.06 },
    // Humlegården - park in Östermalm
    { x: width * 0.62, y: height * 0.26, w: width * 0.06, h: height * 0.05 },
    // Tantolunden - park on Södermalm
    { x: width * 0.32, y: height * 0.68, w: width * 0.08, h: height * 0.04 },
    // Observatorielunden - small hill park
    { x: width * 0.42, y: height * 0.22, w: width * 0.04, h: height * 0.03 },
    // Vitabergsparken - Södermalm park
    { x: width * 0.55, y: height * 0.60, w: width * 0.05, h: height * 0.03 },
    // Rålambshovsparken - Kungsholmen waterfront park
    { x: width * 0.20, y: height * 0.35, w: width * 0.06, h: width * 0.04 }
  ];

  parks.forEach(park => {
    ctx.beginPath();
    ctx.roundRect(park.x, park.y, park.w, park.h, 6);
    ctx.fill();
    
    // Add some texture to parks
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(park.x + park.w * 0.1, park.y + park.h * 0.1, park.w * 0.8, park.h * 0.8, 4);
    ctx.fill();
    ctx.fillStyle = '#16a34a'; // Reset color
  });

  // Stockholm archipelago islands in the distance
  ctx.fillStyle = '#9ca3af';
  const archipelagoIslands = [
    { x: width * 0.85, y: height * 0.25, r: 8 },
    { x: width * 0.88, y: height * 0.30, r: 6 },
    { x: width * 0.90, y: height * 0.35, r: 10 },
    { x: width * 0.85, y: height * 0.60, r: 7 },
    { x: width * 0.92, y: height * 0.65, r: 5 }
  ];

  archipelagoIslands.forEach(island => {
    ctx.beginPath();
    ctx.arc(island.x, island.y, island.r, 0, 2 * Math.PI);
    ctx.fill();
  });
};
