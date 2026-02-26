"use client";

// Renders isometric ground tiles for the garden
// 5x5 diamond grid that changes color based on garden health

interface GardenGroundProps {
  groundColor: string;
  healthLevel: number;
}

export function GardenGround({ groundColor, healthLevel }: GardenGroundProps) {
  const TILE_W = 70;
  const TILE_H = 40;
  const GRID_SIZE = 5;
  const CENTER_X = 180;
  const CENTER_Y = 80;

  const tiles = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = CENTER_X + (col - row) * (TILE_W / 2);
      const y = CENTER_Y + (col + row) * (TILE_H / 2);

      // Slight color variation per tile
      const lightness = ((row + col) % 3) * 3;
      tiles.push(
        <g key={`${row}-${col}`}>
          {/* Diamond tile */}
          <polygon
            points={`${x},${y - TILE_H / 2} ${x + TILE_W / 2},${y} ${x},${y + TILE_H / 2} ${x - TILE_W / 2},${y}`}
            fill={groundColor}
            stroke={groundColor}
            strokeWidth="0.5"
            opacity={0.85 + lightness * 0.02}
          />
          {/* Tile edge (bottom faces for depth) */}
          <polygon
            points={`${x},${y + TILE_H / 2} ${x + TILE_W / 2},${y} ${x + TILE_W / 2},${y + 4} ${x},${y + TILE_H / 2 + 4}`}
            fill={groundColor}
            opacity={0.6}
          />
          <polygon
            points={`${x},${y + TILE_H / 2} ${x - TILE_W / 2},${y} ${x - TILE_W / 2},${y + 4} ${x},${y + TILE_H / 2 + 4}`}
            fill={groundColor}
            opacity={0.5}
          />

          {/* Grass patches for health >= 1 */}
          {healthLevel >= 1 && (row + col) % 2 === 0 && (
            <circle cx={x} cy={y} r="2" fill="#8BC34A" opacity="0.4" />
          )}

          {/* Flowers for health >= 2 */}
          {healthLevel >= 2 && (row + col) % 4 === 0 && row > 0 && col > 0 && (
            <>
              <circle cx={x - 8} cy={y - 2} r="1.5" fill="#FFB74D" opacity="0.6" />
              <circle cx={x + 6} cy={y + 3} r="1.5" fill="#F48FB1" opacity="0.6" />
            </>
          )}
        </g>
      );
    }
  }

  return <g>{tiles}</g>;
}
