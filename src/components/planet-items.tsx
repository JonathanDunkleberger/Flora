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

// Display sizes for each item type — 60-80% of creature sizes
// Trees/large: 40-56px, Small decorations: 24-32px
const ITEM_SIZES: Record<string, { w: number; h: number }> = {
  // Landscape
  pond: { w: 40, h: 28 },
  bridge: { w: 48, h: 32 },
  bench: { w: 36, h: 36 },
  fence: { w: 20, h: 36 },
  "stone-path": { w: 28, h: 20 },
  // Trees — large decorations
  sakura: { w: 48, h: 56 },
  pine: { w: 40, h: 56 },
  willow: { w: 44, h: 56 },
  oak: { w: 48, h: 56 },
  // Flowers — small decorations
  tulips: { w: 28, h: 28 },
  sunflowers: { w: 28, h: 28 },
  roses: { w: 28, h: 28 },
  lavender: { w: 28, h: 28 },
  // Decorations — small
  lantern: { w: 28, h: 36 },
  mushrooms: { w: 28, h: 28 },
  "rock-garden": { w: 36, h: 24 },
  birdhouse: { w: 28, h: 36 },
  // Extra items
  well: { w: 36, h: 36 },
  boat: { w: 44, h: 28 },
  sign: { w: 28, h: 36 },
  picnic: { w: 36, h: 36 },
  bush: { w: 32, h: 32 },
  stump: { w: 28, h: 24 },
  butterfly: { w: 20, h: 20 },
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
            objectFit: "contain",
            display: "block",
          }}
          draggable={false}
        />
      </foreignObject>
    </g>
  );
}
