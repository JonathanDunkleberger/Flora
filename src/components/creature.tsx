"use client";

import { getCreatureColor, getCreatureSprite, CREATURE_SIZES } from "@/lib/sprites";

interface CreatureProps {
  stage: number;
  color: string;
  happy?: boolean;
  size?: number;
  bounce?: boolean;
}

export function Creature({ stage, color, happy = false, size, bounce = false }: CreatureProps) {
  const creatureColor = getCreatureColor(color);
  const spritePath = getCreatureSprite(stage, creatureColor);
  const displaySize = size || CREATURE_SIZES[stage] || 64;

  const wrapStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...(bounce ? { animation: "creatureBounce 0.5s cubic-bezier(0.34,1.56,0.64,1)" } : {}),
  };

  return (
    <div style={wrapStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spritePath}
        alt={`Stage ${stage} creature`}
        width={displaySize}
        height={displaySize}
        draggable={false}
        style={{
          imageRendering: "pixelated",
          display: "block",
          filter: happy ? "none" : "saturate(0.6) brightness(0.9)",
          transition: "filter 0.3s ease",
        }}
      />
    </div>
  );
}
