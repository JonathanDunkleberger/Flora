"use client";

/**
 * Sprite-based shop items rendered on the planet surface.
 * Each item renders a pixel art sprite from the Sprout Lands pack.
 */

import { getShopSprite } from "@/lib/sprites";

interface PlanetItemProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale?: number;
}

// Display sizes for each item type
const ITEM_SIZES: Record<string, { w: number; h: number }> = {
  // Landscape
  pond: { w: 32, h: 24 },
  bridge: { w: 48, h: 28 },
  bench: { w: 32, h: 32 },
  fence: { w: 16, h: 28 },
  "stone-path": { w: 24, h: 16 },
  // Trees
  sakura: { w: 40, h: 48 },
  pine: { w: 32, h: 48 },
  willow: { w: 36, h: 48 },
  oak: { w: 40, h: 48 },
  // Flowers
  tulips: { w: 20, h: 20 },
  sunflowers: { w: 20, h: 20 },
  roses: { w: 20, h: 20 },
  lavender: { w: 20, h: 20 },
  // Decorations
  lantern: { w: 24, h: 28 },
  mushrooms: { w: 20, h: 20 },
  "rock-garden": { w: 28, h: 20 },
  birdhouse: { w: 24, h: 28 },
  // New items
  well: { w: 28, h: 28 },
  boat: { w: 36, h: 24 },
  sign: { w: 24, h: 28 },
  picnic: { w: 32, h: 32 },
  bush: { w: 24, h: 24 },
  stump: { w: 24, h: 20 },
  butterfly: { w: 16, h: 16 },
};

export function PlanetItem({ id, x, y, rotation, scale = 1 }: PlanetItemProps) {
  const sprite = getShopSprite(id);
  const dims = ITEM_SIZES[id] || { w: 24, h: 24 };
  const w = dims.w * scale;
  const h = dims.h * scale;

  if (!sprite) {
    // Fallback: small circle
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <circle cx="0" cy="-3" r="3" fill="#ccc" opacity="0.5" />
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <foreignObject
        x={-w / 2} y={-h}
        width={w} height={h}
        transform={`rotate(${-rotation})`}
        style={{ overflow: "visible" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sprite}
          alt={id}
          width={w}
          height={h}
          style={{
            imageRendering: "pixelated",
            display: "block",
          }}
          draggable={false}
        />
      </foreignObject>
    </g>
  );
}
