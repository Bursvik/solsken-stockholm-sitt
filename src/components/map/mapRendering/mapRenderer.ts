
export const drawDetailedMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Clear canvas with water color (Baltic Sea)
  ctx.fillStyle = '#1e40af'; // Deep blue water
  ctx.fillRect(0, 0, width, height);

  // Stockholm archipelago islands with accurate positioning
  const islands = [
    // Gamla Stan (Old Town) - historic center
    { x: width * 0.48, y: height * 0.50, w: width * 0.06, h: height * 0.04, type: 'historic', name: 'Gamla Stan' },
    
    // Södermalm - southern island
    { x: width * 0.35, y: height * 0.55, w: width * 0.28, h: height * 0.18, type: 'main', name: 'Södermalm' },
    
    // Norrmalm & City - business district
    { x: width * 0.42, y: height * 0.35, w: width * 0.18, h: height * 0.14, type: 'business', name: 'Norrmalm' },
    
    // Östermalm - upscale residential
    { x: width * 0.55, y: height * 0.25, w: width * 0.20, h: height * 0.20, type: 'residential', name: 'Östermalm' },
    
    // Djurgården - island park
    { x: width * 0.62, y: height * 0.45, w: width * 0.18, h: height * 0.15, type: 'park', name: 'Djurgården' },
    
    // Vasastan - northern district
    { x: width * 0.32, y: height * 0.22, w: width * 0.18, h: height * 0.16, type: 'residential', name: 'Vasastan' },
    
    // Kungsholmen - western island
    { x: width * 0.25, y: height * 0.35, w: width * 0.15, h: height * 0.12, type: 'mixed', name: 'Kungsholmen' },
    
    // Skeppsholmen - small museum island
    { x: width * 0.52, y: height * 0.48, w: width * 0.04, h: height * 0.03, type: 'museum', name: 'Skeppsholmen' },
  ];

  // Draw islands with different colors based on type
  islands.forEach(island => {
    let fillColor;
    switch (island.type) {
      case 'historic':
        fillColor = '#d97706'; // Amber for historic areas
        break;
      case 'business':
        fillColor = '#6b7280'; // Gray for business district
        break;
      case 'residential':
        fillColor = '#f3f4f6'; // Light gray for residential
        break;
      case 'park':
        fillColor = '#16a34a'; // Green for parks
        break;
      case 'museum':
        fillColor = '#dc2626'; // Red for cultural areas
        break;
      case 'mixed':
        fillColor = '#e5e7eb'; // Light gray for mixed use
        break;
      default:
        fillColor = '#e5e7eb';
    }
    
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.roundRect(island.x, island.y, island.w, island.h, 6);
    ctx.fill();
    
    // Add subtle border
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Major bridges connecting the islands
  ctx.fillStyle = '#6b7280';
  const bridges = [
    // Gamla Stan bridges
    { x: width * 0.44, y: height * 0.48, w: width * 0.04, h: 3, name: 'Riksbron' },
    { x: width * 0.48, y: height * 0.54, w: width * 0.04, h: 3, name: 'Slussenbron' },
    
    // Djurgården bridge
    { x: width * 0.58, y: height * 0.45, w: width * 0.04, h: 3, name: 'Djurgårdsbron' },
    
    // Västerbron
    { x: width * 0.28, y: height * 0.42, w: width * 0.08, h: 3, name: 'Västerbron' },
  ];

  bridges.forEach(bridge => {
    ctx.fillRect(bridge.x, bridge.y, bridge.w, bridge.h);
  });

  // Major streets and roads
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  
  const majorStreets = [
    // Strandvägen (waterfront boulevard)
    { startX: width * 0.55, startY: width * 0.35, endX: width * 0.72, endY: height * 0.35 },
    
    // Kungsgatan (main shopping street)
    { startX: width * 0.35, startY: height * 0.38, endX: width * 0.58, endY: height * 0.38 },
    
    // Götgatan (Södermalm main street)
    { startX: width * 0.42, startY: height * 0.58, endX: width * 0.55, endY: height * 0.58 },
    
    // Birger Jarlsgatan
    { startX: width * 0.52, startY: height * 0.28, endX: width * 0.52, endY: height * 0.48 },
  ];

  majorStreets.forEach(street => {
    ctx.beginPath();
    ctx.moveTo(street.startX, street.startY);
    ctx.lineTo(street.endX, street.endY);
    ctx.stroke();
  });

  // Detailed buildings - iconic Stockholm landmarks
  const landmarks = [
    // Royal Palace
    { x: width * 0.485, y: height * 0.50, w: 16, h: 20, type: 'palace' },
    
    // Stockholm City Hall
    { x: width * 0.28, y: height * 0.40, w: 18, h: 35, type: 'cityhall' },
    
    // Modern high-rises in business district
    { x: width * 0.45, y: height * 0.36, w: 12, h: 45, type: 'office' },
    { x: width * 0.48, y: height * 0.37, w: 14, h: 42, type: 'office' },
    { x: width * 0.51, y: height * 0.36, w: 10, h: 38, type: 'office' },
    
    // Residential buildings in Östermalm
    { x: width * 0.58, y: height * 0.30, w: 12, h: 25, type: 'residential' },
    { x: width * 0.61, y: height * 0.28, w: 14, h: 28, type: 'residential' },
    { x: width * 0.64, y: height * 0.32, w: 11, h: 22, type: 'residential' },
    
    // Buildings in Södermalm
    { x: width * 0.38, y: height * 0.58, w: 13, h: 24, type: 'mixed' },
    { x: width * 0.42, y: height * 0.60, w: 15, h: 26, type: 'mixed' },
    { x: width * 0.50, y: height * 0.59, w: 12, h: 20, type: 'mixed' },
  ];

  landmarks.forEach(building => {
    let fillColor;
    switch (building.type) {
      case 'palace':
        fillColor = '#fbbf24'; // Gold for royal buildings
        break;
      case 'cityhall':
        fillColor = '#dc2626'; // Red brick
        break;
      case 'office':
        fillColor = '#374151'; // Dark gray for modern offices
        break;
      case 'residential':
        fillColor = '#6b7280'; // Medium gray
        break;
      default:
        fillColor = '#4b5563';
    }
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(building.x, building.y, building.w, building.h);
    
    // Add building details (windows)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 2; i < building.h - 2; i += 4) {
      ctx.fillRect(building.x + 2, building.y + i, building.w - 4, 2);
    }
  });

  // Parks and green spaces
  ctx.fillStyle = '#22c55e';
  const parks = [
    // Kungsträdgården
    { x: width * 0.49, y: height * 0.42, w: width * 0.04, h: height * 0.03 },
    
    // Humlegården
    { x: width * 0.56, y: height * 0.32, w: width * 0.05, h: height * 0.04 },
    
    // Djurgården forests
    { x: width * 0.65, y: height * 0.47, w: width * 0.12, h: height * 0.10 },
  ];

  parks.forEach(park => {
    ctx.beginPath();
    ctx.roundRect(park.x, park.y, park.w, park.h, 4);
    ctx.fill();
  });

  // Water details - smaller channels and inlets
  ctx.fillStyle = '#3b82f6';
  const waterways = [
    // Strömmen (the stream between islands)
    { x: width * 0.48, y: height * 0.45, w: width * 0.08, h: height * 0.02 },
    
    // Saltsjön inlet
    { x: width * 0.75, y: height * 0.40, w: width * 0.25, h: height * 0.30 },
  ];

  waterways.forEach(water => {
    ctx.fillRect(water.x, water.y, water.w, water.h);
  });
};
