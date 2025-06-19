
export const drawDetailedMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Water bodies - more detailed Stockholm archipelago
  ctx.fillStyle = '#3b82f6'; // Deeper water color
  ctx.fillRect(0, 0, width, height);

  // Main islands and land areas
  const landAreas = [
    // Gamla Stan (Old Town)
    { x: width * 0.45, y: height * 0.48, w: width * 0.08, h: height * 0.06, type: 'island' },
    // Södermalm
    { x: width * 0.35, y: height * 0.55, w: width * 0.25, h: height * 0.15, type: 'main' },
    // Norrmalm & City
    { x: width * 0.4, y: height * 0.35, w: width * 0.2, h: height * 0.12, type: 'main' },
    // Östermalm
    { x: width * 0.55, y: height * 0.25, w: width * 0.18, h: height * 0.18, type: 'main' },
    // Djurgården
    { x: width * 0.65, y: height * 0.45, w: width * 0.15, h: height * 0.12, type: 'park' },
    // Vasastan
    { x: width * 0.35, y: height * 0.25, w: width * 0.15, h: height * 0.12, type: 'main' },
  ];

  landAreas.forEach(area => {
    if (area.type === 'park') {
      ctx.fillStyle = '#22c55e'; // Green for parks
    } else if (area.type === 'island') {
      ctx.fillStyle = '#f59e0b'; // Historic areas
    } else {
      ctx.fillStyle = '#e5e7eb'; // Regular land
    }
    
    // Rounded rectangles for more organic shapes
    ctx.beginPath();
    ctx.roundRect(area.x, area.y, area.w, area.h, 8);
    ctx.fill();
  });

  // Streets and major roads
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  
  // Major streets
  const streets = [
    // Horizontal streets
    { startX: width * 0.3, startY: height * 0.4, endX: width * 0.7, endY: height * 0.4 },
    { startX: width * 0.35, startY: height * 0.6, endX: width * 0.65, endY: height * 0.6 },
    // Vertical streets
    { startX: width * 0.5, startY: height * 0.2, endX: width * 0.5, endY: height * 0.7 },
    { startX: width * 0.42, startY: height * 0.3, endX: width * 0.42, endY: height * 0.65 },
  ];

  streets.forEach(street => {
    ctx.beginPath();
    ctx.moveTo(street.startX, street.startY);
    ctx.lineTo(street.endX, street.endY);
    ctx.stroke();
  });

  // Buildings - more realistic distribution
  ctx.fillStyle = '#4b5563';
  const buildings = [
    // Gamla Stan buildings
    { x: width * 0.46, y: height * 0.49, w: 12, h: 18 },
    { x: width * 0.48, y: height * 0.50, w: 10, h: 22 },
    { x: width * 0.50, y: height * 0.49, w: 14, h: 16 },
    
    // City center buildings
    { x: width * 0.42, y: height * 0.38, w: 20, h: 35 },
    { x: width * 0.45, y: height * 0.36, w: 25, h: 45 },
    { x: width * 0.48, y: height * 0.39, w: 18, h: 28 },
    { x: width * 0.52, y: height * 0.37, w: 22, h: 38 },
    { x: width * 0.55, y: height * 0.40, w: 16, h: 32 },
    
    // Södermalm buildings
    { x: width * 0.38, y: height * 0.58, w: 15, h: 25 },
    { x: width * 0.41, y: height * 0.60, w: 18, h: 30 },
    { x: width * 0.44, y: height * 0.57, w: 12, h: 20 },
    { x: width * 0.50, y: height * 0.59, w: 20, h: 28 },
    
    // Östermalm buildings
    { x: width * 0.58, y: height * 0.30, w: 16, h: 26 },
    { x: width * 0.61, y: height * 0.28, w: 14, h: 22 },
    { x: width * 0.64, y: height * 0.32, w: 18, h: 24 },
    { x: width * 0.67, y: height * 0.29, w: 20, h: 30 },
  ];
  
  buildings.forEach(building => {
    ctx.fillRect(building.x, building.y, building.w, building.h);
    
    // Add building details
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(building.x + 2, building.y + 2, building.w - 4, 3);
    ctx.fillStyle = '#4b5563';
  });

  // Bridges
  ctx.fillStyle = '#9ca3af';
  const bridges = [
    { x: width * 0.44, y: height * 0.46, w: width * 0.12, h: 4 },
    { x: width * 0.48, y: height * 0.53, w: width * 0.08, h: 3 },
  ];
  
  bridges.forEach(bridge => {
    ctx.fillRect(bridge.x, bridge.y, bridge.w, bridge.h);
  });
};
