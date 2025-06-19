
export const drawDetailedMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Clear canvas with Baltic Sea color
  ctx.fillStyle = '#1e40af'; // Deep blue for Baltic Sea
  ctx.fillRect(0, 0, width, height);

  // Stockholm's archipelago and main water bodies
  const waterBodies = [
    // Riddarfjärden (main bay)
    { x: width * 0.15, y: height * 0.45, w: width * 0.35, h: height * 0.15, type: 'bay' },
    // Strömmen (central waterway)
    { x: width * 0.45, y: height * 0.48, w: width * 0.15, h: height * 0.08, type: 'channel' },
    // Saltsjön (eastern waters)
    { x: width * 0.65, y: height * 0.35, w: width * 0.35, h: height * 0.4, type: 'sea' },
    // Årstaviken (southern bay)
    { x: width * 0.35, y: height * 0.7, w: width * 0.25, h: height * 0.15, type: 'bay' },
  ];

  waterBodies.forEach(water => {
    ctx.fillStyle = water.type === 'sea' ? '#1e40af' : '#2563eb';
    ctx.beginPath();
    ctx.roundRect(water.x, water.y, water.w, water.h, 12);
    ctx.fill();
  });

  // Stockholm's main islands and districts with accurate shapes
  const stockholmAreas = [
    // Gamla Stan (Old Town) - historic center
    {
      name: 'Gamla Stan',
      color: '#f59e0b',
      points: [
        { x: width * 0.475, y: height * 0.485 },
        { x: width * 0.525, y: height * 0.475 },
        { x: width * 0.535, y: height * 0.51 },
        { x: width * 0.52, y: height * 0.535 },
        { x: width * 0.47, y: height * 0.53 }
      ]
    },
    
    // Södermalm - bohemian southern island
    {
      name: 'Södermalm',
      color: '#e5e7eb',
      points: [
        { x: width * 0.32, y: height * 0.55 },
        { x: width * 0.68, y: height * 0.52 },
        { x: width * 0.7, y: height * 0.58 },
        { x: width * 0.68, y: height * 0.68 },
        { x: width * 0.35, y: height * 0.72 },
        { x: width * 0.28, y: height * 0.65 }
      ]
    },
    
    // Norrmalm - central business district
    {
      name: 'Norrmalm',
      color: '#6b7280',
      points: [
        { x: width * 0.4, y: height * 0.25 },
        { x: width * 0.62, y: height * 0.22 },
        { x: width * 0.65, y: height * 0.42 },
        { x: width * 0.48, y: height * 0.47 },
        { x: width * 0.35, y: height * 0.4 }
      ]
    },
    
    // Östermalm - upscale district
    {
      name: 'Östermalm',
      color: '#f3f4f6',
      points: [
        { x: width * 0.58, y: height * 0.18 },
        { x: width * 0.8, y: height * 0.15 },
        { x: width * 0.85, y: height * 0.32 },
        { x: width * 0.68, y: height * 0.38 },
        { x: width * 0.6, y: height * 0.25 }
      ]
    },
    
    // Djurgården - royal park island
    {
      name: 'Djurgården',
      color: '#22c55e',
      points: [
        { x: width * 0.65, y: height * 0.4 },
        { x: width * 0.88, y: height * 0.35 },
        { x: width * 0.92, y: height * 0.52 },
        { x: width * 0.72, y: height * 0.58 }
      ]
    },
    
    // Vasastan - northern residential area
    {
      name: 'Vasastan',
      color: '#f9fafb',
      points: [
        { x: width * 0.3, y: height * 0.12 },
        { x: width * 0.55, y: height * 0.1 },
        { x: width * 0.58, y: height * 0.25 },
        { x: width * 0.32, y: height * 0.28 }
      ]
    },
    
    // Kungsholmen - western island
    {
      name: 'Kungsholmen',
      color: '#f3f4f6',
      points: [
        { x: width * 0.15, y: height * 0.3 },
        { x: width * 0.32, y: height * 0.27 },
        { x: width * 0.35, y: height * 0.45 },
        { x: width * 0.18, y: height * 0.48 }
      ]
    },
    
    // Skeppsholmen - museum island
    {
      name: 'Skeppsholmen',
      color: '#dc2626',
      points: [
        { x: width * 0.54, y: height * 0.46 },
        { x: width * 0.58, y: height * 0.445 },
        { x: width * 0.585, y: height * 0.485 },
        { x: width * 0.545, y: height * 0.495 }
      ]
    }
  ];

  // Draw all areas
  stockholmAreas.forEach(area => {
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
    
    // Add borders
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Major bridges connecting the islands
  ctx.fillStyle = '#374151';
  const bridges = [
    // Centralbron
    { x: width * 0.44, y: height * 0.43, w: width * 0.08, h: 4 },
    // Västerbron
    { x: width * 0.25, y: height * 0.42, w: width * 0.15, h: 5 },
    // Djurgårdsbron
    { x: width * 0.6, y: height * 0.41, w: width * 0.08, h: 3 },
    // Slussenbron
    { x: width * 0.47, y: height * 0.52, w: width * 0.06, h: 3 },
    // Strömbron
    { x: width * 0.51, y: height * 0.47, w: width * 0.05, h: 3 },
  ];

  bridges.forEach(bridge => {
    ctx.fillRect(bridge.x, bridge.y, bridge.w, bridge.h);
  });

  // Iconic Stockholm landmarks
  const landmarks = [
    // Stockholm City Hall (Stadshuset)
    { x: width * 0.27, y: height * 0.37, w: 25, h: 35, type: 'cityhall' },
    // Royal Palace (Kungliga Slottet)
    { x: width * 0.495, y: height * 0.485, w: 20, h: 25, type: 'palace' },
    // Riddarholmen Church
    { x: width * 0.465, y: height * 0.515, w: 8, h: 30, type: 'church' },
    // Modern skyscrapers in Norrmalm
    { x: width * 0.45, y: height * 0.3, w: 15, h: 60, type: 'office' },
    { x: width * 0.48, y: height * 0.28, w: 18, h: 70, type: 'office' },
    // Globen Arena (south)
    { x: width * 0.5, y: height * 0.8, w: 20, h: 20, type: 'arena' },
  ];

  landmarks.forEach(building => {
    switch (building.type) {
      case 'cityhall':
        // Red brick City Hall with tower
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        // Tower
        ctx.fillRect(building.x + building.w - 8, building.y - 20, 6, 20);
        // Crown
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(building.x + building.w - 7, building.y - 23, 4, 3);
        break;
      case 'palace':
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        break;
      case 'church':
        ctx.fillStyle = '#059669';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        // Spire
        ctx.beginPath();
        ctx.moveTo(building.x + building.w/2, building.y - 10);
        ctx.lineTo(building.x + building.w/2 - 3, building.y);
        ctx.lineTo(building.x + building.w/2 + 3, building.y);
        ctx.closePath();
        ctx.fill();
        break;
      case 'office':
        ctx.fillStyle = '#374151';
        ctx.fillRect(building.x, building.y, building.w, building.h);
        break;
      case 'arena':
        ctx.fillStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.arc(building.x + building.w/2, building.y + building.h/2, building.w/2, 0, 2 * Math.PI);
        ctx.fill();
        break;
    }
    
    // Add windows to tall buildings
    if (building.type === 'office' && building.h > 40) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 5; i < building.h - 5; i += 8) {
        for (let j = 3; j < building.w - 3; j += 5) {
          ctx.fillRect(building.x + j, building.y + i, 2, 4);
        }
      }
    }
  });

  // Major streets and thoroughfares
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  
  const streets = [
    // Strandvägen
    { start: { x: width * 0.6, y: height * 0.3 }, end: { x: width * 0.78, y: height * 0.28 } },
    // Kungsgatan
    { start: { x: width * 0.35, y: height * 0.33 }, end: { x: width * 0.6, y: height * 0.31 } },
    // Götgatan
    { start: { x: width * 0.45, y: height * 0.56 }, end: { x: width * 0.6, y: height * 0.54 } },
    // Sveavägen
    { start: { x: width * 0.48, y: height * 0.18 }, end: { x: width * 0.5, y: height * 0.42 } },
    // Hornsgatan
    { start: { x: width * 0.32, y: height * 0.58 }, end: { x: width * 0.65, y: height * 0.56 } },
  ];

  streets.forEach(street => {
    ctx.beginPath();
    ctx.moveTo(street.start.x, street.start.y);
    ctx.lineTo(street.end.x, street.end.y);
    ctx.stroke();
  });

  // Parks and green spaces
  ctx.fillStyle = '#16a34a';
  const parks = [
    // Kungsträdgården
    { x: width * 0.52, y: height * 0.38, w: width * 0.04, h: height * 0.06 },
    // Humlegården
    { x: width * 0.6, y: height * 0.26, w: width * 0.06, h: height * 0.05 },
    // Tantolunden
    { x: width * 0.35, y: height * 0.68, w: width * 0.08, h: height * 0.04 },
    // Observatorielunden
    { x: width * 0.42, y: height * 0.22, w: width * 0.04, h: height * 0.03 },
  ];

  parks.forEach(park => {
    ctx.beginPath();
    ctx.roundRect(park.x, park.y, park.w, park.h, 4);
    ctx.fill();
  });
};
