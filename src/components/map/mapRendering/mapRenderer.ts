
export const drawDetailedMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Clear canvas with water color (Baltic Sea and Lake Mälaren)
  ctx.fillStyle = '#2563eb'; // Stockholm water blue
  ctx.fillRect(0, 0, width, height);

  // Stockholm's main islands and districts with realistic shapes
  const stockholmFeatures = [
    // Gamla Stan (Old Town) - triangular historic island
    {
      type: 'island',
      color: '#d97706',
      points: [
        { x: width * 0.485, y: height * 0.50 },
        { x: width * 0.515, y: height * 0.48 },
        { x: width * 0.520, y: height * 0.52 },
        { x: width * 0.475, y: height * 0.525 }
      ]
    },
    
    // Södermalm - large southern island with irregular coastline
    {
      type: 'island',
      color: '#f3f4f6',
      points: [
        { x: width * 0.35, y: height * 0.55 },
        { x: width * 0.63, y: height * 0.52 },
        { x: width * 0.65, y: height * 0.58 },
        { x: width * 0.62, y: height * 0.68 },
        { x: width * 0.38, y: height * 0.72 },
        { x: width * 0.32, y: height * 0.65 }
      ]
    },
    
    // Norrmalm - business district (mainland)
    {
      type: 'mainland',
      color: '#6b7280',
      points: [
        { x: width * 0.42, y: height * 0.25 },
        { x: width * 0.60, y: height * 0.22 },
        { x: width * 0.62, y: height * 0.45 },
        { x: width * 0.48, y: height * 0.48 },
        { x: width * 0.38, y: height * 0.42 }
      ]
    },
    
    // Östermalm - upscale residential area
    {
      type: 'mainland',
      color: '#e5e7eb',
      points: [
        { x: width * 0.55, y: height * 0.18 },
        { x: width * 0.78, y: height * 0.15 },
        { x: width * 0.82, y: height * 0.35 },
        { x: width * 0.65, y: height * 0.42 },
        { x: width * 0.58, y: height * 0.25 }
      ]
    },
    
    // Djurgården - royal island park
    {
      type: 'park',
      color: '#16a34a',
      points: [
        { x: width * 0.62, y: height * 0.42 },
        { x: width * 0.85, y: height * 0.38 },
        { x: width * 0.88, y: height * 0.55 },
        { x: width * 0.68, y: height * 0.58 }
      ]
    },
    
    // Vasastan - northern residential district
    {
      type: 'residential',
      color: '#f9fafb',
      points: [
        { x: width * 0.32, y: height * 0.15 },
        { x: width * 0.52, y: height * 0.12 },
        { x: width * 0.55, y: height * 0.28 },
        { x: width * 0.35, y: height * 0.32 }
      ]
    },
    
    // Kungsholmen - western island
    {
      type: 'island',
      color: '#f3f4f6',
      points: [
        { x: width * 0.18, y: height * 0.32 },
        { x: width * 0.35, y: height * 0.28 },
        { x: width * 0.38, y: height * 0.48 },
        { x: width * 0.22, y: height * 0.52 }
      ]
    },
    
    // Skeppsholmen - small museum island
    {
      type: 'museum',
      color: '#dc2626',
      points: [
        { x: width * 0.52, y: height * 0.47 },
        { x: width * 0.56, y: height * 0.46 },
        { x: width * 0.57, y: height * 0.50 },
        { x: width * 0.53, y: height * 0.51 }
      ]
    }
  ];

  // Draw all Stockholm features
  stockholmFeatures.forEach(feature => {
    ctx.fillStyle = feature.color;
    ctx.beginPath();
    ctx.moveTo(feature.points[0].x, feature.points[0].y);
    
    feature.points.forEach((point, index) => {
      if (index > 0) {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.closePath();
    ctx.fill();
    
    // Add subtle borders
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Stockholm's famous bridges
  ctx.fillStyle = '#4b5563';
  const bridges = [
    // Centralbron (Central Bridge)
    { x: width * 0.44, y: height * 0.43, w: width * 0.08, h: 4, angle: 0.3 },
    
    // Västerbron (West Bridge) - iconic arch bridge
    { x: width * 0.28, y: height * 0.42, w: width * 0.12, h: 5, angle: 0.1 },
    
    // Djurgårdsbron (Djurgården Bridge)
    { x: width * 0.58, y: height * 0.42, w: width * 0.06, h: 3, angle: -0.2 },
    
    // Slussenbron (Slusen Bridge)
    { x: width * 0.48, y: height * 0.52, w: width * 0.05, h: 3, angle: 0 }
  ];

  bridges.forEach(bridge => {
    ctx.save();
    ctx.translate(bridge.x + bridge.w/2, bridge.y + bridge.h/2);
    ctx.rotate(bridge.angle);
    ctx.fillRect(-bridge.w/2, -bridge.h/2, bridge.w, bridge.h);
    ctx.restore();
  });

  // Major waterways and channels
  ctx.fillStyle = '#1d4ed8';
  const waterChannels = [
    // Strömmen (the main channel)
    { x: width * 0.45, y: height * 0.44, w: width * 0.12, h: width * 0.03 },
    
    // Riddarfjärden (bay west of Gamla Stan)
    { x: width * 0.25, y: height * 0.48, w: width * 0.18, h: width * 0.06 },
    
    // Saltsjön (eastern water)
    { x: width * 0.75, y: height * 0.35, w: width * 0.25, h: height * 0.35 }
  ];

  waterChannels.forEach(channel => {
    ctx.beginPath();
    ctx.roundRect(channel.x, channel.y, channel.w, channel.h, 8);
    ctx.fill();
  });

  // Stockholm's iconic buildings and landmarks
  const landmarks = [
    // Stockholm City Hall with tower
    { x: width * 0.28, y: height * 0.38, w: 20, h: 45, type: 'cityhall', tower: true },
    
    // Royal Palace
    { x: width * 0.49, y: height * 0.49, w: 18, h: 25, type: 'palace' },
    
    // Riddarholmen Church spire
    { x: width * 0.47, y: height * 0.52, w: 8, h: 35, type: 'church' },
    
    // Modern skyscrapers in business district
    { x: width * 0.45, y: height * 0.32, w: 12, h: 50, type: 'office' },
    { x: width * 0.48, y: height * 0.30, w: 14, h: 55, type: 'office' },
    { x: width * 0.52, y: height * 0.33, w: 10, h: 42, type: 'office' },
    
    // Östermalm residential buildings
    { x: width * 0.62, y: height * 0.25, w: 15, h: 30, type: 'residential' },
    { x: width * 0.66, y: height * 0.22, w: 12, h: 28, type: 'residential' },
    
    // Södermalm mixed buildings
    { x: width * 0.42, y: height * 0.62, w: 13, h: 25, type: 'mixed' },
    { x: width * 0.48, y: height * 0.60, w: 11, h: 22, type: 'mixed' },
    { x: width * 0.54, y: height * 0.58, w: 14, h: 28, type: 'mixed' }
  ];

  landmarks.forEach(building => {
    let fillColor;
    switch (building.type) {
      case 'cityhall':
        fillColor = '#dc2626'; // Red brick
        break;
      case 'palace':
        fillColor = '#fbbf24'; // Royal gold
        break;
      case 'church':
        fillColor = '#059669'; // Traditional green copper
        break;
      case 'office':
        fillColor = '#374151'; // Modern glass/steel
        break;
      case 'residential':
        fillColor = '#6b7280'; // Classic Stockholm gray
        break;
      default:
        fillColor = '#4b5563';
    }
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(building.x, building.y, building.w, building.h);
    
    // Add tower for City Hall
    if (building.tower) {
      ctx.fillRect(building.x + building.w - 8, building.y - 15, 6, 15);
      // Crown on top
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(building.x + building.w - 7, building.y - 18, 4, 3);
    }
    
    // Add windows to buildings
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 3; i < building.h - 3; i += 5) {
      for (let j = 2; j < building.w - 2; j += 4) {
        ctx.fillRect(building.x + j, building.y + i, 2, 3);
      }
    }
  });

  // Parks and green spaces
  ctx.fillStyle = '#22c55e';
  const parks = [
    // Kungsträdgården (King's Garden)
    { x: width * 0.50, y: width * 0.40, w: width * 0.04, h: height * 0.04 },
    
    // Humlegården
    { x: width * 0.58, y: height * 0.28, w: width * 0.06, h: height * 0.05 },
    
    // Large parts of Djurgården (already drawn as park area)
    
    // Tanto (southern park)
    { x: width * 0.38, y: height * 0.68, w: width * 0.08, h: height * 0.04 }
  ];

  parks.forEach(park => {
    ctx.beginPath();
    ctx.roundRect(park.x, park.y, park.w, park.h, 6);
    ctx.fill();
    
    // Add tree symbols
    ctx.fillStyle = '#15803d';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(park.x + (park.w * (i + 1) / 4), park.y + park.h/2, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  // Add street network
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  
  const majorStreets = [
    // Strandvägen (waterfront boulevard)
    { start: { x: width * 0.58, y: height * 0.32 }, end: { x: width * 0.75, y: height * 0.30 } },
    
    // Kungsgatan (main shopping street)
    { start: { x: width * 0.38, y: height * 0.35 }, end: { x: width * 0.58, y: height * 0.33 } },
    
    // Götgatan (Södermalm main street)
    { start: { x: width * 0.45, y: height * 0.58 }, end: { x: width * 0.58, y: height * 0.55 } },
    
    // Sveavägen (major north-south street)
    { start: { x: width * 0.48, y: height * 0.20 }, end: { x: width * 0.50, y: height * 0.45 } }
  ];

  majorStreets.forEach(street => {
    ctx.beginPath();
    ctx.moveTo(street.start.x, street.start.y);
    ctx.lineTo(street.end.x, street.end.y);
    ctx.stroke();
  });
};
