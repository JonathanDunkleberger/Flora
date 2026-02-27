"use client";

import { getCreatureColor, getCreatureSprite, CREATURE_SIZES } from "@/lib/sprites";

interface CreatureProps {
  stage: number;
  color: string;
  happy?: boolean;
  size?: number;
  bounce?: boolean;
}

/**
 * Renders a SINGLE creature sprite at the given size.
 * Used on detail pages (hero treatment), gallery, breathing timer, etc.
 *
 * – ONE image, never multiples
 * – imageRendering: pixelated for crisp pixel art
 * – Idle float animation by default
 * – Colored glow behind creature when happy
 * – Bounce animation on interaction
 */
export function Creature({ stage, color, happy = false, size, bounce = false }: CreatureProps) {
  const creatureColor = getCreatureColor(color);
  const spritePath = getCreatureSprite(stage, creatureColor);
  const displaySize = size || CREATURE_SIZES[stage] || 64;

  return (
    <div style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: displaySize,
      height: displaySize,
    }}>
      {/* Colored glow behind creature */}
      <div style={{
        position: "absolute",
        inset: "-20%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}33 0%, ${color}11 40%, transparent 70%)`,
        opacity: happy ? 1 : 0.3,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }} />

      {/* Single creature sprite */}
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
          position: "relative",
          filter: happy ? "none" : "saturate(0.55) brightness(0.85)",
          transition: "filter 0.3s ease, opacity 0.2s ease",
          animation: bounce
            ? "creatureBounce 0.5s cubic-bezier(0.34,1.56,0.64,1)"
            : "creatureFloat 2.5s ease-in-out infinite",
        }}
      />

      {/* Sparkle effect for evolved creatures */}
      {stage >= 4 && happy && (
        <div style={{
          position: "absolute",
          inset: "-10%",
          pointerEvents: "none",
          animation: "creatureFloat 3s ease-in-out infinite reverse",
        }}>
          {[
            { top: "5%", left: "10%", delay: "0s" },
            { top: "15%", right: "8%", delay: "0.7s" },
            { bottom: "20%", left: "5%", delay: "1.4s" },
          ].map((pos, i) => (
            <div key={i} style={{
              position: "absolute",
              ...pos,
              width: 4,
              height: 4,
              background: "white",
              borderRadius: "50%",
              opacity: 0,
              animation: `sparkle 2s ease-in-out infinite`,
              animationDelay: pos.delay,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

