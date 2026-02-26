"use client";

import { motion } from "framer-motion";

interface GardenAmbienceProps {
  type: string;
  healthLevel: number;
}

export function GardenAmbience({ type, healthLevel }: GardenAmbienceProps) {
  if (type === "none") return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {/* Subtle floating particles for all levels >= 1 */}
      {healthLevel >= 1 && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-bloom-300 rounded-full opacity-30"
              style={{ left: `${15 + i * 18}%`, top: `${30 + (i % 3) * 20}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}
        </>
      )}

      {/* Butterflies for health >= 2 */}
      {(type === "butterflies" || type === "fireflies" || type === "magical") && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`butterfly-${i}`}
              className="absolute text-sm select-none"
              style={{ left: `${20 + i * 25}%`, top: `${25 + i * 15}%` }}
              animate={{
                x: [0, 30, -20, 10, 0],
                y: [0, -15, 5, -25, 0],
              }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🦋
            </motion.div>
          ))}
        </>
      )}

      {/* Fireflies for health >= 3 */}
      {(type === "fireflies" || type === "magical") && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`firefly-${i}`}
              className="absolute w-1.5 h-1.5 bg-garden-gold rounded-full"
              style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 4) * 18}%` }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </>
      )}

      {/* Golden light overlay for health >= 3 */}
      {healthLevel >= 3 && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/10 to-transparent" />
      )}

      {/* Magical particles for health 4 */}
      {type === "magical" && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`magic-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{ left: `${5 + i * 8}%`, top: `${15 + (i % 5) * 16}%` }}
              animate={{
                y: [0, -40],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </>
      )}
    </div>
  );
}
