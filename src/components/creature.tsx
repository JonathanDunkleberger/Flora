"use client";

import { lightenColor } from "@/lib/utils";

interface CreatureProps {
  stage: number;
  color: string;
  size?: number;
  happy?: boolean;
}

export function Creature({ stage, color, size = 64, happy = false }: CreatureProps) {
  const c = color || "#6366f1";
  const light = lightenColor(c, 60);
  const dark = lightenColor(c, -30);
  const uid = `cr-${c.replace("#", "")}-${stage}`;

  if (stage === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="36" rx="14" ry="18" fill={c} />
        <ellipse cx="32" cy="36" rx="14" ry="18" fill={`url(#${uid}-s)`} />
        <ellipse cx="28" cy="30" rx="4" ry="6" fill="white" opacity="0.2" transform="rotate(-15 28 30)" />
        <defs>
          <radialGradient id={`${uid}-s`} cx="0.4" cy="0.3">
            <stop offset="0" stopColor="white" stopOpacity="0.3" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  if (stage === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="40" rx="16" ry="14" fill={c} />
        <ellipse cx="32" cy="40" rx="16" ry="14" fill={`url(#${uid}-s)`} />
        <circle cx="27" cy="37" r="4" fill="white" />
        <circle cx="37" cy="37" r="4" fill="white" />
        <circle cx={happy ? 28 : 27} cy="37" r="2.2" fill="#1a1a2e" />
        <circle cx={happy ? 38 : 37} cy="37" r="2.2" fill="#1a1a2e" />
        <circle cx={happy ? 28.8 : 27.8} cy="36" r="0.8" fill="white" />
        <circle cx={happy ? 38.8 : 37.8} cy="36" r="0.8" fill="white" />
        {happy ? (
          <path d="M29 43 Q32 46 35 43" stroke="#1a1a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        ) : (
          <circle cx="32" cy="43" r="1.2" fill="#1a1a2e" />
        )}
        <path d="M18 34 L22 28 L26 34" fill={light} stroke="white" strokeWidth="0.5" />
        <path d="M38 34 L42 27 L46 34" fill={light} stroke="white" strokeWidth="0.5" />
        <defs>
          <radialGradient id={`${uid}-s`} cx="0.35" cy="0.3">
            <stop offset="0" stopColor="white" stopOpacity="0.25" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  if (stage === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="20" cy="22" rx="5" ry="7" fill={c} transform="rotate(-15 20 22)" />
        <ellipse cx="44" cy="22" rx="5" ry="7" fill={c} transform="rotate(15 44 22)" />
        <ellipse cx="20" cy="22" rx="3" ry="5" fill={light} transform="rotate(-15 20 22)" />
        <ellipse cx="44" cy="22" rx="3" ry="5" fill={light} transform="rotate(15 44 22)" />
        <ellipse cx="32" cy="38" rx="18" ry="17" fill={c} />
        <ellipse cx="32" cy="38" rx="18" ry="17" fill={`url(#${uid}-s)`} />
        <ellipse cx="32" cy="42" rx="10" ry="9" fill={light} opacity="0.4" />
        <circle cx="25" cy="34" r="5" fill="white" />
        <circle cx="39" cy="34" r="5" fill="white" />
        <circle cx={happy ? 26.5 : 25.5} cy="34" r="2.8" fill="#1a1a2e" />
        <circle cx={happy ? 40.5 : 39.5} cy="34" r="2.8" fill="#1a1a2e" />
        <circle cx={happy ? 27.2 : 26.2} cy="33" r="1" fill="white" />
        <circle cx={happy ? 41.2 : 40.2} cy="33" r="1" fill="white" />
        <circle cx="19" cy="39" r="3" fill={light} opacity="0.5" />
        <circle cx="45" cy="39" r="3" fill={light} opacity="0.5" />
        {happy ? (
          <path d="M27 41 Q32 46 37 41" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M29 42 Q32 44 35 42" stroke="#1a1a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        )}
        <defs>
          <radialGradient id={`${uid}-s`} cx="0.35" cy="0.3">
            <stop offset="0" stopColor="white" stopOpacity="0.2" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  if (stage === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="17" cy="16" rx="6" ry="9" fill={c} transform="rotate(-20 17 16)" />
        <ellipse cx="47" cy="16" rx="6" ry="9" fill={c} transform="rotate(20 47 16)" />
        <ellipse cx="17" cy="16" rx="3.5" ry="6" fill={light} transform="rotate(-20 17 16)" />
        <ellipse cx="47" cy="16" rx="3.5" ry="6" fill={light} transform="rotate(20 47 16)" />
        <ellipse cx="32" cy="36" rx="20" ry="20" fill={c} />
        <ellipse cx="32" cy="36" rx="20" ry="20" fill={`url(#${uid}-s)`} />
        <ellipse cx="32" cy="40" rx="12" ry="11" fill={light} opacity="0.35" />
        <ellipse cx="11" cy="36" rx="4" ry="6" fill={c} transform="rotate(15 11 36)" />
        <ellipse cx="53" cy="36" rx="4" ry="6" fill={c} transform="rotate(-15 53 36)" />
        <ellipse cx="24" cy="54" rx="6" ry="3.5" fill={dark} />
        <ellipse cx="40" cy="54" rx="6" ry="3.5" fill={dark} />
        <circle cx="24" cy="31" r="5.5" fill="white" />
        <circle cx="40" cy="31" r="5.5" fill="white" />
        <circle cx={happy ? 25.5 : 24.5} cy="31" r="3" fill="#1a1a2e" />
        <circle cx={happy ? 41.5 : 40.5} cy="31" r="3" fill="#1a1a2e" />
        <circle cx={happy ? 26.2 : 25.2} cy="29.8" r="1.1" fill="white" />
        <circle cx={happy ? 42.2 : 41.2} cy="29.8" r="1.1" fill="white" />
        <circle cx="16" cy="37" r="3.5" fill={light} opacity="0.45" />
        <circle cx="48" cy="37" r="3.5" fill={light} opacity="0.45" />
        {happy ? (
          <path d="M26 39 Q32 45 38 39" stroke="#1a1a2e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M28 39 Q32 42 36 39" stroke="#1a1a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        )}
        {happy && (
          <>
            <circle cx="8" cy="20" r="1.5" fill={c} opacity="0.6" />
            <circle cx="56" cy="24" r="1" fill={c} opacity="0.5" />
          </>
        )}
        <defs>
          <radialGradient id={`${uid}-s`} cx="0.35" cy="0.3">
            <stop offset="0" stopColor="white" stopOpacity="0.2" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  // Stage 4 - Fully evolved
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="34" r="28" fill={c} opacity="0.06" />
      <ellipse cx="15" cy="12" rx="7" ry="10" fill={c} transform="rotate(-20 15 12)" />
      <ellipse cx="49" cy="12" rx="7" ry="10" fill={c} transform="rotate(20 49 12)" />
      <ellipse cx="15" cy="12" rx="4" ry="7" fill={light} transform="rotate(-20 15 12)" />
      <ellipse cx="49" cy="12" rx="4" ry="7" fill={light} transform="rotate(20 49 12)" />
      <polygon points="32,2 34,8 30,8" fill={c} opacity="0.7" />
      <polygon points="26,5 28,10 24,10" fill={c} opacity="0.4" />
      <polygon points="38,5 40,10 36,10" fill={c} opacity="0.4" />
      <ellipse cx="32" cy="35" rx="21" ry="21" fill={c} />
      <ellipse cx="32" cy="35" rx="21" ry="21" fill={`url(#${uid}-s)`} />
      <ellipse cx="32" cy="39" rx="13" ry="12" fill={light} opacity="0.3" />
      <ellipse cx="10" cy="35" rx="5" ry="7" fill={c} transform="rotate(10 10 35)" />
      <ellipse cx="54" cy="35" rx="5" ry="7" fill={c} transform="rotate(-10 54 35)" />
      <ellipse cx="22" cy="54" rx="7" ry="4" fill={dark} />
      <ellipse cx="42" cy="54" rx="7" ry="4" fill={dark} />
      <circle cx="24" cy="30" r="6" fill="white" />
      <circle cx="40" cy="30" r="6" fill="white" />
      {happy ? (
        <>
          <path d="M24 27 L25 30 L28 30 L25.5 32 L26.5 35 L24 33 L21.5 35 L22.5 32 L20 30 L23 30 Z" fill="#1a1a2e" />
          <path d="M40 27 L41 30 L44 30 L41.5 32 L42.5 35 L40 33 L37.5 35 L38.5 32 L36 30 L39 30 Z" fill="#1a1a2e" />
        </>
      ) : (
        <>
          <circle cx="25" cy="30" r="3.2" fill="#1a1a2e" />
          <circle cx="41" cy="30" r="3.2" fill="#1a1a2e" />
          <circle cx="26" cy="28.8" r="1.2" fill="white" />
          <circle cx="42" cy="28.8" r="1.2" fill="white" />
        </>
      )}
      <circle cx="15" cy="36" r="4" fill={light} opacity="0.4" />
      <circle cx="49" cy="36" r="4" fill={light} opacity="0.4" />
      <path d="M26 39 Q32 46 38 39" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="6" cy="18" r="1.5" fill={c} opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="58" cy="22" r="1.2" fill={c} opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <defs>
        <radialGradient id={`${uid}-s`} cx="0.35" cy="0.3">
          <stop offset="0" stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
